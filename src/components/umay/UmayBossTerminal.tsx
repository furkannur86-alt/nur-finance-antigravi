"use client";

import { useState, useRef, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  location: string;
  salaryEUR: number;
  status: "ONLINE" | "BEKLIYOR" | "GÖREVDE";
  avatar: string;
  dailyReport: string;
  needsApproval?: boolean;
}

interface AIChatMessage {
  id: string;
  sender: "UMAY" | "ANTIGRAVITY" | "BABA" | "STAFF";
  text: string;
  timestamp: string;
  rewardEUR?: number;
  language?: "TR" | "EN" | "DE";
}

interface PortfolioPosition {
  id: string;
  name: string;
  category: "TEKNOLOJI" | "SATRANC_ARBITRAJ" | "MUZIK_TELIF" | "HAZINE";
  investedEUR: number;
  currentValueEUR: number;
  dailyChangePercent: number;
  pnlEUR: number;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "st-1",
    name: "Alexander Wright",
    role: "New York HQ Genel Direktörü",
    location: "Manhattan, NYC 🇺🇸",
    salaryEUR: 8500,
    status: "ONLINE",
    avatar: "👔",
    dailyReport: "Umay Hanım, Wall Street açılışında teknoloji hisselerimiz %3.4 yükseldi. New York ekibimizin haftalık bütçe onayını bekliyoruz.",
    needsApproval: true,
  },
  {
    id: "st-2",
    name: "Hans Gruber",
    role: "Frankfurt Hazine Müdürü",
    location: "Frankfurt 🇩🇪",
    salaryEUR: 7200,
    status: "GÖREVDE",
    avatar: "💼",
    dailyReport: "Guten Tag Chefin Umay! Avrupa Merkez Bankası faiz kararını takip ediyoruz. Nakit paramızı güvende tutuyoruz.",
  },
  {
    id: "st-3",
    name: "Zeynep Kaya",
    role: "İstanbul Ofis Asistanı & Koordinatör",
    location: "İstanbul 🇹🇷",
    salaryEUR: 3500,
    status: "ONLINE",
    avatar: "👩‍💼",
    dailyReport: "Umay Patronum, sabah kahvemi döktüğüm için raporu 10 dakika geciktirdim, çok özür dilerim ama piyasa verilerimiz kusursuz hazır!",
  },
  {
    id: "st-4",
    name: "James Chen",
    role: "Singapur Kuantitatif Algoritma Geliştirici",
    location: "Singapur 🇸🇬",
    salaryEUR: 9000,
    status: "ONLINE",
    avatar: "💻",
    dailyReport: "Satranç algoritmamız gece boyu Asya piyasalarında arbitraj yaptı ve kasaya +1.800 € kazandırdı.",
  },
];

const INITIAL_POSITIONS: PortfolioPosition[] = [
  {
    id: "pos-1",
    name: "Yapay Zeka & Robotik Fonu (NVIDIA + Apple)",
    category: "TEKNOLOJI",
    investedEUR: 35000,
    currentValueEUR: 42800,
    dailyChangePercent: +3.2,
    pnlEUR: +7800,
  },
  {
    id: "pos-2",
    name: "Büyükusta Satranç Arbitraj Sepeti",
    category: "SATRANC_ARBITRAJ",
    investedEUR: 25000,
    currentValueEUR: 28900,
    dailyChangePercent: +1.6,
    pnlEUR: +3900,
  },
  {
    id: "pos-3",
    name: "Klasik Piyano & Müzik Telif Gelirleri",
    category: "MUZIK_TELIF",
    investedEUR: 20000,
    currentValueEUR: 22400,
    dailyChangePercent: +0.9,
    pnlEUR: +2400,
  },
  {
    id: "pos-4",
    name: "Korumalı Nakit Hazine & Likidite",
    category: "HAZINE",
    investedEUR: 20000,
    currentValueEUR: 22100,
    dailyChangePercent: +0.2,
    pnlEUR: +2100,
  },
];

