'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  { nameKey: 'hp.mirror.cat1', pctKey: 'hp.mirror.cat1pct', width: '42%', color: 'bg-[#6366f1]' },
  { nameKey: 'hp.mirror.cat2', pctKey: 'hp.mirror.cat2pct', width: '18%', color: 'bg-[#22c55e]' },
  { nameKey: 'hp.mirror.cat3', pctKey: 'hp.mirror.cat3pct', width: '11%', color: 'bg-[#ef4444]' },
  { nameKey: 'hp.mirror.cat4', pctKey: 'hp.mirror.cat4pct', width: '29%', color: 'bg-[#6366f1]/60' },
] as const;

export function Mirror() {
  const { t } = useTranslation();

  return (
    <section aria-label="Financial Mirror" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 md:px-10">
        {/* Text */}
        <div>
          <p className="text-[0.75rem] uppercase tracking-[0.08em] text-[#6366f1]">
            {t('hp.mirror.eyebrow')}
          </p>
          <h2
            className="hp-display mt-4 text-[var(--fv-hp-display-lg)] text-white"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.mirror.title')}
          </h2>
          <p className="mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] leading-relaxed text-white/80">
            {t('hp.mirror.statement')}
          </p>
        </div>

        {/* Dashboard mockup */}
        <div
          aria-label="Illustrative financial pattern dashboard"
          className="border border-white/12 bg-white/4 p-8"
        >
          {categories.map(({ nameKey, pctKey, width, color }) => (
            <div key={nameKey} className="mb-6 last:mb-0">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/80">{t(nameKey)}</span>
                <span className="hp-display text-sm text-white">{t(pctKey)}</span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-white/10">
                <div className={`h-full ${color}`} style={{ width }} />
              </div>
            </div>
          ))}
          <p className="mt-8 text-[0.75rem] uppercase tracking-[0.08em] text-white/40">
            {t('hp.illustrative')}
          </p>
        </div>
      </div>
    </section>
  );
}
