import { validateSearchParams, ValidationError } from "./server/validate";

export interface Env {
  ASSETS: Fetcher;
  // Provider secrets are bound here via `wrangler secret put` / GitHub Actions
  // secrets injected at deploy time. NEVER read from anywhere else, NEVER
  // logged, NEVER echoed in a response body.
  // Confirmed: this holds a Viator Affiliate API sandbox exp-api-key.
  PROVIDER_SANDBOX_KEY_UNCONFIRMED?: string;
  // No flights provider is connected yet (Kiwi Tequila = invite-only as of
  // this build; Amadeus Self-Service free tier shut down July 2026). Leave
  // unset until a real key exists - handleFlightSearch degrades cleanly.
  FLIGHTS_API_KEY?: string;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

/** Wrap a fetch with a hard timeout - a hung provider must never hang our worker. */
async function fetchWithTimeout(input: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Limited retry with exponential backoff - never retries indefinitely, never retries 4xx (client errors). */
async function fetchWithRetry(input: string, init: RequestInit, opts: { timeoutMs: number; maxRetries: number }): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const res = await fetchWithTimeout(input, init, opts.timeoutMs);
      if (res.status >= 500 && attempt < opts.maxRetries) {
        await new Promise((r) => setTimeout(r, 200 * 2 ** attempt));
        continue;
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (attempt < opts.maxRetries) {
        await new Promise((r) => setTimeout(r, 200 * 2 ** attempt));
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Upstream request failed after retries");
}

/**
 * Naive in-memory-per-isolate rate limiter (best-effort only - Workers can
 * scale to multiple isolates, so this is NOT a substitute for a real limit).
 * Cloudflare's dashboard-level Rate Limiting Rules (WAF > Rate limiting) should
 * also be enabled for this route as the authoritative control; this is a
 * cheap first line of defense with zero extra infra.
 */
const rateBuckets = new Map<string, number[]>();
function isRateLimited(key: string, maxPerMinute: number): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (rateBuckets.get(key) ?? []).filter((t) => t > windowStart);
  hits.push(now);
  rateBuckets.set(key, hits);
  return hits.length > maxPerMinute;
}

async function handleHotelSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  let params;
  try {
    params = validateSearchParams(url);
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400);
    throw err;
  }
  void params; // will be used once the confirmed provider's request shape is wired in

  const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(`hotels:${clientIp}`, 30)) {
    return json({ error: "Rate limit exceeded, try again shortly" }, 429);
  }

  if (!env.PROVIDER_SANDBOX_KEY_UNCONFIRMED) {
    return json({ error: "Provider not yet configured" }, 503);
  }

  // TODO: fill in once the provider is confirmed. The outbound URL/body below
  // is built ENTIRELY from `params` (validated, whitelist-backed) - never from
  // raw request data - so there is no SSRF surface regardless of which
  // provider this becomes.
  return json({ error: "Provider integration pending confirmation - see PROGRESS.md" }, 501);
}

/**
 * Flight pricing: NO provider is connected yet (see Env.FLIGHTS_API_KEY comment
 * above - Kiwi Tequila is invite-only, Amadeus Self-Service free tier shut
 * down). This always returns a clean, typed "unavailable" response - never a
 * fabricated price. The moment a real key is configured, only the body of
 * this function needs to change; the frontend/ranking pipeline is already
 * fully wired to consume { available, estimate } as-is.
 */
async function handleFlightSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  let params;
  try {
    params = validateSearchParams(url);
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400);
    throw err;
  }

  const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(`flights:${clientIp}`, 30)) {
    return json({ error: "Rate limit exceeded, try again shortly" }, 429);
  }

  if (!env.FLIGHTS_API_KEY) {
    return json({ available: false, reason: "no_provider_configured" });
  }

  // TODO once a provider (Duffel or similar) is connected: build the outbound
  // request from `params` (whitelist-backed, validated) and a destination ->
  // nearest-airport mapping, call it via fetchWithRetry, map the response to
  // { priceUSD, provider, asOf }. Unreachable today since FLIGHTS_API_KEY is
  // unset in every environment.
  void params;
  return json({ available: false, reason: "provider_error" }, 501);
}

