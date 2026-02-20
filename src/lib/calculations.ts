import { Character } from '@/types/character';
import { AbilityScores } from '@/types/ability-scores';
import { AbilityScore, ABILITY_SCORES } from '@/types/common';
import { CombatStats } from '@/types/combat';
import { getBABAtLevel, getBaseSaveAtLevel, BABProgression, SaveProgression } from '@/types/class';
import { CharacterSkill, getSkillTotal, Skill } from '@/types/skill';
import { getAbilityModifier, getTotalSpellSlots, getCastingAbility } from './spell-slots';
import { CharacterSpellState } from '@/types/spells';
import { EquipmentItem } from '@/types/equipment';
import { getModifiedArmorStats } from './armor-calculations';

// Re-export for convenience
export { getAbilityModifier } from './spell-slots';

/**
 * Calculate final ability scores including racial modifiers
 */
export function getFinalAbilityScores(
  base: AbilityScores,
  racialModifiers: Partial<AbilityScores>
): AbilityScores {
  const result = { ...base };
  for (const ability of ABILITY_SCORES) {
    if (racialModifiers[ability]) {
      result[ability] += racialModifiers[ability]!;
    }
  }
  return result;
}

/**
 * Get all ability modifiers from final scores
 */
export function getAbilityModifiers(scores: AbilityScores): AbilityScores {
  const mods = {} as AbilityScores;
  for (const ability of ABILITY_SCORES) {
    mods[ability] = getAbilityModifier(scores[ability]);
  }
  return mods;
}

/**
 * Calculate max HP at level 1 (full hit die + Con mod)
 */
export function calculateMaxHP(hitDie: number, conModifier: number, level: number): number {
  // Level 1: full hit die + con mod
  // Subsequent levels: average (round up) + con mod per level
  if (level <= 0) return 0;
  const firstLevel = hitDie + conModifier;
  const avgPerLevel = Math.ceil(hitDie / 2) + 1; // average rounded up
  const subsequentLevels = Math.max(0, level - 1) * (avgPerLevel + conModifier);
  return Math.max(1, firstLevel + subsequentLevels);
}

/**
 * Get size modifier for AC and attack rolls
 */
export function getSizeModifier(size: string): number {
  switch (size) {
    case 'Fine': return 8;
    case 'Diminutive': return 4;
    case 'Tiny': return 2;
    case 'Small': return 1;
    case 'Medium': return 0;
    case 'Large': return -1;
    case 'Huge': return -2;
    case 'Gargantuan': return -4;
    case 'Colossal': return -8;
    default: return 0;
  }
}

/**
 * Calculate all combat stats
 */
export function calculateCombatStats(
  abilityScores: AbilityScores,
  level: number,
  babProgression: BABProgression,
  goodSaves: string[],
  armorACBonus: number,
  shieldACBonus: number,
  naturalArmor: number,
  deflection: number,
  sizeModifier: number,
  maxDexBonus: number | null,
  dodgeBonus: number = 0,
  miscBonus: number = 0,
  insightBonus: number = 0,
  resistanceBonus: number = 0
): CombatStats {
  const mods = getAbilityModifiers(abilityScores);
  const effectiveDex = maxDexBonus !== null ? Math.min(mods.dex, maxDexBonus) : mods.dex;

  const bab = getBABAtLevel(babProgression, level);
  const fortBase = getBaseSaveAtLevel(goodSaves.includes('fortitude') ? 'good' : 'poor', level);
  const refBase = getBaseSaveAtLevel(goodSaves.includes('reflex') ? 'good' : 'poor', level);
  const willBase = getBaseSaveAtLevel(goodSaves.includes('will') ? 'good' : 'poor', level);

  const ac = 10 + armorACBonus + shieldACBonus + effectiveDex + sizeModifier + naturalArmor + deflection + dodgeBonus + miscBonus + insightBonus;
  const touchAC = 10 + effectiveDex + sizeModifier + deflection + dodgeBonus + miscBonus + insightBonus;
  const flatFootedAC = 10 + armorACBonus + shieldACBonus + sizeModifier + naturalArmor + deflection + miscBonus + insightBonus;

  return {
    ac,
    touchAC,
    flatFootedAC,
    initiative: mods.dex,
    bab,
    cmb: bab + mods.str - sizeModifier, // CMB uses inverse size modifier
    cmd: 10 + bab + mods.str + mods.dex - sizeModifier,
    fortitude: fortBase + mods.con + resistanceBonus,
    reflex: refBase + mods.dex + resistanceBonus,
    will: willBase + mods.wis + resistanceBonus,
  };
}

/**
 * Calculate total skill ranks available at a given level
 */
export function calculateSkillRanksPerLevel(
  baseRanksPerLevel: number,
  intModifier: number,
  isHuman: boolean
): number {
  const ranks = baseRanksPerLevel + intModifier + (isHuman ? 1 : 0);
  return Math.max(1, ranks); // minimum 1 rank per level
}

/**
 * Calculate total skill bonus for a character skill
 */
export function calculateSkillBonus(
  skill: CharacterSkill,
  abilityModifier: number,
  armorCheckPenalty: number,
  skillDef: Skill
): number {
  return getSkillTotal(skill, abilityModifier, armorCheckPenalty, skillDef);
}

/**
 * Get armor check penalty from equipped armor only
 */
export function getArmorCheckPenalty(
  equipment: Character['inventory']['equipment']
): number {
  let penalty = 0;
  for (const entry of equipment) {
    if (entry.type === 'armor' && entry.equipped) {
      const modified = getModifiedArmorStats(entry.item, entry.quality, entry.material, entry.enhancementBonus);
      penalty += modified.armorCheckPenalty;
    }
  }
  return penalty;
}

