# Design QA Fix Specs — Persona Home (DS-002)

Status: written by @designer · 2026-09-06 · applies to `specs/persona-home.md` scope
Consumed by: @frontend-nuxt (implementation), @reviewer, @leader

Token change recap (applies to ALL items below; full table in `DESIGN.md` §2):

| Token | OLD (FAIL) | NEW |
|---|---|---|
| `primary-light` | `#3b82f6` | `#2563EB` |
| `warning` | `#c99a2e` | `#92600A` alt `#B45309` |
| muted / `text-secondary` | `#6B7280` | `#4B5563` |
| role accents (4 personas) | bright (`#6366F1`/`#F97066`/`#F59E0B`/`#14B8A6`) | darkened (`#4338CA`/`#B42318`/`#92400E`/`#0F766E`) |
| button face | ink-on-bright | darkened accent + `#FFFFFF`, 2px ink border |

Dark mode: unchanged.

---

## 1. Reduced Motion

**Finding (DS-002 audit)**: `prefers-reduced-motion` not honored; entrance/pulse animations run for users requesting reduced motion.

**Design guidance**:
- Single global rule, as close to root as possible:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Skeleton pulse/glow: render static (`animation: none`) under reduce — the pulse conveys nothing except "loading", and the text/shape silhouette carries that alone.
- Entrance transitions (fade-up/scale): allowed to still complete instantly (0.01ms) — no content is hidden after the animation.
- Never use `!important` anywhere except this global reduce block.

**Acceptance**: axe audit on "emulate prefers-reduced-motion" — no violations; skeleton and entrances render static; no layout shift.

---

## 2. Section Landmarks + SectionHeader ids

**Finding**: sections use plain `<section>` wrappers without accessible names; screen-reader navigation lacks landmark contexts; `SectionHeader` has no heading `id`.

**Design guidance**:
- Every page-section section element carries an accessible name and stable id:

| Module | section id |
|---|---|
| Hero | `mod-hero` |
| Quick actions | `mod-actions` |
| Insights/cards row | `mod-insights` |
| Goals | `mod-goals` |
| Recent activity | `mod-recent` |
| Coach/mentor | `mod-coach` |
| Metrics | `mod-metrics` |
| Compliance | `mod-compliance` |
| Cashflow | `mod-cashflow` |

- Pattern: `<section aria-labelledby="mod-hero-title">` + `<h2 id="mod-hero-title">…</h2>`. When a section has no visible heading, use `aria-label` on the `<section>` instead and skip the h2.
- `SectionHeader` component: accept an optional `id` prop bound to the h2; homepage passes the `mod-*` id.

**Acceptance**: axe landmark audit — every region has an accessible name; unique across the page.

---

## 3. ComplianceCard status — never color-only

**Finding**: status rendered as a colored dot alone; fails 1.4.1 Use of Color for users who can't perceive the hue (and in my review, grayscale).

**Design guidance**:
- Status = `aria-hidden` color dot + adjacent icon + text label (e.g., "Compliant", "Attention", "Expired", "Missing"). Color dot is reinforcement only.
- Icons: lucide `CircleCheck` (success) / `TriangleAlert` (warning) / `CircleX` (error) / `Clock` (expired) — never rely on the dot shape alone either.
- Token mapping (semantic — do NOT use role accents): success `--fv-success`, warning `--fv-warning`, error `--fv-error`, muted `--fv-text-secondary`. All AA on their (white/wash) backgrounds.

**Acceptance**: axe 1.4.1 clean; status row readable in grayscale; text label present in DOM, not hidden from AT.

---

## 4. Global focus-visible ring (ink, not box-shadow)

**Finding**: focus styles inconsistent (box-shadow on some, nothing on others); default browser outline removed in places (anti-pattern).

**Design guidance**:
- Single global default (brutalist signature — supersedes accent-strong since light accents are now darkened; per-role accent ring optional later):

```css
:focus-visible {
  outline: 2px solid var(--fv-ink, var(--fv-text));
  outline-offset: 2px;
}
```

- Replace any `outline: none` with this ring (or remove the rule so the global applies). No box-shadow focus styles — outline keeps the 2px ink language.
- Applies to interactive elements: links, buttons, inputs, selects, checkboxes, tabs, toggles.

**Acceptance**: keyboard-tab through every control — 2px ink ring visible at 2px offset, no clipping by `overflow` containers; axe 2.4.7 clean.

---

## 5. Locale-aware date formatting

**Finding**: dates pre-formatted in `en-US` shape on the server (and `Intl.DateTimeFormat` defaults diverge from user locale); invalid dates render raw/empty.

**Design guidance**:
- Shared formatter (composable):

```ts
function fvDate(date: string | Date, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '—'; // invalid → fallback text
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}
```

- Locale source: `useI18n().locale.value` (Nuxt i18n) → fallback `navigator.language`. Never store pre-formatted date strings; go back to the API only if the API returns ISO strings today.
- Empty state: `—` (em dash) for null dates; never "Invalid Date".

**Acceptance**: dates render per `id`/`en`, invalid date shows `—`, no hydration mismatch on locale switching.