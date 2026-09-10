# Notification System — Design Spec (DS-002)

- Status: `partially_verified` — spec complete; Phase 2 = @frontend-react
- Author: @designer
- Date: 2026-09-10
- Inputs: `DESIGN.md` (neo-brutalist system), `app/(app)/layout.tsx` (app shell), `features/dashboard/GreetingHeader.tsx` (existing bell to replace), `components/ui/Button.tsx`, `components/ui/Icon.tsx`, `lib/i18n/en.json` + `fr.json`

---

## 1. Component Map

| Component | Location | Purpose |
|---|---|---|
| `NotificationBell` | Top bar, right side (before plan badge) | Icon button + unread badge. Replaces the bell in `GreetingHeader`. |
| `NotificationDropdown` | Anchored below bell | Panel: header, scrollable list, footer "Mark all read" |
| `NotificationItem` | Inside dropdown list | Single notification row: dot, icon, title, body, timestamp |

Mock data source: `lib/notifications/mock-generator.ts` (Phase 2). Generates notifications on a timer; badge ticks up visibly.

---

## 2. NotificationBell

### 2.1 Placement

Inside the `<header>` at `app/(app)/layout.tsx` L98. Current layout:

```
[firstName] ................... [plan badge]
```

New layout:

```
[firstName] ................... [🔔 bell] [plan badge]
```

The bell sits between the name and the plan badge. Use `flex items-center gap-2` on the right group.

### 2.2 Anatomy

```
┌──────────┐
│   🔔     │  ← Lucide Bell, 20px, stroke 1.8
│       ●  │  ← Unread badge (absolute, top-right, outside icon bounds)
└──────────┘
  44 × 44px
```

### 2.3 Styling (tokens from DESIGN.md — reuse only)

| Property | Value | Token |
|---|---|---|
| Size | 44 × 44px | Min touch target (DESIGN.md §9) |
| Border | 2px solid | `var(--fv-border-ink)` |
| Border-radius | 10px | `var(--fv-radius-control)` |
| Background | white | `var(--fv-surface)` |
| Shadow (rest) | 3px 3px 0 0 | `var(--fv-shadow-hard-sm)` |
| Shadow (hover) | 4px 4px 0 0 | `var(--fv-shadow-hard)` |
| Shadow (active) | none | — |
| Transform (hover) | `translateY(-2px)` | — |
| Transform (active) | `translateY(2px)` | — |
| Icon color | ink | `var(--fv-text)` |
| Transition | 120ms ease-out | DESIGN.md §5 |
| Focus | 2px outline `var(--fv-ink)`, offset 2px | DESIGN.md §5 + `globals.css` `:focus-visible` |

Exact class string (Tailwind):

```
flex h-11 w-11 shrink-0 items-center justify-center
rounded-[var(--fv-radius-control)]
border-2 border-[var(--fv-border-ink)]
bg-[var(--fv-surface)]
shadow-[var(--fv-shadow-hard-sm)]
transition-all duration-150
hover:-translate-y-0.5 hover:shadow-[var(--fv-shadow-hard)]
active:translate-y-0.5 active:shadow-none
```

### 2.4 Props / ARIA

```ts
interface NotificationBellProps {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
}
```

On the `<button>`:

| Attribute | Value |
|---|---|
| `type` | `button` |
| `aria-label` | `t('notifications.bellLabel')` — "Notifications (N unread)" when N > 0, "Notifications" when 0 |
| `aria-expanded` | `isOpen` |
| `aria-haspopup` | `true` |
| `role` | implicit button |

### 2.5 Badge

#### Placement

Absolute-positioned: `top-0 right-0 translate-x-1/2 -translate-y-1/2` — sits at the top-right corner of the bell, partially outside the button bounds (standard bell-badge pattern).

#### Sizing

| Condition | Badge width | Badge height | Font |
|---|---|---|---|
| Count 1–9 | auto (min 18px) | 18px | 11px / 700 |
| Count 10–99 | auto (min 22px) | 18px | 11px / 700 |
| Count ≥ 100 | auto (min 26px) | 18px | 10px / 700 |

Padding: `px-1` (4px horizontal). This gives enough room for "99+" at 10px.

#### Color

| Property | Value | Token | Notes |
|---|---|---|---|
| Background | red | `var(--fv-error)` | `#8c3a3a` — 4.6:1 on white (AA safe) |
| Text | white | `#FFFFFF` | 4.6:1 on error bg (AA safe) |
| Border | none | — | Badge sits on ink border area; no extra border needed |

