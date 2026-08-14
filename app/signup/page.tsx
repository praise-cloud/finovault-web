'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextField } from '@/components/ui';
import { VaultMark } from '@/components/VaultMark';
import { signupSchema, SignupValues, passwordStrength } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const strengthLabels = ['', '·', '··', '···', '····'];

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);
  const [formError, setFormError] = useState<string | null>(null);
  const [strength, setStrength] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '' },
  });

  const passwordValue = watch('password') ?? '';

  const onSubmit = async (values: SignupValues) => {
    try {
      setFormError(null);
      await signup({ fullName: values.fullName, email: values.email, password: values.password });
      router.replace('/dashboard');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('common.error'));
    }
  };

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[var(--fv-bg)] px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <VaultMark size={56} />
          <h1 className="mt-4 text-[26px] font-bold text-[var(--fv-text)]">{t('auth.signupTitle')}</h1>
        </div>

        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label={t('auth.fullName')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                autoComplete="name"
              />
            )}
          />
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
                onChangeText={(v) => {
                  onChange(v);
                  setStrength(passwordStrength(v));
                }}
                onBlur={onBlur}
                error={errors.password?.message}
                type="password"
                autoComplete="new-password"
              />
            )}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--fv-text-secondary)]">{t('auth.passwordStrength')}</span>
            <span className="text-sm font-semibold text-[var(--fv-accent)]">
              {passwordValue ? strengthLabels[strength] : ''}
            </span>
          </div>

          <p className="text-xs text-[var(--fv-text-secondary)]">{t('auth.terms')}</p>

          {formError ? (
            <div className="rounded-[12px] bg-[var(--fv-error-bg)] p-3" role="alert">
              <p className="text-[14px] text-[var(--fv-error)]">{formError}</p>
            </div>
          ) : null}

          <Button label={t('common.createAccount')} onPress={handleSubmit(onSubmit)} loading={isSubmitting} fullWidth />

          <p className="py-4 text-center text-[15px] text-[var(--fv-text-secondary)]">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="font-semibold text-[var(--fv-accent)]">
              {t('common.logIn')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}