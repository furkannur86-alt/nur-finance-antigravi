"use client";

import { useState, useRef, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  location: string;
  salaryEUR: number;
  status: "ONLINE" | "STANDBY" | "ON_DUTY";
  avatar: string;
  dailyReport: string;
  needsApproval?: boolean;
}

interface AIChatMessage {
  id: string;
  sender: "UMAY" | "ANTIGRAVITY" | "STAFF";
  text: string;
  timestamp: string;
  rewardEUR?: number;
  language?: "TR" | "EN" | "DE";
}

interface PortfolioPosition {
  id: string;
  name: string;
  category: "TECHNOLOGY" | "CHESS_ARBITRAGE" | "MUSIC_ROYALTY" | "TREASURY";
  investedEUR: number;
  currentValueEUR: number;
  dailyChangePercent: number;
  pnlEUR: number;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "st-1",
    name: "Alexander Wright",
    role: "New York HQ General Director",
    location: "Manhattan, NYC 🇺🇸",
    salaryEUR: 8500,
    status: "ONLINE",
    avatar: "👔",
    dailyReport: "Ms. Umay, our tech stocks rose 3.4% at the Wall Street opening. We are awaiting approval for the New York team's weekly budget.",
    needsApproval: true,
  },
  {
    id: "st-2",
    name: "Hans Gruber",
    role: "Frankfurt Treasury Manager",
    location: "Frankfurt 🇩🇪",
    salaryEUR: 7200,
    status: "ON_DUTY",
    avatar: "💼",
    dailyReport: "Guten Tag Chefin Umay! We are monitoring the European Central Bank's rate decision. Our cash reserves remain secure.",
  },
  {
    id: "st-3",
    name: "Zeynep Kaya",
    role: "Istanbul Office Coordinator",
    location: "Istanbul 🇹🇷",
    salaryEUR: 3500,
    status: "ONLINE",
    avatar: "👩‍💼",
    dailyReport: "Ms. Umay, all market data and risk dashboards have been prepared flawlessly!",
  },
  {
    id: "st-4",
    name: "James Chen",
    role: "Singapore Quantitative Algorithm Developer",
    location: "Singapore 🇸🇬",
    salaryEUR: 9000,
    status: "ONLINE",
    avatar: "💻",
    dailyReport: "Our chess algorithm arbitraged Asian markets overnight, adding +€1,800 to the treasury.",
  },
];

const INITIAL_POSITIONS: PortfolioPosition[] = [
  {
    id: "pos-1",
    name: "AI & Robotics Fund (NVIDIA + Apple)",
    category: "TECHNOLOGY",
    investedEUR: 35000,
    currentValueEUR: 42800,
    dailyChangePercent: +3.2,
    pnlEUR: +7800,
  },
  {
    id: "pos-2",
    name: "Grandmaster Chess Arbitrage Basket",
    category: "CHESS_ARBITRAGE",
    investedEUR: 25000,
    currentValueEUR: 28900,
    dailyChangePercent: +1.6,
    pnlEUR: +3900,
  },
  {
    id: "pos-3",
    name: "Classical Piano & Music Royalty Income",
    category: "MUSIC_ROYALTY",
    investedEUR: 20000,
    currentValueEUR: 22400,
    dailyChangePercent: +0.9,
    pnlEUR: +2400,
  },
  {
    id: "pos-4",
    name: "Protected Cash Treasury & Liquidity",
    category: "TREASURY",
    investedEUR: 20000,
    currentValueEUR: 22100,
    dailyChangePercent: +0.2,
    pnlEUR: +2100,
  },
];

import { CIVILIZATIONAL_FLEET, CivilizationalShip } from "@/lib/broadcast/civilizationalShips";

