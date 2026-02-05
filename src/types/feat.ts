import { Source, SkillName, AbilityScore } from './common';
import { ClassName } from './class';

export type FeatCategory = 'Combat' | 'General' | 'Metamagic' | 'Item Creation' | 'Critical' | 'Style' | 'Teamwork';

export interface FeatPrerequisite {
  type: 'ability' | 'bab' | 'feat' | 'skill' | 'classFeature' | 'casterLevel' | 'class' | 'proficiency' | 'level' | 'spellLevel';
  ability?: AbilityScore;
  value?: number;
  feat?: string;
  skill?: SkillName;
  ranks?: number;
  feature?: string;
  className?: ClassName;
  proficiency?: string;
}

export interface Feat {
  name: string;
  category: FeatCategory;
  source: Source;
  description: string;
  benefit: string;
  prerequisites: FeatPrerequisite[];
  special?: string;
  isFighterBonusFeat?: boolean;
  isMonkBonusFeat?: boolean;
  isWizardBonusFeat?: boolean;
  isSlayerTalent?: boolean;
}
