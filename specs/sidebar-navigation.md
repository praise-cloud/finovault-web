# Sidebar Navigation — Expanded IA Spec (DS-007)

- Status: `partially_verified` — design spec complete; implementation = @frontend-react
- Author: @designer
- Date: 2026-09-10
- Inputs: `app/(app)/layout.tsx`, `DESIGN.md`, `lib/i18n/en|fr.json`, `lib/api/mock/db.ts`, `types/index.ts`
- Constraints: brutalist preserved, dark-mode token-driven, i18n en+fr, functional tabs only, grouped scannable IA, no new deps.

## 1. Information Architecture

Sidebar reorganized from flat list into **7 labeled groups**. Grouping follows frequency-of-use and job-to-be-done. On collapsed mobile widths (`w-16`), labels collapse to divider lines; icons remain accessible via `aria-label`.

### Tab Map (ordered top to bottom)

| # | Tab (i18n key) | Icon (lucide-react) | Route | Status |
|---|---|---|---|---|
| | **Overview** | | | |
| 1 | `tabs.dashboard` — Dashboard | `LayoutDashboard` | `/dashboard` | existing |
| 2 | `tabs.insights` — Insights | `BarChart3` | `/insights` | existing |
| | **Money** | | | |
| 3 | `tabs.accounts` — Accounts | `Wallet` | `/accounts` | existing |
| 4 | `tabs.cards` — Cards | `CreditCard` | `/cards` | **NEW** |
| 5 | `tabs.transactions` — Transactions | `ReceiptText` | `/transactions` | existing |
| 6 | `tabs.budgets` — Budgets | `PieChart` | `/budgets` | existing |
| | **Grow** | | | |
| 7 | `tabs.vault` — Vault | `PiggyBank` | `/vault` | existing |
| 8 | `tabs.investments` — Investments | `TrendingUp` | `/investments` | **NEW** |
| 9 | `tabs.loans` — Loans | `Landmark` | `/loans` | **NEW** |
| | **Operate** | | | |
| 10 | `tabs.pay` — Pay | `Send` | `/pay` | existing |
| 11 | `tabs.invoices` — Invoices | `FileText` | `/invoices` | existing |
| 12 | `tabs.vendors` — Vendors | `Store` | `/vendors` | existing |
| | **Reports** | | | |
| 13 | `tabs.reports` — Reports | `FileBarChart` | `/reports` | **NEW** |
| 14 | `tabs.statements` — Statements | `ScrollText` | `/statements` | **NEW** |
| | **Support** | | | |
| 15 | `tabs.coach` — Coach | `MessageCircle` | `/coach` | existing |
| 16 | `tabs.help` — Help | `HelpCircle` | `/help` | **NEW** |
| | **Account** | | | |
| 17 | `tabs.settings` — Settings | `Settings` | `/profile` | existing page |
| 18 | `tabs.profile` — Profile | `User` | `/profile` | existing page |

### Key Decisions

- **Pay icon change**: current sidebar uses `CreditCard` for Pay (layout.tsx line 18). Cards takes `CreditCard`; Pay moves to `Send` (transfers/bills semantics). `Accounts` moves to `Wallet` (currently hidden since Dashboard uses `Home`).
- **Settings → /profile**: the profile page *is* the settings page (Security Centre, Appearance, Language, Plan — `profile.*` keys). Settings and Profile both resolve to `/profile`. This is intentional: Settings is the standard fintech name; Profile is the account details subpage within it.
- **No dead links**: every tab maps to a real route. New routes get real page files (§4).
- **No mock data dependency**: all new pages render empty states only. Mock data surfacing is flagged as "later" per page.
- **Grouping rationale**: fintech apps (Revolut, Monzo, N26) use functional groups. Overview is glance, Money is balances, Grow is savings/investing, Operate is cash flow actions, Reports is analytics, Support is help, Account is profile. 18 items / 7 groups is scannable with labeled sections.

## 2. Sidebar Structure

```
<logo + Finovault mark>
<nav aria-label="Primary">                  <!-- md+: labeled groups, scrollable -->
  OVERVIEW
    Dashboard / Insights
  MONEY
    Accounts / Cards / Transactions / Budgets
  GROW
    Vault / Investments / Loans
  OPERATE
    Pay / Invoices / Vendors
  REPORTS
    Reports / Statements
  SUPPORT
    Coach / Help
</nav>
<nav aria-label="Account">                  <!-- mt-auto, pinned bottom -->
  ACCOUNT
    Settings / Profile
</nav>
```

