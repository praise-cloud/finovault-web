'use client';

import React from 'react';
import {
  Flame,
  Coffee,
  Globe2,
  Archive,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    tag: 'MODULE 01',
    icon: Flame,
    color: 'bg-[#FEF08A] text-[#854D0E]',
    title: 'Daily Allowance Fuel Gauge',
    description:
      'Know your exact safe daily spend. Finovault dynamically recalibrates your daily limit every morning based on remaining allowance and days left in your cycle.',
  },
  {
    tag: 'MODULE 02',
    icon: Coffee,
    color: 'bg-[#DBEAFE] text-[#1E40AF]',
    title: 'Campus Spots Tracker',
    description:
      'Log coffee at Timo or lunch at Cascavelle in one tap. No typing amounts or endless category menus—designed for fast campus routines.',
  },
  {
    tag: 'MODULE 03',
    icon: Globe2,
    color: 'bg-[#DCFCE7] text-[#166534]',
    title: '20 World Currencies',
    description:
      'Switch seamlessly between USD, EUR, GBP, NGN, MUR, ZAR, KES, GHS, CAD, AUD, INR, and more. Perfect for international and study-abroad students.',
  },
  {
    tag: 'MODULE 04',
    icon: Archive,
    color: 'bg-[#F3E8FF] text-[#6B21A8]',
    title: 'Vault Archives & Fresh Slates',
    description:
      'When your allowance period ends, archive it with one tap. Preserves historical receipts and reset your active vault with a completely fresh slate.',
  },
  {
    tag: 'MODULE 05',
    icon: Sparkles,
    color: 'bg-[#FCE7F3] text-[#9D174D]',
    title: 'Semester Vault Wraps',
    description:
      'Celebrate your money wins with a visual student wrap! Shows total savings, longest green streaks, top hangout spots, and your money personality badge.',
  },
  {
    tag: 'MODULE 06',
    icon: ShieldCheck,
    color: 'bg-[#E0E7FF] text-[#3730A3]',
    title: 'Local-First & Biometrics',
    description:
      'Zero ads, zero data selling. Encrypted on-device SQLite database guarded with biometric fingerprint or Face Unlock, with optional cloud backup.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-[#FFFFFF] border-b-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <span>CORE ARCHITECTURE</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            Built Specifically For Student Life
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Traditional banking apps are overly complex with charts you don&apos;t need. Finovault gives you the exact tools to make your allowance last the whole month.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-[#FAFAF8] border-2 border-[#0A0A0A] p-6 shadow-[5px_5px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#0A0A0A] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between border-b-2 border-[#0A0A0A]/10 pb-4 mb-5">
                    <span className="font-mono text-xs font-black text-[#0A0A0A]/60 tracking-wider">
                      {feat.tag}
                    </span>
                    <div className={`p-2 border-2 border-[#0A0A0A] ${feat.color} shadow-[2px_2px_0_0_#0A0A0A]`}>
                      <IconComponent size={18} strokeWidth={2.5} />
                    </div>
                  </div>

                  <h3 className="font-black text-xl uppercase tracking-tight text-[#0A0A0A] group-hover:text-[#2563EB] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium text-[#0A0A0A]/75 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center justify-between text-[11px] font-mono font-bold text-[#0A0A0A]/60">
                  <span>FINOVAULT CORE</span>
                  <span className="text-[#10B981] font-black uppercase">ACTIVE</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
