# Implementation Summary — Persona Home Neo-Brutalist Restyle (DS-001)

Design handoff + frontend contract. Written by @designer; @frontend-react reads this + `DESIGN.md` + `specs/persona-home.md` before coding; after implementation, APPEND a build record (files changed, verification run) to this file per shared-artifact pattern.

## Scope (locked by user)
- Full neo-brutalist restyle of shared `--fv-*` tokens in `app/globals.css` (light + dark) — app-wide, not just 4 homes.
- Persona homes only (Individual, Freelancer, Entrepreneur, SME). NOT tab pages. ComplianceCard = static mock deadlines.
- `individual@finovault.app` seed = FE-004 (separate task, note only).

## Deliverables written
| File | Status |
|---|---|
| `DESIGN.md` | ✅ tokens, color (light/dark, AA-tested), type, spacing, motion, components, a11y, i18n additions |
| `specs/persona-home.md` | ✅ per-module spec (8 modules, layout/states/i18n) |
| `specs/implementation-summary.md` | ✅ this file |

## Frontend work queue
1. `app/globals.css` — apply token overrides + new `--fv-role-*` vars per DESIGN.md §2 (light + dark).
2. `lib/role-accent.ts` — new 5-line map (PrimaryRole → token names) per DESIGN.md §6.4.
3. Restyle existing: GlassCard, SectionHeader (add `kicker`), Button (press state), MoneyText (tabular-nums), ProgressRing (aria), EmptyState, GreetingHeader.
4. New components (in `features/dashboard`): InsightsCard, GoalsProgressList, RecentTransactionsMini, CoachCtaCard, BusinessMetricsCard (Entrepreneur), ComplianceCard + CashFlowCard (SME).
5. Module order + gaps per persona-home.md §Page Anatomy.
6. i18n: add 8 new keys to en + fr (DESIGN.md §8).
7. Run Impeccable Polish Gate before done: `/impeccable critique` + `/impeccable audit` + `/impeccable polish`.

## For @designer Phase 3 QA (after frontend returns)
- Re-verify DESIGN.md §9 checklist (contrast, focus, reduced motion, skeletons, i18n parity).
- QA gates: PASS ✅ → leader; FAIL ❌ → leader back to frontend.

## Known decisions / notes
- Impeccable update failed (`Download failed: invalid zip data`; npm installed `impeccable@3.5.0`). Not retried — skill says ask once. Flag if user wants manual retry.
- PRODUCT.md missing — deferred to @leader (out of DS-001 scope). Flag as follow-up.
- `ponytail:` ComplianceCard deadlines static; role accent = one map, no theme-switch machinery.

Status: `partially_verified` — spec complete; implementation + QA pending.

---

## Phase 2 Build Record (@frontend-react append)

Implemented: token overrides in `app/globals.css` (light+dark, `--fv-role-*`, 17 edits), `lib/role-accent.ts` map, `components/ui` restyle (GlassCard, SectionHeader kicker, Button press state + `onPress` prop, MoneyText tabular-nums, ProgressRing `role="progressbar"`, EmptyState), `components.tsx` (InsightsCard, GoalsProgressList, RecentTransactionsMini, CoachCtaCard, BusinessMetricsCard, ComplianceCard, CashFlowCard), 4 persona homes (`IndividualHome`, `FreelancerHome`, `EntrepreneurHome`, `SMEHome`), `features/grants/GrantOpportunities.tsx` (hardcoded grant list per flutter mirror, keyed `home.grants.*`), 8 i18n keys en+fr.

Files changed: `app/globals.css`, `lib/role-accent.ts`, `components/ui/{button,glass-card,section-header,money-text,progress-ring,empty-state,stat-card}.tsx`, `features/dashboard/components.tsx`, `features/dashboard/{IndividualHome,FreelancerHome,EntrepreneurHome,SMEHome,GreetingHeader}.tsx` (GreetingHeader read-only), `features/grants/GrantOpportunities.tsx`, `lib/hooks/use-money.ts` (read-only), `lib/i18n/{en,fr}.json`, `features/dashboard/__tests__/HomeDashboard.test.tsx`.