#### Display Rules

- `unreadCount === 0`: badge hidden (`hidden` or conditional render)
- `unreadCount 1–99`: show number
- `unreadCount ≥ 100`: show `"99+"`

#### Animation

Badge count change: 120ms scale pop (1 → 1.15 → 1) + opacity fade-in for new badge appearance. Respect `prefers-reduced-motion: reduce` → instant (no scale, opacity 1).

---

## 3. NotificationDropdown

### 3.1 Positioning

Anchored below the bell button. Use `position: fixed` (not absolute) to escape any `overflow: hidden` ancestor. Calculate position from bell's bounding rect.

Alignment: right-aligned to bell's right edge (dropdown's right = bell's right). On mobile: full-width minus 16px inset on each side.

### 3.2 Dimensions

| Property | Desktop (≥640px) | Mobile (<640px) |
|---|---|---|
| Width | 384px (fixed) | `calc(100vw - 32px)` |
| Max height | 420px | `calc(100vh - 120px)` |
| Position | right-aligned to bell | centered |

### 3.3 Styling

| Property | Value | Token |
|---|---|---|
| Border | 2px solid | `var(--fv-border-ink)` |
| Border-radius | 12px | `var(--fv-radius-card)` |
| Background | white | `var(--fv-surface)` |
| Shadow | 4px 4px 0 0 | `var(--fv-shadow-hard)` |
| z-index | dropdown level | Use semantic z-index: `z-50` (DESIGN.md §4) |

### 3.4 Anatomy

```
┌──────────────────────────────────────┐
│  Notifications           [Mark all]  │  ← Header row (48px)
├──────────────────────────────────────┤
│ ● 🔔  New transaction received       │  ← Unread item (accent bg wash)
│   Your account was credited MUR 500   │
│   2 min ago                          │
├──────────────────────────────────────┤
│   💡  Budget insight: spending up     │  ← Read item (no bg)
│   You spent 15% more this week       │
│   1 hour ago                         │
├──────────────────────────────────────┤
│   ✅  Savings goal reached!           │  ← Read item
│   Emergency fund hit MUR 50,000      │
│   3 hours ago                        │
├──────────────────────────────────────┤
│   No notifications                   │  ← Empty state (when 0)
│   You're all caught up.              │
└──────────────────────────────────────┘
```

### 3.5 Header

- Height: 48px. `flex items-center justify-between px-4 border-b border-[var(--fv-border-subtle)]`
- Left: "Notifications" — 15px / 700 / `var(--fv-text)` (`t('notifications.title')`)
- Right: "Mark all read" button — ghost style: `text-[13px] font-medium text-[var(--fv-primary)] hover:underline`. `onClick` → marks all notifications as read, badge → 0. `t('notifications.markAllRead')`

### 3.6 Scrollable List

- Container: `overflow-y-auto` with `max-height` per §3.2
- Each item separated by 1px `var(--fv-border-subtle)` border-bottom
- No scrollbar styling needed — use browser default

### 3.7 Footer

- No footer. "Mark all read" lives in the header for discoverability.

### 3.8 Empty State

When `notifications.length === 0`:

- Center-aligned, padding 32px vertical
- Icon: `CircleCheck` (lucide) in a 48px circle with `var(--fv-wash)` bg and 2px ink border
- Title: `t('notifications.emptyTitle')` — "No notifications" / "Aucune notification"
- Body: `t('notifications.emptyBody')` — "You're all caught up." / "Vous êtes à jour."
- 15px body, `var(--fv-text-secondary)`

---

## 4. NotificationItem

### 4.1 Anatomy

```
┌─────────────────────────────────────────┐
│ ● │ [icon] │ title text                 │
│   │        │ body text (secondary)      │
│   │        │ timestamp                  │
└─────────────────────────────────────────┘
```

### 4.2 Layout

- `flex gap-3 px-4 py-3` with optional `bg-[var(--fv-wash)]` for unread
- Left column: unread dot OR empty spacer (12px wide)
- Middle column: type icon in a 32px circle
- Right column: title (flex-1), body, timestamp

### 4.3 Unread Dot

- 8 × 8px circle, `var(--fv-primary)` fill (`#1D4ED8`)
- Positioned vertically centered with the title line
- Only shown when `read === false`

### 4.4 Type Icons

| Type | Icon (lucide) | Background |
|---|---|---|
| `transaction` | `ArrowUpRight` | `var(--fv-success-bg)` |
| `goal` | `Award` | role `wash` |
| `alert` | `TriangleAlert` | `var(--fv-warning-bg)` |
| `system` | `Bell` | `var(--fv-wash)` |

