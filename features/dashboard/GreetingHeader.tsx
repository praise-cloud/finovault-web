'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';

function timeOfDayKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function GreetingHeader({ name, onBellPress }: { name: string; onBellPress?: () => void }) {
  const { t } = useTranslation();
  const firstName = name?.split(' ')[0] ?? '';

  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[var(--fv-text)]">
          {t('home.greeting', { timeOfDay: t(`home.${timeOfDayKey()}`), name: firstName })}
        </h1>
        <p className="mt-1 text-[13px] text-[var(--fv-text-secondary)]">{t('common.tagline')}</p>
      </div>
      <button
        type="button"
        onClick={onBellPress}
        aria-label={t('home.notification')}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--fv-primary-border)] bg-[var(--fv-wash)] text-[var(--fv-primary)] transition-colors hover:bg-[var(--fv-accent)] hover:text-[var(--fv-secondary)]"
      >
        <Bell size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}