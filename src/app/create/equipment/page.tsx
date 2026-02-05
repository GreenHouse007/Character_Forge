'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { useDiceRoller } from '@/hooks/use-dice-roller';
import { classes } from '@/data/classes';
import { WEAPONS } from '@/data/equipment/weapons';
import { ARMORS } from '@/data/equipment/armor';
import { ADVENTURING_GEAR } from '@/data/equipment/gear';
import { EquipmentItem } from '@/types/equipment';
import { formatDiceRoll } from '@/lib/dice';
import { calculateTotalWeight } from '@/lib/encumbrance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EquipmentPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setEquipment = useCreationStore((s) => s.setEquipment);
  const setGold = useCreationStore((s) => s.setGold);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const { rollGold } = useDiceRoller();
  const [tab, setTab] = useState('weapons');

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  const cls = draft.className ? classes[draft.className] : null;

  const handleRollGold = () => {
    if (!cls) return;
    const gold = rollGold(cls.startingWealth.dice, cls.startingWealth.multiplier);
    setGold(gold);
  };

  const handleUseAverage = () => {
    if (!cls) return;
    setGold(cls.startingWealth.average);
  };

  const goldSpent = useMemo(() => {
    return draft.equipment.reduce((sum, entry) => {
      const cost = entry.item.cost ?? 0;
      return sum + cost * entry.quantity;
    }, 0);
  }, [draft.equipment]);

  const goldRemaining = draft.gold - goldSpent;
  const totalWeight = calculateTotalWeight(draft.equipment);

  const addItem = (item: EquipmentItem['item'], type: EquipmentItem['type']) => {
    const cost = item.cost ?? 0;
    if (cost > goldRemaining) return;

    const existing = draft.equipment.findIndex(
      (e) => e.type === type && e.item.name === item.name
    );

    if (existing >= 0) {
      const updated = [...draft.equipment];
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + 1 };
      setEquipment(updated);
    } else {
      setEquipment([...draft.equipment, { type, item, quantity: 1 } as EquipmentItem]);
    }
  };

  const removeItem = (index: number) => {
    const updated = [...draft.equipment];
    if (updated[index].quantity > 1) {
      updated[index] = { ...updated[index], quantity: updated[index].quantity - 1 };
    } else {
      updated.splice(index, 1);
    }
    setEquipment(updated);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Step 6: Equipment</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary">{draft.gold} gp starting</Badge>
              <Badge variant={goldRemaining >= 0 ? 'default' : 'destructive'}>
                {goldRemaining.toFixed(1)} gp remaining
              </Badge>
              <Badge variant="outline">{totalWeight.toFixed(1)} lbs</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Starting Gold */}
          {draft.gold === 0 && cls && (
            <div className="mb-6 p-4 border rounded-lg">
              <p className="text-sm mb-2">
                Starting wealth for {cls.name}: {formatDiceRoll(cls.startingWealth.dice)} &times; {cls.startingWealth.multiplier} gp
                (average {cls.startingWealth.average} gp)
              </p>
              <div className="flex gap-2">
                <Button onClick={handleRollGold} variant="outline" size="sm">Roll Starting Gold</Button>
                <Button onClick={handleUseAverage} variant="outline" size="sm">Use Average ({cls.startingWealth.average} gp)</Button>
              </div>
            </div>
          )}

          {draft.gold > 0 && (
            <div className="flex gap-2 mb-4">
              <Button onClick={handleRollGold} variant="outline" size="sm">Re-Roll Gold</Button>
              <Button onClick={handleUseAverage} variant="outline" size="sm">Use Average</Button>
            </div>
          )}

          {/* Current Inventory */}
          {draft.equipment.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-2">Inventory:</h4>
              <div className="space-y-1">
                {draft.equipment.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">{entry.item.name}</span>
                      {entry.quantity > 1 && <span className="text-muted-foreground"> x{entry.quantity}</span>}
                      <span className="text-muted-foreground ml-2">
                        ({entry.item.cost}gp, {entry.item.weight}lb{entry.quantity > 1 ? ` each` : ''})
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>Remove</Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shop */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="weapons">Weapons</TabsTrigger>
              <TabsTrigger value="armor">Armor</TabsTrigger>
              <TabsTrigger value="gear">Gear</TabsTrigger>
            </TabsList>

            <TabsContent value="weapons" className="max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {WEAPONS.map((w) => (
                  <div key={w.name} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">{w.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {w.category} {w.type} &middot; {w.damage.count}d{w.damage.sides} &middot; {w.cost}gp &middot; {w.weight}lb
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(w, 'weapon')}
                      disabled={w.cost > goldRemaining}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="armor" className="max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {ARMORS.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">{a.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {a.category} &middot; +{a.acBonus} AC &middot; {a.cost}gp &middot; {a.weight}lb
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(a, 'armor')}
                      disabled={a.cost > goldRemaining}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gear" className="max-h-80 overflow-y-auto">
              <div className="space-y-1">
                {ADVENTURING_GEAR.map((g) => (
                  <div key={g.name} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">{g.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {g.cost}gp &middot; {g.weight}lb
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItem(g, 'gear')}
                      disabled={g.cost > goldRemaining}
                    >
                      Buy
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>Back</Button>
        <Button onClick={nextStep}>Next: Review</Button>
      </div>
    </div>
  );
}
