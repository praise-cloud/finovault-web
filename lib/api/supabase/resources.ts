import type { SupabaseClient } from '@supabase/supabase-js';
import type { PensionPlan, Account, AccountType, AccountVerificationResult, BankLinkResult } from '@/types';
import type { ApiResponse } from '@/types/api';
import { ApiErrorCodes } from '@/types/api';
import { computeTransferFee, computePensionProjection, computeSecurityScore } from '@/lib/utils/fees';
import { ok, fail, requireUserId, snakeToCamel } from './helpers';
import { hashPassword, verifyPassword } from './auth';

// ── users ──────────────────────────────────────────────────────────────────

export async function getMe(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('users').select('*').eq('id', uid).single();
  if (!data) return fail(ApiErrorCodes.UNAUTHORIZED, 'Not authenticated.');
  return ok({
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    avatarUrl: data.avatar_url ?? undefined,
    primaryRole: data.primary_role,
    secondaryRoles: data.secondary_roles ?? [],
    scheme: data.scheme,
    preferredLanguage: data.preferred_language,
    preferredCurrency: data.preferred_currency,
    createdAt: data.created_at,
    businessProfile: data.business_profile ?? undefined,
  });
}

export async function updateMe(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const patch = body as Record<string, unknown>;
  const allowed: Record<string, string> = {
    fullName: 'full_name',
    avatarUrl: 'avatar_url',
    preferredLanguage: 'preferred_language',
    preferredCurrency: 'preferred_currency',
  };
  const update: Record<string, unknown> = {};
  for (const [key, col] of Object.entries(allowed)) {
    if (patch[key] !== undefined) update[col] = patch[key];
  }
  if (Object.keys(update).length === 0) return getMe(supabase, token);
  const { data } = await supabase.from('users').update(update).eq('id', uid).select().single();
  if (!data) return fail(ApiErrorCodes.INTERNAL, 'Update failed.');
  return getMe(supabase, token);
}

export async function getPreferences(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('user_preferences').select('*').eq('user_id', uid).single();
  const fallback = { financialGoals: [], riskTolerance: 'moderate', moneyFears: [], onboardingCompleted: false };
  return ok(data ? snakeToCamel(data) : fallback);
}

export async function savePreferences(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const p = body as Record<string, unknown>;
  const { data: existing } = await supabase.from('user_preferences').select('*').eq('user_id', uid).single();
  const update: Record<string, unknown> = {
    user_id: uid,
    financial_goals: p.financialGoals ?? existing?.financial_goals ?? [],
    risk_tolerance: p.riskTolerance ?? existing?.risk_tolerance ?? 'moderate',
    money_fears: p.moneyFears ?? existing?.money_fears ?? [],
  };
  if (p.onboardingCompleted !== undefined) update.onboarding_completed = p.onboardingCompleted;
  const { data } = await supabase
    .from('user_preferences')
    .upsert(update, { onConflict: 'user_id' })
    .select()
    .single();
  return ok(snakeToCamel(data));
}

export async function setRole(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { primaryRole, scheme } = body as { primaryRole: string; scheme?: string };
  const update: Record<string, unknown> = { primary_role: primaryRole };
  if (scheme) update.scheme = scheme;
  await supabase.from('users').update(update).eq('id', uid);
  return getMe(supabase, token);
}

export async function setBusinessProfile(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  await supabase.from('users').update({ business_profile: body }).eq('id', uid);
  return getMe(supabase, token);
}

// ── accounts ───────────────────────────────────────────────────────────────

export async function listAccounts(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('accounts').select('*').eq('user_id', uid).order('created_at', { ascending: false });
  return ok(snakeToCamel(data ?? []));
}

export async function createAccount(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.name || !(b.name as string).trim()) return fail(ApiErrorCodes.VALIDATION, 'Account name is required.');
  const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      user_id: uid,
      name: (b.name as string).trim(),
      type: b.type,
      balance: b.balance ?? 0,
      currency: user?.preferred_currency ?? 'MUR',
      institution: (b.institution as string)?.trim() ?? null,
      is_active: true,
    })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create account.');
  return ok(snakeToCamel(data));
}

export async function deleteAccount(
  supabase: SupabaseClient,
  token: string | null,
  accountId: string
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  await supabase.from('accounts').delete().eq('id', accountId).eq('user_id', uid);
  return ok({ success: true });
}

