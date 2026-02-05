import { Weapon } from '@/types/equipment';
import { WeaponAttackResult, CombatToggle } from '@/types/weapon-attack';
import { StatBreakdown, BreakdownEntry } from '@/types/breakdown';
import { DiceRoll } from '@/types/common';
import { ClassName } from '@/types/class';

function filtered(entries: BreakdownEntry[]): BreakdownEntry[] {
  return entries.filter((e) => e.value !== 0);
}

function sum(entries: BreakdownEntry[]): number {
  return entries.reduce((t, e) => t + e.value, 0);
}

/**
 * Generate iterative attack bonuses based on BAB
 * At BAB +6, you get +6/+1
 * At BAB +11, you get +11/+6/+1
 * At BAB +16, you get +16/+11/+6/+1
 * Each additional attack is at -5 from the previous, minimum +1
 */
export function getIterativeAttacks(bab: number): number[] {
  const attacks: number[] = [bab];
  let current = bab - 5;
  while (current >= 1) {
    attacks.push(current);
    current -= 5;
  }
  return attacks;
}

/**
 * Format iterative attacks as a string (e.g., "+11/+6/+1")
 */
export function formatIterativeAttacks(bonuses: number[]): string {
  return bonuses.map(b => (b >= 0 ? '+' : '') + b).join('/');
}

function isRanged(weapon: Weapon): boolean {
  return weapon.type === 'Ranged';
}

function isTwoHanded(weapon: Weapon): boolean {
  return weapon.type === 'Two-Handed Melee';
}

function isLight(weapon: Weapon): boolean {
  return weapon.type === 'Light Melee' || weapon.type === 'Unarmed';
}

function isFinessable(weapon: Weapon): boolean {
  if (isLight(weapon)) return true;
  const finesse = ['rapier', 'whip', 'spiked chain', 'elven curve blade'];
  return finesse.includes(weapon.name.toLowerCase());
}

/** Power Attack / Deadly Aim penalty */
function powerAttackPenalty(bab: number): number {
  return 1 + Math.floor(bab / 4);
}

/** Power Attack damage bonus (base, before two-hand multiplier) */
function powerAttackDamage(bab: number): number {
  return 2 * (1 + Math.floor(bab / 4));
}

export function getSneakAttackDice(className: ClassName, level: number): number {
  switch (className) {
    case 'Rogue':
      return Math.ceil(level / 2);
    case 'Slayer':
      // 1d6 at 3, 2d6 at 6, 3d6 at 9, etc.
      return level >= 3 ? Math.floor((level - 3) / 3) + 1 : 0;
    case 'Investigator':
      // Studied strike: 1d6 at 4, 2d6 at 6, 3d6 at 8, etc.
      return level >= 4 ? Math.floor((level - 4) / 2) + 1 : 0;
    default:
      return 0;
  }
}

export function getAvailableToggles(
  featNames: string[],
  className: ClassName,
  level: number
): CombatToggle[] {
  const toggles: CombatToggle[] = [];

  if (featNames.includes('Power Attack')) {
    toggles.push({ id: 'powerAttack', name: 'Power Attack', isActive: false, appliesTo: 'melee' });
  }
  if (featNames.includes('Deadly Aim')) {
    toggles.push({ id: 'deadlyAim', name: 'Deadly Aim', isActive: false, appliesTo: 'ranged' });
  }
  if (featNames.includes('Combat Expertise')) {
    toggles.push({ id: 'combatExpertise', name: 'Combat Expertise', isActive: false, appliesTo: 'melee' });
  }
  if (featNames.includes('Point-Blank Shot')) {
    toggles.push({ id: 'pointBlankShot', name: 'Point-Blank Shot', isActive: false, appliesTo: 'ranged' });
  }

  const sneakDice = getSneakAttackDice(className, level);
  if (sneakDice > 0) {
    toggles.push({ id: 'sneakAttack', name: 'Sneak Attack', isActive: false, appliesTo: 'all' });
  }

  return toggles;
}

export interface CalculateWeaponAttackParams {
  weapon: Weapon;
  bab: number;
  strMod: number;
  dexMod: number;
  sizeMod: number;
  featNames: string[];
  featParams: Record<string, string>;
  className: ClassName;
  level: number;
  activeToggles: string[];
}

