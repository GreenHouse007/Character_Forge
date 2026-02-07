import { CharacterClass } from '../../types/class';

export const antipaladin: CharacterClass = {
  name: 'Antipaladin',
  source: 'APG',
  description:
    'Although it is a rare occurrence, paladins do sometimes stray from the path of righteousness. Most of these wayward holy warriors seek redemption for their misdeeds. Yet there are others, the antipaladings, who turn actively to the powers of evil, becoming unholy warriors in service to the darkest powers.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude', 'will'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Bluff',
    'Craft',
    'Disguise',
    'Handle Animal',
    'Intimidate',
    'Knowledge (Religion)',
    'Profession',
    'Ride',
    'Sense Motive',
    'Spellcraft',
    'Stealth',
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
  alignmentRestrictions: ['CE'],
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
      name: 'Smite Good',
      description:
        'Once per day, an antipaladin can call upon the powers of evil to aid him in his struggle against good. As a swift action, the antipaladin chooses one target within sight to smite. If the target is good, the antipaladin adds his Charisma bonus (if any) to his attack rolls and adds his antipaladin level to all damage rolls made against the target of his smite. At 4th level and at every three levels thereafter, the antipaladin may smite good one additional time per day.',
      getUsesAtLevel: (level: number) =>
        1 + Math.floor((level - 1) / 3),
      resetsOn: 'rest',
    },
    {
      name: 'Touch of Corruption',
      description:
        'Beginning at 2nd level, an antipaladin surrounds his hand with a fiendish flame, causing terrible wounds to open on those he touches. Each day he can use this ability a number of times equal to 1/2 his antipaladin level + his Charisma modifier. With one use of this ability, an antipaladin can cause 1d6 points of damage for every two antipaladin levels he possesses.',
      getUsesAtLevel: (level: number, chaMod?: number) => {
        if (level < 2) return 0;
        return Math.floor(level / 2) + (chaMod ?? 0);
      },
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Aura of Evil',
      level: 1,
      description:
        'The power of an antipaladin\'s aura of evil is equal to his antipaladin level.',
    },
    {
      name: 'Detect Good',
      level: 1,
      description:
        'At will, an antipaladin can use detect good, as the spell. An antipaladin can, as a move action, concentrate on a single item or individual within 60 feet and determine if it is good, learning the strength of its aura as if having studied it for 3 rounds.',
    },
    {
      name: 'Smite Good',
      level: 1,
      description:
        'Once per day, an antipaladin can call upon the powers of evil to aid him in his struggle against good. As a swift action, the antipaladin chooses one target within sight to smite. If this target is good, the antipaladin adds his Charisma bonus (if any) to his attack rolls and adds his antipaladin level to all damage rolls made against the target of his smite. If the target of smite good is an outsider with the good subtype, a good-aligned dragon, or a celestial creature, the bonus to damage on the first successful attack increases to 2 points of damage per level the antipaladin possesses.',
    },
    {
      name: 'Unholy Resilience',
      level: 2,
      description:
        'At 2nd level, an antipaladin gains a bonus equal to his Charisma bonus (if any) on all saving throws.',
    },
    {
      name: 'Touch of Corruption',
      level: 2,
      description:
        'Beginning at 2nd level, an antipaladin surrounds his hand with a fiendish flame, causing terrible wounds to open on those he touches. Each day he can use this ability a number of times equal to 1/2 his antipaladin level + his Charisma modifier. With one use of this ability, an antipaladin can cause 1d6 points of damage for every two antipaladin levels he possesses. Using this ability is a standard action that does not provoke attacks of opportunity. Alternatively, an antipaladin can use this power to heal undead creatures, restoring 1d6 hit points for every two levels the antipaladin possesses.',
    },
    {
      name: 'Aura of Cowardice',
      level: 3,
      description:
        'At 3rd level, an antipaladin radiates a palpably daunting aura that causes all enemies within 10 feet to take a -4 penalty on saving throws against fear effects. Creatures that are normally immune to fear lose that immunity while within 10 feet of an antipaladin with this ability.',
    },
    {
      name: 'Plague Bringer',
      level: 3,
      description:
        'At 3rd level, the powers of darkness make an antipaladin a beacon of corruption and disease. An antipaladin does not take any damage or take any penalty from diseases. He can still contract diseases and spread them to others, but he is otherwise immune to their effects.',
    },
    {
      name: 'Cruelty',
      level: 3,
      description:
        'At 3rd level, and every three levels thereafter, an antipaladin can select one cruelty. Each cruelty adds an effect to the antipaladin\'s touch of corruption ability. Whenever the antipaladin uses touch of corruption to deal damage to one target, the target also receives the additional effect from one of the cruelties possessed by the antipaladin.',
    },
    {
      name: 'Channel Negative Energy',
      level: 4,
      description:
        'When an antipaladin reaches 4th level, he gains the supernatural ability to channel negative energy like a cleric. Using this ability consumes two uses of his touch of corruption ability. An antipaladin uses his level as his effective cleric level when channeling negative energy.',
    },
    {
      name: 'Fiendish Boon',
      level: 5,
      description:
        'Upon reaching 5th level, an antipaladin receives a boon from his dark patrons. This boon can take one of two forms. The first form allows the antipaladin to enhance his weapon as a standard action by calling upon the aid of a fiendish spirit. The second form grants an antipaladin a fiendish servant.',
    },
    {
      name: 'Aura of Despair',
      level: 8,
      description:
        'At 8th level, enemies within 10 feet of an antipaladin take a -2 penalty on all saving throws. This penalty does not stack with the penalty from aura of cowardice.',
    },
    {
      name: 'Aura of Vengeance',
      level: 11,
      description:
        'At 11th level, an antipaladin can expend two uses of his smite good ability to grant the ability to smite good to all allies within 10 feet, using his bonuses.',
    },
    {
      name: 'Aura of Sin',
      level: 14,
      description:
        'At 14th level, an antipaladin\'s weapons are treated as evil-aligned for the purposes of overcoming damage reduction. Any attack made against an enemy within 10 feet of him is treated as evil-aligned for the purposes of overcoming damage reduction.',
    },
    {
      name: 'Aura of Depravity',
      level: 17,
      description:
        'At 17th level, an antipaladin gains DR 5/good and immunity to compulsion spells and spell-like abilities. Each ally within 10 feet of him gains a +4 morale bonus on saving throws against compulsion effects.',
    },
    {
      name: 'Unholy Champion',
      level: 20,
      description:
        'At 20th level, an antipaladin becomes a conduit for the might of the dark powers. His DR increases to 10/good. Whenever he uses smite good and successfully strikes a good outsider, the outsider is also subject to a banishment, using his antipaladin level as the caster level. After the banishment effect and the damage from the attack is resolved, the smite immediately ends. In addition, whenever he channels negative energy or uses touch of corruption to damage a creature, he deals the maximum possible amount.',
    },
  ],
};
