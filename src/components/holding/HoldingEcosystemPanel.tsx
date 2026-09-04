"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import AudioSpectrumVisualizer from "@/components/ui/AudioSpectrumVisualizer";

interface GrowthPillar {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  targetDemographic: string;
  hookMechanism: string;
  conversionFunnel: string;
  activeStatus: "OPERATIONAL" | "INCUBATING" | "RESERVED_SLOT";
  icon: string;
  metrics: {
    estLTV: string;
    targetReach: string;
    conversionRate: string;
  };
}

const CORE_PILLARS: GrowthPillar[] = [
  {
    id: "tatar-finans",
    name: "Tatar Finans",
    badge: "BAHİS & RISK DÖNÜŞÜMÜ",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    targetDemographic: "Küresel Bahis, İddaa ve Kumar Alışkanlığı Olan Bireyler",
    hookMechanism: "Tanıdık Canlı Bahis, Oran Merdiveni & Yüksek Hızlı Crash UI",
    conversionFunnel: "Tatar AI Muhafız: -EV (Kasa Avantajı) iflas simülasyonunu +EV Kvant Opsiyon ve Kelly Portföy büyümesine dönüştürür.",
    activeStatus: "OPERATIONAL",
    icon: "🎲",
    metrics: { estLTV: "$28,500", targetReach: "120M+ Global", conversionRate: "4.8%" },
  },
  {
    id: "nur-game",
    name: "NUR Game",
    badge: "GENÇLİK & KÜLTÜREL STRATEJİ",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    targetDemographic: "16-17 Yaş Gençler, Gamerlar ve Rekabetçi Oyuncular",
    hookMechanism: "Osmanlı Fetih Stratejisi (AoE/Mount&Blade tarzı), Taktik FPS ve Hazine Seferleri",
    conversionFunnel: "Görünmez Ekonomi (Stealth Finance): Darphane, savaş tahvili, arz-talep arbitrajı ve Defterdarlıktan NUR Finance'e terfi.",
    activeStatus: "OPERATIONAL",
    icon: "🎮",
    metrics: { estLTV: "Ömür Boyu (LTV)", targetReach: "450M+ Gençlik", conversionRate: "8.2%" },
  },
  {
    id: "nur-dating",
    name: "NUR Dating (Shadow Network)",
    badge: "SOSYAL MEDYA & YAŞAM",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    targetDemographic: "Sosyal Medyada Flört, Evlilik ve Doğru Eş Arayan Kitle",
    hookMechanism: "Hiper-Gerçekçi AI Kadın/Erkek Influencer Ağı & Birebir DM İlişki Danışmanlığı",
    conversionFunnel: "İlişki + Finansal Olgunluk Köprüsü: 'Kumar oynamayan, varlık yöneten partner çekicidir' aşılaması ile NUR Finance'e yönlendirme.",
    activeStatus: "OPERATIONAL",
    icon: "🌹",
    metrics: { estLTV: "$15,200", targetReach: "800M+ Sosyal", conversionRate: "3.4%" },
  },
  {
    id: "nur-ai-studio",
    name: "NUR AI Studio",
    badge: "MEDYA & VİRAL İÇERİK",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    targetDemographic: "Esnaflar, E-Ticaretçiler, Danışmanlar ve İçerik Üreticileri",
    hookMechanism: "Lüks Wall Street Cam Ofisinde Haber Spikeri Avatar Videosu + Ses Mastering (Günde 3-5 Free)",
    conversionFunnel: "İş Büyütme Akademisi: Videolarla işini ve gelirini büyüten girişimcinin artan sermayesini NUR Finance Terminaline getirmesi.",
    activeStatus: "OPERATIONAL",
    icon: "🎬",
    metrics: { estLTV: "$42,000", targetReach: "65M+ İş Sahibi", conversionRate: "6.1%" },
  },
  {
    id: "nur-comm-pro",
    name: "NUR Comm Pro",
    badge: "BÜTÜNLEŞİK İLETİŞİM",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    targetDemographic: "Şirket Yöneticileri, Serbest Çalışanlar ve KOBİ'ler",
    hookMechanism: "E-Posta, WhatsApp, Telegram, Messenger Tek Gelen Kutusunda + AI Akıllı Sekreter",
    conversionFunnel: "Kontekstüel Kasa Danışmanı: Gelen fatura ve tahsilatları okurken şirketin nakit akışını NUR Finance hazine modellerine bağlar.",
    activeStatus: "OPERATIONAL",
    icon: "📬",
    metrics: { estLTV: "$95,000", targetReach: "200M+ Şirket", conversionRate: "9.5%" },
  },
  {
    id: "ghostvault-cyber",
    name: "GhostVault CyberSecurity",
    badge: "SİBER GÜVENLİK & GİZLİLİK",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    targetDemographic: "Tarayıcısında Sıfır İz Arayan, Gizlilik Odaklı Yüksek Gelirli Bilgisayar Kullanıcıları",
    hookMechanism: "Zero-Trace Sandbox, Güvenli DNS, Tek Tuşla Nükleer Temizlik (Nuclear Wipe) + Entegre TV İstasyonu",
    conversionFunnel: "Fırsat Maliyeti (15sn Uyanış): 'Burada harcadığın vakit yerine 2 yıl önce AAPL alsaydın kasan $18K'dı' 3D gösterimi ile doğal terfi.",
    activeStatus: "INCUBATING",
    icon: "🛡️",
    metrics: { estLTV: "$33,000", targetReach: "1.2B+ Kullanıcı", conversionRate: "2.9%" },
  },
  {
    id: "nur-legacy",
    name: "NUR Legacy",
    badge: "LİDERLİK & ÇOCUK YÖNETİMİ",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    targetDemographic: "Geleceğin Girişimcilerini ve Bağımsız Genç Liderlerini Yetiştiren Aileler",
    hookMechanism: "Günde 40dk Disiplinli Oyun & Küresel Şirket Yönetim Simülasyonu",
    conversionFunnel: "Klasik eğitim yerine 255 €/ay ile Gerçek Şirket/Holding Yönetimi & Kariyer Yol Haritası (Maden, Enerji, Finans, Teknoloji).",
    activeStatus: "OPERATIONAL",
    icon: "👑",
    metrics: { estLTV: "$36,000", targetReach: "180M+ Aile", conversionRate: "7.4%" },
  },
];

