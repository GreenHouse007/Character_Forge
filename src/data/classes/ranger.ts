import { CharacterClass } from '../../types/class';

export const ranger: CharacterClass = {
  name: 'Ranger',
  source: 'CRB',
  description:
    'For those who relish the thrill of the hunt, there are only predators and prey. Be they combatants of the wilds or mysterious trackers, rangers are some of the most feared combatants in the wild. Gifted with the ability to track and hunt their chosen enemies, rangers master the art of warfare against specific foes.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude', 'reflex'],
  skillRanksPerLevel: 6,
  classSkills: [
    'Climb',
    'Craft',
    'Handle Animal',
    'Heal',
    'Intimidate',
    'Knowledge (Dungeoneering)',
    'Knowledge (Geography)',
    'Knowledge (Nature)',
    'Perception',
    'Profession',
    'Ride',
    'Spellcraft',
    'Stealth',
    'Survival',
    'Swim',
  ],
  startingWealth: {
    dice: { count: 5, sides: 6 },
    multiplier: 10,
    average: 175,
  },
  proficiencies: {
    weapons: ['simple', 'martial'],
    armor: ['light', 'medium'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'prepared',
    castingAbility: 'wis',
    maxSpellLevel: 4,
    spellsPerDay: {
      1:  {},
      2:  {},
      3:  {},
      4:  { 1: 0 },
      5:  { 1: 1 },
      6:  { 1: 1 },
      7:  { 1: 1, 2: 0 },
      8:  { 1: 1, 2: 1 },
      9:  { 1: 2, 2: 1 },
      10: { 1: 2, 2: 1, 3: 0 },
      11: { 1: 2, 2: 1, 3: 1 },
      12: { 1: 2, 2: 2, 3: 1 },
      13: { 1: 3, 2: 2, 3: 1, 4: 0 },
      14: { 1: 3, 2: 2, 3: 1, 4: 1 },
      15: { 1: 3, 2: 2, 3: 2, 4: 1 },
      16: { 1: 3, 2: 3, 3: 2, 4: 1 },
      17: { 1: 4, 2: 3, 3: 2, 4: 1 },
      18: { 1: 4, 2: 3, 3: 2, 4: 2 },
      19: { 1: 4, 2: 3, 3: 3, 4: 2 },
      20: { 1: 4, 2: 4, 3: 3, 4: 3 },
    },
  },
  classResources: [
    {
      name: 'Favored Enemy',
      description:
        'At 1st level, a ranger selects a creature type from the ranger favored enemies table. He gains a +2 bonus on Bluff, Knowledge, Perception, Sense Motive, and Survival checks against creatures of his selected type. At 5th level and every five levels thereafter, the ranger may select an additional favored enemy.',
      getUsesAtLevel: (level: number) =>
        1 + Math.floor(level / 5),
      resetsOn: 'never',
    },
    {
      name: 'Favored Terrain',
      description:
        'At 3rd level, a ranger may select a type of terrain from the Favored Terrains table. The ranger gains a +2 bonus on initiative checks and Knowledge (geography), Perception, Stealth, and Survival skill checks when he is in this terrain. At 8th level and every five levels thereafter, the ranger may select an additional favored terrain.',
      getUsesAtLevel: (level: number) => {
        if (level < 3) return 0;
        return 1 + Math.floor((level - 3) / 5);
      },
      resetsOn: 'never',
    },
  ],
  classFeatures: [
    {
      name: 'Favored Enemy',
      level: 1,
      description:
        'At 1st level, a ranger selects a creature type from the ranger favored enemies table. He gains a +2 bonus on Bluff, Knowledge, Perception, Sense Motive, and Survival checks against creatures of his selected type. Likewise, he gets a +2 bonus on weapon attack and damage rolls against them. At 5th level and every five levels thereafter, the ranger may select an additional favored enemy. In addition, at each such interval, the bonus against any one favored enemy (including the one just selected, if so desired) increases by +2.',
    },
    {
      name: 'Track',
      level: 1,
      description:
        'A ranger adds half his level (minimum 1) to Survival skill checks made to follow tracks.',
    },
    {
      name: 'Wild Empathy',
      level: 1,
      description:
        'A ranger can improve the initial attitude of an animal. This ability functions just like a Diplomacy check made to improve the attitude of a person. The ranger rolls 1d20 and adds his ranger level and his Charisma modifier to determine the wild empathy check result.',
    },
    {
      name: 'Combat Style Feat',
      level: 2,
      description:
        'At 2nd level, a ranger must select one of two combat styles to pursue: archery or two-weapon combat. The ranger\'s expertise manifests in the form of bonus feats at 2nd, 6th, 10th, 14th, and 18th level. He can choose feats from his selected combat style, even if he does not have the normal prerequisites.',
    },
    {
      name: 'Endurance',
      level: 3,
      description:
        'A ranger gains Endurance as a bonus feat at 3rd level.',
    },
    {
      name: 'Favored Terrain',
      level: 3,
      description:
        'At 3rd level, a ranger may select a type of terrain from the Favored Terrains table. The ranger gains a +2 bonus on initiative checks and Knowledge (geography), Perception, Stealth, and Survival skill checks when he is in this terrain. At 8th level and every five levels thereafter, the ranger may select an additional favored terrain. In addition, at each such interval, the bonus in any one favored terrain (including the one just selected, if so desired) increases by +2.',
    },
    {
      name: "Hunter's Bond",
      level: 4,
      description:
        'At 4th level, a ranger forms a bond with his hunting companions. This bond can take one of two forms. The first is a bond to his companions, allowing him to spend a move action to grant half his favored enemy bonus against a single target to all allies within 30 feet who can see or hear him. The second option is to form a close bond with an animal companion.',
    },
    {
      name: 'Spells',
      level: 4,
      description:
        'Beginning at 4th level, a ranger gains the ability to cast a small number of divine spells. A ranger must choose and prepare his spells in advance. His caster level is equal to his ranger level - 3.',
    },
    {
      name: 'Favored Enemy (2nd)',
      level: 5,
      description:
        'At 5th level, the ranger may select a second favored enemy. In addition, the bonus against one favored enemy increases by +2.',
    },
    {
      name: 'Woodland Stride',
      level: 7,
      description:
        'Starting at 7th level, a ranger may move through any sort of undergrowth at his normal speed and without taking damage or suffering any other impairment.',
    },
    {
      name: 'Swift Tracker',
      level: 8,
      description:
        'Beginning at 8th level, a ranger can move at his normal speed while using Survival to follow tracks without taking the normal -5 penalty. He takes only a -10 penalty (instead of the normal -20) when moving at up to twice normal speed while tracking.',
    },
    {
      name: 'Evasion',
      level: 9,
      description:
        'When he reaches 9th level, a ranger can avoid even magical and unusual attacks with great agility. If he makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, he instead takes no damage. Evasion can only be used if the ranger is wearing light armor, medium armor, or no armor.',
    },
    {
      name: 'Favored Enemy (3rd)',
      level: 10,
      description:
        'At 10th level, the ranger may select a third favored enemy. In addition, the bonus against one favored enemy increases by +2.',
    },
    {
      name: 'Quarry',
      level: 11,
      description:
        'At 11th level, a ranger can, as a standard action, denote one target within his line of sight as his quarry. Whenever he is following the tracks of his quarry, a ranger can take 10 on his Survival skill checks while moving at normal speed, without penalty. In addition, he receives a +2 insight bonus on attack rolls made against his quarry, and all critical threats are automatically confirmed.',
    },
    {
      name: 'Camouflage',
      level: 12,
      description:
        'A ranger of 12th level or higher can use the Stealth skill to hide in any of his favored terrains, even if the terrain doesn\'t grant cover or concealment.',
    },
    {
      name: 'Favored Enemy (4th)',
      level: 15,
      description:
        'At 15th level, the ranger may select a fourth favored enemy. In addition, the bonus against one favored enemy increases by +2.',
    },
    {
      name: 'Improved Evasion',
      level: 16,
      description:
        'At 16th level, a ranger\'s evasion improves. This ability works like evasion, except that while the ranger still takes no damage on a successful Reflex saving throw, he takes only half damage on a failed save.',
    },
    {
      name: 'Hide in Plain Sight',
      level: 17,
      description:
        'While in any of his favored terrains, a ranger of 17th level or higher can use the Stealth skill even while being observed.',
    },
    {
      name: 'Improved Quarry',
      level: 19,
      description:
        'At 19th level, the ranger\'s ability to hunt his quarry improves. He can now denote a quarry as a free action, and can take 20 while using Survival to track his quarry, while moving at normal speed without penalty.',
    },
    {
      name: 'Favored Enemy (5th)',
      level: 20,
      description:
        'At 20th level, the ranger may select a fifth favored enemy. In addition, the bonus against one favored enemy increases by +2.',
    },
    {
      name: 'Master Hunter',
      level: 20,
      description:
        'A ranger of 20th level becomes a master hunter. He can always move at full speed while using Survival to follow tracks without penalty. A ranger can, as a standard action, make a single attack against a favored enemy at his full attack bonus. If the attack hits, the target takes damage normally and must make a Fortitude save (DC 10 + 1/2 the ranger\'s level + the ranger\'s Wisdom modifier) or die.',
    },
  ],
};
