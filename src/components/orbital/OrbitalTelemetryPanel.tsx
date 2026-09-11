"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";

export interface TelemetryChannel {
  channelId: string;
  name: string;
  band: string;
  centerFrequencyMHz: number;
  modulation: string;
  baudRate: string;
  snrDb: number;
  berExponent: number; // e.g. -10 for 1e-10
  dopplerShiftKHz: number;
  status: "LOCKED" | "TRACKING" | "SEARCHING" | "STANDBY";
  uplinkPowerWatts: number;
  downlinkRSSI: number; // dBm
  description: string;
}

export const TELEMETRY_CHANNELS: TelemetryChannel[] = [
  {
    channelId: "CH-13",
    name: "Deep Space Transponder & Interstellar Guidance",
    band: "X-Band (Deep Space)",
    centerFrequencyMHz: 8413.55,
    modulation: "QPSK / DSSS 128-Chip",
    baudRate: "10.0 MBaud",
    snrDb: 42.4,
    berExponent: -11,
    dopplerShiftKHz: -13.42,
    status: "LOCKED",
    uplinkPowerWatts: 250,
    downlinkRSSI: -88.4,
    description: "Primary carrier for high-gain deep space attitude telemetry and celestial ephemeris synchronization.",
  },
  {
    channelId: "CH-35",
    name: "LEO / GEO Constellation Intersatellite Crosslink",
    band: "Ka-Band (High Throughput)",
    centerFrequencyMHz: 26535.13,
    modulation: "64-APSK LDPC 9/10",
    baudRate: "125.0 MBaud",
    snrDb: 35.8,
    berExponent: -10,
    dopplerShiftKHz: +35.12,
    status: "LOCKED",
    uplinkPowerWatts: 45,
    downlinkRSSI: -74.2,
    description: "Mesh networking backbone connecting sovereign orbital nodes and orbital compute server racks.",
  },
  {
    channelId: "CH-42",
    name: "Quantum Entanglement & Master Clock Synchronizer",
    band: "Laser Optical 1550 nm (Photonic)",
    centerFrequencyMHz: 193414.42,
    modulation: "QKD / Photon Time-Bin BB84",
    baudRate: "1.2 GBaud",
    snrDb: 55.0,
    berExponent: -13,
    dopplerShiftKHz: +0.42,
    status: "LOCKED",
    uplinkPowerWatts: 2.5,
    downlinkRSSI: -52.1,
    description: "Zero-latency atomic clock synchronization and sovereign cryptographic key distribution (QKD).",
  },
  {
    channelId: "CH-55",
    name: "Planetary Defense & Apophis 2029 Radar Downlink",
    band: "S-Band (Phased Array)",
    centerFrequencyMHz: 2255.42,
    modulation: "Chirp-BPSK 500 kHz",
    baudRate: "55.0 MBaud",
    snrDb: 48.6,
    berExponent: -12,
    dopplerShiftKHz: -55.13,
    status: "TRACKING",
    uplinkPowerWatts: 1200,
    downlinkRSSI: -82.6,
    description: "High-power pulsed synthetic aperture radar (SAR) telemetry for planetary defense object tracking.",
  },
  {
    channelId: "CH-54751113",
    name: "Sovereign Master Beacon & Hitchhiker Sync Pulse",
    band: "VHF Sovereign Beacon",
    centerFrequencyMHz: 54.751113,
    modulation: "Hitchhiker Harmonic Spread Spectrum",
    baudRate: "54.751 MBaud",
    snrDb: 54.75,
    berExponent: -14,
    dopplerShiftKHz: +5.47,
    status: "LOCKED",
    uplinkPowerWatts: 1335,
    downlinkRSSI: -42.5,
    description: "Universal master carrier locking the 13·35·42·55·54751113 mathematical orbital cascade.",
  },
];

