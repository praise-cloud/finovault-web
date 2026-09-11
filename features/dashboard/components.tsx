'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Button,
  EmptyState,
  GlassCard,
  Icon,
  IconName,
  MoneyText,
  ProgressRing,
  SectionHeader,
} from '@/components/ui';
import { formatMoney } from '@/lib/utils';
import { fvDate } from '@/lib/format-date';
import type { MoneySummary } from '@/lib/hooks/use-money';
import type { SavingsGoal } from '@/types';

/* Neo-brutalist card chrome shared by dashboard modules (DESIGN.md §5). */
export const cardClass =
  'rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]';

export interface HeroBalanceProps {
  label: string;
  amount: number;
  currency: string;
  sub?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function HeroBalance({ label, amount, currency, sub, actionLabel, onAction }: HeroBalanceProps) {
  return (
    <section id="mod-hero" aria-label={label} className={`${cardClass} mb-5 p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">{label}</p>
          <p className="mt-1 text-3xl sm:text-4xl md:text-5xl font-black tabular-nums tracking-tight text-[var(--fv-role-accent)]">
            {formatMoney(amount, currency)}
          </p>
          {sub ? <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[var(--fv-text-secondary)]">{sub}</p> : null}
        </div>
        {actionLabel ? <Button variant="primary" onPress={onAction} label={actionLabel} className="font-black uppercase tracking-wider" /> : null}
      </div>
    </section>
  );
}

export type StatCardProps = {
  label: string;
  value: number;
  currency: string;
};

export function StatCard({ label, value, currency }: StatCardProps) {
  return (
    <GlassCard className="flex flex-col justify-between p-4">
      <p className="text-xs font-medium text-[var(--fv-text-secondary)]">{label}</p>
      <MoneyText amount={value} currency={currency} className="mt-2 text-2xl font-bold" />
    </GlassCard>
  );
}

export interface QuickActionProps {
  icon: IconName;
  label: string;
  onPress: () => void;
}

export function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className="flex min-w-[64px] flex-col items-center gap-1.5 rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-2.5 shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000] transition-all duration-100 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#1A1A2E] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--fv-role-strong)] active:translate-y-0 active:shadow-none"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)]">
        <Icon name={icon} size={20} color="var(--fv-role-accent)" />
      </span>
      <span className="text-center text-[11px] font-black uppercase tracking-tight text-[var(--fv-text)]">{label}</span>
    </button>
  );
}

export function QuickActionRow({ actions }: { actions: QuickActionProps[] }) {
  const { t } = useTranslation();
  return (
    <section id="mod-actions" aria-label={t('home.quickActionsTitle')} className="mb-4 grid grid-cols-4 gap-2">
      {actions.map((action) => (
        <QuickAction key={action.label} {...action} />
      ))}
    </section>
  );
}

export function MetricsRow({ metrics }: { metrics: StatCardProps[] }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      {metrics.map((metric) => (
        <StatCard key={metric.label} {...metric} />
      ))}
    </div>
  );
}

/* ---------- Insight (coach) card ---------- */

export interface InsightCardProps {
  title: string;
  bullets: string[];
}

export function InsightCard({ title, bullets }: InsightCardProps) {
  const { t } = useTranslation();
  return (
    <section id="mod-insights" aria-labelledby="mod-insights-title" className="mb-5">
      <SectionHeader id="mod-insights-title" title={t('home.needsAttentionTitle')} />
      <div className={`${cardClass} p-5`}>
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-role-wash)] text-[var(--fv-role-strong)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
            <Icon name="cpu" size={22} color="var(--fv-role-strong)" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-base font-black uppercase tracking-tight text-[var(--fv-text)]">{title}</p>
            {bullets.map((bullet) => (
              <p key={bullet} className="mt-1.5 text-xs font-semibold leading-relaxed text-[var(--fv-text-secondary)]">
                {bullet}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Goals progress ---------- */

export function GoalsProgressList({
  goals,
  currency,
  loading,
}: {
  goals: SavingsGoal[];
  currency: string;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const active = goals.filter((goal) => !goal.completed).slice(0, 3);
  return (
    <section id="mod-goals" aria-labelledby="mod-goals-title" className="mb-5">
      <SectionHeader id="mod-goals-title" title={t('home.savingsTitle')} />
      {loading ? (
        <div className={`${cardClass} flex flex-col gap-3 p-4`}>
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-[10px] border-2 border-dashed border-[var(--fv-border-subtle)]"
            />
          ))}
        </div>
      ) : active.length === 0 ? (
        <div className={`${cardClass} p-5`}>
          <EmptyState
            title={t('home.emptyTitle')}
            body={t('home.emptyBody')}
            ctaLabel={t('home.emptyCta')}
            onCta={() => router.push('/vault')}
          />
        </div>
      ) : (
        <div className={`${cardClass} flex flex-col p-3`}>
          {active.map((goal) => {
            const pct =
              goal.targetAmount > 0
                ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                : 0;
            return (
              <div key={goal.id} className="flex items-center gap-3.5 px-2 py-3 border-b border-[var(--fv-border-subtle)] last:border-b-0">
                <ProgressRing
                  progress={pct}
                  size={32}
                  strokeWidth={5}
                  accessibilityLabel={`${goal.name} ${pct}%`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black uppercase tracking-tight text-[var(--fv-text)]">{goal.name}</p>
                  <p className="text-xs font-semibold text-[var(--fv-text-secondary)]">
                    {formatMoney(goal.currentAmount, currency)} ·{' '}
                    {t('home.ofGoal', { amount: formatMoney(goal.targetAmount, currency) })}
                  </p>
                </div>
                <span className="shrink-0 rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-role-wash)] px-2.5 py-0.5 text-xs font-black tabular-nums text-[var(--fv-role-strong)] shadow-[1px_1px_0_0_#1A1A2E]">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------- Recent activity ---------- */

export interface MiniTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
}

export function RecentTransactionsMini({
  items,
  currency,
  loading,
}: {
  items: MiniTransaction[];
  currency: string;
  loading?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  return (
    <section id="mod-recent" aria-labelledby="mod-recent-title" className="mb-5">
      <SectionHeader id="mod-recent-title" title={t('home.recentActivityTitle')} />
      <div className={`${cardClass} p-3`}>
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-[10px] border-2 border-dashed border-[var(--fv-border-subtle)]"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-3">
            <EmptyState
              title={t('home.emptyTitle')}
              body={t('home.emptyBody')}
              ctaLabel={t('home.emptyCta')}
              onCta={() => router.push('/transactions')}
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((tx) => {
              const negative = tx.amount < 0;
              return (
                <div key={tx.id} className="flex items-center justify-between gap-3 px-2 py-3 border-b border-[var(--fv-border-subtle)] last:border-b-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[var(--fv-text)]">{tx.title}</p>
                    <p className="text-xs font-semibold text-[var(--fv-text-secondary)]">
                      {fvDate(tx.date, i18n.language)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-black tabular-nums ${
                      negative ? 'text-[var(--fv-text)]' : 'text-[var(--fv-role-accent)]'
                    }`}
                  >
                    {negative ? '−' : '+'}
                    {formatMoney(Math.abs(tx.amount), currency)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => router.push('/transactions')}
            className="flex w-full items-center justify-between px-2.5 pb-1 pt-2 text-xs font-black uppercase tracking-wider text-[var(--fv-role-strong)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--fv-role-strong)] hover:opacity-80"
          >
            {t('home.seeAll')}
            <Icon name="chevron-right" size={16} color="var(--fv-role-strong)" />
          </button>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Money Coach CTA ---------- */

export function CoachCtaCard() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <section id="mod-coach" aria-label={t('home.coachCtaTitle')} className="mb-5 rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-role-accent)] p-5 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-black uppercase tracking-tight text-[var(--fv-on-fill)]">{t('home.coachCtaTitle')}</p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--fv-on-fill)]/90">{t('home.coachCtaBody')}</p>
        </div>
        <Button
          variant="secondary"
          onPress={() => router.push('/coach')}
          label={t('home.coachCtaAction')}
          className="font-black uppercase tracking-wider text-xs"
        />
      </div>
    </section>
  );
}

