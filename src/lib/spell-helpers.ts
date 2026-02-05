import { ClassName } from '@/types/class';
import { classes } from '@/data/classes';

export type CasterType = 'prepared' | 'spontaneous' | 'none';

/**
 * Determines the casting type of a class
 */
export function getCasterType(className: ClassName): CasterType {
  const cls = classes[className];
  if (!cls?.spellProgression) return 'none';
  return cls.spellProgression.type;
}

/**
 * Check if a class is a prepared caster (Wizard, Cleric, Druid, etc.)
 */
export function isPreparedCaster(className: ClassName): boolean {
  return getCasterType(className) === 'prepared';
}

/**
 * Check if a class is a spontaneous caster (Sorcerer, Bard, Oracle, etc.)
 */
export function isSpontaneousCaster(className: ClassName): boolean {
  return getCasterType(className) === 'spontaneous';
}

/**
 * Get the prepared caster classes
 */
export const PREPARED_CASTER_CLASSES: ClassName[] = [
  'Wizard',
  'Cleric',
  'Druid',
  'Paladin',
  'Ranger',
  'Witch',
  'Magus',
  'Alchemist', // Alchemist uses extracts which are similar to prepared spells
];

/**
 * Get the spontaneous caster classes
 */
export const SPONTANEOUS_CASTER_CLASSES: ClassName[] = [
  'Sorcerer',
  'Bard',
  'Oracle',
  'Inquisitor',
  'Arcanist', // Arcanist has a unique hybrid system
  'Bloodrager',
];

/**
 * Check if a class needs to prepare spells (use spell preparation UI)
 */
export function needsSpellPreparation(className: ClassName): boolean {
  const casterType = getCasterType(className);
  // Prepared casters need to prepare spells daily
  return casterType === 'prepared';
}
