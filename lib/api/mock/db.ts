import type {
  UserPreferences,
  UserProfile,
  Account,
  Transaction,
  Budget,
  SavingsGoal,
  SecurityDevice,
  SecurityEvent,
  SecurityOverview,
  Invoice,
  Vendor,
  Transfer,
  BillPayment,
  Payee,
  PensionPlan,
  PensionContribution,
  AccountType,
  TransactionDirection,
} from '@/types';
import { loadMockDbSnapshot, persistMockDb, MockDbSnapshot } from './persistence';

/**
 * Mock in-memory persistence for the web companion app.
 * Mirrors finovault-mobile/lib/api/mock/db.ts and docs/17-DATA-MODEL.md.
 * NOT for production — replaced by the real backend (Supabase) in later phases.
 */

export interface MockUser {
  profile: UserProfile;
  password: string;
  prefs: UserPreferences;
}

const users = new Map<string, MockUser>(); // key: email
const sessions = new Map<string, string>(); // token -> user id

const accounts = new Map<string, Account[]>();
const transactions = new Map<string, Transaction[]>();
const budgets = new Map<string, Budget[]>();
const goals = new Map<string, SavingsGoal[]>();
const devices = new Map<string, SecurityDevice[]>();
const securityEvents = new Map<string, SecurityEvent[]>();
const securityOverviews = new Map<string, SecurityOverview>();
const invoices = new Map<string, Invoice[]>();
const vendors = new Map<string, Vendor[]>();
const transfers = new Map<string, Transfer[]>();
const billPayments = new Map<string, BillPayment[]>();
const payees = new Map<string, Payee[]>();
const pensions = new Map<string, PensionPlan>();
const pensionContributions = new Map<string, PensionContribution[]>();

const passwordResetTokens = new Map<string, string>(); // token -> email
const passwordResetIssuedAt = new Map<string, string>(); // token -> ISO

let lastResetToken: string | null = null;

let idCounter = 1;

function snapshot(): MockDbSnapshot {
  return {
    users: Array.from(users.values()),
    sessions: Array.from(sessions.entries()),
    idCounter,
    accounts: mapToObject(accounts),
    transactions: mapToObject(transactions),
    budgets: mapToObject(budgets),
    goals: mapToObject(goals),
    devices: mapToObject(devices),
    securityEvents: mapToObject(securityEvents),
    securityOverviews: mapToObject(securityOverviews),
    invoices: mapToObject(invoices),
    vendors: mapToObject(vendors),
    transfers: mapToObject(transfers),
    billPayments: mapToObject(billPayments),
    payees: mapToObject(payees),
    pensions: mapToObject(pensions),
    pensionContributions: mapToObject(pensionContributions),
  };
}

function mapToObject<T>(map: Map<string, T>): Record<string, T> {
  return Object.fromEntries(map.entries());
}

function objToMap<T>(obj: Record<string, T> | undefined): Map<string, T> {
  return new Map(Object.entries(obj ?? {}));
}

/** Restore the persisted database (called once before any request). */
export async function hydrateMockDb(): Promise<void> {
  const persisted = await loadMockDbSnapshot();
  if (!persisted) return;
  users.clear();
  sessions.clear();
  for (const user of persisted.users) users.set(user.profile.email, user);
  for (const [token, userId] of persisted.sessions) sessions.set(token, userId);
  idCounter = persisted.idCounter || 1;

  accounts.clear();
  transactions.clear();
  budgets.clear();
  goals.clear();
  devices.clear();
  securityEvents.clear();
  securityOverviews.clear();
  invoices.clear();
  vendors.clear();
  transfers.clear();
  billPayments.clear();
  payees.clear();
  pensions.clear();
  pensionContributions.clear();
  for (const [k, v] of objToMap(persisted.accounts)) accounts.set(k, v as Account[]);
  for (const [k, v] of objToMap(persisted.transactions)) transactions.set(k, v as Transaction[]);
  for (const [k, v] of objToMap(persisted.budgets)) budgets.set(k, v as Budget[]);
  for (const [k, v] of objToMap(persisted.goals)) goals.set(k, v as SavingsGoal[]);
  for (const [k, v] of objToMap(persisted.devices)) devices.set(k, v as SecurityDevice[]);
  for (const [k, v] of objToMap(persisted.securityEvents)) securityEvents.set(k, v as SecurityEvent[]);
  for (const [k, v] of objToMap(persisted.securityOverviews)) securityOverviews.set(k, v as SecurityOverview);
  for (const [k, v] of objToMap(persisted.invoices)) invoices.set(k, v as Invoice[]);
  for (const [k, v] of objToMap(persisted.vendors)) vendors.set(k, v as Vendor[]);
  for (const [k, v] of objToMap(persisted.transfers)) transfers.set(k, v as Transfer[]);
  for (const [k, v] of objToMap(persisted.billPayments)) billPayments.set(k, v as BillPayment[]);
  for (const [k, v] of objToMap(persisted.payees)) payees.set(k, v as Payee[]);
  for (const [k, v] of objToMap(persisted.pensions)) pensions.set(k, v as PensionPlan);
  for (const [k, v] of objToMap(persisted.pensionContributions))
    pensionContributions.set(k, v as PensionContribution[]);
}

