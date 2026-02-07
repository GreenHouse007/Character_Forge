'use client';

import { ReactNode } from 'react';
import { StatBreakdown } from '@/types/breakdown';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

interface StatWithTooltipProps {
  breakdown: StatBreakdown;
  label?: string;
  children: ReactNode;
}

export function StatWithTooltip({ breakdown, label, children }: StatWithTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-help relative">
          {children}
          <span className="absolute top-0.5 right-0.5 text-[8px] text-muted-foreground/60 leading-none select-none">i</span>
        </div>
      </PopoverTrigger>
      <PopoverContent side="top" className="p-3 w-auto min-w-[200px] max-w-xs">
        <div className="space-y-1 font-mono text-sm">
          {label && (
            <div className="text-xs font-sans font-semibold text-muted-foreground mb-2">
              {label}
            </div>
          )}
          {breakdown.entries.map((entry, i) => (
            <div key={i} className="flex justify-between gap-6">
              <span className="text-muted-foreground">{entry.label}</span>
              <span className={
                entry.value > 0 ? 'text-green-600 dark:text-green-400' :
                entry.value < 0 ? 'text-red-600 dark:text-red-400' :
                ''
              }>
                {entry.value >= 0 ? '+' : ''}{entry.value}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-1.5 mt-2 flex justify-between gap-6 font-bold text-base">
            <span>Total</span>
            <span>= {breakdown.total}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
