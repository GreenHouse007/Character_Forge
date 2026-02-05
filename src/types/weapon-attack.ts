import { Weapon } from './equipment';
import { StatBreakdown } from './breakdown';
import { DiceRoll } from './common';

export interface WeaponAttackResult {
  weapon: Weapon;
  attackBreakdown: StatBreakdown;
  damageBreakdown: StatBreakdown;
  damageDice: DiceRoll;
  criticalRange: number;
  criticalMultiplier: number;
  extraDamageDice?: { source: string; dice: DiceRoll }[];
  iterativeAttacks: number[]; // All attack bonuses including iterative attacks
}

export type KnownToggleId =
  | 'powerAttack'
  | 'deadlyAim'
  | 'weaponFinesse'
  | 'pointBlankShot'
  | 'combatExpertise'
  | 'sneakAttack';

export interface CombatToggle {
  id: string;
  name: string;
  isActive: boolean;
  appliesTo: 'melee' | 'ranged' | 'all';
}
