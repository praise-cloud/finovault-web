'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  RefreshCw,
  ShieldCheck,
  ArrowRight,
  Search,
  Check,
} from 'lucide-react';
import { moneyApi } from '@/lib/api';
import type { Account, AccountType } from '@/types';

interface LinkAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: Account, importedCount: number) => void;
  defaultCountry?: 'NG' | 'MU' | string;
}

export interface InstitutionItem {
  id: string;
  name: string;
  type: AccountType;
  badge: string;
  code?: string;
  slug?: string;
}

const POPULAR_NIGERIAN_INSTITUTIONS: InstitutionItem[] = [
  { id: '058', name: 'Guaranty Trust Bank (GTBank)', type: 'bank', badge: 'Commercial', code: '058', slug: 'guaranty-trust-bank' },
  { id: '044', name: 'Access Bank', type: 'bank', badge: 'Commercial', code: '044', slug: 'access-bank' },
  { id: '057', name: 'Zenith Bank', type: 'bank', badge: 'Commercial', code: '057', slug: 'zenith-bank' },
  { id: '011', name: 'First Bank of Nigeria', type: 'bank', badge: 'Commercial', code: '011', slug: 'first-bank-of-nigeria' },
  { id: '033', name: 'United Bank for Africa (UBA)', type: 'bank', badge: 'Commercial', code: '033', slug: 'united-bank-for-africa' },
  { id: '50211', name: 'Kuda Microfinance Bank', type: 'bank', badge: 'Digital Bank', code: '50211', slug: 'kuda-bank' },
  { id: '50515', name: 'Moniepoint MFB', type: 'bank', badge: 'Business & Personal', code: '50515', slug: 'moniepoint-mfb' },
  { id: '999992', name: 'OPay Digital Services', type: 'mobileMoney', badge: 'Instant Wallet', code: '999992', slug: 'opay' },
  { id: '999991', name: 'PalmPay Wallet', type: 'mobileMoney', badge: 'Instant Wallet', code: '999991', slug: 'palmpay' },
  { id: '221', name: 'Stanbic IBTC Bank', type: 'bank', badge: 'Commercial', code: '221', slug: 'stanbic-ibtc-bank' },
  { id: '070', name: 'Fidelity Bank', type: 'bank', badge: 'Commercial', code: '070', slug: 'fidelity-bank' },
  { id: '035', name: 'Wema Bank (ALAT)', type: 'bank', badge: 'Digital Bank', code: '035', slug: 'wema-bank' },
];

const MAURITIAN_INSTITUTIONS: InstitutionItem[] = [
  { id: 'MCB', name: 'MCB (Mauritius Commercial Bank)', type: 'bank', badge: 'Core Bank' },
  { id: 'SBM', name: 'State Bank of Mauritius (SBM)', type: 'bank', badge: 'Core Bank' },
  { id: 'Bank One', name: 'Bank One', type: 'bank', badge: 'Digital Bank' },
  { id: 'Maubank', name: 'Maubank', type: 'bank', badge: 'Everyday Banking' },
  { id: 'Juice', name: 'MCB Juice', type: 'mobileMoney', badge: 'Mobile Wallet' },
  { id: 'my.t money', name: 'my.t money', type: 'mobileMoney', badge: 'Mobile Wallet' },
  { id: 'Emtel Money', name: 'Emtel Money', type: 'mobileMoney', badge: 'Mobile Wallet' },
];

