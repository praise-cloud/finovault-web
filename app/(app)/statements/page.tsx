'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollText } from 'lucide-react';
import { EmptyPageShell } from '@/components/ui';

export default function StatementsPage() {
  const { t } = useTranslation();
  return (
    <EmptyPageShell
      title={t('statements.title')}
      emptyTitle={t('statements.emptyTitle')}
      emptyBody={t('statements.emptyBody')}
      icon={ScrollText}
    />
  );
}