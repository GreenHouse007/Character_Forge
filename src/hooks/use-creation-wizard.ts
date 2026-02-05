'use client';

import { useRouter } from 'next/navigation';
import { useCreationStore } from '@/stores/creation-store';
import { useCharacterStore } from '@/stores/character-store';
import { Character, createDefaultCharacter } from '@/types/character';
import { Alignment } from '@/types/common';
import { races } from '@/data/races';

const WIZARD_STEPS = [
  { number: 1, name: 'Race', path: '/create/race' },
  { number: 2, name: 'Class', path: '/create/class' },
  { number: 3, name: 'Ability Scores', path: '/create/ability-scores' },
  { number: 4, name: 'Skills', path: '/create/skills' },
  { number: 5, name: 'Feats', path: '/create/feats' },
  { number: 6, name: 'Equipment', path: '/create/equipment' },
  { number: 7, name: 'Review', path: '/create/review' },
];

export function useCreationWizard() {
  const router = useRouter();
  const draft = useCreationStore((s) => s.draft);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const resetDraft = useCreationStore((s) => s.resetDraft);
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const saveCharacter = useCharacterStore((s) => s.saveCharacter);
  const loadCharacter = useCharacterStore((s) => s.loadCharacter);

  const currentStepInfo = WIZARD_STEPS.find((s) => s.number === draft.currentStep) ?? WIZARD_STEPS[0];

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
      router.push(WIZARD_STEPS[step - 1].path);
    }
  };

  const nextStep = () => {
    if (draft.currentStep < 7) {
      goToStep(draft.currentStep + 1);
    }
  };

  const prevStep = () => {
    if (draft.currentStep > 1) {
      goToStep(draft.currentStep - 1);
    }
  };

  const canProceed = (): boolean => {
    switch (draft.currentStep) {
      case 1: return draft.race !== null;
      case 2: return draft.className !== null;
      case 3: return true; // ability scores always valid with defaults
      case 4: return true;
      case 5: return true;
      case 6: return true;
      case 7: return draft.name.trim().length > 0;
      default: return false;
    }
  };

  const finalize = (): string | null => {
    if (!draft.race || !draft.className || !draft.name.trim()) return null;

    const defaults = createDefaultCharacter();
    const race = races[draft.race];
    // Use draft languages if set, otherwise use racial default languages
    const languages = draft.languages.length > 0 ? draft.languages : (race?.languages ?? []);

    if (draft.editingCharacterId) {
      // Update existing character
      const existing = useCharacterStore.getState().activeCharacter;
      if (!existing) {
        loadCharacter(draft.editingCharacterId);
      }

      const character: Character = {
        ...(defaults as Character),
        ...(existing ?? {}),
        id: draft.editingCharacterId,
        name: draft.name.trim(),
        alignment: (draft.alignment as Alignment) || undefined,
        race: draft.race,
        racialAbilityChoice: draft.racialAbilityChoice ?? undefined,
        className: draft.className,
        abilityScoreMethod: draft.abilityScoreMethod,
        baseAbilityScores: draft.baseAbilityScores,
        skills: draft.skills,
        featNames: draft.featNames,
        featParams: draft.featParams,
        languages,
        spellsKnown: [],
        spellsPrepared: {},
        inventory: {
          equipment: draft.equipment,
          gold: draft.gold,
          silver: 0,
          copper: 0,
        },
        version: defaults.version!,
        level: 1,
        experience: 0,
        currentHP: 0,
        tempHP: 0,
        nonlethalDamage: 0,
        conditions: [],
        spellSlotsUsed: {},
        classResourcesUsed: {},
        notes: '',
        levelHistory: [],
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      saveCharacter(character);
      resetDraft();
      return draft.editingCharacterId;
    } else {
      const id = createCharacter({
        name: draft.name.trim(),
        alignment: (draft.alignment as Alignment) || undefined,
        level: 1,
        experience: 0,
        race: draft.race,
        racialAbilityChoice: draft.racialAbilityChoice ?? undefined,
        className: draft.className,
        abilityScoreMethod: draft.abilityScoreMethod,
        baseAbilityScores: draft.baseAbilityScores,
        skills: draft.skills,
        featNames: draft.featNames,
        featParams: draft.featParams,
        languages,
        spellsKnown: [],
        spellsPrepared: {},
        inventory: {
          equipment: draft.equipment,
          gold: draft.gold,
          silver: 0,
          copper: 0,
        },
        currentHP: 0, // Will be set to max on first load
        tempHP: 0,
        nonlethalDamage: 0,
        conditions: [],
        spellSlotsUsed: {},
        classResourcesUsed: {},
        notes: '',
        levelHistory: [],
      });

      resetDraft();
      return id;
    }
  };

  return {
    draft,
    steps: WIZARD_STEPS,
    currentStepInfo,
    goToStep,
    nextStep,
    prevStep,
    canProceed,
    finalize,
    resetDraft,
  };
}
