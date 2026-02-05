'use client';

import { useCreationStore } from '@/stores/creation-store';
import { cn } from '@/lib/utils';

const STEPS = [
  { number: 1, name: 'Race' },
  { number: 2, name: 'Class' },
  { number: 3, name: 'Abilities' },
  { number: 4, name: 'Skills' },
  { number: 5, name: 'Feats' },
  { number: 6, name: 'Equipment' },
  { number: 7, name: 'Review' },
];

export function WizardStepper() {
  const currentStep = useCreationStore((s) => s.draft.currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                  step.number < currentStep && 'bg-primary border-primary text-primary-foreground',
                  step.number === currentStep && 'border-primary text-primary bg-primary/10',
                  step.number > currentStep && 'border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {step.number < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1 hidden sm:block',
                  step.number === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {step.name}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-2',
                  step.number < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
