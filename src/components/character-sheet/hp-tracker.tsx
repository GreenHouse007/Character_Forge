'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface HPTrackerProps {
  currentHP: number;
  maxHP: number;
  tempHP: number;
  nonlethalDamage: number;
  onDealDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  onSetTempHP: (amount: number) => void;
  onDealNonlethal: (amount: number) => void;
}

export function HPTracker({
  currentHP,
  maxHP,
  tempHP,
  nonlethalDamage,
  onDealDamage,
  onHeal,
  onSetTempHP,
  onDealNonlethal,
}: HPTrackerProps) {
  const [amount, setAmount] = useState('');

  const val = parseInt(amount) || 0;
  const hpPercent = maxHP > 0 ? Math.max(0, Math.min(100, (currentHP / maxHP) * 100)) : 0;

  const getHPColor = () => {
    if (currentHP <= 0) return 'text-destructive';
    if (hpPercent <= 25) return 'text-red-500';
    if (hpPercent <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Hit Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-3">
          <div className={`text-4xl font-bold ${getHPColor()}`}>
            {currentHP}
            {tempHP > 0 && <span className="text-blue-400 text-lg"> +{tempHP}</span>}
          </div>
          <div className="text-sm text-muted-foreground">/ {maxHP} HP</div>
          {nonlethalDamage > 0 && (
            <div className="text-xs text-yellow-500">({nonlethalDamage} nonlethal)</div>
          )}
        </div>

        <Progress value={hpPercent} className="mb-3 h-2" />

        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => { onDealDamage(val); setAmount(''); }}
            disabled={val <= 0}
          >
            Damage
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => { onHeal(val); setAmount(''); }}
            disabled={val <= 0}
          >
            Heal
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { onSetTempHP(val); setAmount(''); }}
            disabled={val <= 0}
            className="text-xs"
          >
            Set Temp HP
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { onDealNonlethal(val); setAmount(''); }}
            disabled={val <= 0}
            className="text-xs"
          >
            Nonlethal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
