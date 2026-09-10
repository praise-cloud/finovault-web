# Dark-Financial Layout: Shell & Module Spec (DS-005)

Layout spec for the Finovault financial app in dark mode. Geometry, personas, module order, loading/empty/error standards are already finalized in DESIGN.md §5–§7 — unchanged. This spec adds the dark shell control and per-module dark refinements, with file references for @frontend.

## 1. Shell

**Target**: `app/(app)/layout.tsx` (top bar) + existing `lib/theme/*` + `components/Providers.tsx`.

### 1.1 Theme mode toggle (top bar)

- **Control**: compact segmented control or single button cycling `light → dark → system`. Recommended: 3-state icon button (sun/moon/monitor) with `aria-label={t('settings.theme')}` and `aria-pressed` for system state; `title` shows current value (`settings.themeLight/Dark/System`).
- **Placement**: top bar, immediately left of `NotificationBell`. Keeps theme reachable on every (app) page without duplicating the full profile select.
- **State**: reuse the existing `useTheme()` mode/setMode (already mounted via `Providers.tsx`; already consumed in `profile/page.tsx` select). One source of truth — both controls write the same store.
- **Persistence + FOUC**: root `app/layout.tsx` inline script already applies `.dark` pre-hydration and `suppressHydrationWarning` is set — no changes.
- **No new i18n keys**: `settings.theme`, `settings.themeLight`, `settings.themeDark`, `settings.themeSystem` exist in `en.json` and mirror in `fr.json`. Verify the fr mirror before shipping.

### 1.2 Dark-specific shell notes

- Sidebar/nav: fully token-driven already (uses `--fv-role-wash` / `--fv-role-strong` for active state); verify visually in dark — no code change expected.
- Charts (`app/(app)/insights/page.tsx`): see tokens spec audit #10.

## 2. Dashboard module map — dark refinements per module

Modules ship in the order from DESIGN.md §6.3 (Hero → Quick actions → role cards → Insights → Goals → Recent → Coach CTA). No reordering. Dark attention per module:

| Module (id) | Component | Dark behavior | Action |
|---|---|---|---|
| `mod-hero` | `HeroBalance` | amount `--fv-role-accent` flips bright | none ✅ |
| `mod-actions` | `QuickActionRow` | icon `--fv-role-accent`; focus ring `--fv-role-strong` (bright in dark) | none ✅ |
| `mod-insights` | `InsightCard` | icon chip wash+strong flip | none ✅ |
| `mod-goals` | `GoalsProgressList` | % chip wash+strong; `ProgressRing` primary | none ✅ |
| `mod-recent` | `RecentTransactionsMini` | +/- amounts: text vs `--fv-role-accent` | none ✅ |
| `mod-coach` | `CoachCtaCard` | accent **fill** card → white text fails in dark | apply tokens spec #2–#4 (`--fv-on-fill` + remove forced-white override) |
| `mod-metrics` | `BusinessMetricsCard` | success/error tones read light-mode values | requires dark status tokens (tokens spec §1) |
| `mod-compliance` | `ComplianceCard` | status icon colors success/warning/error | same — dark status tokens |
| `mod-cashflow` | `CashFlowCard` | bar `--fv-role-accent`; track `--fv-border-subtle` | none ✅ |

### 2.1 Shared states (dark)

- **Loading skeletons**: dashes use `border-[var(--fv-border)]` → in dark `--fv-border` = `#f2f3ff` (full white) — too loud. Change skeleton + empty-state dashed placeholders to `border-[var(--fv-border-subtle)]` (muted in both modes). Files: `features/dashboard/components.tsx` (GoalsProgressList ~line 162, RecentTransactionsMini ~line 238) and any equivalent.
- **Empty**: `EmptyState` + `VaultMark subdued` — after VaultMark fix (tokens spec #9) the mark uses `--fv-text-secondary` → visible in dark ✅.
- **Switches**: off-track `bg-[var(--fv-border)]` → `bg-[var(--fv-border-subtle)]` (`app/(app)/profile/page.tsx:222`, `app/(app)/vault/page.tsx` equivalent track) so the white knob stays visible in dark off-state. Knob stays `bg-white` (tokens spec §3 OK list).

## 3. Persona dark verification matrix

| Persona | Accent (dark) | On-fill text | Wash | Verdict |
|---|---|---|---|---|
| individual | `#818CF8` | `#1A1A2E` = 5.8:1 ✅ | `#26264A` | pass |
| freelancer | `#FCA5A5` | `#1A1A2E` = 9.1:1 ✅ | `#3A2626` | pass |
| entrepreneur | `#FBBF24` | `#1A1A2E` = 10.4:1 ✅ | `#3A3226` | pass |
| sme | `#2DD4BF` | `#1A1A2E` = 9.2:1 ✅ | `#1F3836` | pass |

All four accent fills + primary + error support ink-on-fill in dark (full table in `specs/dark-financial-tokens.md` §2).

## 4. Data & API

- **No new endpoints.** Dashboard already consumes `useMoneySummary / useAccounts / useBudgets / useGoals / useInvoices / useVendors / useBillPayments` (`lib/hooks/use-money.ts`); profile consumes security hooks; mock BFF (`lib/api/mock/db.ts`) already fans out accounts/transactions/budgets/goals/invoices/vendors/billPayments/pensions/notifications.
- **Compliance rows** (`features/dashboard/components.tsx:317` static EN seeds, `ponytail:` note): out of scope for DS-005; becomes backend `GET /compliance` when the real data source exists.
- `api-contract.md`: **not updated** — no contract change.

## 5. Acceptance checklist (FE runs before design QA)

- [ ] All `.dark` token corrections + `--fv-on-fill` landed (tokens spec §1)
- [ ] Audit map #1–#9 applied (tokens spec §3)
- [ ] CoachCta override removed; `--fv-ink` now flips; `:focus-visible` ring visible in dark
- [ ] Top-bar theme toggle wired to existing `useTheme`; i18n reuses `settings.theme*` (en + fr)
- [ ] Dark status tokens live → Compliance/BusinessMetrics status colors pass AA
- [ ] Skeleton dashes + switch off-tracks use `--fv-border-subtle`
- [ ] Dark contrast table §2 re-verified by automated checker (12 pairs)
- [ ] Charts: dark-aware `COLORS` variant in insights (visual QA item)