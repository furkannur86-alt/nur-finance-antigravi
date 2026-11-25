"use client";

import { useState } from "react";
import DemoBadge from "@/components/ui/DemoBadge";

type Tab = "leaderboard" | "accuracy" | "following" | "calls";

export default function InfluencerTrackerPanel() {
  const [tab, setTab] = useState<Tab>("leaderboard");

  return (
    <div className="h-full flex flex-col text-[11px]" style={{ background: "#0a0e17", color: "#e2e8f0" }}>
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "rgba(0,229,160,0.15)" }}>
        <div className="flex items-center gap-2">
          <span className="text-sm">👤</span>
          <span className="font-bold text-xs" style={{ color: "#00e5a0" }}>INFLUENCER TRACKER</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(236,72,153,0.15)", color: "#ec4899" }}>Reuters Social</span>
          <DemoBadge />
        </div>
        <div className="flex gap-1">
          {(["leaderboard", "accuracy", "following", "calls"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-2 py-1 rounded text-[9px] font-bold uppercase"
              style={{ background: tab === t ? "rgba(0,229,160,0.2)" : "transparent", color: tab === t ? "#00e5a0" : "#64748b" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 py-2">
        {tab === "leaderboard" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>TOP FINTWIT — INFLUENCE SCORE</div>
            {[
              { rank: 1, handle: "@unusual_whales", followers: "1.2M", score: 92, sector: "Options", platform: "X" },
              { rank: 2, handle: "@jimcramer", followers: "2.1M", score: 45, sector: "Broad Market", platform: "X" },
              { rank: 3, handle: "@DeepF*Value", followers: "850K", score: 78, sector: "Value/Memes", platform: "Reddit" },
              { rank: 4, handle: "@GoldTelegraph", followers: "620K", score: 71, sector: "Commodities", platform: "X" },
              { rank: 5, handle: "@WallStJesus", followers: "480K", score: 68, sector: "Tech", platform: "X" },
              { rank: 6, handle: "@StockMKTNewz", followers: "1.5M", score: 82, sector: "News/Flow", platform: "X" },
              { rank: 7, handle: "@PeterSchiff", followers: "950K", score: 38, sector: "Macro/Gold", platform: "X" },
            ].map(i => (
              <div key={i.handle} className="flex items-center gap-2 p-1.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="font-mono w-6 text-right font-bold" style={{ color: i.rank <= 3 ? "#fbbf24" : "#64748b" }}>#{i.rank}</span>
                <span className="font-bold w-28" style={{ color: "#ec4899" }}>{i.handle}</span>
                <span className="font-mono w-12 text-right" style={{ color: "#64748b" }}>{i.followers}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${i.score}%`,
                    background: i.score > 70 ? "rgba(34,197,94,0.5)" : i.score > 50 ? "rgba(251,191,36,0.5)" : "rgba(239,68,68,0.5)",
                  }} />
                </div>
                <span className="font-mono w-8 text-right" style={{ color: i.score > 70 ? "#22c55e" : i.score > 50 ? "#fbbf24" : "#ef4444" }}>{i.score}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "accuracy" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>PREDICTION ACCURACY — 90 DAY</div>
            {[
              { handle: "@unusual_whales", total: 285, correct: 198, accuracy: 69.5, avgReturn: "+8.2%", bestCall: "NVDA calls +340%" },
              { handle: "@StockMKTNewz", total: 180, correct: 118, accuracy: 65.6, avgReturn: "+5.1%", bestCall: "CRM earnings +12%" },
              { handle: "@DeepF*Value", total: 42, correct: 28, accuracy: 66.7, avgReturn: "+15.5%", bestCall: "GME squeeze +85%" },
              { handle: "@GoldTelegraph", total: 95, correct: 62, accuracy: 65.3, avgReturn: "+4.8%", bestCall: "Gold $2,100 call" },
              { handle: "@jimcramer", total: 320, correct: 142, accuracy: 44.4, avgReturn: "-2.1%", bestCall: "AAPL buy +8%" },
            ].map(a => (
              <div key={a.handle} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#ec4899" }}>{a.handle}</span>
                  <span className="font-mono font-bold" style={{ color: a.accuracy > 60 ? "#22c55e" : a.accuracy > 50 ? "#fbbf24" : "#ef4444" }}>{a.accuracy}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[9px]">
                  <div><span style={{ color: "#64748b" }}>Calls:</span> <span className="font-mono">{a.total}</span></div>
                  <div><span style={{ color: "#64748b" }}>Correct:</span> <span className="font-mono" style={{ color: "#22c55e" }}>{a.correct}</span></div>
                  <div><span style={{ color: "#64748b" }}>Avg:</span> <span className="font-mono" style={{ color: a.avgReturn.startsWith("+") ? "#22c55e" : "#ef4444" }}>{a.avgReturn}</span></div>
                  <div><span style={{ color: "#fbbf24" }}>{a.bestCall}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "following" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>FOLLOWER CHANGES — 7 DAY</div>
            {[
              { handle: "@unusual_whales", prev: "1.15M", current: "1.20M", change: "+4.3%", reason: "NVDA options call viral" },
              { handle: "@jimcramer", prev: "2.12M", current: "2.10M", change: "-0.9%", reason: "Bad INTC call" },
              { handle: "@DeepF*Value", prev: "820K", current: "850K", change: "+3.7%", reason: "GME DD post" },
              { handle: "@StockMKTNewz", prev: "1.48M", current: "1.50M", change: "+1.4%", reason: "Breaking news coverage" },
              { handle: "@PeterSchiff", prev: "960K", current: "950K", change: "-1.1%", reason: "Gold underperformance" },
            ].map(f => (
              <div key={f.handle} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold" style={{ color: "#ec4899" }}>{f.handle}</span>
                  <span className="font-mono" style={{ color: f.change.startsWith("+") ? "#22c55e" : "#ef4444" }}>{f.change}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span style={{ color: "#64748b" }}>{f.prev} → {f.current}</span>
                  <span style={{ color: "#64748b" }}>{f.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "calls" && (
          <div className="space-y-3">
            <div className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>LATEST CALLS — TRACKED INFLUENCERS</div>
            {[
              { time: "2h ago", handle: "@unusual_whales", call: "Large NVDA Dec $160C sweep", ticker: "NVDA", direction: "Bullish", result: "Pending" },
              { time: "4h ago", handle: "@StockMKTNewz", call: "CRM earnings preview — expects beat", ticker: "CRM", direction: "Bullish", result: "Pending" },
              { time: "6h ago", handle: "@GoldTelegraph", call: "Gold breakout above $2,050 imminent", ticker: "GLD", direction: "Bullish", result: "Pending" },
              { time: "1d ago", handle: "@DeepF*Value", call: "GME short interest rising, squeeze setup", ticker: "GME", direction: "Bullish", result: "+5.2%" },
              { time: "2d ago", handle: "@jimcramer", call: "Buy INTC for the AI comeback", ticker: "INTC", direction: "Bullish", result: "-3.8%" },
            ].map((c, i) => (
              <div key={i} className="p-2 rounded" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px]" style={{ color: "#64748b" }}>{c.time}</span>
                    <span className="font-bold" style={{ color: "#ec4899" }}>{c.handle}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold" style={{ color: "#00e5a0" }}>{c.ticker}</span>
                    <span className="text-[8px] px-1 py-0.5 rounded" style={{
                      background: c.direction === "Bullish" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: c.direction === "Bullish" ? "#22c55e" : "#ef4444",
                    }}>{c.direction}</span>
                  </div>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span>{c.call}</span>
                  <span className="font-mono" style={{
                    color: c.result === "Pending" ? "#64748b" : c.result.startsWith("+") ? "#22c55e" : "#ef4444",
                  }}>{c.result}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
