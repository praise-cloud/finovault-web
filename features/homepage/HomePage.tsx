'use client';

import React from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { TickerTape } from './TickerTape';
import { Features } from './Features';
import { CurrencyPlayground } from './CurrencyPlayground';
import { VaultWrapsExplainer } from './VaultWrapsExplainer';
import { HowItWorks } from './HowItWorks';
import { DownloadSection } from './DownloadSection';
import { Footer } from './Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#F3F1EA] text-[#0A0A0A] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
      <Nav />
      <main>
        <Hero />
        <TickerTape variant="yellow" />
        <Features />
        <CurrencyPlayground />
        <VaultWrapsExplainer />
        <HowItWorks />
        <TickerTape variant="black" />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}
