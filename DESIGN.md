# Design System

## Visual Theme

**Aesthetic**: Luxury brutalism — high contrast, large editorial typography, asymmetric layouts, sharp rectangular panels, thin borders. Not corporate fintech. Not friendly SaaS. Not dark-mode hacker.

**Color strategy**: Restrained. Deep navy-black background with white text. Single accent purple used sparingly (≤5% of surface). Gold for premium moments only (≤2%). Status colours for functional signals.

**Scene**: A sophisticated financial tool that looks like it was designed by people who take money seriously. The page should feel like opening a premium financial publication — authoritative, clean, intelligent.

## Colour Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--fv-hp-bg-deep` | `#0a0e17` | Hero, dark sections |
| `--fv-hp-bg-light` | `#faf8f5` | Alternating light sections |
| `--fv-hp-bg-white` | `#ffffff` | Cards on light sections |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--fv-hp-text-white` | `#ffffff` | Text on dark backgrounds |
| `--fv-hp-text-dark` | `#1a1a1a` | Text on light backgrounds |
| `--fv-hp-text-muted` | `rgba(255,255,255,0.6)` | Secondary text on dark |
| `--fv-hp-text-muted-dark` | `#6b7280` | Secondary text on light |

### Accent
| Token | Hex | Usage |
|-------|-----|-------|
| `--fv-hp-accent-purple` | `#6366f1` | Primary accent, CTAs, links |
| `--fv-hp-accent-purple-hover` | `#818cf8` | Hover state |
| `--fv-hp-accent-gold` | `#d4a853` | Premium accents, trust indicators, VaultMark |

### Status
| Token | Hex | Usage |
|-------|-----|-------|
| `--fv-hp-positive` | `#22c55e` | Positive financial movement |
| `--fv-hp-negative` | `#ef4444` | Negative financial movement |
| `--fv-hp-neutral` | `#6b7280` | Neutral information |

### Borders
| Token | Value | Usage |
|-------|-------|-------|
| `--fv-hp-border` | `rgba(255,255,255,0.12)` | Borders on dark backgrounds |
| `--fv-hp-border-light` | `rgba(0,0,0,0.08)` | Borders on light backgrounds |
| `--fv-hp-border-accent` | `rgba(99,102,241,0.3)` | Accent borders |

## Typography

### Font Families
| Role | Family | Source | Usage |
|------|--------|--------|-------|
| Display | Cinzel | Google Fonts (existing) | Headlines, section titles |
| Body | Montserrat | Google Fonts (existing) | Body text, UI elements |

**Note**: Both fonts already loaded in `app/layout.tsx`. No new dependencies needed.

### Type Scale (Homepage)

| Token | Size | Weight | Line-height | Letter-spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--fv-hp-display-xl` | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | 1.05 | -0.02em | Hero headline |
| `--fv-hp-display-lg` | `clamp(2rem, 4vw, 3rem)` | 700 | 1.1 | -0.02em | Section headlines |
| `--fv-hp-display-md` | `clamp(1.5rem, 3vw, 2rem)` | 700 | 1.15 | -0.01em | Sub-section headlines |
| `--fv-hp-body-lg` | `1.25rem` | 400 | 1.6 | 0 | Lead paragraphs |
| `--fv-hp-body` | `1rem` | 400 | 1.6 | 0 | Body text |
| `--fv-hp-body-sm` | `0.875rem` | 400 | 1.5 | 0 | Captions, labels |
| `--fv-hp-label` | `0.75rem` | 600 | 1.4 | 0.08em | Uppercase labels, eyebrows |
| `--fv-hp-stat` | `clamp(2rem, 5vw, 3.5rem)` | 700 | 1 | -0.02em | Statistics, metrics |

### Typography Rules
- **Headlines**: Cinzel, always uppercase, tight tracking (-0.02em)
- **Body**: Montserrat, sentence case, default tracking
- **Labels**: Montserrat, uppercase, wide tracking (0.08em)
- **No italic on headlines** — weight and size carry emphasis
- **Line length**: Cap body text at 65ch (`max-width: 65ch`)
- **Light-on-dark compensation**: Add 0.05 to line-height for light text on dark backgrounds
- **`text-wrap: balance`** on h1–h3 for even line lengths
- **`text-wrap: pretty`** on long prose to reduce orphans

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--fv-hp-space-xs` | `0.25rem` | Tight gaps |
| `--fv-hp-space-sm` | `0.5rem` | Small gaps |
| `--fv-hp-space-md` | `1rem` | Default gaps |
| `--fv-hp-space-lg` | `1.5rem` | Section element gaps |
| `--fv-hp-space-xl` | `2rem` | Card padding, content gaps |
| `--fv-hp-space-2xl` | `3rem` | Section internal spacing |
| `--fv-hp-space-3xl` | `4rem` | Section separators |
| `--fv-hp-space-4xl` | `6rem` | Major section breaks |
| `--fv-hp-space-5xl` | `8rem` | Hero vertical padding |

