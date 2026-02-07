import { WeaponMaterial } from '@/types/equipment';

export interface WeaponMaterialDef {
  id: WeaponMaterial;
  name: string;
  costModifier: (baseCost: number, weight: number) => number;
  enchantmentCostExtra: number;
  weightMultiplier: number;
  damageModifier: number;
  description: string;
}

export const WEAPON_MATERIALS: WeaponMaterialDef[] = [
  {
    id: 'standard',
    name: 'Standard',
    costModifier: () => 0,
    enchantmentCostExtra: 0,
    weightMultiplier: 1,
    damageModifier: 0,
    description: 'Normal weapon materials.',
  },
  {
    id: 'cold iron',
    name: 'Cold Iron',
    costModifier: (baseCost) => baseCost, // doubles base cost (extra = baseCost)
    enchantmentCostExtra: 2000,
    weightMultiplier: 1,
    damageModifier: 0,
    description: 'Effective against fey and demons. Costs double to craft and +2,000gp extra to enchant.',
  },
  {
    id: 'alchemical silver',
    name: 'Alchemical Silver',
    costModifier: () => 20,
    enchantmentCostExtra: 0,
    weightMultiplier: 1,
    damageModifier: -1,
    description: 'Effective against lycanthropes and some devils. -1 damage penalty.',
  },
  {
    id: 'adamantine',
    name: 'Adamantine',
    costModifier: () => 3000,
    enchantmentCostExtra: 0,
    weightMultiplier: 1,
    damageModifier: 0,
    description: 'Bypasses hardness of less than 20. Automatically masterwork.',
  },
  {
    id: 'mithral',
    name: 'Mithral',
    costModifier: (_baseCost, weight) => weight * 500,
    enchantmentCostExtra: 0,
    weightMultiplier: 0.5,
    damageModifier: 0,
    description: 'Half weight. Automatically masterwork.',
  },
];

export const WEAPON_MATERIALS_BY_ID: Record<WeaponMaterial, WeaponMaterialDef> = Object.fromEntries(
  WEAPON_MATERIALS.map((m) => [m.id, m])
) as Record<WeaponMaterial, WeaponMaterialDef>;
