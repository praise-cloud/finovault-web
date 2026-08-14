import { ApiClientError, ApiErrorCodes } from '@/types/api';
import type { ApiResponse } from '@/types/api';
import { assertSuccess, mockRequest } from './mock/handlers';
import { seedDemoUser, hydrateMockDb } from './mock/db';

export const MOCK_LATENCY_MS = 250;

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
 * Mock transport that mimics the real backend API contract
 * ({ success, data, error, meta } envelope + Authorization header + latency).
 * Swap the internals of request() for fetch() when the real backend lands.
 */
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
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