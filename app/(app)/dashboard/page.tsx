'use client';

import React from 'react';
import { RoleHome } from '@/features/dashboard/HomeDashboard';
import { useAuthStore } from '@/stores/auth-store';
import { useMoneySummary } from '@/lib/hooks/use-money';
import { useAccounts, useGoals, useInvoices, useBudgets, useVendors, useBillPayments } from '@/lib/hooks/use-money';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const summary = useMoneySummary();
  const { data: accounts = [] } = useAccounts();
  const { data: goals = [] } = useGoals();
  const { data: invoices = [] } = useInvoices();
  const { data: budgets = [] } = useBudgets();
  const { data: vendors = [] } = useVendors();
  const { data: bills = [] } = useBillPayments();

  if (!user) return null;

  return (
    <RoleHome
      name={user.fullName}
      primaryRole={user.primaryRole}
      femaleFounder={user.scheme === 'female_founder'}
      summary={summary}
      accounts={accounts}
      goals={goals}
      invoices={invoices}
      budgets={budgets}
      vendors={vendors}
      bills={bills}
      currency={user.preferredCurrency}
    />
  );
}
