import { Race } from '@/types/race';

export const drow: Race = {
  name: 'Drow',
  source: 'ARG',
  description:
    'Dark-skinned and white-haired, the drow are a cruel and cunning race who live deep underground. They are known for their treachery and their worship of demon lords.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'con', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 120,
  racialTraits: [
    {
      name: 'Drow Immunities',
      description:
        'Drow are immune to magic sleep effects and gain a +2 racial bonus on saving throws against enchantment spells and effects.',
    },
    {
      name: 'Spell Resistance',
      description:
        'Drow possess spell resistance equal to 6 + their class levels.',
    },
    {
      name: 'Keen Senses',
      description: 'Drow gain a +2 racial bonus on Perception checks.',
    },
    {
      name: 'Light Blindness',
      description:
        'Abrupt exposure to bright light blinds drow for 1 round; on subsequent rounds, they are dazzled as long as they remain in the affected area.',
    },
    {
      name: 'Poison Use',
      description: 'Drow are skilled in the use of poison and never risk accidentally poisoning themselves.',
    },
    {
      name: 'Spell-Like Abilities',
      description:
        "Drow can cast dancing lights, darkness, and faerie fire once per day each, using their total character level as caster level.",
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Drow are proficient with the hand crossbow, rapier, and short sword.',
    },
  ],
  skillBonuses: [
    { skill: 'Perception', bonus: 2 },
  ],
  languages: ['Elven', 'Undercommon'],
  bonusLanguages: ['Abyssal', 'Aklo', 'Aquan', 'Common', 'Draconic', 'Drow Sign Language', 'Gnome', 'Goblin'],
};
