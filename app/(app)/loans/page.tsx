'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark } from 'lucide-react';
import { EmptyPageShell } from '@/components/ui';

export default function LoansPage() {
  const { t } = useTranslation();
  return (
    <EmptyPageShell
      title={t('loans.title')}
      emptyTitle={t('loans.emptyTitle')}
      emptyBody={t('loans.emptyBody')}
      icon={Landmark}
    />
  );
}