function save(): void {
  persistMockDb(snapshot());
}

/** Unique id generator with a readable prefix. */
export function nextId(prefix: string): string {
  return `${prefix}_${idCounter++}`;
}

export function nextUserId(): string {
  return nextId('usr');
}

export function findUserByEmail(email: string): MockUser | undefined {
  return users.get(email.toLowerCase().trim());
}

export function findUserById(id: string): MockUser | undefined {
  for (const user of users.values()) {
    if (user.profile.id === id) return user;
  }
  return undefined;
}

export function createUser(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  id?: string;
}): MockUser {
  const id = params.id ?? nextUserId();
  const user: MockUser = {
    profile: {
      id,
      email: params.email.toLowerCase().trim(),
      fullName: params.fullName.trim(),
      preferredLanguage: 'en',
      preferredCurrency: 'MUR',
      primaryRole: 'individual',
      secondaryRoles: [],
      scheme: 'standard',
      createdAt: new Date().toISOString(),
    },
    password: params.password,
    prefs: {
      financialGoals: [],
      riskTolerance: 'moderate',
      onboardingCompleted: false,
    },
  };
  users.set(user.profile.email, user);
  save();
  return user;
}

export function updateProfile(id: string, patch: Partial<UserProfile>): UserProfile {
  const user = findUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  user.profile = { ...user.profile, ...patch };
  save();
  return user.profile;
}

export function updatePrefs(id: string, patch: Partial<UserPreferences>): UserPreferences {
  const user = findUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  user.prefs = { ...user.prefs, ...patch };
  save();
  return user.prefs;
}

export function createSession(userId: string): string {
  const token = `mock_jwt_${userId}_${Date.now()}`;
  sessions.set(token, userId);
  save();
  return token;
}

export function getUserByToken(token: string): MockUser | undefined {
  const userId = sessions.get(token);
  return userId ? findUserById(userId) : undefined;
}

export function revokeSession(token: string): void {
  sessions.delete(token);
  save();
}

// ---- money data accessors ---------------------------------------------------

export function accountsFor(userId: string): Account[] {
  return accounts.get(userId) ?? [];
}
export function transactionsFor(userId: string): Transaction[] {
  return transactions.get(userId) ?? [];
}
export function budgetsFor(userId: string): Budget[] {
  return budgets.get(userId) ?? [];
}
export function goalsFor(userId: string): SavingsGoal[] {
  return goals.get(userId) ?? [];
}
export function devicesFor(userId: string): SecurityDevice[] {
  return devices.get(userId) ?? [];
}
export function securityEventsFor(userId: string): SecurityEvent[] {
  return securityEvents.get(userId) ?? [];
}
export function securityOverviewsFor(userId: string): SecurityOverview | undefined {
  return securityOverviews.get(userId);
}
export function invoicesFor(userId: string): Invoice[] {
  return invoices.get(userId) ?? [];
}
export function vendorsFor(userId: string): Vendor[] {
  return vendors.get(userId) ?? [];
}
export function transfersFor(userId: string): Transfer[] {
  return transfers.get(userId) ?? [];
}
export function billPaymentsFor(userId: string): BillPayment[] {
  return billPayments.get(userId) ?? [];
}
export function payeesFor(userId: string): Payee[] {
  return payees.get(userId) ?? [];
}
export function pensionFor(userId: string): PensionPlan | undefined {
  return pensions.get(userId);
}
export function pensionContributionsFor(userId: string): PensionContribution[] {
  return pensionContributions.get(userId) ?? [];
}