const NIGERIAN_BANKS = ['GTBank', 'Access Bank', 'Zenith Bank', 'First Bank', 'UBA', 'Kuda Bank', 'Moniepoint', 'Stanbic IBTC', 'Fidelity Bank'];
const NIGERIAN_WALLETS = ['OPay', 'PalmPay'];
const MAURITIAN_BANKS = ['MCB', 'SBM', 'Bank One', 'Maubank', 'Absa Bank Mauritius'];
const MAURITIAN_WALLETS = ['Juice', 'my.t money', 'Emtel Money'];

const FIRST_NAMES = [
  'Ade', 'Chioma', 'Emeka', 'Fatima', 'Ibrahim', 'Kehinde', 'Ngozi', 'Oluwaseun', 'Tunde', 'Zainab',
  'Aarav', 'Aditi', 'Aisha', 'Arjun', 'Bhavesh', 'Chaya', 'Deepak', 'Esha', 'Farid', 'Geeta',
  'Hassan', 'Indira', 'Jaya', 'Kabir', 'Leela', 'Manoj', 'Nadia', 'Omkar', 'Priya', 'Rahul'
];
const LAST_NAMES = [
  'Adeyemi', 'Balogun', 'Chukwu', 'Danjuma', 'Eze', 'Ibrahim', 'Okafor', 'Okonkwo', 'Okoro', 'Suleiman',
  'Bundhoo', 'Chowdhury', 'Dinavia', 'Gooljar', 'Hossen', 'Jhugroo', 'Kistnen', 'Lallah', 'Mootoosamy'
];

