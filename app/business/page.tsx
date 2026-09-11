'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  Lock,
  Users,
} from 'lucide-react';
import { Nav } from '@/features/homepage/Nav';
import { Footer } from '@/features/homepage/Footer';
import { ParticleCanvas } from '@/components/ui/ParticleCanvas';

const businessModules = [
  {
    icon: CreditCard,
    title: 'Mastercard MPGS Merchant Enclave',
    tag: 'PAYMENT GATEWAY',
    desc: 'Tokenized multi-currency acquiring with 3DS 2.0 biometric protection. Settle commercial client invoices in MUR, USD, EUR, and ZAR with zero cross-border friction.',
    bullets: ['Instant PCI-DSS Level 1 tokenized vaults', 'Recurring subscription billing engine', 'Interbank instant settlement protocol'],
  },
  {
    icon: TrendingUp,
    title: 'Autonomous Cashflow & Runway AI',
    tag: 'TREASURY PREDICTION',
    desc: 'Dynamic 36-month liquidity simulations that predict cash runway deficits weeks before they happen, automatically sweeping operational surplus into safe reserves.',
    bullets: ['Daily net-burn velocity monitoring', 'Automated revenue lag stress testing', 'Emergency liquidity buffer alerts'],
  },
  {
    icon: FileCheck,
    title: 'Corporate Tax Shield & Invoicing',
    tag: 'STATUTORY COMPLIANCE',
    desc: 'Automated VAT / Corporate Tax withholding on every receivable, syncing seamlessly with Mauritius Revenue Authority (MRA) filing standards.',
    bullets: ['Real-time tax liability auto-quarantine', 'One-click vendor invoice reconciliation', 'Exportable audit-ready ledger packages'],
  },
  {
    icon: Users,
    title: 'Multi-Role Governance & 4-Eyes Policy',
    tag: 'ENTERPRISE ACCESS',
    desc: 'Granular permissions for Directors, Treasurers, Auditors, and Operations managers. High-value disbursements require dual cryptographic approvals.',
    bullets: ['Role-based permission architecture', 'Immutable audit trail for every transaction', 'Custom spending limits and dual sign-off'],
  },
];

