import { Race } from '@/types/race';

export const kobold: Race = {
  name: 'Kobold',
  source: 'ARG',
  description:
    'Kobolds are small, reptilian humanoids who claim descent from dragons. They live in extensive tunnel networks in the underdark and mountainous regions, relying on traps, ambushes, and overwhelming numbers to defeat enemies.',
  size: 'Small',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'str', modifier: -4 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Armor',
      description:
        'Kobolds have a +1 natural armor bonus.',
    },
    {
      name: 'Crafty',
      description:
        'Kobolds gain a +2 racial bonus on Craft (trapmaking), Perception, and Profession (miner) checks. Craft (trapmaking) and Stealth are always class skills for a kobold.',
    },
    {
      name: 'Light Sensitivity',
      description:
        'Kobolds are dazzled in areas of bright sunlight or within the radius of a daylight spell.',
    },
  ],
  skillBonuses: [
    { skill: 'Craft', bonus: 2 },
    { skill: 'Perception', bonus: 2 },
  ],
  languages: ['Draconic'],
  bonusLanguages: ['Common', 'Dwarven', 'Gnome', 'Undercommon'],
};
