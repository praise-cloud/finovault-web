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
  primary: 'bg-[var(--fv-accent)] text-[var(--fv-primary)] hover:opacity-90',
  secondary:
    'bg-transparent border-2 border-[var(--fv-accent)] text-[var(--fv-accent)] hover:opacity-80',
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
      className={`min-h-[52px] rounded-[12px] px-6 py-3 font-semibold text-base transition-transform active:scale-[0.98] ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-40' : ''} ${variantClasses[variant]} ${className}`}
    >
      {loading ? <span aria-live="polite">…</span> : label}
    </button>
  );
}