function deterministicName(identifier: string): string {
  let h = 0;
  for (let i = 0; i < identifier.length; i++) {
    h = ((h << 5) - h + identifier.charCodeAt(i)) | 0;
  }
  h = Math.abs(h);
  return `${FIRST_NAMES[h % FIRST_NAMES.length]} ${LAST_NAMES[(h >> 8) % LAST_NAMES.length]}`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function verifyAccount(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<AccountVerificationResult>> {
  await requireUserId(supabase, token);
  const { institution, identifier, holderName } = (body || {}) as {
    institution?: string;
    identifier?: string;
    holderName?: string;
  };
  if (!institution || !identifier) {
    return fail(ApiErrorCodes.VALIDATION, 'Institution and account number are required.');
  }
  const idStr = identifier.trim();
  const isNigerian = NIGERIAN_BANKS.includes(institution) || NIGERIAN_WALLETS.includes(institution);
  const isBank = NIGERIAN_BANKS.includes(institution) || MAURITIAN_BANKS.includes(institution);

  let valid = false;
  if (isNigerian) {
    valid = isBank ? /^\d{10}$/.test(idStr) : /^(\+?234|0)?[789][01]\d{8}$|^\d{10,11}$/.test(idStr);
  } else {
    valid = isBank ? /^\d{8,16}$/.test(idStr) : /^[5-7]\d{4,7}$/.test(idStr);
  }

  if (!valid) {
    return ok({ exists: false, holderName: null, verified: false });
  }

  const expectedName = deterministicName(idStr);
  const userSpecified = (holderName || '').trim();
  const verified = userSpecified ? userSpecified.toLowerCase() === expectedName.toLowerCase() : true;

  return ok({
    exists: true,
    holderName: expectedName,
    verified,
  });
}

export async function linkBankAccount(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<BankLinkResult>> {
  const uid = await requireUserId(supabase, token);
  const { institution, accountNumber, holderName, country } = (body || {}) as {
    institution?: string;
    accountNumber?: string;
    holderName?: string;
    country?: string;
  };

  if (!institution || !accountNumber?.trim()) {
    return fail(ApiErrorCodes.VALIDATION, 'Institution and account number are required.');
  }

  const acctNum = accountNumber.trim();
  const isNigerian =
    country === 'NG' ||
    NIGERIAN_BANKS.includes(institution) ||
    NIGERIAN_WALLETS.includes(institution);
  const isWallet =
    NIGERIAN_WALLETS.includes(institution) ||
    MAURITIAN_WALLETS.includes(institution);
  const isBank = !isWallet;

  if (isNigerian) {
    if (isBank && !/^\d{10}$/.test(acctNum)) {
      return fail(ApiErrorCodes.VALIDATION, 'Nigerian bank account number (NUBAN) must be 10 digits.');
    }
    if (!isBank && !/^(\+?234|0)?[789][01]\d{8}$|^\d{10,11}$/.test(acctNum)) {
      return fail(ApiErrorCodes.VALIDATION, 'Nigerian wallet number must be 10–11 digits.');
    }
  } else {
    if (isBank && !/^\d{8,16}$/.test(acctNum)) {
      return fail(ApiErrorCodes.VALIDATION, 'Bank account number must be 8–16 digits.');
    }
    if (!isBank && !/^[5-7]\d{4,7}$/.test(acctNum)) {
      return fail(ApiErrorCodes.VALIDATION, 'Mobile money number must be 5–8 digits starting with 5–7.');
    }
  }

  const verifiedHolderName = holderName?.trim() || deterministicName(acctNum);
  const seed = hashCode(institution + acctNum);
  const currency = isNigerian ? 'NGN' : 'MUR';
  const last4 = acctNum.slice(-4);
  const startingBalance = isNigerian
    ? (isWallet ? 25000 + (seed % 35000) : 350000 + (seed % 500000))
    : (isWallet ? 3200 + (seed % 900) : 64000 + (seed % 40000));

  const accountType: AccountType = isWallet ? 'mobileMoney' : 'bank';
  const accountName = `${institution} ••${last4} (${verifiedHolderName})`;

  // 1. Create account
  const { data: newAccount, error: accError } = await supabase
    .from('accounts')
    .insert({
      user_id: uid,
      name: accountName,
      type: accountType,
      balance: startingBalance,
      currency,
      institution,
      is_active: true,
    })
    .select()
    .single();

  if (accError || !newAccount) {
    return fail(ApiErrorCodes.INTERNAL, accError?.message || 'Failed to link account.');
  }

  // 2. Automatically generate and seed 45 days of realistic transaction history
  const spendCats = isNigerian
    ? ['groceries', 'transport', 'utilities', 'dining', 'airtime', 'shopping']
    : ['groceries', 'transport', 'utilities', 'dining', 'software', 'supplies'];
  const merchants = isNigerian
    ? ['Jumia', 'Chicken Republic', 'MTN Airtime', 'Ikeja Electric', 'Fuel / NNPC', 'Spar Supermarket', 'Uber Lagos', 'Konga', 'DSTV']
    : ['Shoprite', 'Bus ticket', 'CEB', 'Lambrooks', 'Flicks', 'Canva', 'Office Supplies', 'Super U'];

  const transactionsToInsert: Array<Record<string, unknown>> = [];
  const now = Date.now();

  for (let d = 1; d <= 45; d++) {
    const k = (seed + d * 7) % 10;
    const date = new Date(now - d * 86400000).toISOString();

    if (d % 3 === 0) {
      // Inflow
      const creditAmt = isNigerian
        ? (isWallet ? 15000 + (k * 2500) : 120000 + (k * 25000))
        : (isWallet ? 60 + (k * 17) : 1400 + (k * 320));
      transactionsToInsert.push({
        user_id: uid,
        account_id: newAccount.id,
        amount: creditAmt,
        currency,
        direction: 'in',
        category: isWallet ? 'client payment' : 'salary',
        merchant_name: isWallet ? 'Transfer in' : 'Payroll / Salary',
        date,
        is_expense: false,
        is_recurring: d % 15 === 0,
        status: 'posted',
      });
    }

    if (d % 2 === 0) {
      // Expense
      const debitAmt = isNigerian
        ? (isWallet ? 2500 + (k * 800) : 12000 + (k * 3500))
        : (isWallet ? 40 + (k * 9) : 380 + (k * 70));
      transactionsToInsert.push({
        user_id: uid,
        account_id: newAccount.id,
        amount: debitAmt,
        currency,
        direction: 'out',
        category: spendCats[k % spendCats.length],
        merchant_name: merchants[k % merchants.length],
        date,
        is_expense: true,
        is_recurring: false,
        status: 'posted',
      });
    }
  }

  if (transactionsToInsert.length > 0) {
    await supabase.from('transactions').insert(transactionsToInsert);
  }

  return ok({
    account: snakeToCamel(newAccount) as Account,
    imported: transactionsToInsert.length,
  });
}

// ── transactions ───────────────────────────────────────────────────────────

export async function listTransactions(
  supabase: SupabaseClient,
  token: string | null,
  limit = 50
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', uid)
    .order('date', { ascending: false })
    .limit(limit);
  return ok(snakeToCamel(data ?? []));
}

export async function createTransaction(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.amount || (b.amount as number) <= 0) return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
  const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: uid,
      account_id: b.accountId,
      amount: b.amount,
      currency: user?.preferred_currency ?? 'MUR',
      direction: b.direction,
      category: (b.category as string).trim(),
      merchant_name: (b.merchantName as string)?.trim() ?? null,
      date: new Date().toISOString(),
      is_expense: b.direction === 'out',
      is_recurring: false,
      status: 'posted',
    })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create transaction.');
  return ok(snakeToCamel(data));
}

