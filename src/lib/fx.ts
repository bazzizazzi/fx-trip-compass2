import currencies from "../data/currencies.json";

export type Currency = {
  code: string;
  name: string;
  symbol: string;
  region: string;
  usdRate: number;
  usdRateYearAgo: number;
  usdRate5yAgo: number;
};

const BY_CODE: Record<string, Currency> = Object.fromEntries(
  (currencies as Currency[]).map((c) => [c.code, c])
);

export function getCurrency(code: string): Currency {
  const c = BY_CODE[code];
  if (!c) throw new Error(`Unknown currency code: ${code}`);
  return c;
}

export function listCurrencies(): Currency[] {
  return currencies as Currency[];
}

/**
 * The one convention every rate in currencies.json follows:
 * usdRate = units of THIS currency per 1 USD (i.e. "USD -> X").
 *
 * To convert home currency H -> destination currency D we ALWAYS go through
 * USD as the pivot, using the full unrounded rate for both legs:
 *
 *   1 USD  = usdRate[H] units of H   =>  1 unit of H = 1 / usdRate[H] USD
 *   1 USD  = usdRate[D] units of D
 *   =>  1 unit of H = (usdRate[D] / usdRate[H]) units of D
 *
 * So: unitsOfDestinationPerHomeUnit = usdRate[D] / usdRate[H]
 *
 * Worked example from the brief: ILS -> JPY, no ILS/JPY pair stored anywhere.
 *   usdRate[JPY] = 157.82 (157.82 yen buy 1 dollar)
 *   usdRate[ILS] = 3.702  (3.702 shekel buy 1 dollar)
 *   1 ILS = 157.82 / 3.702 = 42.6256... yen
 * This matches reality (1 ILS is worth roughly 40-45 yen) and never rounds
 * either leg before dividing, exactly per the brief's warning about 157.8 vs
 * 157.82 drifting the result.
 */
export function crossRate(
  homeCode: string,
  destCode: string,
  at: "usdRate" | "usdRateYearAgo" | "usdRate5yAgo" = "usdRate"
): number {
  const home = getCurrency(homeCode);
  const dest = getCurrency(destCode);
  return dest[at] / home[at];
}

/** Convert an amount in home currency into destination currency, full precision. */
export function convert(amount: number, homeCode: string, destCode: string): number {
  return amount * crossRate(homeCode, destCode);
}

/** Convert a USD-denominated budget figure into the traveler's home currency. */
export function usdToHome(amountUsd: number, homeCode: string): number {
  const home = getCurrency(homeCode);
  return amountUsd * home.usdRate;
}

/**
 * % change in how many units of destination currency 1 unit of home currency buys,
 * comparing "now" against a past snapshot. A POSITIVE number means the home
 * currency buys MORE of the destination currency than before => that destination
 * got cheaper for this traveler due to FX movement alone.
 */
export function fxMovementPct(
  homeCode: string,
  destCode: string,
  period: "1y" | "5y"
): number {
  const now = crossRate(homeCode, destCode, "usdRate");
  const past = crossRate(homeCode, destCode, period === "1y" ? "usdRateYearAgo" : "usdRate5yAgo");
  return ((now - past) / past) * 100;
}

/** Format a number the way currency amounts should read - never truncate to a fake-precise 1-2 decimals for high-value currencies like JPY/KRW/VND. */
export function formatAmount(value: number, currencyCode: string): string {
  const noDecimalCurrencies = new Set(["JPY", "KRW", "VND", "IDR", "CLP", "HUF", "COP", "ARS", "LAK", "KHR"]);
  const decimals = noDecimalCurrencies.has(currencyCode) ? 0 : 2;
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
