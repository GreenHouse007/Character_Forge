'use client';

import { ReactNode, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  className?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  className,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={cn('rounded-lg p-4 space-y-4', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <ChevronDownIcon
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-200',
            !isOpen && '-rotate-90'
          )}
        />
      </button>
      {isOpen && children}
    </section>
  );
}
