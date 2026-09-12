"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { channels, hosts, guests, shows, type NURChannel, type NURHost, type NURGuest, type NURShow } from "@/lib/data/broadcast";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import { BROADCAST_LANGUAGES, hdVoiceEngine } from "@/lib/broadcast/multilingual-broadcast";
import CharacterStudioGallery from "@/components/media/CharacterStudioGallery";

const NurEarth3DGlobe = dynamic(() => import("@/components/geopolitics/NurEarth3DGlobe"), { ssr: false });

type TabId = "characters" | "channels" | "hosts" | "schedule" | "social";
type VideoStageMode = "3D_GLOBE" | "RADAR" | "TELEPROMPTER";

const STATUS_COLORS: Record<string, string> = { live: "#00d4aa", upcoming: "#f0b429", "pre-launch": "#6366f1" };

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

function HostCard({ host, channel }: { host: NURHost; channel?: NURChannel }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-lg border p-3 cursor-pointer transition-all hover:scale-[1.005]"
      style={{ borderColor: expanded ? "var(--ag-accent)" : "var(--ag-border)", background: "var(--ag-surface)" }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: (channel?.brandColor ?? "var(--ag-accent)") + "22", color: channel?.brandColor ?? "var(--ag-accent)" }}
        >
          {host.displayName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: "var(--ag-text)" }}>{host.displayName} {host.lastName}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
              {host.status}
            </span>
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            {channel?.flag} {channel?.nameLocal} · {host.languages.join(", ")}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>
            {host.specializations.slice(0, 3).join(" · ")}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: "1px solid var(--ag-border)" }}>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span style={{ color: "var(--ag-muted)" }}>Height:</span>{" "}
              <span style={{ color: "var(--ag-text)" }}>{host.heightCm}cm</span>
            </div>
            <div>
              <span style={{ color: "var(--ag-muted)" }}>Eyes:</span>{" "}
              <span style={{ color: "var(--ag-text)" }}>{host.eyeColor}</span>
            </div>
            <div>
              <span style={{ color: "var(--ag-muted)" }}>Hair:</span>{" "}
              <span style={{ color: "var(--ag-text)" }}>{host.hairColor} / {host.hairStyle}</span>
            </div>
            <div>
              <span style={{ color: "var(--ag-muted)" }}>Nationality:</span>{" "}
              <span style={{ color: "var(--ag-text)" }}>{host.nationality}</span>
            </div>
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Education:</span>
            {host.education.map((e, i) => (
              <div key={i} className="ml-2">{e.degree} {e.field} — {e.institution} ({e.year})</div>
            ))}
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Certifications:</span> {host.certifications.join(", ")}
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Previous:</span> {host.previousEmployers.join(", ")}
          </div>
          <p className="text-[10px] italic" style={{ color: "var(--ag-muted)" }}>{host.bio}</p>
        </div>
      )}
    </div>
  );
}

function GuestCard({ guest }: { guest: NURGuest }) {
  const [expanded, setExpanded] = useState(false);
  const guestChannels = channels.filter(c => guest.channelIds.includes(c.id));
  return (
    <div
      className="rounded-lg border p-3 cursor-pointer transition-all hover:scale-[1.005]"
      style={{ borderColor: expanded ? "#f59e0b" : "var(--ag-border)", background: "var(--ag-surface)" }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "#f59e0b22", color: "#f59e0b" }}>
          {guest.displayName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold" style={{ color: "var(--ag-text)" }}>{guest.displayName}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "#f59e0b22", color: "#f59e0b" }}>
              {guest.title}
            </span>
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            {guest.currentPosition} · {guest.institution}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "var(--ag-muted)" }}>
            {guestChannels.map(c => c.flag).join(" ")} · {guest.typicalSegmentMinutes}min segments · {guest.publications} publications
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 space-y-2" style={{ borderTop: "1px solid var(--ag-border)" }}>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Channels:</span> {guestChannels.map(c => c.nameLocal).join(", ")}
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Education:</span>
            {guest.education.map((e, i) => (
              <div key={i} className="ml-2">{e.degree} {e.field} — {e.institution} ({e.year})</div>
            ))}
          </div>
          <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--ag-text)" }}>Specializations:</span> {guest.specializations.join(", ")}
          </div>
          <p className="text-[10px] italic" style={{ color: "var(--ag-muted)" }}>{guest.bio}</p>
        </div>
      )}
    </div>
  );
}

