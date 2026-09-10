# Finovault Web — Design System (Neo-Brutalist Persona Homes)

- Status: `partially_verified` — design spec complete; not yet implemented (Phase 2 = @frontend-react)
- Author: @designer (DS-001)
- Date: 2026-09-05
- Inputs: `specs/web-realignment-plan.md` (APPROVED), `FLOVAULT_RESEARCH_REPORT.md` (Flutter reference), `app/globals.css` (current tokens), `lib/i18n/en|fr.json`, `types/index.ts`
- Decisions (user-confirmed): **Full neo-brutalist restyle** of shared `--fv-*` tokens; PRODUCT.md deferred to @leader; Impeccable update failed (see notes) — do not retry.

## 1. Design Principles

1. **Honest edges** — every card/button/interactive surface gets a 2px ink border. No soft blurs on cards; shadows are hard offsets with zero blur.
2. **One accent per role** — Color communicates persona. Each of the 4 personas owns one accent: indigo / coral / amber / teal. Global chrome stays blue.
3. **Ink-first text** — Text reads on white or wash surfaces before color. Accent is for emphasis, never for body copy.
4. **Pressed = moved** — Interactivity is physical: hover lifts 1px (shadow grows), press sinks 2px (shadow collapses).
5. **Accessibility is not a style choice** — All accent-*text* tokens are AA-tested below; focus rings always visible; touch targets ≥ 44px.

## 2. Color System

### 2.1 Global neutrals (light)

| Token (globals.css) | Existing | New value | Notes |
|---|---|---|---|
| `--fv-bg` | `#f7faff` | `#F5F7FF` | Plan surface base |
| `--fv-surface` | `#ffffff` | `#FFFFFF` | Cards |
| `--fv-surface-glass` | `rgba(255,255,255,0.85)` | `rgba(255,255,255,0.92)` | Kept glass only for header/hero overlays |
| `--fv-wash` | `#eff6ff` | `#EBEEFF` | Global (blue-tinted) wash; persona wash overrides per-role |
| `--fv-text` | `#1a1a1a` | `#1A1A2E` | Ink |
| `--fv-text-secondary` | `#43474d` | `#4B5563` | Muted; 7.56:1 on white, 6.67–7.03:1 on role washes (DS-003: was `#6B7280` 4.83 white / 4.27–4.50 washes — FAIL) |
| `--fv-border` | `#c8d3e8` | `#1A1A2E` | **Ink border** (2px) — the big change |
| `--fv-border-subtle` | (soft blue) | `rgba(26,26,46,0.30)` | Hairline dividers (1px) |
| `--fv-primary-border` | `rgba(29,78,216,0.18)` | `rgba(26,26,46,0.85)` | Focus/hover outlines |
| `--fv-primary` | `#1d4ed8` | `#1D4ED8` | Global action blue (outside persona homes) |
| `--fv-primary-light` | `#3b82f6` | `#2563EB` | Global hovers/links; 5.17:1 on white (DS-003; alt `#1D4ED8` = 6.70) |
| `--fv-secondary` | `#0f2557` | `#0F2557` | Global deep blue (header text) |
| `--fv-accent` | `#7dd3fc` | `#7DD3FC` | Global accent (kept) |
| `--fv-accent-strong` | `#38bdf8` | `#38BDF8` | Global accent strong (kept) |
| `--fv-success` / `-bg` | `#2e7d5b` / var | unchanged | Status badges |
| `--fv-warning` / `-bg` | `#c99a2e` / var | `#92600A` / var | Status badges; 5.38:1 on white (DS-003; alts `#B45309` 5.02, `#A16207` 4.92) |
| `--fv-error` / `-bg` | `#8c3a3a` / var | unchanged | Errors |
| `--fv-shadow-card` | `0 4px 24px rgba(15,37,87,0.08)` | **`4px 4px 0 0 rgba(26,26,46,0.85)`** | Hard offset, zero blur |

New tokens:

