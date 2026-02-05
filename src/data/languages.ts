export const COMMON_LANGUAGES = [
  'Common',
  'Dwarven',
  'Elven',
  'Giant',
  'Gnome',
  'Goblin',
  'Halfling',
  'Orc',
] as const;

export const UNCOMMON_LANGUAGES = [
  'Abyssal',
  'Aklo',
  'Aquan',
  'Auran',
  'Celestial',
  'Draconic',
  'Gnoll',
  'Ignan',
  'Infernal',
  'Necril',
  'Shadowtongue',
  'Sylvan',
  'Terran',
  'Undercommon',
] as const;

export const ALL_LANGUAGES = [...COMMON_LANGUAGES, ...UNCOMMON_LANGUAGES] as const;

export type Language = typeof ALL_LANGUAGES[number];
