import { Character, LevelUpRecord } from '@/types/character';
import { ClassName, CharacterClass } from '@/types/class';
import { AbilityScore } from '@/types/common';
import { CharacterSkill } from '@/types/skill';

export interface LevelUpRequirements {
  newLevel: number;
  hpDie: number;
  skillRanksAvailable: number;
  needsFeat: boolean;       // odd levels
  needsBonusFeat: boolean;  // class-specific
  bonusFeatNote?: string;
  needsAbilityIncrease: boolean; // every 4th level
  newClassFeatures: { name: string; description: string }[];
  gainsNewSpellLevel: boolean;
}

export function getLevelUpRequirements(
  character: Character,
  cls: CharacterClass,
  intMod: number,
  isHuman: boolean
): LevelUpRequirements {
  const newLevel = character.level + 1;
  const baseRanks = cls.skillRanksPerLevel + intMod + (isHuman ? 1 : 0);
  const skillRanksAvailable = Math.max(1, baseRanks);

  const needsFeat = newLevel % 2 === 1; // feats at 1, 3, 5, 7...
  const needsAbilityIncrease = newLevel % 4 === 0; // 4, 8, 12, 16, 20

  // Check class bonus feats
  let needsBonusFeat = false;
  let bonusFeatNote: string | undefined;
  if (cls.bonusFeats) {
    const bonusFeat = cls.bonusFeats.find((bf) => bf.level === newLevel);
    if (bonusFeat) {
      needsBonusFeat = true;
      bonusFeatNote = bonusFeat.note;
    }
  }
  // Special: Fighter bonus feat every even level
  if (cls.name === 'Fighter' && newLevel % 2 === 0) {
    needsBonusFeat = true;
    bonusFeatNote = 'Combat feat';
  }
  // Special: Monk bonus feat at 1, 2, 6, 10, 14, 18
  if (cls.name === 'Monk' && [1, 2, 6, 10, 14, 18].includes(newLevel)) {
    needsBonusFeat = true;
    bonusFeatNote = 'Monk bonus feat';
  }

  const newClassFeatures = cls.classFeatures.filter((f) => f.level === newLevel);

  // Check if new spell level unlocked
  let gainsNewSpellLevel = false;
  if (cls.spellProgression.spellsPerDay) {
    const prevSlots = cls.spellProgression.spellsPerDay[character.level];
    const newSlots = cls.spellProgression.spellsPerDay[newLevel];
    if (newSlots) {
      const prevMaxLevel = prevSlots ? Math.max(...Object.keys(prevSlots).map(Number)) : -1;
      const newMaxLevel = Math.max(...Object.keys(newSlots).map(Number));
      gainsNewSpellLevel = newMaxLevel > prevMaxLevel;
    }
  }

  return {
    newLevel,
    hpDie: cls.hitDie,
    skillRanksAvailable,
    needsFeat,
    needsBonusFeat,
    bonusFeatNote,
    needsAbilityIncrease,
    newClassFeatures,
    gainsNewSpellLevel,
  };
}

export function applyLevelUp(character: Character, record: LevelUpRecord): Character {
  const updated = { ...character };

  // Increment level
  updated.level = record.levelNumber;

  // Apply ability score increase
  if (record.abilityScoreIncrease) {
    updated.baseAbilityScores = { ...updated.baseAbilityScores };
    updated.baseAbilityScores[record.abilityScoreIncrease] += 1;
  }

  // Apply skill ranks
  const skillMap = new Map(updated.skills.map((s) => [s.name, { ...s }]));
  for (const alloc of record.skillRanksAllocated) {
    const existing = skillMap.get(alloc.skill);
    if (existing) {
      existing.ranks += alloc.ranks;
    } else {
      skillMap.set(alloc.skill, {
        name: alloc.skill,
        ranks: alloc.ranks,
        isClassSkill: false,
        miscModifier: 0,
      });
    }
  }
  updated.skills = Array.from(skillMap.values());

  // Apply feats
  updated.featNames = [...updated.featNames];
  if (record.featChosen) {
    updated.featNames.push(record.featChosen);
  }
  if (record.bonusFeatChosen) {
    updated.featNames.push(record.bonusFeatChosen);
  }

  // Append history
  updated.levelHistory = [...updated.levelHistory, record];

  return updated;
}

export function calculateMaxHPFromHistory(
  hitDie: number,
  conMod: number,
  level: number,
  levelHistory: LevelUpRecord[],
  hasToughness: boolean
): number {
  // Level 1: full hit die + con mod
  let hp = hitDie + conMod;

  // Subsequent levels: use actual rolls from history if available
  for (let lvl = 2; lvl <= level; lvl++) {
    const record = levelHistory.find((r) => r.levelNumber === lvl);
    if (record) {
      hp += record.hpRolled + conMod;
    } else {
      // Fallback to average if no record
      hp += Math.ceil(hitDie / 2) + 1 + conMod;
    }
  }

  if (hasToughness) {
    hp += level; // Toughness: +1 HP per level (minimum 3, but simplified)
  }

  return Math.max(1, hp);
}
