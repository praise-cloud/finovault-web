'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Wifi,
  Lock,
  ArrowUpRight,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export default function CardsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const hasMastercard = Boolean(user?.mastercardLast4 || (user?.subscriptionPlan && user.subscriptionPlan !== 'free'));
  const plan = user?.subscriptionPlan || 'free';
  const isPaid = plan === 'plus' || plan === 'business';
  const billingPeriod = user?.subscriptionPeriod || 'monthly';
  const last4 = user?.mastercardLast4 || (isPaid ? '3456' : '');
  const expiry = user?.mastercardExpiry || (isPaid ? '12/28' : '');

  // Next billing date: roughly 30 days from now
  const nextBillingDate = new Date();
  nextBillingDate.setDate(nextBillingDate.getDate() + 27);
  const nextBillingFormatted = nextBillingDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--fv-border-ink)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            {/* Mastercard Interlocking Circles */}
            <div className="flex items-center" aria-hidden="true">
              <div className="h-6 w-6 rounded-full bg-[#EB001B]" />
              <div className="-ml-3 h-6 w-6 rounded-full bg-[#F79E1B]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--fv-text)]">
              {t('cards.title')}
            </h1>
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">
            {t('cards.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/checkout"
            className="inline-flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{isPaid ? t('cards.manageSubscription') : t('cards.addCardBtn')}</span>
          </Link>
        </div>
      </div>

      {hasMastercard ? (
        <div className="space-y-8">
          {/* Main Grid: Active Card & Subscription Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Physical Mastercard Visual Representation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">
                {t('cards.activeCardTitle')}
              </div>

              <div className="relative overflow-hidden rounded-[16px] border-2 border-black bg-[#0B0E17] p-6 text-white shadow-[8px_8px_0_0_#1A1A2E] dark:shadow-[8px_8px_0_0_#000000]">
                {/* Circuit background glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-blue-600/25 to-transparent blur-2xl" />

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-400">
                    FINOVAULT {plan.toUpperCase()} • MPGS
                  </span>
                  <Wifi size={20} className="text-white/60 rotate-90" />
                </div>

                {/* EMV Gold Chip */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative h-9 w-12 rounded-[5px] border border-amber-600/70 bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 shadow-inner">
                    <div className="absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-amber-700/50" />
                    <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-700/50" />
                    <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-700/50" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-white/40">
                    DEBIT / CREDIT
                  </span>
                </div>

                {/* Masked Card Number */}
                <div className="mt-7 font-mono text-xl font-black tracking-[0.2em] text-white">
                  •••• •••• •••• {last4}
                </div>

                {/* Cardholder & Expiry */}
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                      CARDHOLDER
                    </div>
                    <div className="font-mono text-xs font-black uppercase tracking-wider text-white">
                      {user?.fullName || 'FINOVAULT MEMBER'}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                      EXPIRES
                    </div>
                    <div className="font-mono text-xs font-black tracking-wider text-white">
                      {expiry}
                    </div>
                  </div>

                  {/* Mastercard Dual Circle Logo */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center" aria-label="Mastercard">
                      <div className="h-8 w-8 rounded-full bg-[#EB001B] shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]" />
                      <div className="-ml-4 h-8 w-8 rounded-full bg-[#F79E1B] opacity-95 shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]" />
                    </div>
                    <span className="mt-0.5 text-[8px] font-black uppercase tracking-tighter text-white/90">
                      mastercard
                    </span>
                  </div>
                </div>
              </div>

              {/* Status pill under card */}
              <div className="flex items-center justify-between rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-3 text-xs font-mono shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
                <span className="text-[var(--fv-text-secondary)]">{t('cards.status')}:</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>{t('cards.statusActive')}</span>
                </span>
              </div>
            </div>

            {/* Right: Subscription Details & Features Unlocked */}
            <div className="lg:col-span-7 space-y-6">
              {/* Subscription Overview Card */}
              <div className="rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 shadow-[6px_6px_0_0_#1A1A2E] dark:shadow-[6px_6px_0_0_#000000]">
                <div className="flex items-center justify-between border-b border-[var(--fv-border-subtle)] pb-4">
                  <div>
                    <div className="text-[10px] font-mono font-black uppercase tracking-widest text-[var(--fv-text-secondary)]">
                      {t('cards.planBadge')}
                    </div>
                    <div className="mt-1 text-2xl font-black uppercase tracking-tight text-[var(--fv-primary)]">
                      FINOVAULT {plan.toUpperCase()}
                    </div>
                  </div>
                  <span className="rounded-[6px] border-2 border-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 shadow-[2px_2px_0_0_#065F46]">
                    MPGS SECURE
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 font-mono text-xs">
                  <div className="rounded-[8px] border border-[var(--fv-border-subtle)] bg-[var(--fv-wash)] p-3">
                    <span className="text-[var(--fv-text-secondary)]">{t('cards.billingCycle')}</span>
                    <div className="mt-1 font-black text-sm uppercase text-[var(--fv-text)]">
                      {billingPeriod}
                    </div>
                  </div>
                  <div className="rounded-[8px] border border-[var(--fv-border-subtle)] bg-[var(--fv-wash)] p-3">
                    <span className="text-[var(--fv-text-secondary)]">{t('cards.nextBilling')}</span>
                    <div className="mt-1 font-black text-sm text-[var(--fv-text)]">
                      {nextBillingFormatted}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center gap-1.5 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-4 py-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] hover:bg-[var(--fv-wash)] cursor-pointer"
                  >
                    <span>{t('cards.manageSubscription')}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    href="/checkout"
                    className="inline-flex items-center gap-1.5 rounded-[8px] border-2 border-[var(--fv-border-subtle)] px-4 py-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)] cursor-pointer"
                  >
                    <span>{t('cards.updateCard')}</span>
                  </Link>
                </div>
              </div>

              {/* Entitlements Checklist */}
              <div className="rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-6 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
                <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>{t('cards.featuresTitle')}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-[var(--fv-text)]">
                  <div className="flex items-center gap-2 rounded-[6px] border border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] p-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('cards.featurePattern')}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[6px] border border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] p-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('cards.featureCoach')}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[6px] border border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] p-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('cards.featureMulti')}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-[6px] border border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] p-2.5">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>{t('cards.featureRunway')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Mastercard Gateway Transactions */}
          <div className="rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 shadow-[6px_6px_0_0_#1A1A2E] dark:shadow-[6px_6px_0_0_#000000]">
            <div className="mb-4 flex items-center justify-between border-b border-[var(--fv-border-subtle)] pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
                <Receipt size={16} />
                <span>{t('cards.transactionsTitle')}</span>
              </div>
              <span className="font-mono text-[11px] text-[var(--fv-text-secondary)]">
                PROVIDER: MPGS (MASTERCARD)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--fv-border-subtle)] text-[var(--fv-text-secondary)]">
                    <th className="py-2.5 font-bold uppercase tracking-wider">Reference</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Method</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Auth Code</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--fv-border-subtle)]">
                  <tr>
                    <td className="py-3 font-bold text-[var(--fv-text)]">MPGS_TXN_984128</td>
                    <td className="py-3 text-[var(--fv-text-secondary)]">Mastercard •••• {last4}</td>
                    <td className="py-3 font-black text-[var(--fv-text)]">
                      MUR {plan === 'business' ? '5,000' : '199'}
                    </td>
                    <td className="py-3 text-emerald-600 font-bold">MC_AUTH_581920</td>
                    <td className="py-3">
                      <span className="rounded-[4px] border border-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                        SETTLED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: No Card Linked */
        <div className="rounded-[16px] border-2 border-dashed border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-8 md:p-12 text-center shadow-[6px_6px_0_0_#1A1A2E] dark:shadow-[6px_6px_0_0_#000000]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000]">
            <CreditCard size={32} className="text-[var(--fv-text-secondary)]" />
          </div>

          <h2 className="mt-5 text-xl font-black uppercase tracking-tight text-[var(--fv-text)]">
            {t('cards.noCardTitle')}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm font-semibold text-[var(--fv-text-secondary)]">
            {t('cards.noCardBody')}
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              href="/checkout?plan=plus"
              className="inline-flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <CreditCard size={16} strokeWidth={2.5} />
              <span>{t('cards.addCardBtn')}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}