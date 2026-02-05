'use client';

import { useEffect } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { races, raceList } from '@/data/races';
import { RaceName } from '@/types/race';
import { AbilityScore, ABILITY_SCORES, ABILITY_SCORE_LABELS } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function RacePage() {
  const { nextStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setRace = useCreationStore((s) => s.setRace);
  const setRacialAbilityChoice = useCreationStore((s) => s.setRacialAbilityChoice);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const selectedRace = draft.race ? races[draft.race] : null;

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 1: Choose Race</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {raceList.map((race) => (
              <button
                key={race.name}
                onClick={() => setRace(race.name)}
                className={`p-4 border rounded-lg text-left transition-colors hover:border-primary/50 ${
                  draft.race === race.name ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <div className="font-semibold text-sm">{race.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {race.size} &middot; {race.speed}ft
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {race.flexibleAbilityBonus
                    ? '+2 to one ability'
                    : race.abilityModifiers
                        .map((m) => `${m.modifier > 0 ? '+' : ''}${m.modifier} ${m.ability.toUpperCase()}`)
                        .join(', ')}
                </div>
              </button>
            ))}
          </div>

          {selectedRace && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedRace.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRace.description}</p>
              </div>

              {selectedRace.flexibleAbilityBonus && (
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Choose ability score for +2 racial bonus:
                  </label>
                  <Select
                    value={draft.racialAbilityChoice ?? ''}
                    onValueChange={(v) => setRacialAbilityChoice(v as AbilityScore)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select ability..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ABILITY_SCORES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {ABILITY_SCORE_LABELS[a]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Ability Modifiers (applied to base scores):</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedRace.abilityModifiers.map((m) => (
                    <Badge key={m.ability} variant={m.modifier > 0 ? 'default' : 'destructive'}>
                      {m.modifier > 0 ? '+' : ''}{m.modifier} {m.ability.toUpperCase()}
                    </Badge>
                  ))}
                  {selectedRace.flexibleAbilityBonus && draft.racialAbilityChoice && (
                    <Badge variant="default">+2 {draft.racialAbilityChoice.toUpperCase()}</Badge>
                  )}
                  {selectedRace.flexibleAbilityBonus && !draft.racialAbilityChoice && (
                    <Badge variant="secondary">+2 (choose above)</Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Racial Traits:</h4>
                <div className="space-y-1">
                  {selectedRace.racialTraits.map((trait) => (
                    <div key={trait.name} className="text-sm">
                      <span className="font-medium">{trait.name}:</span>{' '}
                      <span className="text-muted-foreground">{trait.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Languages:</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedRace.languages.join(', ')}
                  {selectedRace.bonusLanguages.length > 0 && (
                    <> &middot; <span className="italic">Bonus: {selectedRace.bonusLanguages.join(', ')}</span></>
                  )}
                </p>
              </div>

              {selectedRace.darkvision && (
                <p className="text-sm text-muted-foreground">Darkvision {selectedRace.darkvision} ft.</p>
              )}
              {selectedRace.lowLightVision && (
                <p className="text-sm text-muted-foreground">Low-Light Vision</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!draft.race}>
          Next: Class
        </Button>
      </div>
    </div>
  );
}
