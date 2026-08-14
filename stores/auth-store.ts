import { create } from 'zustand';
import { authApi, setAccessToken } from '@/lib/api';
import { clearStoredToken, getStoredToken, saveStoredToken } from '@/lib/security/session';
import type { UserProfile } from '@/types';

export interface ServerSession {
  accessToken: string;
}

interface AuthState {
  user: UserProfile | null;
  session: ServerSession | null;
  isAuthenticated: boolean;
  status: 'idle' | 'authenticating' | 'authenticated' | 'error';
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: UserProfile) => void;
  setSession: (session: ServerSession, user: UserProfile) => void;
  clear: () => void;
  /**
   * Restore a persisted session on page load: the access token was stored in
   * localStorage when the user logged in, so we re-validate it against the
   * mock API. Returns true when a stored session was restored.
   */
  restoreSession: () => Promise<boolean>;
}

function applySession(session: ServerSession, user: UserProfile) {
  setAccessToken(session.accessToken);
  return {
    session,
    user,
    isAuthenticated: true,
    status: 'authenticated' as const,
  };
}

function clearSession() {
  setAccessToken(null);
  return {
    session: null,
    user: null,
    isAuthenticated: false,
    status: 'idle' as const,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,

  login: async (email, password) => {
    set({ status: 'authenticating', error: null });
    try {
      const result = await authApi.login({ email, password });
      saveStoredToken(result.session.accessToken);
      set(applySession(result.session, result.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to log in.';
      set({ status: 'error', error: message });
      throw err;
    }
  },

  signup: async (input) => {
    set({ status: 'authenticating', error: null });
    try {
      const result = await authApi.signup(input);
      saveStoredToken(result.session.accessToken);
      set(applySession(result.session, result.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create account.';
      set({ status: 'error', error: message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort server invalidation; local clear always proceeds.
    }
    clearStoredToken();
    set(clearSession());
  },

  setUser: (user) => set({ user }),
  setSession: (session, user) => set(applySession(session, user)),

  clear: () => set(clearSession()),

  restoreSession: async () => {
    const stored = getStoredToken();
    if (!stored) {
      set(clearSession());
      return false;
    }
    setAccessToken(stored);
    try {
      const { user } = await authApi.getSession();
      set(applySession({ accessToken: stored }, user));
      return true;
    } catch {
      // Stale token (e.g. mock DB reset) — discard it and fall back to login.
      clearStoredToken();
      set(clearSession());
      return false;
    }
  },
}));