import { CharacterClass } from '../../types/class';

export const paladin: CharacterClass = {
  name: 'Paladin',
  source: 'CRB',
  description:
    'Through a select, born combatant of the divine, the voice of justice combats the forces of darkness. These holy champions are combatants against evil and faithful servants of the divine. With sword and spell, paladins enforce the word of their deity and pursue the path of good.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Craft',
    'Diplomacy',
    'Handle Animal',
    'Heal',
    'Knowledge (Nobility)',
    'Knowledge (Religion)',
    'Profession',
    'Ride',
    'Sense Motive',
    'Spellcraft',
  ],
  startingWealth: {
    dice: { count: 5, sides: 6 },
    multiplier: 10,
    average: 175,
  },
  proficiencies: {
    weapons: ['simple', 'martial'],
    armor: ['light', 'medium', 'heavy'],
    shields: ['all shields (including tower shields)'],
  },
  alignmentRestrictions: ['LG'],
  spellProgression: {
    type: 'prepared',
    castingAbility: 'cha',
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
      name: 'Smite Evil',
      description:
        'Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. She adds her Charisma bonus to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. At 4th level and at every three levels thereafter, the paladin may smite evil one additional time per day.',
      getUsesAtLevel: (level: number) =>
        1 + Math.floor((level - 1) / 3),
      resetsOn: 'rest',
    },
    {
      name: 'Lay on Hands',
      description:
        'Beginning at 2nd level, a paladin can heal wounds (her own or those of others) by touch. Each day she can use this ability a number of times equal to 1/2 her paladin level plus her Charisma modifier. Each use heals 1d6 hit points of damage for every two paladin levels she possesses.',
      getUsesAtLevel: (level: number, chaMod?: number) => {
        if (level < 2) return 0;
        return Math.floor(level / 2) + (chaMod ?? 0);
      },
      resetsOn: 'rest',
    },
    {
      name: 'Channel Positive Energy',
      description:
        'When a paladin reaches 4th level, she gains the supernatural ability to channel positive energy like a cleric. Using this ability consumes two uses of her lay on hands ability. A paladin uses her level as her effective cleric level when channeling positive energy.',
      getUsesAtLevel: (level: number, chaMod?: number) => {
        if (level < 4) return 0;
        // Uses lay on hands uses, so this returns available channels
        return Math.floor((Math.floor(level / 2) + (chaMod ?? 0)) / 2);
      },
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Aura of Good',
      level: 1,
      description:
        'The power of a paladin\'s aura of good is equal to her paladin level.',
    },
    {
      name: 'Detect Evil',
      level: 1,
      description:
        'At will, a paladin can use detect evil, as the spell. A paladin can, as a move action, concentrate on a single item or individual within 60 feet and determine if it is evil, learning the strength of its aura as if having studied it for 3 rounds.',
    },
    {
      name: 'Smite Evil',
      level: 1,
      description:
        'Once per day, a paladin can call out to the powers of good to aid her in her struggle against evil. As a swift action, the paladin chooses one target within sight to smite. If this target is evil, the paladin adds her Charisma bonus (if any) to her attack rolls and adds her paladin level to all damage rolls made against the target of her smite. If the target of smite evil is an outsider with the evil subtype, an evil-aligned dragon, or an undead creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the paladin possesses.',
    },
    {
      name: 'Divine Grace',
      level: 2,
      description:
        'At 2nd level, a paladin gains a bonus equal to her Charisma bonus (if any) on all saving throws.',
    },
    {
      name: 'Lay on Hands',
      level: 2,
      description:
        'Beginning at 2nd level, a paladin can heal wounds (her own or those of others) by touch. Each day she can use this ability a number of times equal to 1/2 her paladin level plus her Charisma modifier. With one use of this ability, a paladin can heal 1d6 hit points of damage for every two paladin levels she possesses. Using this ability is a standard action, unless the paladin targets herself, in which case it is a swift action.',
    },
    {
      name: 'Aura of Courage',
      level: 3,
      description:
        'At 3rd level, a paladin is immune to fear (magical or otherwise). Each ally within 10 feet of her gains a +4 morale bonus on saving throws against fear effects. This ability functions only while the paladin is conscious, not if she is unconscious or dead.',
    },
    {
      name: 'Divine Health',
      level: 3,
      description:
        'At 3rd level, a paladin is immune to all diseases, including supernatural and magical diseases.',
    },
    {
      name: 'Mercy',
      level: 3,
      description:
        'At 3rd level, and every three levels thereafter, a paladin can select one mercy. Each mercy adds an effect to the paladin\'s lay on hands ability. Whenever the paladin uses lay on hands to heal damage to one target, the target also receives the additional effects from all of the mercies possessed by the paladin.',
    },
    {
      name: 'Channel Positive Energy',
      level: 4,
      description:
        'When a paladin reaches 4th level, she gains the supernatural ability to channel positive energy like a cleric. Using this ability consumes two uses of her lay on hands ability. A paladin uses her level as her effective cleric level when channeling positive energy.',
    },
    {
      name: 'Spells',
      level: 4,
      description:
        'Beginning at 4th level, a paladin gains the ability to cast a small number of divine spells which are drawn from the paladin spell list. A paladin must choose and prepare her spells in advance. Her caster level is equal to her paladin level - 3.',
    },
    {
      name: 'Divine Bond',
      level: 5,
      description:
        'Upon reaching 5th level, a paladin forms a divine bond with her god. This bond can take one of two forms. The first form allows the paladin to enhance her weapon as a standard action by calling upon the aid of a celestial spirit for 1 minute per paladin level. The second form grants a paladin a loyal steed.',
    },
    {
      name: 'Aura of Resolve',
      level: 8,
      description:
        'At 8th level, a paladin is immune to charm spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against charm effects.',
    },
    {
      name: 'Aura of Justice',
      level: 11,
      description:
        'At 11th level, a paladin can expend two uses of her smite evil ability to grant the ability to smite evil to all allies within 10 feet, using her bonuses.',
    },
    {
      name: 'Aura of Faith',
      level: 14,
      description:
        'At 14th level, a paladin\'s weapons are treated as good-aligned for the purposes of overcoming damage reduction. Any attack made against an enemy within 10 feet of her is treated as good-aligned for the purposes of overcoming damage reduction.',
    },
    {
      name: 'Aura of Righteousness',
      level: 17,
      description:
        'At 17th level, a paladin gains DR 5/evil and immunity to compulsion spells and spell-like abilities. Each ally within 10 feet of her gains a +4 morale bonus on saving throws against compulsion effects.',
    },
    {
      name: 'Holy Champion',
      level: 20,
      description:
        'At 20th level, a paladin becomes a conduit for the power of her god. Her DR increases to 10/evil. Whenever she uses smite evil and successfully strikes an evil outsider, the outsider is also subject to a banishment, using her paladin level as the caster level. After the banishment effect and the damage from the attack is resolved, the smite immediately ends. In addition, whenever she channels positive energy or uses lay on hands to heal a creature, she heals the maximum possible amount.',
    },
  ],
};
