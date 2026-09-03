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
  const { data } = await supabase
    .from('sessions')
    .select('user_id')
    .eq('token', token)
    .single();
  if (!data?.user_id) throw fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
  return data.user_id;
}
