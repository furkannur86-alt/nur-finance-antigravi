"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { allFleet, CivilizationalShip } from "@/lib/broadcast/civilizationalShips";

// ── Types ────────────────────────────────────────────────────────────────────

type ModeKey = "eco" | "balanced" | "overclock";

interface WorkerMsg {
  type: "started" | "block" | "telemetry" | "stopped" | "status";
  hashrateMhs?: number;
  totalHashes?: number;
  blocksMined?: number;
  sessionEarned?: number;
  shipId?: string;
  workerId?: string;
  nonce?: number;
  hash?: string;
  running?: boolean;
  intensity?: number;
}

interface FleetRow {
  shipId: string;
  hashrateMhs: number;
  activeWorkers: number;
  totalBlocksMined: number;
  unclaimedTokens: number;
}

interface BlockEntry {
  ts: number;
  nonce: number;
  hash: string;
  reward: number;
}

// ── Config ───────────────────────────────────────────────────────────────────

const MODES: Record<ModeKey, { label: string; icon: string; color: string; intensity: number; desc: string }> = {
  eco:       { label: "ECO",       icon: "🌱", color: "#34d399", intensity: 0.25, desc: "Min CPU — long battery life" },
  balanced:  { label: "BALANCED",  icon: "⚡", color: "#60a5fa", intensity: 1.0,  desc: "Optimal speed vs. heat" },
  overclock: { label: "OVERCLOCK", icon: "🔥", color: "#f87171", intensity: 4.0,  desc: "Max hashrate — all cores" },
};

