# Homepage Component Specification

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
- `app/globals.css` — homepage utility classes
- `lib/i18n/en.json` / `lib/i18n/fr.json` — homepage keys

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
- **Background**: Transparent at top (over hero), solid `#0a0e17` after scroll (IntersectionObserver or scroll listener)
- **Layout**: `flex justify-between items-center px-6 md:px-10 max-w-7xl mx-auto h-full`
- **Nav links**: `text-sm uppercase tracking-wider text-white/80 hover:text-white transition-colors`
- **CTA**: Homepage-variant Button (primary, purple, sharp corners)
- **Mobile menu**: Full-screen overlay `bg-[#0a0e17]`, links stacked `text-2xl uppercase tracking-wide`, close button top-right
- **ARIA**: `<nav aria-label="Main navigation">`, hamburger `aria-expanded`, `aria-controls`
- **Focus**: Visible outline on all links/buttons

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
- **Headline**: `--fv-hp-display-xl` (clamp 2.5rem–4.5rem), Cinzel, `text-white`, uppercase, `max-w-[12ch]`
- **Subheadline**: `--fv-hp-body-lg` (1.25rem), Montserrat, `text-white/80`, `max-w-[55ch]`
- **CTA row**: `flex flex-wrap gap-4 mt-10`
- **Stats bar**: `grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full` — 3 stat blocks (value + label) + "ILLUSTRATIVE — Product in development" footnote
- **Vault animation**: CSS `@keyframes vaultSequence` on a `div` — 4 stages (logo → mechanism → unlock → dashboard) via opacity/transform. `@media (prefers-reduced-motion: reduce)` → instant reveal
- **ARIA**: `<h1>` for headline, `<section aria-label="Hero">`, stats in `<dl>`

### i18n keys
- `hp.hero.headline`, `hp.hero.subheadline`, `hp.hero.ctaPrimary`, `hp.hero.ctaSecondary`
- `hp.hero.stat1Value`, `hp.hero.stat1Label`, `hp.hero.stat2Value`, `hp.hero.stat2Label`, `hp.hero.stat3Value`, `hp.hero.stat3Label`
- `hp.illustrative` (shared "ILLUSTRATIVE — Product in development" label)

---

## 3. Philosophy — "YOUR MONEY IS TALKING" (`features/homepage/Philosophy.tsx`)

### Content
- Full-width dark section
- Statement headline: "YOUR MONEY IS TALKING."
- 3 key messages about money having opinions/feelings
- Visual: abstract pattern/data flow

