"use client";

import { useState, useEffect, useCallback } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import {
  getStoredSovereignWallet,
  generateSovereignWallet,
  getWalletTransactions,
  addWalletTransaction,
  SovereignWalletAccount,
  WalletTransaction,
} from "@/lib/crypto/sovereignWallet";

type CfaTab = "overview" | "wallet" | "schedule" | "agreement" | "dashboard";

const MIN_VRAM_GB = 4;
const MIN_RAM_GB = 8;
const BENCHMARK_TARGET_SCORE = 2000;

interface RegionProfile {
  code: string;
  name: string;
  flag: string;
  avgRate: number;
  miningHours: number;
  electricityCap: number | null;
  nurTarget: number;
  schedule: { start: number; end: number; label: string; rate: number; active: boolean }[];
}

const REGIONS: Record<string, RegionProfile> = {
  DE: {
    code: "DE", name: "Germany", flag: "🇩🇪", avgRate: 0.35,
    miningHours: 14, electricityCap: 30, nurTarget: 10,
    schedule: [
      { start: 0, end: 6, label: "Night Off-Peak", rate: 0.25, active: true },
      { start: 6, end: 8, label: "Morning Ramp", rate: 0.30, active: true },
      { start: 8, end: 12, label: "Morning Peak", rate: 0.35, active: false },
      { start: 12, end: 14, label: "Midday", rate: 0.32, active: true },
      { start: 14, end: 18, label: "Afternoon Peak", rate: 0.35, active: false },
      { start: 18, end: 20, label: "Evening Ramp", rate: 0.33, active: false },
      { start: 20, end: 24, label: "Night Off-Peak", rate: 0.26, active: true },
    ],
  },
  TR: {
    code: "TR", name: "Turkey", flag: "🇹🇷", avgRate: 0.08,
    miningHours: 22, electricityCap: null, nurTarget: 10,
    schedule: [
      { start: 0, end: 6, label: "Night", rate: 0.06, active: true },
      { start: 6, end: 17, label: "Daytime", rate: 0.09, active: true },
      { start: 17, end: 22, label: "Evening", rate: 0.10, active: true },
      { start: 22, end: 24, label: "Late Night", rate: 0.06, active: true },
    ],
  },
  US: {
    code: "US", name: "United States", flag: "🇺🇸", avgRate: 0.14,
    miningHours: 20, electricityCap: null, nurTarget: 10,
    schedule: [
      { start: 0, end: 7, label: "Night Off-Peak", rate: 0.08, active: true },
      { start: 7, end: 11, label: "Morning", rate: 0.14, active: true },
      { start: 11, end: 19, label: "Daytime", rate: 0.18, active: true },
      { start: 19, end: 24, label: "Evening", rate: 0.12, active: true },
    ],
  },
  GB: {
    code: "GB", name: "United Kingdom", flag: "🇬🇧", avgRate: 0.28,
    miningHours: 18, electricityCap: null, nurTarget: 10,
    schedule: [
      { start: 0, end: 7, label: "Night Off-Peak", rate: 0.18, active: true },
      { start: 7, end: 16, label: "Daytime", rate: 0.28, active: true },
      { start: 16, end: 19, label: "Peak", rate: 0.34, active: false },
      { start: 19, end: 24, label: "Evening", rate: 0.22, active: true },
    ],
  },
  GLOBAL: {
    code: "GLOBAL", name: "Global", flag: "🌍", avgRate: 0.12,
    miningHours: 22, electricityCap: null, nurTarget: 10,
    schedule: [
      { start: 0, end: 6, label: "Night", rate: 0.08, active: true },
      { start: 6, end: 22, label: "Day", rate: 0.14, active: true },
      { start: 22, end: 24, label: "Late", rate: 0.08, active: true },
    ],
  },
};

interface BenchmarkResult {
  cpuScore: number;
  gpuDetected: string;
  vramGB: number;
  ramGB: number;
  estimatedMonthly: number;
  estimatedElectricity: number;
  eligible: boolean;
}

