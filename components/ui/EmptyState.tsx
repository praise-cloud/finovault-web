'use client';

import React from 'react';
import { Button } from './Button';
import { VaultMark } from '../VaultMark';

export interface EmptyStateProps {
  title: string;
  body?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
}

export function EmptyState({ title, body, ctaLabel, onCta, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      <VaultMark size={56} subdued />
      <h3 className="text-center text-lg font-semibold text-[var(--fv-text)]">{title}</h3>
      {body ? (
        <p className="max-w-[280px] text-center text-[15px] leading-[21px] text-[var(--fv-text-secondary)]">
          {body}
        </p>
      ) : null}
      {ctaLabel && onCta ? (
        <Button label={ctaLabel} onPress={onCta} fullWidth className="mt-2 min-w-[200px]" />
      ) : null}
    </div>
  );
}