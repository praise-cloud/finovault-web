import type { ApiResponse } from '@/types/api';
import { ApiClientError, ApiErrorCodes } from '@/types/api';
import type {
  PrimaryRole,
  RoleScheme,
  UserPreferences,
  UserProfile,
  Account,
  AccountType,
  BillCategory,
  BillPayment,
  Budget,
  BusinessProfile,
  GoalType,
  Invoice,
  InvoiceStatus,
  Payee,
  PensionContribution,
  PensionFrequency,
  PensionPlan,
  PensionProjection,
  SavingsGoal,
  Transaction,
  TransactionDirection,
  Transfer,
  Vendor,
} from '@/types';
import { computeTransferFee, computePensionProjection, computeSecurityScore } from '@/lib/utils/fees';
import {
  createSession,
  createUser,
  findUserByEmail,
  getUserByToken,
  revokeSession,
  updatePrefs,
  updateProfile,
  nextId,
} from './db';
import * as db from './db';

export interface MockRoute {
  method: string;
  pattern: RegExp;
  handler: (ctx: MockContext) => ApiResponse<unknown>;
}

export interface MockContext {
  params: string[];
  body: unknown;
  token: string | null;
}

export function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, meta: { requestId: `mock_${Math.random().toString(36).slice(2)}` } };
}

export function fail(code: string, message: string, details?: unknown[]): ApiResponse<never> {
  return { success: false, data: null, error: { code, message, details } };
}