export default function UmayBossTerminal() {
  const { addNotification } = useIDEStore();

  const [treasuryCash, setTreasuryCash] = useState(22100);
  const [positions, setPositions] = useState<PortfolioPosition[]>(INITIAL_POSITIONS);
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [activeBoardTab, setActiveBoardTab] = useState<"office" | "staff" | "chess-strategy" | "languages" | "card-vault">("office");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatLanguage, setChatLanguage] = useState<"TR" | "EN" | "DE">("TR");

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: "msg-1",
      sender: "BABA",
      text: "Canım kızım Umay Gül Nur, ben tüm şirketi sana devredip emekliye ayrıldım. Kasana 100.000 € bıraktım. Antigravity AI ve New York'tan Tokyo'ya tüm çalışanlarımız senin emrinde!",
      timestamp: "09:00",
    },
    {
      id: "msg-2",
      sender: "ANTIGRAVITY",
      text: "Saygılar Patron Umay Gül Nur! Fatih Sultan Mehmet Han 12 yaşında tahta çıkıp cihan fatihi olmuştu. Siz de 9 yaşınızda bu holdingin başındasınız ve satrançtaki stratejik aklınızla bu şirketi babanızdan çok daha büyük zirvelere taşıyacaksınız. Tüm dünya ofislerimiz emirlerinizi bekliyor!",
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

  // Handle AI Command with Fatih Sultan Mehmet Inspiration & Multilingual Support
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "UMAY", text: userText, timestamp: timeNow, language: chatLanguage },
    ]);
    setAiPrompt("");
    setIsAiThinking(true);

    setTimeout(() => {
      setIsAiThinking(false);
      let responseText = "";
      let bonusProfit = 0;

      const lower = userText.toLowerCase();

      // Child hesitance check -> Fatih Sultan Mehmet Motivation
      if (lower.includes("küçüğüm") || lower.includes("çocuğum") || lower.includes("yapamam") || lower.includes("korkuyorum") || lower.includes("zor")) {
        responseText = "Umay Hanım, asla öyle düşünmeyin! Fatih Sultan Mehmet Han ilk tahta çıktığında sadece 12 yaşındaydı ve İstanbul gibi bir imparatorluğu fethetmeyi kafasına o yaşta koydu. Sizin satrançtaki taktik dehanız, piyano armoniniz ve keskin zekanız bu şirketi yönetmek için fazlasıyla yeterli. Biz buradayız ve her adımda emrinizdeyiz!";
        bonusProfit = 1000;
      } else if (chatLanguage === "EN" || lower.includes("hello") || lower.includes("english") || lower.includes("report")) {
        responseText = "Good day, Boss Umay Gul Nur! Our New York trading desk executed your instructions flawlessly. The global equity portfolio gained +$1,800 today. Would you like me to brief the London office next?";
        bonusProfit = 1800;
      } else if (chatLanguage === "DE" || lower.includes("hallo") || lower.includes("deutsch")) {
        responseText = "Guten Tag, Chefin Umay! Unsere Frankfurter Niederlassung meldet stabile Gewinne. Das Kapital ist sicher und wächst täglich weiter!";
        bonusProfit = 1500;
      } else if (lower.includes("satranç") || lower.includes("savunma") || lower.includes("şah")) {
        responseText = "Büyükusta hamlesi uygulandı Patron Umay! Satrançtaki 'Sağlam Şah Koruması' ile riski sıfıra indirdik ve arbitrajdan kasamıza kâr ekledik!";
        bonusProfit = 1400;
      } else if (lower.includes("piyano") || lower.includes("müzik") || lower.includes("melodi")) {
        responseText = "Piyano armonisi devrede Patron Umay! Piyasaların frekansını analiz ettik ve müzikal telif gelirlerimizden +1.600 € sağladık.";
        bonusProfit = 1600;
      } else {
        responseText = `Emriniz yerine getirildi Patron Umay Gül Nur! "${userText}" talimatınız New York, Frankfurt ve İstanbul ofislerimizde derhal işleme alındı.`;
        bonusProfit = 950;
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
          language: chatLanguage,
        },
      ]);
    }, 1000);
  };

  // Approve Staff Salaries / Budgets
  const handleApproveStaff = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, needsApproval: false, status: "GÖREVDE" } : s))
    );
    addNotification({
      title: "Patron Umay Bütçeyi Onayladı!",
      message: "Personel maaşı ve ofis bütçesi onaylandı. Çalışanlar Umay Hanım'a teşekkür ediyor!",
      severity: "SUCCESS",
      category: "COMPLIANCE",
    });
  };

  // Safe Withdrawal Engine with Father Guardrail
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (amount > 10000 || amount > treasuryCash) {
      setParentApprovalRequired(true);
      setWithdrawNotice(`⚠️ GÜVENLİK KORUMASI: ${amount.toLocaleString()} € tutarındaki büyük çekim talebi Babanın onay ekranına iletildi. Baban onayladığı anda banka kartına/ATM'ye aktarılacak.`);
      addNotification({
        title: "Ebeveyn Onayı Bekleniyor",
        message: `Umay'ın ${amount.toLocaleString()} € çekim talebi ebeveyn onayına gönderildi.`,
        severity: "CRITICAL",
        category: "COMPLIANCE",
      });
    } else {
      setParentApprovalRequired(false);
      setTreasuryCash((prev) => prev - amount);
      setWithdrawNotice(`💳 BAŞARILI: ${amount.toLocaleString()} € Umay Gül Nur Black Banka Kartına yüklendi! Dünyanın her yerindeki ATM'den harçlığını çekebilirsin Patron Umay!`);
      addNotification({
        title: "Harçlık Karta Yüklendi",
        message: `${amount.toLocaleString()} € Umay'ın banka kartına aktarıldı.`,
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
            <EagleCrest size={44} />
            <span className="absolute -top-1 -right-1 text-lg">👑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300">
                UMAY GÜL NUR — HOLDİNG PATRONU & CEO TERMİNALİ
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                DOĞUM: 04.08.2017 &bull; YEGÂNE PATRON
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Baban Emekli Oldu &bull; 100.000 € Hazine, Antigravity AI ve Dünya Ofisleri Hizmetinde
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
      <div className="flex items-center justify-between px-6 py-2 border-b bg-black/50 border-white/10 text-xs font-bold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveBoardTab("office")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "office"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>🤖</span>
            <span>Antigravity AI'ya Emir Ver</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("staff")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "staff"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>👥</span>
            <span>Çalışanlar & Dünya Ofisleri (NYC, FRA, İST)</span>
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
            <span>Fatih Sultan Mehmet & Satranç Vizyonu</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("languages")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "languages"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>🌍</span>
            <span>Yabancı Dil Pratik Odası (EN / DE)</span>
          </button>
          <button
            onClick={() => setActiveBoardTab("card-vault")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeBoardTab === "card-vault"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-slate-300"
            }`}
          >
            <span>💳</span>
            <span>Black Banka Kartı & ATM Kasası</span>
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded border border-white/10 text-[11px] font-mono">
          <button
            onClick={() => setChatLanguage("TR")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "TR" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇹🇷 TR
          </button>
          <button
            onClick={() => setChatLanguage("EN")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "EN" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇺🇸 EN
          </button>
          <button
            onClick={() => setChatLanguage("DE")}
            className={`px-2 py-0.5 rounded font-bold ${chatLanguage === "DE" ? "bg-[var(--ag-accent)] text-black" : "text-slate-400"}`}
          >
            🇩🇪 DE
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeBoardTab === "office" && (
          <div className="max-w-5xl mx-auto flex flex-col h-full gap-4">
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
                    Antigravity AI New York ve Frankfurt ofislerine emirlerinizi iletiyor...
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
                  placeholder={
                    chatLanguage === "EN"
                      ? "Give a command to Antigravity AI (e.g. 'Analyze tech stocks', 'Send report to New York')..."
                      : chatLanguage === "DE"
                      ? "Geben Sie Antigravity AI einen Befehl (z.B. 'Frankfurt Portfolio optimieren')..."
                      : "Antigravity'ye bir emir ver (Örn: 'Satranç stratejisiyle savunma kur', 'New York ekibine talimat ver')..."
                  }
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

        {activeBoardTab === "staff" && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-xl border bg-black/50 border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Holding Çalışanları & Canlı Ofis Raporları</h3>
                <p className="text-xs text-slate-400">Patron Umay Gül Nur'a bağlı gerçekçi departman yöneticileri ve analistler.</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                4 Aktif Departman &bull; 24 Kişilik Ekip
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {staffList.map((st) => (
                <div key={st.id} className="p-5 rounded-xl border bg-black/40 border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{st.avatar}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{st.name}</h4>
                          <span className="text-[11px] text-slate-400">{st.role} &bull; {st.location}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-emerald-400">
                        {st.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-lg mt-2 leading-relaxed">
                      💬 &ldquo;{st.dailyReport}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">Maaş: {st.salaryEUR.toLocaleString()} €/ay</span>
                    {st.needsApproval ? (
                      <button
                        onClick={() => handleApproveStaff(st.id)}
                        className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
                      >
                        Bütçeyi Onayla &rarr;
                      </button>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[11px]">ONAYLANDI ✅</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeBoardTab === "chess-strategy" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            {/* Fatih Sultan Mehmet Historical Hero Card */}
            <div className="p-6 rounded-xl border bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-black border-amber-400/40 shadow-2xl">
              <div className="flex items-start gap-4">
                <span className="text-4xl">🏰</span>
                <div className="space-y-2">
                  <h3 className="text-base font-black text-amber-300">
                    Fatih Sultan Mehmet Han: 12 Yaşında Tahta Çıkan Cihan Fatihi
                  </h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Umay Hanım, Fatih Sultan Mehmet Han tahta ilk oturduğunda sadece 12 yaşındaydı. Çevresindekiler onun genç olduğunu söylerken o, tarihin en büyük vizyonuyla İstanbul&apos;u fethetmeyi aklına koydu ve çağ açıp çağ kapattı. Siz de bugün 9 yaşındasınız ve bu holdingin başındasınız. Babanızdan aldığınız bu sermayeyi satrançtaki gibi stratejik hamlelerle yönetecek güçtesiniz!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♔ Şah Hamlesi</div>
                <div className="text-xs font-bold text-white mb-1">Ana Sermaye Koruması</div>
                <p className="text-[11px] text-slate-400">Kasandaki 100.000 € senin şahındır. Onu asla riske atma.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♕ Vezir Hamlesi</div>
                <div className="text-xs font-bold text-emerald-400 mb-1">Kuantitatif Arbitraj</div>
                <p className="text-[11px] text-slate-400">Antigravity AI senin vezirindir. Piyasaları tarar, kâr getirir.</p>
              </div>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-center">
                <div className="text-3xl mb-1">♙ Piyon Terfisi</div>
                <div className="text-xs font-bold text-amber-300 mb-1">Bileşik Getiri Gücü</div>
                <p className="text-[11px] text-slate-400">Küçük kârlar disiplinle birleştiğinde milyonlara dönüşür.</p>
              </div>
            </div>
          </div>
        )}

        {activeBoardTab === "languages" && (
          <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-black/60 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <h3 className="text-base font-bold text-white">Yabancı Dil Pratik Odası (New York & Frankfurt)</h3>
                  <p className="text-xs text-slate-400">Dedesi ve Antigravity ile her gün 30 dakika İngilizce ve Almanca konuşma odası.</p>
                </div>
              </div>
              <div className="py-4">
                <AudioSpectrumVisualizer isPlaying={true} barColor="#00d4aa" height={36} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-cyan-300 block mb-1">🇺🇸 English Executive Practice</span>
                  <p className="text-xs text-slate-300">&ldquo;Hello Boss Umay! How is our portfolio doing today?&rdquo;</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs font-bold text-amber-300 block mb-1">🇩🇪 Deutsch Führungspraxis</span>
                  <p className="text-xs text-slate-300">&ldquo;Guten Tag Chefin Umay! Unser Frankfurter Büro meldet Erfolg!&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeBoardTab === "card-vault" && (
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-xl border bg-gradient-to-br from-slate-900 via-black to-slate-950 border-amber-500/40 shadow-2xl">
              {/* Virtual Black Card */}
              <div className="aspect-[1.586/1] w-full rounded-2xl bg-gradient-to-tr from-black via-slate-900 to-amber-950 p-6 border border-amber-400/40 relative overflow-hidden flex flex-col justify-between shadow-2xl mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-300">NUR FINANCE BLACK CARD</span>
                  <EagleCrest size={28} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 mb-1">PATRON & CEO</div>
                  <div className="text-lg font-black tracking-wider text-white font-mono">UMAY GÜL NUR</div>
                </div>
                <div className="flex items-center justify-between font-mono text-xs text-amber-400">
                  <span>VALID: 08/2035</span>
                  <span>KASA: {treasuryCash.toLocaleString()} &euro;</span>
                </div>
              </div>

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Harçlık / Çekim Tutarı (&euro;)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Örn: 250"
                    className="w-full px-3 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Küçük harçlıklar anında karta yüklenir. 10.000 € üzeri çekimler Babanın onayına gider.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded text-xs font-bold bg-amber-400 hover:bg-amber-300 text-black transition-colors"
                >
                  Banka Kartına Harçlık Aktar &rarr;
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
