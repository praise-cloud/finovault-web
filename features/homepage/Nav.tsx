'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Building2 } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { key: 'features', id: 'features', isRoute: false },
  { key: 'howItWorks', id: 'how-it-works', isRoute: false },
  { key: 'business', id: 'business', isRoute: true, href: '/business' },
  { key: 'security', id: 'security', isRoute: false },
  { key: 'pricing', id: 'pricing', isRoute: false },
] as const;

export function Nav() {
  const { t } = useTranslation();
  const { theme, toggleMode } = useTheme();
  const isDark = theme.mode === 'dark';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavClick(item: (typeof navLinks)[number]) {
    setOpen(false);
    if (!item.isRoute) {
      const el = document.getElementById(item.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-150 border-b-2 ${
        scrolled
          ? 'border-[var(--fv-hp-nav-border)] bg-[var(--fv-hp-nav-bg)] backdrop-blur-md shadow-[0_4px_0_0_rgba(15,23,42,0.06)] dark:shadow-[0_4px_0_0_rgba(0,0,0,0.5)]'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10"
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group cursor-pointer"
          aria-label="FINOVAULT home"
        >
          <VaultMark size={38} className="transition-transform group-hover:scale-105" />
          <span className="hp-display text-base font-black tracking-widest text-[var(--fv-hp-text-title)] group-hover:text-[var(--fv-hp-accent)] transition-colors">
            FINOVAULT
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-2 md:gap-4 lg:gap-6 xl:gap-8 md:flex" role="list">
          {navLinks.map((item) => (
            <li key={item.key}>
              {item.isRoute ? (
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--fv-hp-text-body)] hover:text-[var(--fv-hp-accent)] transition-all px-3.5 py-2 border border-transparent hover:border-[var(--fv-hp-accent-border)] hover:bg-[var(--fv-hp-accent-light)] cursor-pointer rounded-[4px]"
                >
                  <Building2 size={14} className="text-emerald-500" />
                  <span>{t(`hp.nav.${item.key}`, 'Finovault for Business')}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--fv-hp-text-body)] transition-all hover:text-[var(--fv-hp-text-title)] px-3.5 py-2 border border-transparent hover:border-[var(--fv-hp-border)] hover:bg-[var(--fv-hp-surface)] cursor-pointer rounded-[4px]"
                >
                  {t(`hp.nav.${item.key}`)}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleMode}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="flex h-10 items-center gap-2 rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-surface)] px-3 text-xs font-black uppercase tracking-wider text-[var(--fv-hp-text-title)] shadow-[2px_2px_0_0_#1D4ED8] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun size={15} className="text-amber-400" />
                <span className="text-[11px] font-mono">LIGHT</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-indigo-600" />
                <span className="text-[11px] font-mono">DARK</span>
              </>
            )}
          </button>

          {/* Enter Finovault CTA */}
          <Link
            href="/login"
            className="rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-accent)] px-5 py-2 text-xs font-black uppercase tracking-[0.15em] text-white transition-all shadow-[3px_3px_0_0_#0f172a] dark:shadow-[3px_3px_0_0_#ffffff] hover:shadow-[5px_5px_0_0_#1D4ED8] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none min-h-[40px] inline-flex items-center"
          >
            {t('hp.nav.enter')}
          </Link>
        </div>

        {/* Mobile controls: Theme toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleMode}
            aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="flex h-10 w-10 items-center justify-center border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-surface)] text-[var(--fv-hp-text-title)] shadow-[2px_2px_0_0_#1D4ED8]"
          >
            {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-surface)]"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('hp.nav.closeMenu') : t('hp.nav.openMenu')}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-[var(--fv-hp-text-title)] transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 bg-[var(--fv-hp-text-title)] transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-[var(--fv-hp-text-title)] transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[72px] z-40 flex flex-col items-center justify-center gap-6 bg-[var(--fv-hp-bg)] border-t-2 border-[var(--fv-hp-card-border)] px-6"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks.map((item) =>
            item.isRoute ? (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400"
              >
                <Building2 size={20} />
                <span>{t(`hp.nav.${item.key}`, 'Finovault for Business')}</span>
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                className="text-xl font-black uppercase tracking-tight text-[var(--fv-hp-text-title)] transition-colors hover:text-[var(--fv-hp-accent)]"
              >
                {t(`hp.nav.${item.key}`)}
              </button>
            )
          )}

          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-4 w-full max-w-xs text-center rounded-[6px] border-2 border-[var(--fv-hp-card-border)] bg-[var(--fv-hp-accent)] py-3 text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#0f172a] dark:shadow-[4px_4px_0_0_#ffffff]"
          >
            {t('hp.nav.enter')}
          </Link>
        </div>
      )}
    </header>
  );
}