- **Group label** (md+ only): 11px / 600 / uppercase / `0.08em` tracking / `text-[var(--fv-text-secondary)]` — matches DESIGN.md §3 Kicker token. Rendered as `<li>` with no link; `role="presentation"` wrapper group `<ul role="group" aria-labelledby="nav-group-money">` for screen reader grouping.
- **Mobile (`w-16`)**: group labels collapse to `h-px bg-[var(--fv-border-subtle)]` divider. Items render icon-only (existing: `<span className="hidden md:inline">`).
- **Item geometry**: `rounded-[10px] px-3 py-2.5 text-sm`, icon `size={20} strokeWidth={1.8}`. Touch target: add `py-3 md:py-2.5` for ≥44px mobile (DESIGN.md §9.1).
- **Scroll**: Primary nav gets `flex-1 overflow-y-auto`; Account nav sits outside at `mt-auto` (pinned bottom). No custom scrollbar.

## 3. Nav Item States (a11y + brutalist)

| State | CSS | Dark Behavior | A11y |
|---|---|---|---|
| **Idle** | `text-[var(--fv-text-secondary)]`, `border-2 border-transparent` | tokens flip automatically | — |
| **Hover** | `bg-[var(--fv-border-subtle)]` | tokens flip | 120ms ease-out |
| **Active** | `bg-[var(--fv-wash)]`, `border-2 border-[var(--fv-border)]`, `text-[var(--fv-text)] font-semibold` | `--fv-wash` → `#23233A`, `--fv-border` → light ink | `aria-current="page"` |
| **Focus-visible** | global `:focus-visible` outline, 2px `--fv-ink`, offset 2px | `--fv-ink` flips to `#f2f3ff` (DS-005 §12) | never removed |

**Layout shift prevention**: all items always have `border-2 border-transparent`; active state swaps border color only. Zero shift.

**Group label a11y**: each group is a `<ul role="group" aria-labelledby="nav-group-{slug}">`. Group label is `<li id="nav-group-{slug}" className="...">` with `role="presentation"` on the `<li>`, text content serves as the `aria-labelledby` target. Mobile: groups get `aria-hidden="true"` dividers (no structural change to the list).

## 4. New Page Shells

All pages follow DESIGN.md §7 (empty state pattern). Pages are **static-first** — no API calls in v1. Each page is a file `app/(app)/{slug}/page.tsx` exporting a client component with the `EmptyState` component.

Shared shell pattern:
- `h1` title: 24px/700 ink (§3 Section title)
- `<EmptyState>` centered below title, icon in wash circle with 2px ink border (§6.1)
- No skeleton/error states needed yet (no data fetch) — `ponytail:` skip until API lands

### 4.1 Cards — `app/(app)/cards/page.tsx`

| Field | Value |
|---|---|
| Title i18n | `cards.title` |
| Empty icon | `CreditCard` |
| Empty title i18n | `cards.emptyTitle` |
| Empty body i18n | `cards.emptyBody` |
| Future data | No `Card` type in `db.ts`. Later: new entity mirrors mobile docs. `ponytail:` no speculative card table. |

### 4.2 Investments — `app/(app)/investments/page.tsx`

| Field | Value |
|---|---|
| Title i18n | `investments.title` |
| Empty icon | `TrendingUp` |
| Empty title i18n | `investments.emptyTitle` |
| Empty body i18n | `investments.emptyBody` |
| Future data | `db.ts` has `PensionPlan`/`pensionContributions` — pension pot (Vault) is the natural first investment row later. Not surfaced in v1. |

### 4.3 Loans — `app/(app)/loans/page.tsx`

| Field | Value |
|---|---|
| Title i18n | `loans.title` |
| Empty icon | `Landmark` |
| Empty title i18n | `loans.emptyTitle` |
| Empty body i18n | `loans.emptyBody` |
| Future data | None seeded. Later: `goals.goals.debt` could generate loan entry. |

### 4.4 Reports — `app/(app)/reports/page.tsx`

