import { Character, CHARACTER_VERSION } from '@/types/character';
import { RaceName } from '@/types/race';
import { ClassName } from '@/types/class';

export interface ImportValidationResult {
  valid: boolean;
  errors: string[];
  character?: Character;
}

const VALID_RACES: RaceName[] = [
  'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Aasimar', 'Tiefling',
  'Catfolk', 'Dhampir', 'Drow', 'Fetchling', 'Goblin', 'Hobgoblin', 'Ifrit', 'Kobold',
  'Oread', 'Ratfolk', 'Sylph', 'Tengu', 'Undine',
];

const VALID_CLASSES: ClassName[] = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue',
  'Sorcerer', 'Wizard', 'Alchemist', 'Inquisitor', 'Oracle', 'Witch', 'Magus', 'Arcanist',
  'Bloodrager', 'Investigator', 'Slayer', 'Swashbuckler',
  'Skald', 'Summoner', 'UnSummoner', 'Shaman', 'Hunter', 'Warpriest', 'Antipaladin',
  'Psychic', 'Mesmerist', 'Occultist', 'Spiritualist', 'Medium',
];

const VALID_EQUIPMENT_TYPES = new Set(['weapon', 'armor', 'gear', 'wondrous', 'magic']);

function sanitizeInventory(inventory: Character['inventory']): Character['inventory'] {
  return {
    ...inventory,
    equipment: inventory.equipment.filter(
      (e) => VALID_EQUIPMENT_TYPES.has(e.type)
    ),
  };
}

/**
 * Validates imported character JSON data
 */
export function validateCharacterImport(data: unknown): ImportValidationResult {
  const errors: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid JSON: expected an object'] };
  }

  const obj = data as Record<string, unknown>;

  // Required string fields
  if (typeof obj.name !== 'string' || !obj.name.trim()) {
    errors.push('Missing or invalid "name" field');
  }

  // Validate race
  if (!obj.race || !VALID_RACES.includes(obj.race as RaceName)) {
    errors.push(`Invalid or missing "race" field. Valid races: ${VALID_RACES.join(', ')}`);
  }

  // Validate class
  if (!obj.className || !VALID_CLASSES.includes(obj.className as ClassName)) {
    errors.push(`Invalid or missing "className" field. Valid classes: ${VALID_CLASSES.join(', ')}`);
  }

  // Validate level
  if (typeof obj.level !== 'number' || obj.level < 1 || obj.level > 20) {
    errors.push('Invalid or missing "level" field (must be 1-20)');
  }

  // Validate ability scores
  if (!obj.baseAbilityScores || typeof obj.baseAbilityScores !== 'object') {
    errors.push('Missing or invalid "baseAbilityScores" field');
  } else {
    const scores = obj.baseAbilityScores as Record<string, unknown>;
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    for (const ability of abilities) {
      if (typeof scores[ability] !== 'number' || scores[ability] < 1) {
        errors.push(`Invalid ability score: ${ability}`);
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Create a clean character object with defaults for missing optional fields
  const character: Character = {
    id: crypto.randomUUID(), // Always generate a new ID to avoid conflicts
    version: CHARACTER_VERSION,
    name: (obj.name as string).trim(),
    playerName: typeof obj.playerName === 'string' ? obj.playerName : undefined,
    alignment: obj.alignment as Character['alignment'],
    deity: typeof obj.deity === 'string' ? obj.deity : undefined,
    level: obj.level as number,
    experience: typeof obj.experience === 'number' ? obj.experience : 0,
    race: obj.race as RaceName,
    racialAbilityChoice: obj.racialAbilityChoice as Character['racialAbilityChoice'],
    className: obj.className as ClassName,
    abilityScoreMethod: (obj.abilityScoreMethod as Character['abilityScoreMethod']) || 'manual',
    baseAbilityScores: obj.baseAbilityScores as Character['baseAbilityScores'],
    skills: Array.isArray(obj.skills) ? obj.skills : [],
    featNames: Array.isArray(obj.featNames) ? obj.featNames : [],
    featParams: (obj.featParams as Record<string, string>) || {},
    languages: Array.isArray(obj.languages) ? obj.languages : [],
    spellsKnown: Array.isArray(obj.spellsKnown) ? obj.spellsKnown : [],
    spellsPrepared: (obj.spellsPrepared as Record<number, string[]>) || {},
    inventory: sanitizeInventory((obj.inventory as Character['inventory']) || { equipment: [], gold: 0, silver: 0, copper: 0 }),
    acModifiers: (obj.acModifiers as Character['acModifiers']) ?? { naturalArmor: 0, deflection: 0, dodge: 0, misc: 0 },
    currentHP: typeof obj.currentHP === 'number' ? obj.currentHP : 0,
    maxHPOverride: typeof obj.maxHPOverride === 'number' ? obj.maxHPOverride : undefined,
    tempHP: typeof obj.tempHP === 'number' ? obj.tempHP : 0,
    nonlethalDamage: typeof obj.nonlethalDamage === 'number' ? obj.nonlethalDamage : 0,
    conditions: Array.isArray(obj.conditions) ? obj.conditions : [],
    spellSlotsUsed: (obj.spellSlotsUsed as Record<number, number>) || {},
    classResourcesUsed: (obj.classResourcesUsed as Record<string, number>) || {},
    notes: typeof obj.notes === 'string' ? obj.notes : '',
    levelHistory: Array.isArray(obj.levelHistory) ? obj.levelHistory : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return { valid: true, errors: [], character };
}

/**
 * Parses a JSON file and validates it as a character
 */
export async function parseCharacterFile(file: File): Promise<ImportValidationResult> {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return validateCharacterImport(data);
  } catch {
    return { valid: false, errors: ['Failed to parse JSON file. Please ensure it is valid JSON.'] };
  }
}
