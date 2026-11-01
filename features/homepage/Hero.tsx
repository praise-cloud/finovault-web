'use client';

import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  QrCode,
  ShieldCheck,
  Zap,
  Flame,
  Coffee,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Sliders,
  ChevronRight,
  ArrowDown,
  Box,
  Layers,
  Apple,
  Lock,
} from 'lucide-react';
import { ThreeProductScene } from './ThreeProductScene';

const currencies = [
  { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
  { code: 'MUR', symbol: '₨', rate: 46.5, name: 'Mauritian Rupee' },
  { code: 'NGN', symbol: '₦', rate: 1550.0, name: 'Nigerian Naira' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'ZAR', symbol: 'R', rate: 18.2, name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', rate: 130.0, name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: 'GH₵', rate: 15.2, name: 'Ghanaian Cedi' },
];

interface HeroProps {
  onOpenDownload?: () => void;
}

export function Hero({ onOpenDownload }: HeroProps) {
  // View Mode: 3D interactive model vs Interactive Phone UI Mockup
  const [viewMode, setViewMode] = useState<'3d' | 'device'>('3d');

  // Interactive Phone Simulator State
  const [activeTab, setActiveTab] = useState<'gauge' | 'spots' | 'currencies' | 'security'>('gauge');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [spentToday, setSpentToday] = useState(12.5);
  const [dailyAllowance] = useState(35.0);
  const [recentLogs, setRecentLogs] = useState<Array<{ name: string; amount: number; time: string; spot: string }>>([
    { name: 'Timo Coffee', amount: 3.5, time: '10:15 AM', spot: 'Campus Timo' },
    { name: 'Cascavelle Lunch', amount: 8.0, time: '1:30 PM', spot: 'Food Court' },
  ]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [lastLoggedSpot, setLastLoggedSpot] = useState<string | null>(null);

  const safeToSpend = Math.max(0, dailyAllowance - spentToday);
  const fuelPercent = Math.round((safeToSpend / dailyAllowance) * 100);

  const formatAmount = (usdVal: number) => {
    const val = usdVal * selectedCurrency.rate;
    if (selectedCurrency.code === 'NGN' || selectedCurrency.code === 'MUR' || selectedCurrency.code === 'KES') {
      return `${selectedCurrency.symbol}${Math.round(val).toLocaleString()}`;
    }
    return `${selectedCurrency.symbol}${val.toFixed(2)}`;
  };

  const handleQuickLog = (spotName: string, usdAmount: number) => {
    setSpentToday((prev) => prev + usdAmount);
    setLastLoggedSpot(spotName);
    setRecentLogs((prev) => [
      { name: spotName, amount: usdAmount, time: 'Just now', spot: spotName },
      ...prev.slice(0, 2),
    ]);
    setTimeout(() => setLastLoggedSpot(null), 1200);
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 bg-[#F3F1EA] text-[#0A0A0A] border-b-2 border-[#0A0A0A]">
      {/* Background Graphic Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0A0A0A 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Product Value Proposition & Direct CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Neo-Brutalist Hardware & App Badge */}
            <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>FINOVAULT PRODUCT RELEASE v2.1 • iOS &amp; ANDROID READY</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-black text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[0.98] uppercase tracking-tight text-[#0A0A0A]">
              The Student Vault <br className="hidden sm:inline" />
              <span className="bg-[#1D4ED8] text-white px-2 py-0.5 inline-block mt-1 shadow-[4px_4px_0_0_#0A0A0A]">
                Mobile App
              </span>
            </h1>

            {/* Tagline */}
            <p className="mt-6 max-w-xl text-base sm:text-lg md:text-xl font-medium text-[#0A0A0A]/85 leading-relaxed">
              Designed for campus life. Calculate your daily allowance with the{' '}
              <strong className="underline decoration-[#1D4ED8] decoration-2">Daily Fuel Gauge</strong>, track local hangout spots, switch across 20 world currencies, and store funds in an encrypted biometric vault.
            </p>

            {/* High Impact Product Feature Chips */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-white px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_#0A0A0A]">
                <Flame size={14} className="text-amber-500" />
                <span>Daily Allowance Fuel Gauge</span>
              </span>
              <span className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-white px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_#0A0A0A]">
                <Coffee size={14} className="text-orange-600" />
                <span>1-Tap Campus Hangouts</span>
              </span>
              <span className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-white px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_#0A0A0A]">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>Face ID &amp; Biometrics</span>
              </span>
              <span className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-white px-3 py-1 text-xs font-bold shadow-[2px_2px_0_0_#0A0A0A]">
                <Zap size={14} className="text-emerald-600" />
                <span>20 Currencies</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* iOS Button */}
              <a
                href="#download"
                onClick={(e) => { if (onOpenDownload) { e.preventDefault(); onOpenDownload(); } }}
                className="group flex items-center justify-center gap-3 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-white px-6 py-4 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0_0_#1D4ED8] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1D4ED8] active:translate-y-0 active:shadow-none cursor-pointer"
              >
                <Apple size={20} className="transition-transform group-hover:scale-110" />
                <div className="text-left leading-none">
                  <div className="text-[9px] uppercase tracking-wider text-slate-300">Available on</div>
                  <div className="text-xs font-black tracking-normal mt-0.5">iOS App Store / TestFlight</div>
                </div>
              </a>

              {/* Android Button */}
              <a
                href="#download"
                onClick={(e) => { if (onOpenDownload) { e.preventDefault(); onOpenDownload(); } }}
                className="group flex items-center justify-center gap-3 border-2 border-[#0A0A0A] bg-[#1D4ED8] text-white px-6 py-4 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0_0_#0A0A0A] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0A0A0A] active:translate-y-0 active:shadow-none cursor-pointer"
              >
                <Smartphone size={20} className="transition-transform group-hover:scale-110" />
                <div className="text-left leading-none">
                  <div className="text-[9px] uppercase tracking-wider text-blue-200">Download for</div>
                  <div className="text-xs font-black tracking-normal mt-0.5">Android .AAB / APK</div>
                </div>
              </a>

              {/* QR Code Scan Trigger */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="flex items-center justify-center gap-2 border-2 border-[#0A0A0A] bg-white px-4 py-4 text-sm font-black uppercase tracking-wider shadow-[4px_4px_0_0_#0A0A0A] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0A0A0A] active:translate-y-0 active:shadow-none cursor-pointer"
                title="Scan QR Code to install"
              >
                <QrCode size={18} />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Store Release Status */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-bold text-[#0A0A0A]/70">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 size={14} />
                <span>Standalone .AAB &amp; APK Ready</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-blue-700">
                <Apple size={14} />
                <span>iOS 15.0+ Compatible (Native Cupertino)</span>
              </span>
            </div>

          </div>

          {/* Right Column: 3D Product Canvas & Interactive Phone Chassis */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* View Mode Switcher Pill */}
            <div className="mb-4 inline-flex items-center p-1 bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A]">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-[#0A0A0A] hover:bg-slate-100'
                }`}
              >
                <Box size={14} />
                <span>3D Device Model</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('device')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  viewMode === 'device'
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-[#0A0A0A] hover:bg-slate-100'
                }`}
              >
                <Layers size={14} />
                <span>Live UI Screens</span>
              </button>
            </div>

            {/* 3D Model Display */}
            {viewMode === '3d' ? (
              <div className="relative w-full max-w-[380px] bg-white border-2 border-[#0A0A0A] p-2 shadow-[6px_6px_0_0_#0A0A0A] flex flex-col items-center">
                <div className="w-full flex items-center justify-between px-3 py-1.5 border-b border-[#0A0A0A]/10 text-[10px] font-mono font-bold text-[#0A0A0A]/60">
                  <span className="flex items-center gap-1 text-blue-600">
                    <Box size={12} />
                    <span>THREE.JS WEBGL RENDERER</span>
                  </span>
                  <span>DRAG TO ROTATE 3D</span>
                </div>
                <ThreeProductScene className="w-full" />
                <div className="w-full text-center py-2 border-t border-[#0A0A0A]/10 bg-[#FAFAF8] text-[11px] font-bold text-[#0A0A0A]/70">
                  Titanium frame • Gyroscopic physics • Real-time lighting
                </div>
              </div>
            ) : (
              /* Physical iPhone 16 Pro Chassis */
              <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
                {/* Decorative shadow layer behind phone */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#0A0A0A] border-2 border-[#0A0A0A] pointer-events-none" />

                {/* Physical Phone Chassis */}
                <div className="relative bg-[#FAFAF8] border-2 border-[#0A0A0A] p-4 flex flex-col shadow-none">
                  
                  {/* Phone Speaker & Dynamic Island */}
                  <div className="flex items-center justify-between pb-3 border-b-2 border-[#0A0A0A]/15 text-[10px] font-mono font-bold text-[#0A0A0A]/70">
                    <span>9:41 AM</span>
                    <div className="h-4 w-24 bg-[#0A0A0A] rounded-full mx-auto flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-slate-800 ml-auto mr-2" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>100%</span>
                      <Zap size={10} className="text-amber-500 fill-amber-500" />
                    </div>
                  </div>

                  {/* Interactive Phone Tab Bar */}
                  <div className="mt-3 grid grid-cols-4 gap-1 p-1 bg-[#E7E5E4] border-2 border-[#0A0A0A]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('gauge')}
                      className={`py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                        activeTab === 'gauge' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-[#0A0A0A] hover:bg-white/50'
                      }`}
                    >
                      Fuel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('spots')}
                      className={`py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                        activeTab === 'spots' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-[#0A0A0A] hover:bg-white/50'
                      }`}
                    >
                      Spots
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('currencies')}
                      className={`py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                        activeTab === 'currencies' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-[#0A0A0A] hover:bg-white/50'
                      }`}
                    >
                      20 Curr
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      className={`py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                        activeTab === 'security' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-[#0A0A0A] hover:bg-white/50'
                      }`}
                    >
                      Vault
                    </button>
                  </div>

                  {/* Screen Content: Tab 1 - Fuel Gauge */}
                  {activeTab === 'gauge' && (
                    <div className="mt-3 space-y-3">
                      {/* Fuel Gauge Card */}
                      <div className="bg-[#FFFFFF] border-2 border-[#0A0A0A] p-4 shadow-[3px_3px_0_0_#0A0A0A]">
                        <div className="flex justify-between items-center text-xs font-mono font-bold text-[#0A0A0A]/70 uppercase">
                          <span>Safe Today</span>
                          <span className={`px-1.5 py-0.5 text-[10px] font-black uppercase border border-[#0A0A0A] ${
                            fuelPercent > 50 ? 'bg-[#86EFAC] text-[#065F46]' : fuelPercent > 20 ? 'bg-[#FDE047] text-[#854D0E]' : 'bg-[#FCA5A5] text-[#991B1B]'
                          }`}>
                            {fuelPercent}% Fuel
                          </span>
                        </div>

                        <div className="mt-2 text-3xl font-black text-[#0A0A0A] tracking-tight">
                          {formatAmount(safeToSpend)}
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="mt-3 h-3 w-full bg-[#E5E7EB] border border-[#0A0A0A] p-0.5">
                          <div
                            className={`h-full transition-all duration-300 ${
                              fuelPercent > 50 ? 'bg-[#22C55E]' : fuelPercent > 20 ? 'bg-[#EAB308]' : 'bg-[#EF4444]'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, fuelPercent))}%` }}
                          />
                        </div>

                        <div className="mt-3 flex justify-between text-[11px] font-mono text-[#0A0A0A]/70 border-t border-[#0A0A0A]/10 pt-2">
                          <span>Daily Pool: {formatAmount(dailyAllowance)}</span>
                          <span>Spent: {formatAmount(spentToday)}</span>
                        </div>
                      </div>

                      {/* Quick Log Buttons */}
                      <div className="bg-white border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0_0_#0A0A0A]">
                        <div className="text-[10px] font-mono font-bold uppercase text-[#0A0A0A]/70 mb-2">
                          Tap to Log Spot (Test Micro-Interaction):
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickLog('Timo Coffee', 3.5)}
                            className="flex items-center justify-between p-2 bg-[#FEF08A] border-2 border-[#0A0A0A] text-left hover:-translate-y-0.5 transition-all text-xs font-bold cursor-pointer active:translate-y-0"
                          >
                            <span>☕ Timo</span>
                            <span className="font-mono text-[11px]">-$3.50</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickLog('Campus Lunch', 8.0)}
                            className="flex items-center justify-between p-2 bg-[#BAE6FD] border-2 border-[#0A0A0A] text-left hover:-translate-y-0.5 transition-all text-xs font-bold cursor-pointer active:translate-y-0"
                          >
                            <span>🍱 Lunch</span>
                            <span className="font-mono text-[11px]">-$8.00</span>
                          </button>
                        </div>
                        {lastLoggedSpot && (
                          <div className="mt-2 text-center text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 py-1">
                            ✓ Logged {lastLoggedSpot}! Fuel recalculated.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Screen Content: Tab 2 - Spots */}
                  {activeTab === 'spots' && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-black uppercase text-[#0A0A0A] px-1">
                        Recent Campus Activity:
                      </div>
                      {recentLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white border-2 border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-[#FEF08A] border border-[#0A0A0A] text-[10px]">
                              📍
                            </div>
                            <div>
                              <div className="font-bold text-xs text-[#0A0A0A]">{log.name}</div>
                              <div className="text-[10px] font-mono text-[#0A0A0A]/60">{log.time}</div>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-black text-[#DC2626]">
                            -{formatAmount(log.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Screen Content: Tab 3 - Currencies */}
                  {activeTab === 'currencies' && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase text-[#0A0A0A]/70 px-1">
                        Select Display Currency:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto p-1">
                        {currencies.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => setSelectedCurrency(c)}
                            className={`p-2 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
                              selectedCurrency.code === c.code
                                ? 'bg-[#1D4ED8] text-white shadow-[2px_2px_0_0_#0A0A0A]'
                                : 'bg-white hover:bg-[#F3F1EA]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-black">{c.code}</span>
                              <span className="text-sm font-black">{c.symbol}</span>
                            </div>
                            <div className="text-[9px] truncate opacity-80 mt-0.5">{c.name}</div>
                          </button>
                        ))}
                      </div>

                      <div className="p-2 bg-white border-2 border-[#0A0A0A] text-[11px] font-mono">
                        Safe balance: <strong>{formatAmount(safeToSpend)}</strong>
                      </div>
                    </div>
                  )}

                  {/* Screen Content: Tab 4 - Security Vault */}
                  {activeTab === 'security' && (
                    <div className="mt-3 space-y-2.5">
                      <div className="bg-[#DCFCE7] border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0_0_#0A0A0A]">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#166534]">
                          <ShieldCheck size={14} />
                          <span>Encrypted Biometric Vault</span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-[#0A0A0A]">
                          Protected with Face ID &amp; 256-bit AES
                        </div>
                        <div className="mt-1 text-[11px] font-mono text-[#0A0A0A]/70">
                          Supabase RLS Enclave: Active
                        </div>
                      </div>

                      <div className="bg-white border-2 border-[#0A0A0A] p-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#1D4ED8]">
                          <Lock size={12} />
                          <span>Local-First SQLite</span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-[#0A0A0A] leading-relaxed">
                          Your money balance, receipts, and offline transactions stay in local encrypted storage. Zero third-party ad trackers.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Live Activity Feed Indicator */}
                  <div className="mt-3 pt-2.5 border-t-2 border-[#0A0A0A]/15 flex items-center justify-between text-[10px] font-mono text-[#0A0A0A]/70">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Native Flutter 3.47.8</span>
                    </span>
                    <span className="font-bold">Finovault Engine</span>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* QR Code Modal for Phone Camera Download */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-sm bg-white border-3 border-[#0A0A0A] p-6 shadow-[8px_8px_0_0_#0A0A0A]">
            <div className="flex justify-between items-center border-b-2 border-[#0A0A0A] pb-3 mb-4">
              <h3 className="font-black text-lg uppercase text-[#0A0A0A]">Scan to Install App</h3>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="text-lg font-black hover:text-[#DC2626] cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 bg-[#F3F1EA] border-2 border-[#0A0A0A]">
              {/* QR Image Graphic */}
              <div className="p-3 bg-white border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent('https://finovault.pro/download')}`}
                  alt="Scan to download Finovault"
                  className="w-44 h-44"
                />
              </div>
              <p className="mt-4 text-xs font-bold text-[#0A0A0A]">
                Point your iPhone or Android camera at the code to access the mobile download center.
              </p>
              <div className="mt-2 text-[10px] font-mono text-[#0A0A0A]/60">
                Supports iOS 15.0+ and Android 8.0+
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setQrModalOpen(false); if (onOpenDownload) onOpenDownload(); }}
              className="mt-3 w-full py-2.5 bg-[#1D4ED8] text-white text-xs font-black uppercase tracking-wider hover:bg-[#1E40AF] transition-colors cursor-pointer"
            >
              Select Device OS Now
            </button>
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="mt-2 w-full py-2.5 bg-[#0A0A0A] text-white text-xs font-black uppercase tracking-wider hover:bg-[#1D4ED8] transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
