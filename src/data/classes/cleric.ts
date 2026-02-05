import { CharacterClass } from '../../types/class';

export const cleric: CharacterClass = {
  name: 'Cleric',
  source: 'CRB',
  description:
    'In faith and the miracles of the divine, many find a greater purpose. Called to serve powers beyond most mortal understanding, all combatants of the divine answer a calling to do great deeds. The cleric is the conduit of divine power, channeling the will of a deity to heal, protect, and smite.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Appraise',
    'Craft',
    'Diplomacy',
    'Heal',
    'Knowledge (Arcana)',
    'Knowledge (History)',
    'Knowledge (Nobility)',
    'Knowledge (Planes)',
    'Knowledge (Religion)',
    'Linguistics',
    'Profession',
    'Sense Motive',
    'Spellcraft',
  ],
  startingWealth: {
    dice: { count: 4, sides: 6 },
    multiplier: 10,
    average: 140,
  },
  proficiencies: {
    weapons: ['simple', 'deity\'s favored weapon'],
    armor: ['light', 'medium', 'heavy'],
    shields: ['shields (except tower shields)'],
  },
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
      name: 'Channel Energy',
      description:
        'A cleric can channel positive or negative energy a number of times per day equal to 3 + her Charisma modifier. The amount of damage dealt or healed is 1d6 at 1st level and increases by 1d6 for every two cleric levels beyond 1st.',
      getUsesAtLevel: (_level: number, chaMod?: number) =>
        3 + (chaMod ?? 0),
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Aura',
      level: 1,
      description:
        'A cleric of a chaotic, evil, good, or lawful deity has a particularly powerful aura corresponding to the deity\'s alignment.',
    },
    {
      name: 'Channel Energy',
      level: 1,
      description:
        'Regardless of alignment, any cleric can release a wave of energy by channeling the power of her faith through her holy (or unholy) symbol. This energy can be used to cause or heal damage, depending on the type of energy channeled and the creatures targeted. Channeling energy causes a burst that affects all creatures of one type (either undead or living) in a 30-foot radius centered on the cleric. The amount of damage dealt or healed is equal to 1d6 points of damage plus 1d6 points of damage for every two cleric levels beyond 1st (2d6 at 3rd, 3d6 at 5th, and so on).',
    },
    {
      name: 'Domains',
      level: 1,
      description:
        "A cleric's deity influences her alignment, what magic she can perform, her values, and how others see her. A cleric chooses two domains from among those belonging to her deity. Each domain grants a number of domain powers dependent upon the level of the cleric, as well as a number of bonus spells.",
    },
    {
      name: 'Orisons',
      level: 1,
      description:
        'Clerics can prepare a number of orisons, or 0-level spells, each day. These spells are cast like any other spell, but they are not expended when cast and may be used again.',
    },
    {
      name: 'Spontaneous Casting',
      level: 1,
      description:
        'A good cleric (or a neutral cleric of a good deity) can channel stored spell energy into healing spells that the cleric did not prepare ahead of time. The cleric can "lose" any prepared spell that is not an orison or domain spell in order to cast any cure spell of the same spell level or lower. An evil cleric (or a neutral cleric of an evil deity) can similarly convert prepared spells into inflict spells.',
    },
  ],
};
