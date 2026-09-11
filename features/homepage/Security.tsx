'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

const principles = [1, 2, 3, 4] as const;

export function Security() {
  const { t } = useTranslation();

  return (
    <section aria-label="Security" className="bg-[#f4f6fb] py-24 md:py-32 border-t-2 border-black/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-[#1A1A2E] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1A1A2E] shadow-[2px_2px_0_0_#1A1A2E]">
            <ShieldCheck size={16} strokeWidth={2.5} className="text-[var(--fv-hp-accent)]" />
            [ 07 / PRIVACY PROTOCOL ]
          </div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-[#1A1A2E] uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.security.title')}
          </h2>
          <p className="mt-6 max-w-[60ch] text-base md:text-lg font-medium leading-relaxed text-[#4B5563]">
            {t('hp.security.statement')}
          </p>
        </div>

        {/* 4 Brutalist Protocol Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((n) => (
            <div
              key={n}
              className="border-2 border-[#1A1A2E] bg-white p-6 shadow-[4px_4px_0_0_#1A1A2E] hover:shadow-[6px_6px_0_0_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b-2 border-[#1A1A2E]/15 pb-3">
                  <span className="font-mono text-xs font-black text-[var(--fv-hp-accent)] uppercase tracking-widest">
                    RULE // 0{n}
                  </span>
                  <span className="text-emerald-700 text-xs font-black">ENFORCED</span>
                </div>
                <h3 className="mt-4 text-base font-black uppercase text-[#1A1A2E] tracking-tight">
                  {t(`hp.security.principle${n}.title`)}
                </h3>
                <p className="mt-2 text-xs md:text-sm font-medium leading-relaxed text-[#4B5563]">
                  {t(`hp.security.principle${n}.desc`)}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#1A1A2E]/10 text-[0.65rem] font-mono font-bold text-[#6B7280]">
                ZERO THIRD-PARTY DATA LEAK
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
