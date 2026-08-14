import { initMockApi, setMockLatency } from '@/lib/api';
import { useAuthStore } from '../auth-store';

const DEMO_EMAIL = 'demo@finovault.app';
const DEMO_PASSWORD = 'Vault123!';

function resetStore() {
  useAuthStore.setState({
    user: null,
    session: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
  });
}

beforeAll(async () => {
  setMockLatency(0);
  await initMockApi();
});

beforeEach(() => {
  localStorage.clear();
  resetStore();
  vi.restoreAllMocks();
});

describe('auth-store', () => {
  it('logs in a demo user and sets an authenticated session', async () => {
    await useAuthStore.getState().login(DEMO_EMAIL, DEMO_PASSWORD);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe(DEMO_EMAIL);
    expect(state.session?.accessToken).toBeTruthy();
    expect(localStorage.getItem('finovault.web.session.v1')).toBeTruthy();
  });

  it('signs up a new user', async () => {
    await useAuthStore.getState().signup({
      fullName: 'Test Person',
      email: 'person@example.com',
      password: 'Vault123!',
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.fullName).toBe('Test Person');
  });

  it('rejects invalid credentials', async () => {
    await expect(
      useAuthStore.getState().login(DEMO_EMAIL, 'wrong-password')
    ).rejects.toThrow();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('logs out and clears the session', async () => {
    await useAuthStore.getState().login(DEMO_EMAIL, DEMO_PASSWORD);
    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(localStorage.getItem('finovault.web.session.v1')).toBeNull();
  });

  it('restores a stored session on reload', async () => {
    await useAuthStore.getState().login(DEMO_EMAIL, DEMO_PASSWORD);
    const token = useAuthStore.getState().session?.accessToken as string;
    resetStore();
    expect(localStorage.getItem('finovault.web.session.v1')).toBe(token);

    const restored = await useAuthStore.getState().restoreSession();
    expect(restored).toBe(true);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe(DEMO_EMAIL);
  });

  it('does not restore when no token is stored', async () => {
    const restored = await useAuthStore.getState().restoreSession();
    expect(restored).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('discards an invalid stored token', async () => {
    localStorage.setItem('finovault.web.session.v1', 'stale-bogus-token');
    const restored = await useAuthStore.getState().restoreSession();
    expect(restored).toBe(false);
    expect(localStorage.getItem('finovault.web.session.v1')).toBeNull();
  });
});