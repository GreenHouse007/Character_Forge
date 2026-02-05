import { AbilityScore, SaveType, SkillName, Source, DiceRoll, Alignment } from './common';

export type ClassName =
  | 'Barbarian' | 'Bard' | 'Cleric' | 'Druid' | 'Fighter'
  | 'Monk' | 'Paladin' | 'Ranger' | 'Rogue' | 'Sorcerer' | 'Wizard'
  | 'Alchemist' | 'Inquisitor' | 'Oracle' | 'Witch'
  | 'Magus'
  | 'Arcanist' | 'Bloodrager' | 'Investigator' | 'Slayer' | 'Swashbuckler';

export type BABProgression = 'full' | 'threeQuarter' | 'half';
export type SaveProgression = 'good' | 'poor';

export interface ClassFeature {
  name: string;
  level: number;
  description: string;
}

export interface SpellsPerDay {
  [spellLevel: number]: number | undefined;
}

export interface ClassSpellProgression {
  type: 'prepared' | 'spontaneous' | 'none';
  castingAbility?: AbilityScore;
  spellsPerDay?: Record<number, SpellsPerDay>; // class level -> spell level -> count
  spellsKnown?: Record<number, SpellsPerDay>;  // for spontaneous casters
  maxSpellLevel?: number;
}

export interface ClassResource {
  name: string;
  description: string;
  getUsesAtLevel: (level: number, abilityModifier?: number) => number;
  resetsOn: 'rest' | 'never';
}

export interface StartingWealth {
  dice: DiceRoll;
  multiplier: number;
  average: number;
}

export interface CharacterClass {
  name: ClassName;
  source: Source;
  description: string;
  hitDie: number;
  babProgression: BABProgression;
  goodSaves: SaveType[];
  skillRanksPerLevel: number;
  classSkills: SkillName[];
  classFeatures: ClassFeature[];
  spellProgression: ClassSpellProgression;
  alignmentRestrictions?: Alignment[];
  classResources?: ClassResource[];
  startingWealth: StartingWealth;
  proficiencies: {
    weapons: string[];
    armor: string[];
    shields: string[];
  };
  bonusFeats?: { level: number; note: string }[];
}

export function getBABAtLevel(progression: BABProgression, level: number): number {
  switch (progression) {
    case 'full': return level;
    case 'threeQuarter': return Math.floor(level * 3 / 4);
    case 'half': return Math.floor(level / 2);
  }
}

export function getBaseSaveAtLevel(progression: SaveProgression, level: number): number {
  switch (progression) {
    case 'good': return 2 + Math.floor(level / 2);
    case 'poor': return Math.floor(level / 3);
  }
}
