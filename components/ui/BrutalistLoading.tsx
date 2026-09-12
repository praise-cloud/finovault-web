'use client';

import React from 'react';
import Image from 'next/image';

interface BrutalistLoadingProps {
  message?: string;
  submessage?: string;
}

export function BrutalistLoading({
  message = 'INITIALIZING ENCRYPTED FINANCIAL LEDGER',
  submessage = 'FINOVAULT TELEMETRY v2.4 • ESTABLISHING ENCLAVE SESSION',
}: BrutalistLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[#070a13] px-6 text-white selection:bg-blue-600"
    >
      {/* Background cyber grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25"
      />

      {/* Brutalist Central Panel */}
      <div className="relative z-10 w-full max-w-md rounded-[12px] border-2 border-white/20 bg-[#0c111e]/95 p-6 md:p-8 shadow-[8px_8px_0_0_#1D4ED8] backdrop-blur-xl">
        {/* Header telemetry eyebrow */}
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase">
              NODE SECURE
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400">
            ID // 0xFV-901
          </span>
        </div>

        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-[10px] border-2 border-white/20 bg-[#070a13] p-2 shadow-[4px_4px_0_0_#ffffff]">
            <Image
              src="/finovault_logo_2d.svg"
              alt="Finovault"
              width={48}
              height={48}
              className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(29,78,216,0.5)]"
              priority
            />
          </div>
          <h2 className="font-display text-lg font-black tracking-wider text-white uppercase">
            FINOVAULT
          </h2>
          <p className="font-mono text-[11px] font-semibold tracking-wider text-slate-400">
            FINANCIAL INTELLIGENCE SYSTEM
          </p>
        </div>

        {/* Loading Progress Bar - Segmented Blocks */}
        <div className="mb-4">
          <div className="flex h-3 w-full gap-1 overflow-hidden rounded-[4px] border border-white/20 bg-[#05070e] p-0.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <div
                key={i}
                className="h-full flex-1 rounded-[1px] bg-blue-500 transition-all"
                style={{
                  animation: `pulseBlock 1.6s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Status text */}
        <div className="space-y-1 text-center font-mono">
          <div className="text-[11px] font-bold tracking-wider text-blue-300 uppercase">
            {message}
          </div>
          <div className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            {submessage}
          </div>
        </div>

        {/* Decorative corner brackets */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] font-mono text-slate-500">
          <span>LATENCY: 12ms</span>
          <span>CIPHER: AES-256-GCM</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulseBlock {
          0%, 100% {
            opacity: 0.15;
            background-color: #3b82f6;
          }
          50% {
            opacity: 1;
            background-color: #38bdf8;
            box-shadow: 0 0 8px #38bdf8;
          }
        }
      `}</style>
    </div>
  );
}