/**
 * Get AC bonus from equipped armor only
 */
export function getArmorACBonus(equipment: Character['inventory']['equipment']): { armorBonus: number; shieldBonus: number; maxDex: number | null } {
  let armorBonus = 0;
  let shieldBonus = 0;
  let maxDex: number | null = null;

  for (const entry of equipment) {
    if (entry.type === 'armor' && entry.equipped) {
      const modified = getModifiedArmorStats(entry.item, entry.quality, entry.material, entry.enhancementBonus);
      if (entry.item.category === 'Shield') {
        shieldBonus = Math.max(shieldBonus, modified.acBonus);
      } else {
        armorBonus = Math.max(armorBonus, modified.acBonus);
        if (modified.maxDex !== null) {
          maxDex = maxDex === null ? modified.maxDex : Math.min(maxDex, modified.maxDex);
        }
      }
    }
  }

  return { armorBonus, shieldBonus, maxDex };
}

export interface WondrousACModifiers {
  deflection: number;
  naturalArmor: number;
  armorBonus: number;
  insight: number;
  dodge: number;
  saveResistance: number;
}

/**
 * Get AC and save modifiers from equipped wondrous items.
 * Same bonus types don't stack (take max), except dodge which stacks.
 */
export function getWondrousACModifiers(equipment: EquipmentItem[]): WondrousACModifiers {
  const result: WondrousACModifiers = {
    deflection: 0,
    naturalArmor: 0,
    armorBonus: 0,
    insight: 0,
    dodge: 0,
    saveResistance: 0,
  };

  for (const entry of equipment) {
    if (entry.type === 'wondrous' && entry.equipped) {
      for (const mod of entry.item.modifiers) {
        if (mod.type === 'ac') {
          switch (mod.bonusType) {
            case 'deflection':
              result.deflection = Math.max(result.deflection, mod.value);
              break;
            case 'natural':
              result.naturalArmor = Math.max(result.naturalArmor, mod.value);
              break;
            case 'armor':
              result.armorBonus = Math.max(result.armorBonus, mod.value);
              break;
            case 'insight':
              result.insight = Math.max(result.insight, mod.value);
              break;
            case 'dodge':
              result.dodge += mod.value; // dodge stacks
              break;
          }
        } else if (mod.type === 'save' && mod.bonusType === 'resistance') {
          result.saveResistance = Math.max(result.saveResistance, mod.value);
        }
      }
    }
  }

  return result;
}

/**
 * Get ability score enhancement bonuses from equipped wondrous items.
 * Enhancement bonuses of the same type don't stack — take the highest.
 */
export function getWondrousAbilityModifiers(
  equipment: EquipmentItem[]
): Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>> {
  const result: Partial<Record<string, number>> = {};
  for (const entry of equipment) {
    if (entry.type !== 'wondrous' || !entry.equipped) continue;
    for (const mod of entry.item.modifiers) {
      if (mod.type !== 'ability') continue;
      result[mod.ability] = Math.max(result[mod.ability] ?? 0, mod.value);
    }
  }
  return result as Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>>;
}

/**
 * Calculate character speed based on base speed and equipped armor
 */
export function calculateSpeed(
  baseSpeed: number,
  equipment: Character['inventory']['equipment']
): number {
  // Find equipped non-shield armor
  for (const entry of equipment) {
    if (entry.type === 'armor' && entry.equipped && entry.item.category !== 'Shield') {
      const modified = getModifiedArmorStats(entry.item, entry.quality, entry.material);
      // Check effective category after material modifications
      if (modified.category === 'Medium' || modified.category === 'Heavy') {
        // Medium and heavy armor reduce speed
        if (baseSpeed >= 30) {
          return 20;
        } else if (baseSpeed >= 20) {
          return 15;
        }
        // For other base speeds, use armor's speed values
        return baseSpeed >= 30 ? entry.item.speed30 : entry.item.speed20;
      }
    }
  }
  return baseSpeed;
}

/**
 * Get the effective armor category for speed purposes
 */
export function getEquippedArmorCategory(
  equipment: Character['inventory']['equipment']
): 'None' | 'Light' | 'Medium' | 'Heavy' {
  for (const entry of equipment) {
    if (entry.type === 'armor' && entry.equipped && entry.item.category !== 'Shield') {
      const modified = getModifiedArmorStats(entry.item, entry.quality, entry.material);
      return modified.category as 'Light' | 'Medium' | 'Heavy';
    }
  }
  return 'None';
}

/**
 * Calculate spell state for a character
 */
export function calculateSpellState(
  className: string,
  level: number,
  abilityScores: AbilityScores,
  spellsPerDayTable?: Record<number, Record<number, number | undefined>>,
  spellSlotsUsed?: Record<number, number>
): CharacterSpellState {
  const castingAbility = getCastingAbility(className);
  if (!castingAbility || !spellsPerDayTable) {
    return { canCast: false, spellSlots: {}, bonusSpells: {} };
  }

  const castingScore = abilityScores[castingAbility];
  const levelSlots = spellsPerDayTable[level];
  if (!levelSlots) {
    return { canCast: false, spellSlots: {}, bonusSpells: {} };
  }

  const spellSlots: Record<number, { total: number; used: number }> = {};
  const bonusSpells: Record<number, number> = {};

  for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
    const base = levelSlots[spellLevel];
    if (base === undefined) continue;

    const total = getTotalSpellSlots(base, castingScore, spellLevel);
    const used = spellSlotsUsed?.[spellLevel] ?? 0;
    spellSlots[spellLevel] = { total, used };

    if (spellLevel > 0) {
      bonusSpells[spellLevel] = total - base;
    }
  }

  return {
    canCast: true,
    castingClass: className,
    castingAbility,
    spellSlots,
    bonusSpells,
  };
}
