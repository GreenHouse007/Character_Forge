'use client';

import { useState, useMemo } from 'react';
import { ARROW_TYPES, ArrowType } from '@/data/equipment/arrows';
import { EquipmentItem, Weapon } from '@/types/equipment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface ArrowCraftingProps {
  gold: number;
  onCraft: (item: EquipmentItem, materialCost: number) => void;
}

function buildWeaponFromArrow(arrow: ArrowType): Weapon {
  return {
    name: arrow.name + (arrow.bundleSize > 1 ? ` (${arrow.bundleSize})` : ''),
    category: 'Simple',
    type: 'Ammunition',
    cost: arrow.cost,
    damage: { count: 0, sides: 0 },
    critical: { range: 20, multiplier: 2 },
    damageType: arrow.damageType,
    weight: arrow.weight,
    source: arrow.source,
  };
}

export function ArrowCrafting({ gold, onCraft }: ArrowCraftingProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return ARROW_TYPES;
    const q = search.toLowerCase();
    return ARROW_TYPES.filter(
      (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
    );
  }, [search]);

  const handleCraft = (arrow: ArrowType) => {
    const materialCost = Math.round((arrow.cost / 3) * 100) / 100;
    const weapon = buildWeaponFromArrow(arrow);
    const item: EquipmentItem = {
      type: 'weapon',
      item: weapon,
      quantity: 1,
    };
    onCraft(item, materialCost);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Arrow Crafting</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search arrows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2 h-8 text-sm"
        />
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {filtered.map((arrow) => {
            const materialCost = Math.round((arrow.cost / 3) * 100) / 100;
            const canAfford = materialCost <= gold;

            return (
              <div
                key={arrow.name}
                className="flex items-center justify-between p-2 border rounded text-sm gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium">{arrow.name}</span>
                    {arrow.bundleSize > 1 && (
                      <Badge variant="secondary" className="text-[9px] px-1 py-0">
                        x{arrow.bundleSize}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      {arrow.craftSkill === 'Craft (Alchemy)' ? 'Alchemy' : 'Craft'} DC {arrow.craftDC}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {arrow.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {materialCost} gp
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={!canAfford}
                    onClick={() => handleCraft(arrow)}
                  >
                    Craft
                  </Button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">No matching arrows.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
