# Review Report — RV-001 Close-out

**Commit**: `2115727` — "Certify Supabase BFF parity and wire onboarding completion persistence"
**Branch**: `feat/backlog` vs `main`
**Reviewer**: @reviewer
**Date**: 2026-09-09
**Mode**: Thorough (19-table schema + BFF layer + auth boundary)

---

## Review Scope

| Item | Status |
|------|--------|
| Files reviewed | 6 (helpers.ts, resources.ts, page.tsx, 0001_init.sql, api-contract.md, implementation-summary.md) |
| Lines reviewed | ~1350 (resources.ts 954, migration 223, helpers 39, page 69, contract 90) |
| Review areas | snakeToCamel parity, partial-merge correctness, fire-and-forget safety, security, migration schema |

---

## Issues Found

| # | Severity | File | Line | Category | Issue | Suggestion |
|---|----------|------|------|----------|-------|------------|
| 1 | **CRITICAL** | `lib/api/supabase/resources.ts` | 595 | security | `changePassword` compares `password_hash` (stored as `salt:hex` by auth.ts) with plaintext `b.currentPassword` via `!==`. These can never match — the function always rejects every password change. Users cannot change their password. | Use `verifyPassword()` from auth.ts (import and call it). |
| 2 | **CRITICAL** | `lib/api/supabase/resources.ts` | 601 | security | `changePassword` stores the new password as plaintext: `password_hash: b.newPassword as string`. The auth system uses `scrypt + salt` (`salt:hex` format). This overwrites a hashed password with plaintext, permanently breaking the user's login. | Use `hashPassword()` from auth.ts; store as `salt:hash` — exactly like signup (auth.ts L62). |
| 3 | **HIGH** | `lib/api/supabase/resources.ts` | 839 | api-contract | `listPayees` returns `ok(data ?? [])` — **no `snakeToCamel`**. Every other list function in this file wraps with `snakeToCamel`. The `user_id` field leaks as snake_case to the frontend, contradicting the API contract ("All data payloads use camelCase keys"). | Wrap: `ok(snakeToCamel(data ?? []))` — matches every other `list*` function. |
| 4 | **HIGH** | `lib/api/supabase/resources.ts` | 856 | api-contract | `createPayee` returns `ok(data)` — **no `snakeToCamel`**. Returns raw row with `user_id` in snake_case. Contract says "Creators/upserts return the created row (camelCase)." | Wrap: `ok(snakeToCamel(data))` — matches every other `create*` function. |
| 5 | **MEDIUM** | `lib/api/supabase/resources.ts` | 67-72 | code-quality | `savePreferences` builds `update` object with only the fields from `existing` row, but the `update` object omits `onboarding_completed` when `p.onboardingCompleted` is `undefined`. On a fresh user with no existing row, `existing` is `null`, so the upsert creates a row with only `user_id`, `financial_goals`, `risk_tolerance`, `money_fears` — `onboarding_completed` is absent and relies on the column default (`false`). This is correct but only by accident. | Add `onboarding_completed: existing?.onboarding_completed ?? false` as a default in the base update object, and keep the conditional override for explicit `true` from onboarding. Makes the intent explicit rather than relying on SQL DEFAULT. |
| 6 | **MEDIUM** | `lib/api/supabase/resources.ts` | 240-267 | perf | `listGoals` has N+1 query pattern: one query for goals, then a separate `goal_contributions` query per goal. For a user with many goals, this multiplies DB round-trips. | Use a single query with `select('*, goal_contributions(*)')` and let Supabase join, or use `Promise.all` at minimum. Not blocking but worth noting for scale. |
| 7 | **MEDIUM** | `supabase/migrations/0001_init.sql` | 1-223 | migration | `user_preferences.updated_at` has no trigger to auto-update on modification. The column always holds the initial `now()` value, never reflecting when preferences were last changed. | Add a `CREATE OR REPLACE FUNCTION` trigger that sets `updated_at = now()` on UPDATE, or remove the column if tracking isn't needed. |
| 8 | **LOW** | `supabase/migrations/0001_init.sql` | 1-2 | migration | Migration comment says "No RLS: BFF uses service-role key (bypasses RLS)." Correct for a BFF-only architecture, but should be flagged as a security boundary: if any client-side code ever calls Supabase directly (leaked anon key), data is unprotected. | Document this as a known architectural decision with the caveat. Consider adding RLS policies as a defense-in-depth layer for future-proofing. |
| 9 | **LOW** | `lib/api/supabase/helpers.ts` | 28-38 | code-quality | `snakeToCamel` processes the full object tree on every BFF response. For large payloads (e.g., transactions list with many fields), this creates temporary objects on every call. Fine for current scale but worth noting. | Current implementation is correct and clear. Optimize (lazy/map-only-when-needed) only if profiling shows it matters. |

