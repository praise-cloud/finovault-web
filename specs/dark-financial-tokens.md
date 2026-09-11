# Dark-Financial Tokens (DS-005)

Design tokens spec for the Finovault dark theme + hardcoded-color audit map. Applies to `app/globals.css` and the components listed. DESIGN.md §12 is the condensed version; this file is the working detail for @frontend.

## 1. Confirmed dark corrections (`app/globals.css` `.dark` block)

Replace the `ponytail:`-guessed values and add the missing tokens:

```css
.dark {
  /* existing, unchanged */
  --fv-bg: #12121e;
  --fv-surface: #1e1e2c;
  --fv-surface-glass: rgba(30, 30, 44, 0.92);
  --fv-wash: #23233a;
  --fv-text: #f2f3ff;
  --fv-text-secondary: #9ca3af;
  --fv-border: #f2f3ff;
  --fv-border-subtle: rgba(242, 243, 255, 0.25);
  --fv-primary-border: rgba(242, 243, 255, 0.8);
  --fv-primary: #60a5fa;
  --fv-secondary: #bbd3ff;

  /* ---- confirmed / corrected ---- */
  --fv-border-ink: rgba(242, 243, 255, 0.8);   /* was rgba(255,255,255,0.55) — now = --fv-primary-border */
  --fv-shadow-card: 4px 4px 0 0 rgba(0, 0, 0, 0.7);     /* was 0.55 */
  --fv-shadow-hard: 4px 4px 0 0 rgba(0, 0, 0, 0.7);      /* was 0.55 */
  --fv-shadow-hard-sm: 3px 3px 0 0 rgba(0, 0, 0, 0.7);   /* was 0.55 */
  --fv-shadow-hover: 6px 6px 0 0 rgba(0, 0, 0, 0.75);    /* was 0.6 */
  --fv-ink: #f2f3ff;                                     /* NEW — flips with mode; fixes :focus-visible */

  /* ---- NEW: missing dark status tokens (were light-only → AA fail on dark) ---- */
  --fv-success: #4ade80;
  --fv-warning: #facc15;
  --fv-error: #f87171;
  --fv-success-bg: rgba(74, 222, 128, 0.12);
  --fv-warning-bg: rgba(250, 204, 21, 0.12);
  --fv-error-bg: rgba(248, 113, 113, 0.12);

  /* ---- NEW: text on saturated fills ---- */
  --fv-on-fill: #1a1a2e;
}
```

And in `:root`:

```css
:root {
  /* ... */
  --fv-on-fill: #ffffff;
}
```

**`--fv-ink` flip is safe**: only three usages exist — `globals.css:28` (def), `globals.css:146` (`:focus-visible` ring → now visible in dark), and `features/dashboard/components.tsx:305` (forced-white CoachCta button override → removed in §3). After removal, no component reads `--fv-ink` for text.

**`--fv-ink` semantics**: chrome ink (borders/shadows/focus), NOT text-on-fill. Text-on-fill = `--fv-on-fill`. These are different concepts — do not merge them.

## 2. Contrast verification (dark)

All targets on `#12121E` (bg) / `#1E1E2C` (surface). AA = ≥4.5:1 normal text, ≥3:1 UI components.

