"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

const AGENTS = [
  { name: "Alpha Discovery", icon: "🔍", status: "ACTIVE", tasks: 1247, signals: 8, uptime: "99.7%", desc: "Scans 5000+ equities for momentum, mean-reversion & breakout setups", color: "#22c55e" },
  { name: "Risk Management", icon: "🛡️", status: "ACTIVE", tasks: 3892, signals: 3, uptime: "99.9%", desc: "Real-time VaR, drawdown limits, correlation breaks & position sizing", color: "#ef4444" },
  { name: "Execution Agent", icon: "⚡", status: "ACTIVE", tasks: 8451, signals: 12, uptime: "99.8%", desc: "Smart order routing, TWAP/VWAP algos, slippage optimization", color: "#38bdf8" },
  { name: "Research Analyst", icon: "📊", status: "IDLE", tasks: 562, signals: 0, uptime: "98.2%", desc: "NLP-driven earnings analysis, SEC filing parsing & sentiment extraction", color: "#fbbf24" },
  { name: "Portfolio Optimizer", icon: "🎯", status: "ACTIVE", tasks: 2103, signals: 5, uptime: "99.5%", desc: "Mean-variance, Black-Litterman, risk parity & factor-based allocation", color: "#a855f7" },
  { name: "Sentiment Analyzer", icon: "🧠", status: "ACTIVE", tasks: 15420, signals: 6, uptime: "99.4%", desc: "Twitter/Reddit/news sentiment scoring, fear-greed index & crowd positioning", color: "#06b6d4" },
];

const SIGNALS = [
  { ticker: "NVDA", direction: "LONG", confidence: 94, reasoning: "Blackwell GPU cycle + hyperscaler capex surge. RSI breakout above 70 with volume confirmation.", entry: 142.50, target: 178.00, stop: 128.00, agent: "Alpha Discovery", time: "2m ago" },
  { ticker: "TSLA", direction: "SHORT", confidence: 72, reasoning: "Delivery miss + margin compression. Bearish engulfing on daily with declining OBV.", entry: 285.40, target: 245.00, stop: 305.00, agent: "Alpha Discovery", time: "8m ago" },
  { ticker: "AAPL", direction: "LONG", confidence: 88, reasoning: "iPhone 18 pre-order data exceeds consensus. Services revenue inflection point.", entry: 232.80, target: 265.00, stop: 218.00, agent: "Sentiment Analyzer", time: "15m ago" },
  { ticker: "XOM/CVX", direction: "PAIR", confidence: 81, reasoning: "Permian Basin production divergence. XOM +12% QoQ vs CVX flat output.", entry: 1.08, target: 1.18, stop: 1.02, agent: "Portfolio Optimizer", time: "22m ago" },
  { ticker: "CRWD", direction: "LONG", confidence: 91, reasoning: "Federal zero-trust mandate deadline approaching. 60% win rate on govt RFPs.", entry: 382.00, target: 465.00, stop: 348.00, agent: "Alpha Discovery", time: "35m ago" },
  { ticker: "BYND", direction: "SHORT", confidence: 85, reasoning: "Cash runway < 8 months. 2027 convertible maturity with no refi capacity.", entry: 8.20, target: 3.50, stop: 11.00, agent: "Research Analyst", time: "1h ago" },
  { ticker: "META", direction: "LONG", confidence: 77, reasoning: "Reels monetization gap closing. AI ad targeting efficiency gains outpacing peers.", entry: 615.00, target: 710.00, stop: 570.00, agent: "Sentiment Analyzer", time: "1h ago" },
  { ticker: "COIN", direction: "LONG", confidence: 69, reasoning: "Crypto custody regulatory clarity + institutional inflows accelerating.", entry: 285.00, target: 340.00, stop: 255.00, agent: "Alpha Discovery", time: "2h ago" },
];

