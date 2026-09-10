'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const caps = [1, 2, 3, 4] as const;

export function Personal() {
  const { t } = useTranslation();

  return (
    <section aria-label="Personal finance" className="bg-[#faf8f5] py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 md:px-10">
        {/* Text */}
        <div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] text-[#1a1a1a]"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.personal.title')}
          </h2>
          <div className="mt-10 grid gap-6">
            {caps.map((n) => (
              <div key={n} className="border-t border-black/10 pt-4">
                <h3 className="text-base font-semibold text-[#1a1a1a]">
                  {t(`hp.personal.cap${n}`)}
                </h3>
                <p className="mt-1 text-sm text-[#6b7280]">
                  {t(`hp.personal.cap${n}desc`)}
                </p>
              </div>
            ))}
          </div>
          <a
            href="/login"
            className="mt-10 inline-flex min-h-[48px] items-center rounded-none bg-[#6366f1] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#818cf8]"
          >
            {t('hp.personal.cta')}
          </a>
        </div>

        {/* Decorative visual */}
        <div aria-hidden className="flex items-center justify-center">
          <div className="h-64 w-full max-w-sm border border-black/10 bg-white p-8">
            <div className="mb-4 h-3 w-1/3 bg-black/10" />
            <div className="mb-3 h-2 w-2/3 bg-black/5" />
            <div className="mb-3 h-2 w-1/2 bg-black/5" />
            <div className="mb-3 h-2 w-3/4 bg-black/5" />
            <div className="mt-8 flex gap-4">
              <div className="h-8 flex-1 bg-[#6366f1]/10" />
              <div className="h-8 flex-1 bg-[#22c55e]/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
