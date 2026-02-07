import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// ============================================================
// Configuration
// ============================================================

const CSV_PATH = path.resolve(__dirname, '../src/data/equipment/magic_items_full - Updated 19Jan2020.csv');
const OUTPUT_JSON = path.resolve(__dirname, '../src/data/equipment/magic-items.generated.json');

const DASH = '—';

function isEmpty(val: string | undefined): boolean {
  if (!val) return true;
  const trimmed = val.trim();
  return trimmed === '' || trimmed === DASH || trimmed === '-' || trimmed === 'NULL' || trimmed === 'null';
}

// Normalize slot values to consistent lowercase
function normalizeSlot(raw: string): string {
  if (isEmpty(raw)) return 'none';
  const trimmed = raw.trim().toLowerCase();
  if (trimmed === '-' || trimmed === 'none' || trimmed === '' || trimmed === 'null') return 'none';
  // Fix known inconsistencies
  if (trimmed === 'wrist') return 'wrists';
  if (trimmed === 'hand') return 'hands';
  if (trimmed === 'foot') return 'feet';
  return trimmed;
}

interface MagicItemRecord {
  name: string;
  group: string;
  slot: string;
  price: number;
  cost: number;
  weight: number;
  description: string;
  aura: string;
  casterLevel: number;
  source: string;
}

function convertRow(row: Record<string, string>, rowIndex: number, warnings: string[]): MagicItemRecord | null {
  const name = (row['Name'] || '').trim();
  if (!name) {
    warnings.push(`Row ${rowIndex}: Empty name, skipping`);
    return null;
  }

  const group = (row['Group'] || '').trim();
  if (!group) {
    warnings.push(`Row ${rowIndex} (${name}): No group, skipping`);
    return null;
  }

  const slot = normalizeSlot(row['Slot'] || '');
  const aura = (row['Aura'] || '').trim();
  const source = (row['Source'] || '').trim();
  const description = (row['Description'] || '').trim();

  // CL
  let casterLevel = 0;
  const rawCL = (row['CL'] || '').trim();
  if (!isEmpty(rawCL)) {
    const parsed = parseInt(rawCL, 10);
    if (!isNaN(parsed)) casterLevel = parsed;
  }

  // Price (numeric)
  let price = 0;
  const rawPrice = (row['PriceValue'] || '').trim();
  if (!isEmpty(rawPrice)) {
    const cleaned = rawPrice.replace(/[,\s]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) price = parsed;
  }

  // Weight (numeric)
  let weight = 0;
  const rawWeight = (row['WeightValue'] || '').trim();
  if (!isEmpty(rawWeight)) {
    const cleaned = rawWeight.replace(/[,\s]/g, '');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) weight = parsed;
  }

  return {
    name,
    group,
    slot,
    price,
    cost: price,
    weight,
    description,
    aura,
    casterLevel,
    source,
  };
}

// ============================================================
// Main
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
  const items: MagicItemRecord[] = [];
  const groupCounts: Record<string, number> = {};
  const slotCounts: Record<string, number> = {};

  for (let i = 0; i < records.length; i++) {
    const item = convertRow(records[i], i + 2, warnings);
    if (item) {
      items.push(item);
      groupCounts[item.group] = (groupCounts[item.group] || 0) + 1;
      slotCounts[item.slot] = (slotCounts[item.slot] || 0) + 1;
    }
  }

  // Print warnings (first 20)
  if (warnings.length > 0) {
    console.log(`\n=== WARNINGS (${warnings.length}) ===`);
    for (const w of warnings.slice(0, 20)) {
      console.log(`  ${w}`);
    }
    if (warnings.length > 20) {
      console.log(`  ... and ${warnings.length - 20} more`);
    }
  }

  // Print stats
  console.log(`\n=== CONVERSION STATS ===`);
  console.log(`Total items converted: ${items.length} / ${records.length} rows`);
  console.log(`\nItems by group:`);
  for (const [group, count] of Object.entries(groupCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${group}: ${count}`);
  }
  console.log(`\nItems by slot:`);
  for (const [slot, count] of Object.entries(slotCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${slot}: ${count}`);
  }

  // Write JSON
  const jsonData = JSON.stringify(items, null, 2);
  fs.writeFileSync(OUTPUT_JSON, jsonData, 'utf-8');
  console.log(`\nWrote ${items.length} items to ${OUTPUT_JSON}`);
  console.log(`JSON size: ${(Buffer.byteLength(jsonData, 'utf-8') / 1024 / 1024).toFixed(2)} MB`);
}

main();
