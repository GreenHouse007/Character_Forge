'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AbilityScores, AbilityScoreMethod, DEFAULT_ABILITY_SCORES } from '@/types/ability-scores';
import { RaceName } from '@/types/race';
import { ClassName } from '@/types/class';
import { AbilityScore } from '@/types/common';
import { CharacterSkill } from '@/types/skill';
import { EquipmentItem } from '@/types/equipment';

export interface CreationDraft {
  // Step 1: Race
  race: RaceName | null;
  racialAbilityChoice: AbilityScore | null;

  // Step 2: Class
  className: ClassName | null;

  // Step 3: Ability Scores
  abilityScoreMethod: AbilityScoreMethod;
  baseAbilityScores: AbilityScores;
  pointBuyBudget: number;
  standardArrayAssignment: Partial<Record<AbilityScore, number>>;

  // Step 4: Skills
  skills: CharacterSkill[];

  // Step 5: Feats
  featNames: string[];
  featParams: Record<string, string>;

  // Languages
  languages: string[];

  // Step 6: Equipment
  equipment: EquipmentItem[];
  gold: number;

  // Step 7: Review
  name: string;
  alignment: string;

  // Wizard state
  currentStep: number;
  editingCharacterId: string | null;
}

const defaultDraft: CreationDraft = {
  abilityScoreMethod: 'pointBuy',
  baseAbilityScores: { ...DEFAULT_ABILITY_SCORES },
  pointBuyBudget: 20,
  standardArrayAssignment: {},
  race: null,
  racialAbilityChoice: null,
  className: null,
  skills: [],
  featNames: [],
  featParams: {},
  languages: [],
  equipment: [],
  gold: 0,
  name: '',
  alignment: '',
  currentStep: 1,
  editingCharacterId: null,
};

interface CreationStore {
  draft: CreationDraft;

  // Actions
  setAbilityScoreMethod: (method: AbilityScoreMethod) => void;
  setBaseAbilityScores: (scores: AbilityScores) => void;
  setBaseAbilityScore: (ability: AbilityScore, value: number) => void;
  setPointBuyBudget: (budget: number) => void;
  setStandardArrayAssignment: (ability: AbilityScore, value: number | undefined) => void;
  setRace: (race: RaceName | null) => void;
  setRacialAbilityChoice: (ability: AbilityScore | null) => void;
  setClass: (className: ClassName | null) => void;
  setSkills: (skills: CharacterSkill[]) => void;
  setFeatNames: (feats: string[]) => void;
  toggleFeat: (featName: string) => void;
  setFeatParam: (featName: string, value: string) => void;
  setLanguages: (languages: string[]) => void;
  setEquipment: (equipment: EquipmentItem[]) => void;
  setGold: (gold: number) => void;
  setName: (name: string) => void;
  setAlignment: (alignment: string) => void;
  setCurrentStep: (step: number) => void;
  loadCharacterForEdit: (id: string, draft: Partial<CreationDraft>) => void;
  resetDraft: () => void;
}

export const useCreationStore = create<CreationStore>()(
  persist(
    (set) => ({
      draft: { ...defaultDraft },

      setAbilityScoreMethod: (method) =>
        set((state) => ({ draft: { ...state.draft, abilityScoreMethod: method } })),

      setBaseAbilityScores: (scores) =>
        set((state) => ({ draft: { ...state.draft, baseAbilityScores: scores } })),

      setBaseAbilityScore: (ability, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            baseAbilityScores: { ...state.draft.baseAbilityScores, [ability]: value },
          },
        })),

      setPointBuyBudget: (budget) =>
        set((state) => ({ draft: { ...state.draft, pointBuyBudget: budget } })),

      setStandardArrayAssignment: (ability, value) =>
        set((state) => {
          const assignment = { ...state.draft.standardArrayAssignment };
          if (value === undefined) {
            delete assignment[ability];
          } else {
            assignment[ability] = value;
          }
          const scores = {
            ...state.draft.baseAbilityScores,
            [ability]: value !== undefined ? value : DEFAULT_ABILITY_SCORES[ability],
          };
          return { draft: { ...state.draft, standardArrayAssignment: assignment, baseAbilityScores: scores } };
        }),

      setRace: (race) =>
        set((state) => ({ draft: { ...state.draft, race, racialAbilityChoice: null } })),

      setRacialAbilityChoice: (ability) =>
        set((state) => ({ draft: { ...state.draft, racialAbilityChoice: ability } })),

      setClass: (className) =>
        set((state) => ({ draft: { ...state.draft, className } })),

      setSkills: (skills) =>
        set((state) => ({ draft: { ...state.draft, skills } })),

      setFeatNames: (feats) =>
        set((state) => ({ draft: { ...state.draft, featNames: feats } })),

      toggleFeat: (featName) =>
        set((state) => {
          const current = state.draft.featNames;
          const next = current.includes(featName)
            ? current.filter((f) => f !== featName)
            : [...current, featName];
          // Clean up featParams if feat is removed
          const params = { ...state.draft.featParams };
          if (current.includes(featName)) delete params[featName];
          return { draft: { ...state.draft, featNames: next, featParams: params } };
        }),

      setFeatParam: (featName, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            featParams: { ...state.draft.featParams, [featName]: value },
          },
        })),

      setLanguages: (languages) =>
        set((state) => ({ draft: { ...state.draft, languages } })),

      setEquipment: (equipment) =>
        set((state) => ({ draft: { ...state.draft, equipment } })),

      setGold: (gold) =>
        set((state) => ({ draft: { ...state.draft, gold } })),

      setName: (name) =>
        set((state) => ({ draft: { ...state.draft, name } })),

      setAlignment: (alignment) =>
        set((state) => ({ draft: { ...state.draft, alignment } })),

      setCurrentStep: (step) =>
        set((state) => ({ draft: { ...state.draft, currentStep: step } })),

      loadCharacterForEdit: (id, draftData) =>
        set(() => ({
          draft: { ...defaultDraft, ...draftData, editingCharacterId: id, currentStep: 1 },
        })),

      resetDraft: () => set(() => ({ draft: { ...defaultDraft } })),
    }),
    {
      name: 'pf1e-creation-draft',
    }
  )
);
