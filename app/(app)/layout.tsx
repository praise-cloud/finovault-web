'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Lock,
  Sparkles,
  ShieldCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme, type ThemeMode } from '@/lib/theme';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useNotifications } from '@/lib/notifications/useNotifications';
import { userApi } from '@/lib/api';
import type { PrimaryRole } from '@/types';

type NavItem = {
  href: string;
  key: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  requiredPlan?: 'plus' | 'business';
  badge?: string;
  badgeTone?: 'blue' | 'emerald' | 'amber';
  featureTitle?: string;
  featureDesc?: string;
};

const ROLE_BADGES: Record<PrimaryRole, { labelKey: string; accent: string; wash: string }> = {
  individual: { labelKey: 'role.individual', accent: '#4338CA', wash: '#EEF0FF' },
  freelancer: { labelKey: 'role.freelancer', accent: '#B42318', wash: '#FEF0EE' },
  entrepreneur: { labelKey: 'role.entrepreneur', accent: '#92400E', wash: '#FEF6E5' },
  sme: { labelKey: 'role.sme', accent: '#0F766E', wash: '#E6F9F6' },
};

const PLAN_TIERS: Record<'free' | 'plus' | 'business', number> = {
  free: 0,
  plus: 1,
  business: 2,
};

function hasPlanAccess(
  userPlan: 'free' | 'plus' | 'business' | undefined,
  requiredPlan?: 'plus' | 'business'
): boolean {
  if (!requiredPlan) return true;
  const currentLevel = PLAN_TIERS[userPlan || 'free'];
  const requiredLevel = PLAN_TIERS[requiredPlan];
  return currentLevel >= requiredLevel;
}

/**
 * Generates role-tailored navigation groups and package-locked capabilities.
 */
