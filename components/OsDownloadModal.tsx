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
  Lock,
  ArrowDownToLine,
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

  const handleTriggerDownload = (fileName: string, url: string) => {
    setDownloadStarted(fileName);
    // Use window.location to trigger native file download stream without navigation
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.setAttribute('target', '_self');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_) {
      window.location.href = url;
    }
    setTimeout(() => setDownloadStarted(null), 6000);
  };

  const handleSelectOs = (os: 'ios' | 'android') => {
    setSelectedOs(os);
    if (os === 'android') {
      // Immediately start downloading the APK when Android is selected
      handleTriggerDownload('finovault.apk', '/downloads/finovault.apk');
    } else if (os === 'ios') {
      // Trigger iOS OTA or TestFlight
      if (typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.location.href = 'itms-services://?action=download-manifest&url=https://finovault.pro/downloads/manifest.plist';
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-lg bg-[#FAFAF8] border-3 border-[#0A0A0A] p-6 sm:p-8 shadow-[8px_8px_0_0_#0A0A0A] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header & Close Button */}
        <div className="flex items-center justify-between border-b-2 border-[#0A0A0A] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 bg-[#1D4ED8] border-2 border-[#0A0A0A] flex items-center justify-center text-white font-black text-sm shadow-[2px_2px_0_0_#0A0A0A]">
              FV
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#0A0A0A]">
                Choose Your Mobile OS
              </h2>
              <p className="text-[11px] font-mono font-bold text-[#0A0A0A]/60">
                TAP YOUR PHONE PLATFORM TO INSTALL
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
          <div className="mb-5 p-3 bg-[#FEF08A] border-2 border-[#0A0A0A] flex items-center justify-between text-xs font-bold text-[#0A0A0A] shadow-[2px_2px_0_0_#0A0A0A]">
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

        {/* Active Download Alert Banner */}
        {downloadStarted && (
          <div className="mb-5 p-3.5 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-[3px_3px_0_0_#059669] animate-pulse">
            <ArrowDownToLine size={20} className="text-emerald-700 shrink-0" />
            <div>
              <div className="font-black uppercase">Downloading {downloadStarted}...</div>
              <div className="text-[11px] font-normal text-emerald-800">
                Check your mobile browser downloads or notification shade to open the installer.
              </div>
            </div>
          </div>
        )}

        {/* Big Interactive 1-Tap OS Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* iOS Card */}
          <button
            type="button"
            onClick={() => handleSelectOs('ios')}
            className={`p-4 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
              selectedOs === 'ios'
                ? 'bg-[#0A0A0A] text-white shadow-[4px_4px_0_0_#1D4ED8] -translate-y-0.5 ring-2 ring-[#1D4ED8]'
                : 'bg-white text-[#0A0A0A] hover:bg-slate-100 shadow-[2px_2px_0_0_#0A0A0A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Apple size={28} />
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${
                selectedOs === 'ios' ? 'bg-[#1D4ED8] text-white' : 'bg-slate-200 text-[#0A0A0A]'
              }`}>
                {selectedOs === 'ios' ? 'Selected' : 'Tap to Install'}
              </span>
            </div>
            <div className="font-black text-base uppercase tracking-tight">Apple iOS</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'ios' ? 'text-slate-300' : 'text-[#0A0A0A]/60'}`}>
              iPhone / iPad (iOS 15+)
            </div>
          </button>

          {/* Android Card */}
          <button
            type="button"
            onClick={() => handleSelectOs('android')}
            className={`p-4 border-2 border-[#0A0A0A] text-left transition-all cursor-pointer ${
              selectedOs === 'android'
                ? 'bg-[#1D4ED8] text-white shadow-[4px_4px_0_0_#0A0A0A] -translate-y-0.5 ring-2 ring-[#0A0A0A]'
                : 'bg-white text-[#0A0A0A] hover:bg-slate-100 shadow-[2px_2px_0_0_#0A0A0A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Smartphone size={28} />
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${
                selectedOs === 'android' ? 'bg-[#0A0A0A] text-white' : 'bg-slate-200 text-[#0A0A0A]'
              }`}>
                {selectedOs === 'android' ? 'Downloading' : 'Tap to Download'}
              </span>
            </div>
            <div className="font-black text-base uppercase tracking-tight">Android</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedOs === 'android' ? 'text-blue-100' : 'text-[#0A0A0A]/60'}`}>
              Direct APK &amp; .AAB
            </div>
          </button>
        </div>

        {/* Detailed Action Panel */}
        {selectedOs === 'ios' ? (
          <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A]">
                <Apple size={16} />
                <span>Apple iOS Installation</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#DBEAFE] text-[#1D4ED8] px-2 py-0.5 border border-[#0A0A0A]">
                iOS 15.0+ READY
              </span>
            </div>

            <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
              Install Finovault on your iPhone or iPad. Includes native Face ID / Touch ID biometric authentication and offline encrypted storage.
            </p>

            {/* Direct iOS Install Actions */}
            <div className="space-y-2.5 pt-1">
              <a
                href="itms-services://?action=download-manifest&url=https://finovault.pro/downloads/manifest.plist"
                className="w-full flex items-center justify-center gap-2.5 bg-[#0A0A0A] hover:bg-[#1D4ED8] text-white font-black text-xs uppercase tracking-wider py-3.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] transition-all cursor-pointer"
              >
                <Apple size={18} />
                <span>1. Install Direct iOS Wireless Profile</span>
              </a>

              <a
                href="https://testflight.apple.com/join/finovault"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-xs uppercase tracking-wider py-3.5 border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] transition-all cursor-pointer"
              >
                <Apple size={18} />
                <span>2. Open via Apple TestFlight Beta</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="text-[11px] font-mono text-[#0A0A0A]/60 text-center pt-1">
              Supports iPhone 11 through iPhone 16 Pro Max
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#0A0A0A] p-5 shadow-[4px_4px_0_0_#0A0A0A] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0A0A0A]/15 pb-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#0A0A0A]">
                <Smartphone size={16} className="text-[#10B981]" />
                <span>Android Packages (Direct Download)</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#FEF08A] px-2 py-0.5 border border-[#0A0A0A]">
                OFFICIAL BUILD
              </span>
            </div>

            <p className="text-xs font-medium text-[#0A0A0A]/80 leading-relaxed">
              Tap either package below to download directly to your Android device:
            </p>

            {/* Direct Native Anchor Download Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="/downloads/finovault.apk"
                download="finovault.apk"
                onClick={() => setDownloadStarted('finovault.apk')}
                className="flex flex-col items-center justify-center p-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Download size={16} />
                  <span>Download Direct APK</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-100 mt-0.5">60.5 MB • Direct Installer</span>
              </a>

              <a
                href="/downloads/app-release.aab"
                download="app-release.aab"
                onClick={() => setDownloadStarted('app-release.aab')}
                className="flex flex-col items-center justify-center p-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-black text-xs uppercase tracking-wider border-2 border-[#0A0A0A] shadow-[3px_3px_0_0_#0A0A0A] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Download size={16} />
                  <span>Download .AAB Bundle</span>
                </div>
                <span className="text-[10px] font-mono text-blue-100 mt-0.5">57.0 MB • Google Play Format</span>
              </a>
            </div>

            {/* Collapsible Sideload Guide */}
            <div className="pt-2 border-t border-[#0A0A0A]/10">
              <button
                type="button"
                onClick={() => setShowAndroidSteps(!showAndroidSteps)}
                className="flex items-center justify-between w-full text-[11px] font-black uppercase text-[#0A0A0A] hover:text-[#1D4ED8] cursor-pointer"
              >
                <span>3-Step Installation Guide</span>
                {showAndroidSteps ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showAndroidSteps && (
                <div className="mt-2.5 p-3 bg-[#F3F1EA] border border-[#0A0A0A] space-y-1.5 text-[11px] font-medium text-[#0A0A0A]/85">
                  <div>1. Tap <strong>Download Direct APK</strong> above.</div>
                  <div>2. When finished, tap the notification to open <strong>finovault.apk</strong>.</div>
                  <div>3. If prompted by Android, toggle <strong>&quot;Allow install from this source&quot;</strong> and tap <strong>Install</strong>.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-between text-[11px] font-mono text-[#0A0A0A]/60 border-t-2 border-[#0A0A0A]/15 pt-3">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>VirusTotal Clean • Zero Trackers</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-bold uppercase text-[#0A0A0A] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
