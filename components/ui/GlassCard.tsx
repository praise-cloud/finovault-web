import React from 'react';

type GlassCardVariant = 'default' | 'elevated' | 'interactive' | 'danger';

export interface GlassCardProps {
  children: React.ReactNode;
  variant?: GlassCardVariant;
  onPress?: () => void;
  padding?: number;
  className?: string;
}

export function GlassCard({
  children,
  variant = 'default',
  onPress,
  padding = 16,
  className = '',
}: GlassCardProps) {
  const base = 'rounded-[12px] border-2 bg-[var(--fv-surface-glass)]';
  const variantClass =
    variant === 'danger'
      ? 'border-[var(--fv-error)] shadow-[var(--fv-shadow-hard-sm)]'
      : variant === 'elevated'
        ? 'border-[var(--fv-border-ink)] shadow-[var(--fv-shadow-hard)]'
        : variant === 'interactive'
          ? 'border-[var(--fv-border-ink)] shadow-[var(--fv-shadow-hard-sm)] cursor-pointer transition-all duration-150 hover:-translate-y-px hover:shadow-[var(--fv-shadow-hard)] active:translate-y-px active:shadow-none'
          : 'border-[var(--fv-border-ink)] shadow-[var(--fv-shadow-hard-sm)]';

  const style = { padding };

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={`${base} ${variantClass} ${className}`}
        style={style}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={`${base} ${variantClass} ${className}`} style={style}>
      {children}
    </div>
  );
}