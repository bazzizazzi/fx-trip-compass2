import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
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
  const inFlight = useRef<Set<number>>(new Set());

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

  function ensureHistorical(years: number) {
    if (historical[years] || inFlight.current.has(years)) return;
    inFlight.current.add(years);
    setHistorical((h) => ({ ...h, [years]: "loading" }));
    fetchHistoricalRates(dateYearsAgo(years)).then((snap) => {
      inFlight.current.delete(years);
      setHistorical((h) => ({ ...h, [years]: snap }));
    });
  }

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
