export type FlightEstimate = {
  priceUSD: number;
  provider: string;
  asOf: string;
};

export type FlightAvailability =
  | { available: true; estimate: FlightEstimate }
  | { available: false; reason: "no_provider_configured" | "route_not_found" | "provider_error" };

/**
 * Client-side call to our own backend (never calls a flight provider directly
 * from the browser - see src/worker.ts handleFlightSearch). Returns a typed
 * "unavailable" result rather than throwing, so the UI can render a clean
 * disabled state instead of an error or, worse, a fabricated number.
 */
export async function fetchFlightEstimate(params: {
  destId: string;
  checkin: string;
  checkout: string;
  adults: number;
}): Promise<FlightAvailability> {
  try {
    const qs = new URLSearchParams(params as unknown as Record<string, string>);
    const res = await fetch(`/api/flights?${qs.toString()}`);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { available: false, reason: body?.reason ?? "provider_error" };
    }
    const body = await res.json();
    if (!body.available) return { available: false, reason: body.reason ?? "provider_error" };
    return { available: true, estimate: body.estimate };
  } catch {
    return { available: false, reason: "provider_error" };
  }
}
