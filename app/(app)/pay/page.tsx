'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmptyState,
  SectionHeader,
  GlassCard,
  Icon,
  Button,
  TextField,
  MoneyText,
} from '@/components/ui';
import { IconName } from '@/components/ui';
import {
  useAccounts,
  useTransfers,
  useBillPayments,
  useCreateTransfer,
  usePayBill,
} from '@/lib/hooks/use-money';
import { computeTransferFee } from '@/lib/utils/fees';
import { formatMoney, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { BillCategory, Account, Transfer, BillPayment } from '@/types';

type Section = 'transfers' | 'bills';

const BILL_CATEGORIES: Array<{ key: BillCategory; label: string; icon: IconName }> = [
  { key: 'electricity', label: 'Electricity', icon: 'cpu' },
  { key: 'water', label: 'Water', icon: 'umbrella' },
  { key: 'data', label: 'Data', icon: 'send' },
  { key: 'airtime', label: 'Airtime', icon: 'bell' },
  { key: 'cable', label: 'Cable', icon: 'award' },
  { key: 'schoolFees', label: 'School fees', icon: 'file-text' },
];

export default function PayPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const [section, setSection] = useState<Section>('transfers');

  return (
    <div>
      <SectionHeader title={t('tabs.pay')} />

      <div className="mb-4 flex gap-2">
        {(['transfers', 'bills'] as Section[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`flex-1 rounded-[12px] border px-4 py-2.5 text-[14px] font-semibold capitalize transition-colors ${
              section === s
                ? 'border-[var(--fv-primary)] bg-[var(--fv-surface)] text-[var(--fv-primary)]'
                : 'border-[var(--fv-primary-border)] bg-[var(--fv-surface-glass)] text-[var(--fv-text-secondary)]'
            }`}
          >
            {s === 'transfers' ? t('pay.transfer') : t('pay.payBill')}
          </button>
        ))}
      </div>

      {section === 'transfers' ? (
        <TransfersSection currency={currency} />
      ) : (
        <BillsSection currency={currency} />
      )}
    </div>
  );
}

