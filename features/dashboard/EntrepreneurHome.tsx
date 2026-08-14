'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, EmptyState, SectionHeader, Icon } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import { MetricsRow, StatCard, QuickActionRow, QuickAction } from './components';

/** Phase 0 Entrepreneur shell per 12-MOBILE-SCREENS §3.3. */
export function EntrepreneurHome({ name, femaleFounder }: { name: string; femaleFounder: boolean }) {
  const { t } = useTranslation();

  return (
    <div>
      <GreetingHeader name={name} />

      <GlassCard className="mb-4">
        <MetricsRow>
          <StatCard label={t('home.metrics.combinedWealth')} amount={0} currency="MUR" />
          <StatCard
            label={t('home.metrics.revenueMrr')}
            amount={0}
            currency="MUR"
            trend={{ direction: 'neutral', label: '—' }}
          />
        </MetricsRow>
        <div className="h-3" />
        <MetricsRow>
          <StatCard label={t('home.metrics.burnRate')} value="MUR 0" sub={t('home.sub.perMonth')} />
          <StatCard label={t('home.metrics.runway')} value="—" sub={t('home.sub.months')} />
        </MetricsRow>
      </GlassCard>

      <QuickActionRow>
        <QuickAction icon="trending-up" label={t('home.actions.cashFlow')} />
        <QuickAction icon="briefcase" label={t('home.actions.grants')} />
        <QuickAction icon="send" label={t('home.actions.transfer')} />
        <QuickAction icon="cpu" label={t('home.actions.coach')} />
      </QuickActionRow>

      {femaleFounder ? (
        <div className="mb-4">
          <SectionHeader title={t('home.opportunitiesTitle')} />
          <GlassCard className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[var(--fv-gold-border)] bg-[var(--fv-surface)]">
              <Icon name="award" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-[var(--fv-text)]">{t('home.grants.femaleSeedFund')}</p>
              <p className="mt-0.5 text-[13px] text-[var(--fv-text-secondary)]">{t('home.grants.curated')}</p>
            </div>
            <Icon name="chevron-right" size={18} subdued />
          </GlassCard>
        </div>
      ) : null}

      <EmptyState title={t('home.emptyTitle')} body={t('home.emptyBody')} ctaLabel={t('home.emptyCta')} onCta={() => {}} />
    </div>
  );
}