const SESSION_STORAGE_KEY = 'finovault.web.session.v1';

/**
 * Persists the access token in localStorage so the session survives page
 * reloads. Web equivalent of SecureStore on mobile. The token is validated
 * against the mock API before the user is restored.
 */

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveStoredToken(token: string): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, token);
  } catch {
    // Storage unavailable (e.g. private mode) — session is memory-only.
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore.
  }
}