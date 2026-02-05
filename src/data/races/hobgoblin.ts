import { Race } from '@/types/race';

export const hobgoblin: Race = {
  name: 'Hobgoblin',
  source: 'ARG',
  description:
    'Fierce and militaristic, hobgoblins survive by conquest. The raw materials to fuel their war machines come from raids, their armaments and buildings from subjugated artisans and craftsmen. They are highly disciplined and favor strict hierarchies.',
  size: 'Medium',
  speed: 30,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'con', modifier: 2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Sneaky',
      description:
        'Hobgoblins receive a +4 racial bonus on Stealth checks.',
    },
  ],
  skillBonuses: [
    { skill: 'Stealth', bonus: 4 },
  ],
  languages: ['Common', 'Goblin'],
  bonusLanguages: ['Draconic', 'Dwarven', 'Infernal', 'Giant', 'Orc'],
};