Icon circle: 32px, `rounded-full`, 2px border `var(--fv-border-subtle)`, background per type.

### 4.5 Text

| Element | Size / Weight | Color | Max lines |
|---|---|---|---|
| Title | 14px / 600 | `var(--fv-text)` | 1 (ellipsis overflow) |
| Body | 13px / 400 | `var(--fv-text-secondary)` | 2 (clamp) |
| Timestamp | 12px / 500 | `var(--fv-text-secondary)` | 1 |

Timestamp format: relative time. < 1 min = "just now" / "à l'instant"; < 1 hr = "X min ago" / "il y a X min"; < 24 hr = "X hr ago" / "il y a X h"; else = date.

### 4.6 States

| State | Background | Title color | Dot |
|---|---|---|---|
| Unread | `var(--fv-wash)` (~8% blue tint) | `var(--fv-text)` (ink) | Visible |
| Read | transparent | `var(--fv-text)` | Hidden |
| Hover | `var(--fv-border-subtle)` (10% ink) | — | — |

### 4.7 Click Behavior

1. Mark notification as read (dot → hidden, bg → transparent)
2. If `notification.link` exists → navigate to `link` and close dropdown
3. If no `link` → just mark read, keep dropdown open

---

## 5. Notification Data Model

```ts
type NotificationType = 'transaction' | 'goal' | 'alert' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;        // i18n key or raw
  body: string;         // i18n key or raw
  link?: string;        // optional route to navigate to
  read: boolean;
  createdAt: Date;
}
```

---

## 6. States Summary

| State | Bell | Badge | Dropdown | Behavior |
|---|---|---|---|---|
| **Closed, no unread** | Visible | Hidden | Not rendered | Tap → opens empty dropdown |
| **Closed, N unread** | Visible | Shows N | Not rendered | Tap → opens dropdown |
| **Open, has items** | Visible (aria-expanded=true) | Shows N | Rendered, list items | Tap bell → closes. Click outside → closes. Esc → closes. |
| **Open, empty** | Visible (aria-expanded=true) | Hidden | Rendered, empty state | Same close behavior |
| **All read** | Visible | Hidden (badge removed) | Shows items (all read-styled) | — |
| **New notification arrives** | Badge pops in / count updates | Scale animation | Not open → badge only; Open → list prepends item | Screen reader: `aria-live` announcement |
| **Mark all read** | Badge animates out (scale down + fade) | Hidden | All items lose wash bg, dot hidden | — |

### 6.1 New Notification Arrival (Mock Generator)

The mock generator adds a notification every 15–30 seconds. When one arrives:

1. Prepend to notification list
2. If dropdown is open → insert at top with 200ms slide-in (translateY(-8px) → 0, opacity 0 → 1)
3. If dropdown is closed → update badge count with scale pop animation
4. Screen reader: update `aria-live` region with new notification title

---

## 7. Responsive Behavior

### Desktop (≥640px)

- Top bar: `firstName` left, `[bell] [plan badge]` right, `gap-2`
- Dropdown: 384px wide, right-aligned to bell

### Mobile (<640px)

- Top bar: sidebar collapses to icons only (existing behavior L50). Top bar stays same layout.
- Dropdown: `calc(100vw - 32px)` wide, centered horizontally
- On very small screens (< 360px): dropdown goes full width with 8px inset

### Dropdown overflow

- If list exceeds max-height → scroll. The header stays fixed (sticky top within the scroll container? No — header is outside scroll area, only the list scrolls).

---

## 8. Accessibility (WCAG 2.1 AA)

### 8.1 Keyboard

| Key | Behavior |
|---|---|
| Enter/Space on bell | Toggle dropdown |
| Esc | Close dropdown, return focus to bell |
| Tab (with dropdown open) | Cycle through: Mark all read → notification items → close |
| Tab (last item) | Move to next focusable element outside dropdown |
| Enter on notification | Mark read + navigate if link |

### 8.2 Focus Management

- Bell has visible focus ring at all times (`:focus-visible` from globals.css)
- When dropdown opens → focus moves to first interactive element (Mark all read button, or first notification if no Mark all)
- When dropdown closes → focus returns to bell button
- Dropdown has `role="dialog"` with `aria-label="Notifications"`

### 8.3 Screen Reader

