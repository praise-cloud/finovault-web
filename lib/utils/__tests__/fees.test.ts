import { describe, expect, it } from 'vitest';
import { computeTransferFee, computePensionProjection } from '../fees';
import type { PensionPlan } from '@/types';

describe('computeTransferFee', () => {
  it('is 1.5% clamped to [20, 500]', () => {
    expect(computeTransferFee(100)).toBe(20);
    expect(computeTransferFee(5000)).toBe(75);
    expect(computeTransferFee(100000)).toBe(500);
    expect(computeTransferFee(2000)).toBe(30);
  });
});

describe('computePensionProjection', () => {
  it('projects short and long pots with compounding', () => {
    const plan: PensionPlan = {
      id: 'p',
      shortPotTarget: 50000,
      longPotTarget: 750000,
      frequency: 'monthly',
      contributionAmount: 2500,
      currentShortPot: 18500,
      currentLongPot: 42000,
      assumedReturnPct: 7,
      inflationPct: 4,
      currentAge: 34,
      retirementAge: 65,
      autoDebit: true,
    };
    const proj = computePensionProjection(plan);
    expect(proj.yearsToRetirement).toBe(31);
    expect(proj.totalProjected).toBeGreaterThan(proj.shortPotProjected + 0);
    expect(proj.shortPotProjected).toBeGreaterThan(0);
    expect(proj.longPotProjected).toBeGreaterThan(0);
  });

  it('returns 0 projection for a missing-equivalent plan at retirement age', () => {
    const plan: PensionPlan = {
      id: 'p',
      shortPotTarget: 50000,
      longPotTarget: 750000,
      frequency: 'monthly',
      contributionAmount: 2500,
      currentShortPot: 0,
      currentLongPot: 0,
      assumedReturnPct: 7,
      inflationPct: 4,
      currentAge: 65,
      retirementAge: 65,
      autoDebit: false,
    };
    const proj = computePensionProjection(plan);
    expect(proj.yearsToRetirement).toBe(0);
    expect(proj.totalProjected).toBe(0);
  });
});
