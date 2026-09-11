'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  CreditCard,
  ReceiptText,
  PieChart,
  PiggyBank,
  TrendingUp,
  Landmark,
  Send,
  FileText,
  Store,
  FileBarChart,
  ScrollText,
  MessageCircle,
  HelpCircle,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Check,
} from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme, type ThemeMode } from '@/lib/theme';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/lib/notifications/useNotifications';
import { userApi } from '@/lib/api';
import type { PrimaryRole } from '@/types';

type NavItem = { href: string; key: string; icon: typeof LayoutDashboard };

const ROLE_BADGES: Record<PrimaryRole, { labelKey: string; accent: string; wash: string }> = {
  individual: { labelKey: 'role.individual', accent: '#4338CA', wash: '#EEF0FF' },
  freelancer: { labelKey: 'role.freelancer', accent: '#B42318', wash: '#FEF0EE' },
  entrepreneur: { labelKey: 'role.entrepreneur', accent: '#92400E', wash: '#FEF6E5' },
  sme: { labelKey: 'role.sme', accent: '#0F766E', wash: '#E6F9F6' },
};

const primaryGroups: Array<{ slug: string; items: readonly NavItem[] }> = [
  {
    slug: 'overview',
    items: [
      { href: '/dashboard', key: 'dashboard', icon: LayoutDashboard },
      { href: '/insights', key: 'insights', icon: BarChart3 },
    ],
  },
  {
    slug: 'money',
    items: [
      { href: '/accounts', key: 'accounts', icon: Wallet },
      { href: '/cards', key: 'cards', icon: CreditCard },
      { href: '/transactions', key: 'transactions', icon: ReceiptText },
      { href: '/budgets', key: 'budgets', icon: PieChart },
    ],
  },
  {
    slug: 'grow',
    items: [
      { href: '/vault', key: 'vault', icon: PiggyBank },
      { href: '/investments', key: 'investments', icon: TrendingUp },
      { href: '/loans', key: 'loans', icon: Landmark },
    ],
  },
  {
    slug: 'operate',
    items: [
      { href: '/pay', key: 'pay', icon: Send },
      { href: '/invoices', key: 'invoices', icon: FileText },
      { href: '/vendors', key: 'vendors', icon: Store },
    ],
  },
  {
    slug: 'reports',
    items: [
      { href: '/reports', key: 'reports', icon: FileBarChart },
      { href: '/statements', key: 'statements', icon: ScrollText },
    ],
  },
  {
    slug: 'support',
    items: [
      { href: '/coach', key: 'coach', icon: MessageCircle },
      { href: '/help', key: 'help', icon: HelpCircle },
    ],
  },
];

const accountItems = [
  { href: '/profile', key: 'settings', icon: Settings },
  { href: '/profile', key: 'profile', icon: User },
];

/** Group label: divider line on mobile (w-16), kicker text on md+. */
function GroupLabel({ slug, isFirst }: { slug: string; isFirst: boolean }) {
  const { t } = useTranslation();
  return (
    <li
      id={`nav-group-${slug}`}
      role="presentation"
      className={isFirst ? 'md:pb-1.5' : 'md:pt-4 md:pb-1.5'}
    >
      <span aria-hidden="true" className="block h-px bg-[var(--fv-border-subtle)] md:hidden" />
      <span className="hidden px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fv-text-secondary)] md:block">
        {t(`nav.groups.${slug}`)}
      </span>
    </li>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const { t } = useTranslation();
  // ponytail: /profile is shared by settings+profile; settings wins until profile gets its own route
  const active = pathname === item.href && (item.href !== '/profile' || item.key === 'settings');
  const NavIcon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      aria-label={t(`tabs.${item.key}`)}
      className={`flex items-center gap-3 rounded-[10px] border-2 px-3 py-2.5 text-sm transition-all duration-[120ms] ${
        active
          ? 'border-[var(--fv-border-ink)] bg-[var(--fv-wash)] font-black text-[var(--fv-text)] shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000]'
          : 'border-transparent text-[var(--fv-text-secondary)] font-semibold hover:border-[var(--fv-border-ink)] hover:bg-[var(--fv-surface)] hover:text-[var(--fv-text)]'
      }`}
    >
      <NavIcon size={18} strokeWidth={2.2} />
      <span className="hidden md:inline">{t(`tabs.${item.key}`)}</span>
    </Link>
  );
}

