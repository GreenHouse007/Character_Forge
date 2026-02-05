'use client';

import { CharacterSpellState } from '@/types/spells';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SpellSlotTrackerProps {
  spellState: CharacterSpellState;
  onUseSlot: (spellLevel: number) => void;
  onRestoreSlot: (spellLevel: number) => void;
}

export function SpellSlotTracker({ spellState, onUseSlot, onRestoreSlot }: SpellSlotTrackerProps) {
  const spellLevels = Object.entries(spellState.spellSlots)
    .map(([level, slots]) => ({ level: parseInt(level), ...slots }))
    .filter((s) => s.total > 0)
    .sort((a, b) => a.level - b.level);

  if (spellLevels.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Spell Slots
          {spellState.castingAbility && (
            <span className="text-xs text-muted-foreground font-normal ml-2">
              ({spellState.castingAbility.toUpperCase()}-based)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {spellLevels.map(({ level, total, used }) => {
            const remaining = total - used;
            return (
              <div key={level} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="text-sm font-medium">
                    {level === 0 ? 'Cantrips' : `Level ${level}`}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {remaining} / {total}
                  </span>
                </div>
                {level > 0 && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUseSlot(level)}
                      disabled={remaining <= 0}
                      className="text-xs h-7"
                    >
                      Cast
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRestoreSlot(level)}
                      disabled={used <= 0}
                      className="text-xs h-7"
                    >
                      Restore
                    </Button>
                  </div>
                )}
                {level === 0 && (
                  <span className="text-xs text-muted-foreground">At will</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
