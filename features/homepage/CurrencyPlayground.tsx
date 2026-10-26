'use client';

import React, { useState } from 'react';
import { Globe, ArrowRight, Check } from 'lucide-react';

const all20Currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, region: 'Global' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, region: 'Europe' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, region: 'UK' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1550, region: 'West Africa' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', rate: 46.5, region: 'Indian Ocean' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.2, region: 'Southern Africa' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 130, region: 'East Africa' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', rate: 15.2, region: 'West Africa' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.37, region: 'North America' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rate: 1.52, region: 'Oceania' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5, region: 'South Asia' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 154, region: 'East Asia' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24, region: 'East Asia' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', rate: 3.67, region: 'Middle East' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 48.6, region: 'North Africa' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw ', rate: 1320, region: 'East Africa' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh ', rate: 2650, region: 'East Africa' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh ', rate: 3720, region: 'East Africa' },
  { code: 'XOF', name: 'West African CFA', symbol: 'CFA ', rate: 605, region: 'West Africa' },
  { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA ', rate: 605, region: 'Central Africa' },
];

export function CurrencyPlayground() {
  const [selected, setSelected] = useState(all20Currencies[0]);

  const format = (baseUsd: number) => {
    const val = baseUsd * selected.rate;
    if (val >= 100) {
      return `${selected.symbol}${Math.round(val).toLocaleString()}`;
    }
    return `${selected.symbol}${val.toFixed(2)}`;
  };

  return (
    <section id="currencies" className="py-24 md:py-32 bg-[#FFFFFF] border-b-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <Globe size={14} />
            <span>GLOBAL STUDENT COMMUNITY</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            Native 20-Currency Engine
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Select your local currency directly in the half-screen Settings drawer. Finovault formats every single allowance, fuel gauge limit, and campus spot instantly.
          </p>
        </div>

        {/* 20-Currency Selector Grid */}
        <div className="mt-12">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#0A0A0A]/60 mb-3">
            Click Any Currency To Test Live Formatting:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {all20Currencies.map((c) => {
              const isSelected = selected.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`p-2.5 border-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] -translate-y-0.5'
                      : 'bg-[#FAFAF8] text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#F3F1EA]'
                  }`}
                >
                  <div className="font-mono text-xs font-black">{c.code}</div>
                  <div className="text-base font-black mt-0.5">{c.symbol.trim()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Console */}
        <div className="mt-8 bg-[#F3F1EA] border-2 border-[#0A0A0A] p-6 shadow-[5px_5px_0_0_#0A0A0A]">
          <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-6 gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-[#0A0A0A]/60 uppercase">Currently Selected</span>
              <div className="text-xl font-black text-[#0A0A0A] uppercase mt-0.5">
                {selected.name} ({selected.code})
              </div>
            </div>
            <div className="bg-[#FEF08A] border-2 border-[#0A0A0A] px-3 py-1 text-xs font-mono font-bold">
              Region: {selected.region}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-[2px_2px_0_0_#0A0A0A]">
              <span className="text-xs font-mono font-bold uppercase text-[#0A0A0A]/60">Monthly Allowance</span>
              <div className="text-2xl font-black text-[#0A0A0A] mt-1">{format(500)}</div>
              <span className="text-[10px] font-mono text-[#0A0A0A]/50">Calibrated for 30 days</span>
            </div>

            <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-[2px_2px_0_0_#0A0A0A]">
              <span className="text-xs font-mono font-bold uppercase text-[#0A0A0A]/60">Safe Daily Fuel Spend</span>
              <div className="text-2xl font-black text-[#10B981] mt-1">{format(16.50)}</div>
              <span className="text-[10px] font-mono text-[#10B981]">● Safe in the green</span>
            </div>

            <div className="bg-white border-2 border-[#0A0A0A] p-4 shadow-[2px_2px_0_0_#0A0A0A]">
              <span className="text-xs font-mono font-bold uppercase text-[#0A0A0A]/60">Timo Coffee Spot</span>
              <div className="text-2xl font-black text-[#2563EB] mt-1">{format(3.20)}</div>
              <span className="text-[10px] font-mono text-[#0A0A0A]/50">1-tap quick log rate</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
