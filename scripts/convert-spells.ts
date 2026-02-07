import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// ============================================================
// Configuration: CSV column mapping
// ============================================================

const CSV_PATH = path.resolve(__dirname, '../src/data/spells/The Spell Codex - The Spell Codex.csv');
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/spells/all-spells.generated.ts');

// Class columns in CSV order (columns 22-48, zero-indexed)
const CLASS_COLUMNS: [string, string][] = [
  ['Arcanist', 'Arcanist'],
  ['Wizard', 'Wizard'],
  ['Sorcerer', 'Sorcerer'],
  ['Witch', 'Witch'],
  ['Magus', 'Magus'],
  ['Bard', 'Bard'],
  ['Skald', 'Skald'],
  ['Summoner', 'Summoner'],
  ['UnSummoner', 'UnSummoner'],
  ['Bloodrager', 'Bloodrager'],
  ['Shaman', 'Shaman'],
  ['Druid', 'Druid'],
  ['Hunter', 'Hunter'],
  ['Ranger', 'Ranger'],
  ['Cleric', 'Cleric'],
  ['Oracle', 'Oracle'],
  ['Warpriest', 'Warpriest'],
  ['Inquisitor', 'Inquisitor'],
  ['Antipaladin', 'Antipaladin'],
  ['Paladin', 'Paladin'],
  ['Alchemist', 'Alchemist'],
  ['Investigator', 'Investigator'],
  ['Psychic', 'Psychic'],
  ['Mesmerist', 'Mesmerist'],
  ['Occultist', 'Occultist'],
  ['Spiritualist', 'Spiritualist'],
  ['Medium', 'Medium'],
];

// Descriptor columns in CSV (column headers -> SpellDescriptor values)
const DESCRIPTOR_COLUMNS: [string, string][] = [
  ['[Acid]', 'Acid'],
  ['[Air]', 'Air'],
  ['[Chaotic]', 'Chaotic'],
  ['[Cold]', 'Cold'],
  ['[Curse]', 'Curse'],
  ['[Darkness]', 'Darkness'],
  ['[Death]', 'Death'],
  ['[Disease]', 'Disease'],
  ['[Draconic]', 'Draconic'],
  ['[Earth]', 'Earth'],
  ['[Electricity]', 'Electricity'],
  ['[Emotion]', 'Emotion'],
  ['[Evil]', 'Evil'],
  ['[Fear]', 'Fear'],
  ['[Fire]', 'Fire'],
  ['[Force]', 'Force'],
  ['[Good]', 'Good'],
  ['[Language-Dependent]', 'Language-Dependent'],
  ['[Lawful]', 'Lawful'],
  ['[Light]', 'Light'],
  ['[Meditative]', 'Meditative'],
  ['[Mind-Affecting]', 'Mind-Affecting'],
  ['[Pain]', 'Pain'],
  ['[Poison]', 'Poison'],
  ['[Ruse]', 'Ruse'],
  ['[Shadow]', 'Shadow'],
  ['[Sonic]', 'Sonic'],
  ['[Water]', 'Water'],
];

// Valid spell schools
const VALID_SCHOOLS = new Set([
  'abjuration', 'conjuration', 'divination', 'enchantment',
  'evocation', 'illusion', 'necromancy', 'transmutation', 'universal',
]);

// Valid subschools
const VALID_SUBSCHOOLS = new Set([
  'calling', 'charm', 'compulsion', 'creation', 'figment', 'glamer',
  'haunted', 'healing', 'pattern', 'phantasm', 'polymorph', 'scrying',
  'shadow', 'summoning', 'teleportation',
]);

// ============================================================
// Helper functions
// ============================================================

const DASH = '—'; // em-dash used in CSV for empty values

