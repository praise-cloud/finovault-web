'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moneyApi } from '@/lib/api/money';
import type {
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  PensionPlan,
  PensionProjection,
  PensionContribution,
  SecurityOverview,
  SecurityDevice,
  SecurityEvent,
  Invoice,
  Vendor,
  Transfer,
  BillPayment,
  Payee,
  BusinessProfile,
  UserPreferences,
  GoalType,
  BillCategory,
  PensionFrequency,
  PensionPot,
  TransactionDirection,
  InvoiceStatus,
  AccountType,
} from '@/types';
import { useMemo } from 'react';

// ---- query key factories ----------------------------------------------------

export const moneyKeys = {
  accounts: ['money', 'accounts'] as const,
  account: (id: string) => ['money', 'accounts', id] as const,
  transactions: (limit?: number) => (['money', 'transactions', limit ?? 50] as const),
  budgets: ['money', 'budgets'] as const,
  goals: ['money', 'goals'] as const,
  goal: (id: string) => ['money', 'goals', id] as const,
  pension: ['money', 'pension'] as const,
  pensionProjection: ['money', 'pension', 'projection'] as const,
  pensionContributions: ['money', 'pension', 'contributions'] as const,
  securityOverview: ['money', 'security', 'overview'] as const,
  securityDevices: ['money', 'security', 'devices'] as const,
  securityEvents: ['money', 'security', 'events'] as const,
  invoices: ['money', 'invoices'] as const,
  vendors: ['money', 'vendors'] as const,
  transfers: ['money', 'transfers'] as const,
  payees: ['money', 'payees'] as const,
  bills: ['money', 'bills'] as const,
  preferences: ['money', 'preferences'] as const,
} as const;

// ---- queries ----------------------------------------------------------------

export function useAccounts() {
  return useQuery<Account[]>({ queryKey: moneyKeys.accounts, queryFn: moneyApi.getAccounts });
}

export function useTransactions(limit?: number) {
  return useQuery<Transaction[]>({
    queryKey: moneyKeys.transactions(limit),
    queryFn: () => moneyApi.getTransactions(limit),
  });
}

export function useBudgets() {
  return useQuery<Budget[]>({ queryKey: moneyKeys.budgets, queryFn: moneyApi.getBudgets });
}

export function useGoals() {
  return useQuery<SavingsGoal[]>({ queryKey: moneyKeys.goals, queryFn: moneyApi.getGoals });
}

export function useGoal(id: string) {
  return useQuery<SavingsGoal>({
    queryKey: moneyKeys.goal(id),
    queryFn: () => moneyApi.getGoal(id),
    enabled: !!id,
  });
}

export function usePensionPlan() {
  return useQuery<PensionPlan | null>({
    queryKey: moneyKeys.pension,
    queryFn: moneyApi.getPensionPlan,
  });
}

export function usePensionProjection() {
  return useQuery<PensionProjection>({
    queryKey: moneyKeys.pensionProjection,
    queryFn: moneyApi.getPensionProjection,
  });
}

export function usePensionContributions() {
  return useQuery<PensionContribution[]>({
    queryKey: moneyKeys.pensionContributions,
    queryFn: moneyApi.getPensionContributions,
  });
}

export function useSecurityOverview() {
  return useQuery<SecurityOverview>({
    queryKey: moneyKeys.securityOverview,
    queryFn: moneyApi.getSecurityOverview,
  });
}

export function useSecurityDevices() {
  return useQuery<SecurityDevice[]>({
    queryKey: moneyKeys.securityDevices,
    queryFn: moneyApi.getSecurityDevices,
  });
}

export function useSecurityEvents() {
  return useQuery<SecurityEvent[]>({
    queryKey: moneyKeys.securityEvents,
    queryFn: moneyApi.getSecurityEvents,
  });
}

export function useInvoices() {
  return useQuery<Invoice[]>({ queryKey: moneyKeys.invoices, queryFn: moneyApi.getInvoices });
}

export function useVendors() {
  return useQuery<Vendor[]>({ queryKey: moneyKeys.vendors, queryFn: moneyApi.getVendors });
}

export function useTransfers() {
  return useQuery<Transfer[]>({ queryKey: moneyKeys.transfers, queryFn: moneyApi.getTransfers });
}

export function usePayees() {
  return useQuery<Payee[]>({ queryKey: moneyKeys.payees, queryFn: moneyApi.getPayees });
}

export function useBillPayments() {
  return useQuery<BillPayment[]>({ queryKey: moneyKeys.bills, queryFn: moneyApi.getBillPayments });
}

// ---- mutations --------------------------------------------------------------

export function useLinkAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; type: AccountType; balance?: number; institution?: string }) =>
      moneyApi.linkAccount(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.accounts }),
  });
}

export function useUnlinkAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => moneyApi.unlinkAccount(accountId),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.accounts }),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      accountId: string;
      amount: number;
      direction: TransactionDirection;
      category: string;
      merchantName?: string;
    }) => moneyApi.createTransaction(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.transactions(undefined) });
      qc.invalidateQueries({ queryKey: moneyKeys.accounts });
    },
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { category: string; amount: number }) => moneyApi.createBudget(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.budgets }),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; type: GoalType; targetAmount: number; targetDate?: string }) =>
      moneyApi.createGoal(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.goals }),
  });
}

