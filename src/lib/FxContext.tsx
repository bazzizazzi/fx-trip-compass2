import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { fetchCurrentRates, fetchHistoricalRates, dateYearsAgo, type RatesSnapshot } from "./fxLive";

type HistState = Record<number, RatesSnapshot | null | "loading">;

type Ctx = {
  current: RatesSnapshot | null;
  currentLoading: boolean;
  historical: HistState;
  ensureHistorical: (years: number) => void;
};

const FxContext = createContext<Ctx | null>(null);

export function FxProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<RatesSnapshot | null>(null);
  const [currentLoading, setCurrentLoading] = useState(true);
  const [historical, setHistorical] = useState<HistState>({});
  // Tracks every year we've EVER attempted (loading, success, OR failure) so a
  // failed fetch (historical[years] === null) is never silently falsy-retried.
  // A ref (not state) so this check is stable across renders without needing
  // `historical` in any dependency array.
  const attempted = useRef<Set<number>>(new Set());

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

  const ensureHistorical = useCallback((years: number) => {
    if (attempted.current.has(years)) return;
    attempted.current.add(years);
    setHistorical((h) => ({ ...h, [years]: "loading" }));
    fetchHistoricalRates(dateYearsAgo(years)).then((snap) => {
      setHistorical((h) => ({ ...h, [years]: snap }));
    });
  }, []);

  return (
    <FxContext.Provider value={{ current, currentLoading, historical, ensureHistorical }}>
      {children}
    </FxContext.Provider>
  );
}

export function useFx() {
  const ctx = useContext(FxContext);
  if (!ctx) throw new Error("useFx must be used within FxProvider");
  return ctx;
}