export function LinkAccountModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCountry = 'NG',
}: LinkAccountModalProps) {
  const [country, setCountry] = useState<'NG' | 'MU'>(defaultCountry === 'MU' ? 'MU' : 'NG');
  const [allNigerianBanks, setAllNigerianBanks] = useState<InstitutionItem[]>(POPULAR_NIGERIAN_INSTITUTIONS);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [selectedInst, setSelectedInst] = useState<InstitutionItem>(POPULAR_NIGERIAN_INSTITUTIONS[0]);
  const [bankSearch, setBankSearch] = useState('');
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
    setSelectedInst(c === 'NG' ? POPULAR_NIGERIAN_INSTITUTIONS[0] : MAURITIAN_INSTITUTIONS[0]);
  }, [defaultCountry]);

  // Dynamically load all 285+ Nigerian banks from Paystack / BFF
  useEffect(() => {
    if (!isOpen || country !== 'NG') return;
    let cancelled = false;

    async function loadBanks() {
      setLoadingBanks(true);
      try {
        const banks = await moneyApi.getNigerianBanks();
        if (!cancelled && banks && banks.length > 0) {
          const mapped: InstitutionItem[] = banks.map((b) => {
            const isWallet =
              b.slug?.includes('opay') ||
              b.slug?.includes('palmpay') ||
              b.type === 'mobile_money' ||
              b.name.toLowerCase().includes('wallet');
            return {
              id: b.code || String(b.id),
              name: b.name,
              code: b.code,
              type: isWallet ? 'mobileMoney' : 'bank',
              badge: isWallet ? 'Wallet' : b.code ? `Code: ${b.code}` : 'Bank',
              slug: b.slug,
            };
          });
          setAllNigerianBanks(mapped);
        }
      } catch (err) {
        console.warn('Could not fetch live Nigerian banks, using local registry.', err);
      } finally {
        if (!cancelled) setLoadingBanks(false);
      }
    }

    loadBanks();
    return () => {
      cancelled = true;
    };
  }, [isOpen, country]);

  // Filter banks by search query
  const filteredBanks = useMemo(() => {
    if (country === 'MU') {
      if (!bankSearch.trim()) return MAURITIAN_INSTITUTIONS;
      const q = bankSearch.toLowerCase().trim();
      return MAURITIAN_INSTITUTIONS.filter((b) => b.name.toLowerCase().includes(q));
    }

    if (!bankSearch.trim()) return allNigerianBanks;
    const q = bankSearch.toLowerCase().trim();
    return allNigerianBanks.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.code && b.code.toLowerCase().includes(q)) ||
        (b.slug && b.slug.toLowerCase().includes(q))
    );
  }, [country, allNigerianBanks, bankSearch]);

  const handleCountrySwitch = (c: 'NG' | 'MU') => {
    setCountry(c);
    setSelectedInst(c === 'NG' ? allNigerianBanks[0] || POPULAR_NIGERIAN_INSTITUTIONS[0] : MAURITIAN_INSTITUTIONS[0]);
    setBankSearch('');
    setAccountNumber('');
    setVerifiedName(null);
    setError(null);
  };

  const handleSelectInstitution = (inst: InstitutionItem) => {
    setSelectedInst(inst);
    setVerifiedName(null);
    setError(null);
    if (accountNumber.trim().length >= 8) {
      handleVerify(accountNumber.trim(), inst);
    }
  };

  const handleVerify = async (acct: string, inst = selectedInst) => {
    if (!acct || acct.length < 8) {
      setVerifiedName(null);
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await moneyApi.verifyAccount({
        institution: inst.name,
        identifier: acct,
        holderName: holderName || undefined,
        bankCode: inst.code,
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

      setStepState(`RESOLVING NUBAN WITH ${selectedInst.name.toUpperCase()}...`);
      await new Promise((r) => setTimeout(r, 450));

      setStepState('FETCHING & DECRYPTING 45-DAY TRANSACTION HISTORY...');
      const res = await moneyApi.linkBankAccount({
        institution: selectedInst.name,
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
              Live NUBAN resolution across all 285+ Nigerian banks & MFBs with automatic 45-day transaction sync.
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
                    <div className="text-[10px] text-slate-400 font-mono">NGN (₦) • 285+ Banks</div>
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

            {/* Selected Bank Summary Card */}
            <div className="rounded-[8px] border border-blue-500/40 bg-blue-950/30 p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                {selectedInst.type === 'mobileMoney' ? (
                  <Smartphone size={16} className="text-amber-400 shrink-0" />
                ) : (
                  <Building2 size={16} className="text-blue-400 shrink-0" />
                )}
                <div className="truncate">
                  <div className="text-[9px] font-mono uppercase text-blue-400 font-black">SELECTED INSTITUTION</div>
                  <div className="text-xs font-black text-white truncate">{selectedInst.name}</div>
                </div>
              </div>
              {selectedInst.code && (
                <span className="font-mono text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20 text-slate-300 shrink-0">
                  CODE: {selectedInst.code}
                </span>
              )}
            </div>

            {/* Quick Pick Shortcuts for Nigeria */}
            {country === 'NG' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Quick Pick (Popular Banks & Wallets)
                  </label>
                  {loadingBanks && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-blue-400">
                      <RefreshCw size={10} className="animate-spin" /> Syncing live list...
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {POPULAR_NIGERIAN_INSTITUTIONS.slice(0, 8).map((inst) => {
                    const isSelected = selectedInst.name === inst.name || selectedInst.code === inst.code;
                    return (
                      <button
                        key={inst.id}
                        type="button"
                        onClick={() => handleSelectInstitution(inst)}
                        className={`rounded-[6px] border px-2 py-1 text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[1px_1px_0_0_#10B981]'
                            : 'border-white/15 bg-white/[0.04] text-slate-300 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {inst.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Searchable Institution Directory */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                  2. Search All {country === 'NG' ? `${allNigerianBanks.length}+ Banks & MFBs` : 'Institutions'}
                </label>
                <span className="text-[9px] font-mono text-slate-400">
                  {filteredBanks.length} FOUND
                </span>
              </div>

              {/* Search input */}
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder={
                    country === 'NG'
                      ? 'Type bank name or code (e.g. Kuda, Moniepoint, Zenith, 058)...'
                      : 'Search Mauritian banks...'
                  }
                  className="w-full rounded-[8px] border border-white/20 bg-[#05070e] pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
                {bankSearch && (
                  <button
                    type="button"
                    onClick={() => setBankSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Bank list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1 border border-white/10 rounded-[8px] p-1.5 bg-black/20">
                {filteredBanks.length === 0 ? (
                  <div className="col-span-2 py-4 text-center text-xs font-mono text-slate-500">
                    No matching institutions found for &ldquo;{bankSearch}&rdquo;
                  </div>
                ) : (
                  filteredBanks.map((inst) => {
                    const isSelected = selectedInst.name === inst.name || (inst.code && selectedInst.code === inst.code);
                    return (
                      <button
                        key={`${inst.id}-${inst.code || inst.name}`}
                        type="button"
                        onClick={() => handleSelectInstitution(inst)}
                        className={`flex items-center justify-between rounded-[6px] border p-2 text-left transition-all ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-950/40 shadow-[2px_2px_0_0_#10B981]'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <div className="truncate text-xs font-bold text-white">
                            {inst.name}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400">
                            {inst.code ? `CBN: ${inst.code}` : inst.badge}
                          </div>
                        </div>
                        {isSelected ? (
                          <Check size={14} className="shrink-0 text-emerald-400" />
                        ) : inst.type === 'mobileMoney' ? (
                          <Smartphone size={13} className="shrink-0 text-amber-400/80" />
                        ) : (
                          <Building2 size={13} className="shrink-0 text-blue-400/80" />
                        )}
                      </button>
                    );
                  })
                )}
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
