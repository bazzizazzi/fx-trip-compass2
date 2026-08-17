import { getCurrencyMeta } from "./fxLive";

/**
 * All cross-currency math goes through a RatesSnapshot: { rates: {CODE: units per 1 USD}, ... }
 * fetched live at runtime (see fxLive.ts). We NEVER hardcode pair rates - everything is
 * derived from the USD leg at full precision, exactly like the brief originally asked:
 *
 *   unitsOfDestinationPerHomeUnit = rates[DEST] / rates[HOME]
 *
 * Worked example: ILS -> THB, no direct pair stored anywhere.
 *   rates[THB] = 33.126984, rates[ILS] = 2.957027
 *   1 ILS = 33.126984 / 2.957027 = 11.203... THB
 * This matches real-world reality (confirmed against live data on 2026-08-16).
 */

export function crossRate(rates: Record<string, number>, homeCode: string, destCode: string): number {
  const h = rates[homeCode];
  const d = rates[destCode];
  if (h == null || d == null) return NaN;
  return d / h;
}

export function convert(rates: Record<string, number>, amount: number, homeCode: string, destCode: string): number {
  return amount * crossRate(rates, homeCode, destCode);
}

export function usdToHome(rates: Record<string, number>, amountUsd: number, homeCode: string): number {
  const h = rates[homeCode];
  if (h == null) return NaN;
  return amountUsd * h;
}

/**
 * % change in how many units of destination currency 1 unit of home currency buys,
 * comparing "now" vs a past snapshot. POSITIVE = home currency buys MORE of the
 * destination currency than before => that destination got cheaper due to FX alone.
 */
export function fxMovementPct(
  nowRates: Record<string, number>,
  pastRates: Record<string, number>,
  homeCode: string,
  destCode: string
): number {
  const now = crossRate(nowRates, homeCode, destCode);
  const past = crossRate(pastRates, homeCode, destCode);
  if (!isFinite(now) || !isFinite(past) || past === 0) return NaN;
  return ((now - past) / past) * 100;
}

const NO_DECIMAL_CURRENCIES = new Set(["JPY", "KRW", "VND", "IDR", "CLP", "HUF", "COP", "ARS", "LAK", "KHR", "MNT"]);

export function formatAmount(value: number, currencyCode: string): string {
  const decimals = NO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export { getCurrencyMeta };
export { getCurrencyMeta as getCurrency };
