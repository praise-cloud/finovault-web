'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader } from '@/components/ui';

const GRANT_KEYS = [
  { name: 'home.grants.list.seedFund', deadline: 'home.grants.list.seedFundDeadline' },
  { name: 'home.grants.list.sheWins', deadline: 'home.grants.list.sheWinsDeadline' },
  { name: 'home.grants.list.mra', deadline: 'home.grants.list.mraDeadline' },
  { name: 'home.grants.list.afdb', deadline: 'home.grants.list.afdbDeadline' },
] as const;

/**
 * Female Founder grant opportunities. Mirrors the GrantOpportunityCard from
 * finovault-flutter: a hardcoded list shown only to female-founders. Deadlines
 * are the standard opportunity cycle deadlines for the programme year.
 */
export function GrantOpportunities() {
  const { t } = useTranslation();
  return (
    <div className="mb-5">
      <SectionHeader title={t('home.grants.title')} />
      <div className="rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-3 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] flex flex-col gap-2.5">
        {GRANT_KEYS.map(({ name, deadline }) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-3 shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
          >
            <span className="text-sm font-black uppercase tracking-tight text-[var(--fv-text)]">{t(name)}</span>
            <span className="shrink-0 rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[#FEF6E5] dark:bg-[#3A3226] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-[#92400E]">
              {t(deadline)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