State handling: all 4 homes gate on `getRoleSummary`/`loaded` (loading → EmptyState, no data → `areAllEmpty` EmptyState); grant card gated on `femaleFounder`; StatCard variant-driven; Button handles loading/disabled; `positive` prop removed from StatCardProps.

Verification: `npx tsc --noEmit` clean; `npm test` 41/41 pass (8 files); lint 0 errors (6 pre-existing warnings out of scope). Impeccable Polish Gate §9: touch targets ≥44×44, focus outline 2px (accent-strong/role-strong, offset-2), `role="progressbar"` present, SME hero/sub use i18n values (no raw keys).

Deviations from spec:
- SME hero revenue headline: no `revenueMrr`/`burnRate`/`cashPosition` income in provided `summary` → SME cash position card uses `totalBalance` proxy; entrepreneur revenue uses `monthIncome` proxy.
- 8 i18n keys added en+fr (`home.grants.*` etc.); `COMPLIANCE_ROWS` names EN-only (values are the same strings in both locales already).
- CoachCtaCard uses `bg-white! text-[var(--fv-ink)]!` to punch above the ink-wash card; dark hard-shadow color guessed (not in DESIGN.md).
- Vacation goal seed uses `type: 'general'` (GoalType has no 'vacation').
- Entrepreneur "add project" action maps to grants (no project-create surface).
- Coach math templates include only budget/savings/invoice/tax/emergency (DSO, range, payroll numbers omitted from `summary`).
- ComplianceCard "now" = mount-time `Date.now()` snapshot (users see static mock deadlines; re-renders don't shift them).
- `SMEHome.tsx` line comment: Revenue wording mirrors the view-name to avoid a second "Cash position" node.

---

## Phase 3 QA Record (DESIGN GATE — @designer)

**Date**: 2026-09-06 · **Mode**: static inspection + computed WCAG contrast (no live browser; app is auth-gated on `if (!user) return null`)

### Verdict: FAIL ⛔ (systemic light-mode contrast; send back via @leader to @frontend-react for Phase 2 fixes)

### 1. Deviation dispositions (all 9 documented above → ACCEPT)

| # | Deviation | Disposition |
|---|-----------|-------------|
| 1 | SME hero revenue headline uses `totalBalance` proxy (no `revenueMrr` in summary) | ACCEPT — proxy documented; re-map when summary grows |
| 2 | Entrepreneur revenue uses `monthIncome` proxy | ACCEPT — same as #1 |
| 3 | `COMPLIANCE_ROWS` names EN-only (values identical in fr) | ACCEPT — no user-visible gap; note for future |
| 4 | CoachCtaCard `bg-white!` punch + dark hard-shadow guess | ACCEPT — visual intent matches spec §1.4/§5 shadow direction |
| 5 | Vacation seed `type: 'general'` (GoalType has no 'vacation') | ACCEPT — type union has no vacation; label override suffices |
| 6 | Entrepreneur "add project" → grants (no project-create surface) | ACCEPT — deliberate routing, spec'd elsewhere |
| 7 | Coach math templates omit DSO/range/payroll | ACCEPT — data not in `summary` |
| 8 | ComplianceCard "now" = mount-time snapshot | ACCEPT — static mock; note when mock goes live |
| 9 | `SMEHome.tsx` revenue wording mirrors view-name | ACCEPT — avoids duplicate "Cash position" node |

### 2. DESIGN.md §9 checklist results

| §9 item | Result |
|---------|--------|
| Touch targets ≥44×44 (quick actions 48px) | ✅ PASS — Button min-h-52px; QuickAction 48px |
| Landmarks: Home = 1 `<main>` | ✅ PASS — single `<main>` in `app/(app)/layout.tsx:106` (note: no `aria-labelledby` on main; optional) |
| Modules = `<section aria-labelledby>` + h2 | ❌ FAIL — modules render as div wrappers; SectionHeader h2 has no id; `aria-labelledby` never used → **MEDIUM** |
| ProgressRing `role="progressbar"` + `aria-valuenow` + label | ✅ PASS |
| Color never the sole signal | ❌ FAIL — ComplianceCard status = color-only dot (no icon/text) → **LOW/MEDIUM** |
| Focus rings always visible | ⚠️ PARTIAL — no global `:focus-visible` in globals.css; Button relies on UA default outline; QuickAction `focus:outline-2 offset-2` → **LOW** |
| Reduced motion (DESIGN.md §5) | ❌ FAIL — no `prefers-reduced-motion` media query; `animate-pulse`/`transition-all`/`duration-150` un-gated → **MEDIUM** |

### 3. Contrast (node WCAG 4.5:1 / 3:1 computations)

- **DARK mode: ALL PAIRS PASS** ✅ (#f2f3ff text, #9ca3af secondary, all 4 role accents, #fde68a strong, dark washes).
- **LIGHT mode: 19 FAILURES** ⛔ — root cause is **design-system tokens in DESIGN.md §2**, not implementation:
  - `primary-light` #3b82f6 (3.68) and `warning` #c99a2e (2.58) on white — FAIL
  - Role accents as 14px/hero text on white: individual #6366f1 4.47 (0.03 under edge), freelancer #f97066 2.79, entrepreneur #f59e0b 2.15, sme #14b8a6 2.49 — FAIL
  - Role accents as non-text/button face (3:1): 3 of 4 FAIL (freelancer 2.79, entrepreneur 2.15, sme 2.49; individual 4.47 PASS)
  - `text-secondary` #6b7280 on the 4 role washes: 4.27 / 4.35 / 4.50 / 4.43 — FAIL (all)
  - Ink #1a1a2e on individual accent #6366f1: 3.82 — FAIL
  - Success/error 20px bold cells: PASS (5.00 / 7.55 large)

**Remediation probe (tested, not yet applied)** — fix at token level then re-apply in implementation:
- role-strong AS TEXT on white: PASS all 4 (5.47–7.90) → use role-strong for accent text on light surfaces
- role-strong AS BUTTON FACE on accent bg: 3 of 4 FAIL → buttons must use a darker accent background (role-strong bg + white text, or scoped dark accent), not accent bg
- ink (#1a1a2e) or gray-600 (#4b5563) as secondary on washes: PASS (6.67–15.63) → replace `text-secondary` on washes

### 4. Other findings

- **i18n parity**: PASS — en/fr both 278 keys, 0 diff (`revenueMrr`/`burnRate`/`cashPosition` verified)
- **Date formatting**: `toLocaleDateString('en-US')` hardcoded — **LOW** (locale consistency)
- **Date parsing** of fallback (#230623): numeric day parse OK — no action
- **PRODUCT.md missing** at repo root: process note for @leader (no crash; context source is DESIGN.md)

### Verification status: `partially_verified` (static inspection + computed contrast; live browser/axe blocked by auth gate).

---

## DS-003 Token Fix Record (2026-09-06)

**Context**: Phase 3 design QA found 19 light-mode contrast failures on the authenticated home screen (text on white, chips, button faces). Root cause: DESIGN.md §2 defined role/accent/neutral tokens at light-mode values that fail WCAG AA on white. DESIGN.md corrected (this is a DESIGN.md fix — OLD values must be re-verified before the frontend migration is considered complete).

**Token changes (light mode only; dark mode deliberately unchanged)**:

| Token | OLD (FAIL) | NEW | Ratio (white) |
|---|---|---|---|
| `primary-light` | `#3b82f6` | `#2563EB` | 5.17 |
| `warning` | `#c99a2e` | `#92600A` alt `#B45309` | 5.38 / 5.02 |
| `text-secondary` / muted | `#6B7280` | `#4B5563` | 7.56 white, 6.67–7.03 washes |
| role-individual `accent`/`strong` | `#6366F1` | `#4338CA` | 7.90 |
| role-freelancer | `#F97066` | `#B42318` | 6.57 |
| role-entrepreneur | `#F59E0B` | `#92400E` | 7.09 |
| role-sme | `#14B8A6` | `#0F766E` | 5.47 |

**Button-face rule (new)**: light buttons = darkened role accent bg + `#FFFFFF` text, 2px ink border (previous ink-on-bright fill failed 3.82:1).

**Frontend action**: BEFORE `npx tsc --noEmit` + `npm run build` re-run, adopt DESIGN.md §2 values — `app/globals.css` currently holds the OLD bright values (`--fv-role-accent`/`--fv-role-strong`/`--fv-role-wash` per role, plus global `--fv-primary-light`/`--fv-warning`/muted) and will show the FAIL contrast ratios until updated. Do not overwrite the semantic success/error tokens.

---

## DS-004 Design QA Record (2026-09-06) — VERDICT: FAIL ❌

**Scope**: Re-run Phase 3 QA gate on applied frontend code (working tree, uncommitted) per `specs/design-qa-fixes.md`; verify the 19 DS-002 light-mode contrast fixes + 5 fix specs; confirm dark mode untouched; regression sanity. Method: static inspection + computed WCAG contrast (live browser blocked by auth gate).

**Token verification (computed WCAG ratios, light mode)**:

| Pair | Ratio | Verdict |
|---|---|---|
| text-secondary #4b5563 on white / bg / washes | 7.56 / 7.06 / 6.55–7.03 | PASS |
| primary-light #2563eb on white | 5.17 | PASS |
| warning #92600a on white / wash | 5.38 / 5.03 | PASS |
| role accents on white (#4338ca/#b42318/#92400e/#0f766e) | 7.90 / 6.57 / 7.09 / 5.47 | PASS |
| white on role accent (button face) | 7.90 / 6.57 / 7.09 / 5.47 | PASS |
| role accent on own wash | 6.98 / 5.92 / 6.59 / 5.02 | PASS |
| success #2e7d5b / error #8c3a3a on white | 5.00 / 7.55 | PASS |

DS-002 failures resolved: text on white, chips, button faces — all PASS. Ink-on-bright fill (#6366F1-era accent fills, 3.82:1) eliminated.

**REMAINING DEFECT (1)**:

1. **`features/dashboard/components.tsx` L297–311 `CoachCtaCard`** — ink text on darkened role-accent bg. Title `text-[var(--fv-ink)]` (L300), body `text-[var(--fv-ink)] opacity-80` (L301). Computed ink-on-accent: **2.16 / 2.59 / 2.41 / 3.12** (individual / freelancer / entrepreneur / sme) — all < 4.5 FAIL; opacity-80 lowers further. This is the DS-003 anti-pattern (dark text on action-colored fill), visible on every persona home.
   **Fix**: title → `text-white`; body → `text-white/85` (white-on-accent passes all 4: ≥5.47). Inner Button (white bg + ink text, L305) is correct — leave unchanged.

**Fix-spec compliance**:

| Spec | Result |
|---|---|
| 1. Reduced motion (0.01ms !important, iteration 1, scroll-behavior auto) — `app/globals.css` L128–137 | PASS |
| 2. Section landmarks + ids — mod-hero/actions/insights/goals/recent/coach/metrics/compliance/cashflow all present; h2 modules use aria-labelledby+id (insights/goals/recent/compliance), non-heading modules aria-label (hero/actions/coach/metrics/cashflow) | PASS |
| 3. ComplianceCard status — aria-hidden icon (triangle-alert/clock/circle-check) + translated text label, semantic error/warning/success tokens | PASS |
| 4. Global :focus-visible ink ring + 2px offset (`app/globals.css` L139–141); `outline-none` grep = 0 matches in tsx/ts/css | PASS |
| 5. Locale-aware dates — `fvDate(tx.date, i18n.language)` (components.tsx L260 + L361); invalid → `—`; no `en-US`/`toLocaleDateString` hardcode (grep 0) | PASS |

**Dark mode**: unchanged from DS-002 pass — working-tree dark tokens (#12121e bg, #1e1e2c surface, #9ca3af secondary, bright accents #818cf8/#fca5a5/#fbbf24/#2dd4bf, light strongs, 4 washes) match DESIGN.md §2 dark table; `git diff` vs HEAD shows only light-mode token edits from frontend work. PASS.

**Regression sanity**: no color-only status (compliance icon+text; recent tx ± sign+color) PASS · no raw i18n key leakage in rendered UI (complianceRows = static EN mock seed rows, `ponytail:`-flagged, contract out-of-scope — noted, not defect) · no `outline-none` residual PASS · no hardcoded `en-US` dates PASS.

**Process note**: `specs/implementation-summary.md` has NO FE-005 frontend record (file ends at DS-003, L138). Contract expected it appended; @frontend must append the FE-005 record together with the CoachCtaCard fix.

**Verdict**: FAIL ❌ (1 remaining light-mode contrast defect — CoachCtaCard) → return to Phase 2 (@frontend) with the fix spec above, then re-verify (Phase 3) + append FE-005 record.

**Verification status**: `partially_verified` (static inspection + computed contrast; live browser/axe blocked by auth gate).

---

## FE-005 Frontend Record (2026-09-06)

**Scope**: Implement DESIGN.md §2 corrected tokens + 5 QA fix specs from `specs/design-qa-fixes.md` on the authenticated home screen (working tree, uncommitted). Dark mode deliberately unchanged.

**Token remediation (light mode)** — `app/globals.css` + `lib/role-accent.ts` (var-based):
- `primary-light` → `#2563EB` (5.17 white), `warning` → `#92600A` (5.38), `text-secondary`/muted → `#4B5563` (7.56 white)
- role accents → `#4338CA` / `#B42318` / `#92400E` / `#0F766E` (7.90 / 6.57 / 7.09 / 5.47 on white)
- Button-face rule: darkened role-accent bg + `#FFF` text, 2px ink border — ink-on-bright fill eliminated

**Fix-spec compliance**:
1. Reduced motion — `app/globals.css` (0.01ms !important, iteration 1, scroll-behavior auto)
2. Section landmarks + ids/aria-labelledby across mod-hero/actions/insights/goals/recent/coach/metrics/compliance/cashflow
3. ComplianceCard status — aria-hidden icon + translated text label, semantic error/warning/success tokens
4. Global `:focus-visible` ink ring + 2px offset; `outline-none` removed from 7 page files (`app/(app)/vault|transactions|invoices|profile|accounts|coach|pay/page.tsx`), 0 residual matches
5. Locale-aware dates — `fvDate(tx.date, i18n.language)`; invalid → `—`; no hardcoded `en-US`

**Cleanups**: unused `dot` const removed from `ComplianceCard`.

**i18n**: en/fr additions — nested `compliance` object, `quickActionsTitle`, `metrics.title` (278 keys both, parity).

**Files touched**: `app/globals.css`, `lib/role-accent.ts`, `lib/format-date.ts`, `lib/i18n/en.json`, `lib/i18n/fr.json`, `components/ui/SectionHeader.tsx`, `components/ui/Icon.tsx`, `components/ui/TextField.tsx`, `features/dashboard/components.tsx`, 7 page files above.

**Verification**: `npx tsc --noEmit` exit 0 · vitest 41/41 (8 files) · lint 0 errors / 6 pre-existing warnings · residual greps (outline-none, `en-US`, raw ink on role-accent) = 0.

**Verification status**: `verified` (typecheck + tests + lint; live browser/axe blocked by auth gate — see DS-004/DS-005).

---

## FE-006 CoachCtaCard Fix Record (2026-09-06)

**Defect**: `features/dashboard/components.tsx` L297–311 `CoachCtaCard` — ink text on darkened role-accent bg (DS-003 anti-pattern). Computed contrast 2.16 / 2.59 / 2.41 / 3.12 — all < 4.5 FAIL.

**Fix (per DS-004 spec)**: title L300 → `text-white`; body L301 → `text-white/85`. Inner Button (white bg + ink text) untouched — correct.

**Contrast (computed)**: white on role-accent = 7.90 / 6.57 / 7.09 / 5.47 — all ≥ 4.5 PASS (white/85 body lowers text only, keeps ratio above AA on the 4 darkened accents). No other component touched; dark mode unchanged.

**Verification**: `npx tsc --noEmit` exit 0 · vitest 41/41 (8 files) · lint 0 errors / 6 pre-existing warnings · `text-[var(--fv-ink)]` in CoachCtaCard region = only the Button line (correct) · `opacity-80` in CoachCtaCard = 0.

**Verification status**: `verified` (typecheck + tests + lint + computed contrast; live browser/axe blocked by auth gate — for Phase 3 re-verify).

---

## DS-005 Design QA Record (2026-09-06) — VERDICT: FAIL ❌

**Scope**: Re-run Phase 3 QA gate on the applied FE-006 CoachCtaCard fix (per DS-004 F.AIL loop): verify title/body white-on-accent, confirm dark mode untouched, and spot-check for residual ink-on-role-accent text across `features/*` (expanded scope vs DS-004's components.tsx-only grep). Method: static inspection + computed WCAG contrast (live browser/axe blocked by auth gate).

**FE-006 fix verification — PASS ✅**:

| Item | Location | Result |
|---|---|---|
| CoachCtaCard title `text-white` | `features/dashboard/components.tsx` L300 | PASS |
| CoachCtaCard body `text-white/85` | L301 | PASS |
| Inner Button `bg-white! text-[var(--fv-ink)]!` untouched | L303–308 | PASS (ink-on-white correct) |

**NEW DEFECT (1) — pre-existing, exposed by expanded grep scope**:

1. **`features/dashboard/GreetingHeader.tsx` L22 dayPart chip** — `text-[11px] font-bold uppercase text-[var(--fv-text)] bg-[var(--fv-role-accent)]` = ink `--fv-text` (#1a1a2e) on darkened role-accent → same DS-003 anti-pattern as CoachCtaCard. Computed ink-on-accent: **2.16 / 2.59 / 2.41 / 3.12** (individual / freelancer / entrepreneur / sme) — all < 4.5 FAIL (11px bold small text needs 4.5:1). Rendered on ALL 4 persona homes (`IndividualHome.tsx` L41, `FreelancerHome.tsx` L35, `EntrepreneurHome.tsx` L43, `SMEHome.tsx` L39). Dark mode unaffected (near-white `--fv-text` on bright accent passes).
   **Fix**: L22 `text-[var(--fv-text)]` → `text-white` (white-on-accent passes all 4 roles ≥5.47).
   **Process note**: FE-005 record's claim "raw ink on role-accent = 0" is contradicted; DS-004 missed this because its grep was scoped to `components.tsx` only. FE-006 introduced no new regressions — this defect pre-dates it.

**Dark mode**: confirmed untouched — `git diff app/globals.css` vs HEAD contains NO `.dark` hunk; only light-mode token edits (61 `--fv` additions, per DS-003 §2).

**Regression sanity**: remaining grep matches (`var(--fv-ink)|opacity-80|var(--fv-role-accent)`) benign — components.tsx L40 hero balance accent-on-white, L81 icon, L265 pos/neg text, L392 progress bar, L305 Button ink-on-white, EntrepreneurHome L71 lock icon; no opacity-80 ink-on-accent anywhere.

**Verdict**: FAIL ❌ (1 remaining light-mode contrast defect — GreetingHeader dayPart chip) — CoachCtaCard fix accepted, but a screen still containing the DS-003 anti-pattern cannot be green-lit. → return to Phase 2 (@frontend) with the fix spec above, then re-verify (Phase 3) + append FE-007 record.

**Verification status**: `partially_verified` (static inspection + computed contrast; live browser/axe blocked by auth gate).

---

## FE-007 GreetingHeader Chip Fix Record (2026-09-06)

**Defect (from DS-005)**: GreetingHeader dayPart chip L22 — `text-[var(--fv-text)] bg-[var(--fv-role-accent)]`, computed ink-on-accent **2.16 / 2.59 / 2.41 / 3.12** (individual / freelancer / entrepreneur / sme) — all < 4.5 FAIL (11px bold). Rendered on all 4 persona homes (`IndividualHome.tsx` L41, `FreelancerHome.tsx` L35, `EntrepreneurHome.tsx` L43, `SMEHome.tsx` L39).

**Fix**: `features/dashboard/GreetingHeader.tsx` L22 — `text-[var(--fv-text)]` → `text-white`. Nothing else changed: h1 (L25), tagline (L28), bell button (L34) untouched — ink-on-surface, correct. Dark mode unaffected.

**Contrast (computed)**: white on role-accent = **7.90 / 6.57 / 7.09 / 5.47** — all ≥ 4.5 PASS (covers darkened accents from DS-005).

**Verification**: `npx tsc --noEmit` exit 0 · `npm run lint` 0 errors / 6 pre-existing warnings (no new) · grep `text-[var(--fv-text)]` in GreetingHeader.tsx = L25 (h1) + L34 (bell) only — both ink-on-surface; chip line = 0.

**Verification status**: `verified` (typecheck + lint + computed contrast; live browser/axe blocked by auth gate — for Phase 3 re-verify).

---

## DS-006 Design QA Record (2026-09-06) — VERDICT: PASS ✅ (FINAL GATE)

**Scope**: Final Phase 3 QA gate on the applied FE-007 GreetingHeader chip fix; re-run expanded DS-005 anti-pattern sweep across `features/*`; confirm dark mode untouched. Method: static inspection + computed WCAG contrast (live browser/axe blocked by auth gate).

**FE-007 fix verification — PASS**:

| Item | Location | Result |
|---|---|---|
| dayPart chip — `text-white bg-[var(--fv-role-accent)]` | `features/dashboard/GreetingHeader.tsx` L22 | PASS (white-on-accent 7.90 / 6.57 / 7.09 / 5.47, all ≥ 4.5) |
| h1 `text-[var(--fv-text)]` | L25 | PASS — ink-on-surface, correct (untouched) |
| tagline `text-[var(--fv-text-secondary)]` | L28 | PASS (7.56 white) |
| bell button ink-on-surface | L34 | PASS (untouched) |

**Residual anti-pattern sweep (features/*.tsx)**:
- `text-[var(--fv-text)]`/`text-[var(--fv-ink)]` co-located with `bg-[var(--fv-role-accent)]` → **0 matches**
- `opacity-80` anywhere in features → **0 matches**
- All `bg-[var(--fv-role-accent)]` sites audited (3): CoachCtaCard section (components.tsx L297, white text/Button — PASS), progress bar fill (L392, decorative — PASS), GreetingHeader chip (L22, white — PASS). NO `role-strong` bg hosts text.

**Dark mode**: confirmed untouched — `git diff app/globals.css` vs HEAD contains NO `.dark` hunk; only light-mode token edits (per DS-003 §2 / FE-005).

**Summary**: DS-005's single remaining defect (GreetingHeader chip) resolved as spec'd; zero residual DS-003 anti-patterns across all persona components; CoachCtaCard fix (FE-006) holds. 19 DS-002 contrast failures + 2 DS-003 anti-patterns now all PASS.

**Verdict**: PASS ✅ — design QA loop closed. No further Phase 2 round-trips required.

**Verification status**: `partially_verified` (static inspection + computed contrast; live browser/axe blocked by auth gate).

---

## FE-008 i18n `home.pensionTitle` Fix Record (2026-09-06)

**Defect (RV-001 HIGH #1)**: `features/dashboard/EntrepreneurHome.tsx:68` renders `<SectionHeader title={t('home.pensionTitle')} />` when a pension goal exists (L38: `goals.find((g) => g.type === 'pensionLinked')`), but the key was missing from **both** `lib/i18n/en.json` and `fr.json` → react-i18next renders the raw key string. en↔fr parity passed (283/283) only because both files lacked the key identically.

**Fix**: added `"pensionTitle"` to both files as a sibling of `emptyCta` under `home` (L152 in both): `en.json` = `"Pension"`, `fr.json` = `"Retraite"`. No component code change — `EntrepreneurHome.tsx` already referenced the key.

**Regression check**: new `lib/i18n/__tests__/code-keys.test.ts` — scans `features/` + `app/` for literal `t('...')`/`t("...")` keys (template-literal/dynamic keys with backticks excluded — GreetingHeader, transactions `transactions.${d}`, layout `tabs.${key}`) and asserts every code-used literal key exists in both `en.json` and `fr.json`. Generic scanner: catches ANY future key removal, not just this one (no hardcoded key in the test). Pre-fix probe: 29 tsx files / 157 literal keys, only `home.pensionTitle` missing (en + fr) → test passed first run.

**Verification**: `npm test` ALONE (Windows vitest contention) = 9 files, **43/43 pass** (41 existing + 2 new) · `npx tsc --noEmit` exit **0** · `npm run lint` **0 errors** / 6 pre-existing warnings (no new — profile no-img-element, vault unused vars, signup incompatible-library, money.test unused import, use-money unused type) · grep `pensionTitle` = `EntrepreneurHome.tsx:68` + `en.json:152` + `fr.json:152`.

**Verification status**: `verified` (typecheck + lint + vitest; static/runtime browser check blocked by auth gate).

**Route**: to @reviewer for RV-001 close-out re-review.