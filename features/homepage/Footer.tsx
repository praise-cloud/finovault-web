'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { VaultMark } from '@/components/VaultMark';

const navKeys = ['features', 'howItWorks', 'security', 'pricing'] as const;
const navIds = ['features', 'how-it-works', 'security', 'pricing'] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-white/20 bg-[#070a10] py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Top row */}
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <VaultMark size={32} subdued />
              <span className="hp-display text-lg font-black tracking-widest text-white">FINOVAULT</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[var(--fv-hp-text-muted)] max-w-sm">
              {t('hp.footer.tagline')}
            </p>
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <ul className="flex flex-wrap gap-6" role="list">
              {navKeys.map((key, i) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(navIds[i])?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="text-xs font-black uppercase tracking-[0.15em] text-white/70 transition-colors hover:text-white cursor-pointer"
                  >
                    {t(`hp.footer.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
            {/* Brutalist social boxes */}
            <div className="flex gap-3">
              {['X', 'LI', 'IG'].map((s) => (
                <span
                  key={s}
                  className="flex h-9 w-9 items-center justify-center border-2 border-white/25 bg-white/5 text-[0.7rem] font-mono font-black text-white transition-all hover:border-white hover:bg-white hover:text-black cursor-pointer shadow-[2px_2px_0_0_#ffffff]"
                  aria-label={`${s} (coming soon)`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-14 flex flex-col justify-between gap-4 border-t-2 border-white/15 pt-8 md:flex-row text-xs font-mono font-bold text-white/50">
          <p>
            {t('hp.footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            {(['terms', 'privacy', 'contact'] as const).map((key) => (
              <span key={key} className="uppercase tracking-wider transition-colors hover:text-white cursor-pointer">
                {t(`hp.footer.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