| Token | Value | Use |
|---|---|---|
| `--fv-ink` | `#1A1A2E` | Border + shadow color alias |
| `--fv-shadow-hard` | `4px 4px 0 0 rgba(26,26,46,0.85)` | Resting cards |
| `--fv-shadow-hover` | `6px 6px 0 0 rgba(26,26,46,0.9)` | Hover lifts |
| `--fv-border-w` | `2px` | Default border width |
| `--fv-radius-card` | `12px` | Cards, modal, panels |
| `--fv-radius-control` | `10px` | Buttons |
| `--fv-radius-chip` | `8px` | Chips, tags, inputs |
| `--fv-radius-pill` | `999px` | Status badges only |

### 2.2 Role palette (light) — the persona accent system

Each role defines 3 usable tokens. **Light-mode accents are darkened to their AA-safe values** (DS-003, 2026-09-06): the old bright `accent` values failed as text on white (2.15–4.47:1) and as button faces (3 of 4 < 3:1). `accent` and `accent-strong` now share the same darkened value in light mode; dark mode keeps the bright tint + light `strong` split (§2.3).

| Role | `accent` = `accent-strong` (fills/borders/rings/text — ≥4.5:1 on white) | `wash` (card tint ~8%) | On-accent text (button face) |
|---|---|---|---|
| Individual | `#4338CA` (7.90:1) | `#EEF0FF` | `#FFFFFF` (7.90:1) |
| Freelancer | `#B42318` (6.57:1) | `#FEF0EE` | `#FFFFFF` (6.57:1) |
| Entrepreneur | `#92400E` (7.09:1) | `#FEF6E5` | `#FFFFFF` (7.09:1) |
| SME | `#0F766E` (5.47:1) | `#E6F9F6` | `#FFFFFF` (5.47:1) |

Rules:
- **Button face (light) = role accent background + `#FFFFFF` text, 2px ink border.** Verified all 4 personas 5.47–7.90:1. Never accent-bg + ink text (ink on accent failed at 3.82:1).
- Accent text on white is AA-safe at 14px with the darkened values (≥5.47:1). Keep the `accent-strong` token name for overlines/emphasis — same value as `accent` in light mode, so the `--fv-role-*-strong` var stays stable across modes.
- Bright `accent` fills are gone in light mode; they survive only in dark mode (bright accent + ink text + light border, §2.3).
- Accent fills must carry the 2px ink border (brutalist signature).
- Percentage change: use `success`/`error` tokens (unchanged) + role color never replaces semantic green/red.

CSS var naming: `--fv-role-{role}-{tone}` where tone ∈ `accent | accent-strong | wash`, mapped from the role's `PrimaryRole` → accent via one map (see §6.4). Light mode: set `accent` and `accent-strong` to the same darkened value.

### 2.3 Dark mode

| Token | Value | Notes |
|---|---|---|
| `--fv-bg` | `#12121E` | Deep ink base |
| `--fv-surface` | `#1E1E2C` | Cards |
| `--fv-surface-glass` | `rgba(30,30,44,0.92)` | Overlays |
| `--fv-wash` | `#23233A` | Global wash |
| `--fv-text` | `#F2F3FF` | Light ink |
| `--fv-text-secondary` | `#9CA3AF` | Muted (7.2:1 on `#1E1E2C`) |
| `--fv-border` | `#F2F3FF` | **Border flips to light ink** in dark |
| `--fv-border-subtle` | `rgba(242,243,255,0.25)` | Hairlines |
| `--fv-primary-border` | `rgba(242,243,255,0.8)` | Outlines |
| `--fv-shadow-card` / hard / hover | `4px 4px 0 0 rgba(0,0,0,0.55)` / `6px 6px 0 0 rgba(0,0,0,0.6)` | Hard black offsets |
| `--fv-primary` | `#60A5FA` | Blue-400 for links/CTAs on dark |
| `--fv-secondary` | `#BBD3FF` | Deep-blue text |

Role palette (dark):

