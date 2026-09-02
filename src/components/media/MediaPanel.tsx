"use client";

import { useState } from "react";

interface MediaChannel {
  id: string;
  name: string;
  language: string;
  region: string;
  status: "live" | "upcoming" | "replay";
  viewers?: number;
  description: string;
  topics: string[];
}

const channels: MediaChannel[] = [
  { id: "nur-global", name: "NUR Finance Global", language: "English", region: "Global", status: "live", viewers: 12840, description: "24/7 global financial markets coverage, analysis, and breaking news.", topics: ["Markets", "Analysis", "Breaking News"] },
  { id: "nur-turkey", name: "NUR Finans Turkiye", language: "Turkce", region: "Turkey", status: "live", viewers: 4230, description: "Borsa Istanbul, Turk ekonomisi ve yatirim analizi.", topics: ["BIST", "Ekonomi", "Analiz"] },
  { id: "nur-arabic", name: "نور المالية", language: "العربية", region: "MENA", status: "live", viewers: 8920, description: "تغطية الأسواق المالية في الشرق الأوسط وشمال أفريقيا", topics: ["أسواق", "تحليل", "نفط"] },
  { id: "nur-deutsch", name: "NUR Finanzen", language: "Deutsch", region: "DACH", status: "upcoming", description: "DAX, Europaische Markte und Wirtschaftsanalysen.", topics: ["DAX", "Europa", "Wirtschaft"] },
  { id: "nur-china", name: "光辉金融", language: "中文", region: "China/Asia", status: "upcoming", description: "中国和亚洲金融市场实时报道", topics: ["A股", "港股", "宏观"] },
  { id: "nur-japan", name: "NURファイナンス", language: "日本語", region: "Japan", status: "upcoming", description: "日経平均、日本市場のリアルタイム分析", topics: ["日経", "市場", "分析"] },
  { id: "nur-latam", name: "NUR Finanzas", language: "Espanol", region: "Latin America", status: "upcoming", description: "Mercados latinoamericanos, commodities y analisis regional.", topics: ["Mercados", "Commodities", "Analisis"] },
  { id: "nur-india", name: "NUR Finance India", language: "Hindi/English", region: "India", status: "upcoming", description: "NSE, BSE and Indian market coverage with Hindi and English commentary.", topics: ["NSE", "BSE", "Nifty"] },
];

const socialPlatforms = [
  { name: "YouTube", url: "https://youtube.com/@nurfinance", icon: "YT", color: "#ff0000", followers: "Coming Soon" },
  { name: "X (Twitter)", url: "https://x.com/nurfinance", icon: "X", color: "#1da1f2", followers: "Coming Soon" },
  { name: "Instagram", url: "https://instagram.com/nurfinance", icon: "IG", color: "#e1306c", followers: "Coming Soon" },
  { name: "TikTok", url: "https://tiktok.com/@nurfinance", icon: "TT", color: "#00f2ea", followers: "Coming Soon" },
  { name: "LinkedIn", url: "https://linkedin.com/company/nurfinance", icon: "LI", color: "#0077b5", followers: "Coming Soon" },
  { name: "Telegram", url: "https://t.me/nurfinance", icon: "TG", color: "#0088cc", followers: "Coming Soon" },
  { name: "Discord", url: "https://discord.gg/nurfinance", icon: "DC", color: "#5865f2", followers: "Coming Soon" },
  { name: "WeChat", url: "#", icon: "WC", color: "#07c160", followers: "Coming Soon" },
  { name: "Xiaohongshu", url: "#", icon: "XHS", color: "#ff2442", followers: "Coming Soon" },
  { name: "Reddit", url: "https://reddit.com/r/nurfinance", icon: "RD", color: "#ff4500", followers: "Coming Soon" },
];

const STATUS_COLORS = { live: "#00d4aa", upcoming: "#f0b429", replay: "#6366f1" };

export default function MediaPanel() {
  const [selectedChannel, setSelectedChannel] = useState<MediaChannel | null>(null);

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)" }}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="var(--ag-accent)">
            <rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke="var(--ag-accent)" strokeWidth="1.5" />
            <polygon points="6,5.5 11,8 6,10.5" fill="var(--ag-accent)" />
          </svg>
          <h1 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>NUR Finance Media</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
            {channels.filter((c) => c.status === "live").length} Live
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            {selectedChannel ? (
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--ag-border)" }}>
                <div className="aspect-video flex items-center justify-center relative" style={{ background: "#000" }}>
                  <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 16 16" fill="var(--ag-accent)" className="mx-auto mb-2 opacity-50">
                      <polygon points="4,2 14,8 4,14" />
                    </svg>
                    <p className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>{selectedChannel.name}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ag-muted)" }}>
                      {selectedChannel.status === "live" ? "Live broadcast — connecting..." : "Channel launching soon"}
                    </p>
                  </div>
                  {selectedChannel.status === "live" && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-red-600/90">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-[10px] font-bold text-white">LIVE</span>
                      {selectedChannel.viewers && (
                        <span className="text-[10px] text-white/80 ml-1">
                          {selectedChannel.viewers.toLocaleString()} viewers
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3" style={{ background: "var(--ag-surface)" }}>
                  <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--ag-text)" }}>{selectedChannel.name}</h2>
                  <p className="text-[11px] mb-2" style={{ color: "var(--ag-muted)" }}>{selectedChannel.description}</p>
                  <div className="flex gap-1">
                    {selectedChannel.topics.map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="aspect-video rounded-xl border flex items-center justify-center"
                style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
              >
                <div className="text-center">
                  <svg width="40" height="40" viewBox="0 0 16 16" fill="var(--ag-muted)" className="mx-auto mb-2 opacity-30">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke="var(--ag-muted)" strokeWidth="1" />
                    <polygon points="6,5.5 11,8 6,10.5" />
                  </svg>
                  <p className="text-xs" style={{ color: "var(--ag-muted)" }}>Select a channel to watch</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Channels</h2>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch)}
                className="w-full text-left p-2.5 rounded-lg border transition-all hover:scale-[1.01]"
                style={{
                  borderColor: selectedChannel?.id === ch.id ? "var(--ag-accent)" : "var(--ag-border)",
                  background: selectedChannel?.id === ch.id ? "rgba(0,212,170,0.05)" : "var(--ag-surface)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ag-text)" }}>{ch.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[ch.status] }} />
                    <span className="text-[9px] uppercase" style={{ color: STATUS_COLORS[ch.status] }}>{ch.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--ag-muted)" }}>
                  <span>{ch.language}</span>
                  <span>·</span>
                  <span>{ch.region}</span>
                  {ch.viewers && (
                    <>
                      <span>·</span>
                      <span>{ch.viewers.toLocaleString()} watching</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t pt-4" style={{ borderColor: "var(--ag-border)" }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ag-muted)" }}>
            Follow NUR Finance Everywhere
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {socialPlatforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 p-2.5 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
              >
                <div
                  className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: p.color + "22", color: p.color }}
                >
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium truncate" style={{ color: "var(--ag-text)" }}>{p.name}</div>
                  <div className="text-[9px]" style={{ color: "var(--ag-muted)" }}>{p.followers}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
