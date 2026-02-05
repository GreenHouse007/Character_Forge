'use client';

import { WizardStepper } from '@/components/layout/wizard-stepper';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Character</h1>
      <WizardStepper />
      {children}
    </div>
  );
}
