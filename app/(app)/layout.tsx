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
} from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme, type ThemeMode } from '@/lib/theme';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/lib/notifications/useNotifications';

type NavItem = { href: string; key: string; icon: typeof LayoutDashboard };

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
      className={`flex items-center gap-3 rounded-[10px] border-2 px-3 py-3 text-sm transition-colors duration-[120ms] md:py-2.5 ${
        active
          ? 'border-[var(--fv-border)] bg-[var(--fv-wash)] font-semibold text-[var(--fv-text)]'
          : 'border-transparent text-[var(--fv-text-secondary)] hover:bg-[var(--fv-border-subtle)]'
      }`}
    >
      <NavIcon size={20} strokeWidth={1.8} />
      <span className="hidden md:inline">{t(`tabs.${item.key}`)}</span>
    </Link>
  );
}

/**
 * Authenticated app shell: grouped sidebar + top bar. Guards unauthenticated users and
 * wires navigation, profile and logout.
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
            className="flex items-center gap-3 rounded-[10px] border-2 border-transparent px-3 py-3 text-sm text-[var(--fv-text-secondary)] transition-colors duration-[120ms] hover:bg-[var(--fv-border-subtle)] md:py-2.5"
          >
            <LogOut size={20} strokeWidth={1.8} />
            <span className="hidden md:inline">{t('profile.logout')}</span>
          </button>
        </nav>
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