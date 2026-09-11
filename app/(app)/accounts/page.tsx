'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader, Button, TextField, EmptyState, Icon } from '@/components/ui';
import { useAccounts, useLinkAccount, useUnlinkAccount, useTransactions } from '@/lib/hooks/use-money';
import { formatMoney, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Account, AccountType } from '@/types';

const ACCOUNT_TYPES: AccountType[] = ['bank', 'mobileMoney', 'cash', 'other'];

export default function AccountsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: accounts = [] } = useAccounts();
  const linkAccount = useLinkAccount();
  const unlinkAccount = useUnlinkAccount();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('bank');
  const [balance, setBalance] = useState('');

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const totalActive = accounts.filter((a) => a.isActive).length;

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader
        title={t('tabs.accounts')}
        actionLabel={showForm ? t('common.cancel') : t('accounts.link')}
        onAction={() => setShowForm((v) => !v)}
      />

      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--fv-text-secondary)]">{t('accounts.totalBalance')}</p>
          <p className="mt-1 text-[24px] font-bold tabular-nums text-[var(--fv-text)]">
            {formatMoney(totalBalance, currency)}
          </p>
        </div>
        <span className="rounded-full border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] px-3 py-1 text-xs font-semibold text-[var(--fv-text-secondary)]">
          {totalActive} {t('accounts.active')}
        </span>
      </GlassCard>

      {showForm ? (
        <GlassCard>
          <SectionHeader title={t('accounts.link')} />
          <div className="flex flex-col gap-3">
            <TextField label={t('accounts.name')} value={name} onChangeText={setName} placeholder="e.g. MCB Bank" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--fv-text-secondary)]">{t('accounts.type')}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AccountType)}
                className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] "
              >
                {ACCOUNT_TYPES.map((at) => (
                  <option key={at} value={at}>
                    {at}
                  </option>
                ))}
              </select>
            </div>
            <TextField
              label={t('accounts.balance')}
              value={balance}
              onChangeText={setBalance}
              type="text"
              placeholder="0.00"
            />
            <div className="flex gap-2">
              <Button
                label={t('accounts.link')}
                fullWidth
                disabled={!name}
                loading={linkAccount.isPending}
                onPress={() => {
                  linkAccount.mutate(
                    { name, type, balance: Number(balance || 0) },
                    {
                      onSuccess: () => {
                        setName('');
                        setBalance('');
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

      {accounts.length === 0 ? (
        <EmptyState title={t('accounts.emptyTitle')} body={t('accounts.emptyBody')} />
      ) : (
        <div className="flex flex-col gap-2">
          {accounts.map((acc) => (
            <AccountRow key={acc.id} account={acc} currency={currency} unlink={unlinkAccount} />
          ))}
        </div>
      )}
    </div>
  );
}

function AccountRow({
  account,
  currency,
  unlink,
}: {
  account: Account;
  currency: string;
  unlink: ReturnType<typeof useUnlinkAccount>;
}) {
  const { t } = useTranslation();
  const [showTx, setShowTx] = useState(false);
  const { data: transactions = [] } = useTransactions(200);
  const accountTx = transactions
    .filter((tx) => tx.accountId === account.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <GlassCard className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
            <Icon name={account.type === 'mobileMoney' ? 'send' : 'briefcase'} size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">{account.name}</p>
            <p className="text-[12px] text-[var(--fv-text-secondary)]">
              {account.type} &middot; {account.institution ?? '—'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold tabular-nums text-[var(--fv-text)]">
            {formatMoney(account.balance, currency)}
          </span>
          <button
            type="button"
            onClick={() => setShowTx((v) => !v)}
            className="rounded-[8px] border border-[var(--fv-border)] px-2 py-1 text-[12px] font-semibold text-[var(--fv-text-secondary)] hover:opacity-80"
          >
            {showTx ? t('accounts.hideActivity') : t('accounts.activity')}
          </button>
          <button
            type="button"
            onClick={() => unlink.mutate(account.id)}
            className="rounded-[8px] px-2 py-1 text-[12px] font-semibold text-[var(--fv-error)] hover:opacity-80"
          >
            {t('accounts.unlink')}
          </button>
        </div>
      </div>

      {showTx ? (
        <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--fv-border-subtle)] pt-3">
          {accountTx.length === 0 ? (
            <p className="py-2 text-center text-[13px] text-[var(--fv-text-secondary)]">
              {t('accounts.noActivity')}
            </p>
          ) : (
            accountTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-[13px]">
                <span className="truncate text-[var(--fv-text-secondary)]">
                  {tx.merchantName ?? tx.category} &middot; {formatDate(tx.date)}
                </span>
                <span
                  className={`font-semibold tabular-nums ${
                    tx.direction === 'in' ? 'text-[var(--fv-success)]' : 'text-[var(--fv-text)]'
                  }`}
                >
                  {tx.direction === 'in' ? '+' : '−'}
                  {formatMoney(tx.amount, currency)}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </GlassCard>
  );
}
