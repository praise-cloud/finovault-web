'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, Lock, KeyRound, AlertCircle } from 'lucide-react';
import { Button, TextField } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { authApi } from '@/lib/api/auth';
import { passwordStrength } from '@/lib/utils';

function ResetPasswordForm() {
  const router = useRouter();
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
        return { label: 'STRONG', color: 'bg-blue-500' };
      case 4:
        return { label: 'VERY STRONG', color: 'bg-emerald-500' };
      default:
        return { label: 'NONE', color: 'bg-slate-700' };
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token.trim()) {
      setError('Please provide your reset token or link.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await authApi.resetPassword({
        token: token.trim(),
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
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/50 bg-emerald-950/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--fv-text)]">
            Password Reset Complete!
          </h3>
          <p className="mt-1.5 text-xs text-[var(--fv-text-secondary)]">
            Your credentials have been securely updated. You can now log into Finovault with your new password.
          </p>
        </div>

        <div className="pt-2 w-full">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] border-2 border-white/60 bg-[#1D4ED8] py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[4px_4px_0_0_#ffffff] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#ffffff] active:translate-y-0 active:shadow-none"
          >
            <span>Open Finovault Mobile App</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Reset Token Input (Hidden if provided via query param) */}
      {!initialToken ? (
        <TextField
          label="Reset Token / Code"
          value={token}
          onChangeText={setToken}
          placeholder="Paste your reset token here"
        />
      ) : (
        <div className="flex items-center gap-2 rounded-[8px] border border-blue-500/30 bg-blue-950/20 px-3 py-2 text-xs text-blue-300">
          <KeyRound size={14} className="shrink-0 text-blue-400" />
          <span className="truncate font-mono text-[11px]">
            Security Token verified from reset link
          </span>
        </div>
      )}

      {/* New Password */}
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
              <span className="text-slate-400">STRENGTH:</span>
              <span className="font-bold text-white">{getStrengthLabel(strength).label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`h-full rounded-full transition-all ${
                    strength >= step ? getStrengthLabel(strength).color : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <TextField
        label="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        type="password"
        autoComplete="new-password"
        placeholder="Re-type your new password"
      />

      {error ? (
        <div
          className="flex items-center gap-2 rounded-[10px] border-2 border-[var(--fv-error)] bg-[var(--fv-error-bg)] p-3 shadow-[2px_2px_0_0_var(--fv-error)] text-xs font-bold text-[var(--fv-error)]"
          role="alert"
        >
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <Button
        label={loading ? 'Updating Password...' : 'Save New Password'}
        onPress={() => handleSubmit()}
        loading={loading}
        fullWidth
        className="mt-1 font-black uppercase tracking-wider"
      />

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs font-bold text-[var(--fv-text-secondary)] hover:text-[var(--fv-text)] underline transition-colors"
        >
          Cancel and return to Sign In
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
          <div className="py-8 text-center font-mono text-xs text-slate-400 animate-pulse">
            Loading reset enclave...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
