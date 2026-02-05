import { Race, RaceName } from '@/types/race';
import { dwarf } from './dwarf';
import { elf } from './elf';
import { gnome } from './gnome';
import { halfElf } from './half-elf';
import { halfOrc } from './half-orc';
import { halfling } from './halfling';
import { human } from './human';
import { aasimar } from './aasimar';
import { tiefling } from './tiefling';
import { catfolk } from './catfolk';
import { dhampir } from './dhampir';
import { drow } from './drow';
import { fetchling } from './fetchling';
import { goblin } from './goblin';
import { hobgoblin } from './hobgoblin';
import { ifrit } from './ifrit';
import { kobold } from './kobold';
import { oread } from './oread';
import { ratfolk } from './ratfolk';
import { sylph } from './sylph';
import { tengu } from './tengu';
import { undine } from './undine';

export {
  dwarf, elf, gnome, halfElf, halfOrc, halfling, human, aasimar, tiefling,
  catfolk, dhampir, drow, fetchling, goblin, hobgoblin, ifrit, kobold,
  oread, ratfolk, sylph, tengu, undine,
};

export const races: Record<RaceName, Race> = {
  // Core races
  Dwarf: dwarf,
  Elf: elf,
  Gnome: gnome,
  'Half-Elf': halfElf,
  'Half-Orc': halfOrc,
  Halfling: halfling,
  Human: human,
  // Featured races
  Aasimar: aasimar,
  Tiefling: tiefling,
  // Uncommon races
  Catfolk: catfolk,
  Dhampir: dhampir,
  Drow: drow,
  Fetchling: fetchling,
  Goblin: goblin,
  Hobgoblin: hobgoblin,
  Ifrit: ifrit,
  Kobold: kobold,
  Oread: oread,
  Ratfolk: ratfolk,
  Sylph: sylph,
  Tengu: tengu,
  Undine: undine,
};

export const raceList: Race[] = [
  // Core races first
  dwarf,
  elf,
  gnome,
  halfElf,
  halfOrc,
  halfling,
  human,
  // Featured races
  aasimar,
  tiefling,
  // Uncommon races alphabetically
  catfolk,
  dhampir,
  drow,
  fetchling,
  goblin,
  hobgoblin,
  ifrit,
  kobold,
  oread,
  ratfolk,
  sylph,
  tengu,
  undine,
];
