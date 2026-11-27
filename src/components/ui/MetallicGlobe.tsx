"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface MetallicGlobeProps {
  width?: number;
  height?: number;
  headlines?: string[];
  className?: string;
  rotationSpeed?: number;
}

const CONTINENT_PATHS: [number, number][][] = [
  // Europe
  [[-10,36],[-5,36],[0,38],[3,43],[5,44],[10,45],[13,45],[16,46],[20,40],[22,37],[26,35],[28,37],[30,41],[28,46],[24,48],[20,48],[14,48],[10,54],[12,56],[10,58],[5,53],[2,51],[-5,48],[-8,44],[-10,36]],
  // Africa
  [[-17,15],[-15,12],[-8,5],[-5,4],[5,4],[10,2],[12,0],[15,-2],[20,-5],[30,-10],[35,-15],[38,-20],[35,-26],[30,-30],[28,-33],[20,-35],[15,-30],[12,-25],[10,-15],[5,-5],[2,5],[-5,5],[-10,8],[-15,12],[-17,15]],
  // Asia
  [[28,37],[35,32],[40,28],[45,25],[50,25],[55,25],[60,25],[65,30],[70,30],[75,28],[80,22],[85,20],[90,22],[95,18],[100,15],[105,10],[110,20],[115,25],[120,30],[125,35],[130,38],[135,40],[140,43],[145,45],[142,50],[135,55],[128,55],[120,55],[110,55],[100,55],[90,52],[80,50],[70,45],[60,42],[50,40],[40,42],[35,37],[28,37]],
  // North America
  [[-170,65],[-165,60],[-150,60],[-140,55],[-130,50],[-125,48],[-120,35],[-115,30],[-105,25],[-100,20],[-95,18],[-90,20],[-85,25],[-80,25],[-75,30],[-70,42],[-65,45],[-60,48],[-55,50],[-65,55],[-75,58],[-80,60],[-90,62],[-100,65],[-120,70],[-140,70],[-160,68],[-170,65]],
  // South America
  [[-80,10],[-75,12],[-70,12],[-65,10],[-60,5],[-55,2],[-50,0],[-45,-5],[-40,-10],[-38,-15],[-40,-22],[-45,-25],[-50,-28],[-55,-30],[-60,-35],[-65,-40],[-68,-50],[-70,-55],[-73,-50],[-75,-40],[-78,-30],[-80,-15],[-80,-5],[-78,2],[-80,10]],
  // Australia
  [[115,-35],[118,-32],[122,-28],[128,-25],[132,-15],[135,-12],[138,-15],[142,-12],[148,-18],[150,-22],[153,-25],[152,-28],[148,-33],[142,-38],[138,-36],[135,-35],[130,-33],[125,-34],[120,-35],[115,-35]],
];

function latLonToScreen(
  lat: number, lon: number, rotation: number, cx: number, cy: number, r: number
): { x: number; y: number; visible: boolean } {
  const phi = (lat * Math.PI) / 180;
  const lam = ((lon + rotation) * Math.PI) / 180;
  const x3d = Math.cos(phi) * Math.sin(lam);
  const y3d = -Math.sin(phi);
  const z3d = Math.cos(phi) * Math.cos(lam);
  return {
    x: cx + x3d * r,
    y: cy + y3d * r,
    visible: z3d > -0.05,
  };
}

export default function MetallicGlobe({
  width = 300,
  height = 300,
  headlines = [],
  className = "",
  rotationSpeed = 0.15,
}: MetallicGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState(false);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    if (c.width !== width * dpr || c.height !== height * dpr) {
      c.width = width * dpr;
      c.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy) * 0.85;
    const rot = rotRef.current;

    // Shadow beneath
    const shadowGrad = ctx.createRadialGradient(cx, cy + r * 0.9, r * 0.2, cx, cy + r * 0.9, r * 0.7);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0.3)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, cy + r * 0.5, width, height * 0.4);

    // Metallic sphere body
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Base dark metal gradient
    const baseGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    baseGrad.addColorStop(0, "#4a5568");
    baseGrad.addColorStop(0.3, "#2d3748");
    baseGrad.addColorStop(0.6, "#1a202c");
    baseGrad.addColorStop(0.85, "#0d1117");
    baseGrad.addColorStop(1, "#050709");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Specular highlight (top-left)
    const specGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 0, cx - r * 0.35, cy - r * 0.35, r * 0.6);
    specGrad.addColorStop(0, "rgba(200,210,220,0.25)");
    specGrad.addColorStop(0.3, "rgba(160,170,180,0.1)");
    specGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = specGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Grid lines (latitude)
    ctx.strokeStyle = "rgba(100,130,160,0.08)";
    ctx.lineWidth = 0.5;
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      for (let lon = -180; lon <= 180; lon += 3) {
        const p = latLonToScreen(lat, lon, rot, cx, cy, r);
        if (!p.visible) continue;
        if (lon === -180 || !latLonToScreen(lat, lon - 3, rot, cx, cy, r).visible) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }
    // Grid lines (longitude)
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      for (let lat = -80; lat <= 80; lat += 3) {
        const p = latLonToScreen(lat, lon, rot, cx, cy, r);
        if (!p.visible) continue;
        if (lat === -80 || !latLonToScreen(lat - 3, lon, rot, cx, cy, r).visible) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
    }

    // Continents
    for (const path of CONTINENT_PATHS) {
      ctx.beginPath();
      let started = false;
      for (const [lon, lat] of path) {
        const p = latLonToScreen(lat, lon, rot, cx, cy, r);
        if (!p.visible) { started = false; continue; }
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(180,40,40,0.35)";
      ctx.fill();
      ctx.strokeStyle = "rgba(200,60,60,0.5)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Financial city dots
    const cities: [string, number, number][] = [
      ["NYC", 40.7, -74], ["LDN", 51.5, -0.1], ["TKY", 35.7, 139.7],
      ["HK", 22.3, 114.2], ["IST", 41, 29], ["FRA", 50.1, 8.7],
      ["SH", 31.2, 121.5], ["SG", 1.3, 103.8], ["MUM", 19, 72.9],
      ["SYD", -33.9, 151.2], ["SP", -23.5, -46.6], ["DXB", 25.3, 55.3],
    ];
    for (const [name, lat, lon] of cities) {
      const p = latLonToScreen(lat, lon, rot, cx, cy, r);
      if (!p.visible) continue;
      ctx.fillStyle = "rgba(0,212,170,0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(0,212,170,0.5)";
      ctx.font = `${Math.max(7, r * 0.06)}px monospace`;
      ctx.fillText(name, p.x + 4, p.y - 3);
    }

    ctx.restore();

    // Rim highlight (edge glow)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(120,140,160,0.2)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Red accent ring
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(200,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Headlines overlay (bottom)
    if (headlines.length > 0) {
      const idx = Math.floor((rot / 90) % headlines.length);
      const headline = headlines[idx >= 0 ? idx : 0];
      if (headline) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        const boxY = height - 36;
        ctx.fillRect(10, boxY, width - 20, 28);
        ctx.strokeStyle = "rgba(200,0,0,0.3)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(10, boxY, width - 20, 28);
        ctx.fillStyle = "rgba(200,210,220,0.9)";
        ctx.font = `${Math.max(9, width * 0.035)}px monospace`;
        ctx.fillText(headline.slice(0, 60), 16, boxY + 18);
      }
    }

    // Update rotation
    if (!hovered) {
      rotRef.current += rotationSpeed;
    }
    rafRef.current = requestAnimationFrame(draw);
  }, [width, height, headlines, rotationSpeed, hovered]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, cursor: "grab" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}
