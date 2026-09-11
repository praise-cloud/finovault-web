'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const rows = [
  {
    labelKey: 'hp.comparison.approach',
    fKey: 'hp.comparison.approachF',
    tKey: 'hp.comparison.approachT',
    bKey: 'hp.comparison.approachB',
    wKey: 'hp.comparison.approachW',
  },
  {
    labelKey: 'hp.comparison.dataControl',
    fKey: 'hp.comparison.dataF',
    tKey: 'hp.comparison.dataT',
    bKey: 'hp.comparison.dataB',
    wKey: 'hp.comparison.dataW',
  },
  {
    labelKey: 'hp.comparison.intelligence',
    fKey: 'hp.comparison.intelF',
    tKey: 'hp.comparison.intelT',
    bKey: 'hp.comparison.intelB',
    wKey: 'hp.comparison.intelW',
  },
  {
    labelKey: 'hp.comparison.cost',
    fKey: 'hp.comparison.costF',
    tKey: 'hp.comparison.costT',
    bKey: 'hp.comparison.costB',
    wKey: 'hp.comparison.costW',
  },
  {
    labelKey: 'hp.comparison.focus',
    fKey: 'hp.comparison.focusF',
    tKey: 'hp.comparison.focusT',
    bKey: 'hp.comparison.focusB',
    wKey: 'hp.comparison.focusW',
  },
] as const;

const columns = [
  { key: 'colFinovault', highlight: true },
  { key: 'colTraditional', highlight: false },
  { key: 'colBudgeting', highlight: false },
  { key: 'colWealth', highlight: false },
] as const;

export function Comparison() {
  const { t } = useTranslation();

  return (
    <section aria-label="Comparison" className="bg-[#0a0e17] py-24 md:py-32 border-t-2 border-white/10">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
          [ 08 / ARCHITECTURE MATRIX ]
        </div>
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-black leading-tight tracking-tight text-white uppercase"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.comparison.title')}
        </h2>

        <div className="mt-14 overflow-x-auto border-2 border-white/25 bg-[#0d121c] p-4 md:p-8 shadow-[8px_8px_0_0_#1D4ED8]">
          <div className="min-w-[700px]">
            {/* Header */}
            <div className="grid grid-cols-5 border-b-2 border-white/20 pb-4 items-center">
              <div className="text-xs font-mono font-black text-white/40 uppercase tracking-widest pl-2">
                DIMENSION
              </div>
              {columns.map(({ key, highlight }) => (
                <div
                  key={key}
                  className={`text-center text-xs font-black uppercase tracking-wider py-2 px-2 ${
                    highlight
                      ? 'border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent)] text-white shadow-[2px_2px_0_0_#ffffff]'
                      : 'text-white/60'
                  }`}
                >
                  {t(`hp.comparison.${key}`)}
                </div>
              ))}
            </div>

            {/* Rows */}
            {rows.map(({ labelKey, fKey, tKey, bKey, wKey }) => (
              <div
                key={labelKey}
                className="grid grid-cols-5 border-b border-white/10 py-4 items-center hover:bg-white/[0.02] transition-colors"
              >
                <div className="pr-4 pl-2 text-xs md:text-sm font-black text-white uppercase tracking-tight">
                  {t(labelKey)}
                </div>
                <div className="px-2 text-center text-xs md:text-sm font-black text-white border-x-2 border-[var(--fv-hp-accent)]/30 bg-[var(--fv-hp-accent)]/10 py-1.5">
                  {t(fKey)}
                </div>
                <div className="px-2 text-center text-xs md:text-sm font-medium text-[var(--fv-hp-text-body)]">
                  {t(tKey)}
                </div>
                <div className="px-2 text-center text-xs md:text-sm font-medium text-[var(--fv-hp-text-body)]">
                  {t(bKey)}
                </div>
                <div className="px-2 text-center text-xs md:text-sm font-medium text-[var(--fv-hp-text-body)]">
                  {t(wKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
