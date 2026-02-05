'use client';

import { useState } from 'react';
import { WEAPONS } from '@/data/equipment/weapons';
import { ARMORS } from '@/data/equipment/armor';
import { ADVENTURING_GEAR } from '@/data/equipment/gear';
import { Armor, EquipmentItem, ArmorQuality, ArmorMaterial } from '@/types/equipment';
import { calculateArmorCost, getModifiedArmorStats, formatArmorName } from '@/lib/armor-calculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

function ArmorItemRow({
  armor,
  gold,
  onAddItem,
}: {
  armor: Armor;
  gold: number;
  onAddItem: (item: EquipmentItem) => void;
}) {
  const [quality, setQuality] = useState<ArmorQuality>('standard');
  const [material, setMaterial] = useState<ArmorMaterial>('standard');
  const [expanded, setExpanded] = useState(false);

  const totalCost = calculateArmorCost(armor.cost, armor.category, quality, material);
  const modified = getModifiedArmorStats(armor, quality, material);
  const displayName = formatArmorName(armor.name, quality, material);

  const handleAdd = () => {
    onAddItem({
      type: 'armor',
      item: { ...armor, cost: totalCost, name: displayName },
      quantity: 1,
      quality: quality !== 'standard' ? quality : undefined,
      material: material !== 'standard' ? material : undefined,
    });
    setQuality('standard');
    setMaterial('standard');
    setExpanded(false);
  };

  return (
    <div className="text-sm p-2 border rounded space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">{armor.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            +{armor.acBonus} AC &middot; {armor.cost}gp &middot; {armor.weight}lb
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Simple' : 'Options'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={totalCost > gold}
          >
            Buy ({totalCost}gp)
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Select value={quality} onValueChange={(v) => setQuality(v as ArmorQuality)}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="masterwork">Masterwork (+150gp)</SelectItem>
            </SelectContent>
          </Select>

          {armor.category !== 'Shield' && (
            <Select value={material} onValueChange={(v) => setMaterial(v as ArmorMaterial)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="mithral">Mithral</SelectItem>
                <SelectItem value="adamantine">Adamantine</SelectItem>
              </SelectContent>
            </Select>
          )}

          {(quality !== 'standard' || material !== 'standard') && (
            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
              {material === 'mithral' && (
                <>
                  <Badge variant="outline" className="text-[10px]">-3 ACP</Badge>
                  <Badge variant="outline" className="text-[10px]">+2 Max DEX</Badge>
                  <Badge variant="outline" className="text-[10px]">1/2 Weight</Badge>
                  {modified.category !== armor.category && (
                    <Badge variant="secondary" className="text-[10px]">
                      {modified.category} Armor
                    </Badge>
                  )}
                </>
              )}
              {quality === 'masterwork' && material === 'standard' && (
                <Badge variant="outline" className="text-[10px]">-1 ACP</Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
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

          <TabsContent value="armor" className="max-h-72 overflow-y-auto">
            <div className="space-y-1">
              {filteredArmors.map((a) => (
                <ArmorItemRow key={a.name} armor={a} gold={gold} onAddItem={onAddItem} />
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
