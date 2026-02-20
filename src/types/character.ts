import { AbilityScores, AbilityScoreMethod } from './ability-scores';
import { Alignment, AbilityScore, SkillName } from './common';
import { ClassName } from './class';
import { RaceName } from './race';
import { CharacterSkill } from './skill';
import { Condition } from './combat';
import { CharacterInventory } from './equipment';

export interface LevelUpRecord {
  levelNumber: number;
  hpRolled: number;
  skillRanksAllocated: { skill: SkillName; ranks: number }[];
  featChosen?: string;
  bonusFeatChosen?: string;
  abilityScoreIncrease?: AbilityScore;
  classFeatureChoices?: Record<string, string>;
  spellsLearned?: string[];
  timestamp: string;
}

export interface Character {
  id: string;
  version: number;
  name: string;
  playerName?: string;
  alignment?: Alignment;
  deity?: string;
  level: number;
  experience: number;

  // Core choices
  race: RaceName;
  racialAbilityChoice?: AbilityScore; // for flexible ability bonus races
  className: ClassName;

  // Ability scores (base values only - derived stats are calculated)
  abilityScoreMethod: AbilityScoreMethod;
  baseAbilityScores: AbilityScores;

  // Skills
  skills: CharacterSkill[];

  // Feats
  featNames: string[];
  featParams: Record<string, string>; // e.g. { "Weapon Focus": "Longsword" }

  // Languages
  languages: string[];

  // Spells (for spellcasters)
  spellsKnown: string[]; // Spells the character knows (for spontaneous casters and wizards' spellbooks)
  spellsPrepared: Record<number, string[]>; // Spells prepared at each level (for prepared casters)

  // Equipment & Inventory
  inventory: CharacterInventory;

  // AC modifiers (manual adjustments)
  acModifiers?: {
    naturalArmor: number;
    deflection: number;
    dodge: number;
    misc: number;
  };

  // Tracker state (mutable during play)
  currentHP: number;
  maxHPOverride?: number; // if user wants to override calculated max HP
  tempHP: number;
  nonlethalDamage: number;
  conditions: Condition[];
  spellSlotsUsed: Record<number, number>; // spell level -> slots used
  classResourcesUsed: Record<string, number>; // resource name -> uses consumed
  notes: string;

  // Persisted combat toggle state
  combatToggles?: string[];

  // Level-up history
  levelHistory: LevelUpRecord[];

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export const CHARACTER_VERSION = 2;

export function createDefaultCharacter(): Partial<Character> {
  return {
    version: CHARACTER_VERSION,
    level: 1,
    experience: 0,
    baseAbilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    abilityScoreMethod: 'pointBuy',
    skills: [],
    featNames: [],
    featParams: {},
    languages: [],
    spellsKnown: [],
    spellsPrepared: {},
    inventory: { equipment: [], gold: 0, silver: 0, copper: 0 },
    acModifiers: { naturalArmor: 0, deflection: 0, dodge: 0, misc: 0 },
    currentHP: 0,
    tempHP: 0,
    nonlethalDamage: 0,
    conditions: [],
    spellSlotsUsed: {},
    classResourcesUsed: {},
    notes: '',
    levelHistory: [],
  };
}

export type CharacterSummary = Pick<Character, 'id' | 'name' | 'race' | 'className' | 'level' | 'updatedAt'>;
