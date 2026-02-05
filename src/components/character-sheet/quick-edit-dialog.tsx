'use client';

import { useState } from 'react';
import { Character } from '@/types/character';
import { ALIGNMENTS, Alignment } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface QuickEditDialogProps {
  character: Character;
  onSave: (updates: Partial<Character>) => void;
}

export function QuickEditDialog({ character, onSave }: QuickEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(character.name);
  const [playerName, setPlayerName] = useState(character.playerName ?? '');
  const [alignment, setAlignment] = useState<Alignment | ''>(character.alignment ?? '');
  const [deity, setDeity] = useState(character.deity ?? '');
  const [experience, setExperience] = useState(character.experience);
  const [maxHPOverride, setMaxHPOverride] = useState<number | ''>(character.maxHPOverride ?? '');
  const [notes, setNotes] = useState(character.notes);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset form when dialog opens
      setName(character.name);
      setPlayerName(character.playerName ?? '');
      setAlignment(character.alignment ?? '');
      setDeity(character.deity ?? '');
      setExperience(character.experience);
      setMaxHPOverride(character.maxHPOverride ?? '');
      setNotes(character.notes);
    }
    setOpen(isOpen);
  };

  const handleSave = () => {
    const updates: Partial<Character> = {
      name: name.trim() || character.name,
      playerName: playerName.trim() || undefined,
      alignment: alignment || undefined,
      deity: deity.trim() || undefined,
      experience,
      maxHPOverride: maxHPOverride === '' ? undefined : maxHPOverride,
      notes,
    };
    onSave(updates);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Edit Character</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Character Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="alignment">Alignment</Label>
              <Select value={alignment} onValueChange={(v) => setAlignment(v as Alignment)}>
                <SelectTrigger id="alignment">
                  <SelectValue placeholder="Select alignment..." />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENTS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deity">Deity</Label>
              <Input
                id="deity"
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Experience Points</Label>
              <Input
                id="experience"
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="maxHPOverride">Max HP Override</Label>
              <Input
                id="maxHPOverride"
                type="number"
                min={1}
                value={maxHPOverride}
                onChange={(e) => setMaxHPOverride(e.target.value === '' ? '' : parseInt(e.target.value) || 1)}
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes, reminders, backstory..."
              className="min-h-[100px]"
            />
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
