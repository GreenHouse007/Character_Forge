import { CharacterClass } from '../../types/class';

export const medium: CharacterClass = {
  name: 'Medium',
  source: 'OA',
  description:
    'A medium channels spirits from the great beyond into his body, granting him extraordinary abilities. By allowing spirits to influence him, the medium gains access to remarkable powers, but must be careful not to lose himself to the spirits\' influence.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['will'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Bluff',
    'Craft',
    'Diplomacy',
    'Fly',
    'Heal',
    'Intimidate',
    'Knowledge (Arcana)',
    'Knowledge (Planes)',
    'Knowledge (Religion)',
    'Linguistics',
    'Perception',
    'Perform',
    'Profession',
    'Sense Motive',
    'Spellcraft',
    'Use Magic Device',
  ],
  startingWealth: {
    dice: { count: 4, sides: 6 },
    multiplier: 10,
    average: 140,
  },
  proficiencies: {
    weapons: ['simple'],
    armor: ['light', 'medium'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'spontaneous',
    castingAbility: 'cha',
    maxSpellLevel: 4,
    spellsPerDay: {
      1:  { 0: 2, 1: 1 },
      2:  { 0: 3, 1: 2 },
      3:  { 0: 3, 1: 3 },
      4:  { 0: 3, 1: 3, 2: 1 },
      5:  { 0: 4, 1: 4, 2: 2 },
      6:  { 0: 4, 1: 4, 2: 3 },
      7:  { 0: 4, 1: 4, 2: 3, 3: 1 },
      8:  { 0: 4, 1: 4, 2: 4, 3: 2 },
      9:  { 0: 5, 1: 5, 2: 4, 3: 3 },
      10: { 0: 5, 1: 5, 2: 4, 3: 3, 4: 1 },
      11: { 0: 5, 1: 5, 2: 4, 3: 4, 4: 2 },
      12: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3 },
      13: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 3 },
      14: { 0: 5, 1: 5, 2: 5, 3: 4, 4: 4 },
      15: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4 },
      16: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4 },
      17: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 4 },
      18: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5 },
      19: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5 },
      20: { 0: 5, 1: 5, 2: 5, 3: 5, 4: 5 },
    },
    spellsKnown: {
      1:  { 0: 2, 1: 1 },
      2:  { 0: 3, 1: 2 },
      3:  { 0: 3, 1: 3 },
      4:  { 0: 4, 1: 3, 2: 1 },
      5:  { 0: 4, 1: 4, 2: 2 },
      6:  { 0: 4, 1: 4, 2: 3 },
      7:  { 0: 5, 1: 4, 2: 3, 3: 1 },
      8:  { 0: 5, 1: 4, 2: 4, 3: 2 },
      9:  { 0: 5, 1: 5, 2: 4, 3: 3 },
      10: { 0: 5, 1: 5, 2: 4, 3: 3, 4: 1 },
      11: { 0: 6, 1: 5, 2: 4, 3: 4, 4: 2 },
      12: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3 },
      13: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 3 },
      14: { 0: 6, 1: 5, 2: 5, 3: 4, 4: 4 },
      15: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4 },
      16: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4 },
      17: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 4 },
      18: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5 },
      19: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5 },
      20: { 0: 6, 1: 5, 2: 5, 3: 5, 4: 5 },
    },
  },
  classFeatures: [
    {
      name: 'Knacks',
      level: 1,
      description:
        'A medium learns a number of knacks, or 0-level spells. These spells are cast like any other spell, but they do not consume any slots and may be used again.',
    },
    {
      name: 'Spirit',
      level: 1,
      description:
        'A medium serves as a vessel to channel spirits, powerful appearance of living or dead creatures. Each day, a medium can channel a spirit through a seance. A spirit grants a number of abilities based on the medium\'s level. A spirit has one of six legends: Archmage, Champion, Guardian, Hierophant, Marshal, or Trickster.',
    },
    {
      name: 'Spirit Bonus',
      level: 1,
      description:
        'When a medium channels a spirit, he gains a spirit bonus on certain checks and statistics depending on the spirit\'s legend. This bonus starts at +1 at 1st level and increases by 1 at 4th level and every 4 levels thereafter (to a maximum of +6 at 20th level).',
    },
    {
      name: 'Shared Seance',
      level: 2,
      description:
        'At 2nd level, a medium can share the benefit of his seance with his allies. All allies who participate in the medium\'s seance gain a lesser version of the channeled spirit\'s seance boon for 24 hours.',
    },
    {
      name: 'Taboo',
      level: 2,
      description:
        'At 2nd level, a medium must accept a taboo to gain the full benefit of a channeled spirit. The taboo is a restriction on the medium\'s behavior. If the medium breaks a taboo, the spirit\'s influence over the medium increases by 1.',
    },
    {
      name: 'Haunt Channeler',
      level: 3,
      description:
        'At 3rd level, a medium can use his connection to the spirit world to detect and interact with haunts. The medium can detect haunts as if using detect undead. Additionally, the medium can touch a haunt to channel energy into it, allowing him to make a Charisma check to put the haunt temporarily to rest.',
    },
    {
      name: 'Location Channel',
      level: 5,
      description:
        'At 5th level, a medium can channel a spirit tied to a specific location without performing a seance. The medium must spend 1 hour at the location, after which he can channel the location\'s spirit for 24 hours.',
    },
    {
      name: 'Connection Channel',
      level: 7,
      description:
        'At 7th level, a medium can channel a spirit using an object or creature closely associated with that spirit. The medium must spend 1 hour with the associated object or creature, after which he can channel the associated spirit for 24 hours.',
    },
    {
      name: 'Ask the Spirits',
      level: 9,
      description:
        'At 9th level, a medium can ask the spirits questions and receive answers. This functions as the commune spell, using the medium\'s class level as his caster level. The medium can use this ability once per day.',
    },
    {
      name: 'Propitiation',
      level: 11,
      description:
        'At 11th level, a medium can attempt to appease a channeled spirit in order to regain its favor. By performing a special ritual that takes 10 minutes, the medium can reduce the spirit\'s influence over him by 1 point.',
    },
    {
      name: 'Spirit Mastery',
      level: 20,
      description:
        'At 20th level, a medium has mastered the art of channeling spirits. He can channel two spirits at once, gaining the full benefits of both. Additionally, the medium is immune to the negative effects of spirit influence.',
    },
  ],
};