/* ---------- Compliance (SME) ---------- */

// ponytail: static EN seed rows — replace with i18n templated rows once the backend exposes compliance items.
const complianceRows: { label: string; date: string }[] = [
  { label: 'MRA tax deposit', date: '2026-09-30' },
  { label: 'MRA tax deposit', date: '2026-10-15' },
  { label: 'MRA filing Q3', date: '2026-10-31' },
  { label: 'Annual return', date: '2026-12-31' },
  { label: 'MRA tax deposit', date: '2027-01-15' },
];

export function ComplianceCard() {
  const { t, i18n } = useTranslation();
  const [now] = useState(() => Date.now());
  return (
    <section id="mod-compliance" aria-labelledby="mod-compliance-title" className="mb-5">
      <SectionHeader id="mod-compliance-title" title={t('home.complianceTitle')} />
      <div className={`${cardClass} p-3`}>
        {complianceRows.map((row) => {
          const days = Math.ceil((new Date(`${row.date}T00:00:00`).getTime() - now) / 86400000);
          const status = days < 0 ? 'expired' : days <= 14 ? 'attention' : 'ok';
          const chipKey: 'statusOk' | 'statusWarn' | 'statusExpired' =
            status === 'expired' ? 'statusExpired' : status === 'attention' ? 'statusWarn' : 'statusOk';
          const iconName: IconName =
            status === 'expired' ? 'triangle-alert' : status === 'attention' ? 'clock' : 'circle-check';
          return (
            <div key={row.date} className="flex items-center gap-3 px-2 py-3 border-b border-[var(--fv-border-subtle)] last:border-b-0">
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center ${
                  status === 'expired'
                    ? 'text-[var(--fv-error)]'
                    : status === 'attention'
                      ? 'text-[var(--fv-warning)]'
                      : 'text-[var(--fv-success)]'
                }`}
              >
                <Icon name={iconName} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[var(--fv-text)]">{row.label}</p>
                <p className="text-xs font-semibold text-[var(--fv-text-secondary)]">{fvDate(row.date, i18n.language)}</p>
              </div>
              <span className="shrink-0 rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[1px_1px_0_0_#1A1A2E]">
                {t(`home.compliance.${chipKey}`)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-[11px] font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">{t('home.complianceNote')}</p>
    </section>
  );
}

/* ---------- Cash flow (SME) ---------- */

export function CashFlowCard({
  balance,
  runway,
  currency,
  loading,
}: {
  balance: number;
  runway: number;
  currency: string;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const pct = Math.max(0, Math.min(100, (runway / 12) * 100));
  return (
    <section id="mod-cashflow" aria-label={t('home.metrics.cashPosition')} className={`${cardClass} mb-5 p-5`}>
      <p className="text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">{t('home.metrics.cashPosition')}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-black tabular-nums text-[var(--fv-text)]">
        {loading ? '—' : formatMoney(balance, currency)}
      </p>
      <div className="mt-3.5 h-3 overflow-hidden rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)]">
        <div className="h-full bg-[var(--fv-role-accent)] transition-all" style={{ width: `${loading ? 0 : pct}%` }} />
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">
        {runway} {t('home.sub.months')}
      </p>
      <Button variant="primary" className="mt-4 w-full font-black uppercase tracking-wider" onPress={() => router.push('/pay')} label={t('home.actions.payVendor')} />
    </section>
  );
}

/* ---------- Business metrics (Entrepreneur) ---------- */

export function BusinessMetricsCard({
  summary,
  currency,
  loading,
}: {
  summary: MoneySummary;
  currency: string;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const net = summary.monthIncome - summary.monthExpense;
  const cells: { label: string; value: string; tone: 'text' | 'success' | 'error' }[] = [
    { label: t('home.metrics.revenueMrr'), value: formatMoney(summary.monthIncome, currency), tone: 'text' },
    { label: t('home.metrics.burnRate'), value: formatMoney(summary.monthExpense, currency), tone: 'text' },
    { label: t('home.metrics.runway'), value: `${summary.runwayMonths} ${t('home.sub.months')}`, tone: 'text' },
    { label: t('home.metrics.revenue'), value: formatMoney(net, currency), tone: net >= 0 ? 'success' : 'error' },
  ];
  const toneClass = { text: 'text-[var(--fv-text)]', success: 'text-[var(--fv-success)]', error: 'text-[var(--fv-error)]' };
  return (
    <section id="mod-metrics" aria-label={t('home.metrics.title')} className="mb-5 grid grid-cols-2 gap-3">
      {cells.map((cell) => (
        <div key={cell.label} className="rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-3.5 shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000]">
          <p className="text-[11px] font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">{cell.label}</p>
          <p className={`mt-1 text-xl sm:text-2xl font-black tabular-nums ${toneClass[cell.tone]}`}>
            {loading ? '—' : cell.value}
          </p>
        </div>
      ))}
    </section>
  );
}