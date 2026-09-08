"use client";

import { useEffect, useRef } from "react";

type MoodType = "bull" | "bear" | "neutral" | "volatile";

interface MarketMoodSceneProps {
  mood: MoodType;
  size?: number;
  className?: string;
}

export default function MarketMoodScene({ mood, size = 200, className = "" }: MarketMoodSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    function drawBull(f: number) {
      if (!ctx) return;
      const cx = size / 2;
      const ground = size * 0.78;

      // Sky gradient - sunny meadow
      const skyGrad = ctx.createLinearGradient(0, 0, 0, ground);
      skyGrad.addColorStop(0, "#87CEEB");
      skyGrad.addColorStop(1, "#E0F7FA");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, size, ground);

      // Sun
      const sunPulse = Math.sin(f * 0.02) * 2;
      ctx.beginPath();
      ctx.arc(size * 0.8, size * 0.15, 14 + sunPulse, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD54F";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(size * 0.8, size * 0.15, 20 + sunPulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,213,79,0.15)";
      ctx.fill();

      // Ground
      const groundGrad = ctx.createLinearGradient(0, ground, 0, size);
      groundGrad.addColorStop(0, "#66BB6A");
      groundGrad.addColorStop(1, "#43A047");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, ground, size, size - ground);

      // Grass tufts
      for (let i = 0; i < 12; i++) {
        const gx = (i / 12) * size + Math.sin(f * 0.01 + i) * 2;
        const sway = Math.sin(f * 0.03 + i * 0.7) * 2;
        ctx.beginPath();
        ctx.moveTo(gx, ground);
        ctx.quadraticCurveTo(gx + sway, ground - 8, gx + 2, ground);
        ctx.strokeStyle = "#388E3C";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Flowers
      for (let i = 0; i < 5; i++) {
        const fx = 15 + i * (size / 5);
        const fy = ground + 5;
        ctx.beginPath();
        ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#F44336" : "#FFEB3B";
        ctx.fill();
      }

      // Bull body
      const bounce = Math.sin(f * 0.04) * 2;
      const headBob = Math.sin(f * 0.06) * 3;
      const tailWag = Math.sin(f * 0.08) * 8;
      const by = ground - 22 + bounce;

      // Body
      ctx.beginPath();
      ctx.ellipse(cx, by, 22, 14, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#8B4513";
      ctx.fill();

      // Legs (walking animation)
      const legPhase = f * 0.06;
      for (let i = 0; i < 4; i++) {
        const lx = cx - 12 + i * 8;
        const swing = Math.sin(legPhase + i * Math.PI / 2) * 3;
        ctx.beginPath();
        ctx.moveTo(lx, by + 10);
        ctx.lineTo(lx + swing, ground);
        ctx.strokeStyle = "#5D3A1A";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Head (grazing/happy)
      const hx = cx - 26;
      const hy = by - 5 + headBob;
      ctx.beginPath();
      ctx.ellipse(hx, hy, 10, 8, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "#A0522D";
      ctx.fill();

      // Horns
      ctx.beginPath();
      ctx.moveTo(hx - 5, hy - 7);
      ctx.quadraticCurveTo(hx - 10, hy - 16, hx - 3, hy - 14);
      ctx.strokeStyle = "#D4A05A";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(hx + 3, hy - 7);
      ctx.quadraticCurveTo(hx + 8, hy - 16, hx + 5, hy - 14);
      ctx.stroke();

      // Eye (happy - closed arc)
      ctx.beginPath();
      ctx.arc(hx - 3, hy - 2, 2, 0, Math.PI);
      ctx.strokeStyle = "#2E1503";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Smile
      ctx.beginPath();
      ctx.arc(hx - 5, hy + 2, 3, 0, Math.PI);
      ctx.strokeStyle = "#2E1503";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(cx + 20, by - 5);
      ctx.quadraticCurveTo(cx + 30 + tailWag, by - 15, cx + 28 + tailWag, by - 20);
      ctx.strokeStyle = "#5D3A1A";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Sparkles around bull (celebration)
      for (let i = 0; i < 3; i++) {
        const sparkAlpha = Math.max(0, Math.sin(f * 0.05 + i * 2));
        const sx = cx - 30 + i * 25 + Math.sin(f * 0.02 + i) * 5;
        const sy = by - 30 - i * 8 + Math.cos(f * 0.03 + i) * 3;
        ctx.fillStyle = `rgba(0,212,170,${sparkAlpha * 0.8})`;
        ctx.fillText("*", sx, sy);
      }
    }

    function drawBear(f: number) {
      if (!ctx) return;
      const caveTop = size * 0.25;
      const ground = size * 0.85;

      // Dark cave background
      const caveGrad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size * 0.6);
      caveGrad.addColorStop(0, "#2d1b0e");
      caveGrad.addColorStop(1, "#0d0805");
      ctx.fillStyle = caveGrad;
      ctx.fillRect(0, 0, size, size);

      // Cave arch
      ctx.beginPath();
      ctx.moveTo(0, caveTop + 20);
      ctx.quadraticCurveTo(size / 2, caveTop - 30, size, caveTop + 20);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = "#1a0f06";
      ctx.fill();

      // Stalactites
      for (let i = 0; i < 6; i++) {
        const sx = 15 + i * (size / 6);
        const sh = 10 + Math.sin(i * 2.3) * 8;
        ctx.beginPath();
        ctx.moveTo(sx - 3, caveTop);
        ctx.lineTo(sx, caveTop + sh);
        ctx.lineTo(sx + 3, caveTop);
        ctx.closePath();
        ctx.fillStyle = "#3d2b1a";
        ctx.fill();
      }

      // Cave floor
      ctx.fillStyle = "#1a1008";
      ctx.fillRect(0, ground, size, size - ground);

      // Bear body (sleeping)
      const cx = size * 0.45;
      const by = ground - 12;
      const breathe = Math.sin(f * 0.025) * 2;

      // Body (lying down)
      ctx.beginPath();
      ctx.ellipse(cx, by, 28, 14 + breathe, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#4a3728";
      ctx.fill();

      // Head (resting)
      ctx.beginPath();
      ctx.ellipse(cx - 22, by - 3, 12, 10, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = "#3d2b1a";
      ctx.fill();

      // Ears
      ctx.beginPath();
      ctx.arc(cx - 30, by - 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3d2b1a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 18, by - 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3d2b1a";
      ctx.fill();

      // Closed eyes (sleeping)
      ctx.beginPath();
      ctx.moveTo(cx - 27, by - 4);
      ctx.lineTo(cx - 23, by - 4);
      ctx.strokeStyle = "#1a0f06";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Nose
      ctx.beginPath();
      ctx.ellipse(cx - 33, by - 1, 3, 2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1a0f06";
      ctx.fill();

      // Paws
      ctx.beginPath();
      ctx.ellipse(cx - 10, by + 10, 6, 4, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#3d2b1a";
      ctx.fill();

      // Snoring "Z"s
      const zCount = 3;
      for (let i = 0; i < zCount; i++) {
        const phase = (f * 0.02 + i * 1.5) % 4;
        if (phase > 3) continue;
        const zx = cx - 38 + phase * 4;
        const zy = by - 12 - phase * 12;
        const alpha = Math.max(0, 1 - phase / 3);
        const zSize = 6 + phase * 2;
        ctx.font = `bold ${zSize}px monospace`;
        ctx.fillStyle = `rgba(148,163,184,${alpha * 0.7})`;
        ctx.fillText("Z", zx, zy);
      }

      // Dim firefly/ember
      const emberAlpha = Math.sin(f * 0.03) * 0.3 + 0.3;
      ctx.beginPath();
      ctx.arc(size * 0.8, size * 0.5, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,158,11,${emberAlpha})`;
      ctx.fill();
    }

    function drawNeutral(f: number) {
      if (!ctx) return;
      // Calm city skyline at dusk
      const skyGrad = ctx.createLinearGradient(0, 0, 0, size);
      skyGrad.addColorStop(0, "#1a1b3a");
      skyGrad.addColorStop(0.5, "#2d3561");
      skyGrad.addColorStop(1, "#1e293b");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, size, size);

      // Stars
      for (let i = 0; i < 8; i++) {
        const twinkle = Math.sin(f * 0.04 + i * 3) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(20 + i * 22, 10 + (i % 3) * 15, 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${twinkle * 0.6})`;
        ctx.fill();
      }

      // Buildings
      const bh = [0.4, 0.55, 0.35, 0.6, 0.45, 0.5, 0.38];
      const bw = size / bh.length;
      for (let i = 0; i < bh.length; i++) {
        const h = size * bh[i];
        const y = size - h;
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(i * bw + 2, y, bw - 4, h);

        // Windows
        for (let wy = y + 6; wy < size - 10; wy += 8) {
          for (let wx = i * bw + 5; wx < (i + 1) * bw - 3; wx += 6) {
            const lit = Math.sin(f * 0.01 + wx * wy) > 0.3;
            ctx.fillStyle = lit ? "rgba(245,203,66,0.5)" : "rgba(30,41,59,0.5)";
            ctx.fillRect(wx, wy, 3, 4);
          }
        }
      }

      // Ticker line at bottom
      const tickerY = size - 8;
      ctx.fillStyle = "rgba(0,212,170,0.1)";
      ctx.fillRect(0, tickerY - 2, size, 10);
      ctx.beginPath();
      ctx.moveTo(0, tickerY);
      for (let x = 0; x < size; x += 2) {
        const y = tickerY + Math.sin(f * 0.02 + x * 0.05) * 3;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(0,212,170,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawVolatile(f: number) {
      if (!ctx) return;
      // Stormy scene
      const skyGrad = ctx.createLinearGradient(0, 0, 0, size);
      skyGrad.addColorStop(0, "#0f0f1a");
      skyGrad.addColorStop(0.5, "#1a1a2e");
      skyGrad.addColorStop(1, "#16213e");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, size, size);

      // Lightning flash
      const flash = Math.sin(f * 0.1) > 0.95;
      if (flash) {
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(0, 0, size, size);

        // Lightning bolt
        const lx = size * 0.3 + Math.sin(f) * size * 0.3;
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx - 5, size * 0.3);
        ctx.lineTo(lx + 3, size * 0.3);
        ctx.lineTo(lx - 8, size * 0.6);
        ctx.strokeStyle = "rgba(255,255,200,0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Rain
      for (let i = 0; i < 20; i++) {
        const rx = (i * 11 + f * 2) % size;
        const ry = (i * 17 + f * 4) % size;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 1, ry + 6);
        ctx.strokeStyle = "rgba(100,116,139,0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Volatile chart
      const chartY = size * 0.5;
      ctx.beginPath();
      ctx.moveTo(0, chartY);
      for (let x = 0; x < size; x += 2) {
        const volatility = Math.sin(f * 0.05 + x * 0.1) * 20 + Math.cos(f * 0.03 + x * 0.2) * 15;
        ctx.lineTo(x, chartY + volatility);
      }
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Warning text
      const warningAlpha = Math.sin(f * 0.06) * 0.3 + 0.5;
      ctx.font = `bold ${size * 0.06}px monospace`;
      ctx.fillStyle = `rgba(239,68,68,${warningAlpha})`;
      ctx.textAlign = "center";
      ctx.fillText("HIGH VOLATILITY", size / 2, size * 0.88);
      ctx.textAlign = "start";
    }

    function loop() {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);

      switch (mood) {
        case "bull": drawBull(frameRef.current); break;
        case "bear": drawBear(frameRef.current); break;
        case "volatile": drawVolatile(frameRef.current); break;
        default: drawNeutral(frameRef.current); break;
      }

      frameRef.current++;
      rafRef.current = requestAnimationFrame(loop);
    }

    loop();
    return () => cancelAnimationFrame(rafRef.current);
  }, [mood, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