const BACKTEST_STRATEGIES = [
  { name: "Momentum Alpha v3", annReturn: 28.4, sharpe: 2.12, maxDD: -12.8, winRate: 64.2, trades: 342, avgHold: "4.2d", calmar: 2.22, sortino: 3.15 },
  { name: "Mean Reversion ML", annReturn: 19.6, sharpe: 1.85, maxDD: -8.4, winRate: 58.7, trades: 1247, avgHold: "1.8d", calmar: 2.33, sortino: 2.68 },
  { name: "Pairs Arbitrage", annReturn: 14.2, sharpe: 2.45, maxDD: -5.2, winRate: 61.3, trades: 892, avgHold: "6.5d", calmar: 2.73, sortino: 3.42 },
  { name: "Sentiment Overlay", annReturn: 22.1, sharpe: 1.68, maxDD: -15.3, winRate: 55.4, trades: 186, avgHold: "8.1d", calmar: 1.44, sortino: 2.31 },
  { name: "Factor Rotation", annReturn: 16.8, sharpe: 1.92, maxDD: -10.1, winRate: 52.8, trades: 48, avgHold: "21d", calmar: 1.66, sortino: 2.74 },
];

const MONTHLY_RETURNS = [
  { month: "Jan", ret: 3.2 }, { month: "Feb", ret: -1.4 }, { month: "Mar", ret: 5.8 },
  { month: "Apr", ret: 2.1 }, { month: "May", ret: -0.6 }, { month: "Jun", ret: 4.5 },
  { month: "Jul", ret: 1.8 }, { month: "Aug", ret: -2.3 }, { month: "Sep", ret: 3.9 },
  { month: "Oct", ret: 6.2 }, { month: "Nov", ret: 2.7 },
];

const CHAT_HISTORY = [
  { role: "user" as const, text: "Find me momentum stocks above 200 SMA with RSI > 60" },
  { role: "agent" as const, text: "Scanning 4,892 US equities...\n\nFound 23 matches. Top 5 by momentum score:\n• NVDA — RSI 72.4, +18.2% above 200 SMA, Vol +45%\n• CRWD — RSI 68.1, +14.5% above 200 SMA, Vol +22%\n• VST — RSI 71.8, +22.4% above 200 SMA, Vol +38%\n• PLTR — RSI 65.3, +11.8% above 200 SMA, Vol +15%\n• APP — RSI 63.9, +9.4% above 200 SMA, Vol +28%" },
  { role: "user" as const, text: "Backtest a momentum strategy on NVDA with 20-day lookback" },
  { role: "agent" as const, text: "Running backtest: NVDA 20-day momentum\nPeriod: 2024-01 to 2026-11 (34 months)\n\n📈 Results:\n• Annual Return: +32.4%\n• Sharpe Ratio: 1.95\n• Max Drawdown: -18.2%\n• Win Rate: 61.8% (142/230 trades)\n• Avg Hold: 3.2 days\n• Profit Factor: 2.14\n\nSignal: Currently LONG since Nov 12" },
];

type Tab = "agents" | "signals" | "backtest" | "chat";

