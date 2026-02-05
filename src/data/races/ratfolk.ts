import { Race } from '@/types/race';

export const ratfolk: Race = {
  name: 'Ratfolk',
  source: 'ARG',
  description:
    'Ratfolk are small, rodent-like humanoids; originally native to subterranean areas in dry deserts and plains, they are now more commonly found in large colonies in the sewers and slums of human cities.',
  size: 'Small',
  speed: 20,
  abilityModifiers: [
    { ability: 'dex', modifier: 2 },
    { ability: 'int', modifier: 2 },
    { ability: 'str', modifier: -2 },
  ],
  flexibleAbilityBonus: false,
  darkvision: 60,
  racialTraits: [
    {
      name: 'Tinker',
      description:
        'Ratfolk gain a +2 racial bonus on Craft (alchemy), Perception, and Use Magic Device checks.',
    },
    {
      name: 'Rodent Empathy',
      description:
        'Ratfolk gain a +4 racial bonus on Handle Animal checks made to influence rodents.',
    },
    {
      name: 'Swarming',
      description:
        'Ratfolk are used to living and fighting communally, and are adept at swarming foes for mutual advantage and defense. Up to two ratfolk can share the same square at the same time. If two ratfolk in the same square attack the same foe, they are considered to be flanking that foe as if they were in two opposite squares.',
    },
  ],
  skillBonuses: [
    { skill: 'Craft', bonus: 2 },
    { skill: 'Perception', bonus: 2 },
    { skill: 'Use Magic Device', bonus: 2 },
  ],
  languages: ['Common'],
  bonusLanguages: ['Aklo', 'Draconic', 'Dwarven', 'Gnoll', 'Gnome', 'Goblin', 'Halfling', 'Orc', 'Undercommon'],
};
