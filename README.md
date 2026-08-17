# FX Trip Compass

Find cheap travel destinations based on YOUR home currency's exchange rate — not generic USD prices.

## What this demo includes
1. **Cheap now** — destinations ranked by total trip cost converted into your home currency (full-precision USD-pivot cross rate, see `src/lib/fx.ts`).
2. **Biggest FX movers** — destinations whose currency weakened the most against your home currency over 1y/5y, meaning your money buys more there than before.
3. Hidden-gem bias in `src/data/destinations.json` — smaller towns/villages, not just capitals.
4. Month-based seasonal filtering (1-12), works across hemispheres.
5. Filters: trip length, total budget, minimum hotel stars, hidden-gems-only.
6. Conflict/exclusion logic (`src/data/conflicts.json`) — hides destinations for travelers from hostile-pair countries, and globally hides active-conflict zones. Manually curated, doesn't auto-clear on political change.

## Sample data disclosure
`src/data/currencies.json` and `src/data/destinations.json` contain **realistic sample data**, not live feeds — this sandbox has no network access to FX/travel APIs. To go to production:

- **Live FX rates**: wire up a provider like [exchangerate.host](https://exchangerate.host) or [Open Exchange Rates](https://openexchangerates.org) — swap the static JSON for a fetch in `src/lib/fx.ts`, keeping the USD-pivot math as-is.
- **Real hotel data/pricing**: the "חפש מלונות" buttons already deep-link to real Booking.com search results (prefilled dates + star class) — that works today with zero setup. For *embedded* live pricing you'd need a [Booking.com Affiliate Partner](https://www.booking.com/affiliate-program/v2/index.html) API key, which requires their manual partner approval process.

## Dev
```
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
```

## Deploy
Push this repo to GitHub, then connect it in Cloudflare Pages (Framework preset: Vite, build command `npm run build`, output dir `dist`).