const C = {
  bg: "#020408",
  surface: "#080e18",
  border: "rgba(0,229,255,0.12)",
  cyan: "#00e5ff",
  gold: "#ffd700",
  green: "#00ffcc",
  text: "#c8d8f0",
  dim: "#3a5c7a",
  red: "#ff4466",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function FleetMinerPanel() {
  const [selectedShip, setSelectedShip] = useState<CivilizationalShip>(allFleet[1]); // TR_LIB default
  const [mode, setMode] = useState<ModeKey>("balanced");
  const [running, setRunning] = useState(false);
  const [hashrateMhs, setHashrateMhs] = useState(0);
  const [totalHashes, setTotalHashes] = useState(0);
  const [blocksMined, setBlocksMined] = useState(0);
  const [sessionEarned, setSessionEarned] = useState(0);
  const [workerId, setWorkerId] = useState("");
  const [blocks, setBlocks] = useState<BlockEntry[]>([]);
  const [fleetStats, setFleetStats] = useState<FleetRow[]>([]);
  const [fleetLoading, setFleetLoading] = useState(false);
  const [tab, setTab] = useState<"miner" | "fleet" | "download">("miner");
  const [tick, setTick] = useState(0);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [workerError, setWorkerError] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const tickRef = useRef<NodeJS.Timeout | null>(null);

  // Rolling sparkline data (last 30 hashrate readings)
  const hashrateHistory = useRef<number[]>([]);

  useEffect(() => {
    tickRef.current = setInterval(() => setTick(t => t + 1), 2000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  useEffect(() => {
    if (tick % 5 === 0) loadFleetStats();
  }, [tick]);

  const loadFleetStats = async () => {
    setFleetLoading(true);
    try {
      const r = await fetch("/api/fleet/mining");
      const d = await r.json();
      if (d.ships) setFleetStats(d.ships);
    } finally { setFleetLoading(false); }
  };

  const startMiner = useCallback(() => {
    if (running || typeof window === "undefined") return;
    setWorkerError("");
    try {
      const worker = new Worker("/miners/fleet-worker.js");
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent<WorkerMsg>) => {
        const msg = e.data;
        if (msg.type === "started") {
          setRunning(true);
          setWorkerId(msg.workerId ?? "");
          setSessionStart(Date.now());
        } else if (msg.type === "telemetry") {
          const mhs = msg.hashrateMhs ?? 0;
          setHashrateMhs(mhs);
          setTotalHashes(msg.totalHashes ?? 0);
          setBlocksMined(msg.blocksMined ?? 0);
          setSessionEarned(msg.sessionEarned ?? 0);
          hashrateHistory.current = [...hashrateHistory.current.slice(-29), mhs];
        } else if (msg.type === "block") {
          const reward = 0.001 * (0.8 + Math.random() * 0.4);
          setBlocks(prev => [{
            ts: Date.now(),
            nonce: msg.nonce ?? 0,
            hash: msg.hash ?? "",
            reward,
          }, ...prev.slice(0, 49)]);
          setBlocksMined(msg.blocksMined ?? 0);
          setSessionEarned(msg.sessionEarned ?? 0);
        } else if (msg.type === "stopped") {
          setRunning(false);
          setHashrateMhs(0);
        }
      };

      worker.onerror = (err) => {
        setWorkerError("Worker error: " + err.message);
        setRunning(false);
      };

      worker.postMessage({
        cmd: "start",
        config: {
          shipId: selectedShip.id,
          intensity: MODES[mode].intensity,
          reportInterval: 8000,
        },
      });
    } catch (e) {
      setWorkerError("Could not start WebWorker: " + (e as Error).message);
    }
  }, [running, selectedShip, mode]);

  const stopMiner = useCallback(() => {
    workerRef.current?.postMessage({ cmd: "stop" });
    workerRef.current?.terminate();
    workerRef.current = null;
    setRunning(false);
    setHashrateMhs(0);
  }, []);

  useEffect(() => {
    return () => { workerRef.current?.terminate(); };
  }, []);

  const changeMode = (m: ModeKey) => {
    setMode(m);
    if (running) {
      workerRef.current?.postMessage({ cmd: "config", config: { intensity: MODES[m].intensity } });
    }
  };

  const changeShip = (ship: CivilizationalShip) => {
    setSelectedShip(ship);
    if (running) {
      stopMiner();
    }
  };

  const elapsed = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
  const elapsedStr = `${String(Math.floor(elapsed / 3600)).padStart(2, "0")}:${String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
  const vaultAmount = sessionEarned * 0.95;
  const modeConfig = MODES[mode];
  const hist = hashrateHistory.current;
  const maxH = Math.max(...hist, 0.001);

  return (
    <div style={{ width: "100%", height: "100%", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "monospace", color: C.text, overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: "rgba(0,229,255,0.03)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 900, color: C.cyan, letterSpacing: 4 }}>⛏ NUR FLEET MINING BOT</div>
            <div style={{ fontSize: 7, color: C.dim, letterSpacing: 2, marginTop: 2 }}>BROWSER WEB-WORKER · 36 SHIPS · 95% → VAULT #54751113</div>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <Stat label="HASHRATE" val={running ? `${hashrateMhs.toFixed(3)} MH/s` : "—"} col={C.cyan} />
            <Stat label="BLOCKS" val={String(blocksMined)} col={C.green} />
            <Stat label="EARNED" val={`${sessionEarned.toFixed(6)} NUR`} col={C.gold} />
            <Stat label="→ VAULT" val={`${vaultAmount.toFixed(6)} NUR`} col="#a78bfa" />
            <Stat label="SESSION" val={running ? elapsedStr : "—"} col={C.dim} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        {(["miner", "fleet", "download"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "7px 20px", fontSize: 8, fontWeight: 700, letterSpacing: 3, background: tab === t ? "rgba(0,229,255,0.1)" : "transparent", color: tab === t ? C.cyan : C.dim, border: "none", borderBottom: tab === t ? `2px solid ${C.cyan}` : "2px solid transparent", cursor: "pointer" }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* ── MINER TAB ── */}
        {tab === "miner" && (
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "280px 1fr 280px", gap: 16 }}>

            {/* Left: ship selector + mode */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Mode selector */}
              <Panel label="MADENCİLİK MODU">
                {(["eco", "balanced", "overclock"] as ModeKey[]).map(m => {
                  const mc = MODES[m];
                  const active = mode === m;
                  return (
                    <button key={m} onClick={() => changeMode(m)}
                      style={{ width: "100%", padding: "10px 12px", marginBottom: 6, textAlign: "left", background: active ? `${mc.color}18` : "transparent", border: `1px solid ${active ? mc.color : C.dim}`, borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{mc.icon}</span>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: active ? mc.color : C.dim, letterSpacing: 2 }}>{mc.label}</div>
                        <div style={{ fontSize: 7, color: C.dim, marginTop: 2 }}>{mc.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </Panel>

              {/* Start/Stop */}
              <button onClick={running ? stopMiner : startMiner}
                style={{ padding: "12px 0", fontSize: 11, fontWeight: 900, letterSpacing: 3, background: running ? "rgba(255,68,68,0.15)" : "rgba(0,229,255,0.15)", color: running ? C.red : C.cyan, border: `1px solid ${running ? C.red : C.cyan}`, borderRadius: 3, cursor: "pointer" }}>
                {running ? "⬛ DURDUR" : "▶ BAŞLAT"}
              </button>

              {workerError && (
                <div style={{ padding: 10, background: "rgba(255,68,68,0.1)", border: `1px solid ${C.red}`, borderRadius: 3, fontSize: 8, color: C.red }}>
                  {workerError}
                </div>
              )}

              {running && (
                <div style={{ padding: "10px 12px", background: "rgba(0,255,204,0.05)", border: `1px solid rgba(0,255,204,0.2)`, borderRadius: 3 }}>
                  <div style={{ fontSize: 7, color: C.dim, marginBottom: 4 }}>WORKER ID</div>
                  <div style={{ fontSize: 8, color: C.green, wordBreak: "break-all" }}>{workerId}</div>
                </div>
              )}
            </div>

            {/* Center: hashrate sparkline + live stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Hashrate sparkline */}
              <Panel label="HASHRATE — MH/s">
                <div style={{ height: 80, position: "relative", marginBottom: 8 }}>
                  <svg width="100%" height="80" style={{ display: "block" }}>
                    {hist.length > 1 && (
                      <polyline
                        fill="none"
                        stroke={running ? C.cyan : C.dim}
                        strokeWidth={1.5}
                        strokeLinejoin="round"
                        points={hist.map((v, i) => `${(i / (hist.length - 1)) * 100}%,${80 - (v / maxH) * 70}`).join(" ")}
                      />
                    )}
                    {hist.map((v, i) => (
                      <circle key={i} cx={`${(i / Math.max(hist.length - 1, 1)) * 100}%`} cy={80 - (v / maxH) * 70} r={2} fill={running ? C.cyan : C.dim} />
                    ))}
                    {hist.length === 0 && (
                      <text x="50%" y="50%" textAnchor="middle" fill={C.dim} fontSize={10}>Madenci başlatılmadı</text>
                    )}
                  </svg>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9 }}>
                  <span style={{ color: C.dim }}>Anlık</span>
                  <span style={{ color: C.cyan, fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>{hashrateMhs.toFixed(4)} MH/s</span>
                </div>
              </Panel>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <StatCard label="TOPLAM HASH" val={totalHashes.toLocaleString()} col={C.text} />
                <StatCard label="BLOK BULUNDU" val={String(blocksMined)} col={C.green} />
                <StatCard label="KAZANILAN NUR" val={sessionEarned.toFixed(6)} col={C.gold} />
                <StatCard label="KASAYA (%95)" val={vaultAmount.toFixed(6)} col="#a78bfa" />
              </div>

              {/* Selected ship info */}
              <Panel label={`GEMİ — ${selectedShip.id}`}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${selectedShip.accentColor ?? C.cyan}22`, border: `1px solid ${selectedShip.accentColor ?? C.cyan}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🛸</div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: selectedShip.accentColor ?? C.cyan }}>{selectedShip.name}</div>
                    <div style={{ fontSize: 8, color: C.text, marginTop: 2 }}>{selectedShip.civilization}</div>
                    <div style={{ fontSize: 7, color: C.dim, marginTop: 2 }}>
                      <span style={{ padding: "1px 6px", borderRadius: 2, background: selectedShip.faction === "conservative" ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)", color: selectedShip.faction === "conservative" ? "#f87171" : "#60a5fa" }}>
                        {selectedShip.faction.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Panel>
            </div>

            {/* Right: ship selector + block log */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
              {/* Ship picker */}
              <Panel label="GEMİ SEÇ">
                <div style={{ maxHeight: 200, overflow: "auto" }}>
                  {allFleet.map(ship => {
                    const active = ship.id === selectedShip.id;
                    return (
                      <button key={ship.id} onClick={() => changeShip(ship)}
                        style={{ width: "100%", padding: "6px 10px", marginBottom: 2, textAlign: "left", background: active ? `${ship.accentColor ?? C.cyan}18` : "transparent", border: `1px solid ${active ? (ship.accentColor ?? C.cyan) : "transparent"}`, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 7, color: C.dim, width: 50, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{ship.id}</span>
                        <span style={{ fontSize: 8, color: active ? (ship.accentColor ?? C.cyan) : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ship.civilization}</span>
                      </button>
                    );
                  })}
                </div>
              </Panel>

              {/* Block log */}
              <Panel label="BLOK LOG">
                <div style={{ maxHeight: 180, overflow: "auto" }}>
                  {blocks.length === 0
                    ? <div style={{ fontSize: 8, color: C.dim, padding: "8px 0" }}>Henüz blok yok...</div>
                    : blocks.map((b, i) => (
                      <div key={i} style={{ padding: "4px 0", borderBottom: `1px solid rgba(0,229,255,0.06)`, fontSize: 7 }}>
                        <div style={{ color: C.green }}>#{b.nonce} · +{b.reward.toFixed(6)} NUR</div>
                        <div style={{ color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.hash}</div>
                      </div>
                    ))
                  }
                </div>
              </Panel>
            </div>
          </div>
        )}

        {/* ── FLEET TAB ── */}
        {tab === "fleet" && (
          <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 8, letterSpacing: 3, color: C.dim }}>36 GEMİ CANLI TELEMETRI</div>
              {fleetLoading && <div style={{ fontSize: 7, color: C.dim }}>yükleniyor...</div>}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8 }}>
              <thead>
                <tr style={{ color: C.dim, fontSize: 7, letterSpacing: 2 }}>
                  {["GEMİ ID", "HASHRATE (MH/s)", "AKTİF WORKER", "BLOK", "KAZANILAN NUR"].map(h => (
                    <th key={h} style={{ padding: "6px 12px", textAlign: "left", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fleetStats.map((row, i) => (
                  <tr key={row.shipId} style={{ borderBottom: `1px solid rgba(0,229,255,0.04)`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <td style={{ padding: "7px 12px", color: C.cyan }}>{row.shipId}</td>
                    <td style={{ padding: "7px 12px", color: C.text, fontVariantNumeric: "tabular-nums" }}>{(row.hashrateMhs + Math.sin(tick + i) * 50).toFixed(0)}</td>
                    <td style={{ padding: "7px 12px", color: C.green, fontVariantNumeric: "tabular-nums" }}>{row.activeWorkers.toLocaleString()}</td>
                    <td style={{ padding: "7px 12px", color: "#a78bfa", fontVariantNumeric: "tabular-nums" }}>{row.totalBlocksMined.toLocaleString()}</td>
                    <td style={{ padding: "7px 12px", color: C.gold, fontVariantNumeric: "tabular-nums" }}>{row.unclaimedTokens.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── DOWNLOAD TAB ── */}
        {tab === "download" && (
          <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
            <div style={{ maxWidth: 680 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: C.gold, marginBottom: 6, letterSpacing: 3 }}>📥 İNDİRİLEBİLİR BOT PAKETİ</div>
              <div style={{ fontSize: 9, color: C.dim, marginBottom: 24 }}>Masaüstünde çalışan yüksek performanslı Python standalone istemci. Tüm CPU çekirdeklerini kullanır.</div>

              {/* Python bot card */}
              <div style={{ padding: 20, background: "rgba(255,215,0,0.04)", border: `1px solid ${C.gold}40`, borderRadius: 6, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ fontSize: 28 }}>🐍</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.gold }}>NUR Fleet Miner — Python</div>
                    <div style={{ fontSize: 8, color: C.dim }}>nur_fleet_miner.py · Python 3.8+ · Çoklu thread · Tüm 36 gemi desteklenir</div>
                  </div>
                  <a href="/downloads/nur_fleet_miner.py" download="nur_fleet_miner.py"
                    style={{ marginLeft: "auto", padding: "8px 20px", fontSize: 9, fontWeight: 700, background: "rgba(255,215,0,0.15)", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 3, textDecoration: "none", letterSpacing: 2 }}>
                    ⬇ İNDİR
                  </a>
                </div>

                <div style={{ background: "#010810", border: `1px solid rgba(0,229,255,0.1)`, borderRadius: 4, padding: "14px 16px", fontFamily: "monospace" }}>
                  <div style={{ fontSize: 7, color: C.dim, marginBottom: 8, letterSpacing: 2 }}>KULLANIM</div>
                  {[
                    ["# Kurulum (bağımlılık yok)", C.dim],
                    ["python nur_fleet_miner.py", C.cyan],
                    ["", ""],
                    ["# Gemi seçerek başlat", C.dim],
                    ["python nur_fleet_miner.py --ship CN_SOV --mode overclock", C.cyan],
                    ["", ""],
                    ["# Endpoint belirt (production)", C.dim],
                    ["python nur_fleet_miner.py --ship TR_LIB --endpoint https://nurfinance.com", C.cyan],
                    ["", ""],
                    ["# Yardım", C.dim],
                    ["python nur_fleet_miner.py --help", C.cyan],
                    ["python nur_fleet_miner.py --list-ships", C.cyan],
                  ].map(([line, col], i) => (
                    <div key={i} style={{ fontSize: 9, color: col, lineHeight: 1.7 }}>{line || " "}</div>
                  ))}
                </div>
              </div>

              {/* Feature grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { icon: "⚡", title: "Çoklu Thread", desc: "CPU çekirdek sayısı kadar paralel mining thread" },
                  { icon: "🛸", title: "36 Gemi", desc: "--list-ships ile tüm gemi listesini görüntüle" },
                  { icon: "🔐", title: "Canlı Heartbeat", desc: "Her 10 saniyede fleet API'ye hashrate raporu" },
                  { icon: "💰", title: "95% → Vault", desc: "Kazanımlar otomatik olarak #54751113 kasasına aktarılır" },
                  { icon: "📊", title: "Anlık İstatistik", desc: "Terminal ekranında canlı MH/s, blok ve NUR sayacı" },
                  { icon: "⚙️", title: "3 Mod", desc: "Eco (🌱) · Balanced (⚡) · Overclock (🔥)" },
                ].map(f => (
                  <div key={f.title} style={{ padding: "12px 14px", background: "rgba(0,229,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 4 }}>
                    <div style={{ fontSize: 12, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: C.text, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 8, color: C.dim }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(0,229,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 4 }}>
                <div style={{ fontSize: 8, color: C.dim, letterSpacing: 2, marginBottom: 6 }}>GEREKSİNİMLER</div>
                <div style={{ fontSize: 9, color: C.text }}>
                  Python 3.8 veya üzeri · Harici paket gerekmez (stdlib only) · Windows / macOS / Linux
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "12px 14px", background: "rgba(0,229,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 4 }}>
      <div style={{ fontSize: 7, letterSpacing: 3, color: C.dim, marginBottom: 10 }}>{label}</div>
      {children}
    </div>
  );
}

function Stat({ label, val, col }: { label: string; val: string; col: string }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 7, color: C.dim, letterSpacing: 2 }}>{label}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    </div>
  );
}

function StatCard({ label, val, col }: { label: string; val: string; col: string }) {
  return (
    <div style={{ padding: "10px 12px", background: "rgba(0,229,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 4 }}>
      <div style={{ fontSize: 7, color: C.dim, letterSpacing: 2, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: col, fontVariantNumeric: "tabular-nums" }}>{val}</div>
    </div>
  );
}
