'use client';

import { useEffect, useMemo } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { SKILLS } from '@/data/skills';
import { classes } from '@/data/classes';
import { races } from '@/data/races';
import { CharacterSkill } from '@/types/skill';
import { SkillName, ABILITY_SCORE_SHORT } from '@/types/common';
import { getAbilityModifier } from '@/lib/spell-slots';
import { calculateSkillRanksPerLevel } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillsPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setSkills = useCreationStore((s) => s.setSkills);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const cls = draft.className ? classes[draft.className] : null;
  const race = draft.race ? races[draft.race] : null;

  // Calculate final ability scores with racial modifiers
  const finalScores = useMemo(() => {
    const base = { ...draft.baseAbilityScores };
    if (race) {
      for (const mod of race.abilityModifiers) {
        base[mod.ability] += mod.modifier;
      }
      if (race.flexibleAbilityBonus && draft.racialAbilityChoice) {
        base[draft.racialAbilityChoice] += 2;
      }
    }
    return base;
  }, [draft.baseAbilityScores, race, draft.racialAbilityChoice]);

  const intMod = getAbilityModifier(finalScores.int);
  const ranksPerLevel = cls ? calculateSkillRanksPerLevel(cls.skillRanksPerLevel, intMod, draft.race === 'Human') : 0;

  const skillMap = useMemo(() => {
    const map = new Map<SkillName, CharacterSkill>();
    for (const s of draft.skills) {
      map.set(s.name, s);
    }
    return map;
  }, [draft.skills]);

  const totalRanksUsed = draft.skills.reduce((sum, s) => sum + s.ranks, 0);
  const ranksRemaining = ranksPerLevel - totalRanksUsed;

  const setSkillRank = (skillName: SkillName, ranks: number) => {
    const isClassSkill = cls?.classSkills.includes(skillName) ?? false;
    const existing = skillMap.get(skillName);
    const newSkills = draft.skills.filter((s) => s.name !== skillName);

    if (ranks > 0) {
      newSkills.push({
        name: skillName,
        ranks,
        isClassSkill,
        miscModifier: existing?.miscModifier ?? 0,
      });
    }

    setSkills(newSkills);
  };

  const adjustRank = (skillName: SkillName, delta: number) => {
    const current = skillMap.get(skillName)?.ranks ?? 0;
    const newRanks = Math.max(0, Math.min(1, current + delta)); // max 1 rank at level 1
    if (delta > 0 && ranksRemaining <= 0) return;
    setSkillRank(skillName, newRanks);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Step 4: Allocate Skill Ranks</CardTitle>
            <Badge variant={ranksRemaining >= 0 ? 'secondary' : 'destructive'}>
              {totalRanksUsed} / {ranksPerLevel} ranks used
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!cls && (
            <p className="text-sm text-muted-foreground">Please select a class first.</p>
          )}

          {cls && (
            <div className="overflow-x-auto">
            <div className="min-w-[380px] space-y-1">
              <div className="grid grid-cols-[1fr_60px_60px_60px_40px] gap-2 text-xs text-muted-foreground font-medium pb-2 border-b">
                <div>Skill</div>
                <div className="text-center">Ability</div>
                <div className="text-center">Ranks</div>
                <div className="text-center">Total</div>
                <div />
              </div>
              {SKILLS.map((skill) => {
                const charSkill = skillMap.get(skill.name);
                const isClassSkill = cls.classSkills.includes(skill.name);
                const abilityMod = getAbilityModifier(finalScores[skill.ability]);
                const ranks = charSkill?.ranks ?? 0;
                const classBonus = isClassSkill && ranks > 0 ? 3 : 0;
                const total = ranks + abilityMod + classBonus;

                return (
                  <div
                    key={skill.name}
                    className={`grid grid-cols-[1fr_60px_60px_60px_40px] gap-2 items-center py-1 text-sm ${
                      isClassSkill ? 'bg-primary/5 px-2 rounded' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className={isClassSkill ? 'font-medium' : ''}>{skill.name}</span>
                      {isClassSkill && <Badge variant="outline" className="text-[10px] px-1 py-0">C</Badge>}
                      {skill.trainedOnly && ranks === 0 && (
                        <span className="text-xs text-muted-foreground">(trained)</span>
                      )}
                    </div>
                    <div className="text-center text-xs text-muted-foreground">
                      {ABILITY_SCORE_SHORT[skill.ability]} ({abilityMod >= 0 ? '+' : ''}{abilityMod})
                    </div>
                    <div className="text-center font-mono">{ranks}</div>
                    <div className="text-center font-bold">
                      {(!skill.trainedOnly || ranks > 0) ? (total >= 0 ? `+${total}` : total) : '—'}
                    </div>
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustRank(skill.name, -1)}
                        disabled={ranks <= 0}
                      >
                        -
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustRank(skill.name, 1)}
                        disabled={ranks >= 1 || ranksRemaining <= 0}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next: Feats</Button>
      </div>
    </div>
  );
}