| Role | accent | accent-strong | wash | On-accent |
|---|---|---|---|---|
| Individual | `#818CF8` | `#A5B4FC` | `#26264A` | `#1A1A2E` on `#818CF8` (5.9:1) |
| Freelancer | `#FCA5A5` | `#FEE2E2` | `#3A2626` | `#1A1A2E` on `#FCA5A5` (7.3:1) |
| Entrepreneur | `#FBBF24` | `#FDE68A` | `#3A3226` | `#1A1A2E` on `#FBBF24` (8.7:1) |
| SME | `#2DD4BF` | `#99F6E4` | `#1F3836` | `#1A1A2E` on `#2DD4BF` (7.1:1) |

Dark rule: on dark surfaces, `accent-strong` is the *light* tint used for emphasis text; `accent` fills still take ink text + light border.

## 3. Typography (Montserrat; keep Cinzel `.font-display` for brand display)

| Token / role | Size | Weight | Line | Notes |
|---|---|---|---|---|
| Hero numeral | 32px | 800 | 1.2 | Use `16px font-display` prefix? No — Montserrat 800, tabular for sums |
| Section title | 24px | 700 | 1.3 | `font-display` optional for marketing only |
| Kicker / overline | 11px | 600 | 1.4 | Uppercase, `0.08em` tracking, accent-strong color |
| Body | 15px | 400/500 | 1.5 | Base |
| Caption | 13px | 500 | 1.45 | Metadata; `text-secondary` |
| Button label | 15px | 700 | 1 | Uppercase optional (Chrome only) |
| Numeric | 15px | 600 | 1.3 | `font-variant-numeric: tabular-nums` on all money values |

No new font loads. Do not exceed 2 weights per surface (one regular one bold) on cards.

## 4. Spacing, Radius, Borders

- Base unit: **4px**. Scale: 4/8/12/16/24/32/48.
- Card padding: 16px compact / 24px hero.
- Module gap (vertical): 16px; section group gap: 24px.
- Page rail: max-width 720px centered (mobile-first Home column); desktop grid cols: 12, module spans listed in §6.3.
- Radius: cards 12px, controls 10px, chips/inputs 8px, badges pill. **No radius >12px on surfaces** (except badges/avatars).
- Border: 2px solid `--fv-border` on cards/buttons/inputs; 1px `--fv-border-subtle` on dividers/table hairlines.

## 5. Motion

| Moment | Token | Value |
|---|---|---|
| Hover | lift | `translate(-2px, -2px)` + `--fv-shadow-hover`, 120ms `ease-out` |
| Press | sink | `translate(2px, 2px)` + shadow 0, 120ms `ease-out` |
| Panel/module swap | fade | 200ms `ease-out`, opacity + 4px slide |
| Progress ring update | slide | 300ms spring-ish ease |
| Focus ring | show | instant 2px outline `accent-strong`, offset 2px |

- `prefers-reduced-motion: reduce` → all transforms/eases → instant (0ms), keep opacity.
- No infinite animation except loading pulse (§7 skeletons).

## 6. Component Architecture

### 6.1 Existing components → restyled (no API change)

| Component | Change |
|---|---|
| `GlassCard` | White surface, 2px ink border, `--fv-shadow-hard`, radius 12px. Glass variant stays for hero overlay only. |
| `SectionHeader` | Add optional `kicker` prop (overline, accent-strong). Title 24px/700. |
| `Button` | 2px ink border, hard shadow, radius 10px; active/press state per §5; primary = accent fill w/ ink border; `variant="outline"` = white + ink border + ink text. |
| `Icon` | Unchanged (exists); icon-only buttons ≥44px, `aria-label` required. |
| `MoneyText` | Unchanged API; add `tabular-nums`. |
| `ProgressRing` | Thickness 8px; track = `--fv-border-subtle`, fill = role accent; `aria-valuenow` required. |
| `EmptyState` | Reuse; icon in wash circle with 2px ink border. |
| `TextField` | 2px ink border, radius 8px, focus outline `accent-strong`. |
| `GreetingHeader` | Greeting 24px/700 ink; time-of-day chip = role accent fill + ink text (from `home.greeting` i18n). |

