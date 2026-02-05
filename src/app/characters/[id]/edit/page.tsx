'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCharacterStore } from '@/stores/character-store';
import { useCreationStore } from '@/stores/creation-store';

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const loadCharacter = useCharacterStore((s) => s.loadCharacter);
  const activeCharacter = useCharacterStore((s) => s.activeCharacter);
  const loadCharacterForEdit = useCreationStore((s) => s.loadCharacterForEdit);

  useEffect(() => {
    loadCharacter(id);
  }, [id, loadCharacter]);

  useEffect(() => {
    if (activeCharacter && activeCharacter.id === id) {
      loadCharacterForEdit(id, {
        abilityScoreMethod: activeCharacter.abilityScoreMethod,
        baseAbilityScores: activeCharacter.baseAbilityScores,
        race: activeCharacter.race,
        racialAbilityChoice: activeCharacter.racialAbilityChoice ?? null,
        className: activeCharacter.className,
        skills: activeCharacter.skills,
        featNames: activeCharacter.featNames,
        equipment: activeCharacter.inventory.equipment,
        gold: activeCharacter.inventory.gold,
        name: activeCharacter.name,
        alignment: activeCharacter.alignment ?? '',
      });
      router.push('/create/race');
    }
  }, [activeCharacter, id, loadCharacterForEdit, router]);

  return (
    <div className="text-center py-20 text-muted-foreground">
      Loading character for editing...
    </div>
  );
}
