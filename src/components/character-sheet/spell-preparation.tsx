'use client';

import { useState, useMemo } from 'react';
import { Character } from '@/types/character';
import { DerivedStats } from '@/hooks/use-derived-stats';
import { useCharacterStore } from '@/stores/character-store';
import { SPELLS_BY_NAME } from '@/data/spells';
import { Spell } from '@/types/spell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpellPreparationProps {
  character: Character;
  stats: DerivedStats;
}

function PrepareSpellDialog({
  character,
  spellLevel,
  slotsRemaining,
  onPrepare,
}: {
  character: Character;
  spellLevel: number;
  slotsRemaining: number;
  onPrepare: (spellName: string) => void;
}) {
  const [open, setOpen] = useState(false);

  // Get spells known at this level
  const availableSpells = useMemo(() => {
    return character.spellsKnown
      .map((name) => SPELLS_BY_NAME[name])
      .filter((spell): spell is Spell => {
        if (!spell) return false;
        const level = spell.level[character.className];
        return level === spellLevel;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [character.spellsKnown, character.className, spellLevel]);

  if (slotsRemaining <= 0 || availableSpells.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
          Prepare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Prepare {spellLevel === 0 ? 'Cantrip' : `Level ${spellLevel} Spell`}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-1 pr-4">
            {availableSpells.map((spell) => (
              <div
                key={spell.name}
                className="flex items-center justify-between p-2 border rounded hover:bg-muted cursor-pointer"
                onClick={() => {
                  onPrepare(spell.name);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{spell.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {spell.school.slice(0, 4)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SpellPreparation({ character, stats }: SpellPreparationProps) {
  const store = useCharacterStore();

  // Group prepared spells by level - must be called before any early returns
  const preparedByLevel = useMemo(() => {
    const grouped: Record<number, { spell: Spell; count: number }[]> = {};
    for (const [levelStr, spellNames] of Object.entries(character.spellsPrepared)) {
      const level = parseInt(levelStr);
      const spellCounts = new Map<string, number>();
      for (const name of spellNames) {
        spellCounts.set(name, (spellCounts.get(name) || 0) + 1);
      }
      grouped[level] = Array.from(spellCounts.entries())
        .map(([name, count]) => {
          const spell = SPELLS_BY_NAME[name];
          return spell ? { spell, count } : null;
        })
        .filter((item): item is { spell: Spell; count: number } => item !== null)
        .sort((a, b) => a.spell.name.localeCompare(b.spell.name));
    }
    return grouped;
  }, [character.spellsPrepared]);

  // Calculate slots and prepared counts per level
  const slotInfo = useMemo(() => {
    const info: Record<number, { total: number; prepared: number }> = {};
    for (const [levelStr, slotData] of Object.entries(stats.spellState.spellSlots)) {
      const level = parseInt(levelStr);
      const prepared = character.spellsPrepared[level]?.length ?? 0;
      info[level] = { total: slotData.total, prepared };
    }
    return info;
  }, [stats.spellState.spellSlots, character.spellsPrepared]);

  if (!stats.spellState.canCast) {
    return null;
  }

  const handlePrepare = (spellLevel: number, spellName: string) => {
    store.prepareSpell(spellLevel, spellName);
  };

  const handleUnprepare = (spellLevel: number, spellName: string) => {
    store.unprepareSpell(spellLevel, spellName);
  };

  const handleClearAll = () => {
    if (confirm('Clear all prepared spells? This is typically done after a long rest to prepare new spells.')) {
      store.clearPreparedSpells();
    }
  };

  const hasPreparedSpells = Object.values(character.spellsPrepared).some(
    (spells) => spells.length > 0
  );

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Prepared Spells</CardTitle>
          <div className="flex items-center gap-2">
            {hasPreparedSpells && (
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          As a prepared caster, you must prepare spells each day from your spells known.
          The same spell can be prepared in multiple slots.
        </p>

        <div className="space-y-4">
          {Object.entries(slotInfo)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([levelStr, { total, prepared }]) => {
              const level = parseInt(levelStr);
              const remaining = total - prepared;
              const preparedSpells = preparedByLevel[level] || [];

              return (
                <div key={level} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {level === 0 ? 'Cantrips' : `Level ${level}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant={remaining > 0 ? 'secondary' : 'outline'}>
                        {prepared}/{total} prepared
                      </Badge>
                      <PrepareSpellDialog
                        character={character}
                        spellLevel={level}
                        slotsRemaining={remaining}
                        onPrepare={(name) => handlePrepare(level, name)}
                      />
                    </div>
                  </div>

                  {preparedSpells.length > 0 ? (
                    <div className="space-y-1">
                      {preparedSpells.map(({ spell, count }) => (
                        <div
                          key={spell.name}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span>{spell.name}</span>
                            {count > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                x{count}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleUnprepare(level, spell.name)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No spells prepared at this level
                    </p>
                  )}
                </div>
              );
            })}
        </div>

        {Object.keys(slotInfo).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No spell slots available yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
