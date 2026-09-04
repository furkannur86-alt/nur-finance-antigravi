"use client";

import { useEffect, useRef } from "react";

interface FinancialMatrixRainProps {
  opacity?: number;
  speed?: number;
}

const SYMBOLS = [
  "AAPL", "NVDA", "SPX", "BTC", "ETH", "GOLD", "EUR", "USD", "JPY", "NQ",
  "1.618", "0.618", "+3.42%", "+14.8%", "Δ+0.45", "Γ0.12", "Θ-0.08", "ν0.24",
  "DOMINUS", "ORIENTIS", "OCCIDENTIS", "VERITAS", "SAPIENTIA", "NUR", "5742.8",
  "100K€", "1M€", "KELLY", "SHARPE", "SORTINO", "VAR99", "DOM", "L2", "VWAP",
];

export default function FinancialMatrixRain({ opacity = 0.08, speed = 1 }: FinancialMatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const fontSize = 11;
    const columns = Math.floor(width / 32);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const columnSymbols: string[] = Array.from({ length: columns }, () =>
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    );

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for optimal battery and performance

    function draw(currentTime: number) {
      animId = requestAnimationFrame(draw);
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      if (!ctx) return;

      // Subtle trail fade
      ctx.fillStyle = "rgba(5, 8, 17, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = columnSymbols[i];
        const x = i * 32;
        const y = drops[i] * fontSize;

        // Head of stream is brighter gold/cyan
        const isHead = Math.random() > 0.85;
        if (isHead) {
          ctx.fillStyle = "rgba(0, 212, 170, 0.9)";
        } else if (text.includes("DOMINUS") || text.includes("100K") || text.includes("NUR")) {
          ctx.fillStyle = "rgba(251, 191, 36, 0.7)";
        } else {
          ctx.fillStyle = "rgba(0, 212, 170, 0.4)";
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
          columnSymbols[i] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }
        drops[i] += speed;
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 select-none"
      style={{ opacity }}
    />
  );
}