---

## Findings by Focus Area

### 1. snakeToCamel Parity

**Verdict: 2 leaks found.**

All 25 raw-row returns were checked against `snakeToCamel` wrapping:

| Function | Wrapped? | Notes |
|----------|----------|-------|
| `listAccounts` | ✅ | |
| `createAccount` | ✅ | |
| `listTransactions` | ✅ | |
| `createTransaction` | ✅ | |
| `listBudgets` | ✅ | |
| `upsertBudget` (both paths) | ✅ | |
| `getSecurityOverview` | ✅ | Wrapped after spread — correct |
| `toggle2fa` | ✅ | Wrapped after spread — correct |
| `changePassword` | ✅ | Wrapped after spread — correct |
| `listDevices` | ✅ | |
| `listSecurityEvents` | ✅ | |
| `resolveSecurityEvent` | ✅ | |
| `listInvoices` | ✅ | |
| `createInvoice` | ✅ | |
| `updateInvoiceStatus` | ✅ | |
| `listVendors` | ✅ | |
| `createVendor` | ✅ | |
| `listTransfers` | ✅ | |
| `getTransfer` | ✅ | |
| `createTransfer` (both paths) | ✅ | |
| `listBills` | ✅ | |
| `payBill` | ✅ | |
| `scheduleBill` | ✅ | |
| **`listPayees`** | **❌** | **Issue #3** |
| **`createPayee`** | **❌** | **Issue #4** |

**Intentionally raw (verified)**: `createPayee` return is raw — **not intentional** per contract. Both `listPayees` and `createPayee` should use `snakeToCamel`. The contract states all responses use camelCase. (Note: `getMe` is hand-mapped and correctly stays raw from snakeToCamel — it does its own mapping.)

### 2. savePreferences Partial-Merge Correctness

**Verdict: Correct for the `onboardingCompleted` case. Functional for the fire-and-forget use case.**

The read-then-merge logic at `resources.ts:66-73`:
- Reads `existing` row before building the update.
- `financial_goals`, `risk_tolerance`, `money_fears`: use `p.field ?? existing?.field ?? default` — preserves existing value when not provided.
- `onboarding_completed`: only added to the update object when `p.onboardingCompleted !== undefined`. This is the key fix — a partial PUT (e.g., only `riskTolerance`) will NOT reset `onboarding_completed`.

**One edge case**: When `existing` is `null` (first-time save) and `onboardingCompleted` is not in the body, the upsert row omits `onboarding_completed` entirely, relying on the column `DEFAULT false`. This works correctly but is implicit — see Issue #5.

### 3. Fire-and-Forget Onboarding Save

**Verdict: Acceptable error handling. No unhandled rejection risk.**

The pattern at `page.tsx:28-32`:
```typescript
moneyApi.savePreferences({ onboardingCompleted: true }).catch((err) => {
  console.error('Failed to persist onboarding completion:', err);
});
router.replace('/dashboard');
```

