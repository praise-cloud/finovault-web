'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SectionHeader, GlassCard, Icon } from '@/components/ui';

export default function VaultPage() {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeader title={t('tabs.vault')} />
      <GlassCard className="mb-4 flex items-center justify-center gap-3 py-6">
        <Icon name="plus-circle" size={20} />
        <span className="font-semibold text-[var(--fv-text)]">{t('vault.createGoal')}</span>
      </GlassCard>
      <EmptyState title={t('vault.emptyTitle')} body={t('vault.emptyBody')} />
    </div>
  );
}