// ── budgets ────────────────────────────────────────────────────────────────

export async function listBudgets(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('budgets').select('*').eq('user_id', uid);
  return ok(snakeToCamel(data ?? []));
}

export async function upsertBudget(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { category, amount } = body as { category: string; amount: number };
  if (!category?.trim() || !amount || amount <= 0) {
    return fail(ApiErrorCodes.VALIDATION, 'Category and a positive amount are required.');
  }
  const { data: existing } = await supabase
    .from('budgets')
    .select('id')
    .eq('user_id', uid)
    .ilike('category', category.trim())
    .single();
  if (existing) {
    const { data } = await supabase
      .from('budgets')
      .update({ category: category.trim(), amount })
      .eq('id', existing.id)
      .select()
      .single();
    return ok(snakeToCamel(data));
  }
  const { data, error } = await supabase
    .from('budgets')
    .insert({ user_id: uid, category: category.trim(), amount, period: 'monthly' })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create budget.');
  return ok(snakeToCamel(data));
}

// ── goals ──────────────────────────────────────────────────────────────────

export async function listGoals(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data: goals } = await supabase.from('goals').select('*').eq('user_id', uid);
  const result = [];
  for (const g of goals ?? []) {
    const { data: contributions } = await supabase
      .from('goal_contributions')
      .select('*')
      .eq('goal_id', g.id)
      .order('date', { ascending: false });
    result.push({
      id: g.id,
      name: g.name,
      type: g.type,
      targetAmount: g.target_amount,
      currentAmount: g.current_amount,
      targetDate: g.target_date ?? undefined,
      completed: g.completed,
      contributions: (contributions ?? []).map((c) => ({
        id: c.id,
        goalId: c.goal_id,
        amount: c.amount,
        date: c.date,
        sourceAccountId: c.source_account_id ?? undefined,
      })),
    });
  }
  return ok(result);
}

export async function getGoal(
  supabase: SupabaseClient,
  token: string | null,
  goalId: string
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data: g } = await supabase.from('goals').select('*').eq('id', goalId).eq('user_id', uid).single();
  if (!g) return fail('NOT_FOUND', 'Goal not found.');
  const { data: contributions } = await supabase
    .from('goal_contributions')
    .select('*')
    .eq('goal_id', g.id)
    .order('date', { ascending: false });
  return ok({
    id: g.id,
    name: g.name,
    type: g.type,
    targetAmount: g.target_amount,
    currentAmount: g.current_amount,
    targetDate: g.target_date ?? undefined,
    completed: g.completed,
    contributions: (contributions ?? []).map((c) => ({
      id: c.id,
      goalId: c.goal_id,
      amount: c.amount,
      date: c.date,
      sourceAccountId: c.source_account_id ?? undefined,
    })),
  });
}

export async function createGoal(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.name || !(b.name as string).trim() || !b.targetAmount || (b.targetAmount as number) <= 0) {
    return fail(ApiErrorCodes.VALIDATION, 'Give your goal a name and a target above zero.');
  }
  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: uid,
      name: (b.name as string).trim(),
      type: b.type,
      target_amount: b.targetAmount,
      current_amount: 0,
      target_date: b.targetDate ?? null,
      completed: false,
    })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create goal.');
  return ok({
    id: data.id,
    name: data.name,
    type: data.type,
    targetAmount: data.target_amount,
    currentAmount: data.current_amount,
    targetDate: data.target_date ?? undefined,
    completed: data.completed,
    contributions: [],
  });
}

