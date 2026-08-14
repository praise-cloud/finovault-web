'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Entry gate. After Providers has restored any stored session, bounce to the
 * dashboard when authenticated, otherwise to login.
 */
export default function EntryPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    router.replace(isAuthenticated ? '/dashboard' : '/login');
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fv-bg)]">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[var(--fv-accent)] border-t-transparent" />
    </div>
  );
}