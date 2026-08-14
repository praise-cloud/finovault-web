import type { MockUser } from './db';

const DB_STORAGE_KEY = 'finovault.web.mockdb.v1';

/**
 * Persists the in-memory mock database to localStorage so users, sessions and
 * profile data survive browser reloads during Phase 0. Replaced by the real
 * backend in later phases — never the source of truth for production data.
 */
export interface MockDbSnapshot {
  users: MockUser[];
  sessions: Array<[string, string]>;
  idCounter: number;
}

export async function loadMockDbSnapshot(): Promise<MockDbSnapshot | null> {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockDbSnapshot) : null;
  } catch {
    return null;
  }
}

export function persistMockDb(snapshot: MockDbSnapshot): void {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(snapshot));
}