'use client';

import { useState, useMemo } from 'react';
import { WEAPONS } from '@/data/equipment/weapons';
import { ARMORS } from '@/data/equipment/armor';
import { ADVENTURING_GEAR } from '@/data/equipment/gear';
import { WONDROUS_ITEMS } from '@/data/equipment/wondrous-items';
import { ALL_MAGIC_ITEMS, MAGIC_ITEM_GROUPS } from '@/data/equipment/magic-items';
import { ARMOR_SPECIAL_ABILITIES, ArmorSpecialAbilityDef } from '@/data/equipment/armor-abilities';
import { Armor, EquipmentItem, ArmorQuality, ArmorMaterial, ArmorAbilityEntry } from '@/types/equipment';
import {
  calculateArmorCost,
  calculateArmorCostBreakdown,
  getModifiedArmorStats,
  formatArmorName,
  getArmorEffectiveBonus,
  isValidArmorEnhancement,
} from '@/lib/armor-calculations';
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
  const [enhancementBonus, setEnhancementBonus] = useState(0);
  const [specialAbilities, setSpecialAbilities] = useState<ArmorAbilityEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  const effectiveQuality: ArmorQuality | undefined =
    enhancementBonus > 0 ? 'masterwork' : quality !== 'standard' ? quality : undefined;

  const totalCost = calculateArmorCost(
    armor.cost, armor.category, effectiveQuality, material,
    enhancementBonus > 0 ? enhancementBonus : undefined,
    specialAbilities.length > 0 ? specialAbilities : undefined
  );
  const modified = getModifiedArmorStats(
    armor, effectiveQuality, material,
    enhancementBonus > 0 ? enhancementBonus : undefined
  );
  const displayName = formatArmorName(
    armor.name, effectiveQuality, material,
    enhancementBonus > 0 ? enhancementBonus : undefined,
    specialAbilities.length > 0 ? specialAbilities : undefined
  );

  const effectiveBonus = getArmorEffectiveBonus(
    enhancementBonus > 0 ? enhancementBonus : undefined,
    specialAbilities.length > 0 ? specialAbilities : undefined
  );

  const isShield = armor.category === 'Shield';

  // Filter abilities based on armor type
  const availableAbilities = ARMOR_SPECIAL_ABILITIES.filter(
    (a) => a.appliesTo === 'all' || (isShield ? a.appliesTo === 'shield' : a.appliesTo === 'armor')
  );

  const toggleAbility = (ability: ArmorSpecialAbilityDef) => {
    const exists = specialAbilities.find((a) => a.id === ability.id);
    if (exists) {
      setSpecialAbilities(specialAbilities.filter((a) => a.id !== ability.id));
    } else {
      const newAbilities = [...specialAbilities, { id: ability.id }];
      // Check validity
      if (enhancementBonus > 0 && isValidArmorEnhancement(enhancementBonus, newAbilities)) {
        setSpecialAbilities(newAbilities);
      }
    }
  };

  const handleAdd = () => {
    const item: EquipmentItem = {
      type: 'armor',
      item: { ...armor, cost: totalCost, name: displayName },
      quantity: 1,
      quality: effectiveQuality,
      material: material !== 'standard' ? material : undefined,
      enhancementBonus: enhancementBonus > 0 ? enhancementBonus : undefined,
      specialAbilities: specialAbilities.length > 0 ? specialAbilities : undefined,
    };
    onAddItem(item);
    setQuality('standard');
    setMaterial('standard');
    setEnhancementBonus(0);
    setSpecialAbilities([]);
    setExpanded(false);
  };

  const costBreakdown = expanded
    ? calculateArmorCostBreakdown(
        armor.cost, armor.category, effectiveQuality, material,
        enhancementBonus > 0 ? enhancementBonus : undefined,
        specialAbilities.length > 0 ? specialAbilities : undefined
      )
    : [];

  return (
    <div className="text-sm p-2 border rounded space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">{armor.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            +{armor.acBonus} AC &middot; {armor.cost}gp &middot; {armor.weight}lb
          </span>
          {armor.source !== 'CRB' && (
            <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">{armor.source}</Badge>
          )}
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
            Buy ({totalCost.toLocaleString()}gp)
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2 pt-2 border-t">
          {/* Material & Quality Row */}
          <div className="flex flex-wrap gap-2">
            <Select value={material} onValueChange={(v) => setMaterial(v as ArmorMaterial)}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                {!isShield && <SelectItem value="mithral">Mithral</SelectItem>}
                {!isShield && <SelectItem value="adamantine">Adamantine</SelectItem>}
              </SelectContent>
            </Select>

            {enhancementBonus === 0 && (
              <Select value={quality} onValueChange={(v) => setQuality(v as ArmorQuality)}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="masterwork">Masterwork (+150gp)</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Enhancement dropdown */}
            <Select
              value={String(enhancementBonus)}
              onValueChange={(v) => {
                const bonus = parseInt(v);
                setEnhancementBonus(bonus);
                if (bonus === 0) {
                  setSpecialAbilities([]);
                }
              }}
            >
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Enhancement</SelectItem>
                <SelectItem value="1">+1 Enhancement</SelectItem>
                <SelectItem value="2">+2 Enhancement</SelectItem>
                <SelectItem value="3">+3 Enhancement</SelectItem>
                <SelectItem value="4">+4 Enhancement</SelectItem>
                <SelectItem value="5">+5 Enhancement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Special abilities (only when enhanced) */}
          {enhancementBonus > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Special Abilities (effective: +{effectiveBonus}/10)
              </div>
              <div className="flex flex-wrap gap-1">
                {availableAbilities.map((ability) => {
                  const isSelected = specialAbilities.some((a) => a.id === ability.id);
                  const wouldBeValid = isSelected || isValidArmorEnhancement(
                    enhancementBonus,
                    [...specialAbilities, { id: ability.id }]
                  );
                  return (
                    <Badge
                      key={ability.id}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`text-[10px] cursor-pointer ${!wouldBeValid ? 'opacity-40 cursor-not-allowed' : ''}`}
                      onClick={() => wouldBeValid && toggleAbility(ability)}
                      title={ability.description}
                    >
                      {ability.name} (+{ability.equivalentBonus})
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stat modifications preview */}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {enhancementBonus > 0 && (
              <Badge variant="secondary" className="text-[10px]">+{modified.acBonus} total AC</Badge>
            )}
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
            {quality === 'masterwork' && material === 'standard' && enhancementBonus === 0 && (
              <Badge variant="outline" className="text-[10px]">-1 ACP</Badge>
            )}
          </div>

          {/* Cost breakdown */}
          {costBreakdown.length > 1 && (
            <div className="text-xs text-muted-foreground border-t pt-1">
              {costBreakdown.map((entry, i) => (
                <div key={i} className="flex justify-between">
                  <span>{entry.label}</span>
                  <span>{entry.value.toLocaleString()}gp</span>
                </div>
              ))}
              <div className="flex justify-between font-medium text-foreground border-t mt-1 pt-1">
                <span>Total</span>
                <span>{totalCost.toLocaleString()}gp</span>
              </div>
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
  const [magicGroup, setMagicGroup] = useState('all');

  const query = search.toLowerCase();

  const filteredWeapons = WEAPONS.filter((w) => w.name.toLowerCase().includes(query));
  const filteredArmors = ARMORS.filter((a) => a.name.toLowerCase().includes(query));
  const filteredGear = ADVENTURING_GEAR.filter((g) => g.name.toLowerCase().includes(query));
  const filteredWondrous = WONDROUS_ITEMS.filter((w) => w.name.toLowerCase().includes(query));

  const filteredMagicItems = useMemo(() => {
    let items = ALL_MAGIC_ITEMS;
    if (magicGroup !== 'all') {
      items = items.filter((m) => m.group === magicGroup);
    }
    if (query) {
      items = items.filter((m) => m.name.toLowerCase().includes(query));
    }
    return items;
  }, [query, magicGroup]);

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
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="weapons">Weapons</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
            <TabsTrigger value="wondrous">Wondrous</TabsTrigger>
            <TabsTrigger value="magic">Magic Items</TabsTrigger>
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

          <TabsContent value="wondrous" className="max-h-72 overflow-y-auto">
            <div className="space-y-1">
              {filteredWondrous.map((w) => (
                <div key={w.name} className="flex items-center justify-between text-sm p-2 border rounded">
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{w.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {w.cost.toLocaleString()}gp
                      {w.weight > 0 && ` \u00b7 ${w.weight}lb`}
                    </span>
                    <p className="text-xs text-muted-foreground truncate">{w.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 shrink-0"
                    onClick={() => onAddItem({ type: 'wondrous', item: w, quantity: 1 })}
                    disabled={w.cost > gold}
                  >
                    Buy
                  </Button>
                </div>
              ))}
              {filteredWondrous.length === 0 && (
                <p className="text-sm text-muted-foreground p-2">No matching wondrous items.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="magic" className="max-h-72 overflow-y-auto">
            <div className="space-y-1">
              <Select value={magicGroup} onValueChange={setMagicGroup}>
                <SelectTrigger className="h-8 text-xs mb-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {MAGIC_ITEM_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filteredMagicItems.slice(0, 100).map((m) => (
                <div key={m.name} className="text-sm p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {m.price > 0 ? `${m.price.toLocaleString()}gp` : 'Priceless'}
                        {m.weight > 0 && ` \u00b7 ${m.weight}lb`}
                      </span>
                      <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">{m.group}</Badge>
                      {m.slot !== 'none' && (
                        <Badge variant="secondary" className="ml-1 text-[9px] px-1 py-0">{m.slot}</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 shrink-0"
                      onClick={() => onAddItem({ type: 'magic', item: m, quantity: 1 })}
                      disabled={m.price === 0 || m.price > gold}
                    >
                      {m.price === 0 ? '--' : 'Buy'}
                    </Button>
                  </div>
                  {m.description && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{m.description}</p>
                  )}
                </div>
              ))}
              {filteredMagicItems.length > 100 && (
                <p className="text-xs text-muted-foreground p-2 text-center">
                  Showing first 100 of {filteredMagicItems.length} results. Refine your search.
                </p>
              )}
              {filteredMagicItems.length === 0 && (
                <p className="text-sm text-muted-foreground p-2">No matching magic items.</p>
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
