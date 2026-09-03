'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader, Button, TextField, EmptyState } from '@/components/ui';
import { useInvoices, useCreateInvoice, useUpdateInvoiceStatus } from '@/lib/hooks/use-money';
import { formatMoney, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Invoice, InvoiceStatus } from '@/types';

const STATUSES: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];

function statusColor(status: InvoiceStatus): string {
  switch (status) {
    case 'paid':
      return 'text-[var(--fv-success)]';
    case 'overdue':
      return 'text-[var(--fv-error)]';
    case 'sent':
      return 'text-[var(--fv-text)]';
    default:
      return 'text-[var(--fv-text-secondary)]';
  }
}

function summaryOf(invoices: Invoice[]): { total: number; paid: number; outstanding: number } {
  let total = 0;
  let paid = 0;
  let outstanding = 0;
  for (const inv of invoices) {
    total += inv.amount;
    if (inv.status === 'paid') paid += inv.amount;
    else outstanding += inv.amount;
  }
  return { total, paid, outstanding };
}

export default function InvoicesPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: invoices = [] } = useInvoices();
  const createInvoice = useCreateInvoice();
  const updateStatus = useUpdateInvoiceStatus();

  const [showForm, setShowForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { total, paid, outstanding } = summaryOf(invoices);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader
        title={t('tabs.invoices')}
        actionLabel={showForm ? t('common.cancel') : t('invoices.create')}
        onAction={() => setShowForm((v) => !v)}
      />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">{t('invoices.total')}</span>
          <span className="text-[15px] font-bold tabular-nums text-[var(--fv-text)]">
            {formatMoney(total, currency)}
          </span>
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">{t('invoices.paid')}</span>
          <span className="text-[15px] font-bold tabular-nums text-[var(--fv-success)]">
            {formatMoney(paid, currency)}
          </span>
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">{t('invoices.outstanding')}</span>
          <span className="text-[15px] font-bold tabular-nums text-[var(--fv-error)]">
            {formatMoney(outstanding, currency)}
          </span>
        </GlassCard>
      </div>

      {showForm ? (
        <GlassCard>
          <SectionHeader title={t('invoices.create')} />
          <div className="flex flex-col gap-3">
            <TextField
              label={t('invoices.client')}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Client name"
            />
            <TextField
              label={t('invoices.amount')}
              value={amount}
              onChangeText={setAmount}
              type="text"
              placeholder="0.00"
            />
            <TextField
              label={t('invoices.dueDate')}
              value={dueDate}
              onChangeText={setDueDate}
              type="date"
            />
            <div className="flex gap-2">
              <Button
                label={t('invoices.create')}
                fullWidth
                disabled={!clientName || !amount || Number(amount) <= 0}
                loading={createInvoice.isPending}
                onPress={() => {
                  createInvoice.mutate(
                    { clientName, amount: Number(amount), dueDate: dueDate || new Date().toISOString() },
                    {
                      onSuccess: () => {
                        setClientName('');
                        setAmount('');
                        setDueDate('');
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

      {invoices.length === 0 ? (
        <EmptyState title={t('invoices.emptyTitle')} body={t('invoices.emptyBody')} />
      ) : (
        <div className="flex flex-col gap-2">
          {invoices.map((inv) => (
            <InvoiceRow key={inv.id} invoice={inv} currency={currency} updateStatus={updateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function InvoiceRow({
  invoice,
  currency,
  updateStatus,
}: {
  invoice: Invoice;
  currency: string;
  updateStatus: ReturnType<typeof useUpdateInvoiceStatus>;
}) {
  const { t } = useTranslation();
  return (
    <GlassCard className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">{invoice.clientName}</p>
        <p className="text-[12px] text-[var(--fv-text-secondary)]">
          {t('invoices.dueShort')} {formatDate(invoice.dueDate)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[14px] font-bold tabular-nums text-[var(--fv-text)]`}>
          {formatMoney(invoice.amount, currency)}
        </span>
        <select
          value={invoice.status}
          onChange={(e) => updateStatus.mutate({ invoiceId: invoice.id, status: e.target.value as InvoiceStatus })}
          className={`rounded-[8px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-2 py-1 text-[12px] font-semibold capitalize outline-none ${statusColor(
            invoice.status
          )}`}
          aria-label={t('invoices.status')}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </GlassCard>
  );
}
