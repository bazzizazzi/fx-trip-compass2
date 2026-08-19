/**
 * Affiliate tracking must use an opaque random ID, never PII (email, name, IP,
 * phone) in tracking/subid parameters - several providers (Skyscanner among
 * them) explicitly prohibit this in their terms. Generated client-side,
 * per-click, never persisted or sent anywhere except the outbound affiliate URL.
 */
export function generateClickId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `c${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildTripComUrl(destNameEn: string, clickId: string): string {
  const params = new URLSearchParams({
    Allianceid: "10159178",
    SID: "328879139",
    trip_sub1: clickId,
    trip_sub3: "D19340183",
    // Trip.com reads the destination from their own search UI once landed;
    // we pass it as a generic query hint only, no PII, no free-text injection risk
    // since destNameEn always comes from our own destinations.json, never raw user input.
    q: destNameEn,
  });
  return `https://www.trip.com/?${params.toString()}`;
}
