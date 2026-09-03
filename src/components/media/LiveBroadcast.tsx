"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { channels, hosts, guests, shows, studioGraphics } from "@/lib/data/broadcast";
import type { NURChannel, NURHost, NURGuest, NURShow } from "@/lib/data/broadcast";

const TICKER_HEADLINES = [
  "FTSE 100 +0.8% at 8,234 — mining stocks lead gains on copper rally",
  "ECB holds rates at 3.75%, signals September review amid sticky services inflation",
  "EUR/USD 1.0892 ▲0.3% — dollar weakness on soft PMI data",
  "Gold $2,418/oz ▲1.2% — safe-haven bid on Middle East tensions",
  "Brent crude $82.40 ▲0.6% — OPEC+ considering deeper cuts in Q4",
  "BREAKING: Bank of Japan signals possible rate hike — Nikkei drops 1.4%",
  "S&P 500 futures +0.4% — Nvidia earnings beat sends tech higher",
  "UK GDP Q2 +0.6% QoQ — beats consensus of +0.4%",
  "China PBoC cuts 1-year MLF rate by 15bp to 2.35%",
  "German Ifo Business Climate 87.2 vs 86.5 expected — manufacturing recovery signs",
  "Bitcoin $67,420 ▲2.8% — ETF inflows hit $890M daily record",
  "US 10Y yield 4.22% ▼6bp — rate cut expectations firm for December",
  "DAX 18,890 +0.5% — SAP hits all-time high on AI demand",
  "MSCI Emerging Markets +1.1% — India, Brazil lead gains",
  "Natural Gas $2.84 ▲3.2% — heatwave drives cooling demand",
];

const BREAKING_ALERTS = [
  { text: "ECB HOLDS RATES AT 3.75% — LAGARDE PRESS CONFERENCE AT 14:30 CET", urgency: "urgent" as const },
  { text: "BOJ SIGNALS RATE HIKE — JPY SURGES 1.8% AGAINST USD", urgency: "flash" as const },
  { text: "US NONFARM PAYROLLS 218K VS 205K EXPECTED — UNEMPLOYMENT 3.9%", urgency: "urgent" as const },
];

interface PresenterConfig {
  name: string;
  skinHex: string;
  hairHex: string;
  hairStyle: string;
  eyeHex: string;
  outfitHex: string;
  lipHex: string;
}

function getPresenterConfig(host: NURHost): PresenterConfig {
  const skinMap: Record<string, string> = {
    fair: "#f5dcc0", light: "#f0d0b0", medium: "#d4a574", olive: "#c4956a",
    tan: "#b8865a", brown: "#8d6346", deep: "#5c3d2e"
  };
  const hairMap: Record<string, string> = {
    "platinum-blonde": "#e8dcc8", auburn: "#8b3a1a", "jet-black": "#1a1a1a",
    chestnut: "#6b3410", "dark-brown": "#3b2010", "honey-blonde": "#c8a050",
    "copper-red": "#b44020", raven: "#0a0a12", "ash-brown": "#7a6a5a",
    "golden-brown": "#a07030", "midnight-black": "#101018", walnut: "#5a3a1a",
    mahogany: "#5c1a0a", espresso: "#2a1808", toffee: "#8a5a2a"
  };
  return {
    name: host.displayName,
    skinHex: skinMap[host.skinTone] || "#f0d0b0",
    hairHex: hairMap[host.hairColor] || "#3b2010",
    hairStyle: host.hairStyle,
    eyeHex: "#2d8a5e",
    outfitHex: "#1a2a3a",
    lipHex: "#c45060",
  };
}

