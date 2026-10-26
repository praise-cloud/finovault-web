'use client';

import React from 'react';

const phrases = [
  'FINOVAULT STUDENT VAULT',
  'DAILY ALLOWANCE FUEL GAUGE',
  '20 GLOBAL & REGIONAL CURRENCIES',
  'TIMO & CASCAVELLE SPOTS',
  'SEMESTER VAULT WRAPS',
  '100% HIGH-CONTRAST LIGHT MODE',
  'OFFLINE-FIRST ENCRYPTED SQLITE',
  'ZERO ADS • ZERO SUBSCRIPTIONS',
  'DIRECT APK DOWNLOAD (57.7MB)',
];

export function TickerTape({ variant = 'yellow' }: { variant?: 'yellow' | 'blue' | 'black' }) {
  const getStyle = () => {
    switch (variant) {
      case 'yellow':
        return 'bg-[#FEF08A] text-[#0A0A0A] border-[#0A0A0A]';
      case 'blue':
        return 'bg-[#2563EB] text-white border-[#0A0A0A]';
      case 'black':
        return 'bg-[#0A0A0A] text-white border-[#0A0A0A]';
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden border-y-2 py-3 select-none ${getStyle()}`}
    >
      <div
        className="flex w-max gap-8 font-black uppercase text-xs sm:text-sm tracking-[0.2em]"
        style={{
          animation: 'ticker 26s linear infinite',
        }}
      >
        {[...phrases, ...phrases].map((text, i) => (
          <span key={i} className="inline-flex items-center gap-6 whitespace-nowrap">
            <span>{text}</span>
            <span className="opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
