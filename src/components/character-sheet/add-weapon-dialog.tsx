'use client';

import { useState } from 'react';
import { WEAPONS } from '@/data/equipment/weapons';
import { Weapon, WeaponCategory, WeaponType } from '@/types/equipment';
import { DamageType } from '@/types/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  // +75gp per point of STR rating
  return baseCost + (strengthRating * 75);
}

interface AddWeaponDialogProps {
  onAddWeapon: (weapon: Weapon, strengthRating?: number) => void;
}

function WeaponItemRow({
  weapon,
  onAddWeapon,
}: {
  weapon: Weapon;
  onAddWeapon: (weapon: Weapon, strengthRating?: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [strengthRating, setStrengthRating] = useState(0);
  const composite = isCompositeBow(weapon);

  const totalCost = composite && strengthRating > 0
    ? getCompositeBowCost(weapon.cost, strengthRating)
    : weapon.cost;

  const handleAdd = () => {
    const finalWeapon = composite && strengthRating > 0
      ? { ...weapon, cost: totalCost }
      : weapon;
    onAddWeapon(finalWeapon, composite ? strengthRating : undefined);
    setStrengthRating(0);
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
        <div className="flex items-center gap-2">
          {composite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Simple' : 'STR Rating'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>
      </div>

      {expanded && composite && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <Label className="text-xs">Strength Rating:</Label>
          <Select value={String(strengthRating)} onValueChange={(v) => setStrengthRating(Number(v))}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">+0 (base)</SelectItem>
              <SelectItem value="1">+1 (+75gp)</SelectItem>
              <SelectItem value="2">+2 (+150gp)</SelectItem>
              <SelectItem value="3">+3 (+225gp)</SelectItem>
              <SelectItem value="4">+4 (+300gp)</SelectItem>
              <SelectItem value="5">+5 (+375gp)</SelectItem>
            </SelectContent>
          </Select>
          {strengthRating > 0 && (
            <Badge variant="secondary" className="text-xs">
              Total: {totalCost}gp
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

export function AddWeaponDialog({ onAddWeapon }: AddWeaponDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const query = search.toLowerCase();
  const filteredWeapons = WEAPONS.filter((w) => w.name.toLowerCase().includes(query));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Weapon</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Weapon</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search weapons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

        <div className="max-h-72 overflow-y-auto space-y-1">
          {filteredWeapons.map((w) => (
            <WeaponItemRow key={w.name} weapon={w} onAddWeapon={onAddWeapon} />
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
  onAddWeapon: (weapon: Weapon, strengthRating?: number) => void;
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

    onAddWeapon(weapon);
    setOpen(false);
    // Reset form
    setName('');
    setCategory('Simple');
    setWeaponType('One-Handed Melee');
    setDamage('1d6');
    setDamageType('slashing');
    setCritRange(20);
    setCritMult(2);
    setWeight(0);
    setRange(0);
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

          <Button onClick={handleAdd} disabled={!name.trim()} className="w-full">
            Add Weapon
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
