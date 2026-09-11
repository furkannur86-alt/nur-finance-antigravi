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
  { icon: "📊", label: "All 38 Modules", sub: "Dashboard, OMS/EMS, Quant Copilot, NUR TV + more" },
  { icon: "🤖", label: "AI Quant Strategist", sub: "On-device AI signals, WISH Framework, pair trades" },
  { icon: "⚡", label: "OMS / EMS Full Suite", sub: "TWAP, VWAP, ICEBERG, DOM order book simulation" },
  { icon: "🌐", label: "NUR Earth 3D Globe", sub: "Oil basins, nuclear sites, conflict hotspots, live overlays" },
  { icon: "📺", label: "NUR TV Live",  sub: "24/7 financial broadcast channel" },
  { icon: "💎", label: "Institutional Suite", sub: "7-pillar sovereign intelligence (€7.2K/mo value)" },
  { icon: "⛏️", label: "Resource Intelligence", sub: "Oil, gold, critical minerals (€27K/mo value)" },
  { icon: "🔐", label: "Web3 Wallet Gateway", sub: "Multi-chain wallet, $NUR coin ecosystem" },
];

const TIERS = [
  { label: "Browser Free",    price: "Free",  color: "#6b7280", note: "Limited features, watermarked" },
  { label: "Analyst",         price: "€255/mo", color: "#00d4aa", note: "Full terminal, no mining" },
  { label: "Desktop Free",    price: "€0",    color: "#f59e0b", note: "Full terminal — via compute sharing", highlight: true },
  { label: "NUR Finance R",   price: "~€8.3K/mo", color: "#38bdf8", note: "Reuters-tier sovereign" },
  { label: "NUR Finance B",   price: "~€8.3K/mo", color: "#a78bfa", note: "Bloomberg-tier sovereign" },
];

