import { formatMoney } from '@/lib/utils/format';
import type {
  PrimaryRole,
  RoleScheme,
  Account,
  Transaction,
  SavingsGoal,
  Vendor,
  Invoice,
} from '@/types';

export interface CoachContext {
  role: PrimaryRole;
  scheme: RoleScheme;
  name: string;
  currency: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  topCategories: string[];
  topGoal: string | null;
  goalProgress: number;
  runwayMonths: number;
  employeeCount: number;
  monthlyPayroll: number;
  vendorSpend: Record<string, number>;
  unpaidInvoiceTotal: number;
}

export interface CoachReply {
  text: string;
  actions: string[];
}

type Translator = (key: string, params?: Record<string, unknown>) => string;

/**
 * Build a money snapshot the coach can ground its advice on. Mirrors the mobile
 * `CoachContext` (finovault-flutter/lib/core/coach/coach_models.dart).
 */
export function buildCoachContext(args: {
  role: PrimaryRole;
  scheme: RoleScheme;
  name: string;
  currency: string;
  accounts: Account[];
  transactions: Transaction[];
  goals: SavingsGoal[];
  vendors: Vendor[];
  invoices: Invoice[];
  employeeCount?: number;
  monthlyPayroll?: number;
}): CoachContext {
  const { role, scheme, name, currency, accounts, transactions, goals, vendors, invoices } = args;

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const cut = Date.now() - 30 * 24 * 60 * 60 * 1000;
  let income = 0;
  let expense = 0;
  const catSpend = new Map<string, number>();
  for (const t of transactions) {
    if (new Date(t.date).getTime() < cut) continue;
    if (t.direction === 'in') {
      income += t.amount;
    } else {
      expense += t.amount;
      catSpend.set(t.category, (catSpend.get(t.category) ?? 0) + t.amount);
    }
  }

  const topCategories = Array.from(catSpend.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  const goal = goals[0] ?? null;
  const goalProgress = goal && goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0;

  const dailyRate = expense / Math.max(1, new Date().getDate());
  const runwayMonths = dailyRate > 0 ? Math.round((totalBalance / (dailyRate * 30)) * 10) / 10 : 0;

  const vendorSpend: Record<string, number> = {};
  for (const v of vendors) vendorSpend[v.name] = v.totalSpend;

  const unpaidInvoiceTotal = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + i.amount, 0);

  return {
    role,
    scheme,
    name,
    currency,
    totalBalance,
    monthlyIncome: income,
    monthlyExpense: expense,
    topCategories,
    topGoal: goal?.name ?? null,
    goalProgress,
    runwayMonths,
    employeeCount: args.employeeCount ?? 0,
    monthlyPayroll: args.monthlyPayroll ?? 0,
    vendorSpend,
    unpaidInvoiceTotal,
  };
}

function money(v: number, currency: string): string {
  return formatMoney(v, currency);
}

/**
 * Deterministic, rule-based assistant reply. Mirrors the mobile `MockCoachService`
 * (finovault-flutter/lib/core/coach/coach_service.dart). A real build swaps this
 * for an LLM call fed the same CoachContext — no UI changes required.
 */
