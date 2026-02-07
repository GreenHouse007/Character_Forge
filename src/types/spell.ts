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
  | 'Haunted'
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
  | 'Curse'
  | 'Darkness'
  | 'Death'
  | 'Disease'
  | 'Draconic'
  | 'Earth'
  | 'Electricity'
  | 'Emotion'
  | 'Evil'
  | 'Fear'
  | 'Fire'
  | 'Force'
  | 'Good'
  | 'Language-Dependent'
  | 'Lawful'
  | 'Light'
  | 'Meditative'
  | 'Mind-Affecting'
  | 'Pain'
  | 'Poison'
  | 'Ruse'
  | 'Shadow'
  | 'Sonic'
  | 'Water';

export interface SpellComponentDetails {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  focus: boolean;
  divineFocus: boolean;
  costGp?: number;
}

export interface SpellPermanency {
  possible: boolean;
  casterLevel?: number;
  costGp?: number;
}

export interface Spell {
  name: string;
  school: SpellSchool;
  subschool?: SpellSubschool;
  descriptors?: SpellDescriptor[];
  level: Partial<Record<ClassName, number>>; // class -> spell level
  castingTime: string;
  components: string; // V, S, M, F, DF
  range: string;
  area?: string;
  effect?: string;
  targets?: string;
  duration: string;
  savingThrow: string | null;
  spellResistance: boolean;
  description: string;
  source: Source;

  // Extended data from The Spell Codex
  rating?: number;
  dismissible?: boolean;
  shapeable?: boolean;
  componentDetails?: SpellComponentDetails;
  permanency?: SpellPermanency;
  deity?: string;
  race?: string;
  domain?: string;
  bloodline?: string;
  patron?: string;
  mythicText?: string;
  augmented?: string;
  slaLevel?: number;
}

// Character's known/prepared spells
export interface CharacterSpells {
  // Spells the character knows (for spontaneous casters)
  known: string[];
  // Spells prepared at each level (for prepared casters)
  prepared: Record<number, string[]>;
}
