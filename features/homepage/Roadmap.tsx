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
    <section aria-label="Roadmap" className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
          [ 06 / EXECUTION ROADMAP ]
        </div>
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.roadmap.title')}
        </h2>

        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {phases.map(({ key, statusClass }, idx) => {
            const isCurrent = key === 'phase1';
            return (
              <div
                key={key}
                className={`relative p-8 border-2 transition-all ${
                  isCurrent
                    ? 'border-[var(--fv-hp-accent)] bg-[#0c1426] shadow-[8px_8px_0_0_#1D4ED8]'
                    : 'border-white/20 bg-[#0d121c] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)]'
                }`}
              >
                <div className="flex justify-between items-center border-b-2 border-white/15 pb-4 mb-4">
                  <span className="font-mono text-xs font-black uppercase tracking-widest text-[var(--fv-hp-accent-hover)]">
                    {t(`hp.roadmap.${key}.phase`)}
                  </span>
                  <span className="font-mono text-xs font-black text-white/40">
                    0{idx + 1} // 03
                  </span>
                </div>

                <h3 className="hp-display text-2xl font-black text-white uppercase tracking-tight">
                  {t(`hp.roadmap.${key}.title`)}
                </h3>

                <div className="mt-3">
                  <span
                    className={`inline-block rounded-none border-2 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.14em] ${
                      isCurrent
                        ? 'border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent)] text-white'
                        : 'border-white/30 bg-white/5 text-white/70'
                    }`}
                  >
                    {t(`hp.roadmap.${key}.status`)}
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-[var(--fv-hp-text-body)]">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 bg-[var(--fv-hp-accent)]" />
                      <span>{t(`hp.roadmap.${key}.item${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
