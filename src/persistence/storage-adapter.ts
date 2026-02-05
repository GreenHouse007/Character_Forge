import { Character, CharacterSummary } from '@/types/character';

export interface StorageAdapter {
  getAllCharacters(): CharacterSummary[];
  getCharacter(id: string): Character | null;
  saveCharacter(character: Character): void;
  deleteCharacter(id: string): void;
  exportCharacter(id: string): string | null;
  importCharacter(json: string): Character | null;
}
