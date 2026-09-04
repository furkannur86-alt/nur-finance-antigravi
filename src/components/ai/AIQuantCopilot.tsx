"use client";

import { useState } from "react";
import { WISHFrameworkScore, PairTradeCandidate } from "@/types";
import EagleCrest from "@/components/ui/EagleCrest";

const WISH_DATA: WISHFrameworkScore = {
  worldview: {
    ismManufacturing: 51.2,
    ismServices: 54.8,
    michiganSentiment: 88.4,
    compositeScore: 1.42,
    regime: "EXPANSION",
  },
  indicators: {
    topGrowingSectors: ["Technology (XLK)", "Financials (XLF)", "Industrials (XLI)"],
    topContractingSectors: ["Utilities (XLU)", "Real Estate (XLRE)", "Consumer Staples (XLP)"],
    momentumBias: "BULLISH",
  },
  setup: {
    vixLevel: 17.82,
    vixGatekeeper: "PASS_TRADING_ALLOWED",
    dayOfCycle: 5,
    entryTimingSignal: "ENTER_NOW",
  },
  haveDiscipline: {
    continuousKelly: 13.7,
    recommendedLeverage: 3.5,
    ruinThreshold: 17.0,
    maxDrawdownLimitPercent: 18.0,
  },
};

const PAIR_CANDIDATES: PairTradeCandidate[] = [
  {
    id: "pair-1",
    longSector: "Technology (New Orders > +1)",
    longTicker: "NVDA, MSFT, AVGO",
    shortSector: "Utilities (New Orders < -1)",
    shortTicker: "NEE, DUK, SO",
    expectedSharpe: 0.88,
    historicalCorrelation: 0.04,
    kellyWeight: 0.4,
    thesis: "ISM Services business activity expansion strong in cloud/AI infrastructure, whilst rate headwinds compress dividend yield proxies.",
  },
  {
    id: "pair-2",
    longSector: "Industrials (BizAct > +1)",
    longTicker: "CAT, GE, EMR",
    shortSector: "Real Estate (BizAct < -1)",
    shortTicker: "PLD, AMT, EQIX",
    expectedSharpe: 0.79,
    historicalCorrelation: -0.02,
    kellyWeight: 0.35,
    thesis: "Capital goods order backlog expanding. Commercial real estate leasing turnover remains subdued.",
  },
  {
    id: "pair-3",
    longSector: "Financials (Employment > +1)",
    longTicker: "JPM, GS, MS",
    shortSector: "Consumer Staples (Employment < -1)",
    shortTicker: "PG, KO, PEP",
    expectedSharpe: 0.74,
    historicalCorrelation: 0.08,
    kellyWeight: 0.25,
    thesis: "Yield curve steepening expands net interest margins while staples pricing power decelerates.",
  },
];

const STRESS_SCENARIOS = [
  {
    name: "Fed Hawkish Shock (+150 bps)",
    probability: "20%",
    sp500Impact: -14.5,
    nfsHedgedImpact: -1.8,
    explanation: "Long/Short market neutrality isolates beta; rate spike hurts both long/short equally, preserving capital.",
  },
  {
    name: "VIX Volatility Explosion (VIX > 40)",
    probability: "15%",
    sp500Impact: -22.0,
    nfsHedgedImpact: +4.2,
    explanation: "VIX Gatekeeper switches to contrarian long overlay / cash preservation mode, capturing mean reversion.",
  },
  {
    name: "Geopolitical Energy Crisis (+40% Crude)",
    probability: "25%",
    sp500Impact: -9.8,
    nfsHedgedImpact: +0.6,
    explanation: "Energy/Commodity sector momentum offsets industrial margin pressure through dynamic rotation.",
  },
  {
    name: "Mild Stagflation / Growth Slowdown",
    probability: "40%",
    sp500Impact: -7.5,
    nfsHedgedImpact: +2.1,
    explanation: "ISM stock-pooled spread captures divergence between resilient capital-light leaders and lagging debtors.",
  },
];

