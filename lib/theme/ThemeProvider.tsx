'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { colors, radius, shadows, spacing, typography } from './tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: Exclude<ThemeMode, 'system'>;
  colors: {
    primary: string;
    primaryLight: string;
    accent: string;
    accentStrong: string;
    wash: string;
    secondary: string;
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
    primaryBorder: string;
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
      primaryLight: colors.primaryLight,
      accent: colors.accent,
      accentStrong: colors.accentStrong,
      wash: colors.wash,
      secondary: colors.secondary,
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
      primaryBorder: mode === 'light' ? 'rgba(29, 78, 216, 0.18)' : 'rgba(125, 211, 252, 0.25)',
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
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored === 'dark' || stored === 'light' ? stored : 'dark';
  });

  const resolved: Exclude<ThemeMode, 'system'> =
    mode === 'light' ? 'light' : 'dark';

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