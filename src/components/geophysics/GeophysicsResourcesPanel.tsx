"use client";

import { useState } from "react";
import EagleCrest from "@/components/ui/EagleCrest";

interface ResourceDeposit {
  id: string;
  name: string;
  category: "GOLD" | "OIL" | "RARE_EARTH" | "COPPER" | "LITHIUM";
  location: string;
  country: string;
  coordinates: string;
  estimatedReserve: string;
  marketValueUsd: string;
  depthMeters: number;
  status: "EXPLORATION" | "ACTIVE_MINING" | "RESERVE_UNFETCHED";
}

const SAMPLE_RESOURCES: ResourceDeposit[] = [
  {
    id: "res-1",
    name: "Gölbaşı Gold Vein & Sovereign Reserve",
    category: "GOLD",
    location: "Doğu Anadolu Fay Hattı / Erzincan Sektörü",
    country: "Türkiye",
    coordinates: "39.7500° N, 39.5000° E",
    estimatedReserve: "185 Ton Saf Altın",
    marketValueUsd: "$14.2 Milyar",
    depthMeters: 420,
    status: "ACTIVE_MINING",
  },
  {
    id: "res-2",
    name: "Gabar & Şırnak Heavy Crude Oil Field",
    category: "OIL",
    location: "Şırnak / Gabar Dağı Rezerv Bölgesi",
    country: "Türkiye",
    coordinates: "37.5200° N, 42.4500° E",
    estimatedReserve: "1.2 Milyar Varil",
    marketValueUsd: "$96.0 Milyar",
    depthMeters: 2600,
    status: "ACTIVE_MINING",
  },
  {
    id: "res-3",
    name: "Eskişehir Beylikova Rare Earth Elements (REE)",
    category: "RARE_EARTH",
    location: "Beylikova / Eskişehir Sahası",
    country: "Türkiye",
    coordinates: "39.6800° N, 31.1500° E",
    estimatedReserve: "694 Milyon Ton Cevher (Dünyanın En Büyük 2.)",
    marketValueUsd: "$210.0 Milyar",
    depthMeters: 180,
    status: "EXPLORATION",
  },
  {
    id: "res-4",
    name: "Kütahya Emet Lithium & Boron Salt Lake",
    category: "LITHIUM",
    location: "Emet / Kütahya",
    country: "Türkiye",
    coordinates: "39.3400° N, 29.2500° E",
    estimatedReserve: "45,000 Ton Lityum Karbonat / 1.4B Ton Bor",
    marketValueUsd: "$38.5 Milyar",
    depthMeters: 90,
    status: "ACTIVE_MINING",
  },
  {
    id: "res-5",
    name: "Kastamonu Küre Porphyry Copper Mine",
    category: "COPPER",
    location: "Küre / Kastamonu",
    country: "Türkiye",
    coordinates: "41.8000° N, 33.7100° E",
    estimatedReserve: "3.4 Milyon Ton Bakır / Pirit",
    marketValueUsd: "$28.1 Milyar",
    depthMeters: 650,
    status: "ACTIVE_MINING",
  },
];

export default function GeophysicsResourcesPanel() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeDeposit, setActiveDeposit] = useState<ResourceDeposit>(SAMPLE_RESOURCES[0]);

  const filteredResources = selectedCategory === "ALL"
    ? SAMPLE_RESOURCES
    : SAMPLE_RESOURCES.filter(r => r.category === selectedCategory);

  const totalReserveUsd = "$386.8 Milyar";

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300">3D Jeofizik & Doğal Kaynaklar Konsolu</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400">
                GEO-PHYSICS & SOVEREIGN MINING
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Altın, Petrol, Nadir Toprak Elementleri & Stratejik Maden Sismik Jeofizik Veri Haritası
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400">Toplam Haritalanan Değer:</span>
            <span className="font-bold text-emerald-400 text-sm">{totalReserveUsd}</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Resource List */}
        <div className="w-80 border-r flex flex-col min-h-0" style={{ borderColor: "var(--ag-border)", background: "rgba(0,0,0,0.3)" }}>
          {/* Category Filters */}
          <div className="p-3 border-b flex flex-wrap gap-1" style={{ borderColor: "var(--ag-border)" }}>
            {["ALL", "GOLD", "OIL", "RARE_EARTH", "LITHIUM", "COPPER"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black"
                    : "bg-white/5 hover:bg-white/10 text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setActiveDeposit(res)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  activeDeposit.id === res.id
                    ? "bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10 text-white"
                    : "bg-black/30 border-[var(--ag-border)] opacity-70 hover:opacity-100 text-slate-300"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold leading-tight">{res.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0 ml-2">
                    {res.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{res.location}</div>
                <div className="flex justify-between items-center mt-2 text-[10px] font-mono">
                  <span className="text-emerald-400 font-bold">{res.marketValueUsd}</span>
                  <span className="text-slate-500">{res.estimatedReserve}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right: Detailed 3D Seismic Visualization & Data */}
        <div className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto space-y-5">
          {/* Active Deposit Banner */}
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-950 to-black space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  SEÇİLİ JEOLOJİK CEVHER SAHASI &bull; {activeDeposit.coordinates}
                </span>
                <h2 className="text-xl font-bold text-white font-serif">{activeDeposit.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{activeDeposit.location} &bull; {activeDeposit.country}</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Piyasa Rezerv Değeri</span>
                <span className="text-2xl font-bold text-emerald-400">{activeDeposit.marketValueUsd}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">Tahmini Rezerv Hacmi</span>
                <span className="font-bold text-white">{activeDeposit.estimatedReserve}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Derinlik / Formasyon</span>
                <span className="font-bold text-amber-300">{activeDeposit.depthMeters} Metre (Sismik Katman)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Operasyonel Durum</span>
                <span className="font-bold text-emerald-400 uppercase">{activeDeposit.status.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          {/* 3D Geophysical Seismic Simulator Container */}
          <div className="h-72 rounded-2xl border border-white/10 bg-black/60 p-4 relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs font-mono z-10">
              <span className="text-amber-400 font-bold">📡 3D SİSMİK KATMAN VE TOMOGRAFİ SİMÜLASYONU</span>
              <span className="text-[10px] text-slate-500">Çözünürlük: 0.5m Kuantum Jeofizik Radar</span>
            </div>

            {/* Subsurface Stratum Visualizer */}
            <div className="absolute inset-0 top-10 flex flex-col justify-end opacity-40 pointer-events-none">
              <div className="h-12 bg-amber-900/30 border-t border-amber-500/20 flex items-center justify-center text-[10px] font-mono text-amber-300">
                Formasyon 1: Alüvyon Toprak Katmanı (0m - 50m)
              </div>
              <div className="h-16 bg-amber-800/40 border-t border-amber-500/30 flex items-center justify-center text-[10px] font-mono text-amber-400 font-bold">
                Formasyon 2: Cevher Damarı & Kireçtaşı Blokları (50m - {activeDeposit.depthMeters}m)
              </div>
              <div className="h-20 bg-emerald-950/60 border-t border-emerald-500/40 flex items-center justify-center text-[11px] font-mono text-emerald-300 font-bold animate-pulse">
                ⚡ ANA REZERVE YATAK ({activeDeposit.category} DAMARI) - DERİNLİK: {activeDeposit.depthMeters}M
              </div>
            </div>

            <div className="z-10 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Sismik Hız: 4.8 km/s</span>
              <span>Anomali Yoğunluğu: %98.4 Yüksek Rezonans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
