import { useEffect, useRef, useState } from "react";
import { fetchFlightEstimate } from "./flightPricing";
import type { Destination } from "./destinations";
import { getCurrencyMeta } from "./fx";

export function useFlightsCapability() {
  const [available, setAvailable] = useState<boolean | null>(null); // null = still checking

  useEffect(() => {
    let cancelled = false;
    // Cheap capability probe: any destId works. We must send every param the
    // server validates (destId, checkin, checkout, adults, minStars) or the
    // request 400s on a missing field - a validation error is NOT the same as
    // "no provider configured" and must never be misread as "flights available".
    fetchFlightEstimate({ destId: "d1", checkin: "2027-01-10", checkout: "2027-01-16", adults: 2, minStars: 3 }).then(
      (result) => {
        if (cancelled) return;
        // Only a genuine successful response counts as "available" - anything
        // else (including any error reason) means the toggle stays disabled.
        setAvailable(result.available === true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  return available ?? false; // treat "still checking" as unavailable so the toggle never flashes enabled then disabled
}

/**
 * Fetches flight cost (converted to home currency) for each given destination,
 * only while `enabled`. Destinations with no available price are simply absent
 * from the returned map - callers must treat "missing" as "unknown", never as 0.
 */
export function useFlightCosts(
  destinations: Destination[],
  enabled: boolean,
  homeCurrency: string,
  currentRates: Record<string, number> | null,
  checkin: string,
  checkout: string
) {
  const [costs, setCosts] = useState<Record<string, number>>({});
  const inFlight = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled || !currentRates) return;
    const home = getCurrencyMeta(homeCurrency);
    destinations.forEach((d) => {
      if (costs[d.id] != null || inFlight.current.has(d.id)) return;
      inFlight.current.add(d.id);
      fetchFlightEstimate({ destId: d.id, checkin, checkout, adults: 2, minStars: 3 }).then((result) => {
        inFlight.current.delete(d.id);
        if (result.available) {
          const priceHome = result.estimate.priceUSD * home.fallbackUsdRate; // rough conversion for a UI estimate only
          setCosts((c) => ({ ...c, [d.id]: priceHome }));
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, destinations, homeCurrency, currentRates, checkin, checkout]);

  return enabled ? costs : {};
}
