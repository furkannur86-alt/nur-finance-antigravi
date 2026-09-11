/**
 * NUR EARTH 3D — Procedural Orbital Textures & Dynamic Overlays
 * Generates Sea Surface Temperature (SST) and Weather Radar heatmaps for Three.js sphere textures.
 */

import * as THREE from "three";

/**
 * Generates dynamic Sea Surface Temperature (SST) Texture
 * Red/Amber (+30°C) near equator/Gulf Stream, Cyan/Deep Blue (-2°C) at polar zones.
 */
export function createOceanSSTTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background base ocean gradient based on latitude
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0.00, "rgba(5, 30, 80, 0.75)");   // North Pole (-2°C)
  grad.addColorStop(0.25, "rgba(10, 80, 140, 0.65)"); // Subpolar (8°C)
  grad.addColorStop(0.50, "rgba(220, 70, 20, 0.75)");  // Equator (28°C - 31°C)
  grad.addColorStop(0.75, "rgba(10, 80, 140, 0.65)"); // South Subpolar (8°C)
  grad.addColorStop(1.00, "rgba(5, 30, 80, 0.75)");   // South Pole (-2°C)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Add Warm Ocean Currents (Gulf Stream, Kuroshio, El Niño Equatorial Pacific)
  const drawCurrentPlume = (xPct: number, yPct: number, radius: number, r: number, g: number, b: number, alpha: number) => {
    const x = xPct * width;
    const y = yPct * height;
    const radial = ctx.createRadialGradient(x, y, 2, x, y, radius);
    radial.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    radial.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${alpha * 0.5})`);
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  // Gulf Stream (warm Atlantic plume)
  drawCurrentPlume(0.30, 0.35, 75, 255, 60, 20, 0.8);
  drawCurrentPlume(0.35, 0.30, 90, 255, 100, 30, 0.7);
  drawCurrentPlume(0.42, 0.25, 110, 240, 130, 40, 0.6);

  // Kuroshio Current (Pacific warm plume)
  drawCurrentPlume(0.85, 0.38, 70, 255, 80, 20, 0.75);
  drawCurrentPlume(0.92, 0.32, 85, 255, 120, 30, 0.65);

  // Equatorial Pacific El Niño Pool
  drawCurrentPlume(0.15, 0.52, 120, 255, 40, 10, 0.7);
  drawCurrentPlume(0.22, 0.52, 100, 255, 70, 20, 0.65);

  // Humboldt Cold Upwelling (Peru Coast)
  drawCurrentPlume(0.28, 0.65, 80, 0, 180, 255, 0.65);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Generates Atmospheric Weather Radar & Storm Precipitation Texture
 */
export function createWeatherRadarTexture(width = 1024, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Clear transparent
  ctx.clearRect(0, 0, width, height);

  // Draw tropical storm spiral & rain bands
  const drawStormSpiral = (cxPct: number, cyPct: number, maxRadius: number, label: string) => {
    const cx = cxPct * width;
    const cy = cyPct * height;

    // Outer precipitation cloud
    const cloudGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, maxRadius);
    cloudGrad.addColorStop(0, "rgba(255, 0, 0, 0.85)");    // Eye wall (intense dBZ)
    cloudGrad.addColorStop(0.3, "rgba(255, 180, 0, 0.7)");  // Heavy rain
    cloudGrad.addColorStop(0.6, "rgba(0, 240, 120, 0.5)");  // Moderate rain
    cloudGrad.addColorStop(0.85, "rgba(0, 150, 255, 0.3)"); // Light rain
    cloudGrad.addColorStop(1, "rgba(0, 100, 255, 0)");
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // Spiral arms
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const baseAngle = (i * Math.PI * 2) / 3;
      for (let r = 5; r < maxRadius * 0.9; r += 3) {
        const angle = baseAngle + (r / maxRadius) * 4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (r === 5) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Label tag
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.font = "bold 11px monospace";
    ctx.fillText(`⚡ ${label}`, cx + 12, cy - 8);
  };

  // Pacific Super Typhoon
  drawStormSpiral(0.85, 0.38, 48, "TYPHOON GAEMI (260 km/h)");
  // Atlantic Major Hurricane
  drawStormSpiral(0.30, 0.36, 42, "HURRICANE ALPHA (220 km/h)");
  // Indian Ocean Cyclone
  drawStormSpiral(0.68, 0.60, 38, "CYCLONE REMAL (165 km/h)");

  // Mid-latitude storm fronts & atmospheric jet rain belts
  ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(0.1 * width, 0.25 * height);
  ctx.bezierCurveTo(0.3 * width, 0.20 * height, 0.6 * width, 0.30 * height, 0.9 * width, 0.22 * height);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export type GlobeTacticalLayerMode = 'PHYSICAL_MILITARY' | 'FINANCIAL_CAPITAL' | 'CYBER_WARFARE' | 'GEOFINANCE_HYBRID';

/**
 * Generates High-Resolution 2D Tactical Tri-Layer Map Texture
 * Directly maps 2D geopolitical boundaries, country names, military risk zones,
 * financial bourses, capital flows, and cyber warfare attack nodes onto the 3D globe sphere.
 */
export function createTactical2DMapTexture(
  countryBorders: { name: string; points: [number, number][] }[],
  radarAngle = 0,
  mode: GlobeTacticalLayerMode = 'GEOFINANCE_HYBRID',
  width = 2048,
  height = 1024
): { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture; updateRadar: (angle: number, newMode?: GlobeTacticalLayerMode) => void } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const toX = (lon: number) => ((lon + 180) / 360) * width;
  const toY = (lat: number) => ((90 - lat) / 180) * height;

  let currentLayerMode = mode;

  const renderBase = (currentRadar: number, activeMode: GlobeTacticalLayerMode) => {
    if (!ctx) return;

    // Background based on active layer
    if (activeMode === 'FINANCIAL_CAPITAL') {
      ctx.fillStyle = "#030d12"; // Deep gold/emerald dark tint
    } else if (activeMode === 'CYBER_WARFARE') {
      ctx.fillStyle = "#0c0414"; // Deep cyber purple/obsidian tint
    } else {
      ctx.fillStyle = "#040b17"; // Deep tactical space/navy
    }
    ctx.fillRect(0, 0, width, height);

    // Subtle Coordinate Grid
    const gridColor = activeMode === 'FINANCIAL_CAPITAL'
      ? "rgba(16, 185, 129, 0.08)"
      : activeMode === 'CYBER_WARFARE'
      ? "rgba(168, 85, 247, 0.08)"
      : "rgba(0, 229, 255, 0.08)";
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Longitude lines (every 15°)
    for (let lon = -180; lon <= 180; lon += 15) {
      const x = toX(lon);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Latitude lines (every 15°)
    for (let lat = -90; lat <= 90; lat += 15) {
      const y = toY(lat);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Country Borders & Landmass fills
    countryBorders.forEach((c) => {
      if (c.points.length < 2) return;
      ctx.beginPath();
      c.points.forEach((pt, idx) => {
        const x = toX(pt[1]);
        const y = toY(pt[0]);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();

      // Landmass fill
      if (activeMode === 'FINANCIAL_CAPITAL') {
        ctx.fillStyle = "rgba(6, 40, 35, 0.65)";
      } else if (activeMode === 'CYBER_WARFARE') {
        ctx.fillStyle = "rgba(35, 10, 50, 0.65)";
      } else {
        ctx.fillStyle = "rgba(10, 32, 60, 0.65)";
      }
      ctx.fill();

      // Border glow
      if (activeMode === 'FINANCIAL_CAPITAL') {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.75)"; // Emerald green border
      } else if (activeMode === 'CYBER_WARFARE') {
        ctx.strokeStyle = "rgba(192, 132, 252, 0.75)"; // Neon purple border
      } else {
        ctx.strokeStyle = "rgba(0, 229, 255, 0.75)"; // Cyan border
      }
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Country Labels
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const MAJOR_LABELS = [
      { name: "TURKEY", lat: 39.0, lon: 35.0, col: "#38bdf8" },
      { name: "UKRAINE", lat: 49.0, lon: 31.0, col: "#fbbf24" },
      { name: "RUSSIA", lat: 60.0, lon: 60.0, col: "#f87171" },
      { name: "UNITED STATES", lat: 38.0, lon: -98.0, col: "#38bdf8" },
      { name: "CHINA", lat: 35.0, lon: 104.0, col: "#f87171" },
      { name: "GERMANY", lat: 51.0, lon: 10.0, col: "#38bdf8" },
      { name: "UNITED KINGDOM", lat: 54.0, lon: -2.0, col: "#38bdf8" },
      { name: "FRANCE", lat: 46.5, lon: 2.5, col: "#38bdf8" },
      { name: "IRAN", lat: 32.0, lon: 53.0, col: "#fb7185" },
      { name: "ISRAEL", lat: 31.5, lon: 35.0, col: "#38bdf8" },
      { name: "SAUDI ARABIA", lat: 24.0, lon: 45.0, col: "#34d399" },
      { name: "JAPAN", lat: 36.5, lon: 138.0, col: "#38bdf8" },
      { name: "TAIWAN", lat: 23.8, lon: 121.0, col: "#38bdf8" },
      { name: "POLAND", lat: 52.0, lon: 19.5, col: "#38bdf8" },
      { name: "EGYPT", lat: 26.5, lon: 30.0, col: "#a3e635" },
    ];

    MAJOR_LABELS.forEach((lbl) => {
      const lx = toX(lbl.lon);
      const ly = toY(lbl.lat);
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillText(lbl.name, lx + 1, ly + 1);
      ctx.fillStyle = activeMode === 'FINANCIAL_CAPITAL' ? "#10b981" : activeMode === 'CYBER_WARFARE' ? "#c084fc" : lbl.col;
      ctx.fillText(lbl.name, lx, ly);
    });

    // 1. PHYSICAL & MILITARY LAYER
    if (activeMode === 'PHYSICAL_MILITARY' || activeMode === 'GEOFINANCE_HYBRID') {
      const FRONTLINES = [
        { pts: [[50.0, 37.5], [48.5, 38.0], [47.5, 37.0], [46.8, 35.5]], col: "rgba(239, 68, 68, 0.85)", label: "⚔️ DONBAS FLOT" },
        { pts: [[26.0, 119.5], [24.5, 119.8], [22.5, 119.2]], col: "rgba(245, 158, 11, 0.85)", label: "⚠️ TAIWAN ADIZ" },
        { pts: [[15.0, 42.0], [13.0, 43.0], [12.0, 44.0]], col: "rgba(239, 68, 68, 0.85)", label: "⚡ RED SEA CHOKE" },
        { pts: [[54.5, 23.0], [53.8, 23.5]], col: "rgba(239, 68, 68, 0.85)", label: "🛡️ SUWALKI GAP" },
      ];

      FRONTLINES.forEach((fl) => {
        ctx.strokeStyle = fl.col;
        ctx.lineWidth = 3.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        fl.pts.forEach((p, idx) => {
          const x = toX(p[1]);
          const y = toY(p[0]);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        const midPt = fl.pts[Math.floor(fl.pts.length / 2)];
        ctx.fillStyle = "#ffdd00";
        ctx.font = "bold 11px monospace";
        ctx.fillText(fl.label, toX(midPt[1]) + 10, toY(midPt[0]) - 8);
      });

      const MIL_RISK_PINS = [
        { name: "☢️ ZAPORIZHZHIA NPP", lat: 47.51, lon: 34.58, type: "NUCLEAR" },
        { name: "☢️ NATANZ CENTRIFUGE", lat: 33.72, lon: 51.73, type: "NUCLEAR" },
        { name: "☢️ DIMONA SILOS", lat: 31.00, lon: 35.14, type: "NUCLEAR" },
        { name: "🏗️ INCIRLIK AIR BASE", lat: 37.00, lon: 35.42, type: "AIRBASE" },
        { name: "🏗️ RAMSTEIN HQ", lat: 49.43, lon: 7.60, type: "AIRBASE" },
        { name: "🏗️ GUAM ANDERSEN AFB", lat: 13.58, lon: 144.92, type: "AIRBASE" },
        { name: "🚢 HORMUZ CARRIER PATROL", lat: 26.56, lon: 56.25, type: "NAVAL" },
        { name: "🚢 TAIWAN STRAIT PATROL", lat: 24.2, lon: 119.5, type: "NAVAL" },
      ];

      MIL_RISK_PINS.forEach((pin) => {
        const px = toX(pin.lon);
        const py = toY(pin.lat);
        ctx.strokeStyle = pin.type === "NUCLEAR" ? "rgba(255, 0, 85, 0.85)" : "rgba(0, 229, 255, 0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = pin.type === "NUCLEAR" ? "#ff0055" : "#00e5ff";
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = pin.type === "NUCLEAR" ? "#ff4d88" : "#38bdf8";
        ctx.fillText(pin.name, px, py - 13);
      });
    }

    // 2. FINANCIAL & CAPITAL MATRIX LAYER
    if (activeMode === 'FINANCIAL_CAPITAL' || activeMode === 'GEOFINANCE_HYBRID') {
      const BOURSE_NODES = [
        { name: "💵 NYSE / NSDQ ($52.4T)", lat: 40.71, lon: -74.00, sym: "$", col: "#10b981" },
        { name: "💷 LSE LONDON ($3.8T)", lat: 51.51, lon: -0.10, sym: "£", col: "#38bdf8" },
        { name: "💶 DAX FRANKFURT ($2.3T)", lat: 50.11, lon: 8.68, sym: "€", col: "#38bdf8" },
        { name: "💴 NIKKEI TOKYO ($6.5T)", lat: 35.68, lon: 139.77, sym: "¥", col: "#fbbf24" },
        { name: "💴 SSE SHANGHAI ($10.9T)", lat: 31.23, lon: 121.47, sym: "¥", col: "#f87171" },
        { name: "﷼ TADAWUL RIYADH ($2.8T)", lat: 24.71, lon: 46.67, sym: "﷼", col: "#34d399" },
        { name: "₺ BIST ISTANBUL ($0.38T)", lat: 41.11, lon: 29.05, sym: "₺", col: "#38bdf8" },
        { name: "🇨🇭 SIX ZURICH ($2.1T)", lat: 47.38, lon: 8.54, sym: "CHF", col: "#10b981" },
        { name: "₹ NSE MUMBAI ($5.3T)", lat: 19.08, lon: 72.88, sym: "₹", col: "#a78bfa" },
      ];

      BOURSE_NODES.forEach((b) => {
        const bx = toX(b.lon);
        const by = toY(b.lat);

        // Golden/Emerald Capital Node Ring
        ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(bx, by, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.beginPath();
        ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText(b.name, bx, by + 18);
      });
    }

    // 3. CYBER WARFARE & DIGITAL SOVEREIGNTY LAYER
    if (activeMode === 'CYBER_WARFARE' || activeMode === 'GEOFINANCE_HYBRID') {
      const CYBER_THREATS = [
        { label: "👾 SANDWORM SCADA ATTACK", lat: 50.45, lon: 30.52, col: "#ec4899" },
        { label: "👾 VOLT TYPHOON PACIFIC PERSISTENCE", lat: 13.44, lon: 144.79, col: "#a855f7" },
        { label: "👾 LAZARUS SWIFT CRYPTO THEFT", lat: 40.71, lon: -74.01, col: "#ef4444" },
        { label: "🌐 RED SEA SUBSEA CABLE CUT RISK", lat: 11.82, lon: 42.59, col: "#f59e0b" },
      ];

      CYBER_THREATS.forEach((c) => {
        const cx = toX(c.lon);
        const cy = toY(c.lat);

        ctx.strokeStyle = "rgba(168, 85, 247, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 8, cy - 8, 16, 16);

        ctx.fillStyle = c.col;
        ctx.fillRect(cx - 3, cy - 3, 6, 6);

        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#e9d5ff";
        ctx.fillText(c.label, cx, cy - 14);
      });
    }

    // Animated Rotating Radar Scan Beam Line
    const radarX = ((currentRadar % (Math.PI * 2)) / (Math.PI * 2)) * width;
    const beamColor = activeMode === 'FINANCIAL_CAPITAL'
      ? "rgba(16, 185, 129,"
      : activeMode === 'CYBER_WARFARE'
      ? "rgba(168, 85, 247,"
      : "rgba(0, 229, 255,";

    const radarGrad = ctx.createLinearGradient(radarX - 120, 0, radarX, 0);
    radarGrad.addColorStop(0, `${beamColor} 0)`);
    radarGrad.addColorStop(0.85, `${beamColor} 0.15)`);
    radarGrad.addColorStop(1, `${beamColor} 0.8)`);

    ctx.fillStyle = radarGrad;
    ctx.fillRect(radarX - 120, 0, 120, height);

    ctx.strokeStyle = `${beamColor} 0.95)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radarX, 0);
    ctx.lineTo(radarX, height);
    ctx.stroke();
  };

  renderBase(radarAngle, currentLayerMode);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const updateRadar = (angle: number, newMode?: GlobeTacticalLayerMode) => {
    if (newMode) currentLayerMode = newMode;
    renderBase(angle, currentLayerMode);
    texture.needsUpdate = true;
  };

  return { canvas, texture, updateRadar };
}


