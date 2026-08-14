import { formatCompactCurrency, formatDate, formatMoney, formatPercent, formatRelativeTime } from '../format';

describe('formatMoney', () => {
  it('formats with a currency code', () => {
    const out = formatMoney(125000, 'MUR', { locale: 'en-GB' });
    // Intl separates code and amount with a non-breaking space.
    expect(out.replace(/\u00a0/g, ' ')).toBe('MUR 125,000.00');
  });

  it('respects a French locale', () => {
    const out = formatMoney(25.5, 'MUR', { locale: 'fr-FR' });
    expect(out).toContain('MUR');
    expect(out).toContain('25');
  });
});

describe('formatCompactCurrency', () => {
  it('compact-formats large amounts', () => {
    const out = formatCompactCurrency(1_250_000, 'MUR');
    expect(out).toContain('MUR');
  });
});

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    const out = formatDate('2026-08-08T10:00:00.000Z');
    expect(out).toContain('2026');
    expect(out).toContain('Aug');
  });
});

describe('formatRelativeTime', () => {
  it('describes seconds as "now"', () => {
    expect(formatRelativeTime(new Date(), 'en')).toMatch(/now/);
  });

  it('describes past hours', () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    expect(formatRelativeTime(new Date(twoHoursAgo), 'en')).toMatch(/2 hours ago/);
  });
});

describe('formatPercent', () => {
  it('converts 0-100 scale to a percentage string', () => {
    expect(formatPercent(50, 'en')).toBe('50%');
  });
});