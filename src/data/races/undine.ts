import { Race } from '@/types/race';

export const undine: Race = {
  name: 'Undine',
  source: 'ARG',
  description:
    'Undines are humans with the blood of water elementals, such as marids. They are graceful and fluid in their movements, with skin that ranges from pale blue to deep sea-green. Undines are drawn to water and feel most at home near oceans, rivers, or lakes.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'wis', modifier: 2 },
    { ability: 'str', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Energy Resistance',
      description: 'Undines have cold resistance 5.',
    },
    {
      name: 'Water Affinity',
      description:
        'Undine sorcerers with the elemental (water) bloodline treat their Charisma score as 2 points higher for all sorcerer class abilities. Undine spellcasters with the Water domain use their domain powers and spells at +1 caster level.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Undines can use hydraulic push once per day as a spell-like ability (caster level equals the undine's total character level).",
    },
    {
      name: 'Swim',
      description:
        'Undines have a swim speed of 30 feet and gain the +8 racial bonus on Swim checks that a swim speed normally grants.',
    },
  ],
  skillBonuses: [
    { skill: 'Swim', bonus: 8 },
  ],
  languages: ['Common', 'Aquan'],
  bonusLanguages: ['Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Terran'],
};
