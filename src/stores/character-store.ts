'use client';

import { create } from 'zustand';
import { Character, CharacterSummary, CHARACTER_VERSION, LevelUpRecord } from '@/types/character';
import { Condition } from '@/types/combat';
import { EquipmentItem } from '@/types/equipment';
import { applyLevelUp } from '@/lib/level-up';
import { localStorageAdapter } from '@/persistence/local-storage-adapter';
import { v4 as uuidv4 } from 'uuid';

interface CharacterStore {
  characters: CharacterSummary[];
  activeCharacter: Character | null;

  // CRUD
  loadCharacters: () => void;
  loadCharacter: (id: string) => void;
  saveCharacter: (character: Character) => void;
  createCharacter: (data: Omit<Character, 'id' | 'version' | 'createdAt' | 'updatedAt'>) => string;
  deleteCharacter: (id: string) => void;

  // Tracker actions
  dealDamage: (amount: number) => void;
  healDamage: (amount: number) => void;
  setTempHP: (amount: number) => void;
  dealNonlethalDamage: (amount: number) => void;
  toggleCondition: (condition: Condition) => void;
  useSpellSlot: (spellLevel: number) => void;
  restoreSpellSlot: (spellLevel: number) => void;
  useClassResource: (resourceName: string) => void;
  restoreClassResource: (resourceName: string) => void;
  rest: () => void;
  setNotes: (notes: string) => void;
  updateCharacterField: <K extends keyof Character>(field: K, value: Character[K]) => void;
  levelUp: (record: LevelUpRecord) => void;

  // Inventory management
  addInventoryItem: (item: EquipmentItem) => void;
  craftItem: (item: EquipmentItem, materialCost: number) => void;
  removeInventoryItem: (index: number) => void;
  toggleEquipped: (index: number) => void;
  setGold: (gold: number) => void;

  // Spell management
  learnSpell: (spellName: string) => void;
  forgetSpell: (spellName: string) => void;
  prepareSpell: (spellLevel: number, spellName: string) => void;
  unprepareSpell: (spellLevel: number, spellName: string) => void;
  clearPreparedSpells: () => void;

  // Language management
  addLanguage: (language: string) => void;
  removeLanguage: (language: string) => void;

  // Combat toggle persistence
  setCombatToggles: (toggles: string[]) => void;
}