/**
 * Authenticated app shell: grouped sidebar + top bar. Guards unauthenticated users and
 * wires navigation, profile, interactive role-switching, and logout.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isRoleMenuOpen, setRoleMenuOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  const firstName = user?.fullName?.split(' ')[0] ?? '';
  const currentRole = user?.primaryRole ?? 'individual';
  const activeRoleBadge = ROLE_BADGES[currentRole];

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleSwitchRole = async (newRole: PrimaryRole) => {
    setRoleMenuOpen(false);
    if (newRole === currentRole) return;
    try {
      const updated = await userApi.setRole({ primaryRole: newRole, scheme: 'standard' });
      setUser(updated);
    } catch {
      if (user) setUser({ ...user, primaryRole: newRole });
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--fv-bg)]">
      <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] py-5 md:w-56 md:items-stretch md:px-4">
        <div className="mb-4 flex items-center gap-2.5 px-2">
          <VaultMark size={36} />
          <span className="hidden text-lg font-black uppercase tracking-wider text-[var(--fv-primary)] md:block">
            Finovault
          </span>
        </div>
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {primaryGroups.map((group, index) => (
            <ul
              key={group.slug}
              role="group"
              aria-labelledby={`nav-group-${group.slug}`}
              className="flex flex-col gap-1"
            >
              <GroupLabel slug={group.slug} isFirst={index === 0} />
              {group.items.map((item) => (
                <NavLink key={`${item.href}-${item.key}`} item={item} pathname={pathname} />
              ))}
            </ul>
          ))}
        </nav>
        <nav aria-label="Account" className="mt-auto flex flex-col gap-1">
          <ul role="group" aria-labelledby="nav-group-account" className="flex flex-col gap-1">
            <GroupLabel slug="account" isFirst={false} />
            {accountItems.map((item) => (
              <NavLink key={`${item.href}-${item.key}`} item={item} pathname={pathname} />
            ))}
          </ul>
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t('profile.logout')}
            className="flex items-center gap-3 rounded-[10px] border-2 border-transparent px-3 py-2.5 text-sm font-semibold text-[var(--fv-text-secondary)] transition-all duration-[120ms] hover:border-[var(--fv-border-ink)] hover:bg-[var(--fv-surface)] hover:text-[var(--fv-text)] md:py-2"
          >
            <LogOut size={18} strokeWidth={2.2} />
            <span className="hidden md:inline">{t('profile.logout')}</span>
          </button>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-5 shadow-[0_2px_0_0_rgba(26,26,46,0.06)]">
          {/* User info & interactive role badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black uppercase tracking-wider text-[var(--fv-text)]">
              {firstName}
            </span>

            {/* Role Switcher Pill Dropdown */}
            <div className="relative" ref={roleMenuRef}>
              <button
                type="button"
                onClick={() => setRoleMenuOpen((v) => !v)}
                aria-label={t('nav.switchRole')}
                className="flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                style={{ backgroundColor: activeRoleBadge.wash, color: activeRoleBadge.accent }}
              >
                <span>{t(activeRoleBadge.labelKey)}</span>
                <ChevronDown size={14} strokeWidth={3} className={`transition-transform duration-150 ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-[12px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-2 shadow-[4px_4px_0_0_#1A1A2E] dark:shadow-[4px_4px_0_0_#000000]">
                  <div className="mb-1.5 border-b border-[var(--fv-border-subtle)] px-2.5 pb-1 text-[10px] font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">
                    {t('nav.activeRole')}
                  </div>
                  {(['individual', 'freelancer', 'entrepreneur', 'sme'] as const).map((r) => {
                    const itemConf = ROLE_BADGES[r];
                    const isCurrent = currentRole === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleSwitchRole(r)}
                        className={`flex w-full items-center justify-between rounded-[8px] border-2 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all mb-1 ${
                          isCurrent
                            ? 'border-[var(--fv-border-ink)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]'
                            : 'border-transparent text-[var(--fv-text)] hover:border-[var(--fv-border-ink)] hover:bg-[var(--fv-wash)]'
                        }`}
                        style={{
                          backgroundColor: isCurrent ? itemConf.wash : undefined,
                          color: isCurrent ? itemConf.accent : undefined,
                        }}
                      >
                        <span>{t(itemConf.labelKey)}</span>
                        {isCurrent ? <Check size={14} strokeWidth={3} /> : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMode(nextMode)}
              aria-label={t('settings.theme')}
              aria-pressed={mode === 'system'}
              title={`${t('settings.theme')}: ${modeTitle}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] transition-all duration-[120ms] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1A1A2E] active:translate-y-0 active:shadow-none"
            >
              <ThemeIcon size={18} strokeWidth={2.2} className="text-[var(--fv-text)]" />
            </button>
            <NotificationBell
              unreadCount={unreadCount}
              isOpen={isDropdownOpen}
              onToggle={() => setDropdownOpen((v) => !v)}
              bellRef={bellRef}
            />
            <span className="rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--fv-on-fill)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
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