export const mockRoutes: MockRoute[] = [
  {
    method: 'POST',
    pattern: /^\/auth\/signup$/,
    handler: ({ body }) => {
      const { email, password, fullName } = body as {
        email: string;
        password: string;
        fullName: string;
      };
      if (!email || !password || !fullName) {
        return fail(ApiErrorCodes.VALIDATION, 'Missing required fields.');
      }
      if (findUserByEmail(email)) {
        return fail('EMAIL_TAKEN', 'An account with this email already exists.');
      }
      if (password.length < 8) {
        return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
      }
      const user = createUser({ email, password, fullName });
      const accessToken = createSession(user.profile.id);
      return ok({ user: user.profile, session: { accessToken } });
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: ({ body }) => {
      const { email, password } = body as { email: string; password: string };
      const user = findUserByEmail(email ?? '');
      if (!user || user.password !== password) {
        return fail(ApiErrorCodes.UNAUTHORIZED, 'Invalid email or password.');
      }
      const accessToken = createSession(user.profile.id);
      return ok({ user: user.profile, session: { accessToken } });
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/logout$/,
    handler: ({ token }) => {
      if (token) revokeSession(token);
      return ok({ success: true });
    },
  },
  {
    method: 'GET',
    pattern: /^\/auth\/session$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Session expired.');
      return ok({ user: user.profile });
    },
  },
  {
    method: 'GET',
    pattern: /^\/users\/me$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(user.profile);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/users\/me$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const patch = body as Partial<UserProfile>;
      const allowed: Array<keyof UserProfile> = ['fullName', 'avatarUrl', 'preferredLanguage', 'preferredCurrency'];
      const sanitized: Partial<UserProfile> = {};
      for (const key of allowed) {
        const value = patch[key];
        if (value !== undefined) {
          (sanitized as Record<string, unknown>)[key] = value;
        }
      }
      return ok(updateProfile(user.profile.id, sanitized));
    },
  },
  {
    method: 'GET',
    pattern: /^\/users\/preferences$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(user.prefs);
    },
  },
  {
    method: 'PUT',
    pattern: /^\/users\/preferences$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const patch = body as Partial<UserPreferences>;
      return ok(updatePrefs(user.profile.id, patch));
    },
  },
  {
    method: 'PUT',
    pattern: /^\/users\/role$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { primaryRole, scheme } = body as { primaryRole: PrimaryRole; scheme: RoleScheme };
      return ok(
        updateProfile(user.profile.id, {
          primaryRole,
          scheme: scheme ?? user.profile.scheme,
        })
      );
    },
  },
  {
    method: 'PUT',
    pattern: /^\/users\/business-profile$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const profile = body as BusinessProfile;
      return ok(updateProfile(user.profile.id, { businessProfile: profile }));
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/forgot-password$/,
    handler: ({ body }) => {
      const { email } = body as { email: string };
      const normalized = (email ?? '').trim().toLowerCase();
      // Never confirm whether an account exists.
      if (findUserByEmail(normalized)) {
        db.issuePasswordReset(normalized);
      }
      return ok({ success: true });
    },
  },
  {
    method: 'POST',
    pattern: /^\/auth\/reset-password$/,
    handler: ({ body }) => {
      const { token: resetToken, newPassword } = body as { token: string; newPassword: string };
      if (!resetToken || !newPassword) {
        return fail(ApiErrorCodes.VALIDATION, 'Reset token and new password are required.');
      }
      if (newPassword.length < 8) {
        return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
      }
      const email = db.consumePasswordReset(resetToken);
      if (!email) {
        return fail('INVALID_RESET_TOKEN', 'This reset link has expired or has already been used.');
      }
      db.setPassword(email, newPassword);
      db.invalidateSessionsForEmail(email);
      return ok({ success: true });
    },
  },

  // ---- accounts ----------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/accounts$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.accountsFor(user.profile.id));
    },
  },
  {
    method: 'POST',
    pattern: /^\/accounts$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { name, type, balance = 0, institution } = body as {
        name: string;
        type: AccountType;
        balance?: number;
        institution?: string;
      };
      if (!name?.trim()) return fail(ApiErrorCodes.VALIDATION, 'Account name is required.');
      const account: Account = {
        id: nextId('acc'),
        name: name.trim(),
        type,
        balance,
        currency: user.profile.preferredCurrency || 'MUR',
        institution: institution?.trim(),
        isActive: true,
      };
      db.addAccount(user.profile.id, account);
      return ok(account);
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/accounts\/([\w-]+)$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const id = params[0];
      db.setAccounts(
        user.profile.id,
        db.accountsFor(user.profile.id).filter((a) => a.id !== id)
      );
      return ok({ success: true });
    },
  },

  // ---- transactions -------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/transactions\?limit=(\d+)$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const limit = parseInt(params[0] ?? '50', 10) || 50;
      const list = [...db.transactionsFor(user.profile.id)].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      return ok(list.slice(0, limit));
    },
  },
  {
    method: 'POST',
    pattern: /^\/transactions$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { accountId, amount, direction, category, merchantName } = body as {
        accountId: string;
        amount: number;
        direction: TransactionDirection;
        category: string;
        merchantName?: string;
      };
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }
      const tx: Transaction = {
        id: nextId('tx'),
        accountId,
        amount,
        currency: user.profile.preferredCurrency || 'MUR',
        direction,
        category: category.trim(),
        merchantName: merchantName?.trim(),
        date: new Date().toISOString(),
        isExpense: direction === 'out',
        isRecurring: false,
        status: 'posted',
      };
      db.addTransaction(user.profile.id, tx);
      return ok(tx);
    },
  },

  // ---- budgets ------------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/budgets$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.budgetsFor(user.profile.id));
    },
  },
  {
    method: 'POST',
    pattern: /^\/budgets$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { category, amount } = body as { category: string; amount: number };
      if (!category?.trim() || !amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Category and a positive amount are required.');
      }
      const existing = db.budgetsFor(user.profile.id);
      const match = existing.find(
        (b) => b.category.toLowerCase() === category.trim().toLowerCase()
      );
      let budget: Budget;
      if (match) {
        budget = { ...match, category: category.trim(), amount };
        db.setBudgets(
          user.profile.id,
          existing.map((b) => (b.id === match.id ? budget : b))
        );
      } else {
        budget = { id: nextId('bud'), category: category.trim(), amount, period: 'monthly' };
        db.setBudgets(user.profile.id, [...existing, budget]);
      }
      return ok(budget);
    },
  },

  // ---- goals ---------------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/goals$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.goalsFor(user.profile.id));
    },
  },
  {
    method: 'GET',
    pattern: /^\/goals\/([\w-]+)$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const goal = db.goalsFor(user.profile.id).find((g) => g.id === params[0]);
      if (!goal) return fail('NOT_FOUND', 'Goal not found.');
      return ok(goal);
    },
  },
  {
    method: 'POST',
    pattern: /^\/goals$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { name, type, targetAmount, targetDate } = body as {
        name: string;
        type: GoalType;
        targetAmount: number;
        targetDate?: string;
      };
      if (!name?.trim() || !targetAmount || targetAmount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Give your goal a name and a target above zero.');
      }
      const goal: SavingsGoal = {
        id: nextId('goal'),
        name: name.trim(),
        type,
        targetAmount,
        currentAmount: 0,
        targetDate,
        completed: false,
        contributions: [],
      };
      db.addGoal(user.profile.id, goal);
      return ok(goal);
    },
  },
  {
    method: 'POST',
    pattern: /^\/goals\/([\w-]+)\/contribute$/,
    handler: ({ token, params, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const goalId = params[0];
      const { amount, sourceAccountId } = body as {
        amount: number;
        sourceAccountId?: string;
      };
      const goals = db.goalsFor(uid);
      const index = goals.findIndex((g) => g.id === goalId);
      if (index < 0) return fail('NOT_FOUND', 'Goal not found.');
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }

      if (sourceAccountId) {
        const accs = db.accountsFor(uid);
        const ai = accs.findIndex((a) => a.id === sourceAccountId);
        if (ai < 0) return fail('NOT_FOUND', 'Account not found.');
        if (accs[ai].balance < amount) {
          return fail('INSUFFICIENT_FUNDS', 'Not enough funds in this account.');
        }
        accs[ai] = { ...accs[ai], balance: accs[ai].balance - amount };
        db.setAccounts(uid, accs);
        db.addTransaction(uid, {
          id: nextId('tx'),
          accountId: sourceAccountId,
          amount,
          currency: user.profile.preferredCurrency || 'MUR',
          direction: 'out',
          category: 'Savings',
          merchantName: goals[index].name,
          date: new Date().toISOString(),
          isExpense: true,
          isRecurring: false,
          status: 'posted',
        });
      }

      const updated = { ...goals[index] };
      const contribution = {
        id: nextId('con'),
        goalId,
        amount,
        date: new Date().toISOString(),
        sourceAccountId,
      };
      const newCurrent = updated.currentAmount + amount;
      updated.currentAmount = newCurrent;
      updated.completed = updated.completed || newCurrent >= updated.targetAmount;
      updated.contributions = [...updated.contributions, contribution];
      goals[index] = updated;
      db.setGoals(uid, goals);
      return ok(updated);
    },
  },

  // ---- pension (Phase 4) ---------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/pension\/projection$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const plan = db.pensionFor(user.profile.id);
      if (!plan) {
        const empty: PensionProjection = {
          shortPotProjected: 0,
          longPotProjected: 0,
          totalProjected: 0,
          yearsToRetirement: 0,
        };
        return ok(empty);
      }
      return ok(computePensionProjection(plan));
    },
  },
  {
    method: 'GET',
    pattern: /^\/pension\/contributions$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const list = [...db.pensionContributionsFor(user.profile.id)].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      return ok(list);
    },
  },
  {
    method: 'GET',
    pattern: /^\/pension$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.pensionFor(user.profile.id) ?? null);
    },
  },
  {
    method: 'PUT',
    pattern: /^\/pension$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const b = body as {
        shortPotTarget: number;
        longPotTarget: number;
        frequency: PensionFrequency;
        contributionAmount: number;
        currentShortPot: number;
        currentLongPot: number;
        assumedReturnPct: number;
        inflationPct: number;
        currentAge: number;
        retirementAge: number;
        autoDebit: boolean;
      };
      if (b.shortPotTarget <= 0 || b.longPotTarget <= 0 || b.contributionAmount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Set a positive target and contribution for both pots.');
      }
      const existing = db.pensionFor(user.profile.id);
      const plan: PensionPlan = {
        id: existing?.id ?? nextId('pen'),
        shortPotTarget: b.shortPotTarget,
        longPotTarget: b.longPotTarget,
        frequency: b.frequency,
        contributionAmount: b.contributionAmount,
        currentShortPot: b.currentShortPot,
        currentLongPot: b.currentLongPot,
        assumedReturnPct: b.assumedReturnPct,
        inflationPct: b.inflationPct,
        currentAge: b.currentAge,
        retirementAge: b.retirementAge,
        autoDebit: b.autoDebit,
        updatedAt: new Date().toISOString(),
      };
      db.setPension(user.profile.id, plan);
      return ok(plan);
    },
  },
  {
    method: 'POST',
    pattern: /^\/pension\/contribute$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const { pot, amount, sourceAccountId } = body as {
        pot: 'short' | 'long';
        amount: number;
        sourceAccountId?: string;
      };
      const plan = db.pensionFor(uid);
      if (!plan) return fail('NOT_FOUND', 'No pension plan found. Create one first.');
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }

      if (sourceAccountId) {
        const accs = db.accountsFor(uid);
        const ai = accs.findIndex((a) => a.id === sourceAccountId);
        if (ai < 0) return fail('NOT_FOUND', 'Account not found.');
        if (accs[ai].balance < amount) {
          return fail('INSUFFICIENT_FUNDS', 'Not enough funds in this account.');
        }
        accs[ai] = { ...accs[ai], balance: accs[ai].balance - amount };
        db.setAccounts(uid, accs);
        db.addTransaction(uid, {
          id: nextId('tx'),
          accountId: sourceAccountId,
          amount,
          currency: user.profile.preferredCurrency || 'MUR',
          direction: 'out',
          category: 'Pension',
          merchantName: 'Finovault Pension',
          date: new Date().toISOString(),
          isExpense: true,
          isRecurring: false,
          status: 'posted',
        });
      }

      const isShort = pot === 'short';
      db.setPension(uid, {
        ...plan,
        currentShortPot: isShort ? plan.currentShortPot + amount : plan.currentShortPot,
        currentLongPot: isShort ? plan.currentLongPot : plan.currentLongPot + amount,
      });
      const contribution: PensionContribution = {
        id: nextId('pencon'),
        planId: plan.id,
        pot,
        amount,
        date: new Date().toISOString(),
        sourceAccountId,
      };
      db.addPensionContribution(uid, contribution);
      return ok(contribution);
    },
  },

  // ---- security -------------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/security\/overview$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const stored = db.securityOverviewsFor(uid) ?? { score: 72, twoFactorEnabled: false };
      return ok({ ...stored, score: computeSecurityScore(db.securityEventsFor(uid), stored) });
    },
  },
  {
    method: 'PUT',
    pattern: /^\/security\/2fa$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const { enabled } = body as { enabled: boolean };
      const stored = db.securityOverviewsFor(uid) ?? { score: 72, twoFactorEnabled: false };
      db.setSecurityOverview(uid, { ...stored, twoFactorEnabled: !!enabled });
      const updated = { ...stored, twoFactorEnabled: !!enabled };
      return ok({ ...updated, score: computeSecurityScore(db.securityEventsFor(uid), updated) });
    },
  },
  {
    method: 'POST',
    pattern: /^\/security\/change-password$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { currentPassword, newPassword } = body as {
        currentPassword: string;
        newPassword: string;
      };
      if (!newPassword || newPassword.length < 8) {
        return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
      }
      if (user.password !== currentPassword) {
        return fail('INCORRECT_PASSWORD', 'Your current password is incorrect.');
      }
      if (currentPassword === newPassword) {
        return fail(ApiErrorCodes.VALIDATION, 'New password must be different from your current password.');
      }
      db.setPassword(user.profile.email, newPassword);
      const uid = user.profile.id;
      const events = db.securityEventsFor(uid);
      events.push({
        id: nextId('evt'),
        title: 'Password changed',
        description: 'Your password was changed from this device.',
        severity: 'low',
        date: new Date().toISOString(),
        resolved: false,
      });
      db.setSecurityEvents(uid, events);
      const stored = db.securityOverviewsFor(uid) ?? { score: 72, twoFactorEnabled: false };
      const updated = {
        ...stored,
        score: Math.min(99, Math.max(5, (stored.score ?? 72) + 5)),
        lastPasswordChange: new Date().toISOString(),
      };
      db.setSecurityOverview(uid, updated);
      return ok({ ...updated, score: computeSecurityScore(db.securityEventsFor(uid), updated) });
    },
  },
  {
    method: 'GET',
    pattern: /^\/security\/devices$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.devicesFor(user.profile.id));
    },
  },
  {
    method: 'GET',
    pattern: /^\/security\/events$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.securityEventsFor(user.profile.id));
    },
  },
  {
    method: 'POST',
    pattern: /^\/security\/events\/([\w-]+)\/resolve$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const id = params[0];
      const events = db.securityEventsFor(uid);
      const index = events.findIndex((e) => e.id === id);
      if (index < 0) return fail('NOT_FOUND', 'Event not found.');
      events[index] = { ...events[index], resolved: true };
      db.setSecurityEvents(uid, events);
      return ok(events[index]);
    },
  },

  // ---- invoices & vendors -----------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/invoices$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const list = [...db.invoicesFor(user.profile.id)].sort((a, b) =>
        b.dueDate.localeCompare(a.dueDate)
      );
      return ok(list);
    },
  },
  {
    method: 'POST',
    pattern: /^\/invoices$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { clientName, amount, dueDate } = body as {
        clientName: string;
        amount: number;
        dueDate: string;
      };
      if (!clientName?.trim() || !amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Client and a positive amount are required.');
      }
      const invoice: Invoice = {
        id: nextId('inv'),
        clientName: clientName.trim(),
        amount,
        currency: user.profile.preferredCurrency || 'MUR',
        dueDate,
        status: 'sent',
      };
      db.addInvoice(user.profile.id, invoice);
      return ok(invoice);
    },
  },
  {
    method: 'PATCH',
    pattern: /^\/invoices\/([\w-]+)\/status$/,
    handler: ({ token, params, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const id = params[0];
      const { status } = body as { status: InvoiceStatus };
      const invoices = db.invoicesFor(uid);
      const index = invoices.findIndex((i) => i.id === id);
      if (index < 0) return fail('NOT_FOUND', 'Invoice not found.');
      invoices[index] = { ...invoices[index], status };
      db.setInvoices(uid, invoices);
      return ok(invoices[index]);
    },
  },
  {
    method: 'GET',
    pattern: /^\/vendors$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.vendorsFor(user.profile.id));
    },
  },
  {
    method: 'POST',
    pattern: /^\/vendors$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { name } = body as { name: string };
      if (!name?.trim()) return fail(ApiErrorCodes.VALIDATION, 'Vendor name is required.');
      const vendor: Vendor = { id: nextId('ven'), name: name.trim(), totalSpend: 0, reliabilityScore: 80 };
      db.addVendor(user.profile.id, vendor);
      return ok(vendor);
    },
  },

  // ---- transfers & payees -------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/transfers\/([\w-]+)$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const transfer = db.transfersFor(user.profile.id).find((t) => t.id === params[0]);
      if (!transfer) return fail('NOT_FOUND', 'Transfer not found.');
      return ok(transfer);
    },
  },
  {
    method: 'GET',
    pattern: /^\/transfers$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const list = [...db.transfersFor(user.profile.id)].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
      return ok(list);
    },
  },
  {
    method: 'POST',
    pattern: /^\/transfers$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const { sourceAccountId, payeeName, destination, amount, idempotencyKey } = body as {
        sourceAccountId: string;
        payeeName: string;
        destination: string;
        amount: number;
        idempotencyKey: string;
      };
      const existing = db.transfersFor(uid).find((t) => t.idempotencyKey === idempotencyKey);
      if (existing) return ok(existing);
      const accs = db.accountsFor(uid);
      const index = accs.findIndex((a) => a.id === sourceAccountId);
      if (index < 0) return fail('NOT_FOUND', 'Source account not found.');
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }
      const fee = computeTransferFee(amount);
      const total = amount + fee;
      if (accs[index].balance < total) {
        return fail('INSUFFICIENT_FUNDS', `Not enough funds — total with fees is ${total}.`);
      }
      accs[index] = { ...accs[index], balance: accs[index].balance - total };
      db.setAccounts(uid, accs);
      const transfer: Transfer = {
        id: nextId('trf'),
        sourceAccountId,
        payeeName: payeeName.trim(),
        destination: destination.trim(),
        amount,
        fee,
        total,
        status: 'completed',
        createdAt: new Date().toISOString(),
        externalRef: `FV${Date.now() % 1000000}`,
        idempotencyKey,
      };
      db.setTransfers(uid, [...db.transfersFor(uid), transfer]);
      db.addTransaction(uid, {
        id: nextId('tx'),
        accountId: sourceAccountId,
        amount: total,
        currency: user.profile.preferredCurrency || 'MUR',
        direction: 'out',
        category: 'Transfer',
        merchantName: transfer.payeeName,
        date: transfer.createdAt,
        isExpense: true,
        isRecurring: false,
        status: 'posted',
      });
      return ok(transfer);
    },
  },
  {
    method: 'GET',
    pattern: /^\/payees$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      return ok(db.payeesFor(user.profile.id));
    },
  },
  {
    method: 'POST',
    pattern: /^\/payees$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { name, destination } = body as { name: string; destination?: string };
      if (!name?.trim()) return fail(ApiErrorCodes.VALIDATION, 'Payee name is required.');
      const payee: Payee = { id: nextId('pay'), name: name.trim(), destination: destination?.trim() };
      db.addPayee(user.profile.id, payee);
      return ok(payee);
    },
  },

  // ---- bills --------------------------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/bills$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const list = [...db.billPaymentsFor(user.profile.id)].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      return ok(list);
    },
  },
  {
    method: 'POST',
    pattern: /^\/bills\/schedule$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const { category, billerName, amount, customerRef, scheduledFor } = body as {
        category: BillCategory;
        billerName: string;
        amount: number;
        customerRef: string;
        scheduledFor: string;
      };
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }
      const payment: BillPayment = {
        id: nextId('bill'),
        category,
        billerName,
        amount,
        status: 'scheduled',
        date: new Date().toISOString(),
        customerRef,
        scheduledFor,
      };
      db.addBillPayment(user.profile.id, payment);
      return ok(payment);
    },
  },
  {
    method: 'POST',
    pattern: /^\/bills$/,
    handler: ({ token, body }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const { category, billerName, amount, customerRef, sourceAccountId } = body as {
        category: BillCategory;
        billerName: string;
        amount: number;
        customerRef: string;
        sourceAccountId?: string;
      };
      const accs = db.accountsFor(uid);
      const accId = sourceAccountId ?? (accs.length ? accs[0].id : '');
      const index = accs.findIndex((a) => a.id === accId);
      if (index < 0) return fail('NOT_FOUND', 'No account to pay from.');
      if (!amount || amount <= 0) {
        return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
      }
      if (accs[index].balance < amount) {
        return fail('INSUFFICIENT_FUNDS', 'Not enough funds for this bill.');
      }
      accs[index] = { ...accs[index], balance: accs[index].balance - amount };
      db.setAccounts(uid, accs);
      const payment: BillPayment = {
        id: nextId('bill'),
        category,
        billerName,
        amount,
        status: 'paid',
        date: new Date().toISOString(),
        customerRef,
      };
      db.addBillPayment(uid, payment);
      db.addTransaction(uid, {
        id: nextId('tx'),
        accountId: accId,
        amount,
        currency: user.profile.preferredCurrency || 'MUR',
        direction: 'out',
        category: 'Bills',
        merchantName: billerName,
        date: payment.date,
        isExpense: true,
        isRecurring: false,
        status: 'posted',
      });
      return ok(payment);
    },
  },

  // ---- notifications -----------------------------------------------------------
  {
    method: 'GET',
    pattern: /^\/notifications$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const list = [...db.notificationsFor(user.profile.id)].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
      return ok(list);
    },
  },
  {
    method: 'POST',
    pattern: /^\/notifications\/read-all$/,
    handler: ({ token }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const now = new Date().toISOString();
      const list = db.notificationsFor(uid);
      let updated = 0;
      const patched = list.map((n) => {
        if (!n.readAt) { updated++; return { ...n, readAt: now }; }
        return n;
      });
      db.setNotifications(uid, patched);
      return ok({ updated });
    },
  },
  {
    method: 'POST',
    pattern: /^\/notifications\/([\w-]+)\/read$/,
    handler: ({ token, params }) => {
      const user = token ? getUserByToken(token) : undefined;
      if (!user) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
      const uid = user.profile.id;
      const id = params[0];
      const list = db.notificationsFor(uid);
      const index = list.findIndex((n) => n.id === id);
      if (index < 0) return fail('NOT_FOUND', 'Notification not found.');
      const now = new Date().toISOString();
      list[index] = { ...list[index], readAt: now };
      db.setNotifications(uid, list);
      return ok({ id, readAt: now });
    },
  },
];

export function mockRequest(
  method: string,
  path: string,
  body: unknown,
  token: string | null
): ApiResponse<unknown> {
  for (const route of mockRoutes) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (match) {
      const params = match.slice(1);
      const ctx: MockContext = { params, body, token };
      try {
        return route.handler(ctx);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error';
        return fail(ApiErrorCodes.INTERNAL, message);
      }
    }
  }
  return fail('NOT_FOUND', `No mock route for ${method} ${path}.`);
}

export function assertSuccess<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    const error = response.error;
    throw new ApiClientError(
      error?.code ?? ApiErrorCodes.INTERNAL,
      error?.message ?? 'Request failed.',
      error?.details
    );
  }
  return response.data;
}