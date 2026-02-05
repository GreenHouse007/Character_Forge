import { CharacterClass } from '@/types/class';

export const slayer: CharacterClass = {
  name: 'Slayer',
  source: 'ACG',
  description: 'A stealthy warrior who studies their prey and uses a combination of skill and deadly precision to bring down foes.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude', 'reflex'],
  skillRanksPerLevel: 6,
  classSkills: [
    'Acrobatics', 'Bluff', 'Climb', 'Craft', 'Disguise', 'Heal',
    'Intimidate', 'Knowledge (Dungeoneering)', 'Knowledge (Geography)',
    'Knowledge (Local)', 'Perception', 'Profession', 'Ride',
    'Sense Motive', 'Stealth', 'Survival', 'Swim',
  ],
  classFeatures: [
    { name: 'Studied Target', level: 1, description: 'Study an opponent as a move action. Gain +1 bonus on Bluff, Knowledge, Perception, Sense Motive, Survival checks and +1 on attack and damage rolls against that target. Bonus increases by +1 at 5th, 10th, 15th, and 20th level.' },
    { name: 'Track', level: 1, description: 'Add 1/2 level (minimum 1) to Survival checks made to follow tracks.' },
    { name: 'Slayer Talent', level: 2, description: 'Select a slayer talent at 2nd level and every 2 levels thereafter. May select certain rogue talents as slayer talents.' },
    { name: 'Sneak Attack', level: 3, description: '+1d6 damage when flanking or target is denied Dex bonus to AC. Increases by +1d6 every 3 levels (6th, 9th, 12th, 15th, 18th).' },
    { name: 'Stalker', level: 7, description: 'Studied target is a swift action instead of a move action. At 14th level, can study as a free action at the start of each turn.' },
    { name: 'Advanced Talents', level: 10, description: 'Can select advanced slayer talents in addition to normal slayer talents.' },
    { name: 'Quarry', level: 11, description: 'Once per day, designate a studied target as quarry. Gain +2 insight bonus on attack rolls and auto-confirm critical threats against quarry.' },
    { name: 'Improved Quarry', level: 19, description: 'Can designate quarry as a free action. The insight bonus increases to +4.' },
    { name: 'Master Slayer', level: 20, description: 'Against studied target, automatically confirm critical hits and deal sneak attack damage even if target is not flanked or denied Dex bonus.' },
  ],
  spellProgression: { type: 'none' },
  startingWealth: { dice: { count: 5, sides: 6 }, multiplier: 10, average: 175 },
  proficiencies: {
    weapons: ['simple weapons', 'martial weapons'],
    armor: ['light armor', 'medium armor'],
    shields: ['shields (except tower shields)'],
  },
};