export async function contributeToGoal(
  supabase: SupabaseClient,
  token: string | null,
  goalId: string,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { amount, sourceAccountId } = body as { amount: number; sourceAccountId?: string };
  const { data: goal } = await supabase.from('goals').select('*').eq('id', goalId).eq('user_id', uid).single();
  if (!goal) return fail('NOT_FOUND', 'Goal not found.');
  if (!amount || amount <= 0) return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');

  if (sourceAccountId) {
    const { data: acc } = await supabase.from('accounts').select('*').eq('id', sourceAccountId).eq('user_id', uid).single();
    if (!acc) return fail('NOT_FOUND', 'Account not found.');
    if (acc.balance < amount) return fail('INSUFFICIENT_FUNDS', 'Not enough funds in this account.');
    await supabase.from('accounts').update({ balance: acc.balance - amount }).eq('id', sourceAccountId);
    const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();
    await supabase.from('transactions').insert({
      user_id: uid,
      account_id: sourceAccountId,
      amount,
      currency: user?.preferred_currency ?? 'MUR',
      direction: 'out',
      category: 'Savings',
      merchant_name: goal.name,
      date: new Date().toISOString(),
      is_expense: true,
      is_recurring: false,
      status: 'posted',
    });
  }

  const newCurrent = goal.current_amount + amount;
  const completed = goal.completed || newCurrent >= goal.target_amount;
  await supabase.from('goals').update({ current_amount: newCurrent, completed }).eq('id', goalId);
  const { data: contrib } = await supabase
    .from('goal_contributions')
    .insert({ goal_id: goalId, amount, date: new Date().toISOString(), source_account_id: sourceAccountId ?? null })
    .select()
    .single();
  return ok({
    id: goal.id,
    name: goal.name,
    type: goal.type,
    targetAmount: goal.target_amount,
    currentAmount: newCurrent,
    targetDate: goal.target_date ?? undefined,
    completed,
    contributions: [
      ...(goal.current_amount > 0 ? [] : []),
      { id: contrib!.id, goalId: goalId, amount, date: contrib!.date, sourceAccountId: sourceAccountId ?? undefined },
    ],
  });
}

// ── pension ────────────────────────────────────────────────────────────────

function toPensionPlan(row: Record<string, unknown>): PensionPlan {
  return {
    id: row.id as string,
    shortPotTarget: row.short_pot_target as number,
    longPotTarget: row.long_pot_target as number,
    frequency: row.frequency as PensionPlan['frequency'],
    contributionAmount: row.contribution_amount as number,
    currentShortPot: row.current_short_pot as number,
    currentLongPot: row.current_long_pot as number,
    assumedReturnPct: row.assumed_return_pct as number,
    inflationPct: row.inflation_pct as number,
    currentAge: row.current_age as number,
    retirementAge: row.retirement_age as number,
    autoDebit: row.auto_debit as boolean,
    updatedAt: row.updated_at as string,
  };
}

export async function getPension(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('pension_plans').select('*').eq('user_id', uid).single();
  return ok(data ? toPensionPlan(data) : null);
}

export async function getPensionProjection(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('pension_plans').select('*').eq('user_id', uid).single();
  if (!data) return ok({ shortPotProjected: 0, longPotProjected: 0, totalProjected: 0, yearsToRetirement: 0 });
  return ok(computePensionProjection(toPensionPlan(data)));
}

export async function listPensionContributions(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data: plan } = await supabase.from('pension_plans').select('id').eq('user_id', uid).single();
  if (!plan) return ok([]);
  const { data } = await supabase
    .from('pension_contributions')
    .select('*')
    .eq('plan_id', plan.id)
    .order('date', { ascending: false });
  return ok(
    (data ?? []).map((c) => ({
      id: c.id,
      planId: c.plan_id,
      pot: c.pot,
      amount: c.amount,
      date: c.date,
      sourceAccountId: c.source_account_id ?? undefined,
    }))
  );
}

export async function upsertPension(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (
    (b.shortPotTarget as number) <= 0 ||
    (b.longPotTarget as number) <= 0 ||
    (b.contributionAmount as number) <= 0
  ) {
    return fail(ApiErrorCodes.VALIDATION, 'Set a positive target and contribution for both pots.');
  }
  const { data: existing } = await supabase.from('pension_plans').select('id').eq('user_id', uid).single();
  const row = {
    user_id: uid,
    short_pot_target: b.shortPotTarget,
    long_pot_target: b.longPotTarget,
    frequency: b.frequency,
    contribution_amount: b.contributionAmount,
    current_short_pot: b.currentShortPot,
    current_long_pot: b.currentLongPot,
    assumed_return_pct: b.assumedReturnPct,
    inflation_pct: b.inflationPct,
    current_age: b.currentAge,
    retirement_age: b.retirementAge,
    auto_debit: b.autoDebit,
    updated_at: new Date().toISOString(),
  };
  let data;
  if (existing) {
    const res = await supabase.from('pension_plans').update(row).eq('id', existing.id).select().single();
    data = res.data;
  } else {
    const res = await supabase.from('pension_plans').insert(row).select().single();
    data = res.data;
  }
  if (!data) return fail(ApiErrorCodes.INTERNAL, 'Failed to save pension plan.');
  return ok(toPensionPlan(data));
}

