"use client";

import { useState, useCallback } from "react";
import { usePortfolioData } from "@/hooks/useMarketData";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import MarketMoodScene from "@/components/ui/MarketMoodScene";
import MoodMusicPlayer from "@/components/ui/MoodMusicPlayer";
import EagleCrest from "@/components/ui/EagleCrest";
import { computeMarketMood } from "@/lib/music/mood-engine";

export default function PortfolioManager() {
  const { portfolio, source } = usePortfolioData();
  const [killSwitchArmed, setKillSwitchArmed] = useState(false);
  const [killSwitchConfirm, setKillSwitchConfirm] = useState(false);
  const [killSwitchExecuted, setKillSwitchExecuted] = useState(false);

  const totalValue = portfolio.reduce((s, p) => s + p.currentPrice * p.quantity, 0);
  const totalCost = portfolio.reduce((s, p) => s + p.avgPrice * p.quantity, 0);
  const totalPnL = totalValue - totalCost;
  const totalReturn = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
  const avgChange = portfolio.length > 0 ? portfolio.reduce((s, p) => s + p.changePercent, 0) / portfolio.length : 0;

  const mood = computeMarketMood(avgChange);

  const executeKillSwitch = useCallback(() => {
    setKillSwitchExecuted(true);
    setKillSwitchConfirm(false);
    setKillSwitchArmed(false);
    setTimeout(() => setKillSwitchExecuted(false), 5000);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-3" style={{ background: "var(--ag-bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <EagleCrest size={28} animate />
          <h2 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Portfolio Manager</h2>
          <DataSourceBadge source={source} />
        </div>
        <div className="flex items-center gap-3">
          <MoodMusicPlayer portfolioChangePercent={avgChange} compact />
          <div className="text-xs font-mono" style={{ color: totalPnL >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
            {totalPnL >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
          </div>
          <div className="text-xs font-mono" style={{ color: "var(--ag-text)" }}>
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Top Row: Mood Scene + Stats + Kill Switch */}
      <div className="flex gap-3 mb-3">
        {/* Mood Scene */}
        <div className="rounded-lg border overflow-hidden shrink-0" style={{ borderColor: "var(--ag-border)" }}>
          <MarketMoodScene mood={mood} size={140} />
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-4 gap-2">
          {[
            { label: "Positions", value: portfolio.length.toString(), color: "var(--ag-accent)" },
            { label: "Total P&L", value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
            { label: "Best Performer", value: portfolio.reduce((b, p) => p.changePercent > b.changePercent ? p : b).symbol, color: "var(--ag-success)" },
            { label: "Worst Performer", value: portfolio.reduce((w, p) => p.changePercent < w.changePercent ? p : w).symbol, color: "var(--ag-danger)" },
            { label: "Avg Return", value: `${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "var(--ag-success)" : "var(--ag-danger)" },
            { label: "Market Mood", value: mood.toUpperCase(), color: mood === "bull" ? "#00d4aa" : mood === "bear" ? "#ef4444" : mood === "volatile" ? "#f59e0b" : "#6366f1" },
            { label: "Total Cost", value: `$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, color: "var(--ag-muted)" },
            { label: "Total Value", value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 0 })}`, color: "var(--ag-accent)" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border p-2" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <div className="text-[9px] uppercase" style={{ color: "var(--ag-muted)" }}>{m.label}</div>
              <div className="text-xs font-bold font-mono" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Kill Switch */}
        <div className="rounded-lg border p-3 w-48 shrink-0" style={{ background: killSwitchArmed ? "rgba(239,68,68,0.05)" : "var(--ag-surface)", borderColor: killSwitchArmed ? "#ef4444" : "var(--ag-border)" }}>
          <div className="text-[10px] font-bold uppercase mb-2" style={{ color: killSwitchArmed ? "#ef4444" : "var(--ag-muted)" }}>
            Kill Switch
          </div>

          {killSwitchExecuted ? (
            <div className="text-center py-2">
              <div className="text-xs font-bold mb-1" style={{ color: "#ef4444" }}>EXECUTED</div>
              <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>
                All positions marked for liquidation. Orders queued.
              </div>
            </div>
          ) : killSwitchConfirm ? (
            <div className="space-y-2">
              <div className="text-[10px] text-center font-bold" style={{ color: "#ef4444" }}>
                CONFIRM: Close ALL {portfolio.length} positions?
              </div>
              <div className="flex gap-1">
                <button onClick={executeKillSwitch}
                  className="flex-1 text-[10px] py-1.5 rounded font-bold"
                  style={{ background: "#ef4444", color: "white" }}>
                  CONFIRM
                </button>
                <button onClick={() => { setKillSwitchConfirm(false); setKillSwitchArmed(false); }}
                  className="flex-1 text-[10px] py-1.5 rounded"
                  style={{ background: "var(--ag-border)", color: "var(--ag-muted)" }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-[9px] mb-2" style={{ color: "var(--ag-muted)" }}>
                Emergency close all positions at market price
              </div>
              {killSwitchArmed ? (
                <button onClick={() => setKillSwitchConfirm(true)}
                  className="w-full text-[10px] py-1.5 rounded font-bold animate-pulse"
                  style={{ background: "#ef4444", color: "white" }}>
                  EXECUTE KILL SWITCH
                </button>
              ) : (
                <button onClick={() => setKillSwitchArmed(true)}
                  className="w-full text-[10px] py-1.5 rounded border transition-colors"
                  style={{ borderColor: "#ef4444", color: "#ef4444", background: "transparent" }}>
                  ARM
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="rounded-lg border overflow-hidden flex-1" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
              <th className="text-left p-2 font-medium">Symbol</th>
              <th className="text-left p-2 font-medium">Name</th>
              <th className="text-right p-2 font-medium">Qty</th>
              <th className="text-right p-2 font-medium">Avg Price</th>
              <th className="text-right p-2 font-medium">Current</th>
              <th className="text-right p-2 font-medium">P&L</th>
              <th className="text-right p-2 font-medium">Return</th>
              <th className="text-right p-2 font-medium">Value</th>
              <th className="text-right p-2 font-medium">Weight</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((item) => {
              const value = item.currentPrice * item.quantity;
              const pnl = item.change * item.quantity;
              const weight = totalValue > 0 ? (value / totalValue) * 100 : 0;
              return (
                <tr key={item.symbol} className="border-b hover:bg-white/[0.02]"
                  style={{ borderColor: "var(--ag-border)" }}>
                  <td className="p-2 font-bold" style={{ color: "var(--ag-accent)" }}>{item.symbol}</td>
                  <td className="p-2" style={{ color: "var(--ag-text)" }}>{item.name}</td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>{item.quantity}</td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>${item.avgPrice.toFixed(2)}</td>
                  <td className="p-2 text-right font-mono" style={{ color: "var(--ag-text)" }}>${item.currentPrice.toFixed(2)}</td>
                  <td className="p-2 text-right font-mono" style={{ color: pnl >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                    {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-mono" style={{ color: item.changePercent >= 0 ? "var(--ag-success)" : "var(--ag-danger)" }}>
                    {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                  </td>
                  <td className="p-2 text-right font-mono font-bold" style={{ color: "var(--ag-text)" }}>
                    ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <div className="w-12 h-1.5 rounded-full" style={{ background: "var(--ag-border)" }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, weight)}%`, background: "var(--ag-accent)" }} />
                      </div>
                      <span className="text-[10px] font-mono w-10 text-right" style={{ color: "var(--ag-muted)" }}>{weight.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Music Player (full) */}
      <div className="mt-3">
        <MoodMusicPlayer portfolioChangePercent={avgChange} />
      </div>
    </div>
  );
}
