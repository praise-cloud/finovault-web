'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const caps = [1, 2, 3, 4] as const;

export function Business() {
  const { t } = useTranslation();

  return (
    <section aria-label="Business" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 md:px-10">
        {/* Decorative visual */}
        <div aria-hidden className="order-2 flex items-center justify-center lg:order-1">
          <div className="h-64 w-full max-w-sm border border-white/12 bg-white/4 p-8">
            <div className="mb-4 h-3 w-1/3 bg-white/10" />
            <div className="mb-3 h-2 w-2/3 bg-white/5" />
            <div className="mb-3 h-2 w-1/2 bg-white/5" />
            <div className="mt-8 flex gap-4">
              <div className="h-8 flex-1 bg-[#6366f1]/10" />
              <div className="h-8 flex-1 bg-[#d4a853]/10" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="text-[0.75rem] uppercase tracking-[0.08em] text-[#d4a853]/50">
            {t('hp.business.planned')}
          </p>
          <h2
            className="hp-display mt-4 text-[var(--fv-hp-display-lg)] text-white"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.business.title')}
          </h2>
          <div className="mt-10 grid gap-6">
            {caps.map((n) => (
              <div key={n} className="border-t border-white/10 pt-4">
                <h3 className="text-base font-semibold text-white">
                  {t(`hp.business.cap${n}`)}
                </h3>
                <p className="mt-1 text-sm text-white/60">
                  {t(`hp.business.cap${n}desc`)}
                </p>
              </div>
            ))}
          </div>
          <a
            href="/login"
            className="mt-10 inline-flex min-h-[48px] items-center rounded-none border border-white/30 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5"
          >
            {t('hp.business.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
