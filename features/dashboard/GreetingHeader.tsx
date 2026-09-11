'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

function timeOfDayKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function GreetingHeader({ name }: { name: string }) {
  const { t } = useTranslation();
  const firstName = name?.split(' ')[0] ?? '';
  const dayPart = t(`home.${timeOfDayKey()}`);

  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex flex-col items-start gap-2">
        <span className="rounded-[6px] border-2 border-[var(--fv-border-ink)] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[var(--fv-on-fill)] bg-[var(--fv-role-accent)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
          {dayPart}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--fv-text)]">
          {t('home.greeting', { timeOfDay: dayPart, name: firstName })}
        </h1>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">{t('common.tagline')}</p>
      </div>
    </div>
  );
}