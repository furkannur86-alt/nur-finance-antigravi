"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────
   THE NUMBER WALL  — 42 · 13 · 35 · 55 · 54751113
   Streams permanently across the left edge like ship's readout.
   Hitchhiker's Guide tribute: the answer is 42.
────────────────────────────────────────────────────────────── */
const HHGG_POOL = [42, 13, 35, 55, 54751113, 42, 13, 35, 42, 55, 13, 42, 54751113, 35, 42];

function NumberStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;
    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Columns
    const COL_W = 100;
    const numCols = Math.ceil(canvas.width / COL_W);
    const columns: { y: number; speed: number; numIdx: number }[] = [];
    for (let i = 0; i < numCols; i++) {
      columns.push({
        y: Math.random() * -canvas.height * 1.5,
        speed: 0.3 + Math.random() * 0.4,
        numIdx: Math.floor(Math.random() * HHGG_POOL.length),
      });
    }

    const draw = () => {
      // Strong fade = short, wispy trails
      ctx.fillStyle = "rgba(1, 8, 22, 0.28)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      columns.forEach((col, i) => {
        const x = i * COL_W + 8;
        const num = HHGG_POOL[col.numIdx % HHGG_POOL.length];
        const str = num.toLocaleString();

        // Head — brightest, small
        ctx.shadowColor = "rgba(0,229,195,0.6)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "rgba(220,255,248,0.7)";
        ctx.font = "bold 12px 'Courier New', monospace";
        ctx.fillText(str, x, col.y);

        // Trail 1
        ctx.shadowBlur = 4;
        ctx.fillStyle = "rgba(0, 229, 195, 0.35)";
        ctx.font = "10px 'Courier New', monospace";
        ctx.fillText(HHGG_POOL[(col.numIdx + 1) % HHGG_POOL.length].toLocaleString(), x, col.y - 22);

        // Trail 2 — almost invisible
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0, 229, 195, 0.12)";
        ctx.font = "9px 'Courier New', monospace";
        ctx.fillText(HHGG_POOL[(col.numIdx + 2) % HHGG_POOL.length].toLocaleString(), x, col.y - 40);

        ctx.shadowBlur = 0;

        col.y += col.speed;
        if (col.y > canvas.height + 60) {
          col.y = -40 - Math.random() * canvas.height * 0.5;
          col.numIdx = (col.numIdx + Math.floor(Math.random() * 5) + 1) % HHGG_POOL.length;
          col.speed = 0.3 + Math.random() * 0.4;
        }

        if (frame % 240 === i % 240) {
          col.numIdx = (col.numIdx + 1) % HHGG_POOL.length;
        }
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cockpit-number-stream"
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────────────────────
   BIG HITCHHIKER BANNER — the 5 sacred numbers, always visible
────────────────────────────────────────────────────────────── */
const BIG_NUMS = [
  { n: "42",        label: "THE ANSWER" },
  { n: "13",        label: "UNLUCKY·PRIME" },
  { n: "35",        label: "WARP·FACTOR" },
  { n: "55",        label: "MAXIMUM·SPEED" },
  { n: "5,475,146", label: "TOTAL·DISTANCE" },
];

