'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, EmptyState, SectionHeader } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';

/** Phase 0 Freelancer shell per 12-MOBILE-SCREENS §3.2. */
export function FreelancerHome({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <GreetingHeader name={name} />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard
            label={t('home.metrics.incomeThisMonth')}
            amount={0}
            currency="NGN"
            trend={{ direction: 'up', label: '+0%' }}
          />
          <StatCard label={t('home.metrics.unpaidInvoices')} value="0" sub="NGN 0" />
        </MetricsRow>
        <div className="h-3" />
        <MetricsRow>
          <StatCard
            label={t('home.metrics.taxEstimate')}
            value="NGN 0"
            sub={t('home.sub.taxShield', { percent: '0%' })}
          />
          <StatCard label={t('home.metrics.runway')} value="—" sub={t('home.sub.months')} />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="plus" label={t('home.actions.addInvoice')} />
        <QuickAction icon="umbrella" label={t('home.actions.setAsideTax')} />
        <QuickAction icon="send" label={t('home.actions.transfer')} />
        <QuickAction icon="cpu" label={t('home.actions.coach')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.recentProjectsTitle')} />
        <GlassCard>
          <StatCard
            label={t('home.metrics.activeProjects')}
            value="0"
            sub={t('home.sub.addFirstProject')}
          />
        </GlassCard>
      </div>

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}