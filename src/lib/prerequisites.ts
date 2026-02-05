import { Feat, FeatPrerequisite } from '@/types/feat';
import { AbilityScores } from '@/types/ability-scores';
import { ClassName, getBABAtLevel, BABProgression } from '@/types/class';
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

function checkSinglePrerequisite(
  prereq: FeatPrerequisite,
  ctx: PrerequisiteContext
): { met: boolean; reason: string } {
  switch (prereq.type) {
    case 'ability': {
      const score = prereq.ability ? ctx.abilityScores[prereq.ability] : 0;
      const required = prereq.value ?? 0;
      return {
        met: score >= required,
        reason: `${prereq.ability?.toUpperCase()} ${required}`,
      };
    }
    case 'bab': {
      const required = prereq.value ?? 0;
      return {
        met: ctx.bab >= required,
        reason: `BAB +${required}`,
      };
    }
    case 'feat': {
      const featName = prereq.feat ?? '';
      return {
        met: ctx.feats.includes(featName),
        reason: featName,
      };
    }
    case 'skill': {
      const skillName = prereq.skill ?? '';
      const requiredRanks = prereq.ranks ?? 1;
      const skill = ctx.skills.find(s => s.name === skillName);
      return {
        met: (skill?.ranks ?? 0) >= requiredRanks,
        reason: `${skillName} ${requiredRanks} rank${requiredRanks > 1 ? 's' : ''}`,
      };
    }
    case 'classFeature': {
      const feature = prereq.feature ?? '';
      return {
        met: ctx.classFeatures.includes(feature),
        reason: feature,
      };
    }
    case 'casterLevel': {
      const required = prereq.value ?? 1;
      return {
        met: ctx.casterLevel >= required,
        reason: `Caster level ${required}`,
      };
    }
    case 'class': {
      const className = prereq.className;
      return {
        met: className === ctx.className,
        reason: `Class: ${className}`,
      };
    }
    case 'proficiency': {
      const prof = prereq.proficiency ?? '';
      return {
        met: ctx.classFeatures.includes(prof),
        reason: `Proficiency: ${prof}`,
      };
    }
    case 'level': {
      const required = prereq.value ?? 1;
      return {
        met: ctx.level >= required,
        reason: `Character level ${required}`,
      };
    }
    case 'spellLevel': {
      const required = prereq.value ?? 1;
      return {
        met: ctx.casterLevel >= required * 2 - 1, // rough approximation
        reason: `Able to cast ${required}${getOrdinalSuffix(required)}-level spells`,
      };
    }
    default:
      return { met: true, reason: 'Unknown prerequisite' };
  }
}

function getOrdinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export function checkPrerequisites(
  feat: Feat,
  ctx: PrerequisiteContext
): PrerequisiteResult {
  const unmet: string[] = [];

  for (const prereq of feat.prerequisites) {
    const result = checkSinglePrerequisite(prereq, ctx);
    if (!result.met) {
      unmet.push(result.reason);
    }
  }

  return { met: unmet.length === 0, unmet };
}

export function getAvailableFeats(
  allFeats: Feat[],
  ctx: PrerequisiteContext,
  alreadySelected: string[] = []
): { feat: Feat; prereqResult: PrerequisiteResult }[] {
  return allFeats
    .filter(f => !alreadySelected.includes(f.name))
    .map(feat => ({
      feat,
      prereqResult: checkPrerequisites(feat, ctx),
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
