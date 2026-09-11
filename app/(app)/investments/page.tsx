'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import { EmptyPageShell } from '@/components/ui';

export default function InvestmentsPage() {
  const { t } = useTranslation();
  return (
    <EmptyPageShell
      title={t('investments.title')}
      emptyTitle={t('investments.emptyTitle')}
      emptyBody={t('investments.emptyBody')}
      icon={TrendingUp}
    />
  );
}