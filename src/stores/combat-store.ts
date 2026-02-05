'use client';

import { create } from 'zustand';

interface CombatStore {
  activeToggles: string[];
  toggleCombatOption: (id: string) => void;
  clearToggles: () => void;
}

export const useCombatStore = create<CombatStore>()((set) => ({
  activeToggles: [],

  toggleCombatOption: (id) =>
    set((state) => ({
      activeToggles: state.activeToggles.includes(id)
        ? state.activeToggles.filter((t) => t !== id)
        : [...state.activeToggles, id],
    })),

  clearToggles: () => set({ activeToggles: [] }),
}));
