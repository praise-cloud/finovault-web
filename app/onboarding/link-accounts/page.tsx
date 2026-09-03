'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Landmark, Smartphone, Check, ArrowLeft } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui';
import { moneyApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

type LinkKind = 'bank' | 'mobileMoney';

const ACCOUNTS: { kind: LinkKind; icon: React.ComponentType<{ size?: number; strokeWidth?: number }>; titleKey: string; subtitle: string; institution: string; type: 'bank' | 'mobileMoney' }[] = [
  { kind: 'bank', icon: Landmark, titleKey: 'onboarding.bank', subtitle: 'MCB, SBM, Barclays and more', institution: 'MCB', type: 'bank' },
  { kind: 'mobileMoney', icon: Smartphone, titleKey: 'onboarding.mobileMoney', subtitle: 'MyT, Juice, Ezi Cash', institution: 'MyT', type: 'mobileMoney' },
];

export default function LinkAccountsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [linked, setLinked] = useState<Set<LinkKind>>(new Set());
  const [busy, setBusy] = useState<LinkKind | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLink = async (kind: LinkKind) => {
    if (linked.has(kind)) return;
    const acc = ACCOUNTS.find((a) => a.kind === kind);
    if (!acc) return;
    setBusy(kind);
    try {
      await moneyApi.linkAccount({ name: acc.institution, type: acc.type, institution: acc.institution });
      setLinked((prev) => new Set(prev).add(kind));
    } finally {
      setBusy(null);
    }
  };

  const finish = () => router.replace('/onboarding/welcome');

  return (
    <AuthShell title={t('onboarding.linkTitle')} subtitle={t('onboarding.linkBody')} step={{ current: 3, total: 4 }}>
      <div className="flex flex-col gap-3">
        {ACCOUNTS.map(({ kind, icon: Icon, titleKey, subtitle }) => {
          const isLinked = linked.has(kind);
          const isLoading = busy === kind;
          return (
            <div
              key={kind}
              className={`flex items-center gap-3 rounded-[14px] border p-3.5 ${
                isLinked ? 'border-[var(--fv-primary)] bg-[var(--fv-wash)]' : 'border-[var(--fv-primary-border)] bg-[var(--fv-surface)]'
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--fv-wash)] text-[var(--fv-primary)]">
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[var(--fv-text)]">{t(titleKey)}</span>
                <span className="block text-[13px] text-[var(--fv-text-secondary)]">{subtitle}</span>
              </span>
              <button
                type="button"
                onClick={() => handleLink(kind)}
                disabled={isLinked || isLoading}
                className={`flex shrink-0 items-center gap-1 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isLinked
                    ? 'bg-[var(--fv-primary-border)] text-[var(--fv-primary)]'
                    : 'bg-[var(--fv-primary)] text-white hover:bg-[var(--fv-primary-light)]'
                } ${isLinked || isLoading ? 'cursor-default opacity-100' : ''}`}
              >
                {isLoading ? (
                  <span aria-live="polite">…</span>
                ) : isLinked ? (
                  <>
                    <Check size={16} strokeWidth={3} />
                    {t('onboarding.linked')}
                  </>
                ) : (
                  t('onboarding.link')
                )}
              </button>
            </div>
          );
        })}

        <p className="text-center text-xs text-[var(--fv-text-secondary)]">{t('onboarding.skipNote')}</p>

        <Button label={t('common.continue')} onPress={finish} loading={false} fullWidth />

        <Link
          href="/onboarding/role"
          className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-[var(--fv-text-secondary)] hover:text-[var(--fv-primary)]"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </Link>
      </div>
    </AuthShell>
  );
}
