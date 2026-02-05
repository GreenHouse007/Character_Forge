import { Character } from '@/types/character';

/**
 * Downloads a character as a JSON file
 */
export function downloadCharacterAsJSON(character: Character): void {
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // Sanitize filename: replace non-alphanumeric chars with underscores
  const safeName = character.name.replace(/[^a-z0-9]/gi, '_');
  link.download = `${safeName}_level${character.level}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
