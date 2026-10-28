import { api } from './client';
import type { UserPreferences, UserProfile, BusinessProfile } from '@/types';
import type { PrimaryRole, RoleScheme } from '@/types';

const BFF_URL = process.env.NEXT_PUBLIC_BFF_URL || 'https://finovault-bff.onrender.com';

async function bffRpc<T>(method: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BFF_URL}/rpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, args }),
  });
  const env = await res.json();
  if (env.error) {
    throw new Error(env.error.message || `${method} failed`);
  }
  return env.data as T;
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
    try {
      await bffRpc('requestPasswordReset', { email: input.email });
      return { success: true as const };
    } catch {
      return api.post<{ success: true; resetToken?: string }>('/auth/forgot-password', input);
    }
  },
  resetPassword: async (input: { token: string; newPassword: string }) => {
    try {
      await bffRpc('resetPassword', { resetToken: input.token, token: input.token, newPassword: input.newPassword });
      return { success: true as const };
    } catch (e) {
      if (e instanceof Error && e.message && !e.message.includes('fetch')) {
        throw e;
      }
      return api.post<{ success: true }>('/auth/reset-password', input);
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