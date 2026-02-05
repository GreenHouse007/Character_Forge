import { Race } from '@/types/race';

export const ifrit: Race = {
  name: 'Ifrit',
  source: 'ARG',
  description:
    'Ifrits are humans descended from beings of elemental fire, such as efreet. They have fiery tempers and are drawn to hot, arid environments. Their hair flickers and waves as if made of flames, and their skin tends toward red or bronze.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'wis', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Energy Resistance',
      description: 'Ifrits have fire resistance 5.',
    },
    {
      name: 'Fire Affinity',
      description:
        'Ifrit sorcerers with the elemental (fire) bloodline treat their Charisma score as 2 points higher for all sorcerer class abilities. Ifrit spellcasters with the Fire domain use their domain powers and spells at +1 caster level.',
    },
    {
      name: 'Spell-Like Ability',
      description:
        "Ifrits can use burning hands once per day as a spell-like ability (caster level equals the ifrit's total character level).",
    },
  ],
  languages: ['Common', 'Ignan'],
  bonusLanguages: ['Aquan', 'Auran', 'Dwarven', 'Elven', 'Gnome', 'Halfling', 'Terran'],
};
