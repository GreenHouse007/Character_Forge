import { WondrousItem } from '@/types/equipment';

export const WONDROUS_ITEMS: WondrousItem[] = [
  // Ring of Protection +1 to +5
  ...([1, 2, 3, 4, 5] as const).map((n) => ({
    name: `Ring of Protection +${n}`,
    cost: n * n * 2000,
    weight: 0,
    slot: 'ring' as const,
    description: `Grants a +${n} deflection bonus to AC.`,
    modifiers: [{ type: 'ac' as const, bonusType: 'deflection' as const, value: n }],
    source: 'CRB',
  })),

  // Amulet of Natural Armor +1 to +5
  ...([1, 2, 3, 4, 5] as const).map((n) => ({
    name: `Amulet of Natural Armor +${n}`,
    cost: n * n * 2000,
    weight: 0,
    slot: 'neck' as const,
    description: `Grants a +${n} enhancement bonus to natural armor.`,
    modifiers: [{ type: 'ac' as const, bonusType: 'natural' as const, value: n }],
    source: 'CRB',
  })),

  // Bracers of Armor +1 to +8
  ...([1, 2, 3, 4, 5, 6, 7, 8] as const).map((n) => ({
    name: `Bracers of Armor +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'wrists' as const,
    description: `Grants a +${n} armor bonus to AC. Does not stack with worn armor.`,
    modifiers: [{ type: 'ac' as const, bonusType: 'armor' as const, value: n }],
    source: 'CRB',
  })),

  // Cloak of Resistance +1 to +5
  ...([1, 2, 3, 4, 5] as const).map((n) => ({
    name: `Cloak of Resistance +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'shoulders' as const,
    description: `Grants a +${n} resistance bonus on all saving throws.`,
    modifiers: [{ type: 'save' as const, bonusType: 'resistance' as const, value: n }],
    source: 'CRB',
  })),

  // Ioun Stone (Dusty Rose Prism)
  {
    name: 'Ioun Stone (Dusty Rose Prism)',
    cost: 5000,
    weight: 0,
    slot: 'none',
    description: 'Grants a +1 insight bonus to AC.',
    modifiers: [{ type: 'ac', bonusType: 'insight', value: 1 }],
    source: 'CRB',
  },
];

export const WONDROUS_ITEMS_BY_NAME: Record<string, WondrousItem> = Object.fromEntries(
  WONDROUS_ITEMS.map((item) => [item.name, item])
);
