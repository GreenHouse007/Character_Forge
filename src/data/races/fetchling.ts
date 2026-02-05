import { Race } from '@/types/race';

export const fetchling: Race = {
  name: 'Fetchling',
  source: 'ARG',
  description:
    'Descended from humans trapped on the Shadow Plane, fetchlings are creatures of darkness and light, forever marked by their ancestors\' imprisonment in that gloomy realm.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'wis', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Shadow Blending',
      description:
        'Attacks against a fetchling in dim light have a 50% miss chance instead of the normal 20% miss chance. This ability does not grant total concealment; it just increases the miss chance.',
    },
    {
      name: 'Shadowy Resistance',
      description:
        'Fetchlings have cold resistance 5 and electricity resistance 5.',
    },
    {
      name: 'Skilled',
      description:
        'Fetchlings have a +2 racial bonus on Knowledge (planes) and Stealth checks.',
    },
    {
      name: 'Spell-Like Abilities',
      description:
        "A fetchling can use disguise self once per day as a spell-like ability (caster level equals the fetchling's total character level).",
    },
  ],
  skillBonuses: [
    { skill: 'Knowledge (Planes)', bonus: 2 },
    { skill: 'Stealth', bonus: 2 },
  ],
  languages: ['Common'],
  bonusLanguages: ['Aklo', 'Aquan', 'Auran', 'Draconic', 'D\'ziriak', 'Ignan', 'Terran', 'Any regional human language'],
};
