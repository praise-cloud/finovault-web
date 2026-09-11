import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse, ApiError } from '@/types/api';
import { savePreferences, changePassword } from '../resources';
import { hashPassword } from '../auth';

const USER_ID = 'user-123';
const TOKEN = 'tok-abc';

// Chainable Supabase mock builder
function createSupabaseMock(opts: {
  existingPrefs?: Record<string, unknown> | null;
  upsertData?: Record<string, unknown>;
  userError?: boolean;
}) {
  const { existingPrefs = null, upsertData } = opts;
  let capturedUpsertPayload: Record<string, unknown> | null = null;

  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    upsert: vi.fn().mockReturnThis(),
  };

  // First from('user_preferences').select...single → returns existing
  chain.single.mockResolvedValue({ data: existingPrefs, error: null });
  chain.upsert.mockImplementation((payload: Record<string, unknown>) => {
    capturedUpsertPayload = payload;
    // After upsert, select().single() returns the upserted row
    chain.single.mockResolvedValueOnce({
      data: upsertData ?? payload,
      error: null,
    });
    return chain;
  });

  const fromTable = vi.fn().mockReturnValue(chain);

  return {
    client: { from: fromTable },
    chain,
    getCapturedUpsertPayload: () => capturedUpsertPayload,
  };
}

function createFailSupabase() {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } }),
  };
  return { client: { from: vi.fn().mockReturnValue(chain) } };
}

// Minimal mock for requireUserId (reads sessions table)
function stubAuth(supabase: ReturnType<typeof createSupabaseMock>['client']) {
  // Patch: first from() call should be 'sessions' for requireUserId
  const origFrom = supabase.from;
  let callCount = 0;
  const sessionsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { user_id: USER_ID } }),
  };
  supabase.from = vi.fn().mockImplementation((table: string) => {
    callCount++;
    if (table === 'sessions') return sessionsChain;
    return origFrom(table);
  });
}

describe('savePreferences', () => {
  it('preserves existing onboarding_completed on partial update', async () => {
    const existing = {
      user_id: USER_ID,
      financial_goals: ['goal1'],
      risk_tolerance: 'conservative',
      money_fears: [],
      onboarding_completed: true,
    };
    const mock = createSupabaseMock({ existingPrefs: existing });
    stubAuth(mock.client);

    // Send only riskTolerance — should NOT reset onboarding_completed
    const result = await savePreferences(mock.client as unknown as SupabaseClient, TOKEN, {
      riskTolerance: 'aggressive',
    });

    expect(result.success).toBe(true);
    const payload = mock.getCapturedUpsertPayload()!;
    // onboarding_completed should NOT be in the upsert payload (undefined → not set)
    expect(payload.onboarding_completed).toBeUndefined();
    // financial_goals and money_fears preserved from existing
    expect(payload.financial_goals).toEqual(['goal1']);
    expect(payload.money_fears).toEqual([]);
    expect(payload.risk_tolerance).toBe('aggressive');
  });

  it('respects explicit onboarding_completed: true', async () => {
    const existing = {
      user_id: USER_ID,
      financial_goals: [],
      risk_tolerance: 'moderate',
      money_fears: [],
      onboarding_completed: false,
    };
    const mock = createSupabaseMock({ existingPrefs: existing });
    stubAuth(mock.client);

    await savePreferences(mock.client as unknown as SupabaseClient, TOKEN, {
      onboardingCompleted: true,
      riskTolerance: 'moderate',
    });

    const payload = mock.getCapturedUpsertPayload()!;
    expect(payload.onboarding_completed).toBe(true);
  });

  it('respects explicit onboarding_completed: false', async () => {
    const existing = {
      user_id: USER_ID,
      financial_goals: [],
      risk_tolerance: 'moderate',
      money_fears: [],
      onboarding_completed: true,
    };
    const mock = createSupabaseMock({ existingPrefs: existing });
    stubAuth(mock.client);

    await savePreferences(mock.client as unknown as SupabaseClient, TOKEN, {
      onboardingCompleted: false,
      riskTolerance: 'moderate',
    });

    const payload = mock.getCapturedUpsertPayload()!;
    expect(payload.onboarding_completed).toBe(false);
  });

  it('merges only provided keys, falls back to existing', async () => {
    const existing = {
      user_id: USER_ID,
      financial_goals: ['save', 'invest'],
      risk_tolerance: 'aggressive',
      money_fears: ['debt'],
      onboarding_completed: true,
    };
    const mock = createSupabaseMock({ existingPrefs: existing });
    stubAuth(mock.client);

    await savePreferences(mock.client as unknown as SupabaseClient, TOKEN, {
      financialGoals: ['retire'],
    });

    const payload = mock.getCapturedUpsertPayload()!;
    expect(payload.financial_goals).toEqual(['retire']);
    expect(payload.risk_tolerance).toBe('aggressive'); // preserved from existing
    expect(payload.money_fears).toEqual(['debt']); // preserved from existing
  });

  it('uses defaults when no existing prefs and no body fields', async () => {
    const mock = createSupabaseMock({ existingPrefs: null });
    stubAuth(mock.client);

    await savePreferences(mock.client as unknown as SupabaseClient, TOKEN, {});

    const payload = mock.getCapturedUpsertPayload()!;
    expect(payload.financial_goals).toEqual([]);
    expect(payload.risk_tolerance).toBe('moderate');
    expect(payload.money_fears).toEqual([]);
  });

  it('handles read failure (sessions lookup fails)', async () => {
    const supabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'no session' } }),
      }),
    };

    // requireUserId throws a fail() envelope when session is not found
    await expect(savePreferences(supabase as unknown as SupabaseClient, TOKEN, { riskTolerance: 'low' })).rejects.toSatisfy(
      (thrown: { success: boolean; error: { code: string } }) =>
        thrown.success === false && thrown.error.code === 'UNAUTHORIZED',
    );
  });
});

