import type { Destination } from "./destinations";
import { usdToHome, fxMovementPct } from "./fx";
import { bigMacsPerHomeAmount, hasBigMacData, isBigMacEstimated, hasPliData, getPli, type PurchasingPowerIndex } from "./purchasingPower";
import type { Filters } from "../components/FilterBar";

const REFERENCE_HOME_AMOUNT_USD_EQUIV = 100; // "how far does a $100-equivalent go" - fixed yardstick

function passesCommonFilters(d: Destination, f: Filters, totalHome: number): boolean {
  if (f.hiddenGemsOnly && !d.hiddenGem) return false;
  if (!d.bestMonths.includes(f.month)) return false;
  if (f.maxBudgetHome != null && totalHome > f.maxBudgetHome) return false;
  const bestStarsOffered = Math.max(...d.minStars);
  if (bestStarsOffered < f.minStars) return false;
  return true;
}

export function rankCheapestNow(
  destinations: Destination[],
  currentRates: Record<string, number>,
  homeCurrency: string,
  f: Filters,
  index: PurchasingPowerIndex,
  flightCostsHome?: Record<string, number>
): (Destination & { totalHome: number; bigMacs: number; bigMacEstimated: boolean; pli: number | null; flightCostHome?: number })[] {
  const homeReferenceAmount = REFERENCE_HOME_AMOUNT_USD_EQUIV * currentRates[homeCurrency];
  return destinations
    .filter((d) => (index === "bigmac" ? hasBigMacData(d.currencyCode) : hasPliData(d.countryCode)))
    // When "include flights" is on, a destination with no known flight price
    // is EXCLUDED rather than assumed free/cheap - never silently treated as $0.
    .filter((d) => !f.includeFlights || (flightCostsHome && flightCostsHome[d.id] != null))
    .map((d) => {
      const bigMacs = bigMacsPerHomeAmount(currentRates, homeReferenceAmount, homeCurrency, d.currencyCode) ?? 0;
      const bigMacEstimated = isBigMacEstimated(d.currencyCode);
      const pli = getPli(d.countryCode);
      const flightCostHome = flightCostsHome?.[d.id];
      const totalHome =
        usdToHome(currentRates, d.avgDailyBudgetUSD * f.days, homeCurrency) + (f.includeFlights ? flightCostHome ?? 0 : 0);
      return { ...d, totalHome, bigMacs, bigMacEstimated, pli, flightCostHome };
    })
    .filter((d) => isFinite(d.totalHome) && passesCommonFilters(d, f, d.totalHome))
    .sort((a, b) => {
      if (f.includeFlights) return a.totalHome - b.totalHome; // total trip cost dominates once flights are in
      if (index === "pli") return (a.pli ?? Infinity) - (b.pli ?? Infinity); // lower PLI = cheaper
      return b.bigMacs - a.bigMacs; // more burgers for your money = cheaper for you
    });
}

export function rankBiggestMovers(
  destinations: Destination[],
  currentRates: Record<string, number>,
  pastRates: Record<string, number>,
  homeCurrency: string,
  f: Filters
): (Destination & { totalHome: number; movementPct: number })[] {
  return destinations
    .filter((d) => pastRates[d.currencyCode] != null)
    .map((d) => ({
      ...d,
      totalHome: usdToHome(currentRates, d.avgDailyBudgetUSD * f.days, homeCurrency),
      movementPct: fxMovementPct(currentRates, pastRates, homeCurrency, d.currencyCode),
    }))
    .filter((d) => isFinite(d.totalHome) && isFinite(d.movementPct) && passesCommonFilters(d, f, d.totalHome))
    .sort((a, b) => b.movementPct - a.movementPct);
}
