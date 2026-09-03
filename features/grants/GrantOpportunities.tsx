'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader } from '@/components/ui';

const GRANT_KEYS = [
  { name: 'grants.list.seedFund', deadline: 'grants.list.seedFundDeadline' },
  { name: 'grants.list.sheWins', deadline: 'grants.list.sheWinsDeadline' },
  { name: 'grants.list.mra', deadline: 'grants.list.mraDeadline' },
  { name: 'grants.list.afdb', deadline: 'grants.list.afdbDeadline' },
] as const;

/**
 * Female Founder grant opportunities. Mirrors the GrantOpportunityCard from
 * finovault-flutter: a hardcoded list shown only to female-founders. Deadlines
 * are the standard opportunity cycle deadlines for the programme year.
 */
export function GrantOpportunities() {
  const { t } = useTranslation();
  return (
    <div>
      <SectionHeader title={t('grants.title')} />
      <GlassCard className="flex flex-col gap-3">
        {GRANT_KEYS.map(({ name, deadline }) => (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] px-3.5 py-3"
          >
            <span className="text-sm font-semibold text-[var(--fv-text)]">{t(name)}</span>
            <span className="shrink-0 rounded-full bg-[var(--fv-wash)] px-2.5 py-1 text-xs font-medium text-[var(--fv-primary)]">
              {t(deadline)}
            </span>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
