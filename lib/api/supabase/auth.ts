import { randomUUID, scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProfile, PrimaryRole } from '@/types';
import type { ApiResponse } from '@/types/api';
import { ApiErrorCodes } from '@/types/api';
import { ok, fail } from './helpers';

const scryptAsync = promisify(scrypt);

export function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt ?? randomBytes(16).toString('hex');
  return scryptAsync(password, s, 64).then((buf) => ({
    hash: (buf as Buffer).toString('hex'),
    salt: s,
  }));
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const { hash: computed } = await hashPassword(password, salt);
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(computed, 'hex'));
}

function toProfile(row: Record<string, unknown>): UserProfile {
  const preferredCurrency = (row.preferred_currency as string) ?? 'NGN';
  const country = (row.country as string) ?? (preferredCurrency === 'MUR' ? 'MU' : 'NG');
  return {
    id: row.id as string,
    email: row.email as string,
    fullName: row.full_name as string,
    avatarUrl: (row.avatar_url as string) ?? undefined,
    primaryRole: (row.primary_role as UserProfile['primaryRole']) ?? 'individual',
    secondaryRoles: ((row.secondary_roles as string[]) as PrimaryRole[]) ?? [],
    scheme: (row.scheme as UserProfile['scheme']) ?? 'standard',
    preferredLanguage: (row.preferred_language as 'en' | 'fr') ?? 'en',
    preferredCurrency,
    country,
    phone: (row.phone as string) ?? undefined,
    createdAt: row.created_at as string,
    businessProfile: row.business_profile ? (row.business_profile as UserProfile['businessProfile']) : undefined,
  };
}

export async function signup(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ user: UserProfile; session: { accessToken: string } }>> {
  const { email, password, fullName, country, phone } = (body || {}) as {
    email?: string;
    password?: string;
    fullName?: string;
    country?: string;
    phone?: string;
  };
  const normalized = String(email || '').trim().toLowerCase();
  const trimmedName = String(fullName || '').trim();
  const userCountry = country === 'MU' ? 'MU' : 'NG';
  const preferredCurrency = userCountry === 'NG' ? 'NGN' : 'MUR';

  if (!normalized || !password || !trimmedName) {
    return fail(ApiErrorCodes.VALIDATION, 'Missing required fields.');
  }
  if (password.length < 8) {
    return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
  }

  // Use Supabase Auth admin to create user with email auto-confirmed
  const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
    email: normalized,
    password,
    email_confirm: true,
  });

  if (authErr) {
    if (authErr.message?.includes('already registered')) {
      return fail('EMAIL_TAKEN', 'An account with this email already exists.');
    }
    return fail(ApiErrorCodes.INTERNAL, authErr.message || 'Failed to create user.');
  }

  const uid = authData.user.id;

  // The PostgreSQL trigger on auth.users automatically created the profile row.
  // We update full_name and ensure country, currency, and role fields are properly set.
  await supabase
    .from('profiles')
    .update({
      full_name: trimmedName,
      primary_role: 'individual',
      scheme: 'standard',
      preferred_language: 'en',
      preferred_currency: preferredCurrency,
      country: userCountry,
      phone: phone?.trim() || null,
    })
    .eq('id', uid);

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .maybeSingle();

  // Create session using signInWithPassword
  const { data: sessionData } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  const token = sessionData?.session?.access_token || authData.user.id;
  const user = profileData ? toProfile(profileData) : toProfile({
    id: uid,
    email: normalized,
    full_name: trimmedName,
    primary_role: 'individual',
    scheme: 'standard',
    preferred_language: 'en',
    preferred_currency: 'MUR',
    created_at: new Date().toISOString(),
  });

  return ok({ user, session: { accessToken: token } });
}

export async function login(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<{ user: UserProfile; session: { accessToken: string } }>> {
  const { email, password } = (body || {}) as { email?: string; password?: string };
  const normalized = String(email || '').trim().toLowerCase();

  if (!normalized || !password) {
    return fail(ApiErrorCodes.VALIDATION, 'Email and password are required.');
  }

  const { data: sessionData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (signInErr || !sessionData?.user) {
    return fail(ApiErrorCodes.UNAUTHORIZED, 'Incorrect email or password. Please try again.');
  }

  const uid = sessionData.user.id;
  const { data: p } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();

  const user = p ? toProfile(p) : toProfile({
    id: uid,
    email: normalized,
    full_name: sessionData.user.user_metadata?.full_name || 'Finovault Member',
    primary_role: 'individual',
    scheme: 'standard',
    preferred_language: 'en',
    preferred_currency: 'MUR',
    created_at: sessionData.user.created_at,
  });

  return ok({
    user,
    session: { accessToken: sessionData.session?.access_token || uid },
  });
}

export async function logout(
  _supabase: SupabaseClient,
  _token: string | null
): Promise<ApiResponse<{ success: true }>> {
  return ok({ success: true });
}

export async function getSession(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<{ user: UserProfile }>> {
  if (!token) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
  const { data: authUser, error } = await supabase.auth.getUser(token);
  if (error || !authUser?.user) {
    return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
  }
  const uid = authUser.user.id;
  const { data: p } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
  if (!p) return fail(ApiErrorCodes.UNAUTHORIZED, 'User profile not found.');
  return ok({ user: toProfile(p) });
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
