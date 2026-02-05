import { StatBreakdown, BreakdownEntry } from '@/types/breakdown';

function filtered(entries: BreakdownEntry[]): BreakdownEntry[] {
  return entries.filter((e) => e.value !== 0);
}

function sum(entries: BreakdownEntry[]): number {
  return entries.reduce((t, e) => t + e.value, 0);
}

export function explainAC(
  armorBonus: number,
  shieldBonus: number,
  dexMod: number,
  sizeMod: number,
  naturalArmor: number,
  deflection: number
): StatBreakdown {
  const entries = filtered([
    { label: 'Base', value: 10 },
    { label: 'Armor', value: armorBonus },
    { label: 'Shield', value: shieldBonus },
    { label: 'DEX', value: dexMod },
    { label: 'Size', value: sizeMod },
    { label: 'Natural Armor', value: naturalArmor },
    { label: 'Deflection', value: deflection },
  ]);
  return { total: sum(entries), entries };
}

export function explainTouchAC(
  dexMod: number,
  sizeMod: number,
  deflection: number
): StatBreakdown {
  const entries = filtered([
    { label: 'Base', value: 10 },
    { label: 'DEX', value: dexMod },
    { label: 'Size', value: sizeMod },
    { label: 'Deflection', value: deflection },
  ]);
  return { total: sum(entries), entries };
}

export function explainFlatFootedAC(
  armorBonus: number,
  shieldBonus: number,
  sizeMod: number,
  naturalArmor: number,
  deflection: number
): StatBreakdown {
  const entries = filtered([
    { label: 'Base', value: 10 },
    { label: 'Armor', value: armorBonus },
    { label: 'Shield', value: shieldBonus },
    { label: 'Size', value: sizeMod },
    { label: 'Natural Armor', value: naturalArmor },
    { label: 'Deflection', value: deflection },
  ]);
  return { total: sum(entries), entries };
}

export function explainInitiative(
  dexMod: number,
  miscBonus: number
): StatBreakdown {
  const entries = filtered([
    { label: 'DEX', value: dexMod },
    { label: 'Misc', value: miscBonus },
  ]);
  return { total: sum(entries), entries };
}

export function explainCMB(
  bab: number,
  strMod: number,
  sizeMod: number
): StatBreakdown {
  const entries = filtered([
    { label: 'BAB', value: bab },
    { label: 'STR', value: strMod },
    { label: 'Size', value: -sizeMod },
  ]);
  return { total: sum(entries), entries };
}

export function explainCMD(
  bab: number,
  strMod: number,
  dexMod: number,
  sizeMod: number
): StatBreakdown {
  const entries = filtered([
    { label: 'Base', value: 10 },
    { label: 'BAB', value: bab },
    { label: 'STR', value: strMod },
    { label: 'DEX', value: dexMod },
    { label: 'Size', value: -sizeMod },
  ]);
  return { total: sum(entries), entries };
}

export function explainSave(
  baseSave: number,
  abilityMod: number,
  saveName: string
): StatBreakdown {
  const abilityLabel =
    saveName === 'Fortitude' ? 'CON' : saveName === 'Reflex' ? 'DEX' : 'WIS';
  const entries = filtered([
    { label: 'Base Save', value: baseSave },
    { label: abilityLabel, value: abilityMod },
  ]);
  return { total: sum(entries), entries };
}

export function explainSkill(
  ranks: number,
  abilityMod: number,
  classBonus: number,
  miscMod: number,
  armorPenalty: number,
  racialBonus: number
): StatBreakdown {
  const entries = filtered([
    { label: 'Ranks', value: ranks },
    { label: 'Ability', value: abilityMod },
    { label: 'Class Skill', value: classBonus },
    { label: 'Racial', value: racialBonus },
    { label: 'Misc', value: miscMod },
    { label: 'Armor Penalty', value: armorPenalty },
  ]);
  return { total: sum(entries), entries };
}

export function explainMaxHP(
  hitDie: number,
  conMod: number,
  level: number
): StatBreakdown {
  const firstLevelHP = hitDie + conMod;
  const avgPerLevel = Math.ceil(hitDie / 2) + 1;
  const subsequentLevels = Math.max(0, level - 1);
  const entries = filtered([
    { label: `Level 1 (d${hitDie} max)`, value: hitDie },
    { label: `CON x ${level}`, value: conMod * level },
    ...(subsequentLevels > 0
      ? [{ label: `Levels 2-${level} (avg ${avgPerLevel})`, value: subsequentLevels * avgPerLevel }]
      : []),
  ]);
  const total = Math.max(1, firstLevelHP + subsequentLevels * (avgPerLevel + conMod));
  return { total, entries };
}
