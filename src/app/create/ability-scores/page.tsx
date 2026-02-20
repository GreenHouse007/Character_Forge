'use client';

import { useEffect } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { useDiceRoller } from '@/hooks/use-dice-roller';
import { AbilityScore, ABILITY_SCORES, ABILITY_SCORE_LABELS, ABILITY_SCORE_SHORT } from '@/types/common';
import {
  POINT_BUY_COSTS,
  AbilityScoreMethod,
  POINT_BUY_PRESETS,
  STANDARD_ARRAY,
} from '@/types/ability-scores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CLASS_ABILITY_RECOMMENDATIONS } from '@/data/classes/ability-recommendations';
import { races } from '@/data/races';

function getPointBuyTotal(scores: Record<AbilityScore, number>): number {
  return ABILITY_SCORES.reduce((sum, a) => sum + (POINT_BUY_COSTS[scores[a]] ?? 0), 0);
}

function getModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function AbilityScoresPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setAbilityScoreMethod = useCreationStore((s) => s.setAbilityScoreMethod);
  const setBaseAbilityScore = useCreationStore((s) => s.setBaseAbilityScore);
  const setBaseAbilityScores = useCreationStore((s) => s.setBaseAbilityScores);
  const setPointBuyBudget = useCreationStore((s) => s.setPointBuyBudget);
  const setStandardArrayAssignment = useCreationStore((s) => s.setStandardArrayAssignment);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const { rollAbilityScores } = useDiceRoller();

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const method = draft.abilityScoreMethod;
  const scores = draft.baseAbilityScores;
  const pointBuyBudget = draft.pointBuyBudget ?? 20;
  const standardArrayAssignment = draft.standardArrayAssignment ?? {};
  const className = draft.className;
  const race = draft.race;
  const racialAbilityChoice = draft.racialAbilityChoice;

  const pointsUsed = getPointBuyTotal(scores);
  const pointsRemaining = pointBuyBudget - pointsUsed;

  const recommendation = className ? CLASS_ABILITY_RECOMMENDATIONS[className] : null;

  function getFinalScore(ability: AbilityScore, base: number): number {
    if (!race) return base;
    const raceData = races[race];
    let bonus = raceData.abilityModifiers
      .filter((m) => m.ability === ability)
      .reduce((sum, m) => sum + m.modifier, 0);
    if (raceData.flexibleAbilityBonus && racialAbilityChoice === ability) bonus += 2;
    return base + bonus;
  }

  const handleMethodChange = (m: AbilityScoreMethod) => {
    setAbilityScoreMethod(m);
    if (m === 'pointBuy') {
      setBaseAbilityScores({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    }
    if (m === 'standardArray') {
      // Reset standard array state; scores default to 10 until assigned
      setBaseAbilityScores({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
      // Clear each assignment individually via the store's action
      ABILITY_SCORES.forEach((a) => setStandardArrayAssignment(a, undefined));
    }
  };

  const handlePresetClick = (budget: number) => {
    setPointBuyBudget(budget);
    setBaseAbilityScores({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  };

  const handleRollAll = () => {
    const result = rollAbilityScores();
    const sorted = [...result.scores].sort((a, b) => b - a);
    setBaseAbilityScores({
      str: sorted[0], dex: sorted[1], con: sorted[2],
      int: sorted[3], wis: sorted[4], cha: sorted[5],
    });
  };

  const adjustScore = (ability: AbilityScore, delta: number) => {
    const newVal = scores[ability] + delta;
    if (newVal < 7 || newVal > 18) return;
    if (method === 'pointBuy') {
      const newScores = { ...scores, [ability]: newVal };
      const newTotal = getPointBuyTotal(newScores);
      if (newTotal > pointBuyBudget) return;
    }
    setBaseAbilityScore(ability, newVal);
  };

  // Standard array: which values are already assigned to other abilities
  const usedArrayValues = new Set(
    ABILITY_SCORES
      .filter((a) => standardArrayAssignment[a] !== undefined)
      .map((a) => standardArrayAssignment[a] as number)
  );

  const currentPreset = POINT_BUY_PRESETS.find((p) => p.budget === pointBuyBudget);

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 3: Ability Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Method selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['pointBuy', 'standardArray', 'roll', 'manual'] as AbilityScoreMethod[]).map((m) => (
              <Button
                key={m}
                variant={method === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMethodChange(m)}
              >
                {m === 'pointBuy' ? 'Point Buy'
                  : m === 'standardArray' ? 'Standard Array'
                  : m === 'roll' ? '4d6 Drop Lowest'
                  : 'Manual Entry'}
              </Button>
            ))}
          </div>

          {/* Class recommendation banner */}
          {recommendation && (
            <div className="mb-4 p-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Recommended for {className}:
                </span>
                {recommendation.primary.map((a) => (
                  <Badge key={a} className="bg-blue-600 text-white text-xs">
                    {ABILITY_SCORE_SHORT[a]}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">{recommendation.reason}</p>
            </div>
          )}

          {/* Point Buy controls */}
          {method === 'pointBuy' && (
            <div className="mb-4 space-y-2">
              {/* Power-level presets */}
              <div className="flex flex-wrap gap-2">
                {POINT_BUY_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={pointBuyBudget === preset.budget ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePresetClick(preset.budget)}
                  >
                    {preset.label} ({preset.budget})
                  </Button>
                ))}
              </div>
              <Badge variant={pointsRemaining >= 0 ? 'secondary' : 'destructive'}>
                {currentPreset?.label ?? `${pointBuyBudget} pts`}: {pointsUsed} / {pointBuyBudget} ({pointsRemaining} remaining)
              </Badge>
            </div>
          )}

          {/* Standard Array legend */}
          {method === 'standardArray' && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Assign <span className="font-medium">[15, 14, 13, 12, 10, 8]</span> to each ability. Each value can only be used once.
              </p>
            </div>
          )}

          {/* Roll button */}
          {method === 'roll' && (
            <Button onClick={handleRollAll} variant="outline" className="mb-4">
              Roll All Scores (4d6 drop lowest)
            </Button>
          )}

          {/* Ability score cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ABILITY_SCORES.map((ability) => {
              const base = scores[ability];
              const final = getFinalScore(ability, base);
              const delta = final - base;
              const isRecommended = recommendation?.primary.includes(ability);

              return (
                <div
                  key={ability}
                  className={`flex flex-col items-center p-4 border rounded-lg ${isRecommended ? 'border-blue-400 dark:border-blue-600' : ''}`}
                >
                  <span className="text-xs text-muted-foreground uppercase mb-1">
                    {ABILITY_SCORE_LABELS[ability]}
                  </span>

                  {/* Score input */}
                  {method === 'standardArray' ? (
                    <select
                      className="mb-1 w-20 text-center text-xl font-bold border rounded px-1 py-0.5 bg-background"
                      value={standardArrayAssignment[ability] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        setStandardArrayAssignment(ability, val);
                      }}
                    >
                      <option value="">—</option>
                      {STANDARD_ARRAY.map((v) => (
                        <option
                          key={v}
                          value={v}
                          disabled={usedArrayValues.has(v) && standardArrayAssignment[ability] !== v}
                        >
                          {v}{usedArrayValues.has(v) && standardArrayAssignment[ability] !== v ? ' ✓' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 mb-1">
                      {method !== 'manual' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => adjustScore(ability, -1)}
                          disabled={scores[ability] <= 7}
                        >
                          -
                        </Button>
                      )}
                      {method === 'manual' ? (
                        <Input
                          type="number"
                          min={3}
                          max={20}
                          value={scores[ability]}
                          onChange={(e) => setBaseAbilityScore(ability, parseInt(e.target.value) || 10)}
                          className="w-16 text-center text-xl font-bold"
                        />
                      ) : (
                        <span className="text-2xl font-bold w-10 text-center">{scores[ability]}</span>
                      )}
                      {method !== 'manual' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => adjustScore(ability, 1)}
                          disabled={scores[ability] >= 18}
                        >
                          +
                        </Button>
                      )}
                    </div>
                  )}

                  <span className="text-sm text-muted-foreground">
                    Mod: {getModifier(base)}
                  </span>

                  {method === 'pointBuy' && (
                    <span className="text-xs text-muted-foreground">
                      Cost: {POINT_BUY_COSTS[scores[ability]] ?? '?'}
                    </span>
                  )}

                  {/* Racial preview */}
                  {race && (
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Final:</span>
                      <span className="text-xs font-bold">{final}</span>
                      {delta !== 0 && (
                        <Badge
                          variant="outline"
                          className={`text-xs px-1 py-0 ${delta > 0 ? 'text-green-600 border-green-400' : 'text-red-500 border-red-400'}`}
                        >
                          {delta > 0 ? `+${delta}` : delta} racial
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>
          Next: Skills
        </Button>
      </div>
    </div>
  );
}
