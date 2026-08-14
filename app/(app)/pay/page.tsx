'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState, SectionHeader, GlassCard, Icon } from '@/components/ui';

export default function PayPage() {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeader title={t('tabs.pay')} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <GlassCard className="flex flex-1 items-center justify-center gap-3 py-6">
          <Icon name="send" size={20} />
          <span className="font-semibold text-[var(--fv-text)]">{t('pay.transfer')}</span>
        </GlassCard>
        <GlassCard className="flex flex-1 items-center justify-center gap-3 py-6">
          <Icon name="file-text" size={20} />
          <span className="font-semibold text-[var(--fv-text)]">{t('pay.payBill')}</span>
        </GlassCard>
      </div>
      <SectionHeader title={t('pay.recent')} />
      <EmptyState title="" body={t('pay.emptyHistory')} />
    </div>
  );
}