### 6.2 New components (all 4 personas unless noted)

| Component | Personas | Purpose |
|---|---|---|
| `InsightsCard` | all | Primary per-role insight line + 2 bullet points, from `coach.*` templates |
| `GoalsProgressList` | all | Top 2-3 SavingsGoal rows: name, ProgressRing %, amount, status badge |
| `RecentTransactionsMini` | **Individual only** | Last 3 transactions, icon + merchant + date + amount |
| `CoachCtaCard` | all | Static CTA card → Coach tab: avatar-ish icon, greeting copy, "Ask Money Coach" action |
| `BusinessMetricsCard` | Entrepreneur only | 2×2 net: MRR, burn rate, runway (+multiple), revenue |
| `ComplianceCard` | SME only | 5 static MRA deadlines (approved mock plan) |
| `CashFlowCard` | SME only | Cash position + runway bar + pay-vendor quick action |

### 6.3 Persona home module order

```
Hero (metric numerals)        → spans 12
Quick actions (chips)         → spans 12
[Role-specific card(s)]       → Entrepreneur: BusinessMetricsCard; SME: ComplianceCard + CashFlowCard
InsightsCard                  → spans 12
GoalsProgressList             → spans 12
RecentTransactionsMini        → spans 12 (Individual only)
CoachCtaCard                  → spans 12
```

Desktop: cards can pair 6/6 for role-specific pairs (SME: Compliance + CashFlow). Mobile: single column, 16px gaps.

### 6.4 Role accent utility (frontend)

```ts
// lib/role-accent.ts — single source of truth (map PrimaryRole → --fv-role-* var names)
const ROLE_VARS = {
  individual:   { accent: '--fv-role-individual-accent',   strong: '--fv-role-individual-strong',   wash: '--fv-role-individual-wash' },
  freelancer:   { accent: '--fv-role-freelancer-accent',   strong: '--fv-role-freelancer-strong',   wash: '--fv-role-freelancer-wash' },
  entrepreneur: { accent: '--fv-role-entrepreneur-accent', strong: '--fv-role-entrepreneur-strong', wash: '--fv-role-entrepreneur-wash' },
  sme:          { accent: '--fv-role-sme-accent',          strong: '--fv-role-sme-strong',          wash: '--fv-role-sme-wash' },
}
```

Theme CSS sets `--fv-role-*` per mode (§2.2/§2.3); components consume names only. Class: wrap Home in a `data-role="<role>"` container and set vars on it; no per-component accent props.

## 7. Loading / Empty / Error Standards

- **Loading**: skeleton = 2px dashed `--fv-border` blocks, pulse-opacity 1s ease-in-out infinite, respecting reduced motion (static). Match module geometry.
- **Empty**: `EmptyState` with role-accent icon chip; copy from existing keys (`home.emptyTitle/Body/Cta`, `home.sme.noVendors`, etc.).
- **Error**: `EmptyState` error variant (`--fv-error`), retry = `Button` outline; never raw error strings.
- All data-dependent modules render skeleton → empty → data (existing `use-money` hooks return data/loading; follow their pattern).

## 8. i18n Strategy

- Reuse existing keys where they exist (`home.savingsTitle`, `home.needsAttentionTitle`, `home.metrics.*`, `home.actions.*`, `home.sub.*`, `coach.*`). See `specs/persona-home.md` per-module mapping.
- **New keys** (add to both `en.json` + `fr.json` under `home`):

