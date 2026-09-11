'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const caps = [1, 2, 3, 4] as const;

export function Personal() {
  const { t } = useTranslation();

  return (
    <section aria-label="Personal finance" className="bg-[#f4f6fb] py-24 md:py-32 border-t-2 border-black/10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 md:px-10">
        {/* Text */}
        <div className="max-w-[54ch]">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-[#1A1A2E] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1A1A2E] shadow-[2px_2px_0_0_#1A1A2E]">
            [ 04 / INDIVIDUAL & FREELANCE ]
          </div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-[#1A1A2E] uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.personal.title')}
          </h2>

          <div className="mt-10 grid gap-4">
            {caps.map((n) => (
              <div
                key={n}
                className="border-2 border-[#1A1A2E] bg-white p-4 shadow-[3px_3px_0_0_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1A1A2E] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-[#1A1A2E] bg-[var(--fv-hp-accent)] text-white text-xs font-black">
                    0{n}
                  </span>
                  <h3 className="text-sm md:text-base font-black uppercase text-[#1A1A2E] tracking-tight">
                    {t(`hp.personal.cap${n}`)}
                  </h3>
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium leading-relaxed text-[#4B5563] pl-9">
                  {t(`hp.personal.cap${n}desc`)}
                </p>
              </div>
            ))}
          </div>

          <a
            href="/login"
            className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-none border-2 border-[#1A1A2E] bg-[var(--fv-hp-accent)] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_0_#1A1A2E] hover:shadow-[6px_6px_0_0_#1A1A2E] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {t('hp.personal.cta')}
          </a>
        </div>

        {/* Real brutalist telemetry visual */}
        <div aria-hidden className="flex items-center justify-center">
          <div className="w-full max-w-md border-2 border-[#1A1A2E] bg-white p-6 md:p-8 shadow-[8px_8px_0_0_#1A1A2E]">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A2E] pb-3 mb-6 text-xs font-mono font-black text-[#1A1A2E] uppercase tracking-wider">
              <span>FINOVAULT // PERSONAL VAULT</span>
              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                <span className="h-2 w-2 bg-emerald-600 inline-block" />
                VERIFIED
              </span>
            </div>

            <div className="border-2 border-[#1A1A2E] bg-[#f8faff] p-5 mb-5">
              <span className="text-[0.7rem] font-mono font-bold uppercase tracking-widest text-[#4B5563]">
                NET LIQUID ASSETS
              </span>
              <p className="hp-display text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight mt-1">
                MUR 284,500.00
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>▲ +18.4% THIS MONTH</span>
                <span className="text-[#6B7280]">· ALL ACCOUNTS SYNCED</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border-2 border-[#1A1A2E] bg-white p-3.5">
                <div className="flex justify-between text-xs font-bold text-[#1A1A2E] mb-1.5 uppercase">
                  <span>EMERGENCY RESERVE</span>
                  <span className="font-mono">82% FUNDED</span>
                </div>
                <div className="h-2.5 w-full border border-[#1A1A2E] bg-slate-100 p-0.5">
                  <div className="h-full bg-[var(--fv-hp-accent)] w-[82%]" />
                </div>
              </div>

              <div className="border-2 border-[#1A1A2E] bg-white p-3.5">
                <div className="flex justify-between text-xs font-bold text-[#1A1A2E] mb-1.5 uppercase">
                  <span>UNEXPECTED CHARGE BUFFER</span>
                  <span className="font-mono text-emerald-700">PROTECTED</span>
                </div>
                <div className="h-2.5 w-full border border-[#1A1A2E] bg-slate-100 p-0.5">
                  <div className="h-full bg-emerald-600 w-[100%]" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t-2 border-dashed border-[#1A1A2E]/30 flex justify-between text-[0.7rem] font-mono font-bold text-[#6B7280]">
              <span>LEDGER HASH: 8f4a-9c2e</span>
              <span>SOVEREIGN VAULT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
