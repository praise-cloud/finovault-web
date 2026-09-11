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

export function FreelancerHome({ name, summary, goals, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div data-role="freelancer">
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.incomeThisMonth')}
        amount={summary.monthIncome}
        currency={currency}
        sub={t('home.sub.metricLine', {
          metric: t('home.metrics.unpaidInvoices'),
          amount: formatMoney(summary.unpaidInvoiceTotal, currency),
        })}
      />

      <QuickActionRow
        actions={[
          { icon: 'plus', label: t('home.actions.addInvoice'), onPress: () => router.push('/invoices') },
          { icon: 'umbrella', label: t('home.actions.setAsideTax'), onPress: () => router.push('/vault') },
          { icon: 'send', label: t('home.actions.transfer'), onPress: () => router.push('/pay') },
          { icon: 'cpu', label: t('home.actions.coach'), onPress: () => router.push('/coach') },
        ]}
      />

      <InsightCard
        title={t('coach.freelancerTax', {
          taxReserve: formatMoney(summary.taxEstimate, currency),
          income: formatMoney(summary.monthIncome, currency),
        })}
        bullets={[t('coach.promptSave')]}
      />

      <GoalsProgressList goals={goals} currency={currency} />

      <CoachCtaCard />
    </div>
  );
}