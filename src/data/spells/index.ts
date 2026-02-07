import { Spell } from '@/types/spell';
import { ClassName } from '@/types/class';
import { ALL_SPELLS_DATA } from './all-spells.generated';

export const ALL_SPELLS: Spell[] = ALL_SPELLS_DATA;

// Create a lookup by name
export const SPELLS_BY_NAME: Record<string, Spell> = {};
for (const spell of ALL_SPELLS) {
  SPELLS_BY_NAME[spell.name] = spell;
}

// Get spells available to a class at a specific level
export function getSpellsForClass(className: ClassName, maxSpellLevel?: number): Spell[] {
  return ALL_SPELLS.filter((spell) => {
    const level = spell.level[className];
    if (level === undefined) return false;
    if (maxSpellLevel !== undefined && level > maxSpellLevel) return false;
    return true;
  });
}

// Get spells at a specific level for a class
export function getSpellsAtLevel(className: ClassName, spellLevel: number): Spell[] {
  return ALL_SPELLS.filter((spell) => spell.level[className] === spellLevel);
}

// Get max spell level available at a given caster level
export function getMaxSpellLevelForCasterLevel(casterLevel: number, fullCaster: boolean = true): number {
  if (fullCaster) {
    // Full casters (Wizard, Sorcerer, Cleric, etc): new spell level every 2 levels
    return Math.min(9, Math.floor((casterLevel + 1) / 2));
  } else {
    // Partial casters (Paladin, Ranger): different progression, start at 4th level
    if (casterLevel < 4) return 0;
    return Math.min(4, Math.floor((casterLevel - 1) / 3));
  }
}
