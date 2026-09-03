'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard, SectionHeader, Button, TextField, EmptyState } from '@/components/ui';
import { useVendors, useCreateVendor } from '@/lib/hooks/use-money';
import { formatMoney } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

export default function VendorsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: vendors = [] } = useVendors();
  const createVendor = useCreateVendor();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');

  const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader
        title={t('tabs.vendors')}
        actionLabel={showForm ? t('common.cancel') : t('vendors.add')}
        onAction={() => setShowForm((v) => !v)}
      />

      <GlassCard className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--fv-text-secondary)]">{t('vendors.totalSpend')}</p>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-[var(--fv-text)]">
            {formatMoney(totalSpend, currency)}
          </p>
        </div>
        <span className="rounded-full border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] px-3 py-1 text-xs font-semibold text-[var(--fv-text-secondary)]">
          {vendors.length} {t('vendors.count')}
        </span>
      </GlassCard>

      {showForm ? (
        <GlassCard>
          <SectionHeader title={t('vendors.add')} />
          <div className="flex flex-col gap-3">
            <TextField label={t('vendors.name')} value={name} onChangeText={setName} placeholder="e.g. Print Hub Ltd" />
            <div className="flex gap-2">
              <Button
                label={t('vendors.add')}
                fullWidth
                disabled={!name}
                loading={createVendor.isPending}
                onPress={() => {
                  createVendor.mutate(
                    { name },
                    {
                      onSuccess: () => {
                        setName('');
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

      {vendors.length === 0 ? (
        <EmptyState title={t('vendors.emptyTitle')} body={t('vendors.emptyBody')} ctaLabel={t('vendors.add')} onCta={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-2">
          {vendors.map((v) => (
            <GlassCard key={v.id} className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)]">
                  <span className="text-[15px] font-bold text-[var(--fv-primary)]">
                    {v.name.slice(0, 1).toUpperCase()}
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-[var(--fv-text)]">{v.name}</p>
                  <p className="text-[12px] text-[var(--fv-text-secondary)]">
                    {t('vendors.reliability')} {v.reliabilityScore}/100
                  </p>
                </div>
              </div>
              <span className="text-[14px] font-bold tabular-nums text-[var(--fv-text)]">
                {formatMoney(v.totalSpend, currency)}
              </span>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
