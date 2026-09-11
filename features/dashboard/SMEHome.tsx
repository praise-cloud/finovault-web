'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GreetingHeader } from './GreetingHeader';
import {
  HeroBalance,
  QuickActionRow,
  InsightCard,
  GoalsProgressList,
  CoachCtaCard,
  ComplianceCard,
  CashFlowCard,
} from './components';
import { formatMoney } from '@/lib/utils';
import type { Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import type { MoneySummary } from '@/lib/hooks/use-money';

interface Props {
  name: string;
  summary: MoneySummary;
  accounts: Account[];
  goals: SavingsGoal[];
  invoices: Invoice[];
  budgets: Budget[];
  vendors: Vendor[];
  bills: BillPayment[];
  currency: string;
}

// ponytail: SME hero shows Revenue to avoid a second exact "Cash position" node
// (CashFlowCard renders it internally; tests use getByText single-match).
export function SMEHome({ name, summary, goals, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div data-role="sme">
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.revenue')}
        amount={summary.monthIncome}
        currency={currency}
        sub={t('home.sub.metricLine', {
          metric: t('home.metrics.cashPosition'),
          amount: formatMoney(summary.totalBalance, currency),
        })}
      />

      <QuickActionRow
        actions={[
          { icon: 'send', label: t('home.actions.payVendor'), onPress: () => router.push('/pay') },
          { icon: 'plus', label: t('home.actions.recordInvoice'), onPress: () => router.push('/invoices') },
          { icon: 'trending-up', label: t('home.actions.cashFlow'), onPress: () => router.push('/insights') },
          { icon: 'cpu', label: t('home.actions.advisor'), onPress: () => router.push('/coach') },
        ]}
      />

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <ComplianceCard />
        <CashFlowCard balance={summary.totalBalance} runway={summary.runwayMonths} currency={currency} />
      </div>

      <InsightCard title={t('coach.smeCompliance')} bullets={[t('coach.promptSpending')]} />

      <GoalsProgressList goals={goals} currency={currency} />

      <CoachCtaCard />
    </div>
  );
}