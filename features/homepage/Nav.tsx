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
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-colors duration-250 md:h-[72px] ${
        scrolled ? 'bg-[#0a0e17]' : 'bg-transparent'
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
          className="flex items-center gap-2"
          aria-label="FINOVAULT home"
        >
          <VaultMark size={32} subdued />
          <span className="hp-display text-sm tracking-widest text-white">FINOVAULT</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {navLinks.map((key, i) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => scrollTo(sectionIds[i])}
                className="text-sm font-medium uppercase tracking-wider text-white/80 transition-colors hover:text-white"
              >
                {t(`hp.nav.${key}`)}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="/login"
          className="hidden rounded-none bg-[var(--fv-hp-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--fv-hp-accent-hover)] min-h-[48px] md:inline-block"
        >
          {t('hp.nav.enter')}
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
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
          className="fixed inset-0 top-[64px] z-40 flex flex-col items-center justify-center gap-8 bg-[#0a0e17]"
          role="dialog"
          aria-label="Mobile navigation"
        >
          {navLinks.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => scrollTo(sectionIds[i])}
              className="text-2xl font-bold uppercase tracking-wide text-white/80 transition-colors hover:text-white"
            >
              {t(`hp.nav.${key}`)}
            </button>
          ))}
          <a
            href="/login"
            className="mt-4 rounded-none bg-[var(--fv-hp-accent)] px-8 py-3 text-lg font-semibold uppercase tracking-widest text-white"
          >
            {t('hp.nav.enter')}
          </a>
        </div>
      )}
    </header>
  );
}
