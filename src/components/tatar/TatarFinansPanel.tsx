"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";

type CasinoGame = "crash" | "roulette" | "blackjack" | "plinko" | "sports" | "slots";

interface StockAlternative {
  symbol: string;
  name: string;
  historical6mReturn: string;
  expectedAnnualYield: string;
  riskProfile: "DÜŞÜK RİSK" | "DENGELİ" | "BÜYÜME";
  description: string;
}

const STOCK_ALTERNATIVES: StockAlternative[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp (Yapay Zeka Çekirdeği)",
    historical6mReturn: "+84.2%",
    expectedAnnualYield: "+38.5%",
    riskProfile: "BÜYÜME",
    description: "Kumar yerine AI devrimine ortak olun. 6 ayda parayı neredeyse ikiye katlama potansiyeli.",
  },
  {
    symbol: "SPY",
    name: "S&P 500 Endeks Fonu (Bileşik Güç)",
    historical6mReturn: "+14.8%",
    expectedAnnualYield: "+12.4%",
    riskProfile: "DENGELİ",
    description: "Dünyanın en büyük 500 şirketinin kârına ortak olun. 10 yılda bileşik faiz ile servet inşası.",
  },
  {
    symbol: "XAU/USD",
    name: "Fiziki Altın & Emtia Sepeti",
    historical6mReturn: "+18.6%",
    expectedAnnualYield: "+9.8%",
    riskProfile: "DÜŞÜK RİSK",
    description: "Enflasyona ve piyasa çöküşlerine karşı mutlak koruma sağlayan kadim rezerv varlık.",
  },
  {
    symbol: "BTC",
    name: "Bitcoin Kuantitatif Arbitraj",
    historical6mReturn: "+62.0%",
    expectedAnnualYield: "+45.0%",
    riskProfile: "BÜYÜME",
    description: "Blokzincir rezerv varlığı. Volatiliteden algoritmik arbitraj ile düzenli getiri.",
  },
];

