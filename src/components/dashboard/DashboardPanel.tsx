"use client";

import { useMemo } from "react";
import { generatePortfolio } from "@/lib/data/mockMarketData";
import PortfolioChart from "./PortfolioChart";
import LiveMetrics from "./LiveMetrics";
import LiveWatchList from "./LiveWatchList";
import LiveChart from "./LiveChart";

export default function DashboardPanel() {
  const portfolio = useMemo(() => generatePortfolio(), []);

  const totalValue = portfolio.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.avgPrice * p.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalReturn = (totalPnL / totalCost) * 100;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3 gap-3" style={{ background: "var(--ag-bg)" }}>
      <LiveMetrics totalValue={totalValue} totalPnL={totalPnL} totalReturn={totalReturn} />
      <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
        <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-muted)" }}>PORTFOLIO ALLOCATION</h3>
          <PortfolioChart portfolio={portfolio} />
        </div>
        <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
          <LiveChart symbol="SPY" color="#00d4aa" />
        </div>
      </div>
      <div className="rounded-lg border p-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <LiveWatchList />
      </div>
    </div>
  );
}
