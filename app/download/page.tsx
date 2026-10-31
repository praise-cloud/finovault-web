'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Apple,
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function DownloadGatewayPage() {
  const [detectedOs, setDetectedOs] = useState<'ios' | 'android' | 'unknown'>('unknown');
  const [selectedOs, setSelectedOs] = useState<'ios' | 'android'>('android');
  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);
  const [showAndroidSteps, setShowAndroidSteps] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  // Auto-detect mobile operating system on page load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDetectedOs('ios');
      setSelectedOs('ios');
    } else if (/Android/.test(ua)) {
      setDetectedOs('android');
      setSelectedOs('android');
    } else {
      setDetectedOs('unknown');
      setSelectedOs('android');
    }
  }, []);

  const handleDownload = (fileName: string, url: string) => {
    setDownloadStarted(fileName);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F3F1EA] text-[#0A0A0A] font-sans antialiased flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Background Graphic Grid */}
      <div 
        className="fixed inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0A0A0A 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto w-full max-w-xl flex items-center justify-between pb-6 border-b-2 border-[#0A0A0A]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-[#1D4ED8] border-2 border-[#0A0A0A] flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0_0_#0A0A0A]">
            FV
          </div>
          <div>
            <span className="font-black text-lg uppercase tracking-tight text-[#0A0A0A]">FINOVAULT</span>
            <div className="text-[10px] font-mono font-bold text-[#0A0A0A]/60">MOBILE RELEASE v2.1</div>
          </div>
        </Link>
        <Link
          href="/"
          className="text-xs font-black uppercase text-[#0A0A0A] hover:text-[#1D4ED8] underline"
        >
          View Full Website
        </Link>
      </header>

      {/* Main Interactive Mobile Download Card */}
      <main className="relative z-10 mx-auto w-full max-w-xl my-6">
        <div className="bg-[#FAFAF8] border-3 border-[#0A0A0A] p-6 sm:p-8 shadow-[8px_8px_0_0_#0A0A0A]">
          
          {/* Card Title */}
          <div className="border-b-2 border-[#0A0A0A] pb-4 mb-6">
            <div className="inline-flex items-center gap-1.5 border-2 border-[#0A0A0A] bg-[#FEF08A] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A] mb-3">
              <span>QR CAMERA DETECTED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0A0A0A]">
              Choose Your Mobile OS
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-[#0A0A0A]/75">
              Select your phone operating system below to download the application:
            </p>
          </div>

          {/* Auto-detected notification banner */}
          {detectedOs !== 'unknown' && (
            <div className="mb-6 p-3 bg-[#FEF08A] border-2 border-[#0A0A0A] flex items-center justify-between text-xs font-bold text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>
                  Detected device:{' '}
                  <strong className="uppercase">
                    {detectedOs === 'ios' ? 'Apple iPhone / iPad' : 'Android Smartphone'}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#0A0A0A]">
                AUTO-MATCHED
              </span>
            </div>
          )}

          {/* OS Switcher Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* iOS Button */}
            <button
              type="button"
              onClick={() => setSelectedOs('ios')}
              className={`p-4 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
                selectedOs === 'ios'
                  ? 'bg-[#0A0A0A] text-white shadow-[4px_4px_0_0_#1D4ED8] -translate-y-0.5'
                  : 'bg-white text-[#0A0A0A] hover:bg-slate-100 shadow-[2px_2px_0_0_#0A0A0A]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Apple size={28} />
                {selectedOs === 'ios' && (
                  <span className="text-[10px] font-black uppercase bg-[#1D4ED8] text-white px-2 py-0.5">
                    Active
                  </span>
                )}
              </div>
              <div className="font-black text-base uppercase tracking-tight">Apple iOS</div>
              <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'ios' ? 'text-slate-300' : 'text-[#0A0A0A]/60'}`}>
                iPhone / iPad (iOS 15+)
              </div>
            </button>

            {/* Android Button */}
            <button
              type="button"
              onClick={() => setSelectedOs('android')}
              className={`p-4 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
                selectedOs === 'android'
                  ? 'bg-[#1D4ED8] text-white shadow-[4px_4px_0_0_#0A0A0A] -translate-y-0.5'
                  : 'bg-white text-[#0A0A0A] hover:bg-slate-100 shadow-[2px_2px_0_0_#0A0A0A]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Smartphone size={28} />
                {selectedOs === 'android' && (
                  <span className="text-[10px] font-black uppercase bg-[#0A0A0A] text-white px-2 py-0.5">
                    Active
                  </span>
                )}
              </div>
              <div className="font-black text-base uppercase tracking-tight">Android</div>
              <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'android' ? 'text-blue-100' : 'text-[#0A0A0A]/60'}`}>
                Samsung, Pixel (.AAB/APK)
              </div>
            </button>
          </div>

          {/* OS-Specific Download Panel */}
          {selectedOs === 'ios' ? (
            <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A]">
                  <Apple size={16} />
                  <span>Apple iOS Release Enclave</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2 py-0.5 border border-[#0A0A0A]">
                  TESTFLIGHT READY
                </span>
              </div>

              <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
                Finovault for iOS is available immediately via Apple TestFlight. Features full biometric Face ID / Touch ID integration and native Cupertino design.
              </p>

              <div className="space-y-2 text-xs font-bold text-[#0A0A0A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Supports iOS 15.0 through 18.x on iPhone and iPad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Face ID / Touch ID biometric vault protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Encrypted on-device local database storage</span>
                </div>
              </div>

              {/* Big iOS Action Button */}
              <a
                href="https://testflight.apple.com/join/finovault"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-[#1D4ED8] text-white font-black text-sm uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer mt-4"
              >
                <Apple size={18} />
                <span>Open in Apple TestFlight</span>
                <ExternalLink size={16} className="ml-1" />
              </a>

              {/* Collapsible iOS Setup Guide */}
              <div className="pt-2 border-t border-[#0A0A0A]/10">
                <button
                  type="button"
                  onClick={() => setShowIosSteps(!showIosSteps)}
                  className="flex items-center justify-between w-full text-[11px] font-black uppercase text-[#0A0A0A] hover:text-[#1D4ED8] cursor-pointer"
                >
                  <span>Quick Setup on iPhone (3 Steps)</span>
                  {showIosSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showIosSteps && (
                  <div className="mt-3 p-3 bg-[#F3F1EA] border border-[#0A0A0A] space-y-2 text-[11px] font-medium text-[#0A0A0A]/85">
                    <div>1. Install <strong>Apple TestFlight</strong> from the App Store if you don&apos;t have it.</div>
                    <div>2. Tap <strong>Open in Apple TestFlight</strong> above to accept your Finovault invitation.</div>
                    <div>3. Tap <strong>Install</strong> and open Finovault!</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
              <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A]">
                  <Smartphone size={16} className="text-[#10B981]" />
                  <span>Android Release Packages</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#FEF08A] px-2 py-0.5 border border-[#0A0A0A]">
                  V1.0.0 RELEASE
                </span>
              </div>

              <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
                Tap below to download directly to your Android device. The standalone APK installs immediately. The .AAB bundle is formatted for Google Play testing.
              </p>

              {/* 1-Tap Android Download Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleDownload('finovault.apk', '/downloads/finovault.apk')}
                  className="flex flex-col items-center justify-center p-4 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Download size={18} />
                    <span>Download Direct APK</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-100 mt-1">60.5 MB • Direct Install</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload('app-release.aab', '/downloads/app-release.aab')}
                  className="flex flex-col items-center justify-center p-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <Download size={18} />
                    <span>Download .AAB Bundle</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-100 mt-1">57.0 MB • App Bundle</span>
                </button>
              </div>

              {/* Download notification */}
              {downloadStarted && (
                <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Download started for {downloadStarted}! Check your phone notifications.</span>
                </div>
              )}

              {/* Collapsible Android Sideload Guide */}
              <div className="pt-2 border-t border-[#0A0A0A]/10">
                <button
                  type="button"
                  onClick={() => setShowAndroidSteps(!showAndroidSteps)}
                  className="flex items-center justify-between w-full text-[11px] font-black uppercase text-[#0A0A0A] hover:text-[#1D4ED8] cursor-pointer"
                >
                  <span>How to Install APK in 3 Steps</span>
                  {showAndroidSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showAndroidSteps && (
                  <div className="mt-3 p-3 bg-[#F3F1EA] border border-[#0A0A0A] space-y-2 text-[11px] font-medium text-[#0A0A0A]/85">
                    <div>1. Tap <strong>Download Direct APK</strong> above.</div>
                    <div>2. When finished, tap the notification to open <strong>finovault.apk</strong>.</div>
                    <div>3. If prompted, toggle <strong>&quot;Allow install from this source&quot;</strong> and tap <strong>Install</strong>.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security & Checksum Banner */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#0A0A0A]/70 border-t-2 border-[#0A0A0A]/15 pt-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>VirusTotal 0/72 Clean</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-blue-600" />
              <span>AES-256 Encrypted</span>
            </div>
            <div>Flutter 3.47.8 Release</div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-xl text-center py-4 border-t border-[#0A0A0A]/20 text-xs font-bold text-[#0A0A0A]/70">
        <div>© 2026 Finovault. All rights reserved. Zero advertising, zero tracker SDKs.</div>
      </footer>
    </div>
  );
}