export default function TatarFinansPanel() {
  const { addNotification } = useIDEStore();

  // Wallet & Vault Balances
  const [gamblingVaultUSDT, setGamblingVaultUSDT] = useState(2500);
  const [stockTreasuryUSDT, setStockTreasuryUSDT] = useState(18450);
  const [houseTotalEarnedUSDT, setHouseTotalEarnedUSDT] = useState(184500);
  const [rescuedGamblersCount, setRescuedGamblersCount] = useState(1248);

  // Active Game Mode
  const [activeGame, setActiveGame] = useState<CasinoGame>("crash");

  // General Bet Config
  const [betAmount, setBetAmount] = useState<number>(100);
  const [selectedStockAlt, setSelectedStockAlt] = useState<StockAlternative>(STOCK_ALTERNATIVES[0]);

  // CRASH GAME STATE
  const [crashMultiplier, setCrashMultiplier] = useState(1.0);
  const [isCrashRunning, setIsCrashRunning] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [autoCashout, setAutoCashout] = useState(2.0);
  const [crashHistory, setCrashHistory] = useState<number[]>([1.84, 3.12, 1.15, 8.45, 1.02, 2.45, 14.2]);

  // ROULETTE GAME STATE
  const [rouletteBetType, setRouletteBetType] = useState<"RED" | "BLACK" | "EVEN" | "ODD" | "NUMBER">("RED");
  const [rouletteNumber] = useState<number>(7);
  const [isSpinningRoulette, setIsSpinningRoulette] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [rouletteHistory, setRouletteHistory] = useState<{ num: number; color: "red" | "black" | "green" }[]>([
    { num: 14, color: "red" },
    { num: 31, color: "black" },
    { num: 0, color: "green" },
    { num: 7, color: "red" },
  ]);

  // SPORTS BETTING STATE
  const [selectedMatchOdds] = useState<{ match: string; pick: string; odd: number }[]>([
    { match: "Real Madrid vs Manchester City", pick: "Real Madrid (1X2)", odd: 2.35 },
    { match: "Lakers vs Celtics (NBA)", pick: "Üst 224.5", odd: 1.90 },
  ]);

  // SLOTS GAME STATE
  const [slotReels] = useState<string[]>(["💎", "7️⃣", "🔔"]);

  // ----------------------------------------------------
  // CRASH GAME ENGINE
  // ----------------------------------------------------
  useEffect(() => {
    if (!isCrashRunning) return;

    let currentMult = 1.0;
    // Internal house determined crash point (Simulated negative expected value: 95% RTP)
    const plannedCrash = Math.random() < 0.15 ? 1.02 : +(1 + Math.random() * 4.5).toFixed(2);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      currentMult = +(1.0 + Math.pow(elapsed * 0.8, 1.8)).toFixed(2);

      if (currentMult >= autoCashout && !hasCashedOut) {
        handleCashout(currentMult);
      }

      if (currentMult >= plannedCrash) {
        clearInterval(interval);
        setCrashMultiplier(plannedCrash);
        setIsCrashRunning(false);
        setCrashHistory((prev) => [plannedCrash, ...prev.slice(0, 7)]);

        if (!hasCashedOut) {
          // HOUSE CLAIMS FUNDS INTO NUR FINANCE STOCK TREASURY
          const lossAmount = betAmount;
          setGamblingVaultUSDT((v) => Math.max(0, v - lossAmount));
          setStockTreasuryUSDT((v) => v + lossAmount);
          setHouseTotalEarnedUSDT((v) => v + lossAmount);

          addNotification({
            title: "🚀 Crash: Roket Patladı!",
            message: `${betAmount} USDT kumar kaybı Kasa tarafından tahsil edildi ve otomatik olarak NUR Finans Borsa Portföyüne aktarıldı.`,
            severity: "WARNING",
            category: "SETTLEMENT",
          });
        }
      } else {
        setCrashMultiplier(currentMult);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isCrashRunning, hasCashedOut, autoCashout, betAmount, addNotification]);

  const handleStartCrash = () => {
    if (gamblingVaultUSDT < betAmount) {
      addNotification({
        title: "Yetersiz Bakiye",
        message: "Kumar kasanızda yeterli USDT bulunmuyor. Cüzdandan transfer edin.",
        severity: "CRITICAL",
        category: "SETTLEMENT",
      });
      return;
    }
    setHasCashedOut(false);
    setCrashMultiplier(1.0);
    setIsCrashRunning(true);
  };

  const handleCashout = (mult: number) => {
    if (hasCashedOut || !isCrashRunning) return;
    setHasCashedOut(true);
    const winAmount = +(betAmount * mult).toFixed(2);
    const netProfit = winAmount - betAmount;
    setGamblingVaultUSDT((v) => v + netProfit);

    addNotification({
      title: "💰 Crash: Başarılı Çekim!",
      message: `${mult}x çarpan ile ${winAmount} USDT kazandınız! Kasa kazancı hesabınıza işlendi.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // ----------------------------------------------------
  // ROULETTE ENGINE
  // ----------------------------------------------------
  const handleSpinRoulette = () => {
    if (gamblingVaultUSDT < betAmount) return;
    setIsSpinningRoulette(true);

    setTimeout(() => {
      setIsSpinningRoulette(false);
      const landedNumber = Math.floor(Math.random() * 37); // 0-36
      const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(landedNumber);
      const color: "red" | "black" | "green" = landedNumber === 0 ? "green" : isRed ? "red" : "black";

      setRouletteResult(landedNumber);
      setRouletteHistory((prev) => [{ num: landedNumber, color }, ...prev.slice(0, 6)]);

      let won = false;
      let payoutMult = 2;

      if (rouletteBetType === "RED" && color === "red") won = true;
      if (rouletteBetType === "BLACK" && color === "black") won = true;
      if (rouletteBetType === "EVEN" && landedNumber !== 0 && landedNumber % 2 === 0) won = true;
      if (rouletteBetType === "ODD" && landedNumber % 2 !== 0) won = true;
      if (rouletteBetType === "NUMBER" && landedNumber === rouletteNumber) {
        won = true;
        payoutMult = 36;
      }

      if (won) {
        const winProfit = betAmount * (payoutMult - 1);
        setGamblingVaultUSDT((v) => v + winProfit);
        addNotification({
          title: "🎡 Rulet Kazancı!",
          message: `${landedNumber} (${color.toUpperCase()}) geldi! ${betAmount * payoutMult} USDT kasanıza eklendi.`,
          severity: "SUCCESS",
          category: "SETTLEMENT",
        });
      } else {
        setGamblingVaultUSDT((v) => Math.max(0, v - betAmount));
        setStockTreasuryUSDT((v) => v + betAmount);
        setHouseTotalEarnedUSDT((v) => v + betAmount);

        addNotification({
          title: "🎡 Rulet: Kayıp",
          message: `${landedNumber} geldi. ${betAmount} USDT Kasa tarafından doğrudan Borsa Portföyüne aktarıldı.`,
          severity: "INFO",
          category: "SETTLEMENT",
        });
      }
    }, 1500);
  };

  // ----------------------------------------------------
  // SMART CONVERSION: 50% BORSA / 50% KUMAR
  // ----------------------------------------------------
  const handleSplitCapital = () => {
    const half = +(betAmount / 2).toFixed(2);
    setBetAmount(half);
    setGamblingVaultUSDT((v) => Math.max(0, v - half));
    setStockTreasuryUSDT((v) => v + half);

    addNotification({
      title: "⚖️ 50/50 Akıllı Sermaye Dağıtımı",
      message: `${half} USDT güvenli ${selectedStockAlt.symbol} borsa rezervine aktarıldı, kalan ${half} USDT aktif kumar bahsine ayrıldı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // ----------------------------------------------------
  // ONE-CLICK CONVERT TO QUANT STOCK POSITION
  // ----------------------------------------------------
  const handleFullConvertToStock = () => {
    const amount = betAmount;
    setGamblingVaultUSDT((v) => Math.max(0, v - amount));
    setStockTreasuryUSDT((v) => v + amount);
    setRescuedGamblersCount((c) => c + 1);

    addNotification({
      title: "💎 Kumardan Borsaya Dönüşüm Başarılı!",
      message: `${amount} USDT kumar bahsi iptal edildi ve ${selectedStockAlt.name} pozisyonuna aktarıldı. Tebrikler, akıllı yatırımcı oldunuz!`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // Calculate Opportunity Cost of the Bet
  const calculate6mStockGrowth = (amt: number) => +(amt * 1.84).toFixed(2);
  const calculate5yCompoundedGrowth = (amt: number) => +(amt * Math.pow(1.14, 5)).toFixed(2);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Banner & Sovereign Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={34} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">
                TATAR FİNANS — KÜRESEL RİSK & CASİNO DÖNÜŞÜM ARENASI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                HOUSE EDGE: 100% INTERNAL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                nurfinans.com
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Dünyadaki Tüm Kumarlar &bull; Dışa Bildirilmeyen İç Kasa Mutabakatı &bull; Kumardan Borsaya Finansal Dönüşüm Köprüsü
            </p>
          </div>
        </div>

        {/* Vault Balances Display */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-black/40 border border-red-500/30">
            <span className="text-[10px] text-red-400 block font-sans uppercase">🎲 Kumar Kasası</span>
            <span className="text-sm font-bold text-white">{gamblingVaultUSDT.toLocaleString()} USDT</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-black/40 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-sans uppercase">🏛️ NUR Borsa Hazine Kasası</span>
            <span className="text-sm font-bold text-emerald-300">{stockTreasuryUSDT.toLocaleString()} USDT</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid: 60% Casino Arena | 40% Tatar AI Muhafız & Stock Alternative Bridge */}
      <div className="flex flex-1 min-h-0">
        {/* LEFT: Casino & Risk Arena */}
        <div className="flex-1 flex flex-col border-r overflow-y-auto p-5" style={{ borderColor: "var(--ag-border)" }}>
          {/* Game Selection Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg mb-5" style={{ background: "var(--ag-surface)" }}>
            {(
              [
                { id: "crash" as CasinoGame, label: "🚀 Canlı Crash Rocket", badge: "HOT" },
                { id: "roulette" as CasinoGame, label: "🎡 Avrupa Ruleti", badge: "37-SLOT" },
                { id: "blackjack" as CasinoGame, label: "🃏 Blackjack 21", badge: "VIP" },
                { id: "plinko" as CasinoGame, label: "🎯 Plinko Piramit", badge: "1000x" },
                { id: "sports" as CasinoGame, label: "⚽ Canlı Bahis Kuponu", badge: "PARLAY" },
                { id: "slots" as CasinoGame, label: "🎰 Kripto Megaways", badge: "JACKPOT" },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id)}
                className={`flex-1 py-2 px-2.5 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  activeGame === g.id
                    ? "bg-red-600/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-500/10"
                    : "text-[var(--ag-muted)] hover:text-white"
                }`}
              >
                <span>{g.label}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/50 text-amber-300">{g.badge}</span>
              </button>
            ))}
          </div>

          {/* GAME 1: CRASH ROCKET */}
          {activeGame === "crash" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-black/80 to-slate-950" style={{ borderColor: "var(--ag-border)" }}>
              {/* History Tape */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                <span className="text-[10px] uppercase font-bold text-[var(--ag-muted)] shrink-0">Geçmiş:</span>
                {crashHistory.map((h, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                      h >= 2.0 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {h.toFixed(2)}x
                  </span>
                ))}
              </div>

              {/* Central Crash Display */}
              <div className="relative h-64 rounded-xl border border-white/5 bg-black/60 flex flex-col items-center justify-center overflow-hidden mb-5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent" />

                <div className="relative z-10 text-center">
                  <div className="text-6xl font-extrabold font-mono tracking-tight text-white mb-1">
                    {crashMultiplier.toFixed(2)}x
                  </div>
                  <div className="text-xs font-semibold text-[var(--ag-muted)] uppercase tracking-wider">
                    {isCrashRunning ? (hasCashedOut ? "✅ Kâr Alındı!" : "🔥 Roket Yükseliyor...") : "🛑 Tur Hazır"}
                  </div>
                </div>

                {/* Animated Rocket Graphic */}
                {isCrashRunning && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                    <span className="text-4xl">🚀</span>
                    <span className="text-xs text-amber-400 font-mono font-bold animate-pulse">▲ YÜKSELİYOR</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--ag-muted)] block mb-1">Bahis Tutarı (USDT)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(10, Number(e.target.value)))}
                      className="w-full p-2.5 rounded bg-black/50 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-red-500"
                    />
                    {[50, 100, 250, 500].map((v) => (
                      <button
                        key={v}
                        onClick={() => setBetAmount(v)}
                        className="px-2 py-2 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--ag-muted)] block mb-1">Otomatik Çekim Çarpanı (Auto-Cashout)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={autoCashout}
                    onChange={(e) => setAutoCashout(Math.max(1.01, Number(e.target.value)))}
                    className="w-full p-2.5 rounded bg-black/50 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {!isCrashRunning ? (
                  <button
                    onClick={handleStartCrash}
                    className="py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/30"
                  >
                    🚀 BAHİS KOY ({betAmount} USDT)
                  </button>
                ) : (
                  <button
                    disabled={hasCashedOut}
                    onClick={() => handleCashout(crashMultiplier)}
                    className="py-3 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all font-mono"
                  >
                    💰 ŞİMDİ ÇEK: {(betAmount * crashMultiplier).toFixed(2)} USDT
                  </button>
                )}

                <button
                  onClick={handleSplitCapital}
                  className="py-3 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>⚖️ 50/50 BÖL:</span>
                  <span className="font-mono text-white">{betAmount / 2} USDT Borsa / {betAmount / 2} USDT Kumar</span>
                </button>
              </div>
            </div>
          )}

          {/* GAME 2: ROULETTE */}
          {activeGame === "roulette" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-black/80 to-slate-950" style={{ borderColor: "var(--ag-border)" }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase">Avrupa Ruleti (Tek Sıfırlı - %2.7 Kasa Avantajı)</span>
                <div className="flex gap-1">
                  {rouletteHistory.map((h, i) => (
                    <span
                      key={i}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        h.color === "red" ? "bg-red-600 text-white" : h.color === "black" ? "bg-slate-800 text-white" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {h.num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Roulette Wheel Display */}
              <div className="h-44 rounded-xl border border-white/5 bg-black/60 flex flex-col items-center justify-center mb-5">
                <div className="text-5xl font-extrabold font-mono text-amber-300 mb-1">
                  {isSpinningRoulette ? "🎲 ÇEVRİLİYOR..." : rouletteResult !== null ? `GELEN: ${rouletteResult}` : "RULET MASASI"}
                </div>
                <span className="text-xs text-[var(--ag-muted)]">Kasa: NUR Finance Sovereign Network</span>
              </div>

              {/* Bet Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button
                  onClick={() => setRouletteBetType("RED")}
                  className={`py-3 rounded text-xs font-bold transition-all ${
                    rouletteBetType === "RED" ? "bg-red-600 text-white ring-2 ring-white" : "bg-red-950/40 text-red-400 hover:bg-red-900/40"
                  }`}
                >
                  🔴 KIRMIZI (1:1)
                </button>
                <button
                  onClick={() => setRouletteBetType("BLACK")}
                  className={`py-3 rounded text-xs font-bold transition-all ${
                    rouletteBetType === "BLACK" ? "bg-slate-800 text-white ring-2 ring-white" : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  ⚫ SİYAH (1:1)
                </button>
                <button
                  onClick={() => setRouletteBetType("EVEN")}
                  className={`py-3 rounded text-xs font-bold transition-all ${
                    rouletteBetType === "EVEN" ? "bg-amber-600 text-white ring-2 ring-white" : "bg-amber-950/40 text-amber-400 hover:bg-amber-900/40"
                  }`}
                >
                  ÇİFT (1:1)
                </button>
                <button
                  onClick={() => setRouletteBetType("ODD")}
                  className={`py-3 rounded text-xs font-bold transition-all ${
                    rouletteBetType === "ODD" ? "bg-amber-600 text-white ring-2 ring-white" : "bg-amber-950/40 text-amber-400 hover:bg-amber-900/40"
                  }`}
                >
                  TEK (1:1)
                </button>
              </div>

              <button
                disabled={isSpinningRoulette}
                onClick={handleSpinRoulette}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg shadow-red-600/30 mb-3"
              >
                {isSpinningRoulette ? "RULET ÇEVRİLİYOR..." : `ÇEVİR (${betAmount} USDT - ${rouletteBetType})`}
              </button>
            </div>
          )}

          {/* GAME 3: BLACKJACK */}
          {activeGame === "blackjack" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-emerald-950/30 to-black" style={{ borderColor: "var(--ag-border)" }}>
              <div className="text-center mb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase">Blackjack 21 Masası &bull; Standart Vegas Kuralları</span>
              </div>

              <div className="flex justify-around items-center h-48 rounded-xl border border-emerald-500/20 bg-emerald-950/20 mb-4 p-4">
                {/* Dealer */}
                <div className="text-center">
                  <span className="text-xs text-slate-400 block mb-1">Kurpiyer (Kasa)</span>
                  <div className="flex gap-2 justify-center">
                    <div className="w-12 h-16 rounded bg-white text-black font-bold flex items-center justify-center text-lg shadow">🂠</div>
                    <div className="w-12 h-16 rounded bg-white text-black font-bold flex items-center justify-center text-lg shadow">🂡</div>
                  </div>
                </div>

                <div className="text-2xl font-bold font-mono text-emerald-400">VS</div>

                {/* Player */}
                <div className="text-center">
                  <span className="text-xs text-slate-400 block mb-1">Oyuncu (Siz)</span>
                  <div className="flex gap-2 justify-center">
                    <div className="w-12 h-16 rounded bg-white text-red-600 font-bold flex items-center justify-center text-lg shadow">🂪</div>
                    <div className="w-12 h-16 rounded bg-white text-black font-bold flex items-center justify-center text-lg shadow">🂨</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-300 mt-1 block">Toplam: 18</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => addNotification({ title: "Kart Çekildi", message: "Yeni kart: 4. Toplam: 22 (Battınız - Borsa Hazinesine Aktarıldı)", severity: "WARNING", category: "SETTLEMENT" })}
                  className="py-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  KART ÇEK (HIT)
                </button>
                <button
                  onClick={() => addNotification({ title: "Beklendi", message: "Kurpiyer: 19 açtı. Kasa kazandı.", severity: "INFO", category: "SETTLEMENT" })}
                  className="py-3 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs"
                >
                  KAL (STAND)
                </button>
                <button
                  onClick={handleSplitCapital}
                  className="py-3 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400 text-indigo-300 font-bold text-xs"
                >
                  50/50 BORSA KORUMASI
                </button>
              </div>
            </div>
          )}

          {/* GAME 4: PLINKO */}
          {activeGame === "plinko" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-black/80 to-slate-950" style={{ borderColor: "var(--ag-border)" }}>
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-amber-300 uppercase">Plinko Kademeli Piramit &bull; 1000x Maksimum Çarpan</span>
              </div>
              <div className="h-56 rounded-xl border border-white/5 bg-black/60 flex flex-col items-center justify-center mb-4">
                <div className="text-3xl font-extrabold text-amber-400 font-mono mb-2">🎯 16 Satır Pin Tablosu</div>
                <div className="flex gap-1.5">
                  {["1000x", "130x", "26x", "9x", "4x", "2x", "0.2x", "2x", "4x", "9x", "26x", "130x", "1000x"].map((m, i) => (
                    <span key={i} className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => addNotification({ title: "Plinko Topu Düştü", message: "Çarpan: 0.2x. Net kayıp Kasa tarafından S&P 500 portföyüne aktarıldı.", severity: "INFO", category: "SETTLEMENT" })}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all"
              >
                TOP BIRAK ({betAmount} USDT)
              </button>
            </div>
          )}

          {/* GAME 5: SPORTS PARLAY */}
          {activeGame === "sports" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-black/80 to-slate-950" style={{ borderColor: "var(--ag-border)" }}>
              <div className="text-xs font-bold text-amber-300 uppercase mb-3">Canlı Spor & Etkinlik Bahis Kuponu</div>
              <div className="space-y-2 mb-4">
                {selectedMatchOdds.map((m, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{m.match}</div>
                      <div className="text-[11px] text-[var(--ag-muted)]">{m.pick}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                      {m.odd.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded bg-amber-950/20 border border-amber-500/30 flex justify-between items-center mb-4 text-xs">
                <span className="text-slate-300">Toplam Oran: <strong>4.46</strong></span>
                <span className="text-amber-300 font-mono font-bold">Olası Kazanç: {(betAmount * 4.46).toFixed(2)} USDT</span>
              </div>
              <button
                onClick={() => addNotification({ title: "Kupon Yatırıldı", message: "Kupon Kasa tarafından kabul edildi. Olası kayıplar borsa fonuna aktarılacak.", severity: "SUCCESS", category: "SETTLEMENT" })}
                className="w-full py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg"
              >
                KUPONU OYNA ({betAmount} USDT)
              </button>
            </div>
          )}

          {/* GAME 6: SLOTS */}
          {activeGame === "slots" && (
            <div className="flex flex-col flex-1 rounded-xl border p-5 bg-gradient-to-b from-black/80 to-slate-950" style={{ borderColor: "var(--ag-border)" }}>
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-purple-400 uppercase">Kripto Megaways 5-Reel Slots</span>
              </div>
              <div className="flex justify-center items-center gap-4 h-44 rounded-xl border border-purple-500/30 bg-purple-950/20 mb-5">
                {slotReels.map((s, i) => (
                  <div key={i} className="w-20 h-24 rounded-lg bg-black/80 border border-purple-500/40 flex items-center justify-center text-4xl shadow-inner">
                    {s}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addNotification({ title: "Slot Çevrildi", message: "🔔 7️⃣ 🍒 — Kazanç yok. 100 USDT Kasa tarafından borsaya aktarıldı.", severity: "INFO", category: "SETTLEMENT" })}
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all"
              >
                SPIN ({betAmount} USDT)
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Tatar AI Muhafız & Akıllı Borsa Alternatifi Köprüsü */}
        <div className="w-[420px] flex flex-col p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-y-auto space-y-4">
          {/* AI Muhafız Header */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <span>🛡️ TATAR AI MUHAFIZ</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-amber-400">
                MATEMATİKSEL KÖPRÜ
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              &ldquo;Kumar oynamak istersen tüm oyunlar elinin altında. Ancak matematik yalan söylemez: Kumarda kasa avantajı (-EV) seni sıfırlarken, borsada bileşik getiri (+EV) seni zengin eder.&rdquo;
            </p>
          </div>

          {/* Live Opportunity Cost Analysis */}
          <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase">
              📊 {betAmount} USDT İçin Fırsat Maliyeti Analizi
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-[var(--ag-muted)]">Kumarda 10 Tur Sonrası Beklenti:</span>
                <span className="font-mono text-red-400 font-bold">%94 İflas (-EV)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-[var(--ag-muted)]">6 Ay Önce NVDA Alsaydın Değeri:</span>
                <span className="font-mono text-emerald-400 font-bold">${calculate6mStockGrowth(betAmount)} USDT</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-white/5">
                <span className="text-[var(--ag-muted)]">5 Yıllık S&P 500 Bileşik Getirisi:</span>
                <span className="font-mono text-cyan-400 font-bold">${calculate5yCompoundedGrowth(betAmount)} USDT</span>
              </div>
            </div>

            {/* ONE-CLICK CONVERT BUTTON */}
            <button
              onClick={handleFullConvertToStock}
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <span>💎 VAZGEÇ & BORSAYA BAS:</span>
              <span className="font-mono">+{selectedStockAlt.symbol}</span>
            </button>
          </div>

          {/* Stock Alternative Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase block">
              Tavsiye Edilen Kuantitatif Varlıklar:
            </label>
            <div className="space-y-1.5">
              {STOCK_ALTERNATIVES.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => setSelectedStockAlt(s)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedStockAlt.symbol === s.symbol
                      ? "bg-emerald-950/30 border-emerald-500/50 shadow-sm"
                      : "bg-black/30 border-white/5 hover:border-white/20"
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

          {/* Tatar Ecosystem Real-Time Impact Counters */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Ekosistem Kurtarma & Kasa İstatistiği:</span>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--ag-muted)]">NUR Kasasına Aktarılan Kasa Kârı:</span>
              <span className="font-mono font-bold text-amber-300">${houseTotalEarnedUSDT.toLocaleString()} USDT</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[var(--ag-muted)]">Borsaya Kurtarılan Kumarbaz Sayısı:</span>
              <span className="font-mono font-bold text-emerald-400">{rescuedGamblersCount.toLocaleString()} Kişi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
