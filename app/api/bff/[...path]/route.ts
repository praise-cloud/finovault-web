import type { NextRequest } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/server';
import { handleBffRequest } from '@/lib/api/supabase/service';
import { fail } from '@/lib/api/supabase/helpers';
import type { ApiResponse } from '@/types/api';

/**
 * BFF catch-all route handler. Every client-side `api.*` call when
 * NEXT_PUBLIC_USE_SUPABASE=true lands here. The [...path] segment
 * captures the API path (e.g. /api/bff/accounts → ["accounts"]).
 */
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

async function handleRoute(
  req: NextRequest,
  ctx: RouteContext<'/api/bff/[...path]'>,
  method: string
): Promise<Response> {
  if (!isSupabaseConfigured()) {
    const json = fail('INTERNAL', 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    return Response.json(json, { status: 500 });
  }

  const { path } = await ctx.params;
  const bffPath = '/' + path.join('/');
  const token = req.headers.get('authorization')?.replace('Bearer ', '') ?? null;

  let body: unknown = undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      body = await req.json();
    } catch {
      body = undefined;
    }
  }

  // Pass query string through
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
