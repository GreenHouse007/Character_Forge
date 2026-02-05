import { ClassName, CharacterClass } from '@/types/class';
import { barbarian } from './barbarian';
import { bard } from './bard';
import { cleric } from './cleric';
import { druid } from './druid';
import { fighter } from './fighter';
import { monk } from './monk';
import { paladin } from './paladin';
import { ranger } from './ranger';
import { rogue } from './rogue';
import { sorcerer } from './sorcerer';
import { wizard } from './wizard';
import { alchemist } from './alchemist';
import { inquisitor } from './inquisitor';
import { oracle } from './oracle';
import { witch } from './witch';
import { magus } from './magus';
import { arcanist } from './arcanist';
import { bloodrager } from './bloodrager';
import { investigator } from './investigator';
import { slayer } from './slayer';
import { swashbuckler } from './swashbuckler';

export {
  barbarian, bard, cleric, druid, fighter, monk, paladin, ranger, rogue, sorcerer, wizard,
  alchemist, inquisitor, oracle, witch, magus, arcanist, bloodrager, investigator, slayer, swashbuckler,
};

export const classes: Record<ClassName, CharacterClass> = {
  Barbarian: barbarian,
  Bard: bard,
  Cleric: cleric,
  Druid: druid,
  Fighter: fighter,
  Monk: monk,
  Paladin: paladin,
  Ranger: ranger,
  Rogue: rogue,
  Sorcerer: sorcerer,
  Wizard: wizard,
  Alchemist: alchemist,
  Inquisitor: inquisitor,
  Oracle: oracle,
  Witch: witch,
  Magus: magus,
  Arcanist: arcanist,
  Bloodrager: bloodrager,
  Investigator: investigator,
  Slayer: slayer,
  Swashbuckler: swashbuckler,
};

export const classList: CharacterClass[] = Object.values(classes);
