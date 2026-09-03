import React from 'react';
import { VaultMark } from '@/components/VaultMark';

/**
 * Centered auth/onboarding layout: brand mark + wordmark over a light-blue
 * gradient canvas, form content inside a surface card. Used by login, signup
 * and the onboarding steps.
 */
export function AuthShell({
  title,
  subtitle,
  step,
  children,
}: {
  title: string;
  subtitle?: string;
  step?: { current: number; total: number };
  children: React.ReactNode;
}) {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10"
      style={{
        background:
          'radial-gradient(120% 100% at 50% 0%, var(--fv-wash) 0%, var(--fv-bg) 55%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--fv-accent)] opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-[var(--fv-primary-light)] opacity-10 blur-3xl"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <VaultMark size={56} />
          <span className="font-display mt-3 text-2xl font-bold text-[var(--fv-primary)]">
            Finovault
          </span>
          <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight text-[var(--fv-text)]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-xs text-center text-[15px] leading-relaxed text-[var(--fv-text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="rounded-[16px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] p-6 shadow-[var(--fv-shadow-card)]">
          {children}
        </div>

        {step ? (
          <div className="mt-6 flex items-center justify-center gap-1.5" aria-label={`Step ${step.current} of ${step.total}`}>
            {Array.from({ length: step.total }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < step.current ? 'w-5 bg-[var(--fv-primary)]' : 'w-1.5 bg-[var(--fv-border)]'
                }`}
              />
            ))}
          </div>
        ) : null}

        <p className="mt-6 text-center text-xs font-medium text-[var(--fv-text-secondary)]">
          <span aria-hidden>• </span>
          Secured &amp; encrypted
        </p>
      </div>
    </main>
  );
}