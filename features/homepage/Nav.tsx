'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';

const navLinks = [
  { key: 'features', id: 'features', isRoute: false },
  { key: 'howItWorks', id: 'how-it-works', isRoute: false },
  { key: 'business', id: 'business', isRoute: true, href: '/business' },
  { key: 'security', id: 'security', isRoute: false },
  { key: 'pricing', id: 'pricing', isRoute: false },
] as const;

export function Nav() {
  const { t } = useTranslation();
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
      className={`fixed top-0 left-0 right-0 z-50 h-[76px] transition-all duration-200 border-b-2 ${
        scrolled
          ? 'border-white/20 bg-[#070a10]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
          : 'border-white/10 bg-[#0a0e17]/85 backdrop-blur-sm'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10"
      >
        {/* Brand Logo & Wordmark */}
        <Link
          href="/"
          onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group cursor-pointer shrink-0"
          aria-label="FINOVAULT home"
        >
          <VaultMark size={38} className="transition-transform group-hover:scale-105" />
          <span className="hp-display text-base md:text-lg font-black tracking-widest text-white group-hover:text-blue-400 transition-colors">
            FINOVAULT
          </span>
        </Link>

        {/* Desktop links - uniformly arranged across available space */}
        <div className="hidden md:flex flex-1 items-center justify-center px-6 lg:px-10">
          <ul className="flex w-full max-w-2xl items-center justify-between gap-1 lg:gap-3" role="list">
            {navLinks.map((item) => (
              <li key={item.key} className="flex-1 text-center">
                {item.isRoute ? (
                  <Link
                    href={item.href}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-400 shadow-[2px_2px_0_0_#059669] transition-all hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-white active:translate-x-0.5 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
                  >
                    <Building2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{t(`hp.nav.${item.key}`, 'Finovault for Business')}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className="w-full text-center rounded-[6px] border border-transparent px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 transition-all hover:border-white/20 hover:bg-white/5 hover:text-white cursor-pointer whitespace-nowrap"
                  >
                    {t(`hp.nav.${item.key}`)}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center md:flex shrink-0">
          <Link
            href="/login"
            className="rounded-[6px] border-2 border-white/50 bg-[#1D4ED8] hover:bg-[#2563EB] px-6 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-white transition-all shadow-[3px_3px_0_0_#ffffff] hover:shadow-[5px_5px_0_0_#38BDF8] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none min-h-[42px] inline-flex items-center justify-center cursor-pointer"
          >
            {t('hp.nav.enter')}
          </Link>
        </div>

        {/* Mobile controls: hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center border-2 border-white/25 bg-[#0e131f] text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t('hp.nav.closeMenu') : t('hp.nav.openMenu')}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[76px] z-40 flex flex-col items-center justify-center gap-6 bg-[#0a0e17] border-t-2 border-white/20 px-6"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks.map((item) =>
            item.isRoute ? (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-xl font-black uppercase tracking-tight text-emerald-400"
              >
                <Building2 size={20} />
                <span>{t(`hp.nav.${item.key}`, 'Finovault for Business')}</span>
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                className="text-xl font-black uppercase tracking-tight text-white transition-colors hover:text-blue-400"
              >
                {t(`hp.nav.${item.key}`)}
              </button>
            )
          )}

          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-4 w-full max-w-xs text-center rounded-[6px] border-2 border-white/50 bg-[#1D4ED8] py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#ffffff]"
          >
            {t('hp.nav.enter')}
          </Link>
        </div>
      )}
    </header>
  );
}
