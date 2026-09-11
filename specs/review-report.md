# Design QA Report — DS-008 (FE-009: Expanded Sidebar + 6 New Pages)

- Status: **PASS ✅**
- QA by: @designer (impeccable critique + audit, Phase 3)
- Date: 2026-09-11
- Source of truth: `specs/sidebar-navigation.md` (DS-007) | Implementation: `specs/implementation-summary.md` (FE-009)
- Verification status: `verified` — every spec item checked against actual code. (Code-level claims — tsc 0 errors, eslint exit 0, 60/60 tests — taken from FE-009 notes; not re-run in design QA.)

## Checklist Results

| # | Spec item | Result |
|---|---|---|
| 1 | Sidebar structure §1/§2: 7 groups, 18 items, icons, routes, pinned Account | ✅ PASS |
| 2 | States §3: active wash+ink border+semibold+`aria-current`; idle `border-2 border-transparent` (zero shift); hover `--fv-border-subtle`; focus-visible global 2px `--fv-ink` (globals.css:153) | ✅ PASS |
| 3 | Mobile `w-16`: group labels → `h-px` divider (`aria-hidden`), icon-only items + `aria-label` | ✅ PASS |
| 4 | A11y §7: `role="group"` + `aria-labelledby` per group (incl. Account); touch targets `py-3` ≈ 48px ≥ 44px; focus ring never removed | ✅ PASS |
| 5 | 6 new pages §4: titles + icons (CreditCard/TrendingUp/Landmark/FileBarChart/ScrollText) + copy; Help = native `<details>` FAQ ×3 + contact card (mailto) + Coach link | ✅ PASS |
| 6 | i18n §6: full en+fr parity — `nav.groups.*` (7), `tabs.*` (18 incl. dashboard, no `home`), six page namespaces incl. 12 `help.*` keys; values match spec verbatim | ✅ PASS |
| 7 | Dark mode: all new elements token-driven (`var(--fv-*)`); no hardcoded colors in changed files (only pre-existing chart colors in insights/page.tsx, out of scope) | ✅ PASS |
| 8 | Icon swaps: Pay→`Send`, Accounts→`Wallet`, Cards→`CreditCard`; `Home` import removed; `tabs.home` zero code usage | ✅ PASS |

## Flagged Items — Confirmed

- **(a) `aria-labelledby` empty group name on mobile**: ✅ Acceptable per spec §7. On `w-16`, label `<span>` is `display:none` so `role="group"` announces without a name — a minor screen-reader degradation, not a WCAG failure (group names optional; every `<Link>` self-labels via `aria-label`). Divider `aria-hidden`. Conformant.
- **(b) Help FAQ copy**: ✅ Confirmed tone. Copy is spec §6.3 verbatim — confident, reassurance-first bank tone ("read-only access", "bank-grade encryption", "never store your password"). The only placeholder is `SUPPORT_EMAIL` (help/page.tsx:17) with a `ponytail:` marker — swap when the support contract lands.
- **(c) Sidebar geometry `w-16`/`w-56`**: ✅ Confirmed. `w-16 md:w-56 md:px-4`, primary nav `flex-1 overflow-y-auto`, Account `mt-auto`. Mobile pills centered shrink-to-fit (no `w-full`) = correct.

## Notes (P3 — non-blocking)

1. **P3 — Double-active state on /profile** — `app/(app)/layout.tsx:111-113`: `active = pathname === item.href` is true for BOTH Settings and Profile (`/profile` each). Result: on /profile, two Account pills render active simultaneously (wash + border + semibold + `aria-current="page"`). Spec §1 declared both → /profile (intentional), but simultaneous double-active is a visible artifact, not the designed intent (Settings = primary entry, Profile = subpage).
   Fix (when convenient): `const active = pathname === item.href && (item.href !== '/profile' || item.key === 'settings');` — or move Profile highlight to an anchor/sub-route. Optional, not blocking.
2. **P3 nit** — `GroupLabel` renders the mobile `h-px` divider above the first group too (`isFirst` only adjusts md+ padding) — a hairline between logo and Dashboard on mobile. Harmless (acts as header/nav separator); informational only.

---

**Verdict: PASS ✅** — FE-009 conforms to DS-007 on all checklist items; 3 flagged items confirmed. P3 notes are optional polish, no rework required.
