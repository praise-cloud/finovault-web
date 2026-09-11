'use client';

import React from 'react';

const phrases = [
  'FINOVAULT FINANCIAL INTELLIGENCE',
  'SEE IT. UNDERSTAND IT. OWN IT.',
  'ZERO UNCONTROLLED DEBT',
  'PATTERN RECOGNITION',
  'CASH FLOW CLARITY',
  'MULTI-CURRENCY INTELLIGENCE',
  'LOCAL-FIRST SOVEREIGN DATA',
  'AI MONEY COACH',
];

export function TickerTape({ variant = 'blue' }: { variant?: 'blue' | 'black' }) {
  const isBlue = variant === 'blue';
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden border-y-2 py-3 select-none ${
        isBlue
          ? 'border-white/20 bg-[var(--fv-hp-accent)] text-white'
          : 'border-black/20 bg-[#1A1A2E] text-white'
      }`}
    >
      <div
        className="flex w-max gap-8 font-black uppercase text-xs sm:text-sm tracking-[0.2em]"
        style={{
          animation: 'ticker 22s linear infinite',
        }}
      >
        {[...phrases, ...phrases].map((text, i) => (
          <span key={i} className="inline-flex items-center gap-6 whitespace-nowrap">
            <span>{text}</span>
            <span className="text-white/60">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}
