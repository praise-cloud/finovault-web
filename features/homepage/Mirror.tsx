'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  { nameKey: 'hp.mirror.cat1', pctKey: 'hp.mirror.cat1pct', width: '42%', color: 'bg-[var(--fv-hp-accent)]' },
  { nameKey: 'hp.mirror.cat2', pctKey: 'hp.mirror.cat2pct', width: '18%', color: 'bg-[#22c55e]' },
  { nameKey: 'hp.mirror.cat3', pctKey: 'hp.mirror.cat3pct', width: '11%', color: 'bg-[#ef4444]' },
  { nameKey: 'hp.mirror.cat4', pctKey: 'hp.mirror.cat4pct', width: '29%', color: 'bg-[var(--fv-hp-accent)]/60' },
] as const;

export function Mirror() {
  const { t } = useTranslation();

  return (
    <section aria-label="Financial Mirror" className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 md:px-10">
        {/* Text */}
        <div>
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
            [ 03 / PATTERN ENGINE ]
          </div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.mirror.title')}
          </h2>
          <p className="mt-6 max-w-[50ch] text-base md:text-lg font-medium leading-relaxed text-[var(--fv-hp-text-body)]">
            {t('hp.mirror.statement')}
          </p>

          <div className="mt-8 border-l-4 border-[var(--fv-hp-accent)] pl-4 py-1">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--fv-hp-accent-hover)]">
              UNSUPERVISED PATTERN DETECTION
            </p>
            <p className="text-sm font-semibold text-white/90 mt-1">
              Catches micro-leakages and recurring charges before they compound into liabilities.
            </p>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div
          aria-label="Illustrative financial pattern dashboard"
          className="border-2 border-white/25 bg-[#0d121c] p-6 md:p-8 shadow-[8px_8px_0_0_#1D4ED8]"
        >
          <div className="flex items-center justify-between border-b-2 border-white/15 pb-4 mb-6 text-xs font-mono font-bold text-white/70 tracking-widest uppercase">
            <span>TELEMETRY FEED // REAL-TIME</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-2 w-2 bg-emerald-400 inline-block" />
              LIVE
            </span>
          </div>

          <div className="space-y-6">
            {categories.map(({ nameKey, pctKey, width, color }) => (
              <div key={nameKey}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                    {t(nameKey)}
                  </span>
                  <span className="hp-display text-base font-black text-white tabular-nums tracking-tight">
                    {t(pctKey)}
                  </span>
                </div>
                <div className="h-3.5 w-full border border-white/25 bg-black/40 p-0.5">
                  <div className={`h-full ${color}`} style={{ width }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-[var(--fv-hp-text-muted)] tracking-wider">
            <span>STATUS: 100% AUDITED</span>
            <span className="text-[var(--fv-hp-accent-hover)]">{t('hp.illustrative')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
