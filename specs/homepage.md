# Homepage Component Specification (REVISED — Blue Brand + Brutalist Typography)

## Overview

13-section public homepage for FINOVAULT, a luxury-brutalist financial intelligence platform landing page. All text driven by i18n keys under `hp.*` namespace. Mobile-first, WCAG 2.1 AA, `prefers-reduced-motion` support.

**Files to create** in `features/homepage/`:
- `HomePage.tsx` — main composition
- `Nav.tsx`
- `Hero.tsx`
- `Philosophy.tsx`
- `Features.tsx`
- `Mirror.tsx`
- `Personal.tsx`
- `Business.tsx`
- `Roadmap.tsx`
- `Security.tsx`
- `Comparison.tsx`
- `Pricing.tsx`
- `FinalCta.tsx`
- `Footer.tsx`

**Files to modify**:
- `app/page.tsx` — conditional HomePage/redirect
- `app/layout.tsx` — metadata update
- `app/globals.css` — homepage utility classes (TOKEN CHANGES — see below)
- `lib/i18n/en.json` / `lib/i18n/fr.json` — homepage keys

---

## globals.css Token Updates

Replace the existing `--fv-hp-accent-purple*` and `--fv-hp-border-accent` tokens. Add new body-text tokens. Change existing label token weight.

```css
/* REMOVE these: */
/* --fv-hp-accent-purple: #6366f1; */
/* --fv-hp-accent-purple-hover: #818cf8; */
/* --fv-hp-border-accent: rgba(99,102,241,0.3); */

/* REPLACE WITH: */
--fv-hp-accent: #1D4ED8;
--fv-hp-accent-hover: #2563EB;
--fv-hp-accent-light: rgba(29,78,216,0.15);
--fv-hp-accent-border: rgba(29,78,216,0.3);
--fv-hp-accent-glow: rgba(29,78,216,0.06);

/* ADD body text tokens: */
--fv-hp-text-body: rgba(255,255,255,0.88);
--fv-hp-text-dark-body: #374151;

/* UPDATE type scale weights: */
--fv-hp-body-lg: 1.25rem;  /* size stays, weight 500 in usage */
--fv-hp-label: 0.75rem;     /* size stays, weight 700, tracking 0.1em in usage */
--fv-hp-stat: clamp(2rem, 5vw, 3.5rem);  /* size stays, weight 800 in usage */

/* UPDATE motion for CTA glow: */
--fv-hp-motion-fast: 150ms ease-out;
--fv-hp-motion-normal: 250ms ease-out;
--fv-hp-motion-slow: 400ms ease-out;
--fv-hp-motion-vault: 3000ms cubic-bezier(0.4, 0, 0.2, 1);
```

**Note on usage**: The CSS vars define sizes only. Weights are applied via Tailwind utility classes in each component (e.g. `font-bold`, `font-extrabold`, `font-semibold`). This is intentional — same size token, different weight per context.

---

## 1. Nav (`features/homepage/Nav.tsx`)

### Content
- Left: VaultMark logo (size=32) + wordmark "FINOVAULT"
- Center: 4 links — Features, How It Works, Security, Pricing
- Right: CTA button "ENTER FINOVAULT"
- Mobile: Hamburger toggle → slide-in overlay

### Spec
- **Type**: Sticky header, fixed top
- **Height**: 72px desktop, 64px mobile
- **Background**: Transparent at top (over hero), solid `#0a0e17` after scroll
- **Layout**: `flex justify-between items-center px-6 md:px-10 max-w-7xl mx-auto h-full`
- **Nav links**: `text-sm font-medium uppercase tracking-wider text-white/80 hover:text-white transition-colors`
  - **CHANGE**: Add `font-medium` (weight 500) for readability — was weight 400
