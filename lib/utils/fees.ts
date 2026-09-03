import type { PensionPlan, PensionProjection, SecurityEvent, SecurityOverview } from '@/types';

/**
 * Transfer processing fee: 1.5% of the amount, clamped to [MUR 20, MUR 500].
 * Mirrors finovault-flutter/lib/core/format.dart + billing the money screen.
 */
export function computeTransferFee(amount: number): number {
  const rate = 0.015;
  const minFee = 20;
  const maxFee = 500;
  return Math.min(Math.max(amount * rate, minFee), maxFee);
}

/**
 * Simple pension projection: monthly compounding at the assumed nominal return,
 * discounted to today's money by the inflation assumption. Short + long pot split.
 */
export function computePensionProjection(plan: PensionPlan): PensionProjection {
  const years = Math.max(0, Math.min(100, plan.retirementAge - plan.currentAge));
  const months = years * 12;
  const frequencyMultiplier =
    plan.frequency === 'daily' ? 30 : plan.frequency === 'weekly' ? 4.33 : 1;
  const monthly = plan.contributionAmount * frequencyMultiplier;
  const r = plan.assumedReturnPct / 100 / 12;

  function futureValue(start: number): number {
    if (months <= 0 || monthly <= 0) return start;
    const factor = r === 0 ? months : (Math.pow(1 + r, months) - 1) / r;
    return start + monthly * factor;
  }

  const shortNominal = futureValue(plan.currentShortPot);
  const longNominal = futureValue(plan.currentLongPot);
  const inflFactor = Math.pow(1 + plan.inflationPct / 100, years);
  const realShort = inflFactor > 0 ? shortNominal / inflFactor : shortNominal;
  const realLong = inflFactor > 0 ? longNominal / inflFactor : longNominal;
  return {
    shortPotProjected: realShort,
    longPotProjected: realLong,
    totalProjected: realShort + realLong,
    yearsToRetirement: years,
  };
}

/** Security score assigned to a user's events + 2FA status. */
export function computeSecurityScore(
  events: SecurityEvent[],
  overview: SecurityOverview | undefined
): number {
  const open = events.filter((e) => !e.resolved);
  const twoFactor = overview?.twoFactorEnabled ?? false;
  let score = 100 - (twoFactor ? 0 : 20);
  for (const e of open) {
    score -= e.severity === 'high' ? 15 : e.severity === 'medium' ? 8 : 3;
  }
  return Math.min(99, Math.max(5, score));
}
