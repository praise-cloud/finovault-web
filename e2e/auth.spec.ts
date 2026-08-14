import { test, expect } from '@playwright/test';

/**
 * Phase 0 smoke: the entry gate redirects unauthenticated users to login,
 * demo credentials authenticate, and the role-aware dashboard renders with
 * the demo user's entrepreneur persona (female founder scheme).
 */
test('demo user can log in and reach the role-aware dashboard', async ({ page }) => {
  await page.goto('/');

  // Entry gate should bounce to /login when not authenticated.
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('Email').fill('demo@finovault.app');
  await page.getByLabel('Password').fill('Vault123!');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);

  // Entrepreneur persona + female-founder opportunity card.
  await expect(page.getByText(/Good (morning|afternoon|evening), Amina/)).toBeVisible();
  await expect(page.getByText('Female Innovators Seed Fund')).toBeVisible();

  // Sidebar navigation works.
  await page.getByRole('link', { name: 'Vault' }).click();
  await expect(page).toHaveURL(/\/vault$/);
});