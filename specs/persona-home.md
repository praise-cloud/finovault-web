# Persona Home — Component Spec (NDS-002 wiring)

Design-only spec for @frontend-react. Source of truth for tokens: `DESIGN.md` (root). i18n: `lib/i18n/en.json` + `fr.json` (react-i18next).

## Page Anatomy

- Container: single `main` column, max-width 720px, 16px padding; role container `data-role="<role>"` sets `--fv-role-*` vars.
- Module order (all personas unless noted):
  1. GreetingHeader
  2. HeroBalance (metric numerals)
  3. QuickActionRow
  4. Role-specific: Entrepreneur → BusinessMetricsCard; SME → ComplianceCard + CashFlowCard
  5. InsightsCard
  6. GoalsProgressList
  7. RecentTransactionsMini (Individual only)
  8. CoachCtaCard
- Vertical gap 16px between modules; 24px before role-specific section.

## Modules

### 1. GreetingHeader (restyle)
- Layout: column; greeting 24px/700 ink; time-of-day chip = role accent fill + ink text (2px ink border), pill radius.
- Data: `home.greeting` `"Good {timeOfDay}, {name}"`, `home.morning/afternoon/evening`.
- States: none (static).

### 2. HeroBalance (restyle)
- Layout: hero card — white surface, 2px ink border, `--fv-shadow-hard`, radius 12px, padding 24px.
- Per-role primary numeral (from `home.metrics`, 32px/800, tabular-nums):
  - Individual: cashPosition ($)
  - Freelancer: unpaidInvoices? NO — primary = cashPosition; secondary = unpaidInvoices badge (coral accent) + taxEstimate caption
  - Entrepreneur: revenueMrr (MRR) + burnRate/rrunway caption
  - SME: cashPosition + runway caption ("{n} months")
- Label: `home.metrics.cashPosition`-style keys, caption 13px secondary.
- States: skeleton (32px dashed block) → data.

### 3. QuickActionRow (restyle)
- Layout: 48px chips, radius 10px, white + 2px ink border + hard shadow; 8px gap, wrap; label 15px/600 with icon 20px.
- Per-role actions (existing `home.actions.*`):
  - Individual: transfer, save, payBill, coach
  - Freelancer: send, addInvoice, setAsideTax, coach
  - Entrepreneur: insights, addProject (recordInvoice unused), coach
  - SME: payVendor, recordInvoice, grant? NO → payVendor, recordInvoice, coach
- States: default → hover lift (120ms) → press sink → focus ring accent-strong. Disabled: opacity 50, no shadow.

### 4. Role-specific cards
**BusinessMetricsCard (Entrepreneur)**
- 2×2 grid: MRR, Burn rate, Runway (months), Revenue (incomeThisMonth).
- Each cell: label caption, numeral 24px/800 role-accent-strong or ink, delta = success/error tokens.
- Data: `home.metrics.revenueMrr`, `burnRate`, `runway`, `revenue`; `home.sub.months` + `perMonth`.
- States: skeleton grid → data.

**ComplianceCard (SME)**
- Title `home.complianceTitle`, note chip `home.complianceNote` ("Static demo deadlines (mock)").
- Rows: 5 static label+date (en/fr per DESIGN.md §8). Date overdue → error badge; within 14d → warning badge; else neutral.
- Static data: constant array in component (`ponytail:` static mock approved by plan; replace with API when backend lands).

**CashFlowCard (SME)**
- Cash position numeral (cashPosition) + runway bar (Progress style: track `--fv-border-subtle`, fill teal accent) + `home.sub.months` caption.
- Action: `home.actions.payVendor` outline button → Press-accept state, calls existing payment flow (unchanged).

### 5. InsightsCard (new, all roles)
- Layout: card, wash background (role wash), 2px ink border, radius 12px, padding 16; kicker `home.needsAttentionTitle` ("Needs attention", overline accent-strong), icon 20px.
- Content = coach template first line (from `coach.*` role templates) as heading 15px/600 + inline 2 bullet points (static, from same coach copy).
  - Role template keys: individual → `coach.default` (keep universal until data-driven); freelancer → `coach.freelancerInvoices`/`freelancerTax`; entrepreneur → `coach.entrepreneurRevenue`/`entrepreneurBurn`; sme → `coach.smeCashFlow`/`smeCompliance`.
- Empty/loading: EmptyState reuse (`home.emptyTitle/Body/Cta`).
- A11y: `aria-labelledby` + section h2 (kicker).

### 6. GoalsProgressList (new, all roles)
- Layout: card list; title `home.savingsTitle` ("Savings" / "Épargne"); top 2–3 active SavingsGoal (not `completed`).
- Row: goal name 15px/600 + ProgressRing 28px (fill = role accent) + `MoneyText` current / target caption + `{pct}%` chip.
- Empty: `home.needsAttentionTitle`? No — use `home.emptyBody` + CTA to Goals tab.
- Data: `useGoals` (types: SavingsGoal { name, targetAmount, currentAmount, targetDate?, completed, contributions }).

### 7. RecentTransactionsMini (Individual, new)
- Layout: card; title `home.recentActivityTitle`; up to 3 latest Transaction rows (merchantName + category + date + signed amount; expense = ink, income = role accent-strong "+").
- Link `home.seeAll` → Transactions tab (icon-only? text link, focus ring).
- Empty: `home.emptyTitle/Body/Cta` EmptyState.
- Data: `useTransactions` (types: Transaction; date desc, collapse same-day duplicates).

### 8. CoachCtaCard (new, all roles)
- Layout: card — role accent fill, 2px ink border, ink text (contrast rule §2.2), radius 12px, padding 24px.
- Title `home.coachCtaTitle`, body `home.coachCtaBody` (15px), CTA `Button` white outline + ink text → navigates to Coach tab.
- Static only (no API).

## i18n additions
Only `home.recentActivityTitle`, `home.seeAll`, `home.coachCtaTitle`, `home.coachCtaBody`, `home.coachCtaAction`, `home.ofGoal`, `home.complianceTitle`, `home.complianceNote` — en + fr (table in DESIGN.md §8). Everything else reuses existing keys.

## Verification checklist (Phase 3 QA by @designer)
- [ ] Tokens applied app-wide per DESIGN.md §2 (globals.css light + dark).
- [ ] All modules present per persona; order per §Page Anatomy.
- [ ] Contrast: accent-strong text ≥4.5:1; on-accent per §2.2 table.
- [ ] Keyboard: focus ring visible on every module; buttons are `<button>`.
- [ ] Loading skeleton → empty → data for every data module.
- [ ] Reduced motion: no transforms.
- [ ] i18n: no hardcoded strings; fr parity.