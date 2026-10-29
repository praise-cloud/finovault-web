import { api } from './client';
import type { UserPreferences, UserProfile, BusinessProfile } from '@/types';
import type { PrimaryRole, RoleScheme } from '@/types';

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'https://finovault-bff.onrender.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dvvpkxuajwtezdoucbam.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2dnBreHVhand0ZXpkb3VjYmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTk5OTk2NSwiZXhwIjoyMTA3NTc1OTY1fQ.Cek0pwdQuiMZLnHVm4PL10Az9lQVfFJoY9K6W64pWZo';

async function bffRpc<T>(method: string, args: Record<string, unknown>): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${BFF_URL}/rpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, args }),
      signal: controller.signal,
    });
    clearTimeout(id);
    const env = await res.json();
    if (env.error) {
      throw new Error(env.error.message || `${method} failed`);
    }
    return env.data as T;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  country?: 'NG' | 'MU' | string;
  preferredCurrency?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: UserProfile;
  session: { accessToken: string };
}

export const authApi = {
  signup: (input: SignupInput) => api.post<AuthResult>('/auth/signup', input),
  login: (input: LoginInput) => api.post<AuthResult>('/auth/login', input),
  logout: () => api.post<{ success: boolean }>('/auth/logout'),
  getSession: () => api.get<{ user: UserProfile }>('/auth/session'),
  forgotPassword: async (input: { email: string }) => {
    const cleanEmail = input.email.trim().toLowerCase();
    // 1. Direct Supabase recovery request
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          options: {
            redirectTo: 'https://finovault.pro/rest-password',
          },
        }),
      });
    } catch (_) {}

    // 2. Also try BFF if online
    try {
      await bffRpc('requestPasswordReset', { email: cleanEmail });
    } catch (_) {}

    return { success: true as const };
  },
  resetPassword: async (input: { token: string; newPassword: string }) => {
    const cleanToken = input.token.trim();
    const newPassword = input.newPassword;

    // 1. Direct Supabase recovery token (e.g. from recovery link URL hash #access_token=...)
    if (cleanToken.startsWith('ey') || cleanToken.length > 50) {
      try {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          method: 'PUT',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${cleanToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: newPassword }),
        });
        if (res.ok) {
          return { success: true as const };
        }
      } catch (_) {}
    }

    // 2. Direct Supabase verification via password_reset_tokens table
    try {
      const tokRes = await fetch(
        `${SUPABASE_URL}/rest/v1/password_reset_tokens?token=eq.${encodeURIComponent(cleanToken)}&select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      if (tokRes.ok) {
        const rows = await tokRes.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          const isExpired = new Date(row.expires_at).getTime() < Date.now();
          if (isExpired) {
            throw new Error('This password reset link has expired. Please request a new one.');
          }

          // Update password in Supabase admin auth
          const upRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${row.user_id}`, {
            method: 'PUT',
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
          });

          if (!upRes.ok) {
            const err = await upRes.json().catch(() => null);
            throw new Error(err?.msg || err?.message || 'Failed to update password.');
          }

          // Delete token
          await fetch(
            `${SUPABASE_URL}/rest/v1/password_reset_tokens?token=eq.${encodeURIComponent(cleanToken)}`,
            {
              method: 'DELETE',
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
              },
            }
          );
          return { success: true as const };
        }
      }
    } catch (e) {
      if (e instanceof Error && !e.message.includes('fetch')) throw e;
    }

    // 3. Fallback to Hostinger PHP backend if deployed
    try {
      const phpRes = await fetch('/api/reset-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: cleanToken, newPassword }),
      });
      if (phpRes.ok) {
        const phpData = await phpRes.json();
        if (phpData.success) return { success: true as const };
        if (phpData.error) throw new Error(phpData.error);
      }
    } catch (_) {}

    // 4. Try BFF RPC if available
    try {
      await bffRpc('resetPassword', { resetToken: cleanToken, token: cleanToken, newPassword });
      return { success: true as const };
    } catch (_) {
      throw new Error('The reset link is invalid or expired. Please request a new link from the Finovault app.');
    }
  },
};

export const userApi = {
  getMe: () => api.get<UserProfile>('/users/me'),
  updateMe: (patch: Partial<UserProfile>) => api.patch<UserProfile>('/users/me', patch),
  getPreferences: () => api.get<UserPreferences>('/users/preferences'),
  savePreferences: (patch: Partial<UserPreferences>) =>
    api.put<UserPreferences>('/users/preferences', patch),
  setRole: (input: { primaryRole: PrimaryRole; scheme?: RoleScheme }) =>
    api.put<UserProfile>('/users/role', input),
  setBusinessProfile: (input: BusinessProfile) =>
    api.put<UserProfile>('/users/business-profile', input),
};