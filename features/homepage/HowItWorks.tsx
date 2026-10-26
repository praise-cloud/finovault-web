'use client';

import React from 'react';
import { Download, Sliders, Flame, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Download & Launch',
    subtitle: 'Zero delay, no verification friction',
    desc: 'Download the standalone Android APK (57.7MB) directly from this page. Sign up with your email and jump straight into your vault with zero email activation blockers.',
    icon: Download,
    accent: 'bg-[#FEF08A]',
  },
  {
    step: '02',
    title: 'Pick Currency & Allowance',
    subtitle: 'Customized for 20 global regions',
    desc: 'Open the half-screen drawer, choose your local currency from the dropdown list, and set your monthly or weekly allowance fund. Finovault instantly calculates your safe daily fuel limit.',
    icon: Sliders,
    accent: 'bg-[#DBEAFE]',
  },
  {
    step: '03',
    title: 'Stay In The Green',
    subtitle: '1-tap spot logging & wraps',
    desc: 'Whenever you grab coffee at Timo or food at Cascavelle, log it in one tap. Your Daily Fuel Gauge keeps you in the green, and at semester end you celebrate with your custom Vault Wrap!',
    icon: Flame,
    accent: 'bg-[#DCFCE7]',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F3F1EA] border-b-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <span>GETTING STARTED</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            How Finovault Works
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Get started in under 60 seconds with no complex spreadsheets, no subscription fees, and no bank credential syncing required.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-white border-2 border-[#0A0A0A] p-7 shadow-[5px_5px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-6">
                    <span className="font-mono text-3xl font-black text-[#0A0A0A]">
                      {s.step}
                    </span>
                    <div className={`p-2.5 border-2 border-[#0A0A0A] ${s.accent} shadow-[2px_2px_0_0_#0A0A0A]`}>
                      <Icon size={20} strokeWidth={2.5} className="text-[#0A0A0A]" />
                    </div>
                  </div>

                  <h3 className="font-black text-xl uppercase tracking-tight text-[#0A0A0A]">
                    {s.title}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#2563EB] mt-1 uppercase">
                    {s.subtitle}
                  </div>

                  <p className="mt-4 text-sm font-medium text-[#0A0A0A]/75 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-[#0A0A0A]/10 flex items-center text-xs font-black uppercase text-[#0A0A0A]">
                  <span>Step {s.step} Complete</span>
                  <ArrowRight size={14} className="ml-auto text-[#2563EB]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
