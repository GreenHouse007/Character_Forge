import { CharacterClass } from '../../types/class';

export const hunter: CharacterClass = {
  name: 'Hunter',
  source: 'ACG',
  description:
    'Hunters are warriors of the wilds that have forged close bonds with trusted animal companions. They focus their tactics on fighting alongside their companion animals as a formidable team.',
  hitDie: 8,
  babProgression: 'threeQuarter',
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
    dice: { count: 4, sides: 6 },
    multiplier: 10,
    average: 140,
  },
  proficiencies: {
    weapons: ['simple', 'martial'],
    armor: ['light', 'medium'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'spontaneous',
    castingAbility: 'wis',
    maxSpellLevel: 6,
    spellsPerDay: {
      1:  { 0: 3, 1: 1 },
      2:  { 0: 4, 1: 2 },
      3:  { 0: 4, 1: 3 },
      4:  { 0: 4, 1: 3, 2: 1 },
      5:  { 0: 4, 1: 4, 2: 2 },
      6:  { 0: 5, 1: 4, 2: 3 },
      7:  { 0: 5, 1: 4, 2: 3, 3: 1 },
      8:  { 0: 5, 1: 4, 2: 4, 3: 2 },
      9:  { 0: 5, 1: 5, 2: 4, 3: 3 },
      10: { 0: 5, 1: 5, 2: 4, 3: 3, 4: 1 },
      11: { 0: 5, 1: 5, 2: 4, 3: 4, 4: 2 },
      12: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3 },
      13: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3, 5: 1 },
      14: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 4, 5: 2 },
      15: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3 },
      16: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4, 5: 3, 6: 1 },
      17: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4, 5: 4, 6: 2 },
      18: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 3 },
      19: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 4 },
      20: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5 },
    },
    spellsKnown: {
      1:  { 0: 4, 1: 2 },
      2:  { 0: 5, 1: 3 },
      3:  { 0: 6, 1: 4 },
      4:  { 0: 6, 1: 4, 2: 2 },
      5:  { 0: 6, 1: 4, 2: 3 },
      6:  { 0: 6, 1: 4, 2: 4 },
      7:  { 0: 6, 1: 5, 2: 4, 3: 2 },
      8:  { 0: 6, 1: 5, 2: 4, 3: 3 },
      9:  { 0: 6, 1: 5, 2: 5, 3: 4 },
      10: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 2 },
      11: { 0: 6, 1: 6, 2: 5, 3: 4, 4: 3 },
      12: { 0: 6, 1: 6, 2: 5, 3: 5, 4: 4 },
      13: { 0: 6, 1: 6, 2: 6, 3: 5, 4: 4, 5: 2 },
      14: { 0: 6, 1: 6, 2: 6, 3: 5, 4: 4, 5: 3 },
      15: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 5, 5: 4 },
      16: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 5, 5: 4, 6: 2 },
      17: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 5, 5: 4, 6: 3 },
      18: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 5, 6: 4 },
      19: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 5, 6: 4 },
      20: { 0: 6, 1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 6: 4 },
    },
  },
  classFeatures: [
    {
      name: 'Animal Companion',
      level: 1,
      description:
        'At 1st level, a hunter forms a bond with an animal companion. A hunter may choose from the list of animals available to a druid. This animal is a loyal companion that accompanies the hunter on her adventures. The hunter\'s effective druid level for this animal companion is equal to her hunter level.',
    },
    {
      name: 'Animal Focus',
      level: 1,
      description:
        'At 1st level, a hunter can take on the aspect of an animal as a swift action. She must select one type of animal to emulate, gaining a bonus or special ability based on the type of animal emulated and her hunter level. The hunter can use this ability for a number of minutes per day equal to her level.',
    },
    {
      name: 'Nature Training',
      level: 1,
      description:
        'A hunter counts her total hunter level as both druid levels and ranger levels for the purpose of qualifying for feats, traits, and options that modify or improve an animal companion.',
    },
    {
      name: 'Wild Empathy',
      level: 1,
      description:
        'A hunter can improve the initial attitude of an animal. This ability functions as a Diplomacy check to improve the attitude of a person. The hunter rolls 1d20 and adds her hunter level and her Charisma bonus to determine the wild empathy check result.',
    },
    {
      name: 'Precise Companion',
      level: 2,
      description:
        'At 2nd level, a hunter chooses either Precise Shot or Outflank as a bonus feat. She does not need to meet the prerequisites for this feat. If she chooses Outflank, she automatically grants this feat to her animal companion as well.',
    },
    {
      name: 'Hunter Tactics',
      level: 3,
      description:
        'At 3rd level, the hunter automatically grants her teamwork feats to her animal companion. The companion doesn\'t need to meet the prerequisites of these teamwork feats.',
    },
    {
      name: 'Teamwork Feat',
      level: 3,
      description:
        'At 3rd level and every 3 levels thereafter, the hunter gains a bonus teamwork feat in addition to those gained from normal advancement. The hunter must meet the prerequisites of the selected bonus teamwork feat.',
    },
    {
      name: 'Improved Empathic Link',
      level: 4,
      description:
        'At 4th level, the hunter gains an empathic link with her animal companion. This functions like an empathic link with a familiar, except the hunter can also see through a companion\'s eyes as a swift action, maintaining this connection as long as she likes.',
    },
    {
      name: 'Woodland Stride',
      level: 5,
      description:
        'At 5th level, a hunter and her animal companion may move through any sort of undergrowth (such as natural thorns, briars, overgrown areas, and similar terrain) at their normal speed and without taking damage or suffering any other impairment.',
    },
    {
      name: 'Bonus Tricks',
      level: 7,
      description:
        'At 7th level, the hunter\'s animal companion gains bonus tricks equal to half the hunter\'s level. These bonus tricks don\'t require any training time or Handle Animal checks, and they don\'t count against the normal limit of tricks known by the animal.',
    },
    {
      name: 'Swift Tracker',
      level: 8,
      description:
        'At 8th level, a hunter can move at her normal speed while using Survival to follow tracks without taking the normal -5 penalty. She takes only a -10 penalty (instead of the normal -20) when moving at up to twice normal speed while tracking.',
    },
    {
      name: 'Raise Animal Companion',
      level: 10,
      description:
        'At 10th level, a hunter gains the ability to cast raise animal companion on her animal companion as a spell-like ability. Using this ability costs the hunter no material components.',
    },
    {
      name: 'Master Hunter',
      level: 20,
      description:
        'At 20th level, a hunter becomes a master hunter. She can always move at full speed while using Survival to follow tracks without penalty. Additionally, each of her animal foci last until she changes them instead of being limited to minutes per day.',
    },
  ],
};
