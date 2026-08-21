import { useMemo, useState, useEffect } from "react";
import Hero from "./components/Hero";
import Tabs from "./components/Tabs";
import FilterBar, { type Filters } from "./components/FilterBar";
import DestinationCard from "./components/DestinationCard";
import YearSlider from "./components/YearSlider";
import LiveDataBadge from "./components/LiveDataBadge";
import { HOME_COUNTRIES, visibleDestinationsFor, allDestinations } from "./lib/destinations";
import { getCurrencyMeta } from "./lib/fx";
import { currentMonth } from "./lib/months";
import { rankCheapestNow, rankBiggestMovers } from "./lib/rank";
import { useI18n } from "./lib/i18n";
import { useFx } from "./lib/FxContext";
import { useFlightsCapability, useFlightCosts } from "./lib/useFlights";
import { dateRangeForMonth } from "./lib/months";
import { ShieldAlert, Info } from "lucide-react";

const STORAGE_KEY = "fxtrip.home_country";

export default function App() {
  const { t } = useI18n();
  const { current, currentLoading, historical, ensureHistorical } = useFx();

  const [homeCountryCode, setHomeCountryCode] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "US";
  });
  const homeCountry = HOME_COUNTRIES.find((c) => c.code === homeCountryCode)!;
  const homeCurrency = homeCountry.currency;

  const [tab, setTab] = useState<"cheap" | "movers">("cheap");
  const [years, setYears] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    month: currentMonth(),
    days: 6,
    maxBudgetHome: null,
    minStars: 3,
    hiddenGemsOnly: false,
    includeFlights: false,
  });

  const flightsAvailable = useFlightsCapability();
  const visible = useMemo(() => visibleDestinationsFor(homeCountryCode), [homeCountryCode]);
  const { checkin, checkout } = useMemo(() => dateRangeForMonth(filters.month, filters.days), [filters.month, filters.days]);
  const flightCosts = useFlightCosts(
    visible,
    filters.includeFlights && flightsAvailable,
    homeCurrency,
    current?.rates ?? null,
    checkin,
    checkout
  );

  function handleHomeChange(code: string) {
    setHomeCountryCode(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  useEffect(() => {
    if (tab === "movers") ensureHistorical(years);
  }, [tab, years, ensureHistorical]);

  const totalCount = useMemo(() => allDestinations().length, []);
  const excludedCount = totalCount - visible.length;

  const pastSnap = historical[years];
  const pastRates = pastSnap && pastSnap !== "loading" ? pastSnap.rates : null;

  const cheapResults = useMemo(() => {
    if (!current) return [];
    return rankCheapestNow(visible, current.rates, homeCurrency, filters, "bigmac", flightCosts);
  }, [visible, current, homeCurrency, filters, flightCosts]);

  const moverResults = useMemo(() => {
    if (!current || !pastRates) return [];
    return rankBiggestMovers(visible, current.rates, pastRates, homeCurrency, filters);
  }, [visible, current, pastRates, homeCurrency, filters]);

  const results = tab === "cheap" ? cheapResults : moverResults;
  const moversLoading = tab === "movers" && (pastSnap === "loading" || pastSnap === undefined);
  const moversFailed = tab === "movers" && pastSnap === null;

  return (
    <div className="min-h-screen">
      <Hero
        homeCountryCode={homeCountryCode}
        homeCurrency={homeCurrency}
        onChangeHome={handleHomeChange}
        currentRates={current?.rates ?? null}
      />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <Tabs
            tabs={[
              { id: "cheap", label: t.tabCheapLabel, sub: t.tabCheapSub + homeCurrency },
              { id: "movers", label: t.tabMoversLabel, sub: t.tabMoversSub },
            ]}
            active={tab}
            onChange={(id) => setTab(id as "cheap" | "movers")}
          />
          <LiveDataBadge snapshot={tab === "cheap" ? current : (pastSnap && pastSnap !== "loading" ? pastSnap : current)} />
        </div>

        {tab === "movers" && (
          <div className="mt-4 space-y-3">
            <YearSlider years={years} onChange={setYears} label={t.moversSliderLabel} unit={t.moversYearsUnit} />
            <p className="text-xs text-muted leading-relaxed">{t.moversNoHistoryNote}</p>
          </div>
        )}



        <div className="mt-6">
          <FilterBar
            filters={filters}
            onChange={setFilters}
            homeCurrencySymbol={getCurrencyMeta(homeCurrency).symbol}
            flightsAvailable={flightsAvailable}
          />
        </div>

        {excludedCount > 0 && (
          <div className="mt-5 flex items-start gap-2 text-xs text-muted bg-ink/[0.03] border border-ink/10 rounded-xl px-4 py-3">
            <ShieldAlert size={15} className="mt-0.5 shrink-0" />
            <span>{t.excludedNote(excludedCount)}</span>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(currentLoading || moversLoading) && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="font-display text-lg text-ink">…</p>
            </div>
          )}
          {moversFailed && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="font-display text-lg text-ink mb-1">{t.noResultsTitle}</p>
              <p className="text-sm">{t.moversNoHistoryNote}</p>
            </div>
          )}
          {!currentLoading && !moversLoading && !moversFailed && results.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted">
              <p className="font-display text-lg text-ink mb-1">{t.noResultsTitle}</p>
              <p className="text-sm">{t.noResultsSub}</p>
            </div>
          )}
          {!currentLoading && !moversLoading && !moversFailed && current && results.map((d) => (
            <DestinationCard
              key={d.id}
              dest={d}
              homeCurrency={homeCurrency}
              currentRates={current.rates}
              pastRates={tab === "movers" ? pastRates ?? undefined : undefined}
              bigMacs={tab === "cheap" ? (d as typeof d & { bigMacs?: number }).bigMacs : undefined}
              bigMacEstimated={tab === "cheap" ? (d as typeof d & { bigMacEstimated?: boolean }).bigMacEstimated : undefined}
              pli={tab === "cheap" ? (d as typeof d & { pli?: number | null }).pli : undefined}
              ppIndex="bigmac"
              days={filters.days}
              month={filters.month}
              minStars={filters.minStars}
              showMovement={tab === "movers"}
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-ink/10 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-muted space-y-2">
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p className="max-w-3xl leading-relaxed">{t.footerDisclosure}</p>
          </div>
          <div className="flex gap-4 pt-2">
            <a href="/methodology" className="hover:text-ink hover:underline">{t.methodologyLink}</a>
            <a href="/privacy" className="hover:text-ink hover:underline">{t.privacyPolicyLink}</a>
            <a href="/terms" className="hover:text-ink hover:underline">{t.termsLink}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
