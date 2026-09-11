# Plan — Dark Theme + Financial Layout (Brutalist)

- Status: `planned` — Phase 0 complete, execution follows
- Author: @leader (IT Leader)
- Date: 2026-09-10
- Branch: `feat/dark-theme-financial-layout`
- Inputs: `DESIGN.md` (dark tokens §2.3 exist), `app/globals.css` (`.dark` class exists, never applied), `app/(app)/layout.tsx` (app shell), page inventory below
- User request: dark theme + layout that reads as a **financial web application**, **keep the neo-brutalist style**, update features + APIs as needed, execute.

## 1. Current State (verified)

- **Dark tokens already defined** in `DESIGN.md` §2.3 and `globals.css` `.dark` (lines 61–103): bg `#12121E`, surface `#1E1E2C`, text `#F2F3FF`, border flips to light ink, role palettes per persona. **Nothing applies `.dark`** — no toggle, no `prefers-color-scheme`, no persistence.
- **Known gap in globals.css**: `.dark` `--fv-border-ink` / `--fv-shadow-hard` carry a `ponytail:` comment ("dark ink/hard-shadow color guessed") — designer must confirm exact values.
- **App shell** (`app/(app)/layout.tsx`): sidebar (nav: dashboard, accounts, transactions, budgets, invoices, vendors, vault, pay, insights, coach, profile) + top bar (user name, notification bell, plan badge).
- **Pages**: dashboard, accounts, transactions, budgets, invoices, vendors, vault, pay, insights, coach, profile (+ auth + onboarding).
- **Backend**: mock (`lib/api/mock/*`) + Supabase BFF (`lib/api/supabase/*`), response envelope, existing endpoints for auth/preferences/notifications/goals/transactions.
- **Design QA precedent**: DS-003 FAIL → fixes → DS-004 PASS; dark tokens were AA-specified in DESIGN.md but never implemented.

## 2. Scope

### In scope
1. **Dark theme** — theme toggle (light / dark / system) in the app shell, persisted, applied to `<html>`, SSR-safe (no flash). Component audit: replace hardcoded light colors with `--fv-*` tokens.
2. **Financial layout** — redesign of the app shell + dashboard so it reads as a financial web app (balances, accounts overview, transaction feed, spending signals) while **preserving neo-brutalist** (2px ink borders, hard offset shadows, ink-first text, pressed=moved).
3. **Features + APIs** — endpoints the new layout needs (accounts list w/ balances, transaction feed, spending summary) in **mock + BFF**, contract-first via `api-contract.md`.
4. **i18n** — new keys en + fr (parity test enforced).
5. **Tests** — unit + E2E for theme toggle and new dashboard modules.

### Out of scope
- No new auth flows, no real payment integration, no DB schema migration beyond what the BFF endpoints require (grants already in place).
- No change to onboarding flow.

## 3. Pipeline (3-phase UI pipeline, mandatory)

```
Phase 0  PLAN        @leader        → specs/plan-dark-financial.md (this file), commit + push
Phase 1  DESIGN      @designer      → DESIGN.md update + specs/dark-financial-*.md (tokens, layout, component map, states, a11y)
Phase 2  CONTRACT    @leader        → api-contract.md additions (accounts, transactions, spending)
Phase 3  BACKEND     @node-developer → mock + BFF endpoints per contract
Phase 4  IMPLEMENT   @frontend-react → theme toggle + layout + dashboard modules per design specs
Phase 5  DESIGN QA   @designer      → PASS ✅ / FAIL ❌ (back to Phase 4)
Phase 6  VERIFY      @leader        → tsc, lint, tests, E2E, report
```

## 4. Task Breakdown

| ID | Agent | Task | Input | Output |
|---|---|---|---|---|
| DS-005 | @designer | Dark theme + financial layout design | DESIGN.md, globals.css, layout.tsx, page inventory | DESIGN.md update, `specs/dark-financial-tokens.md`, `specs/dark-financial-layout.md` |
| — | @leader | API contract additions | DS-005 specs | `api-contract.md` (accounts/transactions/spending) |
| BE-007 | @node-developer | Accounts + transactions + spending endpoints (mock + BFF) | api-contract.md | endpoints, types, tests |
| FE-005 | @frontend-react | Theme toggle (SSR-safe) + component dark audit | DS-005 specs | toggle component, token fixes |
| FE-006 | @frontend-react | Financial layout + dashboard modules | DS-005 specs, api-contract.md | layout + components, i18n keys |
| DS-006 | @designer | Design QA on implementation | FE-005/FE-006 code | PASS/FAIL report |
| — | @leader | Verification gates | all | tsc/lint/test/E2E report |

## 5. Key Decisions (leader-level)

- **Theme**: toggle in top bar (sun/moon/system), persisted to localStorage, `classList` on `<html>`, inline script in root layout to avoid FOUC. Default = system.
- **Contract-first**: FE-006 and BE-007 share `api-contract.md` — no parallel drift.
- **Brutalist preserved**: any layout change must keep 2px ink borders + hard offset shadows + ink-first text (DESIGN.md §1). Designer owns the visual direction; leader enforces the constraint.
- **Dark token confirmation**: designer resolves the `ponytail:` guessed dark ink/shadow values before implementation.

## 6. Verification

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors
- `npm test --pool=threads` — all pass (existing 60 + new)
- E2E: theme toggle persists; dashboard modules render (mock mode)
- Design QA: DS-006 PASS required before final report
- Manual: `http://localhost:3001` mock mode, toggle light↔dark, no hardcoded-light artifacts in dark

## 7. Risks

- **Hardcoded colors** scattered in components → audit is the bulk of FE-005; designer provides the token map.
- **FOUC** on theme load → inline script in `app/layout.tsx`.
- **API drift** → single `api-contract.md` owned by leader, both agents read the file.
- **Dark contrast** → designer re-checks AA per DESIGN.md §2.3 before implementation.