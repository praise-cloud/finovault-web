import type { PrimaryRole } from '@/types';

/**
 * DESIGN.md §6.4 — persona accent vars.
 * Each home shell sets data-role="<role>"; globals.css maps it to the
 * --fv-role-accent/-strong/-wash custom properties consumed via var().
 * ponytail: all four personas share one var() mapping — swap for per-role
 * values if a persona diverges from the shared trio.
 */
export const ROLE_VARS: Record<PrimaryRole, { accent: string; strong: string; wash: string }> = {
  individual: { accent: 'var(--fv-role-accent)', strong: 'var(--fv-role-strong)', wash: 'var(--fv-role-wash)' },
  freelancer: { accent: 'var(--fv-role-accent)', strong: 'var(--fv-role-strong)', wash: 'var(--fv-role-wash)' },
  entrepreneur: { accent: 'var(--fv-role-accent)', strong: 'var(--fv-role-strong)', wash: 'var(--fv-role-wash)' },
  sme: { accent: 'var(--fv-role-accent)', strong: 'var(--fv-role-strong)', wash: 'var(--fv-role-wash)' },
};