// Open Modular Expansion Slots (Ready for the next hundreds of client acquisition systems)
const EXPANSION_SLOTS = [
  { slotNumber: 7, codeName: "EXP-SLOT-07", category: "Kültürel & Bölgesel Büyüme Motoru", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 8, codeName: "EXP-SLOT-08", category: "Otonom B2B Tedarikçi & Arbitraj Ağı", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 9, codeName: "EXP-SLOT-09", category: "Algoritmik Mikro-Öğrenme & Çocuk Akademisi", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 10, codeName: "EXP-SLOT-10", category: "Global Enerji & Emtia Topluluk Hub'ı", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 11, codeName: "EXP-SLOT-11", category: "AI Gayrimenkul & Kira Getiri Dönüştürücü", status: "RESERVED / READY FOR SPEC" },
  { slotNumber: 12, codeName: "EXP-SLOT-12", category: "Küresel Seyahat & Lüks Varlık Ağı", status: "RESERVED / READY FOR SPEC" },
];

export default function HoldingEcosystemPanel() {
  const { setActiveView } = useIDEStore();
  const [selectedPillar, setSelectedPillar] = useState<GrowthPillar>(CORE_PILLARS[0]);
  const [activeTab, setActiveTab] = useState<"holding" | "tv-network" | "slots">("holding");

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Master Holding Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={34} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--ag-accent)" }}>
                UMAY GÜL NUR — NUR FINANCE HOLDING
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                MASTER TRUST & IP HOLDING
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Tüm Eser, Fikri Mülkiyet ve Müşteri Kazanım İştirakleri Umay Gül Nur Mülkiyetindedir.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("holding")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "holding"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            🏛️ 7 Büyüme İştiraki
          </button>
          <button
            onClick={() => setActiveTab("tv-network")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "tv-network"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            📡 NUR TV Global Network
          </button>
          <button
            onClick={() => setActiveTab("slots")}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeTab === "slots"
                ? "bg-[var(--ag-accent)] text-black shadow-lg shadow-[rgba(0,212,170,0.2)]"
                : "bg-white/5 hover:bg-white/10 text-[var(--ag-muted)]"
            }`}
          >
            ⚡ Gelecek Modül Slotları (+N)
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "holding" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Top Metrics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Toplam Potansiyel Kitle Erişimi</div>
                <div className="text-xl font-bold font-mono text-[var(--ag-accent)] mt-1">2.8 Milyar+</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">7 Bağımsız Büyüme Motoru</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">NUR Finance Nihai Dönüşüm</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">Elit Portföy Havuzu</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">Disiplin & +EV Filtreli</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Fikri Mülkiyet & Patent</div>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">10 Tescilli Buluş</div>
                <div className="text-[10px] text-[var(--ag-muted)] mt-0.5">PATENTS_AND_IP.md</div>
              </div>
              <div className="p-4 rounded-lg border bg-black/30 border-[var(--ag-border)]">
                <div className="text-[11px] text-[var(--ag-muted)]">Holding Varlık Sahibi</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">Umay Gül Nur</div>
                <div className="text-[10px] text-cyan-400/80 mt-0.5">Ebedi Mülkiyet Beyanı</div>
              </div>
            </div>

            {/* 6 Core Growth Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CORE_PILLARS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPillar(p)}
                  className={`p-5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPillar.id === p.id
                      ? "bg-[rgba(0,212,170,0.08)] border-[var(--ag-accent)] shadow-lg shadow-[rgba(0,212,170,0.1)]"
                      : "bg-black/30 border-[var(--ag-border)] opacity-85 hover:opacity-100"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{p.icon}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-[var(--ag-muted)] mb-3 leading-relaxed">{p.targetDemographic}</p>
                    <div className="text-[11px] font-medium text-emerald-400 mb-2">
                      <strong>Kanca:</strong> {p.hookMechanism}
                    </div>
                    <div className="text-[11px] text-[var(--ag-text)] opacity-90 leading-relaxed">
                      <strong>Dönüşüm:</strong> {p.conversionFunnel}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--ag-border)] flex items-center justify-between text-[10px] font-mono text-[var(--ag-muted)]">
                    <span>Erişim: {p.metrics.targetReach}</span>
                    <span className="text-[var(--ag-accent)] font-bold">Est LTV: {p.metrics.estLTV}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Pillar Interactive Launcher */}
            {selectedPillar.id === "tatar-finans" ? (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-red-950/40 via-amber-950/20 to-black border-red-500/40 flex items-center justify-between gap-4 shadow-lg shadow-red-500/10">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-red-400 flex items-center gap-2">
                    <span>🎲 Tatar Finans — Küresel Risk, Casino & Borsa Dönüşüm Arenası</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold">
                      100% İÇ KASA MUTABAKATI
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Crash, Rulet, 21, Plinko ve Bahis motoru. Kasa kazancı borsa portföyüne aktarılır, kullanıcılar +EV borsa hisselerine yönlendirilir.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("tatar-finans")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white shrink-0 transition-all shadow-md shadow-red-600/30"
                >
                  Tatar Arenasını Aç &rarr;
                </button>
              </div>
            ) : selectedPillar.id === "nur-ai-studio" ? (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-cyan-950/40 to-black border-cyan-500/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                    <span>🎬 NUR AI Studio — Lüks Wall Street Haber Spikeri & Ses Mastering</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                      GÜNDE 3-5 FREE VİDEO
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    Kullanıcılar videolarını yükler, lüks ofis spikeri haber videosuna dönüştürür ve işlerini büyütür.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("broadcast-studio")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black shrink-0 transition-all"
                >
                  AI Studio'yu Aç &rarr;
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-lg border bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border-[var(--ag-accent)]/30 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-[var(--ag-accent)] flex items-center gap-2">
                    <span>🚀 NUR Finance AntiGravi Terminal & Kuantitatif Yönetim</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      CANLI & OPERASYONEL
                    </span>
                  </div>
                  <p className="text-xs text-[var(--ag-muted)]">
                    OMS/EMS L2 DOM Merdiveni, AI Quant Copilot (WISH), Canlı HUD Risk Çekmecesi ve Anonim Web3 Cüzdan Geçidi aktif.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView("oms-ems")}
                  className="px-5 py-2.5 rounded text-xs font-bold bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black shrink-0 transition-all shadow-md shadow-[rgba(0,212,170,0.2)]"
                >
                  Kurumsal Terminale Geç &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "tv-network" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="p-6 rounded-lg border bg-black/40 border-[var(--ag-border)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[var(--ag-border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <div>
                    <h2 className="text-base font-bold text-white">NUR TV Global 24/7 Finansal Yayın Ağı</h2>
                    <p className="text-xs text-[var(--ag-muted)]">12 Bölgesel Stüdyo & 30 AI Sunucu ile Canlı Piyasa Analizleri</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                  LIVE SATELLITE FEED
                </span>
              </div>

              {/* TV Screen Mockup & Audio Spectrum */}
              <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-black border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/60 backdrop-blur border border-white/10">
                    <span className="text-xs font-bold text-[var(--ag-accent)]">NUR TV GLOBAL HD</span>
                    <span className="text-[10px] text-red-400 font-mono font-bold">&bull; CANLI</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-3 py-1 rounded border border-white/10">
                    <span className="text-[var(--ag-muted)]">STÜDYO:</span>
                    <span className="text-white font-bold">MANHATTAN HQ & ISTANBUL DESK</span>
                  </div>
                </div>

                {/* Central Broadcast Anchor Hologram Frame */}
                <div className="self-center text-center z-10 my-auto">
                  <EagleCrest size={64} className="mx-auto mb-3 opacity-90" />
                  <h3 className="text-lg font-bold text-white tracking-wider">NUR FINANCE BROADCAST NETWORK</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-1">Küresel Faiz, Makro Likidite ve Borsa Açılış Brifingi</p>
                  <div className="mt-4 max-w-md mx-auto">
                    <AudioSpectrumVisualizer isPlaying={true} barColor="var(--ag-accent)" height={28} />
                  </div>
                </div>

                {/* Breaking Chyron Ticker Bar */}
                <div className="z-10 bg-black/80 backdrop-blur border border-red-500/40 rounded p-2.5 flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0 animate-pulse">
                    SON DAKİKA
                  </span>
                  <div className="text-xs font-mono text-white overflow-hidden whitespace-nowrap">
                    FED FAİZ BEKLENTİSİ SABİT &bull; SPX 500 YENİ ZİRVEDE &bull; BIST 100 GÜÇLÜ ALICILI &bull; ALTIN VE EMTİA ARBİTRAJ REJİMİ AKTİF &bull; NUR FINANCE V3.0 PRO CANLI YAYINDA
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveView("broadcast-studio")}
                  className="px-4 py-2 rounded text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Teleprompter & Stüdyo Paneline Git &rarr;
                </button>
                <button
                  onClick={() => setActiveView("live-tv")}
                  className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/30"
                >
                  Canlı Yayın Ekranını Aç &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "slots" && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="p-4 rounded-lg border bg-amber-950/20 border-amber-500/30">
              <h3 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                <span>⚡ Gelecek Büyüme & Müşteri Edinme Modül Slotları</span>
              </h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                NUR Finance Holding mimarisi, ekleyeceğiniz yüzlerce yeni müşteri bulma tekniğini ve iştirak modelini anında sisteme takıp çalıştırabileceğiniz açık ve modüler slot yapısına sahiptir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXPANSION_SLOTS.map((slot) => (
                <div
                  key={slot.slotNumber}
                  className="p-5 rounded-lg border border-dashed border-white/20 bg-black/20 flex flex-col justify-between hover:border-[var(--ag-accent)]/60 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{slot.codeName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--ag-muted)]">
                        SLOT #{slot.slotNumber}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{slot.category}</h4>
                    <p className="text-xs text-[var(--ag-muted)]">
                      Yeni müşteri edinme stratejisi ve AI ajanı tanımlandığı anda bu slota takılacak.
                    </p>
                  </div>
                  <div className="pt-3 mt-4 border-t border-white/10 text-[10px] font-mono text-emerald-400/80">
                    &bull; {slot.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