- **CTA button**: Primary blue
  - `rounded-none bg-[var(--fv-hp-accent)] px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--fv-hp-accent-hover)] min-h-[48px]`
  - **CHANGE**: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`, `hover:bg-[#818cf8]` → `hover:bg-[var(--fv-hp-accent-hover)]`
- **Mobile menu**: Full-screen overlay `bg-[#0a0e17]`, links stacked `text-2xl font-bold uppercase tracking-wide`, close button top-right
  - **CHANGE**: Links get `font-bold` for brutalist weight
  - **Mobile CTA**: Same blue primary as desktop
- **ARIA**: `<nav aria-label="Main navigation">`, hamburger `aria-expanded`, `aria-controls`
- **Focus**: `outline: 2px solid var(--fv-hp-accent)` with `outline-offset: 2px`

### i18n keys
- `hp.nav.features`, `hp.nav.howItWorks`, `hp.nav.security`, `hp.nav.pricing`, `hp.nav.enter`

---

## 2. Hero (`features/homepage/Hero.tsx`)

### Content
- Headline: "NEVER ENTER DEBT."
- Subheadline: "Own what you never thought you would, with FINOVAULT."
- CTAs: "ENTER FINOVAULT" (primary) + "SEE HOW IT WORKS" (secondary)
- Vault animation background (CSS keyframes)
- Stats bar (3 metrics, "ILLUSTRATIVE" label)

### Spec
- **Background**: `#0a0e17`, full viewport height `min-h-[100svh]`
- **Layout**: `flex flex-col justify-center items-start px-6 md:px-10 max-w-7xl mx-auto` (left-aligned)
- **Headline**: `--fv-hp-display-xl`, Cinzel, `text-white`, `font-bold`, uppercase, `max-w-[14ch]`
  - **CHANGE**: `max-w-[12ch]` → `max-w-[14ch]` — 12ch was too tight, caused awkward wrapping
- **Subheadline**: `--fv-hp-body-lg`, Montserrat, `font-medium`, `text-[var(--fv-hp-text-body)]`, `max-w-[55ch]`
  - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]` (0.88 opacity — better contrast)
  - **CHANGE**: `font-medium` added for brutalist weight
- **CTA row**: `flex flex-wrap gap-4 mt-10`
  - Primary: `rounded-none bg-[var(--fv-hp-accent)] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--fv-hp-accent-hover)] min-h-[48px] inline-flex items-center`
    - **CHANGE**: `bg-[#6366f1]` → `bg-[var(--fv-hp-accent)]`, hover updated
  - Secondary: `rounded-none border border-white/30 bg-transparent px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5 min-h-[48px] inline-flex items-center`
- **Stats bar**: `grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full`
  - Stat value: `hp-display text-[var(--fv-hp-stat)] font-extrabold text-white`
    - **CHANGE**: Add `font-extrabold` (weight 800) — was no explicit weight
  - Stat label: `mt-1 text-sm font-medium text-[var(--fv-hp-text-muted)]`
    - **CHANGE**: Add `font-medium` for readability
  - Footnote: `mt-6 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--fv-hp-text-muted)]`
    - **CHANGE**: Weight 400 → `font-bold` for brutalist labels
- **Vault animation**: CSS `@keyframes vaultSequence` — unchanged
- **ARIA**: `<h1>` for headline, `<section aria-label="Hero">`, stats in `<dl>`

### i18n keys
- `hp.hero.headline`, `hp.hero.subheadline`, `hp.hero.ctaPrimary`, `hp.hero.ctaSecondary`
- `hp.hero.stat1Value`, `hp.hero.stat1Label`, `hp.hero.stat2Value`, `hp.hero.stat2Label`, `hp.hero.stat3Value`, `hp.hero.stat3Label`
- `hp.illustrative` (shared label)

---

## 3. Philosophy — "YOUR MONEY IS TALKING" (`features/homepage/Philosophy.tsx`)

### Content
- Full-width dark section
- Statement headline: "YOUR MONEY IS TALKING."
- 3 key messages about money having opinions/feelings
- Visual: abstract pattern/data flow

### Spec
- **Background**: `#0a0e17`
- **Layout**: Centered content: `max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32`
- **Headline**: `--fv-hp-display-lg`, Cinzel, `font-bold`, uppercase, centered
- **3 messages**: `grid grid-cols-1 md:grid-cols-3 gap-12 mt-16`
  - Each: `border-t border-white/10 pt-6`
  - **Message text**: `text-lg font-medium leading-relaxed text-[var(--fv-hp-text-body)] max-w-[45ch]`
    - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]` (0.88 opacity)
    - **CHANGE**: Add `font-medium` for weight
    - **CHANGE**: Add `max-w-[45ch]` — prevent lines stretching too wide in 3-col grid (each column gets ~40% of 1280px which can make long lines)
- **Pattern visual**: CSS/SVG — unchanged

### i18n keys
- `hp.philosophy.headline`, `hp.philosophy.message1`, `hp.philosophy.message2`, `hp.philosophy.message3`

---

## 4. Features — "WHAT FINOVAULT DOES" (`features/homepage/Features.tsx`)

### Content
- 4 cards: SEE, UNDERSTAND, PROTECT, DECIDE
- Each: icon + headline + one-line description

### Spec
- **Background**: `#0a0e17`
- **Layout**: `max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32`
- **Section label**: "WHAT FINOVAULT DOES" — `--fv-hp-display-lg` Cinzel `font-bold` uppercase, left-aligned
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16`
- **Card**: Sharp corners (0 radius), `border border-white/12 bg-white/4 p-8`
  - **Hover**: `hover:border-[var(--fv-hp-accent-border)]` transition 250ms
    - **CHANGE**: `hover:border-[rgba(99,102,241,0.4)]` → `hover:border-[var(--fv-hp-accent-border)]`
- **Card icon**: lucide, size 24, `text-[var(--fv-hp-accent)]`
  - **CHANGE**: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`
