'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { ALL_FEATS, FEATS_BY_CATEGORY } from '@/data/feats';
import { classes } from '@/data/classes';
import { races } from '@/data/races';
import { FeatCategory, Feat } from '@/types/feat';
import { checkPrerequisites, buildPrerequisiteContext } from '@/lib/prerequisites';
import { getAbilityModifier } from '@/lib/spell-slots';
import { WEAPONS } from '@/data/equipment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FeatsPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const toggleFeat = useCreationStore((s) => s.toggleFeat);
  const setFeatParam = useCreationStore((s) => s.setFeatParam);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FeatCategory | 'All'>('All');

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  const cls = draft.className ? classes[draft.className] : null;
  const race = draft.race ? races[draft.race] : null;

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

  const prereqContext = useMemo(() => {
    if (!cls) return null;
    const classFeatureNames = cls.classFeatures
      .filter((f) => f.level <= 1)
      .map((f) => f.name.toLowerCase());

    // Add proficiencies as class features for prerequisite checking
    if (cls.proficiencies.shields.length > 0) classFeatureNames.push('shield proficiency');

    const casterLevel = cls.spellProgression.type !== 'none' ? 1 : 0;

    return buildPrerequisiteContext(
      finalScores,
      1,
      cls.babProgression,
      cls.name,
      draft.featNames,
      draft.skills,
      classFeatureNames,
      casterLevel
    );
  }, [finalScores, cls, draft.featNames, draft.skills]);

  // Calculate how many feats the character can select
  const featSlots = useMemo(() => {
    let slots = 1; // everyone gets 1 feat at level 1
    if (draft.race === 'Human') slots += 1; // human bonus feat
    if (cls?.bonusFeats?.some((bf) => bf.level === 1)) slots += 1; // class bonus feat at 1
    // Monk bonus feat at 1
    if (cls?.name === 'Monk') slots += 1;
    // Fighter bonus feat at 1
    if (cls?.name === 'Fighter') slots += 1;
    return slots;
  }, [draft.race, cls]);

  const displayFeats = useMemo(() => {
    let feats = categoryFilter === 'All' ? ALL_FEATS : (FEATS_BY_CATEGORY[categoryFilter] ?? []);
    if (filter) {
      const lower = filter.toLowerCase();
      feats = feats.filter((f) => f.name.toLowerCase().includes(lower));
    }
    return feats;
  }, [categoryFilter, filter]);

  const renderFeat = (feat: Feat) => {
    const isSelected = draft.featNames.includes(feat.name);
    const prereqResult = prereqContext ? checkPrerequisites(feat, prereqContext) : { met: true, unmet: [] };
    const canSelect = isSelected || (prereqResult.met && draft.featNames.length < featSlots);

    return (
      <div
        key={feat.name}
        className={`p-3 border rounded-lg ${isSelected ? 'border-primary bg-primary/5' : ''} ${
          !prereqResult.met && !isSelected ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => {
              if (canSelect || isSelected) toggleFeat(feat.name);
            }}
            disabled={!canSelect && !isSelected}
            className="mt-0.5"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{feat.name}</span>
              <Badge variant="outline" className="text-[10px]">{feat.category}</Badge>
              {feat.isFighterBonusFeat && <Badge variant="secondary" className="text-[10px]">Fighter</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{feat.benefit}</p>
            {feat.prerequisites.length > 0 && (
              <div className="mt-1">
                <span className="text-xs font-medium">Prerequisites: </span>
                {prereqResult.unmet.length > 0 ? (
                  <span className="text-xs text-destructive">{prereqResult.unmet.join(', ')}</span>
                ) : (
                  <span className="text-xs text-green-600">All met</span>
                )}
              </div>
            )}
            {/* Parameterized feat: weapon chooser */}
            {isSelected && (feat.name === 'Weapon Focus' || feat.name === 'Weapon Specialization' || feat.name === 'Greater Weapon Focus' || feat.name === 'Slashing Grace') && (
              <div className="mt-2">
                <Select
                  value={draft.featParams[feat.name] ?? ''}
                  onValueChange={(val) => setFeatParam(feat.name, val)}
                >
                  <SelectTrigger className="h-7 text-xs w-48">
                    <SelectValue placeholder="Choose weapon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {WEAPONS.map((w) => (
                      <SelectItem key={w.name} value={w.name} className="text-xs">
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Step 5: Select Feats</CardTitle>
            <Badge variant={draft.featNames.length <= featSlots ? 'secondary' : 'destructive'}>
              {draft.featNames.length} / {featSlots} feat{featSlots !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Input
              placeholder="Search feats..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-64"
            />
            {(['All', 'Combat', 'General', 'Metamagic', 'Item Creation', 'Critical'] as const).map((cat) => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {draft.featNames.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected:</h4>
              <div className="flex gap-2 flex-wrap">
                {draft.featNames.map((name) => (
                  <Badge key={name} variant="default" className="cursor-pointer" onClick={() => toggleFeat(name)}>
                    {name} &times;
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {displayFeats.map(renderFeat)}
            {displayFeats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No feats match your filters.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next: Equipment</Button>
      </div>
    </div>
  );
}
