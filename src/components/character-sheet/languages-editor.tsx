'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ALL_LANGUAGES } from '@/data/languages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguagesEditorProps {
  languages: string[];
  bonusLanguages: string[];
  intModifier: number;
  onAddLanguage: (language: string) => void;
  onRemoveLanguage: (language: string) => void;
}

export function LanguagesEditor({
  languages,
  bonusLanguages,
  intModifier,
  onAddLanguage,
  onRemoveLanguage,
}: LanguagesEditorProps) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Calculate available bonus language slots based on INT modifier
  const maxBonusLanguages = Math.max(0, intModifier);
  // Count how many bonus languages have been used (languages not in starting list)
  const startingLanguageCount = 1; // Usually 'Common' or racial language
  const bonusLanguagesUsed = Math.max(0, languages.length - startingLanguageCount);
  const slotsRemaining = Math.max(0, maxBonusLanguages - bonusLanguagesUsed);

  // Available languages to add (not already known)
  const availableLanguages = ALL_LANGUAGES.filter(
    (lang) => !languages.includes(lang)
  );

  // Prioritize bonus languages from race
  const prioritizedLanguages = [
    ...bonusLanguages.filter((l) => (availableLanguages as readonly string[]).includes(l)),
    ...availableLanguages.filter((l) => !bonusLanguages.includes(l)),
  ];

  const handleAdd = () => {
    if (selectedLanguage) {
      onAddLanguage(selectedLanguage);
      setSelectedLanguage('');
    }
  };

  return (
    <div className="mt-3 pt-3 border-t">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-muted-foreground font-medium">Languages</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Languages</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Bonus language slots (INT {intModifier >= 0 ? '+' : ''}{intModifier}): {slotsRemaining} remaining
              </div>

              {/* Current languages */}
              <div>
                <div className="text-sm font-medium mb-2">Known Languages</div>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                      {lang}
                      <button
                        type="button"
                        onClick={() => onRemoveLanguage(lang)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {languages.length === 0 && (
                    <span className="text-sm text-muted-foreground">No languages known</span>
                  )}
                </div>
              </div>

              {/* Add new language */}
              <div>
                <div className="text-sm font-medium mb-2">Add Language</div>
                <div className="flex gap-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a language..." />
                    </SelectTrigger>
                    <SelectContent>
                      {prioritizedLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                          {bonusLanguages.includes(lang) && (
                            <span className="text-muted-foreground ml-2">(racial)</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAdd} disabled={!selectedLanguage}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-sm">
        {languages.length > 0 ? languages.join(', ') : 'None'}
      </div>
    </div>
  );
}
