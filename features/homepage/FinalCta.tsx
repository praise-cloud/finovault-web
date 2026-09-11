'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function FinalCta() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section aria-label="Waitlist" className="relative bg-[#0a0e17] py-28 md:py-36 border-t-2 border-white/10">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="border-2 border-white/30 bg-[#0d121c] p-8 md:p-16 shadow-[10px_10px_0_0_#1D4ED8] text-center">
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
            [ 10 / ACCESS INITIATION ]
          </div>
          <h2
            className="hp-display text-[var(--fv-hp-display-lg)] md:text-[var(--fv-hp-display-xl)] font-black leading-[0.92] tracking-tighter text-white uppercase"
            style={{ textWrap: 'balance' }}
          >
            {t('hp.cta.headline')}
          </h2>
          <p className="mt-6 text-base md:text-xl font-medium text-[var(--fv-hp-text-body)] max-w-2xl mx-auto">
            {t('hp.cta.subline')}
          </p>

          {submitted ? (
            <div className="mt-10 border-2 border-emerald-400 bg-emerald-950/40 p-6 max-w-md mx-auto">
              <p aria-live="polite" className="text-base md:text-lg font-black uppercase tracking-wider text-emerald-400">
                ✓ {t('hp.cta.success')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-12 flex max-w-xl flex-col gap-4 sm:flex-row sm:mx-auto">
              <label htmlFor="waitlist-email" className="sr-only">
                {t('hp.cta.emailPlaceholder')}
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('hp.cta.emailPlaceholder')}
                className="min-h-[56px] flex-1 rounded-none border-2 border-white/30 bg-black/60 px-5 py-4 text-sm font-bold text-white placeholder:text-white/40 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="min-h-[56px] rounded-none border-2 border-white bg-[var(--fv-hp-accent)] px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                {t('hp.cta.button')}
              </button>
            </form>
          )}

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between items-center text-xs font-mono font-bold text-white/50 tracking-wider">
            <span>ZERO DATA RESALE</span>
            <span>END-TO-END CRYPTOGRAPHIC AUDIT</span>
            <span>EARLY ALPHA STATUS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
