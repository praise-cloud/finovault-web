'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const pillars = [
  { key: 'message1', num: '01', title: 'SEE' },
  { key: 'message2', num: '02', title: 'UNDERSTAND' },
  { key: 'message3', num: '03', title: 'OWN' },
] as const;

export function Philosophy() {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      aria-label="Philosophy"
      className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
          [ 01 / THREE PILLARS ]
        </div>
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.philosophy.headline')}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {pillars.map(({ key, num, title }) => (
            <div
              key={key}
              className="border-2 border-white/25 bg-[#0d121c] p-8 shadow-[6px_6px_0_0_#1D4ED8] hover:border-white hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-white/15 pb-4">
                  <span className="hp-display text-5xl md:text-6xl font-black tracking-tighter text-[var(--fv-hp-accent)]">
                    {num}
                  </span>
                  <span className="hp-display text-2xl font-black tracking-tight text-white">
                    {title}
                  </span>
                </div>
                <p className="mt-6 text-base font-medium leading-relaxed text-[var(--fv-hp-text-body)]">
                  {t(`hp.philosophy.${key}`)}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-[var(--fv-hp-text-muted)]">
                <span>PHASE {num} VERIFIED</span>
                <span className="text-[var(--fv-hp-accent)]">● ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
