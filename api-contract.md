# finovault-web — BFF API Contract

Base URL: `/api/bff` (Next.js route handler → `lib/api/supabase/service.ts`).

## Envelope

Every response:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
```

- Success: HTTP 200, `success: true`, `data` present.
- Failure: `success: false`, `message` (and `errors` for validation). Status codes are mapped by the route handler.

## Auth

- All routes except `POST /api/bff/auth/signup` and `POST /api/bff/auth/login` require a Bearer token.
- Send `Authorization: Bearer <token>`. Missing/invalid token → `success: false` (`UNAUTHORIZED`).
- Entities are scoped by `user_id` derived from the token — never trust `user_id` in the body.

## Response shapes — camelCase

All `data` payloads use **camelCase** keys (Snake→camel conversion happens in the BFF via `snakeToCamel`). Frontend types in `types/index.ts` are the field-level reference.

| Method | Path | Notes |
| ------ | ---- | ----- |
| POST | `/auth/signup` | Public. |
| POST | `/auth/login` | Public. |
| POST | `/auth/logout` | |
| GET | `/auth/session` | |
| POST | `/auth/forgot-password` | |
| POST | `/auth/reset-password` | |
| GET | `/users/me` | Hand-mapped; camelCase user incl. `prefs`. |
| PATCH | `/users/me` | Partial update; returns updated user. |
| GET | `/users/preferences` | Returns prefs or camelCase fallback `{ financialGoals: [], riskTolerance: 'moderate', moneyFears: [], onboardingCompleted: false }`. |
| PUT | `/users/preferences` | Partial merge — unspecified fields keep existing values; returns full prefs. |
| PUT | `/users/role` | |
| PUT | `/users/business-profile` | |
| GET | `/accounts` | List. |
| POST | `/accounts` | Create. |
| DELETE | `/accounts/:id` | Returns `ok({ success: true })`. |
| GET | `/transactions?limit=N` | List, default limit 50. |
| POST | `/transactions` | Create. |
| GET | `/budgets` | List. |
| POST | `/budgets` | Upsert by category. |
| GET | `/goals` | List. |
| GET | `/goals/:id` | |
| POST | `/goals` | |
| POST | `/goals/:id/contribute` | |
| GET | `/pension` | Hand-mapped; camelCase. |
| PUT | `/pension` | |
| GET | `/pension/projection` | |
| GET | `/pension/contributions` | List. |
| POST | `/pension/contribute` | |
| GET | `/security/overview` | Returns `{ ...overview, score }`; camelCase. |
| PUT | `/security/2fa` | |
| POST | `/security/change-password` | |
| GET | `/security/devices` | List. |
| GET | `/security/events` | List. |
| POST | `/security/events/:id/resolve` | |
| GET | `/invoices` | List, sorted by `dueDate` desc. |
| POST | `/invoices` | Create. |
| PATCH | `/invoices/:id/status` | |
| GET | `/vendors` | List. |
| POST | `/vendors` | Create. |
| GET | `/transfers` | List. |
| GET | `/transfers/:id` | |
| POST | `/transfers` | Create; idempotent on `idempotencyKey` (returns existing transfer on repeat). |
| GET | `/payees` | List. |
| POST | `/payees` | Create. |
| GET | `/bills` | List. |
| POST | `/bills/schedule` | Create scheduled bill. |
| POST | `/bills` | Pay bill. |
| GET | `/notifications` | List, newest first. |
| POST | `/notifications/:id/read` | Mark one read; returns `{ id, readAt }`. |
| POST | `/notifications/read-all` | Mark all read; returns `{ updated: n }`. |

Notes:

- List routes return `data: [...]` (empty array when none; no `null`).
- `goals`, `pension`, `payees`, `users/me`, `users/role`, `users/business-profile` are hand-mapped to camelCase in their handlers — do not mix snake_case rows into frontend code.
- Creators/upserts return the created row (camelCase).

## Verification

- `npx tsc --noEmit` (exit 0) and `npm run lint` (no new errors) gate changes.