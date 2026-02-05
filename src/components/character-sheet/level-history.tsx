'use client';

import { useState } from 'react';
import { LevelUpRecord } from '@/types/character';
import { ABILITY_SCORE_LABELS } from '@/types/common';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LevelHistoryProps {
  levelHistory: LevelUpRecord[];
}

export function LevelHistory({ levelHistory }: LevelHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (levelHistory.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Level History</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-2">
            {levelHistory.map((record) => (
              <div key={record.levelNumber} className="p-2 border rounded text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Level {record.levelNumber}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">HP +{record.hpRolled}</Badge>
                  {record.abilityScoreIncrease && (
                    <Badge variant="secondary">
                      {ABILITY_SCORE_LABELS[record.abilityScoreIncrease]} +1
                    </Badge>
                  )}
                  {record.featChosen && <Badge>{record.featChosen}</Badge>}
                  {record.bonusFeatChosen && <Badge variant="secondary">{record.bonusFeatChosen}</Badge>}
                  {record.skillRanksAllocated.length > 0 && (
                    <Badge variant="outline">
                      {record.skillRanksAllocated.reduce((s, a) => s + a.ranks, 0)} skill ranks
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
