# Implementation Summary — FE-005 + FE-006 (Dark Theme + Financial Layout Refinements)

Status: **implemented, verified** (tsc 0 errors, lint 0 errors, 60/60 tests pass)

## Files changed

| File | Change |
|---|---|
| `app/globals.css` | `.dark` corrections per tokens spec §1: `--fv-border-ink` → `rgba(242,243,255,0.8)`, shadows 0.55→0.7 / hover 0.75, added `--fv-ink: #f2f3ff`, added dark status tokens (`--fv-success/-warning/-error` + `-bg` variants), added `--fv-on-fill` (`:root` `#ffffff` / `.dark` `#1a1a2e`). Removed the `ponytail:` guess comment. |
| `components/ui/Button.tsx` | #1: primary `text-white` → `text-[var(--fv-on-fill)]` |
| `features/dashboard/components.tsx` | #2/#3/#4: CoachCta title/body → `--fv-on-fill` (+/85), removed forced `bg-white! text-[var(--fv-ink)]!` override (relies on `variant="secondary"`). Skeleton dashes (Goals line ~162, Recent ~238) → `border-[var(--fv-border-subtle)]`. |
| `features/dashboard/GreetingHeader.tsx` | Extra (same defect class as #2–#4): greeting pill `text-white` → `text-[var(--fv-on-fill)]` on `--fv-role-accent` (spec §2 contrast table covers this pair). Flag for designer QA. |
| `app/(app)/profile/page.tsx` | #5: avatar initials → `--fv-on-fill`. Switch off-track → `bg-[var(--fv-border-subtle)]`. |
| `app/(app)/coach/page.tsx` | #6/#7: user bubble + send button → `--fv-on-fill` |
| `components/notifications/NotificationBell.tsx` | #8: error badge → `--fv-on-fill` |
| `components/VaultMark.tsx` | #9: hex strokes → `var(--fv-primary)` / `var(--fv-text-secondary, currentColor)` (subdued) via SVG `style` (var() in presentation attributes is unreliable cross-browser). |
| `app/(app)/vault/page.tsx` | Switch off-track → `bg-[var(--fv-border-subtle)]` (knob stays `bg-white`). |
| `app/(app)/layout.tsx` | Top-bar theme toggle immediately left of NotificationBell: 3-state icon button (Sun/Moon/Monitor cycling light→dark→system), wired to existing `useTheme()` `mode`/`setMode` (same store as profile select). `aria-label={t('settings.theme')}`, `aria-pressed={mode==='system'}`, `title` shows current value, chrome matches NotificationBell (`h-11 w-11`, border-ink, shadow-hard-sm). |
| `app/(app)/insights/page.tsx` | #10: chart COLORS dark-aware — `LIGHT_COLORS` (unchanged) vs `DARK_COLORS` selected by resolved `theme.mode`; dark ramp alternates hue (indigo/amber/emerald/pink/blue/purple/red/teal) so adjacent series keep ≥3:1 on `--fv-surface` dark. |

## State handling

- **Theme**: single source of truth stays `ThemeProvider` (localStorage `finovault.themeMode.v1`, `.dark` class on `<html>`). Top-bar toggle and profile select both call `setMode` — no reimplementation, no new provider.
- **i18n**: no new keys; reuses `settings.theme/themeLight/themeDark/themeSystem` (verified present in `en.json` + `fr.json`).
- **API**: none touched.

## Acceptance checklist (layout spec §5)

- [x] `.dark` token corrections + `--fv-on-fill` landed
- [x] Audit map #1–#9 applied (incl. GreetingHeader extra, same class)
- [x] CoachCta override removed; `--fv-ink` flips; `:focus-visible` ring visible in dark
- [x] Top-bar theme toggle wired to existing `useTheme`; i18n reuses `settings.theme*` (en + fr)
- [x] Dark status tokens live → Compliance/BusinessMetrics status colors pass AA
- [x] Skeleton dashes + switch off-tracks use `--fv-border-subtle`
- [x] Charts dark-aware COLORS (visual QA item for designer)

## Verification

- `npx tsc --noEmit` → 0 errors
- `npm run lint` → 0 errors (12 pre-existing warnings, none in changed lines)
- `npm test --pool=threads` → 60/60 pass (first run, no flake)

## Design QA notes for @designer

- GreetingHeader pill (`GreetingHeader.tsx:21`) was NOT in the audit map but is the identical white-on-accent-fill defect class; fixed with `--fv-on-fill` per spec §2 table. Confirm visually.
- Insights dark palette is a hue-spread ramp (8 colors); confirm adjacent-slice legibility in the live pie chart.
- Top-bar toggle icon shows the current mode (sun/moon/monitor); title shows localized current value.