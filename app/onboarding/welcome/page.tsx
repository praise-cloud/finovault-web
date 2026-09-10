'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Lock } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { moneyApi } from '@/lib/api/money';

export default function WelcomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const firstName = user.fullName.split(' ')[0];
  const roleLabel = t(`role.${user.primaryRole}` as const);

  const handleFinish = () => {
    // Non-critical flag: fire-and-forget, never block navigation on it.
    moneyApi.savePreferences({ onboardingCompleted: true }).catch((err) => {
      console.error('Failed to persist onboarding completion:', err);
    });
    router.replace('/dashboard');
  };

  return (
    <AuthShell
      title={t('onboarding.welcomeTitle', { name: firstName })}
      subtitle={t('onboarding.welcomeBody', { role: roleLabel })}
      step={{ current: 4, total: 4 }}
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fv-wash)]">
          <ShieldCheck size={28} className="text-[var(--fv-primary)]" strokeWidth={1.8} />
        </div>

        <p className="text-sm leading-relaxed text-[var(--fv-text-secondary)]">
          {t('onboarding.securedNote')}
        </p>

        <ul className="flex w-full flex-col gap-2.5 text-left">
          {[
            { icon: ShieldCheck, text: t('onboarding.benefitSecurity') },
            { icon: Lock, text: t('onboarding.benefitPrivacy') },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3 rounded-[12px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] px-3.5 py-3"
            >
              <Icon size={18} className="shrink-0 text-[var(--fv-primary)]" strokeWidth={1.8} />
              <span className="text-sm font-medium text-[var(--fv-text)]">{text}</span>
            </li>
          ))}
        </ul>

        <Button label={t('onboarding.finish')} onPress={handleFinish} fullWidth />
      </div>
    </AuthShell>
  );
}