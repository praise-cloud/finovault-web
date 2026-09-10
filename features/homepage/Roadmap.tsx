'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const phases = [
  { key: 'phase1', statusClass: 'text-[var(--fv-hp-accent)] border-[var(--fv-hp-accent-border)]' },
  { key: 'phase2', statusClass: 'text-white/50 border-white/20' },
  { key: 'phase3', statusClass: 'text-white/50 border-white/20' },
] as const;

export function Roadmap() {
  const { t } = useTranslation();

  return (
    <section aria-label="Roadmap" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-bold text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.roadmap.title')}
        </h2>
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-12 hidden h-px bg-white/10 md:block"
          />
          {phases.map(({ key, statusClass }) => (
            <div key={key} className="relative border border-white/12 p-8">
              <p className="text-sm font-medium text-[var(--fv-hp-text-muted)]">{t(`hp.roadmap.${key}.phase`)}</p>
              <h3 className="hp-display mt-2 text-[var(--fv-hp-display-md)] font-bold text-white">
                {t(`hp.roadmap.${key}.title`)}
              </h3>
              <span
                className={`mt-3 inline-block rounded-none border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] ${statusClass}`}
              >
                {t(`hp.roadmap.${key}.status`)}
              </span>
              <ul className="mt-6 space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-[var(--fv-hp-text-body)]">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-[var(--fv-hp-accent)]" />
                    {t(`hp.roadmap.${key}.item${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
