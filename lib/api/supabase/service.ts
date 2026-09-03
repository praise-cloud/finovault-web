import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@/types/api';
import { fail } from './helpers';
import * as auth from './auth';
import * as res from './resources';

/**
 * BFF request dispatcher. Parses the path and method to select the correct
 * handler, mirroring the mock/handlers.ts route table against Supabase.
 */
export async function handleBffRequest(
  supabase: SupabaseClient,
  method: string,
  path: string,
  body: unknown,
  token: string | null
): Promise<ApiResponse<unknown>> {
  try {
    // strip query string for matching, keep it for parameterised routes
    const [pathname, queryString] = path.split('?');
    const segments = pathname.split('/').filter(Boolean); // e.g. ['auth','login']

    const first = segments[0] ?? '';
    const second = segments[1] ?? '';
    const third = segments[2] ?? '';
    const fourth = segments[3] ?? '';

    // ── auth ──────────────────────────────────────────────────────────────
    if (first === 'auth') {
      if (method === 'POST' && second === 'signup') return auth.signup(supabase, body);
      if (method === 'POST' && second === 'login') return auth.login(supabase, body);
      if (method === 'POST' && second === 'logout') return auth.logout(supabase, token);
      if (method === 'GET' && second === 'session') return auth.getSession(supabase, token);
      if (method === 'POST' && second === 'forgot-password') return auth.forgotPassword(supabase, body);
      if (method === 'POST' && second === 'reset-password') return auth.resetPassword(supabase, body);
    }

    // ── users ─────────────────────────────────────────────────────────────
    if (first === 'users') {
      if (method === 'GET' && second === 'me') return res.getMe(supabase, token);
      if (method === 'PATCH' && second === 'me') return res.updateMe(supabase, token, body);
      if (method === 'GET' && second === 'preferences') return res.getPreferences(supabase, token);
      if (method === 'PUT' && second === 'preferences') return res.savePreferences(supabase, token, body);
      if (method === 'PUT' && second === 'role') return res.setRole(supabase, token, body);
      if (method === 'PUT' && second === 'business-profile') return res.setBusinessProfile(supabase, token, body);
    }

    // ── accounts ──────────────────────────────────────────────────────────
    if (first === 'accounts') {
      if (method === 'GET' && segments.length === 1) return res.listAccounts(supabase, token);
      if (method === 'POST' && segments.length === 1) return res.createAccount(supabase, token, body);
      if (method === 'DELETE' && segments.length === 2) return res.deleteAccount(supabase, token, second);
    }

    // ── transactions ──────────────────────────────────────────────────────
    if (first === 'transactions') {
      if (method === 'GET' && segments.length === 1) {
        const limit = parseInt(queryString?.match(/limit=(\d+)/)?.[1] ?? '50', 10) || 50;
        return res.listTransactions(supabase, token, limit);
      }
      if (method === 'POST' && segments.length === 1) return res.createTransaction(supabase, token, body);
    }

    // ── budgets ───────────────────────────────────────────────────────────
    if (first === 'budgets') {
      if (method === 'GET' && segments.length === 1) return res.listBudgets(supabase, token);
      if (method === 'POST' && segments.length === 1) return res.upsertBudget(supabase, token, body);
    }

    // ── goals ─────────────────────────────────────────────────────────────
    if (first === 'goals') {
      if (method === 'GET' && segments.length === 1) return res.listGoals(supabase, token);
      if (method === 'GET' && segments.length === 2) return res.getGoal(supabase, token, second);
      if (method === 'POST' && segments.length === 1) return res.createGoal(supabase, token, body);
      if (method === 'POST' && second && third === 'contribute') {
        return res.contributeToGoal(supabase, token, second, body);
      }
    }

    // ── pension ───────────────────────────────────────────────────────────
    if (first === 'pension') {
      if (method === 'GET' && segments.length === 1) return res.getPension(supabase, token);
      if (method === 'PUT' && segments.length === 1) return res.upsertPension(supabase, token, body);
      if (method === 'GET' && second === 'projection') return res.getPensionProjection(supabase, token);
      if (method === 'GET' && second === 'contributions') return res.listPensionContributions(supabase, token);
      if (method === 'POST' && second === 'contribute') return res.contributeToPension(supabase, token, body);
    }

    // ── security ──────────────────────────────────────────────────────────
    if (first === 'security') {
      if (method === 'GET' && second === 'overview') return res.getSecurityOverview(supabase, token);
      if (method === 'PUT' && second === '2fa') return res.toggle2fa(supabase, token, body);
      if (method === 'POST' && second === 'change-password') return res.changePassword(supabase, token, body);
      if (method === 'GET' && second === 'devices') return res.listDevices(supabase, token);
      if (method === 'GET' && second === 'events') return res.listSecurityEvents(supabase, token);
      if (method === 'POST' && second === 'events' && third && fourth === 'resolve') {
        return res.resolveSecurityEvent(supabase, token, third);
      }
    }

    // ── invoices ──────────────────────────────────────────────────────────
    if (first === 'invoices') {
      if (method === 'GET' && segments.length === 1) return res.listInvoices(supabase, token);
      if (method === 'POST' && segments.length === 1) return res.createInvoice(supabase, token, body);
      if (method === 'PATCH' && second && third === 'status') {
        return res.updateInvoiceStatus(supabase, token, second, body);
      }
    }

    // ── vendors ───────────────────────────────────────────────────────────
    if (first === 'vendors') {
      if (method === 'GET' && segments.length === 1) return res.listVendors(supabase, token);
      if (method === 'POST' && segments.length === 1) return res.createVendor(supabase, token, body);
    }

    // ── transfers & payees ────────────────────────────────────────────────
    if (first === 'transfers') {
      if (method === 'GET' && segments.length === 1) return res.listTransfers(supabase, token);
      if (method === 'GET' && segments.length === 2) return res.getTransfer(supabase, token, second);
      if (method === 'POST' && segments.length === 1) return res.createTransfer(supabase, token, body);
    }
    if (first === 'payees') {
      if (method === 'GET' && segments.length === 1) return res.listPayees(supabase, token);
      if (method === 'POST' && segments.length === 1) return res.createPayee(supabase, token, body);
    }

    // ── bills ─────────────────────────────────────────────────────────────
    if (first === 'bills') {
      if (method === 'GET' && segments.length === 1) return res.listBills(supabase, token);
      if (method === 'POST' && second === 'schedule') return res.scheduleBill(supabase, token, body);
      if (method === 'POST' && segments.length === 1) return res.payBill(supabase, token, body);
    }

    return fail('NOT_FOUND', `No BFF route for ${method} ${path}.`);
  } catch (err) {
    if (err && typeof err === 'object' && 'success' in err) return err as ApiResponse<never>;
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return fail('INTERNAL', message);
  }
}
