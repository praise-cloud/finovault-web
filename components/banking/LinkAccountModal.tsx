'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { moneyApi } from '@/lib/api';
import type { Account, AccountType } from '@/types';

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: Account, importedCount: number) => void;
  defaultCountry?: 'NG' | 'MU' | string;
}

const NIGERIAN_INSTITUTIONS = [
  { id: 'GTBank', name: 'GTBank (Guaranty Trust)', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'Access Bank', name: 'Access Bank', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'Zenith Bank', name: 'Zenith Bank', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'First Bank', name: 'First Bank of Nigeria', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'UBA', name: 'United Bank for Africa (UBA)', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'Kuda Bank', name: 'Kuda Microfinance Bank', type: 'bank' as AccountType, badge: 'Digital Bank' },
  { id: 'Moniepoint', name: 'Moniepoint MFB', type: 'bank' as AccountType, badge: 'Business & Personal' },
  { id: 'Stanbic IBTC', name: 'Stanbic IBTC Bank', type: 'bank' as AccountType, badge: 'NUBAN' },
  { id: 'OPay', name: 'OPay Wallet', type: 'mobileMoney' as AccountType, badge: 'Instant Transfer' },
  { id: 'PalmPay', name: 'PalmPay Wallet', type: 'mobileMoney' as AccountType, badge: 'Instant Transfer' },
];

const MAURITIAN_INSTITUTIONS = [
  { id: 'MCB', name: 'MCB (Mauritius Commercial Bank)', type: 'bank' as AccountType, badge: 'Core Bank' },
  { id: 'SBM', name: 'State Bank of Mauritius (SBM)', type: 'bank' as AccountType, badge: 'Core Bank' },
  { id: 'Bank One', name: 'Bank One', type: 'bank' as AccountType, badge: 'Digital Bank' },
  { id: 'Maubank', name: 'Maubank', type: 'bank' as AccountType, badge: 'Everyday Banking' },
  { id: 'Juice', name: 'MCB Juice', type: 'mobileMoney' as AccountType, badge: 'Mobile Wallet' },
  { id: 'my.t money', name: 'my.t money', type: 'mobileMoney' as AccountType, badge: 'Mobile Wallet' },
  { id: 'Emtel Money', name: 'Emtel Money', type: 'mobileMoney' as AccountType, badge: 'Mobile Wallet' },
];