| Key | en | fr |
|---|---|---|
| `home.recentActivityTitle` | Recent activity | Activité récente |
| `home.seeAll` | See all | Voir tout |
| `home.coachCtaTitle` | Your Money Coach | Votre Money Coach |
| `home.coachCtaBody` | Ask me anything about your money — automating savings, tax, cash flow. | Posez-moi toutes vos questions sur votre argent — épargne auto, impôts, trésorerie. |
| `home.coachCtaAction` | Ask Money Coach | Demander au coach |
| `home.ofGoal` | of goal | de l'objectif |
| `home.complianceTitle` | Compliance | Conformité |
| `home.complianceNote` | Static demo deadlines (mock) | Échéances de démo statiques (maquette) |

- Compliance deadline rows (5, static per approved plan): label + date only. Example set (en/fr): "MRA tax deposit — Sep 30 2026", "MRA tax deposit — Oct 15 2026", "MRA filing Q3 — Oct 31 2026", "Annual return — Dec 31 2026", "MRA tax deposit — Jan 15 2027". Deterministic, no API.

## 9. Interaction & Accessibility Standards (WCAG 2.1 AA)

1. Touch targets ≥ 44×44 (quick actions 48px). Icon-only = `aria-label`.
2. Focus visibility on every interactive element: 2px outline `accent-strong`, offset 2px; never removed.
3. Landmarks: Home = 1 `main`, modules = `<section aria-labelledby>` with `h2`.
4. `ProgressRing` exposes `role="progressbar"` + `aria-valuenow` + accessible label (goal name).
5. Buttons use real `<button>`; Quick actions = `<a>` only when they navigate.
6. Color never the sole signal: paired with icon + label (e.g., warnings use `warning` badge text, not tint alone; ComplianceCard/status chips = icon + text label, color dot is reinforcement only).
7. Contrast guarantees come from §2 tables; do not override token values without re-checking AA.

## 10. Token Reconciliation Summary (plan hex vs current)

| Plan (Flutter) | Current web token | Action |
|---|---|---|
| Base `#F5F7FF` | `--fv-bg #f7faff` | Override to `#F5F7FF` |
| Ink `#1A1A2E` | `--fv-text #1a1a1a` | Override to `#1A1A2E` |
| Muted `#6B7280` | `--fv-text-secondary #43474d` | Override to `#4B5563` (DS-003; `#6B7280` = 4.83 white / 4.27–4.50 washes — FAIL) |
| 2px ink borders | `--fv-border #c8d3e8` | **Override to ink** |
| Hard 3px offset shadow | `--fv-shadow-card` soft blur | **Override to `4px 4px 0 0`** |
| 12px radius | various 12–16px | Standardize to scale above |
| Role accents (4) | none | Add `--fv-role-*` vars (§2.2/2.3) |
| Type 400–800 Montserrat | Montserrat loaded | No change; enforce weights via scale |
| White surfaces | `--fv-surface #fff` | Keep |

## 11. Notes / Blocked / Skipped

- `ponytail:` no theme-switch machine in tokens — role accent is one 5-line map, not a plugin. Add per-role theme provider only if a third persona style appears.
- PRODUCT.md: deferred to @leader (out of DS-001 scope) — flagged.
- Impeccable update: attempted `npx impeccable update` → `Download failed: invalid zip data` + pulled npm `impeccable@3.5.0`. Not retried (skill: ask once). Run manually later if desired.
- Verification: `partially_verified` — spec-only; frontend must apply tokens then re-run AA checks (§9).

## 12. Dark Theme Application (DS-005)

**Mode strategy** — globals.css CSS variables = single source of truth. `ThemeProvider` (`lib/theme/*`) is already mounted in `components/Providers.tsx` and consumed by `app/(app)/profile/page.tsx` (mode select: light/dark/system). Root layout inline script + `suppressHydrationWarning` already prevent FOUC. **No new dependencies.**

**Required corrections in `app/globals.css` `.dark` block** (full rationale + contrast: `specs/dark-financial-tokens.md`):

