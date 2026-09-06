# Implementation Summary — FE-001: Onboarding completion persistence

## Component
- `app/onboarding/welcome/page.tsx` — WelcomePage (onboarding step 4/4)

## What changed
- Finish button now persists `{ onboardingCompleted: true }` via `moneyApi.savePreferences` before navigating to `/dashboard`.
- Failure handling: fire-and-forget with `.catch` → `console.error` (no toast exists in the app; navigation is never blocked on this non-critical flag).
- No new hook added (`useSavePreferences` not created) — direct `moneyApi` call is the laziest correct option for a one-shot, non-critical mutation. React Query adds cache/loading machinery that isn't needed here.
- `stores/auth-store.ts` NOT modified — store holds only `UserProfile`, not preferences (YAGNI).

## API surface used
- `moneyApi.savePreferences(patch: Partial<UserPreferences>)` → `PUT /users/preferences` (`lib/api/money.ts` L146). Backed by mock `updatePrefs` (handlers.ts L152–159) and BFF `savePreferences` (resources.ts L58–78) — both already upsert `onboarding_completed`. No backend change.

## State handling
- Loading/error states: N/A — single fire-and-forget mutation, no UI state change.
- Error logged via `console.error` (existing pattern; matches no-toast app).

## Verification (ran on Windows, PowerShell)
- `npx tsc --noEmit` → PASS (0 errors)
- `npm run lint` → PASS (0 errors, 6 pre-existing warnings in untouched files: profile/page.tsx, vault/page.tsx, signup/page.tsx, lib/api/__tests__/money.test.ts, lib/hooks/use-money.ts)
- Status: `verified`