'use client';

import { useMemo } from 'react';
import { Character } from '@/types/character';
import { WeaponAttackResult, CombatToggle } from '@/types/weapon-attack';
import { DerivedStats } from './use-derived-stats';
import { calculateWeaponAttack, getAvailableToggles } from '@/lib/weapon-calculations';
import { getSizeModifier } from '@/lib/calculations';
import { races } from '@/data/races';

export function useWeaponAttacks(
  character: Character | null,
  stats: DerivedStats | null,
  activeToggles: string[]
): { attacks: WeaponAttackResult[]; toggles: CombatToggle[] } {
  return useMemo(() => {
    if (!character || !stats) return { attacks: [], toggles: [] };

    const race = races[character.race];
    const sizeMod = getSizeModifier(race.size);

    const equippedWeapons = character.inventory.equipment
      .filter((e): e is Extract<typeof e, { type: 'weapon' }> => e.type === 'weapon' && !!e.equipped);

    const toggles = getAvailableToggles(
      character.featNames,
      character.className,
      character.level
    );

    const attacks = equippedWeapons.map((entry) =>
      calculateWeaponAttack({
        weapon: entry.item,
        bab: stats.combatStats.bab,
        strMod: stats.abilityModifiers.str,
        dexMod: stats.abilityModifiers.dex,
        sizeMod,
        featNames: character.featNames,
        featParams: character.featParams ?? {},
        className: character.className,
        level: character.level,
        activeToggles,
        strengthRating: entry.strengthRating,
      })
    );

    return { attacks, toggles };
  }, [character, stats, activeToggles]);
}
