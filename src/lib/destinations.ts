import conflicts from "../data/conflicts.json";
import destinations from "../data/destinations.json";

export type Destination = {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryCode: string;
  currencyCode: string;
  region: string;
  lat: number;
  bestMonths: number[];
  avgDailyBudgetUSD: number;
  minStars: number[];
  hiddenGem: boolean;
  description: string;
  tags: string[];
};

export function allDestinations(): Destination[] {
  return destinations as Destination[];
}

/**
 * A destination is hidden from a given home country if:
 *  - it's in a global no-go list right now (active war / extreme advisory), or
 *  - the home country and destination country are a known hostile pair.
 * hostilePairs is checked in BOTH directions and is never auto-cleared by a
 * peace deal - it's a manually-curated list precisely so sentiment (which lags
 * politics by years) governs, not headlines.
 */
export function isExcludedForTraveler(destCountryCode: string, homeCountryCode: string): boolean {
  if (conflicts.globalExclude.includes(destCountryCode)) return true;
  return conflicts.hostilePairs.some(
    ([a, b]) =>
      (a === homeCountryCode && b === destCountryCode) ||
      (b === homeCountryCode && a === destCountryCode)
  );
}

export function visibleDestinationsFor(homeCountryCode: string): Destination[] {
  return allDestinations().filter((d) => !isExcludedForTraveler(d.countryCode, homeCountryCode));
}

// Rough list of common home countries for the picker (code, Hebrew name, default currency)
export const HOME_COUNTRIES: { code: string; name: string; currency: string }[] = [
  { code: "IL", name: "ישראל", currency: "ILS" },
  { code: "US", name: "ארה\"ב", currency: "USD" },
  { code: "GB", name: "בריטניה", currency: "GBP" },
  { code: "DE", name: "גרמניה", currency: "EUR" },
  { code: "FR", name: "צרפת", currency: "EUR" },
  { code: "CA", name: "קנדה", currency: "CAD" },
  { code: "AU", name: "אוסטרליה", currency: "AUD" },
  { code: "BR", name: "ברזיל", currency: "BRL" },
  { code: "IN", name: "הודו", currency: "INR" },
  { code: "JP", name: "יפן", currency: "JPY" },
  { code: "ZA", name: "דרום אפריקה", currency: "ZAR" },
  { code: "MX", name: "מקסיקו", currency: "MXN" },
  { code: "PL", name: "פולין", currency: "PLN" },
  { code: "TR", name: "טורקיה", currency: "TRY" },
  { code: "AE", name: "איחוד האמירויות", currency: "USD" },
];
