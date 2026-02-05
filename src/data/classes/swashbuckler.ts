import { CharacterClass } from '@/types/class';

export const swashbuckler: CharacterClass = {
  name: 'Swashbuckler',
  source: 'ACG',
  description: 'A daring combatant who fights with panache and precision, relying on agility and charm rather than brute strength.',
  hitDie: 10,
  babProgression: 'full',
  goodSaves: ['fortitude', 'reflex'],
  skillRanksPerLevel: 4,
  classSkills: [
    'Acrobatics', 'Bluff', 'Climb', 'Craft', 'Diplomacy', 'Escape Artist',
    'Intimidate', 'Knowledge (Local)', 'Knowledge (Nobility)', 'Perception',
    'Perform', 'Profession', 'Ride', 'Sense Motive', 'Sleight of Hand', 'Swim',
  ],
  classFeatures: [
    { name: 'Deeds', level: 1, description: 'Gain access to deeds that cost panache points: Derring-Do, Dodging Panache, Opportune Parry and Riposte.' },
    { name: 'Panache', level: 1, description: 'Pool of panache points fueling deeds. Regained by confirming critical hits or killing blows with light or one-handed piercing weapons.' },
    { name: 'Swashbuckler Finesse', level: 1, description: 'Gain Weapon Finesse as a bonus feat. Can use Charisma instead of Intelligence for Combat Expertise prerequisites.' },
    { name: 'Nimble', level: 3, description: '+1 dodge bonus to AC in light or no armor. Increases by +1 every 4 levels thereafter.' },
    { name: 'Bonus Feat', level: 4, description: 'Gain a combat feat at 4th level and every 4 levels thereafter.' },
    { name: 'Swashbuckler Weapon Training', level: 5, description: '+1 bonus on attack and damage rolls with light or one-handed piercing melee weapons. Increases by +1 every 4 levels thereafter.' },
    { name: 'Deeds (Greater)', level: 11, description: 'Access to greater deeds: Bleeding Wound, Evasive, Subtle Blade, Superior Feint, Targeted Strike.' },
    { name: 'Deeds (Master)', level: 15, description: 'Access to master deeds: Cheat Death, Deadly Stab, Stunning Stab.' },
    { name: 'Swashbuckler Weapon Mastery', level: 20, description: 'Critical threat range doubled (does not stack with Improved Critical). Automatically confirm critical hits with light or one-handed piercing melee weapons.' },
  ],
  spellProgression: { type: 'none' },
  classResources: [
    {
      name: 'Panache',
      description: 'Pool of panache points for fueling deeds. Regained by confirming critical hits or killing blows with light or one-handed piercing weapons.',
      getUsesAtLevel: (_level, chaMod?) => Math.max(1, chaMod ?? 0),
      resetsOn: 'rest',
    },
  ],
  bonusFeats: [
    { level: 4, note: 'Combat feat' },
    { level: 8, note: 'Combat feat' },
    { level: 12, note: 'Combat feat' },
    { level: 16, note: 'Combat feat' },
    { level: 20, note: 'Combat feat' },
  ],
  startingWealth: { dice: { count: 5, sides: 6 }, multiplier: 10, average: 175 },
  proficiencies: {
    weapons: ['simple weapons', 'martial weapons'],
    armor: ['light armor'],
    shields: ['bucklers'],
  },
};
