import { Race } from '@/types/race';

export const gnome: Race = {
  name: 'Gnome',
  source: 'CRB',
  description:
    'Gnomes are distant relatives of the fey, and their history tells of a time when they lived in the fey realm. Gnomes are one of the smallest of the common races, known for their eccentric behavior, boundless curiosity, and affinity for illusion magic.',
  size: 'Small',
  speed: 20,
  abilityModifiers: [
    { ability: 'con', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'str', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  lowLightVision: true,
  racialTraits: [
    {
      name: 'Defensive Training',
      description:
        'Gnomes gain a +4 dodge bonus to AC against monsters of the giant subtype.',
    },
    {
      name: 'Gnome Magic',
      description:
        'Gnomes add +1 to the DC of any saving throws against illusion spells that they cast. Gnomes with Charisma scores of 11 or higher also gain the following spell-like abilities: 1/day—dancing lights, ghost sound, prestidigitation, and speak with animals. The caster level for these effects is equal to the gnome\'s character level. The DC for these spells is equal to 10 + the spell\'s level + the gnome\'s Charisma modifier.',
    },
    {
      name: 'Hatred',
      description:
        'Gnomes receive a +1 bonus on attack rolls against humanoid creatures of the reptilian and goblinoid subtypes.',
    },
    {
      name: 'Illusion Resistance',
      description:
        'Gnomes gain a +2 racial saving throw bonus against illusion spells and effects.',
    },
    {
      name: 'Keen Senses',
      description: 'Gnomes receive a +2 racial bonus on Perception checks.',
    },
    {
      name: 'Obsessive',
      description:
        'Gnomes receive a +2 racial bonus on a Craft or Profession skill of their choice.',
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Gnomes treat any weapon with the word "gnome" in its name as a martial weapon.',
    },
  ],
  skillBonuses: [{ skill: 'Perception', bonus: 2 }],
  languages: ['Common', 'Gnome', 'Sylvan'],
  bonusLanguages: ['Draconic', 'Dwarven', 'Elven', 'Giant', 'Goblin', 'Orc'],
};
