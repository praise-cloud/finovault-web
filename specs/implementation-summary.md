# Implementation Summary — FE-009 (Expanded Sidebar Navigation + 6 New Pages)

Status: **implemented, verified** (tsc 0 errors, eslint 0 errors on changed files, 60/60 tests pass)

Spec: `specs/sidebar-navigation.md` (DS-007). Scope was code-only — design decisions final. No API/mock changes; pages are static-first empty states (per spec §4).

## Files changed

| File | Change |
|---|---|
| `app/(app)/layout.tsx` | Sidebar rewritten: 7 labeled groups (Overview, Money, Grow, Operate, Reports, Support) + pinned Account group. `NavLink` + `GroupLabel` components. Primary nav `flex-1 flex-col gap-1 overflow-y-auto`; Account nav `mt-auto`. Removed `Home` import; `CreditCard` moved to /cards, Pay now uses `Send`. |
| `app/(app)/cards/page.tsx` | New — `EmptyPageShell` + `CreditCard` icon |
| `app/(app)/investments/page.tsx` | New — `EmptyPageShell` + `TrendingUp` icon |
| `app/(app)/loans/page.tsx` | New — `EmptyPageShell` + `Landmark` icon |
| `app/(app)/reports/page.tsx` | New — `EmptyPageShell` + `FileBarChart` icon |
| `app/(app)/statements/page.tsx` | New — `EmptyPageShell` + `ScrollText` icon |
| `app/(app)/help/page.tsx` | New — FAQ page: native `<details>`/`<summary>` (3 items), GlassCard contact card (`mailto:support@finovault.app` placeholder), link to /coach |
| `components/ui/EmptyState.tsx` | Added optional `icon?: LucideIcon` prop — renders in 64px wash circle with 2px `--fv-border` border; VaultMark fallback unchanged |
| `components/ui/EmptyPageShell.tsx` | New shared shell: h1 (24px/700) + `EmptyState`; exported from `components/ui/index.ts` |
| `lib/i18n/en.json` + `fr.json` | `tabs.*` (dashboard replaces home; added cards/investments/loans/reports/statements/help/settings), `nav.groups.*` (7 keys), and namespaces `cards.*`, `investments.*`, `loans.*`, `reports.*`, `statements.*`, `help.*` in both locales |

## Navigation structure

`primaryGroups` (data-driven): Overview `/dashboard` `LayoutDashboard`, `/insights` `BarChart3` · Money `/accounts` `Wallet`, `/cards` `CreditCard`, `/transactions` `ReceiptText`, `/budgets` `PieChart` · Grow `/vault` `PiggyBank`, `/investments` `TrendingUp`, `/loans` `Landmark` · Operate `/pay` `Send`, `/invoices` `FileText`, `/vendors` `Store` · Reports `/reports` `FileBarChart`, `/statements` `ScrollText` · Support `/coach` `MessageCircle`, `/help` `HelpCircle` · Account `/profile` `Settings`, `/profile` `User` (both → /profile per spec).

## State handling

- Active state: `pathname === href` → `aria-current="page"`, `bg-[var(--fv-wash)]` + `border-2 border-[var(--fv-border)]` + semibold. Idle: `border-2 border-transparent` (no layout shift). Icons `size={20} strokeWidth={1.8}`.
- Touch targets: `py-3 md:py-2.5` (48px mobile ≥ 44px per DESIGN.md §9.1).
- Group labels: `<li role="presentation" id="nav-group-{slug}">` targeted by `<ul role="group" aria-labelledby>`. Mobile: `aria-hidden` `h-px` divider replaces kicker; md+: 11px/600/uppercase/0.08em `--fv-text-secondary` (DESIGN.md Kicker token).
- A11y: `aria-label={`t(tabs.{key})`}` on every `<Link>` (mobile icon-only accessible; text span `hidden md:inline`).
- i18n: `tabs.home` removed — grep confirms zero code usage (only spec mentions). Parity test covers en/fr key match.
- Help page: `SUPPORT_EMAIL = 'support@finovault.app'` placeholder with `ponytail:` comment — swap when real support email contract lands.

## Verification

- JSON both locales parse OK
- `npx tsc --noEmit` → 0 errors
- `node node_modules/eslint/bin/eslint.js` on all 10 changed files → exit 0 (note: `npx eslint` wrongly fetches eslint 10; use direct node invocation)
- `node node_modules/vitest/vitest.mjs run --pool=threads` → 11 files / 60 tests pass (first `npm test --pool=threads` hit the known forks-pool worker timeout flake; rerun per contract passed)

## Design QA notes for @designer

- Sidebar geometry: aside `w-16` (mobile, center pills) / `w-56` (md+, `md:px-4`); primary nav scrolls, Account pinned bottom via `mt-auto`. Navs intentionally have no `w-full` — preserves centered shrink-to-fit pills at `w-16`.
- 5 new pages are identical shells (h1 + empty state) — variability lands with their APIs.
- Help page uses native `<details>` (keyboard/AT free); FAQ copy is placeholder — confirm tone with product.
- `aria-labelledby` group names resolve empty on mobile (labels are `display:none`) — acceptable per spec §7 (dividers `aria-hidden`, links carry labels); flagged for QA.
