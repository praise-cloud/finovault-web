import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';

/**
 * Centered auth/onboarding layout: brand mark + wordmark over a brutalist
 * grid-accented canvas, form content inside a 2px-bordered surface card with
 * hard offset shadows. Used by login, signup, and onboarding steps.
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--fv-bg)] px-4 py-12">
      {/* Brutalist structural background grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Brand & Header Section */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
            <VaultMark size={38} />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-black uppercase tracking-wider text-[var(--fv-primary)]">
              Finovault
            </span>
            <span className="rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--fv-text)]">
              Core
            </span>
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--fv-text)]">
            {title}
          </h1>

          {subtitle ? (
            <p className="mt-1.5 max-w-sm text-sm font-medium leading-snug text-[var(--fv-text-secondary)]">
              {subtitle}
            </p>
          ) : null}

          {/* Brutalist Step Tracker */}
          {step ? (
            <div
              className="mt-4 flex w-full items-center justify-between gap-3 rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2 shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
              aria-label={`Step ${step.current} of ${step.total}`}
            >
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--fv-text)]">
                Step 0{step.current} / 0{step.total}
              </span>
              <div className="flex flex-1 items-center gap-1.5 max-w-[140px]">
                {Array.from({ length: step.total }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-[3px] border border-[var(--fv-border-ink)] transition-colors ${
                      i < step.current
                        ? 'bg-[var(--fv-primary)]'
                        : 'bg-[var(--fv-border-subtle)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Content Card with Brutalist 2px ink border and hard offset shadow */}
        <div className="rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 sm:p-7 shadow-[6px_6px_0_0_#1A1A2E] dark:shadow-[6px_6px_0_0_#000000]">
          {children}
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
            <ShieldCheck size={14} className="text-[var(--fv-role-accent,var(--fv-primary))]" />
            <span>Secured &amp; Encrypted</span>
          </div>
        </div>
      </div>
    </main>
  );
}