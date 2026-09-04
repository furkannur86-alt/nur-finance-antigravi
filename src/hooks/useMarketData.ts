"use client";

import { useState, useEffect, useCallback } from "react";
import { generatePortfolio, generateWatchlistPrices } from "@/lib/data/mockMarketData";
import type { PortfolioItem } from "@/types";

interface MarketDataState {
  portfolio: PortfolioItem[];
  source: "live" | "demo";
  loading: boolean;
}

export function usePortfolioData(): MarketDataState {
  const [state, setState] = useState<MarketDataState>(() => ({
    portfolio: generatePortfolio(),
    source: "demo",
    loading: true,
  }));

  const fetchLiveData = useCallback(async () => {
    try {
      const mockPortfolio = generatePortfolio();
      const symbols = mockPortfolio.map((p) => p.symbol).join(",");
      const res = await fetch(`/api/market-data?type=quotes&symbols=${symbols}`);
      if (!res.ok) throw new Error("API error");
      const json = await res.json();

      if (json.source === "live" && json.data?.length > 0) {
        const quoteMap = new Map<string, { price: number; change: number; changePercent: number }>();
        for (const q of json.data) {
          quoteMap.set(q.symbol, { price: q.price, change: q.change, changePercent: q.changePercent });
        }

        const updated = mockPortfolio.map((item) => {
          const live = quoteMap.get(item.symbol);
          if (!live) return item;
          const change = live.price - item.avgPrice;
          const changePercent = (change / item.avgPrice) * 100;
          return {
            ...item,
            currentPrice: Math.round(live.price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
          };
        });

        setState({ portfolio: updated, source: "live", loading: false });
        return;
      }

      setState({ portfolio: mockPortfolio, source: "demo", loading: false });
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  return state;
}

interface WatchlistState {
  prices: Record<string, { price: number; change: number }>;
  source: "live" | "demo";
}

export function useWatchlistData(): WatchlistState {
  const [state, setState] = useState<WatchlistState>(() => ({
    prices: generateWatchlistPrices(),
    source: "demo",
  }));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/market-data?type=quotes");
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;

        if (json.source === "live" && json.data?.length > 0) {
          const prices: Record<string, { price: number; change: number }> = {};
          for (const q of json.data) {
            prices[q.symbol] = { price: q.price, change: q.changePercent };
          }
          setState({ prices, source: "live" });
        }
      } catch {
        // keep mock data
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}
