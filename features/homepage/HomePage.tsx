'use client';

import React, { useState, useEffect } from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { TickerTape } from './TickerTape';
import { Features } from './Features';
import { CurrencyPlayground } from './CurrencyPlayground';
import { VaultWrapsExplainer } from './VaultWrapsExplainer';
import { HowItWorks } from './HowItWorks';
import { DownloadSection } from './DownloadSection';
import { Footer } from './Footer';
import { OsDownloadModal } from '@/components/OsDownloadModal';

export function HomePage() {
  const [osModalOpen, setOsModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('scan') === '1' || params.get('download') === '1' || window.location.hash === '#os-download') {
      setOsModalOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F1EA] text-[#0A0A0A] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
      <Nav onOpenDownload={() => setOsModalOpen(true)} />
      <main>
        <Hero onOpenDownload={() => setOsModalOpen(true)} />
        <TickerTape variant="yellow" />
        <Features />
        <CurrencyPlayground />
        <VaultWrapsExplainer />
        <HowItWorks />
        <TickerTape variant="black" />
        <DownloadSection onOpenDownload={() => setOsModalOpen(true)} />
      </main>
      <Footer />
      <OsDownloadModal isOpen={osModalOpen} onClose={() => setOsModalOpen(false)} />
    </div>
  );
}
