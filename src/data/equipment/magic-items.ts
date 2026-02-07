import { MagicItem } from '@/types/equipment';
import data from './magic-items.generated.json';

export const ALL_MAGIC_ITEMS: MagicItem[] = data as unknown as MagicItem[];

export const MAGIC_ITEMS_BY_NAME: Record<string, MagicItem> = {};
for (const item of ALL_MAGIC_ITEMS) {
  MAGIC_ITEMS_BY_NAME[item.name] = item;
}

export const MAGIC_ITEM_GROUPS: string[] = [
  ...new Set(ALL_MAGIC_ITEMS.map((item) => item.group)),
].sort();
