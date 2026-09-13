"use client";

import React, { useState, useEffect, useRef } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { CIVILIZATIONAL_FLEET, CivilizationalShip } from "@/lib/broadcast/civilizationalShips";

interface MinerTelemetry {
  hashrateMH: number;
  totalHashes: number;
  sharesFound: number;
  blocksFound: number;
  earnedUSD: number;
}

export default function FleetMinerPanel() {
  const { addNotification } = useIDEStore();
  const [selectedShipId, setSelectedShipId] = useState("TR_SOV");
  const [powerMode, setPowerMode] = useState<"ECO" | "BALANCED" | "OVERCLOCK">("BALANCED");
  const [isMining, setIsMining] = useState(false);
  const [telemetry, setTelemetry] = useState<MinerTelemetry>({
    hashrateMH: 0,
    totalHashes: 0,
    sharesFound: 0,
    blocksFound: 0,
    earnedUSD: 0
  });
  const [logs, setLogs] = useState<Array<{ id: string; time: string; text: string; type: "info" | "success" | "gold" }>>([
    { id: "1", time: "10:00:00", text: "NUR Fleet WASM Engine initialized.", type: "info" },
    { id: "2", time: "10:00:02", text: "Connected to Sovereign Vault #54751113 telemetry router.", type: "info" }
  ]);

  const workerRef = useRef<Worker | null>(null);

  const activeShip = CIVILIZATIONAL_FLEET.find((s) => s.id === selectedShipId) || CIVILIZATIONAL_FLEET[0];
  const vesselWallet = `NUR-${activeShip.id}-54751113-VAULT`;

  useEffect(() => {
    // Initialize WebWorker
    if (typeof window !== "undefined" && typeof Worker !== "undefined") {
      const worker = new Worker("/miners/fleet-worker.js");
      workerRef.current = worker;

      worker.onmessage = (e) => {
        const { type, payload } = e.data;
        if (type === "TELEMETRY") {
          setTelemetry((prev) => ({
            ...prev,
            hashrateMH: payload.hashrateMH,
            totalHashes: prev.totalHashes + payload.totalHashes,
            sharesFound: payload.sharesFound,
            blocksFound: payload.blocksFound,
            earnedUSD: parseFloat((payload.sharesFound * 0.28 + payload.blocksFound * 6.5).toFixed(2))
          }));
        } else if (type === "BLOCK_MINED") {
          addNotification({
            title: "👑 BLOCK MINED FOR FLEET!",
            message: `Block discovered for ${payload.shipId}! Reward: +$${payload.rewardUSD} USD swept to Vault #54751113.`,
            severity: "SUCCESS",
            category: "EXECUTION"
          });
          setLogs((prev) => [
            {
              id: String(Date.now()),
              time: new Date().toLocaleTimeString(),
              text: `👑 BLOCK SOLVED! Hash: ${payload.blockHash} | +$${payload.rewardUSD} USD (95% -> Vault #54751113)`,
              type: "gold"
            },
            ...prev
          ]);
        }
      };

      return () => {
        worker.terminate();
      };
    }
  }, [addNotification]);

  const handleToggleMining = () => {
    if (!workerRef.current) return;

    if (!isMining) {
      workerRef.current.postMessage({
        type: "START",
        payload: {
          shipId: activeShip.id,
          vesselWallet,
          powerMode
        }
      });
      setIsMining(true);
      setLogs((prev) => [
        {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString(),
          text: `▶️ Mining started for ${activeShip.name} (${powerMode} mode).`,
          type: "success"
        },
        ...prev
      ]);
      addNotification({
        title: "Fleet Mining Node Started",
        message: `Allocated browser WASM power to ${activeShip.name}.`,
        severity: "INFO",
        category: "EXECUTION"
      });
    } else {
      workerRef.current.postMessage({ type: "STOP" });
      setIsMining(false);
      setTelemetry((prev) => ({ ...prev, hashrateMH: 0 }));
      setLogs((prev) => [
        {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString(),
          text: `⏸️ Mining paused. Total earned: $${telemetry.earnedUSD} USD.`,
          type: "info"
        },
        ...prev
      ]);
    }
  };

  const handleChangePowerMode = (mode: "ECO" | "BALANCED" | "OVERCLOCK") => {
    setPowerMode(mode);
    if (workerRef.current && isMining) {
      workerRef.current.postMessage({
        type: "SET_POWER",
        payload: { powerMode: mode }
      });
    }
    setLogs((prev) => [
      {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString(),
        text: `⚡ Power mode set to ${mode}.`,
        type: "info"
      },
      ...prev
    ]);
  };

  const handleChangeShip = (shipId: string) => {
    setSelectedShipId(shipId);
    const ship = CIVILIZATIONAL_FLEET.find((s) => s.id === shipId);
    if (workerRef.current && isMining && ship) {
      workerRef.current.postMessage({
        type: "SET_SHIP",
        payload: {
          shipId: ship.id,
          vesselWallet: `NUR-${ship.id}-54751113-VAULT`
        }
      });
    }
  };

  const vaultCascadeUSD = (telemetry.earnedUSD * 0.95).toFixed(2);
  const shipReserveUSD = (telemetry.earnedUSD * 0.05).toFixed(2);

  return (
    <div className="flex flex-col h-full bg-[#020408] text-slate-100 font-sans select-none overflow-y-auto p-6 gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-950 to-emerald-950/40 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner">
            ⛏️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-300">
                NUR FLEET IN-BROWSER & STANDALONE MINER
              </h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                WASM / WebGPU ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Mine cryptographic shares for any of the 36 Civilizational Vessels &bull; 95% Revenue Cascade to Sovereign Vault #54751113
            </p>
          </div>
        </div>

        {/* Download Standalone Bot Button */}
        <a
          href="/downloads/nur_fleet_miner.py"
          download="nur_fleet_miner.py"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-mono text-xs font-black shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2"
        >
          <span>🐍</span>
          <span>DOWNLOAD PYTHON BOT CLIENT</span>
        </a>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Mining Controls & Telemetry (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Target Vessel Selector */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3">
            <span className="text-xs font-mono font-bold text-amber-300">TARGET CIVILIZATIONAL VESSEL:</span>
            <select
              value={selectedShipId}
              onChange={(e) => handleChangeShip(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
            >
              {CIVILIZATIONAL_FLEET.map((ship) => (
                <option key={ship.id} value={ship.id}>
                  {ship.faction === "conservative" ? "🛡️" : "🕊️"} {ship.name} ({ship.civilization} - {ship.targetRegion})
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span>Vessel Wallet: <b className="text-white">{vesselWallet}</b></span>
              <span>Alliance: <b className="text-cyan-300">{activeShip.alliance}</b></span>
            </div>
          </div>

          {/* Mining Gauges & Power Modes */}
          <div className="p-6 rounded-2xl bg-black/50 border border-white/10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 block">REAL-TIME HASHRATE</span>
                <div className="text-4xl font-black font-mono text-emerald-400 flex items-baseline gap-2">
                  <span>{telemetry.hashrateMH.toFixed(1)}</span>
                  <span className="text-sm text-slate-400 font-bold">MH/s</span>
                </div>
              </div>

              {/* Power Mode Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  onClick={() => handleChangePowerMode("ECO")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    powerMode === "ECO" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400"
                  }`}
                >
                  🌱 ECO
                </button>
                <button
                  onClick={() => handleChangePowerMode("BALANCED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    powerMode === "BALANCED" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400"
                  }`}
                >
                  ⚡ BALANCED
                </button>
                <button
                  onClick={() => handleChangePowerMode("OVERCLOCK")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    powerMode === "OVERCLOCK" ? "bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse" : "text-slate-400"
                  }`}
                >
                  🚀 OVERCLOCK
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">SHARES ACCEPTED</span>
                <span className="text-lg font-black font-mono text-white">{telemetry.sharesFound}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">BLOCKS DISCOVERED</span>
                <span className="text-lg font-black font-mono text-amber-400">{telemetry.blocksFound}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">TOTAL YIELD</span>
                <span className="text-lg font-black font-mono text-emerald-300">${telemetry.earnedUSD}</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleToggleMining}
              className={`w-full py-4 rounded-xl font-mono text-sm font-black tracking-wider transition-all shadow-xl ${
                isMining
                  ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 shadow-red-500/10"
                  : "bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-black shadow-emerald-500/20"
              }`}
            >
              {isMining ? "⏸️ PAUSE BROWSER MINER" : "▶️ START IN-BROWSER MINING NODE"}
            </button>
          </div>
        </div>

        {/* Right Column: Revenue Cascade & Logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* 95/5 Treasury Cascade Breakdown */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-black via-amber-950/20 to-black border border-amber-500/40 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
              <span>👑</span>
              <span>AUTOMATED REVENUE CASCADE (95 / 5)</span>
            </span>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-amber-300 block">Master Sovereign Vault #54751113</span>
                  <span className="text-[10px] font-mono text-slate-400">95% Automatic Sweep Allocation</span>
                </div>
                <span className="text-base font-black font-mono text-amber-300">+${vaultCascadeUSD}</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-200 block">{activeShip.name} Reserve</span>
                  <span className="text-[10px] font-mono text-slate-400">5% Local Fuel & Defense Retention</span>
                </div>
                <span className="text-base font-black font-mono text-slate-300">+${shipReserveUSD}</span>
              </div>
            </div>
          </div>

          {/* Live Mining Log Console */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex-1 flex flex-col gap-2 min-h-[220px]">
            <span className="text-xs font-mono font-bold text-slate-400">MINING LOG & BLOCK TELEMETRY:</span>
            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-1.5 rounded flex items-start gap-2 ${
                    log.type === "gold"
                      ? "bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold"
                      : log.type === "success"
                      ? "text-emerald-300"
                      : "text-slate-300"
                  }`}
                >
                  <span className="text-slate-500 whitespace-nowrap">[{log.time}]</span>
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
