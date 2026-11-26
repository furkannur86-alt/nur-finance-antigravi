"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

type OS = "windows" | "mac" | "linux";

const OS_INFO: Record<OS, { label: string; icon: string; ext: string; size: string }> = {
  windows: { label: "Windows",      icon: "🪟", ext: ".exe",    size: "148 MB" },
  mac:     { label: "macOS",        icon: "🍎", ext: ".dmg",    size: "162 MB" },
  linux:   { label: "Linux (DEB)",  icon: "🐧", ext: ".deb",    size: "141 MB" },
};

const FEATURE_ROWS = [
  { icon: "📊", label: "Real-Time Market Data", sub: "Level 1 & Level 2 quotes, full depth of market" },
  { icon: "📈", label: "Interactive Charts", sub: "60 FPS GPU-accelerated charts with 100+ indicators" },
  { icon: "⚡", label: "OMS / EMS Full Suite", sub: "TWAP, VWAP, ICEBERG, DOM order book simulation" },
  { icon: "🌐", label: "NUR Earth 3D Globe", sub: "Oil basins, nuclear sites, conflict hotspots, live overlays" },
  { icon: "📺", label: "NUR TV Live", sub: "24/7 institutional financial broadcast" },
  { icon: "🤖", label: "AI Quant Strategist", sub: "On-device AI signals, pair trades, backtesting" },
  { icon: "📉", label: "Risk & VaR Modeling", sub: "Portfolio risk analytics, stress testing, scenario analysis" },
  { icon: "🔒", label: "Compliance Tools", sub: "Audit logs, trade surveillance, regulatory reporting" },
];

const TIERS = [
  { label: "Retail",        price: "Free / €29–49/mo", color: "#6b7280", note: "Delayed data, basic charts" },
  { label: "Professional",  price: "€199/mo",          color: "#00d4aa", note: "Real-time data, full analytics", highlight: true },
  { label: "Institutional", price: "€999+/mo",         color: "#38bdf8", note: "Multi-seat, FIX DMA, API access" },
];

const SPECS = [
  { label: "RAM",       value: "8 GB+",  note: "16 GB recommended" },
  { label: "OS",        value: "Win 10 / macOS 12 / Ubuntu 20.04+", note: "" },
  { label: "Storage",   value: "2 GB+",  note: "SSD preferred" },
  { label: "Internet",  value: "10 Mbps+", note: "For live data feeds" },
  { label: "Display",   value: "1920×1080+", note: "Multi-monitor supported" },
];

function detectOS(): OS {
  if (typeof window === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("linux")) return "linux";
  return "windows";
}

