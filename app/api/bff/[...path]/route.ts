import type { NextRequest } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/server';
import { handleBffRequest } from '@/lib/api/supabase/service';
import { ok, fail } from '@/lib/api/supabase/helpers';
import type { ApiResponse } from '@/types/api';
import { ApiErrorCodes } from '@/types/api';
import * as auth from '@/lib/api/supabase/auth';

const RENDER_BFF_URL = process.env.BFF_URL || 'https://finovault-bff.onrender.com';

export async function POST(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>
) {
  return handleRoute(req, ctx, 'POST');
}

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>
) {
  return handleRoute(req, ctx, 'GET');
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>
) {
  return handleRoute(req, ctx, 'PUT');
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>
) {
  return handleRoute(req, ctx, 'PATCH');
}

export async function DELETE(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>
) {
  return handleRoute(req, ctx, 'DELETE');
}

async function callRenderRpc(
  method: string,
  args: unknown,
  token: string | null
): Promise<{ data: unknown; error: { code?: string; message?: string } | null } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`${RENDER_BFF_URL}/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ method, args: args || {} }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function handleRoute(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>,
  method: string
): Promise<Response> {
  const { path } = await ctx.params;
  const bffPath = '/' + path.join('/');
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? null;

  let body: Record<string, unknown> | undefined = undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await req.json();
    } catch {
      body = undefined;
    }
  }

  // 1. Try Render BFF RPC for Auth
  if (bffPath === '/auth/login' && method === 'POST') {
    const rpc = await callRenderRpc('login', body, null);
    if (rpc) {
      if (rpc.error) {
        const json = fail(ApiErrorCodes.UNAUTHORIZED, rpc.error.message || 'Invalid email or password.');
        return Response.json(json, { status: 401 });
      }
      const data = rpc.data as { token: string; user: unknown };
      const json = ok({ user: data.user, session: { accessToken: data.token } });
      return Response.json(json, { status: 200 });
    }
  }

  if (bffPath === '/auth/signup' && method === 'POST') {
    const supabase = getSupabase();
    const result = await auth.signup(supabase, body);
    const status = result.success ? 200 : mapErrorStatus(result.error?.code);
    return Response.json(result, { status });
  }

  if (bffPath === '/auth/session' && method === 'GET') {
    if (!token) {
      return Response.json(fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.'), { status: 401 });
    }
    const rpc = await callRenderRpc('getSession', {}, token);
    if (rpc && !rpc.error && rpc.data) {
      const json = ok({ user: rpc.data, session: { accessToken: token } });
      return Response.json(json, { status: 200 });
    }
  }

  // 2. Fallback to Direct Supabase handler
  if (!isSupabaseConfigured()) {
    const json = fail('INTERNAL', 'Backend is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    return Response.json(json, { status: 500 });
  }

  const url = new URL(req.url);
  const fullBffPath = url.search ? `${bffPath}${url.search}` : bffPath;

  const supabase = getSupabase();
  const result: ApiResponse<unknown> = await handleBffRequest(supabase, method, fullBffPath, body, token);

  const status = result.success ? 200 : mapErrorStatus(result.error?.code);
  return Response.json(result, { status });
}

function mapErrorStatus(code?: string): number {
  switch (code) {
    case 'VALIDATION_ERROR': return 400;
    case 'UNAUTHORIZED': return 401;
    case 'NOT_FOUND': return 404;
    case 'INSUFFICIENT_FUNDS': return 409;
    case 'EMAIL_TAKEN': return 409;
    case 'RATE_LIMITED': return 429;
    default: return 500;
  }
}
