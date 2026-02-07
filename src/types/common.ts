export type AbilityScore = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export type Alignment =
  | 'LG' | 'NG' | 'CG'
  | 'LN' | 'TN' | 'CN'
  | 'LE' | 'NE' | 'CE';

export type Size = 'Fine' | 'Diminutive' | 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan' | 'Colossal';

export type DamageType = 'bludgeoning' | 'piercing' | 'slashing';

export type SaveType = 'fortitude' | 'reflex' | 'will';

export type Source = string;

export interface DiceRoll {
  count: number;
  sides: number;
  modifier?: number;
}

export type SkillName =
  | 'Acrobatics' | 'Appraise' | 'Bluff' | 'Climb' | 'Craft' | 'Diplomacy'
  | 'Disable Device' | 'Disguise' | 'Escape Artist' | 'Fly' | 'Handle Animal'
  | 'Heal' | 'Intimidate' | 'Knowledge (Arcana)' | 'Knowledge (Dungeoneering)'
  | 'Knowledge (Engineering)' | 'Knowledge (Geography)' | 'Knowledge (History)'
  | 'Knowledge (Local)' | 'Knowledge (Nature)' | 'Knowledge (Nobility)'
  | 'Knowledge (Planes)' | 'Knowledge (Religion)' | 'Linguistics' | 'Perception'
  | 'Perform' | 'Profession' | 'Ride' | 'Sense Motive' | 'Sleight of Hand'
  | 'Spellcraft' | 'Stealth' | 'Survival' | 'Swim' | 'Use Magic Device';

export const ABILITY_SCORES: AbilityScore[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_SCORE_LABELS: Record<AbilityScore, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const ABILITY_SCORE_SHORT: Record<AbilityScore, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export const ALIGNMENTS: Alignment[] = [
  'LG', 'NG', 'CG',
  'LN', 'TN', 'CN',
  'LE', 'NE', 'CE',
];
