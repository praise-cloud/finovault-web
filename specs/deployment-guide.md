# finovault-web — Deployment Guide

Local + production deployment notes for the Next.js BFF with a Supabase backend.
Last updated: 2026-09-10. Status: **verified locally** (BFF against real Postgres).

## Architecture

- **Frontend/BFF**: Next.js 16.3 (App Router, Turbopack dev). BFF = `app/api/bff/[...path]/route.ts` → `lib/api/supabase/service.ts` (route table → auth/resources handlers).
- **Backend**: Supabase (Postgres 17 + PostgREST + Kong at `:54321`). Auth is **custom** (scrypt hash + `sessions` table) — the Supabase Auth (GoTrue) service is NOT used.
- **Client switch**: `lib/api/client.ts` reads `NEXT_PUBLIC_USE_SUPABASE === 'true'` → routes all `api.*` calls to `/api/bff` (real backend). `false` → mock handlers.

## Local Supabase stack

```bash
supabase init                                  # done — supabase/config.toml
supabase start                                 # runs Docker Compose-backed stack
supabase db reset                              # drops, recreates, applies supabase/migrations/*.sql
supabase stop                                  # tears down (data kept in docker volumes)
```

### config.toml deltas (vs CLI default)

| Setting | Value | Why |
| ------- | ----- | --- |
| `[analytics] enabled` | `false` | logflare requires Docker daemon on `tcp://localhost:2375` on Windows; BFF doesn't use it |
| `[storage] enabled` | `false` | healthcheck flaps on Docker Desktop; BFF doesn't use storage |
| `[realtime] enabled` | `false` | flaky local healthcheck; unused |
| `[studio] enabled` | `false` | flaky local healthcheck; unused |
| `[edge_runtime] enabled` | `false` | unused |
| `[local_smtp] enabled` | `false` | unused (auth confirmations disabled) |
| `[db.seed] enabled` | `false` | no `supabase/seed.sql` exists yet |
| `[db] major_version` | `17` | must match remote; already default |

Remaining services: `db :54322`, `api/rest :54321`, `gateway/kong :54321`, `auth`, `pg_meta`.

### Migrations

- `0001_init.sql` — schema (20 tables). Idempotent. **No RLS** — do not grant `anon`/`authenticated` DML without adding RLS.
- `0002_grants.sql` — GRANTs `service_role` full access on `public` (**required on local** — tables are NOT auto-exposed; without it PostgREST returns `42501 permission denied` and the BFF throws). Review by @database when re-touching grants.

## Environment variables

`.env` (gitignored) / `.env.local`:

| Var | Local value | Notes |
| --- | ----------- | ----- |
| `NEXT_PUBLIC_USE_SUPABASE` | `true` | `false` = mock backend |
| `SUPABASE_URL` | `http://127.0.0.1:54321` | BFF server-side only |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` (from `supabase status`) | service-role key, BFF only — never client-side |
| `SEED_DEMO_USERS` | `false` | |

`.env.example` ships placeholder keys. **Never commit real keys.**

> Note: BFF reads `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` (NOT `NEXT_PUBLIC_SUPABASE_*`). Local keys are the new-format `sb_publishable_`/`sb_secret_` from the CLI.

## Build & run

```bash
npx next build                      # verifies tsc + all routes (~2 min)
npx next start -p 3002              # production server — reads env at runtime
npx next dev -p 3001                # dev server
```

⚠️ **Next 16 forbids two `next dev` on the same directory** ("Another next dev server is already running"). To run a second instance use `next build` + `next start -p <port>`, or kill the existing server first.

## Health checks / monitoring

- Supabase: `supabase status` lists API/DB/keys.
- DB probe: `docker exec supabase_db_finovault-web psql -U postgres -d postgres -tAc "SELECT 1"`.
- API probe: `curl http://localhost:54321/rest/v1/users?select=id&limit=1 -H "Authorization: Bearer <service_role_key>"` → `[]` / HTTP 200.
- App: login page 200 on :3002.

## BFF verification (2026-09-10) — PASS

All against local stack, `next start -p 3002`, service_role key, `--data-binary @file` payloads:

| Endpoint | Result |
| -------- | ------ |
| POST `/api/bff/auth/signup` | 200, `user` + `session.accessToken` |
| POST `/api/bff/auth/login` | 200, fresh token |
| GET `/api/bff/users/preferences` | 200, camelCase contract fallback |
| PUT `/api/bff/users/preferences` | 200, partial merge persisted |
| GET `/api/bff/notifications` | 200, array (empty → seeded row) |
| POST `/api/bff/notifications/:id/read` | 200, `{ id, readAt }` |

## Rollback / notes

- Tear down: `supabase stop`. Rebuild from scratch: `supabase db reset` (wipe) → `.env.local` keys stay valid.
- Test data left in local DB (`devops-verify@finovault.test` user + 1 notification) — wipe with `supabase db reset`.
- Upgrade CLI: 2.108.0 → 2.117.0 available (`npm i -g supabase` or Scoop).