- The `.catch()` handler prevents unhandled promise rejection.
- Navigation is never blocked — correct for a non-critical flag.
- The Supabase write is server-side; even if the component unmounts on navigation, the fetch completes server-side. The error will still be caught by `.catch()` (client-side fetch rejection fires on network error, not component unmount).
- Logging via `console.error` is appropriate given the app has no toast/notification system.

**No issues found.**

### 4. Security

| Check | Status | Notes |
|-------|--------|-------|
| No hardcoded secrets | ✅ | All secrets via `process.env` (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY). Verified in server.ts L12-13. |
| Service role key server-only | ✅ | `server.ts` creates client server-side; key never reaches browser. Route handler at `app/api/bff/[...path]/route.ts` gates on `isSupabaseConfigured()`. |
| Auth enforced on protected routes | ✅ | `requireUserId()` in every handler; throws UNAUTHORIZED on missing/invalid token. |
| Resource ownership checked | ✅ | All queries filter by `user_id = uid` from token. No trust of `user_id` from body. |
| No PII in error messages | ✅ | Error messages are generic ("Failed to create account", "Event not found"). Supabase error details not leaked to client (only the message). |
| Password hashing (signup/login) | ✅ | `auth.ts` uses `scrypt + salt` with `timingSafeEqual` verification. |
| **Password change hashing** | **❌** | **Issue #2 — stores plaintext. Issue #1 — comparison always fails.** |
| Input validation | ⚠️ | Basic validation present (amount > 0, name required). `savePreferences` accepts arbitrary `Record<string, unknown>` body — no schema validation on field types. Low risk for BFF-only endpoint. |
| SQL injection | ✅ | All queries use Supabase query builder (parameterized). No raw SQL. |

### 5. Migration Sanity

**Verdict: Solid v1 schema. Minor gaps noted.**

| Check | Status | Notes |
|-------|--------|-------|
| Idempotency | ✅ | All `CREATE TABLE IF NOT EXISTS`, all indexes `IF NOT EXISTS`. |
| Foreign keys | ✅ | All user-owned tables reference `users(id) ON DELETE CASCADE`. Cross-table FKs (goal_contributions → goals, pension_contributions → pension_plans) use `ON DELETE CASCADE`. Optional FKs (account references) use `ON DELETE SET NULL`. |
| Indexes | ✅ | Appropriate covering indexes on user+date patterns (`idx_transactions_user_date`, `idx_accounts_user_created`, etc.). Idempotency key unique constraint on transfers. |
| Enums | ⚠️ | No PostgreSQL enums used — all categorical fields (`status`, `type`, `direction`, `severity`) are `text` with app-level defaults. Acceptable for a v1 MVP; harder to enforce constraints. |
| Updated-at | ❌ | `user_preferences.updated_at` has no trigger — see Issue #7. |
| Check constraints | ⚠️ | No `CHECK` constraints on amounts (e.g., `amount > 0`). Relied on app-level validation. |
| Password resets | ✅ | Token and email are `UNIQUE`; `expires_at` column present for expiry. |

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2 |
| HIGH | 2 |
| MEDIUM | 3 |
| LOW | 2 |
| **Total** | **9** |

### Overall Verdict: **REJECT** ❌

Two critical security defects in `changePassword` block merge:
1. Password comparison is broken (always fails).
2. New passwords stored as plaintext (overwrites hashed password).

These must be fixed before this commit can merge. The fix is straightforward: import `verifyPassword` and `hashPassword` from `auth.ts` into `resources.ts` and use them in `changePassword`.

The two HIGH findings (missing `snakeToCamel` on `listPayees` and `createPayee`) should be fixed in the same pass — one-line changes.

---

## Verification Status

| Check | Status |
|-------|--------|
| `npx tsc --noEmit` | Not re-run (read-only review) |
| `npm run lint` | Not re-run (read-only review) |
| Code review | ✅ completed |
| Security review | ✅ completed (2 CRITICAL found) |
| Status | `verified` (review complete; findings documented for delegation) |
