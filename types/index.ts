export type PrimaryRole = 'individual' | 'freelancer' | 'entrepreneur' | 'sme';

export type SecondaryRole = PrimaryRole;

export type RoleScheme = 'standard' | 'female_founder';

export interface BusinessProfile {
  employeeCount?: number;
  annualRevenueRange?: string;
  industry?: string;
  businessStage?: BusinessStage;
  taxId?: string;
  registrationNumber?: string;
  monthlyPayroll?: number;
  avgInvoiceValue?: number;
  paymentTermsDays?: number;
  keySuppliers: string[];
  keyClients: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  primaryRole: PrimaryRole;
  secondaryRoles: SecondaryRole[];
  scheme: RoleScheme;
  preferredLanguage: 'en' | 'fr';
  preferredCurrency: string;
  createdAt: string;
  businessProfile?: BusinessProfile;
  subscriptionPlan?: 'free' | 'plus' | 'business';
  subscriptionStatus?: 'active' | 'trial' | 'inactive';
  subscriptionPeriod?: 'monthly' | 'annually';
  mastercardLast4?: string;
  mastercardExpiry?: string;
  country?: 'NG' | 'MU' | string;
  phone?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: AccountType;
  country: 'NG' | 'MU';
  blurb?: string;
}

export interface BankLinkResult {
  account: Account;
  imported: number;
}

export interface AccountVerificationResult {
  exists: boolean;
  holderName: string | null;
  verified: boolean;
}

export interface MastercardPaymentRequest {
  planId: 'free' | 'plus' | 'business';
  billingPeriod: 'monthly' | 'annually';
  amount: number;
  currency: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  email: string;
}

export interface MastercardPaymentResponse {
  success: boolean;
  transactionId: string;
  authorizationCode: string;
  gateway: 'Mastercard Payment Gateway Services (MPGS)';
  settlementStatus: 'SETTLED' | 'PENDING' | 'DECLINED';
  brand: 'Mastercard';
  last4: string;
  expiry: string;
  amount: number;
  currency: string;
  planId: 'free' | 'plus' | 'business';
  timestamp: string;
  receiptUrl?: string;
}

// ---- Money domain models (mirror finovault-flutter/lib/core/models.dart) ----

export type AccountType = 'bank' | 'mobileMoney' | 'cash' | 'other';
export type TransactionDirection = 'in' | 'out';
export type TransactionStatus = 'posted' | 'pending' | 'reconciled';
export type GoalType = 'general' | 'emergency' | 'taxShield' | 'project' | 'pensionLinked';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type EventSeverity = 'low' | 'medium' | 'high';
export type TransferStatus = 'pending' | 'completed' | 'failed';
export type BillCategory = 'electricity' | 'water' | 'data' | 'airtime' | 'cable' | 'schoolFees';
export type BillPaymentStatus = 'paid' | 'scheduled' | 'failed';
export type BusinessStage = 'idea' | 'startup' | 'growth' | 'mature' | 'scaling';
export type PensionFrequency = 'daily' | 'weekly' | 'monthly';
export type PensionPot = 'short' | 'long';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution?: string;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: TransactionDirection;
  category: string;
  merchantName?: string;
  date: string;
  isExpense: boolean;
  isRecurring: boolean;
  status: TransactionStatus;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  sourceAccountId?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  completed: boolean;
  contributions: GoalContribution[];
}

export interface PensionPlan {
  id: string;
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
  updatedAt?: string;
}

export interface PensionContribution {
  id: string;
  planId: string;
  pot: PensionPot;
  amount: number;
  date: string;
  sourceAccountId?: string;
}

export interface PensionProjection {
  shortPotProjected: number;
  longPotProjected: number;
  totalProjected: number;
  yearsToRetirement: number;
}

export interface SecurityDevice {
  id: string;
  name: string;
  lastSeen: string;
  trusted: boolean;
}

export interface SecurityEvent {
  id: string;
  title: string;
  severity: EventSeverity;
  date: string;
  resolved: boolean;
  description?: string;
}

export interface SecurityOverview {
  score: number;
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface Vendor {
  id: string;
  name: string;
  totalSpend: number;
  reliabilityScore: number;
}

export interface Payee {
  id: string;
  name: string;
  destination?: string;
}

export interface Transfer {
  id: string;
  sourceAccountId: string;
  payeeName: string;
  destination: string;
  amount: number;
  fee: number;
  total: number;
  status: TransferStatus;
  createdAt: string;
  externalRef: string;
  idempotencyKey: string;
}

export interface BillPayment {
  id: string;
  category: BillCategory;
  billerName: string;
  amount: number;
  status: BillPaymentStatus;
  date: string;
  customerRef?: string;
  scheduledFor?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: AccountType;
  blurb?: string;
}

export type RiskTolerance = 'low' | 'moderate' | 'high';

export interface UserPreferences {
  financialGoals: string[];
  riskTolerance: RiskTolerance;
  moneyFears?: string[];
  onboardingCompleted: boolean;
}

export interface Session {
  accessToken: string;
  user: UserProfile;
}

export const ROLE_LABELS: Record<PrimaryRole, string> = {
  individual: 'Individual',
  freelancer: 'Freelancer',
  entrepreneur: 'Entrepreneur',
  sme: 'SME Owner',
};

export const ROLE_DESCRIPTIONS: Record<PrimaryRole, string> = {
  individual: 'Personal wealth & savings',
  freelancer: 'Invoices, tax & irregular income',
  entrepreneur: 'Personal + business in one view',
  sme: 'Cash flow, vendors & runway',
};

// ---- Notifications ----------------------------------------------------------

export type NotificationType = 'transfer' | 'bill' | 'security' | 'goal' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  link?: string;
  readAt?: string;
  createdAt: string;
}