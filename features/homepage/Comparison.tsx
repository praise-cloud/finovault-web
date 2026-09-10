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
    <section aria-label="Comparison" className="bg-[#0a0e17] py-24 md:py-32">
      <div className="mx-auto max-w-7xl overflow-x-auto px-6 md:px-10">
        <h2
          className="hp-display text-[var(--fv-hp-display-lg)] font-bold text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.comparison.title')}
        </h2>
        <div className="mt-12 min-w-[640px]">
          {/* Header */}
          <div className="grid grid-cols-5 border-b border-white/10 pb-4">
            <div />
            {columns.map(({ key, highlight }) => (
              <div
                key={key}
                className={`text-center text-[0.75rem] font-bold uppercase tracking-[0.1em] ${
                  highlight ? 'text-[var(--fv-hp-accent)]' : 'text-white/50'
                }`}
              >
                {t(`hp.comparison.${key}`)}
              </div>
            ))}
          </div>
          {/* Rows */}
          {rows.map(({ labelKey, fKey, tKey, bKey, wKey }) => (
            <div key={labelKey} className="grid grid-cols-5 border-b border-white/10 py-4">
              <div className="pr-4 text-sm font-bold text-white">{t(labelKey)}</div>
              <div className="px-2 text-center text-sm font-semibold text-white">{t(fKey)}</div>
              <div className="px-2 text-center text-sm font-medium text-[var(--fv-hp-text-body)]">{t(tKey)}</div>
              <div className="px-2 text-center text-sm font-medium text-[var(--fv-hp-text-body)]">{t(bKey)}</div>
              <div className="px-2 text-center text-sm font-medium text-[var(--fv-hp-text-body)]">{t(wKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
