import { Race } from '@/types/race';

export const tiefling: Race = {
  name: 'Tiefling',
  source: 'ARG',
  description:
    'Tieflings are humans with fiendish heritage, bearing the taint of an evil outsider in their bloodline. While often distrusted and feared, many overcome their dark origins to become heroes.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'int', modifier: 2 },
    { ability: 'cha', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Fiendish Resistance',
      description:
        'Tieflings have cold resistance 5, electricity resistance 5, and fire resistance 5.',
    },
    {
      name: 'Skilled',
      description:
        'Tieflings gain a +2 racial bonus on Bluff and Stealth checks.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Tieflings can use darkness once per day as a spell-like ability (caster level equals the tiefling's class level).",
    },
    {
      name: 'Fiendish Sorcery',
      description:
        'Tiefling sorcerers with the Abyssal or Infernal bloodlines treat their Charisma score as 2 points higher for all sorcerer class abilities.',
    },
    {
      name: 'Prehensile Tail',
      description:
        'Many tieflings have tails they can use to carry small items. While they cannot wield weapons with their tails, they can retrieve small stowed objects as a swift action.',
    },
  ],
  skillBonuses: [
    { skill: 'Bluff', bonus: 2 },
    { skill: 'Stealth', bonus: 2 },
  ],
  languages: ['Common', 'Infernal'],
  bonusLanguages: ['Abyssal', 'Draconic', 'Dwarven', 'Elven', 'Gnome', 'Goblin', 'Halfling', 'Orc'],
};
