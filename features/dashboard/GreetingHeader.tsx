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
  const dayPart = t(`home.${timeOfDayKey()}`);

  return (
    <div className="mb-3 flex items-start justify-between gap-3">
      <div className="flex flex-col items-start gap-2">
        <span className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white bg-[var(--fv-role-accent)]">
          {dayPart}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--fv-text)]">
          {t('home.greeting', { timeOfDay: dayPart, name: firstName })}
        </h1>
        <p className="text-[13px] text-[var(--fv-text-secondary)]">{t('common.tagline')}</p>
      </div>
      <button
        type="button"
        onClick={onBellPress}
        aria-label={t('home.notification')}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] text-[var(--fv-text)] shadow-[var(--fv-shadow-hard-sm)] transition-all duration-150 hover:-translate-y-px hover:shadow-[var(--fv-shadow-hard)] active:translate-y-px active:shadow-none"
      >
        <Bell size={20} strokeWidth={1.8} />
      </button>
    </div>
  );
}