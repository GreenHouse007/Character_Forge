import { WeaponMaterial, WeaponAbilityEntry } from '@/types/equipment';
import { WEAPON_MATERIALS_BY_ID } from '@/data/equipment/weapon-materials';
import { WEAPON_ABILITIES_BY_ID } from '@/data/equipment/weapon-abilities';

export interface WeaponCostBreakdown {
  total: number;
  breakdown: { label: string; value: number }[];
}

export function calculateWeaponCost(
  baseCost: number,
  weight: number,
  masterwork: boolean,
  enhancementBonus: number,
  specialAbilities: WeaponAbilityEntry[],
  material: WeaponMaterial
): WeaponCostBreakdown {
  const breakdown: { label: string; value: number }[] = [];

  // 1. Base weapon cost
  breakdown.push({ label: 'Base weapon', value: baseCost });

  // 2. Material modifier
  const mat = WEAPON_MATERIALS_BY_ID[material];
  const materialExtra = mat.costModifier(baseCost, weight);
  if (materialExtra > 0) {
    breakdown.push({ label: `${mat.name} material`, value: materialExtra });
  }

  // 3. Masterwork / Magic
  const isMagic = enhancementBonus > 0;

  if (isMagic) {
    // Magic weapons include masterwork cost in the enchantment pricing
    // Total ability equivalent bonus
    const abilityEquiv = specialAbilities.reduce((sum, a) => {
      const def = WEAPON_ABILITIES_BY_ID[a.id];
      return sum + (def?.equivalentBonus ?? 0);
    }, 0);

    const effectiveBonus = enhancementBonus + abilityEquiv;

    // Masterwork component (300gp, included in magic weapon cost)
    breakdown.push({ label: 'Masterwork', value: 300 });

    // Magic cost: effective bonus² × 2000gp (minus the masterwork 300 since that's separate)
    const magicCost = effectiveBonus * effectiveBonus * 2000;
    breakdown.push({ label: `+${effectiveBonus} effective enchantment`, value: magicCost });

    // Cold iron extra enchantment cost
    if (mat.enchantmentCostExtra > 0) {
      breakdown.push({ label: `${mat.name} enchantment surcharge`, value: mat.enchantmentCostExtra });
    }
  } else if (masterwork) {
    breakdown.push({ label: 'Masterwork', value: 300 });
  }

  const total = breakdown.reduce((sum, b) => sum + b.value, 0);
  return { total, breakdown };
}

export function getEffectiveBonus(enhancementBonus: number, specialAbilities: WeaponAbilityEntry[]): number {
  const abilityEquiv = specialAbilities.reduce((sum, a) => {
    const def = WEAPON_ABILITIES_BY_ID[a.id];
    return sum + (def?.equivalentBonus ?? 0);
  }, 0);
  return enhancementBonus + abilityEquiv;
}

export function isValidEnhancement(enhancementBonus: number, specialAbilities: WeaponAbilityEntry[]): boolean {
  return getEffectiveBonus(enhancementBonus, specialAbilities) <= 10;
}
