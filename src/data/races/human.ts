import { Race } from '@/types/race';

export const human: Race = {
  name: 'Human',
  source: 'CRB',
  description:
    'Humans are the most adaptable and ambitious of the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds. Their short lifespans drive them to accomplish as much as they can in their brief years.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [],
  flexibleAbilityBonus: true,
  racialTraits: [
    {
      name: 'Bonus Feat',
      description:
        'Humans select one extra feat at 1st level.',
    },
    {
      name: 'Skilled',
      description:
        'Humans gain an additional skill rank at first level and one additional rank whenever they gain a level.',
    },
  ],
  languages: ['Common'],
  bonusLanguages: [
    'Abyssal',
    'Aklo',
    'Aquan',
    'Auran',
    'Celestial',
    'Draconic',
    'Dwarven',
    'Elven',
    'Giant',
    'Gnoll',
    'Gnome',
    'Goblin',
    'Halfling',
    'Ignan',
    'Infernal',
    'Orc',
    'Sylvan',
    'Terran',
    'Undercommon',
  ],
};
