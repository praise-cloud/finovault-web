# Redesign Summary — DS-004 (Blue Brand + Brutalist Typography + Readability)

## What Changed and Why

User feedback: "The whole site looks off, arrange the text properly everything should be readable and use brutalism style and bold typography, and use the brand color which is blue."

Three root problems were identified:

### 1. Wrong Brand Color (PURPLE → BLUE)

The homepage was using `#6366f1` (indigo/purple) as its accent everywhere — buttons, icons, borders, focus rings, highlights. But the actual FINOVAULT brand blue from `lib/theme/tokens.ts` is `#1D4ED8` (primary) / `#3B82F6` (primaryLight). The homepage needs the brand blue.

**What changed**:
- All `#6366f1` → `#1D4ED8` (via CSS custom property `--fv-hp-accent`)
- All `#818cf8` → `#2563EB` (hover state, via `--fv-hp-accent-hover`)
- All `rgba(99,102,241,*)` → `rgba(29,78,216,*)` (border accents, glow)
- Gold `#d4a853` kept for "PLANNED" labels only (≤2% usage)

### 2. Text Readability Fixed

The user said "arrange the text properly everything should be readable." Problems found:

**a) Body text too dim on dark backgrounds**
- Was: `text-white/80` (opacity 0.80) and `text-white/70` (0.70)
- Now: `text-[var(--fv-hp-text-body)]` = `rgba(255,255,255,0.88)` (opacity 0.88)
- Impact: Body text is now clearly readable against `#0a0e17` at ~12:1 contrast ratio

**b) Body text too dim on light backgrounds**
- Was: `text-[#6b7280]` (#6b7280 — 45% gray)
- Now: `text-[var(--fv-hp-text-dark-body)]` = `#374151` (darker gray)
- Impact: Body text on `#faf8f5` now has ~7:1 contrast ratio

**c) No max-width on text columns**
- Added `max-w-[50ch]` on text columns in Personal, Business, Security, Philosophy sections
- Impact: Lines don't stretch to 600px+ on wide screens. Keeps body text at comfortable reading width

**d) Philosophy messages stretched too wide in 3-column grid**
- Added `max-w-[45ch]` on philosophy message paragraphs
- Impact: Prevents ultra-long lines in the 3-column layout

**e) Hero headline too constrained**
- Changed `max-w-[12ch]` → `max-w-[14ch]`
- Impact: Prevents awkward word wrapping on "NEVER ENTER DEBT." (12 characters exactly, but other headlines might wrap oddly)

### 3. Bold Brutalist Typography

The user wanted "brutalism style and bold typography." The existing design had thin, light text that felt more like corporate SaaS than brutalism.

**What changed across all components**:

| Element | Before | After | Why |
|---------|--------|-------|-----|
| Feature card titles | weight 400 (Cinzel default) | `font-bold` (700) | Brutalism = bold, confident headings |
| Card/body descriptions | `font-normal` (400) | `font-medium` (500) | Stronger reading weight on dark |
| Stat numbers | no explicit weight | `font-extrabold` (800) | Numbers should punch |
| Section labels/eyebrows | `font-normal` (400) | `font-bold` (700) | Labels need presence |
| Capability titles (Personal/Business) | `font-semibold` (600) | `font-bold` (700) | Heavier hierarchy |
| Principle titles (Security) | `font-semibold` (600) | `font-bold` (700) | Heavier hierarchy |
| Nav links | `font-normal` (400) | `font-medium` (500) | Readable at small size |
| Pricing feature list | `font-normal` (400) | `font-medium` (500) | Clearer at small size |
| Mobile menu links | `font-normal` (400) | `font-bold` (700) | Bold = brutalist |
| Footer text | `font-normal` (400) | `font-medium` (500) | Subtle but present |
| Comparison cell text (non-FV) | `font-normal` (400) | `font-medium` (500) | Still muted but readable |
| Illustrative/Planned labels | `font-normal` (400) | `font-bold` (700) | Legal labels must be visible |

**Typography weight hierarchy** (new):
```
800 (extrabold) — Statistics, metric numbers
700 (bold)      — Headings, labels, eyebrows, capability titles
600 (semibold)  — CTAs, buttons
500 (medium)    — Body text on dark, nav links, secondary text
400 (regular)   — Body text on light backgrounds only
```

---

## Files Changed (by @frontend)

### globals.css
1. Replace `--fv-hp-accent-purple` / `--fv-hp-accent-purple-hover` with `--fv-hp-accent` / `--fv-hp-accent-hover` / `--fv-hp-accent-light` / `--fv-hp-accent-border` / `--fv-hp-accent-glow`
2. Add `--fv-hp-text-body` and `--fv-hp-text-dark-body` tokens