export async function contributeToPension(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  const pot = b.pot as 'short' | 'long';
  const amount = b.amount as number;
  const sourceAccountId = b.sourceAccountId as string | undefined;

  const { data: plan } = await supabase.from('pension_plans').select('*').eq('user_id', uid).single();
  if (!plan) return fail('NOT_FOUND', 'No pension plan found. Create one first.');
  if (!amount || amount <= 0) return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');

  if (sourceAccountId) {
    const { data: acc } = await supabase.from('accounts').select('*').eq('id', sourceAccountId).eq('user_id', uid).single();
    if (!acc) return fail('NOT_FOUND', 'Account not found.');
    if (acc.balance < amount) return fail('INSUFFICIENT_FUNDS', 'Not enough funds in this account.');
    await supabase.from('accounts').update({ balance: acc.balance - amount }).eq('id', sourceAccountId);
    const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();
    await supabase.from('transactions').insert({
      user_id: uid,
      account_id: sourceAccountId,
      amount,
      currency: user?.preferred_currency ?? 'MUR',
      direction: 'out',
      category: 'Pension',
      merchant_name: 'Finovault Pension',
      date: new Date().toISOString(),
      is_expense: true,
      is_recurring: false,
      status: 'posted',
    });
  }

  const isShort = pot === 'short';
  await supabase
    .from('pension_plans')
    .update({
      current_short_pot: isShort ? plan.current_short_pot + amount : plan.current_short_pot,
      current_long_pot: isShort ? plan.current_long_pot : plan.current_long_pot + amount,
    })
    .eq('id', plan.id);

  const { data: contrib } = await supabase
    .from('pension_contributions')
    .insert({ plan_id: plan.id, pot, amount, date: new Date().toISOString(), source_account_id: sourceAccountId ?? null })
    .select()
    .single();

  return ok({
    id: contrib!.id,
    planId: plan.id,
    pot,
    amount,
    date: contrib!.date,
    sourceAccountId: sourceAccountId ?? undefined,
  });
}

// ── security ───────────────────────────────────────────────────────────────

export async function getSecurityOverview(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('security_overviews').select('*').eq('user_id', uid).single();
  const stored = data ?? { score: 72, two_factor_enabled: false };
  const { data: events } = await supabase.from('security_events').select('*').eq('user_id', uid);
  return ok(snakeToCamel({ ...stored, score: computeSecurityScore(events ?? [], stored) }));
}

export async function toggle2fa(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { enabled } = body as { enabled: boolean };
  const { data: stored } = await supabase.from('security_overviews').select('*').eq('user_id', uid).single();
  const current = stored ?? { score: 72, two_factor_enabled: false };
  const updated = { ...current, two_factor_enabled: !!enabled };
  await supabase.from('security_overviews').upsert({ user_id: uid, ...updated }, { onConflict: 'user_id' });
  const { data: events } = await supabase.from('security_events').select('*').eq('user_id', uid);
  return ok(snakeToCamel({ ...updated, score: computeSecurityScore(events ?? [], updated) }));
}

export async function changePassword(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.newPassword || (b.newPassword as string).length < 8) {
    return fail(ApiErrorCodes.VALIDATION, 'Password must be at least 8 characters.');
  }
  const { data: user } = await supabase.from('users').select('password_hash').eq('id', uid).single();
  if (!user || !(await verifyPassword(b.currentPassword as string, user.password_hash))) {
    return fail('INCORRECT_PASSWORD', 'Your current password is incorrect.');
  }
  if (b.currentPassword === b.newPassword) {
    return fail(ApiErrorCodes.VALIDATION, 'New password must be different from your current password.');
  }
  const { hash, salt } = await hashPassword(b.newPassword as string);
  await supabase.from('users').update({ password_hash: `${salt}:${hash}` }).eq('id', uid);
  const now = new Date().toISOString();
  await supabase.from('security_events').insert({
    user_id: uid,
    title: 'Password changed',
    description: 'Your password was changed from this device.',
    severity: 'low',
    date: now,
    resolved: false,
  });
  const { data: stored } = await supabase.from('security_overviews').select('*').eq('user_id', uid).single();
  const current = stored ?? { score: 72, two_factor_enabled: false };
  const updated = { ...current, score: Math.min(99, Math.max(5, (current.score ?? 72) + 5)), last_password_change: now };
  await supabase.from('security_overviews').upsert({ user_id: uid, ...updated }, { onConflict: 'user_id' });
  const { data: events } = await supabase.from('security_events').select('*').eq('user_id', uid);
  return ok(snakeToCamel({ ...updated, score: computeSecurityScore(events ?? [], updated) }));
}

