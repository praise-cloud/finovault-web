import { create } from 'zustand';
import type { ThemeMode } from '@/lib/theme';

interface PreferencesState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  themeMode: 'system',
  setThemeMode: (themeMode) => set({ themeMode }),
}));