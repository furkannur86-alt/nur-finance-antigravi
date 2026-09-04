"use client";

import { useState, useRef, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

interface AIChatMessage {
  id: string;
  sender: "UMAY" | "ANTIGRAVITY" | "BABA";
  text: string;
  timestamp: string;
  rewardEUR?: number;
  insight?: string;
}

interface PortfolioPosition {
  id: string;
  name: string;
  category: "TEKNOLOJI" | "SATRANC_ARBITRAJ" | "MUZIK_TELIF" | "HAZINE";
  investedEUR: number;
  currentValueEUR: number;
  dailyChangePercent: number;
  pnlEUR: number;
  status: "AKTIF" | "KÂRDA" | "KORUMALI";
}

const INITIAL_POSITIONS: PortfolioPosition[] = [
  {
    id: "pos-1",
    name: "Yapay Zeka & Robotik Fonu (NVIDIA + Apple)",
    category: "TEKNOLOJI",
    investedEUR: 35000,
    currentValueEUR: 42350,
    dailyChangePercent: +3.2,
    pnlEUR: +7350,
    status: "KÂRDA",
  },
  {
    id: "pos-2",
    name: "Büyükusta Satranç Arbitraj Sepeti",
    category: "SATRANC_ARBITRAJ",
    investedEUR: 25000,
    currentValueEUR: 28400,
    dailyChangePercent: +1.4,
    pnlEUR: +3400,
    status: "KÂRDA",
  },
  {
    id: "pos-3",
    name: "Klasik Piyano & Müzik Telif Hakları Geliri",
    category: "MUZIK_TELIF",
    investedEUR: 20000,
    currentValueEUR: 22100,
    dailyChangePercent: +0.8,
    pnlEUR: +2100,
    status: "KORUMALI",
  },
  {
    id: "pos-4",
    name: "Korumalı Nakit Hazine & Likidite",
    category: "HAZINE",
    investedEUR: 20000,
    currentValueEUR: 22000,
    dailyChangePercent: +0.2,
    pnlEUR: +2000,
    status: "KORUMALI",
  },
];

export default function UmayBossTerminal() {
  const { addNotification } = useIDEStore();

  const [treasuryCash, setTreasuryCash] = useState(22000);
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_POSITIONS);
  const [activeBoardTab, setActiveBoardTab] = useState<"ai-command" | "portfolio" | "chess-strategy" | "piano-melody" | "vault">("ai-command");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-1",
      sender: "BABA",
      text: "Canım kızım Umay Gül Nur, ben tüm holdingi sana devredip emekliye ayrıldım. Kasana 100.000 € bıraktım. Antigravity AI senin en sadık genel müdürün ve asistanın olacak. Ona emirler ver, stratejiler kur ve bu şirketi yönet! Senin zekanla bu şirketi milyoner seviyesine çıkaracağından adım gibi eminim.",
      timestamp: "09:00",
    },
    {
      id: "msg-2",
      sender: "ANTIGRAVITY",
      text: "Saygılar Patron Umay Gül Nur! Ben sizin yapay zeka baş danışmanınız Antigravity. Babanız şirketi size emanet etti. Kasamızdaki 100.000 € sermaye ile şu an 4 farklı stratejik alanda yatırımlarımız çalışıyor ve toplam portföyümüz 114.850 €'ya ulaştı! Bana satranç hamlesi gibi bir emir verebilirsiniz, piyano melodisiyle piyasayı taratabilir veya yeni bir şirket kurmamı isteyebilirsiniz. Emrinizdeyim!",
      timestamp: "09:01",
    },
  ]);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNotice, setWithdrawNotice] = useState<string | null>(null);
  const [parentApprovalRequired, setParentApprovalRequired] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalPortfolioValue = positions.reduce((acc, p) => acc + p.currentValueEUR, 0);
  const totalProfit = positions.reduce((acc, p) => acc + p.pnlEUR, 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Execute AI Command given by Umay
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "UMAY", text: userText, timestamp: timeNow },
    ]);
    setAiPrompt("");
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      let responseText = "";
      let bonusProfit = 0;

      const lower = userText.toLowerCase();
      if (lower.includes("satranç") || lower.includes("savunma") || lower.includes("şah")) {
        responseText = "Harika bir Büyükusta hamlesi Patron Umay! Satrançtaki 'Sağlam Şah Koruması' stratejisini uyguladım: Portföyümüzün riskini %0'a indirdik ve kârımızı garanti altına aldık. Şah güvende, piyonlar ilerliyor!";
        bonusProfit = 1250;
      } else if (lower.includes("piyano") || lower.includes("müzik") || lower.includes("melodi")) {
        responseText = "Piyano armonisi devrede Patron Umay! Piyasaların frekansını analiz ettik ve dijital telif gelirlerimizden +1.500 € anlık getiri sağladık. Müzikal matematiğiniz harika çalışıyor!";
        bonusProfit = 1500;
      } else if (lower.includes("baba") || lower.includes("emekli")) {
        responseText = "Babanız şu an emekliliğin tadını çıkarıyor ve sizin bu harika kararlarınızı gururla izliyor! 'Kızım benden çok daha zeki ve vizyoner' dediğini duyar gibiyim.";
      } else if (lower.includes("kazan") || lower.includes("para") || lower.includes("büyüt") || lower.includes("al")) {
        responseText = "Emredersiniz Patron! Kuantitatif AI robotlarımız piyasada en kârlı arbitraj fırsatını yakaladı ve pozisyonlarımıza ekledi. Kasamız büyümeye devam ediyor!";
        bonusProfit = 2200;
      } else {
        responseText = `Emriniz başarıyla yerine getirildi Patron Umay Gül Nur! "${userText}" talimatınız doğrultusunda algoritmalarımız güncellendi, riskler kontrol altında ve portföyümüz büyüyor.`;
        bonusProfit = 800;
      }

      if (bonusProfit > 0) {
        setPositions((prev) =>
          prev.map((p, idx) =>
            idx === 0 ? { ...p, currentValueEUR: p.currentValueEUR + bonusProfit, pnlEUR: p.pnlEUR + bonusProfit } : p
          )
        );
        addNotification({
          title: "Patron Umay'dan Başarılı AI Talimatı!",
          message: `Antigravity AI emrinizi uyguladı: Portföye +${bonusProfit.toLocaleString()} € eklendi!`,
          severity: "SUCCESS",
          category: "EXECUTION",
        });
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ANTIGRAVITY",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          rewardEUR: bonusProfit > 0 ? bonusProfit : undefined,
        },
      ]);
    }, 1000);
  };

  // Safe Withdrawal Engine with Father Guardrail
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (amount > 10000 || amount > treasuryCash) {
      setParentApprovalRequired(true);
      setWithdrawNotice(`⚠️ GÜVENLİK KORUMASI: ${amount.toLocaleString()} € tutarındaki büyük çekim talebi Babanın onay ekranına iletildi. Baban onayladığı anda transfer gerçekleşecek.`);
      addNotification({
        title: "Ebeveyn Onayı Bekleniyor",
        message: `Umay'ın ${amount.toLocaleString()} € çekim talebi ebeveyn onayına gönderildi.`,
        severity: "CRITICAL",
        category: "COMPLIANCE",
      });
    } else {
      setParentApprovalRequired(false);
      setTreasuryCash((prev) => prev - amount);
      setWithdrawNotice(`✅ ${amount.toLocaleString()} € harçlık başarıyla çekildi! Güle güle harca Patron Umay!`);
      addNotification({
        title: "Harçlık Çekildi",
        message: `${amount.toLocaleString()} € Umay'ın cüzdanına aktarıldı.`,
        severity: "SUCCESS",
        category: "COMPLIANCE",
      });
      setWithdrawAmount("");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#050811", color: "#f8fafc" }}>
      {/* Top Patron Executive Banner */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "linear-gradient(90deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)", borderColor: "rgba(0, 212, 170, 0.3)" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <EagleCrest size={42} />
            <span className="absolute -top-1 -right-1 text-lg">👑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                UMAY GÜL NUR — PATRON & CEO TERMİNALİ
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                DOĞUM: 04.08.2017 &bull; YEGÂNE PATRON
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Baban Şirketi Sana Bıraktı &bull; Antigravity AI Baş Danışmanın Olarak Hizmetinde
            </p>
          </div>
        </div>

        {/* Live Treasury & Valuation Widget */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-emerald-500/40 text-right">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Toplam Şirket Değeri</span>
            <span className="text-lg font-black font-mono text-emerald-300">
              {totalPortfolioValue.toLocaleString("tr-TR")} &euro;
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-lg bg-black/60 border border-amber-500/40 text-right">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">Umay'ın Ürettiği Kâr</span>
            <span className="text-lg font-black font-mono text-amber-300">
              +{totalProfit.toLocaleString("tr-TR")} &euro;
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 px-6 py-2 border-b bg-black/50 border-white/10 text-xs font-bold">
        <button
          onClick={() => setActiveBoardTab("ai-command")}
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeBoardTab === "ai-command"
              ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          <span>🤖</span>
          <span>Antigravity AI'ya Emir Ver</span>
        </button>
        <button
          onClick={() => setActiveBoardTab("portfolio")}
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeBoardTab === "portfolio"
              ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          <span>📊</span>
          <span>100.000 € Canlı Portföy</span>
        </button>
        <button
          onClick={() => setActiveBoardTab("chess-strategy")}
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeBoardTab === "chess-strategy"
              ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          <span>♟️</span>
          <span>Satranç ile Şirket Yönetimi</span>
        </button>
        <button
          onClick={() => setActiveBoardTab("piano-melody")}
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeBoardTab === "piano-melody"
              ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          <span>🎹</span>
          <span>Piyano & Piyasa Frekansları</span>
        </button>
        <button
          onClick={() => setActiveBoardTab("vault")}
          className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeBoardTab === "vault"
              ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
              : "bg-white/5 hover:bg-white/10 text-slate-300"
          }`}
        >
          <span>🏦</span>
          <span>Harçlık Kasası</span>
        </button>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeBoardTab === "ai-command" && (
          <div className="max-w-4xl mx-auto flex flex-col h-full gap-4">
            {/* AI Command Chat Interface */}
            <div className="flex-1 rounded-xl border bg-black/60 border-white/10 p-4 flex flex-col overflow-hidden shadow-2xl">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === "UMAY"
                        ? "ml-auto bg-[var(--ag-accent)] text-black font-semibold rounded-br-none"
                        : msg.sender === "BABA"
                        ? "bg-amber-950/40 border border-amber-500/40 text-amber-200"
                        : "bg-white/10 border border-white/10 text-slate-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 opacity-75 font-mono text-[10px]">
                      <span>
                        {msg.sender === "UMAY" ? "👑 Patron Umay Gül Nur" : msg.sender === "BABA" ? "💌 Emekli Baba" : "🤖 Antigravity AI (Genel Müdürün)"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                    {msg.rewardEUR && (
                      <div className="mt-2 text-[10px] font-mono font-bold text-emerald-400 bg-black/40 px-2 py-0.5 rounded inline-block">
                        +{msg.rewardEUR.toLocaleString()} &euro; KÂR EKLENDİ ✨
                      </div>
                    )}
                  </div>
                ))}
                {isAiThinking && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 italic flex items-center gap-2 max-w-fit">
                    <span className="w-2 h-2 rounded-full bg-[var(--ag-accent)] animate-ping" />
                    Antigravity AI emrinizi analiz ediyor ve piyasayı tarıyor...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSendCommand} className="mt-3 pt-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Antigravity'ye bir emir ver (Örn: 'Satrançtaki gibi sağlam bir strateji kur', 'Teknoloji hisselerini analiz et')..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[var(--ag-accent)]"
                />
                <button
                  type="submit"
                  disabled={isAiThinking}
                  className="px-5 py-2.5 rounded-lg bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black font-bold text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  Emret Patron &rarr;
                </button>
              </form>
            </div>
          </div>
        )}

        {activeBoardTab === "portfolio" && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-xl border bg-emerald-950/20 border-emerald-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-300">Umay'ın 100.000 € Canlı Yatırım Sepeti</h3>
                <p className="text-xs text-slate-400">Babanın bıraktığı ana sermaye akıllıca dağıtıldı ve değer kazanıyor.</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Başlangıç: 100.000 €</span>
                <div className="text-base font-bold font-mono text-emerald-400">
                  Şu anki Değer: {totalPortfolioValue.toLocaleString()} € (+{((totalProfit / 100000) * 100).toFixed(1)}%)
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {positions.map((pos) => (
                <div key={pos.id} className="p-5 rounded-xl border bg-black/40 border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 font-bold">
                        {pos.category}
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        {pos.dailyChangePercent > 0 ? `+${pos.dailyChangePercent}%` : `${pos.dailyChangePercent}%`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{pos.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Yatırılan:</span>
                        <span>{pos.investedEUR.toLocaleString()} €</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Mevcut Değer:</span>
                        <span className="text-emerald-300 font-bold">{pos.currentValueEUR.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Net Kazanç:</span>
                    <span className="text-amber-300 font-bold">+{pos.pnlEUR.toLocaleString()} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBoardTab === "chess-strategy" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-black/60 border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">♟️</span>
                <div>
                  <h3 className="text-base font-bold text-white">Satranç Taktikleri ile Şirket Stratejisi</h3>
                  <p className="text-xs text-slate-400">Şahı (Ana Sermayeyi) koru, Piyonlarla (küçük yatırımlarla) ilerle!</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">♔ Şah Hamlesi</div>
                  <div className="text-xs font-bold text-white mb-1">Ana Sermaye Koruması</div>
                  <p className="text-[11px] text-slate-400">Asla tüm parayı tek hisseye yatırma. Hazineyi dağıt.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">♕ Vezir Hamlesi</div>
                  <div className="text-xs font-bold text-emerald-400 mb-1">Kuantitatif Arbitraj</div>
                  <p className="text-[11px] text-slate-400">Fiyat farklarından sıfır riskle kâr elde etme sanatı.</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">♙ Piyon Terfisi</div>
                  <div className="text-xs font-bold text-amber-300 mb-1">Bileşik Getiri Gücü</div>
                  <p className="text-[11px] text-slate-400">Küçük kârlar zamanla devasa bir vezire (milyonlara) dönüşür.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeBoardTab === "piano-melody" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-black/60 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎹</span>
                <div>
                  <h3 className="text-base font-bold text-white">Piyano Notaları & Piyasa Ritimleri</h3>
                  <p className="text-xs text-slate-400">Müzikteki armoni piyasaların döngüsel hareketlerine rehberlik eder.</p>
                </div>
              </div>
              <div className="py-6">
                <AudioSpectrumVisualizer isPlaying={true} barColor="#38bdf8" height={40} />
              </div>
              <p className="text-xs text-center text-slate-400 font-mono">
                Do &bull; Re &bull; Mi &bull; Fa &bull; Sol &bull; La &bull; Si &mdash; Kuantitatif Ritim Frekansı Aktif
              </p>
            </div>
          </div>
        )}

        {activeBoardTab === "vault" && (
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-black/60 border-amber-500/30 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏦</span>
                  <h3 className="text-sm font-bold text-white">Umay'ın Dijital Kasası & Harçlık Çekme</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Kasa: {treasuryCash.toLocaleString()} &euro;
                </span>
              </div>

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Çekmek İstediğin Tutar (&euro;)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Örn: 250"
                    className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Küçük harçlıklar anında çekilir. 10.000 € üzeri çekimlerde Babanın onayı istenir.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black transition-colors"
                >
                  Kasadan Harçlık Çek &rarr;
                </button>
              </form>

              {withdrawNotice && (
                <div
                  className={`mt-4 p-3 rounded text-xs font-medium leading-relaxed ${
                    parentApprovalRequired
                      ? "bg-red-950/40 border border-red-500/40 text-red-300"
                      : "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {withdrawNotice}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