export async function listDevices(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('security_devices').select('*').eq('user_id', uid);
  return ok(snakeToCamel(data ?? []));
}

export async function listSecurityEvents(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('security_events').select('*').eq('user_id', uid);
  return ok(snakeToCamel(data ?? []));
}

export async function resolveSecurityEvent(
  supabase: SupabaseClient,
  token: string | null,
  eventId: string
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('security_events')
    .update({ resolved: true })
    .eq('id', eventId)
    .eq('user_id', uid)
    .select()
    .single();
  if (!data) return fail('NOT_FOUND', 'Event not found.');
  return ok(snakeToCamel(data));
}

// ── invoices ───────────────────────────────────────────────────────────────

export async function listInvoices(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', uid)
    .order('due_date', { ascending: false });
  return ok(snakeToCamel(data ?? []));
}

export async function createInvoice(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.clientName || !(b.clientName as string).trim() || !b.amount || (b.amount as number) <= 0) {
    return fail(ApiErrorCodes.VALIDATION, 'Client and a positive amount are required.');
  }
  const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: uid,
      client_name: (b.clientName as string).trim(),
      amount: b.amount,
      currency: user?.preferred_currency ?? 'MUR',
      due_date: b.dueDate,
      status: 'sent',
    })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create invoice.');
  return ok(snakeToCamel(data));
}

export async function updateInvoiceStatus(
  supabase: SupabaseClient,
  token: string | null,
  invoiceId: string,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { status } = body as { status: string };
  const { data } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('user_id', uid)
    .select()
    .single();
  if (!data) return fail('NOT_FOUND', 'Invoice not found.');
  return ok(snakeToCamel(data));
}

// ── vendors ────────────────────────────────────────────────────────────────

export async function listVendors(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('vendors').select('*').eq('user_id', uid);
  return ok(snakeToCamel(data ?? []));
}

export async function createVendor(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.name || !(b.name as string).trim()) return fail(ApiErrorCodes.VALIDATION, 'Vendor name is required.');
  const { data, error } = await supabase
    .from('vendors')
    .insert({ user_id: uid, name: (b.name as string).trim(), total_spend: 0, reliability_score: 80 })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create vendor.');
  return ok(snakeToCamel(data));
}

// ── transfers & payees ─────────────────────────────────────────────────────

export async function listTransfers(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('transfers')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  return ok(snakeToCamel(data ?? []));
}

export async function getTransfer(
  supabase: SupabaseClient,
  token: string | null,
  transferId: string
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('transfers')
    .select('*')
    .eq('id', transferId)
    .eq('user_id', uid)
    .single();
  if (!data) return fail('NOT_FOUND', 'Transfer not found.');
  return ok(snakeToCamel(data));
}

export async function createTransfer(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  const { sourceAccountId, payeeName, destination, amount, idempotencyKey } = b as {
    sourceAccountId: string;
    payeeName: string;
    destination: string;
    amount: number;
    idempotencyKey: string;
  };

  const { data: existing } = await supabase
    .from('transfers')
    .select('*')
    .eq('user_id', uid)
    .eq('idempotency_key', idempotencyKey)
    .single();
  if (existing) return ok(snakeToCamel(existing));

  const { data: acc } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', sourceAccountId)
    .eq('user_id', uid)
    .single();
  if (!acc) return fail('NOT_FOUND', 'Source account not found.');
  if (!amount || amount <= 0) return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');

  const fee = computeTransferFee(amount);
  const total = amount + fee;
  if (acc.balance < total) return fail('INSUFFICIENT_FUNDS', `Not enough funds — total with fees is ${total}.`);

  await supabase.from('accounts').update({ balance: acc.balance - total }).eq('id', sourceAccountId);
  const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();

  const { data: transfer } = await supabase
    .from('transfers')
    .insert({
      user_id: uid,
      source_account_id: sourceAccountId,
      payee_name: payeeName.trim(),
      destination: destination.trim(),
      amount,
      fee,
      total,
      status: 'completed',
      created_at: new Date().toISOString(),
      external_ref: `FV${Date.now() % 1000000}`,
      idempotency_key: idempotencyKey,
    })
    .select()
    .single();

  await supabase.from('transactions').insert({
    user_id: uid,
    account_id: sourceAccountId,
    amount: total,
    currency: user?.preferred_currency ?? 'MUR',
    direction: 'out',
    category: 'Transfer',
    merchant_name: payeeName.trim(),
    date: transfer!.created_at,
    is_expense: true,
    is_recurring: false,
    status: 'posted',
  });

  return ok(snakeToCamel(transfer));
}