/* ── Real-Time RF Waterfall & Spectrum Canvas ─────────────────────── */
function RFWaterfallCanvas({
  activeChannel,
  isLive,
}: {
  activeChannel: TelemetryChannel;
  isLive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      t += 0.04;
      const W = canvas.width;
      const H = canvas.height;

      // Dark RF backdrop
      ctx.fillStyle = "#020712";
      ctx.fillRect(0, 0, W, H);

      // Grid Lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.12)";
      ctx.lineWidth = 1;
      const gridCols = 10;
      for (let i = 0; i <= gridCols; i++) {
        const x = (W / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      const gridRows = 6;
      for (let j = 0; j <= gridRows; j++) {
        const y = (H / gridRows) * j;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // RF Spectrum FFT Power Density Curve
      const spectrumPoints: { x: number; y: number }[] = [];
      const numBins = 180;
      const peakBin = Math.floor(numBins * 0.52);

      for (let bin = 0; bin < numBins; bin++) {
        const x = (W / (numBins - 1)) * bin;
        const distFromPeak = Math.abs(bin - peakBin);
        const noise = (Math.sin(bin * 0.4 + t * 4) + Math.cos(bin * 0.8 - t * 2)) * 8 + Math.random() * 6;
        const mainLobe = Math.exp(-Math.pow(distFromPeak / 6, 2)) * (H * 0.72);
        const sideLobe1 = Math.exp(-Math.pow((distFromPeak - 18) / 4, 2)) * (H * 0.22);
        const sideLobe2 = Math.exp(-Math.pow((distFromPeak - 34) / 5, 2)) * (H * 0.14);

        const y = H - (25 + noise + mainLobe + sideLobe1 + sideLobe2);
        spectrumPoints.push({ x, y });
      }

      // Fill Spectrum Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(0, 255, 200, 0.7)");
      grad.addColorStop(0.3, "rgba(0, 180, 255, 0.45)");
      grad.addColorStop(0.8, "rgba(6, 40, 90, 0.2)");
      grad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.moveTo(0, H);
      spectrumPoints.forEach((pt) => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(W, H);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw Spectrum Stroke
      ctx.beginPath();
      spectrumPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Peak Carrier Reticle Marker
      const peakPt = spectrumPoints[peakBin];
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(peakPt.x, 0);
      ctx.lineTo(peakPt.x, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Peak HUD Label
      ctx.fillStyle = "#ff0055";
      ctx.font = "10px monospace";
      ctx.fillText(
        `CARRIER PEAK: ${activeChannel.centerFrequencyMHz.toFixed(4)} MHz | SNR: +${activeChannel.snrDb.toFixed(1)} dB`,
        peakPt.x + 8,
        30
      );

      // Waterfall Stream Rows (bottom 35% of canvas)
      const wfY = H * 0.65;
      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.fillRect(0, wfY, W, H - wfY);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
      ctx.beginPath();
      ctx.moveTo(0, wfY);
      ctx.lineTo(W, wfY);
      ctx.stroke();

      ctx.fillStyle = "rgba(0, 229, 255, 0.7)";
      ctx.font = "9px monospace";
      ctx.fillText("RF WATERFALL SPECTROGRAM (100 MSPS IQ ENGINE)", 10, wfY + 14);

      if (isLive) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [activeChannel, isLive]);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

export default function OrbitalTelemetryPanel() {
  const { openFloatingWindow, popoutToNativeWindow, setFocusedCoordinates } = useIDEStore();
  const [activeChannelId, setActiveChannelId] = useState<string>("CH-54751113");
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [audioBeep, setAudioBeep] = useState(false);
  const [packetCount, setPacketCount] = useState(54751113);
  const [dopplerOffset, setDopplerOffset] = useState(0);

  // Active channel
  const activeChannel = useMemo(
    () => TELEMETRY_CHANNELS.find((c) => c.channelId === activeChannelId) || TELEMETRY_CHANNELS[0],
    [activeChannelId]
  );

  // Live telemetry packet stream generator
  const [rawPackets, setRawPackets] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLiveStream) return;
      setPacketCount((p) => p + 1);
      setDopplerOffset((Math.sin(Date.now() * 0.001) * 3.5));

      const hexChars = "0123456789ABCDEF";
      const makeHex = (len: number) =>
        Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join("");

      const sync = "54751113";
      const ch = activeChannel.channelId.replace("CH-", "");
      const newPacket = `SYNC:${sync} | CH:${ch.padStart(4, "0")} | SEQ:${(packetCount % 65535).toString(16).toUpperCase().padStart(4, "0")} | PLOAD:0x${makeHex(16)} | CRC32:0x${makeHex(8)} | STATUS:OK`;

      setRawPackets((prev) => [newPacket, ...prev.slice(0, 15)]);
    }, 450);

    return () => clearInterval(interval);
  }, [isLiveStream, activeChannel, packetCount]);

  // Web Audio Downlink Tone synthesizer
  useEffect(() => {
    if (!audioBeep) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880 + (packetCount % 5) * 110, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);

      return () => {
        audioCtx.close();
      };
    } catch {
      // Audio context suppressed
    }
  }, [packetCount, audioBeep]);

  // Real-time orbital Keplerian elements
  const orbitalElements = {
    semiMajorAxisKm: 6798.13,
    eccentricity: 0.00072,
    inclinationDeg: 51.64,
    raanDeg: 135.42,
    argPerigeeDeg: 42.55,
    meanAnomalyDeg: 54.751113,
    periodMinutes: 92.68,
    meanMotionRevDay: 15.54,
    altitudeKm: 418.5,
    orbitalVelocityKmS: 7.66,
    subSatLat: 24.85,
    subSatLon: 42.55,
  };

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-mono select-none overflow-hidden">
      {/* ── TOP BANNER: ORBITAL COMMAND & HITCHHIKER MATRIX ──────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={30} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                ORBITAL TELEMETRY ENGINE
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                CASCADE: 13 · 35 · 42 · 55 · 54,751,113
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-sm font-bold text-white tracking-wide mt-0.5">
              Sovereign Satellite Downlink & RF Spectrum Telemetry Matrix
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Audio Beep Toggle */}
          <button
            onClick={() => setAudioBeep(!audioBeep)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
              audioBeep
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                : "bg-black/50 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {audioBeep ? "🔊 TELEMETRY AUDIO ON" : "🔇 AUDIO MUTED"}
          </button>

          {/* Live / Pause */}
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
              isLiveStream
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-amber-500/20 border-amber-400 text-amber-300"
            }`}
          >
            {isLiveStream ? "🔴 LIVE STREAMING" : "⏸️ PAUSED"}
          </button>

          {/* Target on 3D Globe */}
          <button
            onClick={() => {
              setFocusedCoordinates([orbitalElements.subSatLat, orbitalElements.subSatLon]);
            }}
            className="px-2.5 py-1 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-black font-extrabold text-xs transition-all shadow-md"
          >
            🌐 LOCK IN 3D GLOBE
          </button>

          {/* Popout / Float */}
          <button
            onClick={() => openFloatingWindow("orbital-telemetry", "🛰️ Orbital Telemetry HUD (13·35·42·55·54751113)")}
            className="px-2 py-1 rounded bg-black/60 border border-white/15 text-slate-300 hover:text-white text-xs font-bold"
            title="Open in floating draggable window"
          >
            ⤢ FLOAT
          </button>
          <button
            onClick={() => popoutToNativeWindow("orbital-telemetry")}
            className="px-2 py-1 rounded bg-black/60 border border-white/15 text-slate-300 hover:text-white text-xs font-bold"
            title="Pop out to separate monitor"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── CHANNEL SELECTION TABS ────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#040e22] border-b border-cyan-500/20 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
          SELECT CHANNEL:
        </span>
        {TELEMETRY_CHANNELS.map((ch) => (
          <button
            key={ch.channelId}
            onClick={() => setActiveChannelId(ch.channelId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
              activeChannelId === ch.channelId
                ? "bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-slate-900/70 border-white/10 text-slate-400 hover:text-white hover:border-white/25"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                ch.status === "LOCKED" ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
            <span>{ch.channelId}</span>
            <span className="text-[10px] opacity-70">({ch.centerFrequencyMHz.toFixed(2)} MHz)</span>
          </button>
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* LEFT COLUMN: REAL-TIME RF SPECTRUM & WATERFALL (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-xl border border-cyan-500/30 bg-slate-950/80 overflow-hidden shadow-2xl">
          {/* Spectrum HUD Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#061226] border-b border-cyan-500/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">📡 FFT RF SPECTRUM ANALYZER</span>
              <span className="text-[10px] text-slate-400">| BW: 20 MHz • 100 MSPS</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-slate-400">
                FREQ: <strong className="text-white">{activeChannel.centerFrequencyMHz.toFixed(4)} MHz</strong>
              </span>
              <span className="text-slate-400">
                DOPPLER:{" "}
                <strong className={activeChannel.dopplerShiftKHz >= 0 ? "text-emerald-400" : "text-amber-400"}>
                  {(activeChannel.dopplerShiftKHz + dopplerOffset).toFixed(2)} kHz
                </strong>
              </span>
              <span className="text-slate-400">
                SNR: <strong className="text-cyan-300">+{activeChannel.snrDb.toFixed(1)} dB</strong>
              </span>
            </div>
          </div>

          {/* Canvas Spectrum Display */}
          <div className="flex-1 min-h-[260px] relative">
            <RFWaterfallCanvas activeChannel={activeChannel} isLive={isLiveStream} />
          </div>

          {/* Active Channel Details Bar */}
          <div className="p-3 bg-slate-950/90 border-t border-cyan-500/20 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <div className="text-slate-400">MODULATION & CODING</div>
              <div className="text-cyan-300 font-bold truncate mt-0.5">{activeChannel.modulation}</div>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <div className="text-slate-400">BAUD RATE & THROUGHPUT</div>
              <div className="text-emerald-300 font-bold mt-0.5">{activeChannel.baudRate}</div>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <div className="text-slate-400">BIT ERROR RATE (BER)</div>
              <div className="text-purple-300 font-bold mt-0.5">1.0 × 10^{activeChannel.berExponent} (CRC-OK)</div>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <div className="text-slate-400">UPLINK / DOWNLINK RSSI</div>
              <div className="text-amber-300 font-bold mt-0.5">
                {activeChannel.uplinkPowerWatts}W / {activeChannel.downlinkRSSI} dBm
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ORBITAL STATE VECTORS & LIVE RAW PACKET HEX (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden">
          {/* TOP CARD: KEPLERIAN ORBITAL STATE VECTORS */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-3 flex flex-col space-y-2 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5">
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🛰️ KEPLERIAN ORBITAL ELEMENTS (LEO CONVERGENCE)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                PERIOD: 92.68m
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px]">
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">SEMI-MAJOR AXIS (a)</div>
                <div className="text-white font-bold">{orbitalElements.semiMajorAxisKm.toFixed(2)} km</div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">ECCENTRICITY (e)</div>
                <div className="text-cyan-300 font-bold">{orbitalElements.eccentricity.toFixed(5)}</div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">INCLINATION (i)</div>
                <div className="text-amber-300 font-bold">{orbitalElements.inclinationDeg.toFixed(2)}°</div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">ALTITUDE & VELOCITY</div>
                <div className="text-emerald-300 font-bold">
                  {orbitalElements.altitudeKm} km • {orbitalElements.orbitalVelocityKmS} km/s
                </div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">ARG OF PERIGEE (ω)</div>
                <div className="text-purple-300 font-bold">42.55°</div>
              </div>
              <div className="p-2 rounded bg-black/50 border border-white/5">
                <div className="text-slate-400">MEAN ANOMALY (M)</div>
                <div className="text-cyan-300 font-bold">54.751113°</div>
              </div>
            </div>

            {/* Sub-satellite point coordinates */}
            <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex justify-between items-center text-[10px]">
              <div className="text-slate-300">
                SUB-SATELLITE POSITION: <strong className="text-cyan-300">{orbitalElements.subSatLat}° N, {orbitalElements.subSatLon}° E</strong>
              </div>
              <button
                onClick={() => setFocusedCoordinates([orbitalElements.subSatLat, orbitalElements.subSatLon])}
                className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:text-white font-bold"
              >
                TELEPORT ➔
              </button>
            </div>
          </div>

          {/* BOTTOM CARD: RAW TELEMETRY PACKET HEX STREAM */}
          <div className="flex-1 min-h-[220px] rounded-xl border border-cyan-500/30 bg-slate-950/90 p-3 flex flex-col space-y-2 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 shrink-0">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span>📡 DOWNLINK TELEMETRY FRAME STREAM</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">
                PACKETS: <strong className="text-white">{packetCount.toLocaleString()}</strong>
              </span>
            </div>

            {/* Packet Log Feed */}
            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[9px] pr-1">
              {rawPackets.map((pkt, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded border transition-all ${
                    idx === 0
                      ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-200"
                      : "bg-black/40 border-white/5 text-slate-400"
                  }`}
                >
                  <div className="break-all">{pkt}</div>
                </div>
              ))}
            </div>

            {/* Sync Word Footer */}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[9px] text-slate-400 shrink-0">
              <span>SYNC WORD: <strong className="text-amber-400">0x54751113</strong></span>
              <span>REED-SOLOMON PARITY: <strong className="text-emerald-400">LOCKED (RS-255,223)</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
