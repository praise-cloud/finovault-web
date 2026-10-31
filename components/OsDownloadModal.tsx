'use client';

import React, { useState, useEffect } from 'react';
import {
  Apple,
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';

interface OsDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OsDownloadModal({ isOpen, onClose }: OsDownloadModalProps) {
  const [detectedOs, setDetectedOs] = useState<'ios' | 'android' | 'unknown'>('unknown');
  const [selectedOs, setSelectedOs] = useState<'ios' | 'android'>('android');
  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);
  const [showAndroidSteps, setShowAndroidSteps] = useState(false);

  // Auto-detect mobile OS from userAgent on mount
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

  if (!isOpen) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#FAFAF8] border-3 border-[#0A0A0A] p-6 sm:p-8 shadow-[8px_8px_0_0_#0A0A0A] max-h-[90vh] overflow-y-auto">
        
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-[#1D4ED8] border-2 border-[#0A0A0A] flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0_0_#0A0A0A]">
              FV
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">
                Select Your Mobile OS
              </h2>
              <p className="text-[11px] font-mono font-bold text-[#0A0A0A]/60">
                FINOVAULT APP DISTRIBUTION GATE
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border-2 border-[#0A0A0A] bg-white hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Auto-detected notification banner */}
        {detectedOs !== 'unknown' && (
          <div className="mb-6 p-3 bg-[#FEF08A] border-2 border-[#0A0A0A] flex items-center justify-between text-xs font-bold text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                Detected device:{' '}
                <strong className="uppercase">
                  {detectedOs === 'ios' ? 'Apple iOS (iPhone/iPad)' : 'Android Smartphone'}
                </strong>
              </span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-[#0A0A0A]">
              AUTO-MATCH
            </span>
          </div>
        )}

        {/* OS Selection Toggle Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* iOS Selector Card */}
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
                  Selected
                </span>
              )}
            </div>
            <div className="font-black text-base uppercase tracking-tight">Apple iOS</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'ios' ? 'text-slate-300' : 'text-[#0A0A0A]/60'}`}>
              iPhone &amp; iPad (iOS 15+)
            </div>
          </button>

          {/* Android Selector Card */}
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
                  Selected
                </span>
              )}
            </div>
            <div className="font-black text-base uppercase tracking-tight">Android</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'android' ? 'text-blue-100' : 'text-[#0A0A0A]/60'}`}>
              Samsung, Pixel, etc. (.AAB/APK)
            </div>
          </button>
        </div>

        {/* Selected OS Details & Action Area */}
        {selectedOs === 'ios' ? (
          <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A] border-b border-[#0A0A0A]/15 pb-2">
              <Apple size={16} />
              <span>iOS Installation via Apple TestFlight</span>
            </div>

            <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
              Finovault for iOS is available immediately through the official Apple TestFlight program. Full support for Face ID, Dynamic Island, and offline encrypted storage.
            </p>

            <div className="space-y-2 text-xs font-bold text-[#0A0A0A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Compatible with iOS 15.0 through 18.x</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Native Face ID and Touch ID biometric encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Zero app store review waiting period</span>
              </div>
            </div>

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

            <div className="text-[11px] font-mono text-[#0A0A0A]/60 text-center">
              Requires the free Apple TestFlight app from App Store
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A]">
                <Smartphone size={16} className="text-[#10B981]" />
                <span>Android Standalone Packages</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#FEF08A] px-2 py-0.5 border border-[#0A0A0A]">
                V1.0.0 RELEASE
              </span>
            </div>

            <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
              Choose your preferred installation format. The standalone APK installs directly on any Android phone. The .AAB bundle is formatted for Google Play deployment.
            </p>

            {/* Android 1-Tap Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDownload('finovault.apk', '/downloads/finovault.apk')}
                className="flex flex-col items-center justify-center p-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Download size={16} />
                  <span>Download Direct APK</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-100 mt-1">60.5 MB • Direct Install</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload('app-release.aab', '/downloads/app-release.aab')}
                className="flex flex-col items-center justify-center p-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Download size={16} />
                  <span>Download .AAB Bundle</span>
                </div>
                <span className="text-[10px] font-mono text-blue-100 mt-1">57.0 MB • App Bundle</span>
              </button>
            </div>

            {/* Download started banner */}
            {downloadStarted && (
              <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Download started for {downloadStarted}! Check your browser downloads.</span>
              </div>
            )}

            {/* Sideload guide toggle */}
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
                  <div>2. When finished, tap the download notification to open <strong>finovault.apk</strong>.</div>
                  <div>3. If prompted, toggle <strong>&quot;Allow install from this source&quot;</strong> and tap <strong>Install</strong>.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-[11px] font-mono text-[#0A0A0A]/60 border-t-2 border-[#0A0A0A]/15 pt-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>SHA-256 Verified Clean</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold uppercase text-[#0A0A0A] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
