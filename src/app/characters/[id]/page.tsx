'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCharacter } from '@/hooks/use-character';
import { useDerivedStats } from '@/hooks/use-derived-stats';
import { useCharacterStore } from '@/stores/character-store';
import { races } from '@/data/races';
import { classes } from '@/data/classes';
import { SKILLS } from '@/data/skills';
import { getSkillTotal } from '@/types/skill';
import { FEATS_BY_NAME } from '@/data/feats';
import { ABILITY_SCORES, ABILITY_SCORE_SHORT } from '@/types/common';
import { CONDITIONS } from '@/types/combat';
import { getAbilityModifier } from '@/lib/spell-slots';
import { getEncumbrance, getSizeCarryMultiplier } from '@/lib/encumbrance';
import { HPTracker } from '@/components/character-sheet/hp-tracker';
import { SpellSlotTracker } from '@/components/character-sheet/spell-slot-tracker';
import { StatWithTooltip } from '@/components/character-sheet/stat-with-tooltip';
import { WeaponAttacks } from '@/components/character-sheet/weapon-attacks';
import { SpellList } from '@/components/character-sheet/spell-list';
import { LevelUpButton } from '@/components/character-sheet/level-up-button';
import { LevelHistory } from '@/components/character-sheet/level-history';
import { CollapsibleSection } from '@/components/character-sheet/collapsible-section';
import { LanguagesEditor } from '@/components/character-sheet/languages-editor';
import { QuickEditDialog } from '@/components/character-sheet/quick-edit-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { AddItemDialog } from '@/components/character-sheet/add-item-dialog';
import { SpellPreparation } from '@/components/character-sheet/spell-preparation';
import { downloadCharacterAsJSON } from '@/lib/export';
import { isPreparedCaster } from '@/lib/spell-helpers';

