import { Feat } from '@/types/feat';
import { ALL_FEATS_DATA } from './all-feats.generated';

export const ALL_FEATS: Feat[] = ALL_FEATS_DATA;

// Create a lookup by name
export const FEATS_BY_NAME: Record<string, Feat> = {};
for (const feat of ALL_FEATS) {
  FEATS_BY_NAME[feat.name] = feat;
}

// Collect all unique categories from the data
export const ALL_CATEGORIES: string[] = Array.from(
  new Set(ALL_FEATS.flatMap((f) => f.categories))
).sort();

// Get feats for a specific category
export function getFeatsForCategory(category: string): Feat[] {
  return ALL_FEATS.filter((f) => f.categories.includes(category));
}
