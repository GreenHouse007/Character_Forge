'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { ALL_FEATS, ALL_CATEGORIES } from '@/data/feats';
import { classes } from '@/data/classes';
import { races } from '@/data/races';
import { Feat } from '@/types/feat';
import { WEAPONS } from '@/data/equipment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAGE_SIZE = 50;

export default function FeatsPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const toggleFeat = useCreationStore((s) => s.toggleFeat);
  const setFeatParam = useCreationStore((s) => s.setFeatParam);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, categoryFilter, sourceFilter]);

  const cls = draft.className ? classes[draft.className] : null;
  const race = draft.race ? races[draft.race] : null;

  // Collect unique sources for the source filter
  const allSources = useMemo(() => {
    return Array.from(new Set(ALL_FEATS.map((f) => f.source).filter(Boolean))).sort();
  }, []);

  // Calculate how many feats the character can select
  const featSlots = useMemo(() => {
    let slots = 1; // everyone gets 1 feat at level 1
    if (draft.race === 'Human') slots += 1; // human bonus feat
    if (cls?.bonusFeats?.some((bf) => bf.level === 1)) slots += 1; // class bonus feat at 1
    if (cls?.name === 'Monk') slots += 1;
    if (cls?.name === 'Fighter') slots += 1;
    return slots;
  }, [draft.race, cls]);

  const displayFeats = useMemo(() => {
    let feats = ALL_FEATS;
    if (categoryFilter !== 'All') {
      feats = feats.filter((f) => f.categories.includes(categoryFilter));
    }
    if (sourceFilter !== 'All') {
      feats = feats.filter((f) => f.source === sourceFilter);
    }
    if (filter) {
      const lower = filter.toLowerCase();
      feats = feats.filter((f) => f.name.toLowerCase().includes(lower));
    }
    return feats;
  }, [categoryFilter, sourceFilter, filter]);

  const visibleFeats = displayFeats.slice(0, visibleCount);
  const hasMore = visibleCount < displayFeats.length;

  const renderFeat = (feat: Feat) => {
    const isSelected = draft.featNames.includes(feat.name);
    const canSelect = isSelected || draft.featNames.length < featSlots;

    return (
      <div
        key={feat.name}
        className={`p-3 border rounded-lg ${isSelected ? 'border-primary bg-primary/5' : ''}`}
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
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{feat.name}</span>
              {feat.categories.map((cat) => (
                <Badge key={cat} variant="outline" className="text-[10px]">{cat}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{feat.shortDescription}</p>
            {feat.prerequisitesText !== 'None' && (
              <div className="mt-1">
                <span className="text-xs font-medium">Prerequisites: </span>
                <span className="text-xs text-muted-foreground">{feat.prerequisitesText}</span>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sources</SelectItem>
                {allSources.map((src) => (
                  <SelectItem key={src} value={src}>{src}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {visibleFeats.map(renderFeat)}
            {displayFeats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No feats match your filters.</p>
            )}
            {hasMore && (
              <div className="text-center py-3">
                <Button variant="outline" size="sm" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                  Show more ({displayFeats.length - visibleCount} remaining)
                </Button>
              </div>
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
