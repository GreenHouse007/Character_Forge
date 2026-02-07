'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCreationStore } from '@/stores/creation-store';
import { useCreationWizard } from '@/hooks/use-creation-wizard';
import { useDiceRoller } from '@/hooks/use-dice-roller';
import { classes } from '@/data/classes';
import { WEAPONS } from '@/data/equipment/weapons';
import { ARMORS } from '@/data/equipment/armor';
import { ADVENTURING_GEAR } from '@/data/equipment/gear';
import { WONDROUS_ITEMS } from '@/data/equipment/wondrous-items';
import { EquipmentItem, Weapon, WeaponCategory, ArmorCategory } from '@/types/equipment';
import { formatDiceRoll } from '@/lib/dice';
import { calculateTotalWeight } from '@/lib/encumbrance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type WeaponSort = 'name' | 'cost' | 'damage';
type ArmorSort = 'name' | 'cost' | 'acBonus';

function getWeaponDamageValue(w: Weapon): number {
  return w.damage.count * w.damage.sides;
}

const PAGE_SIZE = 30;

export default function EquipmentPage() {
  const { nextStep, prevStep } = useCreationWizard();
  const draft = useCreationStore((s) => s.draft);
  const setEquipment = useCreationStore((s) => s.setEquipment);
  const setGold = useCreationStore((s) => s.setGold);
  const setCurrentStep = useCreationStore((s) => s.setCurrentStep);
  const { rollGold } = useDiceRoller();
  const [tab, setTab] = useState('weapons');

  // Weapon filters
  const [weaponSearch, setWeaponSearch] = useState('');
  const [weaponCategory, setWeaponCategory] = useState<WeaponCategory | 'All'>('All');
  const [weaponSort, setWeaponSort] = useState<WeaponSort>('name');
  const [weaponCount, setWeaponCount] = useState(PAGE_SIZE);
  const [masterworkFilter, setMasterworkFilter] = useState(false);

  // Armor filters
  const [armorSearch, setArmorSearch] = useState('');
  const [armorCategory, setArmorCategory] = useState<ArmorCategory | 'All'>('All');
  const [armorSort, setArmorSort] = useState<ArmorSort>('name');

  // Wondrous search
  const [wondrousSearch, setWondrousSearch] = useState('');

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

  const filteredWeapons = useMemo(() => {
    const query = weaponSearch.toLowerCase();
    let weapons = WEAPONS.filter((w) => {
      if (!w.name.toLowerCase().includes(query)) return false;
      if (weaponCategory !== 'All' && w.category !== weaponCategory) return false;
      return true;
    });

    // Sort
    switch (weaponSort) {
      case 'name':
        weapons = [...weapons].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'cost':
        weapons = [...weapons].sort((a, b) => a.cost - b.cost);
        break;
      case 'damage':
        weapons = [...weapons].sort((a, b) => getWeaponDamageValue(b) - getWeaponDamageValue(a));
        break;
    }

    return weapons;
  }, [weaponSearch, weaponCategory, weaponSort]);

  const filteredArmors = useMemo(() => {
    const query = armorSearch.toLowerCase();
    let armors = ARMORS.filter((a) => {
      if (!a.name.toLowerCase().includes(query)) return false;
      if (armorCategory !== 'All' && a.category !== armorCategory) return false;
      return true;
    });

    switch (armorSort) {
      case 'name':
        armors = [...armors].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'cost':
        armors = [...armors].sort((a, b) => a.cost - b.cost);
        break;
      case 'acBonus':
        armors = [...armors].sort((a, b) => b.acBonus - a.acBonus);
        break;
    }

    return armors;
  }, [armorSearch, armorCategory, armorSort]);

  const filteredWondrous = useMemo(() => {
    const query = wondrousSearch.toLowerCase();
    return WONDROUS_ITEMS.filter((w) => w.name.toLowerCase().includes(query));
  }, [wondrousSearch]);

  const visibleWeapons = filteredWeapons.slice(0, weaponCount);
  const hasMore = weaponCount < filteredWeapons.length;

  // Reset count when filters change
  useEffect(() => {
    setWeaponCount(PAGE_SIZE);
  }, [weaponSearch, weaponCategory, weaponSort]);

  const addItem = (item: EquipmentItem['item'], type: EquipmentItem['type'], masterwork?: boolean) => {
    let cost = item.cost ?? 0;
    if (masterwork && type === 'weapon') cost += 300;
    if (cost > goldRemaining) return;

    const existing = draft.equipment.findIndex(
      (e) => e.type === type && e.item.name === item.name && !masterwork
    );

    if (existing >= 0 && !masterwork) {
      const updated = [...draft.equipment];
      updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + 1 };
      setEquipment(updated);
    } else {
      const entry: EquipmentItem = type === 'weapon'
        ? {
            type: 'weapon',
            item: masterwork ? { ...item as any, cost: cost } : item as any,
            quantity: 1,
            masterwork: masterwork || undefined,
          }
        : type === 'wondrous'
          ? { type: 'wondrous', item: item as any, quantity: 1 }
          : { type, item, quantity: 1 } as EquipmentItem;
      setEquipment([...draft.equipment, entry]);
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
                      <span className="font-medium">
                        {entry.item.name}
                        {entry.type === 'weapon' && entry.masterwork && ' (MW)'}
                      </span>
                      {entry.quantity > 1 && <span className="text-muted-foreground"> x{entry.quantity}</span>}
                      <span className="text-muted-foreground ml-2">
                        ({entry.item.cost.toLocaleString()}gp, {entry.item.weight}lb{entry.quantity > 1 ? ` each` : ''})
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
              <TabsTrigger value="weapons">
                Weapons
                <Badge variant="secondary" className="ml-1 text-[9px] px-1">{filteredWeapons.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="armor">
                Armor
                <Badge variant="secondary" className="ml-1 text-[9px] px-1">{filteredArmors.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="wondrous">Wondrous</TabsTrigger>
              <TabsTrigger value="gear">Gear</TabsTrigger>
            </TabsList>

            <TabsContent value="weapons">
              {/* Weapon filters */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <Input
                  placeholder="Search weapons..."
                  value={weaponSearch}
                  onChange={(e) => setWeaponSearch(e.target.value)}
                  className="h-8 text-xs flex-1 min-w-[150px]"
                />
                <Select value={weaponCategory} onValueChange={(v) => setWeaponCategory(v as WeaponCategory | 'All')}>
                  <SelectTrigger className="h-8 text-xs w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Martial">Martial</SelectItem>
                    <SelectItem value="Exotic">Exotic</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={weaponSort} onValueChange={(v) => setWeaponSort(v as WeaponSort)}>
                  <SelectTrigger className="h-8 text-xs w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort: Name</SelectItem>
                    <SelectItem value="cost">Sort: Cost</SelectItem>
                    <SelectItem value="damage">Sort: Damage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="mw-filter"
                  checked={masterworkFilter}
                  onCheckedChange={(v) => setMasterworkFilter(!!v)}
                />
                <Label htmlFor="mw-filter" className="text-xs">Buy as masterwork (+300gp)</Label>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1">
                {visibleWeapons.map((w) => {
                  const effectiveCost = masterworkFilter ? w.cost + 300 : w.cost;
                  return (
                    <div key={w.name + (masterworkFilter ? '-mw' : '')} className="flex items-center justify-between text-sm p-2 border rounded">
                      <div>
                        <span className="font-medium">{w.name}</span>
                        {masterworkFilter && <span className="text-xs text-muted-foreground ml-1">(MW)</span>}
                        <span className="text-xs text-muted-foreground ml-2">
                          {w.category} {w.type} &middot; {w.damage.count}d{w.damage.sides} &middot; {effectiveCost}gp &middot; {w.weight}lb
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addItem(w, 'weapon', masterworkFilter || undefined)}
                        disabled={effectiveCost > goldRemaining}
                      >
                        Buy
                      </Button>
                    </div>
                  );
                })}
                {hasMore && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => setWeaponCount(c => c + PAGE_SIZE)}
                  >
                    Show more ({filteredWeapons.length - weaponCount} remaining)
                  </Button>
                )}
                {filteredWeapons.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">No matching weapons.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="armor">
              {/* Armor filters */}
              <div className="flex gap-2 mb-2 flex-wrap">
                <Input
                  placeholder="Search armor..."
                  value={armorSearch}
                  onChange={(e) => setArmorSearch(e.target.value)}
                  className="h-8 text-xs flex-1 min-w-[150px]"
                />
                <Select value={armorCategory} onValueChange={(v) => setArmorCategory(v as ArmorCategory | 'All')}>
                  <SelectTrigger className="h-8 text-xs w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Heavy">Heavy</SelectItem>
                    <SelectItem value="Shield">Shield</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={armorSort} onValueChange={(v) => setArmorSort(v as ArmorSort)}>
                  <SelectTrigger className="h-8 text-xs w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Sort: Name</SelectItem>
                    <SelectItem value="cost">Sort: Cost</SelectItem>
                    <SelectItem value="acBonus">Sort: AC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-80 overflow-y-auto space-y-1">
                {filteredArmors.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-sm p-2 border rounded">
                    <div>
                      <span className="font-medium">{a.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {a.category} &middot; +{a.acBonus} AC &middot; {a.cost}gp &middot; {a.weight}lb
                      </span>
                      {a.source !== 'CRB' && (
                        <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">{a.source}</Badge>
                      )}
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
                {filteredArmors.length === 0 && (
                  <p className="text-sm text-muted-foreground p-2">No matching armor.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="wondrous">
              <div className="mb-2">
                <Input
                  placeholder="Search wondrous items..."
                  value={wondrousSearch}
                  onChange={(e) => setWondrousSearch(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="max-h-80 overflow-y-auto space-y-1">
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
                      onClick={() => addItem(w, 'wondrous')}
                      disabled={w.cost > goldRemaining}
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
