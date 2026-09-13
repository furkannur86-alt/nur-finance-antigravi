"use client";

import React, { useState, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { CIVILIZATIONAL_FLEET, CivilizationalShip } from "@/lib/broadcast/civilizationalShips";

interface SweepData {
  vaultId: string;
  sovereignVaultBalanceUSD: number;
  invariant: {
    formula: string;
    status: string;
    hash: string;
  };
  totalSweptToVaultUSD: number;
  totalUnsweptUSD: number;
  totalHashrateGH: number;
  totalActiveWorkers: number;
  lastSweepTimestamp: string;
  wallets: Array<{
    id: string;
    shipName: string;
    civilization: string;
    faction: "conservative" | "liberal";
    walletAddress: string;
    uncollectedUSD: number;
    totalMinedUSD: number;
    hashrateMH: number;
    activeWorkers: number;
  }>;
}

export default function UmayMasterTerminalPanel() {
  const { addNotification } = useIDEStore();
  const [sweepData, setSweepData] = useState<SweepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedShip, setSelectedShip] = useState<CivilizationalShip | null>(CIVILIZATIONAL_FLEET[0]);
  const [filterFaction, setFilterFaction] = useState<"ALL" | "conservative" | "liberal">("ALL");
  const [invariantInput, setInvariantInput] = useState("42·13·35·55");
  const [isSweeping, setIsSweeping] = useState(false);
  const [globalKillswitch, setGlobalKillswitch] = useState(false);
  const [globalPowerMode, setGlobalPowerMode] = useState<"ECO" | "BALANCED" | "OVERCLOCK">("BALANCED");
  const [broadcastMessage, setBroadcastMessage] = useState("👑 UMAY GÜL NUR 2126 // SOVEREIGN QUANTUM TREASURY ACTIVE");
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; time: string; text: string }>>([
    { id: "1", time: "10:00:12", text: "Invariant [42·13·35·55] consensus check PASSED." },
    { id: "2", time: "10:15:44", text: "Global fleet telemetry synced: 36/36 vessels operational." },
    { id: "3", time: "11:30:00", text: "Automated 95% revenue cascade routed to Vault #54751113." },
  ]);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/umay/sweep");
      const data = await res.json();
      if (data.success) {
        setSweepData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteSweep = async () => {
    if (invariantInput.trim() !== "42·13·35·55" && invariantInput.trim() !== "42.13.35.55") {
      addNotification({
        title: "Invariant Validation Failed",
        message: "Incorrect invariant key! Expected: 42 · 13 · 35 · 55",
        severity: "CRITICAL",
        category: "COMPLIANCE"
      });
      return;
    }

    setIsSweeping(true);
    try {
      const res = await fetch("/api/umay/sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invariantKey: invariantInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        addNotification({
          title: "Sovereign Sweep Completed",
          message: `Successfully swept $${data.sweptToVaultUSD.toLocaleString()} (95%) into Vault #54751113!`,
          severity: "SUCCESS",
          category: "EXECUTION"
        });
        setAuditLogs((prev) => [
          {
            id: String(Date.now()),
            time: new Date().toLocaleTimeString(),
            text: `SWEEP EXEC: +$${data.sweptToVaultUSD.toLocaleString()} to Vault #54751113 (Invariant 42·13·35·55 Verified).`
          },
          ...prev
        ]);
        fetchTelemetry();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSweeping(false);
    }
  };

  const handleToggleKillswitch = () => {
    const next = !globalKillswitch;
    setGlobalKillswitch(next);
    addNotification({
      title: next ? "🚨 FLEET ALPHA KILLSWITCH ENGAGED" : "Fleet Operations Resumed",
      message: next ? "All 36 civilizational vessels have been paused." : "All 36 vessels resume normal operations.",
      severity: next ? "CRITICAL" : "INFO",
      category: "COMPLIANCE"
    });
    setAuditLogs((prev) => [
      {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString(),
        text: next ? "🚨 KILLSWITCH: Global fleet operations frozen by Sovereign Commander." : "▶️ RESUME: Fleet operational status restored."
      },
      ...prev
    ]);
  };

  const handleBroadcastPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    addNotification({
      title: "Global Directive Broadcasted",
      message: `Directive transmitted to 36 ship tickers: "${broadcastMessage}"`,
      severity: "SUCCESS",
      category: "COMMUNICATION"
    });
    setAuditLogs((prev) => [
      {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString(),
        text: `BROADCAST: Pushed "${broadcastMessage}" to 36 ship media channels.`
      },
      ...prev
    ]);
  };

  const filteredShips = CIVILIZATIONAL_FLEET.filter((s) => {
    if (filterFaction === "ALL") return true;
    return s.faction === filterFaction;
  });

  return (
    <div className="flex flex-col h-full bg-[#020408] text-slate-100 font-sans select-none overflow-y-auto">
      {/* Sovereign Header */}
      <div className="p-6 bg-gradient-to-r from-black via-amber-950/30 to-black border-b border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                UMAY GÜL NUR — ROOT SOVEREIGN MASTER TERMINAL
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                VAULT #54751113
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              36-Ship Galactic Fleet Sovereign Bridge &bull; Invariant Consensus: <span className="font-mono text-emerald-400 font-bold">42 · 13 · 35 · 55</span> &bull; 95% Automated Cascade
            </p>
          </div>
        </div>

        {/* Global Vault Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-right">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Sovereign Vault Balance</span>
            <span className="text-lg font-black font-mono text-white">
              ${(sweepData?.sovereignVaultBalanceUSD || 840442850900).toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-black/60 border border-emerald-500/30 text-right">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Uncollected Fleet Yield</span>
            <span className="text-lg font-black font-mono text-emerald-300">
              ${(sweepData?.totalUnsweptUSD || 148250).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Body */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fleet Matrix (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Controls & Filter Bar */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterFaction("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  filterFaction === "ALL" ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                ALL (36)
              </button>
              <button
                onClick={() => setFilterFaction("conservative")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  filterFaction === "conservative" ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                🛡️ SOVEREIGN (18)
              </button>
              <button
                onClick={() => setFilterFaction("liberal")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  filterFaction === "liberal" ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300" : "bg-white/5 border-white/10 text-slate-400"
                }`}
              >
                🕊️ LIBERAL (18)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleKillswitch}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                  globalKillswitch
                    ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse"
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-red-500/40"
                }`}
              >
                <span>{globalKillswitch ? "🚨" : "🛡️"}</span>
                <span>{globalKillswitch ? "KILLSWITCH ACTIVE" : "ALPHA KILLSWITCH"}</span>
              </button>
            </div>
          </div>

          {/* Ship Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredShips.map((ship) => {
              const isSelected = selectedShip?.id === ship.id;
              return (
                <div
                  key={ship.id}
                  onClick={() => setSelectedShip(ship)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-amber-950/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-black/50 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ship.faction === "conservative" ? "🛡️" : "🕊️"}</span>
                      <div>
                        <h3 className="text-xs font-black text-white">{ship.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          {ship.civilization} &bull; {ship.targetRegion}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${ship.accentColor}20`,
                        color: ship.accentColor,
                        border: `1px solid ${ship.accentColor}40`
                      }}
                    >
                      {ship.alliance}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-300 pt-2 border-t border-white/5">
                    <span>Index: <b className="text-white">{ship.marketIndex}</b></span>
                    <a
                      href={ship.terminalUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-amber-400 hover:text-black font-bold text-white transition-colors"
                    >
                      WARP &rarr;
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global Broadcast Bar */}
          <form onSubmit={handleBroadcastPush} className="p-4 rounded-xl bg-black/50 border border-white/10 flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap">📡 DIRECTIVE:</span>
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Send live directive to 36 ship studios..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold transition-all"
            >
              BROADCAST
            </button>
          </form>
        </div>

        {/* Right Column: Selected Ship Deep Dive & Invariant Treasury Sweep (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Treasury Sweep Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-black via-amber-950/20 to-black border border-amber-500/40 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚡</span>
                <span>SOVEREIGN INVARIANT SWEEP (95/5)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1.5">
                Master Invariant Passkey:
              </label>
              <input
                type="text"
                value={invariantInput}
                onChange={(e) => setInvariantInput(e.target.value)}
                placeholder="42·13·35·55"
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 font-mono text-center font-black tracking-widest text-sm focus:outline-none focus:border-amber-300"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Sweeps 95% of total mined crypto ($148,250) directly to Vault #54751113. 5% remains in local ship reserve.
              </span>
            </div>

            <button
              onClick={handleExecuteSweep}
              disabled={isSweeping}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono text-xs font-black tracking-wider shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isSweeping ? "EXECUTING INVARIANT SWEEP..." : "EXECUTE 95% REVENUE SWEEP &rarr;"}
            </button>
          </div>

          {/* Selected Ship Detail View */}
          {selectedShip && (
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold block">SELECTED VESSEL</span>
                  <h3 className="text-sm font-black text-white">{selectedShip.name}</h3>
                </div>
                <a
                  href={selectedShip.terminalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-mono text-xs font-bold hover:bg-amber-300 transition-all"
                >
                  OPEN TERMINAL &rarr;
                </a>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Civilization:</span>
                  <span className="text-white font-bold">{selectedShip.civilization}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Target Region:</span>
                  <span className="text-white font-bold">{selectedShip.targetRegion}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Anchors:</span>
                  <span className="text-cyan-300 font-bold">{selectedShip.anchors.join(" & ")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Reactor Core:</span>
                  <span className="text-emerald-400 font-bold">{selectedShip.telemetry.reactorCore}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Warp Drive:</span>
                  <span className="text-amber-400 font-bold">{selectedShip.telemetry.warpDriveTier}</span>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col gap-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold">SOVEREIGN AUDIT TRAIL</span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[10px] text-slate-300">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-amber-400 whitespace-nowrap">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
