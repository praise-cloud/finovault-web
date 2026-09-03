import { describe, expect, it, beforeEach } from 'vitest';
import { initMockApi, setAccessToken, api } from '../client';
import { authApi } from '../auth';
import { moneyApi } from '../money';

async function login(): Promise<string> {
  await initMockApi();
  const result = await authApi.login({ email: 'demo@finovault.app', password: 'Vault123!' });
  setAccessToken(result.session.accessToken);
  return result.session.accessToken;
}

describe('money mock API', () => {
  beforeEach(() => {
    localStorage.clear();
    // reset in-memory token
    setAccessToken(null);
  });

  it('seeds accounts, goals, pension and invoices for the demo user', async () => {
    await login();
    const accounts = await moneyApi.getAccounts();
    expect(accounts.length).toBeGreaterThan(0);

    const goals = await moneyApi.getGoals();
    expect(goals.length).toBeGreaterThan(0);

    const pension = await moneyApi.getPensionPlan();
    expect(pension).not.toBeNull();

    const invoices = await moneyApi.getInvoices();
    expect(invoices.length).toBeGreaterThan(0);

    const budgets = await moneyApi.getBudgets();
    expect(budgets.length).toBeGreaterThan(0);
  });

  it('computes a transfer fee and records a transfer', async () => {
    await login();
    const accounts = await moneyApi.getAccounts();
    const source = accounts[0];
    const before = source.balance;

    const transfer = await moneyApi.createTransfer({
      sourceAccountId: source.id,
      payeeName: 'Test Person',
      destination: '+230 0000 0000',
      amount: 5000,
      idempotencyKey: `it_${Date.now()}`,
    });
    // fee = 1.5% of 5000 = 75, total = 5075
    expect(transfer.fee).toBe(75);
    expect(transfer.total).toBe(5075);

    const after = (await moneyApi.getAccounts()).find((a) => a.id === source.id)!;
    expect(after.balance).toBeCloseTo(before - 5075, 2);
  });

  it('debits the account when contributing to a goal', async () => {
    await login();
    const goals = await moneyApi.getGoals();
    const goal = goals[0];
    const accounts = await moneyApi.getAccounts();
    const source = accounts[0];
    const before = source.balance;

    await moneyApi.contributeGoal(goal.id, {
      amount: 1000,
      sourceAccountId: source.id,
    });
    const afterAccounts = await moneyApi.getAccounts();
    expect(afterAccounts.find((a) => a.id === source.id)!.balance).toBeCloseTo(before - 1000, 2);

    const updated = await moneyApi.getGoal(goal.id);
    expect(updated.currentAmount).toBeCloseTo(goal.currentAmount + 1000, 2);
  });

  it('rejects an unauthorized request', async () => {
    await initMockApi();
    await expect(moneyApi.getAccounts()).rejects.toThrow();
  });

  it('exposes the security overview with a computed score', async () => {
    await login();
    const overview = await moneyApi.getSecurityOverview();
    expect(overview.score).toBeGreaterThanOrEqual(5);
    expect(overview.score).toBeLessThanOrEqual(99);
  });
});
