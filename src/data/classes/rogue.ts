import { CharacterClass } from '@/types/class';

export const rogue: CharacterClass = {
  name: 'Rogue',
  source: 'CRB',
  description: 'A cunning combatant who uses stealth, skill, and sneak attacks to overcome foes.',
  hitDie: 8,
  babProgression: 'threeQuarter',
  goodSaves: ['reflex'],
  skillRanksPerLevel: 8,
  classSkills: [
    'Acrobatics', 'Appraise', 'Bluff', 'Climb', 'Craft', 'Diplomacy',
    'Disable Device', 'Disguise', 'Escape Artist', 'Intimidate',
    'Knowledge (Dungeoneering)', 'Knowledge (Local)', 'Linguistics',
    'Perception', 'Perform', 'Profession', 'Sense Motive',
    'Sleight of Hand', 'Stealth', 'Swim', 'Use Magic Device',
  ],
  classFeatures: [
    { name: 'Sneak Attack', level: 1, description: '+1d6 damage when flanking or target is denied Dex bonus to AC. Increases by +1d6 every 2 levels.' },
    { name: 'Trapfinding', level: 1, description: 'Add 1/2 level to Perception to locate traps and to Disable Device. Can disarm magic traps.' },
    { name: 'Evasion', level: 2, description: 'On successful Reflex save for half damage, take no damage instead.' },
    { name: 'Rogue Talent', level: 2, description: 'Select a rogue talent. Gain an additional talent every 2 levels thereafter.' },
    { name: 'Trap Sense', level: 3, description: '+1 bonus on Reflex saves and AC against traps. Increases by +1 every 3 levels.' },
    { name: 'Uncanny Dodge', level: 4, description: 'Cannot be caught flat-footed, keep Dex bonus to AC even if attacked by invisible attacker.' },
    { name: 'Improved Uncanny Dodge', level: 8, description: 'Cannot be flanked except by a rogue of 4+ levels higher.' },
    { name: 'Advanced Talent', level: 10, description: 'Can select advanced rogue talents in addition to normal rogue talents.' },
    { name: 'Master Strike', level: 20, description: 'Sneak attack target must make Fort save or be put to sleep, paralyzed, or slain (your choice).' },
  ],
  spellProgression: { type: 'none' },
  startingWealth: { dice: { count: 4, sides: 6 }, multiplier: 10, average: 140 },
  proficiencies: {
    weapons: ['simple weapons', 'hand crossbow', 'rapier', 'sap', 'shortbow', 'short sword'],
    armor: ['light armor'],
    shields: [],
  },
};
