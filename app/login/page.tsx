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

  return (
    <AuthShell
      title={t('auth.loginTitle')}
      subtitle={t('common.tagline')}
    >
      <div className="flex flex-col gap-4">
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
            <div className="rounded-[12px] bg-[var(--fv-error-bg)] p-3" role="alert">
              <p className="text-[14px] text-[var(--fv-error)]">{formError}</p>
            </div>
          ) : null}

          <Button label={t('common.logIn')} onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />

          <p className="py-4 text-center text-[15px] text-[var(--fv-text-secondary)]">
            {t('auth.noAccount')}{' '}
            <Link href="/signup" className="font-semibold text-[var(--fv-primary)]">
              {t('common.createAccount')}
            </Link>
          </p>
        </div>
    </AuthShell>
  );
}