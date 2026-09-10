# Design QA Report — DS-003 Notification System

- **Agent**: @designer
- **Date**: 2026-09-10
- **Spec**: `specs/notifications.md` (DS-002)
- **Implementation**: `specs/implementation-summary.md` (FE-002)
- **Status**: FAIL ❌ — 6 findings (2 medium, 2 low, 2 cosmetic)

---

## Checklist Results

| Check | Verdict | Notes |
|---|---|---|
| Bell 44px | ✅ PASS | `h-11 w-11` = 44px |
| Bell neo-brutalist styling | ✅ PASS | 2px ink border, hard shadow, hover/active transforms |
| Bell placement (name → bell → badge) | ✅ PASS | `layout.tsx` L109-119 |
| Badge `--fv-error` red | ✅ PASS | `bg-[var(--fv-error)]` |
| Badge hidden at 0 | ✅ PASS | Conditional render |
| Badge "99+" at ≥100 | ✅ PASS | L38 |
| **Badge scale pop animation** | **❌ FAIL** | No animation implemented — static display |
| **Badge `prefers-reduced-motion`** | **❌ FAIL** | No motion query at all |
| Dropdown fixed positioning | ⚠️ PARTIAL | Fixed ✅ but position hardcoded (see #3) |
| Dropdown 384px desktop | **❌ FAIL** | Mobile-first wrong: `sm:w-[384px]` reversed |
| Dropdown 2px ink border + hard shadow | ✅ PASS | Correct tokens |
| Dropdown header "Mark all read" | ✅ PASS | Ghost button, correct styling |
| Dropdown scrollable list | ✅ PASS | `overflow-y-auto` |
| Dropdown empty state | ✅ PASS | CircleCheck, title + body, correct tokens |
| Items: unread dot | ✅ PASS | 8px circle, `--fv-primary`, `aria-hidden` |
| **Items: type icon 32px circle** | **❌ FAIL** | Border is 1px (`border`), spec says 2px (`border-2`) |
| Items: title/body/timestamp | ✅ PASS | Correct sizes, weights, colors, truncation |
| Items: unread wash bg | ✅ PASS | `bg-[var(--fv-wash)]` |
| Items: hover state | ✅ PASS | `hover:bg-[var(--fv-border-subtle)]` |
| Items: min-height 48px | ✅ PASS | `style={{ minHeight: 48 }}` |
| A11y: aria-expanded/haspopup | ✅ PASS | Bell has both |
| A11y: role="dialog" | ✅ PASS | Dropdown has `role="dialog"` |
| A11y: Esc close + focus return | ✅ PASS | L40-43 |
| A11y: focus into dropdown on open | ✅ PASS | L30-34 |
| A11y: click-outside close | ✅ PASS | L50-63 |
| A11y: aria-live on new arrival | ✅ PASS | `layout.tsx` L131-133 |
| i18n: 7 keys en | ✅ PASS | All 7 present |
| i18n: 7 keys fr | ✅ PASS | All 7 present, fr parity correct |
| GreetingHeader: bell removed | ✅ PASS | No bell, no Bell import |
| No new DESIGN.md tokens | ✅ PASS | All `--fv-*` tokens reused |

---

## Numbered Findings

### 1. MEDIUM — Badge animation missing
**File**: `components/notifications/NotificationBell.tsx` L33-39
**Spec**: §2.5 — "Badge count change: 120ms scale pop (1 → 1.15 → 1) + opacity fade-in for new badge appearance."
**What to change**: Add a CSS keyframe animation (`@keyframes badge-pop { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }`) triggered when `unreadCount` changes. Use a React key or `useEffect` + state to re-trigger on count change. Wrap in `@media (prefers-reduced-motion: reduce) { animation: none; }`.

### 2. MEDIUM — Dropdown position not bell-aligned
**File**: `components/notifications/NotificationDropdown.tsx` L73-78
**Spec**: §3.1 — "Calculate position from bell's bounding rect. Alignment: right-aligned to bell's right edge (dropdown's right = bell's right)."
**What to change**: Accept a `bellRef` position (already passed), use `useEffect` to measure `bellRef.current.getBoundingClientRect()` and set `style={{ top: rect.bottom + 8, right: window.innerWidth - rect.right }}`. This ensures the dropdown aligns to the bell's right edge regardless of viewport size, matching spec §3.1.

### 3. LOW — Dropdown width reversed mobile-first
**File**: `components/notifications/NotificationDropdown.tsx` L72
**Spec**: §3.2 — Desktop (≥640px) = 384px, Mobile (<640px) = `calc(100vw - 32px)`
**What to change**: Current `className` has no width class on base, `sm:w-[384px]` on sm+. This means <640px has no explicit width (inheriting `maxWidth: calc(100vw - 32px)` via inline style), and ≥640px gets 384px. This actually works by accident because the inline `maxWidth` acts as the mobile constraint. But it should be explicit: add `w-[calc(100vw-32px)]` to base className for mobile, keep `sm:w-[384px]` for desktop. Currently correct by accident but fragile.

### 4. LOW — Type icon border 1px instead of 2px
**File**: `components/notifications/NotificationItem.tsx` L52
**Spec**: §4.4 — "Icon circle: 32px, `rounded-full`, 2px border `var(--fv-border-subtle)`"
**What to change**: Change `border` → `border-2` on line 52. Minor visual inconsistency with the rest of the neo-brutalist system which uses 2px borders throughout.

### 5. COSMETIC — Bell transition 150ms vs spec 120ms
**File**: `components/notifications/NotificationBell.tsx` L30
**Spec**: §2.3 — "Transition: 120ms ease-out" and DESIGN.md §5 — "120ms ease-out"
**What to change**: `duration-150` → `duration-[120ms]`. Barely perceptible difference but spec-aligned.

### 6. COSMETIC — Duplicate "Notifications" title
**File**: `app/(app)/layout.tsx` L82-84 + `NotificationDropdown.tsx` L81-84
**Spec**: §3.5 — Header has "Notifications" title + "Mark all read" button.
**What to change**: The dropdown renders its own header with "Notifications" title. The `layout.tsx` also doesn't render a separate title. This is fine — no actual bug. Just noting that the layout's L82-84 is inside the dropdown component, not duplicated in layout. No change needed.

---

## Token Audit

All `--fv-*` tokens reused correctly. No new tokens introduced:

| Token | Used In | Correct |
|---|---|---|
| `--fv-border-ink` | Bell border, dropdown border | ✅ |
| `--fv-surface` | Bell bg, dropdown bg | ✅ |
| `--fv-shadow-hard-sm` | Bell rest shadow | ✅ |
| `--fv-shadow-hard` | Bell hover, dropdown shadow | ✅ |
| `--fv-radius-control` | Bell radius | ✅ |
| `--fv-radius-card` | Dropdown radius | ✅ |
| `--fv-error` | Badge bg | ✅ |
| `--fv-primary` | Mark all read text, unread dot | ✅ |
| `--fv-border-subtle` | Dividers, type icon border, hover bg | ✅ |
| `--fv-text` | All text | ✅ |
| `--fv-text-secondary` | Body, timestamp | ✅ |
| `--fv-wash` | Unread bg, empty state icon bg | ✅ |
| `--fv-success-bg` | Transfer icon bg | ✅ |
| `--fv-warning-bg` | Bill/security icon bg | ✅ |

---

## Verdict

**FAIL ❌** — 2 medium findings must be fixed before shipping. Badge animation (findings #1) is a spec requirement with `prefers-reduced-motion` support. Dropdown positioning (finding #2) breaks alignment on non-standard viewport sizes.

Return to @leader for re-delegation to @frontend-react. Do NOT delegate directly.
