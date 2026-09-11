'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { User, Briefcase, Rocket, Building2, Check, ArrowLeft } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui';
import { userApi } from '@/lib/api';
import type { PrimaryRole, RoleScheme } from '@/types';
import { useAuthStore } from '@/stores/auth-store';

const roles: {
  role: PrimaryRole;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  titleKey: string;
  descKey: string;
}[] = [
  { role: 'individual', icon: User, titleKey: 'role.individual', descKey: 'role.individualDesc' },
  { role: 'freelancer', icon: Briefcase, titleKey: 'role.freelancer', descKey: 'role.freelancerDesc' },
  { role: 'entrepreneur', icon: Rocket, titleKey: 'role.entrepreneur', descKey: 'role.entrepreneurDesc' },
  { role: 'sme', icon: Building2, titleKey: 'role.sme', descKey: 'role.smeDesc' },
];

const ROLE_CONFIG: Record<PrimaryRole, { accent: string; wash: string }> = {
  individual: { accent: '#4338CA', wash: '#EEF0FF' },
  freelancer: { accent: '#B42318', wash: '#FEF0EE' },
  entrepreneur: { accent: '#92400E', wash: '#FEF6E5' },
  sme: { accent: '#0F766E', wash: '#E6F9F6' },
};

export default function RolePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const [selected, setSelected] = useState<PrimaryRole | null>(null);
  const [femaleFounder, setFemaleFounder] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleContinue = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const scheme: RoleScheme = selected === 'entrepreneur' && femaleFounder ? 'female_founder' : 'standard';
      const updated = await userApi.setRole({ primaryRole: selected, scheme });
      setUser(updated);
      router.replace('/onboarding/link-accounts');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
      setSaving(false);
    }
  };

  return (
    <AuthShell title={t('role.title')} subtitle={t('role.subtitle')} step={{ current: 2, total: 3 }}>
      <div className="flex flex-col gap-3">
        {roles.map(({ role, icon: Icon, titleKey, descKey }) => {
          const active = selected === role;
          const conf = ROLE_CONFIG[role];
          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              aria-pressed={active}
              style={{
                backgroundColor: active ? conf.wash : undefined,
              }}
              className={`flex items-center gap-3.5 rounded-[12px] border-2 border-[var(--fv-border-ink)] p-3.5 text-left transition-all ${
                active
                  ? 'shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000] -translate-y-0.5'
                  : 'bg-[var(--fv-surface)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1A1A2E] dark:hover:shadow-[3px_3px_0_0_#000000]'
              }`}
            >
              <span
                style={{
                  backgroundColor: active ? conf.accent : undefined,
                  color: active ? '#ffffff' : conf.accent,
                }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] ${
                  !active ? 'bg-[var(--fv-wash)]' : ''
                }`}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-black uppercase tracking-tight text-[var(--fv-text)]">
                  {t(titleKey)}
                </span>
                <span className="block text-[12px] font-medium text-[var(--fv-text-secondary)]">
                  {t(descKey)}
                </span>
              </span>
              <span
                style={{
                  backgroundColor: active ? conf.accent : undefined,
                }}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border-2 border-[var(--fv-border-ink)] ${
                  active ? 'text-white' : 'text-transparent'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </span>
            </button>
          );
        })}

        {selected === 'entrepreneur' ? (
          <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[#FEF6E5] dark:bg-[#3A3226] p-3.5 shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
            <input
              type="checkbox"
              checked={femaleFounder}
              onChange={(e) => setFemaleFounder(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-[var(--fv-border-ink)] accent-[#92400E]"
            />
            <span className="text-xs font-black uppercase tracking-wider text-[var(--fv-text)]">
              {t('role.femaleFounder')}
            </span>
          </label>
        ) : null}

        {error ? (
          <div className="rounded-[10px] border-2 border-[var(--fv-error)] bg-[var(--fv-error-bg)] p-3 shadow-[2px_2px_0_0_var(--fv-error)]" role="alert">
            <p className="text-xs font-bold text-[var(--fv-error)]">{error}</p>
          </div>
        ) : null}

        <Button
          label={t('common.continue')}
          onPress={handleContinue}
          disabled={!selected}
          loading={saving}
          fullWidth
          className="mt-1 font-black uppercase tracking-wider"
        />

        <Link
          href="/signup"
          className="flex items-center justify-center gap-2 py-2 text-xs font-black uppercase tracking-wider text-[var(--fv-text-secondary)] hover:text-[var(--fv-primary)]"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </Link>
      </div>
    </AuthShell>
  );
}