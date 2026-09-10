'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard, SectionHeader, Button, MoneyText } from '@/components/ui';
import { useTransactions, useMoneySummary } from '@/lib/hooks/use-money';
import { useAuthStore } from '@/stores/auth-store';
import { useTheme } from '@/lib/theme';
import { formatMoney } from '@/lib/utils';
import { GrantOpportunities } from '@/features/grants/GrantOpportunities';

// ponytail: fixed 6-slot ramps, cap categories shown at whatever fits; adjacent pairs keep >=3:1 on each surface.
const LIGHT_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
const DARK_COLORS = ['#818cf8', '#fbbf24', '#34d399', '#f472b6', '#60a5fa', '#c084fc', '#f87171', '#2dd4bf'];

function startOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function downloadCsv(transactions: import('@/types').Transaction[]) {
  const header = 'Date,Category,Merchant,Direction,Amount\n';
  const rows = transactions.map(
    (t) =>
      `${t.date},${t.category},${t.merchantName ?? ''},${t.direction},${t.amount}`,
  ).join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function InsightsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const summary = useMoneySummary();
  const { data: transactions = [] } = useTransactions(200);
  const { theme } = useTheme();
  const COLORS = theme.mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const monthStart = startOfMonth();

  const spendingByCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((tx) => tx.direction === 'out' && tx.date >= monthStart)
      .forEach((tx) => {
        map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
      });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, monthStart]);

  const net = summary.monthIncome - summary.monthExpense;

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader title={t('tabs.insights')} />

      {/* Income / Expense / Net row */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">
            {t('home.metrics.incomeThisMonth')}
          </span>
          <MoneyText amount={summary.monthIncome} currency="MUR" size="sm" color="success" />
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">
            {t('insights.spendingPattern')}
          </span>
          <MoneyText amount={summary.monthExpense} currency="MUR" size="sm" color="error" />
        </GlassCard>
        <GlassCard className="flex flex-col items-center gap-1">
          <span className="text-xs text-[var(--fv-text-secondary)]">Net</span>
          <MoneyText
            amount={net}
            currency="MUR"
            size="sm"
            color={net >= 0 ? 'success' : 'error'}
            showSign
          />
        </GlassCard>
      </div>

      {/* Pie chart */}
      <GlassCard>
        <h3 className="mb-3 text-sm font-semibold text-[var(--fv-text)]">
          {t('insights.spendingPattern')}
        </h3>
        {spendingByCategory.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--fv-text-secondary)]">
            {t('insights.patternEmpty')}
          </p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {spendingByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatMoney(Number(value), 'MUR')}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
              {spendingByCategory.map((entry, idx) => (
                <span key={entry.name} className="flex items-center gap-1.5 text-xs text-[var(--fv-text-secondary)]">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {entry.name}
                </span>
              ))}
            </div>
          </>
        )}
      </GlassCard>

      {/* Top category briefing */}
      {summary.topExpenseCategory && (
        <GlassCard>
          <p className="text-sm text-[var(--fv-text-secondary)]">
            Top:{' '}
            <span className="font-semibold text-[var(--fv-text)]">
              {summary.topExpenseCategory}
            </span>
          </p>
        </GlassCard>
      )}

      {/* Role-specific insight cards */}
      {user?.primaryRole === 'individual' && (
        <GlassCard className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[var(--fv-text)]">Savings Snapshot</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Saved in Goals</span>
            <MoneyText amount={summary.savedInGoals} currency="MUR" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Emergency Fund</span>
            <span className="text-sm font-semibold text-[var(--fv-text)]">
              {Math.round(summary.emergencyFundProgress * 100)}%
            </span>
          </div>
        </GlassCard>
      )}

      {user?.primaryRole === 'freelancer' && (
        <GlassCard className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[var(--fv-text)]">Tax Efficiency</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Estimated Tax</span>
            <MoneyText amount={summary.taxEstimate} currency="MUR" size="sm" color="error" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Unpaid Invoices</span>
            <span className="text-sm font-semibold text-[var(--fv-text)]">
              {summary.unpaidInvoiceCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Outstanding Value</span>
            <MoneyText amount={summary.unpaidInvoiceTotal} currency="MUR" size="sm" />
          </div>
        </GlassCard>
      )}

      {user?.primaryRole === 'entrepreneur' && (
        <GlassCard className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[var(--fv-text)]">Business Metrics</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Monthly Revenue</span>
            <MoneyText amount={summary.monthIncome} currency="MUR" size="sm" color="success" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Burn Rate</span>
            <MoneyText amount={summary.monthExpense} currency="MUR" size="sm" color="error" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Runway</span>
            <span className="text-sm font-semibold text-[var(--fv-text)]">
              {summary.runwayMonths} months
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Unpaid Invoices</span>
            <MoneyText amount={summary.unpaidInvoiceTotal} currency="MUR" size="sm" />
          </div>
        </GlassCard>
      )}

      {user?.primaryRole === 'sme' && (
        <GlassCard className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-[var(--fv-text)]">Cash Flow & Runway</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Runway</span>
            <span className="text-sm font-semibold text-[var(--fv-text)]">
              {summary.runwayMonths} months
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Unpaid Invoices</span>
            <MoneyText amount={summary.unpaidInvoiceTotal} currency="MUR" size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Tax Estimate</span>
            <MoneyText amount={summary.taxEstimate} currency="MUR" size="sm" color="error" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--fv-text-secondary)]">Emergency Fund</span>
            <span className="text-sm font-semibold text-[var(--fv-text)]">
              {Math.round(summary.emergencyFundProgress * 100)}%
            </span>
          </div>
        </GlassCard>
      )}

      {/* Female Founder grants */}
      {user?.scheme === 'female_founder' && <GrantOpportunities />}

      {/* CSV export */}
      <Button
        label="Export Transactions CSV"
        onPress={() => downloadCsv(transactions)}
        variant="secondary"
        fullWidth
      />
    </div>
  );
}