| Pair | Contrast | Pass |
|---|---|---|
| `--fv-border-ink` 0.8 blend (≈ `#C8C9D5`) vs surface | ~10:1 | UI border ≥3:1 ✅ |
| `--fv-text #f2f3ff` vs surface | ~14:1 | ✅ |
| `--fv-text-secondary #9ca3af` vs surface | ~7:1 | ✅ |
| `--fv-primary #60a5fa` vs `#1a1a2e` (on-fill text) | ~6.8:1 | ✅ |
| `--fv-on-fill #1a1a2e` vs `--fv-role-accent` individual `#818cf8` | ~5.8:1 | ✅ |
| `--fv-on-fill` vs freelancer accent `#fca5a5` | ~9.1:1 | ✅ |
| `--fv-on-fill` vs entrepreneur accent `#fbbf24` | ~10.4:1 | ✅ |
| `--fv-on-fill` vs sme accent `#2dd4bf` | ~9.2:1 | ✅ |
| `--fv-on-fill` vs `--fv-error #f87171` | ~6.3:1 | ✅ |
| `--fv-success #4ade80` vs bg | ~9.3:1 | ✅ |
| `--fv-warning #facc15` vs bg | ~10.5:1 | ✅ |
| `--fv-error #f87171` vs bg | ~5.8:1 | ✅ |
| (pre-fix) light `--fv-success #2e7d5b` vs bg | ~3.2:1 | ❌ → fixed by §1 |
| (pre-fix) white text on dark `--fv-primary #60a5fa` | ~2.3:1 | ❌ → fixed by `--fv-on-fill` |

## 3. Hardcoded-color audit map (fix list)

| # | File:line | Current | Fix | Why |
|---|---|---|---|---|
| 1 | `components/ui/Button.tsx:19` | primary `text-white` | `text-[var(--fv-on-fill)]` | white fails on light-primary in dark (2.3:1) |
| 2 | `features/dashboard/components.tsx:300` | CoachCta title `text-white` | `text-[var(--fv-on-fill)]` | title on pastel accent card |
| 3 | `features/dashboard/components.tsx:301` | body `text-white/85` | `text-[var(--fv-on-fill)]/85` | same |
| 4 | `features/dashboard/components.tsx:305` | `bg-white! text-[var(--fv-ink)]!` | **remove override**; rely on `variant="secondary"` | secondary flips correctly (surface bg, primary text); `--fv-ink` now flips so white+ink would break |
| 5 | `app/(app)/profile/page.tsx:112` | avatar initials `text-white` | `text-[var(--fv-on-fill)]` | on primary fill |
| 6 | `app/(app)/coach/page.tsx:138` | user bubble `bg-[var(--fv-primary)] text-white` | `text-[var(--fv-on-fill)]` | on primary fill |
| 7 | `app/(app)/coach/page.tsx:178` | send button `bg-[var(--fv-primary)] text-white` | `text-[var(--fv-on-fill)]` | on primary fill |
| 8 | `components/notifications/NotificationBell.tsx:45` | badge `text-white` | `text-[var(--fv-on-fill)]` | on `--fv-error` (light red in dark) |
| 9 | `components/VaultMark.tsx:30,36,40` | hex `#1D4ED8` / `#B0B4BA` strokes | `var(--fv-primary)` / `var(--fv-text-secondary)` (fallback `currentColor` for `subdued`) | logo must follow mode |
| 10 | `app/(app)/insights/page.tsx:12` | fixed indigo `COLORS` ramp | dark-aware variant list; adjacent series ≥3:1 | chart legibility |

**OK — keep (no change needed):**
- Switch knob `bg-white` (`profile:225`, `vault:426`): white knob reads on any colored track in both modes.
- But switch **off-track** `bg-[var(--fv-border)]` (`profile:222`, `vault` equivalent) → change to `bg-[var(--fv-border-subtle)]`: dark `--fv-border` = `#f2f3ff` full white; a pale track + white knob ≈ invisible knob in dark off-state. Subtle track fixes both modes.
- `app/(app)/profile/page.tsx:120` role badge `bg-[var(--fv-primary)]/10 text-[var(--fv-primary)]`: text passes in dark (~5.2:1); tint at 10% is faint — optional bump to `/15`. Minor.
- Native `<option>` popups don't follow dark themes on some platforms (Windows) — accepted platform limitation; keep `--fv-surface` select background.

## 4. Ordering (dependencies before build)

1. Apply `.dark` corrections + `--fv-on-fill` (both modes) — everything else depends on these.
2. Sweep audit map #1–#9.
3. Remove CoachCta override (#4) — leaf change, after `--fv-ink` flip lands.
4. Re-run AA checks from §2 (automated: contrast checker on the 12 pairs).