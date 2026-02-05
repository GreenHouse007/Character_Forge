'use client';

import { Character } from '@/types/character';
import { Weapon } from '@/types/equipment';
import { DerivedStats } from '@/hooks/use-derived-stats';
import { useWeaponAttacks } from '@/hooks/use-weapon-attacks';
import { useCombatStore } from '@/stores/combat-store';
import { useCharacterStore } from '@/stores/character-store';
import { StatWithTooltip } from './stat-with-tooltip';
import { AddWeaponDialog, CustomWeaponDialog } from './add-weapon-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

function formatIterativeAttacks(attacks: number[]): string {
  return attacks.map(b => (b >= 0 ? '+' : '') + b).join('/');
}

function formatDamage(
  dice: { count: number; sides: number; modifier?: number },
  flatBonus: number
): string {
  const total = flatBonus + (dice.modifier ?? 0);
  const sign = total >= 0 ? '+' : '';
  return `${dice.count}d${dice.sides}${total !== 0 ? sign + total : ''}`;
}

function formatCritical(range: number, multiplier: number): string {
  const rangeStr = range < 20 ? `${range}-20` : '20';
  return `${rangeStr}/\u00d7${multiplier}`;
}

interface WeaponAttacksProps {
  character: Character;
  stats: DerivedStats;
}

export function WeaponAttacks({ character, stats }: WeaponAttacksProps) {
  const { activeToggles, toggleCombatOption } = useCombatStore();
  const addInventoryItem = useCharacterStore((s) => s.addInventoryItem);
  const { attacks, toggles } = useWeaponAttacks(character, stats, activeToggles);

  const handleAddWeapon = (weapon: Weapon) => {
    addInventoryItem({ type: 'weapon', item: weapon, quantity: 1 });
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Weapon Attacks</CardTitle>
          <div className="flex gap-2">
            <AddWeaponDialog onAddWeapon={handleAddWeapon} />
            <CustomWeaponDialog onAddWeapon={handleAddWeapon} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Combat Toggles */}
        {toggles.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3 p-2 border rounded bg-muted/30">
            {toggles.map((toggle) => {
              const isActive = activeToggles.includes(toggle.id);
              return (
                <label key={toggle.id} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => toggleCombatOption(toggle.id)}
                  />
                  <span className={isActive ? 'font-medium' : 'text-muted-foreground'}>
                    {toggle.name}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {toggle.appliesTo}
                  </Badge>
                </label>
              );
            })}
          </div>
        )}

        {/* Weapon list */}
        <div className="space-y-2">
          {attacks.map((attack, i) => (
            <div key={i} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{attack.weapon.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">
                    {attack.weapon.type}
                  </Badge>
                </div>
                {attack.extraDamageDice && attack.extraDamageDice.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {attack.extraDamageDice.map((extra) => (
                      <span key={extra.source}>+{extra.dice.count}d{extra.dice.sides} {extra.source}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <StatWithTooltip breakdown={attack.attackBreakdown}>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground">Attack</div>
                    <div className="font-bold text-sm">
                      {formatIterativeAttacks(attack.iterativeAttacks)}
                    </div>
                  </div>
                </StatWithTooltip>
                <StatWithTooltip breakdown={attack.damageBreakdown}>
                  <div className="text-center">
                    <div className="text-[10px] text-muted-foreground">Damage</div>
                    <div className="font-bold text-sm">
                      {formatDamage(attack.damageDice, attack.damageBreakdown.total)}
                    </div>
                  </div>
                </StatWithTooltip>
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground">Crit</div>
                  <div className="text-sm">{formatCritical(attack.criticalRange, attack.criticalMultiplier)}</div>
                </div>
              </div>
            </div>
          ))}
          {attacks.length === 0 && (
            <p className="text-sm text-muted-foreground">No weapons equipped.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
