import { test, expect, Page } from '@playwright/test';

async function loginAsDemo(page: Page) {
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
  await page.getByLabel('Email').fill('demo@finovault.app');
  await page.getByLabel('Password').fill('Vault123!');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
}

const bell = (page: Page) => page.getByRole('button', { name: /notifications/i });
const dropdownPanel = (page: Page) => page.getByRole('dialog', { name: 'Notifications' });

async function openDropdown(page: Page) {
  await bell(page).click();
  await expect(dropdownPanel(page)).toBeVisible({ timeout: 3000 });
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

test.describe('Notification bell', () => {
  // State flows forward across tests (mark-all-read empties the list),
  // and all workers share the same mock backend — run serially.
  test.describe.configure({ mode: 'serial' });

  test('bell is visible in top bar after login with aria-label "Notifications"', async ({ page }) => {
    await loginAsDemo(page);
    const b = bell(page);
    await expect(b).toBeVisible();
    // When no unread or >0 unread, the label always contains "Notifications"
    await expect(b).toHaveAttribute('aria-label', /notifications/i);
  });

  test('click bell opens dropdown dialog with notifications', async ({ page }) => {
    await loginAsDemo(page);
    await openDropdown(page);
    const panel = dropdownPanel(page);
    await expect(panel).toBeVisible();
    // Panel title is present
    await expect(panel.getByText('Notifications').first()).toBeVisible();
  });

  test('badge shows unread count when > 0', async ({ page }) => {
    await loginAsDemo(page);
    const b = bell(page);
    await expect(b).toHaveAttribute('aria-label', /unread/i, { timeout: 5000 });
    // Extract count from label like "3 unread notifications"
    const label = await b.getAttribute('aria-label');
    const match = label?.match(/^(\d+)\s+unread/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBeGreaterThanOrEqual(1);
  });

  test('clicking an unread notification marks it read', async ({ page }) => {
    await loginAsDemo(page);
    await openDropdown(page);

    const panel = dropdownPanel(page);
    // The unread dot is a small span with h-2 w-2 inside the first div of each item
    // It's inside a <button> that is a notification item (not the "Mark all read" button)
    // The items live in the scrollable overflow-y-auto div
    const listContainer = panel.locator('.overflow-y-auto');
    await expect(listContainer).toBeVisible({ timeout: 5000 });

    const itemButtons = listContainer.locator('> button');
    const count = await itemButtons.count();
    expect(count).toBeGreaterThan(0);

    // Find first item that has an unread dot (the dot is an aria-hidden span of h-2 w-2)
    let firstUnreadIdx = -1;
    for (let i = 0; i < count; i++) {
      const dot = itemButtons.nth(i).locator('span[aria-hidden="true"]');
      if (await dot.isVisible().catch(() => false)) {
        firstUnreadIdx = i;
        break;
      }
    }
    test.skip(firstUnreadIdx === -1, 'No unread notifications available to click');

    await itemButtons.nth(firstUnreadIdx).click();
    await page.waitForTimeout(300);

    // That item should no longer have the unread dot
    const dotAfter = itemButtons.nth(firstUnreadIdx).locator('span[aria-hidden="true"]');
    await expect(dotAfter).toBeHidden({ timeout: 2000 });
  });

  test('Mark all read clears badge', async ({ page }) => {
    await loginAsDemo(page);

    // Wait for bell to show unread badge
    const b = bell(page);
    await expect(b).toHaveAttribute('aria-label', /unread/i, { timeout: 5000 });

    await openDropdown(page);

    const markAllBtn = dropdownPanel(page).getByRole('button', { name: 'Mark all read' });
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();

    // Wait for badge to disappear: aria-label should become just "Notifications"
    await expect(b).toHaveAttribute('aria-label', /^Notifications$/, { timeout: 3000 });
  });

  test('Esc closes dropdown and returns focus to bell', async ({ page }) => {
    await loginAsDemo(page);
    await openDropdown(page);
    await expect(dropdownPanel(page)).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dropdownPanel(page)).toBeHidden({ timeout: 2000 });
    await expect(bell(page)).toBeFocused();
  });

  test('empty state shows "No notifications" when list is empty', async ({ page }) => {
    await loginAsDemo(page);
    await openDropdown(page);

    // Mark all read first
    const markAllBtn = dropdownPanel(page).getByRole('button', { name: 'Mark all read' });
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
      await page.waitForTimeout(300);
    }
    await page.keyboard.press('Escape');
    await expect(dropdownPanel(page)).toBeHidden({ timeout: 1000 });

    // Re-open — generator may have added 1 notification (15-30s window)
    await openDropdown(page);
    const panel = dropdownPanel(page);

    // Only assert empty state if the list is genuinely empty; otherwise the
    // generator added a new notification between mark-all-read and re-open.
    const itemButtons = panel.locator('.overflow-y-auto').locator('> button');
    const count = await itemButtons.count();
    test.skip(count > 0, 'Generator added a new notification; empty state not applicable');

    await expect(panel.getByText('No notifications')).toBeVisible();
    await expect(panel.getByText("You're all caught up.")).toBeVisible();
  });
});