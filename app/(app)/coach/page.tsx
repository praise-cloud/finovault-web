'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { GlassCard, SectionHeader, Icon } from '@/components/ui';
import { useAccounts, useTransactions, useGoals, useVendors, useInvoices } from '@/lib/hooks/use-money';
import { buildCoachContext, coachReply } from '@/lib/services/coach';
import { useAuthStore } from '@/stores/auth-store';
import { formatMoney } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  actions?: string[];
}

const NAV_TARGETS: Record<string, string> = {
  accounts: '/accounts',
  invoices: '/invoices',
  transactions: '/transactions',
  vendors: '/vendors',
  budgets: '/budgets',
  pension: '/vault',
  vault: '/vault',
  goals: '/vault',
  insights: '/insights',
  profile: '/profile',
};

export default function CoachPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [] } = useTransactions(200);
  const { data: goals = [] } = useGoals();
  const { data: vendors = [] } = useVendors();
  const { data: invoices = [] } = useInvoices();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const greeted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const ctx = buildCoachContext({
    role: user?.primaryRole ?? 'individual',
    scheme: user?.scheme ?? 'standard',
    name: user?.fullName ?? 'there',
    currency: user?.preferredCurrency ?? 'MUR',
    accounts,
    transactions,
    goals,
    vendors,
    invoices,
    employeeCount: user?.businessProfile?.employeeCount,
    monthlyPayroll: user?.businessProfile?.monthlyPayroll,
  });

  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    const reply = coachReply('', ctx, t);
    setMessages([{ role: 'assistant', text: reply.text, actions: reply.actions }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const ask = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const reply = coachReply(text, ctx, t);
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: '', actions: [] }]);
    setBusy(true);
    setInput('');
    // Simulated streaming so the reply feel incremental.
    let index = 0;
    const words = reply.text.split(' ');
    const timer = setInterval(() => {
      index += 1;
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last) next[next.length - 1] = { ...last, text: words.slice(0, index).join(' ') };
        return next;
      });
      if (index >= words.length) {
        clearInterval(timer);
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last) next[next.length - 1] = { ...last, actions: reply.actions };
          return next;
        });
        setBusy(false);
      }
    }, 30);
  };

  const handleAction = (action: string) => {
    if (action.toLowerCase().startsWith('open ')) {
      const target = action.substring(5).trim().toLowerCase();
      const route = NAV_TARGETS[target] ?? NAV_TARGETS[target.replace(/s$/, '')];
      if (route) {
        router.push(route);
        return;
      }
    }
    ask(action);
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      <SectionHeader title={t('tabs.coach')} />

      <GlassCard className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--fv-primary)]" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--fv-text)]">
            {t('coach.snapshot')}
          </span>
        </div>
        <span className="text-sm font-bold tabular-nums text-[var(--fv-text)]">
          {formatMoney(ctx.totalBalance, ctx.currency)}
        </span>
      </GlassCard>

      <div className="flex min-h-[360px] flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-[12px] border border-[var(--fv-border)] p-3 shadow-[var(--fv-shadow-card)] ${
                m.role === 'user' ? 'bg-[var(--fv-primary)] text-white' : 'bg-[var(--fv-surface)] text-[var(--fv-text)]'
              }`}
            >
              <p className="text-[14px] font-semibold leading-snug">{m.text}</p>
              {m.actions && m.actions.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.actions.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => handleAction(a)}
                      className="rounded-full border border-[var(--fv-primary)] bg-[var(--fv-surface-glass)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--fv-text)] hover:opacity-80"
                    >
                      {a}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {busy ? <div className="text-sm text-[var(--fv-text-secondary)]">…</div> : null}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 rounded-[12px] border border-[var(--fv-primary)] bg-[var(--fv-surface)] p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') ask(input);
          }}
          placeholder={t('coach.askHint')}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[15px] font-semibold text-[var(--fv-text)] "
        />
        <button
          type="button"
          onClick={() => ask(input)}
          disabled={busy}
          aria-label={t('coach.send')}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--fv-primary)] text-white disabled:opacity-50"
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}
