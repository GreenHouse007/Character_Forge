import { Race } from '@/types/race';

export const halfling: Race = {
  name: 'Halfling',
  source: 'CRB',
  description:
    'Halflings are an optimistic and cheerful people, blessed with uncanny luck and driven by a powerful wanderlust. Their curiosity is matched only by their resourcefulness, and they rely on their considerable good fortune and quick wits to survive.',
  size: 'Small',
  speed: 20,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'cha', modifier: 2 },
    { ability: 'str', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  racialTraits: [
    {
      name: 'Fearless',
      description:
        'Halflings receive a +2 racial bonus on all saving throws against fear. This bonus stacks with the bonus granted by halfling luck.',
    },
    {
      name: 'Halfling Luck',
      description:
        'Halflings receive a +1 racial bonus on all saving throws.',
    },
    {
      name: 'Keen Senses',
      description:
        'Halflings receive a +2 racial bonus on Perception checks.',
    },
    {
      name: 'Sure-Footed',
      description:
        'Halflings receive a +2 racial bonus on Acrobatics and Climb checks.',
    },
    {
      name: 'Weapon Familiarity',
      description:
        'Halflings are proficient with slings and treat any weapon with the word "halfling" in its name as a martial weapon.',
    },
  ],
  skillBonuses: [
    { skill: 'Perception', bonus: 2 },
    { skill: 'Acrobatics', bonus: 2 },
    { skill: 'Climb', bonus: 2 },
  ],
  languages: ['Common', 'Halfling'],
  bonusLanguages: ['Dwarven', 'Elven', 'Gnome', 'Goblin'],
};