export function LinkAccountModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCountry = 'NG',
}: LinkAccountModalProps) {
  const [country, setCountry] = useState<'NG' | 'MU'>(defaultCountry === 'MU' ? 'MU' : 'NG');
  const [selectedInstId, setSelectedInstId] = useState<string>('GTBank');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stepState, setStepState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ account: Account; count: number } | null>(null);

  // Sync country if prop changes
  useEffect(() => {
    const c = defaultCountry === 'MU' ? 'MU' : 'NG';
    setCountry(c);
    setSelectedInstId(c === 'NG' ? 'GTBank' : 'MCB');
  }, [defaultCountry]);

  if (!isOpen) return null;

  const currentInstitutions = country === 'NG' ? NIGERIAN_INSTITUTIONS : MAURITIAN_INSTITUTIONS;
  const selectedInst = currentInstitutions.find((i) => i.id === selectedInstId) || currentInstitutions[0];

  const handleCountrySwitch = (c: 'NG' | 'MU') => {
    setCountry(c);
    setSelectedInstId(c === 'NG' ? 'GTBank' : 'MCB');
    setAccountNumber('');
    setVerifiedName(null);
    setError(null);
  };

  const handleVerify = async (acct: string) => {
    if (!acct || acct.length < 8) {
      setVerifiedName(null);
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await moneyApi.verifyAccount({
        institution: selectedInst.id,
        identifier: acct,
        holderName: holderName || undefined,
      });
      if (res.exists && res.holderName) {
        setVerifiedName(res.holderName);
        if (!holderName) setHolderName(res.holderName);
      } else {
        setVerifiedName(null);
      }
    } catch {
      setVerifiedName(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      setError('Please enter your account or wallet number.');
      return;
    }

    if (country === 'NG' && selectedInst.type === 'bank' && accountNumber.trim().length !== 10) {
      setError('Nigerian bank account (NUBAN) must be exactly 10 digits.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      setStepState('CONNECTING TO FINANCIAL ENCLAVE...');
      await new Promise((r) => setTimeout(r, 450));

      setStepState('VERIFYING ACCOUNT AND NUBAN ROUTING...');
      await new Promise((r) => setTimeout(r, 450));

      setStepState('FETCHING & DECRYPTING 45-DAY TRANSACTION HISTORY...');
      const res = await moneyApi.linkBankAccount({
        institution: selectedInst.id,
        accountNumber: accountNumber.trim(),
        holderName: verifiedName || holderName || undefined,
        country,
      });

      setStepState(`SYNCHRONIZED ${res.imported} HISTORICAL TRANSACTIONS`);
      await new Promise((r) => setTimeout(r, 400));

      setSuccessInfo({ account: res.account, count: res.imported });
      onSuccess(res.account, res.imported);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to link account.');
    } finally {
      setSubmitting(false);
      setStepState(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg rounded-[14px] border-2 border-white/30 bg-[#0a0f1d] p-6 text-white shadow-[8px_8px_0_0_#1D4ED8] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                AUTOMATIC HISTORY FETCH & ENCLAVE SYNC
              </span>
            </div>
            <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white">
              Link Bank Account
            </h2>
            <p className="text-xs text-slate-400">
              Select your institution and connect for automatic 45-day transaction sync.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] border border-white/20 p-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {successInfo ? (
          <div className="mt-6 flex flex-col items-center py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-emerald-950/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="mt-4 text-lg font-black uppercase text-white">
              Account Linked Successfully!
            </h3>
            <p className="mt-1 text-sm font-semibold text-emerald-400">
              {successInfo.account.name}
            </p>
            <div className="my-4 rounded-[8px] border border-emerald-500/30 bg-emerald-950/30 px-4 py-2 font-mono text-xs text-emerald-300">
              ✓ {successInfo.count} transactions automatically fetched & imported to your ledger.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-[8px] border-2 border-white/60 bg-[#1D4ED8] py-3 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#ffffff] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              Continue to Ledger
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Country Selector Switcher */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                1. Select Country
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCountrySwitch('NG')}
                  className={`flex items-center gap-2.5 rounded-[8px] border-2 p-2.5 text-left transition-all ${
                    country === 'NG'
                      ? 'border-blue-500 bg-blue-950/40 shadow-[3px_3px_0_0_#1D4ED8]'
                      : 'border-white/15 bg-white/[0.03] opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">🇳🇬</span>
                  <div>
                    <div className="text-xs font-black uppercase text-white">Nigeria</div>
                    <div className="text-[10px] text-slate-400 font-mono">NGN (₦) • NUBAN</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCountrySwitch('MU')}
                  className={`flex items-center gap-2.5 rounded-[8px] border-2 p-2.5 text-left transition-all ${
                    country === 'MU'
                      ? 'border-blue-500 bg-blue-950/40 shadow-[3px_3px_0_0_#1D4ED8]'
                      : 'border-white/15 bg-white/[0.03] opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">🇲🇺</span>
                  <div>
                    <div className="text-xs font-black uppercase text-white">Mauritius</div>
                    <div className="text-[10px] text-slate-400 font-mono">MUR (Rs) • Juice</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Institution Choice */}
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                2. Select Bank or Wallet Provider
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {currentInstitutions.map((inst) => {
                  const isSelected = selectedInstId === inst.id;
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => {
                        setSelectedInstId(inst.id);
                        setVerifiedName(null);
                        if (accountNumber) handleVerify(accountNumber);
                      }}
                      className={`flex items-center justify-between rounded-[8px] border-2 p-2 text-left transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-950/40 shadow-[2px_2px_0_0_#10B981]'
                          : 'border-white/15 bg-white/[0.02] hover:border-white/30'
                      }`}
                    >
                      <div className="min-w-0 pr-1">
                        <div className="truncate text-xs font-black text-white">
                          {inst.name}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          {inst.badge}
                        </div>
                      </div>
                      {inst.type === 'mobileMoney' ? (
                        <Smartphone size={14} className="shrink-0 text-amber-400" />
                      ) : (
                        <Building2 size={14} className="shrink-0 text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account / NUBAN Number */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  3. {selectedInst.type === 'bank' ? 'Account Number (NUBAN)' : 'Wallet / Phone Number'}
                </label>
                {selectedInst.type === 'bank' && country === 'NG' && (
                  <span className="font-mono text-[10px] text-slate-400">10 DIGITS</span>
                )}
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAccountNumber(val);
                    if (country === 'NG' && selectedInst.type === 'bank' && val.length === 10) {
                      handleVerify(val);
                    }
                  }}
                  onBlur={() => handleVerify(accountNumber)}
                  placeholder={
                    selectedInst.type === 'bank'
                      ? country === 'NG'
                        ? 'e.g. 0123456789 (10-digit NUBAN)'
                        : 'e.g. 000123456789'
                      : country === 'NG'
                      ? 'e.g. 08012345678'
                      : 'e.g. 51234567'
                  }
                  className="w-full rounded-[8px] border-2 border-white/20 bg-[#05070e] px-3.5 py-2.5 font-mono text-sm font-bold text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                />
                {verifying && (
                  <RefreshCw
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-blue-400"
                  />
                )}
              </div>
            </div>

            {/* Verified Account Holder Display */}
            {verifiedName && (
              <div className="flex items-center gap-2 rounded-[8px] border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                <ShieldCheck size={18} className="shrink-0 text-emerald-400" />
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
                    VERIFIED ACCOUNT HOLDER
                  </span>
                  <span className="font-black tracking-wide text-white">{verifiedName}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-[8px] border border-red-500/40 bg-red-950/40 p-2.5 text-xs text-red-300">
                <AlertCircle size={16} className="shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Submitting progress status */}
            {stepState && (
              <div className="rounded-[8px] border border-blue-500/40 bg-blue-950/40 p-3 text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-mono font-black text-blue-300">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{stepState}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-white/60 bg-[#1D4ED8] py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#ffffff] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#ffffff] active:translate-y-0 active:shadow-none ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{submitting ? 'Linking & Importing...' : 'Link Account & Import History'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
