import { Race } from '@/types/race';

export const aasimar: Race = {
  name: 'Aasimar',
  source: 'ARG',
  description:
    'Aasimars are humans with a significant amount of celestial or other good outsider blood in their ancestry. While not always combative, aasimars possess an innate resistance to evil and a natural inclination toward good.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'wis', modifier: 2 },
    { ability: 'cha', modifier: 2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Celestial Resistance',
      description:
        'Aasimars have acid resistance 5, cold resistance 5, and electricity resistance 5.',
    },
    {
      name: 'Skilled',
      description:
        'Aasimars gain a +2 racial bonus on Diplomacy and Perception checks.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Aasimars can use daylight once per day as a spell-like ability (caster level equals the aasimar's class level).",
    },
  ],
  skillBonuses: [
    { skill: 'Diplomacy', bonus: 2 },
    { skill: 'Perception', bonus: 2 },
  ],
  languages: ['Common', 'Celestial'],
  bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Sylvan'],
};
