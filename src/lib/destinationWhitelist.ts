import destinations from "../data/destinations.json";

export type DestinationWhitelistEntry = {
  id: string;
  nameEn: string;
  countryEn: string;
  countryCode: string;
};

/**
 * The backend NEVER accepts an arbitrary destination string/URL from the client.
 * Every provider-facing request must resolve destId against this whitelist first -
 * that's what makes the SSRF/injection surface a non-issue by construction: the
 * actual outbound URL to the provider is built from OUR OWN stored data, never
 * from anything the client sent directly.
 */
export const DESTINATION_WHITELIST: Record<string, DestinationWhitelistEntry> = Object.fromEntries(
  (destinations as { id: string; nameEn: string; countryEn: string; countryCode: string }[]).map((d) => [
    d.id,
    { id: d.id, nameEn: d.nameEn, countryEn: d.countryEn, countryCode: d.countryCode },
  ])
);

export function resolveDestination(destId: string): DestinationWhitelistEntry | null {
  return DESTINATION_WHITELIST[destId] ?? null;
}
