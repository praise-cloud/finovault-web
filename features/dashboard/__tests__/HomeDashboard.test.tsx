import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoleHome } from '../HomeDashboard';
import type { Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import type { MoneySummary } from '@/lib/hooks/use-money';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ replace: vi.fn(), push: vi.fn() })),
}));

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const summary: MoneySummary = {
  totalBalance: 100000,
  monthIncome: 5000,
  monthExpense: 2500,
  savedInGoals: 10000,
  unpaidInvoiceTotal: 1500,
  unpaidInvoiceCount: 2,
  topExpenseCategory: 'Food',
  budgetLines: [],
  runwayMonths: 12,
  emergencyFundProgress: 0.5,
  taxEstimate: 900,
};

const accounts: Account[] = [];
const goals: SavingsGoal[] = [];
const invoices: Invoice[] = [];
const budgets: Budget[] = [];
const vendors: Vendor[] = [];
const bills: BillPayment[] = [];

describe('RoleHome dispatcher', () => {
  it('renders the individual home for the individual role', () => {
    renderWithQuery(
      <RoleHome
        name="Amina Diallo"
        primaryRole="individual"
        summary={summary}
        accounts={accounts}
        goals={goals}
        invoices={invoices}
        budgets={budgets}
        vendors={vendors}
        bills={bills}
        currency="MUR"
      />,
    );
    expect(screen.getByText(/Good morning|Good afternoon|Good evening/)).toBeInTheDocument();
  });

  it('renders the entrepreneur home with a female-founder grant card', () => {
    renderWithQuery(
      <RoleHome
        name="Amina Diallo"
        primaryRole="entrepreneur"
        femaleFounder
        summary={summary}
        accounts={accounts}
        goals={goals}
        invoices={invoices}
        budgets={budgets}
        vendors={vendors}
        bills={bills}
        currency="MUR"
      />,
    );
    expect(screen.getByText('Female Innovators Seed Fund')).toBeInTheDocument();
  });

  it('omits the grant card for a standard entrepreneur', () => {
    renderWithQuery(
      <RoleHome
        name="Kofi Mensah"
        primaryRole="entrepreneur"
        femaleFounder={false}
        summary={summary}
        accounts={accounts}
        goals={goals}
        invoices={invoices}
        budgets={budgets}
        vendors={vendors}
        bills={bills}
        currency="MUR"
      />,
    );
    expect(screen.queryByText('Female Innovators Seed Fund')).not.toBeInTheDocument();
  });

  it('renders the freelancer home for the freelancer role', () => {
    renderWithQuery(
      <RoleHome
        name="Yann Lebrun"
        primaryRole="freelancer"
        summary={summary}
        accounts={accounts}
        goals={goals}
        invoices={invoices}
        budgets={budgets}
        vendors={vendors}
        bills={bills}
        currency="MUR"
      />,
    );
    expect(screen.getByText('Income this month')).toBeInTheDocument();
  });

  it('renders the SME home for the sme role', () => {
    renderWithQuery(
      <RoleHome
        name="Fatou Sow"
        primaryRole="sme"
        summary={summary}
        accounts={accounts}
        goals={goals}
        invoices={invoices}
        budgets={budgets}
        vendors={vendors}
        bills={bills}
        currency="MUR"
      />,
    );
    expect(screen.getByText('Cash position')).toBeInTheDocument();
  });
});
