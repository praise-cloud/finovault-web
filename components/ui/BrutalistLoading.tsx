'use client';

import React from 'react';
import { VaultMark } from '@/components/VaultMark';

interface BrutalistLoadingProps {
  message?: string;
  submessage?: string;
}

export function BrutalistLoading({
  message = 'FINOVAULT',
  submessage = 'Loading Student Vault...',
}: BrutalistLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F3F1EA] text-[#0A0A0A] select-none"
    >
      {/* Background subtle brutalist dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#0A0A0A 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Bouncing Logo and Shadow */}
      <div className="relative flex flex-col items-center">
        {/* Bouncing Finovault Logo */}
        <div className="animate-bounce transition-transform duration-300">
          <VaultMark size={84} />
        </div>

        {/* Dynamic Shadow expanding/contracting beneath bouncing logo */}
        <div className="mt-3 h-2.5 w-16 rounded-full bg-[#0A0A0A]/20 blur-[1px] animate-pulse" />

        {/* Minimal Brand Label */}
        <div className="mt-8 flex flex-col items-center text-center">
          <span className="font-black text-lg tracking-[0.25em] uppercase text-[#0A0A0A]">
            {message}
          </span>
          <span className="mt-1 font-mono text-[10px] font-bold tracking-widest text-[#0A0A0A]/60 uppercase">
            {submessage}
          </span>
        </div>
      </div>
    </div>
  );
}
