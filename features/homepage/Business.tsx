'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Building2, ArrowRight } from 'lucide-react';

const caps = [1, 2, 3, 4] as const;

export function Business() {
  const { t } = useTranslation();

  return (
    <section
      id="business"
      aria-label="Business"
      className="bg-[var(--fv-hp-bg)] py-24 md:py-32 border-t-2 border-[var(--fv-hp-border)] transition-colors duration-200"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 md:px-10">
        {/* Real brutalist business telemetry console */}
        <div aria-hidden className="order-2 flex items-center justify-center lg:order-1">
          <div className="w-full max-w-md border-2 border-white/25 bg-[#0d121c] p-6 md:p-8 shadow-[8px_8px_0_0_#1D4ED8]">
            <div className="flex items-center justify-between border-b-2 border-white/15 pb-3 mb-6 text-xs font-mono font-black text-white uppercase tracking-wider">
              <span>FINOVAULT // RUNWAY TELEMETRY</span>
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 bg-amber-400 inline-block animate-pulse" />
                PHASE 2
              </span>
            </div>

            <div className="border-2 border-white/20 bg-black/50 p-5 mb-5">
              <span className="text-[0.7rem] font-mono font-bold uppercase tracking-widest text-white/60">
                LIQUID RUNWAY RESERVE
              </span>
              <p className="hp-display text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
                14.2 MONTHS
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-white/80">
                <span className="text-[var(--fv-hp-accent-hover)]">NET BURN: MUR 180,000/MO</span>
                <span>· HEALTHY</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border-2 border-white/15 bg-white/[0.03] p-3.5 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">MONTHLY RECURRING (MRR)</span>
                <span className="font-mono text-sm font-black text-white">MUR 420,000.00</span>
              </div>

              <div className="border-2 border-white/15 bg-white/[0.03] p-3.5 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">TAX READINESS RESERVE</span>
                <span className="font-mono text-xs font-bold text-amber-400 border border-amber-400/40 px-2 py-0.5">
                  MUR 63,000 [SAFE]
                </span>
              </div>

              <div className="border-2 border-white/15 bg-white/[0.03] p-3.5 flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase">ACCOUNTS PAYABLE</span>
                <span className="font-mono text-xs font-bold text-white/70">MUR 48,200 (12 DAYS)</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t-2 border-dashed border-white/15 flex justify-between text-[0.7rem] font-mono font-bold text-[var(--fv-hp-text-muted)]">
              <span>SME TELEMETRY PROTOCOL</span>
              <span className="text-[var(--fv-hp-accent-hover)]">{t('hp.illustrative')}</span>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="order-1 max-w-[54ch] lg:order-2">
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <div className="inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
              [ 05 / ENTERPRISE & SME ]
            </div>
            <span className="border-2 border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[0.7rem] font-mono font-bold uppercase tracking-widest text-amber-300">
              {t('hp.business.planned')}
            </span>
          </div>

          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.business.title')}
          </h2>

          <div className="mt-10 grid gap-4">
            {caps.map((n) => (
              <div
                key={n}
                className="border-2 border-white/20 bg-[#0d121c] p-4 shadow-[3px_3px_0_0_#1D4ED8] hover:border-white hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-white/40 bg-white/10 text-white text-xs font-black">
                    0{n}
                  </span>
                  <h3 className="text-sm md:text-base font-black uppercase text-white tracking-tight">
                    {t(`hp.business.cap${n}`)}
                  </h3>
                </div>
                <p className="mt-2 text-xs md:text-sm font-medium leading-relaxed text-[var(--fv-hp-text-body)] pl-9">
                  {t(`hp.business.cap${n}desc`)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/business"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-emerald-600 dark:bg-emerald-500 px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_0_#0f172a] dark:shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#059669] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <Building2 size={16} />
              <span>{t('hp.nav.exploreBusiness', 'Explore for business')}</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center justify-center rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-transparent px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-[var(--fv-hp-text-title)] shadow-[3px_3px_0_0_var(--fv-hp-border)] hover:bg-[var(--fv-hp-bg-alt)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {t('hp.business.cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
