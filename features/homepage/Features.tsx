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
    <section id="features" aria-label="Features" className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
          [ 02 / CORE CAPABILITIES ]
        </div>
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.features.title')}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ key, Icon }, i) => (
            <div
              key={key}
              className="border-2 border-white/25 bg-[#0d121c] p-8 shadow-[6px_6px_0_0_#1D4ED8] hover:border-white hover:shadow-[8px_8px_0_0_#1D4ED8] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] p-3.5 w-fit text-[var(--fv-hp-accent)] shadow-[2px_2px_0_0_#1D4ED8]">
                  <Icon size={24} strokeWidth={2.2} aria-hidden />
                </div>
                <h3 className="hp-display mt-6 text-xl font-black uppercase tracking-tight text-white">
                  {t(`hp.features.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-[var(--fv-hp-text-body)]">
                  {t(`hp.features.${key}.desc`)}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[0.7rem] font-mono font-bold text-[var(--fv-hp-text-muted)] tracking-widest">
                <span>MODULE 0{i + 1}</span>
                <span className="text-[var(--fv-hp-accent)]">ENABLED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
