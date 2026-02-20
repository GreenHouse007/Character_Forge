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

  // Belt of Giant Strength +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Belt of Giant Strength +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'belt' as const,
    description: `Grants a +${n} enhancement bonus to Strength.`,
    modifiers: [{ type: 'ability' as const, ability: 'str' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Belt of Incredible Dexterity +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Belt of Incredible Dexterity +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'belt' as const,
    description: `Grants a +${n} enhancement bonus to Dexterity.`,
    modifiers: [{ type: 'ability' as const, ability: 'dex' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Belt of Mighty Constitution +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Belt of Mighty Constitution +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'belt' as const,
    description: `Grants a +${n} enhancement bonus to Constitution.`,
    modifiers: [{ type: 'ability' as const, ability: 'con' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Headband of Vast Intelligence +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Headband of Vast Intelligence +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'head' as const,
    description: `Grants a +${n} enhancement bonus to Intelligence.`,
    modifiers: [{ type: 'ability' as const, ability: 'int' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Headband of Inspired Wisdom +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Headband of Inspired Wisdom +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'head' as const,
    description: `Grants a +${n} enhancement bonus to Wisdom.`,
    modifiers: [{ type: 'ability' as const, ability: 'wis' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Headband of Alluring Charisma +2/+4/+6
  ...([2, 4, 6] as const).map((n) => ({
    name: `Headband of Alluring Charisma +${n}`,
    cost: n * n * 1000,
    weight: 1,
    slot: 'head' as const,
    description: `Grants a +${n} enhancement bonus to Charisma.`,
    modifiers: [{ type: 'ability' as const, ability: 'cha' as const, bonusType: 'enhancement' as const, value: n }],
    source: 'CRB',
  })),

  // Utility items (no mechanical bonus)
  { name: 'Handy Haversack', cost: 2000, weight: 5, slot: 'none' as const, description: 'A backpack with three interior compartments that hold far more than a normal pack. Objects placed inside can be retrieved as a move action.', modifiers: [], source: 'CRB' },
  { name: 'Bag of Holding (Type I)', cost: 2500, weight: 15, slot: 'none' as const, description: 'Holds up to 250 lbs / 30 cu. ft. regardless of the weight or size of the contents.', modifiers: [], source: 'CRB' },
  { name: 'Bag of Holding (Type II)', cost: 5000, weight: 25, slot: 'none' as const, description: 'Holds up to 500 lbs / 70 cu. ft.', modifiers: [], source: 'CRB' },
  { name: 'Boots of Speed', cost: 12000, weight: 1, slot: 'feet' as const, description: 'Grants haste for up to 10 rounds per day (free action activation).', modifiers: [], source: 'CRB' },
  { name: 'Boots of Elvenkind', cost: 2500, weight: 1, slot: 'feet' as const, description: 'Grants a +5 competence bonus on Acrobatics checks to move silently.', modifiers: [], source: 'CRB' },
  { name: 'Muleback Cords', cost: 1000, weight: 0, slot: 'shoulders' as const, description: 'Treated as having Strength 8 higher than normal when determining carrying capacity.', modifiers: [], source: 'APG' },
];

export const WONDROUS_ITEMS_BY_NAME: Record<string, WondrousItem> = Object.fromEntries(
  WONDROUS_ITEMS.map((item) => [item.name, item])
);
