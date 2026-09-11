'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VaultMark } from '@/components/VaultMark';

const navLinks = ['features', 'howItWorks', 'security', 'pricing'] as const;
const sectionIds = ['features', 'how-it-works', 'security', 'pricing'] as const;

export function Nav() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollTo(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-150 border-b-2 ${
        scrolled ? 'border-white/20 bg-[#0a0e17]/95 backdrop-blur-sm shadow-[0_4px_0_0_rgba(0,0,0,0.5)]' : 'border-white/10 bg-transparent'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10"
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3.5 group cursor-pointer"
          aria-label="FINOVAULT home"
        >
          <VaultMark size={34} subdued />
          <span className="hp-display text-base font-black tracking-widest text-white group-hover:text-[var(--fv-hp-accent-hover)] transition-colors">
            FINOVAULT
          </span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-4 md:flex" role="list">
          {navLinks.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => scrollTo(sectionIds[i])}
                className="text-xs font-bold uppercase tracking-[0.14em] text-white/80 transition-all hover:text-white px-3.5 py-1.5 border border-transparent hover:border-white/30 hover:bg-white/5 cursor-pointer"
              >
                {t(`hp.nav.${key}`)}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="/login"
          className="hidden rounded-none border-2 border-white bg-[var(--fv-hp-accent)] px-6 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-white transition-all shadow-[3px_3px_0_0_#ffffff] hover:shadow-[5px_5px_0_0_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none min-h-[44px] md:inline-flex md:items-center"
        >
          {t('hp.nav.enter')}
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center border-2 border-white/20 bg-white/5 md:hidden"
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
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-[72px] z-40 flex flex-col items-center justify-center gap-8 bg-[#0a0e17] border-t-2 border-white/20"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => scrollTo(sectionIds[i])}
              className="text-2xl font-black uppercase tracking-tight text-white/90 transition-colors hover:text-[var(--fv-hp-accent-hover)]"
            >
              {t(`hp.nav.${key}`)}
            </button>
          ))}
          <a
            href="/login"
            className="mt-4 rounded-none border-2 border-white bg-[var(--fv-hp-accent)] px-8 py-3.5 text-base font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#ffffff]"
          >
            {t('hp.nav.enter')}
          </a>
        </div>
      )}
    </header>
  );
}