export function calculateWeaponAttack(params: CalculateWeaponAttackParams): WeaponAttackResult {
  const {
    weapon, bab, strMod, dexMod, sizeMod,
    featNames, featParams, className, level, activeToggles,
  } = params;

  const ranged = isRanged(weapon);
  const twoHanded = isTwoHanded(weapon);
  const hasWeaponFinesse = featNames.includes('Weapon Finesse') && isFinessable(weapon) && !ranged;

  // Attack bonus ability mod
  const attackAbilityMod = ranged ? dexMod : (hasWeaponFinesse ? dexMod : strMod);
  const attackAbilityLabel = ranged ? 'DEX' : (hasWeaponFinesse ? 'DEX (Finesse)' : 'STR');

  // Damage ability mod
  const damageAbilityMod = ranged ? 0 : (twoHanded ? Math.floor(strMod * 1.5) : strMod);
  const damageAbilityLabel = ranged ? '' : (twoHanded ? 'STR (1.5x)' : 'STR');

  // Build attack entries
  const attackEntries: BreakdownEntry[] = [
    { label: 'BAB', value: bab },
    { label: attackAbilityLabel, value: attackAbilityMod },
    { label: 'Size', value: sizeMod },
  ];

  // Build damage entries
  const damageEntries: BreakdownEntry[] = [];
  if (damageAbilityMod !== 0) {
    damageEntries.push({ label: damageAbilityLabel, value: damageAbilityMod });
  }

  // Weapon Focus
  const weaponFocusTarget = featParams['Weapon Focus'];
  if (featNames.includes('Weapon Focus') && weaponFocusTarget === weapon.name) {
    attackEntries.push({ label: 'Weapon Focus', value: 1 });
  }
  // Greater Weapon Focus
  if (featNames.includes('Greater Weapon Focus') && weaponFocusTarget === weapon.name) {
    attackEntries.push({ label: 'Greater Weapon Focus', value: 1 });
  }
  // Weapon Specialization
  const weaponSpecTarget = featParams['Weapon Specialization'] ?? weaponFocusTarget;
  if (featNames.includes('Weapon Specialization') && weaponSpecTarget === weapon.name) {
    damageEntries.push({ label: 'Weapon Specialization', value: 2 });
  }
  // Greater Weapon Specialization
  if (featNames.includes('Greater Weapon Specialization') && weaponSpecTarget === weapon.name) {
    damageEntries.push({ label: 'Greater Weapon Specialization', value: 2 });
  }

  const extraDamageDice: { source: string; dice: DiceRoll }[] = [];

  // Toggle: Power Attack (melee only)
  if (activeToggles.includes('powerAttack') && !ranged) {
    const penalty = powerAttackPenalty(bab);
    const dmgBonus = powerAttackDamage(bab);
    const finalDmg = twoHanded ? Math.floor(dmgBonus * 1.5) : dmgBonus;
    attackEntries.push({ label: 'Power Attack', value: -penalty });
    damageEntries.push({ label: 'Power Attack', value: finalDmg });
  }

  // Toggle: Deadly Aim (ranged only)
  if (activeToggles.includes('deadlyAim') && ranged) {
    const penalty = powerAttackPenalty(bab);
    const dmgBonus = powerAttackDamage(bab);
    attackEntries.push({ label: 'Deadly Aim', value: -penalty });
    damageEntries.push({ label: 'Deadly Aim', value: dmgBonus });
  }

  // Toggle: Combat Expertise (melee only)
  if (activeToggles.includes('combatExpertise') && !ranged) {
    const penalty = 1 + Math.floor(bab / 4);
    attackEntries.push({ label: 'Combat Expertise', value: -penalty });
  }

  // Toggle: Point-Blank Shot (ranged, within 30ft)
  if (activeToggles.includes('pointBlankShot') && ranged) {
    attackEntries.push({ label: 'Point-Blank Shot', value: 1 });
    damageEntries.push({ label: 'Point-Blank Shot', value: 1 });
  }

  // Toggle: Sneak Attack
  if (activeToggles.includes('sneakAttack')) {
    const sneakDice = getSneakAttackDice(className, level);
    if (sneakDice > 0) {
      extraDamageDice.push({
        source: 'Sneak Attack',
        dice: { count: sneakDice, sides: 6 },
      });
    }
  }

  const filteredAttack = filtered(attackEntries);
  const filteredDamage = filtered(damageEntries);

  const attackBreakdown: StatBreakdown = {
    total: sum(filteredAttack),
    entries: filteredAttack,
  };

  const damageBreakdown: StatBreakdown = {
    total: sum(filteredDamage),
    entries: filteredDamage,
  };

  // Calculate iterative attacks based on total attack bonus
  // Get base iterative bonuses from BAB, then apply non-BAB modifiers to each
  const babIteratives = getIterativeAttacks(bab);
  const nonBabBonus = attackBreakdown.total - bab; // All bonuses except BAB
  const iterativeAttacks = babIteratives.map(babBonus => babBonus + nonBabBonus);

  return {
    weapon,
    attackBreakdown,
    damageBreakdown,
    damageDice: weapon.damage,
    criticalRange: weapon.critical.range,
    criticalMultiplier: weapon.critical.multiplier,
    iterativeAttacks,
    extraDamageDice: extraDamageDice.length > 0 ? extraDamageDice : undefined,
  };
}
