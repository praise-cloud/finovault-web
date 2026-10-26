'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Heart } from 'lucide-react';
import { VaultMark } from '@/components/VaultMark';

export function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white py-16 border-t-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/20">
          
          {/* Brand Col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <VaultMark size={32} />
              <span className="font-black text-xl tracking-wider uppercase text-white">
                FINOVAULT
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-white/70 max-w-sm leading-relaxed">
              The high-contrast Neo-Brutalist student vault and daily allowance fuel gauge. Designed for campus living, local hangout tracking, and 20 world currencies.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs uppercase px-4 py-2 border border-white/40 shadow-[2px_2px_0_0_#ffffff] transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Download APK (57.7MB)</span>
              </a>
            </div>
          </div>

          {/* Navigation Col */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FEF08A] mb-4">
              APPLICATION
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-white/80">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('features')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Core Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('currencies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  20 World Currencies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('wraps')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vault Archives & Wraps
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('download')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Direct APK Download
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Col */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#FEF08A] mb-4">
              TECHNICAL INTEGRITY
            </h4>
            <div className="space-y-2 text-xs font-mono text-white/70">
              <div>BUILD: <code>v1.0.0-release</code></div>
              <div>PACKAGE: <code>finovault.apk</code></div>
              <div>CHECKSUM: <span className="text-white/90">DA776A745AD3...</span></div>
              <div>STORAGE: <code>Encrypted SQLite (Local-First)</code></div>
              <div>BACKEND: <code>Supabase Auth + Node BFF</code></div>
              <div>DEPLOYMENT: <code>Hostinger Static Export</code></div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/50 gap-4">
          <div>
            © {new Date().getFullYear()} FINOVAULT. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <span>Crafted with</span>
            <Heart size={13} className="text-red-500 fill-red-500" />
            <span>for students worldwide.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
