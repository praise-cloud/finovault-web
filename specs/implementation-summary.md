# Notification UI — Implementation Summary (FE-002)

## Files Created

| File | Purpose |
|---|---|
| `lib/notifications/useNotifications.ts` | Hook: fetch, poll (15s), mock generator timer (15–30s), markRead, markAllRead, unreadCount, aria-live announcement, relativeTime helper |
| `components/notifications/NotificationBell.tsx` | Bell button (44px, neo-brutalist) + unread badge (hidden at 0, "99+" at ≥100) |
| `components/notifications/NotificationItem.tsx` | Notification row: unread dot, type icon (32px circle), title/body/relative timestamp |
| `components/notifications/NotificationDropdown.tsx` | Fixed-position panel (384px desktop / calc(100vw-32px) mobile), header with "Mark all read", scrollable list, empty state |

## Files Modified

| File | Change |
|---|---|
| `app/(app)/layout.tsx` | Mounted NotificationBell + NotificationDropdown in top bar between firstName and plan badge. Added aria-live region. Fixed hooks-before-early-return. |
| `features/dashboard/GreetingHeader.tsx` | Removed bell button, Bell import, and `onBellPress` prop. Simplified to `{ name }` prop. |
| `lib/i18n/en.json` | Added 7 `notifications.*` keys |
| `lib/i18n/fr.json` | Added 7 `notifications.*` keys (fr parity) |

## Key Decisions

- **Type**: Uses `AppNotification` from `types/index.ts` — no parallel type created
- **API**: Uses existing `moneyApi.getNotifications()`, `moneyApi.markNotificationRead()`, `moneyApi.markAllNotificationsRead()`
- **Mock generator**: Uses existing `simulateIncomingNotification()` from `lib/api/mock/db.ts`, detects mock mode via `USE_REAL_BACKEND` from `lib/api/client.ts`
- **Type icon mapping**: transfer→ArrowUpRight (success-bg), bill→Receipt (warning-bg), security→TriangleAlert (warning-bg), goal→Award (wash), system→Bell (wash)
- **Relative time**: Formatted in code (not i18n keys), locale-aware via `i18n.language`

## A11y

- Bell: `aria-label` with count, `aria-expanded`, `aria-haspopup`
- Dropdown: `role="dialog"`, focus management (moves into dropdown on open, returns to bell on close)
- Esc closes + click-outside closes
- `aria-live="polite"` region announces new notifications
- Unread dot: `aria-hidden="true"` (visual only)

## Verification Status: `verified`

- `npx tsc --noEmit` — passes (exit 0)
- `npx vitest run lib/i18n/__tests__/parity.test.ts` — 2/2 pass
- `npx vitest run lib/i18n/__tests__/code-keys.test.ts` — 2/2 pass
- `npx next build` — compiled successfully
- ESLint: pre-existing timeout issue (not related to changes)

## Polish Gate Notes

- Neo-brutalist tokens used: `--fv-border-ink`, `--fv-shadow-hard-sm`, `--fv-shadow-hard`, `--fv-radius-control`, `--fv-radius-card`
- 44px touch target on bell
- Hard shadows + ink borders per DESIGN.md §1/§2
- Hover lift / active press per DESIGN.md §5
- Reduced motion: no explicit `prefers-reduced-motion` media query in components (relies on browser defaults + Tailwind's motion utilities). Badge scale animation deferred — badge uses static display without JS animation.

## Out of Scope (ponytail)

- Toast system (dropdown-only for v1)
- Dismiss-single action
- Real event-driven notifications / Supabase Realtime
- Navigation to `notification.link` on click (wired but not navigated — needs router context in dropdown)
- Badge scale animation (120ms pop) — static display for now, add when Framer Motion is available