export default function CharacterSheetPage() {
  const params = useParams();
  const id = params.id as string;
  const character = useCharacter(id);
  const stats = useDerivedStats(character);
  const store = useCharacterStore();

  // Set HP to max on first load if currentHP is 0 and maxHP is calculated
  useEffect(() => {
    if (character && stats && character.currentHP === 0 && stats.maxHP > 0) {
      store.saveCharacter({ ...character, currentHP: stats.maxHP });
    }
  }, [character?.id, stats?.maxHP]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!character || !stats) {
    return <div className="text-center py-20 text-muted-foreground">Loading character...</div>;
  }

  const race = races[character.race];
  const cls = classes[character.className];

  if (!race || !cls) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Error: Invalid character data.</p>
        <p className="text-sm mt-2">Race or class not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const encumbrance = getEncumbrance(
    stats.finalAbilityScores.str,
    character.inventory.equipment,
    getSizeCarryMultiplier(race.size)
  );

  const handleQuickEdit = (updates: Partial<typeof character>) => {
    store.saveCharacter({ ...character, ...updates });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">{character.name}</h1>
          <p className="text-muted-foreground">
            {character.race} {character.className} {character.level}
            {character.alignment && ` | ${character.alignment}`}
            {character.deity && ` | ${character.deity}`}
          </p>
        </div>
        <div className="flex gap-2">
          <QuickEditDialog character={character} onSave={handleQuickEdit} />
          <LevelUpButton characterId={character.id} />
          <Button variant="outline" onClick={() => store.rest()}>
            Rest (Reset Daily)
          </Button>
          <Button variant="outline" onClick={() => downloadCharacterAsJSON(character)}>
            Export
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      {/* Combat Section */}
      <CollapsibleSection title="Combat" className="bg-section-combat" defaultOpen>
        {/* Speed, Initiative, BAB quick display */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatWithTooltip breakdown={stats.breakdowns.speed}>
            <div className="text-center p-3 border rounded bg-background">
              <div className="text-xs text-muted-foreground">Speed</div>
              <div className="text-xl font-bold">{stats.speed} ft</div>
            </div>
          </StatWithTooltip>
          <StatWithTooltip breakdown={stats.breakdowns.initiative}>
            <div className="text-center p-3 border rounded bg-background">
              <div className="text-xs text-muted-foreground">Initiative</div>
              <div className="text-xl font-bold">{stats.combatStats.initiative >= 0 ? '+' : ''}{stats.combatStats.initiative}</div>
            </div>
          </StatWithTooltip>
          <div className="text-center p-3 border rounded bg-background">
            <div className="text-xs text-muted-foreground">BAB</div>
            <div className="text-xl font-bold">+{stats.combatStats.bab}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* HP Tracker */}
          <StatWithTooltip breakdown={stats.breakdowns.maxHP}>
            <HPTracker
              currentHP={character.currentHP}
              maxHP={stats.maxHP}
              tempHP={character.tempHP}
              nonlethalDamage={character.nonlethalDamage}
              onDealDamage={store.dealDamage}
              onHeal={store.healDamage}
              onSetTempHP={store.setTempHP}
              onDealNonlethal={store.dealNonlethalDamage}
            />
          </StatWithTooltip>

          {/* Combat Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Armor Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <StatWithTooltip breakdown={stats.breakdowns.ac}>
                  <div className="text-center p-2 border rounded">
                    <div className="text-[10px] text-muted-foreground">AC</div>
                    <div className="text-xl font-bold">{stats.combatStats.ac}</div>
                  </div>
                </StatWithTooltip>
                <StatWithTooltip breakdown={stats.breakdowns.touchAC}>
                  <div className="text-center p-2 border rounded">
                    <div className="text-[10px] text-muted-foreground">Touch</div>
                    <div className="text-lg font-bold">{stats.combatStats.touchAC}</div>
                  </div>
                </StatWithTooltip>
                <StatWithTooltip breakdown={stats.breakdowns.flatFootedAC}>
                  <div className="text-center p-2 border rounded">
                    <div className="text-[10px] text-muted-foreground">Flat</div>
                    <div className="text-lg font-bold">{stats.combatStats.flatFootedAC}</div>
                  </div>
                </StatWithTooltip>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatWithTooltip breakdown={stats.breakdowns.cmb}>
                  <div className="text-center p-2 border rounded">
                    <div className="text-[10px] text-muted-foreground">CMB</div>
                    <div className="font-bold">{stats.combatStats.cmb >= 0 ? '+' : ''}{stats.combatStats.cmb}</div>
                  </div>
                </StatWithTooltip>
                <StatWithTooltip breakdown={stats.breakdowns.cmd}>
                  <div className="text-center p-2 border rounded">
                    <div className="text-[10px] text-muted-foreground">CMD</div>
                    <div className="font-bold">{stats.combatStats.cmd}</div>
                  </div>
                </StatWithTooltip>
              </div>
            </CardContent>
          </Card>

          {/* Saving Throws */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Saving Throws</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {([
                  { name: 'Fortitude', value: stats.combatStats.fortitude, good: cls.goodSaves.includes('fortitude'), breakdown: stats.breakdowns.fortitude },
                  { name: 'Reflex', value: stats.combatStats.reflex, good: cls.goodSaves.includes('reflex'), breakdown: stats.breakdowns.reflex },
                  { name: 'Will', value: stats.combatStats.will, good: cls.goodSaves.includes('will'), breakdown: stats.breakdowns.will },
                ] as const).map((save) => (
                  <StatWithTooltip key={save.name} breakdown={save.breakdown}>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{save.name}</span>
                        {save.good && <Badge variant="secondary" className="text-[10px]">Good</Badge>}
                      </div>
                      <span className="font-bold">{save.value >= 0 ? '+' : ''}{save.value}</span>
                    </div>
                  </StatWithTooltip>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weapon Attacks */}
          <WeaponAttacks character={character} stats={stats} />
        </div>
      </CollapsibleSection>

      {/* Character Info Section */}
      <CollapsibleSection title="Character Info" className="bg-section-info" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Ability Scores */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ability Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {ABILITY_SCORES.map((a) => {
                  const score = stats.finalAbilityScores[a];
                  const mod = stats.abilityModifiers[a];
                  return (
                    <div key={a} className="text-center p-2 border rounded">
                      <div className="text-[10px] text-muted-foreground uppercase">{ABILITY_SCORE_SHORT[a]}</div>
                      <div className="text-lg font-bold">{score}</div>
                      <div className="text-sm text-muted-foreground">{mod >= 0 ? '+' : ''}{mod}</div>
                    </div>
                  );
                })}
              </div>
              {/* Languages Editor */}
              <LanguagesEditor
                languages={character.languages}
                bonusLanguages={race.bonusLanguages ?? []}
                intModifier={stats.abilityModifiers.int}
                onAddLanguage={store.addLanguage}
                onRemoveLanguage={store.removeLanguage}
              />
              {/* Casting Info */}
              {stats.spellState.canCast && stats.spellState.castingAbility && (
                <div className="mt-3 pt-3 border-t">
                  <div className="text-xs text-muted-foreground font-medium mb-1">Spellcasting</div>
                  <div className="text-sm">
                    <span className="font-medium">{stats.spellState.castingAbility.toUpperCase()}</span>
                    <span className="text-muted-foreground"> {stats.abilityModifiers[stats.spellState.castingAbility] >= 0 ? '+' : ''}{stats.abilityModifiers[stats.spellState.castingAbility]}</span>
                    <span className="mx-2">|</span>
                    <span className="text-muted-foreground">DC </span>
                    <span className="font-medium">{10 + stats.abilityModifiers[stats.spellState.castingAbility]}</span>
                    <span className="text-muted-foreground"> + spell level</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-80 overflow-y-auto">
                {SKILLS.map((skillDef) => {
                  const charSkill = character.skills.find((s) => s.name === skillDef.name);
                  const ranks = charSkill?.ranks ?? 0;
                  const isClassSkill = charSkill?.isClassSkill ?? cls.classSkills.includes(skillDef.name);
                  const miscMod = charSkill?.miscModifier ?? 0;
                  const abilityMod = getAbilityModifier(stats.finalAbilityScores[skillDef.ability]);

                  // Trained-only skills with 0 ranks cannot be used
                  const canUse = !skillDef.trainedOnly || ranks > 0;

                  const total = canUse
                    ? getSkillTotal(
                        { name: skillDef.name, ranks, isClassSkill, miscModifier: miscMod },
                        abilityMod,
                        stats.armorCheckPenalty,
                        skillDef
                      )
                    : null;

                  return (
                    <div
                      key={skillDef.name}
                      className={`flex items-center justify-between text-sm p-1.5 border rounded ${
                        ranks > 0 ? '' : 'opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="truncate">{skillDef.name}</span>
                        {isClassSkill && <Badge variant="outline" className="text-[9px] px-1 py-0 shrink-0">C</Badge>}
                        {skillDef.trainedOnly && ranks === 0 && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0">T</Badge>
                        )}
                      </div>
                      <span className="font-bold shrink-0 ml-1">
                        {total !== null ? (total >= 0 ? '+' : '') + total : '--'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>

      {/* Features Section */}
      <CollapsibleSection title="Features & Spells" className="bg-section-features" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Feats & Class Features */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Feats & Features</CardTitle>
            </CardHeader>
            <CardContent>
              {character.featNames.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs text-muted-foreground font-medium mb-1">Feats</h4>
                  <div className="space-y-1">
                    {character.featNames.map((name) => {
                      const feat = FEATS_BY_NAME[name];
                      return (
                        <div key={name} className="text-sm p-1.5 border rounded">
                          <span className="font-medium">{name}</span>
                          {feat && <p className="text-xs text-muted-foreground mt-0.5">{feat.benefit}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-xs text-muted-foreground font-medium mb-1">Class Features (Lvl {character.level})</h4>
                <div className="space-y-1">
                  {cls.classFeatures
                    .filter((f) => f.level <= character.level)
                    .map((feature) => (
                      <div key={feature.name} className="text-sm p-1.5 border rounded">
                        <span className="font-medium">{feature.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Class Resources */}
          {cls.classResources && cls.classResources.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Class Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cls.classResources.map((resource) => {
                    const abilityMod = resource.name.toLowerCase().includes('rage') || resource.name.toLowerCase().includes('bloodrage')
                      ? stats.abilityModifiers.con
                      : resource.name.toLowerCase().includes('channel')
                        ? stats.abilityModifiers.cha
                        : resource.name.toLowerCase().includes('ki')
                          ? stats.abilityModifiers.wis
                          : resource.name.toLowerCase().includes('smite') || resource.name.toLowerCase().includes('lay on hands') || resource.name.toLowerCase().includes('panache')
                            ? stats.abilityModifiers.cha
                            : resource.name.toLowerCase().includes('bomb') || resource.name.toLowerCase().includes('arcane pool') || resource.name.toLowerCase().includes('inspiration')
                              ? stats.abilityModifiers.int
                              : 0;
                    const total = resource.getUsesAtLevel(character.level, abilityMod);
                    const used = character.classResourcesUsed[resource.name] ?? 0;
                    const remaining = total - used;

                    return (
                      <div key={resource.name} className="p-2 border rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{resource.name}</span>
                          <span className="text-sm font-bold">{remaining} / {total}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => store.useClassResource(resource.name)}
                            disabled={remaining <= 0}
                          >
                            Use
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => store.restoreClassResource(resource.name)}
                            disabled={used <= 0}
                          >
                            Restore
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spell Slots */}
          {stats.spellState.canCast && (
            <SpellSlotTracker
              spellState={stats.spellState}
              onUseSlot={store.useSpellSlot}
              onRestoreSlot={store.restoreSpellSlot}
            />
          )}

          {/* Spell Preparation (for prepared casters) */}
          {stats.spellState.canCast && isPreparedCaster(character.className) && (
            <SpellPreparation character={character} stats={stats} />
          )}

          {/* Spell List */}
          {stats.spellState.canCast && (
            <SpellList character={character} stats={stats} />
          )}
        </div>
      </CollapsibleSection>

      {/* Utility Section */}
      <CollapsibleSection title="Inventory & Utility" className="bg-section-utility" defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Equipment & Encumbrance */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Equipment</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={encumbrance.level === 'light' ? 'secondary' : encumbrance.level === 'overloaded' ? 'destructive' : 'default'}>
                    {encumbrance.totalWeight.toFixed(1)} lbs ({encumbrance.level})
                  </Badge>
                  <AddItemDialog
                    gold={character.inventory.gold}
                    onAddItem={store.addInventoryItem}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-2">
                Light: {encumbrance.lightMax}lb | Medium: {encumbrance.mediumMax}lb | Heavy: {encumbrance.heavyMax}lb
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {character.inventory.equipment.map((entry, i) => (
                  <div key={i} className={`flex items-center justify-between text-sm p-1 border rounded ${entry.equipped ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-2">
                      {(entry.type === 'weapon' || entry.type === 'armor') && (
                        <Checkbox
                          checked={entry.equipped ?? false}
                          onCheckedChange={() => store.toggleEquipped(i)}
                          title={entry.equipped ? 'Unequip' : 'Equip'}
                        />
                      )}
                      <span>
                        {entry.item.name}
                        {entry.quantity > 1 && <span className="text-muted-foreground"> x{entry.quantity}</span>}
                        {entry.equipped && <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">E</Badge>}
                        {entry.type === 'weapon' && entry.strengthRating !== undefined && entry.strengthRating > 0 && (
                          <Badge variant="secondary" className="ml-1 text-[9px] px-1 py-0">STR +{entry.strengthRating}</Badge>
                        )}
                        {entry.type === 'armor' && entry.material === 'mithral' && (
                          <Badge variant="secondary" className="ml-1 text-[9px] px-1 py-0">Mithral</Badge>
                        )}
                        {entry.type === 'armor' && entry.quality === 'masterwork' && entry.material !== 'mithral' && entry.material !== 'adamantine' && (
                          <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0">MW</Badge>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{entry.item.weight * entry.quantity} lb</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => store.removeInventoryItem(i)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {character.inventory.equipment.length === 0 && (
                  <p className="text-sm text-muted-foreground">No equipment.</p>
                )}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Gold:</span>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={character.inventory.gold}
                  onChange={(e) => store.setGold(parseFloat(e.target.value) || 0)}
                  className="w-24 h-7 text-sm"
                />
                <span className="text-muted-foreground">gp</span>
                {character.inventory.silver > 0 && <span className="text-muted-foreground">{character.inventory.silver} sp</span>}
                {character.inventory.copper > 0 && <span className="text-muted-foreground">{character.inventory.copper} cp</span>}
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
                {CONDITIONS.map((condition) => {
                  const isActive = character.conditions.includes(condition.name);
                  return (
                    <div
                      key={condition.name}
                      className={`flex items-center gap-2 p-1.5 rounded text-sm cursor-pointer transition-colors ${
                        isActive ? 'bg-destructive/10 border border-destructive/30' : 'hover:bg-muted'
                      }`}
                      onClick={() => store.toggleCondition(condition.name)}
                    >
                      <Checkbox checked={isActive} onChange={() => {}} />
                      <span className={isActive ? 'font-medium' : 'text-muted-foreground'}>
                        {condition.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Level History */}
          <LevelHistory levelHistory={character.levelHistory ?? []} />

          {/* Notes */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={character.notes}
                onChange={(e) => store.setNotes(e.target.value)}
                placeholder="Session notes, reminders, backstory..."
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      </CollapsibleSection>
    </div>
  );
}
