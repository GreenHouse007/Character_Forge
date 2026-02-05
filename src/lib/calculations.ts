import { Character } from '@/types/character';
import { AbilityScores } from '@/types/ability-scores';
import { AbilityScore, ABILITY_SCORES } from '@/types/common';
import { CombatStats } from '@/types/combat';
import { getBABAtLevel, getBaseSaveAtLevel, BABProgression, SaveProgression } from '@/types/class';
import { CharacterSkill, getSkillTotal, Skill } from '@/types/skill';
import { getAbilityModifier, getTotalSpellSlots, getCastingAbility } from './spell-slots';
import { CharacterSpellState } from '@/types/spells';

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
  maxDexBonus: number | null
): CombatStats {
  const mods = getAbilityModifiers(abilityScores);
  const effectiveDex = maxDexBonus !== null ? Math.min(mods.dex, maxDexBonus) : mods.dex;

  const bab = getBABAtLevel(babProgression, level);
  const fortBase = getBaseSaveAtLevel(goodSaves.includes('fortitude') ? 'good' : 'poor', level);
  const refBase = getBaseSaveAtLevel(goodSaves.includes('reflex') ? 'good' : 'poor', level);
  const willBase = getBaseSaveAtLevel(goodSaves.includes('will') ? 'good' : 'poor', level);

  const ac = 10 + armorACBonus + shieldACBonus + effectiveDex + sizeModifier + naturalArmor + deflection;
  const touchAC = 10 + effectiveDex + sizeModifier + deflection;
  const flatFootedAC = 10 + armorACBonus + shieldACBonus + sizeModifier + naturalArmor + deflection;

  return {
    ac,
    touchAC,
    flatFootedAC,
    initiative: mods.dex,
    bab,
    cmb: bab + mods.str - sizeModifier, // CMB uses inverse size modifier
    cmd: 10 + bab + mods.str + mods.dex - sizeModifier,
    fortitude: fortBase + mods.con,
    reflex: refBase + mods.dex,
    will: willBase + mods.wis,
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
      penalty += entry.item.armorCheckPenalty;
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
      if (entry.item.category === 'Shield') {
        shieldBonus = Math.max(shieldBonus, entry.item.acBonus);
      } else {
        armorBonus = Math.max(armorBonus, entry.item.acBonus);
        if (entry.item.maxDex !== null) {
          maxDex = maxDex === null ? entry.item.maxDex : Math.min(maxDex, entry.item.maxDex);
        }
      }
    }
  }

  return { armorBonus, shieldBonus, maxDex };
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
