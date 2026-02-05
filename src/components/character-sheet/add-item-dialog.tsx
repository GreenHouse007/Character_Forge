'use client';

import { useState } from 'react';
import { WEAPONS } from '@/data/equipment/weapons';
import { ARMORS } from '@/data/equipment/armor';
import { ADVENTURING_GEAR } from '@/data/equipment/gear';
import { EquipmentItem } from '@/types/equipment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AddItemDialogProps {
  gold: number;
  onAddItem: (item: EquipmentItem) => void;
}

export function AddItemDialog({ gold, onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('weapons');
  const [search, setSearch] = useState('');

  const query = search.toLowerCase();

  const filteredWeapons = WEAPONS.filter((w) => w.name.toLowerCase().includes(query));
  const filteredArmors = ARMORS.filter((a) => a.name.toLowerCase().includes(query));
  const filteredGear = ADVENTURING_GEAR.filter((g) => g.name.toLowerCase().includes(query));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Equipment ({gold.toFixed(1)} gp available)</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="weapons">Weapons</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
            <TabsTrigger value="gear">Gear</TabsTrigger>
          </TabsList>

          <TabsContent value="weapons" className="max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {filteredWeapons.map((w) => (
                <div key={w.name} className="flex items-center justify-between text-sm p-2 border rounded">
                  <div>
                    <span className="font-medium">{w.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {w.damage.count}d{w.damage.sides} &middot; {w.cost}gp &middot; {w.weight}lb
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddItem({ type: 'weapon', item: w, quantity: 1 })}
                    disabled={w.cost > gold}
                  >
                    Buy
                  </Button>
                </div>
              ))}
              {filteredWeapons.length === 0 && (
                <p className="text-sm text-muted-foreground p-2">No matching weapons.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="armor" className="max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {filteredArmors.map((a) => (
                <div key={a.name} className="flex items-center justify-between text-sm p-2 border rounded">
                  <div>
                    <span className="font-medium">{a.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      +{a.acBonus} AC &middot; {a.cost}gp &middot; {a.weight}lb
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddItem({ type: 'armor', item: a, quantity: 1 })}
                    disabled={a.cost > gold}
                  >
                    Buy
                  </Button>
                </div>
              ))}
              {filteredArmors.length === 0 && (
                <p className="text-sm text-muted-foreground p-2">No matching armor.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="gear" className="max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {filteredGear.map((g) => (
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
                    onClick={() => onAddItem({ type: 'gear', item: g, quantity: 1 })}
                    disabled={g.cost > gold}
                  >
                    Buy
                  </Button>
                </div>
              ))}
              {filteredGear.length === 0 && (
                <p className="text-sm text-muted-foreground p-2">No matching gear.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
