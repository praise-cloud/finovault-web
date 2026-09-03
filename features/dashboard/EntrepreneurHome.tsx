'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, EmptyState, SectionHeader, Icon } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { HeroBalance, MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';
import { formatMoney } from '@/lib/utils';
import { GrantOpportunities } from '@/features/grants/GrantOpportunities';
import type { Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import type { MoneySummary } from '@/lib/hooks/use-money';

interface Props {
  name: string;
  femaleFounder: boolean;
  summary: MoneySummary;
  accounts: Account[];
  goals: SavingsGoal[];
  invoices: Invoice[];
  budgets: Budget[];
  vendors: Vendor[];
  bills: BillPayment[];
  currency: string;
}

export function EntrepreneurHome({ name, femaleFounder, summary, accounts, goals, invoices, budgets, vendors, bills, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const pensionGoal = goals.find((g) => g.type === 'pensionLinked');

  return (
    <div>
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.combinedWealth')}
        amount={summary.totalBalance}
        currency={currency}
        sub={t('home.sub.metricLine', { metric: t('home.metrics.revenueMrr'), amount: formatMoney(summary.monthIncome, currency) })}
      />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard
            label={t('home.metrics.revenueMrr')}
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
            sub={t('home.sub.perMonth')}
          />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="trending-up" label={t('home.actions.cashFlow')} onPress={() => router.push('/insights')} />
        <QuickAction icon="briefcase" label={t('home.actions.grants')} onPress={() => router.push('/insights')} />
        <QuickAction icon="send" label={t('home.actions.transfer')} onPress={() => router.push('/pay')} />
        <QuickAction icon="cpu" label={t('home.actions.coach')} onPress={() => router.push('/coach')} />
      </QuickActionRow>

      {femaleFounder ? (
        <div className="mb-4">
          <GrantOpportunities />
        </div>
      ) : null}

      {pensionGoal ? (
        <div className="mb-4">
          <SectionHeader title={t('home.pensionTitle')} />
          <GlassCard className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
              <Icon name="lock" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[var(--fv-text)]">{pensionGoal.name}</p>
              <p className="mt-0.5 text-[13px] text-[var(--fv-text-secondary)]">
                {formatMoney(pensionGoal.currentAmount, currency)} / {formatMoney(pensionGoal.targetAmount, currency)}
              </p>
            </div>
          </GlassCard>
        </div>
      ) : null}

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}
