'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { loginSchema, LoginValues } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setFormError(null);
      await login(values.email, values.password);
      router.replace('/dashboard');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('common.error'));
    }
  };

  const demoRoles = [
    { role: 'individual', email: 'individual@finovault.app', label: t('auth.demoIndividual'), accent: '#4338CA', wash: '#EEF0FF' },
    { role: 'freelancer', email: 'freelancer@finovault.app', label: t('auth.demoFreelancer'), accent: '#B42318', wash: '#FEF0EE' },
    { role: 'entrepreneur', email: 'entrepreneur@finovault.app', label: t('auth.demoEntrepreneur'), accent: '#92400E', wash: '#FEF6E5' },
    { role: 'sme', email: 'sme@finovault.app', label: t('auth.demoSme'), accent: '#0F766E', wash: '#E6F9F6' },
  ];

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={t('common.tagline')}
    >
      <div className="flex flex-col gap-4">
        {/* Demo Roles Quick Fill */}
        <div className="rounded-[10px] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-wash)] p-3 shadow-[2px_2px_0_0_#1A1A2E] dark:shadow-[2px_2px_0_0_#000000]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--fv-text)]">
              {t('auth.demoAccounts')}
            </span>
            <span className="text-[10px] font-bold text-[var(--fv-text-secondary)]">Vault123!</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {demoRoles.map((dr) => (
              <button
                key={dr.role}
                type="button"
                onClick={() => {
                  setValue('email', dr.email, { shouldValidate: true });
                  setValue('password', 'Vault123!', { shouldValidate: true });
                }}
                className="flex flex-col items-center justify-center rounded-[6px] border-2 border-[var(--fv-border-ink)] p-1.5 transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#1A1A2E] active:translate-y-0 active:shadow-none"
                style={{ backgroundColor: dr.wash }}
              >
                <span className="text-[11px] font-black uppercase tracking-tight" style={{ color: dr.accent }}>
                  {dr.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              type="email"
              autoComplete="email"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              type="password"
              autoComplete="current-password"
            />
          )}
        />

        {formError ? (
          <div className="rounded-[10px] border-2 border-[var(--fv-error)] bg-[var(--fv-error-bg)] p-3 shadow-[2px_2px_0_0_var(--fv-error)]" role="alert">
            <p className="text-xs font-bold text-[var(--fv-error)]">{formError}</p>
          </div>
        ) : null}

        <Button
          label={t('common.logIn')}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
          className="mt-1 font-black uppercase tracking-wider"
        />

        <p className="pt-2 text-center text-sm font-medium text-[var(--fv-text-secondary)]">
          {t('auth.noAccount')}{' '}
          <Link href="/signup" className="font-black text-[var(--fv-primary)] underline hover:text-[var(--fv-primary-light)]">
            {t('common.createAccount')}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}