import { DamageType, DiceRoll, Source } from './common';

export type WeaponCategory = 'Simple' | 'Martial' | 'Exotic';
export type WeaponType = 'Unarmed' | 'Light Melee' | 'One-Handed Melee' | 'Two-Handed Melee' | 'Ranged' | 'Ammunition';
export type ArmorCategory = 'Light' | 'Medium' | 'Heavy' | 'Shield';
export type ArmorQuality = 'standard' | 'masterwork';
export type ArmorMaterial = 'standard' | 'mithral' | 'adamantine';
export type WeaponMaterial = 'standard' | 'cold iron' | 'alchemical silver' | 'adamantine' | 'mithral';

export interface WeaponAbilityEntry {
  id: string;
  target?: string; // for Bane: creature type
}

export interface ArmorAbilityEntry {
  id: string;
}

export type ACBonusType = 'deflection' | 'natural' | 'armor' | 'shield' | 'insight' | 'dodge';
export type SaveBonusType = 'resistance';

export interface WondrousItemModifier {
  type: 'ac' | 'save';
  bonusType: ACBonusType | SaveBonusType;
  value: number;
}

export interface WondrousItem {
  name: string;
  cost: number;
  weight: number;
  slot: 'ring' | 'neck' | 'wrists' | 'shoulders' | 'body' | 'none';
  description: string;
  modifiers: WondrousItemModifier[];
  source: Source;
}

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

export interface MagicItem {
  name: string;
  group: string;
  slot: string;
  price: number;
  cost: number; // = price, needed for store's generic item.item.cost pattern
  weight: number;
  description: string;
  aura: string;
  casterLevel: number;
  source: string;
}

export type EquipmentItem =
  | {
      type: 'weapon';
      item: Weapon;
      quantity: number;
      equipped?: boolean;
      strengthRating?: number;
      masterwork?: boolean;
      enhancementBonus?: number;
      material?: WeaponMaterial;
      specialAbilities?: WeaponAbilityEntry[];
    }
  | { type: 'armor'; item: Armor; quantity: number; equipped?: boolean; quality?: ArmorQuality; material?: ArmorMaterial; enhancementBonus?: number; specialAbilities?: ArmorAbilityEntry[] }
  | { type: 'gear'; item: AdventuringGear; quantity: number; equipped?: boolean }
  | { type: 'wondrous'; item: WondrousItem; quantity: number; equipped?: boolean }
  | { type: 'magic'; item: MagicItem; quantity: number; equipped?: boolean };

export interface CharacterInventory {
  equipment: EquipmentItem[];
  gold: number;
  silver: number;
  copper: number;
}
