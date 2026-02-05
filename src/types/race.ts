import { AbilityScore, Size, Source, SkillName } from './common';

export type RaceName =
  | 'Dwarf' | 'Elf' | 'Gnome' | 'Half-Elf' | 'Half-Orc' | 'Halfling' | 'Human' | 'Aasimar' | 'Tiefling'
  | 'Catfolk' | 'Dhampir' | 'Drow' | 'Fetchling' | 'Goblin' | 'Hobgoblin' | 'Ifrit' | 'Kobold'
  | 'Oread' | 'Ratfolk' | 'Sylph' | 'Tengu' | 'Undine';

export interface RacialAbilityModifier {
  ability: AbilityScore;
  modifier: number;
}

export interface RacialTrait {
  name: string;
  description: string;
}

export interface Race {
  name: RaceName;
  source: Source;
  description: string;
  size: Size;
  speed: number;
  abilityModifiers: RacialAbilityModifier[];
  flexibleAbilityBonus: boolean; // Human, Half-Elf, Half-Orc get +2 to any one
  racialTraits: RacialTrait[];
  languages: string[];
  bonusLanguages: string[];
  favoredClassBonusNote?: string;
  skillBonuses?: { skill: SkillName; bonus: number }[];
  darkvision?: number;
  lowLightVision?: boolean;
}
