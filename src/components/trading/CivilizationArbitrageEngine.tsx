"use client";

import React, { useState, useEffect } from "react";
import {
  CIVILIZATIONAL_FLEET,
  CIVILIZATIONS_LIST,
  CivilizationalShip,
} from "@/lib/broadcast/civilizationalShips";

interface ArbitrageOpportunity {
  id: string;
  sourceCiv: string;
  sourceSymbol: string;
  sourcePrice: number;
  sourceCurrency: string;
  targetCiv: string;
  targetSymbol: string;
  targetPrice: number;
  targetCurrency: string;
  spreadPercent: number;
  estimatedProfitUSD: number;
  status: "DETECTED" | "EXECUTING" | "SETTLED";
  timestamp: string;
}

interface OrderExecution {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  market: string;
  status: "FILLED" | "PENDING" | "ROUTING";
  latencyMs: number;
  time: string;
}

interface CivilizationArbitrageEngineProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export default function CivilizationArbitrageEngine({
  onClose,
  onMinimize,
}: CivilizationArbitrageEngineProps) {
  const [isAutoArbitrageActive, setIsAutoArbitrageActive] = useState<boolean>(true);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [executions, setExecutions] = useState<OrderExecution[]>([]);
  const [totalArbitrageProfit, setTotalArbitrageProfit] = useState<number>(142850.75);
  const [selectedShipId, setSelectedShipId] = useState<string>("TR_SOV");
  const [orderQuantity, setOrderQuantity] = useState<number>(500);

  // Selected ship
  const currentShip =
    CIVILIZATIONAL_FLEET.find((s) => s.id === selectedShipId) ||
    CIVILIZATIONAL_FLEET[0];

  // Simulated live arbitrage opportunities generator
  useEffect(() => {
    const generateOpportunity = () => {
      const shipA =
        CIVILIZATIONAL_FLEET[
          Math.floor(Math.random() * CIVILIZATIONAL_FLEET.length)
        ];
      let shipB =
        CIVILIZATIONAL_FLEET[
          Math.floor(Math.random() * CIVILIZATIONAL_FLEET.length)
        ];
      while (shipB.id === shipA.id) {
        shipB =
          CIVILIZATIONAL_FLEET[
            Math.floor(Math.random() * CIVILIZATIONAL_FLEET.length)
          ];
      }

      const spread = Number((Math.random() * 2.4 + 0.35).toFixed(2));
      const profit = Math.round(spread * 1250 * (Math.random() * 3 + 1));

      const newOpp: ArbitrageOpportunity = {
        id: `ARB-${Date.now().toString().slice(-6)}`,
        sourceCiv: shipA.civilization,
        sourceSymbol: shipA.primarySymbol,
        sourcePrice: Number((Math.random() * 200 + 40).toFixed(2)),
        sourceCurrency: "USD",
        targetCiv: shipB.civilization,
        targetSymbol: shipB.primarySymbol,
        targetPrice: Number((Math.random() * 200 + 42).toFixed(2)),
        targetCurrency: "USD",
        spreadPercent: spread,
        estimatedProfitUSD: profit,
        status: "DETECTED",
        timestamp: new Date().toLocaleTimeString(),
      };

      setOpportunities((prev) => [newOpp, ...prev.slice(0, 7)]);

      if (isAutoArbitrageActive) {
        setTimeout(() => {
          setTotalArbitrageProfit((p) => p + profit);
          const newExec: OrderExecution = {
            id: `ORD-${Date.now().toString().slice(-5)}`,
            symbol: `${shipA.primarySymbol} ⇄ ${shipB.primarySymbol}`,
            side: "BUY",
            quantity: 1000,
            price: newOpp.sourcePrice,
            market: `${shipA.marketIndex} / ${shipB.marketIndex}`,
            status: "FILLED",
            latencyMs: Math.floor(Math.random() * 12 + 4),
            time: new Date().toLocaleTimeString(),
          };
          setExecutions((prev) => [newExec, ...prev.slice(0, 9)]);
        }, 1200);
      }
    };

    const interval = setInterval(generateOpportunity, 3200);
    return () => clearInterval(interval);
  }, [isAutoArbitrageActive]);

  const handleManualExecute = () => {
    const newExec: OrderExecution = {
      id: `MAN-${Date.now().toString().slice(-5)}`,
      symbol: currentShip.primarySymbol,
      side: "BUY",
      quantity: orderQuantity,
      price: Number((Math.random() * 150 + 50).toFixed(2)),
      market: currentShip.marketIndex,
      status: "FILLED",
      latencyMs: 8,
      time: new Date().toLocaleTimeString(),
    };
    setExecutions((prev) => [newExec, ...prev.slice(0, 9)]);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#02050f] text-white overflow-hidden select-none font-sans">
      {/* ── Top Bar ── */}
      <div className="h-12 bg-[#060c1c]/95 border-b border-[#00f0ff]/30 px-3 flex items-center justify-between z-20 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/70 border border-[#00f0ff]/50 px-2.5 py-1 rounded text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[#00f0ff] font-bold tracking-wider">
              18 CIVILIZATION ARBITRAGE & OMS/EMS
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden md:inline">
            36 Borsa Havuzu & Çapraz Kur Arbitraj Motoru
          </span>
        </div>

        {/* Global Profit Metric & Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/60 border border-emerald-500/50 px-3 py-1 rounded text-xs font-mono">
            <span className="text-slate-400 text-[10px] mr-1.5">TOPLAM KAZANÇ:</span>
            <span className="text-emerald-300 font-bold">
              ${totalArbitrageProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={() => setIsAutoArbitrageActive(!isAutoArbitrageActive)}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isAutoArbitrageActive
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600"
            }`}
          >
            <span>{isAutoArbitrageActive ? "⚡ OTO-BOT: AKTİF" : "⏸️ OTO-BOT: DURDU"}</span>
          </button>

          {onMinimize && (
            <button
              onClick={onMinimize}
              title="Küçült"
              className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/20 border border-white/10 rounded text-slate-300 font-bold transition"
            >
              —
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              title="Kapat"
              className="w-7 h-7 flex items-center justify-center bg-red-950/60 hover:bg-red-600 border border-red-500/50 rounded text-red-300 hover:text-white font-bold transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Main Workspace: 3 Columns ── */}
      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-y-auto">
        {/* LEFT COLUMN: Real-time Triangular Arbitrage Feed (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-[#050a18] border border-slate-800 rounded-xl p-3 flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <span>📡</span>
                <span>YAPAY ZEKA ÇAPRAZ PİYASA ARBİTRAJ RADARI</span>
              </span>
              <span className="text-[10px] font-mono bg-cyan-950/80 border border-cyan-700 text-cyan-300 px-2 py-0.5 rounded">
                YENİLENİYOR
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-black/60 border border-slate-800 hover:border-cyan-500/50 p-2.5 rounded-lg transition text-xs font-mono flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold">{opp.id}</span>
                    <span className="text-emerald-400 font-bold">
                      +{opp.spreadPercent}% SPREAD
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded">
                    <div>
                      <span className="text-slate-500 block text-[9px]">KAYNAK BORSA</span>
                      <span className="text-white font-bold">{opp.sourceSymbol}</span> ({opp.sourceCiv.split(" ")[0]})
                    </div>
                    <span className="text-amber-400 font-bold">➔</span>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[9px]">HEDEF BORSA</span>
                      <span className="text-white font-bold">{opp.targetSymbol}</span> ({opp.targetCiv.split(" ")[0]})
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{opp.timestamp}</span>
                    <span className="text-emerald-300 font-bold">
                      Tahmini Kâr: +${opp.estimatedProfitUSD.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Direct OMS Execution Ticket (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-[#050a18] border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md h-full">
            <div className="space-y-3 font-mono">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>HFT OMS / EMS EMİR GİRİŞ BİLETİ</span>
                </span>
              </div>

              {/* Ship / Market Selector */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">
                  HEDEF MEDENİYET & AMİRAL GEMİSİ
                </label>
                <select
                  value={selectedShipId}
                  onChange={(e) => setSelectedShipId(e.target.value)}
                  className="w-full bg-black/80 border border-slate-700 text-slate-200 text-xs p-2 rounded focus:border-cyan-500 outline-none"
                >
                  {CIVILIZATIONAL_FLEET.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.marketIndex})
                    </option>
                  ))}
                </select>
              </div>

              {/* Symbol & Market Quote Display */}
              <div className="bg-black/60 p-2.5 rounded border border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">AMİRAL VARLIK:</span>
                  <span className="text-amber-300 font-bold">{currentShip.primarySymbol}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">BORSA ENDEKSİ:</span>
                  <span className="text-cyan-400 font-bold">{currentShip.marketIndex}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-400">İTTİFAK KALKANI:</span>
                  <span className="text-blue-300 font-bold">{currentShip.alliance}</span>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">EMİR MİKTARI (LOT)</label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-full bg-black/80 border border-slate-700 text-slate-200 text-xs p-2 rounded focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Execution Buttons */}
            <div className="space-y-2 mt-4 font-mono">
              <button
                onClick={handleManualExecute}
                className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider shadow-lg transition"
              >
                HIZLI ALIŞ GÖNDER (BUY)
              </button>
              <button
                onClick={handleManualExecute}
                className="w-full py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider shadow-lg transition"
              >
                HIZLI SATIŞ GÖNDER (SELL)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Execution Log (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <div className="bg-[#050a18] border border-slate-800 rounded-xl p-3 flex-1 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <span>📋</span>
                <span>EMS GERÇEKLEŞEN İŞLEMLER</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
              {executions.map((exec) => (
                <div
                  key={exec.id}
                  className="bg-black/50 border border-slate-800/80 p-2 rounded flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">{exec.id}</span>
                    <span className="text-emerald-400 text-[10px] bg-emerald-950/60 border border-emerald-800 px-1.5 rounded">
                      {exec.status}
                    </span>
                  </div>
                  <div className="text-white font-bold">{exec.symbol}</div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{exec.quantity} LOT @ ${exec.price}</span>
                    <span>{exec.latencyMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
