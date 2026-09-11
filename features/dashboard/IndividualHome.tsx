'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GreetingHeader } from './GreetingHeader';
import {
  HeroBalance,
  QuickActionRow,
  InsightCard,
  GoalsProgressList,
  RecentTransactionsMini,
  CoachCtaCard,
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

export function IndividualHome({ name, summary, goals, bills, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const recent = bills
    .map((b) => ({ id: b.id, title: b.billerName, amount: -b.amount, date: b.date }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  return (
    <div data-role="individual">
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.totalNetWorth')}
        amount={summary.totalBalance}
        currency={currency}
        sub={`${formatMoney(summary.monthExpense, currency)} ${t('home.sub.thisMonth')}`}
      />

      <QuickActionRow
        actions={[
          { icon: 'send', label: t('home.actions.send'), onPress: () => router.push('/pay') },
          { icon: 'plus-circle', label: t('home.actions.save'), onPress: () => router.push('/vault') },
          { icon: 'file-text', label: t('home.actions.payBill'), onPress: () => router.push('/pay') },
          { icon: 'cpu', label: t('home.actions.insights'), onPress: () => router.push('/insights') },
        ]}
      />

      <InsightCard
        title={t('coach.greeting', {
          name,
          balance: formatMoney(summary.totalBalance, currency),
          flow: summary.monthIncome >= summary.monthExpense ? t('coach.flowHealthy') : t('coach.flowTight'),
        })}
        bullets={[t('coach.promptSpending')]}
      />

      <GoalsProgressList goals={goals} currency={currency} />

      <RecentTransactionsMini items={recent} currency={currency} />

      <CoachCtaCard />
    </div>
  );
}