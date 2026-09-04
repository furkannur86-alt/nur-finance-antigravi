"use client";

import { useEffect, useRef } from "react";

interface AudioSpectrumVisualizerProps {
  height?: number;
  barColor?: string;
  isPlaying?: boolean;
}

export default function AudioSpectrumVisualizer({
  height = 48,
  barColor = "#00d4aa",
  isPlaying = true,
}: AudioSpectrumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const barCount = 32;

    function render() {
      if (!ctx || !canvas) return;
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      const barWidth = (width / barCount) * 0.7;
      const gap = (width / barCount) * 0.3;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          const wave1 = Math.sin(tick * 0.05 + i * 0.2) * 0.5 + 0.5;
          const wave2 = Math.cos(tick * 0.08 + i * 0.4) * 0.5 + 0.5;
          barHeight = Math.max(4, (wave1 * 0.6 + wave2 * 0.4) * (h - 6));
        }

        const x = i * (barWidth + gap);
        const y = h - barHeight;

        const grad = ctx.createLinearGradient(0, y, 0, h);
        grad.addColorStop(0, barColor);
        grad.addColorStop(1, "rgba(99, 102, 241, 0.4)");

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      tick++;
      animFrameRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, barColor]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={height}
      className="w-full rounded bg-black/40 border"
      style={{ height, borderColor: "var(--ag-border)" }}
    />
  );
}
