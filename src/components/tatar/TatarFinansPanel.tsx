"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";

// This module is deliberately NOT a gambling product: no randomized-outcome wagering,
// no house edge, no chance-based win/loss mechanic. It's a self-directed spending
// safeguard (velocity cap + opt-in cooldown, modeled on Monzo/Starling's "Gambling
// Block" pattern) paired with a plain recurring auto-invest (DCA) feature.

const DISABLE_COOLDOWN_HOURS = 48;

interface SafeAsset {
  symbol: string;
  name: string;
  historical6mReturn: string;
  riskProfile: "DÜŞÜK RİSK" | "DENGELİ" | "BÜYÜME";
  description: string;
}

const SAFE_ASSETS: SafeAsset[] = [
  {
    symbol: "SPY",
    name: "S&P 500 Endeks Fonu",
    historical6mReturn: "+14.8%",
    riskProfile: "DENGELİ",
    description: "Geniş çaplı, düşük maliyetli endeks fonu. Uzun vadeli birikim için standart seçim.",
  },
  {
    symbol: "XAU/USD",
    name: "Fiziki Altın & Emtia Sepeti",
    historical6mReturn: "+18.6%",
    riskProfile: "DÜŞÜK RİSK",
    description: "Enflasyona karşı geleneksel koruma sağlayan düşük volatiliteli rezerv varlık.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    historical6mReturn: "+84.2%",
    riskProfile: "BÜYÜME",
    description: "Tek hisseye yoğunlaşan, daha yüksek volatiliteli büyüme pozisyonu.",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    historical6mReturn: "+62.0%",
    riskProfile: "BÜYÜME",
    description: "Yüksek volatiliteli dijital varlık; küçük, düzenli tutarlarla biriktirmeye uygun.",
  },
];

interface OutflowLogEntry {
  id: string;
  amount: number;
  timestamp: number;
}

interface DcaLogEntry {
  id: string;
  amount: number;
  symbol: string;
  timestamp: number;
}

