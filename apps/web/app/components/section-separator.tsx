import React from 'react';
import { cn } from '@repo/ui/lib/utils';

interface SectionSeparatorProps {
  className?: string;
}

export const SectionSeparator = ({ className }: SectionSeparatorProps) => {
  return (
    <div
      className={cn('w-full h-px', className)}
      style={{
        background: 'var(--ui-05-b, #B80022)',
      }}
      role='separator'
    />
  );
};
