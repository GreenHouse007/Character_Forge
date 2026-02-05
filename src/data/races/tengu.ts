import { Race } from '@/types/race';

export const tengu: Race = {
  name: 'Tengu',
  source: 'ARG',
  description:
    'Tengu are a race of avian humanoids with crow-like heads. They are known for their love of shiny objects, their skill with swords, and their natural aptitude for languages. Tengu are often wanderers, making their way as merchants, thieves, or adventurers.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'wis', modifier: 2 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Sneaky',
      description:
        'Tengu gain a +2 racial bonus on Perception and Stealth checks.',
    },
    {
      name: 'Gifted Linguist',
      description:
        'Tengu gain a +4 racial bonus on Linguistics checks, and learn 2 languages each time they gain a rank in Linguistics rather than 1 language.',
    },
    {
      name: 'Swordtrained',
      description:
        'Tengu are trained from birth in swordplay, and as a result are automatically proficient with sword-like weapons (including bastard swords, daggers, elven curve blades, falchions, greatswords, kukris, longswords, punching daggers, rapiers, scimitars, short swords, and two-bladed swords).',
    },
    {
      name: 'Natural Weapon',
      description:
        'A tengu has a bite attack that deals 1d3 points of damage.',
    },
  ],
  skillBonuses: [
    { skill: 'Perception', bonus: 2 },
    { skill: 'Stealth', bonus: 2 },
    { skill: 'Linguistics', bonus: 4 },
  ],
  languages: ['Common', 'Tengu'],
  bonusLanguages: ['Any'],
};
