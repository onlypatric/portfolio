/** Gregorian date-only arithmetic. UTC is an arithmetic carrier, never a user's instant. */
export function validDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "0001-01-01" || value > "9999-12-31") return false;
  const date = new Date(value + "T12:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export const validMonth = (value: string | undefined): value is string => !!value && validDate(value + "-01");
export const dateObject = (value: string) => new Date(value + "T12:00:00Z");
export const dateString = (date: Date) => date.toISOString().slice(0, 10);
export function addDays(value: string, days: number) { const date = dateObject(value); date.setUTCDate(date.getUTCDate() + days); return dateString(date); }
export function addMonths(value: string, count: number) {
  const date = dateObject(value), day = date.getUTCDate(); date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + count);
  const last = new Date(date); last.setUTCMonth(last.getUTCMonth() + 1); last.setUTCDate(0);
  date.setUTCDate(Math.min(day, last.getUTCDate()));
  return dateString(date);
}
export function monthDates(month: string, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6) {
  const first = dateObject(month + "-01"), leading = (first.getUTCDay() - weekStartsOn + 7) % 7;
  const end = new Date(first); end.setUTCMonth(end.getUTCMonth() + 1); end.setUTCDate(0);
  return Array.from({ length: 42 }, (_, index) => {
    const day = index - leading + 1;
    return day > 0 && day <= end.getUTCDate() ? month + "-" + String(day).padStart(2, "0") : null;
  });
}
export function boundedDates(values: string[], min: string, max: string) { return [...new Set(values.filter(value => validDate(value) && value >= min && value <= max))].sort(); }
