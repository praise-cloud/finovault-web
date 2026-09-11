'use client';

import '@/lib/i18n'; // ponytail: side-effect import, initializes i18next for all routes
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initMockApi, setMockLatency } from '@/lib/api';
import { ThemeProvider } from '@/lib/theme';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Client-side providers: mock API boot, i18n-ready theme and react-query.
 * Kept small so layout.tsx stays a server component.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV === 'test') setMockLatency(0);
    void initMockApi().then(() => {
      void restoreSession().finally(() => setReady(true));
    });
  }, [restoreSession]);

  const [queryClient] = React.useState(() => new QueryClient());

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--fv-bg)]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[var(--fv-primary)] border-t-transparent" />
          <p className="text-sm text-[var(--fv-text-secondary)]">Finovault</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}