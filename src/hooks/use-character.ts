'use client';

import { useEffect } from 'react';
import { useCharacterStore } from '@/stores/character-store';

export function useCharacter(id: string) {
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const loadCharacter = useCharacterStore((s) => s.loadCharacter);

  useEffect(() => {
    if (id) {
      loadCharacter(id);
    }
  }, [id, loadCharacter]);

  return activeCharacter;
}
