import bigmacData from "../data/bigmac.json";

type BigMacEntry = { localPrice: number; source: "economist-2026-07" | "gdp-estimated"; countryName: string | null };
const PRICES = (bigmacData as { prices: Record<string, BigMacEntry> }).prices;

export function hasBigMacData(currencyCode: string): boolean {
  return PRICES[currencyCode] != null;
}

export function isBigMacEstimated(currencyCode: string): boolean {
  return PRICES[currencyCode]?.source === "gdp-estimated";
}

/**
 * How many Big Macs does a fixed amount of home currency buy in the destination?
 * Uses the SAME USD-pivot, full-precision convention as fx.ts - rates here are
 * "units of currency per 1 USD", so:
 *
 *   destAmount = homeAmount * (rates[destCurrency] / rates[homeCurrency])
 *   numBigMacs = destAmount / localBigMacPrice[destCurrency]
 *
 * This is intentionally currency-personalized: it answers "how far does MY money
 * go there", not the currency-agnostic "how much is a Big Mac in USD" figure.
 * The result is the only thing ever shown to the user - never the intermediate
 * formula/prices, per product requirement.
 */
export function bigMacsPerHomeAmount(
  rates: Record<string, number>,
  homeAmount: number,
  homeCurrency: string,
  destCurrency: string
): number | null {
  const entry = PRICES[destCurrency];
  if (!entry) return null;
  const homeRate = rates[homeCurrency];
  const destRate = rates[destCurrency];
  if (homeRate == null || destRate == null) return null;
  const destAmount = homeAmount * (destRate / homeRate);
  return destAmount / entry.localPrice;
}