| Field | Value |
|---|---|
| Title i18n | `reports.title` |
| Empty icon | `FileBarChart` |
| Empty title i18n | `reports.emptyTitle` |
| Empty body i18n | `reports.emptyBody` |
| Future data | Aggregates `transactions`, `budgets`, `invoices` — all seeded in `db.ts`. v1 empty; later derive client-side. |

### 4.5 Statements — `app/(app)/statements/page.tsx`

| Field | Value |
|---|---|
| Title i18n | `statements.title` |
| Empty icon | `ScrollText` |
| Empty title i18n | `statements.emptyTitle` |
| Empty body i18n | `statements.emptyBody` |
| Future data | `db.ts` has `accounts` — each linked account is a natural statement row later. |

### 4.6 Help — `app/(app)/help/page.tsx`

Help is **not data-driven** — static content page (exception to empty state pattern; the page's purpose *is* its content).

| Field | Value |
|---|---|
| Title i18n | `help.title` |
| Sections | FAQ via native `<details>` (no dependency), Contact card |
| FAQ items | 3 static Q&A (see i18n keys below) |
| Contact card | Email link + CTA to Coach tab |

## 5. Dark Mode Notes

All new elements are **fully token-driven** — no new dark-mode CSS overrides needed:
- Group labels: `text-[var(--fv-text-secondary)]` → `#9CA3AF` in dark (DESIGN.md §2.3)
- Active item wash: `bg-[var(--fv-wash)]` → `#23233A` in dark
- Active border: `border-[var(--fv-border)]` → light ink `#F2F3FF` in dark
- Idle border: `border-transparent` — no dark variation
- Hover bg: `bg-[var(--fv-border-subtle)]` → `rgba(242,243,255,0.25)` in dark
- Focus ring: global `--fv-ink` flips to `#f2f3ff` (DS-005 §12 fix)
- Divider lines: `bg-[var(--fv-border-subtle)]` — same as above
- Icons: inherit from `currentColor` via text color tokens

## 6. i18n Keys (en + fr)

### 6.1 Nav group labels (new namespace: `nav.groups`)

| Key | en | fr |
|---|---|---|
| `nav.groups.overview` | Overview | Aperçu |
| `nav.groups.money` | Money | Argent |
| `nav.groups.grow` | Grow | Croissance |
| `nav.groups.operate` | Operate | Opérations |
| `nav.groups.reports` | Reports | Rapports |
| `nav.groups.support` | Support | Assistance |
| `nav.groups.account` | Account | Compte |

### 6.2 Nav tab labels (extend `tabs` namespace)

| Key | en | fr |
|---|---|---|
| `tabs.cards` | Cards | Cartes |
| `tabs.investments` | Investments | Placements |
| `tabs.loans` | Loans | Prêts |
| `tabs.reports` | Reports | Rapports |
| `tabs.statements` | Statements | Relevés |
| `tabs.help` | Help | Aide |
| `tabs.settings` | Settings | Paramètres |
| `tabs.dashboard` | Dashboard | Tableau de bord |

Note: `tabs.dashboard` is new (current nav uses `tabs.home`). Add it to preserve backward compat (`tabs.home` stays for home page greeting context). If frontend prefers, `tabs.home` can serve double duty.

### 6.3 New page keys

**Cards:**
| Key | en | fr |
|---|---|---|
| `cards.title` | Cards | Cartes |
| `cards.emptyTitle` | No cards yet | Aucune carte |
| `cards.emptyBody` | Link a card to manage limits, PIN and spending here. | Connectez une carte pour gérer plafonds, code PIN et dépenses ici. |

**Investments:**
| Key | en | fr |
|---|---|---|
| `investments.title` | Investments | Placements |
| `investments.emptyTitle` | No investments yet | Aucun placement |
| `investments.emptyBody` | Track funds, ETFs and returns here once you start investing. | Suivez vos fonds, ETF et rendements ici dès que vous investissez. |

**Loans:**
| Key | en | fr |
|---|---|---|
| `loans.title` | Loans | Prêts |
| `loans.emptyTitle` | No loans | Aucun prêt |
| `loans.emptyBody` | Track repayments, interest and lenders here. | Suivez remboursements, intérêts et prêteurs ici. |

**Reports:**
| Key | en | fr |
|---|---|---|
| `reports.title` | Reports | Rapports |
| `reports.emptyTitle` | No reports yet | Aucun rapport |
| `reports.emptyBody` | Generate monthly, tax and spending reports here. | Générez vos rapports mensuels, fiscaux et de dépenses ici. |

**Statements:**
| Key | en | fr |
|---|---|---|
| `statements.title` | Statements | Relevés |
| `statements.emptyTitle` | No statements | Aucun relevé |
| `statements.emptyBody` | Download account statements once your accounts are linked. | Téléchargez vos relevés de comptes dès que vos comptes sont connectés. |

**Help:**
| Key | en | fr |
|---|---|---|
| `help.title` | Help & Support | Aide et assistance |
| `help.faqTitle` | Frequently asked questions | Questions fréquentes |
| `help.q1` | How do I link a bank account? | Comment connecter un compte bancaire ? |
| `help.a1` | Go to Accounts → Link account, and follow the secure flow. We use read-only access. | Allez dans Comptes → Connecter un compte et suivez la procédure sécurisée. Nous utilisons un accès en lecture seule. |
| `help.q2` | Is my money safe on Finovault? | Mon argent est-il en sécurité sur Finovault ? |
| `help.a2` | Yes. Finovault uses bank-grade encryption. We never store your banking password. | Oui. Finovault utilise un chiffrement de niveau bancaire. Nous ne stockons jamais votre mot de passe bancaire. |
| `help.q3` | How do I contact support? | Comment contacter le support ? |
| `help.a3` | Tap the button below or ask your Money Coach for help. | Appuyez sur le bouton ci-dessous ou demandez à votre Money Coach. |
| `help.contactTitle` | Still need help? | Besoin d'aide encore ? |
| `help.contactBody` | Our support team is here to help. | Notre équipe de support est là pour vous aider. |
| `help.contactCta` | Message us | Nous contacter |
| `help.coachCta` | Or ask your Money Coach | Ou demandez à votre Money Coach |

## 7. Accessibility Checklist (DS-007)

1. **Grouping**: `<ul role="group" aria-labelledby="nav-group-{slug}">` for each section. Screen readers announce "Overview group" / "Money group" etc.
2. **Active page**: `aria-current="page"` on the active `<Link>` (existing pattern, preserved).
3. **Focus ring**: global `:focus-visible` — 2px outline `--fv-ink`, offset 2px. Never removed (DESIGN.md §9.2).
4. **Touch targets**: sidebar items ≥ 44×44px on mobile. Current `py-2.5` + `px-3` ≈ 40px height; bump to `py-3` on mobile (`py-3 md:py-2.5`).
5. **Color not sole signal**: active state = ink border + background wash + bold text (3 signals, not color alone).
6. **Keyboard navigation**: full Tab/Shift+Tab through all items; Enter/Space activates links. No tabindex manipulation needed (all `<a>` links).
7. **Collapsed mobile**: icon-only items use `aria-label={t('tabs.{key}')}` — label is always present in the DOM (existing `hidden md:inline` pattern for text; `aria-label` goes on the `<Link>`, not the text span).
8. **Screen reader group navigation**: announce group label → items within; modern screen readers handle `role="group"` natively.

## 8. Frontend Implementation Notes

- Update `navItems` array in `layout.tsx` to reflect the new structure (7 groups, 18 items).
- Import new lucide icons: `LayoutDashboard`, `Wallet`, `ReceiptText`, `PieChart`, `TrendingUp`, `Landmark`, `Send`, `FileText`, `Store`, `FileBarChart`, `ScrollText`, `HelpCircle`, `Settings`. Remove `Home` import (no longer used in nav).
- Create `app/(app)/cards/page.tsx`, `investments/page.tsx`, `loans/page.tsx`, `reports/page.tsx`, `statements/page.tsx`, `help/page.tsx` — each renders a page title + `EmptyState`.
- Add all i18n keys to `lib/i18n/en.json` and `lib/i18n/fr.json`.
- For `tabs.dashboard`: if `tabs.home` is already used elsewhere for dashboard context, add `tabs.dashboard` as an alias; otherwise replace `tabs.home` with `tabs.dashboard` and audit other usages.
