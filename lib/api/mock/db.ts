import type { UserPreferences, UserProfile } from '@/types';
import { loadMockDbSnapshot, persistMockDb, MockDbSnapshot } from './persistence';

/**
 * Mock in-memory persistence for the web companion app.
 * Mirrors finovault-mobile/lib/api/mock/db.ts and docs/17-DATA-MODEL.md.
 * NOT for production — replaced by the real backend (Supabase) in later phases.
 */

export interface MockUser {
  profile: UserProfile;
  password: string;
  prefs: UserPreferences;
}

const users = new Map<string, MockUser>(); // key: email
const sessions = new Map<string, string>(); // token -> user id

let idCounter = 1;

function snapshot(): MockDbSnapshot {
  return {
    users: Array.from(users.values()),
    sessions: Array.from(sessions.entries()),
    idCounter,
  };
}

/** Restore the persisted database (called once before any request). */
export async function hydrateMockDb(): Promise<void> {
  const persisted = await loadMockDbSnapshot();
  if (!persisted) return;
  users.clear();
  sessions.clear();
  for (const user of persisted.users) users.set(user.profile.email, user);
  for (const [token, userId] of persisted.sessions) sessions.set(token, userId);
  idCounter = persisted.idCounter || 1;
}

function save(): void {
  persistMockDb(snapshot());
}

export function nextId(): string {
  return `usr_${String(idCounter++).padStart(6, '0')}`;
}

export function findUserByEmail(email: string): MockUser | undefined {
  return users.get(email.toLowerCase().trim());
}

export function findUserById(id: string): MockUser | undefined {
  for (const user of users.values()) {
    if (user.profile.id === id) return user;
  }
  return undefined;
}

export function createUser(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}): MockUser {
  const id = nextId();
  const user: MockUser = {
    profile: {
      id,
      email: params.email.toLowerCase().trim(),
      fullName: params.fullName.trim(),
      preferredLanguage: 'en',
      preferredCurrency: 'MUR',
      primaryRole: 'individual',
      secondaryRoles: [],
      scheme: 'standard',
      createdAt: new Date().toISOString(),
    },
    password: params.password,
    prefs: {
      financialGoals: [],
      riskTolerance: 'moderate',
      onboardingCompleted: false,
    },
  };
  users.set(user.profile.email, user);
  save();
  return user;
}

export function updateProfile(id: string, patch: Partial<UserProfile>): UserProfile {
  const user = findUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  user.profile = { ...user.profile, ...patch };
  save();
  return user.profile;
}

export function updatePrefs(id: string, patch: Partial<UserPreferences>): UserPreferences {
  const user = findUserById(id);
  if (!user) throw new Error('USER_NOT_FOUND');
  user.prefs = { ...user.prefs, ...patch };
  save();
  return user.prefs;
}

export function createSession(userId: string): string {
  const token = `mock_jwt_${userId}_${Date.now()}`;
  sessions.set(token, userId);
  save();
  return token;
}

export function getUserByToken(token: string): MockUser | undefined {
  const userId = sessions.get(token);
  return userId ? findUserById(userId) : undefined;
}

export function revokeSession(token: string): void {
  sessions.delete(token);
  save();
}

/** Seed a demo account for convenience during Phase 0 development. */
export function seedDemoUser(): void {
  if (findUserByEmail('demo@finovault.app')) return;
  const user = createUser({
    email: 'demo@finovault.app',
    password: 'Vault123!',
    fullName: 'Amina Diallo',
  });
  updateProfile(user.profile.id, { primaryRole: 'entrepreneur', scheme: 'female_founder' });
  updatePrefs(user.profile.id, {
    financialGoals: ['retirement', 'business'],
    riskTolerance: 'high',
    onboardingCompleted: true,
  });
}