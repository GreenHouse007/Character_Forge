import { DiceRoll } from '@/types/common';

export interface WeaponSpecialAbilityDef {
  id: string;
  name: string;
  equivalentBonus: number;
  description: string;
  appliesTo: 'melee' | 'ranged' | 'all';
  extraDamageDice?: DiceRoll;
  extraDamageType?: string;
  doubleCritRange?: boolean;
  requiresTarget?: boolean;
  grantExtraAttack?: boolean;
  isToggle?: boolean;
}

export const WEAPON_SPECIAL_ABILITIES: WeaponSpecialAbilityDef[] = [
  {
    id: 'bane',
    name: 'Bane',
    equivalentBonus: 1,
    description: 'Against designated foe, +2 enhancement bonus and +2d6 damage.',
    appliesTo: 'all',
    extraDamageDice: { count: 2, sides: 6 },
    requiresTarget: true,
    isToggle: true,
  },
  {
    id: 'corrosive',
    name: 'Corrosive',
    equivalentBonus: 1,
    description: 'Deals +1d6 acid damage on a hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'acid',
  },
  {
    id: 'defending',
    name: 'Defending',
    equivalentBonus: 1,
    description: 'Transfer enhancement bonus from attack to AC.',
    appliesTo: 'melee',
    isToggle: true,
  },
  {
    id: 'flaming',
    name: 'Flaming',
    equivalentBonus: 1,
    description: 'Deals +1d6 fire damage on a hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'fire',
  },
  {
    id: 'frost',
    name: 'Frost',
    equivalentBonus: 1,
    description: 'Deals +1d6 cold damage on a hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'cold',
  },
  {
    id: 'ghostTouch',
    name: 'Ghost Touch',
    equivalentBonus: 1,
    description: 'Deals full damage against incorporeal creatures.',
    appliesTo: 'all',
  },
  {
    id: 'keen',
    name: 'Keen',
    equivalentBonus: 1,
    description: 'Doubles the threat range of the weapon.',
    appliesTo: 'melee',
    doubleCritRange: true,
  },
  {
    id: 'merciful',
    name: 'Merciful',
    equivalentBonus: 1,
    description: 'Deals +1d6 damage, all damage is nonlethal.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
  },
  {
    id: 'shock',
    name: 'Shock',
    equivalentBonus: 1,
    description: 'Deals +1d6 electricity damage on a hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'electricity',
  },
  {
    id: 'flamingBurst',
    name: 'Flaming Burst',
    equivalentBonus: 2,
    description: 'Deals +1d6 fire damage, plus +1d10 fire on a critical hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'fire',
  },
  {
    id: 'holy',
    name: 'Holy',
    equivalentBonus: 2,
    description: 'Deals +2d6 damage against evil creatures.',
    appliesTo: 'all',
    extraDamageDice: { count: 2, sides: 6 },
    isToggle: true,
  },
  {
    id: 'icyBurst',
    name: 'Icy Burst',
    equivalentBonus: 2,
    description: 'Deals +1d6 cold damage, plus +1d10 cold on a critical hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'cold',
  },
  {
    id: 'shockingBurst',
    name: 'Shocking Burst',
    equivalentBonus: 2,
    description: 'Deals +1d6 electricity damage, plus +1d10 electricity on a critical hit.',
    appliesTo: 'all',
    extraDamageDice: { count: 1, sides: 6 },
    extraDamageType: 'electricity',
  },
  {
    id: 'unholy',
    name: 'Unholy',
    equivalentBonus: 2,
    description: 'Deals +2d6 damage against good creatures.',
    appliesTo: 'all',
    extraDamageDice: { count: 2, sides: 6 },
    isToggle: true,
  },
  {
    id: 'wounding',
    name: 'Wounding',
    equivalentBonus: 2,
    description: 'Deals 1 point of bleed damage per hit.',
    appliesTo: 'all',
  },
  {
    id: 'speed',
    name: 'Speed',
    equivalentBonus: 3,
    description: 'Grants one extra attack at full BAB when making a full attack.',
    appliesTo: 'all',
    grantExtraAttack: true,
    isToggle: true,
  },
  {
    id: 'vorpal',
    name: 'Vorpal',
    equivalentBonus: 5,
    description: 'On a natural 20, severs the head of the target (slashing melee only).',
    appliesTo: 'melee',
  },
];

export const WEAPON_ABILITIES_BY_ID: Record<string, WeaponSpecialAbilityDef> = Object.fromEntries(
  WEAPON_SPECIAL_ABILITIES.map((a) => [a.id, a])
);

export const BANE_TARGET_TYPES = [
  'Aberration', 'Animal', 'Construct', 'Dragon', 'Fey',
  'Humanoid (Human)', 'Humanoid (Dwarf)', 'Humanoid (Elf)', 'Humanoid (Goblinoid)',
  'Humanoid (Orc)', 'Humanoid (Reptilian)', 'Magical Beast', 'Monstrous Humanoid',
  'Ooze', 'Outsider (Air)', 'Outsider (Chaotic)', 'Outsider (Earth)',
  'Outsider (Evil)', 'Outsider (Fire)', 'Outsider (Good)', 'Outsider (Lawful)',
  'Outsider (Water)', 'Plant', 'Undead', 'Vermin',
];
