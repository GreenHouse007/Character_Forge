'use client';

import { useState } from 'react';
import { Character } from '@/types/character';
import { AbilityScores } from '@/types/ability-scores';
import { ABILITY_SCORES, ABILITY_SCORE_SHORT, AbilityScore } from '@/types/common';
import { RacialAbilityModifier } from '@/types/race';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditAbilityScoresDialogProps {
  character: Character;
  racialModifiers: RacialAbilityModifier[];
  racialAbilityChoice?: AbilityScore;
  onSave: (updates: Partial<Character>) => void;
}

export function EditAbilityScoresDialog({
  character,
  racialModifiers,
  racialAbilityChoice,
  onSave,
}: EditAbilityScoresDialogProps) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<AbilityScores>({ ...character.baseAbilityScores });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setScores({ ...character.baseAbilityScores });
    }
    setOpen(isOpen);
  };

  const getRacialMod = (ability: AbilityScore): number => {
    // Check fixed racial modifiers
    const fixed = racialModifiers.find((m) => m.ability === ability);
    if (fixed) return fixed.modifier;
    // Check flexible ability choice (Human, Half-Elf, Half-Orc)
    if (racialAbilityChoice === ability) return 2;
    return 0;
  };

  const handleScoreChange = (ability: AbilityScore, value: string) => {
    const num = parseInt(value);
    if (isNaN(num)) return;
    setScores((prev) => ({ ...prev, [ability]: Math.max(1, Math.min(45, num)) }));
  };

  const handleSave = () => {
    onSave({ baseAbilityScores: scores, abilityScoreMethod: 'manual' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Ability Scores</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {ABILITY_SCORES.map((ability) => {
              const racialMod = getRacialMod(ability);
              const final = scores[ability] + racialMod;
              return (
                <div key={ability} className="text-center p-2 border rounded">
                  <div className="text-xs font-medium text-muted-foreground uppercase mb-1">
                    {ABILITY_SCORE_SHORT[ability]}
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={45}
                    value={scores[ability]}
                    onChange={(e) => handleScoreChange(ability, e.target.value)}
                    className="w-full h-8 text-center text-sm"
                  />
                  {racialMod !== 0 && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {racialMod > 0 ? '+' : ''}{racialMod} racial
                    </div>
                  )}
                  <div className="text-xs font-medium mt-1">
                    Final: {final}
                  </div>
                </div>
              );
            })}
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
