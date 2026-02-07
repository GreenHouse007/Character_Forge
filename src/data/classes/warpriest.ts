import { CharacterClass } from '../../types/class';

export const warpriest: CharacterClass = {
  name: 'Warpriest',
  source: 'ACG',
  description:
    'Capable of calling upon the power of the gods in the form of blessings and spells, warpriests blend divine magic with martial skill. They are unflinching combatants who use both steel and spell to further the causes of their faiths.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Climb',
    'Craft',
    'Diplomacy',
    'Handle Animal',
    'Heal',
    'Intimidate',
    'Knowledge (Engineering)',
    'Knowledge (Religion)',
    'Profession',
    'Ride',
    'Sense Motive',
    'Spellcraft',
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
    armor: ['light', 'medium', 'heavy'],
    shields: ['shields (except tower shields)'],
  },
  spellProgression: {
    type: 'prepared',
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
  },
  classResources: [
    {
      name: 'Fervor',
      description:
        'At 2nd level, a warpriest can draw upon the power of his faith to heal wounds or harm foes. He can use this ability a number of times per day equal to 1/2 his warpriest level + his Charisma modifier (minimum 1).',
      getUsesAtLevel: (level: number, chaMod?: number) =>
        Math.max(1, Math.floor(level / 2) + (chaMod ?? 0)),
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Aura',
      level: 1,
      description:
        'A warpriest of a chaotic, evil, good, or lawful deity has a particularly powerful aura corresponding to the deity\'s alignment.',
    },
    {
      name: 'Blessings',
      level: 1,
      description:
        'A warpriest\'s deity influences his alignment, what magic he can perform, his values, and how others see him. Each warpriest can select two blessings from among those granted by his deity. Each blessing grants a minor power at 1st level and a major power at 10th level.',
    },
    {
      name: 'Focus Weapon',
      level: 1,
      description:
        'At 1st level, a warpriest receives Weapon Focus as a bonus feat (he can choose any weapon, not just his deity\'s favored weapon).',
    },
    {
      name: 'Sacred Weapon',
      level: 1,
      description:
        'At 1st level, weapons wielded by a warpriest are charged with the power of his faith. In addition to the favored weapon of his deity, the warpriest can designate a weapon as a sacred weapon by selecting that weapon with the Weapon Focus feat. The warpriest\'s sacred weapon damage increases as he gains levels.',
    },
    {
      name: 'Fervor',
      level: 2,
      description:
        'At 2nd level, a warpriest can draw upon the power of his faith to heal wounds or harm foes. He can also use this ability to quickly cast spells that aid in his struggles. Using fervor to cast a spell is a swift action that doesn\'t provoke attacks of opportunity.',
    },
    {
      name: 'Bonus Feat',
      level: 3,
      description:
        'At 3rd level and every 3 levels thereafter, a warpriest gains a bonus feat in addition to those gained from normal advancement. These bonus feats must be selected from those listed as combat feats.',
    },
    {
      name: 'Channel Energy',
      level: 4,
      description:
        'Starting at 4th level, a warpriest can release a wave of energy by channeling the power of his faith through his holy (or unholy) symbol. Using this ability consumes two uses of his fervor ability. This is identical to the cleric\'s channel energy ability, except that the amount of damage dealt or healed is equal to the amount listed in the fervor ability.',
    },
    {
      name: 'Sacred Armor',
      level: 7,
      description:
        'At 7th level, the warpriest gains the ability to enhance his armor with divine power as a swift action. This power grants the armor a +1 enhancement bonus. For every 3 levels beyond 7th, this bonus increases by 1 (to a maximum of +5 at 19th level).',
    },
    {
      name: 'Aspect of War',
      level: 20,
      description:
        'At 20th level, the warpriest can channel an aspect of war, growing in power and stature. Once per day as a swift action, a warpriest can treat his level as his base attack bonus, gains DR 10/-, and can move at his full speed regardless of the armor he is wearing or his encumbrance. In addition, the bonuses of his sacred armor and sacred weapon increase to +2. This lasts for 1 minute.',
    },
  ],
};
