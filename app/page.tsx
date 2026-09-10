'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { HomePage } from '@/features/homepage/HomePage';

export default function EntryPage() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  if (status === 'idle' || status === 'authenticating' || status === 'error') {
    return <HomePage />;
  }

  return null;
}
