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

    const weapons = character.inventory.equipment
      .filter((e): e is Extract<typeof e, { type: 'weapon' }> => e.type === 'weapon' && !!e.equipped)
      .map((e) => e.item);

    const toggles = getAvailableToggles(
      character.featNames,
      character.className,
      character.level
    );

    const attacks = weapons.map((weapon) =>
      calculateWeaponAttack({
        weapon,
        bab: stats.combatStats.bab,
        strMod: stats.abilityModifiers.str,
        dexMod: stats.abilityModifiers.dex,
        sizeMod,
        featNames: character.featNames,
        featParams: character.featParams ?? {},
        className: character.className,
        level: character.level,
        activeToggles,
      })
    );

    return { attacks, toggles };
  }, [character, stats, activeToggles]);
}
