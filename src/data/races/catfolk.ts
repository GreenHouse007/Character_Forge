import { Race } from '@/types/race';

export const catfolk: Race = {
  name: 'Catfolk',
  source: 'ARG',
  description:
    'A race of catlike humanoids, the catfolk are a people of curiosity and adventure. They are quick, agile, and naturally stealthy, with an inherent curiosity that often gets them into trouble.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'wis', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  lowLightVision: true,
  racialTraits: [
    {
      name: "Cat's Luck",
      description:
        'Once per day when a catfolk makes a Reflex saving throw, he can roll the saving throw twice and take the better result. He must decide to use this ability before the saving throw is attempted.',
    },
    {
      name: 'Natural Hunter',
      description:
        'Catfolk receive a +2 racial bonus on Perception, Stealth, and Survival checks.',
    },
    {
      name: 'Sprinter',
      description:
        'Catfolk gain a 10-foot racial bonus to their speed when using the charge, run, or withdraw actions.',
    },
  ],
  skillBonuses: [
    { skill: 'Perception', bonus: 2 },
    { skill: 'Stealth', bonus: 2 },
    { skill: 'Survival', bonus: 2 },
  ],
  languages: ['Common', 'Catfolk'],
  bonusLanguages: ['Elven', 'Gnoll', 'Gnome', 'Goblin', 'Halfling', 'Orc', 'Sylvan'],
};
