'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { VaultMark } from '@/components/VaultMark';

const stats = [
  { valueKey: 'hp.hero.stat1Value', labelKey: 'hp.hero.stat1Label' },
  { valueKey: 'hp.hero.stat2Value', labelKey: 'hp.hero.stat2Label' },
  { valueKey: 'hp.hero.stat3Value', labelKey: 'hp.hero.stat3Label' },
] as const;

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      aria-label="Hero"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a0e17] px-6 pt-24 pb-16 md:px-10"
    >
      {/* Vault animation — decorative */}
      <div
        aria-hidden
        className="hp-vault-anim pointer-events-none absolute right-[3%] top-1/2 -translate-y-1/2 opacity-15"
        style={{ animation: 'vaultSequence var(--fv-hp-motion-vault) forwards' }}
      >
        <VaultMark size={380} subdued />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Brutalist badge */}
        <div className="mb-6 inline-flex items-center gap-2.5 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3.5 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
          <span className="h-2 w-2 bg-[var(--fv-hp-accent)] animate-pulse" />
          FINANCIAL INTELLIGENCE SYSTEM
        </div>

        <h1
          className="hp-display max-w-[15ch] text-[var(--fv-hp-display-xl)] font-black leading-[0.92] tracking-tighter text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.hero.headline')}
        </h1>
        <p className="mt-6 max-w-[55ch] text-base md:text-xl font-medium leading-[1.65] text-[var(--fv-hp-text-body)]">
          {t('hp.hero.subheadline')}
        </p>

        <div className="mt-10 flex flex-wrap gap-5">
          <a
            href="/login"
            className="rounded-none border-2 border-white bg-[var(--fv-hp-accent)] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition-all shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none min-h-[52px] inline-flex items-center justify-center cursor-pointer"
          >
            {t('hp.hero.ctaPrimary')}
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-none border-2 border-white/60 bg-transparent px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white transition-all shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] hover:border-white hover:bg-white/10 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none min-h-[52px] inline-flex items-center justify-center cursor-pointer"
          >
            {t('hp.hero.ctaSecondary')}
          </button>
        </div>

        {/* Stats matrix */}
        <div className="mt-16 border-2 border-white/25 bg-[#0d121c] shadow-[6px_6px_0_0_#1D4ED8]">
          <dl className="grid grid-cols-1 divide-y-2 md:divide-y-0 md:divide-x-2 divide-white/20 md:grid-cols-3">
            {stats.map(({ valueKey, labelKey }) => (
              <div key={valueKey} className="p-6 md:p-8">
                <dt className="sr-only">{t(labelKey)}</dt>
                <dd className="hp-display text-[var(--fv-hp-stat)] font-black text-white leading-none tracking-tight">
                  {t(valueKey)}
                </dd>
                <dd className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--fv-hp-accent-hover)]">
                  {t(labelKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--fv-hp-text-muted)] flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[var(--fv-hp-accent)] inline-block" />
          {t('hp.illustrative')}
        </p>
      </div>
    </section>
  );
}
