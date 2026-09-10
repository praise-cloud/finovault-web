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
    <section aria-label="Pricing" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <p className="text-center text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a853]/60">
          {t('hp.pricing.proposed')}
        </p>
        <h2
          className="hp-display mt-4 text-center text-[var(--fv-hp-display-lg)] text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.pricing.title')}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {tiers.map(({ key, featured }) => (
            <div
              key={key}
              className={`border p-8 ${
                featured ? 'border-[#6366f1]/50' : 'border-white/12'
              }`}
            >
              <h3 className="hp-display text-[var(--fv-hp-display-md)] text-white">
                {t(`hp.pricing.${key}.name`)}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="hp-display text-[var(--fv-hp-stat)] text-white">
                  {t(`hp.pricing.${key}.price`)}
                </span>
                <span className="text-sm text-white/50">{t(`hp.pricing.${key}.period`)}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 bg-[#6366f1]" />
                    {t(`hp.pricing.${key}.f${f}`)}
                  </li>
                ))}
              </ul>
              <a
                href="/login"
                className={`mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-none text-sm font-semibold uppercase tracking-widest transition-colors ${
                  featured
                    ? 'bg-[#6366f1] text-white hover:bg-[#818cf8]'
                    : 'border border-white/30 bg-transparent text-white hover:bg-white/5'
                }`}
              >
                {key === 'tierFree' ? t('hp.pricing.tierFree.cta') : t(`hp.pricing.${key}.cta`)}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">{t('hp.pricing.note')}</p>
      </div>
    </section>
  );
}
