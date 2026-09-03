'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, EmptyState, SectionHeader } from '@/components/ui';
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

export function FreelancerHome({ name, summary, accounts, goals, invoices, budgets, vendors, bills, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div>
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.incomeThisMonth')}
        amount={summary.monthIncome}
        currency={currency}
        sub={t('home.sub.metricLine', {
          metric: t('home.metrics.unpaidInvoices'),
          amount: formatMoney(summary.unpaidInvoiceTotal, currency),
        })}
      />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard
            label={t('home.metrics.unpaidInvoices')}
            value={String(summary.unpaidInvoiceCount)}
            sub={formatMoney(summary.unpaidInvoiceTotal, currency)}
            trend={summary.unpaidInvoiceCount > 0 ? { direction: 'up', label: `+${summary.unpaidInvoiceCount}` } : undefined}
          />
          <StatCard
            label={t('home.metrics.taxEstimate')}
            value={formatMoney(summary.taxEstimate, currency)}
            sub={t('home.sub.taxShield', { percent: '18%' })}
          />
        </MetricsRow>
        <div className="h-3" />
        <MetricsRow>
          <StatCard
            label={t('home.metrics.runway')}
            value={summary.runwayMonths > 0 ? String(summary.runwayMonths) : '—'}
            sub={t('home.sub.months')}
          />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="plus" label={t('home.actions.addInvoice')} onPress={() => router.push('/invoices')} />
        <QuickAction icon="umbrella" label={t('home.actions.setAsideTax')} onPress={() => router.push('/vault')} />
        <QuickAction icon="send" label={t('home.actions.transfer')} onPress={() => router.push('/pay')} />
        <QuickAction icon="cpu" label={t('home.actions.coach')} onPress={() => router.push('/coach')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.recentProjectsTitle')} />
        <GlassCard>
          <StatCard
            label={t('home.metrics.activeProjects')}
            value={String(summary.unpaidInvoiceCount)}
            sub={summary.unpaidInvoiceCount > 0 ? t('home.sub.metricLine', { metric: t('home.metrics.unpaidInvoices'), amount: formatMoney(summary.unpaidInvoiceTotal, currency) }) : t('home.sub.addFirstProject')}
          />
        </GlassCard>
      </div>

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}