export default function AITradingAgentPanel() {
  const [tab, setTab] = useState<Tab>("agents");
  const [chatInput, setChatInput] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState(0);

  const activeAgents = AGENTS.filter(a => a.status === "ACTIVE").length;
  const totalSignals = AGENTS.reduce((s, a) => s + a.signals, 0);
  const highConfSignals = SIGNALS.filter(s => s.confidence >= 80).length;

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">🤖</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>AI TRADING AGENTS</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>Vibe-Trading</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["agents", "signals", "backtest", "chat"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {[
          { label: "ACTIVE AGENTS", value: `${activeAgents}/${AGENTS.length}`, color: "#22c55e" },
          { label: "LIVE SIGNALS", value: totalSignals.toString(), color: "#38bdf8" },
          { label: "HIGH CONF", value: `${highConfSignals} (≥80%)`, color: "#fbbf24" },
          { label: "SYSTEM STATUS", value: "ONLINE", color: "#00e5a0" },
        ].map(s => (
          <div key={s.label} className="flex-1 p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="text-[8px] font-bold tracking-wider" style={{ color: "#64748b" }}>{s.label}</div>
            <div className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "agents" && (
          <div className="space-y-2">
            {AGENTS.map(a => (
              <div key={a.name} className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${a.status === "ACTIVE" ? "rgba(0,229,160,0.12)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{a.icon}</span>
                    <span className="font-bold" style={{ color: a.color }}>{a.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                      style={{ background: a.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: a.status === "ACTIVE" ? "#22c55e" : "#64748b" }}>
                      {a.status === "ACTIVE" ? "● " : "○ "}{a.status}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] mb-2" style={{ color: "#94a3b8" }}>{a.desc}</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>TASKS</div>
                    <div className="font-mono font-bold" style={{ color: "#e2e8f0" }}>{a.tasks.toLocaleString()}</div>
                  </div>
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>SIGNALS</div>
                    <div className="font-mono font-bold" style={{ color: a.signals > 0 ? "#fbbf24" : "#64748b" }}>{a.signals}</div>
                  </div>
                  <div className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="text-[8px]" style={{ color: "#64748b" }}>UPTIME</div>
                    <div className="font-mono font-bold" style={{ color: "#22c55e" }}>{a.uptime}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "signals" && (
          <div className="space-y-1.5">
            {SIGNALS.map((s, i) => (
              <div key={i} className="p-2.5 rounded" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.confidence >= 85 ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,0.05)"}` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ background: s.direction === "LONG" ? "rgba(34,197,94,0.15)" : s.direction === "SHORT" ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.15)",
                             color: s.direction === "LONG" ? "#22c55e" : s.direction === "SHORT" ? "#ef4444" : "#a855f7" }}>
                    {s.direction}
                  </span>
                  <span className="font-bold" style={{ color: "#00e5a0" }}>{s.ticker}</span>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.confidence}%`, background: s.confidence >= 85 ? "#22c55e" : s.confidence >= 70 ? "#fbbf24" : "#ef4444" }} />
                    </div>
                    <span className="font-mono text-[9px] font-bold" style={{ color: s.confidence >= 85 ? "#22c55e" : s.confidence >= 70 ? "#fbbf24" : "#ef4444" }}>{s.confidence}%</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "#64748b" }}>{s.time}</span>
                </div>
                <div className="text-[9px] mb-1.5" style={{ color: "#94a3b8" }}>{s.reasoning}</div>
                <div className="flex items-center gap-3 text-[9px]">
                  <span><span style={{ color: "#64748b" }}>Entry:</span> <span className="font-mono" style={{ color: "#e2e8f0" }}>${s.entry}</span></span>
                  <span><span style={{ color: "#64748b" }}>Target:</span> <span className="font-mono" style={{ color: "#22c55e" }}>${s.target}</span></span>
                  <span><span style={{ color: "#64748b" }}>Stop:</span> <span className="font-mono" style={{ color: "#ef4444" }}>${s.stop}</span></span>
                  <span className="font-mono" style={{ color: "#38bdf8" }}>R:R {((Math.abs(s.target - s.entry)) / (Math.abs(s.entry - s.stop))).toFixed(2)}</span>
                  <div className="flex-1" />
                  <span className="text-[8px]" style={{ color: "#64748b" }}>via {s.agent}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "backtest" && (
          <div className="space-y-3">
            <div className="flex gap-1 mb-1">
              {BACKTEST_STRATEGIES.map((s, i) => (
                <button key={i} onClick={() => setSelectedStrategy(i)}
                  className="px-2 py-1 rounded text-[9px] font-bold"
                  style={{ background: selectedStrategy === i ? "rgba(0,229,160,0.15)" : "rgba(255,255,255,0.03)", color: selectedStrategy === i ? "#00e5a0" : "#64748b" }}>
                  {s.name}
                </button>
              ))}
            </div>

            {(() => {
              const s = BACKTEST_STRATEGIES[selectedStrategy];
              return (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "ANN. RETURN", value: `+${s.annReturn}%`, color: "#22c55e" },
                      { label: "SHARPE", value: s.sharpe.toFixed(2), color: "#38bdf8" },
                      { label: "MAX DRAWDOWN", value: `${s.maxDD}%`, color: "#ef4444" },
                      { label: "WIN RATE", value: `${s.winRate}%`, color: "#fbbf24" },
                    ].map(m => (
                      <div key={m.label} className="p-2.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-[8px] font-bold" style={{ color: "#64748b" }}>{m.label}</div>
                        <div className="text-base font-bold font-mono mt-1" style={{ color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "TRADES", value: s.trades.toString() },
                      { label: "AVG HOLD", value: s.avgHold },
                      { label: "CALMAR", value: s.calmar.toFixed(2) },
                      { label: "SORTINO", value: s.sortino.toFixed(2) },
                    ].map(m => (
                      <div key={m.label} className="p-1.5 rounded text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="text-[8px]" style={{ color: "#64748b" }}>{m.label}</div>
                        <div className="font-mono font-bold text-[10px]" style={{ color: "#e2e8f0" }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>MONTHLY RETURNS (2026)</div>
                  <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-end gap-1" style={{ height: 80 }}>
                      {MONTHLY_RETURNS.map(m => (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="w-full flex justify-center" style={{ height: 60 }}>
                            <div className="flex flex-col-reverse w-3/4">
                              {m.ret >= 0 ? (
                                <div className="rounded-t" style={{ height: `${(m.ret / 7) * 100}%`, background: "#22c55e" }} />
                              ) : (
                                <div className="self-end rounded-b w-full" style={{ height: `${(Math.abs(m.ret) / 7) * 100}%`, background: "#ef4444" }} />
                              )}
                            </div>
                          </div>
                          <span className="text-[7px]" style={{ color: "#64748b" }}>{m.month}</span>
                          <span className="text-[7px] font-mono" style={{ color: m.ret >= 0 ? "#22c55e" : "#ef4444" }}>{m.ret > 0 ? "+" : ""}{m.ret}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>EQUITY CURVE</div>
                  <div className="p-3 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <svg viewBox="0 0 300 80" className="w-full" style={{ maxHeight: 80 }}>
                      <defs>
                        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#00e5a0" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[20, 40, 60].map(y => (
                        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.05)" />
                      ))}
                      <path d="M 0 65 L 30 58 L 60 52 L 90 48 L 110 55 L 130 42 L 160 35 L 190 30 L 210 38 L 230 25 L 260 18 L 290 12 L 300 10" fill="url(#eqGrad)" stroke="none" />
                      <path d="M 0 65 L 30 58 L 60 52 L 90 48 L 110 55 L 130 42 L 160 35 L 190 30 L 210 38 L 230 25 L 260 18 L 290 12 L 300 10" fill="none" stroke="#00e5a0" strokeWidth="1.5" />
                      <path d="M 0 70 L 30 68 L 60 65 L 90 60 L 110 62 L 130 58 L 160 55 L 190 52 L 210 54 L 230 50 L 260 48 L 290 45 L 300 44" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
                      <text x="295" y="8" fill="#00e5a0" fontSize="6" textAnchor="end">Strategy</text>
                      <text x="295" y="42" fill="#38bdf8" fontSize="6" textAnchor="end" opacity="0.5">SPX</text>
                    </svg>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {tab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-3 mb-3">
              {CHAT_HISTORY.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%] p-2.5 rounded-lg" style={{
                    background: msg.role === "user" ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${msg.role === "user" ? "rgba(0,229,160,0.2)" : "rgba(255,255,255,0.05)"}`,
                  }}>
                    <div className="text-[8px] font-bold mb-1" style={{ color: msg.role === "user" ? "#00e5a0" : "#38bdf8" }}>
                      {msg.role === "user" ? "YOU" : "🤖 NUR AI AGENT"}
                    </div>
                    <div className="text-[10px] whitespace-pre-line" style={{ color: "#e2e8f0" }}>{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask the AI agent... (e.g. 'find me undervalued tech stocks')"
                className="flex-1 px-3 py-2 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,229,160,0.2)", color: "#e2e8f0", outline: "none" }}
              />
              <button className="px-4 py-2 rounded text-[9px] font-bold"
                style={{ background: "rgba(0,229,160,0.2)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.3)" }}>
                SEND
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
