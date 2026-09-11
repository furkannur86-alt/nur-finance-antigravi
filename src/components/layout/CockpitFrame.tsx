"use client";

import { useState, useCallback, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Ambient background: Hitchhiker cascade + space atmosphere
// Numbers are deep background (z-0), barely visible, slowly glowing.
// They never interrupt the content — they ARE the wallpaper.
// ─────────────────────────────────────────────────────────────────────────────

const HITCH_NUMBERS = [
  { n: "42", x: 12, y: 18, size: 11, color: "#a78bfa", delay: 0 },
  { n: "13", x: 78, y: 8,  size: 8,  color: "#60a5fa", delay: 2.4 },
  { n: "35", x: 55, y: 72, size: 9,  color: "#a78bfa", delay: 5.1 },
  { n: "55", x: 88, y: 55, size: 10, color: "#f59e0b", delay: 1.7 },
  { n: "5,475,146", x: 28, y: 85, size: 4.5, color: "#60a5fa", delay: 3.8 },
  { n: "42", x: 68, y: 30, size: 6,  color: "#a78bfa", delay: 7.2 },
  { n: "∞", x: 42, y: 45, size: 13, color: "#6ee7b7", delay: 4.3 },
  { n: "13", x: 8,  y: 60, size: 7,  color: "#f59e0b", delay: 6.0 },
];

// Cascade stream: numbers that slowly drift downward
const CASCADE_ITEMS = [
  { n: "42", x: 6,   size: 7,  color: "#a78bfa", duration: 18, delay: 0 },
  { n: "13", x: 18,  size: 5,  color: "#60a5fa", duration: 22, delay: 3.5 },
  { n: "0",  x: 31,  size: 6,  color: "#6ee7b7", duration: 26, delay: 7.1 },
  { n: "55", x: 44,  size: 8,  color: "#a78bfa", duration: 20, delay: 1.8 },
  { n: "35", x: 57,  size: 5.5,color: "#f59e0b", duration: 24, delay: 9.4 },
  { n: "1",  x: 68,  size: 7,  color: "#60a5fa", duration: 19, delay: 4.9 },
  { n: "42", x: 80,  size: 6,  color: "#a78bfa", duration: 23, delay: 2.2 },
  { n: "∞",  x: 91,  size: 9,  color: "#6ee7b7", duration: 28, delay: 11.5 },
];

function AmbientNumberLayer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <style>{`
        @keyframes hitch-pulse {
          0%, 100% { opacity: var(--base-op); text-shadow: 0 0 20px var(--glow-c), 0 0 60px var(--glow-c); }
          50%       { opacity: var(--peak-op); text-shadow: 0 0 40px var(--glow-c), 0 0 100px var(--glow-c), 0 0 4px #fff; }
        }
        @keyframes hitch-fall {
          0%   { transform: translateY(-12vh); opacity: 0; }
          8%   { opacity: 0.05; }
          88%  { opacity: 0.035; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* ── Fixed ambient glyphs ── */}
      {HITCH_NUMBERS.map((item, i) => (
        <div
          key={i}
          className="absolute select-none font-mono font-black leading-none"
          style={{
            left: `${item.x}%`,
            top:  `${item.y}%`,
            fontSize: `${item.size}vw`,
            "--base-op": "0.028",
            "--peak-op": "0.068",
            "--glow-c": item.color,
            color: item.color,
            animation: `hitch-pulse ${9 + i * 1.3}s ease-in-out ${item.delay}s infinite`,
            letterSpacing: "-0.02em",
            userSelect: "none",
          } as React.CSSProperties}
        >
          {item.n}
        </div>
      ))}

      {/* ── Cascade / waterfall streams ── */}
      {CASCADE_ITEMS.map((item, i) => (
        <div
          key={`c-${i}`}
          className="absolute select-none font-mono font-black leading-none"
          style={{
            left: `${item.x}%`,
            top: "-12vh",
            fontSize: `${item.size}vw`,
            color: item.color,
            animation: `hitch-fall ${item.duration}s linear ${item.delay}s infinite`,
            userSelect: "none",
          }}
        >
          {item.n}
        </div>
      ))}

      {/* ── Slow shimmer scan across the whole layer ── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(168,139,250,0.012) 50%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer-sweep 12s linear infinite",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Deep space atmosphere: starfield on canvas
// ─────────────────────────────────────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };
    window.addEventListener("resize", onResize);

    type Star = { x: number; y: number; r: number; a: number; da: number };
    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  0.3 + Math.random() * 0.9,
      a:  Math.random(),
      da: (0.003 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
    }));

    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(0.55, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 0.55) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.a * 0.4})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD corner bracket
// ─────────────────────────────────────────────────────────────────────────────
function HUDCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const isTop  = pos[0] === "t";
  const isLeft = pos[1] === "l";
  const x1 = isLeft ?  3 : 61, y1 = isTop ?  3 : 61;
  const x2 = isLeft ?  3 : 61, y2 = isTop ? 28 : 36;
  const x3 = isLeft ? 28 : 36, y3 = isTop ?  3 : 61;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        width: 64, height: 64, zIndex: 40,
        top:    isTop  ? 0 : "auto",
        bottom: isTop  ? "auto" : 0,
        left:   isLeft ? 0 : "auto",
        right:  isLeft ? "auto" : 0,
      }}
    >
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
        <path
          d={`M${x2} ${y2} L${x1} ${y1} L${x3} ${y3}`}
          stroke="rgba(0,212,170,0.5)"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <circle cx={x1} cy={y1} r="2" fill="#00d4aa" opacity="0.8" />
        {isLeft
          ? <line x1={x1+6} y1={y1} x2={x1+10} y2={y1} stroke="rgba(0,212,170,0.25)" strokeWidth="1" />
          : <line x1={x1-6} y1={y1} x2={x1-10} y2={y1} stroke="rgba(0,212,170,0.25)" strokeWidth="1" />}
        {isTop
          ? <line x1={x1} y1={y1+6} x2={x1} y2={y1+10} stroke="rgba(0,212,170,0.25)" strokeWidth="1" />
          : <line x1={x1} y1={y1-6} x2={x1} y2={y1-10} stroke="rgba(0,212,170,0.25)" strokeWidth="1" />}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Zoom controls
// ─────────────────────────────────────────────────────────────────────────────
function ZoomControls({ zoom, onIn, onOut, onReset }: { zoom: number; onIn: () => void; onOut: () => void; onReset: () => void }) {
  return (
    <div
      className="absolute flex items-center gap-0.5 select-none"
      style={{
        bottom: 28, right: 12, zIndex: 50,
        background: "rgba(4,10,22,0.88)",
        border: "1px solid rgba(0,212,170,0.2)",
        borderRadius: 6,
        padding: "2px 4px",
      }}
    >
      {[["−", onOut, "Ctrl+−"], [String(Math.round(zoom * 100)) + "%", onReset, "Ctrl+0"], ["+", onIn, "Ctrl+="]].map(([label, fn, tip], i) => (
        <button
          key={i}
          onClick={fn as () => void}
          title={tip as string}
          className="flex items-center justify-center font-mono font-bold transition-colors rounded"
          style={{
            width: i === 1 ? "auto" : 20, height: 20,
            minWidth: i === 1 ? 32 : undefined,
            padding: i === 1 ? "0 6px" : undefined,
            fontSize: i === 1 ? 9 : 11,
            color: "rgba(0,212,170,0.65)",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#00d4aa")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(0,212,170,0.65)")}
        >
          {label as string}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main cockpit frame
// ─────────────────────────────────────────────────────────────────────────────
export default function CockpitFrame({ children }: { children: React.ReactNode }) {
  const [zoom, setZoom] = useState(1.0);
  const zoomIn    = useCallback(() => setZoom(z => Math.min(1.5, parseFloat((z + 0.1).toFixed(1)))), []);
  const zoomOut   = useCallback(() => setZoom(z => Math.max(0.5, parseFloat((z - 0.1).toFixed(1)))), []);
  const zoomReset = useCallback(() => setZoom(1.0), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      if (e.key === "=" || e.key === "+") { e.preventDefault(); zoomIn(); }
      if (e.key === "-")                  { e.preventDefault(); zoomOut(); }
      if (e.key === "0")                  { e.preventDefault(); zoomReset(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [zoomIn, zoomOut, zoomReset]);

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: "#030810" }}>

      {/* ── Layer 0: starfield canvas ─────────────────────────────────────── */}
      <StarCanvas />

      {/* ── Layer 1: atmospheric nebula gradients ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `
            radial-gradient(ellipse 70% 35% at 50% 0%,   rgba(0,90,160,0.055)  0%, transparent 100%),
            radial-gradient(ellipse 35% 60% at 0%  60%,  rgba(0,180,130,0.035) 0%, transparent 100%),
            radial-gradient(ellipse 35% 60% at 100% 60%, rgba(99,102,241,0.03) 0%, transparent 100%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,50,100,0.05)   0%, transparent 100%)
          `,
        }}
      />

      {/* ── Layer 2: Hitchhiker cascade numbers (deep background, not blocking) */}
      <AmbientNumberLayer />

      {/* ── Layer 3: scaled content — the actual app UI ───────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0,
          width:  `${100 / zoom}%`,
          height: `${100 / zoom}%`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          zIndex: 10,
        }}
      >
        {children}
      </div>

      {/* ── Layer 4: screen vignette (dark halo, pushes eye to center) ───── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          background: "radial-gradient(ellipse 130% 130% at 50% 50%, transparent 52%, rgba(1,4,12,0.78) 100%)",
        }}
      />

      {/* ── Layer 4b: very subtle CRT scan lines ──────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 4px)",
        }}
      />

      {/* ── Layer 5: edge glow rails ──────────────────────────────────────── */}
      <div className="absolute top-0 left-16 right-16 pointer-events-none" style={{ zIndex: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.18) 30%, rgba(0,212,170,0.18) 70%, transparent)" }} />
      <div className="absolute bottom-0 left-16 right-16 pointer-events-none" style={{ zIndex: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.1) 30%, rgba(0,212,170,0.1) 70%, transparent)" }} />

      {/* ── Layer 5: HUD corner brackets ──────────────────────────────────── */}
      <HUDCorner pos="tl" />
      <HUDCorner pos="tr" />
      <HUDCorner pos="bl" />
      <HUDCorner pos="br" />

      {/* ── Layer 6: zoom controls ────────────────────────────────────────── */}
      <ZoomControls zoom={zoom} onIn={zoomIn} onOut={zoomOut} onReset={zoomReset} />
    </div>
  );
}
