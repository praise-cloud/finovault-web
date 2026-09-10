'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui';

const FAQ_KEYS = [
  { question: 'help.q1', answer: 'help.a1' },
  { question: 'help.q2', answer: 'help.a2' },
  { question: 'help.q3', answer: 'help.a3' },
] as const;

// ponytail: support@ address is a placeholder — swap to the real address when
// the backend/infra contract lands.
const SUPPORT_EMAIL = 'support@finovault.app';

export default function HelpPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[var(--fv-text)]">{t('help.title')}</h1>

      <section aria-labelledby="help-faq-title">
        <h2 id="help-faq-title" className="mb-3 text-lg font-semibold text-[var(--fv-text)]">
          {t('help.faqTitle')}
        </h2>
        <div className="flex flex-col gap-2">
          {FAQ_KEYS.map(({ question, answer }) => (
            <details
              key={question}
              className="rounded-[10px] border-2 border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 shadow-[var(--fv-shadow-hard-sm)]"
            >
              <summary className="cursor-pointer list-none text-[15px] font-semibold text-[var(--fv-text)]">
                {t(question)}
              </summary>
              <p className="mt-2 text-[15px] leading-[21px] text-[var(--fv-text-secondary)]">
                {t(answer)}
              </p>
            </details>
          ))}
        </div>
      </section>

      <GlassCard className="flex flex-col items-start gap-2">
        <h2 className="text-lg font-semibold text-[var(--fv-text)]">{t('help.contactTitle')}</h2>
        <p className="text-[15px] text-[var(--fv-text-secondary)]">{t('help.contactBody')}</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-1 flex items-center gap-2 rounded-[10px] border-2 border-[var(--fv-border)] bg-[var(--fv-wash)] px-4 py-2.5 text-sm font-semibold text-[var(--fv-text)] transition-colors duration-[120ms] hover:bg-[var(--fv-border-subtle)]"
        >
          {t('help.contactCta')}
        </a>
        <Link
          href="/coach"
          className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--fv-primary)] hover:opacity-80"
        >
          <MessageCircle size={16} strokeWidth={1.8} />
          {t('help.coachCta')}
        </Link>
      </GlassCard>
    </div>
  );
}