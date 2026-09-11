'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--fv-primary)] text-[var(--fv-on-fill)] border-2 border-[var(--fv-border-ink)] shadow-[var(--fv-shadow-hard-sm)] hover:bg-[var(--fv-primary-light)] hover:-translate-y-px hover:shadow-[var(--fv-shadow-hard)]',
  secondary:
    'bg-[var(--fv-surface)] border-2 border-[var(--fv-border-ink)] text-[var(--fv-primary)] shadow-[var(--fv-shadow-hard-sm)] hover:-translate-y-px hover:shadow-[var(--fv-shadow-hard)]',
  ghost: 'bg-transparent text-[var(--fv-text-secondary)] hover:opacity-80',
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={isDisabled}
      aria-label={label}
      className={`min-h-[52px] rounded-[12px] px-6 py-3 font-semibold text-base transition-all active:translate-y-px active:shadow-none ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-40' : ''} ${variantClasses[variant]} ${className}`}
    >
      {loading ? <span aria-live="polite">…</span> : label}
    </button>
  );
}