- Bell: `aria-label` includes count — "Notifications, 5 unread" / "Notifications"
- Dropdown: `role="dialog"`, `aria-label="Notifications panel"`
- New notification arrival: hidden `aria-live="polite"` region announces `"New notification: {title}"`
- Each notification item: `role="article"` or just semantic markup with descriptive text
- Unread dot: `aria-hidden="true"` (visual only; read state conveyed by text styling/context)

### 8.4 Contrast

| Element | fg | bg | Ratio | Pass |
|---|---|---|---|---|
| Badge text (#fff) | #FFFFFF | #8C3A3A (error) | 4.6:1 | AA ✓ |
| Unread title on wash | #1A1A2E | #EBEEFF (wash) | 13.2:1 | AAA ✓ |
| Read title | #1A1A2E | #FFFFFF | 16.8:1 | AAA ✓ |
| Timestamp | #4B5563 | #FFFFFF | 7.56:1 | AA ✓ |
| Timestamp on wash | #4B5563 | #EBEEFF | 6.67:1 | AA ✓ |

### 8.5 Touch Target

Bell button: 44 × 44px (DESIGN.md §9). Notification items: min-height 48px (generous tap area).

---

## 9. i18n Keys (en + fr parity)

### New keys under `"notifications"`:

| Key | en | fr |
|---|---|---|
| `notifications.bellLabel` | Notifications | Notifications |
| `notifications.bellLabelUnread` | `{count} unread notifications` | `{count} notifications non lues` |
| `notifications.title` | Notifications | Notifications |
| `notifications.markAllRead` | Mark all read | Tout marquer lu |
| `notifications.emptyTitle` | No notifications | Aucune notification |
| `notifications.emptyBody` | You're all caught up. | Vous êtes à jour. |
| `notifications.newNotification` | New notification: {title} | Nouvelle notification : {title} |

### Relative time helpers (not i18n keys — format in code):

| Condition | en | fr |
|---|---|---|
| < 1 min | just now | à l'instant |
| 1–59 min | {n} min ago | il y a {n} min |
| 1–23 hr | {n}h ago | il y a {n} h |
| ≥ 24 hr | formatted date | date formatée |

---

## 10. Mock Generator (Phase 2 Reference)

Spec for `lib/notifications/mock-generator.ts` — frontend implements, not designer:

- Pool of 8–12 mock notifications with realistic copy (transactions, goals, alerts, system)
- Timer: random interval 15–30s, adds one unread notification
- Initial state: 3 unread notifications on mount
- Types cycle: transaction → goal → alert → system → repeat

---

## 11. Interaction Details

### Open/Close

- **Open**: click bell → `isOpen = true`, focus moves into dropdown, first item or "Mark all read" gets focus
- **Close (bell)**: click bell again → `isOpen = false`, focus returns to bell
- **Close (outside)**: click outside dropdown → close, focus to bell
- **Close (Esc)**: Esc key → close, focus to bell
- **No animation on open/close**: dropdown appears/disappears instantly (no slide). Respect reduced motion. If animation desired later, use 120ms fade.

### Dismiss single notification

Not in scope for v1. Users mark read by clicking the notification. "Mark all read" is the bulk action.

---

## 12. Files to Create (Phase 2)

| File | Purpose |
|---|---|
| `components/notifications/NotificationBell.tsx` | Bell + badge |
| `components/notifications/NotificationDropdown.tsx` | Dropdown panel |
| `components/notifications/NotificationItem.tsx` | Single notification row |
| `lib/notifications/types.ts` | `Notification`, `NotificationType` |
| `lib/notifications/mock-generator.ts` | Mock data + timer |
| `lib/notifications/useNotifications.ts` | Composable: state, add, markRead, markAllRead |

Modify:
| File | Change |
|---|---|
| `app/(app)/layout.tsx` | Add bell to top bar header |
| `features/dashboard/GreetingHeader.tsx` | Remove bell button (L30-37) |
| `lib/i18n/en.json` | Add `notifications.*` keys |
| `lib/i18n/fr.json` | Add `notifications.*` keys (fr parity) |

---

## 13. Notes

- No new DESIGN.md tokens needed. All styling uses existing `--fv-*` tokens.
- Bell glyph already in `Icon.tsx` glyph map (`bell`). Can use `<Icon name="bell" />` or Lucide `Bell` directly (existing pattern in GreetingHeader).
- Dropdown uses `position: fixed` — not affected by sidebar `overflow`.
- ponytail: one popup, not a toast queue. Add toast system when real-time push events exist. Mock generator is timer-based; dropdown-only is sufficient.
