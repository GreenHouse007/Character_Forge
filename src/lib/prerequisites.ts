import { Feat } from '@/types/feat';
import { AbilityScores } from '@/types/ability-scores';
import { ClassName, BABProgression, getBABAtLevel } from '@/types/class';
import { CharacterSkill } from '@/types/skill';

export interface PrerequisiteContext {
  abilityScores: AbilityScores;
  level: number;
  bab: number;
  className: ClassName;
  feats: string[];
  skills: CharacterSkill[];
  classFeatures: string[];
  casterLevel: number;
}

export interface PrerequisiteResult {
  met: boolean;
  unmet: string[];
}

export function checkPrerequisites(
  _feat: Feat,
  _ctx: PrerequisiteContext
): PrerequisiteResult {
  // Prerequisites are now displayed as raw text from the CSV data.
  // No structured checking is performed.
  return { met: true, unmet: [] };
}

export function getAvailableFeats(
  allFeats: Feat[],
  _ctx: PrerequisiteContext,
  alreadySelected: string[] = []
): { feat: Feat; prereqResult: PrerequisiteResult }[] {
  return allFeats
    .filter((f) => !alreadySelected.includes(f.name))
    .map((feat) => ({
      feat,
      prereqResult: { met: true, unmet: [] },
    }));
}

export function buildPrerequisiteContext(
  abilityScores: AbilityScores,
  level: number,
  babProgression: BABProgression,
  className: ClassName,
  feats: string[],
  skills: CharacterSkill[],
  classFeatureNames: string[],
  casterLevel: number = 0
): PrerequisiteContext {
  return {
    abilityScores,
    level,
    bab: getBABAtLevel(babProgression, level),
    className,
    feats,
    skills,
    classFeatures: classFeatureNames,
    casterLevel,
  };
}
