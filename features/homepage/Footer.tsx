'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { VaultMark } from '@/components/VaultMark';

const navKeys = ['features', 'howItWorks', 'security', 'pricing'] as const;
const navIds = ['features', 'how-it-works', 'security', 'pricing'] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-[#0a0e17] py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Top row */}
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <VaultMark size={28} subdued />
              <span className="hp-display text-sm tracking-widest text-white">FINOVAULT</span>
            </div>
            <p className="mt-3 text-sm text-white/50">{t('hp.footer.tagline')}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <ul className="flex gap-6" role="list">
              {navKeys.map((key, i) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(navIds[i])?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t(`hp.footer.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
            {/* Social placeholders */}
            <div className="flex gap-4">
              {['X', 'Li', 'Ig'].map((s) => (
                <span
                  key={s}
                  className="flex h-8 w-8 items-center justify-center border border-white/10 text-[0.65rem] text-white/60 transition-colors hover:text-white"
                  aria-label={`${s} (coming soon)`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            {t('hp.footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6">
            {(['terms', 'privacy', 'contact'] as const).map((key) => (
              <span key={key} className="text-sm text-white/50 transition-colors hover:text-white cursor-pointer">
                {t(`hp.footer.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
