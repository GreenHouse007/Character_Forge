'use client';

import { useEffect } from 'react';
import { useCharacterStore } from '@/stores/character-store';

export function useCharacters() {
  const characters = useCharacterStore((s) => s.characters);
  const loadCharacters = useCharacterStore((s) => s.loadCharacters);
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  return { characters, deleteCharacter, refresh: loadCharacters };
}
