'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';
import { Button, TextField } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { authApi } from '@/lib/api/auth';
import { passwordStrength } from '@/lib/utils';

// Client-side SQL injection and malicious input detector
function containsSqlInjection(val: string): boolean {
  if (!val) return false;
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|DECLARE)\b)/i,
    /(--|\/\*|\*\/|@@)/,
    /(\bOR\b|\bAND\b)\s+['"\d\w]+\s*=\s*['"\d\w]+/i,
    /['";]\s*(\b(OR|AND)\b)?\s*[\d\w]+\s*=\s*[\d\w]+/i,
    /[;\x00]/,
  ];
  return patterns.some((p) => p.test(val));
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [token, setToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(newPassword);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return { label: 'WEAK', color: 'bg-red-500' };
      case 2:
        return { label: 'FAIR', color: 'bg-amber-500' };
      case 3:
        return { label: 'STRONG', color: 'bg-blue-600' };
      case 4:
        return { label: 'VERY STRONG', color: 'bg-emerald-600' };
      default:
        return { label: 'NONE', color: 'bg-slate-300' };
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanToken = token.trim();

    if (!cleanToken) {
      setError('Please provide your reset token or use the link from your email.');
      return;
    }
    if (containsSqlInjection(cleanToken)) {
      setError('Reset token format is invalid.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword.length > 128) {
      setError('Password cannot exceed 128 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.includes('\0')) {
      setError('Password contains illegal characters.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authApi.resetPassword({
        token: cleanToken,
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center text-center space-y-5 py-4">
        {/* Success Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-50 text-emerald-600 shadow-[3px_3px_0_0_#059669]">
          <CheckCircle2 size={36} strokeWidth={2.4} />
        </div>

        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-black">
            Password Reset Complete!
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed max-w-xs mx-auto">
            Your credentials have been securely updated in Supabase. You can now log into Finovault with your new password.
          </p>
        </div>

        {/* Primary CTA: Open Mobile App */}
        <div className="pt-2 w-full space-y-3">
          <a
            href="finovault://login"
            className="flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-black bg-[#1D4ED8] py-4 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#000000] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000000] active:translate-y-0 active:shadow-none"
          >
            <span>Open Finovault Mobile App</span>
            <ArrowRight size={16} strokeWidth={2.4} />
          </a>

          <p className="text-[11px] font-semibold text-slate-500">
            If the app does not open automatically, open Finovault on your device to sign in.
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200 w-full">
          <Link
            href="/"
            className="text-xs font-bold text-slate-700 hover:text-black underline transition-colors"
          >
            Return to Finovault Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Reset Token Indicator or Input */}
      {!initialToken ? (
        <TextField
          label="Reset Token / Security Code"
          value={token}
          onChangeText={setToken}
          placeholder="Paste your reset token here"
        />
      ) : (
        <div className="flex items-center gap-2.5 rounded-[10px] border-2 border-blue-600 bg-blue-50 px-3.5 py-2.5 text-xs font-bold text-blue-900 shadow-[2px_2px_0_0_#2563EB]">
          <KeyRound size={16} className="shrink-0 text-blue-600" />
          <span className="truncate font-mono text-[11px]">
            Security Token verified from reset link
          </span>
        </div>
      )}

      {/* New Password (with eye icon toggle) */}
      <div>
        <TextField
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        {/* Strength Indicator */}
        {newPassword && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500 font-bold">STRENGTH:</span>
              <span className="font-extrabold text-black">{getStrengthLabel(strength).label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-300">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full rounded-full transition-all ${
                    strength >= step ? getStrengthLabel(strength).color : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password (with eye icon toggle) */}
      <TextField
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        type="password"
        autoComplete="new-password"
        placeholder="Re-type your new password"
      />

      {/* Error alert */}
      {error ? (
        <div
          className="flex items-center gap-2.5 rounded-[10px] border-2 border-red-600 bg-red-50 p-3 shadow-[2px_2px_0_0_#DC2626] text-xs font-bold text-red-700"
          role="alert"
        >
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button
        label={loading ? 'Updating Password...' : 'Save New Password'}
        onPress={() => handleSubmit()}
        loading={loading}
        fullWidth
        className="mt-2 font-black uppercase tracking-wider text-xs py-3.5"
      />

      <div className="pt-2 text-center">
        <Link
          href="/"
          className="text-xs font-bold text-slate-600 hover:text-black underline transition-colors"
        >
          Return to Finovault Home
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Create New Password"
      subtitle="Enter and confirm your new password to regain access to your account."
    >
      <Suspense
        fallback={
          <div className="py-8 text-center font-mono text-xs text-slate-500 animate-pulse">
            Loading reset enclave...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
