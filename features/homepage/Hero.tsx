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
          className="hp-display max-w-[14ch] text-[var(--fv-hp-display-xl)] font-bold leading-[1.05] text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.hero.headline')}
        </h1>
        <p className="mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] font-medium leading-[1.65] text-[var(--fv-hp-text-body)]">
          {t('hp.hero.subheadline')}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/login"
            className="rounded-none bg-[var(--fv-hp-accent)] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--fv-hp-accent-hover)] min-h-[48px] inline-flex items-center"
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
              <dd className="hp-display text-[var(--fv-hp-stat)] font-extrabold text-white">{t(valueKey)}</dd>
              <dd className="mt-1 text-sm font-medium text-[var(--fv-hp-text-muted)]">{t(labelKey)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--fv-hp-text-muted)]">
          {t('hp.illustrative')}
        </p>
      </div>
    </section>
  );
}
