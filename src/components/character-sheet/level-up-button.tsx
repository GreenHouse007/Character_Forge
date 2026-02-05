'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface LevelUpButtonProps {
  characterId: string;
}

export function LevelUpButton({ characterId }: LevelUpButtonProps) {
  return (
    <Link href={`/characters/${characterId}/level-up`}>
      <Button variant="default" size="sm">
        Level Up
      </Button>
    </Link>
  );
}
