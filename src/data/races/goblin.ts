import { Race } from '@/types/race';

export const goblin: Race = {
  name: 'Goblin',
  source: 'ARG',
  description:
    'Goblins are a race of childlike creatures with a destructive and voracious nature that makes them almost universally despised. They are known for their love of fire, hatred of horses and dogs, and fondness for songs about gruesome topics.',
  size: 'Small',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 4 },
    { ability: 'str', modifier: -2 },
    { ability: 'cha', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Skilled',
      description:
        'Goblins gain a +4 racial bonus on Ride and Stealth checks.',
    },
    {
      name: 'Fast',
      description:
        'Goblins are fast for their size, and have a base speed of 30 feet.',
    },
  ],
  skillBonuses: [
    { skill: 'Ride', bonus: 4 },
    { skill: 'Stealth', bonus: 4 },
  ],
  languages: ['Goblin'],
  bonusLanguages: ['Common', 'Draconic', 'Dwarven', 'Gnoll', 'Gnome', 'Halfling', 'Orc'],
};
