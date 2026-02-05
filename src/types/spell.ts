import { Source } from './common';
import { ClassName } from './class';

export type SpellSchool =
  | 'Abjuration'
  | 'Conjuration'
  | 'Divination'
  | 'Enchantment'
  | 'Evocation'
  | 'Illusion'
  | 'Necromancy'
  | 'Transmutation'
  | 'Universal';

export type SpellSubschool =
  | 'Calling'
  | 'Charm'
  | 'Compulsion'
  | 'Creation'
  | 'Figment'
  | 'Glamer'
  | 'Healing'
  | 'Pattern'
  | 'Phantasm'
  | 'Polymorph'
  | 'Scrying'
  | 'Shadow'
  | 'Summoning'
  | 'Teleportation';

export type SpellDescriptor =
  | 'Acid'
  | 'Air'
  | 'Chaotic'
  | 'Cold'
  | 'Darkness'
  | 'Death'
  | 'Earth'
  | 'Electricity'
  | 'Evil'
  | 'Fear'
  | 'Fire'
  | 'Force'
  | 'Good'
  | 'Language-Dependent'
  | 'Lawful'
  | 'Light'
  | 'Mind-Affecting'
  | 'Sonic'
  | 'Water';

export interface Spell {
  id?: string;
  name: string;
  school: SpellSchool;
  subschool?: SpellSubschool;
  descriptors?: SpellDescriptor[];
  level: Partial<Record<ClassName, number>>; // class -> spell level
  castingTime: string;
  components: string; // V, S, M, F, DF
  componentDetails?: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
  };
  materialsRequired?: string | null;
  materialCostGp?: number | null;
  materialsConsumed?: boolean;
  hasFocus?: boolean;
  isRitual?: boolean;
  isDismissible?: boolean;
  tags?: string[];
  range: string;
  area?: string;
  effect?: string;
  targets?: string;
  duration: string;
  savingThrow: string | null;
  spellResistance: boolean;
  description: string;
  fullDescription?: string;
  sourceDetails?: string;
  source: Source;
}

// Character's known/prepared spells
export interface CharacterSpells {
  // Spells the character knows (for spontaneous casters)
  known: string[];
  // Spells prepared at each level (for prepared casters)
  prepared: Record<number, string[]>;
}
