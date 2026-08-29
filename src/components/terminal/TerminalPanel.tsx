"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";

export default function TerminalPanel() {
  const { consoleMessages, addConsoleMessage, clearConsole } = useIDEStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const handleCommand = async (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "clear":
        clearConsole();
        return;

      case "help":
        addConsoleMessage({ type: "output", text: "Available commands:" });
        addConsoleMessage({ type: "output", text: "  help              Show this help" });
        addConsoleMessage({ type: "output", text: "  clear             Clear terminal" });
        addConsoleMessage({ type: "output", text: "  status            Engine status" });
        addConsoleMessage({ type: "output", text: "  version           Version info" });
        addConsoleMessage({ type: "output", text: "  quote <SYMBOL>    Get live market quote" });
        addConsoleMessage({ type: "output", text: "  rsi <SYMBOL>      Get RSI indicator" });
        addConsoleMessage({ type: "output", text: "  sma <SYMBOL> [P]  Get SMA (default period 20)" });
        addConsoleMessage({ type: "output", text: "  stats <SYMBOL>    Get risk/return stats" });
        addConsoleMessage({ type: "output", text: "  backtest <SYM>    Quick SMA crossover backtest" });
        addConsoleMessage({ type: "output", text: "  watchlist         Show all quotes" });
        return;

      case "status":
        addConsoleMessage({ type: "success", text: "AntiGravi Engine: ONLINE" });
        addConsoleMessage({ type: "output", text: "API Routes: /market-data, /indicators, /backtest" });
        addConsoleMessage({ type: "output", text: "Strategies: SMA Crossover, RSI Mean Reversion, Momentum" });
        return;

      case "version":
        addConsoleMessage({ type: "output", text: "AntiGravi IDE v2.1.0 | Engine v2.1 | Nur Finance" });
        addConsoleMessage({ type: "output", text: "Features: Live Market Data, Technical Indicators, Backtesting" });
        return;

      case "quote": {
        const symbol = (args[0] || "AAPL").toUpperCase();
        addConsoleMessage({ type: "info", text: `Fetching quote for ${symbol}...` });
        try {
          const res = await fetch(`/api/market-data?type=quotes&symbols=${symbol}`);
          const data = await res.json();
          const q = data.data?.[0];
          if (q) {
            addConsoleMessage({ type: "output", text: `${q.symbol} (${q.name})` });
            addConsoleMessage({ type: "output", text: `  Price: $${q.price.toFixed(2)}  Change: ${q.change >= 0 ? "+" : ""}${q.change.toFixed(2)} (${q.changePercent >= 0 ? "+" : ""}${q.changePercent.toFixed(2)}%)` });
            addConsoleMessage({ type: "output", text: `  Open: $${q.open.toFixed(2)}  High: $${q.dayHigh.toFixed(2)}  Low: $${q.dayLow.toFixed(2)}` });
            addConsoleMessage({ type: "output", text: `  Volume: ${q.volume.toLocaleString()}  [${data.source}]` });
          } else {
            addConsoleMessage({ type: "warning", text: `No data for ${symbol}` });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to fetch quote" });
        }
        return;
      }

      case "watchlist": {
        addConsoleMessage({ type: "info", text: "Fetching watchlist..." });
        try {
          const res = await fetch("/api/market-data?type=quotes");
          const data = await res.json();
          addConsoleMessage({ type: "output", text: `Source: ${data.source} | ${data.data.length} symbols` });
          for (const q of data.data) {
            const arrow = q.changePercent >= 0 ? "+" : "";
            addConsoleMessage({
              type: "output",
              text: `  ${q.symbol.padEnd(10)} $${q.price.toFixed(2).padStart(10)}  ${arrow}${q.changePercent.toFixed(2)}%`,
            });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to fetch watchlist" });
        }
        return;
      }

      case "rsi": {
        const symbol = (args[0] || "AAPL").toUpperCase();
        addConsoleMessage({ type: "info", text: `Computing RSI for ${symbol}...` });
        try {
          const res = await fetch(`/api/indicators?symbol=${symbol}&indicator=rsi&period=14`);
          const data = await res.json();
          if (data.rsi) {
            const latest = data.rsi.filter((v: number) => !isNaN(v));
            const current = latest[latest.length - 1];
            const zone = current > 70 ? "OVERBOUGHT" : current < 30 ? "OVERSOLD" : "NEUTRAL";
            const zoneColor = current > 70 ? "warning" : current < 30 ? "success" : "info";
            addConsoleMessage({ type: "output", text: `${symbol} RSI(14): ${current.toFixed(2)}` });
            addConsoleMessage({ type: zoneColor as "warning" | "success" | "info", text: `  Zone: ${zone}` });
          } else {
            addConsoleMessage({ type: "error", text: data.error || "Failed" });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to compute RSI" });
        }
        return;
      }

      case "sma": {
        const symbol = (args[0] || "AAPL").toUpperCase();
        const period = parseInt(args[1] || "20");
        addConsoleMessage({ type: "info", text: `Computing SMA(${period}) for ${symbol}...` });
        try {
          const res = await fetch(`/api/indicators?symbol=${symbol}&indicator=sma&period=${period}`);
          const data = await res.json();
          if (data.sma) {
            const valid = data.sma.filter((v: number) => !isNaN(v));
            const current = valid[valid.length - 1];
            addConsoleMessage({ type: "output", text: `${symbol} SMA(${period}): $${current.toFixed(2)}` });
            addConsoleMessage({ type: "output", text: `  Data points: ${data.dataPoints}` });
          } else {
            addConsoleMessage({ type: "error", text: data.error || "Failed" });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to compute SMA" });
        }
        return;
      }

      case "stats": {
        const symbol = (args[0] || "SPY").toUpperCase();
        addConsoleMessage({ type: "info", text: `Computing stats for ${symbol}...` });
        try {
          const res = await fetch(`/api/indicators?symbol=${symbol}&indicator=stats&range=1y`);
          const data = await res.json();
          if (data.stats) {
            addConsoleMessage({ type: "output", text: `${symbol} Risk/Return Statistics (1Y):` });
            addConsoleMessage({ type: "output", text: `  Sharpe Ratio:  ${data.stats.sharpeRatio.toFixed(3)}` });
            addConsoleMessage({ type: "output", text: `  Max Drawdown:  -${data.stats.maxDrawdown.toFixed(2)}%` });
            addConsoleMessage({ type: "output", text: `  Volatility:    ${data.stats.volatility.toFixed(2)}%` });
            addConsoleMessage({ type: "output", text: `  Total Return:  ${data.stats.totalReturn >= 0 ? "+" : ""}${data.stats.totalReturn.toFixed(2)}%` });
          } else {
            addConsoleMessage({ type: "error", text: data.error || "Failed" });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to compute stats" });
        }
        return;
      }

      case "backtest": {
        const symbol = (args[0] || "AAPL").toUpperCase();
        addConsoleMessage({ type: "info", text: `Running SMA crossover backtest on ${symbol}...` });
        try {
          const res = await fetch(`/api/backtest?symbol=${symbol}&strategy=sma_crossover&range=1y`);
          const data = await res.json();
          if (data.result) {
            const r = data.result;
            addConsoleMessage({ type: "success", text: `${r.strategy} on ${r.symbol}:` });
            addConsoleMessage({ type: "output", text: `  Return:     ${r.totalReturn >= 0 ? "+" : ""}${r.totalReturn}%` });
            addConsoleMessage({ type: "output", text: `  Sharpe:     ${r.sharpeRatio}` });
            addConsoleMessage({ type: "output", text: `  Max DD:     -${r.maxDrawdown}%` });
            addConsoleMessage({ type: "output", text: `  Trades:     ${r.trades} (Win Rate: ${r.winRate}%)` });
            addConsoleMessage({ type: "output", text: `  Buy & Hold: ${data.benchmark.totalReturn >= 0 ? "+" : ""}${data.benchmark.totalReturn}%` });
            const alpha = r.totalReturn - data.benchmark.totalReturn;
            addConsoleMessage({
              type: alpha >= 0 ? "success" : "warning",
              text: `  Alpha:      ${alpha >= 0 ? "+" : ""}${alpha.toFixed(2)}%`,
            });
          } else {
            addConsoleMessage({ type: "error", text: data.error || "Backtest failed" });
          }
        } catch {
          addConsoleMessage({ type: "error", text: "Failed to run backtest" });
        }
        return;
      }

      default:
        addConsoleMessage({ type: "warning", text: `Unknown command: ${command}. Type 'help' for available commands.` });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addConsoleMessage({ type: "info", text: `$ ${input}` });
    setHistory((h) => [input, ...h].slice(0, 50));
    setHistoryIndex(-1);
    handleCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const colorMap: Record<string, string> = {
    info: "var(--ag-accent)",
    error: "var(--ag-danger)",
    success: "var(--ag-success)",
    warning: "var(--ag-warning)",
    output: "var(--ag-text)",
  };

  return (
    <div className="flex flex-col h-full border-t" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
      <div className="flex items-center h-7 px-3 border-b"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>
          Terminal
        </span>
        <span className="text-[9px] ml-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
          v2.1
        </span>
        <div className="flex-1" />
        <button onClick={clearConsole} className="text-[10px] hover:underline" style={{ color: "var(--ag-muted)" }}>
          Clear
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-5">
        {consoleMessages.map((msg) => (
          <div key={msg.id} className="flex gap-2">
            <span style={{ color: "var(--ag-muted)" }}>
              {msg.timestamp.toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span style={{ color: colorMap[msg.type] }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center h-7 px-2 border-t"
        style={{ borderColor: "var(--ag-border)" }}>
        <span className="text-xs mr-1" style={{ color: "var(--ag-accent)" }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-xs font-mono"
          style={{ color: "var(--ag-text)" }}
          placeholder="Type a command... (try: quote AAPL, rsi NVDA, backtest MSFT)"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
