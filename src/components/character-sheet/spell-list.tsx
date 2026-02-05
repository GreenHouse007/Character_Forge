'use client';

import { useState, useMemo } from 'react';
import { Character } from '@/types/character';
import { DerivedStats } from '@/hooks/use-derived-stats';
import { useCharacterStore } from '@/stores/character-store';
import { SPELLS_BY_NAME, getSpellsForClass } from '@/data/spells';
import { Spell } from '@/types/spell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SpellListProps {
  character: Character;
  stats: DerivedStats;
}

function SpellCard({ spell, onCast, canCast }: { spell: Spell; onCast?: () => void; canCast?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded p-2 text-sm">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium">{spell.name}</span>
          <Badge variant="outline" className="text-[9px] px-1 py-0">
            {spell.school.slice(0, 4)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {onCast && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onCast();
              }}
              disabled={!canCast}
            >
              Cast
            </Button>
          )}
          <span className="text-xs text-muted-foreground">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground space-y-1">
          <p><strong>Casting Time:</strong> {spell.castingTime}</p>
          <p><strong>Range:</strong> {spell.range}</p>
          <p><strong>Duration:</strong> {spell.duration}</p>
          {spell.savingThrow && <p><strong>Save:</strong> {spell.savingThrow}</p>}
          <p className="mt-2">{spell.description}</p>
        </div>
      )}
    </div>
  );
}

function LearnSpellDialog({
  character,
  stats,
  onLearn,
}: {
  character: Character;
  stats: DerivedStats;
  onLearn: (spellName: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const maxSpellLevel = useMemo(() => {
    if (!stats.spellState.canCast) return 0;
    // Find max spell level available
    let max = 0;
    for (const level of Object.keys(stats.spellState.spellSlots)) {
      const lvl = parseInt(level);
      if (lvl > max) max = lvl;
    }
    return max;
  }, [stats.spellState]);

  const availableSpells = useMemo(() => {
    const spells = getSpellsForClass(character.className, maxSpellLevel);
    // Filter out already known spells
    const notKnown = spells.filter((s) => !character.spellsKnown.includes(s.name));
    // Filter by search
    const filtered = search
      ? notKnown.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
      : notKnown;
    // Filter by level
    if (selectedLevel !== null) {
      return filtered.filter((s) => s.level[character.className] === selectedLevel);
    }
    return filtered;
  }, [character.className, character.spellsKnown, maxSpellLevel, search, selectedLevel]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Learn Spell</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Learn a New Spell</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Search spells..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedLevel === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(null)}
            >
              All
            </Button>
            {Array.from({ length: maxSpellLevel + 1 }, (_, i) => i).map((lvl) => (
              <Button
                key={lvl}
                variant={selectedLevel === lvl ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(lvl)}
              >
                {lvl}
              </Button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1 space-y-1 mt-3">
          {availableSpells.map((spell) => (
            <div
              key={spell.name}
              className="flex items-center justify-between p-2 border rounded text-sm hover:bg-muted cursor-pointer"
              onClick={() => {
                onLearn(spell.name);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{spell.name}</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0">
                  Lvl {spell.level[character.className]}
                </Badge>
                <Badge variant="secondary" className="text-[9px] px-1 py-0">
                  {spell.school}
                </Badge>
              </div>
            </div>
          ))}
          {availableSpells.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No spells available
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SpellList({ character, stats }: SpellListProps) {
  const store = useCharacterStore();

  if (!stats.spellState.canCast) {
    return null;
  }

  const castingAbility = stats.spellState.castingAbility!;
  const castingMod = stats.abilityModifiers[castingAbility];
  const baseDC = 10 + castingMod;

  // Group known spells by level
  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, Spell[]> = {};
    for (const spellName of character.spellsKnown) {
      const spell = SPELLS_BY_NAME[spellName];
      if (!spell) continue;
      const level = spell.level[character.className];
      if (level === undefined) continue;
      if (!grouped[level]) grouped[level] = [];
      grouped[level].push(spell);
    }
    // Sort each level's spells alphabetically
    for (const level of Object.keys(grouped)) {
      grouped[parseInt(level)].sort((a, b) => a.name.localeCompare(b.name));
    }
    return grouped;
  }, [character.spellsKnown, character.className]);

  const handleCast = (spellLevel: number) => {
    store.useSpellSlot(spellLevel);
  };

  const canCastLevel = (level: number): boolean => {
    const slot = stats.spellState.spellSlots[level];
    if (!slot) return false;
    return slot.used < slot.total;
  };

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Spells Known</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              DC {baseDC} + spell level
            </span>
            <LearnSpellDialog
              character={character}
              stats={stats}
              onLearn={store.learnSpell}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {character.spellsKnown.length === 0 ? (
          <p className="text-sm text-muted-foreground">No spells known. Use &quot;Learn Spell&quot; to add spells.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(spellsByLevel)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([levelStr, spells]) => {
                const level = parseInt(levelStr);
                const slot = stats.spellState.spellSlots[level];
                const remaining = slot ? slot.total - slot.used : 0;
                const total = slot?.total ?? 0;

                return (
                  <div key={level}>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded mb-2">
                      <span className="font-medium">
                        {level === 0 ? 'Cantrips' : `Level ${level}`}
                      </span>
                      <div className="flex items-center gap-2">
                        {level > 0 && (
                          <Badge variant={remaining > 0 ? 'secondary' : 'outline'}>
                            {remaining}/{total} slots
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {spells.length} spell{spells.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {spells.map((spell) => (
                        <SpellCard
                          key={spell.name}
                          spell={spell}
                          onCast={level > 0 ? () => handleCast(level) : undefined}
                          canCast={level === 0 || canCastLevel(level)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
