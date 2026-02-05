export interface CombatStats {
  ac: number;
  touchAC: number;
  flatFootedAC: number;
  initiative: number;
  bab: number;
  cmb: number;
  cmd: number;
  fortitude: number;
  reflex: number;
  will: number;
}

export type Condition =
  | 'blinded' | 'confused' | 'dazed' | 'dazzled' | 'deafened'
  | 'entangled' | 'exhausted' | 'fascinated' | 'fatigued' | 'frightened'
  | 'grappled' | 'helpless' | 'invisible' | 'nauseated' | 'panicked'
  | 'paralyzed' | 'pinned' | 'prone' | 'shaken' | 'sickened'
  | 'staggered' | 'stunned';

export const CONDITIONS: { name: Condition; description: string }[] = [
  { name: 'blinded', description: '-2 AC, loses Dex bonus to AC, -4 on most Str/Dex checks, opponents have 50% concealment' },
  { name: 'confused', description: 'Cannot act normally; roll d% each round to determine action' },
  { name: 'dazed', description: 'Cannot act; -2 AC, loses Dex bonus to AC' },
  { name: 'dazzled', description: '-1 on attack rolls and sight-based Perception checks' },
  { name: 'deafened', description: '-4 initiative, auto-fail Perception checks based on sound, 20% arcane spell failure' },
  { name: 'entangled', description: '-2 attack, -4 Dex, cannot move if anchor, otherwise half speed' },
  { name: 'exhausted', description: '-6 Str/Dex, move at half speed, becomes fatigued after 1 hour rest' },
  { name: 'fascinated', description: '-4 on skill checks made as reactions (Perception), takes no actions' },
  { name: 'fatigued', description: '-2 Str/Dex, cannot run or charge' },
  { name: 'frightened', description: '-2 attack, saves, skill/ability checks; must flee from source' },
  { name: 'grappled', description: '-4 Dex, -2 attack/combat maneuver except to grapple, cannot take AoO' },
  { name: 'helpless', description: 'Dex 0 (-5 modifier), melee attacks get +4, can be coup de graced' },
  { name: 'invisible', description: '+2 attack, opponent loses Dex bonus to AC' },
  { name: 'nauseated', description: 'Cannot attack, cast spells, concentrate; can only take a single move action' },
  { name: 'panicked', description: '-2 saves/checks/attack, must flee, drops held items' },
  { name: 'paralyzed', description: 'Helpless, cannot move or act, Str/Dex effectively 0' },
  { name: 'pinned', description: 'Tightly bound, -4 AC, limited actions, can attempt to escape' },
  { name: 'prone', description: '-4 melee attack, cannot use ranged (except crossbow), +4 AC vs ranged, -4 AC vs melee' },
  { name: 'shaken', description: '-2 attack rolls, saving throws, skill checks, ability checks' },
  { name: 'sickened', description: '-2 attack, weapon damage, saves, skill checks, ability checks' },
  { name: 'staggered', description: 'Can only take a move or standard action (not both), can take free/swift' },
  { name: 'stunned', description: '-2 AC, loses Dex bonus, drops held items, cannot take actions' },
];
