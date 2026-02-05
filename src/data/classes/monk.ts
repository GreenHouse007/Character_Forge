import { CharacterClass } from '../../types/class';

export const monk: CharacterClass = {
  name: 'Monk',
  source: 'CRB',
  description:
    'For the truly combative combatant who seeks to become one with their weapon, the path of the monk is enlightening. These combatants sacrifice the use of traditional weapons and heavy armor in order to train their bodies to be lethal weapons.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['fortitude', 'reflex', 'will'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Acrobatics',
    'Climb',
    'Craft',
    'Escape Artist',
    'Intimidate',
    'Knowledge (History)',
    'Knowledge (Religion)',
    'Perception',
    'Perform',
    'Profession',
    'Ride',
    'Sense Motive',
    'Stealth',
    'Swim',
  ],
  startingWealth: {
    dice: { count: 1, sides: 6 },
    multiplier: 10,
    average: 35,
  },
  proficiencies: {
    weapons: [
      'brass knuckles',
      'cestus',
      'club',
      'crossbow (light or heavy)',
      'dagger',
      'handaxe',
      'javelin',
      'kama',
      'nunchaku',
      'quarterstaff',
      'sai',
      'shortspear',
      'short sword',
      'shuriken',
      'siangham',
      'sling',
      'spear',
    ],
    armor: [],
    shields: [],
  },
  alignmentRestrictions: ['LG', 'LN', 'LE'],
  spellProgression: {
    type: 'none',
  },
  bonusFeats: [
    { level: 1, note: 'Bonus feat (Improved Grapple, Scorpion Style, or Throw Anything)' },
    { level: 2, note: 'Bonus feat (Combat Reflexes, Deflect Arrows, Dodge, Improved Disarm, Improved Feint, Improved Trip, or Mobility)' },
    { level: 6, note: 'Bonus feat (Gorgon\'s Fist, Improved Bull Rush, Improved Disarm, Improved Feint, Improved Trip, or Mobility)' },
    { level: 10, note: 'Bonus feat (Improved Critical, Medusa\'s Wrath, Snatch Arrows, or Spring Attack)' },
    { level: 14, note: 'Bonus feat' },
    { level: 18, note: 'Bonus feat' },
  ],
  classResources: [
    {
      name: 'Ki Pool',
      description:
        'At 4th level, a monk gains a pool of ki points, supernatural energy he can use to accomplish amazing feats. The number of points in a monk\'s ki pool is equal to 1/2 his monk level + his Wisdom modifier. As long as he has at least 1 point in his ki pool, he can make a ki strike.',
      getUsesAtLevel: (level: number, wisMod?: number) => {
        if (level < 4) return 0;
        return Math.floor(level / 2) + (wisMod ?? 0);
      },
      resetsOn: 'rest',
    },
    {
      name: 'Stunning Fist',
      description:
        'At 1st level, the monk gains Stunning Fist as a bonus feat, even if he does not meet the prerequisites. The monk may attempt a stunning fist attack a number of times per day equal to his monk level, plus one for every four levels he has in classes other than monk.',
      getUsesAtLevel: (level: number) => level,
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Bonus Feat',
      level: 1,
      description:
        'At 1st level, a monk may select either Improved Grapple, Scorpion Style, or Throw Anything as a bonus feat. At 2nd level, he may select Combat Reflexes, Deflect Arrows, Dodge, Improved Disarm, Improved Feint, Improved Trip, or Mobility as a bonus feat. At 6th, 10th, 14th, and 18th levels, a monk gains additional bonus feats.',
    },
    {
      name: 'Flurry of Blows',
      level: 1,
      description:
        'Starting at 1st level, a monk can make a flurry of blows as a full-attack action. When doing so, he may make one additional attack, taking a -2 penalty on all of his attack rolls, as if using the Two-Weapon Fighting feat. At 8th level, the monk can make two additional attacks when he uses flurry of blows, as if using Improved Two-Weapon Fighting. At 15th level, the monk can make three additional attacks using flurry of blows, as if using Greater Two-Weapon Fighting.',
    },
    {
      name: 'Stunning Fist',
      level: 1,
      description:
        'At 1st level, the monk gains Stunning Fist as a bonus feat, even if he does not meet the prerequisites. At 4th level, and every 4 levels thereafter, the monk gains the ability to apply a new condition to the target of his Stunning Fist.',
    },
    {
      name: 'Unarmed Strike',
      level: 1,
      description:
        'At 1st level, a monk gains Improved Unarmed Strike as a bonus feat. A monk\'s attacks may be with fist, elbows, knees, and feet. A monk deals 1d6 damage at 1st level (Medium). This damage increases at 4th level (1d8), 8th level (1d10), 12th level (2d6), 16th level (2d8), and 20th level (2d10).',
    },
    {
      name: 'Evasion',
      level: 2,
      description:
        'At 2nd level or higher, a monk can avoid damage from many area-effect attacks. If a monk makes a successful Reflex saving throw against an attack that normally deals half damage on a successful save, he instead takes no damage.',
    },
    {
      name: 'Fast Movement',
      level: 3,
      description:
        'At 3rd level, a monk gains an enhancement bonus to his land speed of +10 feet. This bonus increases by 10 feet at every three monk levels thereafter (to +20 ft at 6th, +30 ft at 9th, +40 ft at 12th, +50 ft at 15th, and +60 ft at 18th). A monk in armor or carrying a medium or heavy load loses this extra speed.',
    },
    {
      name: 'Maneuver Training',
      level: 3,
      description:
        'At 3rd level, a monk uses his monk level in place of his base attack bonus when calculating his Combat Maneuver Bonus. Base attack bonuses granted by other classes are unaffected and are added normally.',
    },
    {
      name: 'Still Mind',
      level: 3,
      description:
        'A monk of 3rd level or higher gains a +2 bonus on saving throws against enchantment spells and effects.',
    },
    {
      name: 'Ki Pool',
      level: 4,
      description:
        'At 4th level, a monk gains a pool of ki points, supernatural energy he can use to accomplish amazing feats. The number of points in a monk\'s ki pool is equal to 1/2 his monk level + his Wisdom modifier. By spending 1 point from his ki pool, a monk can make one additional attack at his highest attack bonus when making a flurry of blows attack. In addition, he can spend 1 point to increase his speed by 20 feet for 1 round. At 4th level, ki strike allows his unarmed attacks to be treated as magic weapons. At 7th level, his unarmed attacks are also treated as cold iron and silver. At 10th level, his unarmed attacks are also treated as lawful weapons. At 16th level, his unarmed attacks are treated as adamantine weapons.',
    },
    {
      name: 'Slow Fall (20 ft.)',
      level: 4,
      description:
        'At 4th level or higher, a monk within arm\'s reach of a wall can use it to slow his descent. When first gaining this ability, he takes damage as if the fall were 20 feet shorter than it actually is. The monk\'s ability to slow his fall improves with his monk level: 30 ft. at 6th, 40 ft. at 8th, 50 ft. at 10th, 60 ft. at 12th, 70 ft. at 14th, 80 ft. at 16th, 90 ft. at 18th, and any distance at 20th.',
    },
    {
      name: 'High Jump',
      level: 5,
      description:
        'At 5th level, a monk adds his level to all Acrobatics checks made to jump, both for vertical jumps and horizontal jumps. In addition, he always counts as having a running start when making jump checks using Acrobatics. By spending 1 point from his ki pool as a swift action, a monk gains a +20 bonus on Acrobatics checks made to jump for 1 round.',
    },
    {
      name: 'Purity of Body',
      level: 5,
      description:
        'At 5th level, a monk gains immunity to all diseases, including supernatural and magical diseases.',
    },
    {
      name: 'Wholeness of Body',
      level: 7,
      description:
        'At 7th level or higher, a monk can heal his own wounds as a standard action. He can heal a number of hit points of damage equal to his monk level by using 2 points from his ki pool.',
    },
    {
      name: 'Improved Evasion',
      level: 9,
      description:
        'At 9th level, a monk\'s evasion ability improves. He still takes no damage on a successful Reflex saving throw against attacks, but henceforth he takes only half damage on a failed save.',
    },
    {
      name: 'Diamond Body',
      level: 11,
      description:
        'At 11th level, a monk gains immunity to poisons of all kinds.',
    },
    {
      name: 'Abundant Step',
      level: 12,
      description:
        'At 12th level or higher, a monk can slip magically between spaces, as if using the spell dimension door. Using this ability is a move action that consumes 2 points from his ki pool.',
    },
    {
      name: 'Diamond Soul',
      level: 13,
      description:
        'At 13th level, a monk gains spell resistance equal to his current monk level + 10. In order to affect the monk with a spell, a spellcaster must get a result on a caster level check (1d20 + caster level) that equals or exceeds the monk\'s spell resistance.',
    },
    {
      name: 'Quivering Palm',
      level: 15,
      description:
        'Starting at 15th level, a monk can set up vibrations within the body of another creature that can thereafter be fatal if the monk so desires. He can use this quivering palm attack once per day, and he must announce his intent before making his attack roll. The quivering palm can be used on a creature hit by one of the monk\'s unarmed attacks. The target must make a Fortitude saving throw (DC 10 + 1/2 the monk\'s level + the monk\'s Wis modifier) or die.',
    },
    {
      name: 'Timeless Body',
      level: 17,
      description:
        'At 17th level, a monk no longer takes penalties to his ability scores for aging and cannot be magically aged.',
    },
    {
      name: 'Tongue of the Sun and Moon',
      level: 17,
      description:
        'A monk of 17th level or higher can speak with any living creature.',
    },
    {
      name: 'Empty Body',
      level: 19,
      description:
        'At 19th level, a monk gains the ability to assume an ethereal state for 1 round as a move action, using 3 points from his ki pool. This ability functions as the etherealness spell.',
    },
    {
      name: 'Perfect Self',
      level: 20,
      description:
        'At 20th level, a monk becomes a magical creature. He is forevermore treated as an outsider rather than as a humanoid (or whatever the monk\'s creature type was) for the purpose of spells and magical effects. Additionally, the monk gains damage reduction 10/chaotic, which allows him to ignore the first 10 points of damage from any attack made by a nonchaotic weapon or by any natural attack made by a creature that doesn\'t have similar damage reduction.',
    },
  ],
};
