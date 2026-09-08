"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";

// Deliberately parent-supervised, NOT a live AI chat agent for children — building an
// unsupervised child-facing AI without real safeguarding infra (verified parental
// consent, content moderation, data minimization) would be irresponsible for this
// audience. This is a course-progress tracker + family fund dashboard, viewed by the
// parent, with mock lesson data — same demo-scope pattern as the rest of this app.

interface Course {
  id: string;
  subject: string;
  icon: string;
  ageRange: string;
  lessonsTotal: number;
  lessonsCompleted: number;
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  courses: Course[];
}

const INITIAL_CHILDREN: ChildProfile[] = [
  {
    id: "child-1",
    name: "Zeynep",
    age: 9,
    courses: [
      { id: "c-en", subject: "İngilizce", icon: "🇬🇧", ageRange: "6-12", lessonsTotal: 40, lessonsCompleted: 27 },
      { id: "c-math", subject: "Finansal Okuryazarlık", icon: "💰", ageRange: "8-14", lessonsTotal: 24, lessonsCompleted: 10 },
      { id: "c-stem", subject: "STEM Temelleri", icon: "🔬", ageRange: "7-13", lessonsTotal: 30, lessonsCompleted: 18 },
      { id: "c-code", subject: "Başlangıç Kodlama", icon: "💻", ageRange: "9-15", lessonsTotal: 20, lessonsCompleted: 4 },
    ],
  },
  {
    id: "child-2",
    name: "Ege",
    age: 12,
    courses: [
      { id: "c-de", subject: "Almanca", icon: "🇩🇪", ageRange: "10-16", lessonsTotal: 40, lessonsCompleted: 12 },
      { id: "c-hist", subject: "Tarih", icon: "📜", ageRange: "10-16", lessonsTotal: 18, lessonsCompleted: 18 },
      { id: "c-code", subject: "Kodlama (Python)", icon: "💻", ageRange: "11-17", lessonsTotal: 26, lessonsCompleted: 9 },
    ],
  },
];

export default function NurKidsPanel() {
  const { addNotification } = useIDEStore();

  const [children] = useState<ChildProfile[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState(children[0].id);
  const [activeTab, setActiveTab] = useState<"dashboard" | "catalog">("dashboard");

  // Family compute-sharing (reuses the same opt-in, disclosed model as Nur Unix — a
  // parent's household hardware, not a child's) — earnings attributed to the fund.
  const [familyComputeSharingEnabled, setFamilyComputeSharingEnabled] = useState(false);
  const [childFundUSDT, setChildFundUSDT] = useState(1240);

  const selectedChild = children.find((c) => c.id === selectedChildId)!;

  const toggleFamilyComputeSharing = () => {
    cyberSound.playClick();
    setFamilyComputeSharingEnabled((prev) => {
      const next = !prev;
      addNotification({
        title: next ? "💻 Aile Cihaz Paylaşımı Etkinleştirildi" : "⏸️ Aile Cihaz Paylaşımı Durduruldu",
        message: next
          ? "Bu bir tarayıcı-içi demodur. Gerçek bir üründe, ebeveynin kendi rızasıyla paylaştığı ev donanımından gelen gelir çocuğun fonuna aktarılır — çocuğun kendi cihazı değil, ailenin ev bilgisayarı kullanılır."
          : "Paylaşım durduruldu.",
        severity: "INFO",
        category: "SYSTEM",
      });
      return next;
    });
  };

  const handleAddDemoEarning = () => {
    cyberSound.playClick();
    setChildFundUSDT((v) => v + 25);
    addNotification({
      title: "🐷 Fona Eklendi (Demo)",
      message: `25 USDT ${selectedChild.name}'in geleceği fonuna eklendi.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">NUR KIDS — Eğitim & Geleceği Fonu (Veli Paneli)</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                VELİ GÖZETİMİNDE &bull; DEMO
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bu panel yalnızca ebeveynler içindir — çocuklarla doğrudan etkileşime giren bir yapay zeka sohbet aracı değildir.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
          {(
            [
              { id: "dashboard" as const, label: "👨‍👩‍👧 Veli Paneli" },
              { id: "catalog" as const, label: "📚 Eğitim Kataloğu" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                cyberSound.playClick();
                setActiveTab(t.id);
              }}
              className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                activeTab === t.id ? "bg-amber-500 text-black shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Child Selector */}
          <div className="flex gap-2">
            {children.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedChildId === c.id ? "bg-amber-500 text-black" : "bg-black/40 text-slate-300 border border-white/10 hover:border-white/30"
                }`}
              >
                {c.name} ({c.age})
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Compliance Notice */}
              <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[11px] text-amber-200 leading-relaxed">
                ⚠️ Bu bir kavramsal demodur. Gerçek bir çocuk fonu ürünü, lisanslı bir emanet (custodial) hesap sağlayıcısı, ebeveyn kimlik
                doğrulaması ve çocuk verisi için ayrı bir gizlilik/rıza süreci (GDPR-K/COPPA) gerektirir — bunların hiçbiri henüz kurulmamıştır.
              </div>

              {/* Course Progress */}
              <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-3">
                <h3 className="text-sm font-bold text-white font-serif">{selectedChild.name} — Eğitim İlerlemesi</h3>
                <div className="space-y-2">
                  {selectedChild.courses.map((c) => {
                    const pct = Math.round((c.lessonsCompleted / c.lessonsTotal) * 100);
                    return (
                      <div key={c.id} className="p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-white font-bold">{c.icon} {c.subject}</span>
                          <span className="text-slate-400 font-mono">{c.lessonsCompleted}/{c.lessonsTotal} ders (%{pct})</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Family Fund */}
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-300 font-serif">🐷 {selectedChild.name}'in Geleceği Fonu</h3>
                  <span className="text-lg font-bold font-mono text-emerald-300">{childFundUSDT.toLocaleString()} USDT</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Kavramsal model: fon 18 yaşına kadar tutulur, ebeveyn/veli acil durumlarda esnek erişime sahiptir. Gerçek uygulamada bu,
                  lisanslı bir emanet hesabı (örn. Almanya'da Kinderkonto benzeri bir yapı) gerektirir.
                </p>
                <button
                  onClick={handleAddDemoEarning}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                >
                  + Demo Kazanç Ekle
                </button>
              </div>

              {/* Family Compute Sharing (parent's device, opt-in) */}
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-black/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300 font-serif">💻 Aile Cihaz Paylaşımı (Ebeveynin Cihazı)</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Çocuğun değil, ebeveynin kendi rızasıyla paylaştığı ev bilgisayarından gelen gelir fona aktarılır. Varsayılan olarak kapalı.
                    </p>
                  </div>
                  <button
                    onClick={toggleFamilyComputeSharing}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-colors ${
                      familyComputeSharingEnabled
                        ? "bg-red-500/20 text-red-400 border border-red-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    }`}
                  >
                    {familyComputeSharingEnabled ? "DURDUR" : "ETKİNLEŞTİR"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "catalog" && (
            <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-3">
              <h3 className="text-sm font-bold text-white font-serif">Eğitim Kataloğu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedChild.courses.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-sm font-bold text-white">{c.icon} {c.subject}</div>
                    <div className="text-[11px] text-slate-400 mt-1">Yaş grubu: {c.ageRange}</div>
                    <div className="text-[11px] text-emerald-400 mt-0.5">{c.lessonsCompleted}/{c.lessonsTotal} ders tamamlandı</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 border-t border-white/10 pt-2">
                Not: Bu bir ders ilerleme kataloğudur, çocukla canlı etkileşime giren bir yapay zeka sohbet aracı değildir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
