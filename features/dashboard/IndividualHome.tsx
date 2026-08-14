'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, MoneyText, ProgressRing, EmptyState, SectionHeader } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';
import { formatPercent } from '@/lib/utils';

/** Phase 0 Individual shell per 12-MOBILE-SCREENS §3.1. */
export function IndividualHome({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <GreetingHeader name={name} />

      <GlassCard className="mb-4">
        <div className="mb-2 flex flex-col items-start gap-1">
          <p className="text-[14px] text-[var(--fv-text-secondary)]">{t('home.metrics.totalNetWorth')}</p>
          <MoneyText amount={0} currency="MUR" size="lg" color="accent" />
        </div>
        <div className="flex items-center justify-between">
          <StatCard label={t('home.metrics.securityScore')} value="82" sub={formatPercent(0)} />
          <div className="flex flex-col items-center">
            <ProgressRing progress={62} size={56} strokeWidth={6} accessibilityLabel={t('home.savingsTitle')} />
            <p className="mt-1 text-[13px] text-[var(--fv-text-secondary)]">62%</p>
          </div>
        </div>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="send" label={t('home.actions.send')} />
        <QuickAction icon="plus-circle" label={t('home.actions.save')} />
        <QuickAction icon="file-text" label={t('home.actions.payBill')} />
        <QuickAction icon="cpu" label={t('home.actions.insights')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.spendingVsBudgetTitle')} />
        <GlassCard>
          <StatCard
            label={t('home.metrics.monthlySpending')}
            amount={0}
            currency="MUR"
            sub={t('home.sub.vsBudget')}
          />
        </GlassCard>
      </div>

      <div className="mb-4">
        <SectionHeader title={t('home.savingsTitle')} />
        <GlassCard>
          <MetricsRow>
            <StatCard
              label={t('home.rainyDayFund')}
              value="MUR 0"
              sub={t('home.sub.goal', { amount: 'MUR 50,000' })}
            />
          </MetricsRow>
        </GlassCard>
      </div>

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}