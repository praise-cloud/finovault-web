'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const messages = ['message1', 'message2', 'message3'] as const;

export function Philosophy() {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      aria-label="Philosophy"
      className="bg-[#0a0e17] py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2
          className="hp-display text-center text-[var(--fv-hp-display-lg)] font-bold text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.philosophy.headline')}
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          {messages.map((key) => (
            <div key={key} className="border-t border-white/10 pt-6">
              <p className="max-w-[45ch] text-lg font-medium leading-relaxed text-[var(--fv-hp-text-body)]">{t(`hp.philosophy.${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