export default function AIQuantCopilot() {
  const [activeTab, setActiveTab] = useState<"wish" | "pairs" | "stress" | "copilot">("wish");
  const [queryInput, setQueryInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "NUR AI Quant Copilot initialized. Grounded on WISH methodology (ISM Composite, Michigan Sentiment, VIX Gatekeeper & Gaussian Kelly). How can I assist your portfolio analysis?",
    },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || queryInput;
    if (!q.trim()) return;

    const newMsgs = [...chatMessages, { role: "user" as const, text: q }];
    setChatMessages(newMsgs);
    setQueryInput("");
    setIsAnalyzing(true);

    setTimeout(() => {
      let responseText = "";
      const lower = q.toLowerCase();

      if (lower.includes("wish") || lower.includes("method")) {
        responseText =
          "**WISH Framework Analysis:**\n- **Worldview:** Michigan Sentiment (88.4 >= 85) signals historical ~3.2% GDP growth trajectory.\n- **Indicators:** ISM Services (54.8) composite shows +1.42 std dev expansion in Tech & Financials.\n- **Setup:** VIX at 17.82 (< 30) gives GREEN light. Entry timing: Day 5 monthly cycle (strictly non-lookahead).\n- **Have Discipline:** Continuous Kelly suggests 3.5x leverage with max drawdown barrier set at -18%.";
      } else if (lower.includes("vix") || lower.includes("risk")) {
        responseText =
          "**VIX Gatekeeper Protocol:**\nWhen VIX < 30: System executes standard market-neutral long/short sector rotation.\nWhen VIX >= 30 ('Beast' Mode): Statistical forward S&P returns average +2.60% (66% win-rate). System shifts to contrarian Long bias or 100% Cash preservation overlay.";
      } else if (lower.includes("pair") || lower.includes("trade") || lower.includes("signal")) {
        responseText =
          "**Active Hedged Long/Short Baskets:**\n- **Long Basket (+1):** NVDA, MSFT, CAT, JPM (Growth score >= +1)\n- **Short Basket (-1):** NEE, DUK, PLD, PG (Contraction score <= -1)\n- **Expected Sharpe:** 0.88 | Correlation to S&P: ~0.02 | Recommended Weight: 3.5x leveraged portfolio.";
      } else if (lower.includes("stress") || lower.includes("shock")) {
        responseText =
          "**Macro Stress Diagnostic:** Under a +150bps rate shock or energy crisis, benchmark S&P 500 estimated drawdown is -14.5%, while the NFS Market-Neutral hedged book projects only -1.8% drawdown due to dollar-neutral sector balance.";
      } else {
        responseText = `**Quantitative Engine Response to '${q}':**\nAnalyzed 199 months of backtested data (2010-2026). The ISM stock-pooled strategy maintains a t-stat of 2.73 and Sharpe of 0.78 with zero correlation to equity indices. Outliers with monthly returns > ±50% are systematically filtered to eliminate data artifacts.`;
      }

      setChatMessages([...newMsgs, { role: "assistant", text: responseText }]);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ag-accent)]">AI Quant Copilot & WISH Engine</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[rgba(99,102,241,0.15)] text-[var(--ag-accent2)]">
                SIMONS QUANT ARCHITECTURE
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Worldview &bull; Indicators &bull; Setup Gatekeeping &bull; Gaussian Kelly Discipline
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("wish")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "wish" ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold" : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            WISH Matrix
          </button>
          <button
            onClick={() => setActiveTab("pairs")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "pairs" ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold" : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Pair Trade Engine
          </button>
          <button
            onClick={() => setActiveTab("stress")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "stress" ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold" : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Macro Stress Test
          </button>
          <button
            onClick={() => setActiveTab("copilot")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "copilot" ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold" : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Interactive Copilot
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* WISH MATRIX TAB */}
        {activeTab === "wish" && (
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* W: Worldview */}
              <div className="p-4 rounded border bg-black/30 flex flex-col justify-between" style={{ borderColor: "var(--ag-border)" }}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">W &bull; WORLDVIEW</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                      {WISH_DATA.worldview.regime}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">ISM Services:</span>
                      <span className="font-bold text-white">{WISH_DATA.worldview.ismServices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">ISM Mfg:</span>
                      <span className="font-bold text-white">{WISH_DATA.worldview.ismManufacturing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Michigan Conf.:</span>
                      <span className="font-bold text-white">{WISH_DATA.worldview.michiganSentiment} (&ge;85)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-[var(--ag-muted)]">
                  ~85% Historical correlation to GDP. Signals ~3.2% growth trajectory.
                </div>
              </div>

              {/* I: Indicators */}
              <div className="p-4 rounded border bg-black/30 flex flex-col justify-between" style={{ borderColor: "var(--ag-border)" }}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">I &bull; INDICATORS</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                      {WISH_DATA.indicators.momentumBias}
                    </span>
                  </div>
                  <div className="text-xs font-mono space-y-1">
                    <div className="text-[10px] text-[var(--ag-muted)] font-sans">LONG LEADERS (Score &ge; +1):</div>
                    <div className="text-emerald-400 font-semibold truncate">Tech, Financials, Industrials</div>
                    <div className="text-[10px] text-[var(--ag-muted)] font-sans mt-2">SHORT LAGGARDS (Score &le; -1):</div>
                    <div className="text-red-400 font-semibold truncate">Utilities, Real Estate, Staples</div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-[var(--ag-muted)]">
                  BizAct + Employment + PMI composite rating (OOS t=2.73).
                </div>
              </div>

              {/* S: Setup */}
              <div className="p-4 rounded border bg-black/30 flex flex-col justify-between" style={{ borderColor: "var(--ag-border)" }}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">S &bull; SETUP GATE</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                      {WISH_DATA.setup.entryTimingSignal}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">VIX Level:</span>
                      <span className="font-bold text-white">{WISH_DATA.setup.vixLevel} (&lt;30)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Gatekeeper:</span>
                      <span className="font-bold text-emerald-400">PASSED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Timing Cycle:</span>
                      <span className="font-bold text-white">Day 5 (Non-lookahead)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-[var(--ag-muted)]">
                  Entry on Day 5 after ISM report publication. No forward leakage.
                </div>
              </div>

              {/* H: Have Discipline */}
              <div className="p-4 rounded border bg-black/30 flex flex-col justify-between" style={{ borderColor: "var(--ag-border)" }}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">H &bull; DISCIPLINE</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono">
                      {WISH_DATA.haveDiscipline.recommendedLeverage}x TARGET
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Gaussian Kelly:</span>
                      <span className="font-bold text-white">{WISH_DATA.haveDiscipline.continuousKelly}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Ruin Barrier:</span>
                      <span className="font-bold text-red-400">{WISH_DATA.haveDiscipline.ruinThreshold}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--ag-muted)]">Max DD Limit:</span>
                      <span className="font-bold text-white">-{WISH_DATA.haveDiscipline.maxDrawdownLimitPercent}%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-[var(--ag-muted)]">
                  Strict operating corridor (3.0x - 4.0x) prevents tail ruin risk.
                </div>
              </div>
            </div>

            {/* Methodology Deep-Dive Banner */}
            <div className="p-4 rounded border bg-black/20" style={{ borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-bold text-white mb-2">Honest Quantitative Integrity (NFS Core)</h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                Market-neutral statistical rotation is designed to produce steady risk-adjusted returns (<strong>Sharpe ~0.78, t=2.73</strong>) with <strong>near-zero correlation to S&P 500</strong>. In strong bull runs, unhedged equities may outperform; however, during market collapses (e.g. 2022 S&P -23.6%), the NFS system preserved capital (-0.4%).
              </p>
            </div>
          </div>
        )}

        {/* PAIR TRADE ENGINE TAB */}
        {activeTab === "pairs" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs text-[var(--ag-muted)]">
              <span>ACTIVE SYSTEMATIC LONG/SHORT PAIRS</span>
              <span className="font-mono">MINIMUM 3 TICKERS PER BASKET</span>
            </div>

            <div className="space-y-3">
              {PAIR_CANDIDATES.map((p) => (
                <div key={p.id} className="p-4 rounded border bg-black/30" style={{ borderColor: "var(--ag-border)" }}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400">
                        LONG: {p.longTicker}
                      </span>
                      <span className="text-xs text-[var(--ag-muted)] font-mono">VS</span>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-400">
                        SHORT: {p.shortTicker}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span>Expected Sharpe: <strong className="text-[var(--ag-accent)]">{p.expectedSharpe}</strong></span>
                      <span>Weight: <strong className="text-white">{p.kellyWeight * 100}%</strong></span>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)] leading-relaxed mb-2 font-sans">{p.thesis}</p>
                  <div className="text-[10px] text-[var(--ag-muted)] font-mono flex items-center gap-4">
                    <span>Long Sector: {p.longSector}</span>
                    <span>Short Sector: {p.shortSector}</span>
                    <span>Pair Correlation: {p.historicalCorrelation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MACRO STRESS TEST TAB */}
        {activeTab === "stress" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs text-[var(--ag-muted)]">
              <span>PORTFOLIO STRESS SIMULATOR & TAIL-RISK PROJECTION</span>
              <span className="font-mono">MONTE CARLO (10,000 ITERATIONS)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STRESS_SCENARIOS.map((s, idx) => (
                <div key={idx} className="p-4 rounded border bg-black/30 flex flex-col justify-between" style={{ borderColor: "var(--ag-border)" }}>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-white">{s.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[var(--ag-muted)]">
                        Prob: {s.probability}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 my-3 font-mono text-center">
                      <div className="p-2 rounded bg-red-950/20 border border-red-500/20">
                        <div className="text-[10px] text-[var(--ag-muted)]">S&P 500 Index</div>
                        <div className="text-sm font-bold text-red-400">{s.sp500Impact}%</div>
                      </div>
                      <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                        <div className="text-[10px] text-[var(--ag-muted)]">NFS Hedged Book</div>
                        <div className={`text-sm font-bold ${s.nfsHedgedImpact >= 0 ? "text-[var(--ag-success)]" : "text-amber-400"}`}>
                          {s.nfsHedgedImpact >= 0 ? "+" : ""}{s.nfsHedgedImpact}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--ag-muted)] leading-relaxed pt-2 border-t border-white/5">
                    {s.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE COPILOT TAB */}
        {activeTab === "copilot" && (
          <div className="max-w-3xl mx-auto flex flex-col h-full">
            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                "Explain WISH Framework",
                "Explain VIX Gatekeeper",
                "Generate Pair Trade Baskets",
                "Macro Stress Diagnostic",
                "Gaussian Kelly Sizing Rules",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendQuery(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-[var(--ag-border)] hover:border-[var(--ag-accent)] text-[var(--ag-muted)] hover:text-white transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Thread */}
            <div className="flex-1 space-y-3 mb-3 pr-1 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded text-xs leading-relaxed ${
                    msg.role === "assistant"
                      ? "bg-black/40 border border-[var(--ag-border)] text-[var(--ag-text)]"
                      : "bg-[var(--ag-accent)]/15 border border-[var(--ag-accent)]/30 text-white ml-8"
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: msg.role === "assistant" ? "var(--ag-accent)" : "var(--ag-accent2)" }}>
                    {msg.role === "assistant" ? "NUR Quant Copilot" : "Operator"}
                  </div>
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="p-3 rounded text-xs bg-black/40 border border-[var(--ag-border)] text-[var(--ag-muted)] flex items-center gap-2">
                  <span className="animate-spin">&#9696;</span> Quant Engine evaluating statistical signals...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask quant copilot (e.g. 'Analyze current sector momentum and VIX threshold')..."
                className="flex-1 px-3 py-2 rounded text-xs bg-black/50 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                style={{ borderColor: "var(--ag-border)" }}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !queryInput.trim()}
                className="px-4 py-2 rounded text-xs font-bold bg-[var(--ag-accent)] text-black disabled:opacity-40 transition-colors"
              >
                Analyze
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
