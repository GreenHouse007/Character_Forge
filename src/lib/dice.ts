import { DiceRoll } from '@/types/common';

/** Roll a single die with sides `s` */
function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/** Roll `count` dice with `sides` and return individual results */
export function rollDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDie(sides));
}

/** Roll a DiceRoll and return the total */
export function rollDiceTotal(roll: DiceRoll): number {
  const results = rollDice(roll.count, roll.sides);
  return results.reduce((sum, r) => sum + r, 0) + (roll.modifier ?? 0);
}

/** Roll 4d6, drop the lowest die */
export function roll4d6DropLowest(): { rolls: number[]; dropped: number; total: number } {
  const rolls = rollDice(4, 6);
  const sorted = [...rolls].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted[1] + sorted[2] + sorted[3];
  return { rolls, dropped, total };
}

/** Generate a full set of 6 ability scores using 4d6 drop lowest */
export function rollAbilityScoreSet(): { scores: number[]; details: ReturnType<typeof roll4d6DropLowest>[] } {
  const details = Array.from({ length: 6 }, () => roll4d6DropLowest());
  const scores = details.map(d => d.total);
  return { scores, details };
}

/** Roll starting gold for a class */
export function rollStartingGold(dice: DiceRoll, multiplier: number): number {
  const total = rollDiceTotal(dice);
  return total * multiplier;
}

/** Format a DiceRoll as a string like "2d6+3" */
export function formatDiceRoll(roll: DiceRoll): string {
  let str = `${roll.count}d${roll.sides}`;
  if (roll.modifier && roll.modifier > 0) str += `+${roll.modifier}`;
  else if (roll.modifier && roll.modifier < 0) str += `${roll.modifier}`;
  return str;
}
