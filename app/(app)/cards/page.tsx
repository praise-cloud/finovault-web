'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard } from 'lucide-react';
import { EmptyPageShell } from '@/components/ui';

export default function CardsPage() {
  const { t } = useTranslation();
  return (
    <EmptyPageShell
      title={t('cards.title')}
      emptyTitle={t('cards.emptyTitle')}
      emptyBody={t('cards.emptyBody')}
      icon={CreditCard}
    />
  );
}