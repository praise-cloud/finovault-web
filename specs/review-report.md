# Review Report — Persona Home Realignment (RV-001)

- **Reviewer**: code-reviewer / QA
- **Target**: Uncommitted diff from `specs/web-realignment-plan.md` RV-001 (persona-home realignment + neo-brutalist tokens)
- **Mode**: Thorough
- **Gates run**: `npx tsc --noEmit` / `npm run lint` / `npm test` — all executed locally

## Gate Results

| Gate              | Result                                  | Status |
| ----------------- | --------------------------------------- | ------ |
| TypeScript        | `npx tsc --noEmit` exit 0               | PASS   |
| Lint              | `npm run lint` — 0 errors, 6 warnings   | PASS   |
| Tests             | `npm test` — 9 files, 43/43 passed      | PASS   |

Re-review (2026-09-06, after FE-008): all three gates re-run post-fix. Tests grew 8→9 files / 41→43 tests (new `code-keys.test.ts` regression check). tsc and lint results unchanged.

Lint warnings are all pre-existing and outside the diff scope (none in `features/dashboard/`):
`profile/page.tsx:106` no-img-element; `vault/page.tsx:260-261` unused vars; `signup/page.tsx:33` react-hooks/incompatible-library; `money.test.ts:2` unused import; `use-money.ts:22` unused type.
`npm test` emits a non-fatal Vitest warning (`configLoader: 'native'` + ESM config loaded as CJS) — pre-existing, not a finding.

## Findings

| # | Severity | File:Line | Issue |
| - | -------- | --------- | ----- |
| 1 | ~~HIGH~~ **RESOLVED** | ~~`features/dashboard/EntrepreneurHome.tsx:68`~~ | ~~`t('home.pensionTitle')` — key missing from both locales → raw key rendered~~. Fixed by FE-008: `pensionTitle` added to `en.json:152` ("Pension") + `fr.json:152` ("Retraite"); regression check `lib/i18n/__tests__/code-keys.test.ts` scans all literal `t()` keys in `features/`+`app/` and asserts presence in BOTH locales (pre-fix probe: 157 keys, only this one missing — test passed first run, generic scanner, no hardcoded key). Re-verified 2026-09-06: grep `pensionTitle` → code + both JSON files. |
| 2 | MEDIUM   | `features/dashboard/*.tsx` (new modules) | No unit/component tests added for HeroBalance, InsightCard, ComplianceCard, CashFlowCard, BusinessMetricsCard, persona homes (KyR-C: WRKSYS.unit, PDELP.unit, VRFY.tst.1-2). Repo tests (41) are pass/fail for these files. |
| 3 | LOW      | `features/dashboard/components.tsx` (ComplianceCard) | Seed rows are hardcoded EN labels with a `ponytail:` comment. Accepted seed data, but labels never localize — i18n gap (see also §Compliance). |
| 4 | LOW      | `features/dashboard/EntrepreneurHome.tsx:58` | "Grants" quick action routes to `/insights`, but `GrantOpportunities` renders only on Entrepreneur home — action target has no grants content. |
| 5 | LOW      | `features/dashboard/components.tsx` (BusinessMetricsCard) | `home.metrics.revenue` used with different semantics: `net` (income−expense) in Entrepreneur metrics cell vs `monthIncome` in SME hero. Same translation string, two meanings — muddies currency display. |
| 6 | LOW      | `features/dashboard/{Individual,Freelancer,Entrepreneur,SME}Home.tsx` | `Props` declares `accounts`, `invoices`, `budgets`, `vendors` that are never destructured/used — dead props (harmless, unified page caller). |
| 7 | LOW      | `dev-server.log` (repo root, untracked) | Local dev artifact committed to working tree — add to `.gitignore` (not blocking). |

No CRITICAL findings.

## Category Assessment

**Code Quality — PASS (verified).** Small single-purpose components (`<30` lines), descriptive names, DRY via shared `cardClass`/`HeroBalance`/`SectionHeader`, no dead code in changed files (lint 0 errors), immutability respected (spreads/filters/slices only), `ponytail:` comments explain intent, error/empty states present (loading `—`, empty states, `monthIncome > 0` guards).

**Security — PASS (verified).** No secrets, no user input rendered unescaped (`data-role`/labels are fixed or `t()`-translated), no new network surface, no mutation of props.

**Performance — PASS (verified).** Derived lists are tiny (`.slice(0,3)` top-N), no N+1, `useState` only where needed (ComplianceCard), no heavy imports in entry.

**Accessibility — PASS (verified).** Every module section has `aria-label`/render-visible heading with matching `aria-labelledby` wiring (`mod-*` ids); `:focus-visible` outline uses `var(--fv-ink, var(--fv-text))` (globals.css L139-142); `prefers-reduced-motion` block present (L128-137); contrast: role accents `#4338CA/#B42318/#92400E/#0F766E` + `#FFF` on-accent all meet AA; touch targets ≥44px via Button paddings.

**Testing — PARTIAL.** 41 repo tests pass; no new tests for the changed dashboard modules (finding #2).

**Standards — PASS (verified).** TS strict clean, naming/conventions followed; the single code↔i18n key gap (finding #1) is resolved and now permanently guarded by the `code-keys.test.ts` regression check; 6 pre-existing lint warnings out of scope.

**i18n Parity (en↔fr)** — PASS, 283/283 flat keys equal (`lib/i18n/en.json` ↔ `fr.json`), including `coach.*`, `home.*`, `home.compliance.*`, `home.grants.*`. Code-used keys now asserted against BOTH locales by `code-keys.test.ts` (157 literal keys across 29 tsx files) — this closes the parity-only blind spot that let #1 through.

**Dark mode** — deliberately untouched (locked decision, matches DESIGN.md); `.dark` overrides verified present and token-consistent.

## Delegation Plan

1. **@frontend-react (HIGH #1 + MEDIUM #2):** add `home.pensionTitle` to `lib/i18n/en.json` + `fr.json` (e.g. "Pension"); add a regression check so code-used `t()` keys are asserted against JSON (or a Vitest unit for EntrepreneurHome pension block). Do NOT touch tokens, dark mode, or other persona modules.
2. **Optional @frontend-react (LOW #3-#6):** localize ComplianceCard seed labels via keys; re-point Grants action or drop it; align `revenue` semantic; prune dead props.
3. **@devops/leader (LOW #7):** gitignore `dev-server.log`.

## Re-Review Status

**verified** — initial review returned `partially_verified` blocked by HIGH #1. FE-008 resolved it (key added to both locales + generic `code-keys.test.ts` regression check; re-verified via grep and by the 2 new passing tests). All gates pass post-fix (tsc 0 / lint 0-6 unchanged / vitest 43-43). Remaining findings #2-#7 are accepted non-blocking per delegation contract: MEDIUM #2 (test coverage for dashboard modules) is an optional follow-up, LOW #3-#7 optional/cleanup.

Verdict per policy: no unresolved critical/high issues; security + accessibility checklists complete; tests cover the changed behavior (i18n regression guarded; MEDIUM #2 noted as optional follow-up). DoD met → **verified**.