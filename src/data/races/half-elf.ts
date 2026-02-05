import { Race } from '@/types/race';

export const halfElf: Race = {
  name: 'Half-Elf',
  source: 'CRB',
  description:
    'Half-elves are the offspring of humans and elves. They retain the best qualities of both parent races, combining human ambition and drive with elven grace and longevity. Despite this, they often feel isolated, belonging fully to neither race.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [],
  flexibleAbilityBonus: true,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Adaptability',
      description:
        'Half-elves receive Skill Focus as a bonus feat at 1st level.',
    },
    {
      name: 'Elf Blood',
      description:
        'Half-elves count as both elves and humans for any effect related to race.',
    },
    {
      name: 'Elven Immunities',
      description:
        'Half-elves are immune to magic sleep effects and gain a +2 racial saving throw bonus against enchantment spells and effects.',
    },
    {
      name: 'Keen Senses',
      description:
        'Half-elves receive a +2 racial bonus on Perception checks.',
    },
    {
      name: 'Multitalented',
      description:
        'Half-elves choose two favored classes at first level and gain +1 hit point or +1 skill point whenever they take a level in either one of those classes.',
    },
  ],
  skillBonuses: [{ skill: 'Perception', bonus: 2 }],
  languages: ['Common', 'Elven'],
  bonusLanguages: [
    'Abyssal',
    'Aklo',
    'Aquan',
    'Auran',
    'Celestial',
    'Draconic',
    'Dwarven',
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
  favoredClassBonusNote:
    'Half-elves choose two favored classes at 1st level instead of one.',
};
