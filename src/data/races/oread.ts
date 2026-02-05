import { Race } from '@/types/race';

export const oread: Race = {
  name: 'Oread',
  source: 'ARG',
  description:
    'Oreads are humans with the blood of earth elementals, such as shaitans. They are strong and stoic, with skin that resembles stone or earth. Oreads are patient and deliberate, valuing stability and tradition.',
  size: 'Medium',
  speed: 20,
  abilityModifiers: [
    { ability: 'str', modifier: 2 },
    { ability: 'wis', modifier: 2 },
    { ability: 'cha', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Energy Resistance',
      description: 'Oreads have acid resistance 5.',
    },
    {
      name: 'Earth Affinity',
      description:
        'Oread sorcerers with the elemental (earth) bloodline treat their Charisma score as 2 points higher for all sorcerer class abilities. Oread spellcasters with the Earth domain use their domain powers and spells at +1 caster level.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Oreads can use magic stone once per day as a spell-like ability (caster level equals the oread's total character level).",
    },
  ],
  languages: ['Common', 'Terran'],
  bonusLanguages: ['Aquan', 'Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Ignan', 'Undercommon'],
};
