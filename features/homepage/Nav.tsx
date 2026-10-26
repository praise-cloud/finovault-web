'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Smartphone, QrCode, Menu, X, ArrowUpRight } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';

const navItems = [
  { label: 'Features', id: 'features' },
  { label: 'Student Vault', id: 'vault' },
  { label: '20 Currencies', id: 'currencies' },
  { label: 'Vault Wraps', id: 'wraps' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Security', id: 'security' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b-2 ${
        scrolled
          ? 'bg-[#F3F1EA]/95 border-[#0A0A0A] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#F3F1EA] border-[#0A0A0A]'
      }`}
    >
      <nav aria-label="Main Navigation" className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2.5 group cursor-pointer shrink-0"
        >
          <VaultMark size={34} className="transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-wider text-[#0A0A0A] uppercase">
              FINOVAULT
            </span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#0A0A0A]/60 -mt-1">
              STUDENT VAULT v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0A0A0A]/80 hover:text-[#0A0A0A] hover:bg-black/5 rounded transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Action Button: Direct Download APK */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/downloads/finovault.apk"
            download="finovault.apk"
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Download size={14} strokeWidth={2.5} />
            <span>Download APK</span>
            <span className="bg-white/20 text-[10px] px-1.5 py-0.5 font-mono">57.7MB</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#0A0A0A] bg-[#F3F1EA] px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className="text-left py-2 font-bold text-sm uppercase tracking-wider text-[#0A0A0A] border-b border-[#0A0A0A]/10"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2">
              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                className="flex items-center justify-center gap-2 bg-[#2563EB] text-white font-black text-xs uppercase tracking-wider py-3 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] w-full"
              >
                <Download size={16} />
                <span>Download Android APK (57.7MB)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
