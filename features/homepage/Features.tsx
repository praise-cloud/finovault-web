'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, BrainCircuit, ShieldCheck, TrendingUp } from 'lucide-react';

const cards = [
  { key: 'see', Icon: Eye },
  { key: 'understand', Icon: BrainCircuit },
  { key: 'protect', Icon: ShieldCheck },
  { key: 'decide', Icon: TrendingUp },
] as const;

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" aria-label="Features" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.features.title')}
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ key, Icon }) => (
            <div
              key={key}
              className="border border-white/12 bg-white/4 p-8 transition-colors hover:border-[rgba(99,102,241,0.4)]"
            >
              <Icon size={24} className="text-[#6366f1]" aria-hidden />
              <h3 className="hp-display mt-4 text-[var(--fv-hp-display-md)] text-white">
                {t(`hp.features.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {t(`hp.features.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
