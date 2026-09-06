# Finovault Web — Realignment Plan (Flutter Reference)

> **Date:** 2026-09-04
> **Purpose:** Rebuild the web persona homes to match the Flutter mobile reference, per-role.
> **Reference:** `finovault-flutter/FLOVAULT_RESEARCH_REPORT.md` (corrected against verified web state)
> **Status:** APPROVED — user sign-off received 2026-09-04. Scope: **persona homes only**.
> Decisions: (1) add `individual@finovault.app` (`Vault123!`) demo seed; (2) ComplianceCard uses **mock/static deadlines**.

---

## 1. Context & Correction

The research report's "Features Not Yet in Web" list is **stale**. This session verified the
following are **already built** on web: coach, budgets, invoices, vendors, pension, bills, grants,
security/2FA, linked accounts, transactions, transfers, payees, insights. The real gap is
**not missing features** — it is that the **persona homes are much simpler** than the Flutter
reference. The web has the skeleton (HeroBalance, metrics, quick actions) but is missing the
richer dashboard modules.

---

## 2. Per-Role Feature Matrix (Corrected)

### Cross-role (all roles) — already present on web ✅
HeroBalance, security score, quick actions, spending vs budget, savings/rainy-day fund, pension card,
transactions, transfers, bill pay, budgets, linked accounts, security/2FA, money coach, insights.

### The realignment gap — modules missing from web persona homes

| Module | Individual | Freelancer | Entrepreneur | Entrepreneur (FF) | SME |
|--------|:----------:|:----------:|:------------:|:-----------------:|:---:|
| **InsightsCard** (income vs expense mini chart) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **GoalsProgressList** (up to 3 goals w/ progress) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **RecentTransactionsMini** (last 5 txns) | ❌ | — | — | — | — |
| **Coach CTA** ("Get insights" → coach) | ❌ | ❌ | ❌ | ❌ | ❌ |
| **BusinessMetricsCard** (MRR/ARR, burn multiple) | — | — | ❌ | ❌ | — |
| **ComplianceCard** (tax/PAYE/VAT deadlines) | — | — | — | — | ❌ |
| **CashFlowCard** (monthly burn, runway, net flow) | — | — | — | — | ❌ |
| **FemaleFounderCard** (grants) | — | — | — | ✅ (exists) | — |

Legend: ✅ = present, ❌ = missing (to build), — = not applicable to role.

### Per-role quick-action sets (Flutter reference vs web current)

| Role | Flutter quick actions | Web current | Gap |
|------|----------------------|-------------|-----|
| Individual | Send, Save, Coach, Budget | Send, Save, PayBill, Insights | Swap PayBill→Coach, Insights→Budget |
| Freelancer | Invoice, Send, Coach, Tax shield | AddInvoice, SetAsideTax, Transfer, Coach | Add Coach CTA |
| Entrepreneur | Send, Tax, Coach, Cash flow | CashFlow, Grants, Transfer, Coach | Add Coach CTA |
| SME | Pay vendor, Send, Coach, Bills | PayVendor, RecordInvoice, CashFlow, Advisor | Add Coach CTA |

---

## 3. Data Availability (verified via `lib/hooks/use-money.ts`)

All data needed for the missing modules is **already available** through existing hooks:

- **InsightsCard**: `useMoneySummary()` → `monthIncome`, `monthExpense` (income vs expense chart)
- **GoalsProgressList**: `useGoals()` → `SavingsGoal[]` (name, currentAmount, targetAmount, type)
- **RecentTransactionsMini**: `useTransactions(5)` → last 5 `Transaction[]` (direction, category, amount)
- **Coach CTA**: `useRouter().push('/coach')` — coach page exists
- **BusinessMetricsCard**: `useMoneySummary()` → `runwayMonths`, `monthIncome` (MRR proxy); needs burn multiple calc
- **ComplianceCard**: SME deadlines — needs a small data source (mock or derived)
- **CashFlowCard**: `useMoneySummary()` → `runwayMonths`, `monthExpense`, `monthIncome` (net flow)

**No new backend endpoints or schema changes required.** This is a pure frontend/dashboard
composition task.

---

## 4. Design Direction (from Flutter tokens)

- **Role accents**: Individual `#6366F1` (indigo), Freelancer `#F97066` (coral), Entrepreneur
  `#F59E0B` (amber), Entrepreneur-FF `#A855F7` (plum), SME `#14B8A6` (teal)
- **Neo-brutalist**: 2px solid ink border + 3px offset shadow (no blur) + 12px card radius
- **Typography**: Montserrat (400/500/600/700/800), heading 32/24, body 15, caption 13
- **Surfaces**: `#F5F7FF` wash background, white cards, `#1A1A2E` ink text, `#6B7280` muted
- **Module order** (Flutter): Hero → Quick actions → [role-specific cards] → InsightsCard →
  GoalsProgressList → RecentTransactionsMini → Coach CTA

---

## 5. Task Breakdown

| ID | Task | Agent | Depends |
|----|------|-------|---------|
| DS-001 | Design tokens + per-role dashboard specs (DESIGN.md + specs/) | @designer | — |
| FE-001 | Rebuild 4 persona homes with missing modules | @frontend-nuxt | DS-001 |
| FE-002 | Add shared dashboard modules (InsightsCard, GoalsProgressList, RecentTransactionsMini, CoachCTA, BusinessMetricsCard, ComplianceCard, CashFlowCard) | @frontend-nuxt | DS-001 |
| FE-003 | i18n keys (en/fr) for new module copy + parity test | @frontend-nuxt | FE-001/002 |
| FE-004 | Add `individual@finovault.app` (`Vault123!`) demo seed in `lib/api/mock/db.ts` | @frontend-nuxt | — |
| DS-002 | Design QA on live result (PASS/FAIL) | @designer | FE-001/002/003/004 |
| RV-001 | Code review + typecheck/lint/test gate | @reviewer | FE-003 |

---

## 6. Out of Scope (this phase)

- Backend/Supabase BFF wiring (separate pending work)
- Onboarding link-accounts step wiring (separate pending work)
- Supabase migrations SQL (separate pending work)
- New backend endpoints (none needed)

---

## 7. Decisions (Confirmed by User)

1. **Demo login**: ✅ ADD `individual@finovault.app` (`Vault123!`) seed — every role has a seeded account.
2. **ComplianceCard data**: ✅ Mock/static deadlines in the component (no backend change).
3. **Scope**: ✅ Persona homes only — Insights/Vault/Pay/Profile tab pages out of scope this phase.
