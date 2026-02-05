import { Armor, ArmorCategory, ArmorQuality, ArmorMaterial } from '@/types/equipment';

export interface ModifiedArmorStats {
  acBonus: number;
  maxDex: number | null;
  armorCheckPenalty: number;
  arcaneSpellFailure: number;
  weight: number;
  category: ArmorCategory;
}

/**
 * Get mithral cost based on armor category
 */
export function getMithralCost(category: ArmorCategory): number {
  switch (category) {
    case 'Light':
      return 1000;
    case 'Medium':
      return 4000;
    case 'Heavy':
      return 9000;
    case 'Shield':
      return 1000;
    default:
      return 0;
  }
}

/**
 * Calculate the effective category of armor after material modifications
 * Mithral reduces category by one step (Heavy -> Medium -> Light)
 */
function getEffectiveCategory(category: ArmorCategory, material: ArmorMaterial): ArmorCategory {
  if (material !== 'mithral') return category;

  switch (category) {
    case 'Heavy':
      return 'Medium';
    case 'Medium':
      return 'Light';
    default:
      return category;
  }
}

/**
 * Get modified armor stats based on quality and material
 */
export function getModifiedArmorStats(
  armor: Armor,
  quality?: ArmorQuality,
  material?: ArmorMaterial
): ModifiedArmorStats {
  const result: ModifiedArmorStats = {
    acBonus: armor.acBonus,
    maxDex: armor.maxDex,
    armorCheckPenalty: armor.armorCheckPenalty,
    arcaneSpellFailure: armor.arcaneSpellFailure,
    weight: armor.weight,
    category: armor.category,
  };

  // Masterwork: -1 armor check penalty
  if (quality === 'masterwork') {
    result.armorCheckPenalty = Math.min(0, result.armorCheckPenalty + 1);
  }

  // Mithral modifications
  if (material === 'mithral') {
    // -3 armor check penalty
    result.armorCheckPenalty = Math.min(0, result.armorCheckPenalty + 3);
    // +2 max dex bonus
    result.maxDex = result.maxDex !== null ? result.maxDex + 2 : null;
    // Half weight
    result.weight = Math.floor(result.weight / 2);
    // -10% arcane spell failure
    result.arcaneSpellFailure = Math.max(0, result.arcaneSpellFailure - 10);
    // Category drops by one step
    result.category = getEffectiveCategory(armor.category, material);
  }

  // Adamantine: provides DR, but no stat changes other than quality bonus
  // DR is handled separately in game effects

  return result;
}

/**
 * Calculate the total cost of armor with quality and material
 */
export function calculateArmorCost(
  baseCost: number,
  category: ArmorCategory,
  quality?: ArmorQuality,
  material?: ArmorMaterial
): number {
  let cost = baseCost;

  // Masterwork adds 150gp
  if (quality === 'masterwork' || material === 'mithral' || material === 'adamantine') {
    cost += 150;
  }

  // Mithral cost varies by armor type
  if (material === 'mithral') {
    cost += getMithralCost(category);
  }

  // Adamantine cost varies by armor type
  if (material === 'adamantine') {
    switch (category) {
      case 'Light':
        cost += 5000;
        break;
      case 'Medium':
        cost += 10000;
        break;
      case 'Heavy':
        cost += 15000;
        break;
    }
  }

  return cost;
}

/**
 * Format armor name with quality and material
 */
export function formatArmorName(
  baseName: string,
  quality?: ArmorQuality,
  material?: ArmorMaterial
): string {
  const parts: string[] = [];

  if (material === 'mithral') {
    parts.push('Mithral');
  } else if (material === 'adamantine') {
    parts.push('Adamantine');
  } else if (quality === 'masterwork') {
    parts.push('Masterwork');
  }

  parts.push(baseName);

  return parts.join(' ');
}