const VIATOR_SANDBOX_BASE = "https://api.sandbox.viator.com/partner";

/**
 * Viator Affiliate API (sandbox). Per Viator's technical guide, product/
 * attraction data must be cached and refreshed at most weekly - we cache in
 * Cloudflare's edge Cache API for 24h, comfortably within that limit, rather
 * than hitting their sandbox on every page view.
 *
 * IMPORTANT (noindex): the moment any page renders Viator's product titles,
 * descriptions or reviews verbatim, that page needs
 * <meta name="robots" content="noindex"> - see NoIndexMeta.tsx. This endpoint
 * is dev/PoC only right now; nothing from it is rendered on a public route yet.
 */
async function handleActivitiesSearch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  let params;
  try {
    params = validateSearchParams(url);
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400);
    throw err;
  }

  const clientIp = request.headers.get("cf-connecting-ip") ?? "unknown";
  if (isRateLimited(`activities:${clientIp}`, 20)) {
    return json({ error: "Rate limit exceeded, try again shortly" }, 429);
  }

  const apiKey = env.PROVIDER_SANDBOX_KEY_UNCONFIRMED;
  if (!apiKey) {
    return json({ error: "Viator sandbox key not configured" }, 503);
  }

  const cache = caches.default;
  const cacheKey = new Request(`https://cache.internal/viator-search/${params.destination.id}`, request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    // destination name comes from OUR whitelist (destinationWhitelist.ts),
    // never from raw client input - Viator's /destinations endpoint gives us
    // the taxonomy to resolve a name to their internal numeric destination ID.
    const destRes = await fetchWithRetry(
      `${VIATOR_SANDBOX_BASE}/destinations`,
      {
        headers: {
          "exp-api-key": apiKey,
          Accept: "application/json;version=2.0",
          "Accept-Language": "en-US",
        },
      },
      { timeoutMs: 8000, maxRetries: 1 }
    );

    if (!destRes.ok) {
      return json({ error: "Viator destinations lookup failed", status: destRes.status }, 502);
    }
    const destData: { destinations?: { destinationId: number; name: string }[] } = await destRes.json();
    const match = destData.destinations?.find(
      (d) => d.name.toLowerCase() === params.destination.nameEn.toLowerCase()
    );

    if (!match) {
      return json({ available: false, reason: "destination_not_in_viator_taxonomy" });
    }

    const searchRes = await fetchWithRetry(
      `${VIATOR_SANDBOX_BASE}/products/search`,
      {
        method: "POST",
        headers: {
          "exp-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json;version=2.0",
          "Accept-Language": "en-US",
        },
        body: JSON.stringify({
          filtering: { destination: String(match.destinationId) },
          pagination: { start: 1, count: 6 },
        }),
      },
      { timeoutMs: 8000, maxRetries: 1 }
    );

    if (!searchRes.ok) {
      return json({ error: "Viator product search failed", status: searchRes.status }, 502);
    }

    const searchData = await searchRes.json();
    const response = json({ available: true, viatorDestinationId: match.destinationId, products: searchData });
    const cacheableResponse = new Response(response.body, response);
    cacheableResponse.headers.set("Cache-Control", "public, max-age=86400");
    await cache.put(cacheKey, cacheableResponse.clone());
    return response;
  } catch (err) {
    console.error("Viator request failed:", err instanceof Error ? err.message : err);
    return json({ error: "Upstream request failed" }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        if (url.pathname === "/api/hotels") {
          return await handleHotelSearch(request, env);
        }
        if (url.pathname === "/api/flights") {
          return await handleFlightSearch(request, env);
        }
        if (url.pathname === "/api/activities") {
          return await handleActivitiesSearch(request, env);
        }
        return json({ error: "Not found" }, 404);
      } catch (err) {
        // Never leak internal error details (stack traces, upstream bodies) to the client.
        console.error("Worker error:", err instanceof Error ? err.message : err);
        return json({ error: "Internal error" }, 500);
      }
    }

    // Everything else: serve the static SPA build.
    return env.ASSETS.fetch(request);
  },
};

// exported for tests / reuse
export { fetchWithRetry };
