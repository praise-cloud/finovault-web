'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Wifi,
  Check,
} from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import type { MastercardPaymentResponse } from '@/types';

interface MastercardGatewayProps {
  initialPlan?: 'plus' | 'business';
}

const TEST_CARDS = {
  mastercard: {
    number: '5412 7512 3412 3456',
    expiry: '12/28',
    cvc: '888',
    name: 'GEORGE VALENTINE',
  },
};

export function MastercardGateway({ initialPlan = 'plus' }: MastercardGatewayProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [plan, setPlan] = useState<'plus' | 'business'>(initialPlan);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const [cardholderName, setCardholderName] = useState(user?.fullName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'challenge' | 'success'>('form');
  const [challengeOtp, setChallengeOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MastercardPaymentResponse | null>(null);

  // Pricing calculations (Mauritian Rupee MUR base)
  const isMonthly = billingPeriod === 'monthly';
  const amount = plan === 'plus' ? (isMonthly ? 199 : 1899) : (isMonthly ? 5000 : 48000);
  const currency = 'MUR';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvc(raw);
  };

  const fillTestCredentials = () => {
    setCardNumber(TEST_CARDS.mastercard.number);
    setExpiry(TEST_CARDS.mastercard.expiry);
    setCvc(TEST_CARDS.mastercard.cvc);
    if (!cardholderName) setCardholderName(TEST_CARDS.mastercard.name);
    if (!email) setEmail('test.subscriber@finovault.app');
    setError(null);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (!expiry || !expiry.includes('/')) {
      setError('Please provide a valid expiry date (MM/YY).');
      return;
    }
    if (cvc.length < 3) {
      setError('Please provide a valid 3-digit CVC.');
      return;
    }
    if (!cardholderName.trim()) {
      setError('Cardholder name is required.');
      return;
    }

    // Launch 3-D Secure / Mastercard Identity Check challenge
    setStep('challenge');
  };

  const handleCompleteChallenge = async () => {
    if (!challengeOtp.trim()) {
      setChallengeOtp('849201');
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const [expM, expY] = expiry.split('/');
      const res = await paymentApi.processMastercard({
        planId: plan,
        billingPeriod,
        amount,
        currency,
        cardholderName,
        cardNumber,
        expiryMonth: expM,
        expiryYear: expY ? (expY.length === 2 ? `20${expY}` : expY) : '2028',
        cvc,
        email: email || user?.email || 'user@finovault.app',
      });

      setResult(res);
      setStep('success');

      // Update active user state in auth store
      if (user) {
        setUser({
          ...user,
          subscriptionPlan: plan,
          subscriptionStatus: 'active',
          subscriptionPeriod: billingPeriod,
          mastercardLast4: res.last4,
          mastercardExpiry: res.expiry,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Mastercard payment authorization failed.';
      setError(msg);
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Top Header / Breadcrumb */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--fv-border-ink)] pb-6">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)] cursor-pointer"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span>{t('checkout.back')}</span>
          </button>
          <div className="flex items-center gap-3">
            {/* Mastercard Interlocking Circles Logo */}
            <div className="flex items-center" aria-hidden="true">
              <div className="h-7 w-7 rounded-full bg-[#EB001B] opacity-95 shadow-[1px_1px_0_0_#000000]" />
              <div className="-ml-3.5 h-7 w-7 rounded-full bg-[#F79E1B] opacity-95 shadow-[1px_1px_0_0_#000000]" />
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fv-text)]">
              {t('checkout.title')}
            </h1>
          </div>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">
            {t('checkout.subtitle')}
          </p>
        </div>

        {/* Security Trust Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-[8px] border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 shadow-[2px_2px_0_0_#065F46]">
            <ShieldCheck size={16} strokeWidth={2.5} />
            <span>MPGS 256-BIT SSL</span>
          </div>
          <div className="flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
            <Lock size={15} strokeWidth={2.5} />
            <span>3-D SECURE 2.0</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-[8px] border-2 border-red-600 bg-red-50 dark:bg-red-950/40 p-4 text-red-900 dark:text-red-200 shadow-[4px_4px_0_0_#991B1B]">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="text-sm font-bold">
            <span className="font-black uppercase tracking-wide">Error: </span>
            {error}
          </div>
        </div>
      )}

      {step === 'success' && result ? (
        /* Settlement Confirmation Receipt View */
        <div className="rounded-[16px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 md:p-10 shadow-[8px_8px_0_0_#1A1A2E] dark:shadow-[8px_8px_0_0_#000000]">
          <div className="flex items-center gap-3 border-b-2 border-emerald-600 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-700 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shadow-[3px_3px_0_0_#065F46]">
              <CheckCircle2 size={28} strokeWidth={3} />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                [ MPGS CAPTURED & SETTLED ]
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--fv-text)]">
                {t('checkout.successTitle')}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-[var(--fv-text-secondary)]">
            {t('checkout.successSubtitle')}
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Details Console */}
            <div className="rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-5 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
              <div className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">
                {t('checkout.summaryTitle')}
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[var(--fv-border-subtle)] pb-2">
                  <span className="text-[var(--fv-text-secondary)]">{t('checkout.txnId')}:</span>
                  <span className="font-bold text-[var(--fv-text)]">{result.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--fv-border-subtle)] pb-2">
                  <span className="text-[var(--fv-text-secondary)]">{t('checkout.authCode')}:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.authorizationCode}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--fv-border-subtle)] pb-2">
                  <span className="text-[var(--fv-text-secondary)]">{t('checkout.amountPaid')}:</span>
                  <span className="font-black text-sm text-[var(--fv-text)]">
                    {result.currency} {result.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[var(--fv-text-secondary)]">{t('checkout.cardUsed')}:</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-[var(--fv-text)]">
                    <span className="h-3 w-3 rounded-full bg-[#EB001B]" />
                    <span>Mastercard •••• {result.last4}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Unlocked Entitlements Box */}
            <div className="rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-5 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
                <Sparkles size={16} className="text-amber-500" />
                <span>{t('checkout.featuresUnlocked')}</span>
              </div>
              <ul className="space-y-2.5 text-xs font-bold text-[var(--fv-text)]">
                <li className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-emerald-600" />
                  <span>{t('checkout.feature1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-emerald-600" />
                  <span>{t('checkout.feature2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-emerald-600" />
                  <span>{t('checkout.feature3')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} strokeWidth={3} className="text-emerald-600" />
                  <span>{t('checkout.feature4')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <span>{t('checkout.dashboardBtn')}</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => router.push('/cards')}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
            >
              <CreditCard size={16} strokeWidth={2.5} />
              <span>{t('checkout.cardsBtn')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Main Interactive Payment Terminal */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Plan Selector & Physical Mastercard Visual */}
          <div className="lg:col-span-5 space-y-6">
            {/* Plan Switcher Pills */}
            <div className="rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-5 shadow-[6px_6px_0_0_#1A1A2E] dark:shadow-[6px_6px_0_0_#000000]">
              <div className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">
                {t('checkout.planSelection')}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlan('plus')}
                  className={`rounded-[10px] border-2 p-3 text-left transition-all cursor-pointer ${
                    plan === 'plus'
                      ? 'border-[var(--fv-primary)] bg-blue-50 dark:bg-blue-950/30 shadow-[3px_3px_0_0_#1D4ED8]'
                      : 'border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] hover:border-[var(--fv-border-ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
                      {t('checkout.planPlus')}
                    </span>
                    {plan === 'plus' && <Check size={14} strokeWidth={3} className="text-[var(--fv-primary)]" />}
                  </div>
                  <div className="mt-2 text-sm font-black text-[var(--fv-text)]">
                    {isMonthly ? 'MUR 199' : 'MUR 1,899'}
                    <span className="text-[10px] font-mono font-normal text-[var(--fv-text-secondary)]">
                      {isMonthly ? '/mo' : '/yr'}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlan('business')}
                  className={`rounded-[10px] border-2 p-3 text-left transition-all cursor-pointer ${
                    plan === 'business'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/30 shadow-[3px_3px_0_0_#D97706]'
                      : 'border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] hover:border-[var(--fv-border-ink)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
                      {t('checkout.planBiz')}
                    </span>
                    {plan === 'business' && <Check size={14} strokeWidth={3} className="text-amber-600" />}
                  </div>
                  <div className="mt-2 text-sm font-black text-[var(--fv-text)]">
                    {isMonthly ? 'MUR 5,000' : 'MUR 48,000'}
                    <span className="text-[10px] font-mono font-normal text-[var(--fv-text-secondary)]">
                      {isMonthly ? '/mo' : '/yr'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="mt-4 flex items-center justify-between border-t border-[var(--fv-border-subtle)] pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)]">
                  {t('checkout.billingCycle')}
                </span>
                <div className="flex items-center gap-1 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-1 text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('monthly')}
                    className={`rounded-[6px] px-2.5 py-1 uppercase tracking-wider transition-all cursor-pointer ${
                      isMonthly ? 'bg-[var(--fv-surface)] text-[var(--fv-text)] shadow-[1px_1px_0_0_#1A1A2E]' : 'text-[var(--fv-text-secondary)]'
                    }`}
                  >
                    {t('checkout.monthly')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('annually')}
                    className={`rounded-[6px] px-2.5 py-1 uppercase tracking-wider transition-all cursor-pointer ${
                      !isMonthly ? 'bg-[var(--fv-primary)] text-white shadow-[1px_1px_0_0_#1A1A2E]' : 'text-[var(--fv-text-secondary)]'
                    }`}
                  >
                    {t('checkout.yearly')}
                  </button>
                </div>
              </div>
            </div>

            {/* Neo-Brutalist Mastercard Interactive Card Visual */}
            <div className="relative overflow-hidden rounded-[16px] border-2 border-black bg-[#0B0E17] p-6 text-white shadow-[8px_8px_0_0_#1A1A2E] dark:shadow-[8px_8px_0_0_#000000]">
              {/* Circuit ambient watermark */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br from-blue-600/20 to-transparent blur-2xl" />

              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-400">
                  FINOVAULT {plan.toUpperCase()} • MPGS SECURE
                </span>
                <Wifi size={20} className="text-white/60 rotate-90" />
              </div>

              {/* Gold Chip */}
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

              {/* Spaced Card Number */}
              <div className="mt-7 font-mono text-lg md:text-xl font-black tracking-[0.2em] text-white">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              {/* Cardholder & Expiry */}
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                    CARDHOLDER
                  </div>
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-white">
                    {cardholderName || 'CARDHOLDER NAME'}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/50">
                    EXPIRES
                  </div>
                  <div className="font-mono text-xs font-black tracking-wider text-white">
                    {expiry || 'MM/YY'}
                  </div>
                </div>

                {/* Mastercard Interlocking Circles Acceptance Mark */}
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

            {/* Quick Fill Test Mastercard Button */}
            <div className="rounded-[10px] border-2 border-dashed border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-4 text-center">
              <p className="text-xs font-semibold text-[var(--fv-text-secondary)] mb-2.5">
                Developer Sandbox: Test using standard Mastercard MPGS credentials
              </p>
              <button
                type="button"
                onClick={fillTestCredentials}
                className="inline-flex items-center gap-2 rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-4 py-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>{t('checkout.fillTestCard')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Mastercard Payment Gateway Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[16px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 md:p-8 shadow-[8px_8px_0_0_#1A1A2E] dark:shadow-[8px_8px_0_0_#000000]">
              {/* Order Summary Line items */}
              <div className="mb-6 border-b-2 border-[var(--fv-border-subtle)] pb-4">
                <div className="text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] mb-2">
                  {t('checkout.summaryTitle')}
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[var(--fv-text)]">
                  <span>
                    Finovault {plan.toUpperCase()} Subscription ({billingPeriod})
                  </span>
                  <span>{currency} {amount.toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-[var(--fv-text-secondary)]">
                  <span>{t('checkout.tax')}</span>
                  <span>{currency} 0.00</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[var(--fv-border-subtle)] pt-3 text-base font-black text-[var(--fv-text)]">
                  <span>{t('checkout.totalDue')}</span>
                  <span className="text-lg text-[var(--fv-primary)]">{currency} {amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleInitiatePayment} className="space-y-4">
                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                    {t('checkout.cardholderName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder={t('checkout.cardholderPlaceholder')}
                    className="w-full rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 text-sm font-bold uppercase tracking-wider text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
                  />
                </div>

                {/* Mastercard Number */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                    {t('checkout.cardNumber')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder={t('checkout.cardNumberPlaceholder')}
                      className="w-full rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 font-mono text-sm font-bold tracking-wider text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-[#EB001B]" />
                        <div className="-ml-2.5 h-5 w-5 rounded-full bg-[#F79E1B]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expiry & CVC in 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                      {t('checkout.expiry')}
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder={t('checkout.expiryPlaceholder')}
                      className="w-full rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 font-mono text-sm font-bold tracking-wider text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                      {t('checkout.cvc')}
                    </label>
                    <input
                      type="password"
                      required
                      value={cvc}
                      onChange={handleCvcChange}
                      placeholder={t('checkout.cvcPlaceholder')}
                      className="w-full rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 font-mono text-sm font-bold tracking-wider text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
                    />
                  </div>
                </div>

                {/* Receipt Email */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                    {t('checkout.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('checkout.emailPlaceholder')}
                    className="w-full rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 text-sm font-bold text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-3 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-6 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
                  >
                    <Lock size={18} strokeWidth={2.5} />
                    <span>{t('checkout.submitPay')} ({currency} {amount.toLocaleString()})</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] font-bold text-[var(--fv-text-secondary)]">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>{t('checkout.securityGuaranteed')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-D Secure / Mastercard Identity Check Simulation Modal */}
      {step === 'challenge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-[16px] border-2 border-black bg-[var(--fv-surface)] p-6 md:p-8 shadow-[10px_10px_0_0_#000000]">
            {/* Issuing Bank / Mastercard Identity Check Header */}
            <div className="flex items-center justify-between border-b-2 border-[var(--fv-border-subtle)] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center" aria-hidden="true">
                  <div className="h-6 w-6 rounded-full bg-[#EB001B]" />
                  <div className="-ml-3 h-6 w-6 rounded-full bg-[#F79E1B]" />
                </div>
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[var(--fv-text)]">
                  Mastercard Identity Check™
                </span>
              </div>
              <span className="rounded-[4px] border border-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                3DS 2.0
              </span>
            </div>

            <div className="mt-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--fv-border-ink)] bg-blue-100 dark:bg-blue-950/40 text-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E]">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <h3 className="mt-3 text-lg font-black uppercase tracking-tight text-[var(--fv-text)]">
                {t('checkout.challengeTitle')}
              </h3>
              <p className="mt-1 text-xs font-semibold text-[var(--fv-text-secondary)]">
                {t('checkout.challengeSubtitle')}
              </p>

              {/* Amount & Merchant Prompt */}
              <div className="my-5 rounded-[8px] border-2 border-[var(--fv-border-subtle)] bg-[var(--fv-wash)] p-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[var(--fv-text-secondary)]">Merchant:</span>
                  <span className="font-bold text-[var(--fv-text)]">FINOVAULT INC</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[var(--fv-text-secondary)]">Amount:</span>
                  <span className="font-black text-[var(--fv-text)]">{currency} {amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[var(--fv-text-secondary)]">Card:</span>
                  <span className="font-bold text-[var(--fv-text)]">Mastercard ending in {cardNumber.slice(-4) || '3456'}</span>
                </div>
              </div>

              {/* OTP Passcode Field */}
              <div className="text-left">
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--fv-text)] mb-1.5">
                  {t('checkout.challengeOtpPrompt')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={challengeOtp}
                    onChange={(e) => setChallengeOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder={t('checkout.challengeOtpPlaceholder')}
                    className="flex-1 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-3.5 py-2.5 font-mono text-base font-black tracking-widest text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)] shadow-[2px_2px_0_0_#1A1A2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setChallengeOtp('849201')}
                    className="rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] hover:bg-[var(--fv-surface)] cursor-pointer"
                  >
                    {t('checkout.challengeAutofill')}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCompleteChallenge}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-emerald-600 px-6 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#065F46] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>{t('checkout.processing')}</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} strokeWidth={2.5} />
                    <span>{t('checkout.challengeSubmit')}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setStep('form')}
                className="w-full rounded-[8px] border-2 border-transparent py-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)] cursor-pointer"
              >
                {t('checkout.challengeCancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
