import { Race } from '@/types/race';

export const elf: Race = {
  name: 'Elf',
  source: 'CRB',
  description:
    'Elves are a long-lived race of beautiful and graceful beings, deeply attuned to the natural world. They tend to be aloof and possess an otherworldly quality, viewing the younger races with a mixture of curiosity and quiet condescension.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'int', modifier: 2 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Elven Immunities',
      description:
        'Elves are immune to magic sleep effects and gain a +2 racial saving throw bonus against enchantment spells and effects.',
    },
    {
      name: 'Elven Magic',
      description:
        'Elves receive a +2 racial bonus on caster level checks made to overcome spell resistance. In addition, elves receive a +2 racial bonus on Spellcraft skill checks made to identify the properties of magic items.',
    },
    {
      name: 'Keen Senses',
      description: 'Elves receive a +2 racial bonus on Perception checks.',
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Elves are proficient with longbows (including composite longbows), longswords, rapiers, and shortbows (including composite shortbows), and treat any weapon with the word "elven" in its name as a martial weapon.',
    },
  ],
  skillBonuses: [
    { skill: 'Perception', bonus: 2 },
    { skill: 'Spellcraft', bonus: 2 },
  ],
  languages: ['Common', 'Elven'],
  bonusLanguages: [
    'Celestial',
    'Draconic',
    'Gnoll',
    'Gnome',
    'Goblin',
    'Orc',
    'Sylvan',
  ],
};