function HitchhikerBanner() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % BIG_NUMS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="cockpit-banner" title="42 · 13 · 35 · 55 · 5,475,146">
      {BIG_NUMS.map((item, i) => (
        <div key={item.n} className={`cockpit-banner-cell ${i === pulse ? "cockpit-banner-active" : ""}`}>
          <span className="cockpit-banner-num">{item.n}</span>
          <span className="cockpit-banner-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   STARFIELD — canvas-based, slow parallax
────────────────────────────────────────────────────────────── */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Generate stars once
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.2,
      brightness: Math.random(),
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      color: Math.random() > 0.92
        ? `rgba(0,229,195,${0.4 + Math.random() * 0.5})`
        : Math.random() > 0.95
          ? `rgba(180,140,255,${0.5 + Math.random() * 0.4})`
          : `rgba(255,255,255,${0.5 + Math.random() * 0.5})`,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Deep space radial gradient background
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.35, 0,
        canvas.width * 0.5, canvas.height * 0.35, canvas.width * 0.9
      );
      grad.addColorStop(0, "rgba(4,14,40,1)");
      grad.addColorStop(0.5, "rgba(2,8,22,1)");
      grad.addColorStop(1, "rgba(0,2,8,1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula cloud
      const neb = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.2, 0,
        canvas.width * 0.75, canvas.height * 0.2, canvas.width * 0.4
      );
      neb.addColorStop(0, "rgba(0,60,80,0.12)");
      neb.addColorStop(1, "transparent");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const glow = 0.5 + 0.5 * Math.sin(s.twinkle);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.r * 4 * glow;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * glow, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="cockpit-starfield-canvas" aria-hidden="true" />;
}

/* ──────────────────────────────────────────────────────────────
   LIVE TELEMETRY
────────────────────────────────────────────────────────────── */
type TelemRow = { key: string; val: string; unit: string; category?: 'ORBIT' | 'SPACE_WX' | 'DEFENSE' | 'QUANTUM' };
function useLiveTelemetry() {
  const [rows, setRows] = useState<TelemRow[]>([
    { key: "QUANTUM HASH SEED", val: "#54751113", unit: "SOVEREIGN", category: 'QUANTUM' },
    { key: "ORBITAL ALTITUDE", val: "418.55", unit: "km (SEC-13)", category: 'ORBIT' },
    { key: "ORBITAL VELOCITY", val: "27,580", unit: "km/h (35.42 km/s Rel)", category: 'ORBIT' },
    { key: "TELEMETRY CHANNELS", val: "CH-13 · 35 · 42 · 55", unit: "LOCKED", category: 'DEFENSE' },
    { key: "WARP RESONANCE", val: "13.354255", unit: "GHz (432/528 Hz)", category: 'QUANTUM' },
    { key: "SOLAR WIND VEL.", val: "442.8", unit: "km/s (Kp 3.5)", category: 'SPACE_WX' },
    { key: "APOPHIS (99942)", val: "31,600", unit: "km (2029 APR 13)", category: 'DEFENSE' },
    { key: "DEFCON MATRIX NO.", val: "42,013", unit: "NODE-55", category: 'DEFENSE' },
    { key: "LEO RECON SATS", val: "3,420", unit: "ACTIVE (#54751113)", category: 'DEFENSE' },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.key === "ORBITAL ALTITUDE") return { ...r, val: (418.55 + (Math.random() - 0.5) * 0.42).toFixed(2) };
          if (r.key === "ORBITAL VELOCITY") return { ...r, val: (27580 + (Math.random() - 0.5) * 13).toFixed(0) };
          if (r.key === "WARP RESONANCE") return { ...r, val: (13.354255 + (Math.random() - 0.5) * 0.000055).toFixed(6) };
          return r;
        })
      );
    }, 800);
    return () => clearInterval(t);
  }, []);
  return rows;
}

