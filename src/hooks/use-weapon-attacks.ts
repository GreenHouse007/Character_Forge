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

    // Collect abilities from equipped weapons for toggle generation
    const equippedAbilities = equippedWeapons
      .filter(e => e.specialAbilities && e.specialAbilities.length > 0)
      .map(e => ({
        weaponName: e.item.name,
        abilities: e.specialAbilities!,
      }));

    const toggles = getAvailableToggles(
      character.featNames,
      character.className,
      character.level,
      equippedAbilities
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
        masterwork: entry.masterwork,
        enhancementBonus: entry.enhancementBonus,
        material: entry.material,
        specialAbilities: entry.specialAbilities,
      })
    );

    return { attacks, toggles };
  }, [character, stats, activeToggles]);
}
