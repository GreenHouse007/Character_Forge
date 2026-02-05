import { AbilityScore } from './common';

export type AbilityScores = Record<AbilityScore, number>;

export type AbilityScoreMethod = 'pointBuy' | 'roll' | 'manual';

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

export const DEFAULT_POINT_BUY_BUDGET = 20;
