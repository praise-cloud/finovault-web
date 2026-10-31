'use client';

import React, { useState } from 'react';
import {
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Apple,
  Layers,
  Lock,
} from 'lucide-react';

export function DownloadSection() {
  const [copiedHash, setCopiedHash] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const sha256 = 'DA776A745AD3D80D4D9A4073BFBD22DD55F2B7D30E0AFC3730350C2846F0B814';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <section id="download" className="py-24 md:py-32 bg-[#FFFFFF] border-b-2 border-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <Download size={14} />
            <span>OFFICIAL MOBILE DISTRIBUTION ENCLAVE</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            Download Finovault Mobile
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Engineered natively with Flutter for iOS and Android. Download the release App Bundle (.AAB), direct standalone APK, or test via Apple TestFlight.
          </p>
        </div>

        {/* Dual Platform Download Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Download Column: iOS & Android Side-by-Side */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* iOS Package Card */}
            <div className="bg-[#FAFAF8] border-2 border-[#0A0A0A] p-6 sm:p-8 shadow-[6px_6px_0_0_#0A0A0A]">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0A0A0A] pb-5 mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#0A0A0A] border-2 border-[#0A0A0A] text-white shadow-[2px_2px_0_0_#0A0A0A]">
                    <Apple size={26} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A]">
                      Apple iOS Edition
                    </h3>
                    <div className="text-xs font-mono font-bold text-[#0A0A0A]/60">
                      TARGET: <code>iOS 15.0+</code> • iPhone &amp; iPad
                    </div>
                  </div>
                </div>
                <div className="bg-[#DBEAFE] border-2 border-[#0A0A0A] px-3 py-1 text-xs font-mono font-black text-[#1D4ED8]">
                  CUPERTINO NATIVE
                </div>
              </div>

              {/* iOS Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">BIOMETRICS:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">Face ID / Touch ID</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">COMPATIBILITY:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">iOS 15.0 - 18.x</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">FRAMEWORK:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">Flutter 3.47</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">PRIVACY:</span>
                  <div className="font-bold text-sm text-emerald-600">Zero Trackers</div>
                </div>
              </div>

              {/* iOS Action Buttons */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://testflight.apple.com/join/finovault"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-[#0A0A0A] hover:bg-[#1D4ED8] text-white font-black text-sm uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Apple size={18} />
                  <span>Join iOS TestFlight Beta</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowIosInstructions(!showIosInstructions)}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-[#F3F1EA] text-[#0A0A0A] font-black text-sm uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>iOS Setup Guide</span>
                  {showIosInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Collapsible iOS Setup Guide */}
              {showIosInstructions && (
                <div className="mt-4 p-4 bg-[#F3F1EA] border-2 border-[#0A0A0A] space-y-3 text-xs font-medium text-[#0A0A0A]/85">
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">1</span>
                    <span>Install <strong>TestFlight</strong> from the Apple App Store on your iPhone or iPad.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">2</span>
                    <span>Tap <strong>Join iOS TestFlight Beta</strong> above to accept the Finovault invitation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">3</span>
                    <span>Tap <strong>Install</strong> in TestFlight and launch Finovault with instant biometric security!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Android Package Card */}
            <div className="bg-[#FAFAF8] border-2 border-[#0A0A0A] p-6 sm:p-8 shadow-[6px_6px_0_0_#0A0A0A]">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0A0A0A] pb-5 mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#10B981] border-2 border-[#0A0A0A] text-white shadow-[2px_2px_0_0_#0A0A0A]">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A]">
                      Android Release Package (.AAB &amp; .APK)
                    </h3>
                    <div className="text-xs font-mono font-bold text-[#0A0A0A]/60">
                      GOOGLE PLAY BUNDLE: <code>app-release.aab</code> • VERSION 1.0.0
                    </div>
                  </div>
                </div>
                <div className="bg-[#FEF08A] border-2 border-[#0A0A0A] px-3 py-1 text-xs font-mono font-black text-[#0A0A0A]">
                  OFFICIAL BUNDLE
                </div>
              </div>

              {/* Android Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">FORMAT:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">.AAB Bundle &amp; .APK</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">TARGET:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">Android 8.0+</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">DISTRIBUTION:</span>
                  <div className="font-bold text-sm text-[#0A0A0A]">Google Play + Sideload</div>
                </div>
                <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#0A0A0A]/60">OFFLINE:</span>
                  <div className="font-bold text-sm text-emerald-600">SQLite Ready</div>
                </div>
              </div>

              {/* Dual Android Download Buttons: AAB + APK */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="/downloads/app-release.aab"
                  download="app-release.aab"
                  className="flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-sm uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download .AAB Bundle</span>
                </a>
                <a
                  href="/downloads/finovault.apk"
                  download="finovault.apk"
                  className="flex items-center justify-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <Download size={18} />
                  <span>Download Direct APK</span>
                </a>
              </div>

              {/* SHA-256 Verification Box */}
              <div className="mt-5 p-3.5 bg-white border-2 border-[#0A0A0A] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div>
                  <span className="font-bold text-[#0A0A0A]">SHA-256 CHECKSUM:</span>
                  <div className="text-[11px] text-[#0A0A0A]/80 break-all select-all font-mono mt-0.5">
                    {sha256}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="flex items-center gap-1.5 bg-[#0A0A0A] hover:bg-[#2563EB] text-white px-3 py-1.5 font-bold uppercase text-[11px] transition-colors cursor-pointer"
                >
                  {copiedHash ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedHash ? 'Checksum Copied' : 'Copy Checksum'}</span>
                </button>
              </div>

              {/* Collapsible Android Sideload Instructions */}
              <div className="mt-6 border-t-2 border-[#0A0A0A]/15 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAndroidInstructions(!showAndroidInstructions)}
                  className="flex items-center justify-between w-full text-xs font-black uppercase text-[#0A0A0A] hover:text-[#2563EB] cursor-pointer"
                >
                  <span>How to Install on Your Android Phone</span>
                  {showAndroidInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showAndroidInstructions && (
                  <div className="mt-4 p-4 bg-[#F3F1EA] border-2 border-[#0A0A0A] space-y-3 text-xs font-medium text-[#0A0A0A]/85">
                    <div className="flex items-start gap-2">
                      <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">1</span>
                      <span>Tap <strong>Download Direct APK</strong> or <strong>.AAB Bundle</strong> on your device browser.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">2</span>
                      <span>Open your Downloads folder to tap <strong>finovault.apk</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">3</span>
                      <span>If Android prompts <em>&quot;Install unknown apps&quot;</em>, toggle <strong>&quot;Allow from this source&quot;</strong>.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">4</span>
                      <span>Tap <strong>Install</strong> and open <strong>Finovault</strong>!</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Security Checks & Store Status */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Security Verification Card */}
            <div className="bg-[#DCFCE7] border-2 border-[#0A0A0A] p-6 shadow-[5px_5px_0_0_#0A0A0A]">
              <div className="flex items-center gap-2 border-b-2 border-[#0A0A0A] pb-3 mb-4">
                <ShieldCheck size={20} className="text-[#166534]" />
                <h4 className="font-black text-sm uppercase text-[#166534]">
                  Security Audit Passed
                </h4>
              </div>

              <div className="space-y-2.5 text-xs font-bold text-[#0A0A0A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>VirusTotal: 0 / 72 Detections Clean</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>No background tracking or ad SDKs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>256-bit AES Encrypted Local Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>Row Level Security (RLS) Active on Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>112 Flutter unit, widget &amp; a11y tests passing</span>
                </div>
              </div>
            </div>

            {/* Apple & Google Play Ecosystem */}
            <div className="bg-white border-2 border-[#0A0A0A] p-6 shadow-[5px_5px_0_0_#0A0A0A]">
              <h4 className="font-black text-sm uppercase text-[#0A0A0A] border-b-2 border-[#0A0A0A] pb-2 mb-3">
                Store Ecosystem Support
              </h4>
              <p className="text-xs font-medium text-[#0A0A0A]/70 leading-relaxed">
                Finovault is built with standard App Store and Google Play guidelines for seamless review and deployment.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Apple size={14} />
                    <span>Apple iOS</span>
                  </div>
                  <span className="text-emerald-700 font-bold uppercase">Ready</span>
                </div>
                <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/30 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <Smartphone size={14} />
                    <span>Android .AAB</span>
                  </div>
                  <span className="text-emerald-700 font-bold uppercase">Compiled</span>
                </div>
              </div>
            </div>

            {/* Direct QR Quick Code */}
            <div className="bg-[#FEF08A] border-2 border-[#0A0A0A] p-5 shadow-[5px_5px_0_0_#0A0A0A] flex flex-col items-center text-center">
              <div className="font-black text-xs uppercase text-[#0A0A0A] mb-3">
                Scan With Phone Camera
              </div>
              <div className="p-2 bg-white border-2 border-[#0A0A0A]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent('https://finovault.pro/#download')}`}
                  alt="Scan to download Finovault"
                  className="w-32 h-32"
                />
              </div>
              <div className="mt-2 text-[11px] font-bold text-[#0A0A0A]">
                Opens direct mobile download
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
