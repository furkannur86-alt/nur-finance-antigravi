"use client";

import { useEffect, useRef, useState } from "react";

interface EagleCrestProps {
  size?: number;
  animate?: boolean;
  className?: string;
  showMottoBadge?: boolean;
}

export default function EagleCrest({
  size = 48,
  animate = true,
  className = "",
  showMottoBadge = false,
}: EagleCrestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [modalOpen, setModalOpen] = useState(false);

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
      const r = size * 0.44;
      const breathe = animate ? Math.sin(frame * 0.035) * 1.6 : 0;
      const wingFlap = animate ? Math.sin(frame * 0.045) * 2.8 : 0;
      const rubyGlow = animate ? (Math.sin(frame * 0.08) + 1) * 0.5 : 0.8;

      ctx.save();
      ctx.translate(cx, cy + breathe * 0.3);

      // Outer Heraldic Ring (Renaissance Gold)
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = Math.max(1, size * 0.02);
      ctx.stroke();

      // Dotted Sacred Geometry Ring
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shield background (Deep Obsidian & Imperial Midnight Blue)
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.82);
      ctx.bezierCurveTo(r * 0.68, -r * 0.82, r * 0.82, -r * 0.38, r * 0.82, 0);
      ctx.bezierCurveTo(r * 0.82, r * 0.52, r * 0.38, r * 0.88, 0, r * 0.96);
      ctx.bezierCurveTo(-r * 0.38, r * 0.88, -r * 0.82, r * 0.52, -r * 0.82, 0);
      ctx.bezierCurveTo(-r * 0.82, -r * 0.38, -r * 0.68, -r * 0.82, 0, -r * 0.82);
      ctx.closePath();
      const shieldGrad = ctx.createLinearGradient(0, -r, 0, r);
      shieldGrad.addColorStop(0, "#161b26");
      shieldGrad.addColorStop(0.5, "#0b0f17");
      shieldGrad.addColorStop(1, "#05070a");
      ctx.fillStyle = shieldGrad;
      ctx.fill();
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = Math.max(1, size * 0.025);
      ctx.stroke();

      // Inner subtle glow
      ctx.strokeStyle = "rgba(0, 212, 170, 0.3)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Body (Golden Imperial Armor)
      ctx.beginPath();
      ctx.ellipse(0, r * 0.08, r * 0.17, r * 0.34, 0, 0, Math.PI * 2);
      const bodyGrad = ctx.createLinearGradient(0, -r * 0.25, 0, r * 0.45);
      bodyGrad.addColorStop(0, "#f3e5ab");
      bodyGrad.addColorStop(0.3, "#d4af37");
      bodyGrad.addColorStop(1, "#8b6914");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Left wing (West / Batı)
      ctx.save();
      ctx.translate(-r * 0.12, r * 0.02);
      ctx.rotate((-22 + wingFlap) * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-r * 0.35, -r * 0.25, -r * 0.65, -r * 0.45, -r * 0.62, -r * 0.08);
      ctx.bezierCurveTo(-r * 0.55, r * 0.15, -r * 0.25, r * 0.2, 0, r * 0.12);
      ctx.closePath();
      const leftWingGrad = ctx.createLinearGradient(-r * 0.6, -r * 0.3, 0, r * 0.2);
      leftWingGrad.addColorStop(0, "#f3e5ab");
      leftWingGrad.addColorStop(0.5, "#d4af37");
      leftWingGrad.addColorStop(1, "#996515");
      ctx.fillStyle = leftWingGrad;
      ctx.fill();

      // Feathers Left
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const t = i / 6;
        ctx.moveTo(-r * 0.08 * t, -r * 0.04 * t);
        ctx.lineTo(-r * 0.58 * t, -r * 0.32 * t);
        ctx.strokeStyle = "rgba(70, 45, 5, 0.7)";
        ctx.lineWidth = Math.max(0.5, size * 0.012);
        ctx.stroke();
      }
      ctx.restore();

      // Right wing (East / Doğu) - Mirror
      ctx.save();
      ctx.translate(r * 0.12, r * 0.02);
      ctx.rotate((22 - wingFlap) * Math.PI / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r * 0.35, -r * 0.25, r * 0.65, -r * 0.45, r * 0.62, -r * 0.08);
      ctx.bezierCurveTo(r * 0.55, r * 0.15, r * 0.25, r * 0.2, 0, r * 0.12);
      ctx.closePath();
      const rightWingGrad = ctx.createLinearGradient(r * 0.6, -r * 0.3, 0, r * 0.2);
      rightWingGrad.addColorStop(0, "#f3e5ab");
      rightWingGrad.addColorStop(0.5, "#d4af37");
      rightWingGrad.addColorStop(1, "#996515");
      ctx.fillStyle = rightWingGrad;
      ctx.fill();

      // Feathers Right
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const t = i / 6;
        ctx.moveTo(r * 0.08 * t, -r * 0.04 * t);
        ctx.lineTo(r * 0.58 * t, -r * 0.32 * t);
        ctx.strokeStyle = "rgba(70, 45, 5, 0.7)";
        ctx.lineWidth = Math.max(0.5, size * 0.012);
        ctx.stroke();
      }
      ctx.restore();

      // Left Head (Facing West)
      ctx.save();
      ctx.translate(-r * 0.14, -r * 0.26);
      ctx.rotate(-14 * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.09, r * 0.11, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#d4af37";
      ctx.fill();

      // Beak Left (Gold/Amber)
      ctx.beginPath();
      ctx.moveTo(-r * 0.08, -r * 0.02);
      ctx.lineTo(-r * 0.18, r * 0.02);
      ctx.lineTo(-r * 0.08, r * 0.04);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      // Glowing Ruby Eye Left
      ctx.beginPath();
      ctx.arc(-r * 0.03, -r * 0.02, r * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 46, 99, ${0.7 + rubyGlow * 0.3})`;
      ctx.fill();
      ctx.restore();

      // Right Head (Facing East)
      ctx.save();
      ctx.translate(r * 0.14, -r * 0.26);
      ctx.rotate(14 * Math.PI / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.09, r * 0.11, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#d4af37";
      ctx.fill();

      // Beak Right (Gold/Amber)
      ctx.beginPath();
      ctx.moveTo(r * 0.08, -r * 0.02);
      ctx.lineTo(r * 0.18, r * 0.02);
      ctx.lineTo(r * 0.08, r * 0.04);
      ctx.closePath();
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      // Glowing Ruby Eye Right
      ctx.beginPath();
      ctx.arc(r * 0.03, -r * 0.02, r * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 46, 99, ${0.7 + rubyGlow * 0.3})`;
      ctx.fill();
      ctx.restore();

      // Imperial Crown atop Both Heads (Seljuk / Renaissance Golden Triple-Crown)
      ctx.beginPath();
      ctx.moveTo(-r * 0.14, -r * 0.4);
      ctx.lineTo(-r * 0.09, -r * 0.54);
      ctx.lineTo(-r * 0.03, -r * 0.44);
      ctx.lineTo(0, -r * 0.58);
      ctx.lineTo(r * 0.03, -r * 0.44);
      ctx.lineTo(r * 0.09, -r * 0.54);
      ctx.lineTo(r * 0.14, -r * 0.4);
      ctx.closePath();
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.strokeStyle = "#92400e";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Tail Feathers
      ctx.beginPath();
      ctx.moveTo(-r * 0.12, r * 0.38);
      ctx.lineTo(-r * 0.18, r * 0.68);
      ctx.lineTo(-r * 0.06, r * 0.62);
      ctx.lineTo(0, r * 0.74);
      ctx.lineTo(r * 0.06, r * 0.62);
      ctx.lineTo(r * 0.18, r * 0.68);
      ctx.lineTo(r * 0.12, r * 0.38);
      ctx.closePath();
      ctx.fillStyle = "#8b6914";
      ctx.fill();

      // Central Imperial Medallion with "NUR" / "NF" Monogram
      ctx.beginPath();
      ctx.arc(0, r * 0.12, r * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = "#0c131f";
      ctx.fill();
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#00d4aa";
      ctx.font = `bold ${Math.max(7, r * 0.14)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("NF", 0, r * 0.13);

      // Celestial Aura Pulse
      if (animate) {
        const auraAlpha = 0.06 + Math.sin(frame * 0.04) * 0.05;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 175, 55, ${auraAlpha})`;
        ctx.lineWidth = 2.5;
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
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`relative inline-flex flex-col items-center justify-center group cursor-pointer ${className}`}
        title="DOMINUS ORIENTIS ET OCCIDENTIS (Doğunun ve Batının Hâkimi) — NUR Finance Master Emblem (Tıkla ve Detayları Gör)"
      >
        <canvas ref={canvasRef} style={{ width: size, height: size }} />
        {showMottoBadge && (
          <span className="text-[9px] font-serif italic text-amber-300 tracking-wider mt-0.5 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity">
            Dominus Orientis et Occidentis
          </span>
        )}
      </div>

      {/* Esoteric Heraldic Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl p-6 rounded-xl border border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-2xl shadow-amber-500/10 text-white space-y-4">
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono"
            >
              ✕ KAPAT
            </button>

            {/* Crest Hero Header */}
            <div className="flex items-center gap-4 border-b border-amber-500/20 pb-4">
              <canvas
                ref={(c) => {
                  if (!c) return;
                  const ctx = c.getContext("2d");
                  if (!ctx) return;
                  c.width = 140;
                  c.height = 140;
                  // Render single high-res crest
                  const cx = 70;
                  const cy = 70;
                  const r = 58;
                  ctx.beginPath();
                  ctx.arc(cx, cy, r, 0, Math.PI * 2);
                  ctx.fillStyle = "#0c131f";
                  ctx.fill();
                  ctx.strokeStyle = "#d4af37";
                  ctx.lineWidth = 2;
                  ctx.stroke();
                }}
                className="w-16 h-16 shrink-0 hidden"
              />
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                  Resmi Hanedan & Kuantitatif İnsignia
                </div>
                <h3 className="text-xl font-serif font-bold text-amber-200">
                  DOMINUS ORIENTIS ET OCCIDENTIS
                </h3>
                <p className="text-xs text-emerald-400 font-medium mt-0.5">
                  &ldquo;Doğunun ve Batının Hâkimi&rdquo; &bull; NUR Finance Sovereign Emblem
                </p>
              </div>
            </div>

            {/* Content description */}
            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
                <div className="font-bold text-amber-300 text-xs">🏛️ Çift Başlı Kartal ve Ezoterik Anlamı:</div>
                <p>
                  Selçuklu ve Doğu Roma / Rönesans imparatorluk mirasının simgesi olan Çift Başlı Kartal, 
                  NUR Finance&apos;in <strong>Doğu (Asya/Ortadoğu)</strong> ve <strong>Batı (Wall Street/Londra)</strong> sermaye piyasalarına 
                  aynı anda hükmeden kuantitatif vizyonunu temsil eder.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-black/40 border border-white/10 space-y-1">
                  <span className="font-bold text-cyan-300">👑 Yegane Hak Sahipleri</span>
                  <p className="text-[10px] text-slate-400">
                    Furkan Nur (Kurucu & Vasi) ve Umay Gül Nur (04.08.2017) mülkiyetindedir. İleride doğacak çocuklar için eşit hak klozları saklıdır.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-black/40 border border-white/10 space-y-1">
                  <span className="font-bold text-emerald-300">🌐 Master Çatı Domain</span>
                  <p className="text-[10px] text-slate-400">
                    nurfinans.com üzerinden tüm iştirakler, OMS/EMS işlem motoru ve 7 Büyüme Kolu yönetilir.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded bg-black/50 border border-emerald-500/30 text-[11px] text-slate-300">
                <span className="font-mono text-emerald-400 font-bold">✨ Rönesans & Ezoterik Dokunuş:</span>
                <p className="mt-1">
                  Arka planda süzülen hafif şelalemsi finansal matriks (Finansal Fibonacci, Kelly Kriteri ve Antik Latince Defterdarlık formülleri) 
                  ile mekanik bir siteden ziyade yaşayan, gizemli ve elit bir finans tapınağı atmosferi sunar.
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors"
              >
                Anladım &bull; Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

