'use client';

import { useState, useCallback } from 'react';
import { roll4d6DropLowest, rollAbilityScoreSet, rollStartingGold } from '@/lib/dice';
import { DiceRoll } from '@/types/common';

export function useDiceRoller() {
  const [lastRoll, setLastRoll] = useState<ReturnType<typeof rollAbilityScoreSet> | null>(null);

  const rollAbilityScores = useCallback(() => {
    const result = rollAbilityScoreSet();
    setLastRoll(result);
    return result;
  }, []);

  const rollSingleAbility = useCallback(() => {
    return roll4d6DropLowest();
  }, []);

  const rollGold = useCallback((dice: DiceRoll, multiplier: number) => {
    return rollStartingGold(dice, multiplier);
  }, []);

  return { lastRoll, rollAbilityScores, rollSingleAbility, rollGold };
}
