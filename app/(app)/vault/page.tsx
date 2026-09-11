'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmptyState,
  SectionHeader,
  GlassCard,
  Icon,
  ProgressRing,
  MoneyText,
  Button,
  TextField,
} from '@/components/ui';
import { HeroBalance } from '@/features/dashboard/components';
import {
  useAccounts,
  useGoals,
  usePensionPlan,
  usePensionProjection,
  usePensionContributions,
  useCreateGoal,
  useContributeGoal,
  useUpsertPension,
  useContributePension,
} from '@/lib/hooks/use-money';
import { formatMoney, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { SavingsGoal, GoalType, PensionFrequency, PensionPot, Account } from '@/types';

const GOAL_TYPES: GoalType[] = ['general', 'emergency', 'taxShield', 'project', 'pensionLinked'];
const FREQUENCIES: PensionFrequency[] = ['daily', 'weekly', 'monthly'];

export default function VaultPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const currency = user?.preferredCurrency ?? 'MUR';

  const { data: accounts = [] } = useAccounts();
  const { data: goals = [] } = useGoals();
  const { data: plan } = usePensionPlan();
  const { data: projection } = usePensionProjection();
  const { data: contributions = [] } = usePensionContributions();

  const createGoal = useCreateGoal();
  const contributeGoal = useContributeGoal();
  const upsertPension = useUpsertPension();
  const contributePension = useContributePension();

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showPensionForm, setShowPensionForm] = useState(false);
  const [showPensionContribute, setShowPensionContribute] = useState(false);

  const savedInGoals = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const selectedGoal = goals.find((g) => g.id === selectedGoalId) ?? null;

  return (
    <div>
      <SectionHeader title={t('tabs.vault')} />

      <HeroBalance
        label="Total saved"
        amount={savedInGoals}
        currency={currency}
        sub={`${goals.length} ${goals.length === 1 ? 'goal' : 'goals'}`}
        actionLabel={t('vault.createGoal')}
        onAction={() => setShowGoalForm((v) => !v)}
      />

      {showGoalForm && (
        <GoalForm
          accounts={accounts}
          currency={currency}
          onCancel={() => setShowGoalForm(false)}
          createGoal={createGoal}
        />
      )}

      <div className="mb-4">
        <SectionHeader title="Savings goals" />
        {goals.length === 0 ? (
          <EmptyState title={t('vault.emptyTitle')} body={t('vault.emptyBody')} />
        ) : selectedGoal ? (
          <GoalDetail
            goal={selectedGoal}
            accounts={accounts}
            currency={currency}
            onBack={() => setSelectedGoalId(null)}
            contributeGoal={contributeGoal}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {goals.map((goal) => (
              <GoalRow
                key={goal.id}
                goal={goal}
                currency={currency}
                onSelect={() => setSelectedGoalId(goal.id)}
                onContribute={() => setSelectedGoalId(goal.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <SectionHeader title="Pension" actionLabel={plan ? 'Contribute' : t('vault.startPension')} onAction={() => {
          if (plan) setShowPensionContribute((v) => !v);
          else setShowPensionForm((v) => !v);
        }} />
        {plan ? (
          <>
            <PensionSummary
              plan={plan}
              projection={projection}
              currency={currency}
              onContribute={() => setShowPensionContribute((v) => !v)}
            />
            {showPensionContribute && (
              <PensionContributeForm
                accounts={accounts}
                currency={currency}
                contributePension={contributePension}
                contributions={contributions}
                onCancel={() => setShowPensionContribute(false)}
              />
            )}
          </>
        ) : showPensionForm ? (
          <PensionSetupForm
            onCancel={() => setShowPensionForm(false)}
            upsertPension={upsertPension}
          />
        ) : (
          <EmptyState title="No pension plan yet" body="Set up a short and long pot pension to plan your retirement." ctaLabel={t('vault.startPension')} onCta={() => setShowPensionForm(true)} />
        )}
      </div>
    </div>
  );
}

function GoalRow({
  goal,
  currency,
  onSelect,
  onContribute,
}: {
  goal: SavingsGoal;
  currency: string;
  onSelect: () => void;
  onContribute: () => void;
}) {
  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  return (
    <GlassCard variant="interactive" onPress={onSelect} className="flex items-center gap-3">
      <ProgressRing progress={progress} size={52} strokeWidth={6} accessibilityLabel={goal.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-[var(--fv-text)]">{goal.name}</p>
        <p className="mt-0.5 text-[13px] text-[var(--fv-text-secondary)]">
          {formatMoney(goal.currentAmount, currency)} / {formatMoney(goal.targetAmount, currency)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          role="button"
          tabIndex={0}
          aria-label={`Contribute to ${goal.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onContribute();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onContribute();
            }
          }}
          className="cursor-pointer rounded-full border border-[var(--fv-primary)] px-3 py-1 text-[13px] font-semibold text-[var(--fv-primary)] hover:opacity-80"
        >
          Contribute
        </span>
        <Icon name="chevron-right" size={18} subdued />
      </div>
    </GlassCard>
  );
}

function GoalDetail({
  goal,
  accounts,
  currency,
  onBack,
  contributeGoal,
}: {
  goal: SavingsGoal;
  accounts: Account[];
  currency: string;
  onBack: () => void;
  contributeGoal: ReturnType<typeof useContributeGoal>;
}) {
  const [amount, setAmount] = useState('');
  const [sourceId, setSourceId] = useState('');

  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);

  return (
    <GlassCard>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-[14px] font-semibold text-[var(--fv-primary)] hover:opacity-80">
          ← Back
        </button>
        <p className="text-[15px] font-semibold text-[var(--fv-text)]">{goal.name}</p>
        <Icon name="plus" size={18} subdued />
      </div>

      <div className="mb-4 flex items-center gap-4">
        <ProgressRing progress={progress} size={72} strokeWidth={7} accessibilityLabel={goal.name} />
        <div className="min-w-0 flex-1">
          <MoneyText amount={goal.currentAmount} currency={currency} size="lg" color="text" />
          <p className="text-[13px] text-[var(--fv-text-secondary)]">
            of {formatMoney(goal.targetAmount, currency)} target
          </p>
        </div>
      </div>

      <div className="mb-4">
        <SectionHeader title="Contributions" />
        {goal.contributions.length === 0 ? (
          <EmptyState title="" body="No contributions yet." />
        ) : (
          <div className="flex flex-col gap-2">
            {goal.contributions.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[14px]">
                <span className="text-[var(--fv-text-secondary)]">{formatDate(c.date)}</span>
                <span className="font-semibold text-[var(--fv-text)]">{formatMoney(c.amount, currency)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="Contribute" />
        <TextField label="Amount" value={amount} onChangeText={setAmount} type="text" placeholder="0.00" />
        <AccountSelect value={sourceId} onChange={setSourceId} accounts={accounts} label="From account" />
        <Button
          label="Contribute"
          disabled={!amount || Number(amount) <= 0}
          loading={contributeGoal.isPending}
          onPress={() => {
            contributeGoal.mutate(
              {
                goalId: goal.id,
                amount: Number(amount),
                sourceAccountId: sourceId || undefined,
              },
              { onSuccess: () => setAmount('') }
            );
          }}
        />
      </div>
    </GlassCard>
  );
}

function GoalForm({
  accounts,
  currency,
  onCancel,
  createGoal,
}: {
  accounts: Account[];
  currency: string;
  onCancel: () => void;
  createGoal: ReturnType<typeof useCreateGoal>;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<GoalType>('general');
  const [targetAmount, setTargetAmount] = useState('');

  const { t } = useTranslation();

  return (
    <GlassCard className="mb-4">
      <SectionHeader title={t('vault.createGoal')} />
      <div className="flex flex-col gap-3">
        <TextField label="Name" value={name} onChangeText={setName} placeholder="e.g. New laptop" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as GoalType)}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] "
          >
            {GOAL_TYPES.map((gt) => (
              <option key={gt} value={gt}>{gt}</option>
            ))}
          </select>
        </div>
        <TextField label="Target amount" value={targetAmount} onChangeText={setTargetAmount} type="text" placeholder="0.00" />
        <div className="flex gap-2">
          <Button
            label="Create"
            fullWidth
            disabled={!name || !targetAmount || Number(targetAmount) <= 0}
            loading={createGoal.isPending}
            onPress={() => {
              createGoal.mutate(
                { name, type, targetAmount: Number(targetAmount) },
                {
                  onSuccess: () => {
                    setName('');
                    setTargetAmount('');
                    onCancel();
                  },
                }
              );
            }}
          />
          <Button label="Cancel" variant="secondary" onPress={onCancel} />
        </div>
      </div>
    </GlassCard>
  );
}

function PensionSummary({
  plan,
  projection,
  currency,
  onContribute,
}: {
  plan: NonNullable<ReturnType<typeof usePensionPlan>['data']>;
  projection?: NonNullable<ReturnType<typeof usePensionProjection>['data']>;
  currency: string;
  onContribute: () => void;
}) {
  const pots: Array<{ label: string; current: number; target: number; pot: PensionPot }> = [
    { label: 'Short pot', current: plan.currentShortPot, target: plan.shortPotTarget, pot: 'short' },
    { label: 'Long pot', current: plan.currentLongPot, target: plan.longPotTarget, pot: 'long' },
  ];
  return (
    <GlassCard className="mb-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[15px] font-semibold text-[var(--fv-text)]">Pension plan</p>
        <Button label="Contribute" variant="secondary" onPress={onContribute} className="min-h-0 px-3 py-1.5 text-[13px]" />
      </div>
      <div className="flex flex-col gap-3">
        {pots.map((p) => {
          const progress = Math.min(100, (p.current / p.target) * 100);
          return (
            <div key={p.pot} className="flex items-center gap-3">
              <ProgressRing progress={progress} size={44} strokeWidth={5} accessibilityLabel={p.label} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-[var(--fv-text)]">{p.label}</p>
                <p className="text-[13px] text-[var(--fv-text-secondary)]">
                  {formatMoney(p.current, currency)} / {formatMoney(p.target, currency)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {projection ? (
        <div className="mt-4 rounded-[10px] border border-[var(--fv-primary-border)] bg-[var(--fv-surface)] p-3">
          <p className="mb-1 text-[13px] text-[var(--fv-text-secondary)]">Projected at retirement ({projection.yearsToRetirement} yrs)</p>
          <MoneyText amount={projection.totalProjected} currency={currency} size="md" color="accent" />
        </div>
      ) : null}
    </GlassCard>
  );
}

function PensionSetupForm({
  onCancel,
  upsertPension,
}: {
  onCancel: () => void;
  upsertPension: ReturnType<typeof useUpsertPension>;
}) {
  const [shortPotTarget, setShortPotTarget] = useState('');
  const [longPotTarget, setLongPotTarget] = useState('');
  const [frequency, setFrequency] = useState<PensionFrequency>('monthly');
  const [contributionAmount, setContributionAmount] = useState('');
  const [currentShortPot, setCurrentShortPot] = useState('');
  const [currentLongPot, setCurrentLongPot] = useState('');
  const [assumedReturnPct, setAssumedReturnPct] = useState('5');
  const [inflationPct, setInflationPct] = useState('3');
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('65');
  const [autoDebit, setAutoDebit] = useState(true);

  const { t } = useTranslation();

  return (
    <GlassCard className="mb-3">
      <SectionHeader title={t('vault.startPension')} />
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Short pot target" value={shortPotTarget} onChangeText={setShortPotTarget} type="text" placeholder="0" />
          <TextField label="Long pot target" value={longPotTarget} onChangeText={setLongPotTarget} type="text" placeholder="0" />
          <TextField label="Current short pot" value={currentShortPot} onChangeText={setCurrentShortPot} type="text" placeholder="0" />
          <TextField label="Current long pot" value={currentLongPot} onChangeText={setCurrentLongPot} type="text" placeholder="0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as PensionFrequency)}
            className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] "
          >
            {FREQUENCIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Contribution amount" value={contributionAmount} onChangeText={setContributionAmount} type="text" placeholder="0" />
          <TextField label="Current age" value={currentAge} onChangeText={setCurrentAge} type="text" placeholder="0" />
          <TextField label="Retirement age" value={retirementAge} onChangeText={setRetirementAge} type="text" placeholder="65" />
          <TextField label="Assumed return %" value={assumedReturnPct} onChangeText={setAssumedReturnPct} type="text" placeholder="5" />
        </div>
        <TextField label="Inflation %" value={inflationPct} onChangeText={setInflationPct} type="text" placeholder="3" />
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--fv-text-secondary)]">Auto-debit</label>
          <button
            type="button"
            onClick={() => setAutoDebit((v) => !v)}
            className={`h-[28px] w-[48px] rounded-full transition-colors ${autoDebit ? 'bg-[var(--fv-primary)]' : 'bg-[var(--fv-border-subtle)]'}`}
            aria-label="Toggle auto-debit"
          >
            <span
              className={`block h-[24px] w-[24px] rounded-full bg-white transition-transform ${autoDebit ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
            />
          </button>
        </div>
        <Button
          label="Save pension plan"
          fullWidth
          disabled={!shortPotTarget || !longPotTarget || !contributionAmount || !currentAge}
          loading={upsertPension.isPending}
          onPress={() => {
            upsertPension.mutate(
              {
                shortPotTarget: Number(shortPotTarget),
                longPotTarget: Number(longPotTarget),
                frequency,
                contributionAmount: Number(contributionAmount),
                currentShortPot: Number(currentShortPot || 0),
                currentLongPot: Number(currentLongPot || 0),
                assumedReturnPct: Number(assumedReturnPct || 0),
                inflationPct: Number(inflationPct || 0),
                currentAge: Number(currentAge),
                retirementAge: Number(retirementAge || 65),
                autoDebit,
              },
              { onSuccess: onCancel }
            );
          }}
        />
        <Button label="Cancel" variant="secondary" onPress={onCancel} />
      </div>
    </GlassCard>
  );
}

function PensionContributeForm({
  accounts,
  currency,
  contributePension,
  contributions,
  onCancel,
}: {
  accounts: Account[];
  currency: string;
  contributePension: ReturnType<typeof useContributePension>;
  contributions: Array<{ id: string; pot: PensionPot; amount: number; date: string }>;
  onCancel: () => void;
}) {
  const [pot, setPot] = useState<PensionPot>('short');
  const [amount, setAmount] = useState('');
  const [sourceId, setSourceId] = useState('');

  return (
    <GlassCard className="mb-3">
      <SectionHeader title="Contribute to pension" />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {(['short', 'long'] as PensionPot[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPot(p)}
              className={`flex-1 rounded-[10px] border px-4 py-2 text-[14px] font-semibold capitalize ${
                pot === p
                  ? 'border-[var(--fv-primary)] bg-[var(--fv-surface)] text-[var(--fv-primary)]'
                  : 'border-[var(--fv-border)] text-[var(--fv-text-secondary)]'
              }`}
            >
              {p} pot
            </button>
          ))}
        </div>
        <TextField label="Amount" value={amount} onChangeText={setAmount} type="text" placeholder="0.00" />
        <AccountSelect value={sourceId} onChange={setSourceId} accounts={accounts} label="From account" />
        <div className="flex gap-2">
          <Button
            label="Contribute"
            fullWidth
            disabled={!amount || Number(amount) <= 0}
            loading={contributePension.isPending}
            onPress={() => {
              contributePension.mutate(
                { pot, amount: Number(amount), sourceAccountId: sourceId || undefined },
                { onSuccess: () => setAmount('') }
              );
            }}
          />
          <Button label="Cancel" variant="secondary" onPress={onCancel} />
        </div>
      </div>
      {contributions.length > 0 ? (
        <div className="mt-4">
          <SectionHeader title="Recent contributions" />
          <div className="flex flex-col gap-2">
            {contributions.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[14px]">
                <span className="capitalize text-[var(--fv-text-secondary)]">{c.pot} • {formatDate(c.date)}</span>
                <span className="font-semibold text-[var(--fv-text)]">{formatMoney(c.amount, currency)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}

function AccountSelect({
  accounts,
  value,
  onChange,
  label,
}: {
  accounts: Array<{ id: string; name: string }>;
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
        className="min-h-[48px] rounded-[10px] border border-[var(--fv-border)] bg-[var(--fv-surface)] px-4 py-3 text-[var(--fv-text)] "
      >
        <option value="">Select account</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
    </div>
  );
}
