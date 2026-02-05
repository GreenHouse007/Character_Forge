import { AbilityScore } from './common';

export interface SpellSlotTracker {
  /** class level -> spell level -> { total, used } */
  slots: Record<number, { total: number; used: number }>;
}

export interface CharacterSpellState {
  canCast: boolean;
  castingClass?: string;
  castingAbility?: AbilityScore;
  spellSlots: Record<number, { total: number; used: number }>; // spell level -> slots
  bonusSpells: Record<number, number>; // spell level -> bonus from ability
}
