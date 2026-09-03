import { api } from './client';
import type {
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
  PensionPot,
  PensionProjection,
  SavingsGoal,
  SecurityDevice,
  SecurityEvent,
  SecurityOverview,
  Transaction,
  TransactionDirection,
  Transfer,
  TransferStatus,
  UserPreferences,
  UserProfile,
  Vendor,
} from '@/types';

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const moneyApi = {
  // ---- accounts ------------------------------------------------------------
  getAccounts: () => api.get<Account[]>('/accounts'),
  linkAccount: (input: {
    name: string;
    type: AccountType;
    balance?: number;
    institution?: string;
  }) => api.post<Account>('/accounts', input),
  unlinkAccount: (accountId: string) => api.delete<{ success: boolean }>(`/accounts/${accountId}`),

  // ---- transactions ---------------------------------------------------------
  getTransactions: (limit = 50) => api.get<Transaction[]>(`/transactions?limit=${limit}`),
  createTransaction: (input: {
    accountId: string;
    amount: number;
    direction: TransactionDirection;
    category: string;
    merchantName?: string;
  }) => api.post<Transaction>('/transactions', input),

  // ---- budgets ----------------------------------------------------------------
  getBudgets: () => api.get<Budget[]>('/budgets'),
  createBudget: (input: { category: string; amount: number }) => api.post<Budget>('/budgets', input),

  // ---- goals -----------------------------------------------------------------
  getGoals: () => api.get<SavingsGoal[]>('/goals'),
  getGoal: (goalId: string) => api.get<SavingsGoal>(`/goals/${goalId}`),
  createGoal: (input: {
    name: string;
    type: GoalType;
    targetAmount: number;
    targetDate?: string;
  }) => api.post<SavingsGoal>('/goals', input),
  contributeGoal: (goalId: string, input: { amount: number; sourceAccountId?: string }) =>
    api.post<SavingsGoal>(`/goals/${goalId}/contribute`, input),

  // ---- pension -----------------------------------------------------------------
  getPensionPlan: () => api.get<PensionPlan | null>('/pension'),
  getPensionProjection: () => api.get<PensionProjection>('/pension/projection'),
  upsertPensionPlan: (input: {
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
  }) => api.put<PensionPlan>('/pension', input),
  contributePension: (input: { pot: PensionPot; amount: number; sourceAccountId?: string }) =>
    api.post<PensionContribution>('/pension/contribute', input),
  getPensionContributions: () => api.get<PensionContribution[]>('/pension/contributions'),

  // ---- security -----------------------------------------------------------------
  getSecurityOverview: () => api.get<SecurityOverview>('/security/overview'),
  setTwoFactor: (enabled: boolean) =>
    api.put<SecurityOverview>('/security/2fa', { enabled }),
  getSecurityDevices: () => api.get<SecurityDevice[]>('/security/devices'),
  getSecurityEvents: () => api.get<SecurityEvent[]>('/security/events'),
  resolveSecurityEvent: (eventId: string) =>
    api.post<SecurityEvent>(`/security/events/${eventId}/resolve`),
  changePassword: (input: ChangePasswordInput) =>
    api.post<SecurityOverview>('/security/change-password', input),

  // ---- invoices & vendors ---------------------------------------------------------
  getInvoices: () => api.get<Invoice[]>('/invoices'),
  createInvoice: (input: { clientName: string; amount: number; dueDate: string }) =>
    api.post<Invoice>('/invoices', input),
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) =>
    api.patch<Invoice>(`/invoices/${invoiceId}/status`, { status }),
  getVendors: () => api.get<Vendor[]>('/vendors'),
  createVendor: (input: { name: string }) => api.post<Vendor>('/vendors', input),

  // ---- transfers & payees ---------------------------------------------------------
  getTransfers: () => api.get<Transfer[]>('/transfers'),
  getTransfer: (transferId: string) => api.get<Transfer>(`/transfers/${transferId}`),
  createTransfer: (input: {
    sourceAccountId: string;
    payeeName: string;
    destination: string;
    amount: number;
    idempotencyKey: string;
  }) => api.post<Transfer>('/transfers', input),
  getPayees: () => api.get<Payee[]>('/payees'),
  createPayee: (input: { name: string; destination?: string }) =>
    api.post<Payee>('/payees', input),

  // ---- bills -----------------------------------------------------------------
  getBillPayments: () => api.get<BillPayment[]>('/bills'),
  payBill: (input: {
    category: BillCategory;
    billerName: string;
    amount: number;
    customerRef: string;
    sourceAccountId?: string;
  }) => api.post<BillPayment>('/bills', input),
  scheduleBill: (input: {
    category: BillCategory;
    billerName: string;
    amount: number;
    customerRef: string;
    scheduledFor: string;
  }) => api.post<BillPayment>('/bills/schedule', input),

  // ---- profile / prefs ---------------------------------------------------------
  getPreferences: () => api.get<UserPreferences>('/users/preferences'),
  savePreferences: (patch: Partial<UserPreferences>) =>
    api.put<UserPreferences>('/users/preferences', patch),
  saveBusinessProfile: (profile: BusinessProfile) =>
    api.put<UserProfile>('/users/business-profile', profile),
  changeLanguage: (language: 'en' | 'fr') => api.patch<UserProfile>('/users/me', { preferredLanguage: language }),
};

export interface TransferFeePreview {
  amount: number;
  fee: number;
  total: number;
}

export type { TransferStatus };
