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
  const base =
    'rounded-[14px] border bg-[var(--fv-surface-glass)] shadow-[var(--fv-shadow-card)]';
  const variantClass =
    variant === 'danger'
      ? 'border-[var(--fv-error)]'
      : variant === 'elevated'
        ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
        : 'border-[var(--fv-gold-border)]';

  const style = {
    padding,
  };

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={`${base} ${variantClass} transition-opacity hover:opacity-90 ${className}`}
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