export const useCharacterStore = create<CharacterStore>()((set, get) => ({
  characters: [],
  activeCharacter: null,

  loadCharacters: () => {
    const characters = localStorageAdapter.getAllCharacters();
    set({ characters });
  },

  loadCharacter: (id) => {
    const character = localStorageAdapter.getCharacter(id);
    set({ activeCharacter: character });
  },

  saveCharacter: (character) => {
    localStorageAdapter.saveCharacter(character);
    set({ activeCharacter: character });
    // Refresh the list
    const characters = localStorageAdapter.getAllCharacters();
    set({ characters });
  },

  createCharacter: (data) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    const character: Character = {
      ...data,
      id,
      version: CHARACTER_VERSION,
      createdAt: now,
      updatedAt: now,
    };
    localStorageAdapter.saveCharacter(character);
    const characters = localStorageAdapter.getAllCharacters();
    set({ characters });
    return id;
  },

  deleteCharacter: (id) => {
    localStorageAdapter.deleteCharacter(id);
    const characters = localStorageAdapter.getAllCharacters();
    set((state) => ({
      characters,
      activeCharacter: state.activeCharacter?.id === id ? null : state.activeCharacter,
    }));
  },

  dealDamage: (amount) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    let remaining = amount;
    let tempHP = activeCharacter.tempHP;
    let currentHP = activeCharacter.currentHP;

    // Temp HP absorbs damage first
    if (tempHP > 0) {
      const absorbed = Math.min(tempHP, remaining);
      tempHP -= absorbed;
      remaining -= absorbed;
    }
    currentHP -= remaining;

    const updated = { ...activeCharacter, currentHP, tempHP };
    get().saveCharacter(updated);
  },

  healDamage: (amount) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    // Don't heal above max HP (maxHPOverride or we'll need calculated max)
    const updated = {
      ...activeCharacter,
      currentHP: activeCharacter.currentHP + amount,
    };
    get().saveCharacter(updated);
  },

  setTempHP: (amount) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    // Temp HP doesn't stack - take highest
    const updated = {
      ...activeCharacter,
      tempHP: Math.max(activeCharacter.tempHP, amount),
    };
    get().saveCharacter(updated);
  },

  dealNonlethalDamage: (amount) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = {
      ...activeCharacter,
      nonlethalDamage: activeCharacter.nonlethalDamage + amount,
    };
    get().saveCharacter(updated);
  },

  toggleCondition: (condition) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const conditions = activeCharacter.conditions.includes(condition)
      ? activeCharacter.conditions.filter((c) => c !== condition)
      : [...activeCharacter.conditions, condition];

    const updated = { ...activeCharacter, conditions };
    get().saveCharacter(updated);
  },

  useSpellSlot: (spellLevel) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const used = { ...activeCharacter.spellSlotsUsed };
    used[spellLevel] = (used[spellLevel] ?? 0) + 1;

    const updated = { ...activeCharacter, spellSlotsUsed: used };
    get().saveCharacter(updated);
  },

  restoreSpellSlot: (spellLevel) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const used = { ...activeCharacter.spellSlotsUsed };
    used[spellLevel] = Math.max(0, (used[spellLevel] ?? 0) - 1);

    const updated = { ...activeCharacter, spellSlotsUsed: used };
    get().saveCharacter(updated);
  },

  useClassResource: (resourceName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const used = { ...activeCharacter.classResourcesUsed };
    used[resourceName] = (used[resourceName] ?? 0) + 1;

    const updated = { ...activeCharacter, classResourcesUsed: used };
    get().saveCharacter(updated);
  },

  restoreClassResource: (resourceName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const used = { ...activeCharacter.classResourcesUsed };
    used[resourceName] = Math.max(0, (used[resourceName] ?? 0) - 1);

    const updated = { ...activeCharacter, classResourcesUsed: used };
    get().saveCharacter(updated);
  },

  rest: () => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = {
      ...activeCharacter,
      spellSlotsUsed: {},
      classResourcesUsed: {},
      nonlethalDamage: 0,
      conditions: activeCharacter.conditions.filter(
        (c) => !['fatigued', 'shaken', 'sickened', 'dazzled'].includes(c)
      ),
    };
    get().saveCharacter(updated);
  },

  setNotes: (notes) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = { ...activeCharacter, notes };
    get().saveCharacter(updated);
  },

  updateCharacterField: (field, value) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = { ...activeCharacter, [field]: value };
    get().saveCharacter(updated);
  },

  levelUp: (record) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = applyLevelUp(activeCharacter, record);
    get().saveCharacter(updated);
  },

  addInventoryItem: (item) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const cost = item.item.cost ?? 0;
    if (cost > activeCharacter.inventory.gold) return;

    const equipment = [...activeCharacter.inventory.equipment];

    // Enhanced/material weapons are always unique entries (don't stack)
    const isEnhancedWeapon = item.type === 'weapon' &&
      (item.masterwork || (item.enhancementBonus && item.enhancementBonus > 0) ||
       (item.material && item.material !== 'standard') ||
       (item.specialAbilities && item.specialAbilities.length > 0));

    // Enhanced/material armor are always unique entries (don't stack)
    const isEnhancedArmor = item.type === 'armor' &&
      ((item.enhancementBonus && item.enhancementBonus > 0) ||
       (item.material && item.material !== 'standard') ||
       (item.specialAbilities && item.specialAbilities.length > 0) ||
       item.quality === 'masterwork');

    const isUnique = isEnhancedWeapon || isEnhancedArmor;

    const existing = isUnique ? -1 : equipment.findIndex(
      (e) => e.type === item.type && e.item.name === item.item.name
    );

    if (existing >= 0) {
      equipment[existing] = { ...equipment[existing], quantity: equipment[existing].quantity + 1 };
    } else {
      // Auto-equip weapons, armor, wondrous, and magic items when added
      const shouldEquip = item.type === 'weapon' || item.type === 'armor' || item.type === 'wondrous' || item.type === 'magic';
      equipment.push({ ...item, equipped: shouldEquip });
    }

    const updated = {
      ...activeCharacter,
      inventory: {
        ...activeCharacter.inventory,
        equipment,
        gold: Math.round((activeCharacter.inventory.gold - cost) * 100) / 100,
      },
    };
    get().saveCharacter(updated);
  },

  craftItem: (item, materialCost) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    if (materialCost > activeCharacter.inventory.gold) return;

    const equipment = [...activeCharacter.inventory.equipment];
    const existing = equipment.findIndex(
      (e) => e.type === item.type && e.item.name === item.item.name
    );

    if (existing >= 0) {
      equipment[existing] = { ...equipment[existing], quantity: equipment[existing].quantity + item.quantity };
    } else {
      equipment.push({ ...item });
    }

    const updated = {
      ...activeCharacter,
      inventory: {
        ...activeCharacter.inventory,
        equipment,
        gold: Math.round((activeCharacter.inventory.gold - materialCost) * 100) / 100,
      },
    };
    get().saveCharacter(updated);
  },

  removeInventoryItem: (index) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const equipment = [...activeCharacter.inventory.equipment];
    if (index < 0 || index >= equipment.length) return;

    if (equipment[index].quantity > 1) {
      equipment[index] = { ...equipment[index], quantity: equipment[index].quantity - 1 };
    } else {
      equipment.splice(index, 1);
    }

    const updated = {
      ...activeCharacter,
      inventory: { ...activeCharacter.inventory, equipment },
    };
    get().saveCharacter(updated);
  },

  toggleEquipped: (index) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const equipment = [...activeCharacter.inventory.equipment];
    if (index < 0 || index >= equipment.length) return;

    const item = equipment[index];
    const newEquipped = !item.equipped;

    // For armor/shields: only one of each can be equipped
    if (newEquipped && item.type === 'armor') {
      const isShield = item.item.category === 'Shield';
      // Unequip any other armor/shield of the same type
      equipment.forEach((e, i) => {
        if (i !== index && e.type === 'armor') {
          const eIsShield = e.item.category === 'Shield';
          if (isShield === eIsShield && e.equipped) {
            equipment[i] = { ...e, equipped: false };
          }
        }
      });
    }

    // For wondrous items: only one per slot can be equipped (except 'none')
    if (newEquipped && item.type === 'wondrous' && item.item.slot !== 'none') {
      equipment.forEach((e, i) => {
        if (i !== index && e.type === 'wondrous' && e.item.slot === item.item.slot && e.equipped) {
          equipment[i] = { ...e, equipped: false };
        }
      });
    }

    // For magic items: only one per slot can be equipped (except 'none')
    if (newEquipped && item.type === 'magic' && item.item.slot !== 'none') {
      equipment.forEach((e, i) => {
        if (i !== index && e.type === 'magic' && e.item.slot === item.item.slot && e.equipped) {
          equipment[i] = { ...e, equipped: false };
        }
      });
    }

    equipment[index] = { ...item, equipped: newEquipped };

    const updated = {
      ...activeCharacter,
      inventory: { ...activeCharacter.inventory, equipment },
    };
    get().saveCharacter(updated);
  },

  setGold: (gold) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = {
      ...activeCharacter,
      inventory: { ...activeCharacter.inventory, gold },
    };
    get().saveCharacter(updated);
  },

  learnSpell: (spellName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    if (activeCharacter.spellsKnown.includes(spellName)) return;

    const updated = {
      ...activeCharacter,
      spellsKnown: [...activeCharacter.spellsKnown, spellName],
    };
    get().saveCharacter(updated);
  },

  forgetSpell: (spellName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = {
      ...activeCharacter,
      spellsKnown: activeCharacter.spellsKnown.filter((s) => s !== spellName),
      // Also remove from prepared if it was prepared
      spellsPrepared: Object.fromEntries(
        Object.entries(activeCharacter.spellsPrepared).map(([level, spells]) => [
          level,
          spells.filter((s) => s !== spellName),
        ])
      ),
    };
    get().saveCharacter(updated);
  },

  prepareSpell: (spellLevel, spellName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const prepared = { ...activeCharacter.spellsPrepared };
    const current = prepared[spellLevel] ?? [];
    prepared[spellLevel] = [...current, spellName];

    const updated = { ...activeCharacter, spellsPrepared: prepared };
    get().saveCharacter(updated);
  },

  unprepareSpell: (spellLevel, spellName) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const prepared = { ...activeCharacter.spellsPrepared };
    const current = prepared[spellLevel] ?? [];
    // Remove only the first occurrence (in case same spell prepared multiple times)
    const index = current.indexOf(spellName);
    if (index >= 0) {
      prepared[spellLevel] = [...current.slice(0, index), ...current.slice(index + 1)];
    }

    const updated = { ...activeCharacter, spellsPrepared: prepared };
    get().saveCharacter(updated);
  },

  clearPreparedSpells: () => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = { ...activeCharacter, spellsPrepared: {} };
    get().saveCharacter(updated);
  },

  addLanguage: (language) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    if (activeCharacter.languages.includes(language)) return;

    const updated = {
      ...activeCharacter,
      languages: [...activeCharacter.languages, language],
    };
    get().saveCharacter(updated);
  },

  removeLanguage: (language) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;

    const updated = {
      ...activeCharacter,
      languages: activeCharacter.languages.filter((l) => l !== language),
    };
    get().saveCharacter(updated);
  },

  setCombatToggles: (toggles) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    get().saveCharacter({ ...activeCharacter, combatToggles: toggles });
  },
}));
