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

## ⚠️ PENDING FROM OPERATOR (added 2026-08-19, do not delete until resolved)

Two placeholders remain in src/lib/legalContent.ts: [CONTACT EMAIL] and
[COMPANY / INDIVIDUAL NAME]. Governing law/jurisdiction is DONE (Israel / Tel Aviv,
filled in per operator's explicit instruction). Operator is evaluating whether the
site is worth pursuing; if so, they'll buy a domain matching the company name, then
provide the domain-matched company name + a contact email. When they do: replace all
occurrences of both placeholders across all 4 languages in legalContent.ts, rebuild,
commit, push, verify via deploy log. This is NOT user-facing anywhere - only visible
in source, contains no sensitive data.



Context: user wants tasks broken into checkpoints explicitly so nothing is lost if the
session cuts off mid-way. Work through in THIS order:

- [x] 4.1 Flight-cost-in-ranking toggle - DONE & DEPLOYED (commit ae18b89). Verified live
      via deploy log (new Version ID). Toggle shows disabled + tooltip since no flights
      provider is connected (correct "no fake data" behavior).
- [x] 4.2 Worker routes /api/flights + /api/activities wired into router - DONE (same commit).
- [x] 4.3 Legal content authored (Privacy Policy + ToS, EN/HE/ES/FR) - src/lib/legalContent.ts
      DONE locally, NOT YET committed/pushed. Placeholders: [CONTACT EMAIL],
      [COMPANY / INDIVIDUAL NAME], [JURISDICTION] - user needs to fill these in eventually,
      flagged clearly in the disclosure to user, not blocking ship.
- [x] 4.4 LegalPage.tsx component - DONE.
- [x] 4.5 Lightweight routing (Root.tsx, no router library, pathname check) - DONE.
- [x] 4.6 Footer links to /privacy and /terms, all 4 languages - DONE.
- [x] 4.7 Build + typecheck both configs + commit + push - DONE (commit 0f8e04c).
- [x] 4.8 Deployed and verified via deploy log - Version ID c5339b9d - LIVE.

## Still explicitly OUT OF SCOPE for this session (per user's "stay focused" instruction) -
## do NOT start these without user re-confirming, to avoid scope creep:
- Google SSO / user accounts / booking tracking (user asked about this - real scope, needs
  Google Cloud OAuth client credentials from user + a database, e.g. Cloudflare D1. NOT
  started. When picked up: needs its own session, don't bolt it on halfway through something
  else.)
- World Bank ICP Restaurants & Hotels PLI as a second purchasing-power index (user's point
  6/7) - confirmed NOT cleanly available via simple API, needs a real focused data-sourcing
  pass. NOT started. Big Mac remains the only wired index; index-picker UI framework itself
  also NOT built yet (would be a small addition once a 2nd index exists - low priority until
  the data problem is solved).
- Trip.com flights API depth check (does their existing affiliate account grant flight
  search API access beyond the deep-link we already have?) - NOT investigated this session.
- Real Viator sandbox call has NOT been live-tested end-to-end (this sandbox can't reach
  api.sandbox.viator.com directly - same infra limit as Cloudflare API earlier). Code is
  written per official docs but unverified live. Consider asking user to trigger
  /api/activities?destId=d1&checkin=2027-01-10&checkout=2027-01-16&adults=2&minStars=3
  on the live site once deployed and report back what they see, OR build a self-contained
  diagnostic page.
- noindex meta tag: still correctly not needed - no provider content renders on any public
  page yet (Viator integration is backend-only, nothing surfaced in the UI).

