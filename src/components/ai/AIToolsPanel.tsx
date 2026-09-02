"use client";

import { useState, useCallback } from "react";

interface AnalysisResult {
  type: string;
  data: Record<string, unknown>;
  loading: boolean;
  error?: string;
}

const AI_TOOLS = [
  { id: "technical", name: "Technical Analysis", icon: "T", description: "SMA, EMA, RSI, MACD signals with buy/sell recommendation", color: "#00d4aa", free: true },
  { id: "sentiment", name: "Sentiment Analysis", icon: "S", description: "Market sentiment from news, social media, and analyst reports", color: "#6366f1", free: true },
  { id: "risk", name: "Risk Assessment", icon: "R", description: "VaR, CVaR, Sharpe, Sortino, max drawdown, Kelly criterion", color: "#e06c75", free: true },
  { id: "valuation", name: "DCF Valuation", icon: "V", description: "Intrinsic value via DCF and Graham formula with upside/downside", color: "#f0b429", free: true },
  { id: "portfolio-opt", name: "Portfolio Optimizer", icon: "P", description: "Mean-variance optimization, efficient frontier, correlation matrix", color: "#56b6c2", free: false },
  { id: "algo-signals", name: "Algorithmic Signals", icon: "A", description: "ML-driven trade signals with confidence scores and entry/exit points", color: "#c678dd", free: false },
  { id: "macro-forecast", name: "Macro Forecaster", icon: "M", description: "GDP, inflation, rates prediction with scenario analysis", color: "#e5c07b", free: false },
  { id: "options-pricer", name: "Options Pricer", icon: "O", description: "Real-time Greeks, IV surface, optimal strategy suggestion", color: "#61afef", free: false },
] as const;

