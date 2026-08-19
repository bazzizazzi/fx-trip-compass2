import { resolveDestination, type DestinationWhitelistEntry } from "../lib/destinationWhitelist";

export type ValidatedSearchParams = {
  destination: DestinationWhitelistEntry;
  checkin: string; // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
  adults: number;
  minStars: number;
};

export class ValidationError extends Error {}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function assertValidDate(value: string | null, field: string): string {
  if (!value || !DATE_RE.test(value)) throw new ValidationError(`Invalid ${field}: must be YYYY-MM-DD`);
  const d = new Date(value + "T00:00:00Z");
  if (isNaN(d.getTime())) throw new ValidationError(`Invalid ${field}: not a real date`);
  const now = new Date();
  const twoYearsOut = new Date();
  twoYearsOut.setFullYear(now.getFullYear() + 2);
  if (d < new Date(now.toDateString()) || d > twoYearsOut) {
    throw new ValidationError(`Invalid ${field}: out of acceptable range`);
  }
  return value;
}

function assertValidInt(value: string | null, field: string, min: number, max: number): number {
  const n = value == null ? NaN : Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new ValidationError(`Invalid ${field}: must be an integer between ${min} and ${max}`);
  }
  return n;
}

/**
 * Validates every query param for a hotel/flight search request. Destination is
 * resolved against a server-side whitelist (never trusts a free-text city/URL
 * from the client) - this is the core SSRF/injection defense: the outbound
 * provider request is built entirely from OUR stored data keyed by destId,
 * never from anything else the client sends.
 */
export function validateSearchParams(url: URL): ValidatedSearchParams {
  const destId = url.searchParams.get("destId");
  if (!destId) throw new ValidationError("Missing destId");
  const destination = resolveDestination(destId);
  if (!destination) throw new ValidationError("Unknown destId - not in whitelist");

  const checkin = assertValidDate(url.searchParams.get("checkin"), "checkin");
  const checkout = assertValidDate(url.searchParams.get("checkout"), "checkout");
  if (checkout <= checkin) throw new ValidationError("checkout must be after checkin");

  const adults = assertValidInt(url.searchParams.get("adults"), "adults", 1, 12);
  const minStars = assertValidInt(url.searchParams.get("minStars"), "minStars", 1, 5);

  return { destination, checkin, checkout, adults, minStars };
}
