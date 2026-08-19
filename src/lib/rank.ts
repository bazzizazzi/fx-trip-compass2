import type { Destination } from "./destinations";
import { usdToHome, fxMovementPct } from "./fx";
import { bigMacsPerHomeAmount, hasBigMacData } from "./purchasingPower";
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
  flightCostsHome?: Record<string, number> // destId -> flight cost in home currency, only when includeFlights is on AND data is available
): (Destination & { totalHome: number; bigMacs: number; flightCostHome?: number })[] {
  const homeReferenceAmount = REFERENCE_HOME_AMOUNT_USD_EQUIV * currentRates[homeCurrency];
  return destinations
    .filter((d) => hasBigMacData(d.currencyCode))
    // When "include flights" is on, a destination with no known flight price
    // is EXCLUDED rather than assumed free/cheap - never silently treated as $0.
    .filter((d) => !f.includeFlights || (flightCostsHome && flightCostsHome[d.id] != null))
    .map((d) => {
      const bigMacs = bigMacsPerHomeAmount(currentRates, homeReferenceAmount, homeCurrency, d.currencyCode) ?? 0;
      const flightCostHome = flightCostsHome?.[d.id];
      const totalHome =
        usdToHome(currentRates, d.avgDailyBudgetUSD * f.days, homeCurrency) + (f.includeFlights ? flightCostHome ?? 0 : 0);
      return { ...d, totalHome, bigMacs, flightCostHome };
    })
    .filter((d) => isFinite(d.totalHome) && isFinite(d.bigMacs) && passesCommonFilters(d, f, d.totalHome))
    .sort((a, b) =>
      // With flights included, total trip cost (accommodation+flight) is the more
      // meaningful ranking than pure local purchasing power - flip the sort key.
      f.includeFlights ? a.totalHome - b.totalHome : b.bigMacs - a.bigMacs
    );
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