export function setAccounts(userId: string, list: Account[]): void {
  accounts.set(userId, list);
  save();
}
export function setTransactions(userId: string, list: Transaction[]): void {
  transactions.set(userId, list);
  save();
}
export function setBudgets(userId: string, list: Budget[]): void {
  budgets.set(userId, list);
  save();
}
export function setGoals(userId: string, list: SavingsGoal[]): void {
  goals.set(userId, list);
  save();
}
export function setInvoices(userId: string, list: Invoice[]): void {
  invoices.set(userId, list);
  save();
}
export function setVendors(userId: string, list: Vendor[]): void {
  vendors.set(userId, list);
  save();
}
export function setTransfers(userId: string, list: Transfer[]): void {
  transfers.set(userId, list);
  save();
}
export function setBillPayments(userId: string, list: BillPayment[]): void {
  billPayments.set(userId, list);
  save();
}
export function setPayees(userId: string, list: Payee[]): void {
  payees.set(userId, list);
  save();
}
export function setSecurityOverview(userId: string, overview: SecurityOverview): void {
  securityOverviews.set(userId, overview);
  save();
}
export function setDevices(userId: string, list: SecurityDevice[]): void {
  devices.set(userId, list);
  save();
}
export function setSecurityEvents(userId: string, list: SecurityEvent[]): void {
  securityEvents.set(userId, list);
  save();
}
export function setPension(userId: string, plan: PensionPlan): void {
  pensions.set(userId, plan);
  save();
}
export function setPensionContributions(userId: string, list: PensionContribution[]): void {
  pensionContributions.set(userId, list);
  save();
}

function push<T>(map: Map<string, T[]>, userId: string, value: T): void {
  const list = map.get(userId) ?? [];
  list.push(value);
  map.set(userId, list);
  save();
}

export function addAccount(userId: string, account: Account): void {
  push(accounts, userId, account);
}
export function addTransaction(userId: string, tx: Transaction): void {
  push(transactions, userId, tx);
}
export function addGoal(userId: string, goal: SavingsGoal): void {
  push(goals, userId, goal);
}
export function addInvoice(userId: string, invoice: Invoice): void {
  push(invoices, userId, invoice);
}
export function addVendor(userId: string, vendor: Vendor): void {
  push(vendors, userId, vendor);
}
export function addTransfer(userId: string, transfer: Transfer): void {
  push(transfers, userId, transfer);
}
export function addBillPayment(userId: string, payment: BillPayment): void {
  push(billPayments, userId, payment);
}
export function addPayee(userId: string, payee: Payee): void {
  push(payees, userId, payee);
}
export function addPensionContribution(userId: string, contribution: PensionContribution): void {
  push(pensionContributions, userId, contribution);
}

// ---- password reset (mock) --------------------------------------------------

export function getLastResetToken(): string | null {
  return lastResetToken;
}

export function getPasswordResetTokenEmail(token: string): string | undefined {
  return passwordResetTokens.get(token);
}

/** Internal accessors used only in tests / reset flow. */
export function issuePasswordReset(email: string): string {
  const token = `reset_${Date.now()}_${nextId('rst')}`;
  passwordResetTokens.set(token, email);
  passwordResetIssuedAt.set(token, new Date().toISOString());
  lastResetToken = token;
  save();
  return token;
}

export function consumePasswordReset(token: string): string | null {
  const email = passwordResetTokens.get(token);
  if (email === undefined) return null;
  const issued = passwordResetIssuedAt.get(token);
  const issuedAt = issued ? new Date(issued).getTime() : 0;
  if (Date.now() - issuedAt > 30 * 60 * 1000) {
    passwordResetTokens.delete(token);
    passwordResetIssuedAt.delete(token);
    save();
    return null;
  }
  passwordResetTokens.delete(token);
  passwordResetIssuedAt.delete(token);
  save();
  return email;
}

