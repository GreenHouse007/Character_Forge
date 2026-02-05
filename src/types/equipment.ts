import { DamageType, DiceRoll, Source } from './common';

export type WeaponCategory = 'Simple' | 'Martial' | 'Exotic';
export type WeaponType = 'Unarmed' | 'Light Melee' | 'One-Handed Melee' | 'Two-Handed Melee' | 'Ranged';
export type ArmorCategory = 'Light' | 'Medium' | 'Heavy' | 'Shield';

export interface Weapon {
  name: string;
  category: WeaponCategory;
  type: WeaponType;
  cost: number; // in gold pieces
  damage: DiceRoll;
  critical: { range: number; multiplier: number };
  damageType: DamageType[];
  range?: number; // in feet, for ranged
  weight: number;
  special?: string[];
  source: Source;
}

export interface Armor {
  name: string;
  category: ArmorCategory;
  cost: number;
  acBonus: number;
  maxDex: number | null; // null = no limit
  armorCheckPenalty: number;
  arcaneSpellFailure: number;
  speed30: number; // speed if base 30
  speed20: number; // speed if base 20
  weight: number;
  source: Source;
}

export interface AdventuringGear {
  name: string;
  cost: number; // in gold pieces
  weight: number;
  description: string;
  source: Source;
}

export type EquipmentItem =
  | { type: 'weapon'; item: Weapon; quantity: number; equipped?: boolean }
  | { type: 'armor'; item: Armor; quantity: number; equipped?: boolean }
  | { type: 'gear'; item: AdventuringGear; quantity: number; equipped?: boolean };

export interface CharacterInventory {
  equipment: EquipmentItem[];
  gold: number;
  silver: number;
  copper: number;
}
