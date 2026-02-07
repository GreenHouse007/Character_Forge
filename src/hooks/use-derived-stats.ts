'use client';

import { useMemo } from 'react';
import { Character } from '@/types/character';
import { StatBreakdown } from '@/types/breakdown';
import { races } from '@/data/races';
import { classes } from '@/data/classes';
import {
  getFinalAbilityScores,
  getAbilityModifiers,
  calculateMaxHP,
  calculateCombatStats,
  getSizeModifier,
  getArmorCheckPenalty,
  getArmorACBonus,
  getWondrousACModifiers,
  calculateSpellState,
  calculateSkillRanksPerLevel,
  calculateSpeed,
  getEquippedArmorCategory,
} from '@/lib/calculations';
import {
  explainAC,
  explainTouchAC,
  explainFlatFootedAC,
  explainInitiative,
  explainCMB,
  explainCMD,
  explainSave,
  explainMaxHP,
  explainSpeed,
} from '@/lib/breakdowns';
import { calculateMaxHPFromHistory } from '@/lib/level-up';
import { getBABAtLevel, getBaseSaveAtLevel } from '@/types/class';
import { AbilityScores } from '@/types/ability-scores';
import { CombatStats } from '@/types/combat';
import { CharacterSpellState } from '@/types/spells';

export interface DerivedStats {
  finalAbilityScores: AbilityScores;
  abilityModifiers: AbilityScores;
  maxHP: number;
  combatStats: CombatStats;
  armorCheckPenalty: number;
  speed: number;
  spellState: CharacterSpellState;
  skillRanksPerLevel: number;
  totalSkillRanksUsed: number;
  breakdowns: {
    ac: StatBreakdown;
    touchAC: StatBreakdown;
    flatFootedAC: StatBreakdown;
    initiative: StatBreakdown;
    cmb: StatBreakdown;
    cmd: StatBreakdown;
    fortitude: StatBreakdown;
    reflex: StatBreakdown;
    will: StatBreakdown;
    maxHP: StatBreakdown;
    speed: StatBreakdown;
  };
}

export function useDerivedStats(character: Character | null): DerivedStats | null {
  return useMemo(() => {
    if (!character) return null;

    const race = races[character.race];
    const cls = classes[character.className];
    if (!race || !cls) return null;

    // Build racial modifiers
    const racialMods: Partial<AbilityScores> = {};
    for (const mod of race.abilityModifiers) {
      racialMods[mod.ability] = (racialMods[mod.ability] ?? 0) + mod.modifier;
    }
    if (race.flexibleAbilityBonus && character.racialAbilityChoice) {
      racialMods[character.racialAbilityChoice] =
        (racialMods[character.racialAbilityChoice] ?? 0) + 2;
    }

    const finalAbilityScores = getFinalAbilityScores(character.baseAbilityScores, racialMods);
    const abilityModifiers = getAbilityModifiers(finalAbilityScores);

    const hasToughness = character.featNames.includes('Toughness');
    const maxHP = character.maxHPOverride ??
      (character.levelHistory && character.levelHistory.length > 0
        ? calculateMaxHPFromHistory(cls.hitDie, abilityModifiers.con, character.level, character.levelHistory, hasToughness)
        : calculateMaxHP(cls.hitDie, abilityModifiers.con, character.level));

    const { armorBonus: equippedArmorBonus, shieldBonus, maxDex } = getArmorACBonus(character.inventory.equipment);
    const armorCheckPenalty = getArmorCheckPenalty(character.inventory.equipment);
    const sizeModifier = getSizeModifier(race.size);

    // AC modifiers from manual inputs (default to 0 if undefined for backward compat)
    const acMods = character.acModifiers ?? { naturalArmor: 0, deflection: 0, dodge: 0, misc: 0 };

    // AC modifiers from equipped wondrous items
    const wondrousMods = getWondrousACModifiers(character.inventory.equipment);

    // Combine: sum manual + wondrous for each type
    const totalNaturalArmor = acMods.naturalArmor + wondrousMods.naturalArmor;
    const totalDeflection = acMods.deflection + wondrousMods.deflection;
    const totalDodge = acMods.dodge + wondrousMods.dodge;
    const totalMisc = acMods.misc;
    const totalInsight = wondrousMods.insight;
    const totalResistance = wondrousMods.saveResistance;

    // Bracers of Armor: only applies if better than equipped armor
    const armorBonus = Math.max(equippedArmorBonus, wondrousMods.armorBonus);

    const effectiveDex = maxDex !== null ? Math.min(abilityModifiers.dex, maxDex) : abilityModifiers.dex;

    const combatStats = calculateCombatStats(
      finalAbilityScores,
      character.level,
      cls.babProgression,
      cls.goodSaves.map(String),
      armorBonus,
      shieldBonus,
      totalNaturalArmor,
      totalDeflection,
      sizeModifier,
      maxDex,
      totalDodge,
      totalMisc,
      totalInsight,
      totalResistance
    );

    const spellState = calculateSpellState(
      character.className,
      character.level,
      finalAbilityScores,
      cls.spellProgression.spellsPerDay,
      character.spellSlotsUsed
    );

    const skillRanksPerLevel = calculateSkillRanksPerLevel(
      cls.skillRanksPerLevel,
      abilityModifiers.int,
      character.race === 'Human'
    );

    const totalSkillRanksUsed = character.skills.reduce((sum, s) => sum + s.ranks, 0);

    // Calculate speed
    const speed = calculateSpeed(race.speed, character.inventory.equipment);
    const armorCategory = getEquippedArmorCategory(character.inventory.equipment);

    // Compute breakdowns
    const bab = getBABAtLevel(cls.babProgression, character.level);
    const fortBase = getBaseSaveAtLevel(cls.goodSaves.includes('fortitude') ? 'good' : 'poor', character.level);
    const refBase = getBaseSaveAtLevel(cls.goodSaves.includes('reflex') ? 'good' : 'poor', character.level);
    const willBase = getBaseSaveAtLevel(cls.goodSaves.includes('will') ? 'good' : 'poor', character.level);

    const breakdowns = {
      ac: explainAC(armorBonus, shieldBonus, effectiveDex, sizeModifier, totalNaturalArmor, totalDeflection, totalDodge, totalMisc, totalInsight),
      touchAC: explainTouchAC(effectiveDex, sizeModifier, totalDeflection, totalDodge, totalMisc, totalInsight),
      flatFootedAC: explainFlatFootedAC(armorBonus, shieldBonus, sizeModifier, totalNaturalArmor, totalDeflection, totalMisc, totalInsight),
      initiative: explainInitiative(abilityModifiers.dex, 0),
      cmb: explainCMB(bab, abilityModifiers.str, sizeModifier),
      cmd: explainCMD(bab, abilityModifiers.str, abilityModifiers.dex, sizeModifier),
      fortitude: explainSave(fortBase, abilityModifiers.con, 'Fortitude', totalResistance),
      reflex: explainSave(refBase, abilityModifiers.dex, 'Reflex', totalResistance),
      will: explainSave(willBase, abilityModifiers.wis, 'Will', totalResistance),
      maxHP: explainMaxHP(cls.hitDie, abilityModifiers.con, character.level),
      speed: explainSpeed(race.speed, speed, armorCategory),
    };

    return {
      finalAbilityScores,
      abilityModifiers,
      maxHP,
      combatStats,
      armorCheckPenalty,
      speed,
      spellState,
      skillRanksPerLevel,
      totalSkillRanksUsed,
      breakdowns,
    };
  }, [character]);
}
