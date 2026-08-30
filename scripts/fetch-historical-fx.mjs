// Runs in GitHub Actions (real internet access). Produces src/data/historical-fx.json,
// a static USD-pivot table at MONTHLY resolution going back 5 years (60 points).
// The frontend/worker only ever READS this file - no live historical fetch at runtime.
//
// Source: fawazahmed0/currency-api (github.com/fawazahmed0/currency-api), served via
// jsDelivr CDN - free, no API key, 200+ currencies, no rate limits. Switched from
// Frankfurter (2026-08) because Frankfurter only covers ~16 of the 40 currencies this
// site actually needs (ECB-only), while fawazahmed0 covers effectively all of them -
// this is the SAME source already used for live current rates (src/lib/fxLive.ts), so
// there's no new dependency, just reusing a source already proven reliable in production.

import { writeFileSync } from "fs";

const MONTHS_BACK = 60; // 5 years, monthly - "no need for daily, monthly is enough" per spec
const PRIMARY = (date) => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`;
const FALLBACK_MIRROR = (date) => `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`;

function monthKey(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function firstOfMonthNMonthsAgo(n) {
  const d = new Date();
  d.setUTCDate(1); // avoid month-length edge cases (e.g. Jan 31 - 1 month != Feb 31)
  d.setUTCMonth(d.getUTCMonth() - n);
  return d;
}

function toUppercaseRates(usdObj) {
  const out = { USD: 1 };
  for (const [k, v] of Object.entries(usdObj)) out[k.toUpperCase()] = v;
  return out;
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchDate(dateStr) {
  for (const urlFn of [PRIMARY, FALLBACK_MIRROR]) {
    try {
      const res = await fetchWithTimeout(urlFn(dateStr), 10000);
      if (!res.ok) continue;
      const json = await res.json();
      if (!json.usd) continue;
      return { date: json.date, rates: toUppercaseRates(json.usd) };
    } catch {
      // try next mirror
    }
  }
  return null;
}

async function main() {
  const snapshots = {};
  let failures = 0;

  for (let n = 1; n <= MONTHS_BACK; n++) {
    const targetDate = firstOfMonthNMonthsAgo(n);
    const key = monthKey(targetDate);
    const dateStr = targetDate.toISOString().slice(0, 10);
    process.stdout.write(`Fetching ${key} (${dateStr})... `);
    const snap = await fetchDate(dateStr);
    if (snap) {
      snapshots[key] = snap;
      console.log(`OK (${Object.keys(snap.rates).length} currencies, actual date: ${snap.date})`);
    } else {
      failures++;
      console.log("FAILED - skipping, not faking this month");
    }
    await new Promise((r) => setTimeout(r, 150)); // be polite even though there's no hard rate limit
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "fawazahmed0/currency-api (via jsDelivr CDN)",
    resolution: "monthly",
    base: "USD",
    snapshots,
  };

  writeFileSync(new URL("../src/data/historical-fx.json", import.meta.url), JSON.stringify(output));
  console.log(`\nWrote ${Object.keys(snapshots).length}/${MONTHS_BACK} monthly snapshots (${failures} failed).`);

  if (Object.keys(snapshots).length === 0) {
    console.error("Zero snapshots fetched - failing the job so this doesn't silently ship empty data.");
    process.exit(1);
  }
}

main();
