import conflicts from "../data/conflicts.json";
import destinationsData from "../data/destinations.json";

export type Destination = {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  countryEn: string;
  countryCode: string;
  currencyCode: string;
  region: string;
  lat: number;
  bestMonths: number[];
  avgDailyBudgetUSD: number;
  minStars: number[];
  hiddenGem: boolean;
  description: string;
  descriptionEn: string;
  theme: string;
  tags: string[];
  tagKeys: string[];
};

export function allDestinations(): Destination[] {
  return destinationsData as Destination[];
}

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

// code + default currency only - display NAME comes from the i18n `countries` dict
export const HOME_COUNTRIES: { code: string; currency: string }[] = [
  { code: "IL", currency: "ILS" },
  { code: "US", currency: "USD" },
  { code: "GB", currency: "GBP" },
  { code: "DE", currency: "EUR" },
  { code: "FR", currency: "EUR" },
  { code: "CA", currency: "CAD" },
  { code: "AU", currency: "AUD" },
  { code: "BR", currency: "BRL" },
  { code: "IN", currency: "INR" },
  { code: "JP", currency: "JPY" },
  { code: "ZA", currency: "ZAR" },
  { code: "MX", currency: "MXN" },
  { code: "PL", currency: "PLN" },
  { code: "TR", currency: "TRY" },
  { code: "AE", currency: "USD" },
];
