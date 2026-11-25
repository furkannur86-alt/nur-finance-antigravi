"use client";

import { useEffect, useState } from "react";

const HEADLINES = [
  { text: "Fed holds rates steady at 5.25%, signals Q2 2027 cut", source: "Reuters" },
  { text: "S&P 500 hits all-time high amid tech earnings surge", source: "Bloomberg" },
  { text: "ECB inflation target within reach as CPI falls to 2.1%", source: "WSJ" },
  { text: "Oil prices surge 4% on OPEC+ surprise production cut", source: "BBC" },
  { text: "China GDP growth beats estimates at 5.4% annualized", source: "Bloomberg" },
];

export default function BackgroundGlobe({ opacity = 0.08 }: { opacity?: number }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let frame: number;
    let last = performance.now();
    const animate = (now: number) => {
      const dt = now - last;
      last = now;
      setRotation(prev => (prev + dt * 0.003) % 360); // very slow: ~1 rotation per 2 minutes
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0, opacity }}
    >
      {/* Globe sphere */}
      <div
        className="absolute"
        style={{
          width: "min(80vw, 80vh)",
          height: "min(80vw, 80vh)",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
      >
        {/* Main sphere outline */}
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ filter: "blur(0.5px)" }}
        >
          {/* Outer circle */}
          <circle cx="200" cy="200" r="195" fill="none" stroke="#00d4aa" strokeWidth="0.5" opacity="0.4" />

          {/* Latitude lines */}
          {[-60, -30, 0, 30, 60].map(lat => {
            const y = 200 + (lat / 90) * 180;
            const rx = Math.cos((lat * Math.PI) / 180) * 195;
            return (
              <ellipse key={lat} cx="200" cy={y} rx={rx} ry={rx * 0.15} fill="none" stroke="#00d4aa" strokeWidth="0.3" opacity="0.25" />
            );
          })}

          {/* Longitude lines (rotating) */}
          {[0, 30, 60, 90, 120, 150].map(lng => {
            const angle = ((lng + rotation) * Math.PI) / 180;
            const rx = Math.abs(Math.cos(angle)) * 195;
            return (
              <ellipse key={lng} cx="200" cy="200" rx={Math.max(rx, 2)} ry="195" fill="none" stroke="#00d4aa" strokeWidth="0.3" opacity="0.2" />
            );
          })}

          {/* Dot markers for major financial centers */}
          {[
            { x: 150, y: 120, label: "NYC" },
            { x: 220, y: 115, label: "LDN" },
            { x: 310, y: 150, label: "TKY" },
            { x: 240, y: 130, label: "FRA" },
            { x: 280, y: 170, label: "HKG" },
            { x: 300, y: 160, label: "SGP" },
            { x: 190, y: 125, label: "ZRH" },
          ].map((dot, i) => (
            <g key={i}>
              <circle cx={dot.x} cy={dot.y} r="2" fill="#00d4aa" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>
              <text x={dot.x + 5} y={dot.y + 1} fontSize="6" fill="#00d4aa" opacity="0.4" fontFamily="monospace">{dot.label}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Floating headlines — subtle, below panels */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="flex gap-6 px-8 py-2 max-w-[90vw] overflow-hidden">
          {HEADLINES.map((h, i) => (
            <div
              key={i}
              className="flex-shrink-0 text-[9px] font-mono whitespace-nowrap"
              style={{
                color: "#00d4aa",
                opacity: 0.4,
                animation: `bgHeadlineFloat ${20 + i * 2}s linear infinite`,
                animationDelay: `${i * 4}s`,
              }}
            >
              <span style={{ color: "#334155" }}>{h.source}</span>{" "}
              {h.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bgHeadlineFloat {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
      `}</style>
    </div>
  );
}
