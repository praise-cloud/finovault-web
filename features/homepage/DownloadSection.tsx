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
} from 'lucide-react';

export function DownloadSection() {
  const [copiedHash, setCopiedHash] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
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
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 border-2 border-[#0A0A0A] bg-[#FEF08A] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <Download size={14} />
            <span>DIRECT APPLICATION DISTRIBUTION</span>
          </div>
          <h2 className="mt-4 font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#0A0A0A]">
            Download Finovault Mobile
          </h2>
          <p className="mt-4 text-base sm:text-lg font-medium text-[#0A0A0A]/80 leading-relaxed">
            Get the standalone release APK directly without waiting for store reviews. Clean, signed, and ready to install on any Android 8.0+ device.
          </p>
        </div>

        {/* Download Grid */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Download Card */}
          <div className="lg:col-span-8 bg-[#FAFAF8] border-2 border-[#0A0A0A] p-6 sm:p-8 shadow-[6px_6px_0_0_#0A0A0A]">
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0A0A0A] pb-5 mb-6 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#10B981] border-2 border-[#0A0A0A] text-white shadow-[2px_2px_0_0_#0A0A0A]">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl sm:text-2xl uppercase tracking-tight text-[#0A0A0A]">
                    Android Release Package
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#0A0A0A]/60">
                    PACKAGE: <code>finovault.apk</code> • VERSION 1.0.0
                  </div>
                </div>
              </div>
              <div className="bg-[#FEF08A] border-2 border-[#0A0A0A] px-3 py-1 text-xs font-mono font-black text-[#0A0A0A]">
                RELEASE BUILD
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                <span className="text-[#0A0A0A]/60">SIZE:</span>
                <div className="font-bold text-sm text-[#0A0A0A]">57.7 MB</div>
              </div>
              <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                <span className="text-[#0A0A0A]/60">TARGET:</span>
                <div className="font-bold text-sm text-[#0A0A0A]">Android 8.0+</div>
              </div>
              <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                <span className="text-[#0A0A0A]/60">ARCHITECTURE:</span>
                <div className="font-bold text-sm text-[#0A0A0A]">Universal APK</div>
              </div>
              <div className="bg-white border-2 border-[#0A0A0A] p-2.5">
                <span className="text-[#0A0A0A]/60">OFFLINE:</span>
                <div className="font-bold text-sm text-emerald-600">SQLite Ready</div>
              </div>
            </div>

            {/* Big Download Button */}
            <div className="mt-6">
              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                className="w-full flex items-center justify-center gap-3 bg-[#10B981] hover:bg-[#059669] text-white font-black text-base uppercase tracking-wider py-4 border-2 border-[#0A0A0A] shadow-[4px_4px_0_0_#0A0A0A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                <Download size={22} strokeWidth={2.5} />
                <span>Download Android APK (Direct Link)</span>
                <span className="bg-[#0A0A0A] text-white text-xs px-2 py-0.5 font-mono">57.7MB</span>
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

            {/* Collapsible Sideload Instructions */}
            <div className="mt-6 border-t-2 border-[#0A0A0A]/15 pt-4">
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="flex items-center justify-between w-full text-xs font-black uppercase text-[#0A0A0A] hover:text-[#2563EB] cursor-pointer"
              >
                <span>How to Install the APK on Your Android Phone</span>
                {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showInstructions && (
                <div className="mt-4 p-4 bg-[#F3F1EA] border-2 border-[#0A0A0A] space-y-3 text-xs font-medium text-[#0A0A0A]/85">
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">1</span>
                    <span>Tap <strong>Download Android APK</strong> above on your phone browser.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">2</span>
                    <span>When download finishes, tap the notification or open your Downloads folder to tap <strong>finovault.apk</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">3</span>
                    <span>If Android displays <em>&quot;Install unknown apps&quot;</em> prompt, tap <strong>Settings</strong> and toggle <strong>&quot;Allow from this source&quot;</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-black bg-[#0A0A0A] text-white px-1.5 py-0.2 font-mono">4</span>
                    <span>Tap <strong>Install</strong> and then open <strong>Finovault</strong>!</span>
                  </div>
                </div>
              )}
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
                  <span>VirusTotal: 0 / 72 Detections</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>No intrusive permissions requested</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>AES Encrypted Local Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>106 Flutter unit & a11y tests passing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                  <span>31 BFF backend integration tests passing</span>
                </div>
              </div>
            </div>

            {/* Apple & Google Play Status */}
            <div className="bg-white border-2 border-[#0A0A0A] p-6 shadow-[5px_5px_0_0_#0A0A0A]">
              <h4 className="font-black text-sm uppercase text-[#0A0A0A] border-b-2 border-[#0A0A0A] pb-2 mb-3">
                App Stores & TestFlight
              </h4>
              <p className="text-xs font-medium text-[#0A0A0A]/70 leading-relaxed">
                Finovault is currently undergoing review for the Google Play Store and Apple App Store TestFlight.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/30 flex items-center justify-between text-xs font-mono">
                  <span>Google Play Beta</span>
                  <span className="text-amber-600 font-bold uppercase">In Review</span>
                </div>
                <div className="p-2.5 bg-[#F3F4F6] border border-[#0A0A0A]/30 flex items-center justify-between text-xs font-mono">
                  <span>Apple TestFlight</span>
                  <span className="text-amber-600 font-bold uppercase">Pending</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