export function coachReply(prompt: string, ctx: CoachContext, t: Translator): CoachReply {
  const p = prompt.toLowerCase();
  const roleLabel = t(`role.${ctx.role}`);
  const goal = ctx.topGoal ?? t('coach.yourTopGoal');

  // SME: cash flow, vendors, compliance, payroll
  if (ctx.role === 'sme') {
    if (p.includes('cash') || p.includes('flow') || p.includes('runway')) {
      return {
        text: t('coach.smeCashFlow', {
          balance: money(ctx.totalBalance, ctx.currency),
          payroll: money(ctx.monthlyPayroll, ctx.currency),
          runway: ctx.runwayMonths.toFixed(1),
        }),
        actions: ['Open vendors', 'Open invoices', 'Open accounts'],
      };
    }
    if (p.includes('vendor') || p.includes('supplier') || p.includes('payable')) {
      const entries = Object.entries(ctx.vendorSpend);
      const topVendor = entries.length
        ? entries.sort((a, b) => b[1] - a[1])[0][0]
        : t('coach.noVendorsYet');
      const topSpend = entries.length
        ? money(Math.max(...entries.map((e) => e[1])), ctx.currency)
        : 'MUR 0';
      return {
        text: t('coach.smeVendors', {
          vendor: topVendor,
          spend: topSpend,
          expense: money(ctx.monthlyExpense, ctx.currency),
        }),
        actions: ['Open vendors', 'Open transactions'],
      };
    }
    if (p.includes('compliance') || p.includes('tax') || p.includes('filing') || p.includes('audit')) {
      return {
        text: t('coach.smeCompliance'),
        actions: ['Open invoices', 'Open profile'],
      };
    }
    if (p.includes('payroll') || p.includes('salary') || p.includes('team') || p.includes('staff')) {
      const pct =
        ctx.monthlyExpense > 0
          ? Math.round((ctx.monthlyPayroll / ctx.monthlyExpense) * 100)
          : 0;
      return {
        text: t('coach.smePayroll', {
          payroll: money(ctx.monthlyPayroll, ctx.currency),
          count: String(ctx.employeeCount),
          pct: `${pct}%`,
        }),
        actions: ['Open vendors', 'Open accounts'],
      };
    }
  }

  // Entrepreneur: fundraising, burn, hiring, revenue, grants
  if (ctx.role === 'entrepreneur') {
    if (p.includes('fundrais') || p.includes('investor') || p.includes('round') || p.includes('valuation')) {
      return {
        text: t('coach.entrepreneurFundraising', {
          balance: money(ctx.totalBalance, ctx.currency),
          burn: money(ctx.monthlyExpense, ctx.currency),
          runway: ctx.runwayMonths.toFixed(1),
        }),
        actions: ['Open pension', 'Open vault'],
      };
    }
    if (p.includes('burn') || p.includes('runway') || p.includes('efficienc')) {
      const multiple = ctx.monthlyIncome > 0 ? ctx.monthlyExpense / ctx.monthlyIncome : 0;
      return {
        text: t('coach.entrepreneurBurn', {
          burn: money(ctx.monthlyExpense, ctx.currency),
          multiple: multiple.toFixed(1),
        }),
        actions: ['Open transactions', 'Open goals'],
      };
    }
    if (p.includes('hire') || p.includes('team') || p.includes('headcount') || p.includes('staff')) {
      const revPerEmp =
        ctx.monthlyIncome > 0 && ctx.employeeCount > 0
          ? money(ctx.monthlyIncome / ctx.employeeCount, ctx.currency)
          : 'N/A';
      return {
        text: t('coach.entrepreneurHiring', {
          count: String(ctx.employeeCount),
          payroll: money(ctx.monthlyPayroll, ctx.currency),
          revenue: money(ctx.monthlyIncome, ctx.currency),
          revPerEmp,
        }),
        actions: ['Open vendors', 'Open goals'],
      };
    }
    if (p.includes('mrr') || p.includes('revenue') || p.includes('growth') || p.includes('arr')) {
      return {
        text: t('coach.entrepreneurRevenue', {
          mrr: money(ctx.monthlyIncome, ctx.currency),
          burn: money(ctx.monthlyExpense, ctx.currency),
          range: 'MUR 250k – 1M',
        }),
        actions: ['Open invoices', 'Open transactions'],
      };
    }
    if (
      ctx.scheme === 'female_founder' &&
      (p.includes('grant') || p.includes('women') || p.includes('female') || p.includes('fund'))
    ) {
      return {
        text: t('coach.femaleFounderGrants'),
        actions: ['Open insights', 'Open goals'],
      };
    }
  }

  // Freelancer: invoices, tax
  if (ctx.role === 'freelancer') {
    if (p.includes('invoice') || p.includes('client') || p.includes('collect') || p.includes('paid')) {
      return {
        text: t('coach.freelancerInvoices', {
          income: money(ctx.monthlyIncome, ctx.currency),
          dso: String(Math.max(0, Math.round(ctx.unpaidInvoiceTotal > 0 ? 21 : 0))),
        }),
        actions: ['Open invoices', 'Open transactions'],
      };
    }
    if (p.includes('tax') || p.includes('set aside') || p.includes('reserve')) {
      return {
        text: t('coach.freelancerTax', {
          taxReserve: money(ctx.monthlyIncome * 0.2, ctx.currency),
          income: money(ctx.monthlyIncome, ctx.currency),
        }),
        actions: ['Open goals', 'Open transactions'],
      };
    }
  }

  // Generic save / budget / spend
  if (p.includes('save') || p.includes('budget') || p.includes('spend')) {
    return {
      text: t('coach.save', {
        income: money(ctx.monthlyIncome, ctx.currency),
        expense: money(ctx.monthlyExpense, ctx.currency),
        surplus: money(ctx.monthlyIncome - ctx.monthlyExpense, ctx.currency),
        cats: ctx.topCategories.slice(0, 2).join(` ${t('coach.andWord')} `) || t('coach.noSpendingYet'),
        goal,
      }),
      actions: ['Open goals', 'Open budgets'],
    };
  }
  if (p.includes('invest') || p.includes('grow') || p.includes('pension')) {
    return {
      text: t('coach.invest', {
        balance: money(ctx.totalBalance, ctx.currency),
        role: roleLabel,
      }),
      actions: ['Open pension', 'Open vault'],
    };
  }
  if (p.includes('tax') || p.includes('invoice') || p.includes('client')) {
    return {
      text: t('coach.tax'),
      actions: ['Open invoices', 'Open transactions'],
    };
  }

  // Default persona-grounded greeting / nudge.
  const flow = ctx.monthlyIncome - ctx.monthlyExpense >= 0 ? t('coach.flowHealthy') : t('coach.flowTight');
  return {
    text: t('coach.default', {
      name: ctx.name.split(' ')[0],
      balance: money(ctx.totalBalance, ctx.currency),
      flow,
      role: roleLabel,
      goal,
    }),
    actions: [t('coach.promptSpending'), t('coach.promptSave'), t('coach.promptGrow')],
  };
}
