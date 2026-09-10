'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileBarChart } from 'lucide-react';
import { EmptyPageShell } from '@/components/ui';

export default function ReportsPage() {
  const { t } = useTranslation();
  return (
    <EmptyPageShell
      title={t('reports.title')}
      emptyTitle={t('reports.emptyTitle')}
      emptyBody={t('reports.emptyBody')}
      icon={FileBarChart}
    />
  );
}