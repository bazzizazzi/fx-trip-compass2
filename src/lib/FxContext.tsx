import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentRates, type RatesSnapshot } from "./fxLive";
import historicalData from "../data/historical-fx.json";

type HistoricalSnapshot = { date: string; rates: Record<string, number> };
type HistoricalFile = {
  generatedAt: string;
  source: string;
  resolution: string;
  base: string;
  snapshots: Record<string, HistoricalSnapshot>; // keyed "YYYY-MM"
};

const HISTORICAL = historicalData as unknown as HistoricalFile;

/** Available "YYYY-MM" keys, oldest first - drives the slider's range. */
export const AVAILABLE_HISTORY_MONTHS: string[] = Object.keys(HISTORICAL.snapshots).sort();

export const HISTORICAL_SOURCE = HISTORICAL.source;

type Ctx = {
  current: RatesSnapshot | null;
  currentLoading: boolean;
  /**
   * Historical data is a STATIC file (see scripts/fetch-historical-fx.mjs,
   * refreshed monthly via .github/workflows/refresh-fx-history.yml) - this is a
   * synchronous lookup, never a network call. Key is "YYYY-MM".
   */
  getHistorical: (monthKey: string) => (RatesSnapshot & { actualDate: string }) | null;
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

  function getHistorical(monthKey: string): (RatesSnapshot & { actualDate: string }) | null {
    const snap = HISTORICAL.snapshots[monthKey];
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
