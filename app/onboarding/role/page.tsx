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
          return (
            <button
              key={role}
              type="button"
              onClick={() => setSelected(role)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-[14px] border p-3.5 text-left transition-all ${
                active
                  ? 'border-[var(--fv-primary)] bg-[var(--fv-wash)]'
                  : 'border-[var(--fv-primary-border)] bg-[var(--fv-surface)] hover:border-[var(--fv-primary-light)]'
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] transition-colors ${
                  active ? 'bg-[var(--fv-primary)] text-[var(--fv-on-fill)]' : 'bg-[var(--fv-wash)] text-[var(--fv-primary)]'
                }`}
              >
                <Icon size={20} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[var(--fv-text)]">{t(titleKey)}</span>
                <span className="block text-[13px] text-[var(--fv-text-secondary)]">{t(descKey)}</span>
              </span>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  active
                    ? 'border-[var(--fv-primary)] bg-[var(--fv-primary)] text-[var(--fv-on-fill)]'
                    : 'border-[var(--fv-border)] text-transparent'
                }`}
              >
                <Check size={14} strokeWidth={3} />
              </span>
            </button>
          );
        })}

        {selected === 'entrepreneur' ? (
          <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-wash)] px-3.5 py-3">
            <input
              type="checkbox"
              checked={femaleFounder}
              onChange={(e) => setFemaleFounder(e.target.checked)}
              className="h-4 w-4 accent-[var(--fv-primary)]"
            />
            <span className="text-sm font-medium text-[var(--fv-text)]">{t('role.femaleFounder')}</span>
          </label>
        ) : null}

        {error ? (
          <div className="rounded-[12px] bg-[var(--fv-error-bg)] p-3" role="alert">
            <p className="text-[14px] text-[var(--fv-error)]">{error}</p>
          </div>
        ) : null}

        <Button
          label={t('common.continue')}
          onPress={handleContinue}
          disabled={!selected}
          loading={saving}
          fullWidth
        />

        <Link
          href="/signup"
          className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-[var(--fv-text-secondary)] hover:text-[var(--fv-primary)]"
        >
          <ArrowLeft size={16} />
          {t('common.back')}
        </Link>
      </div>
    </AuthShell>
  );
}