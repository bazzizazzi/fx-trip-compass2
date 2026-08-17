import currenciesMeta from "../data/currencies.json";

export type CurrencyMeta = {
  code: string;
  name: string;
  symbol: string;
  region: string;
  fallbackUsdRate: number;
};

const META_BY_CODE: Record<string, CurrencyMeta> = Object.fromEntries(
  (currenciesMeta as CurrencyMeta[]).map((c) => [c.code, c])
);

export function getCurrencyMeta(code: string): CurrencyMeta {
  const c = META_BY_CODE[code];
  if (!c) throw new Error(`Unknown currency code: ${code}`);
  return c;
}

export function listCurrencyMeta(): CurrencyMeta[] {
  return currenciesMeta as CurrencyMeta[];
}

export type RatesSnapshot = {
  rates: Record<string, number>; // units per 1 USD, uppercase codes
  asOf: string;
  source: "live" | "cached" | "fallback";
};

/**
 * Data source: fawazahmed0/currency-api - free, no key, 200+ currencies,
 * daily updated, served via jsDelivr's CDN (which sets proper CORS headers -
 * that's the whole point of a public CDN, unlike some "open" FX API endpoints
 * that turned out NOT to allow browser fetch when we tested them directly).
 * Two independent mirrors so one host being down doesn't take the feature down.
 * https://github.com/fawazahmed0/currency-api
 */
const PRIMARY = (date: string) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`;
const FALLBACK_MIRROR = (date: string) => `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`;

function toUppercaseRates(usdObj: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = { USD: 1 };
  for (const [k, v] of Object.entries(usdObj)) out[k.toUpperCase()] = v;
  return out;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDate(date: string): Promise<{ rates: Record<string, number>; asOf: string } | null> {
  for (const urlFn of [PRIMARY, FALLBACK_MIRROR]) {
    try {
      const res = await fetchWithTimeout(urlFn(date), 8000);
      if (!res.ok) continue;
      const json = await res.json();
      if (!json.usd) continue;
      return { rates: toUppercaseRates(json.usd), asOf: json.date };
    } catch {
      // timed out or failed - try next mirror
    }
  }
  return null;
}

const CURRENT_CACHE_KEY = "fxtrip.current_rates.v2";
const CURRENT_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h - source updates once/day anyway

export async function fetchCurrentRates(): Promise<RatesSnapshot> {
  try {
    const cachedRaw = localStorage.getItem(CURRENT_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { rates: Record<string, number>; asOf: string; fetchedAt: number };
      if (Date.now() - cached.fetchedAt < CURRENT_CACHE_TTL_MS) {
        return { rates: cached.rates, asOf: cached.asOf, source: "cached" };
      }
    }
  } catch {
    // ignore corrupt cache
  }

  const result = await fetchDate("latest");
  if (result) {
    try {
      localStorage.setItem(CURRENT_CACHE_KEY, JSON.stringify({ ...result, fetchedAt: Date.now() }));
    } catch {
      // storage full/unavailable - not fatal
    }
    return { ...result, source: "live" };
  }

  // Both live mirrors failed (network/CORS/offline) - fall back to the bundled
  // snapshot (real data fetched 2026-08-16) so the app never breaks or lies silently.
  const rates = Object.fromEntries((currenciesMeta as CurrencyMeta[]).map((c) => [c.code, c.fallbackUsdRate]));
  return { rates, asOf: "2026-08-16", source: "fallback" };
}

const HIST_CACHE_PREFIX = "fxtrip.hist_rates.v2:";

export async function fetchHistoricalRates(date: string): Promise<RatesSnapshot | null> {
  const cacheKey = HIST_CACHE_PREFIX + date;
  try {
    const cachedRaw = localStorage.getItem(cacheKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as { rates: Record<string, number>; asOf: string };
      return { rates: cached.rates, asOf: cached.asOf, source: "cached" };
    }
  } catch {
    // ignore
  }

  const result = await fetchDate(date);
  if (!result) return null;

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // ignore
  }
  return { ...result, source: "live" };
}

export function dateYearsAgo(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
}
