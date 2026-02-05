import { CharacterClass } from '../../types/class';

export const barbarian: CharacterClass = {
  name: 'Barbarian',
  source: 'CRB',
  description:
    'For some, there is only rage. In the ways of their people, in the fury of their passion, in the howl of battle, conflict is all these brutal souls know. Savages, hired muscle, masters of vicious martial techniques, they are not combatants combating in the structured confines of disciplines — they are warriors who rely on raw power and ferocity.',
  hitDie: 12,
  babProgression: 'full',
  goodSaves: ['fortitude'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Acrobatics',
    'Climb',
    'Craft',
    'Handle Animal',
    'Intimidate',
    'Knowledge (Nature)',
    'Perception',
    'Ride',
    'Survival',
    'Swim',
  ],
  startingWealth: {
    dice: { count: 3, sides: 6 },
    multiplier: 10,
    average: 105,
  },
  proficiencies: {
    weapons: ['simple', 'martial'],
    armor: ['light', 'medium'],
    shields: ['shields (except tower shields)'],
  },
  alignmentRestrictions: ['CG', 'CN', 'CE', 'NG', 'TN', 'NE'],
  spellProgression: {
    type: 'none',
  },
  classResources: [
    {
      name: 'Rage',
      description:
        'A barbarian can rage for a number of rounds per day equal to 4 + her Constitution modifier. At each level after 1st, she can rage for 2 additional rounds per day.',
      getUsesAtLevel: (level: number, conMod?: number) =>
        4 + (conMod ?? 0) + (level - 1) * 2,
      resetsOn: 'rest',
    },
  ],
  classFeatures: [
    {
      name: 'Fast Movement',
      level: 1,
      description:
        "A barbarian's land speed is faster than the norm for her race by +10 feet. This benefit applies only when she is wearing no armor, light armor, or medium armor, and not carrying a heavy load.",
    },
    {
      name: 'Rage',
      level: 1,
      description:
        'A barbarian can call upon inner reserves of strength and ferocity, granting her additional combat prowess. At 1st level, a barbarian can rage for a number of rounds per day equal to 4 + her Constitution modifier. She gains a +4 morale bonus to her Strength and Constitution, as well as a +2 morale bonus on Will saves. In addition, she takes a -2 penalty to Armor Class.',
    },
    {
      name: 'Rage Powers',
      level: 2,
      description:
        'As a barbarian gains levels, she learns to use her rage in new ways. Starting at 2nd level, a barbarian gains a rage power. She gains another rage power for every two levels of barbarian attained after 2nd level.',
    },
    {
      name: 'Uncanny Dodge',
      level: 2,
      description:
        'At 2nd level, a barbarian gains the ability to react to danger before her senses would normally allow her to do so. She cannot be caught flat-footed, nor does she lose her Dex bonus to AC if the attacker is invisible. She still loses her Dexterity bonus to AC if immobilized.',
    },
    {
      name: 'Trap Sense +1',
      level: 3,
      description:
        'At 3rd level, a barbarian gains a +1 bonus on Reflex saves made to avoid traps and a +1 dodge bonus to AC against attacks made by traps. These bonuses increase by +1 every three barbarian levels thereafter (6th, 9th, 12th, 15th, and 18th level).',
    },
    {
      name: 'Improved Uncanny Dodge',
      level: 5,
      description:
        'At 5th level and higher, a barbarian can no longer be flanked. This defense denies a rogue the ability to sneak attack the barbarian by flanking her, unless the attacker has at least four more rogue levels than the target has barbarian levels.',
    },
    {
      name: 'Trap Sense +2',
      level: 6,
      description:
        'At 6th level, a barbarian gains a +2 bonus on Reflex saves made to avoid traps and a +2 dodge bonus to AC against attacks made by traps.',
    },
    {
      name: 'Damage Reduction 1/—',
      level: 7,
      description:
        'At 7th level, a barbarian gains damage reduction. Subtract 1 from the damage the barbarian takes each time she is dealt damage from a weapon or a natural attack. This increases by 1 at 10th, 13th, 16th, and 19th level. Damage reduction can reduce damage to 0 but not below 0.',
    },
    {
      name: 'Trap Sense +3',
      level: 9,
      description:
        'At 9th level, trap sense bonus increases to +3.',
    },
    {
      name: 'Damage Reduction 2/—',
      level: 10,
      description:
        'At 10th level, damage reduction increases to 2/—.',
    },
    {
      name: 'Greater Rage',
      level: 11,
      description:
        'At 11th level, when a barbarian enters rage, the morale bonus to her Strength and Constitution increases to +6 and the morale bonus on her Will saves increases to +3.',
    },
    {
      name: 'Trap Sense +4',
      level: 12,
      description:
        'At 12th level, trap sense bonus increases to +4.',
    },
    {
      name: 'Damage Reduction 3/—',
      level: 13,
      description:
        'At 13th level, damage reduction increases to 3/—.',
    },
    {
      name: 'Indomitable Will',
      level: 14,
      description:
        'While in rage, a barbarian of 14th level or higher gains a +4 bonus on Will saves to resist enchantment spells. This bonus stacks with all other modifiers, including the morale bonus on Will saves she also receives during her rage.',
    },
    {
      name: 'Trap Sense +5',
      level: 15,
      description:
        'At 15th level, trap sense bonus increases to +5.',
    },
    {
      name: 'Damage Reduction 4/—',
      level: 16,
      description:
        'At 16th level, damage reduction increases to 4/—.',
    },
    {
      name: 'Tireless Rage',
      level: 17,
      description:
        'Starting at 17th level, a barbarian no longer becomes fatigued at the end of her rage.',
    },
    {
      name: 'Trap Sense +6',
      level: 18,
      description:
        'At 18th level, trap sense bonus increases to +6.',
    },
    {
      name: 'Damage Reduction 5/—',
      level: 19,
      description:
        'At 19th level, damage reduction increases to 5/—.',
    },
    {
      name: 'Mighty Rage',
      level: 20,
      description:
        'At 20th level, when a barbarian enters rage, the morale bonus to her Strength and Constitution increases to +8 and the morale bonus on her Will saves increases to +4.',
    },
  ],
};
