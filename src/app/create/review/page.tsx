'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { races } from '@/data/races';
import { classes } from '@/data/classes';
import { SKILLS_BY_NAME } from '@/data/skills';
import { ABILITY_SCORES, ABILITY_SCORE_LABELS, Alignment } from '@/types/common';
import { getAbilityModifier } from '@/lib/spell-slots';
import { calculateMaxHP, getSizeModifier } from '@/lib/calculations';
import { getBABAtLevel } from '@/types/class';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const ALIGNMENTS: { value: Alignment; label: string }[] = [
  { value: 'LG', label: 'Lawful Good' },
  { value: 'NG', label: 'Neutral Good' },
  { value: 'CG', label: 'Chaotic Good' },
  { value: 'LN', label: 'Lawful Neutral' },
  { value: 'TN', label: 'True Neutral' },
  { value: 'CN', label: 'Chaotic Neutral' },
  { value: 'LE', label: 'Lawful Evil' },
  { value: 'NE', label: 'Neutral Evil' },
  { value: 'CE', label: 'Chaotic Evil' },
];

export default function ReviewPage() {
  const router = useRouter();
  const { prevStep, finalize } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setName = useCreationStore((s) => s.setName);
  const setAlignment = useCreationStore((s) => s.setAlignment);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);

  useEffect(() => {
    setCurrentStep(7);
  }, [setCurrentStep]);

  const race = draft.race ? races[draft.race] : null;
  const cls = draft.className ? classes[draft.className] : null;

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

  const conMod = getAbilityModifier(finalScores.con);
  const maxHP = cls ? calculateMaxHP(cls.hitDie, conMod, 1) : 0;
  const bab = cls ? getBABAtLevel(cls.babProgression, 1) : 0;

  const handleFinalize = () => {
    const id = finalize();
    if (id) {
      router.push(`/characters/${id}`);
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 7: Review & Save</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name & Alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Character Name *</Label>
              <Input
                id="name"
                placeholder="Enter character name..."
                value={draft.name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select value={draft.alignment} onValueChange={setAlignment}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select alignment..." />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENTS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded text-center">
              <div className="text-xs text-muted-foreground">Race</div>
              <div className="font-bold">{draft.race || '—'}</div>
            </div>
            <div className="p-3 border rounded text-center">
              <div className="text-xs text-muted-foreground">Class</div>
              <div className="font-bold">{draft.className || '—'}</div>
            </div>
            <div className="p-3 border rounded text-center">
              <div className="text-xs text-muted-foreground">Max HP</div>
              <div className="font-bold">{maxHP}</div>
            </div>
            <div className="p-3 border rounded text-center">
              <div className="text-xs text-muted-foreground">BAB</div>
              <div className="font-bold">+{bab}</div>
            </div>
          </div>

          {/* Ability Scores */}
          <div>
            <h4 className="text-sm font-medium mb-2">Ability Scores (with racial modifiers):</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {ABILITY_SCORES.map((a) => {
                const mod = getAbilityModifier(finalScores[a]);
                return (
                  <div key={a} className="text-center p-2 border rounded">
                    <div className="text-xs text-muted-foreground">{ABILITY_SCORE_LABELS[a]}</div>
                    <div className="text-xl font-bold">{finalScores[a]}</div>
                    <div className="text-sm text-muted-foreground">{mod >= 0 ? '+' : ''}{mod}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          {draft.skills.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Skills ({draft.skills.length} ranked):</h4>
              <div className="flex gap-2 flex-wrap">
                {draft.skills.map((s) => (
                  <Badge key={s.name} variant="secondary">
                    {s.name} ({s.ranks} rank)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Feats */}
          {draft.featNames.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Feats:</h4>
              <div className="flex gap-2 flex-wrap">
                {draft.featNames.map((f) => (
                  <Badge key={f} variant="default">{f}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {draft.equipment.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Equipment ({draft.gold - draft.equipment.reduce((s, e) => s + e.item.cost * e.quantity, 0)} gp remaining):</h4>
              <div className="flex gap-2 flex-wrap">
                {draft.equipment.map((e, i) => (
                  <Badge key={i} variant="outline">
                    {e.item.name}{e.quantity > 1 ? ` x${e.quantity}` : ''}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {race && (
            <div>
              <h4 className="text-sm font-medium mb-2">Languages:</h4>
              <div className="flex gap-2 flex-wrap">
                {(draft.languages.length > 0 ? draft.languages : race.languages).map((lang) => (
                  <Badge key={lang} variant="secondary">{lang}</Badge>
                ))}
              </div>
              {race.bonusLanguages && race.bonusLanguages.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Bonus languages available (from INT): {race.bonusLanguages.join(', ')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button
          onClick={handleFinalize}
          disabled={!draft.name.trim() || !draft.race || !draft.className}
          size="lg"
        >
          {draft.editingCharacterId ? 'Save Changes' : 'Create Character'}
        </Button>
      </div>
    </div>
  );
}