function ResultDisplay({ result }: { result: AnalysisResult }) {
  if (result.loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--ag-accent)", borderTopColor: "transparent" }} />
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Analyzing...</span>
        </div>
      </div>
    );
  }

  if (result.error) {
    return <div className="p-3 rounded text-xs" style={{ background: "rgba(224,108,117,0.1)", color: "#e06c75" }}>{result.error}</div>;
  }

  const data = result.data;

  if (result.type === "technical") {
    const rec = data.recommendation as string || "N/A";
    const recColor = rec.includes("BUY") ? "#00d4aa" : rec.includes("SELL") ? "#e06c75" : "#f0b429";
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Recommendation</span>
          <span className="text-sm font-bold px-3 py-1 rounded" style={{ background: recColor + "22", color: recColor }}>{rec}</span>
        </div>
        <div className="text-xs" style={{ color: "var(--ag-muted)" }}>
          Confidence: <span style={{ color: "var(--ag-text)" }}>{data.confidence as number}%</span> | Score: <span style={{ color: "var(--ag-text)" }}>{data.score as number}/6</span>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--ag-muted)" }}>Indicators</div>
          {Object.entries(data.indicators as Record<string, number>).map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs py-0.5">
              <span style={{ color: "var(--ag-muted)" }}>{key.toUpperCase()}</span>
              <span className="font-mono" style={{ color: "var(--ag-text)" }}>{val}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--ag-muted)" }}>Signals</div>
          {(data.signals as string[]).map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: s.includes("bullish") || s.includes("Golden") ? "#00d4aa" : s.includes("bearish") || s.includes("Death") ? "#e06c75" : "var(--ag-text)" }}>
              <span>{s.includes("bullish") || s.includes("Golden") || s.includes("bounce") ? "+" : s.includes("bearish") || s.includes("Death") || s.includes("reversal") ? "-" : "="}</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (result.type === "sentiment") {
    const label = data.label as string;
    const labelColor = label === "Bullish" ? "#00d4aa" : label === "Bearish" ? "#e06c75" : "#f0b429";
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Overall Sentiment</span>
          <span className="text-sm font-bold px-3 py-1 rounded" style={{ background: labelColor + "22", color: labelColor }}>{label} ({data.overall as number}%)</span>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--ag-muted)" }}>Sources</div>
          {Object.entries(data.sources as Record<string, number>).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-xs py-0.5">
              <span className="flex-1" style={{ color: "var(--ag-muted)" }}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
              <div className="w-24 h-1.5 rounded-full" style={{ background: "var(--ag-border)" }}>
                <div className="h-full rounded-full" style={{ width: `${val}%`, background: val > 65 ? "#00d4aa" : val < 35 ? "#e06c75" : "#f0b429" }} />
              </div>
              <span className="font-mono w-10 text-right" style={{ color: "var(--ag-text)" }}>{val}%</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--ag-muted)" }}>Buzz: {data.buzzVolume as string}</div>
          <div className="flex flex-wrap gap-1">
            {(data.topKeywords as string[]).map((kw) => (
              <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>{kw}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result.type === "risk") {
    const riskColor = data.riskLevel === "HIGH" ? "#e06c75" : data.riskLevel === "MEDIUM" ? "#f0b429" : "#00d4aa";
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Risk Level</span>
          <span className="text-sm font-bold px-3 py-1 rounded" style={{ background: riskColor + "22", color: riskColor }}>{data.riskLevel as string}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Ann. Return", value: `${data.annualizedReturn}%`, color: (data.annualizedReturn as number) > 0 ? "#00d4aa" : "#e06c75" },
            { label: "Ann. Volatility", value: `${data.annualizedVolatility}%` },
            { label: "Sharpe Ratio", value: `${data.sharpeRatio}` },
            { label: "Sortino Ratio", value: `${data.sortinoRatio}` },
            { label: "Max Drawdown", value: `${data.maxDrawdown}%`, color: "#e06c75" },
            { label: "VaR (95%)", value: `${data.var95}%` },
            { label: "CVaR (95%)", value: `${data.cvar95}%` },
            { label: "Kelly Fraction", value: `${data.kellyFraction}%` },
            { label: "Skewness", value: `${data.skewness}` },
            { label: "Kurtosis", value: `${data.kurtosis}` },
          ].map((m) => (
            <div key={m.label} className="flex justify-between text-xs py-0.5">
              <span style={{ color: "var(--ag-muted)" }}>{m.label}</span>
              <span className="font-mono" style={{ color: m.color || "var(--ag-text)" }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (result.type === "valuation") {
    const verdict = data.verdict as string;
    const verdictColor = verdict === "UNDERVALUED" ? "#00d4aa" : verdict === "OVERVALUED" ? "#e06c75" : "#f0b429";
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Verdict</span>
          <span className="text-sm font-bold px-3 py-1 rounded" style={{ background: verdictColor + "22", color: verdictColor }}>{verdict}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs" style={{ color: "var(--ag-muted)" }}>Upside/Downside:</span>
          <span className="text-lg font-bold" style={{ color: (data.upside as number) > 0 ? "#00d4aa" : "#e06c75" }}>
            {(data.upside as number) > 0 ? "+" : ""}{data.upside as number}%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
            <div className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>DCF Value</div>
            <div className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>${(data.intrinsicValue as Record<string, number>).dcf}</div>
          </div>
          <div className="p-2 rounded" style={{ background: "var(--ag-bg)" }}>
            <div className="text-[10px] uppercase" style={{ color: "var(--ag-muted)" }}>Graham Value</div>
            <div className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>${(data.intrinsicValue as Record<string, number>).graham}</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--ag-muted)" }}>Multiples</div>
          {Object.entries(data.multiples as Record<string, number>).map(([key, val]) => (
            <div key={key} className="flex justify-between text-xs py-0.5">
              <span style={{ color: "var(--ag-muted)" }}>{key.toUpperCase()}</span>
              <span className="font-mono" style={{ color: "var(--ag-text)" }}>{val}x</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <pre className="text-[10px] overflow-auto p-2 rounded" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function AIToolsPanel() {
  const [symbol, setSymbol] = useState("AAPL");
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});

  const runAnalysis = useCallback(async (toolId: string) => {
    setResults((prev) => ({ ...prev, [toolId]: { type: toolId, data: {}, loading: true } }));

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, analysisType: toolId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResults((prev) => ({ ...prev, [toolId]: { type: toolId, data, loading: false } }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [toolId]: { type: toolId, data: {}, loading: false, error: err instanceof Error ? err.message : "Failed" },
      }));
    }
  }, [symbol]);

  const quickSymbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "JPM", "BRK-B", "V"];

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--ag-bg)" }}>
      <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--ag-accent)">
            <path d="M8 1l2 5h5l-4 3.5 1.5 5L8 11.5 3.5 14.5 5 9.5 1 6h5z" />
          </svg>
          <h1 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>NUR Finance AI Tools</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
            {AI_TOOLS.filter((t) => t.free).length} Free
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Symbol (e.g. AAPL)"
            className="flex-1 px-3 py-1.5 rounded border text-xs bg-transparent outline-none focus:border-[var(--ag-accent)]"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
            onKeyDown={(e) => { if (e.key === "Enter") AI_TOOLS.filter((t) => t.free).forEach((t) => runAnalysis(t.id)); }}
          />
          <button
            onClick={() => AI_TOOLS.filter((t) => t.free).forEach((t) => runAnalysis(t.id))}
            className="px-4 py-1.5 rounded text-xs font-semibold transition-colors"
            style={{ background: "var(--ag-accent)", color: "var(--ag-bg)" }}
          >
            Analyze All
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {quickSymbols.map((s) => (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className="text-[10px] px-2 py-0.5 rounded border transition-colors"
              style={{
                borderColor: symbol === s ? "var(--ag-accent)" : "var(--ag-border)",
                color: symbol === s ? "var(--ag-accent)" : "var(--ag-muted)",
                background: symbol === s ? "rgba(0,212,170,0.1)" : "transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          {AI_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="rounded-lg border p-3"
              style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold"
                    style={{ background: tool.color + "22", color: tool.color }}
                  >
                    {tool.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: "var(--ag-text)" }}>{tool.name}</div>
                    <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{tool.description}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
                  background: tool.free ? "rgba(0,212,170,0.1)" : "rgba(240,180,41,0.1)",
                  color: tool.free ? "#00d4aa" : "#f0b429",
                }}>
                  {tool.free ? "FREE" : "PRO"}
                </span>
                <button
                  onClick={() => tool.free ? runAnalysis(tool.id) : undefined}
                  className="text-[10px] px-2 py-1 rounded transition-colors"
                  style={{
                    background: tool.free ? tool.color + "22" : "var(--ag-border)",
                    color: tool.free ? tool.color : "var(--ag-muted)",
                    cursor: tool.free ? "pointer" : "not-allowed",
                  }}
                >
                  {tool.free ? "Run" : "Upgrade"}
                </button>
              </div>

              {results[tool.id] && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--ag-border)" }}>
                  <ResultDisplay result={results[tool.id]} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-4" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
          <h2 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-text)" }}>
            Terminal Integration
          </h2>
          <p className="text-[11px] mb-3" style={{ color: "var(--ag-muted)" }}>
            All AI tools are available in the NUR Terminal via commands. Terminal users get server-side computation
            with higher rate limits and access to premium models.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { cmd: "AI TECH AAPL", desc: "Technical analysis" },
              { cmd: "AI SENT MSFT", desc: "Sentiment analysis" },
              { cmd: "AI RISK NVDA", desc: "Risk assessment" },
              { cmd: "AI VAL GOOGL", desc: "DCF valuation" },
              { cmd: "AI OPT TSLA", desc: "Portfolio optimization" },
              { cmd: "AI SIG SPY", desc: "Algo signals" },
            ].map((item) => (
              <div key={item.cmd} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "var(--ag-bg)" }}>
                <code className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
                  {item.cmd}
                </code>
                <span className="text-[10px]" style={{ color: "var(--ag-muted)" }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
