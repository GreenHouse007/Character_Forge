import { AbilityScore } from './common';

export type AbilityScores = Record<AbilityScore, number>;

export type AbilityScoreMethod = 'pointBuy' | 'roll' | 'manual' | 'standardArray';

export interface PointBuyPreset {
  label: string;
  budget: number;
}

export const POINT_BUY_PRESETS: PointBuyPreset[] = [
  { label: 'Low Fantasy',  budget: 10 },
  { label: 'Standard',     budget: 15 },
  { label: 'High Fantasy', budget: 20 },
  { label: 'Epic Fantasy', budget: 25 },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export interface AbilityScoreModifiers {
  racial: Partial<AbilityScores>;
  enhancement: Partial<AbilityScores>;
  misc: Partial<AbilityScores>;
}

export const DEFAULT_ABILITY_SCORES: AbilityScores = {
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
};

export const POINT_BUY_COSTS: Record<number, number> = {
  7: -4,
  8: -2,
  9: -1,
  10: 0,
  11: 1,
  12: 2,
  13: 3,
  14: 5,
  15: 7,
  16: 10,
  17: 13,
  18: 17,
};

