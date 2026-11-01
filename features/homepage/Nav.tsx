'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';

interface NavProps {
  onOpenDownload?: () => void;
}

export function Nav({ onOpenDownload }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadClick = () => {
    if (onOpenDownload) {
      onOpenDownload();
    } else {
      const element = document.getElementById('download');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 border-b-2 ${
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
              PRODUCT RELEASE v2.1
            </span>
          </div>
        </Link>

        {/* Action Button: Direct Get App CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadClick}
            className="inline-flex items-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Download size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">Get App (iOS / Android)</span>
            <span className="sm:hidden">Get App</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
