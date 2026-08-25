import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentRates, type RatesSnapshot } from "./fxLive";
import historicalData from "../data/historical-fx.json";

type HistoricalSnapshot = { date: string; rates: Record<string, number> };
type HistoricalFile = {
  generatedAt: string;
  source: string;
  base: string;
  snapshots: Record<string, HistoricalSnapshot>;
};

const HISTORICAL = historicalData as HistoricalFile;

/** Which yearly lookback points actually have data - drives the slider's available steps. */
export const AVAILABLE_HISTORY_YEARS: number[] = Object.keys(HISTORICAL.snapshots)
  .map(Number)
  .sort((a, b) => a - b);

export const HISTORICAL_SOURCE = HISTORICAL.source;
export const HISTORICAL_GENERATED_AT = HISTORICAL.generatedAt;

type Ctx = {
  current: RatesSnapshot | null;
  currentLoading: boolean;
  /**
   * Historical data is a STATIC file (see scripts/fetch-historical-fx.mjs,
   * refreshed monthly via .github/workflows/refresh-fx-history.yml) - this is
   * a synchronous lookup, never a network call. No loading state, no retry
   * logic needed, and nothing to flicker: it's either in the file or it isn't.
   */
  getHistorical: (years: number) => (RatesSnapshot & { actualDate: string }) | null;
};

const FxContext = createContext<Ctx | null>(null);

export function FxProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<RatesSnapshot | null>(null);
  const [currentLoading, setCurrentLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCurrentRates().then((snap) => {
      if (!cancelled) {
        setCurrent(snap);
        setCurrentLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function getHistorical(years: number): (RatesSnapshot & { actualDate: string }) | null {
    const snap = HISTORICAL.snapshots[String(years)];
    if (!snap) return null;
    return { rates: snap.rates, asOf: snap.date, source: "live", actualDate: snap.date };
  }

  return (
    <FxContext.Provider value={{ current, currentLoading, getHistorical }}>
      {children}
    </FxContext.Provider>
  );
}

export function useFx() {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error("useFx must be used within FxProvider");
  return ctx;
}
