'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, EmptyState, SectionHeader, Icon } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { HeroBalance, MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';
import { formatMoney } from '@/lib/utils';
import type { Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import type { MoneySummary } from '@/lib/hooks/use-money';

interface Props {
  name: string;
  summary: MoneySummary;
  accounts: Account[];
  goals: SavingsGoal[];
  invoices: Invoice[];
  budgets: Budget[];
  vendors: Vendor[];
  bills: BillPayment[];
  currency: string;
}

export function SMEHome({ name, summary, accounts, goals, invoices, budgets, vendors, bills, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const overBudgetLines = summary.budgetLines.filter((b) => b.spent > b.budget);
  const topVendor = vendors.length > 0 ? vendors.reduce((best, v) => (v.totalSpend > best.totalSpend ? v : best), vendors[0]) : null;

  return (
    <div>
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.cashPosition')}
        amount={summary.totalBalance}
        currency={currency}
        sub={t('home.sub.metricLine', { metric: t('home.metrics.revenue'), amount: formatMoney(summary.monthIncome, currency) })}
      />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard
            label={t('home.metrics.revenue')}
            amount={summary.monthIncome}
            currency={currency}
            trend={summary.monthIncome > 0 ? { direction: 'up', label: '+' } : { direction: 'neutral', label: '—' }}
          />
          <StatCard
            label={t('home.metrics.runway')}
            value={summary.runwayMonths > 0 ? String(summary.runwayMonths) : '—'}
            sub={t('home.sub.months')}
          />
        </MetricsRow>
        <div className="h-3" />
        <MetricsRow>
          <StatCard
            label={t('home.metrics.burnRate')}
            value={formatMoney(summary.monthExpense, currency)}
          />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="send" label={t('home.actions.payVendor')} onPress={() => router.push('/pay')} />
        <QuickAction icon="plus" label={t('home.actions.recordInvoice')} onPress={() => router.push('/invoices')} />
        <QuickAction icon="trending-up" label={t('home.actions.cashFlow')} onPress={() => router.push('/insights')} />
        <QuickAction icon="cpu" label={t('home.actions.advisor')} onPress={() => router.push('/coach')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.needsAttentionTitle')} />
        <GlassCard>
          {overBudgetLines.length > 0 ? (
            overBudgetLines.map((line) => (
              <div key={line.category} className="flex items-center gap-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[var(--fv-warning)]" />
                <p className="flex-1 text-[14px] text-[var(--fv-text)]">
                  {line.category}: {formatMoney(line.spent, currency)} / {formatMoney(line.budget, currency)}
                </p>
                <Icon name="chevron-right" size={16} subdued />
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[var(--fv-success)]" />
              <p className="flex-1 text-[14px] text-[var(--fv-text)]">{t('home.sme.noVendors')}</p>
              <Icon name="chevron-right" size={16} subdued />
            </div>
          )}
        </GlassCard>
      </div>

      {vendors.length > 0 ? (
        <div className="mb-4">
          <SectionHeader title={t('home.vendorsTitle')} />
          <GlassCard>
            <div className="flex items-center gap-3 py-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
                <Icon name="briefcase" size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[var(--fv-text)]">
                  {vendors.length} {t('home.sub.vendors')}
                </p>
                {topVendor ? (
                  <p className="mt-0.5 text-[13px] text-[var(--fv-text-secondary)]">
                    {t('home.sub.topVendor')}: {formatMoney(topVendor.totalSpend, currency)}
                  </p>
                ) : null}
              </div>
            </div>
          </GlassCard>
        </div>
      ) : null}

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}