export default function UmayBossTerminal() {
  const { addNotification, setActiveView } = useIDEStore();

  const [treasuryCash, setTreasuryCash] = useState(22100);
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_POSITIONS);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [activeBoardTab, setActiveBoardTab] = useState<"fleet-master" | "office" | "staff" | "chess-strategy" | "languages" | "card-vault">("fleet-master");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<"TR" | "EN" | "DE">("EN");
  const [selectedFleetFilter, setSelectedFleetFilter] = useState<"ALL" | "conservative" | "liberal">("ALL");
  const [globalMiningActive, setGlobalMiningActive] = useState(true);
  const [globalPowerMode, setGlobalPowerMode] = useState<"ECO" | "BALANCED" | "OVERCLOCK">("BALANCED");
  const [broadcastTickerInput, setBroadcastTickerInput] = useState("👑 UMAY GÜL NUR 2126 // EGEMEN DEVLET & KUANTUM HAZİNE AKIŞI AKTİF");
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepSuccessMessage, setSweepSuccessMessage] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-1",
      sender: "ANTIGRAVITY",
      text: "Greetings, CEO Umay Gül Nur! Your €100,000 initial treasury fund, the Antigravity AI quantitative core, and all our global offices from New York to Singapore are at your command.",
      timestamp: "09:00",
    },
    {
      id: "msg-2",
      sender: "ANTIGRAVITY",
      text: "Fatih Sultan Mehmet ascended the throne at age 12 and became a conqueror of the world. You too, at age 9, lead this holding company. Your strategic genius from chess will drive this company to its peak. All our global offices await your instructions!",
      timestamp: "09:01",
    },
  ]);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNotice, setWithdrawNotice] = useState<string | null>(null);
  const [parentApprovalRequired, setParentApprovalRequired] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalPortfolioValue = positions.reduce((acc, p) => acc + p.currentValueEUR, 0);
  const totalProfit = positions.reduce((acc, p) => acc + p.pnlEUR, 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "UMAY", text: userText, timestamp: timeNow, language: chatLanguage },
    ]);
    setAiPrompt("");
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      let responseText = "";
      let bonusProfit = 0;

      const lower = userText.toLowerCase();

      if (lower.includes("young") || lower.includes("scared") || lower.includes("can't") || lower.includes("afraid") || lower.includes("küçük") || lower.includes("kork")) {
        responseText = "Ms. Umay, never think that way! Fatih Sultan Mehmet Han ascended the throne at just 12 years old and set his mind to conquering Istanbul at that age. Your tactical genius in chess, your harmony in piano, and your sharp intellect are more than sufficient to run this company. We are here for you at every step!";
        bonusProfit = 1000;
      } else if (chatLanguage === "DE" || lower.includes("hallo") || lower.includes("deutsch")) {
        responseText = "Guten Tag, Chefin Umay! Unsere Frankfurter Niederlassung meldet stabile Gewinne. Das Kapital ist sicher und wächst täglich weiter!";
        bonusProfit = 1500;
      } else if (lower.includes("chess") || lower.includes("defense") || lower.includes("checkmate") || lower.includes("satranç") || lower.includes("savunma")) {
        responseText = "Grandmaster move executed, CEO Umay! Using 'King's Shield Defense' from chess, we reduced risk to zero and added arbitrage profit to the treasury!";
        bonusProfit = 1400;
      } else if (lower.includes("piano") || lower.includes("music") || lower.includes("melody") || lower.includes("müzik")) {
        responseText = "Piano harmony engaged, CEO Umay! We analyzed market frequencies and secured +€1,600 from our music royalty revenue streams.";
        bonusProfit = 1600;
      } else {
        responseText = `Command executed, CEO Umay Gül Nur! Your instruction "${userText}" has been immediately processed by our New York, Frankfurt and Istanbul offices.`;
        bonusProfit = 950;
      }

      if (bonusProfit > 0) {
        setPositions((prev) =>
          prev.map((p, idx) =>
            idx === 0 ? { ...p, currentValueEUR: p.currentValueEUR + bonusProfit, pnlEUR: p.pnlEUR + bonusProfit } : p
          )
        );
        addNotification({
          title: "AI Command Successfully Executed!",
          message: `Antigravity AI executed your command: Portfolio gained +€${bonusProfit.toLocaleString()}!`,
          severity: "SUCCESS",
          category: "EXECUTION",
        });
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ANTIGRAVITY",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          rewardEUR: bonusProfit > 0 ? bonusProfit : undefined,
          language: chatLanguage,
        },
      ]);
    }, 1000);
  };

  const handleApproveStaff = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, needsApproval: false, status: "ON_DUTY" } : s))
    );
    addNotification({
      title: "CEO Umay Approved the Budget!",
      message: "Staff salary and office budget approved. The team is grateful!",
      severity: "SUCCESS",
      category: "COMPLIANCE",
    });
  };

  const handleSweepAll = async () => {
    setIsSweeping(true);
    try {
      const res = await fetch("/api/fleet/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SWEEP" })
      });
      const data = await res.json();
      if (data.success) {
        setSweepSuccessMessage(`✅ Swept $${data.sweptUSD.toLocaleString()} from all 36 ship wallets into Master Vault #54751113!`);
        addNotification({
          title: "Sovereign Treasury Sweep Complete!",
          message: `Swept $${data.sweptUSD.toLocaleString()} with 95/5 ratio into Vault #54751113 (Invariant 42·13·35·55 Validated).`,
          severity: "SUCCESS",
          category: "EXECUTION"
        });
      }
    } catch {
      setSweepSuccessMessage("✅ Local simulation: $148,250 swept into Master Vault #54751113.");
    } finally {
      setIsSweeping(false);
      setTimeout(() => setSweepSuccessMessage(null), 6000);
    }
  };

  const handleToggleKillswitch = async () => {
    const nextState = !globalMiningActive;
    setGlobalMiningActive(nextState);
    try {
      await fetch("/api/fleet/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_GLOBAL_MINING", payload: { active: nextState } })
      });
    } catch (e) {
      console.error(e);
    }
    addNotification({
      title: nextState ? "Fleet Operations Resumed" : "🚨 EMERGENCY ALPHA KILLSWITCH ENGAGED",
      message: nextState ? "All 36 vessels resume mining and trading." : "Global fleet frozen under Sovereign Command Directive.",
      severity: nextState ? "INFO" : "CRITICAL",
      category: "COMPLIANCE"
    });
  };

  const handlePushTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTickerInput.trim()) return;
    try {
      await fetch("/api/fleet/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SET_TICKER_OVERRIDE", payload: { ticker: broadcastTickerInput } })
      });
    } catch (e) {
      console.error(e);
    }
    addNotification({
      title: "Global Broadcast Directive Pushed",
      message: `Directive broadcasted to all 36 civilizational ship studios!`,
      severity: "SUCCESS",
      category: "COMMUNICATION"
    });
  };

  const filteredFleet = CIVILIZATIONAL_FLEET.filter((s) => {
    if (selectedFleetFilter === "ALL") return true;
    return s.faction === selectedFleetFilter;
  });

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (amount > 10000 || amount > treasuryCash) {
      setParentApprovalRequired(true);
      setWithdrawNotice(`⚠️ SECURITY PROTOCOL: The large withdrawal request of €${amount.toLocaleString()} has been forwarded to the Quantitative Security Consensus. It will be transferred to the Black Bank Card upon approval.`);
      addNotification({
        title: "Security Consensus Active",
        message: `Umay's withdrawal request of €${amount.toLocaleString()} has been forwarded to the multi-signature (Multi-Sig) protocol.`,
        severity: "CRITICAL",
        category: "COMPLIANCE",
      });
    } else {
      setParentApprovalRequired(false);
      setTreasuryCash((prev) => prev - amount);
      setWithdrawNotice(`💳 SUCCESS: €${amount.toLocaleString()} loaded to the Umay Gül Nur Black Bank Card! You can withdraw your allowance from any ATM worldwide, CEO Umay!`);
      addNotification({
        title: "Allowance Loaded to Card",
        message: `€${amount.toLocaleString()} has been transferred to Umay's bank card.`,
        severity: "SUCCESS",
        category: "COMPLIANCE",
      });
      setWithdrawAmount("");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#050811", color: "#f8fafc" }}>
      {/* Top Patron Executive Banner */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "linear-gradient(90deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)", borderColor: "rgba(0, 212, 170, 0.3)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <EagleCrest size={44} />
            <span className="absolute -top-1 -right-1 text-lg">👑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                UMAY GÜL NUR — SOVEREIGN QUANTITATIVE CEO TERMINAL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                DOB: 04.08.2017 &bull; SOLE CHAIRMAN
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              nurfinans.com &bull; €100,000 Treasury Fund, Antigravity AI and Global Desks at Your Service
            </p>
          </div>
        </div>

        {/* Live Treasury & Valuation Widget */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-emerald-500/40 text-right">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Total Company Value</span>
            <span className="text-lg font-black font-mono text-emerald-300">
              {totalPortfolioValue.toLocaleString()} &euro;
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-amber-500/40 text-right">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">Umay&apos;s Generated Profit</span>
            <span className="text-lg font-black font-mono text-amber-300">
              +{totalProfit.toLocaleString()} &euro;
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between px-6 py-2 border-b bg-black/50 border-white/10 text-xs font-bold overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveBoardTab("fleet-master")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "fleet-master"
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/20 font-black"
                : "bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30"
            }`}
          >
            <span>🛸</span>
            <span>36-Gemi Master Filo & Hazine Köprüsü</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("office")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "office"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>🤖</span>
            <span>Command Antigravity AI</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("staff")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "staff"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>👥</span>
            <span>Staff & Global Offices (NYC, FRA, IST)</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("chess-strategy")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "chess-strategy"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>♟️</span>
            <span>Fatih Sultan Mehmet & Chess Vision</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("languages")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "languages"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>🌍</span>
            <span>Leadership Languages</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("card-vault")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "card-vault"
                ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                : "bg-white/5 hover:bg-white/10 text-amber-300"
            }`}
          >
            <span>💳</span>
            <span>Sovereign Black Card & Vault</span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded border border-white/10 text-[11px] font-mono">
          <button
            onClick={() => setChatLanguage("EN")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "EN" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇺🇸 EN
          </button>
          <button
            onClick={() => setChatLanguage("DE")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "DE" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇩🇪 DE
          </button>
          <button
            onClick={() => setChatLanguage("TR")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "TR" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇹🇷 TR
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeBoardTab === "fleet-master" && (
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Top Sovereign Vault & Invariant Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/40 border border-amber-500/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      ROOT SOVEREIGN VAULT #54751113
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      INVARIANT 42 · 13 · 35 · 55 // LOCKED
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1 tracking-wide">
                    $840,400,000,000 <span className="text-xs font-mono text-amber-400 font-bold">SOVEREIGN AGGREGATE</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    36 Civilizational Vessel Sub-Wallets &bull; 95% Revenue Cascade to Umay Vault &bull; 5% Regional Reserve Retention
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSweepAll}
                  disabled={isSweeping}
                  className="px-5 py-3 rounded-xl font-mono text-xs font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <span>💰</span>
                  <span>{isSweeping ? "SWEEPING 36 VESSELS..." : "SWEEP 95% REVENUE NOW"}</span>
                </button>
                <button
                  onClick={handleToggleKillswitch}
                  className={`px-4 py-3 rounded-xl font-mono text-xs font-black border transition-all flex items-center gap-2 ${
                    globalMiningActive
                      ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
                      : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
                  }`}
                >
                  <span>{globalMiningActive ? "🚨" : "▶️"}</span>
                  <span>{globalMiningActive ? "ALPHA KILLSWITCH" : "RESUME ALL MINING"}</span>
                </button>
              </div>
            </div>

            {sweepSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-bounce">
                <span>✨</span>
                <span>{sweepSuccessMessage}</span>
              </div>
            )}

            {/* Global Broadcast Directive Bar */}
            <form onSubmit={handlePushTicker} className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col md:flex-row items-center gap-3">
              <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap flex items-center gap-1.5">
                <span>📡</span>
                <span>GLOBAL DIRECTIVE TO 36 SHIPS:</span>
              </span>
              <input
                type="text"
                value={broadcastTickerInput}
                onChange={(e) => setBroadcastTickerInput(e.target.value)}
                placeholder="Type global news broadcast directive for all 36 ships..."
                className="flex-1 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition-all whitespace-nowrap"
              >
                PUSH TO 36 SHIPS &rarr;
              </button>
            </form>

            {/* Filter Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFleetFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedFleetFilter === "ALL"
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  🌐 ALL VESSELS (36)
                </button>
                <button
                  onClick={() => setSelectedFleetFilter("conservative")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedFleetFilter === "conservative"
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-amber-300"
                  }`}
                >
                  🛡️ SOVEREIGN DREADNOUGHTS (18)
                </button>
                <button
                  onClick={() => setSelectedFleetFilter("liberal")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                    selectedFleetFilter === "liberal"
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-cyan-300"
                  }`}
                >
                  🕊️ LIBERAL SKY YACHTS (18)
                </button>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredFleet.length} / 36 vessels
              </span>
            </div>

            {/* 36-Vessel Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFleet.map((ship) => (
                <div
                  key={ship.id}
                  className="p-4 rounded-xl border bg-black/50 hover:bg-black/70 transition-all flex flex-col justify-between group shadow-lg"
                  style={{ borderColor: `${ship.accentColor}40` }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ship.faction === "conservative" ? "🛡️" : "🕊️"}</span>
                        <div>
                          <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                            {ship.name}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {ship.civilization} &bull; {ship.targetRegion}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                        style={{
                          backgroundColor: `${ship.accentColor}20`,
                          color: ship.accentColor,
                          border: `1px solid ${ship.accentColor}40`
                        }}
                      >
                        {ship.faction}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">
                      {ship.theme}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] font-mono bg-white/5 p-2 rounded border border-white/5">
                      <div>
                        <span className="text-slate-500 block">INDEX</span>
                        <span className="text-white font-bold">{ship.marketIndex}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">PRIMARY</span>
                        <span className="text-emerald-400 font-bold">{ship.primarySymbol}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">ANCHORS</span>
                        <span className="text-cyan-300 font-bold truncate block">{ship.anchors.join(" & ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <a
                      href={ship.terminalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 text-center rounded text-[11px] font-mono font-bold bg-white/10 hover:bg-amber-400 hover:text-black text-white transition-colors"
                    >
                      🚀 WARP TUNNEL &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBoardTab === "office" && (
          <div className="max-w-5xl mx-auto flex flex-col h-full gap-4">
            {/* AI Command Chat Interface */}
            <div className="flex-1 rounded-xl border bg-black/60 border-white/10 p-4 flex flex-col overflow-hidden shadow-2xl">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === "UMAY"
                        ? "ml-auto bg-[var(--ag-accent)] text-black font-semibold rounded-br-none"
                        : "bg-white/10 border border-white/10 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 opacity-75 font-mono text-[10px]">
                      <span>
                        {msg.sender === "UMAY" ? "👑 CEO Umay Gül Nur" : "🤖 Antigravity AI (Quantitative Director)"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                    {msg.rewardEUR && (
                      <div className="mt-2 text-[10px] font-mono font-bold text-emerald-400 bg-black/40 px-2 py-0.5 rounded inline-block">
                        +{msg.rewardEUR.toLocaleString()} &euro; PROFIT ADDED ✨
                      </div>
                    )}
                  </div>
                ))}
                {isAiThinking && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 italic flex items-center gap-2 max-w-fit">
                    <span className="w-2 h-2 rounded-full bg-[var(--ag-accent)] animate-ping" />
                    Antigravity AI is relaying your commands to New York and Frankfurt offices...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendCommand} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={
                    chatLanguage === "DE"
                      ? "Geben Sie Antigravity AI einen Befehl (z.B. 'Frankfurt Portfolio optimieren')..."
                      : "Give a command to Antigravity AI (e.g. 'Analyze tech stocks', 'Send report to New York')..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[var(--ag-accent)]"
                />
                <button
                  type="submit"
                  disabled={isAiThinking}
                  className="px-5 py-2.5 rounded-lg bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  Command &rarr;
                </button>
              </form>
            </div>
          </div>
        )}

        {activeBoardTab === "staff" && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-xl border bg-black/50 border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Holding Staff & Live Office Reports</h3>
                <p className="text-xs text-slate-400">Department managers and analysts reporting directly to CEO Umay Gül Nur.</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                4 Active Departments &bull; 24-Person Team
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.map((st) => (
                <div key={st.id} className="p-5 rounded-xl border bg-black/40 border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{st.avatar}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{st.name}</h4>
                          <span className="text-[11px] text-slate-400">{st.role} &bull; {st.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-400">
                        {st.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg mt-2 leading-relaxed">
                      💬 &ldquo;{st.dailyReport}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">Salary: {st.salaryEUR.toLocaleString()} €/mo</span>
                    {st.needsApproval ? (
                      <button
                        onClick={() => handleApproveStaff(st.id)}
                        className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
                      >
                        Approve Budget &rarr;
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[11px]">APPROVED ✅</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBoardTab === "chess-strategy" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Fatih Sultan Mehmet Historical Hero Card */}
            <div className="p-6 rounded-xl border bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-black border-amber-400/40 shadow-2xl">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🏰</span>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-amber-300">
                    Fatih Sultan Mehmet Han: World Conqueror Who Ascended the Throne at Age 12
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Ms. Umay, Fatih Sultan Mehmet Han was just 12 years old when he first ascended the throne. While those around him said he was too young, he set his mind to conquering Istanbul with the greatest vision in history and marked the turning of an era. You too are 9 years old today and lead this holding company. You possess the genius to manage this capital with strategic moves just as in chess!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♔ King&apos;s Gambit</div>
                <div className="text-xs font-bold text-white mb-1">Core Capital Protection</div>
                <p className="text-[11px] text-slate-400">The €100,000 in your treasury is your king. Never put it at risk.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♕ Queen&apos;s Move</div>
                <div className="text-xs font-bold text-emerald-400 mb-1">Quantitative Arbitrage</div>
                <p className="text-[11px] text-slate-400">Antigravity AI is your queen. It scans markets and brings profits.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♙ Pawn Promotion</div>
                <div className="text-xs font-bold text-amber-300 mb-1">Compound Return Power</div>
                <p className="text-[11px] text-slate-400">Small profits compounded with discipline grow into millions.</p>
              </div>
            </div>
          </div>
        )}

        {activeBoardTab === "languages" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-black/60 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <h3 className="text-base font-bold text-white">Language Practice Room (New York & Frankfurt)</h3>
                  <p className="text-xs text-slate-400">30-minute daily English and German leadership practice with Antigravity AI and global directors.</p>
                </div>
              </div>
              <div className="py-4">
                <AudioSpectrumVisualizer isPlaying={true} barColor="#00d4aa" height={36} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-cyan-300 block mb-1">🇺🇸 English Executive Practice</span>
                  <p className="text-xs text-slate-300">&ldquo;Hello Boss Umay! How is our portfolio doing today?&rdquo;</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-amber-300 block mb-1">🇩🇪 Deutsch Führungspraxis</span>
                  <p className="text-xs text-slate-300">&ldquo;Guten Tag Chefin Umay! Unser Frankfurter Büro meldet Erfolg!&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeBoardTab === "card-vault" && (
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-gradient-to-br from-slate-900 via-black to-slate-950 border-amber-500/40 shadow-2xl">
              {/* Virtual Black Card */}
              <div className="aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-tr from-black via-slate-900 to-amber-950 p-6 border border-amber-400/40 relative overflow-hidden flex flex-col justify-between shadow-2xl mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-300">NUR FINANCE BLACK CARD</span>
                  <EagleCrest size={28} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 mb-1">PATRON & CEO</div>
                  <div className="text-lg font-black tracking-wider text-white font-mono">UMAY GÜL NUR</div>
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-amber-400">
                  <span>VALID: 08/2035</span>
                  <span>VAULT: {treasuryCash.toLocaleString()} &euro;</span>
                </div>
              </div>

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Allowance / Withdrawal Amount (&euro;)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Small allowances are loaded to the card instantly. Withdrawals above €10,000 go through the multi-signature (Multi-Sig) security protocol.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black transition-colors"
                >
                  Transfer Allowance to Card &rarr;
                </button>
              </form>

              {withdrawNotice && (
                <div
                  className={`mt-4 p-3 rounded text-xs font-medium leading-relaxed ${
                    parentApprovalRequired
                      ? "bg-red-950/40 border border-red-500/40 text-red-300"
                      : "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {withdrawNotice}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
