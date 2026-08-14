import type { ApiResponse } from '@/types/api';
import { ApiClientError, ApiErrorCodes } from '@/types/api';
import type { PrimaryRole, RoleScheme, UserPreferences, UserProfile } from '@/types';
import {
  createSession,
  createUser,
  findUserByEmail,
  getUserByToken,
  revokeSession,
  updatePrefs,
  updateProfile,
} from './db';

export interface MockRoute {
  method: string;
  pattern: RegExp;
  handler: (ctx: MockContext) => ApiResponse<unknown>;
}

export interface MockContext {
  params: string[];
  body: unknown;
  token: string | null;
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, meta: { requestId: `mock_${Math.random().toString(36).slice(2)}` } };
}

export function fail(code: string, message: string, details?: unknown[]): ApiResponse<never> {
  return { success: false, data: null, error: { code, message, details } };
}

export const mockRoutes: MockRoute[] = [
  {
    method: 'POST',
    pattern: /^\/auth\/signup$/,
    handler: ({ body }) => {
      const { email, password, fullName } = body as {
        email: string;
        password: string;
        fullName: string;
      };
      if (!email || !password || !fullName) {
        return fail(ApiErrorCodes.VALIDATION, 'Missing required fields.');
      }
      if (findUserByEmail(email)) {
        return fail('EMAIL_TAKEN', 'An account with this email already exists.');
      }
      if (password.length < 8) {
        return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
      }
      const user = createUser({ email, password, fullName });
      const accessToken = createSession(user.profile.id);
      return ok({ user: user.profile, session: { accessToken } });
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: ({ body }) => {
      const { email, password } = body as { email: string; password: string };
      const user = findUserByEmail(email ?? '');
      if (!user || user.password !== password) {
        return fail(ApiErrorCodes.UNAUTHORIZED, 'Invalid email or password.');
      }
      const accessToken = createSession(user.profile.id);
      return ok({ user: user.profile, session: { accessToken } });
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/logout$/,
    handler: ({ token }) => {
      if (token) revokeSession(token);
      return ok({ success: true });
    },
  },
  {
    method: 'GET',
    pattern: /^\/auth\/session$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
      return ok({ user: user.profile });
    },
  },
  {
    method: 'GET',
    pattern: /^\/users\/me$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(user.profile);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/users\/me$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const patch = body as Partial<UserProfile>;
      const allowed: Array<keyof UserProfile> = ['fullName', 'avatarUrl', 'preferredLanguage', 'preferredCurrency'];
      const sanitized: Partial<UserProfile> = {};
      for (const key of allowed) {
        const value = patch[key];
        if (value !== undefined) {
          (sanitized as Record<string, unknown>)[key] = value;
        }
      }
      return ok(updateProfile(user.profile.id, sanitized));
    },
  },
  {
    method: 'GET',
    pattern: /^\/users\/preferences$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(user.prefs);
    },
  },
  {
    method: 'PUT',
    pattern: /^\/users\/preferences$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const patch = body as Partial<UserPreferences>;
      return ok(updatePrefs(user.profile.id, patch));
    },
  },
  {
    method: 'PUT',
    pattern: /^\/users\/role$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { primaryRole, scheme } = body as { primaryRole: PrimaryRole; scheme: RoleScheme };
      return ok(
        updateProfile(user.profile.id, {
          primaryRole,
          scheme: scheme ?? user.profile.scheme,
        })
      );
    },
  },
];

export function mockRequest(
  method: string,
  path: string,
  body: unknown,
  token: string | null
): ApiResponse<unknown> {
  for (const route of mockRoutes) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (match) {
      const params = match.slice(1);
      const ctx: MockContext = { params, body, token };
      try {
        return route.handler(ctx);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        return fail(ApiErrorCodes.INTERNAL, message);
      }
    }
  }
  return fail('NOT_FOUND', `No mock route for ${method} ${path}.`);
}

export function assertSuccess<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    const error = response.error;
    throw new ApiClientError(
      error?.code ?? ApiErrorCodes.INTERNAL,
      error?.message ?? 'Request failed.',
      error?.details
    );
  }
  return response.data;
}