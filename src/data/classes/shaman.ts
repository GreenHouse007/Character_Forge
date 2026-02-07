import { CharacterClass } from '../../types/class';

export const shaman: CharacterClass = {
  name: 'Shaman',
  source: 'ACG',
  description:
    'While some heroes speak to gods or consort with otherworldly muses, shamans commune with the spirits of the world and the energies that exist in every living thing. These divine adventurers draw upon their power to shape the world and expand the influence of their spiritual patrons.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['will'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Craft',
    'Diplomacy',
    'Fly',
    'Handle Animal',
    'Heal',
    'Knowledge (Nature)',
    'Knowledge (Planes)',
    'Knowledge (Religion)',
    'Profession',
    'Ride',
    'Spellcraft',
    'Survival',
  ],
  startingWealth: {
    dice: { count: 3, sides: 6 },
    multiplier: 10,
    average: 105,
  },
  proficiencies: {
    weapons: ['simple'],
    armor: ['light', 'medium'],
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
  classFeatures: [
    {
      name: 'Spirit',
      level: 1,
      description:
        'A shaman forms a mystical bond with the spirits of the world. She forms a lasting bond with a single spirit, which grants a number of abilities and defines many of her other class features.',
    },
    {
      name: 'Spirit Animal',
      level: 1,
      description:
        'At 1st level, a shaman forms a close bond with a spirit animal tied to her chosen spirit. This animal is her conduit to the spirit world, and together the shaman and spirit animal can access powerful spirit magic. The spirit animal also grants the shaman special abilities.',
    },
    {
      name: 'Spirit Magic',
      level: 1,
      description:
        'A shaman can spontaneously cast a limited number of spells per day beyond those she prepared ahead of time. She has one spell slot per day of each shaman spell level she can cast (not including orisons). She can choose these spells from the list of spells granted by her spirits.',
    },
    {
      name: 'Hex',
      level: 2,
      description:
        'At 2nd level, a shaman learns a new hex. She gains an additional hex at 4th, 8th, 10th, 12th, 16th, 18th, and 20th level. A shaman can select from any of the following hexes or from any of the hexes granted by her spirit.',
    },
    {
      name: 'Wandering Spirit',
      level: 4,
      description:
        'At 4th level, a shaman can form a temporary bond with a spirit other than the one selected using her spirit class feature. She must make this selection each day when preparing her spells. The wandering spirit grants the shaman the spirit ability, the hexes listed for that spirit, and the spirit spells.',
    },
    {
      name: 'Wandering Hex',
      level: 6,
      description:
        'At 6th level, a shaman can temporarily gain the use of one of the hexes possessed by either one of her spirits. She must make this selection each day when she prepares her spells. At 14th level, a shaman can change her wandering hex a second time each day.',
    },
    {
      name: 'Greater Spirit Magic',
      level: 12,
      description:
        'At 12th level, a shaman gains additional spirit magic spell slots from her wandering spirit. She gains one additional spell slot per day of each spell level she can cast from the list granted by her wandering spirit.',
    },
    {
      name: 'Manifestation',
      level: 20,
      description:
        'Upon reaching 20th level, the shaman becomes a living manifestation of her spirit. She gains the manifestation ability of her chosen spirit, a powerful capstone ability that reflects her deep connection to the spirit world.',
    },
  ],
};