### Nav.tsx
- CTA button: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`, hover → `var(--fv-hp-accent-hover)`
- Nav links: add `font-medium`
- Mobile links: add `font-bold`
- Mobile CTA: same blue swap

### Hero.tsx
- Headline: `max-w-[12ch]` → `max-w-[14ch]`
- Subheadline: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Primary CTA: blue accent swap
- Stat values: add `font-extrabold`
- Stat labels: add `font-medium`, use `text-[var(--fv-hp-text-muted)]`
- Footnote: add `font-bold`

### Philosophy.tsx
- Messages: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`, add `max-w-[45ch]`

### Features.tsx
- Card hover: `hover:border-[rgba(99,102,241,0.4)]` → `hover:border-[var(--fv-hp-accent-border)]`
- Icons: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`
- Card titles: add `font-bold`
- Card descriptions: `text-white/70` → `text-[var(--fv-hp-text-body)]`, add `font-medium`

### Mirror.tsx
- Eyebrow: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`, add `font-bold`
- Statement: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Bar fills: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`
- Category labels: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Percentage values: add `font-bold`

### Personal.tsx
- Capability titles: `font-semibold` → `font-bold`
- Capability descriptions: `text-[#6b7280]` → `text-[var(--fv-hp-text-dark-body)]`, add `font-medium`
- Text column: add `max-w-[50ch]`
- CTA: blue accent swap
- Decorative visual bar: `bg-[#6366f1]/10` → `bg-[var(--fv-hp-accent-light)]`

### Business.tsx
- Capability titles: `font-semibold` → `font-bold`
- Capability descriptions: `text-white/60` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Text column: add `max-w-[50ch]`
- Decorative bar: `bg-[#6366f1]/10` → `bg-[var(--fv-hp-accent-light)]`

### Roadmap.tsx
- Phase status (current): `text-[#6366f1] border-[#6366f1]/40` → `text-[var(--fv-hp-accent)] border-[var(--fv-hp-accent-border)]`
- Status badge: add `font-bold`
- Phase titles: add `font-bold`
- List items: `text-white/70` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Bullet dots: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`

### Security.tsx
- Shield icon: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`
- Statement: `text-[#1a1a1a]/80` → `text-[var(--fv-hp-text-dark-body)]`, add `font-medium`
- Text column: add `max-w-[50ch]`
- Principle titles: `font-semibold` → `font-bold`
- Principle descriptions: `text-[#6b7280]` → `text-[var(--fv-hp-text-dark-body)]`, add `font-medium`

### Comparison.tsx
- Column headers: add `font-bold`
- FINOVAULT column header: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`
- Row labels: `font-medium` → `font-bold`
- FINOVAULT cells: `font-medium` → `font-semibold`
- Other cells: `text-white/60` → `text-[var(--fv-hp-text-body)]`, add `font-medium`

### Pricing.tsx
- Tier names: add `font-bold`
- Price numbers: add `font-extrabold`
- Feature items: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Feature bullets: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`
- Featured tier border: `border-[#6366f1]/50` → `border-[var(--fv-hp-accent-border)]`
- Featured CTA: blue accent swap
- Footnote: `text-white/40` → `text-[var(--fv-hp-text-muted)]`, add `font-medium`

### FinalCta.tsx
- Background glow: `rgba(99,102,241,0.06)` → `rgba(29,78,216,0.06)`
- Headline: add `font-bold`
- Subline: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- Email input focus: `focus:border-[#6366f1]` → `focus:border-[var(--fv-hp-accent)]`
- Submit button: blue accent swap

### Footer.tsx
- Tagline: `text-white/50` → `text-[var(--fv-hp-text-muted)]`, add `font-medium`
- Nav links: add `font-medium`
- Legal links: add `font-medium`

---

## What Did NOT Change

- **Background colors**: `#0a0e17` (dark) and `#faf8f5` (light) stay
- **Gold accent**: `#d4a853` stays for "PLANNED" labels only
- **Section order**: All 13 sections in same sequence
- **Border-radius**: Still 0 (sharp corners — brutalism)
- **i18n keys**: No new keys, no content changes
- **Layout grid**: Same column structures
- **Component structure**: No new components, no removed components
- **Font families**: Cinzel + Montserrat (already loaded)
- **Animation**: Vault sequence, scroll reveals unchanged

---

## Verification Checklist for Frontend Agent

After implementing changes, verify:

1. **No `#6366f1` remains** in any homepage `.tsx` file — search for it
2. **No `818cf8` remains** — search for it
3. **`rgba(99,102,241`** should not appear — search for it
4. **Body text on dark sections** is readable (0.88 opacity, not 0.70 or 0.80)
5. **Body text on light sections** is #374151 (not #6b7280)
6. **All headings have `font-bold`** in their className
7. **Stats have `font-extrabold`**
8. **Labels/eyebrows have `font-bold`**
9. **Text columns have `max-w-[50ch]` or `max-w-[45ch]`** in Philosophy
10. **Focus rings use blue** — test with Tab key
