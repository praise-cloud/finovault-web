import { api } from './client';
import type { UserPreferences, UserProfile } from '@/types';
import type { PrimaryRole, RoleScheme } from '@/types';

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
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
};

export const userApi = {
  getMe: () => api.get<UserProfile>('/users/me'),
  updateMe: (patch: Partial<UserProfile>) => api.patch<UserProfile>('/users/me', patch),
  getPreferences: () => api.get<UserPreferences>('/users/preferences'),
  savePreferences: (patch: Partial<UserPreferences>) =>
    api.put<UserPreferences>('/users/preferences', patch),
  setRole: (input: { primaryRole: PrimaryRole; scheme?: RoleScheme }) =>
    api.put<UserProfile>('/users/role', input),
};