export default function DownloadAppModal({ open, onClose }: Props) {
  const [activeOS, setActiveOS] = useState<OS>("windows");
  const [tab, setTab] = useState<"download" | "whyDesktop" | "specs">("download");
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setActiveOS(detectOS());
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFakeDownload = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!open) return null;

  const os = OS_INFO[activeOS];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(8,14,26,0.99) 0%, rgba(12,20,36,0.99) 100%)",
          border: "1px solid rgba(0,212,170,0.2)",
          boxShadow: "0 0 80px rgba(0,212,170,0.06), 0 50px 100px rgba(0,0,0,0.7)",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="relative flex items-center justify-between px-6 py-5"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,170,0.06) 0%, rgba(0,0,0,0) 60%)",
            borderBottom: "1px solid rgba(0,212,170,0.12)",
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black tracking-wide" style={{ color: "#00d4aa" }}>
                NUR FINANCE DESKTOP
              </span>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,212,170,0.15)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.3)" }}
              >
                BETA
              </span>
            </div>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              Professional-grade financial terminal for desktop
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-4">
          {(["download", "whyDesktop", "specs"] as const).map((t) => {
            const labels: Record<typeof t, string> = {
              download: "⬇  Download",
              whyDesktop: "⚡  Why Desktop?",
              specs: "🖥  Requirements",
            };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors"
                style={{
                  background: tab === t ? "rgba(0,212,170,0.12)" : "transparent",
                  color: tab === t ? "#00d4aa" : "rgba(255,255,255,0.4)",
                  border: tab === t ? "1px solid rgba(0,212,170,0.25)" : "1px solid transparent",
                }}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 pb-6" style={{ maxHeight: "calc(90vh - 180px)" }}>

          {/* ── DOWNLOAD TAB ─────────────────────────────── */}
          {tab === "download" && (
            <div className="mt-4 space-y-4">

              {/* OS picker */}
              <div className="flex gap-2">
                {(Object.entries(OS_INFO) as [OS, (typeof OS_INFO)[OS]][]).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setActiveOS(key)}
                    className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-center transition-all"
                    style={{
                      background: activeOS === key ? "rgba(0,212,170,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeOS === key ? "rgba(0,212,170,0.4)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <span className="text-xl">{info.icon}</span>
                    <span className="text-[11px] font-semibold" style={{ color: activeOS === key ? "#00d4aa" : "rgba(255,255,255,0.6)" }}>
                      {info.label}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {info.ext} · {info.size}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main download CTA */}
              <div
                className="p-5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(0,212,170,0.06), rgba(0,0,0,0))",
                  border: "1px solid rgba(0,212,170,0.18)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                      NUR Finance Desktop {os.icon} {os.label}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      v3.0 · {os.size} · Electron-based
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFakeDownload}
                  className="w-full py-3 rounded-xl text-sm font-black tracking-wide transition-all hover:scale-[1.01]"
                  style={{
                    background: copied
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "linear-gradient(135deg, #00d4aa, #00b890)",
                    color: "#020810",
                    boxShadow: "0 0 24px rgba(0,212,170,0.3)",
                  }}
                >
                  {copied
                    ? "✓ Download Link Copied (Coming Soon — Beta)"
                    : `⬇ Download for ${os.label} ${os.ext}`}
                </button>

                <p className="text-[10px] mt-2 text-center" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Beta launch Q1 2027 · Free tier available
                </p>
              </div>

              {/* What you get */}
              <div>
                <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  INCLUDED FEATURES
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {FEATURE_ROWS.map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span className="text-lg mt-0.5 shrink-0">{f.icon}</span>
                      <div>
                        <div className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{f.label}</div>
                        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{f.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing tiers */}
              <div>
                <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  TERMINAL TIERS
                </p>
                <div className="space-y-1">
                  {TIERS.map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{
                        background: t.highlight ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.025)",
                        border: t.highlight ? "1px solid rgba(0,212,170,0.3)" : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {t.highlight && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(0,212,170,0.2)", color: "#00d4aa" }}>POPULAR</span>}
                        <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>{t.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{t.note}</span>
                        <span className="text-[12px] font-bold font-mono" style={{ color: t.color }}>{t.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── WHY DESKTOP TAB ──────────────────────────── */}
          {tab === "whyDesktop" && (
            <div className="mt-4 space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)" }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: "#00d4aa" }}>
                  ⚡ Why Download Instead of Use the Browser?
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  The browser version is a live demo. The desktop app is the full product — GPU-accelerated
                  charts, native WebSocket data feeds, offline mode, system-level alerts,
                  and persistent multi-monitor layouts.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: "📈",
                    title: "GPU-Accelerated Charts",
                    body: "The desktop app renders charts using native GPU acceleration for smooth 60 FPS performance even with thousands of data points, multiple timeframes, and complex technical indicators running simultaneously.",
                    color: "#00d4aa",
                  },
                  {
                    icon: "🤖",
                    title: "Native AI Quant Engine",
                    body: "Run quantitative models locally with zero API latency. The Quant Strategist, signal generators, and backtester run significantly faster when GPU-accelerated natively vs. browser WebAssembly.",
                    color: "#a78bfa",
                  },
                  {
                    icon: "📡",
                    title: "Persistent WebSocket Feeds",
                    body: "Browser tabs go idle and lose WebSocket connections. The desktop app maintains persistent feeds from EODHD and exchange data — even when minimized. Your alerts never miss.",
                    color: "#38bdf8",
                  },
                  {
                    icon: "🖥️",
                    title: "Multi-Monitor Layouts",
                    body: "Tear off any panel into its own window and arrange across multiple monitors. Save and restore custom workspace layouts for different trading sessions — equities, FX, macro.",
                    color: "#f59e0b",
                  },
                  {
                    icon: "📴",
                    title: "Offline Mode + Local Caching",
                    body: "Full chart history, portfolio P&L, research notes, and analysis load from local cache when internet is unavailable. Perfect for travel or restricted networks.",
                    color: "#34d399",
                  },
                  {
                    icon: "🔔",
                    title: "System-Level Alerts",
                    body: "Price alerts, portfolio threshold warnings, and breaking news notifications delivered as native OS notifications — even when the terminal is minimized or in the background.",
                    color: "#e879f9",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <div className="text-[12px] font-bold mb-1" style={{ color: item.color }}>{item.title}</div>
                      <div className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SPECS TAB ────────────────────────────────── */}
          {tab === "specs" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  MINIMUM REQUIREMENTS
                </p>
                {SPECS.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</span>
                    <div className="text-right">
                      <div className="text-[12px] font-bold font-mono" style={{ color: "#00d4aa" }}>{s.value}</div>
                      {s.note && <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{s.note}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)" }}>
                <p className="text-[12px] font-bold" style={{ color: "#00d4aa" }}>Recommended for Best Experience</p>
                <ul className="text-[11px] space-y-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <li>• Dedicated GPU (NVIDIA/AMD) for smooth 60 FPS chart rendering</li>
                  <li>• 16 GB RAM for running multiple analysis panels simultaneously</li>
                  <li>• Multiple monitors for professional trading layouts</li>
                  <li>• Stable broadband for real-time data streaming</li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa" }} />
            <span className="text-[9px] font-mono" style={{ color: "rgba(0,212,170,0.6)" }}>
              NUR Finance Desktop · Beta Q1 2027
            </span>
          </div>
          <button
            onClick={() => { setTab("download"); }}
            className="px-4 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
            style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.2)" }}
          >
            ⬇ Get Desktop App
          </button>
        </div>
      </div>
    </div>
  );
}
