import { AbilityScore, SkillName, Source } from './common';

export interface Skill {
  name: SkillName;
  ability: AbilityScore;
  trainedOnly: boolean;
  armorCheckPenalty: boolean;
  description: string;
  source: Source;
}

export interface CharacterSkill {
  name: SkillName;
  ranks: number;
  isClassSkill: boolean;
  miscModifier: number;
}

export function getSkillTotal(
  skill: CharacterSkill,
  abilityModifier: number,
  armorCheckPenalty: number,
  skillDef: Skill
): number {
  let total = skill.ranks + abilityModifier + skill.miscModifier;
  if (skill.isClassSkill && skill.ranks > 0) {
    total += 3; // class skill bonus
  }
  if (skillDef.armorCheckPenalty) {
    total += armorCheckPenalty; // penalty is negative
  }
  return total;
}