function drawPresenter(ctx: CanvasRenderingContext2D, p: PresenterConfig, w: number, h: number, frame: number) {
  const cx = w * 0.5;
  const baseY = h * 0.95;
  const scale = Math.min(w / 400, h / 500);

  // Body / blazer
  ctx.fillStyle = p.outfitHex;
  ctx.beginPath();
  ctx.moveTo(cx - 70 * scale, baseY);
  ctx.lineTo(cx - 60 * scale, baseY - 120 * scale);
  ctx.quadraticCurveTo(cx - 50 * scale, baseY - 160 * scale, cx - 30 * scale, baseY - 180 * scale);
  ctx.lineTo(cx + 30 * scale, baseY - 180 * scale);
  ctx.quadraticCurveTo(cx + 50 * scale, baseY - 160 * scale, cx + 60 * scale, baseY - 120 * scale);
  ctx.lineTo(cx + 70 * scale, baseY);
  ctx.closePath();
  ctx.fill();

  // Collar / blouse
  ctx.fillStyle = "#f0f0f0";
  ctx.beginPath();
  ctx.moveTo(cx - 18 * scale, baseY - 180 * scale);
  ctx.lineTo(cx - 10 * scale, baseY - 150 * scale);
  ctx.lineTo(cx, baseY - 160 * scale);
  ctx.lineTo(cx + 10 * scale, baseY - 150 * scale);
  ctx.lineTo(cx + 18 * scale, baseY - 180 * scale);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = p.skinHex;
  ctx.beginPath();
  ctx.ellipse(cx, baseY - 190 * scale, 14 * scale, 20 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  const headY = baseY - 240 * scale;
  ctx.fillStyle = p.skinHex;
  ctx.beginPath();
  ctx.ellipse(cx, headY, 38 * scale, 46 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = p.hairHex;
  if (p.hairStyle.includes("bob") || p.hairStyle.includes("short")) {
    ctx.beginPath();
    ctx.ellipse(cx, headY - 16 * scale, 42 * scale, 36 * scale, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 42 * scale, headY - 16 * scale, 84 * scale, 20 * scale);
    // Side hair
    ctx.beginPath();
    ctx.ellipse(cx - 38 * scale, headY + 5 * scale, 10 * scale, 30 * scale, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 38 * scale, headY + 5 * scale, 10 * scale, 30 * scale, -0.1, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Long hair
    ctx.beginPath();
    ctx.ellipse(cx, headY - 16 * scale, 44 * scale, 38 * scale, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(cx - 44 * scale, headY - 16 * scale, 88 * scale, 18 * scale);
    // Flowing sides
    ctx.beginPath();
    ctx.moveTo(cx - 42 * scale, headY - 5 * scale);
    ctx.quadraticCurveTo(cx - 52 * scale, headY + 40 * scale, cx - 46 * scale, baseY - 140 * scale);
    ctx.lineTo(cx - 36 * scale, baseY - 140 * scale);
    ctx.quadraticCurveTo(cx - 38 * scale, headY + 30 * scale, cx - 34 * scale, headY);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx + 42 * scale, headY - 5 * scale);
    ctx.quadraticCurveTo(cx + 52 * scale, headY + 40 * scale, cx + 46 * scale, baseY - 140 * scale);
    ctx.lineTo(cx + 36 * scale, baseY - 140 * scale);
    ctx.quadraticCurveTo(cx + 38 * scale, headY + 30 * scale, cx + 34 * scale, headY);
    ctx.closePath();
    ctx.fill();
  }

  // Eyes
  const eyeY = headY + 2 * scale;
  const blinkCycle = frame % 180;
  const eyeOpen = blinkCycle < 170 ? 1 : blinkCycle < 175 ? 0.2 : blinkCycle < 180 ? 0.8 : 1;
  [-1, 1].forEach((side) => {
    const ex = cx + side * 14 * scale;
    // White
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 7 * scale, 5 * scale * eyeOpen, 0, 0, Math.PI * 2);
    ctx.fill();
    if (eyeOpen > 0.5) {
      // Iris
      ctx.fillStyle = p.eyeHex;
      ctx.beginPath();
      ctx.arc(ex + Math.sin(frame * 0.02) * 1.5 * scale, eyeY, 3.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      // Pupil
      ctx.fillStyle = "#111";
      ctx.beginPath();
      ctx.arc(ex + Math.sin(frame * 0.02) * 1.5 * scale, eyeY, 1.8 * scale, 0, Math.PI * 2);
      ctx.fill();
      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.arc(ex + 1.5 * scale, eyeY - 1 * scale, 1 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Eyebrows
  ctx.strokeStyle = p.hairHex;
  ctx.lineWidth = 2 * scale;
  [-1, 1].forEach((side) => {
    const bx = cx + side * 14 * scale;
    ctx.beginPath();
    ctx.moveTo(bx - 8 * scale, eyeY - 10 * scale);
    ctx.quadraticCurveTo(bx, eyeY - 14 * scale, bx + 8 * scale, eyeY - 10 * scale);
    ctx.stroke();
  });

  // Nose
  ctx.strokeStyle = `${p.skinHex}cc`;
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, eyeY + 4 * scale);
  ctx.quadraticCurveTo(cx + 4 * scale, eyeY + 16 * scale, cx, eyeY + 18 * scale);
  ctx.stroke();

  // Mouth — animated speaking
  const mouthY = headY + 24 * scale;
  const speaking = Math.sin(frame * 0.15) * 0.5 + 0.5;
  ctx.fillStyle = p.lipHex;
  ctx.beginPath();
  ctx.ellipse(cx, mouthY, 8 * scale, (2 + speaking * 3) * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  if (speaking > 0.3) {
    ctx.fillStyle = "#2a0a0a";
    ctx.beginPath();
    ctx.ellipse(cx, mouthY + 1 * scale, 5 * scale, speaking * 2 * scale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Earrings
  ctx.fillStyle = "#e8c84a";
  [-1, 1].forEach((side) => {
    ctx.beginPath();
    ctx.arc(cx + side * 36 * scale, headY + 12 * scale, 2 * scale, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawStudio(ctx: CanvasRenderingContext2D, w: number, h: number, frame: number, brandColor: string) {
  // Background gradient — dark studio
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#0a1628");
  grad.addColorStop(0.5, "#0d1f3c");
  grad.addColorStop(1, "#081020");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Ambient studio lights
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.15, 0, w * 0.5, h * 0.15, w * 0.6);
  glow.addColorStop(0, `${brandColor}15`);
  glow.addColorStop(0.5, `${brandColor}08`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Desk
  const deskY = h * 0.72;
  const deskGrad = ctx.createLinearGradient(0, deskY, 0, h);
  deskGrad.addColorStop(0, "#1a2a3a");
  deskGrad.addColorStop(0.15, "#0d1a2a");
  deskGrad.addColorStop(1, "#060e18");
  ctx.fillStyle = deskGrad;
  ctx.beginPath();
  ctx.moveTo(w * 0.08, deskY);
  ctx.quadraticCurveTo(w * 0.5, deskY - 15, w * 0.92, deskY);
  ctx.lineTo(w * 0.95, h);
  ctx.lineTo(w * 0.05, h);
  ctx.closePath();
  ctx.fill();

  // Desk edge glow
  ctx.strokeStyle = brandColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6 + Math.sin(frame * 0.03) * 0.15;
  ctx.beginPath();
  ctx.moveTo(w * 0.08, deskY);
  ctx.quadraticCurveTo(w * 0.5, deskY - 15, w * 0.92, deskY);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Screen panels behind presenter (left & right)
  const panelAlpha = 0.3 + Math.sin(frame * 0.02) * 0.05;
  ctx.globalAlpha = panelAlpha;
  // Left screen
  ctx.fillStyle = "#0a1420";
  ctx.strokeStyle = `${brandColor}60`;
  ctx.lineWidth = 1;
  const lx = w * 0.03, ly = h * 0.08, lw = w * 0.25, lh = h * 0.55;
  ctx.fillRect(lx, ly, lw, lh);
  ctx.strokeRect(lx, ly, lw, lh);
  // Chart on left screen
  drawMiniChart(ctx, lx + 10, ly + 30, lw - 20, lh - 50, frame, brandColor);

  // Right screen
  const rx = w * 0.72, ry = h * 0.08, rw = w * 0.25, rh = h * 0.55;
  ctx.fillStyle = "#0a1420";
  ctx.fillRect(rx, ry, rw, rh);
  ctx.strokeRect(rx, ry, rw, rh);
  drawWorldMap(ctx, rx + 10, ry + 30, rw - 20, rh - 50, frame, brandColor);
  ctx.globalAlpha = 1;
}

function drawMiniChart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frame: number, color: string) {
  // Title
  ctx.fillStyle = "#ffffff80";
  ctx.font = `${Math.max(9, w * 0.06)}px system-ui`;
  ctx.fillText("FTSE 100", x + 4, y + 12);
  ctx.fillStyle = "#00d4aa";
  ctx.fillText("▲ 0.82%", x + w * 0.55, y + 12);

  // Chart line
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const points = 40;
  for (let i = 0; i < points; i++) {
    const px = x + (i / (points - 1)) * w;
    const noise = Math.sin(i * 0.3 + frame * 0.01) * 15 + Math.sin(i * 0.7) * 10 + Math.cos(i * 0.15 + frame * 0.005) * 8;
    const py = y + h * 0.5 - noise + (i / points) * -15;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Fill under
  const lastX = x + w;
  const lastY = y + h * 0.5 - Math.sin((points - 1) * 0.3 + frame * 0.01) * 15 - 15;
  ctx.lineTo(lastX, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = `${color}15`;
  ctx.fill();
}

function drawWorldMap(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frame: number, color: string) {
  ctx.fillStyle = "#ffffff50";
  ctx.font = `${Math.max(9, w * 0.06)}px system-ui`;
  ctx.fillText("GLOBAL MARKETS", x + 4, y + 12);

  // Dots representing markets
  const markets = [
    { px: 0.25, py: 0.35, label: "LON" }, { px: 0.15, py: 0.6, label: "NYC" },
    { px: 0.45, py: 0.3, label: "FRA" }, { px: 0.65, py: 0.55, label: "MUM" },
    { px: 0.8, py: 0.3, label: "TYO" }, { px: 0.75, py: 0.4, label: "SHA" },
    { px: 0.35, py: 0.45, label: "DXB" }, { px: 0.85, py: 0.35, label: "SEL" },
  ];
  markets.forEach((m, i) => {
    const pulse = Math.sin(frame * 0.05 + i) * 0.3 + 0.7;
    ctx.fillStyle = `${color}`;
    ctx.globalAlpha = pulse * 0.8;
    ctx.beginPath();
    ctx.arc(x + m.px * w, y + 20 + m.py * (h - 30), 3, 0, Math.PI * 2);
    ctx.fill();
    // Pulse ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = pulse * 0.3;
    ctx.beginPath();
    ctx.arc(x + m.px * w, y + 20 + m.py * (h - 30), 6 + Math.sin(frame * 0.03 + i) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#fff";
    ctx.font = `${Math.max(7, w * 0.04)}px system-ui`;
    ctx.fillText(m.label, x + m.px * w - 8, y + 20 + m.py * (h - 30) + 12);
  });
  ctx.globalAlpha = 1;
}

export default function LiveBroadcast() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);
  const tickerRef = useRef(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBreaking, setShowBreaking] = useState(false);
  const [breakingIdx, setBreakingIdx] = useState(0);
  const [activeHostIdx, setActiveHostIdx] = useState(0);

  const channel = channels.find((c) => c.id === "nur-global")!;
  const channelHosts = hosts.filter((h) => h.channelId === "nur-global");
  const channelShows = shows.filter((s) => s.channelId === "nur-global");
  const channelGuests = guests.filter((g) => g.channelIds.includes("nur-global"));
  const graphics = studioGraphics.find((g) => g.channelId === "nur-global");

  // Cycle hosts every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHostIdx((i) => (i + 1) % channelHosts.length);
    }, 45000);
    return () => clearInterval(interval);
  }, [channelHosts.length]);

  // Clock update
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Breaking news cycle
  useEffect(() => {
    const showTimer = setTimeout(() => setShowBreaking(true), 8000);
    const cycleTimer = setInterval(() => {
      setBreakingIdx((i) => (i + 1) % BREAKING_ALERTS.length);
    }, 15000);
    return () => { clearTimeout(showTimer); clearInterval(cycleTimer); };
  }, []);

  const activeHost = channelHosts[activeHostIdx];
  const presenter = activeHost ? getPresenterConfig(activeHost) : null;

  // Canvas animation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !presenter) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const frame = frameRef.current++;

    drawStudio(ctx, w, h, frame, channel.brandColor);
    drawPresenter(ctx, presenter, w * 0.35, h * 0.85, frame);
    // Offset presenter to center-right area
    // Actually we need to draw to a temp canvas and place it
    // Let's just draw directly at the right position

    animRef.current = requestAnimationFrame(animate);
  }, [presenter, channel.brandColor]);

  // Better animation with proper presenter placement
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !presenter) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const frame = frameRef.current++;

      ctx.save();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const dw = w / window.devicePixelRatio;
      const dh = h / window.devicePixelRatio;

      drawStudio(ctx, dw, dh, frame, channel.brandColor);

      // Draw presenter in center
      ctx.save();
      ctx.translate(dw * 0.25, 0);
      drawPresenter(ctx, presenter, dw * 0.5, dh * 0.7, frame);
      ctx.restore();

      ctx.restore();
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [presenter, channel.brandColor]);

  // Current show based on time
  const now = currentTime;
  const utcHours = now.getUTCHours();
  const utcMins = now.getUTCMinutes();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getUTCDay()];
  const currentShow = channelShows.find((s) => {
    if (!s.schedule.days.includes(today)) return false;
    const [sh, sm] = s.schedule.startUTC.split(":").map(Number);
    const [eh, em] = s.schedule.endUTC.split(":").map(Number);
    const nowMin = utcHours * 60 + utcMins;
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    return nowMin >= startMin && nowMin < endMin;
  }) || channelShows[0];

  const formatTime = (d: Date, tz: string) => {
    try {
      return d.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#000", position: "relative", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Canvas — studio + presenter */}
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      {/* LIVE badge + channel logo */}
      <div style={{ position: "absolute", top: 12, left: 16, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#00d4aa", letterSpacing: 2, textShadow: "0 0 20px rgba(0,212,170,0.5)" }}>
            NUR
          </span>
          <span style={{ fontSize: 12, color: "#ffffff90", fontWeight: 500, letterSpacing: 1 }}>FINANCE</span>
        </div>
        <div style={{
          background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "3px 10px", borderRadius: 3, letterSpacing: 1.5,
          animation: "livePulse 2s infinite",
        }}>
          ● LIVE
        </div>
      </div>

      {/* Clock strip */}
      <div style={{
        position: "absolute", top: 12, right: 16, display: "flex", gap: 16,
        fontSize: 11, color: "#ffffff80", fontFamily: "monospace", zIndex: 10,
      }}>
        <span>🇬🇧 {formatTime(currentTime, "Europe/London")}</span>
        <span>🇺🇸 {formatTime(currentTime, "America/New_York")}</span>
        <span>🇯🇵 {formatTime(currentTime, "Asia/Tokyo")}</span>
        <span style={{ color: "#ffffff50" }}>UTC {formatTime(currentTime, "UTC")}</span>
      </div>

      {/* Current show info */}
      {currentShow && (
        <div style={{
          position: "absolute", top: 42, left: 16, zIndex: 10,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          padding: "6px 14px", borderRadius: 6, borderLeft: `3px solid ${channel.brandColor}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{currentShow.name}</div>
          <div style={{ fontSize: 10, color: "#ffffff70" }}>
            {currentShow.schedule.startUTC}–{currentShow.schedule.endUTC} UTC · {currentShow.format}
          </div>
        </div>
      )}

      {/* Lower third — presenter name */}
      {activeHost && (
        <div style={{
          position: "absolute", bottom: 80, left: 0, zIndex: 10,
          display: "flex", alignItems: "stretch",
        }}>
          <div style={{
            background: channel.brandColor, padding: "8px 20px",
            display: "flex", alignItems: "center",
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>
              {activeHost.firstName} {activeHost.lastName}
            </span>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
            padding: "8px 16px", display: "flex", alignItems: "center",
            borderRight: `2px solid ${channel.brandColor}40`,
          }}>
            <span style={{ fontSize: 11, color: "#ffffff90" }}>
              {activeHost.specializations.slice(0, 2).join(" · ")} · {channel.name}
            </span>
          </div>
        </div>
      )}

      {/* Breaking news banner */}
      {showBreaking && (
        <div style={{
          position: "absolute", bottom: 46, left: 0, right: 0, zIndex: 10,
          background: BREAKING_ALERTS[breakingIdx].urgency === "flash" ? "#dc2626" : "#b91c1c",
          display: "flex", alignItems: "center", height: 32,
        }}>
          <div style={{
            background: "#fff", color: "#dc2626", fontWeight: 800, fontSize: 11,
            padding: "0 12px", height: "100%", display: "flex", alignItems: "center",
            letterSpacing: 1.5,
          }}>
            BREAKING
          </div>
          <div style={{
            flex: 1, overflow: "hidden", padding: "0 16px",
            fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: 0.3,
            whiteSpace: "nowrap",
          }}>
            {BREAKING_ALERTS[breakingIdx].text}
          </div>
        </div>
      )}

      {/* News ticker */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 44,
        background: "rgba(0,8,20,0.92)", borderTop: `1px solid ${channel.brandColor}30`,
        display: "flex", alignItems: "center", zIndex: 10,
      }}>
        <div style={{
          background: channel.brandColor, color: "#fff", fontWeight: 700,
          fontSize: 10, padding: "0 12px", height: "100%", display: "flex",
          alignItems: "center", letterSpacing: 1.5, flexShrink: 0,
        }}>
          NUR FINANCE
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", gap: 60, whiteSpace: "nowrap",
            animation: "tickerScroll 120s linear infinite",
            fontSize: 12, color: "#ffffffcc", fontWeight: 500,
          }}>
            {[...TICKER_HEADLINES, ...TICKER_HEADLINES].map((h, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: channel.brandColor, fontSize: 8 }}>◆</span>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar — market data */}
      <div style={{
        position: "absolute", top: 80, right: 0, width: 180, bottom: 80,
        background: "rgba(0,8,20,0.75)", backdropFilter: "blur(8px)",
        borderLeft: `1px solid ${channel.brandColor}20`, zIndex: 10,
        padding: "10px 0", overflowY: "auto",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#ffffff50", padding: "0 12px 8px", letterSpacing: 2 }}>
          MARKETS
        </div>
        {[
          { symbol: "FTSE 100", price: "8,234.50", change: "+0.82%", up: true },
          { symbol: "S&P 500", price: "5,567.20", change: "+0.41%", up: true },
          { symbol: "NASDAQ", price: "17,890.30", change: "+0.63%", up: true },
          { symbol: "DAX", price: "18,890.10", change: "+0.52%", up: true },
          { symbol: "Nikkei 225", price: "38,420.00", change: "-1.38%", up: false },
          { symbol: "EUR/USD", price: "1.0892", change: "+0.28%", up: true },
          { symbol: "GBP/USD", price: "1.2845", change: "+0.15%", up: true },
          { symbol: "USD/JPY", price: "148.20", change: "-1.82%", up: false },
          { symbol: "Gold", price: "2,418.50", change: "+1.22%", up: true },
          { symbol: "Brent", price: "82.40", change: "+0.58%", up: true },
          { symbol: "Bitcoin", price: "67,420", change: "+2.84%", up: true },
          { symbol: "VIX", price: "14.20", change: "-3.40%", up: false },
        ].map((m) => (
          <div key={m.symbol} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            fontSize: 11,
          }}>
            <div>
              <div style={{ color: "#ffffffcc", fontWeight: 600, fontSize: 10 }}>{m.symbol}</div>
              <div style={{ color: "#ffffff60", fontSize: 9, fontFamily: "monospace" }}>{m.price}</div>
            </div>
            <span style={{
              color: m.up ? "#00d4aa" : "#ef4444", fontWeight: 700, fontSize: 10,
              fontFamily: "monospace",
            }}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