### Section Vertical Rhythm
- Dark sections: `py-24` to `py-32` (6rem to 8rem)
- Light sections: `py-20` to `py-28` (5rem to 7rem)
- Between sections: `py-16` to `py-20` (4rem to 5rem) or use visual separator (border/divider)

## Layout

### Container
- Max width: `1280px` (Tailwind `max-w-7xl`)
- Horizontal padding: `1.5rem` mobile, `2rem` tablet, `3rem` desktop
- All content sections use the same container for consistency

### Grid
- **4-card grids**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **2-column split**: `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`
- **Comparison table**: Horizontal scroll on mobile, full table on desktop
- **Pricing tiers**: `grid grid-cols-1 md:grid-cols-3 gap-8`

### Asymmetric Layouts
- Hero: Left-aligned text, right-side visual/animation
- Split sections: Alternate text-left/visual-right and visual-left/text-right
- Stats bar: Full-width, evenly distributed metrics
- Philosophy section: Full-width centered statement

### Responsive Breakpoints
- Mobile: < 768px (single column, stacked)
- Tablet: 768px - 1024px (2-column where appropriate)
- Desktop: > 1024px (full layout)

## Components

### Homepage-Specific Components

#### Nav
- **Type**: Sticky, transparent on hero, solid dark on scroll
- **Layout**: Logo left, nav links center, CTA right
- **Mobile**: Hamburger menu with slide-in overlay
- **Height**: 72px desktop, 64px mobile
- **Transition**: Background opacity on scroll (CSS transition, no JS animation loop)

