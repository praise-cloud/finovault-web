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
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Sliders,
  ChevronRight,
  ArrowDown,
} from 'lucide-react';

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

export function Hero() {
  // Interactive Phone Simulator State
  const [activeTab, setActiveTab] = useState<'gauge' | 'spots' | 'currencies' | 'coach'>('gauge');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [spentToday, setSpentToday] = useState(12.5);
  const [dailyAllowance] = useState(35.0);
  const [recentLogs, setRecentLogs] = useState<Array<{ name: string; amount: number; time: string; spot: string }>>([
    { name: 'Timo Coffee', amount: 3.5, time: '10:15 AM', spot: 'Campus Timo' },
    { name: 'Cascavelle Lunch', amount: 8.0, time: '1:30 PM', spot: 'Food Court' },
  ]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [lastLoggedSpot, setLastLoggedSpot] = useState<string | null>(null);

  const sha256 = 'DA776A745AD3D80D4D9A4073BFBD22DD55F2B7D30E0AFC3730350C2846F0B814';

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

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 bg-[#F3F1EA] text-[#0A0A0A] border-b-2 border-[#0A0A0A]">
      {/* Background Graphic Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0A0A0A 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Value Proposition, Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A] mb-6">
              <Sparkles size={14} className="text-[#0A0A0A]" />
              <span>OFFLINE-FIRST STUDENT VAULT • 20 WORLD CURRENCIES</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.02] tracking-tight uppercase text-[#0A0A0A]">
              BUDGET SMART.<br />
              <span className="bg-[#2563EB] text-white px-2 py-0.5 inline-block shadow-[4px_4px_0_0_#0A0A0A] -rotate-1 transform">
                SPEND FREE.
              </span><br />
              NEVER RUN DRY.
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg font-medium text-[#0A0A0A]/85 max-w-xl leading-relaxed">
              The high-contrast Neo-Brutalist finance app designed for student life. Track daily allowances with the 
              <strong> Live Fuel Gauge</strong>, 1-tap log campus hangouts at <strong>Timo & Cascavelle</strong>, and celebrate semester milestones with <strong>Vault Wraps</strong>.
            </p>

            {/* Highlight Badges */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg text-xs font-mono font-bold">
              <div className="flex items-center gap-2 bg-white p-2.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
                <Flame size={16} className="text-amber-500 shrink-0" />
                <span>Daily Fuel Gauge</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
                <Coffee size={16} className="text-indigo-600 shrink-0" />
                <span>Campus Hotspots</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2.5 border-2 border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>100% Light Mode</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full">
              {/* Primary APK Download */}
              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                className="inline-flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm uppercase tracking-wider px-7 py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <Download size={18} strokeWidth={2.5} />
                <span>Download Android APK</span>
                <span className="bg-[#0A0A0A] text-white text-[11px] px-2 py-0.5 font-mono">v1.0 • 57.7MB</span>
              </a>

              {/* QR Code Trigger */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1EA] text-[#0A0A0A] font-black text-sm uppercase tracking-wider px-5 py-4 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <QrCode size={18} />
                <span>Scan QR</span>
              </button>
            </div>

            {/* SHA-256 Checksum Pill */}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#0A0A0A]/70 bg-white/80 border border-[#0A0A0A]/30 p-2.5 max-w-xl">
              <span className="font-bold text-[#0A0A0A]">SHA-256:</span>
              <span className="truncate max-w-[220px] sm:max-w-xs">{sha256}</span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase bg-[#0A0A0A] text-white px-2 py-1 hover:bg-[#2563EB] transition-colors cursor-pointer"
              >
                {copiedHash ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedHash ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Store Release Status */}
            <div className="mt-4 flex items-center gap-4 text-xs font-bold text-[#0A0A0A]/70">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Direct Sideload Ready</span>
              </span>
              <span>•</span>
              <span>Google Play & iOS TestFlight in Review</span>
            </div>

          </div>

          {/* Right Column: Interactive Phone Mockup with Micro-Interactions */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
              
              {/* Decorative shadow layer behind phone */}
              <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#0A0A0A] border-2 border-[#0A0A0A] pointer-events-none" />

              {/* Physical Phone Chassis */}
              <div className="relative bg-[#FAFAF8] border-2 border-[#0A0A0A] p-4 flex flex-col shadow-none">
                
                {/* Phone Speaker & Camera Notch */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#0A0A0A]/15 text-[10px] font-mono font-bold text-[#0A0A0A]/70">
                  <span>9:41 AM</span>
                  <div className="h-3 w-16 bg-[#0A0A0A] rounded-full mx-auto" />
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
                    onClick={() => setActiveTab('coach')}
                    className={`py-1 text-[10px] font-black uppercase transition-all cursor-pointer ${
                      activeTab === 'coach' ? 'bg-[#0A0A0A] text-white shadow-sm' : 'text-[#0A0A0A] hover:bg-white/50'
                    }`}
                  >
                    Wrap
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
                          {fuelPercent > 50 ? '● IN THE GREEN' : fuelPercent > 20 ? '▲ CAUTION' : '■ CRITICAL'}
                        </span>
                      </div>
                      <div className="mt-2 text-3xl font-black text-[#0A0A0A] tracking-tight">
                        {formatAmount(safeToSpend)}
                      </div>
                      
                      {/* Fuel Meter Bar */}
                      <div className="mt-3 h-4 bg-[#E5E7EB] border-2 border-[#0A0A0A] overflow-hidden relative">
                        <div
                          className={`h-full transition-all duration-300 ${
                            fuelPercent > 50 ? 'bg-[#10B981]' : fuelPercent > 20 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'
                          }`}
                          style={{ width: `${fuelPercent}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[10px] font-mono font-bold text-[#0A0A0A]/60">
                        <span>Spent: {formatAmount(spentToday)}</span>
                        <span>Daily Pool: {formatAmount(dailyAllowance)}</span>
                      </div>
                    </div>

                    {/* Interactive Spend Adjustment Slider */}
                    <div className="bg-[#FEF9C3] border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0_0_#0A0A0A]">
                      <div className="flex justify-between text-[11px] font-black uppercase">
                        <span className="flex items-center gap-1">
                          <Sliders size={12} />
                          <span>Simulate Spend:</span>
                        </span>
                        <span>{formatAmount(spentToday)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="1"
                        value={spentToday}
                        onChange={(e) => setSpentToday(parseFloat(e.target.value))}
                        className="w-full mt-2 accent-[#0A0A0A] cursor-pointer"
                      />
                    </div>

                    {/* Quick Logging Pills */}
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0A0A0A]/70">
                        Tap To Log Campus Spot:
                      </span>
                      <div className="mt-1.5 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuickLog('Timo Coffee', 3.5)}
                          className="flex items-center justify-between p-2 bg-white border-2 border-[#0A0A0A] text-left hover:bg-[#F3F4F6] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <span className="text-xs font-bold truncate">☕ Timo</span>
                          <span className="text-[11px] font-mono font-black text-[#2563EB]">+{formatAmount(3.5)}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLog('Cascavelle', 8.0)}
                          className="flex items-center justify-between p-2 bg-white border-2 border-[#0A0A0A] text-left hover:bg-[#F3F4F6] active:translate-y-0.5 transition-transform cursor-pointer"
                        >
                          <span className="text-xs font-bold truncate">🍔 Cascavelle</span>
                          <span className="text-[11px] font-mono font-black text-[#2563EB]">+{formatAmount(8.0)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Screen Content: Tab 2 - Spots */}
                {activeTab === 'spots' && (
                  <div className="mt-3 space-y-2.5">
                    <div className="p-2.5 bg-[#EFF6FF] border-2 border-[#0A0A0A]">
                      <span className="text-[10px] font-black uppercase text-[#1D4ED8]">
                        Campus Frequent Spots
                      </span>
                      <p className="text-xs font-bold text-[#0A0A0A] mt-0.5">
                        One-tap logging without typing numbers
                      </p>
                    </div>

                    {[
                      { name: 'Timo Coffee', category: 'Coffee & Drinks', avg: 3.5, visits: 22 },
                      { name: 'Cascavelle Mall', category: 'Lunch & Groceries', avg: 8.5, visits: 14 },
                      { name: 'Campus Mart', category: 'Supplies', avg: 4.2, visits: 9 },
                    ].map((spot) => (
                      <div
                        key={spot.name}
                        className="bg-white border-2 border-[#0A0A0A] p-2.5 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
                      >
                        <div>
                          <div className="text-xs font-black uppercase">{spot.name}</div>
                          <div className="text-[10px] font-mono text-[#0A0A0A]/60">
                            {spot.visits} visits • avg {formatAmount(spot.avg)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickLog(spot.name, spot.avg)}
                          className="bg-[#0A0A0A] hover:bg-[#2563EB] text-white text-[10px] font-black uppercase px-2.5 py-1.5 border border-[#0A0A0A] cursor-pointer"
                        >
                          Log
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Screen Content: Tab 3 - 20 Currencies Switcher */}
                {activeTab === 'currencies' && (
                  <div className="mt-3 space-y-2.5">
                    <div className="p-2 bg-[#FEF08A] border-2 border-[#0A0A0A]">
                      <span className="text-[10px] font-black uppercase text-[#0A0A0A]">
                        Active Currency: {selectedCurrency.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setSelectedCurrency(c)}
                          className={`p-2 border-2 text-left transition-all cursor-pointer ${
                            selectedCurrency.code === c.code
                              ? 'bg-[#2563EB] text-white border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]'
                              : 'bg-white text-[#0A0A0A] border-[#0A0A0A] hover:bg-[#F3F4F6]'
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

                {/* Screen Content: Tab 4 - Wrap & Coach */}
                {activeTab === 'coach' && (
                  <div className="mt-3 space-y-2.5">
                    <div className="bg-[#DCFCE7] border-2 border-[#0A0A0A] p-3 shadow-[2px_2px_0_0_#0A0A0A]">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#166534]">
                        <Sparkles size={14} />
                        <span>Semester Vault Wrap</span>
                      </div>
                      <div className="mt-1 text-xs font-bold text-[#0A0A0A]">
                        🎉 You saved <strong>{formatAmount(142.50)}</strong> this cycle!
                      </div>
                      <div className="mt-1 text-[11px] font-mono text-[#0A0A0A]/70">
                        Top hangout: <strong>Timo Coffee</strong> (22 visits)
                      </div>
                    </div>

                    <div className="bg-white border-2 border-[#0A0A0A] p-3">
                      <div className="text-[10px] font-black uppercase text-[#2563EB]">
                        AI Money Coach
                      </div>
                      <p className="mt-1 text-xs font-medium text-[#0A0A0A] leading-relaxed">
                        &quot;You&apos;re staying in the green 5 days in a row! You can comfortably grab lunch at Cascavelle today without denting your Friday stash.&quot;
                      </p>
                    </div>
                  </div>
                )}

                {/* Live Activity Feed Indicator */}
                <div className="mt-3 pt-2.5 border-t-2 border-[#0A0A0A]/15 flex items-center justify-between text-[10px] font-mono text-[#0A0A0A]/70">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Instant Local SQLite</span>
                  </span>
                  <span className="font-bold">Finovault Engine</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-[#F3F1EA] border-2 border-[#0A0A0A] p-6 max-w-sm w-full shadow-[8px_8px_0_0_#0A0A0A]">
            <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-3 mb-4">
              <span className="font-black text-sm uppercase">Scan To Download APK</span>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="font-black text-sm p-1 hover:bg-black/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* High-Contrast SVG QR Pattern */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A]">
                <svg
                  className="w-48 h-48"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="100" height="100" fill="white" />
                  {/* Position detection squares */}
                  <rect x="5" y="5" width="26" height="26" fill="black" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" fill="black" />

                  <rect x="69" y="5" width="26" height="26" fill="black" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" fill="black" />

                  <rect x="5" y="69" width="26" height="26" fill="black" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" fill="black" />

                  {/* QR Data Matrix simulation */}
                  <rect x="36" y="8" width="5" height="5" fill="black" />
                  <rect x="46" y="8" width="5" height="5" fill="black" />
                  <rect x="56" y="8" width="5" height="5" fill="black" />
                  <rect x="36" y="18" width="5" height="5" fill="black" />
                  <rect x="50" y="18" width="5" height="5" fill="black" />
                  <rect x="8" y="36" width="5" height="5" fill="black" />
                  <rect x="18" y="36" width="5" height="5" fill="black" />
                  <rect x="28" y="36" width="5" height="5" fill="black" />
                  <rect x="38" y="36" width="5" height="5" fill="black" />
                  <rect x="48" y="36" width="5" height="5" fill="black" />
                  <rect x="68" y="36" width="5" height="5" fill="black" />
                  <rect x="78" y="36" width="5" height="5" fill="black" />
                  <rect x="88" y="36" width="5" height="5" fill="black" />
                  <rect x="8" y="46" width="5" height="5" fill="black" />
                  <rect x="28" y="46" width="5" height="5" fill="black" />
                  <rect x="48" y="46" width="5" height="5" fill="black" />
                  <rect x="68" y="46" width="5" height="5" fill="black" />
                  <rect x="88" y="46" width="5" height="5" fill="black" />
                  <rect x="36" y="56" width="5" height="5" fill="black" />
                  <rect x="46" y="56" width="5" height="5" fill="black" />
                  <rect x="56" y="56" width="5" height="5" fill="black" />
                  <rect x="76" y="56" width="5" height="5" fill="black" />
                  <rect x="36" y="66" width="5" height="5" fill="black" />
                  <rect x="46" y="66" width="5" height="5" fill="black" />
                  <rect x="66" y="66" width="5" height="5" fill="black" />
                  <rect x="86" y="66" width="5" height="5" fill="black" />
                  <rect x="36" y="76" width="5" height="5" fill="black" />
                  <rect x="56" y="76" width="5" height="5" fill="black" />
                  <rect x="76" y="76" width="5" height="5" fill="black" />
                  <rect x="46" y="86" width="5" height="5" fill="black" />
                  <rect x="66" y="86" width="5" height="5" fill="black" />
                  <rect x="86" y="86" width="5" height="5" fill="black" />
                </svg>
              </div>

              <p className="mt-4 text-xs font-bold text-center text-[#0A0A0A]">
                Point your phone camera to download <strong>finovault.apk</strong> directly.
              </p>

              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                className="mt-4 w-full text-center bg-[#2563EB] text-white py-2.5 font-black text-xs uppercase border-2 border-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]"
              >
                Direct Download (57.7MB)
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
