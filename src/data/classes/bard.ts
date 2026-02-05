import { CharacterClass } from '../../types/class';

export const bard: CharacterClass = {
  name: 'Bard',
  source: 'CRB',
  description:
    'Untold wonders and secrets exist for those skillful enough to discover them. Through cleverness, talent, and magic, these cunning few unravel the wiles of the world, becoming combatants, leaders, and knowledge keepers.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['reflex', 'will'],
  skillRanksPerLevel: 6,
  classSkills: [
    'Acrobatics',
    'Appraise',
    'Bluff',
    'Climb',
    'Craft',
    'Diplomacy',
    'Disguise',
    'Escape Artist',
    'Intimidate',
    'Knowledge (Arcana)',
    'Knowledge (Dungeoneering)',
    'Knowledge (Engineering)',
    'Knowledge (Geography)',
    'Knowledge (History)',
    'Knowledge (Local)',
    'Knowledge (Nature)',
    'Knowledge (Nobility)',
    'Knowledge (Planes)',
    'Knowledge (Religion)',
    'Linguistics',
    'Perception',
    'Perform',
    'Profession',
    'Sense Motive',
    'Sleight of Hand',
    'Spellcraft',
    'Stealth',
    'Use Magic Device',
  ],
  startingWealth: {
    dice: { count: 3, sides: 6 },
    multiplier: 10,
    average: 105,
  },
  proficiencies: {
    weapons: [
      'simple',
      'longsword',
      'rapier',
      'sap',
      'short sword',
      'shortbow',
      'whip',
    ],
    armor: ['light'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'spontaneous',
    castingAbility: 'cha',
    maxSpellLevel: 6,
    spellsPerDay: {
      1:  { 0: 1 },
      2:  { 0: 2 },
      3:  { 0: 3 },
      4:  { 0: 3, 1: 1 },
      5:  { 0: 4, 1: 2 },
      6:  { 0: 4, 1: 3 },
      7:  { 0: 4, 1: 3, 2: 1 },
      8:  { 0: 4, 1: 4, 2: 2 },
      9:  { 0: 5, 1: 4, 2: 3 },
      10: { 0: 5, 1: 4, 2: 3, 3: 1 },
      11: { 0: 5, 1: 4, 2: 4, 3: 2 },
      12: { 0: 5, 1: 5, 2: 4, 3: 3 },
      13: { 0: 5, 1: 5, 2: 4, 3: 3, 4: 1 },
      14: { 0: 5, 1: 5, 2: 4, 3: 4, 4: 2 },
      15: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3 },
      16: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3, 5: 1 },
      17: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 4, 5: 2 },
      18: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3 },
      19: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 1 },
      20: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 2 },
    },
    spellsKnown: {
      1:  { 0: 4 },
      2:  { 0: 5, 1: 2 },
      3:  { 0: 6, 1: 3 },
      4:  { 0: 6, 1: 3, 2: 1 },
      5:  { 0: 6, 1: 4, 2: 2 },
      6:  { 0: 6, 1: 4, 2: 3 },
      7:  { 0: 6, 1: 4, 2: 3, 3: 1 },
      8:  { 0: 6, 1: 4, 2: 4, 3: 2 },
      9:  { 0: 6, 1: 5, 2: 4, 3: 3 },
      10: { 0: 6, 1: 5, 2: 4, 3: 3, 4: 1 },
      11: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 2 },
      12: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3 },
      13: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3, 5: 1 },
      14: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4, 5: 2 },
      15: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3 },
      16: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 1 },
      17: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 2 },
      18: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 3 },
      19: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 },
      20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 },
    },
  },
  classResources: [
    {
      name: 'Bardic Performance',
      description:
        'A bard can use bardic performance for a number of rounds per day equal to 4 + his Charisma modifier. At each level after 1st, he can use bardic performance for 2 additional rounds per day.',
      getUsesAtLevel: (level: number, chaMod?: number) =>
        4 + (chaMod ?? 0) + (level - 1) * 2,
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Bardic Knowledge',
      level: 1,
      description:
        'A bard adds half his class level (minimum 1) to all Knowledge skill checks and may make all Knowledge skill checks untrained.',
    },
    {
      name: 'Bardic Performance',
      level: 1,
      description:
        'A bard is trained to use the Perform skill to create magical effects on those around him, including himself if desired. He can use this ability for a number of rounds per day equal to 4 + his Charisma modifier. At each level after 1st a bard can use bardic performance for 2 additional rounds per day.',
    },
    {
      name: 'Countersong',
      level: 1,
      description:
        'At 1st level, a bard learns to counter magic effects that depend on sound. Each round of the countersong he makes a Perform skill check. Any creature within 30 feet that is affected by a sonic or language-dependent magical attack may use the bard\'s Perform check result in place of its saving throw if, after the saving throw is rolled, the Perform check result proves to be higher.',
    },
    {
      name: 'Distraction',
      level: 1,
      description:
        'At 1st level, a bard can use his performance to counter magic effects that depend on sight. Each round of the distraction, he makes a Perform skill check. Any creature within 30 feet that is affected by an illusion (pattern) or illusion (figment) magical attack may use the bard\'s Perform check result in place of its saving throw.',
    },
    {
      name: 'Fascinate',
      level: 1,
      description:
        'At 1st level, a bard can use his performance to cause one or more creatures to become fascinated with him. Each creature to be fascinated must be within 90 feet, able to see and hear the bard, and capable of paying attention to him.',
    },
    {
      name: 'Inspire Courage +1',
      level: 1,
      description:
        'A 1st-level bard can use his performance to inspire courage in his allies, granting a +1 morale bonus on saving throws against charm and fear effects and a +1 competence bonus on attack and weapon damage rolls. At 5th level and every six levels thereafter, this bonus increases by +1.',
    },
    {
      name: 'Cantrips',
      level: 1,
      description:
        'Bards learn a number of cantrips, or 0-level spells. These spells are cast like any other spell, but they do not consume any slots and may be used again.',
    },
    {
      name: 'Well-Versed',
      level: 2,
      description:
        'At 2nd level, the bard becomes resistant to the bardic performance of others, and to sonic effects in general. The bard gains a +4 bonus on saving throws made against bardic performance, sonic, and language-dependent effects.',
    },
    {
      name: 'Versatile Performance',
      level: 2,
      description:
        'At 2nd level, a bard can choose one type of Perform skill. He can use his bonus in that skill in place of his bonus in associated skills. At 6th level, and every 4 levels thereafter, the bard can select an additional type of Perform to substitute.',
    },
    {
      name: 'Inspire Competence +2',
      level: 3,
      description:
        'A bard of 3rd level or higher can use his performance to help an ally succeed at a task. That ally must be within 30 feet and be able to hear the bard. The ally gets a +2 competence bonus on skill checks with a particular skill as long as she continues to hear the bard\'s performance.',
    },
    {
      name: 'Inspire Courage +2',
      level: 5,
      description:
        'At 5th level, inspire courage bonuses increase to +2.',
    },
    {
      name: 'Suggestion',
      level: 6,
      description:
        'A bard of 6th level or higher can use his performance to make a suggestion (as per the spell) to a creature he has already fascinated. A Will saving throw (DC 10 + 1/2 bard level + Cha modifier) negates the effect.',
    },
    {
      name: 'Inspire Competence +3',
      level: 7,
      description: 'At 7th level, inspire competence bonus increases to +3.',
    },
    {
      name: 'Dirge of Doom',
      level: 8,
      description:
        'A bard of 8th level or higher can use his performance to foster a sense of growing dread in his enemies, causing them to become shaken. This does not provoke a saving throw.',
    },
    {
      name: 'Inspire Greatness',
      level: 9,
      description:
        'A bard of 9th level or higher can use his performance to inspire greatness in himself or a single willing ally within 30 feet, granting extra Hit Dice, attack, and saves.',
    },
    {
      name: 'Jack-of-All-Trades',
      level: 10,
      description:
        'At 10th level, the bard can use any skill, even if the skill normally requires him to be trained. At 16th level, the bard considers all skills to be class skills. At 19th level, the bard can take 10 on any skill check, even if it is not normally allowed.',
    },
    {
      name: 'Inspire Courage +3',
      level: 11,
      description: 'At 11th level, inspire courage bonuses increase to +3.',
    },
    {
      name: 'Inspire Competence +4',
      level: 11,
      description: 'At 11th level, inspire competence bonus increases to +4.',
    },
    {
      name: 'Soothing Performance',
      level: 12,
      description:
        'A bard of 12th level or higher can use his performance to create an effect equivalent to a mass cure serious wounds, using his bard level as the caster level.',
    },
    {
      name: 'Frightening Tune',
      level: 14,
      description:
        'A bard of 14th level or higher can use his performance to cause fear in his enemies. To be affected, an enemy must be able to hear the bard perform and be within 30 feet.',
    },
    {
      name: 'Inspire Competence +5',
      level: 15,
      description: 'At 15th level, inspire competence bonus increases to +5.',
    },
    {
      name: 'Inspire Heroics',
      level: 15,
      description:
        'A bard of 15th level or higher can inspire tremendous heroism in himself or a single ally within 30 feet. The creature gains a +4 morale bonus on saving throws and a +4 dodge bonus to AC.',
    },
    {
      name: 'Inspire Courage +4',
      level: 17,
      description: 'At 17th level, inspire courage bonuses increase to +4.',
    },
    {
      name: 'Mass Suggestion',
      level: 18,
      description:
        'A bard of 18th level or higher can make a suggestion (as per the spell mass suggestion) to any number of creatures that he has already fascinated.',
    },
    {
      name: 'Inspire Competence +6',
      level: 19,
      description: 'At 19th level, inspire competence bonus increases to +6.',
    },
    {
      name: 'Deadly Performance',
      level: 20,
      description:
        'A bard of 20th level or higher can use his performance to cause one enemy to die from joy or sorrow. To be affected, the target must be able to see and hear the bard perform for 1 full round and be within 30 feet. The target receives a Will save (DC 10 + 1/2 bard level + Cha modifier) to negate the effect.',
    },
    {
      name: 'Lore Master',
      level: 5,
      description:
        'At 5th level, the bard becomes a master of lore and can take 10 on any Knowledge skill check that he has ranks in. A bard can choose not to take 10 and can instead roll normally. Once per day, the bard can take 20 on any Knowledge skill check as a standard action. He can use this ability one additional time per day for every six levels he possesses beyond 5th, to a maximum of three times per day at 17th level.',
    },
  ],
};
