import type { Destination } from "./destinations";
import { usdToHome, fxMovementPct } from "./fx";
import type { Filters } from "../components/FilterBar";

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
  f: Filters
): (Destination & { totalHome: number })[] {
  return destinations
    .map((d) => ({ ...d, totalHome: usdToHome(currentRates, d.avgDailyBudgetUSD * f.days, homeCurrency) }))
    .filter((d) => isFinite(d.totalHome) && passesCommonFilters(d, f, d.totalHome))
    .sort((a, b) => a.totalHome - b.totalHome);
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
