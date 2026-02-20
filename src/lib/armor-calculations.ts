import { Armor, ArmorCategory, ArmorQuality, ArmorMaterial, ArmorAbilityEntry } from '@/types/equipment';
import { ARMOR_ABILITIES_BY_ID } from '@/data/equipment/armor-abilities';

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
 * Get modified armor stats based on quality, material, and enhancement bonus
 */
export function getModifiedArmorStats(
  armor: Armor,
  quality?: ArmorQuality,
  material?: ArmorMaterial,
  enhancementBonus?: number
): ModifiedArmorStats {
  const result: ModifiedArmorStats = {
    acBonus: armor.acBonus,
    maxDex: armor.maxDex,
    armorCheckPenalty: armor.armorCheckPenalty,
    arcaneSpellFailure: armor.arcaneSpellFailure,
    weight: armor.weight,
    category: armor.category,
  };

  // Masterwork: -1 armor check penalty (magic items are inherently masterwork)
  if (quality === 'masterwork' || (enhancementBonus && enhancementBonus > 0)) {
    result.armorCheckPenalty = Math.min(0, result.armorCheckPenalty + 1);
  }

  // Enhancement bonus adds to AC but does NOT change maxDex, ACP, or ASF
  if (enhancementBonus && enhancementBonus > 0) {
    result.acBonus += enhancementBonus;
  }

  // Mithral modifications
  if (material === 'mithral') {
    // -3 armor check penalty (includes the masterwork -1)
    result.armorCheckPenalty = Math.min(0, armor.armorCheckPenalty + 3);
    // +2 max dex bonus
    result.maxDex = result.maxDex !== null ? armor.maxDex! + 2 : null;
    // Half weight
    result.weight = Math.floor(armor.weight / 2);
    // -10% arcane spell failure
    result.arcaneSpellFailure = Math.max(0, armor.arcaneSpellFailure - 10);
    // Category drops by one step
    result.category = getEffectiveCategory(armor.category, material);
  }

  // Adamantine: provides DR, but no stat changes other than quality bonus
  // DR is handled separately in game effects

  return result;
}

/**
 * Get the effective enhancement bonus of armor (enhancement + special abilities)
 */
export function getArmorEffectiveBonus(
  enhancementBonus?: number,
  specialAbilities?: ArmorAbilityEntry[]
): number {
  let total = enhancementBonus ?? 0;
  if (specialAbilities) {
    for (const ability of specialAbilities) {
      const def = ARMOR_ABILITIES_BY_ID[ability.id];
      if (def) total += def.equivalentBonus;
    }
  }
  return total;
}

/**
 * Check if an armor enhancement configuration is valid (effective bonus <= 10, enhancement <= 5)
 */
export function isValidArmorEnhancement(
  enhancementBonus: number,
  specialAbilities?: ArmorAbilityEntry[]
): boolean {
  if (enhancementBonus < 1 || enhancementBonus > 5) return false;
  const effective = getArmorEffectiveBonus(enhancementBonus, specialAbilities);
  return effective <= 10;
}

/**
 * Calculate the total cost of armor with quality, material, and enchantment
 */
export function calculateArmorCost(
  baseCost: number,
  category: ArmorCategory,
  quality?: ArmorQuality,
  material?: ArmorMaterial,
  enhancementBonus?: number,
  specialAbilities?: ArmorAbilityEntry[]
): number {
  let cost = baseCost;

  const isMagic = enhancementBonus && enhancementBonus > 0;

  // Masterwork adds 150gp (magic items include masterwork cost)
  if (quality === 'masterwork' || material === 'mithral' || material === 'adamantine' || isMagic) {
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
      case 'Shield':
        cost += 10000;
        break;
    }
  }

  // Magic enhancement cost: effective_bonus² × 1000gp
  if (isMagic) {
    const effectiveBonus = getArmorEffectiveBonus(enhancementBonus, specialAbilities);
    cost += effectiveBonus * effectiveBonus * 1000;
  }

  return cost;
}

export interface ArmorCostBreakdownEntry {
  label: string;
  value: number;
}

/**
 * Get an itemized cost breakdown for armor
 */
export function calculateArmorCostBreakdown(
  baseCost: number,
  category: ArmorCategory,
  quality?: ArmorQuality,
  material?: ArmorMaterial,
  enhancementBonus?: number,
  specialAbilities?: ArmorAbilityEntry[]
): ArmorCostBreakdownEntry[] {
  const entries: ArmorCostBreakdownEntry[] = [];
  entries.push({ label: 'Base armor', value: baseCost });

  const isMagic = enhancementBonus && enhancementBonus > 0;

  if (quality === 'masterwork' || material === 'mithral' || material === 'adamantine' || isMagic) {
    entries.push({ label: 'Masterwork', value: 150 });
  }

  if (material === 'mithral') {
    entries.push({ label: 'Mithral', value: getMithralCost(category) });
  }

  if (material === 'adamantine') {
    const adamCost = category === 'Light' ? 5000 : category === 'Medium' ? 10000 : category === 'Heavy' ? 15000 : category === 'Shield' ? 10000 : 0;
    if (adamCost > 0) entries.push({ label: 'Adamantine', value: adamCost });
  }

  if (isMagic) {
    const effectiveBonus = getArmorEffectiveBonus(enhancementBonus, specialAbilities);
    entries.push({ label: `Magic (+${effectiveBonus} effective)`, value: effectiveBonus * effectiveBonus * 1000 });
  }

  return entries;
}

/**
 * Format armor name with quality, material, enhancement, and abilities
 */
export function formatArmorName(
  baseName: string,
  quality?: ArmorQuality,
  material?: ArmorMaterial,
  enhancementBonus?: number,
  specialAbilities?: ArmorAbilityEntry[]
): string {
  const parts: string[] = [];

  // Enhancement prefix (e.g., "+2")
  if (enhancementBonus && enhancementBonus > 0) {
    parts.push(`+${enhancementBonus}`);
  }

  // Special ability names
  if (specialAbilities && specialAbilities.length > 0) {
    for (const ability of specialAbilities) {
      const def = ARMOR_ABILITIES_BY_ID[ability.id];
      if (def) parts.push(def.name);
    }
  }

  // Material (only show if no enhancement, since material is secondary for magic items)
  if (material === 'mithral') {
    parts.push('Mithral');
  } else if (material === 'adamantine') {
    parts.push('Adamantine');
  } else if (quality === 'masterwork' && !enhancementBonus) {
    parts.push('Masterwork');
  }

  parts.push(baseName);

  return parts.join(' ');
}
