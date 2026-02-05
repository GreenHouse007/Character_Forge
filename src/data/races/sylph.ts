import { Race } from '@/types/race';

export const sylph: Race = {
  name: 'Sylph',
  source: 'ARG',
  description:
    'Sylphs are humans with the blood of air elementals, such as djinn. They are flighty and capricious, with pale skin and hair that flows as if in a constant breeze. Sylphs value freedom and despise confinement.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'int', modifier: 2 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Energy Resistance',
      description: 'Sylphs have electricity resistance 5.',
    },
    {
      name: 'Air Affinity',
      description:
        'Sylph sorcerers with the elemental (air) bloodline treat their Charisma score as 2 points higher for all sorcerer class abilities. Sylph spellcasters with the Air domain use their domain powers and spells at +1 caster level.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Sylphs can use feather fall once per day as a spell-like ability (caster level equals the sylph's total character level).",
    },
  ],
  languages: ['Common', 'Auran'],
  bonusLanguages: ['Aquan', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Terran'],
};
