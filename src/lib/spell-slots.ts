import { AbilityScore } from '@/types/common';

/**
 * Calculate bonus spells per day from a high ability score.
 * PF1e rule: for spell level N (1+), bonus = floor((abilityScore - 10) / 2 - N + 1) / 2
 * Simplified: you get a bonus spell at level N if your modifier >= N.
 * Bonus spells = floor((modifier - spellLevel) / 4) + 1, if modifier >= spellLevel
 */
export function getBonusSpellSlots(abilityScore: number, spellLevel: number): number {
  if (spellLevel <= 0) return 0; // cantrips get no bonus
  const modifier = Math.floor((abilityScore - 10) / 2);
  if (modifier < spellLevel) return 0;
  return Math.floor((modifier - spellLevel) / 4) + 1;
}

/**
 * Calculate the ability modifier
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Get the minimum ability score needed to cast a spell of a given level.
 * You need a score of 10 + spell level in the casting ability.
 */
export function getMinCastingAbilityScore(spellLevel: number): number {
  return 10 + spellLevel;
}

/**
 * Calculate total spell slots for a given class level and spell level,
 * including bonus spells from ability score.
 */
export function getTotalSpellSlots(
  baseSlots: number | undefined,
  castingAbilityScore: number,
  spellLevel: number
): number {
  if (baseSlots === undefined) return 0;
  if (spellLevel === 0) return baseSlots; // cantrips don't get bonus slots
  const bonus = getBonusSpellSlots(castingAbilityScore, spellLevel);
  return baseSlots + bonus;
}

/**
 * Get the casting ability for a class
 */
export function getCastingAbility(className: string): AbilityScore | null {
  switch (className) {
    case 'Wizard':
    case 'Witch':
    case 'Magus':
    case 'Alchemist':
    case 'Investigator':
    case 'Arcanist': return 'int';
    case 'Cleric':
    case 'Druid':
    case 'Ranger':
    case 'Inquisitor': return 'wis';
    case 'Bard':
    case 'Sorcerer':
    case 'Paladin':
    case 'Oracle':
    case 'Bloodrager': return 'cha';
    default: return null;
  }
}
