'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

const principles = [1, 2, 3, 4] as const;

export function Security() {
  const { t } = useTranslation();

  return (
    <section aria-label="Security" className="bg-[#faf8f5] py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 lg:grid-cols-2 md:px-10">
        {/* Text */}
        <div className="max-w-[50ch]">
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-bold text-[#1a1a1a]"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.security.title')}
          </h2>
          <p className="mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] font-medium leading-relaxed text-[var(--fv-hp-text-dark-body)]">
            {t('hp.security.statement')}
          </p>
        </div>

        {/* Principles */}
        <div>
          <ShieldCheck size={32} className="mb-6 text-[var(--fv-hp-accent)]" aria-hidden />
          {principles.map((n) => (
            <div key={n} className="border-t border-black/10 pt-4">
              <h3 className="text-base font-bold text-[#1a1a1a]">
                {t(`hp.security.principle${n}.title`)}
              </h3>
              <p className="mt-1 text-sm font-medium text-[var(--fv-hp-text-dark-body)]">
                {t(`hp.security.principle${n}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
