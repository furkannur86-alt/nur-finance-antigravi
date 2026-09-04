"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { cyberSound } from "@/lib/audio/sound-synth";
import EagleCrest from "@/components/ui/EagleCrest";

export default function SovereignAuthModal() {
  const {
    sovereignAuthModalOpen,
    setSovereignAuthModalOpen,
    isSovereignAdmin,
    setSovereignAdmin,
    addNotification,
    setActiveView,
  } = useIDEStore();

  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!sovereignAuthModalOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = passkey.trim().toUpperCase();

    // Accepted Sovereign Passkeys
    if (cleanKey === "2126" || cleanKey === "NUR-SOVEREIGN-2126" || cleanKey === "UMAY-2126" || cleanKey === "SOVEREIGN") {
      setIsAuthenticating(true);
      setError(false);

      setTimeout(() => {
        setIsAuthenticating(false);
        setSovereignAdmin(true);
        setSovereignAuthModalOpen(false);
        setPasskey("");
        cyberSound.playQuantumUnlock();

        addNotification({
          title: "👑 2126 SOVEREIGN VAULT UNLOCKED",
          message: "Yönetici Egemen Modu devrede. Umay Gül Nur, 7 Büyüme Kolu ve Tatar Finans terminalleri açıldı.",
          severity: "SUCCESS",
          category: "COMPLIANCE",
        });

        setActiveView("umay-boss");
      }, 700);
    } else {
      setError(true);
      cyberSound.playClick();
    }
  };

  const handleLockSession = () => {
    setSovereignAdmin(false);
    setSovereignAuthModalOpen(false);
    setActiveView("geopolitics");
    cyberSound.playClick();

    addNotification({
      title: "🔒 Kamu Gizlilik Modu Kilitlendi",
      message: "Tüm iç yönetim ve gölge modüller kamu görünümünden tamamen gizlendi.",
      severity: "INFO",
      category: "COMPLIANCE",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-2xl shadow-cyan-500/10 text-white space-y-5">
        {/* Close button */}
        <button
          onClick={() => setSovereignAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-mono"
        >
          ✕ KAPAT
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-cyan-500/20 pb-4">
          <EagleCrest size={36} animate={true} />
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <span>YEAR 2126 &bull; SOVEREIGN VAULT</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-base font-serif font-bold text-white">
              Egemen Yönetici Kimlik Doğrulama
            </h3>
            <p className="text-[11px] text-slate-400">
              Patron & Umay Gül Nur Master Konsolu
            </p>
          </div>
        </div>

        {/* Status or Form */}
        {isSovereignAdmin ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-center">
              <span className="text-emerald-400 font-bold text-xs uppercase flex items-center justify-center gap-1.5">
                <span>✅ OTURUM AKTİF (SOVEREIGN MODE)</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Umay Gül Nur Boss Terminali, 7 Büyüme Kolu ve Tatar Finans kasası şu anda sadece sizin ekranınızda görünür durumdadır.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setSovereignAuthModalOpen(false);
                  setActiveView("umay-boss");
                }}
                className="py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all font-mono"
              >
                👑 Umay Konsoluna Git
              </button>
              <button
                onClick={handleLockSession}
                className="py-2.5 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 transition-all font-mono"
              >
                🔒 Oturumu Gizle & Kilitle
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 leading-relaxed">
              Bu alan kamuya kapalıdır. Tatar Finans, Gölge Holding ekosistemi ve Umay Gül Nur yönetim konsolunu açmak için kriptografik egemen anahtarınızı girin.
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold text-cyan-300 uppercase block mb-1.5">
                Kriptografik Geçiş Anahtarı (Sovereign Passkey)
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setError(false);
                }}
                placeholder="Örn: 2126 veya NUR-SOVEREIGN-2126"
                className="w-full p-3 rounded-xl bg-black/70 border border-cyan-500/40 text-sm font-mono text-white tracking-widest focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                autoFocus
              />
              {error && (
                <span className="text-[11px] text-red-400 font-mono mt-1.5 block">
                  ⚠️ Geçersiz Yetki Kodu! Lütfen doğru anahtarı girin (Demo: 2126).
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>KUANTUM ŞİFRE ÇÖZÜLÜYOR...</span>
                </>
              ) : (
                <span>⚡ DOĞRULA VE YÖNETİCİ MODUNU AÇ</span>
              )}
            </button>
          </form>
        )}

        <div className="text-[10px] font-mono text-center text-slate-500 border-t border-white/5 pt-2">
          Kısayol: <code className="text-cyan-400">Ctrl + Shift + S</code> veya Kartala 3 Kez Tıklama
        </div>
      </div>
    </div>
  );
}
