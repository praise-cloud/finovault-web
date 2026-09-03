import React from 'react';
import type { PrimaryRole, Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import { IndividualHome } from './IndividualHome';
import { FreelancerHome } from './FreelancerHome';
import { EntrepreneurHome } from './EntrepreneurHome';
import { SMEHome } from './SMEHome';
import type { MoneySummary } from '@/lib/hooks/use-money';

export interface RoleHomeProps {
  name: string;
  primaryRole: PrimaryRole;
  femaleFounder?: boolean;
  summary: MoneySummary;
  accounts: Account[];
  goals: SavingsGoal[];
  invoices: Invoice[];
  budgets: Budget[];
  vendors: Vendor[];
  bills: BillPayment[];
  currency: string;
}

/**
 * Role-aware Home dispatcher (docs 02 §5, 11 §3). Never shows a generic
 * dashboard — each persona renders its own shell with its own metrics.
 */
export function RoleHome({
  name,
  primaryRole,
  femaleFounder = false,
  summary,
  accounts,
  goals,
  invoices,
  budgets,
  vendors,
  bills,
  currency,
}: RoleHomeProps) {
  const props = { name, summary, accounts, goals, invoices, budgets, vendors, bills, currency };
  switch (primaryRole) {
    case 'freelancer':
      return <FreelancerHome {...props} />;
    case 'entrepreneur':
      return <EntrepreneurHome {...props} femaleFounder={femaleFounder} />;
    case 'sme':
      return <SMEHome {...props} />;
    case 'individual':
    default:
      return <IndividualHome {...props} />;
  }
}