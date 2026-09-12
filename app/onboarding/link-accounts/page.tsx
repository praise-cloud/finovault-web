'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Landmark, Smartphone, Check, ArrowLeft, Plus, History, Sparkles } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { LinkAccountModal } from '@/components/banking/LinkAccountModal';
import type { Account } from '@/types';

export default function LinkAccountsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const initialCountry = user?.country === 'MU' || user?.preferredCurrency === 'MUR' ? 'MU' : 'NG';

  const [country, setCountry] = useState<'NG' | 'MU'>(initialCountry);
  const [modalOpen, setModalOpen] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<Array<{ account: Account; imported: number }>>([]);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLinkSuccess = (account: Account, importedCount: number) => {
    setLinkedAccounts((prev) => [...prev, { account, imported: importedCount }]);
  };

  const finish = () => router.replace('/onboarding/welcome');

  const isNigerian = country === 'NG';

  return (
    <AuthShell
      title={t('onboarding.linkTitle', 'Link Your Accounts')}
      subtitle="Connect your financial institutions for automatic transaction sync & real-time telemetry."
      step={{ current: 3, total: 4 }}
    >
      <div className="flex flex-col gap-4">
        {/* Country Selector Pill Switch */}
        <div className="flex items-center justify-between rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-1.5 shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
          <button
            type="button"
            onClick={() => setCountry('NG')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[6px] py-2 text-xs font-black uppercase tracking-wider transition-all ${
              isNigerian
                ? 'bg-[#1D4ED8] text-white shadow-[2px_2px_0_0_#ffffff]'
                : 'text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)]'
            }`}
          >
            <span>🇳🇬 Nigeria</span>
            <span className="text-[10px] opacity-80">(₦ NGN)</span>
          </button>
          <button
            type="button"
            onClick={() => setCountry('MU')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[6px] py-2 text-xs font-black uppercase tracking-wider transition-all ${
              !isNigerian
                ? 'bg-[#1D4ED8] text-white shadow-[2px_2px_0_0_#ffffff]'
                : 'text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)]'
            }`}
          >
            <span>🇲🇺 Mauritius</span>
            <span className="text-[10px] opacity-80">(Rs MUR)</span>
          </button>
        </div>

        {/* Feature Highlights Eyebrow */}
        <div className="flex items-center gap-2 rounded-[8px] border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-[11px] font-mono text-emerald-400">
          <Sparkles size={14} className="shrink-0 text-emerald-400" />
          <span>Automatic 45-day history fetch & AI categorization enabled</span>
        </div>

        {/* Account Type Options */}
        <div className="space-y-3">
          {/* Bank Account Card */}
          <div className="flex items-center gap-3.5 rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-3.5 shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000] transition-all">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] text-[var(--fv-primary)]">
              <Landmark size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-[14px] font-black uppercase tracking-tight text-[var(--fv-text)]">
                {isNigerian ? 'Nigerian Bank (NUBAN)' : 'Mauritian Bank'}
              </span>
              <span className="block text-[11px] font-medium text-[var(--fv-text-secondary)]">
                {isNigerian
                  ? 'GTBank, Access, Zenith, Kuda, Moniepoint, First Bank'
                  : 'MCB, SBM, Bank One, Maubank'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[#1D4ED8] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0_0_#ffffff] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus size={14} />
              <span>Link</span>
            </button>
          </div>

          {/* Mobile Money Card */}
          <div className="flex items-center gap-3.5 rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-3.5 shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000] transition-all">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] text-[var(--fv-primary)]">
              <Smartphone size={20} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-[14px] font-black uppercase tracking-tight text-[var(--fv-text)]">
                {isNigerian ? 'Mobile Money / Digital Wallet' : 'Mobile Money'}
              </span>
              <span className="block text-[11px] font-medium text-[var(--fv-text-secondary)]">
                {isNigerian ? 'OPay, PalmPay' : 'MCB Juice, my.t money, Emtel Money'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[#1D4ED8] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0_0_#ffffff] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus size={14} />
              <span>Link</span>
            </button>
          </div>
        </div>

        {/* Successfully Linked Accounts List */}
        {linkedAccounts.length > 0 && (
          <div className="mt-2 space-y-2 rounded-[10px] border-2 border-emerald-500/40 bg-emerald-950/20 p-3">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <span>ACTIVE LINKED ENCLAVES ({linkedAccounts.length})</span>
              <span className="flex items-center gap-1">
                <Check size={13} strokeWidth={3} />
                READY
              </span>
            </div>
            {linkedAccounts.map(({ account, imported }) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-[8px] border border-white/10 bg-[var(--fv-surface)] p-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-xs font-black text-[var(--fv-text)]">
                    {account.name}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--fv-text-secondary)]">
                    <History size={11} className="text-blue-400" />
                    <span>{imported} historical transactions synced</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400">
                    {account.currency} {account.balance.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs font-medium text-[var(--fv-text-secondary)]">
          {t('onboarding.skipNote', 'You can also connect or upload bank statements later in settings.')}
        </p>

        <Button
          label={linkedAccounts.length > 0 ? 'Continue to Dashboard' : t('common.continue')}
          onPress={finish}
          loading={false}
          fullWidth
          className="mt-1 font-black uppercase tracking-wider"
        />

        <Link
          href="/onboarding/role"
          className="flex items-center justify-center gap-2 py-1 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] hover:text-[var(--fv-primary)]"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </Link>
      </div>

      {/* Interactive Bank Linking Modal */}
      <LinkAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCountry={country}
        onSuccess={handleLinkSuccess}
      />
    </AuthShell>
  );
}