### Spec
- **Background**: `#0a0e17`
- **Layout**: Centered content, asymmetric within: `max-w-7xl mx-auto px-6 md:px-10 py-24 md:py-32`
- **Headline**: `--fv-hp-display-lg`, Cinzel, uppercase, centered
- **3 messages**: `grid grid-cols-1 md:grid-cols-3 gap-12 mt-16` — each a statement (no cards, just text + thin top border)
- **Message style**: `border-t border-white/10 pt-6` + `text-lg text-white/80 leading-relaxed`
- **Pattern visual**: CSS/SVG abstract data-flow element (animated dots/lines, opacity/transform only) — purely decorative, `aria-hidden="true"`

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
- **Section label**: "WHAT FINOVAULT DOES" — `--fv-hp-display-lg` Cinzel uppercase, left-aligned
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16`
- **Card**: Sharp corners (0 radius), `border border-white/12`, `bg-white/4`, `p-8`, no shadow
- **Card content**: `h3` (`--fv-hp-display-md`, Cinzel, uppercase), icon (lucide, size 24, `text-[#6366f1]`), one-line description (`text-white/70`)
- **Hover**: `border-color` → `rgba(99,102,241,0.4)`, subtle transition (250ms ease-out)
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
- **Left text**: headline + statement + supporting copy
- **Right visual**: Dashboard mockup card (sharp corners, `border border-white/12`, `bg-white/4`)
  - Contains 3 category rows with percentage bars (green/positive, red/negative, muted/neutral)
  - Bars: `h-1.5 bg-[#6366f1]` with varying widths
  - Below: "ILLUSTRATIVE — Product in development"
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
- **Left text**: `--fv-hp-display-lg` headline (`text-[#1a1a1a]`), body copy (`text-[#1a1a1a]`)
- **4 capabilities**: `grid gap-6 mt-10` — numbered list (1-4), each with `border-t border-black/10 pt-4` + `h3` + one-liner
- **CTA**: Homepage Button primary
- **Right visual**: abstract SVG/pattern, `aria-hidden`

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
- **Left visual**: abstract business data visual (Cash flow chart mockup, aria-hidden)
- **Right text**: headline + 4 capabilities + CTA
- **Planning label**: "PLANNED — Part of Phase 2-3 roadmap" — `caps text-[0.75rem] tracking-[0.08em] text-[#d4a853] text-white/50`
- **CTA**: Secondary-styled button (bordered)

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
- **Headline**: `--fv-hp-display-lg` Cinzel uppercase
- **Timeline**: `grid grid-cols-1 md:grid-cols-3 gap-8`
- **Phase card**: `border border-white/12 p-8` — phase number, name, status badge, 3 capability bullets
- **Status badge**: 
  - Phase 1: `FOUNDATIONAL` (current) — `text-[#6366f1] border-[#6366f1]/40`
  - Phase 2/3: `FUTURE` — `text-white/50 border-white/20`
- **Connector**: thin horizontal line between cards on desktop (CSS `::after` or flex div)
- **Note**: No exaggerated claims; each future phase clearly marked

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
- **Layout**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Left text**: headline, statement, supporting sentence
- **Right**: 3-4 security principles stacked (`border-t border-black/10 pt-4` each)
- **Principles**: Data ownership, Local processing, Encryption, No third-party sharing
- **Visual**: minimal, trust-building (shield icon or abstract lock, aria-hidden)

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
- **Table**: Full-width `table-auto` or grid, `min-w-[640px]` for mobile scroll
- **Headers**: Column headers uppercase tracking; FINOVAULT column highlighted (`text-[#6366f1]` or `bg-[#6366f1]/5`)
- **Rows**: 5 categories. Cell content short phrases (highlight FINOVAULT best answer)
- **Cell style**: `border-b border-white/10 py-4 px-4 text-sm`
- **Highlight**: FINOVAULT column cells with `text-white font-medium` vs `text-white/60`

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
- **Headline**: `--fv-hp-display-lg` Cinzel uppercase
- **Disclaimer**: "PROPOSED / EARLY ACCESS" — prominent label above pricing
- **Tier cards**: `grid grid-cols-1 md:grid-cols-3 gap-8`
  - Each: `border border-white/12 p-8` — tier name, price, 4 feature checkmarks
  - Plus = featured (highlighted border `border-[#6366f1]/50`)
  - Free: no CTA (or "GET STARTED"), Plus: "CHOOSE PLUS", Business: "CONTACT US"
- **Price format**: `--fv-hp-stat` for number, `text-sm` for "/month"
- **Footnote**: "Pricing is proposed and will be validated before launch." — `text-white/40 text-sm`

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
- **Background**: `#0a0e17` with subtle purple radial glow (very restrained)
- **Layout**: Centered, `text-center py-32`
- **Headline**: `--fv-hp-display-xl` Cinzel uppercase
- **Subline**: `--fv-hp-body-lg` text-white/80
- **Form**: `flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-10`
  - Email input: `bg-transparent border border-white/20 text-white px-4 py-3 h-[52px] focus:border-[#6366f1]` (sharp corners)
  - Button: "JOIN THE WAITLIST" primary purple
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
- **Top row**: `flex flex-col md:flex-row justify-between gap-8` — logo/tagline left, nav links + social right
- **Bottom row**: `flex flex-col md:flex-row justify-between gap-4` — copyright left, legal links right
- **Nav links**: Features, How It Works, Security, Pricing (reuse nav keys)
- **Social**: Placeholder icons (Twitter/X, LinkedIn, Instagram) — `text-white/60 hover:text-white`
- **Legal**: Terms, Privacy, Contact — `text-white/50 text-sm`
- **Copyright**: `text-white/40 text-sm`

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

---

## app/page.tsx Conditional Logic

```tsx
// app/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { HomePage } from '@/features/homepage/HomePage';

export default function EntryPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const status = useAuthStore((s) => s.status);
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [status, router]);

  // Show homepage when not authenticated and not restoring
  if (status === 'idle' || status === 'authenticating' || status === 'error') {
    return <HomePage />;
  }

  // During restore, brief loading state
  return null;
}
```

---

## app/layout.tsx Metadata Update

```ts
export const metadata: Metadata = {
  title: 'FINOVAULT — See it. Understand it. Own it.',
  description:
    'FINOVAULT is a financial intelligence platform. See your money, understand your patterns, and own your financial future. Never enter debt.',
};
```

---

## globals.css Homepage Utilities

Add a `.hp-` prefixed block to `app/globals.css` for homepage tokens and utility classes:
- `--fv-hp-bg-deep`, `--fv-hp-bg-light`, `--fv-hp-accent-purple`, etc.
- `.hp-display` font class (Cinzel)
- `@media (prefers-reduced-motion: reduce)` reset block
- Keyframes for vault animation + scroll-reveal
