'use client';

import React from 'react';
import { Nav } from './Nav';
import { Hero } from './Hero';
import { Philosophy } from './Philosophy';
import { Features } from './Features';
import { Mirror } from './Mirror';
import { Personal } from './Personal';
import { Business } from './Business';
import { Roadmap } from './Roadmap';
import { Security } from './Security';
import { Comparison } from './Comparison';
import { Pricing } from './Pricing';
import { FinalCta } from './FinalCta';
import { Footer } from './Footer';
import { TickerTape } from './TickerTape';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--fv-hp-bg)] text-[var(--fv-hp-text-title)] selection:bg-[var(--fv-hp-accent)] selection:text-white transition-colors duration-200">
      <Nav />
      <main>
        <Hero />
        <TickerTape variant="blue" />
        <Philosophy />
        <Features />
        <Mirror />
        <Personal />
        <Business />
        <Roadmap />
        <TickerTape variant="black" />
        <Security />
        <Comparison />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
