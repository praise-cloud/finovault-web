'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Icon, SectionHeader } from '@/components/ui';
import { GreetingHeader } from './GreetingHeader';
import {
  HeroBalance,
  cardClass,
  QuickActionRow,
  BusinessMetricsCard,
  InsightCard,
  GoalsProgressList,
  CoachCtaCard,
} from './components';
import { formatMoney } from '@/lib/utils';
import { GrantOpportunities } from '@/features/grants/GrantOpportunities';
import type { Account, SavingsGoal, Invoice, Budget, Vendor, BillPayment } from '@/types';
import type { MoneySummary } from '@/lib/hooks/use-money';

interface Props {
  name: string;
  femaleFounder: boolean;
  summary: MoneySummary;
  accounts: Account[];
  goals: SavingsGoal[];
  invoices: Invoice[];
  budgets: Budget[];
  vendors: Vendor[];
  bills: BillPayment[];
  currency: string;
}

export function EntrepreneurHome({ name, femaleFounder, summary, goals, currency }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const pensionGoal = goals.find((g) => g.type === 'pensionLinked');
  const multiple = summary.monthIncome > 0 ? (summary.monthExpense / summary.monthIncome).toFixed(1) : '—';

  return (
    <div data-role="entrepreneur">
      <GreetingHeader name={name} />

      <HeroBalance
        label={t('home.metrics.combinedWealth')}
        amount={summary.totalBalance}
        currency={currency}
        sub={t('home.sub.metricLine', {
          metric: t('home.metrics.revenueMrr'),
          amount: formatMoney(summary.monthIncome, currency),
        })}
      />

      <QuickActionRow
        actions={[
          { icon: 'trending-up', label: t('home.actions.cashFlow'), onPress: () => router.push('/insights') },
          { icon: 'briefcase', label: t('home.actions.grants'), onPress: () => router.push('/insights') },
          { icon: 'send', label: t('home.actions.transfer'), onPress: () => router.push('/pay') },
          { icon: 'cpu', label: t('home.actions.coach'), onPress: () => router.push('/coach') },
        ]}
      />

      <BusinessMetricsCard summary={summary} currency={currency} />

      {pensionGoal ? (
        <div className="mb-4">
          <SectionHeader title={t('home.pensionTitle')} />
          <div className={`${cardClass} flex items-center gap-3 p-3`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--fv-radius-control)] border-2 border-[var(--fv-border-ink)] bg-[var(--fv-surface)]">
              <Icon name="lock" size={20} color="var(--fv-role-accent)" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[var(--fv-text)]">{pensionGoal.name}</p>
              <p className="text-[12px] text-[var(--fv-text-secondary)]">
                {formatMoney(pensionGoal.currentAmount, currency)} / {formatMoney(pensionGoal.targetAmount, currency)}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {femaleFounder ? (
        <div className="mb-4">
          <GrantOpportunities />
        </div>
      ) : null}

      <InsightCard
        title={t('coach.entrepreneurBurn', {
          burn: formatMoney(summary.monthExpense, currency),
          multiple,
        })}
        bullets={[t('coach.promptGrow')]}
      />

      <GoalsProgressList goals={goals} currency={currency} />

      <CoachCtaCard />
    </div>
  );
}