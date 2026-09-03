'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, SectionHeader, Button, TextField } from '@/components/ui';
import { useAuthStore } from '@/stores/auth-store';
import { userApi, moneyApi } from '@/lib/api';
import { setLanguage, SUPPORTED_LOCALES } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import {
  useAccounts,
  useUnlinkAccount,
  useSecurityOverview,
  useSecurityDevices,
  useSecurityEvents,
  useSetTwoFactor,
  useResolveSecurityEvent,
} from '@/lib/hooks/use-money';
import { computeSecurityScore } from '@/lib/utils/fees';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const { mode, setMode } = useTheme();

  const [busy, setBusy] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [lang, setLang] = useState<'en' | 'fr'>(user?.preferredLanguage ?? 'en');
  const [currency, setCurrency] = useState(user?.preferredCurrency ?? 'MUR');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showSecurity, setShowSecurity] = useState(false);

  const { data: accounts = [] } = useAccounts();
  const unlinkAccount = useUnlinkAccount();
  const { data: securityOverview } = useSecurityOverview();
  const { data: devices = [] } = useSecurityDevices();
  const { data: events = [] } = useSecurityEvents();
  const setTwoFactor = useSetTwoFactor();
  const resolveEvent = useResolveSecurityEvent();

  const score = computeSecurityScore(events, securityOverview);

  const handleSaveProfile = async () => {
    setBusy(true);
    try {
      const updated = await userApi.updateMe({
        fullName,
        preferredLanguage: lang,
        preferredCurrency: currency,
      });
      setUser(updated);
      setLanguage(lang);
    } finally {
      setBusy(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPw || newPw !== confirmPw) return;
    setBusy(true);
    try {
      await moneyApi.changePassword({ currentPassword: currentPw, newPassword: newPw });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm(t('profile.logoutConfirm'))) return;
    setBusy(true);
    await logout();
    router.replace('/login');
  };

  const initials = (user?.fullName ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleBadge: Record<string, string> = {
    individual: 'Individual',
    freelancer: 'Freelancer',
    entrepreneur: 'Entrepreneur',
    sme: 'SME Owner',
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader title={t('tabs.profile')} />

      {/* Avatar */}
      <GlassCard className="flex items-center gap-4">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fv-primary)] text-lg font-bold text-white">
            {initials}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-[var(--fv-text)]">{user?.fullName}</span>
          <span className="text-sm text-[var(--fv-text-secondary)]">{user?.email}</span>
          {user?.primaryRole && (
            <span className="mt-1 inline-block w-fit rounded-full bg-[var(--fv-primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--fv-primary)]">
              {roleBadge[user.primaryRole]}
            </span>
          )}
        </div>
      </GlassCard>

      {/* Edit profile */}
      <SectionHeader title="Edit Profile" />
      <GlassCard className="flex flex-col gap-3">
        <TextField
          label={t('auth.fullName')}
          value={fullName}
          onChangeText={setFullName}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">
            {t('profile.language')}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as 'en' | 'fr')}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)]"
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)]"
          >
            <option value="MUR">MUR</option>
            <option value="NGN">NGN</option>
          </select>
        </div>
        <Button label="Save" onPress={handleSaveProfile} loading={busy} fullWidth />
      </GlassCard>

      {/* Linked Accounts */}
      <SectionHeader
        title={t('profile.linkedAccounts')}
        actionLabel={t('accounts.link')}
        onAction={() => router.push('/accounts')}
      />
      <GlassCard>
        {accounts.length === 0 ? (
          <p className="py-4 text-center text-sm text-[var(--fv-text-secondary)]">
            No linked accounts
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--fv-text)]">{acc.name}</p>
                  <p className="text-xs text-[var(--fv-text-secondary)]">
                    {acc.type} &middot; {acc.institution ?? '—'}
                  </p>
                </div>
                <Button
                  label="Unlink"
                  variant="ghost"
                  onPress={() => unlinkAccount.mutate(acc.id)}
                  loading={unlinkAccount.isPending}
                />
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Security Centre */}
      <SectionHeader
        title={t('profile.security')}
        actionLabel={showSecurity ? 'Hide' : 'Show'}
        onAction={() => setShowSecurity((v) => !v)}
      />
      {showSecurity && (
        <GlassCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Security Score</span>
            <span className="text-lg font-bold text-[var(--fv-primary)]">{score}/100</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Two-Factor Auth</span>
            <button
              type="button"
              onClick={() => setTwoFactor.mutate(!securityOverview?.twoFactorEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securityOverview?.twoFactorEnabled
                  ? 'bg-[var(--fv-primary)]'
                  : 'bg-[var(--fv-border)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  securityOverview?.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {devices.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--fv-text)]">Trusted Devices</p>
              {devices.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-1.5">
                  <div>
                    <p className="text-sm text-[var(--fv-text)]">{d.name}</p>
                    <p className="text-xs text-[var(--fv-text-secondary)]">
                      Last seen: {formatDate(d.lastSeen)}
                    </p>
                  </div>
                  {d.trusted && (
                    <span className="text-xs font-semibold text-[var(--fv-success)]">Trusted</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {events.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-[var(--fv-text)]">Security Events</p>
              {events.map((ev) => (
                <div key={ev.id} className="flex items-start justify-between gap-2 py-1.5">
                  <div>
                    <p className="text-sm text-[var(--fv-text)]">{ev.title}</p>
                    <p className="text-xs text-[var(--fv-text-secondary)]">
                      {ev.severity} &middot; {formatDate(ev.date)}
                    </p>
                  </div>
                  {!ev.resolved && (
                    <Button
                      label="Resolve"
                      variant="ghost"
                      onPress={() => resolveEvent.mutate(ev.id)}
                      loading={resolveEvent.isPending}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Change Password */}
      <SectionHeader title="Change Password" />
      <GlassCard className="flex flex-col gap-3">
        <TextField
          label={t('auth.password')}
          value={currentPw}
          onChangeText={setCurrentPw}
          type="password"
          autoComplete="current-password"
        />
        <TextField
          label="New password"
          value={newPw}
          onChangeText={setNewPw}
          type="password"
          autoComplete="new-password"
        />
        <TextField
          label="Confirm new password"
          value={confirmPw}
          onChangeText={setConfirmPw}
          type="password"
          autoComplete="new-password"
          error={confirmPw && newPw !== confirmPw ? 'Passwords do not match' : undefined}
        />
        <Button
          label="Change Password"
          onPress={handleChangePassword}
          loading={busy}
          disabled={!currentPw || !newPw || newPw !== confirmPw}
          fullWidth
        />
      </GlassCard>

      {/* Settings */}
      <SectionHeader title={t('profile.settings')} />
      <GlassCard className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">
            {t('settings.theme')}
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'system')}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)]"
          >
            <option value="light">{t('settings.themeLight')}</option>
            <option value="dark">{t('settings.themeDark')}</option>
            <option value="system">{t('settings.themeSystem')}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">
            {t('settings.language')}
          </label>
          <select
            value={i18n.language?.split('-')[0] ?? 'en'}
            onChange={(e) => {
              const l = e.target.value as 'en' | 'fr';
              setLanguage(l);
              setLang(l);
            }}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none focus:border-[var(--fv-primary)]"
          >
            {SUPPORTED_LOCALES.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Logout */}
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
