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
    <section aria-label="Waitlist" className="relative bg-[#0a0e17] py-32">
      {/* Subtle purple glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-10">
        <h2
          className="hp-display text-[var(--fv-hp-display-xl)] text-white"
          style={{ textWrap: 'balance' }}
        >
          {t('hp.cta.headline')}
        </h2>
        <p className="mt-6 text-[var(--fv-hp-body-lg)] text-white/80">
          {t('hp.cta.subline')}
        </p>

        {submitted ? (
          <p aria-live="polite" className="mt-10 text-lg text-[#22c55e]">
            {t('hp.cta.success')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex max-w-xl flex-col gap-4 sm:flex-row sm:mx-auto">
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
              className="min-h-[52px] flex-1 rounded-none border border-white/20 bg-transparent px-4 py-3 text-white placeholder:text-white/40 focus:border-[#6366f1]"
            />
            <button
              type="submit"
              className="min-h-[52px] rounded-none bg-[#6366f1] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#818cf8]"
            >
              {t('hp.cta.button')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