function TransfersSection({ currency }: { currency: string }) {
  const { t } = useTranslation();
  const { data: accounts = [] } = useAccounts();
  const { data: transfers = [] } = useTransfers();
  const createTransfer = useCreateTransfer();

  const [sourceId, setSourceId] = useState('');
  const [payeeName, setPayeeName] = useState('');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');

  const amountNum = Number(amount) > 0 ? Number(amount) : 0;
  const fee = computeTransferFee(amountNum);
  const total = amountNum + fee;

  return (
    <div>
      <GlassCard className="mb-4">
        <SectionHeader title={t('pay.transfer')} />
        <div className="flex flex-col gap-3">
          <AccountSelect value={sourceId} onChange={setSourceId} accounts={accounts} label="From account" />
          <TextField label="Payee name" value={payeeName} onChangeText={setPayeeName} placeholder="Recipient" />
          <TextField label="Destination" value={destination} onChangeText={setDestination} placeholder="Account no / phone" />
          <TextField label="Amount" value={amount} onChangeText={setAmount} type="text" placeholder="0.00" />

          {amountNum > 0 ? (
            <FeePreview fee={fee} total={total} currency={currency} />
          ) : null}

          <Button
            label="Send transfer"
            fullWidth
            disabled={!sourceId || !payeeName || !destination || amountNum <= 0}
            loading={createTransfer.isPending}
            onPress={() => {
              createTransfer.mutate(
                {
                  sourceAccountId: sourceId,
                  payeeName,
                  destination,
                  amount: amountNum,
                  idempotencyKey: crypto.randomUUID(),
                },
                {
                  onSuccess: () => {
                    setPayeeName('');
                    setDestination('');
                    setAmount('');
                    setSourceId('');
                  },
                }
              );
            }}
          />
        </div>
      </GlassCard>

      <div>
        <SectionHeader title={t('pay.recent')} />
        {transfers.length === 0 ? (
          <EmptyState title="" body={t('pay.emptyHistory')} />
        ) : (
          <div className="flex flex-col gap-2">
            {transfers.map((tr) => (
              <TransferRow key={tr.id} transfer={tr} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransferRow({ transfer, currency }: { transfer: Transfer; currency: string }) {
  const statusColor =
    transfer.status === 'completed'
      ? 'text-[var(--fv-success)]'
      : transfer.status === 'failed'
        ? 'text-[var(--fv-error)]'
        : 'text-[var(--fv-text-secondary)]';
  return (
    <GlassCard className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
          <Icon name="send" size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">{transfer.payeeName}</p>
          <p className="text-[12px] text-[var(--fv-text-secondary)]">
            {transfer.destination} • {formatDate(transfer.createdAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[14px] font-bold tabular-nums text-[var(--fv-text)]">{formatMoney(transfer.total, currency)}</p>
        <p className={`text-[12px] capitalize ${statusColor}`}>{transfer.status}</p>
      </div>
    </GlassCard>
  );
}

function FeePreview({ fee, total, currency }: { fee: number; total: number; currency: string }) {
  return (
    <div className="rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] p-3">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-[var(--fv-text-secondary)]">Fee</span>
        <span className="font-semibold text-[var(--fv-text)]">{formatMoney(fee, currency)}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-[13px]">
        <span className="text-[var(--fv-text-secondary)]">Total</span>
        <MoneyText amount={total} currency={currency} size="sm" color="text" />
      </div>
    </div>
  );
}

function BillsSection({ currency }: { currency: string }) {
  const { t } = useTranslation();
  const { data: accounts = [] } = useAccounts();
  const { data: bills = [] } = useBillPayments();
  const payBill = usePayBill();

  const [selected, setSelected] = useState<BillCategory | null>(null);
  const [billerName, setBillerName] = useState('');
  const [amount, setAmount] = useState('');
  const [customerRef, setCustomerRef] = useState('');
  const [sourceId, setSourceId] = useState('');

  const selectedMeta = BILL_CATEGORIES.find((b) => b.key === selected);

  return (
    <div>
      <SectionHeader title="Categories" />
      <div className="mb-4 grid grid-cols-2 gap-2">
        {BILL_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              setSelected(cat.key);
              setBillerName('');
              setAmount('');
              setCustomerRef('');
              setSourceId('');
            }}
            className={`flex items-center gap-2 rounded-[12px] border p-3 transition-colors ${
              selected === cat.key
                ? 'border-[var(--fv-primary)] bg-[var(--fv-surface)]'
                : 'border-[var(--fv-primary-border)] bg-[var(--fv-surface-glass)]'
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
              <Icon name={cat.icon} size={18} />
            </span>
            <span className="text-[13px] font-semibold text-[var(--fv-text)]">{cat.label}</span>
          </button>
        ))}
      </div>

      {selected && selectedMeta ? (
        <GlassCard className="mb-4">
          <SectionHeader title={`Pay ${selectedMeta.label}`} />
          <div className="flex flex-col gap-3">
            <TextField label="Biller name" value={billerName} onChangeText={setBillerName} placeholder={selectedMeta.label} />
            <TextField label="Customer reference" value={customerRef} onChangeText={setCustomerRef} placeholder="Account / meter no" />
            <TextField label="Amount" value={amount} onChangeText={setAmount} type="text" placeholder="0.00" />
            <AccountSelect value={sourceId} onChange={setSourceId} accounts={accounts} label="From account" />
            <Button
              label="Pay bill"
              fullWidth
              disabled={!billerName || !customerRef || !amount || Number(amount) <= 0}
              loading={payBill.isPending}
              onPress={() => {
                payBill.mutate(
                  {
                    category: selected,
                    billerName,
                    amount: Number(amount),
                    customerRef,
                    sourceAccountId: sourceId || undefined,
                  },
                  {
                    onSuccess: () => {
                      setBillerName('');
                      setCustomerRef('');
                      setAmount('');
                      setSourceId('');
                    },
                  }
                );
              }}
            />
          </div>
        </GlassCard>
      ) : null}

      <div>
        <SectionHeader title={t('pay.recent')} />
        {bills.length === 0 ? (
          <EmptyState title="" body={t('pay.emptyHistory')} />
        ) : (
          <div className="flex flex-col gap-2">
            {bills.map((bill) => (
              <BillRow key={bill.id} bill={bill} currency={currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BillRow({ bill, currency }: { bill: BillPayment; currency: string }) {
  const meta = BILL_CATEGORIES.find((b) => b.key === bill.category);
  const statusColor =
    bill.status === 'paid'
      ? 'text-[var(--fv-success)]'
      : bill.status === 'failed'
        ? 'text-[var(--fv-error)]'
        : 'text-[var(--fv-text-secondary)]';
  return (
    <GlassCard className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
          <Icon name={meta?.icon ?? 'file-text'} size={18} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">{bill.billerName}</p>
          <p className="text-[12px] text-[var(--fv-text-secondary)]">
            {meta?.label ?? bill.category} • {formatDate(bill.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[14px] font-bold tabular-nums text-[var(--fv-text)]">{formatMoney(bill.amount, currency)}</p>
        <p className={`text-[12px] capitalize ${statusColor}`}>{bill.status}</p>
      </div>
    </GlassCard>
  );
}

function AccountSelect({
  accounts,
  value,
  onChange,
  label,
}: {
  accounts: Account[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--fv-text-secondary)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] outline-none"
      >
        <option value="">Select account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  );
}