const tiers = [
  {
    name: 'SME Starter',
    price: 'MUR 3,500',
    cycle: '/month',
    desc: 'For growing businesses seeking unified accounts, automated tax shielding, and real-time runway tracking.',
    features: ['Up to 5 connected commercial accounts', 'Automated MRA tax reserve allocation', 'Mastercard MPGS checkout integration', 'Single entity management', 'Standard business support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth Treasury',
    price: 'MUR 9,500',
    cycle: '/month',
    desc: 'For scaling companies with multi-currency cashflows, recurring billing, and team approval workflows.',
    features: ['Unlimited bank & vault accounts', 'Multi-entity consolidation', 'Mastercard MPGS tokenized card vault', '4-eyes approval workflow matrix', 'Predictive 36-month burn simulator', 'Priority 24/7 treasury desk'],
    cta: 'Start 14-Day Trial',
    popular: true,
  },
  {
    name: 'Enterprise Enclave',
    price: 'Custom',
    cycle: 'tailored',
    desc: 'For multinational conglomerates and financial institutions requiring bespoke on-premise vault adapters.',
    features: ['Dedicated isolated database enclave', 'Custom ERP & SAP API webhooks', 'Direct SWIFT / ISO 20022 bridges', 'Dedicated corporate relationship director', 'Custom SLA & 99.99% uptime guarantee'],
    cta: 'Talk to Treasury Team',
    popular: false,
  },
];

export default function BusinessPage() {
  const { t } = useTranslation();
  const [selectedEntity, setSelectedEntity] = useState<'alpha' | 'beta' | 'group'>('group');

  return (
    <div className="min-h-screen bg-[var(--fv-hp-bg)] text-[var(--fv-hp-text-title)] selection:bg-[var(--fv-hp-accent)] selection:text-white transition-colors duration-200">
      <Nav />

      {/* Hero Section */}
      <section className="relative min-h-[90svh] flex flex-col justify-center overflow-hidden px-6 pt-32 pb-20 md:px-10">
        <ParticleCanvas />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Pitch */}
            <div className="lg:col-span-7">
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-600/30 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/40 px-4 py-1.5 text-[11px] font-mono font-bold tracking-[0.18em] text-emerald-800 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Building2 size={13} className="animate-pulse" />
                <span>FINOVAULT FOR BUSINESS • ENTERPRISE EDITION</span>
              </div>

              <h1 className="hp-display text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight uppercase">
                OWN YOUR CORPORATE TREASURY.
              </h1>

              <p className="mt-6 max-w-[55ch] text-base sm:text-xl font-medium leading-relaxed text-[var(--fv-hp-text-body)]">
                Unified corporate banking, predictive cashflow runway, automated statutory tax shielding, and Mastercard MPGS payment infrastructure — built for high-growth enterprises and SMEs.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-accent)] px-8 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-white transition-all shadow-[4px_4px_0_0_#0f172a] dark:shadow-[4px_4px_0_0_#ffffff] hover:shadow-[6px_6px_0_0_#1D4ED8] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  <span>Open Business Account</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>

                <a
                  href="#plans"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-surface)] px-8 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[var(--fv-hp-text-title)] transition-all hover:bg-[var(--fv-hp-bg-alt)] hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-[3px_3px_0_0_var(--fv-hp-border)] cursor-pointer"
                >
                  <span>Explore Enterprise Plans</span>
                </a>
              </div>

              {/* Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--fv-hp-text-muted)]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>MASTERCARD MPGS VAULT</span>
                </div>
                <div className="h-3 w-[1px] bg-[var(--fv-hp-border)]" />
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>ISO 27001 & PCI-DSS READY</span>
                </div>
              </div>
            </div>

            {/* Interactive Treasury Console */}
            <div className="lg:col-span-5">
              <div className="relative rounded-[16px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-console-bg)] p-6 shadow-[10px_10px_0_0_#1D4ED8]">
                {/* Entity Selector */}
                <div className="flex items-center justify-between border-b-2 border-[var(--fv-hp-border)] pb-4 mb-5">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--fv-hp-text-title)]">
                    // TREASURY MULTI-ENTITY CONSOLE
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 border border-emerald-500/30">
                    REALTIME SYNC
                  </span>
                </div>

                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'group', name: 'Group Consolidated' },
                    { id: 'alpha', name: 'TechLabs Ltd' },
                    { id: 'beta', name: 'Apex Cargo Ltd' },
                  ].map((ent) => (
                    <button
                      key={ent.id}
                      type="button"
                      onClick={() => setSelectedEntity(ent.id as any)}
                      className={`flex-1 py-1.5 px-2 text-[10px] font-mono font-bold uppercase border transition-all cursor-pointer ${
                        selectedEntity === ent.id
                          ? 'border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent)] text-white'
                          : 'border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-muted)] hover:text-[var(--fv-hp-text-title)]'
                      }`}
                    >
                      {ent.name}
                    </button>
                  ))}
                </div>

                {/* Metric Summary */}
                <div className="border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-bg-alt)] p-5 mb-5 shadow-xs">
                  <div className="flex justify-between items-center text-[0.7rem] font-mono font-bold uppercase tracking-widest text-[var(--fv-hp-text-muted)]">
                    <span>CONSOLIDATED RUNWAY</span>
                    <span className="text-emerald-600 dark:text-emerald-400">HEALTHY RISK PROFILE</span>
                  </div>
                  <div className="hp-display text-4xl font-black mt-2 text-[var(--fv-hp-text-title)]">
                    {selectedEntity === 'group' ? '21.6 MONTHS' : selectedEntity === 'alpha' ? '14.2 MONTHS' : '32.0 MONTHS'}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-[var(--fv-hp-text-body)]">Total Liquid Cash:</span>
                    <span className="text-[var(--fv-hp-accent)]">
                      {selectedEntity === 'group' ? 'MUR 8,420,000' : selectedEntity === 'alpha' ? 'MUR 2,560,000' : 'MUR 5,860,000'}
                    </span>
                  </div>
                </div>

                {/* Sub-ledgers */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-3 flex justify-between items-center">
                    <span className="text-[var(--fv-hp-text-body)]">OPERATING BURN / MO</span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {selectedEntity === 'group' ? '-MUR 390,000' : selectedEntity === 'alpha' ? '-MUR 180,000' : '-MUR 210,000'}
                    </span>
                  </div>

                  <div className="border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-3 flex justify-between items-center">
                    <span className="text-[var(--fv-hp-text-body)]">MRA TAX RESERVE (ISOLATED)</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {selectedEntity === 'group' ? 'MUR 1,240,000 [SAFE]' : 'MUR 380,000 [SAFE]'}
                    </span>
                  </div>

                  <div className="border border-[var(--fv-hp-border)] bg-[var(--fv-hp-surface)] p-3 flex justify-between items-center">
                    <span className="text-[var(--fv-hp-text-body)]">MPGS MERCHANT SETTLEMENTS</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">99.98% SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="border-t-2 border-[var(--fv-hp-border)] py-24 px-6 md:px-10 bg-[var(--fv-hp-surface)]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--fv-hp-accent)]">
            [ ARCHITECTURE & CAPABILITIES ]
          </div>
          <h2 className="hp-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[var(--fv-hp-text-title)]">
            ENGINEERED FOR CORPORATE RESILIENCE.
          </h2>
          <p className="mt-4 max-w-[65ch] text-base text-[var(--fv-hp-text-body)] font-medium">
            Everything your finance team, board, and auditors need to manage corporate capital with ironclad confidence.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {businessModules.map((mod, i) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={i}
                  className="border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-card-bg)] p-8 shadow-[6px_6px_0_0_#1D4ED8] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-[var(--fv-hp-border)] pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-accent)] text-white flex items-center justify-center">
                          <IconComp size={20} />
                        </div>
                        <span className="font-mono text-xs font-black uppercase tracking-widest text-[var(--fv-hp-accent)]">
                          {mod.tag}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-[var(--fv-hp-text-muted)]">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="hp-display text-2xl font-black uppercase tracking-tight text-[var(--fv-hp-text-title)]">
                      {mod.title}
                    </h3>
                    <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--fv-hp-text-body)]">
                      {mod.desc}
                    </p>
                  </div>

                  <ul className="mt-8 space-y-2 border-t border-[var(--fv-hp-border)] pt-5">
                    {mod.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-center gap-2 text-xs font-bold text-[var(--fv-hp-text-body)]">
                        <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section id="plans" className="border-t-2 border-[var(--fv-hp-border)] py-24 px-6 md:px-10 bg-[var(--fv-hp-bg)]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-4 inline-flex items-center gap-2 border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent-light)] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--fv-hp-accent)]">
              [ TRANSPARENT CORPORATE PRICING ]
            </div>
            <h2 className="hp-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-[var(--fv-hp-text-title)]">
              PREDICTABLE SCALE. ZERO SURPRISES.
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-card-bg)] p-8 transition-all flex flex-col justify-between ${
                  tier.popular
                    ? 'shadow-[10px_10px_0_0_#1D4ED8] lg:-translate-y-2'
                    : 'shadow-[5px_5px_0_0_var(--fv-hp-border)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="hp-display text-xl font-black uppercase text-[var(--fv-hp-text-title)]">
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <span className="border-2 border-[var(--fv-hp-accent)] bg-[var(--fv-hp-accent)] px-2.5 py-0.5 text-[0.68rem] font-black uppercase tracking-wider text-white">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 my-6">
                    <span className="hp-display text-4xl sm:text-5xl font-black text-[var(--fv-hp-text-title)]">
                      {tier.price}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--fv-hp-text-muted)]">
                      {tier.cycle}
                    </span>
                  </div>

                  <p className="text-xs font-medium leading-relaxed text-[var(--fv-hp-text-body)] mb-8">
                    {tier.desc}
                  </p>

                  <ul className="space-y-3 border-t border-[var(--fv-hp-border)] pt-6">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-xs font-semibold text-[var(--fv-hp-text-body)]">
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 pt-6">
                  <Link
                    href="/signup"
                    className={`w-full inline-flex min-h-[48px] items-center justify-center rounded-[6px] border-2 border-[var(--fv-hp-card-border)] px-6 py-3 text-xs font-black uppercase tracking-[0.16em] transition-all cursor-pointer ${
                      tier.popular
                        ? 'bg-[var(--fv-hp-accent)] text-white shadow-[3px_3px_0_0_#0f172a] dark:shadow-[3px_3px_0_0_#ffffff] hover:shadow-[5px_5px_0_0_#1D4ED8]'
                        : 'bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-title)] hover:bg-[var(--fv-hp-bg-alt)]'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
