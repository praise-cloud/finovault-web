import { test, expect, Page } from '@playwright/test';

const DB_STORAGE_KEY = 'finovault.web.mockdb.v1';

async function onboardedPrefs(page: Page, email: string): Promise<boolean | null> {
  const snapshot = await page.evaluate(
    ({ key, email }) => {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as {
        users: Array<{ profile: { email: string }; prefs: { onboardingCompleted: boolean } }>;
      };
      return parsed.users.find((u) => u.profile.email === email)?.prefs.onboardingCompleted ?? null;
    },
    { key: DB_STORAGE_KEY, email }
  );
  return snapshot;
}

function collectIssues(page: Page) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.method()} ${req.url()} ${req.failure()?.errorText ?? ''}`)
  );
  return { consoleErrors, pageErrors, failedRequests };
}

/**
 * TODO 1 — onboarding completion flow (canonical client-side path):
 * signup -> role -> link accounts -> welcome "Enter Finovault" -> /dashboard, and
 * the fire-and-forget preferences upsert flips onboarding_completed false -> true
 * in the persisted mock db.
 */
test('onboarding Finish persists onboarding_completed=true and lands on dashboard', async ({ page }) => {
  const issues = collectIssues(page);
  const email = `e2e-${Date.now()}@finovault.app`;

  await page.goto('/signup');
  await page.getByLabel('Full name').fill('E2E Tester');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('Vault123!');
  await page.getByRole('button', { name: 'Create account' }).click();

  await page.getByRole('button', { name: 'Individual' }).click();
  await expect(page.getByRole('button', { name: 'Individual' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/\/onboarding\/link-accounts$/);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/\/onboarding\/welcome$/);
  await expect(page.getByRole('heading', { name: 'Welcome, E2E' })).toBeVisible();

  // Fresh user starts with onboardingCompleted=false; confirm baseline persisted.
  expect(await onboardedPrefs(page, email)).toBe(false);

  await page.getByRole('button', { name: 'Enter Finovault' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  // Fire-and-forget upsert (250ms mock latency) -> poll for the persisted flag.
  await expect.poll(async () => onboardedPrefs(page, email)).toBe(true);

  expect(issues.consoleErrors).toEqual([]);
  expect(issues.pageErrors).toEqual([]);
  expect(issues.failedRequests).toEqual([]);
});

/**
 * TODO 4 — demo login + dashboard mock-backend regression:
 * dashboard renders the entrepreneur persona without console errors or failed requests.
 */
test('demo login renders dashboard persona with no console errors or failed requests', async ({ page }) => {
  const issues = collectIssues(page);

  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Email').fill('demo@finovault.app');
  await page.getByLabel('Password').fill('Vault123!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/Good (morning|afternoon|evening), Amina/)).toBeVisible();
  await expect(page.getByText('Female Innovators Seed Fund')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Vault' })).toBeVisible();

  expect(issues.consoleErrors).toEqual([]);
  expect(issues.pageErrors).toEqual([]);
  expect(issues.failedRequests).toEqual([]);
});