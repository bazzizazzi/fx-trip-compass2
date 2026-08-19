import { validateSearchParams, ValidationError } from "./server/validate";

export interface Env {
  ASSETS: Fetcher;
  // Provider secrets are bound here via `wrangler secret put` / GitHub Actions
  // secrets injected at deploy time. NEVER read from anywhere else, NEVER
  // logged, NEVER echoed in a response body.
  PROVIDER_SANDBOX_KEY_UNCONFIRMED?: string;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        if (url.pathname === "/api/hotels") {
          return await handleHotelSearch(request, env);
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
