/* =========================
 * Common Languages
 * ========================= */

export const COMMON_LANGUAGES = [
  "Common",
  "Dwarven",
  "Elven",
  "Giant",
  "Gnome",
  "Goblin",
  "Halfling",
  "Orc",
] as const;

/* =========================
 * Elemental & Planar
 * ========================= */

export const PLANAR_LANGUAGES = [
  "Abyssal",
  "Celestial",
  "Infernal",
  "Protean",
  "Necril",
  "Shadowtongue",
] as const;

export const ELEMENTAL_LANGUAGES = [
  "Aquan",
  "Auran",
  "Ignan",
  "Terran",
] as const;

/* =========================
 * Fey, Nature, & Ancient
 * ========================= */

export const FEY_AND_ANCIENT_LANGUAGES = [
  "Aklo",
  "Sylvan",
  "Treant",
  "Sphinx",
] as const;

/* =========================
 * Underdark & Dark Folk
 * ========================= */

export const UNDERDARK_LANGUAGES = [
  "Undercommon",
  "Drow Sign Language",
  "Dark Folk",
] as const;

/* =========================
 * Draconic & Scaled
 * ========================= */

export const DRACONIC_LANGUAGES = ["Draconic", "Kobold", "Nagaji"] as const;

/* =========================
 * Monstrous Humanoids
 * ========================= */

export const MONSTROUS_LANGUAGES = [
  "Gnoll",
  "Grippli",
  "Sahuagin",
  "Skum",
  "Troglodyte",
  "Tengu",
  "Cyclops",
  "Yeti",
  "Vegepygmy",
] as const;

/* =========================
 * Regional / Cultural (Golarion)
 * ========================= */

export const REGIONAL_LANGUAGES = ["Shoanti", "Skald"] as const;

/* =========================
 * Aggregated Lists
 * ========================= */

export const UNCOMMON_LANGUAGES = [
  ...PLANAR_LANGUAGES,
  ...ELEMENTAL_LANGUAGES,
  ...FEY_AND_ANCIENT_LANGUAGES,
  ...UNDERDARK_LANGUAGES,
  ...DRACONIC_LANGUAGES,
  ...MONSTROUS_LANGUAGES,
  ...REGIONAL_LANGUAGES,
] as const;

export const ALL_LANGUAGES = [
  ...COMMON_LANGUAGES,
  ...UNCOMMON_LANGUAGES,
] as const;

/* =========================
 * Language Type
 * ========================= */

export type Language = (typeof ALL_LANGUAGES)[number];