export async function listPayees(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase.from('payees').select('*').eq('user_id', uid);
  return ok(snakeToCamel(data ?? []));
}

export async function createPayee(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.name || !(b.name as string).trim()) return fail(ApiErrorCodes.VALIDATION, 'Payee name is required.');
  const { data, error } = await supabase
    .from('payees')
    .insert({ user_id: uid, name: (b.name as string).trim(), destination: (b.destination as string)?.trim() ?? null })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to create payee.');
  return ok(snakeToCamel(data));
}

// ── bills ──────────────────────────────────────────────────────────────────

export async function listBills(supabase: SupabaseClient, token: string | null): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('bills')
    .select('*')
    .eq('user_id', uid)
    .order('date', { ascending: false });
  return ok(snakeToCamel(data ?? []));
}

export async function payBill(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  const { category, billerName, amount, customerRef, sourceAccountId } = b as {
    category: string;
    billerName: string;
    amount: number;
    customerRef: string;
    sourceAccountId?: string;
  };

  const { data: accs } = await supabase.from('accounts').select('*').eq('user_id', uid);
  const accId = sourceAccountId ?? (accs?.length ? accs[0].id : '');
  const acc = accs?.find((a) => a.id === accId);
  if (!acc) return fail('NOT_FOUND', 'No account to pay from.');
  if (!amount || amount <= 0) return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
  if (acc.balance < amount) return fail('INSUFFICIENT_FUNDS', 'Not enough funds for this bill.');

  await supabase.from('accounts').update({ balance: acc.balance - amount }).eq('id', accId);
  const now = new Date().toISOString();
  const { data: user } = await supabase.from('users').select('preferred_currency').eq('id', uid).single();

  const { data: payment } = await supabase
    .from('bills')
    .insert({
      user_id: uid,
      category,
      biller_name: billerName,
      amount,
      status: 'paid',
      date: now,
      customer_ref: customerRef,
    })
    .select()
    .single();

  await supabase.from('transactions').insert({
    user_id: uid,
    account_id: accId,
    amount,
    currency: user?.preferred_currency ?? 'MUR',
    direction: 'out',
    category: 'Bills',
    merchant_name: billerName,
    date: now,
    is_expense: true,
    is_recurring: false,
    status: 'posted',
  });

  return ok(snakeToCamel(payment));
}

export async function scheduleBill(
  supabase: SupabaseClient,
  token: string | null,
  body: unknown
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const b = body as Record<string, unknown>;
  if (!b.amount || (b.amount as number) <= 0) {
    return fail(ApiErrorCodes.VALIDATION, 'Amount must be greater than zero.');
  }
  const { data, error } = await supabase
    .from('bills')
    .insert({
      user_id: uid,
      category: b.category,
      biller_name: b.billerName,
      amount: b.amount,
      status: 'scheduled',
      date: new Date().toISOString(),
      customer_ref: b.customerRef,
      scheduled_for: b.scheduledFor,
    })
    .select()
    .single();
  if (error || !data) return fail(ApiErrorCodes.INTERNAL, error?.message ?? 'Failed to schedule bill.');
  return ok(snakeToCamel(data));
}

// ── notifications ─────────────────────────────────────────────────────

export async function listNotifications(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false });
  return ok(snakeToCamel(data ?? []));
}

export async function markNotificationRead(
  supabase: SupabaseClient,
  token: string | null,
  notificationId: string
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const now = new Date().toISOString();
  const { data } = await supabase
    .from('notifications')
    .update({ read_at: now })
    .eq('id', notificationId)
    .eq('user_id', uid)
    .select('id')
    .single();
  if (!data) return fail('NOT_FOUND', 'Notification not found.');
  return ok({ id: data.id, readAt: now });
}

export async function markAllNotificationsRead(
  supabase: SupabaseClient,
  token: string | null
): Promise<ApiResponse<unknown>> {
  const uid = await requireUserId(supabase, token);
  const now = new Date().toISOString();
  const { count } = await supabase
    .from('notifications')
    .update({ read_at: now })
    .eq('user_id', uid)
    .is('read_at', null);
  return ok({ updated: count ?? 0 });
}
