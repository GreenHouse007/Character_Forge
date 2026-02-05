'use client';

import { useRouter } from 'next/navigation';
import { useCharacters } from '@/hooks/use-characters';
import { useCharacterStore } from '@/stores/character-store';
import { useCreationStore } from '@/stores/creation-store';
import { CharacterCard } from '@/components/dashboard/character-card';
import { ImportCharacterDialog } from '@/components/dashboard/import-character-dialog';
import { Button } from '@/components/ui/button';
import { Character } from '@/types/character';

export default function DashboardPage() {
  const router = useRouter();
  const { characters, deleteCharacter } = useCharacters();
  const store = useCharacterStore();
  const resetDraft = useCreationStore((s) => s.resetDraft);

  const handleNewCharacter = () => {
    resetDraft();
    router.push('/create/race');
  };

  const handleImport = (character: Character) => {
    store.saveCharacter(character);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Characters</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {characters.length === 0
              ? 'No characters yet. Create one to get started!'
              : `${characters.length} character${characters.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          <ImportCharacterDialog onImport={handleImport} />
          <Button onClick={handleNewCharacter}>New Character</Button>
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4 opacity-20">&#9876;</div>
          <h2 className="text-xl font-semibold mb-2">No Adventurers Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first Pathfinder character to begin tracking ability scores,
            combat stats, skills, feats, and more.
          </p>
          <Button size="lg" onClick={handleNewCharacter}>
            Create Your First Character
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={deleteCharacter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
