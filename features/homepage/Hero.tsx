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
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-[#0a0e17] px-6 md:px-10"
    >
      {/* Vault animation — decorative */}
      <div
        aria-hidden
        className="hp-vault-anim pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 opacity-10"
        style={{ animation: 'vaultSequence var(--fv-hp-motion-vault) forwards' }}
      >
        <VaultMark size={320} subdued />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <h1
          className="hp-display max-w-[12ch] text-[var(--fv-hp-display-xl)] leading-[1.05] text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.hero.headline')}
        </h1>
        <p className="mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] leading-[1.65] text-white/80">
          {t('hp.hero.subheadline')}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/login"
            className="rounded-none bg-[#6366f1] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#818cf8] min-h-[48px] inline-flex items-center"
          >
            {t('hp.hero.ctaPrimary')}
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-none border border-white/30 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5 min-h-[48px] inline-flex items-center"
          >
            {t('hp.hero.ctaSecondary')}
          </button>
        </div>

        {/* Stats bar */}
        <dl className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map(({ valueKey, labelKey }) => (
            <div key={valueKey}>
              <dt className="sr-only">{t(labelKey)}</dt>
              <dd className="hp-display text-[var(--fv-hp-stat)] text-white">{t(valueKey)}</dd>
              <dd className="mt-1 text-sm text-white/60">{t(labelKey)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[0.75rem] uppercase tracking-[0.08em] text-white/40">
          {t('hp.illustrative')}
        </p>
      </div>
    </section>
  );
}
