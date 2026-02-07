import { CharacterClass } from '../../types/class';

export const unsummoner: CharacterClass = {
  name: 'UnSummoner',
  source: 'APG',
  description:
    'The unchained summoner forges a powerful bond with one particular outsider, known as an eidolon, who gains power as the summoner becomes more proficient at his summoning. This version of the summoner uses the unchained rules, featuring a revised eidolon and spell list that provide a more balanced and streamlined experience.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Craft',
    'Fly',
    'Handle Animal',
    'Knowledge (Arcana)',
    'Knowledge (Planes)',
    'Linguistics',
    'Profession',
    'Ride',
    'Spellcraft',
    'Use Magic Device',
  ],
  startingWealth: {
    dice: { count: 2, sides: 6 },
    multiplier: 10,
    average: 70,
  },
  proficiencies: {
    weapons: ['simple'],
    armor: ['light'],
    shields: [],
  },
  spellProgression: {
    type: 'spontaneous',
    castingAbility: 'cha',
    maxSpellLevel: 6,
    spellsPerDay: {
      1:  { 0: 4, 1: 1 },
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
      20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5 },
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
  classResources: [
    {
      name: 'Summon Monster',
      description:
        'Starting at 1st level, an unchained summoner can cast summon monster I as a spell-like ability a number of times per day equal to 3 + his Charisma modifier. At 3rd level and every 2 levels thereafter, the power of this ability increases by one spell level, allowing him to summon more powerful creatures.',
      getUsesAtLevel: (level: number, chaMod?: number) =>
        3 + (chaMod ?? 0),
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Eidolon',
      level: 1,
      description:
        'An unchained summoner begins play with the ability to summon to his side a powerful outsider called an eidolon. The eidolon forms a link with the summoner, who forever after summons an aspect of the same creature. The unchained eidolon must select a subtype, which determines its base statistics, available evolutions, and thematic abilities. This is the unchained version of the eidolon, featuring a more structured and balanced set of options.',
    },
    {
      name: 'Life Link',
      level: 1,
      description:
        'Starting at 1st level, an unchained summoner forms a close bond with his eidolon. Whenever the eidolon takes enough damage to send it back to its home plane, the summoner can, as a free action, sacrifice any number of hit points. Each hit point sacrificed in this way prevents 1 point of damage done to the eidolon.',
    },
    {
      name: 'Summon Monster',
      level: 1,
      description:
        'Starting at 1st level, an unchained summoner can cast summon monster I as a spell-like ability a number of times per day equal to 3 + his Charisma modifier. Drawing upon this ability uses up the same power as the summoner uses to call his eidolon. As a result, he can only use this ability when his eidolon is not summoned.',
    },
    {
      name: 'Bond Senses',
      level: 2,
      description:
        'Starting at 2nd level, an unchained summoner can, as a standard action, share the senses of his eidolon, hearing, seeing, smelling, tasting, and touching everything the eidolon does. He can use this ability a number of rounds per day equal to his summoner level. There is no range to this effect, but the eidolon and the summoner must be on the same plane.',
    },
    {
      name: 'Shield Ally',
      level: 4,
      description:
        'At 4th level, whenever an unchained summoner is within his eidolon\'s reach, the summoner receives a +2 shield bonus to his Armor Class and a +2 circumstance bonus on his saving throws. This bonus does not apply if the eidolon is grappled, helpless, paralyzed, stunned, or unconscious.',
    },
    {
      name: 'Maker\'s Call',
      level: 6,
      description:
        'At 6th level, as a standard action, an unchained summoner can call his eidolon to his side. This functions as dimension door, using the summoner\'s caster level. When used, the eidolon appears adjacent to the summoner (or as close as possible if all adjacent spaces are occupied).',
    },
    {
      name: 'Transposition',
      level: 8,
      description:
        'At 8th level, an unchained summoner can use his maker\'s call ability to swap locations with his eidolon. If it is larger than him, he can appear in any square previously occupied by the eidolon. The eidolon must occupy the square that was occupied by the summoner if able, or as close as possible if it is not able.',
    },
    {
      name: 'Aspect',
      level: 10,
      description:
        'At 10th level, an unchained summoner can divert up to 2 points from his eidolon\'s evolution pool to add evolutions to himself. He cannot select any evolution that the eidolon could not possess, and he must be able to meet the requirements for the evolution.',
    },
    {
      name: 'Greater Shield Ally',
      level: 12,
      description:
        'At 12th level, whenever an ally is within the eidolon\'s reach, the ally receives a +2 shield bonus to its Armor Class and a +2 circumstance bonus on its saving throws. If the unchained summoner is within his eidolon\'s reach, these bonuses increase to +4.',
    },
    {
      name: 'Life Bond',
      level: 14,
      description:
        'At 14th level, an unchained summoner\'s life becomes linked to his eidolon\'s. As long as the eidolon has 1 or more hit points, the summoner is protected from harm. Damage in excess of that which would reduce the summoner to fewer than 0 hit points is instead transferred to the eidolon.',
    },
    {
      name: 'Merge Forms',
      level: 16,
      description:
        'At 16th level, as a full-round action, an unchained summoner can touch his eidolon and the two merge together. The summoner emerges from the body of the eidolon, which then takes on a form that appears to be the summoner. The summoner can use this ability for a number of rounds per day equal to his summoner level.',
    },
    {
      name: 'Greater Aspect',
      level: 18,
      description:
        'At 18th level, an unchained summoner can divert more of his eidolon\'s evolutions to himself. This ability functions as the aspect ability, but up to 6 evolution points can be taken.',
    },
    {
      name: 'Twin Eidolon',
      level: 20,
      description:
        'At 20th level, an unchained summoner and his eidolon share a true connection. As a standard action, the summoner can assume the shape of his eidolon, copying all of its evolutions, form, and abilities. His Strength, Dexterity, and Constitution scores change to match the base scores of his eidolon. The summoner retains all of his class features. The summoner can keep this form for a number of minutes per day equal to his summoner level.',
    },
  ],
};
