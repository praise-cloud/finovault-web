'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, SectionHeader, Button } from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    await logout();
    router.replace('/login');
  };

  return (
    <div>
      <SectionHeader title={t('tabs.profile')} />
      <GlassCard className="mb-4">
        <p className="font-semibold text-[var(--fv-text)]">{user?.fullName}</p>
        <p className="mt-0.5 text-sm text-[var(--fv-text-secondary)]">{user?.email}</p>
        <p className="mt-3 text-sm text-[var(--fv-text-secondary)]">
          {t('profile.security')} · {t('profile.linkedAccounts')} · {t('profile.settings')} ·{' '}
          {t('profile.plan')} · {t('profile.language')} · {t('profile.appearance')}
        </p>
      </GlassCard>
      <Button
        label={t('profile.logout')}
        onPress={handleLogout}
        variant="secondary"
        loading={busy}
        fullWidth
      />
    </div>
  );
}