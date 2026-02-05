import { CharacterClass } from '../../types/class';

export const fighter: CharacterClass = {
  name: 'Fighter',
  source: 'CRB',
  description:
    'Some take up arms for glory, wealth, or revenge. Others do battle to prove themselves, to protect others, or because they know nothing else. Still others learn the ways of weaponcraft to hone their bodies in battle and prove their mettle in the forge of war.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude'],
  skillRanksPerLevel: 2,
  classSkills: [
    'Climb',
    'Craft',
    'Handle Animal',
    'Intimidate',
    'Knowledge (Dungeoneering)',
    'Knowledge (Engineering)',
    'Profession',
    'Ride',
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
    shields: ['all shields (including tower shields)'],
  },
  spellProgression: {
    type: 'none',
  },
  bonusFeats: [
    { level: 1, note: 'Bonus combat feat' },
    { level: 2, note: 'Bonus combat feat' },
    { level: 4, note: 'Bonus combat feat' },
    { level: 6, note: 'Bonus combat feat' },
    { level: 8, note: 'Bonus combat feat' },
    { level: 10, note: 'Bonus combat feat' },
    { level: 12, note: 'Bonus combat feat' },
    { level: 14, note: 'Bonus combat feat' },
    { level: 16, note: 'Bonus combat feat' },
    { level: 18, note: 'Bonus combat feat' },
    { level: 20, note: 'Bonus combat feat' },
  ],
  classFeatures: [
    {
      name: 'Bonus Feats',
      level: 1,
      description:
        'At 1st level, and at every even level thereafter, a fighter gains a bonus feat in addition to those gained from normal advancement (meaning that the fighter gains a feat at every level). These bonus feats must be selected from those listed as combat feats.',
    },
    {
      name: 'Bravery +1',
      level: 2,
      description:
        'Starting at 2nd level, a fighter gains a +1 bonus on Will saves against fear. This bonus increases by +1 for every four levels beyond 2nd.',
    },
    {
      name: 'Armor Training 1',
      level: 3,
      description:
        'Starting at 3rd level, a fighter learns to be more maneuverable while wearing armor. Whenever he is wearing armor, he reduces the armor check penalty by 1 (to a minimum of 0) and increases the maximum Dexterity bonus allowed by his armor by 1. Every four levels thereafter (7th, 11th, and 15th), these bonuses increase by +1 each time.',
    },
    {
      name: 'Weapon Training 1',
      level: 5,
      description:
        'Starting at 5th level, a fighter can select one group of weapons. Whenever he attacks with a weapon from this group, he gains a +1 bonus on attack and damage rolls. Every four levels thereafter (9th, 13th, and 17th), a fighter becomes further trained in another group of weapons. He gains a +1 bonus on attack and damage rolls when using a weapon from this group. In addition, the bonuses granted by previous weapon groups increase by +1 each.',
    },
    {
      name: 'Bravery +2',
      level: 6,
      description: 'At 6th level, bravery bonus increases to +2.',
    },
    {
      name: 'Armor Training 2',
      level: 7,
      description:
        'At 7th level, armor training bonuses increase by +1 (total -2 armor check penalty reduction and +2 max Dex bonus increase).',
    },
    {
      name: 'Weapon Training 2',
      level: 9,
      description:
        'At 9th level, the fighter selects a second weapon group and gains a +1 bonus with it. Previous weapon group bonuses increase by +1.',
    },
    {
      name: 'Bravery +3',
      level: 10,
      description: 'At 10th level, bravery bonus increases to +3.',
    },
    {
      name: 'Armor Training 3',
      level: 11,
      description:
        'At 11th level, armor training bonuses increase by +1 (total -3 armor check penalty reduction and +3 max Dex bonus increase).',
    },
    {
      name: 'Weapon Training 3',
      level: 13,
      description:
        'At 13th level, the fighter selects a third weapon group and gains a +1 bonus with it. Previous weapon group bonuses increase by +1.',
    },
    {
      name: 'Bravery +4',
      level: 14,
      description: 'At 14th level, bravery bonus increases to +4.',
    },
    {
      name: 'Armor Training 4',
      level: 15,
      description:
        'At 15th level, armor training bonuses increase by +1 (total -4 armor check penalty reduction and +4 max Dex bonus increase).',
    },
    {
      name: 'Weapon Training 4',
      level: 17,
      description:
        'At 17th level, the fighter selects a fourth weapon group and gains a +1 bonus with it. Previous weapon group bonuses increase by +1.',
    },
    {
      name: 'Bravery +5',
      level: 18,
      description: 'At 18th level, bravery bonus increases to +5.',
    },
    {
      name: 'Armor Mastery',
      level: 19,
      description:
        'At 19th level, a fighter gains DR 5/— whenever he is wearing armor or using a shield.',
    },
    {
      name: 'Weapon Mastery',
      level: 20,
      description:
        'At 20th level, a fighter chooses one weapon, such as the longsword, greataxe, or longbow. Any attacks made with that weapon automatically confirm all critical threats and have their damage multiplier increased by 1 (x2 becomes x3, for example). In addition, he cannot be disarmed while wielding a weapon of this type.',
    },
  ],
};
