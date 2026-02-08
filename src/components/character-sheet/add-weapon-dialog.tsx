'use client';

import { useState, useMemo } from 'react';
import { WEAPONS } from '@/data/equipment/weapons';
import { Weapon, WeaponCategory, WeaponType, WeaponMaterial, WeaponAbilityEntry, EquipmentItem } from '@/types/equipment';
import { DamageType } from '@/types/common';
import { WEAPON_SPECIAL_ABILITIES, WEAPON_ABILITIES_BY_ID, BANE_TARGET_TYPES, WeaponSpecialAbilityDef } from '@/data/equipment/weapon-abilities';
import { WEAPON_MATERIALS } from '@/data/equipment/weapon-materials';
import { calculateWeaponCost, getEffectiveBonus, isValidEnhancement } from '@/lib/weapon-cost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function isCompositeBow(weapon: Weapon): boolean {
  return weapon.name.toLowerCase().includes('composite');
}

function getCompositeBowCost(baseCost: number, strengthRating: number): number {
  return baseCost + (strengthRating * 75);
}

function isRangedWeapon(weapon: Weapon): boolean {
  return weapon.type === 'Ranged';
}

function isMeleeWeapon(weapon: Weapon): boolean {
  return !isRangedWeapon(weapon) && weapon.type !== 'Ammunition';
}

function getApplicableAbilities(weapon: Weapon): WeaponSpecialAbilityDef[] {
  const melee = isMeleeWeapon(weapon);
  return WEAPON_SPECIAL_ABILITIES.filter(a => {
    if (a.appliesTo === 'all') return true;
    if (a.appliesTo === 'melee' && melee) return true;
    if (a.appliesTo === 'ranged' && !melee) return true;
    return false;
  });
}

interface AddWeaponDialogProps {
  gold: number;
  onAddWeapon: (weapon: Weapon, opts?: {
    strengthRating?: number;
    masterwork?: boolean;
    enhancementBonus?: number;
    material?: WeaponMaterial;
    specialAbilities?: WeaponAbilityEntry[];
  }) => void;
}