#### Hero
- **Layout**: Full viewport height, left-aligned text
- **Background**: Deep navy-black (#0a0e17)
- **Content**: Headline + subheadline + 2 CTAs
- **Animation**: Vault-opening sequence (opacity/transform only, respects prefers-reduced-motion)
- **Stats bar**: Below hero, 3 metrics, clearly labelled "ILLUSTRATIVE"

#### GlassCard (Homepage Variant)
- **Use**: Feature cards, comparison cells
- **Style**: `border: 1px solid rgba(255,255,255,0.12)`, no glassmorphism blur
- **Background**: `rgba(255,255,255,0.04)` on dark, `#ffffff` on light
- **Border-radius**: 0 (sharp corners — luxury brutalism)
- **Padding**: 24px desktop, 20px mobile

#### Button (Homepage Variant)
- **Primary**: `bg: #6366f1`, `color: white`, `border-radius: 0`, uppercase, tracking 0.08em
- **Secondary**: `border: 1px solid rgba(255,255,255,0.3)`, `color: white`, `bg: transparent`, border-radius 0
- **Ghost**: `color: rgba(255,255,255,0.7)`, underline on hover
- **Hover**: Opacity change + subtle scale (0.98 on active)
- **Touch target**: Minimum 48px height

#### SectionDivider
- **Type**: Thin horizontal line (`1px solid rgba(255,255,255,0.08)`)
- **Usage**: Between major dark sections
- **Width**: Full container width

#### IllustrativeLabel
- **Type**: Small uppercase text with tracking
- **Content**: "ILLUSTRATIVE — Product in development" or "PLANNED — Part of Phase 2-3 roadmap"
- **Style**: `font-size: 0.75rem`, `letter-spacing: 0.08em`, `color: rgba(255,255,255,0.4)`
- **Usage**: Below statistics, mockups, and future feature sections

## Interaction Patterns

### Scroll-Triggered Reveals
- Elements fade in + translate up on viewport entry
- **CSS-only approach**: Use `@keyframes` with `animation-timeline: view()` for modern browsers, with a JS IntersectionObserver fallback
- **Stagger**: 100ms delay between sequential elements
- **Reduced motion**: Instant appearance (no animation)

### Hover States
- Cards: Subtle border colour change (not scale, not shadow)
- Buttons: Opacity + border-colour change
- Links: Colour change + underline transition

### Focus States
- `outline: 2px solid #6366f1` with `outline-offset: 2px`
- Visible on all interactive elements
- Never `outline: none` without replacement

### Vault Animation (Hero)
- **Sequence**: Near darkness → logo reveal → vault mechanism → unlock → dashboard glimpse → headline
- **Technique**: CSS keyframes on opacity and transform (translateY, scale)
- **Duration**: 3-4 seconds total
- **Trigger**: On page load (once)
- **Reduced motion**: Show headline immediately, skip animation
- **Implementation**: Pure CSS `@keyframes` with `animation-fill-mode: forwards`

## Motion

### Tokens
| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| `--fv-hp-motion-fast` | 150ms | ease-out | Button hover, link underline |
| `--fv-hp-motion-normal` | 250ms | ease-out | Card transitions, nav background |
| `--fv-hp-motion-slow` | 400ms | ease-out | Section reveals, scroll animations |
| `--fv-hp-motion-vault` | 3000ms | cubic-bezier(0.4, 0, 0.2, 1) | Hero vault animation |

### Rules
- **Only animate**: `opacity`, `transform`, `filter` (never layout properties)
- **Ease-out** for all reveals (exponential curve)
- **No bounce, no elastic** — premium restraint
- **Reduced motion**: All animations wrapped in `@media (prefers-reduced-motion: reduce)` with instant alternative
- **CSS-only preferred**: Use `@keyframes` + `animation` for hero sequence; IntersectionObserver for scroll reveals

## Homepage Section Architecture

### Colour Pattern
| # | Section | Background | Text |
|---|---------|------------|------|
| 1 | Nav | Transparent → solid dark | White |
| 2 | Hero | Deep navy (#0a0e17) | White |
| 3 | Stats Bar | Deep navy | White |
| 4 | Philosophy | Deep navy | White |
| 5 | Features | Deep navy | White |
| 6 | Financial Mirror | Deep navy | White |
| 7 | Personal Finance | Light (#faf8f5) | Dark (#1a1a1a) |
| 8 | Business | Deep navy | White |
| 9 | Roadmap | Deep navy | White |
| 10 | Security | Light (#faf8f5) | Dark |
| 11 | Comparison | Deep navy | White |
| 12 | Pricing | Deep navy | White |
| 13 | Final CTA | Deep navy | White |
| 14 | Footer | Deep navy | White (muted) |

### Section Spacing
- Dark-to-dark sections: 1px divider line or `gap: 0` with visual separator
- Dark-to-light transitions: No gap, clean colour boundary
- Light-to-dark transitions: No gap, clean colour boundary
- Internal section padding: `py-24` (6rem) to `py-32` (8rem)

## Existing System Integration

### Reuse These Components
- **VaultMark** (`components/VaultMark.tsx`): Logo in nav, hero, footer. Use `size` prop for responsive sizing.
- **Button** (`components/ui/Button.tsx`): CTAs. Override with homepage variant classes.
- **GlassCard** (`components/ui/GlassCard.tsx`): Feature cards, comparison cells.

### Extend These Tokens
All new homepage tokens use `--fv-hp-*` prefix to avoid collision with app tokens in `globals.css`.

### i18n Pattern
All text via `useTranslation()` hook from `react-i18next`. Keys follow `hp.*` namespace for homepage content.

## Legal Constraints

- ALL statistics/testimonials labelled "ILLUSTRATIVE — Product in development"
- NO unverified traction claims
- NO "bank-level security" or compliance claims
- NO fake testimonials or endorsements
- Pricing labelled "PROPOSED / EARLY ACCESS"
- Future capabilities marked "PLANNED" or "FUTURE"
- Privacy-first messaging only
- "See it. Understand it. Own it." and "Never enter debt." as approved taglines
