'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Terminal,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Activity,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';

const stats = [
  { valueKey: 'hp.hero.stat1Value', labelKey: 'hp.hero.stat1Label' },
  { valueKey: 'hp.hero.stat2Value', labelKey: 'hp.hero.stat2Label' },
  { valueKey: 'hp.hero.stat3Value', labelKey: 'hp.hero.stat3Label' },
] as const;

export function Hero() {
  const { t } = useTranslation();
  const [activeConsoleTab, setActiveConsoleTab] = useState<'agent' | 'gateway' | 'runway'>('agent');

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[var(--fv-hp-bg)] text-[var(--fv-hp-text-title)] px-6 pt-28 pb-16 md:px-10 transition-colors duration-200"
    >
      {/* Particle Canvas Animation Background */}
      <ParticleCanvas />

      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-blue-600/10 via-emerald-500/10 to-transparent blur-3xl opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent blur-3xl opacity-60"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Main Grid: Left Pitch, Right Telemetry Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headlines, Copy, CTAs */}
          <div className="lg:col-span-7">
            {/* System Status Eyebrow Pill */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-600/30 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/40 px-4 py-1.5 text-[11px] font-mono font-bold tracking-[0.18em] text-emerald-800 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SYSTEM v2.4 • REALTIME FINANCIAL TELEMETRY</span>
            </div>

            <h1
              className="hp-display text-[var(--fv-hp-display-xl)] font-black leading-[0.92] tracking-tighter text-[var(--fv-hp-text-title)] uppercase"
              style={{ textWrap: 'balance' }}
            >
              {t('hp.hero.headline')}
            </h1>

            <p className="mt-6 max-w-[52ch] text-base md:text-xl font-medium leading-[1.65] text-[var(--fv-hp-text-body)]">
              {t('hp.hero.subheadline')}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[10px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-accent)] px-8 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white transition-all shadow-[4px_4px_0_0_#0f172a] dark:shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#1D4ED8] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
              >
                <span>{t('hp.hero.ctaPrimary')}</span>
                <ArrowRight size={16} strokeWidth={3} />
              </Link>

              <button
                type="button"
                onClick={() =>
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="inline-flex min-h-[52px] items-center justify-center rounded-[10px] border-2 border-[var(--fv-hp-border-strong)] bg-[var(--fv-hp-surface)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--fv-hp-text-title)] transition-all hover:bg-[var(--fv-hp-bg-alt)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 shadow-[3px_3px_0_0_var(--fv-hp-border)] cursor-pointer"
              >
                {t('hp.hero.ctaSecondary')}
              </button>
            </div>

            {/* Security & Architecture Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--fv-hp-text-muted)]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold">MPGS 3DS 2.0 CLEARED</span>
              </div>
              <div className="h-3 w-[1px] bg-[var(--fv-hp-border)]" />
              <div className="flex items-center gap-1.5">
                <Lock size={14} className="text-blue-600 dark:text-blue-400" />
                <span className="font-bold">LOCAL-FIRST ENCLAVE</span>
              </div>
              <div className="h-3 w-[1px] bg-[var(--fv-hp-border)]" />
              <div className="flex items-center gap-1.5">
                <Cpu size={14} className="text-amber-600 dark:text-amber-400" />
                <span className="font-bold">&lt;45ms AGENT VELOCITY</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Code & Financial Telemetry Console */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[16px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-console-bg)] shadow-[10px_10px_0_0_#1D4ED8] overflow-hidden">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between border-b-2 border-[var(--fv-hp-border)] bg-[var(--fv-hp-console-titlebar)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#EB001B] border border-black/30" />
                  <div className="h-3 w-3 rounded-full bg-[#F79E1B] border border-black/30" />
                  <div className="h-3 w-3 rounded-full bg-[#10B981] border border-black/30" />
                  <span className="ml-2 font-mono text-[11px] font-bold text-[var(--fv-hp-text-muted)]">
                    finovault-engine.telemetry
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>LIVE</span>
                </div>
              </div>

              {/* Console Tabs */}
              <div className="flex border-b border-[var(--fv-hp-border)] bg-[var(--fv-hp-console-titlebar)] text-[10px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setActiveConsoleTab('agent')}
                  className={`flex-1 py-2.5 px-3 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeConsoleTab === 'agent'
                      ? 'border-b-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-title)]'
                      : 'text-[var(--fv-hp-text-muted)] hover:text-[var(--fv-hp-text-title)]'
                  }`}
                >
                  [ 01 / AI AGENT ]
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConsoleTab('gateway')}
                  className={`flex-1 py-2.5 px-3 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeConsoleTab === 'gateway'
                      ? 'border-b-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-title)]'
                      : 'text-[var(--fv-hp-text-muted)] hover:text-[var(--fv-hp-text-title)]'
                  }`}
                >
                  [ 02 / MPGS VAULT ]
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConsoleTab('runway')}
                  className={`flex-1 py-2.5 px-3 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeConsoleTab === 'runway'
                      ? 'border-b-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-title)]'
                      : 'text-[var(--fv-hp-text-muted)] hover:text-[var(--fv-hp-text-title)]'
                  }`}
                >
                  [ 03 / CASHFLOW ]
                </button>
              </div>

              {/* Telemetry Stream Output */}
              <div className="p-5 font-mono text-xs leading-relaxed space-y-3 min-h-[260px] bg-[var(--fv-hp-console-inner)] text-[var(--fv-hp-console-text)]">
                {activeConsoleTab === 'agent' && (
                  <>
                    <div className="text-[var(--fv-hp-text-muted)] flex items-center gap-2">
                      <Terminal size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>INITIALIZING PATTERN RECOGNITION...</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">✓ [SYNC] </span>
                      <span className="text-[var(--fv-hp-text-body)]">SBM Current Account • Bal: </span>
                      <span className="font-bold text-[var(--fv-hp-text-title)]">MUR 124,500.00</span>
                    </div>
                    <div className="text-[var(--fv-hp-text-body)]">
                      <span className="text-blue-600 dark:text-blue-400 font-black">⚡ [AI COACH] </span>
                      <span>Pattern alert: recurring SaaS subscription detected. Suggesting Tax Shield contribution.</span>
                    </div>
                    <div className="rounded-[8px] border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-2.5 text-[11px] shadow-sm">
                      <div className="text-[var(--fv-hp-text-muted)] mb-1 font-bold">PROJECTION MODEL:</div>
                      <div className="text-emerald-600 dark:text-emerald-300 font-bold">Surplus velocity: +MUR 36,400 / mo</div>
                      <div className="text-[var(--fv-hp-text-muted)] text-[10px]">Confidence score: 98.4% • Model: Finovault Intelligence</div>
                    </div>
                  </>
                )}

                {activeConsoleTab === 'gateway' && (
                  <>
                    <div className="text-[var(--fv-hp-text-muted)] flex items-center gap-2">
                      <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>MASTERCARD PAYMENT GATEWAY SERVICES</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">✓ [MPGS] </span>
                      <span className="text-[var(--fv-hp-text-body)]">Card Vault: </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">Mastercard •••• 3456</span>
                    </div>
                    <div className="text-[var(--fv-hp-text-body)]">
                      <span className="text-amber-600 dark:text-amber-400 font-black">★ [TOKEN] </span>
                      <span>PCI-DSS Level 1 tokenized enclave active</span>
                    </div>
                    <div className="rounded-[8px] border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-2.5 text-[11px] shadow-sm">
                      <div className="text-[var(--fv-hp-text-muted)] mb-1 font-bold">SETTLEMENT ENGINE:</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">Status: CAPTURED & SETTLED</div>
                      <div className="text-[var(--fv-hp-text-muted)] text-[10px]">Auth: MC_AUTH_849201 • 3-D Secure 2.0 Authenticated</div>
                    </div>
                  </>
                )}

                {activeConsoleTab === 'runway' && (
                  <>
                    <div className="text-[var(--fv-hp-text-muted)] flex items-center gap-2">
                      <Activity size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>SME CASHFLOW RUNWAY MONITOR</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">✓ [LIQUIDITY] </span>
                      <span className="text-[var(--fv-hp-text-body)]">Total Treasury: </span>
                      <span className="font-bold text-[var(--fv-hp-text-title)]">MUR 480,000.00</span>
                    </div>
                    <div className="text-[var(--fv-hp-text-body)]">
                      <span className="text-blue-600 dark:text-blue-400 font-black">⚡ [BURN] </span>
                      <span>Monthly net burn: MUR 26,000 (Burn Multiple: 1.1x)</span>
                    </div>
                    <div className="rounded-[8px] border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-2.5 text-[11px] shadow-sm">
                      <div className="text-[var(--fv-hp-text-muted)] mb-1 font-bold">RUNWAY ANALYSIS:</div>
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">18.4 Months Runway post-filing</div>
                      <div className="text-[var(--fv-hp-text-muted)] text-[10px]">MRA Tax filing deadline: Oct 15 • Reserve: Compliant</div>
                    </div>
                  </>
                )}
              </div>

              {/* Terminal Footer Metrics Bar */}
              <div className="flex items-center justify-between border-t-2 border-[var(--fv-hp-border)] bg-[var(--fv-hp-console-titlebar)] px-4 py-2.5 text-[10px] font-mono text-[var(--fv-hp-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>ENC: AES-256</span>
                </div>
                <span>MEM: 42MB</span>
                <span>LATENCY: 12ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Matrix Band */}
        <div className="mt-16 border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-card-bg)] shadow-[6px_6px_0_0_#1D4ED8]">
          <dl className="grid grid-cols-1 divide-y-2 md:divide-y-0 md:divide-x-2 divide-[var(--fv-hp-border)] md:grid-cols-3">
            {stats.map(({ valueKey, labelKey }) => (
              <div key={valueKey} className="p-6 md:p-8">
                <dt className="sr-only">{t(labelKey)}</dt>
                <dd className="hp-display text-[var(--fv-hp-stat)] font-black text-[var(--fv-hp-text-title)] leading-none tracking-tight">
                  {t(valueKey)}
                </dd>
                <dd className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--fv-hp-accent-gold)]">
                  {t(labelKey)}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[var(--fv-hp-text-muted)] flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-[var(--fv-hp-accent)] inline-block" />
          {t('hp.illustrative')}
        </p>
      </div>
    </section>
  );
}