export function invalidateSessionsForEmail(email: string): void {
  const matching = new Set<string>();
  for (const [token, userId] of sessions) {
    if (findUserById(userId)?.profile.email === email) matching.add(token);
  }
  for (const token of matching) sessions.delete(token);
  save();
}

export function setPassword(email: string, password: string): void {
  const user = findUserByEmail(email);
  if (user) user.password = password;
}

// ---- seeding ---------------------------------------------------------------

const DEMO_ACCOUNTS: Array<{
  email: string;
  password: string;
  role: UserProfile['primaryRole'];
  scheme: UserProfile['scheme'];
}> = [
  { email: 'freelancer@finovault.app', password: 'Vault123!', role: 'freelancer', scheme: 'standard' },
  { email: 'entrepreneur@finovault.app', password: 'Vault123!', role: 'entrepreneur', scheme: 'female_founder' },
  { email: 'sme@finovault.app', password: 'Vault123!', role: 'sme', scheme: 'standard' },
  { email: 'demo@finovault.app', password: 'Vault123!', role: 'entrepreneur', scheme: 'female_founder' },
  { email: 'individual@finovault.app', password: 'Vault123!', role: 'individual', scheme: 'standard' },
];

/** Seed a demo account for convenience during Phase 0 development. */
export function seedDemoUser(): void {
  seedEntrepreneurData(nextUserId(), 'demo@finovault.app', 'Amina Diallo');
}

/** Idempotently ensure every demo account exists. */
export function ensureRoleAccounts(): void {
  let changed = false;
  for (const acc of DEMO_ACCOUNTS) {
    if (!findUserByEmail(acc.email)) {
      seedFromDemoAccount(acc);
      changed = true;
    }
  }
  if (changed) save();
}

function seedFromDemoAccount(acc: (typeof DEMO_ACCOUNTS)[number]): void {
  const uid = nextUserId();
  const name = nameForRole(acc.role);
  switch (acc.role) {
    case 'freelancer':
      seedFreelancerData(uid, acc.email, name);
      break;
    case 'sme':
      seedSmeData(uid, acc.email, name);
      break;
    case 'entrepreneur':
      seedEntrepreneurData(uid, acc.email, name);
      break;
    case 'individual':
      seedIndividualData(uid, acc.email, name);
      break;
  }
}

function nameForRole(role: UserProfile['primaryRole']): string {
  switch (role) {
    case 'freelancer':
      return 'Liam Fontaine';
    case 'sme':
      return 'Island Bliss Ltd';
    case 'entrepreneur':
      return 'Yannick Pierre';
    default:
      return 'Finovault Demo';
  }
}

// Helpers to build seed data (ignore unused-param lint by design).