export default function TatarFinansPanel() {
  const { addNotification } = useIDEStore();

  // Balances
  const [availableBalanceUSDT, setAvailableBalanceUSDT] = useState(2500);
  const [protectedBalanceUSDT, setProtectedBalanceUSDT] = useState(18450);

  // Spending Velocity Protection (opt-in, user-controlled)
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [monthlyOutflowCapPercent, setMonthlyOutflowCapPercent] = useState(50);
  const [monthlyOutflowUsedUSDT, setMonthlyOutflowUsedUSDT] = useState(0);
  const [outflowLog, setOutflowLog] = useState<OutflowLogEntry[]>([]);
  const [outflowRequestAmount, setOutflowRequestAmount] = useState("500");
  const [disableRequestedAt, setDisableRequestedAt] = useState<number | null>(null);
  const [cooldownNow, setCooldownNow] = useState(() => Date.now());

  useEffect(() => {
    if (disableRequestedAt === null) return;
    const interval = setInterval(() => setCooldownNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [disableRequestedAt]);

  const monthlyOutflowCapUSDT = +((protectedBalanceUSDT + availableBalanceUSDT) * (monthlyOutflowCapPercent / 100)).toFixed(2);
  const monthlyOutflowRemaining = Math.max(0, monthlyOutflowCapUSDT - monthlyOutflowUsedUSDT);
  const cooldownRemainingMs = disableRequestedAt !== null ? Math.max(0, disableRequestedAt + DISABLE_COOLDOWN_HOURS * 3600 * 1000 - cooldownNow) : 0;
  const cooldownElapsed = disableRequestedAt !== null && cooldownRemainingMs === 0;

  const handleToggleProtection = () => {
    if (!protectionEnabled) {
      setProtectionEnabled(true);
      setDisableRequestedAt(null);
      addNotification({
        title: "🛡️ Harcama Koruması Etkinleştirildi",
        message: `Aylık çıkış tavanı %${monthlyOutflowCapPercent} olarak ayarlandı. Bu korumayı kapatmak isterseniz, dürtüsel anlarda geri adım atmanızı sağlamak için ${DISABLE_COOLDOWN_HOURS} saatlik bir bekleme süresi uygulanır — bunu şimdiden, açık rızanızla kabul ediyorsunuz.`,
        severity: "SUCCESS",
        category: "SYSTEM",
      });
      return;
    }

    if (disableRequestedAt === null) {
      setDisableRequestedAt(Date.now());
      addNotification({
        title: "⏳ Koruma Kapatma Talebi Alındı",
        message: `${DISABLE_COOLDOWN_HOURS} saat sonra onaylayarak korumayı kapatabilirsiniz. Bu bekleme, sizin isteğinizle önceden etkinleştirdiğiniz bir dürtü-kontrol mekanizmasıdır.`,
        severity: "WARNING",
        category: "SYSTEM",
      });
      return;
    }

    if (cooldownElapsed) {
      setProtectionEnabled(false);
      setDisableRequestedAt(null);
      addNotification({
        title: "🔓 Harcama Koruması Kapatıldı",
        message: "Aylık çıkış tavanı artık uygulanmıyor.",
        severity: "WARNING",
        category: "SYSTEM",
      });
    }
  };

  const handleRequestOutflow = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(outflowRequestAmount);
    if (isNaN(amount) || amount <= 0 || amount > availableBalanceUSDT) return;

    if (protectionEnabled && amount > monthlyOutflowRemaining) {
      addNotification({
        title: "🛡️ Aylık Tavan Aşıldı",
        message: `Bu ay için kalan çıkış hakkınız ${monthlyOutflowRemaining.toFixed(2)} USDT. Bu, kendi belirlediğiniz koruma ayarıdır — artırmak isterseniz aşağıdan tavan oranınızı değiştirebilirsiniz.`,
        severity: "WARNING",
        category: "SYSTEM",
      });
      return;
    }

    setAvailableBalanceUSDT((v) => v - amount);
    setMonthlyOutflowUsedUSDT((v) => v + amount);
    setOutflowLog((prev) => [{ id: `out-${Date.now()}`, amount, timestamp: Date.now() }, ...prev]);
    addNotification({
      title: "✅ Çıkış Onaylandı",
      message: `${amount.toLocaleString()} USDT hesabınızdan çıkarıldı. Hiçbir gizli gecikme veya kesinti uygulanmadı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const handleMoveToProtected = (amount: number) => {
    if (amount <= 0 || amount > availableBalanceUSDT) return;
    setAvailableBalanceUSDT((v) => v - amount);
    setProtectedBalanceUSDT((v) => v + amount);
    addNotification({
      title: "🔒 Korumalı Bakiyeye Aktarıldı",
      message: `${amount.toLocaleString()} USDT, aylık harcama hızı sınırına tabi olmayan korumalı bakiyeye taşındı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // Automated DCA (Dollar-Cost Averaging) into a chosen safe/growth asset
  const [dcaEnabled, setDcaEnabled] = useState(false);
  const [dcaAmount, setDcaAmount] = useState(100);
  const [dcaFrequency, setDcaFrequency] = useState<"weekly" | "monthly">("monthly");
  const [dcaTarget, setDcaTarget] = useState<SafeAsset>(SAFE_ASSETS[0]);
  const [dcaLog, setDcaLog] = useState<DcaLogEntry[]>([]);

  const handleToggleDca = () => {
    setDcaEnabled((prev) => {
      const next = !prev;
      addNotification({
        title: next ? "📈 Otomatik Yatırım (DCA) Etkinleştirildi" : "⏸️ Otomatik Yatırım Durduruldu",
        message: next
          ? `Her ${dcaFrequency === "weekly" ? "hafta" : "ay"} ${dcaAmount} USDT, korumalı bakiyenizden ${dcaTarget.symbol} pozisyonuna otomatik aktarılacak.`
          : "Otomatik yatırım planı durduruldu.",
        severity: "INFO",
        category: "SYSTEM",
      });
      return next;
    });
  };

  const handleRunDcaNow = () => {
    if (!dcaEnabled || dcaAmount > protectedBalanceUSDT) return;
    setProtectedBalanceUSDT((v) => v - dcaAmount);
    setDcaLog((prev) => [{ id: `dca-${Date.now()}`, amount: dcaAmount, symbol: dcaTarget.symbol, timestamp: Date.now() }, ...prev]);
    addNotification({
      title: "📈 DCA İşlemi Uygulandı (Manuel Tetikleme — Demo)",
      message: `${dcaAmount} USDT, ${dcaTarget.symbol} pozisyonuna aktarıldı. Gerçek planlı çalıştırma ${dcaFrequency === "weekly" ? "haftalık" : "aylık"} olacaktır.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const totalDcaInvested = dcaLog.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Banner */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={34} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">
                TATAR FİNANS — Dürtüsel Harcama Koruması & Otomatik Yatırım
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OPT-IN &bull; KUMAR DEĞİL
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Aylık Harcama Hızı Sınırı &bull; Kendi Rızanızla Etkinleştirdiğiniz Bekleme Süresi &bull; Otomatik DCA Yatırım
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-black/40 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block font-sans uppercase">💳 Kullanılabilir Bakiye</span>
            <span className="text-sm font-bold text-white">{availableBalanceUSDT.toLocaleString()} USDT</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-black/40 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-sans uppercase">🔒 Korumalı Bakiye</span>
            <span className="text-sm font-bold text-emerald-300">{protectedBalanceUSDT.toLocaleString()} USDT</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* LEFT: Spending Velocity Protection */}
        <div className="flex-1 flex flex-col border-r overflow-y-auto p-5 space-y-4" style={{ borderColor: "var(--ag-border)" }}>
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
            <h3 className="text-sm font-bold text-amber-300 font-serif">🛡️ Harcama Hızı Koruması</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tamamen isteğe bağlı. Etkinleştirirseniz, kullanılabilir bakiyenizden aylık çıkarabileceğiniz tutara kendi belirlediğiniz bir
              tavan koyarsınız. Korumayı kapatmak {DISABLE_COOLDOWN_HOURS} saat sürer — bu, dürtüsel bir anda kendi kendinize karşı önceden
              aldığınız bir önlemdir, şirketin sizi alıkoyması değildir.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-white">Koruma Durumu</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {protectionEnabled ? `Aktif — Aylık tavan %${monthlyOutflowCapPercent}` : "Kapalı"}
                </div>
              </div>
              <button
                onClick={handleToggleProtection}
                disabled={protectionEnabled && disableRequestedAt !== null && !cooldownElapsed}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors disabled:opacity-40 ${
                  protectionEnabled
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                }`}
              >
                {!protectionEnabled
                  ? "KORUMAYI ETKİNLEŞTİR"
                  : disableRequestedAt === null
                  ? "KAPATMAYI TALEP ET"
                  : cooldownElapsed
                  ? "ONAYLA VE KAPAT"
                  : `${Math.ceil(cooldownRemainingMs / 3600000)} SAAT KALDI`}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Aylık Çıkış Tavanı</span>
                <span className="text-amber-300 font-bold">%{monthlyOutflowCapPercent} ({monthlyOutflowCapUSDT.toLocaleString()} USDT)</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={monthlyOutflowCapPercent}
                onChange={(e) => setMonthlyOutflowCapPercent(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                  style={{ width: `${monthlyOutflowCapUSDT > 0 ? Math.min(100, (monthlyOutflowUsedUSDT / monthlyOutflowCapUSDT) * 100) : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Bu ay kullanılan: {monthlyOutflowUsedUSDT.toFixed(2)} / {monthlyOutflowCapUSDT.toLocaleString()} USDT
              </div>
            </div>
          </div>

          {/* Outflow Request Form */}
          <form onSubmit={handleRequestOutflow} className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase">Çıkış Talebi</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={outflowRequestAmount}
                onChange={(e) => setOutflowRequestAmount(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-sm font-mono font-bold text-white focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-mono shrink-0">USDT</span>
              <button
                type="submit"
                disabled={parseFloat(outflowRequestAmount || "0") <= 0 || parseFloat(outflowRequestAmount || "0") > availableBalanceUSDT}
                className="px-4 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono transition-colors disabled:opacity-40"
              >
                ÇIKAR
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleMoveToProtected(parseFloat(outflowRequestAmount || "0"))}
              disabled={parseFloat(outflowRequestAmount || "0") <= 0 || parseFloat(outflowRequestAmount || "0") > availableBalanceUSDT}
              className="w-full py-2 rounded-xl text-[11px] font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors disabled:opacity-40"
            >
              🔒 Bunun Yerine Korumalı Bakiyeye Taşı
            </button>
          </form>

          {outflowLog.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Çıkış Geçmişi</div>
              {outflowLog.slice(0, 5).map((e) => (
                <div key={e.id} className="flex justify-between text-[11px] font-mono p-2 rounded bg-black/40">
                  <span className="text-slate-300">{new Date(e.timestamp).toLocaleString()}</span>
                  <span className="text-red-400">-{e.amount.toLocaleString()} USDT</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Automated DCA */}
        <div className="w-[420px] flex flex-col p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
            <span className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-1.5">
              📈 Otomatik Yatırım (DCA)
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Korumalı bakiyenizden düzenli, küçük tutarlarla seçtiğiniz varlığa otomatik yatırım yapın (dollar-cost averaging). Hiçbir
              rastgele kazanç/kayıp mekanizması yoktur — bu bir yatırım planıdır, bahis değildir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Plan Durumu</span>
              <button
                onClick={handleToggleDca}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  dcaEnabled
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {dcaEnabled ? "DURDUR" : "BAŞLAT"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Tutar (USDT)</label>
                <input
                  type="number"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(Math.max(1, Number(e.target.value)))}
                  disabled={dcaEnabled}
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none disabled:opacity-40"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Sıklık</label>
                <select
                  value={dcaFrequency}
                  onChange={(e) => setDcaFrequency(e.target.value as "weekly" | "monthly")}
                  disabled={dcaEnabled}
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none disabled:opacity-40"
                >
                  <option value="weekly">Haftalık</option>
                  <option value="monthly">Aylık</option>
                </select>
              </div>
            </div>

            {dcaEnabled && (
              <button
                onClick={handleRunDcaNow}
                disabled={dcaAmount > protectedBalanceUSDT}
                className="w-full py-2 rounded-lg text-[11px] font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors disabled:opacity-40"
              >
                Şimdi Çalıştır (Manuel Tetikleme — Demo)
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase block">Hedef Varlık:</label>
            <div className="space-y-1.5">
              {SAFE_ASSETS.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => !dcaEnabled && setDcaTarget(s)}
                  className={`p-2.5 rounded-lg border transition-all ${dcaEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
                    dcaTarget.symbol === s.symbol ? "bg-emerald-950/30 border-emerald-500/50" : "bg-black/30 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-white">{s.symbol} — {s.name}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">{s.historical6mReturn} (6A)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {dcaLog.length > 0 && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Toplam Otomatik Yatırım:</span>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--ag-muted)]">{dcaLog.length} işlem</span>
                <span className="font-mono font-bold text-emerald-400">{totalDcaInvested.toLocaleString()} USDT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