function isEmpty(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return trimmed === '' || trimmed === DASH || trimmed === '-' || trimmed === '—';
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function parseSchool(raw: string): string | null {
  const lower = raw.trim().toLowerCase();
  if (VALID_SCHOOLS.has(lower)) {
    return titleCase(lower);
  }
  return null;
}

function parseSubschool(raw: string): { value: string; isKnown: boolean } | null {
  if (isEmpty(raw)) return null;
  const trimmed = raw.trim().toLowerCase();
  // Handle comma-separated subschools (e.g., "creation, calling") - take first
  const first = trimmed.includes(',') ? trimmed.split(',')[0].trim() : trimmed;
  const isKnown = VALID_SUBSCHOOLS.has(first);
  return { value: titleCase(first), isKnown };
}

function parseSpellLevel(val: string): number | null {
  if (isEmpty(val)) return null;
  const num = parseInt(val.trim(), 10);
  if (isNaN(num) || num < 0 || num > 9) return null;
  return num;
}

function buildComponentsString(v: boolean, s: boolean, m: boolean, f: boolean, df: boolean, costGp?: number): string {
  const parts: string[] = [];
  if (v) parts.push('V');
  if (s) parts.push('S');
  if (m) parts.push('M');
  if (f) parts.push('F');
  if (df) parts.push('DF');
  let str = parts.join(', ');
  if (costGp && costGp > 0) {
    str += ` (${costGp.toLocaleString()} gp)`;
  }
  return str || 'none';
}

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function parseCostValue(val: string): number | undefined {
  if (isEmpty(val)) return undefined;
  const cleaned = val.replace(/[,\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

// ============================================================
// Main conversion
// ============================================================

interface SpellRecord {
  name: string;
  description: string;
  rating?: number;
  school: string;
  subschool?: string;
  castingTime: string;
  range: string;
  area?: string;
  effect?: string;
  targets?: string;
  duration: string;
  savingThrow: string | null;
  spellResistance: boolean;
  source: string;
  dismissible?: boolean;
  shapeable?: boolean;
  components: string;
  componentDetails: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    focus: boolean;
    divineFocus: boolean;
    costGp?: number;
  };
  level: Record<string, number>;
  descriptors: string[];
  permanency?: {
    possible: boolean;
    casterLevel?: number;
    costGp?: number;
  };
  deity?: string;
  race?: string;
  domain?: string;
  bloodline?: string;
  patron?: string;
  mythicText?: string;
  augmented?: string;
  slaLevel?: number;
}

function convertRow(row: Record<string, string>, rowIndex: number, warnings: string[]): SpellRecord | null {
  // Get the spell name from the first column
  // The header is "Spell Name\n& AoN Hyperlink"
  const nameKey = Object.keys(row)[0];
  const rawName = row[nameKey]?.trim();
  if (!rawName || isEmpty(rawName)) {
    warnings.push(`Row ${rowIndex}: Empty spell name, skipping`);
    return null;
  }

  // Parse school
  const rawSchool = row['School'] || '';
  const school = parseSchool(rawSchool);
  if (!school) {
    warnings.push(`Row ${rowIndex} (${rawName}): Unknown school '${rawSchool}', skipping`);
    return null;
  }

  // Parse subschool
  const rawSubschool = row['Subschool'] || '';
  let subschool: string | undefined;
  if (!isEmpty(rawSubschool)) {
    const parsed = parseSubschool(rawSubschool);
    if (parsed) {
      subschool = parsed.value;
      if (!parsed.isKnown) {
        warnings.push(`Row ${rowIndex} (${rawName}): Unknown subschool '${rawSubschool}'`);
      }
    }
  }

  // Parse description
  const description = (row['Description'] || '').trim();

  // Parse rating
  const rawRating = row['Rating'] || '';
  let rating: number | undefined;
  if (!isEmpty(rawRating)) {
    const parsed = parseInt(rawRating.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
      rating = parsed;
    }
  }

  // Basic fields
  const castingTime = (row['Casting Time'] || '').trim();
  const range = (row['Range'] || '').trim();
  const area = isEmpty(row['Area']) ? undefined : row['Area'].trim();
  const effect = isEmpty(row['Effect']) ? undefined : row['Effect'].trim();
  const targets = isEmpty(row['Targets']) ? undefined : row['Targets'].trim();
  const duration = (row['Duration'] || '').trim();

  // Saving throw
  const rawSave = (row['Saving Throw'] || '').trim();
  const savingThrow = isEmpty(rawSave) || rawSave.toLowerCase() === 'none' ? null : rawSave;

  // Spell resistance
  const rawSR = (row['Spell Resistance'] || '').trim().toLowerCase();
  const spellResistance = rawSR === 'yes' || rawSR.startsWith('yes');

  // Source
  const source = (row['Sourcebook'] || '').trim();

  // Dismissible / Shapeable
  const dismissible = row['Dismissible']?.trim() === '1' ? true : undefined;
  const shapeable = row['Shapeable']?.trim() === '1' ? true : undefined;

  // Components
  const verbal = row['Verbal']?.trim() === '1';
  const somatic = row['Somatic']?.trim() === '1';
  const material = row['Material']?.trim() === '1';
  const focus = row['Focus']?.trim() === '1';
  const divineFocus = row['Divine Focus']?.trim() === '1';
  const costGp = parseCostValue(row['Component Costs'] || '');

  const components = buildComponentsString(verbal, somatic, material, focus, divineFocus, costGp);
  const componentDetails = {
    verbal,
    somatic,
    material,
    focus,
    divineFocus,
    ...(costGp !== undefined ? { costGp } : {}),
  };

  // Class levels
  const level: Record<string, number> = {};
  for (const [csvCol, className] of CLASS_COLUMNS) {
    const val = row[csvCol];
    const parsed = parseSpellLevel(val);
    if (parsed !== null) {
      level[className] = parsed;
    }
  }

  // Descriptors
  const descriptors: string[] = [];
  for (const [csvCol, descriptorName] of DESCRIPTOR_COLUMNS) {
    if (row[csvCol]?.trim() === '1') {
      descriptors.push(descriptorName);
    }
  }

  // Permanency
  let permanency: SpellRecord['permanency'] | undefined;
  const rawPerm = row['Permanency?'] || '';
  if (!isEmpty(rawPerm)) {
    const permCL = parseCostValue(row['Permanency CL'] || '');
    const permCost = parseCostValue(row['Permanency Cost'] || '');
    permanency = {
      possible: true,
      ...(permCL !== undefined ? { casterLevel: permCL } : {}),
      ...(permCost !== undefined ? { costGp: permCost } : {}),
    };
  }

  // Metadata fields
  const deity = isEmpty(row['Deity']) ? undefined : row['Deity'].trim();
  const race = isEmpty(row['Race']) ? undefined : row['Race'].trim();
  const domain = isEmpty(row['Domain']) ? undefined : row['Domain'].trim();
  const bloodline = isEmpty(row['Bloodline']) ? undefined : row['Bloodline'].trim();
  const patron = isEmpty(row['Patron']) ? undefined : row['Patron'].trim();
  const mythicText = isEmpty(row['Mythic Text']) ? undefined : row['Mythic Text'].trim();
  const augmented = isEmpty(row['Augmented']) ? undefined : row['Augmented'].trim();

  // SLA Level
  let slaLevel: number | undefined;
  const rawSLA = row['SLA Level'] || '';
  if (!isEmpty(rawSLA)) {
    const parsed = parseInt(rawSLA.trim(), 10);
    if (!isNaN(parsed)) slaLevel = parsed;
  }

  return {
    name: rawName,
    description,
    ...(rating !== undefined ? { rating } : {}),
    school,
    ...(subschool ? { subschool } : {}),
    castingTime,
    range,
    ...(area ? { area } : {}),
    ...(effect ? { effect } : {}),
    ...(targets ? { targets } : {}),
    duration,
    savingThrow,
    spellResistance,
    source,
    ...(dismissible ? { dismissible } : {}),
    ...(shapeable ? { shapeable } : {}),
    components,
    componentDetails,
    level,
    descriptors,
    ...(permanency ? { permanency } : {}),
    ...(deity ? { deity } : {}),
    ...(race ? { race } : {}),
    ...(domain ? { domain } : {}),
    ...(bloodline ? { bloodline } : {}),
    ...(patron ? { patron } : {}),
    ...(mythicText ? { mythicText } : {}),
    ...(augmented ? { augmented } : {}),
    ...(slaLevel !== undefined ? { slaLevel } : {}),
  };
}

function spellToTypeScript(spell: SpellRecord, indent: string = '  '): string {
  const lines: string[] = [];
  lines.push(`${indent}{`);
  lines.push(`${indent}  name: '${escapeString(spell.name)}',`);
  lines.push(`${indent}  school: '${spell.school}',`);
  if (spell.subschool) {
    lines.push(`${indent}  subschool: '${spell.subschool}',`);
  }
  if (spell.descriptors.length > 0) {
    lines.push(`${indent}  descriptors: [${spell.descriptors.map(d => `'${d}'`).join(', ')}],`);
  }

  // Level record
  const levelEntries = Object.entries(spell.level)
    .map(([cls, lvl]) => `${cls}: ${lvl}`)
    .join(', ');
  lines.push(`${indent}  level: { ${levelEntries} },`);

  lines.push(`${indent}  castingTime: '${escapeString(spell.castingTime)}',`);
  lines.push(`${indent}  components: '${escapeString(spell.components)}',`);

  // Component details
  const cd = spell.componentDetails;
  const cdParts = [
    `verbal: ${cd.verbal}`,
    `somatic: ${cd.somatic}`,
    `material: ${cd.material}`,
    `focus: ${cd.focus}`,
    `divineFocus: ${cd.divineFocus}`,
  ];
  if (cd.costGp !== undefined) {
    cdParts.push(`costGp: ${cd.costGp}`);
  }
  lines.push(`${indent}  componentDetails: { ${cdParts.join(', ')} },`);

  lines.push(`${indent}  range: '${escapeString(spell.range)}',`);
  if (spell.area) lines.push(`${indent}  area: '${escapeString(spell.area)}',`);
  if (spell.effect) lines.push(`${indent}  effect: '${escapeString(spell.effect)}',`);
  if (spell.targets) lines.push(`${indent}  targets: '${escapeString(spell.targets)}',`);
  lines.push(`${indent}  duration: '${escapeString(spell.duration)}',`);

  if (spell.savingThrow === null) {
    lines.push(`${indent}  savingThrow: null,`);
  } else {
    lines.push(`${indent}  savingThrow: '${escapeString(spell.savingThrow)}',`);
  }
  lines.push(`${indent}  spellResistance: ${spell.spellResistance},`);
  lines.push(`${indent}  description: '${escapeString(spell.description)}',`);
  lines.push(`${indent}  source: '${escapeString(spell.source)}',`);

  // Optional fields
  if (spell.rating !== undefined) lines.push(`${indent}  rating: ${spell.rating},`);
  if (spell.dismissible) lines.push(`${indent}  dismissible: true,`);
  if (spell.shapeable) lines.push(`${indent}  shapeable: true,`);

  if (spell.permanency) {
    const permParts = ['possible: true'];
    if (spell.permanency.casterLevel !== undefined) permParts.push(`casterLevel: ${spell.permanency.casterLevel}`);
    if (spell.permanency.costGp !== undefined) permParts.push(`costGp: ${spell.permanency.costGp}`);
    lines.push(`${indent}  permanency: { ${permParts.join(', ')} },`);
  }

  if (spell.deity) lines.push(`${indent}  deity: '${escapeString(spell.deity)}',`);
  if (spell.race) lines.push(`${indent}  race: '${escapeString(spell.race)}',`);
  if (spell.domain) lines.push(`${indent}  domain: '${escapeString(spell.domain)}',`);
  if (spell.bloodline) lines.push(`${indent}  bloodline: '${escapeString(spell.bloodline)}',`);
  if (spell.patron) lines.push(`${indent}  patron: '${escapeString(spell.patron)}',`);
  if (spell.mythicText) lines.push(`${indent}  mythicText: '${escapeString(spell.mythicText)}',`);
  if (spell.augmented) lines.push(`${indent}  augmented: '${escapeString(spell.augmented)}',`);
  if (spell.slaLevel !== undefined) lines.push(`${indent}  slaLevel: ${spell.slaLevel},`);

  lines.push(`${indent}},`);
  return lines.join('\n');
}

// ============================================================
// Run
// ============================================================

function main() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');

  console.log('Parsing CSV...');
  const records: Record<string, string>[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: false,
  });

  console.log(`Parsed ${records.length} rows from CSV`);

  const warnings: string[] = [];
  const spells: SpellRecord[] = [];
  const classSpellCounts: Record<string, number> = {};
  const schoolCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};

  for (let i = 0; i < records.length; i++) {
    const spell = convertRow(records[i], i + 2, warnings); // +2 because row 1 is header
    if (spell) {
      spells.push(spell);

      // Track stats
      schoolCounts[spell.school] = (schoolCounts[spell.school] || 0) + 1;
      sourceCounts[spell.source] = (sourceCounts[spell.source] || 0) + 1;
      for (const className of Object.keys(spell.level)) {
        classSpellCounts[className] = (classSpellCounts[className] || 0) + 1;
      }
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`\n=== WARNINGS (${warnings.length}) ===`);
    for (const w of warnings) {
      console.log(`  ${w}`);
    }
  }

  // Print stats
  console.log(`\n=== CONVERSION STATS ===`);
  console.log(`Total spells converted: ${spells.length} / ${records.length} rows`);
  console.log(`\nSpells by school:`);
  for (const [school, count] of Object.entries(schoolCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${school}: ${count}`);
  }
  console.log(`\nSpells by class:`);
  for (const [cls, count] of Object.entries(classSpellCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cls}: ${count}`);
  }
  console.log(`\nUnique sources: ${Object.keys(sourceCounts).length}`);

  // Generate output file
  console.log(`\nGenerating TypeScript output...`);

  // Write data as JSON (avoids TS2590 "union too complex" with large array literals)
  const jsonPath = OUTPUT_PATH.replace('.generated.ts', '.generated.json');
  const jsonData = JSON.stringify(spells, null, 2);
  fs.writeFileSync(jsonPath, jsonData, 'utf-8');
  console.log(`\nWrote ${spells.length} spells to ${jsonPath}`);
  console.log(`JSON size: ${(Buffer.byteLength(jsonData, 'utf-8') / 1024 / 1024).toFixed(2)} MB`);

  // Write a thin TypeScript wrapper that imports and types the JSON
  const tsWrapper = `// AUTO-GENERATED FILE - Do not edit manually
// Generated from: The Spell Codex - The Spell Codex.csv
// Generated on: ${new Date().toISOString()}
// Total spells: ${spells.length}

import { Spell } from '@/types/spell';
import data from './all-spells.generated.json';

export const ALL_SPELLS_DATA: Spell[] = data as unknown as Spell[];
`;
  fs.writeFileSync(OUTPUT_PATH, tsWrapper, 'utf-8');
  console.log(`Wrote TypeScript wrapper to ${OUTPUT_PATH}`);
}

main();
