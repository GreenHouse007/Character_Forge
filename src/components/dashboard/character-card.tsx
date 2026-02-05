'use client';

import Link from 'next/link';
import { CharacterSummary } from '@/types/character';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadCharacterAsJSON } from '@/lib/export';
import { localStorageAdapter } from '@/persistence/local-storage-adapter';

interface CharacterCardProps {
  character: CharacterSummary;
  onDelete: (id: string) => void;
}

export function CharacterCard({ character, onDelete }: CharacterCardProps) {
  return (
    <Card className="group hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{character.name}</CardTitle>
          <Badge variant="secondary">Lvl {character.level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-1">
          {character.race} {character.className}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Last updated: {new Date(character.updatedAt).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/characters/${character.id}`}>Open</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/characters/${character.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const fullCharacter = localStorageAdapter.getCharacter(character.id);
              if (fullCharacter) {
                downloadCharacterAsJSON(fullCharacter);
              }
            }}
          >
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm(`Delete ${character.name}?`)) {
                onDelete(character.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