function ShowCard({ show }: { show: NURShow }) {
  const channel = channels.find(c => c.id === show.channelId);
  const showHosts = hosts.filter(h => show.hostIds.includes(h.id));
  const showGuests = guests.filter(g => show.recurringGuestIds.includes(g.id));

  const FORMAT_COLORS: Record<string, string> = {
    "market-open": "#22c55e", "market-close": "#ef4444", "breaking-news": "#dc2626",
    "weekend-review": "#6366f1", "panel-discussion": "#8b5cf6", "interview": "#06b6d4",
    "deep-dive": "#f59e0b", "live-desk": "#00d4aa"
  };

  return (
    <div className="rounded-lg border p-3" style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold" style={{ color: "var(--ag-text)" }}>{show.nameLocal}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: (FORMAT_COLORS[show.format] ?? "#666") + "22", color: FORMAT_COLORS[show.format] ?? "#666" }}>
            {show.format}
          </span>
        </div>
        <span className="text-[9px]" style={{ color: "var(--ag-muted)" }}>
          {show.durationMinutes > 0 ? `${show.durationMinutes}min` : "24/7"}
        </span>
      </div>
      <div className="text-[10px] mb-1.5" style={{ color: "var(--ag-muted)" }}>
        {channel?.flag} {channel?.nameLocal} · {show.schedule.days.join(", ")} · {show.schedule.startUTC}–{show.schedule.endUTC} UTC
      </div>
      <p className="text-[10px] mb-2" style={{ color: "var(--ag-muted)" }}>{show.description}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {show.segments.map(s => (
          <span key={s} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.08)", color: "var(--ag-accent)" }}>{s}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-[10px]">
        <span style={{ color: "var(--ag-muted)" }}>Hosts:</span>
        {showHosts.map(h => (
          <span key={h.id} className="px-1.5 py-0.5 rounded" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>{h.displayName}</span>
        ))}
        {showGuests.length > 0 && (
          <>
            <span style={{ color: "var(--ag-muted)" }}>Guests:</span>
            {showGuests.map(g => (
              <span key={g.id} className="px-1.5 py-0.5 rounded" style={{ background: "#f59e0b15", color: "#f59e0b" }}>{g.displayName}</span>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function MediaPanel() {
  const { openFloatingWindow, popoutToNativeWindow, setActiveView } = useIDEStore();
  const [tab, setTab] = useState<TabId>("characters");
  const [selectedChannel, setSelectedChannel] = useState<NURChannel | null>(channels[0]);
  const [videoStageMode, setVideoStageMode] = useState<VideoStageMode>("3D_GLOBE");
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "characters", label: "🌟 Characters & Studios" },
    { id: "channels", label: "Channels", count: channels.length },
    { id: "hosts", label: "On-Air Team", count: hosts.length + guests.length },
    { id: "schedule", label: "Schedule", count: shows.length },
    { id: "social", label: "Social" },
  ];

  const channelHosts = selectedChannel ? hosts.filter(h => h.channelId === selectedChannel.id) : [];
  const channelShows = selectedChannel ? shows.filter(s => s.channelId === selectedChannel.id) : [];
  const channelGuests = selectedChannel
    ? guests.filter(g => g.channelIds.includes(selectedChannel.id))
    : [];

  const handleSpeakSample = () => {
    if (isVoiceSpeaking) {
      hdVoiceEngine.stop();
      setIsVoiceSpeaking(false);
      return;
    }
    const sampleText = selectedChannel 
      ? `This is NUR Finance ${selectedChannel.nameLocal}, broadcasting live from ${selectedChannel.city}. Delivering real-time sovereign quantitative market intelligence.`
      : "Welcome to NUR Finance Global Media Network.";
    hdVoiceEngine.speak(
      sampleText,
      selectedChannel?.language === "Turkish" ? "tr-TR" : "en-US",
      () => setIsVoiceSpeaking(true),
      () => setIsVoiceSpeaking(false),
      () => setIsVoiceSpeaking(false)
    );
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: "var(--ag-bg)" }}>
      <div className="p-4">
        {/* Header with Title & Popout Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <EagleCrest size={24} animate={true} />
            <h1 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>NUR Finance Media Network</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
              {channels.filter(c => c.status === "live").length} Live Channels
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("broadcast-studio")}
              className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>🎬 STUDIO ON-AIR</span>
            </button>

            <button
              onClick={() => setActiveView("live-tv")}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
            >
              📺 NUR TV LIVE
            </button>

            <button
              onClick={() => openFloatingWindow("media", "📡 NUR Finance Media Network")}
              className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
              title="Open in floating window"
            >
              ⤢ FLOAT
            </button>

            <button
              onClick={() => popoutToNativeWindow("media")}
              className="px-2 py-1 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
              title="Pop out to separate window"
            >
              ↗ DUAL-SCREEN
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="text-[10px] px-2.5 py-1.5 rounded-md font-medium transition-all"
              style={{
                background: tab === t.id ? "var(--ag-accent)" : "var(--ag-surface)",
                color: tab === t.id ? "#000" : "var(--ag-muted)",
                border: `1px solid ${tab === t.id ? "var(--ag-accent)" : "var(--ag-border)"}`,
              }}
            >
              {t.label}{t.count != null && ` (${t.count})`}
            </button>
          ))}
        </div>

        {/* CHARACTERS & STUDIOS TAB */}
        {tab === "characters" && <CharacterStudioGallery />}

        {/* CHANNELS TAB */}
        {tab === "channels" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {selectedChannel ? (
                <div className="rounded-xl border overflow-hidden shadow-2xl" style={{ borderColor: "var(--ag-border)" }}>
                  {/* Dynamic Studio Stage Selector Bar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-black/80 border-b border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold">STAGE:</span>
                      {[
                        { id: "3D_GLOBE", label: "🌐 3D GLOBE" },
                        { id: "RADAR", label: "📡 ORBITAL RADAR" },
                        { id: "TELEPROMPTER", label: "🎙️ TELEPROMPTER" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setVideoStageMode(m.id as VideoStageMode)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                            videoStageMode === m.id
                              ? "bg-amber-500 text-black border-amber-400"
                              : "bg-black/50 border-white/10 text-slate-400 hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleSpeakSample}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all flex items-center gap-1 ${
                        isVoiceSpeaking
                          ? "bg-red-600 text-white border-red-500 animate-pulse"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      <span>{isVoiceSpeaking ? "⏹️ STOP" : "🔊 AI ANCHOR VOICE"}</span>
                    </button>
                  </div>

                  {/* Video Stage Viewport */}
                  <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                    {videoStageMode === "3D_GLOBE" ? (
                      <div className="w-full h-full relative">
                        <NurEarth3DGlobe />
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 pointer-events-none z-10">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                            {selectedChannel.flag} {selectedChannel.nameLocal} • LIVE 4K
                          </span>
                        </div>
                      </div>
                    ) : videoStageMode === "RADAR" ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#082f49_0%,#020617_70%,#000000_100%)] font-mono">
                        <div className="w-[320px] h-[320px] rounded-full border border-cyan-500/30 relative animate-pulse flex items-center justify-center">
                          <div className="w-[220px] h-[220px] rounded-full border border-cyan-400/20" />
                          <div className="w-[120px] h-[120px] rounded-full border border-cyan-300/30" />
                          <div className="w-full h-[1px] bg-cyan-500/30 absolute" />
                          <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
                        </div>
                        <div className="absolute top-4 left-4 text-xs text-cyan-300 font-bold">
                          ORBITAL TELEMETRY DOWNLINK • FREQ: 54.751113 MHz [CH-13·35·42·55]
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full p-6 flex flex-col justify-center bg-slate-950 font-mono text-center space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          LIVE TELEPROMPTER • {selectedChannel.nameLocal}
                        </div>
                        <p className="text-sm font-semibold text-white max-w-lg mx-auto leading-relaxed">
                          &ldquo;This is NUR Finance {selectedChannel.nameLocal}, broadcasting live from {selectedChannel.city}. Bringing you real-time geopolitical intelligence and sovereign quant strategies.&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="p-3" style={{ background: "var(--ag-surface)" }}>
                    <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--ag-text)" }}>{selectedChannel.nameLocal}</h2>
                    <p className="text-[11px] mb-1" style={{ color: "var(--ag-muted)" }}>{selectedChannel.descriptionLocal}</p>
                    <div className="text-[10px] mb-2" style={{ color: "var(--ag-muted)" }}>
                      {selectedChannel.city} · {selectedChannel.timezone} · {selectedChannel.language}
                      {selectedChannel.secondaryLanguages.length > 0 && ` + ${selectedChannel.secondaryLanguages.join(", ")}`}
                    </div>
                    <div className="flex gap-1 flex-wrap mb-3">
                      {selectedChannel.topics.map(t => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>{t}</span>
                      ))}
                    </div>

                    {/* Channel hosts */}
                    {channelHosts.length > 0 && (
                      <div className="mb-3">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Anchors</h3>
                        <div className="space-y-2">
                          {channelHosts.map(h => <HostCard key={h.id} host={h} channel={selectedChannel} />)}
                        </div>
                      </div>
                    )}

                    {/* Channel guests */}
                    {channelGuests.length > 0 && (
                      <div className="mb-3">
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Recurring Guests</h3>
                        <div className="space-y-2">
                          {channelGuests.map(g => <GuestCard key={g.id} guest={g} />)}
                        </div>
                      </div>
                    )}

                    {/* Channel shows */}
                    {channelShows.length > 0 && (
                      <div>
                        <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Shows</h3>
                        <div className="space-y-2">
                          {channelShows.map(s => <ShowCard key={s.id} show={s} />)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl border flex items-center justify-center"
                  style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}>
                  <div className="text-center">
                    <div className="text-2xl mb-2 opacity-30">📡</div>
                    <p className="text-xs" style={{ color: "var(--ag-muted)" }}>Select a channel to view details</p>
                    <p className="text-[10px] mt-1" style={{ color: "var(--ag-muted)" }}>{channels.length} channels · {hosts.length} hosts · {guests.length} experts</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>Channels</h2>
              {channels.map(ch => (
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
                    <span className="text-[11px] font-semibold" style={{ color: "var(--ag-text)" }}>{ch.flag} {ch.nameLocal}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_COLORS[ch.status] ?? "#666" }} />
                      <span className="text-[9px] uppercase" style={{ color: STATUS_COLORS[ch.status] ?? "#666" }}>{ch.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--ag-muted)" }}>
                    <span>{ch.language}</span>
                    <span>·</span>
                    <span>{ch.city}</span>
                    <span>·</span>
                    <span>{hosts.filter(h => h.channelId === ch.id).length} hosts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HOSTS & GUESTS TAB */}
        {tab === "hosts" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-accent)" }}>
                On-Air Anchors ({hosts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {hosts.map(h => {
                  const ch = channels.find(c => c.id === h.channelId);
                  return <HostCard key={h.id} host={h} channel={ch} />;
                })}
              </div>
            </div>
            <div className="border-t pt-4" style={{ borderColor: "var(--ag-border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#f59e0b" }}>
                Expert Guests ({guests.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {guests.map(g => <GuestCard key={g.id} guest={g} />)}
              </div>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {tab === "schedule" && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ag-muted)" }}>
              Broadcast Schedule ({shows.length} shows)
            </h2>
            {shows.map(s => <ShowCard key={s.id} show={s} />)}
          </div>
        )}

        {/* SOCIAL TAB */}
        {tab === "social" && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--ag-muted)" }}>
              Follow NUR Finance Everywhere
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {socialPlatforms.map(p => (
                <div
                  key={p.name}
                  className="flex items-center gap-2 p-2.5 rounded-lg border transition-all hover:scale-[1.02] cursor-pointer"
                  style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: p.color + "22", color: p.color }}>
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
        )}
      </div>
    </div>
  );
}
