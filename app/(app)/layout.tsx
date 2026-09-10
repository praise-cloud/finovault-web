'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, PiggyBank, CreditCard, BarChart3, MessageCircle, User, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme, type ThemeMode } from '@/lib/theme';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/lib/notifications/useNotifications';

const navItems = [
  { href: '/dashboard', key: 'home', icon: Home },
  { href: '/vault', key: 'vault', icon: PiggyBank },
  { href: '/pay', key: 'pay', icon: CreditCard },
  { href: '/insights', key: 'insights', icon: BarChart3 },
  { href: '/coach', key: 'coach', icon: MessageCircle },
] as const;

/**
 * Authenticated app shell: sidebar + top bar. Guards unauthenticated users and
 * wires navigation, profile and logout. Phase 0 — nav links to stub pages.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, announcement } = useNotifications();
  const { mode, setMode } = useTheme();

  const themeOrder: ThemeMode[] = ['light', 'dark', 'system'];
  const nextMode = themeOrder[(themeOrder.indexOf(mode) + 1) % themeOrder.length];
  const ThemeIcon = mode === 'light' ? Sun : mode === 'dark' ? Moon : Monitor;
  const modeTitle =
    mode === 'light'
      ? t('settings.themeLight')
      : mode === 'dark'
        ? t('settings.themeDark')
        : t('settings.themeSystem');

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen bg-[var(--fv-bg)]">
      <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] py-5 md:w-56 md:items-stretch md:px-4">
        <div className="mb-4 flex items-center gap-2 px-2">
          <VaultMark size={36} />
          <span className="font-display hidden text-lg font-bold text-[var(--fv-primary)] md:block">
            Finovault
          </span>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Primary">
          {navItems.map(({ href, key, icon: NavIcon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-[var(--fv-primary-border)] font-semibold text-[var(--fv-primary)]'
                    : 'text-[var(--fv-text-secondary)] hover:bg-[var(--fv-border-subtle)]'
                }`}
              >
                <NavIcon size={20} strokeWidth={1.8} />
                <span className="hidden md:inline">{t(`tabs.${key}`)}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <Link
            href="/profile"
            aria-label={t('tabs.profile')}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-[var(--fv-text-secondary)] hover:bg-[var(--fv-border-subtle)]"
          >
            <User size={20} strokeWidth={1.8} />
            <span className="hidden md:inline">{t('tabs.profile')}</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm text-[var(--fv-text-secondary)] hover:bg-[var(--fv-border-subtle)]"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="hidden md:inline">{t('profile.logout')}</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-[var(--fv-border-subtle)] bg-[var(--fv-surface)] px-5">
          <span className="text-sm font-medium text-[var(--fv-text-secondary)]">
            {firstName}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode(nextMode)}
              aria-label={t('settings.theme')}
              aria-pressed={mode === 'system'}
              title={`${t('settings.theme')}: ${modeTitle}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--fv-radius-control)] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[var(--fv-shadow-hard-sm)] transition-all duration-[120ms] hover:-translate-y-0.5 hover:shadow-[var(--fv-shadow-hard)] active:translate-y-0.5 active:shadow-none"
            >
              <ThemeIcon size={20} strokeWidth={1.8} className="text-[var(--fv-text)]" />
            </button>
            <NotificationBell
              unreadCount={unreadCount}
              isOpen={isDropdownOpen}
              onToggle={() => setDropdownOpen((v) => !v)}
              bellRef={bellRef}
            />
            <span className="rounded-full bg-[var(--fv-primary-border)] px-3 py-1 text-xs font-semibold text-[var(--fv-primary)]">
              {t('profile.planBadge')}
            </span>
          </div>
        </header>
        {isDropdownOpen && (
          <NotificationDropdown
            notifications={notifications}
            onMarkRead={markRead}
            onMarkAllRead={markAllRead}
            onClose={() => setDropdownOpen(false)}
            bellRef={bellRef}
          />
        )}
        {/* Screen reader announcement for new notifications */}
        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}