function getNavGroupsForRole(role: PrimaryRole): Array<{ slug: string; items: readonly NavItem[] }> {
  switch (role) {
    case 'individual':
      return [
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
            {
              href: '/investments',
              key: 'investments',
              icon: TrendingUp,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Smart Investments & ETF Engine',
              featureDesc: 'Automated wealth tracking, curated low-fee index funds, and compound yield projections.',
            },
            {
              href: '/loans',
              key: 'loans',
              icon: Landmark,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Low-Interest Personal Credit Lines',
              featureDesc: 'Instant emergency credit and fair repayment schedules with zero predatory debt traps.',
            },
          ],
        },
        {
          slug: 'operate',
          items: [
            { href: '/pay', key: 'pay', icon: Send },
          ],
        },
        {
          slug: 'reports',
          items: [
            { href: '/statements', key: 'statements', icon: ScrollText },
            {
              href: '/reports',
              key: 'reports',
              icon: FileBarChart,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Comprehensive Wealth & Tax Reports',
              featureDesc: 'Audit-ready annual statements, expense categorizations, and tax liability preparation packs.',
            },
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

    case 'freelancer':
      return [
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
            {
              href: '/investments',
              key: 'investments',
              icon: TrendingUp,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Freelancer Pension & Growth Vaults',
              featureDesc: 'Automated percentage sweep into pension reserves and diversified investment portfolios.',
            },
            {
              href: '/loans',
              key: 'loans',
              icon: Landmark,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Working Capital & Invoice Bridging',
              featureDesc: 'Bridge client payment lag times with low-rate working capital credit lines.',
            },
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
            { href: '/statements', key: 'statements', icon: ScrollText },
            {
              href: '/reports',
              key: 'reports',
              icon: FileBarChart,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Freelance P&L & MRA Tax Withholding',
              featureDesc: 'Automated VAT/Corporate tax quarantine mapped directly to incoming client payments.',
            },
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

    case 'entrepreneur':
      return [
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
            {
              href: '/investments',
              key: 'investments',
              icon: TrendingUp,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Strategic Treasury Reserves',
              featureDesc: 'High-yield operational buffer sweeps and corporate asset accumulation.',
            },
            {
              href: '/loans',
              key: 'loans',
              icon: Landmark,
              requiredPlan: 'business',
              badge: 'BIZ',
              badgeTone: 'emerald',
              featureTitle: 'Venture Debt & Corporate Credit Facility',
              featureDesc: 'Growth credit facilities with customized disbursement governance.',
            },
          ],
        },
        {
          slug: 'operate',
          items: [
            { href: '/pay', key: 'pay', icon: Send },
            { href: '/invoices', key: 'invoices', icon: FileText },
            { href: '/vendors', key: 'vendors', icon: Store },
            {
              href: '/checkout?plan=business',
              key: 'gateway',
              icon: ShieldCheck,
              requiredPlan: 'business',
              badge: 'MPGS',
              badgeTone: 'emerald',
              featureTitle: 'Mastercard MPGS Merchant Enclave',
              featureDesc: 'Tokenized multi-currency card acquiring with 3DS 2.0 biometric security.',
            },
          ],
        },
        {
          slug: 'reports',
          items: [
            { href: '/statements', key: 'statements', icon: ScrollText },
            {
              href: '/reports',
              key: 'reports',
              icon: FileBarChart,
              requiredPlan: 'business',
              badge: 'BIZ',
              badgeTone: 'emerald',
              featureTitle: 'Autonomous MRA Tax Shield & Audit Packs',
              featureDesc: 'Real-time corporate tax quarantine and exportable audit ledgers.',
            },
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

    case 'sme':
    default:
      return [
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
            {
              href: '/investments',
              key: 'investments',
              icon: TrendingUp,
              requiredPlan: 'plus',
              badge: 'PLUS',
              badgeTone: 'blue',
              featureTitle: 'Commercial Portfolio Management',
              featureDesc: 'Institutional yield vaults and multi-asset corporate growth.',
            },
            {
              href: '/loans',
              key: 'loans',
              icon: Landmark,
              requiredPlan: 'business',
              badge: 'BIZ',
              badgeTone: 'emerald',
              featureTitle: 'Commercial Credit Line & Trade Finance',
              featureDesc: 'Interbank credit facilities with dual 4-eyes approval workflows.',
            },
          ],
        },
        {
          slug: 'operate',
          items: [
            { href: '/pay', key: 'pay', icon: Send },
            { href: '/invoices', key: 'invoices', icon: FileText },
            { href: '/vendors', key: 'vendors', icon: Store },
            {
              href: '/checkout?plan=business',
              key: 'gateway',
              icon: ShieldCheck,
              requiredPlan: 'business',
              badge: 'MPGS',
              badgeTone: 'emerald',
              featureTitle: 'Mastercard MPGS Commercial Merchant Enclave',
              featureDesc: 'High-throughput payment gateway with instant settlement and recurring billing.',
            },
          ],
        },
        {
          slug: 'reports',
          items: [
            {
              href: '/reports',
              key: 'reports',
              icon: FileBarChart,
              requiredPlan: 'business',
              badge: 'BIZ',
              badgeTone: 'emerald',
              featureTitle: 'MRA Statutory Tax Shield & Ledger Packages',
              featureDesc: 'Automated Mauritius Revenue Authority tax withholding and ledger consolidation.',
            },
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
  }
}

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

function NavLink({
  item,
  pathname,
  currentPlan,
  onOpenUpgrade,
}: {
  item: NavItem;
  pathname: string;
  currentPlan: 'free' | 'plus' | 'business';
  onOpenUpgrade: (item: NavItem) => void;
}) {
  const { t } = useTranslation();
  const active = pathname === item.href && (item.href !== '/profile' || item.key === 'settings');
  const NavIcon = item.icon;
  const isLocked = !hasPlanAccess(currentPlan, item.requiredPlan);

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onOpenUpgrade(item);
    }
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      aria-current={active ? 'page' : undefined}
      aria-label={t(`tabs.${item.key}`)}
      className={`group relative flex items-center justify-between rounded-[10px] border-2 px-3 py-2.5 text-sm transition-all duration-[120ms] ${
        active
          ? 'border-[var(--fv-border-ink)] bg-[var(--fv-wash)] font-black text-[var(--fv-text)] shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000]'
          : 'border-transparent text-[var(--fv-text-secondary)] font-semibold hover:border-[var(--fv-border-ink)] hover:bg-[var(--fv-surface)] hover:text-[var(--fv-text)]'
      }`}
    >
      <div className="flex items-center gap-3">
        <NavIcon size={18} strokeWidth={2.2} />
        <span className="hidden md:inline">{t(`tabs.${item.key}`)}</span>
      </div>

      {/* Package tier badge or lock indicator */}
      {item.badge && (
        <div className="hidden md:flex items-center gap-1">
          {isLocked && <Lock size={11} className="text-[var(--fv-text-secondary)] opacity-80" />}
          <span
            className={`rounded-[4px] border px-1.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider ${
              item.badgeTone === 'emerald'
                ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                : 'border-blue-600/40 bg-blue-500/10 text-blue-700 dark:text-blue-400'
            }`}
          >
            {item.badge}
          </span>
        </div>
      )}

      {/* Mobile dot indicator */}
      {isLocked && (
        <span
          className={`absolute right-1.5 top-2 h-2 w-2 rounded-full md:hidden ${
            item.badgeTone === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
          }`}
        />
      )}
    </Link>
  );
}

/**
 * Authenticated app shell: role-tailored sidebar + package tier upgrades.
 * Guards unauthenticated users and wires interactive role switching,
 * package locks, notifications, theme toggling, and Mastercard MPGS checkout.
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
  const [upgradeModalItem, setUpgradeModalItem] = useState<NavItem | null>(null);

  const bellRef = useRef<HTMLButtonElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, announcement } = useNotifications();
  const { mode, setMode } = useTheme();

  const themeOrder: ThemeMode[] = ['dark', 'light', 'system'];
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

  const currentRole = user?.primaryRole ?? 'individual';
  const currentPlan = user?.subscriptionPlan || 'free';
  const activeRoleBadge = ROLE_BADGES[currentRole];

  // Dynamically compute navigation groups based on current logged-in role
  const roleGroups = useMemo(() => {
    return getNavGroupsForRole(currentRole);
  }, [currentRole]);

  if (!isAuthenticated) {
    return null;
  }

  const firstName = user?.fullName?.split(' ')[0] ?? '';

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
        {/* Brand Header */}
        <div className="mb-4 flex items-center gap-2.5 px-2">
          <VaultMark size={36} />
          <span className="hidden text-lg font-black uppercase tracking-wider text-[var(--fv-primary)] md:block">
            Finovault
          </span>
        </div>

        {/* Dynamic Role-Based Navigation Groups */}
        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {roleGroups.map((group, index) => (
            <ul
              key={group.slug}
              role="group"
              aria-labelledby={`nav-group-${group.slug}`}
              className="flex flex-col gap-1"
            >
              <GroupLabel slug={group.slug} isFirst={index === 0} />
              {group.items.map((item) => (
                <NavLink
                  key={`${item.href}-${item.key}`}
                  item={item}
                  pathname={pathname}
                  currentPlan={currentPlan}
                  onOpenUpgrade={(lockedItem) => setUpgradeModalItem(lockedItem)}
                />
              ))}
            </ul>
          ))}
        </nav>

        {/* Brutalist Plan Status & Upgrade Widget */}
        <div className="my-2 hidden md:block">
          <div className="rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-3 shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#000000]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--fv-text-secondary)]">
                {t('nav.currentPlan')}
              </span>
              <span className="rounded-[4px] border border-[var(--fv-border-ink)] bg-[var(--fv-surface)] px-1.5 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider text-[var(--fv-primary)]">
                {currentPlan.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-[var(--fv-text)]">
              {currentPlan === 'business'
                ? 'All Enclaves Active'
                : currentPlan === 'plus'
                ? 'Plus Plan Active'
                : 'Free Starter Tier'}
            </p>
            {currentPlan !== 'business' && (
              <Link
                href={currentPlan === 'plus' ? '/checkout?plan=business' : '/checkout?plan=plus'}
                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-2 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-[2px_2px_0_0_#0f172a] dark:shadow-[2px_2px_0_0_#ffffff] hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <Sparkles size={12} className="text-amber-300" />
                <span>
                  {currentPlan === 'plus'
                    ? t('nav.upgradeToBiz')
                    : t('nav.upgradeToPlus')}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Account Nav */}
        <nav aria-label="Account" className="mt-auto flex flex-col gap-1">
          <ul role="group" aria-labelledby="nav-group-account" className="flex flex-col gap-1">
            <GroupLabel slug="account" isFirst={false} />
            {accountItems.map((item) => (
              <NavLink
                key={`${item.href}-${item.key}`}
                item={item}
                pathname={pathname}
                currentPlan={currentPlan}
                onOpenUpgrade={(lockedItem) => setUpgradeModalItem(lockedItem)}
              />
            ))}
          </ul>
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t('profile.logout')}
            className="flex items-center gap-3 rounded-[10px] border-2 border-transparent px-3 py-2.5 text-sm font-semibold text-[var(--fv-text-secondary)] transition-all duration-[120ms] hover:border-[var(--fv-border-ink)] hover:bg-[var(--fv-surface)] hover:text-[var(--fv-text)] md:py-2 cursor-pointer"
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
                className="flex items-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] px-3 py-1 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none cursor-pointer"
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
                        className={`flex w-full items-center justify-between rounded-[8px] border-2 px-3 py-2 text-xs font-black uppercase tracking-wider transition-all mb-1 cursor-pointer ${
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

            {/* Subscription / Mastercard Plan Badge */}
            {currentPlan === 'business' ? (
              <Link
                href="/cards"
                className="hidden sm:flex items-center gap-1.5 rounded-[8px] border-2 border-amber-600 bg-amber-100 dark:bg-amber-950/60 text-amber-950 dark:text-amber-300 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#D97706] hover:-translate-y-0.5 transition-all"
              >
                <span className="h-2 w-2 rounded-full bg-[#EB001B]" />
                <span>★ BIZ ENTERPRISE</span>
              </Link>
            ) : currentPlan === 'plus' ? (
              <Link
                href="/cards"
                className="hidden sm:flex items-center gap-1.5 rounded-[8px] border-2 border-blue-600 bg-blue-100 dark:bg-blue-950/60 text-blue-950 dark:text-blue-300 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#1D4ED8] hover:-translate-y-0.5 transition-all"
              >
                <span className="h-2 w-2 rounded-full bg-[#EB001B]" />
                <span>★ PLUS PRO</span>
              </Link>
            ) : (
              <Link
                href="/checkout?plan=plus"
                className="hidden sm:flex items-center gap-1.5 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] hover:-translate-y-0.5 transition-all"
              >
                <span>⚡ UPGRADE</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMode(nextMode)}
              aria-label={t('settings.theme')}
              aria-pressed={mode === 'system'}
              title={`${t('settings.theme')}: ${modeTitle}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] transition-all duration-[120ms] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_#1A1A2E] active:translate-y-0 active:shadow-none cursor-pointer"
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
              {currentPlan === 'business' ? 'Business' : currentPlan === 'plus' ? 'Plus' : 'Free'}
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

      {/* Package Upgrade Dialog Modal */}
      {upgradeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => setUpgradeModalItem(null)}
        >
          <div
            className="relative w-full max-w-md rounded-[14px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)] p-6 shadow-[8px_8px_0_0_#1A1A2E] dark:shadow-[8px_8px_0_0_#000000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setUpgradeModalItem(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-[6px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] text-[var(--fv-text)] shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000] hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              <X size={16} strokeWidth={3} />
            </button>

            {/* Plan requirement eyebrow */}
            <div className="inline-flex items-center gap-1.5 rounded-[6px] border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-mono font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              <Sparkles size={13} className="text-amber-500" />
              <span>REQUIRES {upgradeModalItem.requiredPlan?.toUpperCase()} PACKAGE</span>
            </div>

            <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-[var(--fv-text)]">
              {upgradeModalItem.featureTitle || t(`tabs.${upgradeModalItem.key}`)}
            </h2>

            <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--fv-text-secondary)]">
              {upgradeModalItem.featureDesc ||
                t('nav.featureLockedDesc', { plan: upgradeModalItem.requiredPlan?.toUpperCase() })}
            </p>

            {/* Key benefits list */}
            <div className="mt-5 space-y-2 rounded-[8px] border border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-3 text-xs font-semibold text-[var(--fv-text)]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                <span>Instant activation via Mastercard MPGS 3DS 2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={15} className="text-emerald-500 shrink-0" />
                <span>
                  {upgradeModalItem.requiredPlan === 'business'
                    ? 'Includes Multi-Entity Consolidation & MRA Tax Shield'
                    : 'Includes AI Runway Simulation & Multi-Currency Vaults'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={15} className="text-emerald-500 shrink-0" />
                <span>Priority interbank settlement and exportable ledgers</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href={`/checkout?plan=${upgradeModalItem.requiredPlan || 'plus'}`}
                onClick={() => setUpgradeModalItem(null)}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-primary)] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-[3px_3px_0_0_#1A1A2E] dark:shadow-[3px_3px_0_0_#ffffff] hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                <span>{t('nav.upgradeCta')}</span>
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>

              <Link
                href={upgradeModalItem.href}
                onClick={() => setUpgradeModalItem(null)}
                className="flex min-h-[38px] items-center justify-center rounded-[8px] border border-[var(--fv-border-subtle)] bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--fv-text-secondary)] hover:border-[var(--fv-border-ink)] hover:text-[var(--fv-text)] cursor-pointer"
              >
                {t('nav.previewAnyway')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}