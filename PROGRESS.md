# PROGRESS / TODO — Big Mac Index pivot

Goal (from user, Aug 2026): replace the made-up "avgDailyBudgetUSD" ranking with a
recognized purchasing-power benchmark, Big Mac Index style. Two tabs stay:
1. "Cheapest now" — ranked by purchasing power: how many Big Macs $100 (or home-currency
   equivalent) buys in each destination, using LIVE FX (already built, don't touch fx.ts/fxLive.ts).
   Do NOT show the raw calculation/formula on the card — just the resulting comparison.
   Explicitly NOT based on local salaries — purely "what does a fixed amount of my money buy there".
2. "Biggest movers" — UNCHANGED, already correct (1/3/5yr slider, live historical rates).

## Checklist (mark [x] as completed)

- [x] 0. Live site working, auto-deploy via GitHub Actions -> Cloudflare Workers confirmed working
      (repo: bazzizazzi/fx-trip-compass2, push to main auto-deploys in ~40s)
- [ ] 1. Research real Big Mac Index prices (local currency) per country — The Economist's index,
      most recent edition. Target: cover as many of the 59 destinations' countries as possible.
      Store in src/data/bigmac.json: { countryCode, localPrice, currencyCode, asOf }
- [ ] 2. For destinations whose country ISN'T in the Big Mac Index (many "hidden gem" countries:
      Georgia, Armenia, Laos, Cambodia, Nepal, Mongolia, Kenya, Tanzania, Namibia, Fiji, Bosnia,
      Albania, Macedonia, Montenegro, etc.) — decide + implement a documented fallback proxy
      (candidate: World Bank ICP/PPP conversion factor, broader country coverage, cite as source).
- [ ] 3. New lib: src/lib/purchasingPower.ts — given home currency + live rates + bigmac data,
      compute "Big Macs per $100" (or per home-currency-equivalent-of-$100) for a destination.
      Full-precision, same USD-pivot convention as fx.ts.
- [ ] 4. Rewrite rank.ts `rankCheapestNow` to sort by this purchasing-power score instead of
      totalHome budget estimate. Remove/replace avgDailyBudgetUSD usage in destinations.json
      (either drop the field or keep it unused — decide during implementation).
- [ ] 5. Redesign DestinationCard's "cheap now" stat line: replace "$X for 6 days" with something
      like "🍔 X Big Macs per $100" — friendly, no exposed formula. Keep "movers" card variant as-is.
- [ ] 6. i18n: add new translation keys for the Big Mac stat across en/he/es/fr (see src/lib/i18n.tsx
      pattern already established — follow it exactly, all 4 languages every time).
- [ ] 7. Footer disclosure: mention Big Mac Index (Economist) + PPP fallback as data sources,
      same honest-disclosure pattern as the FX footer text already has.
- [ ] 8. Build, screenshot-verify (puppeteer-core at
      /home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome — ALWAYS
      start vite preview AND run puppeteer in the SAME bash_tool call, background jobs die between
      calls in this environment).
- [ ] 9. Commit + push to bazzizazzi/fx-trip-compass2 main -> auto-deploys via Actions.
- [ ] 10. Verify live via web_fetch (note: web_fetch appears to cache by URL ignoring query strings
       in this environment — ask the user to hard-refresh for final visual confirmation if own
       verification looks stale despite a fresh successful deploy log).

## Key infra facts (don't rediscover these)
- GitHub repo: bazzizazzi/fx-trip-compass2, already has working CI at
  .github/workflows/deploy.yml (Node 22, npx wrangler deploy, secrets already set:
  CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID — already in repo secrets, don't ask user again).
- Live URL: https://fx-trip-compass2.bazzizazzi.workers.dev
- FX data: src/lib/fxLive.ts uses fawazahmed0/currency-api via jsDelivr CDN (current + historical,
  200+ currencies, confirmed CORS-safe). Don't switch providers again without strong reason.
- This sandbox's bash network CANNOT reach github.com's actions log blob storage, cloudflare API,
  or most external APIs directly — use web_search/web_fetch tools for external research instead,
  they're unrestricted. bash network only reaches: github.com, api.github.com, npm/pypi registries.
- i18n lives in src/lib/i18n.tsx — single file, 4 full locale dicts (en/he/es/fr). Always update
  all 4 when adding a string, never leave one language with English fallback silently.

## Session 3 update (security architecture + Big Mac Index)

Done this session:
- [x] Big Mac Index purchasing power (real Economist data + GDP regression fallback) - LIVE
- [x] Verified FX accuracy against 3 independent live sources (GBP/USD, GBP/JPY, GBP/TRY all confirmed correct)
- [x] Secured a sandbox provider API key as GH secret PROVIDER_SANDBOX_KEY_UNCONFIRMED (name pending
      provider confirmation from user - asked, awaiting answer)
- [x] Built Worker backend architecture: src/worker.ts handles /api/*, falls through to ASSETS for SPA.
      wrangler.jsonc updated with "main" + "assets.binding":"ASSETS".
- [x] Input validation: src/server/validate.ts - strict whitelist (destId against destinations.json),
      date/int bounds checking, throws ValidationError -> 400.
- [x] SSRF defense: outbound provider URLs will be built ONLY from server-stored whitelist data,
      never from raw client input, by construction.
- [x] Timeout + limited exponential-backoff retry helper in worker.ts (fetchWithTimeout/fetchWithRetry).
- [x] Naive per-isolate rate limiter in worker.ts (documented as best-effort; recommended user also
      enable Cloudflare dashboard Rate Limiting Rules for defense in depth).
- [x] No-PII click tracking: src/lib/affiliateTracking.ts, crypto.randomUUID() only.
- [x] Trip.com affiliate link wired into DestinationCard "Search flights" button (safe - public
      affiliate link, no secret involved) - LIVE now.
- [x] tsconfig.worker.json added (separate typecheck for Workers runtime vs browser frontend),
      @cloudflare/workers-types installed, CI now runs `tsc -p tsconfig.worker.json` before build.

STILL TODO (blocked on user confirming which provider Key #7031 is for):
- [ ] Once confirmed: implement actual handleHotelSearch() provider call in src/worker.ts
      (currently returns 501 placeholder)
- [ ] Rename PROVIDER_SANDBOX_KEY_UNCONFIRMED secret to something provider-specific once known
- [ ] noindex meta tag: NOT YET NEEDED (no provider content pulled into pages yet) - implement
      the moment any Viator/GetYourGuide-style unique content (tour descriptions, reviews) gets
      rendered on a page. Do this BEFORE that content ships, not after.
- [ ] Point 1 (trip-length + flight-cost-included toggle for "cheapest now" ranking): NOT STARTED.
      Depends on real flight price data - same provider-key blocker. Once a flights API (Kiwi
      Tequila / Skyscanner) is confirmed+wired, revisit rank.ts to blend flight cost into the
      Big Mac / purchasing-power ranking, weighted by trip length (short trip = flight cost
      dominates; long trip = local purchasing power dominates). UI: toggle above "hidden gems only".
