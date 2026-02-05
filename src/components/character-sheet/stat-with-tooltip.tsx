'use client';

import { ReactNode } from 'react';
import { StatBreakdown } from '@/types/breakdown';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

interface StatWithTooltipProps {
  breakdown: StatBreakdown;
  children: ReactNode;
}

export function StatWithTooltip({ breakdown, children }: StatWithTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="cursor-help">{children}</div>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-2 max-w-xs">
        <div className="space-y-0.5 font-mono text-xs">
          {breakdown.entries.map((entry, i) => (
            <div key={i} className="flex justify-between gap-4">
              <span>{entry.label}</span>
              <span>{entry.value >= 0 ? '+' : ''}{entry.value}</span>
            </div>
          ))}
          <div className="border-t border-current/20 pt-0.5 mt-1 flex justify-between gap-4 font-bold">
            <span>Total</span>
            <span>{breakdown.total}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
