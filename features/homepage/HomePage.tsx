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

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <Features />
        <Mirror />
        <Personal />
        <Business />
        <Roadmap />
        <Security />
        <Comparison />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
