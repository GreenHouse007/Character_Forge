'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCharacter } from '@/hooks/use-character';
import { useDerivedStats } from '@/hooks/use-derived-stats';
import { useCharacterStore } from '@/stores/character-store';
import { classes } from '@/data/classes';
import { races } from '@/data/races';
import { SKILLS_BY_NAME, SKILLS } from '@/data/skills';
import { ALL_FEATS, FEATS_BY_NAME } from '@/data/feats';
import { checkPrerequisites, buildPrerequisiteContext } from '@/lib/prerequisites';
import { getLevelUpRequirements } from '@/lib/level-up';
import { LevelUpRecord } from '@/types/character';
import { AbilityScore, ABILITY_SCORES, ABILITY_SCORE_LABELS, SkillName } from '@/types/common';
import { getAbilityModifier } from '@/lib/spell-slots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const PAGE_SIZE = 50;

type Step = 'overview' | 'hp' | 'ability' | 'feat' | 'bonusFeat' | 'skills' | 'summary';

export default function LevelUpPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const character = useCharacter(id);
  const stats = useDerivedStats(character);
  const store = useCharacterStore();

  const [step, setStep] = useState<Step>('overview');
  const [hpRolled, setHpRolled] = useState(0);
  const [abilityIncrease, setAbilityIncrease] = useState<AbilityScore | null>(null);
  const [featChosen, setFeatChosen] = useState<string | null>(null);
  const [bonusFeatChosen, setBonusFeatChosen] = useState<string | null>(null);
  const [skillAllocations, setSkillAllocations] = useState<Record<string, number>>({});
  const [featFilter, setFeatFilter] = useState('');
  const [featVisibleCount, setFeatVisibleCount] = useState(PAGE_SIZE);
  const [bonusFeatVisibleCount, setBonusFeatVisibleCount] = useState(PAGE_SIZE);

  const cls = character ? classes[character.className] : null;
  const race = character ? races[character.race] : null;

  const requirements = useMemo(() => {
    if (!character || !cls || !stats) return null;
    return getLevelUpRequirements(character, cls, stats.abilityModifiers.int, character.race === 'Human');
  }, [character, cls, stats]);

  // Determine step flow
  const stepOrder = useMemo(() => {
    if (!requirements) return ['overview'] as Step[];
    const steps: Step[] = ['overview', 'hp'];
    if (requirements.needsAbilityIncrease) steps.push('ability');
    if (requirements.needsFeat) steps.push('feat');
    if (requirements.needsBonusFeat) steps.push('bonusFeat');
    steps.push('skills', 'summary');
    return steps;
  }, [requirements]);

  const nextStep = () => {
    const idx = stepOrder.indexOf(step);
    if (idx < stepOrder.length - 1) setStep(stepOrder[idx + 1]);
  };

  const prevStep = () => {
    const idx = stepOrder.indexOf(step);
    if (idx > 0) setStep(stepOrder[idx - 1]);
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setFeatVisibleCount(PAGE_SIZE);
    setBonusFeatVisibleCount(PAGE_SIZE);
  }, [featFilter]);

  const totalSkillRanksAllocated = Object.values(skillAllocations).reduce((s, v) => s + v, 0);

  const handleRollHP = () => {
    if (!cls) return;
    const roll = Math.floor(Math.random() * cls.hitDie) + 1;
    setHpRolled(roll);
  };

  const handleTakeAverage = () => {
    if (!cls) return;
    setHpRolled(Math.ceil(cls.hitDie / 2) + 1);
  };

  const handleConfirm = () => {
    if (!character || !requirements) return;

    const skillRanksAllocated = Object.entries(skillAllocations)
      .filter(([, ranks]) => ranks > 0)
      .map(([skill, ranks]) => ({ skill: skill as SkillName, ranks }));

    const record: LevelUpRecord = {
      levelNumber: requirements.newLevel,
      hpRolled,
      skillRanksAllocated,
      featChosen: featChosen ?? undefined,
      bonusFeatChosen: bonusFeatChosen ?? undefined,
      abilityScoreIncrease: abilityIncrease ?? undefined,
      timestamp: new Date().toISOString(),
    };

    store.levelUp(record);
    router.push(`/characters/${id}`);
  };

  if (!character || !stats || !requirements || !cls || !race) {
    return <div className="text-center py-20 text-muted-foreground">Loading...</div>;
  }

  // Build prerequisite context for feat selection (at new level)
  const prereqContext = buildPrerequisiteContext(
    stats.finalAbilityScores,
    requirements.newLevel,
    cls.babProgression,
    cls.name,
    [...character.featNames, ...(featChosen ? [featChosen] : [])],
    character.skills,
    cls.classFeatures.filter((f) => f.level <= requirements.newLevel).map((f) => f.name.toLowerCase()),
    cls.spellProgression.type !== 'none' ? requirements.newLevel : 0
  );

  // Filtered feat lists
  const filteredFeats = ALL_FEATS
    .filter((f) => !featFilter || f.name.toLowerCase().includes(featFilter.toLowerCase()))
    .filter((f) => !character.featNames.includes(f.name));

  const filteredBonusFeats = ALL_FEATS
    .filter((f) => !featFilter || f.name.toLowerCase().includes(featFilter.toLowerCase()))
    .filter((f) => !character.featNames.includes(f.name) && f.name !== featChosen)
    .filter((f) => {
      // Filter by bonus feat type
      if (requirements.bonusFeatNote?.includes('Combat') || requirements.bonusFeatNote?.includes('combat')) {
        return f.categories.includes('Combat');
      }
      return true;
    });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Level Up: {character.name}</h1>
        <p className="text-muted-foreground">
          {character.className} {character.level} &rarr; {requirements.newLevel}
        </p>
      </div>

      {/* Overview */}
      {step === 'overview' && (
        <Card>
          <CardHeader>
            <CardTitle>Leveling to {requirements.newLevel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">Here&apos;s what you gain at level {requirements.newLevel}:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge>HP</Badge>
                <span className="text-sm">Roll 1d{requirements.hpDie} + CON mod ({stats.abilityModifiers.con >= 0 ? '+' : ''}{stats.abilityModifiers.con})</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Skills</Badge>
                <span className="text-sm">{requirements.skillRanksAvailable} skill rank{requirements.skillRanksAvailable !== 1 ? 's' : ''} to allocate</span>
              </div>
              {requirements.needsFeat && (
                <div className="flex items-center gap-2">
                  <Badge>Feat</Badge>
                  <span className="text-sm">Choose a new feat</span>
                </div>
              )}
              {requirements.needsBonusFeat && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Bonus Feat</Badge>
                  <span className="text-sm">{requirements.bonusFeatNote}</span>
                </div>
              )}
              {requirements.needsAbilityIncrease && (
                <div className="flex items-center gap-2">
                  <Badge>Ability +1</Badge>
                  <span className="text-sm">Increase one ability score by 1</span>
                </div>
              )}
              {requirements.newClassFeatures.length > 0 && (
                <div>
                  <span className="text-sm font-medium">New Class Features:</span>
                  {requirements.newClassFeatures.map((f) => (
                    <div key={f.name} className="ml-4 text-sm mt-1">
                      <span className="font-medium">{f.name}</span>
                      <span className="text-muted-foreground"> — {f.description}</span>
                    </div>
                  ))}
                </div>
              )}
              {requirements.gainsNewSpellLevel && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Spells</Badge>
                  <span className="text-sm">Access to a new spell level</span>
                </div>
              )}
            </div>
            <div className="pt-4">
              <Button onClick={nextStep}>Begin Level Up</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* HP Roll */}
      {step === 'hp' && (
        <Card>
          <CardHeader>
            <CardTitle>Hit Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Roll 1d{requirements.hpDie} for HP (+ CON modifier of {stats.abilityModifiers.con >= 0 ? '+' : ''}{stats.abilityModifiers.con}).</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRollHP}>Roll d{requirements.hpDie}</Button>
              <Button variant="outline" onClick={handleTakeAverage}>
                Take Average ({Math.ceil(requirements.hpDie / 2) + 1})
              </Button>
            </div>
            {hpRolled > 0 && (
              <div className="p-3 border rounded">
                <span className="text-sm">Rolled: <span className="font-bold text-lg">{hpRolled}</span></span>
                <span className="text-sm text-muted-foreground"> + {stats.abilityModifiers.con} CON = </span>
                <span className="font-bold text-lg">{hpRolled + stats.abilityModifiers.con} HP gained</span>
              </div>
            )}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={hpRolled <= 0}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ability Score Increase */}
      {step === 'ability' && (
        <Card>
          <CardHeader>
            <CardTitle>Ability Score Increase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Choose one ability score to increase by +1.</p>
            <div className="grid grid-cols-3 gap-2">
              {ABILITY_SCORES.map((a) => {
                const current = stats.finalAbilityScores[a];
                const selected = abilityIncrease === a;
                return (
                  <button
                    key={a}
                    className={`p-3 border rounded text-center transition-colors ${
                      selected ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                    }`}
                    onClick={() => setAbilityIncrease(a)}
                  >
                    <div className="text-xs text-muted-foreground">{ABILITY_SCORE_LABELS[a]}</div>
                    <div className="text-lg font-bold">{current} {selected ? `→ ${current + 1}` : ''}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!abilityIncrease}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feat Selection */}
      {step === 'feat' && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Feat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search feats..."
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              className="w-64"
            />
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredFeats.slice(0, featVisibleCount).map((feat) => {
                  const selected = featChosen === feat.name;
                  return (
                    <div
                      key={feat.name}
                      className={`p-2 border rounded text-sm cursor-pointer transition-colors ${
                        selected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setFeatChosen(feat.name)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{feat.name}</span>
                        {feat.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-[9px]">{cat}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{feat.shortDescription}</p>
                      {feat.prerequisitesText !== 'None' && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          <span className="font-medium">Prereqs:</span> {feat.prerequisitesText}
                        </p>
                      )}
                    </div>
                  );
                })}
              {filteredFeats.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No feats match your search.</p>
              )}
              {featVisibleCount < filteredFeats.length && (
                <div className="text-center py-2">
                  <Button variant="outline" size="sm" onClick={() => setFeatVisibleCount((c) => c + PAGE_SIZE)}>
                    Show more ({filteredFeats.length - featVisibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!featChosen}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bonus Feat */}
      {step === 'bonusFeat' && (
        <Card>
          <CardHeader>
            <CardTitle>Bonus Feat: {requirements.bonusFeatNote}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Search feats..."
              value={featFilter}
              onChange={(e) => setFeatFilter(e.target.value)}
              className="w-64"
            />
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredBonusFeats.slice(0, bonusFeatVisibleCount).map((feat) => {
                  const selected = bonusFeatChosen === feat.name;
                  return (
                    <div
                      key={feat.name}
                      className={`p-2 border rounded text-sm cursor-pointer transition-colors ${
                        selected ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setBonusFeatChosen(feat.name)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{feat.name}</span>
                        {feat.categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-[9px]">{cat}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{feat.shortDescription}</p>
                    </div>
                  );
                })}
              {filteredBonusFeats.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No feats match your search.</p>
              )}
              {bonusFeatVisibleCount < filteredBonusFeats.length && (
                <div className="text-center py-2">
                  <Button variant="outline" size="sm" onClick={() => setBonusFeatVisibleCount((c) => c + PAGE_SIZE)}>
                    Show more ({filteredBonusFeats.length - bonusFeatVisibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep} disabled={!bonusFeatChosen}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Ranks */}
      {step === 'skills' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Allocate Skill Ranks</CardTitle>
              <Badge variant={totalSkillRanksAllocated <= requirements.skillRanksAvailable ? 'secondary' : 'destructive'}>
                {totalSkillRanksAllocated} / {requirements.skillRanksAvailable}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Max ranks per skill at level {requirements.newLevel}: {requirements.newLevel}
            </p>
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {SKILLS.map((skillDef) => {
                const currentRanks = character.skills.find((s) => s.name === skillDef.name)?.ranks ?? 0;
                const allocated = skillAllocations[skillDef.name] ?? 0;
                const isClassSkill = cls.classSkills.includes(skillDef.name);
                const maxCanAdd = requirements.newLevel - currentRanks;

                return (
                  <div key={skillDef.name} className="flex items-center justify-between p-1.5 border rounded text-sm">
                    <div className="flex items-center gap-1">
                      <span>{skillDef.name}</span>
                      {isClassSkill && <Badge variant="outline" className="text-[9px] px-1 py-0">C</Badge>}
                      <span className="text-xs text-muted-foreground">({currentRanks} ranks)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={allocated <= 0}
                        onClick={() =>
                          setSkillAllocations((prev) => ({
                            ...prev,
                            [skillDef.name]: (prev[skillDef.name] ?? 0) - 1,
                          }))
                        }
                      >
                        -
                      </Button>
                      <span className="w-6 text-center font-bold">{allocated}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={
                          allocated >= maxCanAdd ||
                          totalSkillRanksAllocated >= requirements.skillRanksAvailable
                        }
                        onClick={() =>
                          setSkillAllocations((prev) => ({
                            ...prev,
                            [skillDef.name]: (prev[skillDef.name] ?? 0) + 1,
                          }))
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={nextStep}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary / Confirm */}
      {step === 'summary' && (
        <Card>
          <CardHeader>
            <CardTitle>Level Up Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>New Level:</span>
                <span className="font-bold">{requirements.newLevel}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>HP Gained:</span>
                <span className="font-bold">{hpRolled} + {stats.abilityModifiers.con} CON = {hpRolled + stats.abilityModifiers.con}</span>
              </div>
              {abilityIncrease && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Ability Increase:</span>
                    <span className="font-bold">{ABILITY_SCORE_LABELS[abilityIncrease]} +1</span>
                  </div>
                </>
              )}
              {featChosen && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Feat:</span>
                    <span className="font-bold">{featChosen}</span>
                  </div>
                </>
              )}
              {bonusFeatChosen && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Bonus Feat:</span>
                    <span className="font-bold">{bonusFeatChosen}</span>
                  </div>
                </>
              )}
              {totalSkillRanksAllocated > 0 && (
                <>
                  <Separator />
                  <div>
                    <span>Skill Ranks:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(skillAllocations)
                        .filter(([, v]) => v > 0)
                        .map(([skill, ranks]) => (
                          <Badge key={skill} variant="secondary">{skill} +{ranks}</Badge>
                        ))}
                    </div>
                  </div>
                </>
              )}
              {requirements.newClassFeatures.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <span>New Class Features:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {requirements.newClassFeatures.map((f) => (
                        <Badge key={f.name} variant="outline">{f.name}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={handleConfirm}>Confirm Level Up</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
