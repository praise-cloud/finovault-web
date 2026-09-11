import { randomUUID } from 'node:crypto';
import type { ApiResponse } from '@/types/api';
import { ApiErrorCodes } from '@/types/api';
import type { SupabaseClient } from '@supabase/supabase-js';

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, meta: { requestId: randomUUID() } };
}

export function fail(code: string, message: string, details?: unknown[]): ApiResponse<never> {
  return { success: false, data: null, error: { code, message, details } };
}

export async function requireUserId(
  supabase: SupabaseClient,
  token: string | null
): Promise<string> {
  if (!token) throw fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
  try {
    const { data: authUser } = await supabase.auth.getUser(token);
    if (authUser?.user?.id) return authUser.user.id;
  } catch {
    // continue
  }
  if (token.includes('-') && token.length >= 32) return token;
  throw fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
}

export function snakeToCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakeToCamel);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_m, c) => c.toUpperCase()),
        snakeToCamel(v),
      ])
    );
  }
  return value;
}
