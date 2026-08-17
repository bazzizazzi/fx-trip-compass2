export const MONTH_NAMES_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

export function currentMonth(): number {
  return new Date().getMonth() + 1;
}

/** Build a plausible near-future date range for a deep-link, given a target month and trip length. */
export function dateRangeForMonth(month: number, days: number): { checkin: string; checkout: string } {
  const now = new Date();
  let year = now.getFullYear();
  if (month < now.getMonth() + 1) year += 1; // roll to next year if month already passed
  const checkin = new Date(year, month - 1, 10);
  const checkout = new Date(checkin);
  checkout.setDate(checkout.getDate() + days);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { checkin: fmt(checkin), checkout: fmt(checkout) };
}
