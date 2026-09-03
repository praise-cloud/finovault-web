import { ApiClientError, ApiErrorCodes } from '@/types/api';
import type { ApiResponse } from '@/types/api';
import { assertSuccess, mockRequest } from './mock/handlers';
import { seedDemoUser, ensureRoleAccounts, hydrateMockDb } from './mock/db';

export const MOCK_LATENCY_MS = 250;

export const USE_REAL_BACKEND = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

let latencyMs = MOCK_LATENCY_MS;

let accessToken: string | null = null;

let dbReady: Promise<void> | null = null;

/**
 * Initialise the mock backend. Hydrates the persisted database once, then
 * seeds the demo account. All requests wait for hydration before resolving.
 */
export function initMockApi(): Promise<void> {
  if (!dbReady) {
    dbReady = hydrateMockDb().then(() => {
      seedDemoUser();
      ensureRoleAccounts();
    });
  }
  return dbReady;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setMockLatency(ms: number): void {
  latencyMs = ms;
}

/**
 * Transport agnostic client. When NEXT_PUBLIC_USE_SUPABASE is enabled, requests
 * go through the BFF route handler (app/api/bff/[...path]/route.ts) which talks
 * to Supabase server-side. Otherwise the in-memory mock fulfils the exact same
 * { success, data, error, meta } contract with a simulated latency.
 */
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
  if (USE_REAL_BACKEND) {
    const res = await fetch(`/api/bff${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let json: ApiResponse<T> | null = null;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch {
      json = null;
    }
    if (!json || !res.ok) {
      throw new ApiClientError(
        json?.error?.code ?? ApiErrorCodes.INTERNAL,
        json?.error?.message ?? `Request failed with status ${res.status}.`,
        json?.error?.details
      );
    }
    return assertSuccess(json);
  }

  await Promise.all([dbReady ?? Promise.resolve(), new Promise((resolve) => setTimeout(resolve, latencyMs))]);

  const response = mockRequest(method, path, body, accessToken);
  return assertSuccess(response as ApiResponse<T>);
}

export const api = {
  get: <T>(path: string) => apiRequest<T>('GET', path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>('PATCH', path, body),
  delete: <T>(path: string) => apiRequest<T>('DELETE', path),
};

export { ApiClientError, ApiErrorCodes };
export type { ApiResponse } from '@/types/api';