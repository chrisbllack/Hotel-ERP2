import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_MARKET, MARKETS, getMarket, isMarketId, type MarketId, type MarketProfile } from "./markets";
import { configureFormatter } from "../lib/utils";

const STORAGE_KEY = "infineon.market";

interface MarketState {
  market: MarketProfile;
  marketId: MarketId;
  markets: MarketProfile[];
  setMarket: (id: MarketId) => void;
  /** Effective tax rate for a revenue stream, summing inclusive + exclusive. */
  taxRateFor: (scope: "rooms" | "fnb" | "both" | "services") => number;
}

const MarketContext = createContext<MarketState | null>(null);

function readStoredMarket(): MarketId {
  if (typeof window === "undefined") return DEFAULT_MARKET;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isMarketId(stored)) return stored;
  } catch {
    /* storage unavailable — fall through */
  }
  return DEFAULT_MARKET;
}

export function MarketProvider({ children }: { children: ReactNode }) {
  const [marketId, setMarketId] = useState<MarketId>(readStoredMarket);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-market", marketId);
    root.setAttribute("lang", marketId === "CN" ? "zh-CN" : marketId === "IN" ? "en-IN" : marketId === "US" ? "en-US" : "en-NG");
    configureFormatter(marketId);
    try {
      window.localStorage.setItem(STORAGE_KEY, marketId);
    } catch {
      /* ignore persistence failures */
    }
  }, [marketId]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isMarketId(event.newValue)) setMarketId(event.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const taxRateFor = useCallback(
    (scope: "rooms" | "fnb" | "both" | "services") => {
      const profile = getMarket(marketId);
      return profile.taxes
        .filter((t) => t.scope === scope || t.scope === "both")
        .reduce((sum, t) => sum + t.rate, 0);
    },
    [marketId],
  );

  const value = useMemo<MarketState>(
    () => ({ market: getMarket(marketId), marketId, markets: MARKETS, setMarket: setMarketId, taxRateFor }),
    [marketId, taxRateFor],
  );

  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}

export function useMarket(): MarketState {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket must be used within MarketProvider");
  return ctx;
}
