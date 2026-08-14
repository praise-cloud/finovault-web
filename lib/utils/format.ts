import { getLanguage } from '../i18n';

export interface FormatOptions {
  locale?: string;
  currency?: string;
}

function resolveLocale(locale?: string): string {
  if (locale) return locale;
  const lang = getLanguage();
  return lang === 'fr' ? 'fr-FR' : 'en-GB';
}

export function formatMoney(amount: number, currency: string, options?: FormatOptions): string {
  try {
    return new Intl.NumberFormat(resolveLocale(options?.locale), {
      style: 'currency',
      currency,
      currencyDisplay: 'code',
    }).format(amount);
  } catch {
    return `${currency} ${formatNumber(amount, options)}`;
  }
}

export function formatNumber(value: number, options?: FormatOptions): string {
  return new Intl.NumberFormat(resolveLocale(options?.locale), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat(resolveLocale(), {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
    notation: 'compact',
  }).format(amount);
}

export function formatDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(resolveLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeTime(date: Date | string | number, language = getLanguage()): string {
  const d = date instanceof Date ? date : new Date(date);
  const rtf = new Intl.RelativeTimeFormat(language === 'fr' ? 'fr' : 'en', { numeric: 'auto' });
  const diffMs = d.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
  return rtf.format(Math.round(diffDay / 30), 'month');
}

export function formatPercent(value: number, language = getLanguage()): string {
  return new Intl.NumberFormat(language === 'fr' ? 'fr' : 'en', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100);
}