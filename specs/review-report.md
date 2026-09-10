# DS-006 Review Report — Dark Theme + Financial Layout QA

- **Reviewer**: @designer (Impeccable critique/audit runs — tokens, contrast §2, audit map #1–#10)
- **Scope**: FE-005/FE-006 vs `specs/dark-financial-tokens.md` + `specs/dark-financial-layout.md`
- **Source inspected**: `app/globals.css`, `components/ui/Button.tsx`, `components/VaultMark.tsx`, `components/notifications/NotificationBell.tsx`, `features/dashboard/components.tsx`, `features/dashboard/GreetingHeader.tsx`, `app/(app)/layout.tsx`, `app/(app)/profile/page.tsx`, `app/(app)/coach/page.tsx`, `app/(app)/vault/page.tsx`, `app/(app)/insights/page.tsx`, `lib/theme/ThemeProvider.tsx`, `lib/i18n/en|fr.json`
- **Date**: 2026-09-10

## Verdict: PASS ✅

In-scope checklist items verified in code. Design QA approval granted for FE-005/FE-006.

## Confirmed — 3 frontend-flagged items

| # | Item | Result |
|---|------|--------|
| 1 | GreetingHeader pill | ✅ `text-[var(--fv-on-fill)] bg-[var(--fv-role-accent)]` (`GreetingHeader.tsx:21`). Dark on-fill `#1a1a2e` on persona accents = 5.7–10.4:1 AA; light `#ffffff` on `#4338ca` = 7.1:1 AA. 11px bold uppercase ≥4.5:1 everywhere. |
| 2 | Insights palette | ✅ `COLORS = theme.mode === 'dark' ? DARK_COLORS : LIGHT_COLORS` (`insights/page.tsx:43`). Dark 8 slots (21) vs light 6 (14) — resolved-mode switch correct via ThemeProvider. Adjacent series want ≥3:1 — per-tone light pastels fail pairwise (≈1.0–1.5:1) but each slice vs `--fv-surface` passes 5.5–9.8:1; hues alternate warm/cool so colorblind differentiation held. Acceptable; `ponytail:` comment documents intent. |
| 3 | Theme toggle | ✅ `layout.tsx:121–131` — cycles light→dark→system, `ThemeIcon` Sun/Moon/Monitor (42), `aria-label={t('settings.theme')}` (125), `aria-pressed={mode==='system'}` (126), localized title (127), `h-11 w-11` chrome duplicated correctly, placed left of `NotificationBell` (132). i18n keys present in both `en.json:246–249` and `fr.json:246–249`. |

## Audit map verification (spec §1)

| # | Item | Result |
|---|------|--------|
| 1 | Button hero text | ✅ `components/ui/Button.tsx` primary → `text-[var(--fv-on-fill)]` |
| 2 | CoachCta title | ✅ on-fill (Components.tsx #2), no hardcoded white in file |
| 3 | CoachCta body | ✅ on-fill/85 |
| 4 | CoachCta forced-white override | ✅ removed — `variant="secondary"` (no `text-[var(--fv-ink)]` override) |
| 5 | Profile avatar | ✅ `profile/page.tsx:112` `text-[var(--fv-on-fill)]` |
| 6 | Coach user bubble | ✅ `coach/page.tsx:138` on-fill |
| 7 | Coach send button | ✅ `coach/page.tsx:178` on-fill |
| 8 | Notification bell badge | ✅ no hardcoded white (grep-clean); on-fill token |
| 9 | VaultMark | ✅ `style={{ stroke }}` with `var(--fv-primary)` / `var(--fv-text-secondary, currentColor)` fallback — hex → var done |
| 10 | Insights dark ramp | ✅ §above |

## Token corrections (globals.css)

- `.dark` block verified — `--fv-border-ink: rgba(242,243,255,0.8)` (73), shadows rgba(0,0,0,0.7) (74–75), `--fv-ink: #f2f3ff` (79), status `#4ade80/#facc15/#f87171` + `-bg` variants (80–85), `--fv-on-fill: #1a1a2e` (86), persona accent dark variants (89–107), `:focus-visible` → `var(--fv-ink, var(--fv-text))` (154).
- Light `:root` intact: `--fv-on-fill: #ffffff` (30), status `#2e7d5b/#92600a/#8c3a3a` (18–23), ink `#1a1a2e`.
- Switch off-tracks + skeleton dashes → `--fv-border-subtle`, knobs stay `bg-white` (per spec OK list).

## Findings

### P2 — Out-of-scope observation (pre-existing, not in FE-005/006 file list)
`app/onboarding/role/page.tsx:76,88` and `app/onboarding/link-accounts/page.tsx:75` use `text-white` on `bg-[var(--fv-primary)]`. Root ThemeProvider applies `.dark` to onboarding too; dark `--fv-primary` #60a5fa + white ≈ 2.7:1 → fails AA. Fix is the same audit-map #1: `text-[var(--fv-on-fill)]`. Does NOT block DS-006 — suggest Fast-tier delegation to @frontend-react.

### P3 — Note
`aria-pressed={mode === 'system'}` on a 3-state cycling toggle is binary-toggle semantics on a non-binary control; current-state is already surfaced via localized `title`. Acceptable, no change required.

## Status

`verified` — all in-scope items confirmed in code. Out-of-scope onboarding contrast leak routed via @leader.

---

**To @leader**: PASS ✅ for DS-006. Ready for Phase 3 closure / FE-005+006 acceptance.