| Token | Current (guessed) | Confirm | Why |
|---|---|---|---|
| `--fv-border-ink` | `rgba(255,255,255,0.55)` | `rgba(242,243,255,0.8)` | = `--fv-primary-border`; blends ≈ `#C8C9D5` → 10:1 vs surface (UI ≥3:1) |
| `--fv-shadow-card` | `rgba(0,0,0,0.55)` | `rgba(0,0,0,0.7)` | 0.55 ≈ invisible on `#12121E` |
| `--fv-shadow-hard` | `rgba(0,0,0,0.55)` | `rgba(0,0,0,0.7)` | same |
| `--fv-shadow-hard-sm` | `rgba(0,0,0,0.55)` | `rgba(0,0,0,0.7)` | same |
| `--fv-shadow-hover` | `rgba(0,0,0,0.6)` | `rgba(0,0,0,0.75)` | 6px hover step reads |
| `--fv-ink` | (missing override) | `#f2f3ff` | flips with mode → fixes global `:focus-visible` ring (line 146); matches `--fv-text` |
| `--fv-success` | (missing) | `#4ade80` | 9.3:1 on `#12121E` |
| `--fv-warning` | (missing) | `#facc15` | 10.5:1 |
| `--fv-error` | (missing) | `#f87171` | 5.8:1 |
| `--fv-success-bg` / `--fv-warning-bg` / `--fv-error-bg` | (missing) | 12%-alpha tints of the above | status chips |

**New token `--fv-on-fill`** — text color on saturated fills (primary buttons, role-accent cards, avatar, error badge):
`:root { --fv-on-fill: #ffffff; }` · `.dark { --fv-on-fill: #1a1a2e; }`

Rationale: dark-mode fills flip to light pastels (`--fv-primary #60a5fa`, accents `#818cf8`/`#fca5a5`/`#fbbf24`/`#2dd4bf`, `--fv-error #f87171`). White text on those fails AA (2.3–2.4:1); ink `#1a1a2e` passes everywhere (≈5.8–10.4:1). In light mode fills are deep → white stays correct. All AA-verified in `specs/dark-financial-tokens.md` §Contrast.

**`--fv-ink` semantics** — it is the *chrome* ink (borders/shadows/focus). It now flips (`#1a1a2e` light → `#f2f3ff` dark), so the forced-white CoachCta button override `bg-white! text-[var(--fv-ink)]!` must be **removed** (see audit map) — the button now relies on `variant="secondary"` (surface bg + `--fv-primary` text, both flip).

**Hardcoded-color audit map** (8 fixes + 2 OK items): `specs/dark-financial-tokens.md` §Audit.

## 13. Financial App Shell & Dark-Financial Module Refinements (DS-005)

Layout geometry, persona module order, loading/empty/error standards: §5–§7 unchanged. Dark-specific refinements:

- **Shell** (`app/(app)/layout.tsx`): add mode toggle (compact, cycles light→dark→system, icon + `aria-label` from existing `settings.theme*` i18n keys) in top bar, immediately left of `NotificationBell`. Profile page select remains the canonical full control (same state via `useTheme`). No sidebar changes — fully token-driven.
- **Charts** (`app/(app)/insights/page.tsx`): fixed indigo `COLORS` ramp needs a dark-aware variant (adjacent series ≥3:1); non-blocking visual QA item.
- **Module dark notes** (per module, states that need attention in dark): skeleton dashes `border-[var(--fv-border)]` → use `--fv-border-subtle` (dark `--fv-border` = full white, too loud); switch off-track `bg-[var(--fv-border)]` → `--fv-border-subtle` so the white knob stays visible; `BusinessMetricsCard` success/error tones need the dark status tokens (§12).
- **i18n**: no new keys — `settings.theme/themeLight/themeDark/themeSystem` already exist in `en.json` (and mirror in `fr.json`); reuse `settings.theme` as toggle aria-label.
- **API**: no new endpoints — dashboard already consumes `useMoneySummary/useAccounts/useBudgets/useGoals/useInvoices/useVendors/useBillPayments`. Compliance rows remain static seeds (existing `ponytail:` note; backend item, not blocking).

Full per-file spec: `specs/dark-financial-layout.md`.