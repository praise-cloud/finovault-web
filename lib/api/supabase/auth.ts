import { randomUUID, scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile, PrimaryRole } from '@/types';
import type { ApiResponse } from '@/types/api';
import { ApiErrorCodes } from '@/types/api';
import { ok, fail } from './helpers';

const scryptAsync = promisify(scrypt);

function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt ?? randomBytes(16).toString('hex');
  return scryptAsync(password, s, 64).then((buf) => ({
    hash: (buf as Buffer).toString('hex'),
    salt: s,
  }));
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const { hash: computed } = await hashPassword(password, salt);
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
}

function toProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: row.email as string,
    fullName: row.full_name as string,
    avatarUrl: (row.avatar_url as string) ?? undefined,
    primaryRole: (row.primary_role as UserProfile['primaryRole']) ?? 'individual',
    secondaryRoles: ((row.secondary_roles as string[]) as PrimaryRole[]) ?? [],
    scheme: (row.scheme as UserProfile['scheme']) ?? 'standard',
    preferredLanguage: (row.preferred_language as 'en' | 'fr') ?? 'en',
    preferredCurrency: (row.preferred_currency as string) ?? 'MUR',
    createdAt: row.created_at as string,
    businessProfile: row.business_profile ? (row.business_profile as UserProfile['businessProfile']) : undefined,
  };
}

export async function signup(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ user: UserProfile; session: { accessToken: string } }>> {
  const { email, password, fullName } = body as { email: string; password: string; fullName: string };
  if (!email || !password || !fullName) {
    return fail(ApiErrorCodes.VALIDATION, 'Missing required fields.');
  }
  if (password.length < 8) {
    return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
  }
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
  if (existing) {
    return fail('EMAIL_TAKEN', 'An account with this email already exists.');
  }
  const { hash, salt } = await hashPassword(password);
  const now = new Date().toISOString();
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: `${salt}:${hash}`,
      full_name: fullName,
      primary_role: 'individual',
      secondary_roles: [],
      scheme: 'standard',
      preferred_language: 'en',
      preferred_currency: 'MUR',
      created_at: now,
    })
    .select()
    .single();
  if (error || !user) {
    return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create user.');
  }
  const token = randomUUID();
  await supabase.from('sessions').insert({ token, user_id: user.id, created_at: now });
  return ok({ user: toProfile(user), session: { accessToken: token } });
}

export async function login(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ user: UserProfile; session: { accessToken: string } }>> {
  const { email, password } = body as { email: string; password: string };
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email?.trim().toLowerCase() ?? '')
    .single();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return fail(ApiErrorCodes.UNAUTHORIZED, 'Invalid email or password.');
  }
  const token = randomUUID();
  await supabase.from('sessions').insert({ token, user_id: user.id, created_at: new Date().toISOString() });
  return ok({ user: toProfile(user), session: { accessToken: token } });
}

export async function logout(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<{ success: true }>> {
  if (token) await supabase.from('sessions').delete().eq('token', token);
  return ok({ success: true });
}

export async function getSession(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<{ user: UserProfile }>> {
  if (!token) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
  const { data: session } = await supabase
    .from('sessions')
    .select('user_id')
    .eq('token', token)
    .single();
  if (!session) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
  const { data: user } = await supabase.from('users').select('*').eq('id', session.user_id).single();
  if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
  return ok({ user: toProfile(user) });
}

export async function forgotPassword(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ success: true }>> {
  const { email } = body as { email: string };
  const normalized = (email ?? '').trim().toLowerCase();
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalized)
    .single();
  if (user) {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await supabase.from('password_resets').upsert({
      email: normalized,
      token,
      expires_at: expiresAt,
    });
  }
  return ok({ success: true });
}

export async function resetPassword(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ success: true }>> {
  const { token: resetToken, newPassword } = body as { token: string; newPassword: string };
  if (!resetToken || !newPassword) {
    return fail(ApiErrorCodes.VALIDATION, 'Reset token and new password are required.');
  }
  if (newPassword.length < 8) {
    return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
  }
  const { data: record } = await supabase
    .from('password_resets')
    .select('email, expires_at')
    .eq('token', resetToken)
    .single();
  if (!record || new Date(record.expires_at) < new Date()) {
    return fail('INVALID_RESET_TOKEN', 'This reset link has expired or has already been used.');
  }
  const { hash, salt } = await hashPassword(newPassword);
  await supabase
    .from('users')
    .update({ password_hash: `${salt}:${hash}` })
    .eq('email', record.email);
  await supabase.from('password_resets').delete().eq('token', resetToken);
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', record.email)
    .single();
  if (user) await supabase.from('sessions').delete().eq('user_id', user.id);
  return ok({ success: true });
}
