"use client";

import { useEffect, useRef } from "react";

interface FinancialMatrixRainProps {
  opacity?: number;
  speed?: number;
}

const SYMBOLS_POOL = [
  // Live Borsa & Ticker Strings
  "NVDA 128.40 ▲", "AAPL 224.50 ▲", "BTC 68,450 ▲", "ETH 3,520 ▲",
  "XAU/USD 2,530 ▲", "EUR/USD 1.0914", "SPX 5,742.8 ▲", "NQ 19,850 ▲",
  "BIST 10,240 ▲", "DAX 18,920 ▲", "+4.82%", "+14.85%", "Δ+0.65", "Γ0.14",
  "Θ-0.04", "ν0.28", "KELLY f*0.22", "SHARPE 2.84", "VaR99",

  // Fibonacci & Sacred Mathematical Constants
  "φ 1.618033", "0.618", "233", "377", "610", "987", "1597", "2584", "4181",
  "∑(P×Q)", "∫e^-rt", "σ√t", "ln(S/K)", "100K€ UMAY FUND",

  // Renaissance Esoteric & Imperial Latin Maxims
  "DOMINUS ORIENTIS ET OCCIDENTIS", "AURUM POTESTAS EST", "VERITAS VINCIT",
  "SAPIENTIA ET VIRTUS", "UMAY GÜL NUR", "NUR FINANCE SOVEREIGN",
  "FORTUNA FAVET FORTIBUS", "DEUS REX REGUM", "NUR CAPITAL",
];

export default function FinancialMatrixRain({ opacity = 0.075, speed = 1 }: FinancialMatrixRainProps) {
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
    const colWidth = 36;
    const columns = Math.floor(width / colWidth);
    
    // Track drop positions and individual speeds
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -60));
    const columnSpeeds: number[] = Array.from({ length: columns }, () => 0.6 + Math.random() * 0.8);
    const columnSymbols: string[] = Array.from({ length: columns }, () =>
      SYMBOLS_POOL[Math.floor(Math.random() * SYMBOLS_POOL.length)]
    );

    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for optimal battery and performance

    function draw(currentTime: number) {
      animId = requestAnimationFrame(draw);
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      if (!ctx) return;

      // Soft fading trail (obsidian black)
      ctx.fillStyle = "rgba(4, 6, 12, 0.16)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = columnSymbols[i];
        const x = i * colWidth;
        const y = drops[i] * (fontSize + 3);

        const isHead = Math.random() > 0.82;
        const isLatinOrCrest =
          text.includes("DOMINUS") ||
          text.includes("UMAY") ||
          text.includes("1.618") ||
          text.includes("100K");

        if (isHead) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.shadowColor = "rgba(0, 212, 170, 0.8)";
          ctx.shadowBlur = 6;
        } else if (isLatinOrCrest) {
          ctx.fillStyle = "rgba(251, 191, 36, 0.85)"; // Renaissance Gold
          ctx.shadowColor = "rgba(251, 191, 36, 0.4)";
          ctx.shadowBlur = 3;
        } else if (text.includes("▲") || text.includes("+")) {
          ctx.fillStyle = "rgba(0, 212, 170, 0.75)"; // Emerald Green
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(0, 212, 170, 0.38)"; // Subtle Quant Stream
          ctx.shadowBlur = 0;
        }

        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0; // reset

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
          columnSymbols[i] = SYMBOLS_POOL[Math.floor(Math.random() * SYMBOLS_POOL.length)];
          columnSpeeds[i] = 0.6 + Math.random() * 0.8;
        }
        drops[i] += speed * columnSpeeds[i];
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