- **Card title**: `hp-display mt-4 text-[var(--fv-hp-display-md)] font-bold text-white`
  - **CHANGE**: Add `font-bold` — Cinzel heading should be bold
- **Card description**: `mt-3 text-sm font-medium leading-relaxed text-[var(--fv-hp-text-body)]`
  - **CHANGE**: `text-white/70` → `text-[var(--fv-hp-text-body)]` (0.88 opacity — MUCH more readable)
  - **CHANGE**: Add `font-medium` for brutalist weight
- **Icons**: lucide — SEE=`Eye`, UNDERSTAND=`BrainCircuit`, PROTECT=`ShieldCheck`, DECIDE=`TrendingUp`

### i18n keys
- `hp.features.title`, `hp.features.see.title`, `hp.features.see.desc`, `hp.features.understand.title`, `hp.features.understand.desc`, `hp.features.protect.title`, `hp.features.protect.desc`, `hp.features.decide.title`, `hp.features.decide.desc`

---

## 5. Mirror — Financial Mirror (`features/homepage/Mirror.tsx`)

### Content
- Section title + "This isn't budgeting. It's pattern recognition."
- Dashboard mockup with transaction categories + percentages
- "ILLUSTRATIVE" label

### Spec
- **Background**: `#0a0e17`
- **Layout**: Two-column `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Left text**:
  - Eyebrow: `text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--fv-hp-accent)]`
    - **CHANGE**: `text-[#6366f1]` → `text-[var(--fv-hp-accent)]`, weight 400 → `font-bold`
  - Headline: `hp-display mt-4 text-[var(--fv-hp-display-lg)] font-bold text-white`
  - Statement: `mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] font-medium leading-relaxed text-[var(--fv-hp-text-body)]`
    - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- **Right visual**: Dashboard mockup card (sharp corners, `border border-white/12 bg-white/4 p-8`)
  - Category bars: `h-1.5 bg-[var(--fv-hp-accent)]` (was `bg-[#6366f1]`)
    - **CHANGE**: Blue accent bars
  - Percentage values: `hp-display text-sm font-bold text-white`
    - **CHANGE**: Add `font-bold`
  - Category labels: `text-sm font-medium text-[var(--fv-hp-text-body)]`
    - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
  - Footnote: `mt-8 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--fv-hp-text-muted)]`
    - **CHANGE**: Add `font-bold`
- **ARIA**: mockup `aria-label="Illustrative financial pattern dashboard"`

### i18n keys
- `hp.mirror.eyebrow`, `hp.mirror.title`, `hp.mirror.statement`, `hp.mirror.cat1`, `hp.mirror.cat1pct`, `hp.mirror.cat2`, `hp.mirror.cat2pct`, `hp.mirror.cat3`, `hp.mirror.cat3pct`, `hp.mirror.cat4`, `hp.mirror.cat4pct`

---

## 6. Personal — "YOUR MONEY. YOUR RULES." (`features/homepage/Personal.tsx`)

### Content
- Split layout: text left, visual right
- 4 key capabilities
- CTA: "START SEEING YOUR MONEY"
- Light background

### Spec
- **Background**: `#faf8f5` (warm off-white)
- **Layout**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Left text**:
  - Headline: `--fv-hp-display-lg` (`text-[#1a1a1a]`), Cinzel `font-bold`
    - **CHANGE**: Add `font-bold`
  - **4 capabilities**: `grid gap-6 mt-10` — each with `border-t border-black/10 pt-4`
    - Capability title: `text-base font-bold text-[#1a1a1a]`
      - **CHANGE**: `font-semibold` → `font-bold` (heavier for brutalism)
    - Capability desc: `mt-1 text-sm font-medium text-[var(--fv-hp-text-dark-body)]`
      - **CHANGE**: `text-[#6b7280]` → `text-[var(--fv-hp-text-dark-body)]` (#374151 — darker, more readable)
      - **CHANGE**: Add `font-medium`
  - **Body max-width constraint**: `max-w-[50ch]` on the text column container for readability
    - **CHANGE**: Add `max-w-[50ch]` on the text `<div>` — prevents body text from stretching too wide on large screens
  - CTA: Primary blue
    - `inline-flex min-h-[48px] items-center rounded-none bg-[var(--fv-hp-accent)] px-7 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[var(--fv-hp-accent-hover)]`
    - **CHANGE**: Blue accent
- **Right visual**: unchanged (abstract placeholder)

### i18n keys
- `hp.personal.title`, `hp.personal.cap1`, `hp.personal.cap1desc`, `hp.personal.cap2`, `hp.personal.cap2desc`, `hp.personal.cap3`, `hp.personal.cap3desc`, `hp.personal.cap4`, `hp.personal.cap4desc`, `hp.personal.cta`

---

## 7. Business — "BUSINESS MONEY MOVES DIFFERENTLY." (`features/homepage/Business.tsx`)

### Content
- Split layout: visual left, text right
- 4 business capabilities
- CTA: "EXPLORE FOR BUSINESS"
- Labeled "PLANNED — Part of Phase 2-3 roadmap"

### Spec
- **Background**: `#0a0e17`
- **Layout**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center` (visual first)
- **Left visual**: unchanged (abstract placeholder, blue accent bars)
  - **CHANGE**: `bg-[#6366f1]/10` → `bg-[var(--fv-hp-accent-light)]`
- **Right text**:
  - Planning label: `text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#d4a853]/60`
    - **CHANGE**: Add `font-bold`
  - Headline: `--fv-hp-display-lg` Cinzel `font-bold` uppercase
  - **4 capabilities**: same pattern as Personal — `border-t border-white/10 pt-4`
    - Title: `text-base font-bold text-white`
      - **CHANGE**: `font-semibold` → `font-bold`
    - Desc: `mt-1 text-sm font-medium text-[var(--fv-hp-text-body)]`
      - **CHANGE**: `text-white/60` → `text-[var(--fv-hp-text-body)]` (0.88 opacity — was very dim!)
      - **CHANGE**: Add `font-medium`
  - **Body max-width constraint**: `max-w-[50ch]` on text column
  - CTA: Secondary styled (bordered)
    - **CHANGE**: `border-white/30` stays — secondary on dark

### i18n keys
- `hp.business.title`, `hp.business.planned`, `hp.business.cap1`, `hp.business.cap1desc`, `hp.business.cap2`, `hp.business.cap2desc`, `hp.business.cap3`, `hp.business.cap3desc`, `hp.business.cap4`, `hp.business.cap4desc`, `hp.business.cta`

---

## 8. Roadmap — "FROM FINANCIAL APP TO FINANCIAL INTELLIGENCE" (`features/homepage/Roadmap.tsx`)

### Content
- Timeline/progression visual
- Phase 1 (FOUNDATIONAL — current), Phase 2 (ENHANCING — FUTURE), Phase 3 (TRANSFORMING — FUTURE)

### Spec
- **Background**: `#0a0e17`
- **Layout**: `max-w-7xl mx-auto`
- **Headline**: `--fv-hp-display-lg` Cinzel `font-bold` uppercase
- **Timeline**: `grid grid-cols-1 md:grid-cols-3 gap-8`
- **Phase card**: `border border-white/12 p-8`
  - Phase number: `text-sm font-medium text-[var(--fv-hp-text-muted)]`
  - Phase title: `hp-display mt-2 text-[var(--fv-hp-display-md)] font-bold text-white`
    - **CHANGE**: Add `font-bold`
  - Status badge:
    - Phase 1 (current): `text-[var(--fv-hp-accent)] border-[var(--fv-hp-accent-border)]`
      - **CHANGE**: `text-[#6366f1] border-[#6366f1]/40` → blue accent
    - Phase 2/3: `text-white/50 border-white/20` (unchanged)
  - Badge style: `inline-block rounded-none border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em]`
    - **CHANGE**: Add `font-bold`
  - List items: `flex items-start gap-2 text-sm font-medium text-[var(--fv-hp-text-body)]`
    - **CHANGE**: `text-white/70` → `text-[var(--fv-hp-text-body)]`
    - **CHANGE**: Add `font-medium`
  - Bullet dots: `bg-[var(--fv-hp-accent)]`
    - **CHANGE**: `bg-[#6366f1]` → blue
- **Connector line**: `bg-white/10` (unchanged)

### i18n keys
- `hp.roadmap.title`, `hp.roadmap.phase1.title`, `hp.roadmap.phase1.status`, `hp.roadmap.phase1.item1`, `hp.roadmap.phase1.item2`, `hp.roadmap.phase1.item3`, `hp.roadmap.phase2.title`, `hp.roadmap.phase2.status`, `hp.roadmap.phase2.item1`, `hp.roadmap.phase2.item2`, `hp.roadmap.phase2.item3`, `hp.roadmap.phase3.title`, `hp.roadmap.phase3.status`, `hp.roadmap.phase3.item1`, `hp.roadmap.phase3.item2`, `hp.roadmap.phase3.item3`

---

## 9. Security — "YOUR MONEY IS PRIVATE." (`features/homepage/Security.tsx`)

### Content
- NO "bank-level" claims, NO certification badges
- "Designed with security and privacy as core requirements."
- 3-4 security principles

### Spec
- **Background**: `#faf8f5` (light)
- **Layout**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-start`
- **Left text**:
  - Headline: `--fv-hp-display-lg`, Cinzel `font-bold`, `text-[#1a1a1a]`
    - **CHANGE**: Add `font-bold`
  - Statement: `mt-6 max-w-[55ch] text-[var(--fv-hp-body-lg)] font-medium leading-relaxed text-[var(--fv-hp-text-dark-body)]`
    - **CHANGE**: `text-[#1a1a1a]/80` → `text-[var(--fv-hp-text-dark-body)]` (#374151)
    - **CHANGE**: Add `font-medium`
  - **Body max-width constraint**: `max-w-[50ch]` on text column
- **Right**:
  - Shield icon: `mb-6 text-[var(--fv-hp-accent)]`
    - **CHANGE**: `text-[#6366f1]` → blue
  - Principle title: `text-base font-bold text-[#1a1a1a]`
    - **CHANGE**: `font-semibold` → `font-bold`
  - Principle desc: `mt-1 text-sm font-medium text-[var(--fv-hp-text-dark-body)]`
    - **CHANGE**: `text-[#6b7280]` → `text-[var(--fv-hp-text-dark-body)]`
    - **CHANGE**: Add `font-medium`
  - Container: `border-t border-black/10 pt-4` (unchanged)

### i18n keys
- `hp.security.title`, `hp.security.statement`, `hp.security.principle1.title`, `hp.security.principle1.desc`, `hp.security.principle2.title`, `hp.security.principle2.desc`, `hp.security.principle3.title`, `hp.security.principle3.desc`, `hp.security.principle4.title`, `hp.security.principle4.desc`

---

## 10. Comparison — Comparison Table (`features/homepage/Comparison.tsx`)

### Content
- FINOVAULT vs Traditional Banking vs Budgeting Apps vs Wealth Management
- Categories: Approach, Data Control, Intelligence, Cost, Focus
- FINOVAULT advantages highlighted

### Spec
- **Background**: `#0a0e17`
- **Layout**: `max-w-7xl mx-auto px-6 md:px-10 overflow-x-auto` (horizontal scroll on mobile)
- **Table**: `min-w-[640px]` for mobile scroll
- **Column headers**: `text-[0.75rem] font-bold uppercase tracking-[0.1em]`
  - **CHANGE**: Add `font-bold`
  - FINOVAULT column: `text-[var(--fv-hp-accent)]`
    - **CHANGE**: `text-[#6366f1]` → blue
  - Others: `text-white/50`
- **Row label**: `text-sm font-bold text-white`
  - **CHANGE**: `font-medium` → `font-bold` (row headers should be punchy)
- **FINOVAULT cells**: `text-sm font-semibold text-white`
  - **CHANGE**: `font-medium` → `font-semibold`
- **Other cells**: `text-sm font-medium text-[var(--fv-hp-text-body)]`
  - **CHANGE**: `text-white/60` → `text-[var(--fv-hp-text-body)]` (was very dim!)
  - **CHANGE**: Add `font-medium`
- **Cell padding**: `py-4 px-4`
- **Cell border**: `border-b border-white/10`

### i18n keys
- `hp.comparison.title`, `hp.comparison.colFinovault`, `hp.comparison.colTraditional`, `hp.comparison.colBudgeting`, `hp.comparison.colWealth`
- `hp.comparison.approach`, `hp.comparison.dataControl`, `hp.comparison.intelligence`, `hp.comparison.cost`, `hp.comparison.focus`
- `hp.comparison.approachF`, `hp.comparison.approachT`, `hp.comparison.approachB`, `hp.comparison.approachW`, `hp.comparison.dataF`, `hp.comparison.dataT`, `hp.comparison.dataB`, `hp.comparison.dataW`, `hp.comparison.intelF`, `hp.comparison.intelT`, `hp.comparison.intelB`, `hp.comparison.intelW`, `hp.comparison.costF`, `hp.comparison.costT`, `hp.comparison.costB`, `hp.comparison.costW`, `hp.comparison.focusF`, `hp.comparison.focusT`, `hp.comparison.focusB`, `hp.comparison.focusW`

---

## 11. Pricing — Pricing (`features/homepage/Pricing.tsx`)

### Content
- "PROPOSED / EARLY ACCESS" disclaimer
- 3 tiers: Free (personal), Plus (MUR 199/mo), Business (MUR 5,000/mo)
- Feature comparison grid
- Pricing note: "Pricing is proposed and will be validated before launch"

### Spec
- **Background**: `#0a0e17`
- **Layout**: `max-w-7xl mx-auto`
- **Headline**: `--fv-hp-display-lg` Cinzel `font-bold` uppercase
- **Disclaimer**: `text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#d4a853]/60`
  - **CHANGE**: Add `font-bold`
- **Tier cards**: `grid grid-cols-1 md:grid-cols-3 gap-8`
  - Each: `border border-white/12 p-8`
    - Tier name: `hp-display text-[var(--fv-hp-display-md)] font-bold text-white`
      - **CHANGE**: Add `font-bold`
    - Price number: `hp-display text-[var(--fv-hp-stat)] font-extrabold text-white`
      - **CHANGE**: Add `font-extrabold` (weight 800)
    - Price period: `text-sm font-medium text-white/50`
      - **CHANGE**: Add `font-medium`
    - Feature items: `flex items-start gap-2 text-sm font-medium text-[var(--fv-hp-text-body)]`
      - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
    - Feature bullet: `bg-[var(--fv-hp-accent)]`
      - **CHANGE**: `bg-[#6366f1]` → blue
  - Plus (featured): `border-[var(--fv-hp-accent-border)]`
    - **CHANGE**: `border-[#6366f1]/50` → `border-[var(--fv-hp-accent-border)]`
  - Featured CTA: `bg-[var(--fv-hp-accent)] text-white hover:bg-[var(--fv-hp-accent-hover)]`
    - **CHANGE**: Blue accent
  - Non-featured CTA: secondary bordered (unchanged)
- **Footnote**: `mt-8 text-center text-sm font-medium text-[var(--fv-hp-text-muted)]`
  - **CHANGE**: `text-white/40` → `text-[var(--fv-hp-text-muted)]`, add `font-medium`

### i18n keys
- `hp.pricing.proposed`, `hp.pricing.title`
- `hp.pricing.tierFree.name`, `hp.pricing.tierFree.price`, `hp.pricing.tierFree.f1`, `hp.pricing.tierFree.f2`, `hp.pricing.tierFree.f3`, `hp.pricing.tierFree.f4`
- `hp.pricing.tierPlus.name`, `hp.pricing.tierPlus.price`, `hp.pricing.tierPlus.f1`, `hp.pricing.tierPlus.f2`, `hp.pricing.tierPlus.f3`, `hp.pricing.tierPlus.f4`
- `hp.pricing.tierBiz.name`, `hp.pricing.tierBiz.price`, `hp.pricing.tierBiz.f1`, `hp.pricing.tierBiz.f2`, `hp.pricing.tierBiz.f3`, `hp.pricing.tierBiz.f4`
- `hp.pricing.note`

---

## 12. Final CTA — "GIVE YOUR MONEY ONE SHOT." (`features/homepage/FinalCta.tsx`)

### Content
- Bold closing statement
- Email input + "JOIN THE WAITLIST" button
- "Be among the first to see your money differently."

### Spec
- **Background**: `#0a0e17` with subtle blue radial glow
  - **CHANGE**: `rgba(99,102,241,0.06)` → `rgba(29,78,216,0.06)` (blue glow, not purple)
- **Layout**: Centered, `text-center py-32`
- **Headline**: `--fv-hp-display-xl` Cinzel `font-bold` uppercase
  - **CHANGE**: Add `font-bold`
- **Subline**: `--fv-hp-body-lg font-medium text-[var(--fv-hp-text-body)]`
  - **CHANGE**: `text-white/80` → `text-[var(--fv-hp-text-body)]`, add `font-medium`
- **Form**: `flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-10`
  - Email input: `bg-transparent border border-white/20 text-white px-4 py-3 h-[52px] focus:border-[var(--fv-hp-accent)]`
    - **CHANGE**: `focus:border-[#6366f1]` → `focus:border-[var(--fv-hp-accent)]`
  - Button: Primary blue
    - `bg-[var(--fv-hp-accent)] text-white hover:bg-[var(--fv-hp-accent-hover)]`
    - **CHANGE**: Blue accent
- **Form label**: `<label>` visually-hidden or aria-label
- **Success state**: Replace form with thank-you message (`aria-live="polite"`)

### i18n keys
- `hp.cta.headline`, `hp.cta.subline`, `hp.cta.emailPlaceholder`, `hp.cta.button`, `hp.cta.success`

---

## 13. Footer (`features/homepage/Footer.tsx`)

### Content
- Logo, copyright, links
- Social links (placeholder)
- Legal links

### Spec
- **Background**: `#0a0e17`, top border `border-t border-white/10`
- **Layout**: `max-w-7xl mx-auto px-6 md:px-10 py-16`
- **Top row**: `flex flex-col md:flex-row justify-between gap-8`
  - Logo/tagline left: `text-sm font-medium text-[var(--fv-hp-text-muted)]`
    - **CHANGE**: `text-white/50` → `text-[var(--fv-hp-text-muted)]`, add `font-medium`
  - Nav links: `text-sm font-medium text-[var(--fv-hp-text-muted)] transition-colors hover:text-white`
    - **CHANGE**: Add `font-medium`
  - Social icons: `text-[var(--fv-hp-text-muted)] hover:text-white`
- **Bottom row**: `flex flex-col md:flex-row justify-between gap-4 border-t border-white/10 pt-8`
  - Copyright: `text-sm text-[var(--fv-hp-text-muted)]`
  - Legal links: `text-sm font-medium text-[var(--fv-hp-text-muted)] transition-colors hover:text-white`
    - **CHANGE**: Add `font-medium`

### i18n keys
- `hp.footer.tagline`, `hp.footer.copyright`, `hp.footer.terms`, `hp.footer.privacy`, `hp.footer.contact`

---

## Summary of New i18n Keys

| Namespace | Count |
|-----------|-------|
| `hp.nav.*` | 5 |
| `hp.hero.*` | 8 |
| `hp.illustrative` | 1 |
| `hp.philosophy.*` | 4 |
| `hp.features.*` | 9 |
| `hp.mirror.*` | 9 |
| `hp.personal.*` | 10 |
| `hp.business.*` | 11 |
| `hp.roadmap.*` | 16 |
| `hp.security.*` | 10 |
| `hp.comparison.*` | 25 |
| `hp.pricing.*` | 21 |
| `hp.cta.*` | 5 |
| `hp.footer.*` | 5 |
| **Total** | **~139** |

No new i18n keys needed — this redesign is purely visual (colors, weights, spacing). All text content stays the same.

---

## app/page.tsx Conditional Logic

```tsx
// app/page.tsx — NO CHANGES NEEDED
// Existing code is correct, no modifications required.
```

---

## app/layout.tsx Metadata Update

```ts
// NO CHANGES NEEDED
// Existing metadata is correct.
```

---

## globals.css Homepage Utilities

The CSS custom property block at the top of the file needs these specific changes:

1. **Remove** `--fv-hp-accent-purple` and `--fv-hp-accent-purple-hover`
2. **Add** `--fv-hp-accent`, `--fv-hp-accent-hover`, `--fv-hp-accent-light`, `--fv-hp-accent-border`, `--fv-hp-accent-glow`
3. **Add** `--fv-hp-text-body`, `--fv-hp-text-dark-body`
4. **Keep** all other tokens unchanged (backgrounds, borders, motion, etc.)