const SPECS = [
  { label: "GPU VRAM",  value: "4 GB+",  note: "NVIDIA GTX 1060 or better" },
  { label: "RAM",       value: "8 GB+",  note: "16 GB recommended" },
  { label: "OS",        value: "Win 10 / macOS 12 / Ubuntu 20.04+", note: "" },
  { label: "Storage",   value: "2 GB+",  note: "SSD preferred" },
  { label: "Internet",  value: "10 Mbps+", note: "For live data feeds" },
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
                style={{ background: "rgba(245,158,11,0.15)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)" }}
              >
                FREE VIA COMPUTE
              </span>
            </div>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.45)" }}>
              Full Bloomberg-tier terminal — free when your GPU powers our network
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
                  <div
                    className="text-[11px] px-3 py-1 rounded-full font-bold"
                    style={{ background: "rgba(0,212,170,0.12)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.25)" }}
                  >
                    FREE
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
                  Requires explicit mining consent during first launch · Beta launch Q1 2027
                </p>
              </div>

              {/* What you get */}
              <div>
                <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  INCLUDED — ALL FREE VIA COMPUTE SHARING
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

              {/* Pricing comparison */}
              <div>
                <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                  VALUE COMPARISON
                </p>
                <div className="space-y-1">
                  {TIERS.map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{
                        background: t.highlight ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.025)",
                        border: t.highlight ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {t.highlight && <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>YOU</span>}
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
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <h3 className="text-sm font-bold mb-2" style={{ color: "#f59e0b" }}>
                  ⚡ Why Download Instead of Use the Browser?
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  The browser version is a live demo. The desktop app is the real product — GPU-accelerated
                  AI inference, native WebSocket data feeds, offline mode, system-level notifications,
                  and background compute sharing that keeps the terminal completely free.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    icon: "🖥️",
                    title: "GPU Compute Sharing — Your Free Pass",
                    body: "When your laptop is idle, the NUR Desktop app uses a small slice of your GPU to run distributed financial model inference for NUR Finance's trading algorithms. You share compute → you get the full terminal, forever, for free. Non-aggressive mode by default — fan stays quiet.",
                    color: "#00d4aa",
                  },
                  {
                    icon: "🪙",
                    title: "$NUR Coin Earnings (Coming)",
                    body: "Each compute-sharing session earns $NUR tokens credited to your in-app wallet. Once our smart contract deploys on Polygon (low gas, ~$0.001/tx), earnings flow automatically. KYC users can withdraw to bank accounts via SEPA/SWIFT.",
                    color: "#f59e0b",
                  },
                  {
                    icon: "🤖",
                    title: "Native AI — No Browser Sandbox",
                    body: "The desktop app can run quantitative models locally using your GPU. Zero API latency. The Quant Copilot, WISH Framework signals, and backtester run significantly faster when GPU-accelerated natively vs. browser WebAssembly.",
                    color: "#a78bfa",
                  },
                  {
                    icon: "📡",
                    title: "WebSocket Live Data — Always On",
                    body: "Browser tabs go idle and lose WebSocket connections. The desktop app maintains persistent feeds from EODHD, exchange data, and NUR's proprietary macro feeds — even when minimized. Your alerts never miss.",
                    color: "#38bdf8",
                  },
                  {
                    icon: "🔐",
                    title: "Native Wallet Integration",
                    body: "Interact with your hardware wallet (Ledger, Trezor) directly — no browser extension required. The desktop app bridges EIP-1193 natively, giving you full Web3 access without MetaMask overhead.",
                    color: "#e879f9",
                  },
                  {
                    icon: "📴",
                    title: "Offline Mode + Local Caching",
                    body: "Full chart history, portfolio P&L, encyclopedia, and research notes load from local cache when internet is unavailable. Perfect for travel or restricted networks.",
                    color: "#34d399",
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

              <div
                className="p-4 rounded-xl text-center"
                style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)" }}
              >
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Compute sharing is always <strong style={{ color: "#00d4aa" }}>explicit</strong> — shown during first launch,
                  visible in dashboard, pauseable anytime. Mining 100% powers NUR Finance&apos;s treasury and trading.
                </p>
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

              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                  GPU HASHRATE ESTIMATES (MONTHLY → NUR FINANCE)
                </p>
                {[
                  { gpu: "GTX 1060 (6GB)",      rate: "18 MH/s", monthly: "~€8–12/mo" },
                  { gpu: "RTX 3060 (12GB)",     rate: "49 MH/s", monthly: "~€14–18/mo" },
                  { gpu: "RTX 3080 (10GB)",     rate: "101 MH/s", monthly: "~€28–35/mo" },
                  { gpu: "RTX 4070 Ti (12GB)",  rate: "130 MH/s", monthly: "~€35–45/mo" },
                  { gpu: "RTX 4090 (24GB)",     rate: "200 MH/s", monthly: "~€55–70/mo" },
                  { gpu: "AMD RX 6700 (10GB)",  rate: "46 MH/s", monthly: "~€12–16/mo" },
                  { gpu: "Apple M2 Pro",         rate: "13 MH/s", monthly: "~€6–9/mo" },
                ].map((g) => (
                  <div
                    key={g.gpu}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <span className="text-[11px] font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>{g.gpu}</span>
                    <div className="flex items-center gap-4 text-right">
                      <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{g.rate}</span>
                      <span className="text-[11px] font-bold font-mono" style={{ color: "#f59e0b" }}>{g.monthly}</span>
                    </div>
                  </div>
                ))}
                <p className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Estimates based on smart-mining schedule (DE: 14h/day off-peak). 100% revenue → NUR Finance treasury.
                </p>
              </div>

              <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(0,212,170,0.05)", border: "1px solid rgba(0,212,170,0.15)" }}>
                <p className="text-[12px] font-bold" style={{ color: "#00d4aa" }}>Transparency Commitment</p>
                <ul className="text-[11px] space-y-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <li>• Mining starts only after explicit user consent during setup</li>
                  <li>• Real-time hashrate, earnings, and power draw shown in dashboard</li>
                  <li>• Stop mining anytime — terminal suspends (switch to paid plan to keep access)</li>
                  <li>• No data collection beyond hardware performance metrics</li>
                  <li>• Open-source mining module (GitHub MIT) — auditable by anyone</li>
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
              NUR Finance Desktop · Beta Q1 2027 · nurfinans.com
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
