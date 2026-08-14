'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { colors, radius, shadows, spacing, typography } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: Exclude<ThemeMode, 'system'>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
    charcoal: string;
    bg: string;
    surface: string;
    surfaceGlass: string;
    text: string;
    textSecondary: string;
    border: string;
    borderSubtle: string;
    success: string;
    successBg: string;
    warning: string;
    warningBg: string;
    error: string;
    errorBg: string;
    info: string;
    goldBorder: string;
  };
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: { card: string; elevated: string; buttonPressed: string };
  typography: typeof typography;
}

function buildTheme(mode: Exclude<ThemeMode, 'system'>): Theme {
  const scheme = colors[mode];
  return {
    mode,
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      accentLight: colors.accentLight,
      charcoal: colors.charcoal,
      bg: scheme.bg,
      surface: scheme.surface,
      surfaceGlass: scheme.surfaceGlass,
      text: scheme.text,
      textSecondary: scheme.textSecondary,
      border: scheme.border,
      borderSubtle: scheme.borderSubtle,
      success: colors.success,
      successBg: colors.successBg,
      warning: colors.warning,
      warningBg: colors.warningBg,
      error: colors.error,
      errorBg: colors.errorBg,
      info: colors.info,
      goldBorder: mode === 'light' ? 'rgba(212, 175, 55, 0.25)' : 'rgba(212, 175, 55, 0.3)',
    },
    spacing,
    radius,
    shadows: {
      card: mode === 'light' ? shadows.card : shadows.cardDark,
      elevated: shadows.elevated,
      buttonPressed: shadows.buttonPressed,
    },
    typography,
  };
}

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'finovault.themeMode.v1';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  });

  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const resolved: Exclude<ThemeMode, 'system'> =
    mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  const theme = useMemo(() => buildTheme(resolved), [resolved]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme.mode === 'dark');
  }, [theme.mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleMode = useCallback(() => {
    setMode(resolved === 'light' ? 'dark' : 'light');
  }, [resolved, setMode]);

  const value = useMemo(
    () => ({ theme, mode, setMode, toggleMode }),
    [theme, mode, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}