'use client';

import React from 'react';
import { Archive, Sparkles, Award, Coffee, ArrowRight, CheckCircle2 } from 'lucide-react';

export function VaultWrapsExplainer() {
  return (
    <section id="wraps" className="py-24 md:py-32 bg-[#F3F1EA] border-b-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <span>SEMESTER RECAP & CYCLES</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            Vault Archives & Celebratory Wraps
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Campus life moves in semesters and monthly allowances. Here is how Finovault keeps your budget organized without clutter.
          </p>
        </div>

        {/* 2-Column Comparison: Archive vs Wrap */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Vault Archive */}
          <div className="bg-white border-2 border-[#0A0A0A] p-8 shadow-[6px_6px_0_0_#0A0A0A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#0A0A0A] text-white">
                    <Archive size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight text-[#0A0A0A]">
                      The Vault Archive
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#0A0A0A]/60">
                      RESET WITH A FRESH SLATE
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-[#0A0A0A]/80 leading-relaxed">
                When your allowance month or semester ends, you don&apos;t want old groceries and coffee receipts cluttering your daily fuel gauge.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#FAFAF8] border-2 border-[#0A0A0A]/20">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase text-[#0A0A0A]">Permanent Snapshot</div>
                    <div className="text-xs text-[#0A0A0A]/70">Freezes all receipts, merchant totals, and dates in local SQLite.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAFAF8] border-2 border-[#0A0A0A]/20">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase text-[#0A0A0A]">Fresh Allowance Pool</div>
                    <div className="text-xs text-[#0A0A0A]/70">Zeroes out daily spent count so day 1 starts 100% in the green.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#FAFAF8] border-2 border-[#0A0A0A]/20">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase text-[#0A0A0A]">Instant History Retrieval</div>
                    <div className="text-xs text-[#0A0A0A]/70">Open the History tab anytime to audit past months and spending patterns.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[#0A0A0A]/10 text-xs font-mono font-bold text-[#0A0A0A]/60">
              FEATURE: <code>studentVaultProvider.archiveVault()</code>
            </div>
          </div>

          {/* Card 2: Vault Wraps */}
          <div className="bg-[#FEF08A] border-2 border-[#0A0A0A] p-8 shadow-[6px_6px_0_0_#0A0A0A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#2563EB] text-white">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-tight text-[#0A0A0A]">
                      The Vault Wrap
                    </h3>
                    <span className="text-xs font-mono font-bold text-[#0A0A0A]/70">
                      SPOTIFY WRAPPED FOR STUDENT MONEY
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-[#0A0A0A]/85 leading-relaxed">
                Archiving triggers an interactive celebration wrap summarizing your money wins and hangout streaks for the period.
              </p>

              {/* Sample Visual Wrap Card */}
              <div className="mt-6 bg-white border-2 border-[#0A0A0A] p-4 shadow-[4px_4px_0_0_#0A0A0A]">
                <div className="flex justify-between items-center border-b border-[#0A0A0A]/15 pb-2 text-[11px] font-mono font-bold">
                  <span>MONTHLY WRAP RECAP</span>
                  <span className="bg-[#10B981] text-white px-2 py-0.5 text-[10px] uppercase">WON</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/20">
                    <div className="text-[10px] font-mono uppercase text-[#0A0A0A]/60">Saved To Stash</div>
                    <div className="text-lg font-black text-[#10B981] mt-0.5">+$145.00</div>
                  </div>
                  <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/20">
                    <div className="text-[10px] font-mono uppercase text-[#0A0A0A]/60">Top Spot</div>
                    <div className="text-sm font-black text-[#0A0A0A] mt-1 truncate">☕ Timo (18 visits)</div>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-[#EFF6FF] border border-[#2563EB]/30 text-xs font-bold text-[#1E40AF] flex items-center gap-2">
                  <Award size={16} />
                  <span>Badge: The Disciplined Saver (Top 10%)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-[#0A0A0A]/20 text-xs font-mono font-bold text-[#0A0A0A]/70">
              FEATURE: <code>p.wrapSummary</code> inside Student Vault
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
