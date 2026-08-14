export type PrimaryRole = 'individual' | 'freelancer' | 'entrepreneur' | 'sme';

export type SecondaryRole = PrimaryRole;

export type RoleScheme = 'standard' | 'female_founder';

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