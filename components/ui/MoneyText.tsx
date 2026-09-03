import React from 'react';
import { formatMoney } from '@/lib/utils';

export interface MoneyTextProps {
  amount: number;
  currency: string;
  size?: 'lg' | 'md' | 'sm';
  color?: 'accent' | 'text' | 'success' | 'error';
  showSign?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<MoneyTextProps['size']>, string> = {
  lg: 'text-[40px]',
  md: 'text-[20px]',
  sm: 'text-[16px]',
};

const colorClasses: Record<NonNullable<MoneyTextProps['color']>, string> = {
  accent: 'text-[var(--fv-primary)]',
  text: 'text-[var(--fv-text)]',
  success: 'text-[var(--fv-success)]',
  error: 'text-[var(--fv-error)]',
};

export function MoneyText({
  amount,
  currency,
  size = 'md',
  color = 'accent',
  showSign = false,
  className = '',
}: MoneyTextProps) {
  const value = Math.abs(amount);
  const sign = showSign ? (amount > 0 ? '+' : amount < 0 ? '−' : '') : '';

  return (
    <span
      className={`tabular-nums font-bold ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    >
      {sign}
      {formatMoney(value, currency)}
    </span>
  );
}