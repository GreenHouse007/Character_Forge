'use client';

import { useEffect } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { classes, classList } from '@/data/classes';
import { ClassName } from '@/types/class';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ClassPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setClass = useCreationStore((s) => s.setClass);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const selectedClass = draft.className ? classes[draft.className] : null;

  const babLabel = (p: string) => {
    switch (p) {
      case 'full': return 'Full (+1/level)';
      case 'threeQuarter': return '3/4';
      case 'half': return '1/2';
      default: return p;
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Step 2: Choose Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {classList.map((cls) => (
              <button
                key={cls.name}
                onClick={() => setClass(cls.name)}
                className={`p-4 border rounded-lg text-left transition-colors hover:border-primary/50 ${
                  draft.className === cls.name ? 'border-primary bg-primary/5 ring-1 ring-primary' : ''
                }`}
              >
                <div className="font-semibold text-sm">{cls.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  d{cls.hitDie} &middot; {babLabel(cls.babProgression)} BAB
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {cls.skillRanksPerLevel}+Int skills/lvl
                </div>
                {cls.spellProgression.type !== 'none' && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {cls.spellProgression.type} caster
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedClass.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedClass.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-xs text-muted-foreground">Hit Die</div>
                  <div className="font-bold">d{selectedClass.hitDie}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xs text-muted-foreground">BAB</div>
                  <div className="font-bold">{babLabel(selectedClass.babProgression)}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xs text-muted-foreground">Good Saves</div>
                  <div className="font-bold capitalize">{selectedClass.goodSaves.join(', ')}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-xs text-muted-foreground">Skills/Level</div>
                  <div className="font-bold">{selectedClass.skillRanksPerLevel} + Int</div>
                </div>
              </div>

              {selectedClass.alignmentRestrictions && selectedClass.alignmentRestrictions.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Alignment Restriction: </span>
                  <span className="text-sm text-muted-foreground">
                    Must be {selectedClass.alignmentRestrictions.join(' or ')}
                  </span>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Class Features:</h4>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {selectedClass.classFeatures.map((feature) => (
                    <div key={feature.name} className="text-sm">
                      <span className="font-medium">Lvl {feature.level} - {feature.name}:</span>{' '}
                      <span className="text-muted-foreground">{feature.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Proficiencies:</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Weapons:</strong> {selectedClass.proficiencies.weapons.join(', ') || 'None'}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Armor:</strong> {selectedClass.proficiencies.armor.join(', ') || 'None'}
                  {selectedClass.proficiencies.shields.length > 0 && `, ${selectedClass.proficiencies.shields.join(', ')}`}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Class Skills:</h4>
                <p className="text-xs text-muted-foreground">
                  {selectedClass.classSkills.join(', ')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={!draft.className}>
          Next: Ability Scores
        </Button>
      </div>
    </div>
  );
}
