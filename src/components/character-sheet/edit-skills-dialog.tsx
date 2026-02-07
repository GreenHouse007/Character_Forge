'use client';

import { useState } from 'react';
import { Character } from '@/types/character';
import { CharacterSkill } from '@/types/skill';
import { SkillName } from '@/types/common';
import { CharacterClass } from '@/types/class';
import { SKILLS } from '@/data/skills';
import { calculateSkillRanksPerLevel } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditSkillsDialogProps {
  character: Character;
  cls: CharacterClass;
  intModifier: number;
  isHuman: boolean;
  onSave: (updates: Partial<Character>) => void;
}

interface SkillState {
  ranks: number;
  miscModifier: number;
}

export function EditSkillsDialog({
  character,
  cls,
  intModifier,
  isHuman,
  onSave,
}: EditSkillsDialogProps) {
  const [open, setOpen] = useState(false);
  const [skillMap, setSkillMap] = useState<Map<SkillName, SkillState>>(new Map());

  const ranksPerLevel = calculateSkillRanksPerLevel(cls.skillRanksPerLevel, intModifier, isHuman);
  const totalAvailable = character.level * ranksPerLevel;
  const maxRanksPerSkill = character.level;

  const initSkillMap = () => {
    const map = new Map<SkillName, SkillState>();
    for (const skill of character.skills) {
      map.set(skill.name, { ranks: skill.ranks, miscModifier: skill.miscModifier });
    }
    return map;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSkillMap(initSkillMap());
    }
    setOpen(isOpen);
  };

  const totalAllocated = Array.from(skillMap.values()).reduce((sum, s) => sum + s.ranks, 0);

  const getState = (name: SkillName): SkillState => skillMap.get(name) ?? { ranks: 0, miscModifier: 0 };

  const updateSkill = (name: SkillName, update: Partial<SkillState>) => {
    setSkillMap((prev) => {
      const next = new Map(prev);
      const current = next.get(name) ?? { ranks: 0, miscModifier: 0 };
      next.set(name, { ...current, ...update });
      return next;
    });
  };

  const handleSave = () => {
    const skills: CharacterSkill[] = [];
    for (const skillDef of SKILLS) {
      const state = skillMap.get(skillDef.name);
      if (state && (state.ranks > 0 || state.miscModifier !== 0)) {
        skills.push({
          name: skillDef.name,
          ranks: state.ranks,
          isClassSkill: cls.classSkills.includes(skillDef.name),
          miscModifier: state.miscModifier,
        });
      }
    }
    onSave({ skills });
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
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>
              Ranks:{' '}
              <span className={totalAllocated > totalAvailable ? 'text-destructive font-bold' : totalAllocated === totalAvailable ? 'text-green-600 font-bold' : 'font-bold'}>
                {totalAllocated}
              </span>
              {' / '}
              <span className="font-medium">{totalAvailable}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              Max ranks/skill: {maxRanksPerSkill}
            </span>
          </div>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {SKILLS.map((skillDef) => {
              const state = getState(skillDef.name);
              const isClassSkill = cls.classSkills.includes(skillDef.name);

              return (
                <div
                  key={skillDef.name}
                  className={`flex items-center justify-between text-sm p-1.5 border rounded ${
                    state.ranks > 0 ? '' : 'opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="truncate text-xs">{skillDef.name}</span>
                    {isClassSkill && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">C</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => updateSkill(skillDef.name, { ranks: Math.max(0, state.ranks - 1) })}
                      disabled={state.ranks <= 0}
                    >
                      -
                    </Button>
                    <span className="w-6 text-center text-xs font-bold">{state.ranks}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => updateSkill(skillDef.name, { ranks: Math.min(maxRanksPerSkill, state.ranks + 1) })}
                      disabled={state.ranks >= maxRanksPerSkill}
                    >
                      +
                    </Button>
                    <Input
                      type="number"
                      value={state.miscModifier}
                      onChange={(e) => updateSkill(skillDef.name, { miscModifier: parseInt(e.target.value) || 0 })}
                      className="w-12 h-6 text-xs text-center"
                      title="Misc modifier"
                    />
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
