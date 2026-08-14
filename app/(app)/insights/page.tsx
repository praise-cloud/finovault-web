'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SectionHeader } from '@/components/ui';

export default function InsightsPage() {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeader title={t('insights.dailyBriefing')} />
      <div className="mb-4 rounded-[14px] border border-[var(--fv-gold-border)] bg-[var(--fv-surface-glass)] p-4">
        <p className="text-[var(--fv-text-secondary)]">{t('insights.briefingEmpty')}</p>
      </div>
      <SectionHeader title={t('insights.spendingPattern')} />
      <EmptyState title="" body={t('insights.patternEmpty')} />
    </div>
  );
}