function TelemetryPanel({
  isMinimized,
  onToggleMinimize,
  onSendToBackdrop,
}: {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onSendToBackdrop: () => void;
}) {
  const rows = useLiveTelemetry();

  if (isMinimized) {
    return (
      <div className="cockpit-telem-panel-minimized" onClick={onToggleMinimize} title="Click to Expand Telemetry">
        <span className="animate-ping w-2 h-2 rounded-full bg-cyan-400" />
        <span className="text-[10px] font-mono font-bold text-cyan-300">
          ◈ ORBIT: #54751113 | CH: 13·35·42·55 | EXPAND ⤢
        </span>
      </div>
    );
  }

  return (
    <div className="cockpit-telem-panel">
      <div className="cockpit-telem-header flex justify-between items-center">
        <span>◈ ORBITAL TELEMETRY</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onSendToBackdrop}
            title="Send to Background (Non-Blocking Click-Through)"
            className="px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[8px] font-mono font-bold border border-amber-500/30"
          >
            BACKSTAGE ⬚
          </button>
          <button
            onClick={onToggleMinimize}
            title="Minimize Telemetry HUD"
            className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[8px] font-mono font-bold border border-white/20"
          >
            MIN ⤡
          </button>
        </div>
      </div>
      {rows.map((r) => (
        <div key={r.key} className="cockpit-telem-row">
          <span className="cockpit-telem-key">{r.key}</span>
          <span className="cockpit-telem-val">
            {r.val}
            {r.unit && <span className="cockpit-telem-unit"> {r.unit}</span>}
          </span>
        </div>
      ))}
      <div className="pt-1.5 mt-1 border-t border-white/10 flex justify-between text-[8px] font-mono text-slate-500">
        <span>SEED: 54751113</span>
        <span>NODES: 13·35·42·55</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   VIEWPORT WINDOW FRAME — the physical cockpit window glass
────────────────────────────────────────────────────────────── */
function WindowFrame() {
  return (
    <div className="cockpit-window-frame" aria-hidden="true">
      {/* Corner reinforcement bolts */}
      <div className="cockpit-bolt cockpit-bolt-tl" />
      <div className="cockpit-bolt cockpit-bolt-tr" />
      <div className="cockpit-bolt cockpit-bolt-bl" />
      <div className="cockpit-bolt cockpit-bolt-br" />
      {/* Glass reflection streaks */}
      <div className="cockpit-glass-streak cockpit-glass-streak-1" />
      <div className="cockpit-glass-streak cockpit-glass-streak-2" />
      {/* Edge glow */}
      <div className="cockpit-edge-glow cockpit-edge-top" />
      <div className="cockpit-edge-glow cockpit-edge-left" />
      <div className="cockpit-edge-glow cockpit-edge-right" />
      <div className="cockpit-edge-glow cockpit-edge-bottom" />
      {/* HUD reticle center cross-hair */}
      <div className="cockpit-crosshair-h" />
      <div className="cockpit-crosshair-v" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   ZOOM / TILT CONTROLS
────────────────────────────────────────────────────────────── */
function ZoomControls({
  zoom, onZoom, tilt, onTilt,
}: { zoom: number; onZoom: (d: number) => void; tilt: number; onTilt: (d: number) => void; }) {
  return (
    <div className="cockpit-controls">
      <div className="cockpit-controls-header">⊕ VIEW</div>
      <div className="cockpit-controls-row">
        <button className="cockpit-ctrl-btn" onClick={() => onZoom(0.15)}>＋</button>
        <div className="cockpit-ctrl-label">{(zoom * 100).toFixed(0)}%</div>
        <button className="cockpit-ctrl-btn" onClick={() => onZoom(-0.15)}>－</button>
      </div>
      <button className="cockpit-ctrl-reset" onClick={() => { onZoom(1 - zoom); onTilt(-tilt); }}>RESET</button>
      <div className="cockpit-controls-sep" />
      <div className="cockpit-controls-row">
        <button className="cockpit-ctrl-btn" onClick={() => onTilt(-4)}>▲</button>
        <div className="cockpit-ctrl-label">{tilt > 0 ? "+" : ""}{tilt}°</div>
        <button className="cockpit-ctrl-btn" onClick={() => onTilt(4)}>▼</button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────────── */
export interface CockpitViewport { zoom: number; tilt: number; }

interface CockpitFrameProps {
  children: React.ReactNode;
  showControls?: boolean;
  onViewportChange?: (v: CockpitViewport) => void;
}

export default function CockpitFrame({
  children, showControls = false, onViewportChange,
}: CockpitFrameProps) {
  const [zoom, setZoom] = useState(1);
  const [tilt, setTilt] = useState(0);
  const [hudMode, setHudMode] = useState<'FULL' | 'BACKDROP' | 'MINIMIZED'>('FULL');

  const handleZoom = useCallback((delta: number) => {
    setZoom((z) => { const n = Math.max(0.4, Math.min(3, z + delta)); onViewportChange?.({ zoom: n, tilt }); return n; });
  }, [tilt, onViewportChange]);

  const handleTilt = useCallback((delta: number) => {
    setTilt((t) => { const n = Math.max(-25, Math.min(25, t + delta)); onViewportChange?.({ zoom, tilt: n }); return n; });
  }, [zoom, onViewportChange]);

  return (
    <div className={`cockpit-root ${hudMode === 'BACKDROP' ? 'cockpit-backdrop-mode' : ''}`}>

      {/* Layer 0: Deep space canvas starfield */}
      <Starfield />

      {/* Layer 1: Cascading hitchhiker numbers on the right side */}
      <NumberStream />

      {/* Layer 2: Physical window frame + glass effects */}
      {hudMode !== 'BACKDROP' && <WindowFrame />}

      {/* Layer 3: Scan lines */}
      <div className="cockpit-scanlines" aria-hidden="true" />

      {/* Layer 4: Atmospheric vignette — pushes focus to center */}
      <div className="cockpit-vignette" aria-hidden="true" />

      {/* Layer 5: Left panel — telemetry */}
      {hudMode !== 'BACKDROP' && (
        <TelemetryPanel
          isMinimized={hudMode === 'MINIMIZED'}
          onToggleMinimize={() => setHudMode(hudMode === 'MINIMIZED' ? 'FULL' : 'MINIMIZED')}
          onSendToBackdrop={() => setHudMode('BACKDROP')}
        />
      )}

      {/* Backdrop Mode Restore Floating Controller */}
      {hudMode === 'BACKDROP' && (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 shadow-2xl font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="text-amber-300 font-bold">BACKSTAGE MODE ACTIVE (#54751113 • 13·35·42·55)</span>
          <button
            onClick={() => setHudMode('FULL')}
            className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold text-[10px] hover:brightness-110 transition-all shadow"
          >
            RESTORE COCKPIT HUD ⤢
          </button>
        </div>
      )}

      {/* Layer 6: Right panel — zoom/tilt controls */}
      {showControls && hudMode === 'FULL' && (
        <ZoomControls zoom={zoom} onZoom={handleZoom} tilt={tilt} onTilt={handleTilt} />
      )}

      {/* Layer 7: The content (globe or whatever panel) */}
      <div
        className="cockpit-viewport"
        style={{
          transform: `scale(${zoom}) perspective(1200px) rotateX(${tilt}deg)`,
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </div>

      {/* Layer 8: Bottom Hitchhiker banner */}
      {hudMode !== 'BACKDROP' && <HitchhikerBanner />}

      {/* Layer 9: Status bar */}
      <div className="cockpit-status-bar">
        <span className="cockpit-status-id">NFS·SOVEREIGN·Ω·001</span>
        <span className="cockpit-status-sep">◆</span>
        <span className="cockpit-status-green">● SYSTEMS NOMINAL</span>
        <span className="cockpit-status-sep">◆</span>
        <span className="cockpit-status-id">ISS ORBIT 418.55 KM · 27,580 km/s</span>
        <span className="cockpit-status-sep">◆</span>
        <span className="cockpit-status-gold">SEED #54751113 · 13 · 35 · 42 · 55</span>
      </div>
    </div>
  );
}
