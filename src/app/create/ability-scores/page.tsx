'use client';

import { useEffect } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { useDiceRoller } from '@/hooks/use-dice-roller';
import { AbilityScore, ABILITY_SCORES, ABILITY_SCORE_LABELS } from '@/types/common';
import { POINT_BUY_COSTS, DEFAULT_POINT_BUY_BUDGET, AbilityScoreMethod } from '@/types/ability-scores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const { rollAbilityScores } = useDiceRoller();

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  const method = draft.abilityScoreMethod;
  const scores = draft.baseAbilityScores;
  const pointsUsed = getPointBuyTotal(scores);
  const pointsRemaining = DEFAULT_POINT_BUY_BUDGET - pointsUsed;

  const handleMethodChange = (m: AbilityScoreMethod) => {
    setAbilityScoreMethod(m);
    if (m === 'pointBuy') {
      setBaseAbilityScores({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
    }
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
      if (newTotal > DEFAULT_POINT_BUY_BUDGET) return;
    }
    setBaseAbilityScore(ability, newVal);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 3: Ability Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            {(['pointBuy', 'roll', 'manual'] as AbilityScoreMethod[]).map((m) => (
              <Button
                key={m}
                variant={method === m ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMethodChange(m)}
              >
                {m === 'pointBuy' ? 'Point Buy' : m === 'roll' ? '4d6 Drop Lowest' : 'Manual Entry'}
              </Button>
            ))}
          </div>

          {method === 'pointBuy' && (
            <div className="mb-4">
              <Badge variant={pointsRemaining >= 0 ? 'secondary' : 'destructive'}>
                Points: {pointsUsed} / {DEFAULT_POINT_BUY_BUDGET} ({pointsRemaining} remaining)
              </Badge>
            </div>
          )}

          {method === 'roll' && (
            <Button onClick={handleRollAll} variant="outline" className="mb-4">
              Roll All Scores (4d6 drop lowest)
            </Button>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ABILITY_SCORES.map((ability) => (
              <div key={ability} className="flex flex-col items-center p-4 border rounded-lg">
                <span className="text-xs text-muted-foreground uppercase mb-1">
                  {ABILITY_SCORE_LABELS[ability]}
                </span>
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
                <span className="text-sm text-muted-foreground">
                  Mod: {getModifier(scores[ability])}
                </span>
                {method === 'pointBuy' && (
                  <span className="text-xs text-muted-foreground">
                    Cost: {POINT_BUY_COSTS[scores[ability]] ?? '?'}
                  </span>
                )}
              </div>
            ))}
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