function EnhancementBuilder({
  weapon,
  gold,
  strengthRating,
  setStrengthRating,
  onAdd,
}: {
  weapon: Weapon;
  gold: number;
  strengthRating: number;
  setStrengthRating: (v: number) => void;
  onAdd: (opts: {
    masterwork: boolean;
    enhancementBonus: number;
    material: WeaponMaterial;
    specialAbilities: WeaponAbilityEntry[];
    strengthRating?: number;
  }) => void;
}) {
  const [material, setMaterial] = useState<WeaponMaterial>('standard');
  const [masterwork, setMasterwork] = useState(false);
  const [enhancement, setEnhancement] = useState(0);
  const [selectedAbilities, setSelectedAbilities] = useState<WeaponAbilityEntry[]>([]);
  const [baneTarget, setBaneTarget] = useState(BANE_TARGET_TYPES[0]);

  const composite = isCompositeBow(weapon);
  const applicableAbilities = useMemo(() => getApplicableAbilities(weapon), [weapon]);

  // Auto-masterwork for adamantine/mithral
  const isForcedMasterwork = material === 'adamantine' || material === 'mithral';
  const effectiveMasterwork = masterwork || isForcedMasterwork || enhancement > 0;

  const baseCost = composite && strengthRating > 0
    ? getCompositeBowCost(weapon.cost, strengthRating)
    : weapon.cost;

  const costResult = calculateWeaponCost(
    baseCost,
    weapon.weight,
    effectiveMasterwork,
    enhancement,
    selectedAbilities,
    material
  );

  const effectiveBonus = getEffectiveBonus(enhancement, selectedAbilities);

  const toggleAbility = (abilityId: string) => {
    const existing = selectedAbilities.find(a => a.id === abilityId);
    if (existing) {
      setSelectedAbilities(selectedAbilities.filter(a => a.id !== abilityId));
    } else {
      const entry: WeaponAbilityEntry = { id: abilityId };
      if (abilityId === 'bane') {
        entry.target = baneTarget;
      }
      // Check if adding would exceed +10 effective
      if (isValidEnhancement(enhancement, [...selectedAbilities, entry])) {
        setSelectedAbilities([...selectedAbilities, entry]);
      }
    }
  };

  const handleAdd = () => {
    onAdd({
      masterwork: effectiveMasterwork,
      enhancementBonus: enhancement,
      material,
      specialAbilities: selectedAbilities.length > 0 ? selectedAbilities : [],
      strengthRating: composite ? strengthRating : undefined,
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t">
      {/* Composite bow strength rating */}
      {composite && (
        <div className="flex items-center gap-2">
          <Label className="text-xs">STR Rating:</Label>
          <Select value={String(strengthRating)} onValueChange={(v) => setStrengthRating(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5].map(n => (
                <SelectItem key={n} value={String(n)}>
                  +{n}{n > 0 ? ` (+${n * 75}gp)` : ' (base)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Material */}
      <div className="flex items-center gap-2">
        <Label className="text-xs w-16">Material:</Label>
        <Select value={material} onValueChange={(v) => setMaterial(v as WeaponMaterial)}>
          <SelectTrigger className="flex-1 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WEAPON_MATERIALS.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Masterwork */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="mw"
          checked={effectiveMasterwork}
          disabled={isForcedMasterwork || enhancement > 0}
          onCheckedChange={(v) => setMasterwork(!!v)}
        />
        <Label htmlFor="mw" className="text-xs">
          Masterwork (+300gp, +1 attack)
          {isForcedMasterwork && ' (included with material)'}
          {enhancement > 0 && ' (included with enchantment)'}
        </Label>
      </div>

      {/* Enhancement */}
      <div className="flex items-center gap-2">
        <Label className="text-xs w-16">Enhance:</Label>
        <Select value={String(enhancement)} onValueChange={(v) => setEnhancement(Number(v))}>
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">None</SelectItem>
            {[1, 2, 3, 4, 5].map(n => (
              <SelectItem key={n} value={String(n)}>+{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {effectiveBonus > 0 && (
          <Badge variant="outline" className="text-[9px]">
            Effective +{effectiveBonus}
          </Badge>
        )}
      </div>

      {/* Special Abilities */}
      {enhancement >= 1 && (
        <div>
          <Label className="text-xs">Special Abilities:</Label>
          <div className="grid grid-cols-2 gap-1 mt-1 max-h-32 overflow-y-auto">
            {applicableAbilities.map(ability => {
              const isSelected = selectedAbilities.some(a => a.id === ability.id);
              const wouldExceed = !isSelected && !isValidEnhancement(enhancement, [
                ...selectedAbilities,
                { id: ability.id },
              ]);
              return (
                <label
                  key={ability.id}
                  className={`flex items-center gap-1 text-xs p-1 rounded cursor-pointer ${
                    wouldExceed ? 'opacity-40' : ''
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={wouldExceed && !isSelected}
                    onCheckedChange={() => toggleAbility(ability.id)}
                  />
                  <span>{ability.name}</span>
                  <Badge variant="outline" className="text-[8px] px-0.5 py-0">
                    +{ability.equivalentBonus}
                  </Badge>
                </label>
              );
            })}
          </div>

          {/* Bane target */}
          {selectedAbilities.some(a => a.id === 'bane') && (
            <div className="flex items-center gap-2 mt-2">
              <Label className="text-xs">Bane Target:</Label>
              <Select value={baneTarget} onValueChange={(v) => {
                setBaneTarget(v);
                setSelectedAbilities(prev => prev.map(a =>
                  a.id === 'bane' ? { ...a, target: v } : a
                ));
              }}>
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BANE_TARGET_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Cost breakdown */}
      <div className="p-2 bg-muted/40 rounded text-xs space-y-0.5">
        {costResult.breakdown.map((b, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-muted-foreground">{b.label}</span>
            <span>{b.value.toLocaleString()}gp</span>
          </div>
        ))}
        <div className="flex justify-between font-medium border-t pt-1 mt-1">
          <span>Total</span>
          <span>{costResult.total.toLocaleString()}gp</span>
        </div>
      </div>

      <Button onClick={handleAdd} size="sm" className="w-full" disabled={costResult.total > gold}>
        Add to Inventory ({costResult.total.toLocaleString()}gp)
      </Button>
    </div>
  );
}

export function WeaponItemRow({
  weapon,
  gold,
  onAddWeapon,
}: {
  weapon: Weapon;
  gold: number;
  onAddWeapon: AddWeaponDialogProps['onAddWeapon'];
}) {
  const [expanded, setExpanded] = useState(false);
  const [strengthRating, setStrengthRating] = useState(0);

  const handleQuickAdd = () => {
    const composite = isCompositeBow(weapon);
    onAddWeapon(weapon, {
      strengthRating: composite ? strengthRating : undefined,
    });
  };

  const handleEnhancedAdd = (opts: {
    masterwork: boolean;
    enhancementBonus: number;
    material: WeaponMaterial;
    specialAbilities: WeaponAbilityEntry[];
    strengthRating?: number;
  }) => {
    // Update weapon cost based on enhancement
    const baseCost = opts.strengthRating && opts.strengthRating > 0
      ? getCompositeBowCost(weapon.cost, opts.strengthRating)
      : weapon.cost;

    const costResult = calculateWeaponCost(
      baseCost,
      weapon.weight,
      opts.masterwork,
      opts.enhancementBonus,
      opts.specialAbilities,
      opts.material
    );

    const finalWeapon = { ...weapon, cost: costResult.total };
    onAddWeapon(finalWeapon, {
      strengthRating: opts.strengthRating,
      masterwork: opts.masterwork,
      enhancementBonus: opts.enhancementBonus,
      material: opts.material,
      specialAbilities: opts.specialAbilities.length > 0 ? opts.specialAbilities : undefined,
    });
    setExpanded(false);
  };

  return (
    <div className="text-sm p-2 border rounded space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium">{weapon.name}</span>
          <span className="text-xs text-muted-foreground ml-2">
            {weapon.damage.count}d{weapon.damage.sides} {weapon.damageType.join('/')} &middot; {weapon.type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Simple' : 'Enhance'}
          </Button>
          {!expanded && (
            <Button variant="outline" size="sm" onClick={handleQuickAdd} disabled={weapon.cost > gold}>
              Buy ({weapon.cost.toLocaleString()}gp)
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <EnhancementBuilder
          weapon={weapon}
          gold={gold}
          strengthRating={strengthRating}
          setStrengthRating={setStrengthRating}
          onAdd={handleEnhancedAdd}
        />
      )}
    </div>
  );
}

const ALL_WEAPON_TYPES: (WeaponType | 'All')[] = ['All', 'Light Melee', 'One-Handed Melee', 'Two-Handed Melee', 'Ranged', 'Unarmed', 'Ammunition'];

export function AddWeaponDialog({ gold, onAddWeapon }: AddWeaponDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<WeaponCategory | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<WeaponType | 'All'>('All');

  const filteredWeapons = useMemo(() => {
    const query = search.toLowerCase();
    return WEAPONS.filter((w) => {
      if (!w.name.toLowerCase().includes(query)) return false;
      if (categoryFilter !== 'All' && w.category !== categoryFilter) return false;
      if (typeFilter !== 'All' && w.type !== typeFilter) return false;
      return true;
    });
  }, [search, categoryFilter, typeFilter]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Weapon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add Weapon
            <Badge variant="secondary" className="text-xs">
              {filteredWeapons.length} weapons
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search weapons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <div className="flex gap-2 mb-2">
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as WeaponCategory | 'All')}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Simple">Simple</SelectItem>
              <SelectItem value="Martial">Martial</SelectItem>
              <SelectItem value="Exotic">Exotic</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as WeaponType | 'All')}>
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {ALL_WEAPON_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t === 'All' ? 'All Types' : t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-1">
          {filteredWeapons.map((w) => (
            <WeaponItemRow key={w.name} weapon={w} gold={gold} onAddWeapon={onAddWeapon} />
          ))}
          {filteredWeapons.length === 0 && (
            <p className="text-sm text-muted-foreground p-2">No matching weapons.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CustomWeaponDialogProps {
  onAddWeapon: (weapon: Weapon, opts?: {
    strengthRating?: number;
    masterwork?: boolean;
    enhancementBonus?: number;
    material?: WeaponMaterial;
    specialAbilities?: WeaponAbilityEntry[];
  }) => void;
}

const WEAPON_CATEGORIES: WeaponCategory[] = ['Simple', 'Martial', 'Exotic'];
const WEAPON_TYPES: WeaponType[] = ['Unarmed', 'Light Melee', 'One-Handed Melee', 'Two-Handed Melee', 'Ranged'];
const DAMAGE_TYPES: DamageType[] = ['bludgeoning', 'piercing', 'slashing'];
const DAMAGE_DICE_OPTIONS = [
  { label: '1d2', count: 1, sides: 2 },
  { label: '1d3', count: 1, sides: 3 },
  { label: '1d4', count: 1, sides: 4 },
  { label: '1d6', count: 1, sides: 6 },
  { label: '1d8', count: 1, sides: 8 },
  { label: '1d10', count: 1, sides: 10 },
  { label: '1d12', count: 1, sides: 12 },
  { label: '2d4', count: 2, sides: 4 },
  { label: '2d6', count: 2, sides: 6 },
  { label: '2d8', count: 2, sides: 8 },
  { label: '2d10', count: 2, sides: 10 },
];

export function CustomWeaponDialog({ onAddWeapon }: CustomWeaponDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WeaponCategory>('Simple');
  const [weaponType, setWeaponType] = useState<WeaponType>('One-Handed Melee');
  const [damage, setDamage] = useState('1d6');
  const [damageType, setDamageType] = useState<DamageType>('slashing');
  const [critRange, setCritRange] = useState(20);
  const [critMult, setCritMult] = useState(2);
  const [weight, setWeight] = useState(0);
  const [range, setRange] = useState(0);
  const [customMasterwork, setCustomMasterwork] = useState(false);
  const [customEnhancement, setCustomEnhancement] = useState(0);

  const handleAdd = () => {
    if (!name.trim()) return;

    const diceOption = DAMAGE_DICE_OPTIONS.find((d) => d.label === damage) ?? { count: 1, sides: 6 };

    const weapon: Weapon = {
      name: name.trim(),
      category,
      type: weaponType,
      cost: 0,
      damage: { count: diceOption.count, sides: diceOption.sides },
      critical: { range: critRange, multiplier: critMult },
      damageType: [damageType],
      weight,
      range: weaponType === 'Ranged' && range > 0 ? range : undefined,
      source: 'CRB',
    };

    onAddWeapon(weapon, {
      masterwork: customMasterwork || customEnhancement > 0,
      enhancementBonus: customEnhancement,
    });
    setOpen(false);
    setName('');
    setCategory('Simple');
    setWeaponType('One-Handed Melee');
    setDamage('1d6');
    setDamageType('slashing');
    setCritRange(20);
    setCritMult(2);
    setWeight(0);
    setRange(0);
    setCustomMasterwork(false);
    setCustomEnhancement(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Custom</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Weapon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="weapon-name">Name</Label>
            <Input
              id="weapon-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Flaming Longsword +1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as WeaponCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEAPON_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <Select value={weaponType} onValueChange={(v) => setWeaponType(v as WeaponType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEAPON_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Damage</Label>
              <Select value={damage} onValueChange={setDamage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAMAGE_DICE_OPTIONS.map((d) => (
                    <SelectItem key={d.label} value={d.label}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Damage Type</Label>
              <Select value={damageType} onValueChange={(v) => setDamageType(v as DamageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAMAGE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Crit Range</Label>
              <Select value={String(critRange)} onValueChange={(v) => setCritRange(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="19">19-20</SelectItem>
                  <SelectItem value="18">18-20</SelectItem>
                  <SelectItem value="17">17-20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Crit Mult</Label>
              <Select value={String(critMult)} onValueChange={(v) => setCritMult(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">x2</SelectItem>
                  <SelectItem value="3">x3</SelectItem>
                  <SelectItem value="4">x4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Weight (lb)</Label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {weaponType === 'Ranged' && (
            <div>
              <Label>Range (ft)</Label>
              <Input
                type="number"
                min={0}
                step={10}
                value={range}
                onChange={(e) => setRange(parseInt(e.target.value) || 0)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="custom-mw"
                checked={customMasterwork || customEnhancement > 0}
                disabled={customEnhancement > 0}
                onCheckedChange={(v) => setCustomMasterwork(!!v)}
              />
              <Label htmlFor="custom-mw" className="text-sm">Masterwork</Label>
            </div>

            <div>
              <Label className="text-sm">Enhancement</Label>
              <Select value={String(customEnhancement)} onValueChange={(v) => setCustomEnhancement(Number(v))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  {[1, 2, 3, 4, 5].map(n => (
                    <SelectItem key={n} value={String(n)}>+{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleAdd} disabled={!name.trim()} className="w-full">
            Add Weapon
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
