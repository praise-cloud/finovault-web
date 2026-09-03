'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, ProgressRing, EmptyState, SectionHeader, Icon } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { HeroBalance, MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';
import { formatMoney, formatPercent } from '@/lib/utils';
import { useSecurityOverview } from '@/lib/hooks/use-money';
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

export function IndividualHome({ name, summary, accounts, goals, invoices, budgets, vendors, bills, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: securityOverview } = useSecurityOverview();

  const emergencyGoal = goals.find((g) => g.type === 'emergency');
  const pensionGoal = goals.find((g) => g.type === 'pensionLinked');

  return (
    <div>
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.totalNetWorth')}
        amount={summary.totalBalance}
        currency={currency}
        sub={`${formatMoney(summary.monthExpense, currency)} ${t('home.sub.thisMonth')}`}
      />

      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <StatCard
            label={t('home.metrics.securityScore')}
            value={String(securityOverview?.score ?? 0)}
            sub={formatPercent(securityOverview?.score ? securityOverview.score / 100 : 0)}
          />
          <div className="flex flex-col items-center">
            <ProgressRing
              progress={summary.emergencyFundProgress * 100}
              size={56}
              strokeWidth={6}
              accessibilityLabel={t('home.savingsTitle')}
            />
            <p className="mt-1 text-[13px] text-[var(--fv-text-secondary)]">
              {Math.round(summary.emergencyFundProgress * 100)}%
            </p>
          </div>
        </div>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="send" label={t('home.actions.send')} onPress={() => router.push('/pay')} />
        <QuickAction icon="plus-circle" label={t('home.actions.save')} onPress={() => router.push('/vault')} />
        <QuickAction icon="file-text" label={t('home.actions.payBill')} onPress={() => router.push('/pay')} />
        <QuickAction icon="cpu" label={t('home.actions.insights')} onPress={() => router.push('/insights')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.spendingVsBudgetTitle')} />
        <GlassCard>
          <StatCard
            label={t('home.metrics.monthlySpending')}
            amount={summary.monthExpense}
            currency={currency}
            sub={summary.topExpenseCategory || t('home.sub.vsBudget')}
          />
        </GlassCard>
      </div>

      <div className="mb-4">
        <SectionHeader title={t('home.savingsTitle')} />
        <GlassCard>
          <MetricsRow>
            <StatCard
              label={t('home.rainyDayFund')}
              value={formatMoney(emergencyGoal?.currentAmount ?? 0, currency)}
              sub={
                emergencyGoal
                  ? t('home.sub.goal', { amount: formatMoney(emergencyGoal.targetAmount, currency) })
                  : t('home.sub.addFirstProject')
              }
            />
          </MetricsRow>
        </GlassCard>
      </div>

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
