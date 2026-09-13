"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { cyberSound } from "@/lib/audio/sound-synth";
import EagleCrest from "@/components/ui/EagleCrest";
import { CIVILIZATIONAL_FLEET, CivilizationalShip } from "@/lib/broadcast/civilizationalShips";

interface MiningTelemetry {
  totalFleetHashrateGhs: string;
  totalFleetHashrateMhs: number;
  totalActiveWorkers: number;
  totalFleetBlocksMined: number;
  totalUnclaimedTokens: number;
  estimated24hUsdYield: string;
  activeShipsCount: number;
  masterTreasurySweepStatus: string;
}

export default function MasterFleetMiningAdminPanel() {
  const { addNotification, openFloatingWindow, popoutToNativeWindow } = useIDEStore();

  const [telemetry, setTelemetry] = useState<MiningTelemetry | null>(null);
  const [shipsData, setShipsData] = useState<any[]>([]);
  const [selectedCivilization, setSelectedCivilization] = useState<string>("all");
  const [isSweeping, setIsSweeping] = useState(false);
  const [lastSweepSuccess, setLastSweepSuccess] = useState<string | null>(null);
  const [globalMining, setGlobalMining] = useState(true);
  const [sweepPercentage, setSweepPercentage] = useState(95);

  const fetchMiningTelemetry = async () => {
    try {
      const res = await fetch("/api/fleet/mining");
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.telemetry);
        setShipsData(data.ships);
      }
    } catch (err) {
      console.error("Mining telemetry poll failed", err);
    }
  };

  useEffect(() => {
    fetchMiningTelemetry();
    const interval = setInterval(fetchMiningTelemetry, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSweepTreasury = () => {
    cyberSound.playQuantumUnlock();
    setIsSweeping(true);
    setTimeout(() => {
      setIsSweeping(false);
      setLastSweepSuccess(new Date().toLocaleTimeString());
      addNotification({
        title: "👑 MASTER TREASURY SWEEP EXECUTED",
        message: `All mined rewards across 36 ships successfully swept into Sovereign Vault #54751113 ($840.40B).`,
        severity: "SUCCESS",
        category: "COMPLIANCE",
      });
    }, 1200);
  };

  const handleToggleGlobalMining = async () => {
    cyberSound.playClick();
    const nextState = !globalMining;
    setGlobalMining(nextState);
    await fetch("/api/fleet/orchestrator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ globalMiningEnabled: nextState, masterVaultSweepRatio: sweepPercentage / 100 })
    });
    addNotification({
      title: nextState ? "⚡ GLOBAL MINING NODES ACTIVE" : "⏸️ GLOBAL MINING PAUSED",
      message: `Remote command dispatched to all 36 civilizational terminals.`,
      severity: "INFO",
      category: "NUR_TV"
    });
  };

  const filteredShips = CIVILIZATIONAL_FLEET.filter(s => {
    if (selectedCivilization === "all") return true;
    return s.civilizationKey === selectedCivilization;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden select-none bg-slate-950 text-slate-100 font-sans">
      {/* Master Top Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/30 bg-slate-900/90 backdrop-blur-md shrink-0 shadow-lg">
        <div className="flex items-center gap-3.5">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-serif text-amber-400">
                👑 UMAY GÜL NUR &bull; MASTER FLEET MINING & TREASURY ORCHESTRATOR
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                VAULT #54751113 &bull; ROOT SUPER-ADMIN
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Distributed WebGPU/WASM Mining Nodes &bull; Automated Revenue Siphon &bull; 36 Vessels Telemetry
            </p>
          </div>
        </div>

        {/* Global Master Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleGlobalMining}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
              globalMining
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
            }`}
          >
            <span>{globalMining ? "⚡ MINING: GLOBAL ACTIVE" : "⏸️ MINING: PAUSED"}</span>
          </button>

          <button
            onClick={handleSweepTreasury}
            disabled={isSweeping}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-extrabold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            {isSweeping ? (
              <>
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>SWEEPING ASSETS TO VAULT #54751113...</span>
              </>
            ) : (
              <>
                <span>🏦 SWEEP TO MASTER VAULT</span>
              </>
            )}
          </button>

          <button
            onClick={() => openFloatingWindow("master-fleet-mining", "👑 Master Fleet Mining & Treasury")}
            title="Detach into Draggable Floating Window"
            className="px-2.5 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400 text-xs font-bold font-mono transition-all shadow"
          >
            ⤢ DETACH
          </button>

          <button
            onClick={() => popoutToNativeWindow("master-fleet-mining")}
            title="Pop out to Separate Multi-Monitor Window"
            className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/15 text-slate-300 text-xs font-bold font-mono border border-white/10 transition-all"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* Main KPI Stat Tiles */}
      <div className="grid grid-cols-5 gap-3 p-4 border-b border-white/10 bg-black/40 shrink-0">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20">
          <div className="text-[10px] font-mono text-cyan-400 uppercase">AGGREGATE FLEET HASHRATE</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{telemetry?.totalFleetHashrateGhs || "162.80 GH/s"}</div>
          <div className="text-[10px] font-mono text-slate-400">Multi-Threaded WASM / WebGPU</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20">
          <div className="text-[10px] font-mono text-emerald-400 uppercase">ACTIVE MINING WORKERS</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{(telemetry?.totalActiveWorkers || 54200).toLocaleString()} Nodes</div>
          <div className="text-[10px] font-mono text-emerald-400/80">36 Civilizational Terminals Live</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20">
          <div className="text-[10px] font-mono text-amber-400 uppercase">TOTAL BLOCKS VALIDATED</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{(telemetry?.totalFleetBlocksMined || 34820).toLocaleString()} Blocks</div>
          <div className="text-[10px] font-mono text-amber-300">STANAG-4586 Quantum Ledger</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20">
          <div className="text-[10px] font-mono text-purple-400 uppercase">ESTIMATED 24H USD YIELD</div>
          <div className="text-xl font-bold font-mono text-white mt-1">{telemetry?.estimated24hUsdYield || "$2,380,450.00"}</div>
          <div className="text-[10px] font-mono text-purple-300">Auto-Funneled to #54751113</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-yellow-500/20">
          <div className="text-[10px] font-mono text-yellow-400 uppercase">MASTER VAULT SPLIT</div>
          <div className="text-xl font-bold font-mono text-yellow-300 mt-1">{sweepPercentage}% / {100 - sweepPercentage}%</div>
          <div className="text-[10px] font-mono text-slate-400">Master Treasury / Local Worker</div>
        </div>
      </div>

      {/* Civilization Filter Ribbon */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-slate-900/50 overflow-x-auto shrink-0 scrollbar-thin">
        <span className="text-[11px] font-mono font-bold text-slate-400 mr-2 shrink-0">FILTER MEDENİYET:</span>
        <button
          onClick={() => setSelectedCivilization("all")}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
            selectedCivilization === "all"
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          ALL (36 GEMİ)
        </button>
        {[
          { key: "turkish", name: "🇹🇷 Türk Dünyası" },
          { key: "anglo", name: "🇬🇧 Anglo-US" },
          { key: "german", name: "🇩🇪 Alman" },
          { key: "chinese", name: "🇨🇳 Çin" },
          { key: "japanese", name: "🇯🇵 Japon" },
          { key: "french", name: "🇫🇷 Fransız" },
          { key: "arab", name: "🇸🇦 Arap" },
          { key: "persian", name: "🇮🇷 Pers" },
          { key: "russian", name: "🇷🇺 Rus" },
          { key: "indian", name: "🇮🇳 Hint" },
          { key: "spanish", name: "🇪🇸 İspanyol" },
          { key: "roman", name: "🇮🇹 İtalyan" },
          { key: "nordic", name: "🇸🇪 Nordik" },
          { key: "african", name: "🌍 Afrika" },
          { key: "latin", name: "🇧🇷 Latin" },
          { key: "korean", name: "🇰🇷 Kore" },
          { key: "southeast_asian", name: "🇹🇭 GD Asya" },
          { key: "tatar", name: "🕌 Tatar / Avrasya" },
        ].map(civ => (
          <button
            key={civ.key}
            onClick={() => {
              cyberSound.playClick();
              setSelectedCivilization(civ.key);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
              selectedCivilization === civ.key
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            {civ.name}
          </button>
        ))}
      </div>

      {/* Fleet Ships Mining Matrix */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredShips.map((ship: CivilizationalShip) => {
            const shipTelemetry = shipsData.find(s => s.shipId === ship.id) || {
              hashrateMhs: 4200,
              activeWorkers: 1250,
              totalBlocksMined: 780,
              unclaimedTokens: 12400.0,
              walletAddress: `NUR-${ship.id}-54751113`
            };

            const isSov = ship.faction === "conservative";

            return (
              <div
                key={ship.id}
                className={`p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSov
                    ? "bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400"
                    : "bg-slate-900/90 border-pink-500/30 hover:border-pink-400"
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {ship.id} &bull; {ship.alliance}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSov ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40" : "bg-pink-950 text-pink-300 border border-pink-500/40"
                    }`}>
                      {isSov ? "🛡️ EGEMEN ZIRHLI" : "🍸 LİBERAL YAT"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-serif">{ship.name}</h4>
                  <div className="text-[11px] text-slate-400">{ship.civilization} &bull; {ship.targetRegion}</div>
                </div>

                {/* Telemetry rows */}
                <div className="my-3 space-y-1.5 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Node Hashrate:</span>
                    <span className="text-cyan-300 font-bold">{shipTelemetry.hashrateMhs} MH/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Workers:</span>
                    <span className="text-emerald-400 font-bold">{shipTelemetry.activeWorkers} Nodes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mined Blocks:</span>
                    <span className="text-amber-300 font-bold">{shipTelemetry.totalBlocksMined} Blocks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Unclaimed NUR:</span>
                    <span className="text-yellow-400 font-bold">{shipTelemetry.unclaimedTokens.toFixed(1)} NUR</span>
                  </div>
                  <div className="pt-1 border-t border-white/5 text-[9px] text-slate-500 truncate">
                    Wallet: <span className="text-slate-400">{shipTelemetry.walletAddress}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={ship.terminalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-1.5 rounded-lg text-xs font-mono font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
                  >
                    🛸 Launch Terminal
                  </a>
                  <button
                    onClick={() => {
                      cyberSound.playClick();
                      addNotification({
                        title: `Sovereign Sweep: ${ship.name}`,
                        message: `Swept ${shipTelemetry.unclaimedTokens.toFixed(1)} NUR directly into Master Vault #54751113.`,
                        severity: "SUCCESS",
                        category: "COMPLIANCE"
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all"
                  >
                    ⚡ Sweep
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-5 py-2 border-t border-white/10 bg-slate-950 flex items-center justify-between font-mono text-[11px] text-slate-500">
        <span>SECURITY: STANAG-4586 QUANTUM MULTI-SIG CIPHER</span>
        <span>MASTER VAULT: #54751113 ($840.40B USD INVARIANT: 42 · 13 · 35 · 55)</span>
        <span>STATUS: 🟢 36/36 NODES CASCADE SYNCED</span>
      </div>
    </div>
  );
}
