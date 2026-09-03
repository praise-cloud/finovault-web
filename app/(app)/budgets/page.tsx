'use client';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader, Button, TextField, EmptyState } from '@/components/ui';
import { useBudgets, useTransactions, useCreateBudget } from '@/lib/hooks/use-money';
import { formatMoney } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

function startOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export default function BudgetsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: budgets = [] } = useBudgets();
  const { data: transactions = [] } = useTransactions(500);
  const createBudget = useCreateBudget();

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const monthStart = startOfMonth();

  const spendByCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((tx) => tx.direction === 'out' && tx.date >= monthStart)
      .forEach((tx) => map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount));
    return map;
  }, [transactions, monthStart]);

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + (spendByCategory.get(b.category) ?? 0), 0);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader
        title={t('tabs.budgets')}
        actionLabel={showForm ? t('common.cancel') : t('budgets.create')}
        onAction={() => setShowForm((v) => !v)}
      />

      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--fv-text-secondary)]">{t('budgets.monthlyTotal')}</p>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-[var(--fv-text)]">
            {formatMoney(totalBudget, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-[var(--fv-text-secondary)]">{t('budgets.spent')}</p>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-[var(--fv-error)]">
            {formatMoney(totalSpent, currency)}
          </p>
        </div>
      </GlassCard>

      {showForm ? (
        <GlassCard>
          <SectionHeader title={t('budgets.create')} />
          <div className="flex flex-col gap-3">
            <TextField
              label={t('budgets.category')}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Groceries"
            />
            <TextField label={t('budgets.amount')} value={amount} onChangeText={setAmount} type="text" placeholder="0.00" />
            <div className="flex gap-2">
              <Button
                label={t('budgets.create')}
                fullWidth
                disabled={!category || !amount || Number(amount) <= 0}
                loading={createBudget.isPending}
                onPress={() => {
                  createBudget.mutate(
                    { category, amount: Number(amount) },
                    {
                      onSuccess: () => {
                        setCategory('');
                        setAmount('');
                        setShowForm(false);
                      },
                    }
                  );
                }}
              />
              <Button label={t('common.cancel')} variant="secondary" onPress={() => setShowForm(false)} />
            </div>
          </div>
        </GlassCard>
      ) : null}

      {budgets.length === 0 ? (
        <EmptyState title={t('budgets.emptyTitle')} body={t('budgets.emptyBody')} ctaLabel={t('budgets.create')} onCta={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-2">
          {budgets.map((b) => {
            const spent = spendByCategory.get(b.category) ?? 0;
            const pct = b.amount > 0 ? Math.min(100, (spent / b.amount) * 100) : 0;
            const over = spent > b.amount;
            return (
              <GlassCard key={b.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[var(--fv-text)]">{b.category}</span>
                  <span className="text-[13px] text-[var(--fv-text-secondary)]">
                    {formatMoney(spent, currency)} / {formatMoney(b.amount, currency)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--fv-border)]">
                  <div
                    className={`h-full rounded-full ${over ? 'bg-[var(--fv-error)]' : 'bg-[var(--fv-primary)]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-[12px] font-semibold ${over ? 'text-[var(--fv-error)]' : 'text-[var(--fv-text-secondary)]'}`}>
                  {over ? t('budgets.overBudget') : `${Math.round(pct)}%`}
                </span>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