// ── changePassword ──────────────────────────────────────────────────────────

// Builder for changePassword's table access:
// sessions → users (select single, update) → security_events (insert, select) →
// security_overviews (select single, upsert)
function createChangePasswordMock(opts: { storedHash: string }) {
  let capturedUpdatePayload: Record<string, unknown> | null = null;

  const sessionsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { user_id: USER_ID }, error: null }),
  };

  const usersChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { password_hash: opts.storedHash }, error: null }),
    update: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
      capturedUpdatePayload = payload;
      return usersChain;
    }),
  };

  const securityEventsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  const securityOverviewsChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
  };

  const fromTable = vi.fn().mockImplementation((table: string) => {
    switch (table) {
      case 'sessions':
        return sessionsChain;
      case 'users':
        return usersChain;
      case 'security_events':
        return securityEventsChain;
      case 'security_overviews':
        return securityOverviewsChain;
      default:
        throw new Error(`Unexpected table: ${table}`);
    }
  });

  return {
    client: { from: fromTable },
    getCapturedUpdatePayload: () => capturedUpdatePayload,
  };
}

describe('changePassword', () => {
  it('returns INCORRECT_PASSWORD when current password is wrong', async () => {
    const stored = await hashPassword('old-correct-123');
    const mock = createChangePasswordMock({ storedHash: `${stored.salt}:${stored.hash}` });

    const result = await changePassword(mock.client as unknown as SupabaseClient, TOKEN, {
      currentPassword: 'wrong-password',
      newPassword: 'new-password-123',
    });

    expect(result.success).toBe(false);
    expect((result as unknown as { error: { code: string } }).error.code).toBe('INCORRECT_PASSWORD');
    expect(mock.getCapturedUpdatePayload()).toBeNull();
  });

  it('stores new password as salt:hash, never plaintext or the raw input', async () => {
    const stored = await hashPassword('old-correct-123');
    const mock = createChangePasswordMock({ storedHash: `${stored.salt}:${stored.hash}` });

    const result = await changePassword(mock.client as unknown as SupabaseClient, TOKEN, {
      currentPassword: 'old-correct-123',
      newPassword: 'brand-new-pass-456',
    });

    expect(result.success).toBe(true);
    const payload = mock.getCapturedUpdatePayload()!;
    expect(payload.password_hash).toBeDefined();
    expect(payload.password_hash).not.toBe('brand-new-pass-456'); // not plaintext
    expect(typeof payload.password_hash).toBe('string');
    const [salt, hash] = (payload.password_hash as string).split(':');
    expect(salt).toBeTruthy();
    expect(hash).toBeTruthy();
  });
});
