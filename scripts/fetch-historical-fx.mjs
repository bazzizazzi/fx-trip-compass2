// Runs in GitHub Actions (real internet access). Produces src/data/historical-fx.json,
// a static USD-pivot table for a handful of yearly reference points. The frontend/worker
// then just READS this file - no live historical fetch at runtime, ever. This is the
// fix for the flicker/retry bug: a static file can't time out or fail intermittently.
//
// Source: Frankfurter (api.frankfurter.dev) - free, no API key, blends 50+ central banks,
// historical archive back to 1948, no rate limits for reasonable use. Per-currency gaps
// (a currency Frankfurter doesn't carry) are simply absent from the output - the "movers"
// feature already treats a missing historical rate as "don't show this destination for
// this lookback", never as a fabricated number.

import { writeFileSync } from "fs";

const YEARS_BACK = [1, 2, 3, 4, 5];
const BASE = "USD";

function dateYearsAgo(years) {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() - years);
  return d.toISOString().slice(0, 10);
}

async function fetchOnDate(date) {
  const url = `https://api.frankfurter.dev/v1/${date}?base=${BASE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Frankfurter ${date} -> HTTP ${res.status}`);
  const json = await res.json();
  // json.rates is { CODE: rate, ... } already USD-based (units per 1 USD) - our exact convention.
  return { date: json.date, rates: { USD: 1, ...json.rates } };
}

async function main() {
  const snapshots = {};
  for (const years of YEARS_BACK) {
    const targetDate = dateYearsAgo(years);
    console.log(`Fetching ${years}y ago (${targetDate})...`);
    try {
      const snap = await fetchOnDate(targetDate);
      snapshots[years] = snap;
      console.log(`  -> got ${Object.keys(snap.rates).length} currencies, actual date used: ${snap.date}`);
    } catch (err) {
      console.error(`  FAILED for ${years}y: ${err.message}`);
      // Do not write a fake/partial entry - better to have no data for this year
      // than wrong data. The frontend already handles a missing year gracefully.
    }
    // be polite, no need to hammer even an unmetered API
    await new Promise((r) => setTimeout(r, 300));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "api.frankfurter.dev (ECB + 50+ central banks, blended)",
    base: BASE,
    snapshots,
  };

  writeFileSync(new URL("../src/data/historical-fx.json", import.meta.url), JSON.stringify(output, null, 2));
  console.log(`\nWrote ${Object.keys(snapshots).length}/${YEARS_BACK.length} yearly snapshots.`);

  if (Object.keys(snapshots).length === 0) {
    console.error("No snapshots fetched at all - failing the job so this doesn't silently ship empty data.");
    process.exit(1);
  }
}

main();
