'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const tiers = [
  { key: 'tierFree', featured: false },
  { key: 'tierPlus', featured: true },
  { key: 'tierBiz', featured: false },
] as const;

const features = [1, 2, 3, 4] as const;

export function Pricing() {
  const { t } = useTranslation();

  return (
    <section aria-label="Pricing" className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
            [ 09 / EARLY ACCESS VALUATION ]
          </div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.pricing.title')}
          </h2>
          <p className="mt-2 text-xs font-mono font-bold uppercase tracking-widest text-[#d4a853]">
            {t('hp.pricing.proposed')}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {tiers.map(({ key, featured }) => (
            <div
              key={key}
              className={`p-8 border-2 transition-all flex flex-col justify-between ${
                featured
                  ? 'border-[var(--fv-hp-accent)] bg-[#0c1529] shadow-[10px_10px_0_0_#1D4ED8] md:-translate-y-2'
                  : 'border-white/20 bg-[#0d121c] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)]'
              }`}
            >
              <div>
                <div className="flex justify-between items-center border-b-2 border-white/15 pb-4">
                  <h3 className="hp-display text-2xl font-black text-white uppercase tracking-tight">
                    {t(`hp.pricing.${key}.name`)}
                  </h3>
                  {featured && (
                    <span className="border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent)] px-2.5 py-0.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[2px_2px_0_0_#ffffff]">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="hp-display text-4xl md:text-5xl font-black text-white tracking-tight">
                    {t(`hp.pricing.${key}.price`)}
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/50">
                    {t(`hp.pricing.${key}.period`)}
                  </span>
                </div>

                <ul className="mt-8 space-y-3.5 border-t border-white/10 pt-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-semibold text-[var(--fv-hp-text-body)]">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 bg-[var(--fv-hp-accent)]" />
                      <span>{t(`hp.pricing.${key}.f${f}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <a
                  href="/login"
                  className={`inline-flex min-h-[52px] w-full items-center justify-center rounded-none border-2 text-xs font-black uppercase tracking-[0.16em] transition-all cursor-pointer ${
                    featured
                      ? 'border-white bg-[var(--fv-hp-accent)] text-white shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none'
                      : 'border-white/40 bg-white/5 text-white shadow-[4px_4px_0_0_rgba(255,255,255,0.15)] hover:border-white hover:bg-white/15 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none'
                  }`}
                >
                  {key === 'tierFree' ? t('hp.pricing.tierFree.cta') : t(`hp.pricing.${key}.cta`)}
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-mono font-bold uppercase tracking-widest text-[var(--fv-hp-text-muted)]">
          {t('hp.pricing.note')}
        </p>
      </div>
    </section>
  );
}