export function useContributeGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, ...input }: { goalId: string; amount: number; sourceAccountId?: string }) =>
      moneyApi.contributeGoal(goalId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.goals });
      qc.invalidateQueries({ queryKey: moneyKeys.accounts });
      qc.invalidateQueries({ queryKey: moneyKeys.transactions(undefined) });
    },
  });
}

export function useUpsertPension() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
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
    }) => moneyApi.upsertPensionPlan(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.pension });
      qc.invalidateQueries({ queryKey: moneyKeys.pensionProjection });
    },
  });
}

export function useContributePension() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { pot: PensionPot; amount: number; sourceAccountId?: string }) =>
      moneyApi.contributePension(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.pension });
      qc.invalidateQueries({ queryKey: moneyKeys.pensionProjection });
      qc.invalidateQueries({ queryKey: moneyKeys.pensionContributions });
      qc.invalidateQueries({ queryKey: moneyKeys.accounts });
      qc.invalidateQueries({ queryKey: moneyKeys.transactions(undefined) });
    },
  });
}

export function useSetTwoFactor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => moneyApi.setTwoFactor(enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.securityOverview }),
  });
}

export function useResolveSecurityEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => moneyApi.resolveSecurityEvent(eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.securityEvents });
      qc.invalidateQueries({ queryKey: moneyKeys.securityOverview });
    },
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { clientName: string; amount: number; dueDate: string }) =>
      moneyApi.createInvoice(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.invoices }),
  });
}

export function useUpdateInvoiceStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: string; status: InvoiceStatus }) =>
      moneyApi.updateInvoiceStatus(invoiceId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.invoices }),
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string }) => moneyApi.createVendor(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.vendors }),
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      sourceAccountId: string;
      payeeName: string;
      destination: string;
      amount: number;
      idempotencyKey: string;
    }) => moneyApi.createTransfer(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.transfers });
      qc.invalidateQueries({ queryKey: moneyKeys.accounts });
      qc.invalidateQueries({ queryKey: moneyKeys.transactions(undefined) });
    },
  });
}

export function useCreatePayee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; destination?: string }) => moneyApi.createPayee(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: moneyKeys.payees }),
  });
}

export function usePayBill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      category: BillCategory;
      billerName: string;
      amount: number;
      customerRef: string;
      sourceAccountId?: string;
    }) => moneyApi.payBill(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: moneyKeys.bills });
      qc.invalidateQueries({ queryKey: moneyKeys.accounts });
      qc.invalidateQueries({ queryKey: moneyKeys.transactions(undefined) });
    },
  });
}

export function useSaveBusinessProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: BusinessProfile) => moneyApi.saveBusinessProfile(profile),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['auth'] }),
  });
}

// ---- derived summary selector ------------------------------------------------

export interface MoneySummary {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  savedInGoals: number;
  unpaidInvoiceTotal: number;
  unpaidInvoiceCount: number;
  topExpenseCategory: string;
  budgetLines: Array<{ category: string; budget: number; spent: number }>;
  runwayMonths: number;
  emergencyFundProgress: number;
  taxEstimate: number;
}

function startOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function useMoneySummary(): MoneySummary {
  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useTransactions(200);
  const { data: budgets = [] } = useBudgets();
  const { data: goals = [] } = useGoals();
  const { data: invoices = [] } = useInvoices();

  return useMemo(() => {
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const monthStart = startOfMonth().toISOString();
    const monthTxns = transactions.filter((t) => t.date >= monthStart);

    const monthIncome = monthTxns
      .filter((t) => t.direction === 'in')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthExpense = monthTxns
      .filter((t) => t.direction === 'out')
      .reduce((sum, t) => sum + t.amount, 0);

    const savedInGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);

    const unpaidInvoices = invoices.filter((i) => i.status !== 'paid');
    const unpaidInvoiceTotal = unpaidInvoices.reduce((sum, i) => sum + i.amount, 0);
    const unpaidInvoiceCount = unpaidInvoices.length;

    const spendingByCategory = new Map<string, number>();
    monthTxns
      .filter((t) => t.direction === 'out')
      .forEach((t) => {
        spendingByCategory.set(t.category, (spendingByCategory.get(t.category) ?? 0) + t.amount);
      });
    let topExpenseCategory = '';
    let topAmount = 0;
    spendingByCategory.forEach((amt, cat) => {
      if (amt > topAmount) {
        topAmount = amt;
        topExpenseCategory = cat;
      }
    });

    const budgetLines = budgets.map((b) => ({
      category: b.category,
      budget: b.amount,
      spent: spendingByCategory.get(b.category) ?? 0,
    }));

    const dailySpendRate = monthExpense / Math.max(1, new Date().getDate());
    const runwayMonths = dailySpendRate > 0 ? Math.round((totalBalance / (dailySpendRate * 30)) * 10) / 10 : 0;

    const emergencyGoal = goals.find((g) => g.type === 'emergency');
    const emergencyFundProgress = emergencyGoal
      ? Math.min(1, emergencyGoal.currentAmount / emergencyGoal.targetAmount)
      : 0;

    const freelancerIncome = monthIncome;
    const taxEstimate = freelancerIncome > 0 ? Math.round(freelancerIncome * 0.18) : 0;

    return {
      totalBalance,
      monthIncome,
      monthExpense,
      savedInGoals,
      unpaidInvoiceTotal,
      unpaidInvoiceCount,
      topExpenseCategory,
      budgetLines,
      runwayMonths,
      emergencyFundProgress,
      taxEstimate,
    };
  }, [accounts, transactions, budgets, goals, invoices]);
}
