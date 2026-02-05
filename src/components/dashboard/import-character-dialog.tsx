'use client';

import { useState, useRef } from 'react';
import { Character } from '@/types/character';
import { parseCharacterFile } from '@/lib/import';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ImportCharacterDialogProps {
  onImport: (character: Character) => void;
}

export function ImportCharacterDialog({ onImport }: ImportCharacterDialogProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<Character | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await parseCharacterFile(file);

    if (result.valid && result.character) {
      setErrors([]);
      setPreview(result.character);
    } else {
      setErrors(result.errors);
      setPreview(null);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      setOpen(false);
      setPreview(null);
      setErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setPreview(null);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => v ? setOpen(true) : handleClose()}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Character</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Character</DialogTitle>
          <DialogDescription>
            Upload a character JSON file to import. A new ID will be generated to avoid conflicts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90
              cursor-pointer"
          />

          {errors.length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="font-medium text-sm text-destructive mb-2">Validation Errors:</p>
              <ul className="list-disc list-inside text-sm text-destructive space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {preview && (
            <div className="p-4 border rounded-md space-y-2">
              <p className="font-medium">Preview:</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{preview.name}</span>
                <Badge variant="secondary">Lvl {preview.level}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {preview.race} {preview.className}
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Ability Scores: STR {preview.baseAbilityScores.str}, DEX {preview.baseAbilityScores.dex}, CON {preview.baseAbilityScores.con}, INT {preview.baseAbilityScores.int}, WIS {preview.baseAbilityScores.wis}, CHA {preview.baseAbilityScores.cha}</p>
                <p>Feats: {preview.featNames.length > 0 ? preview.featNames.join(', ') : 'None'}</p>
                <p>Spells Known: {preview.spellsKnown.length}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!preview}>
            Import Character
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
