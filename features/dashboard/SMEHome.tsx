'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, EmptyState, SectionHeader, Icon } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';

/** Phase 0 SME shell per 12-MOBILE-SCREENS §3.4. */
export function SMEHome({ name }: { name: string }) {
  const { t } = useTranslation();

  return (
    <div>
      <GreetingHeader name={name} />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard label={t('home.metrics.cashPosition')} amount={0} currency="MUR" />
          <StatCard
            label={t('home.metrics.revenue')}
            amount={0}
            currency="MUR"
            trend={{ direction: 'neutral', label: '—' }}
          />
        </MetricsRow>
        <div className="h-3" />
        <MetricsRow>
          <StatCard label={t('home.metrics.burnRate')} value="MUR 0" />
          <StatCard label={t('home.metrics.runway')} value="—" sub={t('home.sub.months')} />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="send" label={t('home.actions.payVendor')} />
        <QuickAction icon="plus" label={t('home.actions.recordInvoice')} />
        <QuickAction icon="trending-up" label={t('home.actions.cashFlow')} />
        <QuickAction icon="cpu" label={t('home.actions.advisor')} />
      </QuickActionRow>

      <div className="mb-4">
        <SectionHeader title={t('home.needsAttentionTitle')} />
        <GlassCard>
          <div className="flex items-center gap-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[var(--fv-warning)]" />
            <p className="flex-1 text-[14px] text-[var(--fv-text)]">{t('home.sme.noVendors')}</p>
            <Icon name="chevron-right" size={16} subdued />
          </div>
        </GlassCard>
      </div>

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}