function daysFromNow(daysAgo: number): Date {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}
function daysFromNowAdd(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function isoDaysAgo(daysAgo: number): string {
  return daysFromNow(daysAgo).toISOString();
}
function isoDaysAhead(days: number): string {
  return daysFromNowAdd(days).toISOString();
}

interface SeedAccountSpec {
  name: string;
  type: AccountType;
  institution?: string;
  balance: number;
}

interface SeedTxSpec {
  accountIndex: number;
  daysAgo: number;
  amount: number;
  direction: TransactionDirection;
  category: string;
  merchantName?: string;
}

function makeAccounts(userId: string, specs: SeedAccountSpec[]): Account[] {
  return specs.map((s) => ({
    id: nextId('acc'),
    name: s.name,
    type: s.type,
    balance: s.balance,
    currency: 'MUR',
    institution: s.institution,
    isActive: true,
  }));
}

function makeTransactions(userId: string, accountsArr: Account[], specs: SeedTxSpec[]): Transaction[] {
  return specs.map((s) => ({
    id: nextId('tx'),
    accountId: accountsArr[s.accountIndex].id,
    amount: s.amount,
    currency: 'MUR',
    direction: s.direction,
    category: s.category,
    merchantName: s.merchantName,
    date: isoDaysAgo(s.daysAgo),
    isExpense: s.direction === 'out',
    isRecurring: false,
    status: 'posted',
  }));
}

function seedEntrepreneurData(uid: string, email: string, fullName: string): MockUser {
  const user = createUser({ email, password: 'Vault123!', fullName, id: uid });
  updateProfile(uid, { primaryRole: 'entrepreneur', scheme: 'female_founder' });
  updatePrefs(uid, {
    financialGoals: ['retirement', 'business'],
    riskTolerance: 'high',
    onboardingCompleted: true,
  });

  const accs = makeAccounts(uid, [
    { name: 'MCB Bank', type: 'bank', institution: 'MCB', balance: 42500 },
    { name: 'MyT Money', type: 'mobileMoney', institution: 'MyT', balance: 8750 },
  ]);
  setAccounts(uid, accs);
  setTransactions(
    uid,
    makeTransactions(uid, accs, [
      { accountIndex: 0, daysAgo: 26, amount: 32000, direction: 'in', category: 'Salary', merchantName: 'Retail Consulting Ltd' },
      { accountIndex: 0, daysAgo: 24, amount: 15000, direction: 'out', category: 'Rent', merchantName: 'Skyline Properties' },
      { accountIndex: 1, daysAgo: 18, amount: 8500, direction: 'in', category: 'Invoice', merchantName: 'Nova Studio' },
      { accountIndex: 1, daysAgo: 9, amount: 3200, direction: 'out', category: 'Groceries', merchantName: 'Winners Supermarket' },
      { accountIndex: 1, daysAgo: 5, amount: 1800, direction: 'out', category: 'Transport', merchantName: 'Fuel Station' },
      { accountIndex: 0, daysAgo: 2, amount: 2400, direction: 'out', category: 'Utilities', merchantName: 'CEB' },
    ])
  );
  setBudgets(uid, [
    { id: nextId('bud'), category: 'Groceries', amount: 6000, period: 'monthly' },
    { id: nextId('bud'), category: 'Transport', amount: 2500, period: 'monthly' },
    { id: nextId('bud'), category: 'Dining', amount: 3000, period: 'monthly' },
  ]);

  const emergencyId = nextId('goal');
  setGoals(uid, [
    {
      id: emergencyId,
      name: 'Emergency Fund',
      type: 'emergency',
      targetAmount: 50000,
      currentAmount: 12000,
      completed: false,
      contributions: [
        {
          id: nextId('con'),
          goalId: emergencyId,
          amount: 12000,
          date: isoDaysAgo(15),
          sourceAccountId: accs[0].id,
        },
      ],
    },
    {
      id: nextId('goal'),
      name: 'Retirement Pension',
      type: 'pensionLinked',
      targetAmount: 250000,
      currentAmount: 18500,
      targetDate: isoDaysAhead(365 * 10),
      completed: false,
      contributions: [],
    },
  ]);
  setDevices(uid, [
    { id: nextId('dev'), name: 'Pixel 8 · Port Louis', lastSeen: isoDaysAgo(0), trusted: true },
    { id: nextId('dev'), name: 'Windows PC · Home office', lastSeen: isoDaysAgo(2), trusted: false },
  ]);
  setSecurityEvents(uid, [
    {
      id: nextId('evt'),
      title: 'New device sign-in',
      description: 'A sign-in from Windows PC · Home office was recorded.',
      severity: 'medium',
      date: isoDaysAgo(2),
      resolved: false,
    },
    {
      id: nextId('evt'),
      title: 'Password changed',
      severity: 'low',
      date: isoDaysAgo(40),
      resolved: true,
    },
  ]);
  setSecurityOverview(uid, { score: 72, twoFactorEnabled: false });
  setPension(uid, {
    id: `pen_${uid}`,
    shortPotTarget: 50000,
    longPotTarget: 750000,
    frequency: 'monthly',
    contributionAmount: 2500,
    currentShortPot: 18500,
    currentLongPot: 42000,
    assumedReturnPct: 7,
    inflationPct: 4,
    currentAge: 34,
    retirementAge: 65,
    autoDebit: true,
  });
  setInvoices(uid, [
    { id: nextId('inv'), clientName: 'Bell Attractions', amount: 12000, currency: 'MUR', dueDate: isoDaysAhead(10), status: 'sent' },
    { id: nextId('inv'), clientName: 'Nova Studio', amount: 8500, currency: 'MUR', dueDate: isoDaysAgo(18), status: 'paid' },
    { id: nextId('inv'), clientName: 'Kite Media', amount: 4500, currency: 'MUR', dueDate: isoDaysAgo(6), status: 'overdue' },
  ]);
  setVendors(uid, [
    { id: nextId('ven'), name: 'Print Hub Ltd', totalSpend: 12400, reliabilityScore: 92 },
    { id: nextId('ven'), name: 'CloudHost', totalSpend: 3600, reliabilityScore: 78 },
  ]);
  setPayees(uid, [
    { id: nextId('pay'), name: 'Jean-Paul R.', destination: '+230 5124 8890' },
    { id: nextId('pay'), name: 'CEB Bill', destination: 'ACC-2291' },
  ]);
  setBillPayments(uid, [
    {
      id: nextId('bill'),
      category: 'electricity',
      billerName: 'CEB',
      amount: 1450,
      status: 'paid',
      date: isoDaysAgo(12),
      customerRef: 'ACC-2291',
    },
  ]);
  return user;
}

function seedFreelancerData(uid: string, email: string, fullName: string): MockUser {
  const user = createUser({ email, password: 'Vault123!', fullName, id: uid });
  updateProfile(uid, { primaryRole: 'freelancer', scheme: 'standard' });
  updatePrefs(uid, {
    financialGoals: ['tax', 'equipment'],
    riskTolerance: 'moderate',
    onboardingCompleted: true,
  });

  const accs = makeAccounts(uid, [
    { name: 'MCB Bank', type: 'bank', institution: 'MCB', balance: 31200 },
    { name: 'MyT Money', type: 'mobileMoney', institution: 'MyT', balance: 5400 },
  ]);
  setAccounts(uid, accs);
  setTransactions(
    uid,
    makeTransactions(uid, accs, [
      { accountIndex: 0, daysAgo: 20, amount: 28000, direction: 'in', category: 'Client Payment', merchantName: 'Studio Lume' },
      { accountIndex: 0, daysAgo: 18, amount: 6500, direction: 'out', category: 'Rent', merchantName: 'Skyline Properties' },
      { accountIndex: 1, daysAgo: 12, amount: 9000, direction: 'in', category: 'Invoice', merchantName: 'Kite Media' },
      { accountIndex: 1, daysAgo: 9, amount: 2200, direction: 'out', category: 'Software', merchantName: 'Adobe CC' },
      { accountIndex: 1, daysAgo: 5, amount: 1400, direction: 'out', category: 'Groceries', merchantName: 'Winners Supermarket' },
      { accountIndex: 1, daysAgo: 3, amount: 800, direction: 'out', category: 'Transport', merchantName: 'Fuel Station' },
      { accountIndex: 0, daysAgo: 2, amount: 500, direction: 'out', category: 'Utilities', merchantName: 'CEB' },
    ])
  );
  setBudgets(uid, [
    { id: nextId('bud'), category: 'Groceries', amount: 6000, period: 'monthly' },
    { id: nextId('bud'), category: 'Software', amount: 3000, period: 'monthly' },
    { id: nextId('bud'), category: 'Transport', amount: 2500, period: 'monthly' },
  ]);
  const taxId = nextId('goal');
  setGoals(uid, [
    {
      id: taxId,
      name: 'Tax Set-Aside',
      type: 'taxShield',
      targetAmount: 60000,
      currentAmount: 22000,
      completed: false,
      contributions: [
        {
          id: nextId('con'),
          goalId: taxId,
          amount: 22000,
          date: isoDaysAgo(10),
          sourceAccountId: accs[0].id,
        },
      ],
    },
    {
      id: nextId('goal'),
      name: 'New Laptop Fund',
      type: 'project',
      targetAmount: 120000,
      currentAmount: 45000,
      completed: false,
      contributions: [],
    },
  ]);
  setInvoices(uid, [
    { id: nextId('inv'), clientName: 'Belle Agency', amount: 9000, currency: 'MUR', dueDate: isoDaysAhead(12), status: 'sent' },
    { id: nextId('inv'), clientName: 'Kite Media', amount: 6000, currency: 'MUR', dueDate: isoDaysAgo(6), status: 'overdue' },
    { id: nextId('inv'), clientName: 'Nova Studio', amount: 12000, currency: 'MUR', dueDate: isoDaysAgo(18), status: 'paid' },
  ]);
  setDevices(uid, [
    { id: nextId('dev'), name: 'iPhone 15 · Port Louis', lastSeen: isoDaysAgo(0), trusted: true },
    { id: nextId('dev'), name: 'MacBook Air · Co-working', lastSeen: isoDaysAgo(3), trusted: false },
  ]);
  setSecurityEvents(uid, [
    {
      id: nextId('evt'),
      title: 'New device sign-in',
      description: 'A sign-in from MacBook Air · Co-working was recorded.',
      severity: 'low',
      date: isoDaysAgo(3),
      resolved: false,
    },
  ]);
  setSecurityOverview(uid, { score: 88, twoFactorEnabled: true });
  return user;
}

function seedSmeData(uid: string, email: string, fullName: string): MockUser {
  const user = createUser({ email, password: 'Vault123!', fullName, id: uid });
  updateProfile(uid, { primaryRole: 'sme', scheme: 'standard' });
  updatePrefs(uid, {
    financialGoals: ['payroll', 'growth'],
    riskTolerance: 'high',
    onboardingCompleted: true,
  });

  const accs = makeAccounts(uid, [
    { name: 'Business MCB', type: 'bank', institution: 'MCB', balance: 168000 },
    { name: 'Tropipay', type: 'mobileMoney', institution: 'Tropipay', balance: 23000 },
  ]);
  setAccounts(uid, accs);
  setTransactions(
    uid,
    makeTransactions(uid, accs, [
      { accountIndex: 0, daysAgo: 21, amount: 95000, direction: 'in', category: 'Client Payment', merchantName: 'Coastal Tours' },
      { accountIndex: 0, daysAgo: 19, amount: 42000, direction: 'out', category: 'Payroll', merchantName: 'Staff Payroll' },
      { accountIndex: 0, daysAgo: 14, amount: 30000, direction: 'in', category: 'Invoice', merchantName: 'Maple Co' },
      { accountIndex: 0, daysAgo: 12, amount: 12000, direction: 'out', category: 'Rent', merchantName: 'Skyline Properties' },
      { accountIndex: 1, daysAgo: 8, amount: 6500, direction: 'out', category: 'Utilities', merchantName: 'CEB' },
      { accountIndex: 1, daysAgo: 5, amount: 4000, direction: 'out', category: 'Marketing', merchantName: 'Kite Media' },
      { accountIndex: 0, daysAgo: 2, amount: 2500, direction: 'out', category: 'Supplies', merchantName: 'Office Mart' },
    ])
  );
  setBudgets(uid, [
    { id: nextId('bud'), category: 'Payroll', amount: 45000, period: 'monthly' },
    { id: nextId('bud'), category: 'Rent', amount: 15000, period: 'monthly' },
    { id: nextId('bud'), category: 'Marketing', amount: 8000, period: 'monthly' },
  ]);
  const expansionId = nextId('goal');
  setGoals(uid, [
    {
      id: expansionId,
      name: 'Expansion Fund',
      type: 'project',
      targetAmount: 500000,
      currentAmount: 180000,
      completed: false,
      contributions: [
        {
          id: nextId('con'),
          goalId: expansionId,
          amount: 180000,
          date: isoDaysAgo(20),
          sourceAccountId: accs[0].id,
        },
      ],
    },
    {
      id: nextId('goal'),
      name: 'Equipment Upgrade',
      type: 'project',
      targetAmount: 200000,
      currentAmount: 60000,
      completed: false,
      contributions: [],
    },
  ]);
  setInvoices(uid, [
    { id: nextId('inv'), clientName: 'Coastal Tours', amount: 45000, currency: 'MUR', dueDate: isoDaysAhead(9), status: 'sent' },
    { id: nextId('inv'), clientName: 'Maple Co', amount: 30000, currency: 'MUR', dueDate: isoDaysAgo(4), status: 'overdue' },
    { id: nextId('inv'), clientName: 'Bright Ltd', amount: 22000, currency: 'MUR', dueDate: isoDaysAgo(10), status: 'overdue' },
    { id: nextId('inv'), clientName: 'Sunrise Group', amount: 38000, currency: 'MUR', dueDate: isoDaysAgo(20), status: 'paid' },
  ]);
  setVendors(uid, [
    { id: nextId('ven'), name: 'Print Hub Ltd', totalSpend: 24000, reliabilityScore: 92 },
    { id: nextId('ven'), name: 'CloudHost', totalSpend: 9600, reliabilityScore: 80 },
    { id: nextId('ven'), name: 'Office Mart', totalSpend: 15000, reliabilityScore: 88 },
  ]);
  setPayees(uid, [{ id: nextId('pay'), name: 'CEB Bill', destination: 'ACC-2291' }]);
  setBillPayments(uid, [
    {
      id: nextId('bill'),
      category: 'electricity',
      billerName: 'CEB',
      amount: 6500,
      status: 'paid',
      date: isoDaysAgo(8),
      customerRef: 'ACC-2291',
    },
  ]);
  setDevices(uid, [
    { id: nextId('dev'), name: 'iPad · Front desk', lastSeen: isoDaysAgo(0), trusted: true },
    { id: nextId('dev'), name: 'Windows PC · Back office', lastSeen: isoDaysAgo(2), trusted: false },
  ]);
  setSecurityEvents(uid, [
    {
      id: nextId('evt'),
      title: 'New device sign-in',
      description: 'A sign-in from Windows PC · Back office was recorded.',
      severity: 'medium',
      date: isoDaysAgo(2),
      resolved: false,
    },
  ]);
  setSecurityOverview(uid, { score: 79, twoFactorEnabled: false });
  return user;
}

function seedIndividualData(uid: string, email: string, fullName: string): MockUser {
  const user = createUser({ email, password: 'Vault123!', fullName, id: uid });
  updateProfile(uid, { primaryRole: 'individual', scheme: 'standard' });
  updatePrefs(uid, {
    financialGoals: ['emergency', 'vacation'],
    riskTolerance: 'moderate',
    onboardingCompleted: true,
  });

  const accs = makeAccounts(uid, [
    { name: 'MCB Current', type: 'bank', institution: 'MCB', balance: 85000 },
    { name: 'MyT Growth', type: 'mobileMoney', institution: 'MyT', balance: 15000 },
  ]);
  setAccounts(uid, accs);
  setTransactions(
    uid,
    makeTransactions(uid, accs, [
      { accountIndex: 0, daysAgo: 5, amount: 2500000, direction: 'in', category: 'Salary', merchantName: 'Mon Trésor Ltd' },
      { accountIndex: 0, daysAgo: 5, amount: 850000, direction: 'out', category: 'Rent', merchantName: 'Skyline Properties' },
      { accountIndex: 1, daysAgo: 2, amount: 450000, direction: 'out', category: 'Groceries', merchantName: 'Winners Supermarket' },
    ])
  );
  setBudgets(uid, [
    { id: nextId('bud'), category: 'Groceries', amount: 400000, period: 'monthly' },
    { id: nextId('bud'), category: 'Transport', amount: 150000, period: 'monthly' },
    { id: nextId('bud'), category: 'Dining', amount: 200000, period: 'monthly' },
  ]);

  const rainyId = nextId('goal');
  const vacationId = nextId('goal');
  setGoals(uid, [
    {
      id: rainyId,
      name: 'Rainy Day Fund',
      type: 'emergency',
      targetAmount: 500000,
      currentAmount: 250000,
      completed: false,
      contributions: [
        {
          id: nextId('con'),
          goalId: rainyId,
          amount: 250000,
          date: isoDaysAgo(20),
          sourceAccountId: accs[0].id,
        },
      ],
    },
    {
      id: vacationId,
      name: 'Vacation Fund',
      type: 'general',
      targetAmount: 800000,
      currentAmount: 300000,
      completed: false,
      contributions: [
        {
          id: nextId('con'),
          goalId: vacationId,
          amount: 300000,
          date: isoDaysAgo(10),
          sourceAccountId: accs[1].id,
        },
      ],
    },
  ]);
  setInvoices(uid, []);
  setVendors(uid, []);
  setPayees(uid, []);
  setBillPayments(uid, []);
  setDevices(uid, [{ id: nextId('dev'), name: 'iPhone 15 · Port Louis', lastSeen: isoDaysAgo(0), trusted: true }]);
  setSecurityEvents(uid, []);
  setSecurityOverview(uid, { score: 64, twoFactorEnabled: false });
  return user;
}
