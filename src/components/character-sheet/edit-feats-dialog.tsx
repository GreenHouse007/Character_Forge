'use client';

import { useState, useMemo } from 'react';
import { Character } from '@/types/character';
import { ALL_FEATS, FEATS_BY_NAME, ALL_CATEGORIES } from '@/data/feats';
import { WEAPONS } from '@/data/equipment/weapons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PARAMETERIZED_FEATS = [
  'Weapon Focus',
  'Weapon Specialization',
  'Greater Weapon Focus',
  'Greater Weapon Specialization',
  'Improved Critical',
  'Slashing Grace',
];

const WEAPON_NAMES = WEAPONS.map((w) => w.name).sort();

interface EditFeatsDialogProps {
  character: Character;
  onSave: (updates: Partial<Character>) => void;
}

export function EditFeatsDialog({ character, onSave }: EditFeatsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFeats, setSelectedFeats] = useState<string[]>([]);
  const [featParams, setFeatParams] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showCount, setShowCount] = useState(50);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSelectedFeats([...character.featNames]);
      setFeatParams({ ...character.featParams });
      setSearch('');
      setCategory('all');
      setShowCount(50);
    }
    setOpen(isOpen);
  };

  const filteredFeats = useMemo(() => {
    let results = ALL_FEATS;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (f) => f.name.toLowerCase().includes(q) || f.shortDescription.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') {
      results = results.filter((f) => f.categories.includes(category));
    }
    return results;
  }, [search, category]);

  const totalResults = filteredFeats.length;
  const visibleFeats = filteredFeats.slice(0, showCount);

  const addFeat = (name: string) => {
    if (!selectedFeats.includes(name)) {
      setSelectedFeats((prev) => [...prev, name]);
    }
  };

  const removeFeat = (name: string) => {
    setSelectedFeats((prev) => prev.filter((f) => f !== name));
    setFeatParams((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const setParam = (featName: string, weapon: string) => {
    setFeatParams((prev) => ({ ...prev, [featName]: weapon }));
  };

  const handleSave = () => {
    onSave({ featNames: selectedFeats, featParams });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Feats</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Feats */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">
              Current Feats ({selectedFeats.length})
            </h4>
            {selectedFeats.length === 0 ? (
              <p className="text-xs text-muted-foreground">No feats selected.</p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {selectedFeats.map((name) => {
                  const isParameterized = PARAMETERIZED_FEATS.includes(name);
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between text-sm p-1.5 border rounded"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="truncate font-medium">{name}</span>
                        {isParameterized && (
                          <Select
                            value={featParams[name] ?? ''}
                            onValueChange={(v) => setParam(name, v)}
                          >
                            <SelectTrigger className="h-6 w-32 text-xs">
                              <SelectValue placeholder="Weapon..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-48">
                              {WEAPON_NAMES.map((w) => (
                                <SelectItem key={w} value={w} className="text-xs">
                                  {w}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {isParameterized && featParams[name] && (
                          <span className="text-xs text-muted-foreground">
                            ({featParams[name]})
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs text-destructive shrink-0"
                        onClick={() => removeFeat(name)}
                      >
                        X
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Feats */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Add Feats</h4>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Search feats..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowCount(50);
                }}
                className="h-8 text-sm"
              />
              <Select value={category} onValueChange={(v) => { setCategory(v); setShowCount(50); }}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Category..." />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                  {ALL_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 max-h-[40vh] overflow-y-auto pr-1">
              {visibleFeats.map((feat) => {
                const isSelected = selectedFeats.includes(feat.name);
                return (
                  <div
                    key={feat.name}
                    className={`text-sm p-1.5 border rounded ${isSelected ? 'opacity-40' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-xs">{feat.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => addFeat(feat.name)}
                        disabled={isSelected}
                      >
                        Add
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {feat.shortDescription}
                    </p>
                    {feat.prerequisitesText && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        <span className="font-medium">Prereqs:</span> {feat.prerequisitesText}
                      </p>
                    )}
                  </div>
                );
              })}
              {totalResults > showCount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setShowCount((prev) => prev + 50)}
                >
                  Show more ({totalResults - showCount} remaining)
                </Button>
              )}
              {visibleFeats.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No feats match your search.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