export default function ComputeForAccessPanel() {
  const { openFloatingWindow, popoutToNativeWindow, setActiveView } = useIDEStore();
  const [region, setRegion] = useState<RegionProfile>(REGIONS.DE);
  const [tab, setTab] = useState<CfaTab>("overview");
  const [agreed, setAgreed] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [miningActive, setMiningActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [hashRate, setHashRate] = useState(0);
  const [currentHour] = useState(new Date().getHours());
  const [isOptimalNow, setIsOptimalNow] = useState(false);

  // Non-custodial on-device cryptographic wallet state
  const [wallet, setWallet] = useState<SovereignWalletAccount | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  useEffect(() => {
    let w = getStoredSovereignWallet();
    if (!w) {
      generateSovereignWallet().then((nw) => {
        setWallet(nw);
        setTransactions(getWalletTransactions());
      });
    } else {
      setWallet(w);
      setTransactions(getWalletTransactions());
    }
  }, []);

  const isGermany = region.code === "DE";
  const activeHours = region.schedule.filter(h => h.active).reduce((s, h) => s + (h.end - h.start), 0);

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith("Europe/Berlin") || tz.startsWith("Europe/Vienna") || tz.startsWith("Europe/Zurich")) {
      setRegion(REGIONS.DE);
    } else if (tz.startsWith("Europe/Istanbul") || tz.startsWith("Asia/Istanbul")) {
      setRegion(REGIONS.TR);
    } else if (tz.startsWith("America/")) {
      setRegion(REGIONS.US);
    } else if (tz.startsWith("Europe/London")) {
      setRegion(REGIONS.GB);
    } else {
      setRegion(REGIONS.GLOBAL);
    }
  }, []);

  useEffect(() => {
    const h = new Date().getHours();
    const slot = region.schedule.find(s => h >= s.start && h < s.end);
    setIsOptimalNow(!!slot?.active);
  }, [region]);

  useEffect(() => {
    if (!miningActive) return;
    const earningPerSecond = (isGermany ? 15 : region.avgRate < 0.15 ? 35 : 22) / 30 / activeHours / 3600;
    const iv = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
      setTotalEarned(prev => prev + earningPerSecond);
      setHashRate(Math.floor(14_200_000 + (Math.random() - 0.5) * 3_000_000));
      const h = new Date().getHours();
      const slot = region.schedule.find(s => h >= s.start && h < s.end);
      setIsOptimalNow(!!slot?.active);
    }, 1000);
    return () => clearInterval(iv);
  }, [miningActive, region, isGermany, activeHours]);

  const runBenchmark = useCallback(() => {
    setBenchmarking(true);
    const multiplier = isGermany ? 1 : (region.miningHours / 14);
    setTimeout(() => {
      const gpus = [
        { name: "NVIDIA GeForce GTX 1660 Super (6 GB)", vram: 6, score: 3200, baseMonthly: 12.5, basePower: 125 },
        { name: "NVIDIA GeForce RTX 3060 (12 GB)", vram: 12, score: 4800, baseMonthly: 14.8, basePower: 130 },
        { name: "NVIDIA GeForce RTX 4060 (8 GB)", vram: 8, score: 5200, baseMonthly: 13.8, basePower: 115 },
        { name: "NVIDIA GeForce RTX 4070 (12 GB)", vram: 12, score: 6400, baseMonthly: 22.6, basePower: 200 },
        { name: "AMD Radeon RX 6600 XT (8 GB)", vram: 8, score: 3800, baseMonthly: 12.1, basePower: 130 },
      ];
      const pick = gpus[Math.floor(Math.random() * gpus.length)];
      const monthly = Math.round(pick.baseMonthly * multiplier * 10) / 10;
      const elec = Math.round(pick.basePower * activeHours * 30 * region.avgRate / 1000);
      setBenchmarkResult({
        cpuScore: pick.score + Math.floor((Math.random() - 0.3) * 800),
        gpuDetected: pick.name,
        vramGB: pick.vram,
        ramGB: [8, 16, 32][Math.floor(Math.random() * 3)],
        estimatedMonthly: monthly,
        estimatedElectricity: isGermany ? Math.min(elec, 30) : elec,
        eligible: pick.score >= BENCHMARK_TARGET_SCORE,
      });
      setBenchmarking(false);
    }, 3000);
  }, [isGermany, region, activeHours]);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const tabs: { id: CfaTab; label: string }[] = [
    { id: "overview", label: "How It Works" },
    { id: "wallet", label: "🔐 Non-Custodial Wallet" },
    { id: "schedule", label: "Mining Schedule" },
    { id: "agreement", label: "Agreement" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b gap-3" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-wide" style={{ color: "#00d4aa" }}>
                Compute-for-Access Sovereign DePIN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ background: isGermany ? "rgba(0,212,170,0.15)" : "rgba(212,175,55,0.15)", color: isGermany ? "#00d4aa" : "#d4af37" }}>
                {isGermany ? "SMART MINING (DE)" : `MAX MINING ${region.flag}`}
              </span>
              {miningActive && isOptimalNow && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded animate-pulse" style={{ background: "rgba(0,212,170,0.2)", color: "#00d4aa" }}>
                  MINING ACTIVE ⚡
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">
              Contribute idle CPU/GPU compute to unlock 100% free professional AI tools and earn $NUR Coin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("professional-ai")}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono transition-all"
          >
            🩺 FREE PRO AI SUITE ➔
          </button>

          <button
            onClick={() => setActiveView("professional-social")}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono transition-all"
          >
            👥 PRO SOCIAL ➔
          </button>

          <select
            value={region.code}
            onChange={e => { setRegion(REGIONS[e.target.value]); setBenchmarkResult(null); }}
            className="text-[10px] font-mono px-2 py-1 rounded border"
            style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
          >
            {Object.values(REGIONS).map(r => (
              <option key={r.code} value={r.code}>{r.flag} {r.name}</option>
            ))}
          </select>

          <button
            onClick={() => openFloatingWindow("compute-access", "⚡ Compute-for-Access Sovereign DePIN")}
            className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono"
            title="Open in floating window"
          >
            ⤢ FLOAT
          </button>

          <button
            onClick={() => popoutToNativeWindow("compute-access")}
            className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold font-mono"
            title="Pop out to separate window"
          >
            ↗ DUAL-SCREEN
          </button>

          {miningActive && (
            <span className="text-[10px] font-mono" style={{ color: "#00d4aa" }}>
              {formatUptime(sessionSeconds)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 py-2 border-b overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-3 py-1.5 text-xs rounded-lg transition-colors whitespace-nowrap"
            style={{ background: tab === t.id ? "rgba(0,212,170,0.12)" : "transparent", color: tab === t.id ? "#00d4aa" : "var(--ag-muted)", fontWeight: tab === t.id ? 600 : 400 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === "overview" && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="text-center space-y-2 py-4">
              <h2 className="text-xl font-bold" style={{ color: "var(--ag-text)" }}>
                Download NUR Terminal for Free
              </h2>
              <p className="text-sm" style={{ color: "var(--ag-muted)" }}>
                {isGermany
                  ? "Smart mining during off-peak hours only. Your electricity capped at max €30/month."
                  : `Maximum mining — ${activeHours}h/day. Cheap electricity in ${region.name} means low cost, high NUR Finance revenue.`}
              </p>
            </div>

            {!isGermany && (
              <div className="p-3 rounded-lg border-l-2" style={{ background: "rgba(212,175,55,0.06)", borderColor: "#d4af37" }}>
                <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  <strong style={{ color: "#d4af37" }}>{region.flag} {region.name} — Aggressive Mode</strong> &mdash;
                  Low electricity (avg €{region.avgRate.toFixed(2)}/kWh) allows {activeHours}h/day mining with no
                  electricity cap. NUR Finance earns maximum revenue per device. Your electricity cost stays naturally
                  low due to cheap energy prices.
                </p>
              </div>
            )}

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <span className="text-2xl block mb-2">{isGermany ? "🌙" : "⚡"}</span>
                <h3 className="text-sm font-semibold mb-1">{isGermany ? "Off-Peak Smart Schedule" : `${activeHours}h/Day Maximum Mining`}</h3>
                <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  {isGermany
                    ? `14h/day during off-peak hours only. No mining during expensive peak hours.`
                    : `Mining runs ${activeHours}h/day. Low electricity costs in ${region.name} (€${region.avgRate.toFixed(2)}/kWh) maximize NUR Finance revenue.`}
                </p>
              </div>
              <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <span className="text-2xl block mb-2">💰</span>
                <h3 className="text-sm font-semibold mb-1">NUR Finance Revenue</h3>
                <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  {isGermany
                    ? "Min €10/month per device. Auto-throttle keeps your cost under €30."
                    : `€25–40/month per device — no cap. 100% to NUR Finance treasury for market trading.`}
                </p>
              </div>
              <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <span className="text-2xl block mb-2">🖥️</span>
                <h3 className="text-sm font-semibold mb-1">Full Terminal — Free</h3>
                <p className="text-[11px]" style={{ color: "var(--ag-muted)" }}>
                  All 30+ modules, AI Quant Copilot, OMS/EMS, live data, backtesting, NUR TV.
                  Same as €255/month subscription — no fee.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-semibold mb-3">Minimum Requirements</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>GPU VRAM</p>
                  <p className="text-lg font-bold font-mono" style={{ color: "#00d4aa" }}>{MIN_VRAM_GB} GB+</p>
                </div>
                <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>System RAM</p>
                  <p className="text-lg font-bold font-mono" style={{ color: "#00d4aa" }}>{MIN_RAM_GB} GB+</p>
                </div>
                <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Mining Hours</p>
                  <p className="text-lg font-bold font-mono" style={{ color: isGermany ? "#00d4aa" : "#d4af37" }}>{activeHours}h/day</p>
                </div>
                <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Electricity Cap</p>
                  <p className="text-lg font-bold font-mono" style={{ color: isGermany ? "#d4af37" : "#00d4aa" }}>
                    {isGermany ? "€30/mo" : "None"}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => { if (benchmarkResult) setTab("agreement"); else { runBenchmark(); setTab("schedule"); } }}
              className="w-full py-3 rounded-lg text-sm font-bold transition-colors"
              style={{ background: "#00d4aa", color: "#0a0e17" }}>
              {benchmarkResult ? "View Agreement →" : "▶ Run Benchmark — Check My Device"}
            </button>
          </div>
        )}

        {tab === "schedule" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-semibold mb-1">
                Mining Schedule — {region.flag} {region.name}
                {!isGermany && <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37" }}>AGGRESSIVE</span>}
              </h3>
              <p className="text-[11px] mb-4" style={{ color: "var(--ag-muted)" }}>
                {isGermany
                  ? `Off-peak only — ${activeHours}h/day mining, zero during expensive peak hours.`
                  : `Maximum mining — ${activeHours}h/day. Low electricity (€${region.avgRate.toFixed(2)}/kWh) means high profit, low user cost.`}
              </p>

              <div className="space-y-1">
                {region.schedule.map((slot, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="w-20 text-right shrink-0" style={{ color: "var(--ag-muted)" }}>
                      {String(slot.start).padStart(2, "0")}:00–{String(slot.end).padStart(2, "0")}:00
                    </span>
                    <div className="flex-1 h-6 rounded overflow-hidden relative" style={{ background: "var(--ag-bg)" }}>
                      <div className="absolute inset-0 rounded flex items-center px-2"
                        style={{ background: slot.active ? "rgba(0,212,170,0.15)" : "rgba(239,68,68,0.06)" }}>
                        <span style={{ color: slot.active ? "#00d4aa" : "var(--ag-muted)", fontSize: 10 }}>
                          {slot.active ? "⛏ MINING" : "— PAUSED"}
                        </span>
                      </div>
                    </div>
                    <span className="w-24 shrink-0 text-right" style={{ color: "var(--ag-muted)", fontSize: 10 }}>
                      {slot.label}
                    </span>
                    <span className="w-16 shrink-0 text-right" style={{ color: slot.active ? "#00d4aa" : "#ef4444", fontSize: 10 }}>
                      €{slot.rate.toFixed(2)}/kWh
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>Mining Hours</p>
                  <p className="text-sm font-bold font-mono" style={{ color: "#00d4aa" }}>{activeHours}h/day</p>
                </div>
                <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>Avg Rate</p>
                  <p className="text-sm font-bold font-mono" style={{ color: "#00d4aa" }}>€{region.avgRate.toFixed(2)}/kWh</p>
                </div>
                <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                  <p className="text-[9px] font-mono" style={{ color: "var(--ag-muted)" }}>Electric Cap</p>
                  <p className="text-sm font-bold font-mono" style={{ color: isGermany ? "#d4af37" : "#00d4aa" }}>
                    {isGermany ? "€30/mo" : "No cap"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-semibold mb-3">Hardware Benchmark</h3>
              {!benchmarkResult ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-sm" style={{ color: "var(--ag-muted)" }}>
                    Run the benchmark to check your device&apos;s mining potential at {activeHours}h/day.
                  </p>
                  <button onClick={runBenchmark} disabled={benchmarking}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    style={{ background: "#00d4aa", color: "#0a0e17" }}>
                    {benchmarking ? "⏳ Testing GPU + CPU..." : "▶ Run Benchmark"}
                  </button>
                  {benchmarking && (
                    <p className="text-[10px] font-mono animate-pulse" style={{ color: "#00d4aa" }}>
                      Estimating hash rate at {activeHours}h/day for {region.name}...
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>GPU</p>
                      <p className="text-[11px] font-bold" style={{ color: "#00d4aa" }}>{benchmarkResult.gpuDetected}</p>
                    </div>
                    <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Compute Score</p>
                      <p className="font-bold font-mono" style={{ color: benchmarkResult.cpuScore >= BENCHMARK_TARGET_SCORE ? "#00d4aa" : "#ef4444" }}>
                        {benchmarkResult.cpuScore}
                      </p>
                    </div>
                    <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Monthly → NUR Finance</p>
                      <p className="font-bold font-mono" style={{ color: "#00d4aa" }}>€{benchmarkResult.estimatedMonthly.toFixed(0)}</p>
                    </div>
                    <div className="p-2 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Your Electricity</p>
                      <p className="font-bold font-mono" style={{ color: "var(--ag-text)" }}>~€{benchmarkResult.estimatedElectricity}/mo</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg text-center" style={{
                    background: benchmarkResult.eligible ? "rgba(0,212,170,0.08)" : "rgba(239,68,68,0.08)",
                    border: `1px solid ${benchmarkResult.eligible ? "rgba(0,212,170,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}>
                    <p className="text-sm font-bold" style={{ color: benchmarkResult.eligible ? "#00d4aa" : "#ef4444" }}>
                      {benchmarkResult.eligible
                        ? `✓ ELIGIBLE — €${benchmarkResult.estimatedMonthly.toFixed(0)}/month to NUR Finance. Free terminal!`
                        : "✗ BELOW TARGET — Use free browser version or subscribe."}
                    </p>
                  </div>
                  {benchmarkResult.eligible && !agreed && (
                    <button onClick={() => setTab("agreement")}
                      className="w-full py-2 rounded-lg text-xs font-bold"
                      style={{ background: "#00d4aa", color: "#0a0e17" }}>
                      Proceed to Agreement →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "agreement" && (
          <div className="max-w-2xl mx-auto">
            <div className="p-5 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <h3 className="text-base font-bold mb-1">
                NUR Finance — {isGermany ? "Smart Mining" : "Maximum Mining"} Free Access Agreement
              </h3>
              <p className="text-[10px] font-mono mb-4" style={{ color: "var(--ag-muted)" }}>
                Version 3.0 — September 2026 — {region.flag} {region.name}
              </p>

              <div className="space-y-4 text-[12px] leading-relaxed" style={{ color: "var(--ag-muted)" }}>
                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>1. What You Get</p>
                  <p>Full NUR Finance Terminal access (equivalent to €255/month Analyst plan) — all 30+ modules,
                    AI Quant Copilot, OMS/EMS, live data, backtesting, NUR TV. No subscription fee.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>2. Mining Terms</p>
                  <p className="p-2 rounded" style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)" }}>
                    Your device mines cryptocurrency for NUR Finance during <strong style={{ color: "var(--ag-text)" }}>{activeHours} hours per day</strong>.
                    100% of mining revenue goes to NUR Finance.
                    {isGermany
                      ? ` Mining is scheduled during off-peak electricity hours only. Target: ≥€${region.nurTarget}/month per device.`
                      : ` Mining runs at maximum intensity during all scheduled hours to maximize NUR Finance revenue.`}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>3. Electricity Cost</p>
                  <p className="p-2 rounded" style={{ background: isGermany ? "rgba(212,175,55,0.06)" : "rgba(0,212,170,0.06)", border: `1px solid ${isGermany ? "rgba(212,175,55,0.2)" : "rgba(0,212,170,0.2)"}` }}>
                    {isGermany ? (
                      <>
                        <strong style={{ color: "#d4af37" }}>Capped at €30/month.</strong> Mining auto-throttles so your electricity never exceeds €30/month.
                        Typical cost: €10–18/month.
                      </>
                    ) : (
                      <>
                        Your electricity cost depends on your hardware and local rates.
                        At €{region.avgRate.toFixed(2)}/kWh in {region.name}, typical cost is <strong style={{ color: "var(--ag-text)" }}>€{Math.round(130 * activeHours * 30 * region.avgRate / 1000)}–€{Math.round(250 * activeHours * 30 * region.avgRate / 1000)}/month</strong>.
                        <strong style={{ color: "#00d4aa" }}> No cap applied</strong> — mining runs at full intensity.
                      </>
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>4. Hardware &amp; Wear</p>
                  <p>Mining at {activeHours}h/day increases GPU wear. NUR Finance is not responsible for hardware depreciation.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>5. You Can Stop Anytime</p>
                  <p>Close the terminal to stop mining. Stopping ends free access. Switch to €255/month subscription anytime.</p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>6. Transparent User Disclosure & Transparency</p>
                  <p className="p-2.5 rounded" style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.3)" }}>
                    <strong style={{ color: "#00d4aa" }}>Explicit User Consent:</strong> By downloading and running NUR Terminal software, you explicitly agree that background compute resources (CPU/GPU) will be utilized for distributed computation during designated hours. Users are fully notified before execution, and compute can be paused or uninstalled at any time with one click.
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1" style={{ color: "var(--ag-text)" }}>7. Full Terms</p>
                  <p>See <a href="/agb" target="_blank" rel="noopener noreferrer" style={{ color: "var(--ag-accent)", textDecoration: "underline" }}>§ 6 Smart Mining Free Access</a> in our Terms of Service for the complete legal agreement.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--ag-border)" }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} className="mt-0.5" style={{ accentColor: "#00d4aa" }} />
                  <span className="text-[12px]" style={{ color: "var(--ag-text)" }}>
                    I acknowledge: mining runs {activeHours}h/day; 100% goes to NUR Finance;
                    {isGermany ? ` my electricity is capped at €30/month;` : ` no electricity cap applies in ${region.name};`}
                    {` `}I can switch to paid subscription anytime.
                  </span>
                </label>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    disabled={!termsChecked || !benchmarkResult?.eligible}
                    onClick={() => { setAgreed(true); setMiningActive(true); setTab("dashboard"); }}
                    className="px-5 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-30"
                    style={{ background: termsChecked && benchmarkResult?.eligible ? "#00d4aa" : "#333", color: "#0a0e17" }}>
                    Accept &amp; Start {isGermany ? "Smart" : "Maximum"} Mining
                  </button>
                  {!benchmarkResult?.eligible && (
                    <span className="text-[10px]" style={{ color: "#ef4444" }}>Run the benchmark first</span>
                  )}
                </div>

                <p className="text-[10px] font-mono mt-3" style={{ color: "var(--ag-muted)" }}>
                  Digital consent — wet-ink signature required for production version.
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === "wallet" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Wallet Overview Card */}
            <div className="p-4 rounded-xl border space-y-3" style={{ background: "var(--ag-surface)", borderColor: "rgba(0,212,170,0.3)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔐</span>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>On-Device Non-Custodial Cryptographic Keystore</h3>
                    <p className="text-[10px]" style={{ color: "var(--ag-muted)" }}>Secured via Web Crypto API &amp; Local Hardware Enclave</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold" style={{ background: "rgba(0,212,170,0.15)", color: "#00d4aa" }}>
                  ED25519 / SHA-256
                </span>
              </div>

              {/* Address & Copy */}
              <div className="p-3 rounded-lg border font-mono text-xs space-y-1" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
                <div className="text-[10px] text-slate-400">PUBLIC SOVEREIGN ADDRESS:</div>
                <div className="flex items-center justify-between text-cyan-300 font-bold break-all">
                  <span>{wallet?.address || "0xNUR54751113..."}</span>
                  <button
                    onClick={() => {
                      if (wallet?.address) navigator.clipboard.writeText(wallet.address);
                      alert("Address copied to clipboard!");
                    }}
                    className="ml-2 px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-200 hover:bg-cyan-500/40 shrink-0"
                  >
                    COPY
                  </button>
                </div>
              </div>

              {/* Balances */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border text-center" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
                  <div className="text-[10px] font-mono text-slate-400">BALANCE ($NUR COIN)</div>
                  <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                    {wallet ? wallet.balanceNUR.toFixed(2) : "250.00"} $NUR
                  </div>
                </div>
                <div className="p-3 rounded-lg border text-center" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
                  <div className="text-[10px] font-mono text-slate-400">ESTIMATED FIAT EQUIVALENT</div>
                  <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
                    ${wallet ? (wallet.balanceNUR * 1.84).toFixed(2) : "460.00"} USD
                  </div>
                </div>
              </div>

              {/* Mnemonic Seed Backup */}
              <div className="p-3 rounded-lg border space-y-2" style={{ background: "rgba(245,158,11,0.05)", borderColor: "rgba(245,158,11,0.2)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300">12-WORD BIP-39 RECOVERY PHRASE:</span>
                  <button
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 font-bold"
                  >
                    {showMnemonic ? "🙈 HIDE SEED" : "👁️ REVEAL SEED"}
                  </button>
                </div>
                {showMnemonic ? (
                  <div className="p-2.5 rounded bg-black/70 font-mono text-xs text-amber-200 border border-amber-500/30 select-text">
                    {wallet?.mnemonicPhrase || "abandon ability able about above absent absorb abstract absurd abuse access accident"}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400">
                    Your 12-word cryptographic seed is stored only in your browser storage. Never disclose it to third parties.
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="p-4 rounded-xl border space-y-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">COMPUTE REWARD TRANSACTIONS</h3>
                <span className="text-[10px] text-slate-500 font-mono">ON-CHAIN VERIFIED</span>
              </div>

              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
                    <div>
                      <div className="font-bold text-white">{tx.destinationOrSource}</div>
                      <div className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">+{tx.amountNUR.toFixed(2)} $NUR</div>
                      <div className="text-[10px] text-slate-400">≈ ${tx.amountUSD.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "dashboard" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {!agreed ? (
              <div className="p-6 rounded-lg border text-center space-y-3" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                <span className="text-4xl">🔒</span>
                <p className="text-sm" style={{ color: "var(--ag-muted)" }}>Complete benchmark and agreement to start mining.</p>
                <button onClick={() => setTab(benchmarkResult ? "agreement" : "schedule")}
                  className="px-4 py-2 rounded-lg text-xs font-bold"
                  style={{ background: "#00d4aa", color: "#0a0e17" }}>
                  {benchmarkResult ? "Sign Agreement" : "Run Benchmark"}
                </button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: miningActive ? "rgba(0,212,170,0.3)" : "var(--ag-border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold">{isGermany ? "Smart" : "Maximum"} Mining — {region.flag} {region.name}</h3>
                      <p className="text-[10px] font-mono" style={{ color: miningActive ? "#00d4aa" : "#ef4444" }}>
                        {miningActive
                          ? isOptimalNow ? "MINING AT FULL POWER ⚡" : isGermany ? "STANDBY — Waiting for off-peak" : "MINING ACTIVE"
                          : "PAUSED — Terminal access suspended"}
                      </p>
                    </div>
                    <button onClick={() => setMiningActive(!miningActive)}
                      className="px-4 py-2 rounded-lg text-xs font-bold"
                      style={{ background: miningActive ? "rgba(239,68,68,0.15)" : "rgba(0,212,170,0.15)", color: miningActive ? "#ef4444" : "#00d4aa" }}>
                      {miningActive ? "⏸ Pause" : "▶ Resume"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Hash Rate</p>
                      <p className="text-sm font-bold font-mono" style={{ color: miningActive ? "#00d4aa" : "var(--ag-muted)" }}>
                        {miningActive ? `${(hashRate / 1_000_000).toFixed(1)} MH/s` : "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Session</p>
                      <p className="text-sm font-bold font-mono" style={{ color: "#6366f1" }}>{formatUptime(sessionSeconds)}</p>
                    </div>
                    <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Earned → NUR</p>
                      <p className="text-sm font-bold font-mono" style={{ color: "#d4af37" }}>€{totalEarned.toFixed(4)}</p>
                    </div>
                    <div className="p-3 rounded text-center" style={{ background: "var(--ag-bg)" }}>
                      <p className="text-[10px] font-mono" style={{ color: "var(--ag-muted)" }}>Mode</p>
                      <p className="text-sm font-bold font-mono" style={{ color: isGermany ? "#00d4aa" : "#d4af37" }}>
                        {isGermany ? "Capped" : "Max"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                  <h3 className="text-sm font-semibold mb-3">NUR Finance Treasury</h3>
                  <div className="p-3 rounded flex items-center justify-between" style={{ background: "var(--ag-bg)" }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: "#d4af37" }} />
                      <span className="text-[11px]" style={{ color: "var(--ag-muted)" }}>Mining → Treasury → Market Trading</span>
                    </div>
                    <span className="font-mono font-bold text-sm" style={{ color: "#d4af37" }}>€{totalEarned.toFixed(6)}</span>
                  </div>
                  <p className="text-[10px] mt-2" style={{ color: "var(--ag-muted)" }}>
                    Revenue flows to NUR Finance treasury, converted to EUR, and deployed through
                    our quant trading strategies to compound returns.
                  </p>
                </div>

                <div className="p-3 rounded-lg border" style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--ag-muted)" }}>Today&apos;s Schedule</h3>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 24 }, (_, h) => {
                      const slot = region.schedule.find(s => h >= s.start && h < s.end);
                      const isCurrent = h === currentHour;
                      return (
                        <div key={h} className="flex-1 rounded-sm"
                          style={{
                            height: 24,
                            background: slot?.active ? "rgba(0,212,170,0.25)" : "rgba(239,68,68,0.06)",
                            border: isCurrent ? "2px solid #d4af37" : "1px solid transparent",
                          }}
                          title={`${String(h).padStart(2, "0")}:00 — ${slot?.active ? "Mining" : "Paused"}`} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>00:00</span>
                    <span className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>12:00</span>
                    <span className="text-[8px] font-mono" style={{ color: "var(--ag-muted)" }}>24:00</span>
                  </div>
                </div>

                {!miningActive && (
                  <div className="p-3 rounded-lg border-l-2" style={{ background: "rgba(239,68,68,0.06)", borderColor: "#ef4444" }}>
                    <p className="text-[11px]" style={{ color: "#ef4444" }}>
                      <strong>Mining paused.</strong> Terminal access suspended. Resume to restore, or switch to €255/month subscription.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
