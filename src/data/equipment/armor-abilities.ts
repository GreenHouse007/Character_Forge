export interface ArmorSpecialAbilityDef {
  id: string;
  name: string;
  equivalentBonus: number;
  description: string;
  appliesTo: 'armor' | 'shield' | 'all';
}

export const ARMOR_SPECIAL_ABILITIES: ArmorSpecialAbilityDef[] = [
  {
    id: 'fortificationLight',
    name: 'Fortification (Light)',
    equivalentBonus: 1,
    description: '25% chance to negate critical hits and sneak attacks.',
    appliesTo: 'all',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    equivalentBonus: 1,
    description: '+5 competence bonus on Stealth checks.',
    appliesTo: 'armor',
  },
  {
    id: 'slick',
    name: 'Slick',
    equivalentBonus: 1,
    description: '+5 competence bonus on Escape Artist checks.',
    appliesTo: 'armor',
  },
  {
    id: 'spellResistance13',
    name: 'Spell Resistance (13)',
    equivalentBonus: 2,
    description: 'Grants SR 13 to the wearer.',
    appliesTo: 'armor',
  },
  {
    id: 'fortificationModerate',
    name: 'Fortification (Moderate)',
    equivalentBonus: 3,
    description: '50% chance to negate critical hits and sneak attacks.',
    appliesTo: 'all',
  },
  {
    id: 'ghostTouchArmor',
    name: 'Ghost Touch',
    equivalentBonus: 3,
    description: 'Armor bonus counts against incorporeal touch attacks.',
    appliesTo: 'all',
  },
  {
    id: 'invulnerability',
    name: 'Invulnerability',
    equivalentBonus: 3,
    description: 'Grants DR 5/magic to the wearer.',
    appliesTo: 'armor',
  },
  {
    id: 'shadowImproved',
    name: 'Shadow (Improved)',
    equivalentBonus: 3,
    description: '+10 competence bonus on Stealth checks.',
    appliesTo: 'armor',
  },
  {
    id: 'slickImproved',
    name: 'Slick (Improved)',
    equivalentBonus: 3,
    description: '+10 competence bonus on Escape Artist checks.',
    appliesTo: 'armor',
  },
  {
    id: 'spellResistance17',
    name: 'Spell Resistance (17)',
    equivalentBonus: 4,
    description: 'Grants SR 17 to the wearer.',
    appliesTo: 'armor',
  },
  {
    id: 'fortificationHeavy',
    name: 'Fortification (Heavy)',
    equivalentBonus: 5,
    description: '75% chance to negate critical hits and sneak attacks.',
    appliesTo: 'all',
  },
  {
    id: 'shadowGreater',
    name: 'Shadow (Greater)',
    equivalentBonus: 5,
    description: '+15 competence bonus on Stealth checks.',
    appliesTo: 'armor',
  },
];

export const ARMOR_ABILITIES_BY_ID: Record<string, ArmorSpecialAbilityDef> = Object.fromEntries(
  ARMOR_SPECIAL_ABILITIES.map((a) => [a.id, a])
);
