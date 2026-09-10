# FE-006 Implementation Summary — DS-004 Redesign (Blue + Brutalism + Readability)

## What Changed

Full DS-004 redesign applied across all 14 homepage files. Purple accent `#6366f1` → brand blue `#1D4ED8`; body text on dark raised to 0.88 opacity; body text on light darkened to `#374151`; all headings/labels/eyebrows bold (700), stats extrabold (800), body medium (500); text columns capped at 50ch (45ch in Philosophy); hero headline widened to 14ch. Zero structural change — same sections, order, backgrounds, i18n keys.

## Files Touched

| File | Changes |
|------|---------|
| `app/globals.css` | Removed `--fv-hp-accent-purple(-hover)`, purple `--fv-hp-border-accent`. Added `--fv-hp-accent` `#1D4ED8`, `--fv-hp-accent-hover` `#2563EB`, `--fv-hp-accent-light` `rgba(29,78,216,0.15)`, `--fv-hp-accent-border` `rgba(29,78,216,0.3)`, `--fv-hp-accent-glow` `rgba(29,78,216,0.06)`, `--fv-hp-text-body` `rgba(255,255,255,0.88)`, `--fv-hp-text-dark-body` `#374151`. Focus ring `*:focus-visible` → `var(--fv-hp-accent)`. |
| `features/homepage/Nav.tsx` | Desktop CTA + mobile CTA → blue (`bg-[var(--fv-hp-accent)]`/hover, `min-h-[48px]`). Desktop links `font-medium`, mobile links `font-bold`. |
| `features/homepage/Hero.tsx` | Headline `max-w-[14ch]` + `font-bold`. Subheadline → `text-[var(--fv-hp-text-body)]` + `font-medium`. Primary CTA blue. Stat values `font-extrabold`, labels `font-medium` + `text-muted`, footnote `font-bold` + `tracking-[0.1em]` + `text-muted`. |
| `features/homepage/Philosophy.tsx` | Messages → `text-[var(--fv-hp-text-body)]` + `font-medium` + `max-w-[45ch]`. Headline `font-bold`. |
| `features/homepage/Features.tsx` | Card hover `border-[var(--fv-hp-accent-border)]`, icons `text-[var(--fv-hp-accent)]`, titles `font-bold`, descriptions `text-body` + `font-medium`. Headline `font-bold`. |
| `features/homepage/Mirror.tsx` | Eyebrow → blue + `font-bold` + `tracking-[0.1em]`. Statement `text-body` + `font-medium`. Bars blue. Labels `text-body` + `font-medium`, pct `font-bold`. Footnote `font-bold` + `text-muted`. |
| `features/homepage/Personal.tsx` | Text column `max-w-[50ch]`. Capability titles `font-bold`, desc `text-[var(--fv-hp-text-dark-body)]` + `font-medium`. CTA blue. Decorative bar `bg-[var(--fv-hp-accent-light)]`. |
| `features/homepage/Business.tsx` | Text column `max-w-[50ch]`. Planned label `font-bold` + `tracking-[0.1em]`. Titles `font-bold`, desc `text-body` + `font-medium`. Decorative bar `bg-[var(--fv-hp-accent-light)]`. Gold kept. |
| `features/homepage/Roadmap.tsx` | Phase1 status blue (`text-[var(--fv-hp-accent)] border-[var(--fv-hp-accent-border)]`). Titles/badges `font-bold`. List items `text-body` + `font-medium`. Bullets blue. |
| `features/homepage/Security.tsx` | Text column `max-w-[50ch]`. Shield icon blue. Statement `text-dark-body` + `font-medium`. Principles `font-bold`, desc `text-dark-body` + `font-medium`. |
| `features/homepage/Comparison.tsx` | Column headers `font-bold` + `tracking-[0.1em]`, FV column blue. Row labels `font-bold`, FV cells `font-semibold`, other cells `text-body` + `font-medium`. |
| `features/homepage/Pricing.tsx` | Disclaimer `font-bold`. Featured border `border-[var(--fv-hp-accent-border)]`. Tier names `font-bold`, prices `font-extrabold`, period `font-medium`. Features `text-body` + `font-medium`, bullets blue. Featured CTA blue. Footnote `font-medium` + `text-muted`. |
| `features/homepage/FinalCta.tsx` | Glow `rgba(29,78,216,0.06)`. Headline `font-bold`. Subline `text-body` + `font-medium`. Input focus blue, submit button blue. |
| `features/homepage/Footer.tsx` | Tagline/nav/legal/social → `text-[var(--fv-hp-text-muted)]` + `font-medium`. |

## State Handling

No state logic touched (Nav scroll/menu, FinalCta form). Pure class/color/token changes.

## Verification Checklist (10/10 PASS)

1. No `#6366f1` in homepage .tsx — 0 matches
2. No `818cf8` — 0 matches
3. No `rgba(99,102,241` — 0 matches (globals.css also clean)
4. Body on dark = 0.88 — `--fv-hp-text-body` used, no `text-white/70|80` body text remains (only nav-link whites kept per spec + input placeholder)
5. Body on light = `#374151` — `--fv-hp-text-dark-body` used in Personal/Security
6. All headings `font-bold` — all 17 h1/h2/h3 verified
7. Stats `font-extrabold` — Hero stats, Pricing prices
8. Labels/eyebrows `font-bold` — Mirror/Roadmap/Pricing/Business/Hero footnotes
9. `max-w-[50ch]` in Personal/Business/Security, `max-w-[45ch]` in Philosophy, Hero `max-w-[14ch]`
10. Focus rings blue — `*:focus-visible` + FinalCta input focus border

## Verification Commands

- `npx tsc --noEmit` — PASS (0 errors)
- `npm run lint` — PASS (0 errors; 27 pre-existing warnings outside scope, none in affected files)

## Notes for Designer QA

- `app/(app)/insights/page.tsx` still contains `#6366f1` in a chart COLORS array — outside the 15-file scope, flagged for @leader.
- Gold `#d4a853` retained for "PLANNED" (Business) + "PROPOSED" (Pricing) labels per spec.
- Line-height/leading values not in DS-004 changelog (e.g. Hero `leading-[1.65]`, Mirror statement) left untouched — structural safety.