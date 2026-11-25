"use client";

import { useState, useRef, useEffect } from "react";
import DemoBadge from "@/components/ui/DemoBadge";
import { useIDEStore } from "@/stores/useIDEStore";
import { PANELS, GROUP_ORDER } from "@/panels/registry";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const WELCOME = `Welcome to NUR Finance AI Assistant. I can help you:

• Navigate the terminal — tell me what you're looking for
• Explain any panel or feature
• Suggest trading workflows and layouts
• Guide you through risk analysis tools
• Set up multi-monitor configurations

Type a question or command to get started.`;

const RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["risk", "danger", "threat"],
    response: "Our RISK section includes Financial Risk, Cyber Risk, Nuclear Risk, Military Risk, Galactic Risk (NASA asteroid tracking), and Political Risk panels. Navigate to the RISK group in the sidebar to access these. For a quick overview, try the Risk Dashboard panel.",
  },
  {
    keywords: ["globe", "earth", "map", "geopolitics"],
    response: "The NUR Earth 3D Globe shows real-time financial intelligence data overlaid on a 3D globe. You can detach it as a floating window using the ⧉ DETACH button in the title bar, resize it, or pop it out to a second monitor using DUAL-SCREEN in the floating window controls.",
  },
  {
    keywords: ["monitor", "screen", "multi", "dual", "layout"],
    response: "For multi-monitor setups: 1) Open any panel, 2) Click ⧉ DETACH to make it a floating window, 3) Click ↗ DUAL-SCREEN to pop it to a separate browser window you can drag to your second monitor. You can have unlimited windows open simultaneously.",
  },
  {
    keywords: ["trade", "trading", "buy", "sell", "order"],
    response: "Trading tools: OMS/EMS for order management, Options Panel for derivatives, Digital Wallet Gateway for crypto, and the WISH Framework for strategy execution. Access them from the TRADING group in the sidebar.",
  },
  {
    keywords: ["chart", "graph", "technical", "analysis"],
    response: "Charts & Analysis: Use the High-Resolution Charts panel for technical analysis, the Screener for filtering stocks, and Fundamentals for company financials. The AI Quant Copilot can help build quantitative strategies.",
  },
  {
    keywords: ["news", "media", "broadcast", "tv"],
    response: "Media tools: NUR TV for live financial broadcasts, News Feed for real-time market news, Market Briefs for executive summaries, and the Broadcast Studio for content creation. Find them in the MEDIA group.",
  },
  {
    keywords: ["portfolio", "position", "pnl", "profit"],
    response: "Portfolio management: The Portfolio Manager shows your holdings, P&L, and allocation. The Dashboard gives a market overview. For institutional-grade analytics, check the Institutional Suite panel.",
  },
  {
    keywords: ["help", "how", "what", "guide", "tutorial"],
    response: "Quick start guide:\n1. Use the sidebar (left) to browse all 190+ panels organized by category\n2. Click any panel to open it in the main area\n3. Use ⧉ DETACH to make panels floating windows\n4. Use ↗ DUAL-SCREEN for multi-monitor\n5. The command palette (Ctrl+K) lets you search all panels\n6. Right-click panels for context menu options",
  },
  {
    keywords: ["price", "plan", "subscription", "cost", "pricing"],
    response: "NUR Finance offers tiered access:\n• Free: Core market data and basic tools\n• Pro: Advanced analytics and screeners\n• Quant: Algorithmic trading tools and AI copilot\n• Team: Collaborative features\n• NUR Finance R: Reuters-tier terminal (~€100K/yr, requires 1yr Reuters history)\n• NUR Finance B: Bloomberg-tier terminal (~€100K/yr, requires 1yr Bloomberg history + invitation)",
  },
  {
    keywords: ["crypto", "bitcoin", "coin", "wallet"],
    response: "Crypto tools: NUR Coin Ecosystem for our native token, Digital Wallet Gateway for multi-chain transactions, and the Fleet Miner for browser-based mining. Access crypto analytics across the TRADING group.",
  },
  {
    keywords: ["ai", "copilot", "quant", "algorithm"],
    response: "AI & Quant tools: The AI Quant Copilot builds and backtests strategies using factor models. The AI Tools panel offers NLP-powered market analysis. Professional AI Hub covers DePIN and advanced ML models. All available in the ANALYSIS group.",
  },
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => lower.includes(k))) return r.response;
  }
  const count = Object.keys(PANELS).length;
  const groups = GROUP_ORDER.join(", ");
  return `I can help with any of our ${count} terminal modules across ${GROUP_ORDER.length} categories: ${groups}. Try asking about trading, risk analysis, charts, news, portfolio management, or multi-monitor setup.`;
}

export default function NurAIAssistant() {
  const { setActiveView } = useIDEStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: WELCOME, timestamp: new Date().toLocaleTimeString() },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply = getResponse(text);
      const aiMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: reply, timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, aiMsg]);
    }, 400 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0e17" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.06]" style={{ background: "rgba(0,0,0,0.3)" }}>
        <span className="text-sm">🤖</span>
        <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "#00d4aa" }}>NUR AI ASSISTANT</span>
        <DemoBadge />
        <div className="flex-1" />
        <span className="text-[9px] font-mono" style={{ color: "#64748b" }}>CORE · AI GUIDE</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-lg px-3 py-2 text-xs font-mono leading-relaxed"
              style={{
                background: msg.role === "user" ? "rgba(0,212,170,0.12)" : "rgba(255,255,255,0.04)",
                border: msg.role === "user" ? "1px solid rgba(0,212,170,0.2)" : "1px solid rgba(255,255,255,0.06)",
                color: "#e2e8f0",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.role === "assistant" && (
                <div className="text-[9px] font-bold mb-1" style={{ color: "#00d4aa" }}>NUR AI</div>
              )}
              {msg.text}
              <div className="text-[8px] mt-1" style={{ color: "#475569" }}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") send(); }}
            placeholder="Ask anything about the terminal..."
            className="flex-1 px-3 py-2 rounded text-xs font-mono outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0" }}
          />
          <button
            onClick={send}
            className="px-4 py-2 rounded text-xs font-mono font-bold transition-all"
            style={{ background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.3)", color: "#00d4aa" }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
