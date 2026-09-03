'use client';

import React from 'react';
import { GlassCard, MoneyText, Icon, IconName } from '@/components/ui';
import { VaultMark } from '@/components/VaultMark';
import { formatMoney } from '@/lib/utils';

export function HeroBalance({
  label,
  amount,
  currency,
  sub,
  onAction,
  actionLabel,
}: {
  label: string;
  amount: number;
  currency: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-[16px] bg-gradient-to-br from-[var(--fv-secondary)] to-[var(--fv-primary)] p-5 text-white shadow-[var(--fv-shadow-card)]">
      <div aria-hidden className="pointer-events-none absolute -right-6 -top-6 opacity-25">
        <VaultMark size={130} subdued />
      </div>
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[rgba(255,255,255,0.78)]">{label}</p>
          <p className="mt-1.5 text-[30px] font-bold tabular-nums tracking-tight">{formatMoney(amount, currency)}</p>
          {sub ? <p className="mt-1 text-[12px] text-[rgba(255,255,255,0.72)]">{sub}</p> : null}
        </div>
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-full border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.12)] px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur transition-colors hover:bg-[rgba(255,255,255,0.22)]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export interface StatCardProps {
  label: string;
  value?: string;
  amount?: number;
  currency?: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string };
  sub?: string;
  loading?: boolean;
}

const trendColor = {
  up: 'text-[var(--fv-success)]',
  down: 'text-[var(--fv-error)]',
  neutral: 'text-[var(--fv-text-secondary)]',
} as const;

export function StatCard({ label, value, amount, currency, trend, sub, loading }: StatCardProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="mb-1 text-[13px] text-[var(--fv-text-secondary)]">{label}</p>
      {amount != null && currency ? (
        <MoneyText amount={amount} currency={currency} size="sm" color="text" />
      ) : (
        <p className="text-[20px] font-bold tabular-nums text-[var(--fv-text)]">
          {loading ? '—' : value ?? '—'}
        </p>
      )}
      {trend ? (
        <div className="mt-1 flex items-center gap-1">
          <Icon
            name={
              trend.direction === 'up'
                ? 'arrow-up-right'
                : trend.direction === 'down'
                  ? 'arrow-down-right'
                  : 'minus'
            }
            size={13}
            color={
              trend.direction === 'up'
                ? 'var(--fv-success)'
                : trend.direction === 'down'
                  ? 'var(--fv-error)'
                  : undefined
            }
            subdued={trend.direction === 'neutral'}
          />
          <span className={`text-[12px] font-semibold ${trendColor[trend.direction]}`}>
            {trend.label}
          </span>
        </div>
      ) : null}
      {sub ? <p className="mt-0.5 text-[12px] text-[var(--fv-text-secondary)]">{sub}</p> : null}
    </div>
  );
}

export interface QuickActionProps {
  icon: IconName;
  label: string;
  onPress?: () => void;
}

export function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex min-w-[64px] flex-col items-center gap-1.5"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
        <Icon name={icon} size={20} />
      </span>
      <span className="text-center text-[11px] font-medium text-[var(--fv-text-secondary)]">
        {label}
      </span>
    </button>
  );
}

export function QuickActionRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 flex justify-between gap-2">{children}</div>
  );
}

export function MetricsRow({ children }: { children: React.ReactNode }) {
  return (
    <GlassCard>
      <div className="flex gap-3">{children}</div>
    </GlassCard>
  );
}