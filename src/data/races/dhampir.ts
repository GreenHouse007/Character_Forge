import { Race } from '@/types/race';

export const dhampir: Race = {
  name: 'Dhampir',
  source: 'ARG',
  description:
    'The half-living children of vampires birthed by human females, dhampirs are progenies of both horror and sadness. Outcast and hunted, they struggle to find acceptance in a world that fears their heritage.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Undead Resistance',
      description:
        'Dhampirs gain a +2 racial bonus on saving throws against disease and mind-affecting effects.',
    },
    {
      name: 'Resist Level Drain',
      description:
        'A dhampir takes no penalties from energy drain effects, though he can still be killed if he accrues more negative levels than he has Hit Dice. After 24 hours, any negative levels a dhampir takes are removed without the need for an additional saving throw.',
    },
    {
      name: 'Negative Energy Affinity',
      description:
        'Though a living creature, a dhampir reacts to positive and negative energy as if it were undead—positive energy harms it, while negative energy heals it.',
    },
    {
      name: 'Light Sensitivity',
      description:
        'Dhampirs are dazzled in areas of bright sunlight or within the radius of a daylight spell.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Dhampirs can use detect undead three times per day as a spell-like ability (caster level equals the dhampir's class level).",
    },
  ],
  skillBonuses: [
    { skill: 'Bluff', bonus: 2 },
    { skill: 'Perception', bonus: 2 },
  ],
  languages: ['Common'],
  bonusLanguages: ['Abyssal', 'Aklo', 'Draconic', 'Elven', 'Giant', 'Gnoll', 'Halfling', 'Infernal', 'Orc', 'Undercommon'],
};
