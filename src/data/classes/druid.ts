import { CharacterClass } from '../../types/class';

export const druid: CharacterClass = {
  name: 'Druid',
  source: 'CRB',
  description:
    'Within the purity of the elements and the order of the wilds lingers a power beyond the marvels of civilization. Furtive yet combative, subtle yet devoted, their paths winding through nature and the spirits of the world, druids serve as stewards of the wild.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Climb',
    'Craft',
    'Fly',
    'Handle Animal',
    'Heal',
    'Knowledge (Geography)',
    'Knowledge (Nature)',
    'Perception',
    'Profession',
    'Ride',
    'Spellcraft',
    'Survival',
    'Swim',
  ],
  startingWealth: {
    dice: { count: 2, sides: 6 },
    multiplier: 10,
    average: 70,
  },
  proficiencies: {
    weapons: [
      'club',
      'dagger',
      'dart',
      'quarterstaff',
      'scimitar',
      'scythe',
      'sickle',
      'shortspear',
      'sling',
      'spear',
    ],
    armor: ['light', 'medium (non-metal only)'],
    shields: ['shields (non-metal only)'],
  },
  alignmentRestrictions: ['NG', 'LN', 'TN', 'CN', 'NE'],
  spellProgression: {
    type: 'prepared',
    castingAbility: 'wis',
    maxSpellLevel: 9,
    spellsPerDay: {
      1:  { 0: 3, 1: 1 },
      2:  { 0: 4, 1: 2 },
      3:  { 0: 4, 1: 2, 2: 1 },
      4:  { 0: 4, 1: 3, 2: 2 },
      5:  { 0: 4, 1: 3, 2: 2, 3: 1 },
      6:  { 0: 4, 1: 3, 2: 3, 3: 2 },
      7:  { 0: 4, 1: 4, 2: 3, 3: 2, 4: 1 },
      8:  { 0: 4, 1: 4, 2: 3, 3: 3, 4: 2 },
      9:  { 0: 4, 1: 4, 2: 4, 3: 3, 4: 2, 5: 1 },
      10: { 0: 4, 1: 4, 2: 4, 3: 3, 4: 3, 5: 2 },
      11: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 3, 5: 2, 6: 1 },
      12: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 3, 5: 3, 6: 2 },
      13: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 2, 7: 1 },
      14: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 3, 6: 3, 7: 2 },
      15: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 2, 8: 1 },
      16: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 3, 7: 3, 8: 2 },
      17: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 3, 8: 2, 9: 1 },
      18: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2 },
      19: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 3, 9: 3 },
      20: { 0: 4, 1: 4, 2: 4, 3: 4, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4 },
    },
  },
  classResources: [
    {
      name: 'Wild Shape',
      description:
        'At 4th level, a druid gains the ability to turn herself into any Small or Medium animal and back again once per day. At 6th level, she can use wild shape an additional time per day. At 8th level and every 2 levels thereafter, she gains an additional use.',
      getUsesAtLevel: (level: number) => {
        if (level < 4) return 0;
        return 1 + Math.floor((level - 4) / 2);
      },
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Nature Bond',
      level: 1,
      description:
        'At 1st level, a druid forms a bond with nature. This bond can take one of two forms. The first is a close tie to the natural world, granting the druid one of the following cleric domains: Air, Animal, Earth, Fire, Plant, Water, or Weather. The second option is to form a close bond with an animal companion.',
    },
    {
      name: 'Nature Sense',
      level: 1,
      description:
        'A druid gains a +2 bonus on Knowledge (nature) and Survival checks.',
    },
    {
      name: 'Orisons',
      level: 1,
      description:
        'Druids can prepare a number of orisons, or 0-level spells, each day. These spells are cast like any other spell, but they are not expended when cast and may be used again.',
    },
    {
      name: 'Spontaneous Casting',
      level: 1,
      description:
        'A druid can channel stored spell energy into summoning spells that she hasn\'t prepared ahead of time. She can "lose" a prepared spell in order to cast any summon nature\'s ally spell of the same level or lower.',
    },
    {
      name: 'Wild Empathy',
      level: 1,
      description:
        'A druid can improve the attitude of an animal. This ability functions just like a Diplomacy check made to improve the attitude of a person. The druid rolls 1d20 and adds her druid level and her Charisma modifier to determine the wild empathy check result.',
    },
    {
      name: 'Woodland Stride',
      level: 2,
      description:
        'Starting at 2nd level, a druid may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at her normal speed and without taking damage or suffering any other impairment.',
    },
    {
      name: 'Trackless Step',
      level: 3,
      description:
        'Starting at 3rd level, a druid leaves no trail in natural surroundings and cannot be tracked. She may choose to leave a trail if so desired.',
    },
    {
      name: 'Resist Nature\'s Lure',
      level: 4,
      description:
        'Starting at 4th level, a druid gains a +4 bonus on saving throws against the spell-like and supernatural abilities of fey. This bonus also applies to spells and effects that utilize or target plants.',
    },
    {
      name: 'Wild Shape',
      level: 4,
      description:
        'At 4th level, a druid gains the ability to turn herself into any Small or Medium animal and back again once per day. This ability functions like the beast shape I spell, except as noted here. The effect lasts for 1 hour per druid level, or until she changes back.',
    },
    {
      name: 'Wild Shape (Large/Tiny animal, Small elemental)',
      level: 6,
      description:
        'At 6th level, a druid can also use wild shape to change into a Large or Tiny animal, or a Small elemental. When in elemental form, the druid gains the elemental\'s abilities.',
    },
    {
      name: 'Wild Shape (Huge animal, Medium elemental, Small/Medium plant)',
      level: 8,
      description:
        'At 8th level, a druid can also use wild shape to change into a Huge animal, a Medium elemental, or a Small or Medium plant creature.',
    },
    {
      name: 'Venom Immunity',
      level: 9,
      description:
        'At 9th level, a druid gains immunity to all poisons.',
    },
    {
      name: 'Wild Shape (Large elemental, Large plant)',
      level: 10,
      description:
        'At 10th level, a druid can also use wild shape to change into a Large elemental or a Large plant creature.',
    },
    {
      name: 'Wild Shape (Huge elemental, Huge plant)',
      level: 12,
      description:
        'At 12th level, a druid can also use wild shape to change into a Huge elemental or Huge plant creature.',
    },
    {
      name: 'A Thousand Faces',
      level: 13,
      description:
        'At 13th level, a druid gains the ability to change her appearance at will, as if using the alter self spell, but only while in her normal form.',
    },
    {
      name: 'Timeless Body',
      level: 15,
      description:
        'After attaining 15th level, a druid no longer takes ability score penalties for aging and cannot be magically aged. Any penalties she may have already incurred, however, remain in place. Bonuses still accrue, and the druid still dies of old age when her time is up.',
    },
  ],
};
