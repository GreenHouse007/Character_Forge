import { Character, CharacterSummary } from '@/types/character';
import { StorageAdapter } from './storage-adapter';

const CHARACTERS_KEY = 'pf1e-characters';

function getStore(): Record<string, Character> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(store: Record<string, Character>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save characters:', e);
  }
}

export const localStorageAdapter: StorageAdapter = {
  getAllCharacters(): CharacterSummary[] {
    const store = getStore();
    return Object.values(store)
      .map(({ id, name, race, className, level, updatedAt }) => ({
        id, name, race, className, level, updatedAt,
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  getCharacter(id: string): Character | null {
    const store = getStore();
    const character = store[id] ?? null;
    if (character) {
      let migrated = false;
      // v1 -> v2: add levelHistory and featParams
      if (!character.version || character.version < 2) {
        character.levelHistory = character.levelHistory ?? [];
        character.featParams = character.featParams ?? {};
        character.version = 2;
        migrated = true;
      }
      if (migrated) {
        store[id] = character;
        setStore(store);
      }
    }
    return character;
  },

  saveCharacter(character: Character): void {
    const store = getStore();
    store[character.id] = { ...character, updatedAt: new Date().toISOString() };
    setStore(store);
  },

  deleteCharacter(id: string): void {
    const store = getStore();
    delete store[id];
    setStore(store);
  },

  exportCharacter(id: string): string | null {
    const character = this.getCharacter(id);
    return character ? JSON.stringify(character, null, 2) : null;
  },

  importCharacter(json: string): Character | null {
    try {
      const character = JSON.parse(json) as Character;
      if (!character.id || !character.name) return null;
      this.saveCharacter(character);
      return character;
    } catch {
      return null;
    }
  },
};
