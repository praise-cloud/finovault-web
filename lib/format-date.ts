export function fvDate(date: string | Date | null | undefined, locale = 'en'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(`${date}T00:00:00`) : date;
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
}