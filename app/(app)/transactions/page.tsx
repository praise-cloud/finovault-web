'use client';

import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader, EmptyState } from '@/components/ui';
import { useTransactions, useAccounts } from '@/lib/hooks/use-money';
import { formatMoney, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Transaction, TransactionDirection } from '@/types';

type DirectionFilter = 'all' | TransactionDirection;

export default function TransactionsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: transactions = [] } = useTransactions(500);
  const { data: accounts = [] } = useAccounts();

  const [direction, setDirection] = useState<DirectionFilter>('all');
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('');

  const accountName = (id: string) => accounts.find((a) => a.id === id)?.name ?? '—';

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((tx) => tx.category))).sort(),
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => (direction === 'all' ? true : tx.direction === direction))
      .filter((tx) => (accountId ? tx.accountId === accountId : true))
      .filter((tx) => (category ? tx.category === category : true))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, direction, accountId, category]);

  const totalIn = filtered.filter((tx) => tx.direction === 'in').reduce((s, tx) => s + tx.amount, 0);
  const totalOut = filtered.filter((tx) => tx.direction === 'out').reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader title={t('tabs.transactions')} />

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">{t('transactions.income')}</span>
          <span className="text-[15px] font-bold tabular-nums text-[var(--fv-success)]">
            {formatMoney(totalIn, currency)}
          </span>
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">{t('transactions.expense')}</span>
          <span className="text-[15px] font-bold tabular-nums text-[var(--fv-error)]">
            {formatMoney(totalOut, currency)}
          </span>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="flex flex-col gap-3">
        <div className="flex gap-2">
          {(['all', 'in', 'out'] as DirectionFilter[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={`flex-1 rounded-[10px] border px-3 py-2 text-[13px] font-semibold capitalize transition-colors ${
                direction === d
                  ? 'border-[var(--fv-primary)] bg-[var(--fv-surface)] text-[var(--fv-primary)]'
                  : 'border-[var(--fv-border)] text-[var(--fv-text-secondary)]'
              }`}
            >
              {d === 'all' ? t('transactions.all') : t(`transactions.${d}`)}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-3 py-2 text-[13px] text-[var(--fv-text)] "
            aria-label={t('transactions.account')}
          >
            <option value="">{t('transactions.allAccounts')}</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-[44px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-3 py-2 text-[13px] text-[var(--fv-text)] "
            aria-label={t('transactions.category')}
          >
            <option value="">{t('transactions.allCategories')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {filtered.length === 0 ? (
        <EmptyState title={t('transactions.emptyTitle')} body={t('transactions.emptyBody')} />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} currency={currency} accountName={accountName(tx.accountId)} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionRow({
  tx,
  currency,
  accountName,
}: {
  tx: Transaction;
  currency: string;
  accountName: string;
}) {
  const isIn = tx.direction === 'in';
  return (
    <GlassCard className="flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border ${
            isIn ? 'border-[var(--fv-success)]' : 'border-[var(--fv-border)]'
          } bg-[var(--fv-surface)]`}
        >
          <span className={`text-lg font-bold ${isIn ? 'text-[var(--fv-success)]' : 'text-[var(--fv-text)]'}`}>
            {isIn ? '+' : '−'}
          </span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">
            {tx.merchantName ?? tx.category}
          </p>
          <p className="text-[12px] text-[var(--fv-text-secondary)]">
            {tx.category} &middot; {accountName}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-[14px] font-bold tabular-nums ${
            isIn ? 'text-[var(--fv-success)]' : 'text-[var(--fv-text)]'
          }`}
        >
          {isIn ? '+' : '−'}
          {formatMoney(tx.amount, currency)}
        </p>
        <p className="text-[12px] text-[var(--fv-text-secondary)]">{formatDate(tx.date)}</p>
      </div>
    </GlassCard>
  );
}
