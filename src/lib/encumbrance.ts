import { EquipmentItem } from '@/types/equipment';

/** Carrying capacity thresholds by Strength score (index = Str score) */
const CARRY_CAPACITY: { light: number; medium: number; heavy: number }[] = [
  { light: 0, medium: 0, heavy: 0 },       // 0
  { light: 3, medium: 6, heavy: 10 },       // 1
  { light: 6, medium: 13, heavy: 20 },      // 2
  { light: 10, medium: 20, heavy: 30 },     // 3
  { light: 13, medium: 26, heavy: 40 },     // 4
  { light: 16, medium: 33, heavy: 50 },     // 5
  { light: 20, medium: 40, heavy: 60 },     // 6
  { light: 23, medium: 46, heavy: 70 },     // 7
  { light: 26, medium: 53, heavy: 80 },     // 8
  { light: 30, medium: 60, heavy: 90 },     // 9
  { light: 33, medium: 66, heavy: 100 },    // 10
  { light: 38, medium: 76, heavy: 115 },    // 11
  { light: 43, medium: 86, heavy: 130 },    // 12
  { light: 50, medium: 100, heavy: 150 },   // 13
  { light: 58, medium: 116, heavy: 175 },   // 14
  { light: 66, medium: 133, heavy: 200 },   // 15
  { light: 76, medium: 153, heavy: 230 },   // 16
  { light: 86, medium: 173, heavy: 260 },   // 17
  { light: 100, medium: 200, heavy: 300 },  // 18
  { light: 116, medium: 233, heavy: 350 },  // 19
  { light: 133, medium: 266, heavy: 400 },  // 20
  { light: 153, medium: 306, heavy: 460 },  // 21
  { light: 173, medium: 346, heavy: 520 },  // 22
  { light: 200, medium: 400, heavy: 600 },  // 23
  { light: 233, medium: 466, heavy: 700 },  // 24
  { light: 266, medium: 533, heavy: 800 },  // 25
  { light: 306, medium: 613, heavy: 920 },  // 26
  { light: 346, medium: 693, heavy: 1040 }, // 27
  { light: 400, medium: 800, heavy: 1200 }, // 28
  { light: 466, medium: 933, heavy: 1400 }, // 29
];

export type EncumbranceLevel = 'light' | 'medium' | 'heavy' | 'overloaded';

export interface EncumbranceInfo {
  totalWeight: number;
  lightMax: number;
  mediumMax: number;
  heavyMax: number;
  level: EncumbranceLevel;
}

export function getCarryCapacity(strScore: number): { light: number; medium: number; heavy: number } {
  if (strScore <= 0) return { light: 0, medium: 0, heavy: 0 };
  if (strScore < CARRY_CAPACITY.length) return CARRY_CAPACITY[strScore];

  // For Str > 29, use the pattern: every 10 points multiplies by 4
  const base = strScore % 10;
  const multiplier = Math.pow(4, Math.floor(strScore / 10) - 1);
  const baseCapacity = CARRY_CAPACITY[base + 10] ?? CARRY_CAPACITY[20];
  return {
    light: baseCapacity.light * multiplier,
    medium: baseCapacity.medium * multiplier,
    heavy: baseCapacity.heavy * multiplier,
  };
}

export function calculateTotalWeight(equipment: EquipmentItem[]): number {
  return equipment.reduce((total, entry) => {
    return total + entry.item.weight * entry.quantity;
  }, 0);
}

export function getEncumbrance(strScore: number, equipment: EquipmentItem[], sizeModifier: number = 1): EncumbranceInfo {
  const capacity = getCarryCapacity(strScore);
  const lightMax = Math.floor(capacity.light * sizeModifier);
  const mediumMax = Math.floor(capacity.medium * sizeModifier);
  const heavyMax = Math.floor(capacity.heavy * sizeModifier);
  const totalWeight = calculateTotalWeight(equipment);

  let level: EncumbranceLevel;
  if (totalWeight <= lightMax) level = 'light';
  else if (totalWeight <= mediumMax) level = 'medium';
  else if (totalWeight <= heavyMax) level = 'heavy';
  else level = 'overloaded';

  return { totalWeight, lightMax, mediumMax, heavyMax, level };
}

/** Small creatures carry 3/4 of these values, Large carry x2 */
export function getSizeCarryMultiplier(size: string): number {
  switch (size) {
    case 'Fine': return 1 / 8;
    case 'Diminutive': return 1 / 4;
    case 'Tiny': return 1 / 2;
    case 'Small': return 3 / 4;
    case 'Medium': return 1;
    case 'Large': return 2;
    case 'Huge': return 4;
    case 'Gargantuan': return 8;
    case 'Colossal': return 16;
    default: return 1;
  }
}
