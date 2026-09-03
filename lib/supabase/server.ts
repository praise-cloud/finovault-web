import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client with the service-role key. Safe to use in BFF
 * route handlers: the key never reaches the browser. Always scope queries by
 * the authenticated user id resolved from the bearer token.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to use the real backend.'
    );
  }
  client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}