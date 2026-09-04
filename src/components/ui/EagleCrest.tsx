"use client";

import { useEffect, useRef } from "react";

interface EagleCrestProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function EagleCrest({ size = 48, animate = true, className = "" }: EagleCrestProps) {
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

    function draw(frame: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.42;
      const breathe = animate ? Math.sin(frame * 0.03) * 1.5 : 0;
      const wingFlap = animate ? Math.sin(frame * 0.05) * 3 : 0;

      ctx.save();
      ctx.translate(cx, cy + breathe * 0.3);

      // Shield background
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.85);
      ctx.bezierCurveTo(r * 0.7, -r * 0.85, r * 0.85, -r * 0.4, r * 0.85, 0);
      ctx.bezierCurveTo(r * 0.85, r * 0.5, r * 0.4, r * 0.9, 0, r);
      ctx.bezierCurveTo(-r * 0.4, r * 0.9, -r * 0.85, r * 0.5, -r * 0.85, 0);
      ctx.bezierCurveTo(-r * 0.85, -r * 0.4, -r * 0.7, -r * 0.85, 0, -r * 0.85);
      ctx.closePath();
      const shieldGrad = ctx.createLinearGradient(0, -r, 0, r);
      shieldGrad.addColorStop(0, "#1a1f2e");
      shieldGrad.addColorStop(1, "#0d1117");
      ctx.fillStyle = shieldGrad;
      ctx.fill();
      ctx.strokeStyle = "#00d4aa";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, r * 0.1, r * 0.18, r * 0.35, 0, 0, Math.PI * 2);
      const bodyGrad = ctx.createLinearGradient(0, -r * 0.25, 0, r * 0.45);
      bodyGrad.addColorStop(0, "#c4a35a");
      bodyGrad.addColorStop(1, "#8b6914");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Left wing
      ctx.save();
      ctx.translate(-r * 0.15, r * 0.05);
      ctx.rotate((-25 + wingFlap) * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * 0.3, -r * 0.2, -r * 0.6, -r * 0.4, -r * 0.55, -r * 0.1);
      ctx.bezierCurveTo(-r * 0.5, r * 0.1, -r * 0.2, r * 0.15, 0, r * 0.1);
      ctx.closePath();
      ctx.fillStyle = "#c4a35a";
      ctx.fill();
      // Feather lines
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        const t = i / 5;
        ctx.moveTo(-r * 0.1 * t, -r * 0.05 * t);
        ctx.lineTo(-r * 0.5 * t, -r * 0.3 * t);
        ctx.strokeStyle = "rgba(139,105,20,0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Right wing (mirror)
      ctx.save();
      ctx.translate(r * 0.15, r * 0.05);
      ctx.rotate((25 - wingFlap) * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r * 0.3, -r * 0.2, r * 0.6, -r * 0.4, r * 0.55, -r * 0.1);
      ctx.bezierCurveTo(r * 0.5, r * 0.1, r * 0.2, r * 0.15, 0, r * 0.1);
      ctx.closePath();
      ctx.fillStyle = "#c4a35a";
      ctx.fill();
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        const t = i / 5;
        ctx.moveTo(r * 0.1 * t, -r * 0.05 * t);
        ctx.lineTo(r * 0.5 * t, -r * 0.3 * t);
        ctx.strokeStyle = "rgba(139,105,20,0.6)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Left head
      ctx.save();
      ctx.translate(-r * 0.12, -r * 0.25);
      ctx.rotate(-15 * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.08, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c4a35a";
      ctx.fill();
      // Beak left
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, -r * 0.02);
      ctx.lineTo(-r * 0.16, r * 0.01);
      ctx.lineTo(-r * 0.08, r * 0.03);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      // Eye
      ctx.beginPath();
      ctx.arc(-r * 0.02, -r * 0.02, r * 0.015, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.restore();

      // Right head (mirror)
      ctx.save();
      ctx.translate(r * 0.12, -r * 0.25);
      ctx.rotate(15 * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.08, r * 0.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#c4a35a";
      ctx.fill();
      // Beak right
      ctx.beginPath();
      ctx.moveTo(r * 0.08, -r * 0.02);
      ctx.lineTo(r * 0.16, r * 0.01);
      ctx.lineTo(r * 0.08, r * 0.03);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();
      // Eye
      ctx.beginPath();
      ctx.arc(r * 0.02, -r * 0.02, r * 0.015, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.restore();

      // Crown
      ctx.beginPath();
      ctx.moveTo(-r * 0.1, -r * 0.38);
      ctx.lineTo(-r * 0.06, -r * 0.5);
      ctx.lineTo(-r * 0.02, -r * 0.42);
      ctx.lineTo(r * 0.02, -r * 0.52);
      ctx.lineTo(r * 0.06, -r * 0.42);
      ctx.lineTo(r * 0.1, -r * 0.5);
      ctx.lineTo(r * 0.14, -r * 0.38);
      ctx.lineTo(-r * 0.1, -r * 0.38);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      // Tail feathers
      ctx.beginPath();
      ctx.moveTo(-r * 0.1, r * 0.4);
      ctx.lineTo(-r * 0.15, r * 0.65);
      ctx.lineTo(-r * 0.05, r * 0.6);
      ctx.lineTo(0, r * 0.7);
      ctx.lineTo(r * 0.05, r * 0.6);
      ctx.lineTo(r * 0.15, r * 0.65);
      ctx.lineTo(r * 0.1, r * 0.4);
      ctx.closePath();
      ctx.fillStyle = "#8b6914";
      ctx.fill();

      // "NF" monogram on chest
      ctx.fillStyle = "#00d4aa";
      ctx.font = `bold ${r * 0.18}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NF", 0, r * 0.15);

      // Glow pulse
      if (animate) {
        const glowAlpha = 0.08 + Math.sin(frame * 0.04) * 0.06;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,212,170,${glowAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
    }

    function loop() {
      draw(frameRef.current);
      frameRef.current++;
      rafRef.current = requestAnimationFrame(loop);
    }

    if (animate) {
      loop();
    } else {
      draw(0);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [size, animate]);

  return (
    <div
      className={`relative inline-flex items-center justify-center group ${className}`}
      title="DOMINUS ORIENTIS ET OCCIDENTIS (Doğunun ve Batının Hâkimi) — NUR Finance"
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
      />
      <div className="absolute -bottom-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[8px] font-mono font-bold tracking-widest text-amber-300 whitespace-nowrap bg-black/80 px-1 rounded border border-amber-500/30">
        DOMINUS ORIENTIS ET OCCIDENTIS
      </div>
    </div>
  );
}
