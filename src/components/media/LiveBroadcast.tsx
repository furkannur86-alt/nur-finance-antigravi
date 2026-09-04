"use client";

import { useEffect, useRef, useState } from "react";
import { channels, hosts, shows } from "@/lib/data/broadcast";

const TICKER_HEADLINES = [
  "FTSE 100 +0.8% at 8,234 — mining stocks lead gains on copper rally",
  "ECB holds rates at 3.75%, signals September review amid sticky services inflation",
  "EUR/USD 1.0892 ▲0.3% — dollar weakness on soft PMI data",
  "Gold $2,418/oz ▲1.2% — safe-haven bid on Middle East tensions",
  "Brent crude $82.40 ▲0.6% — OPEC+ considering deeper cuts in Q4",
  "BREAKING: Bank of Japan signals possible rate hike — Nikkei drops 1.4%",
  "S&P 500 futures +0.4% — Nvidia earnings beat sends tech higher",
  "UK GDP Q2 +0.6% QoQ — beats consensus of +0.4%",
  "China PBoC cuts 1-year MLF rate by 15bp to 2.35%",
  "German Ifo Business Climate 87.2 vs 86.5 expected — manufacturing recovery signs",
  "Bitcoin $67,420 ▲2.8% — ETF inflows hit $890M daily record",
  "US 10Y yield 4.22% ▼6bp — rate cut expectations firm for December",
  "DAX 18,890 +0.5% — SAP hits all-time high on AI demand",
  "MSCI Emerging Markets +1.1% — India, Brazil lead gains",
  "Natural Gas $2.84 ▲3.2% — heatwave drives cooling demand",
];

const BREAKING_ALERTS = [
  { text: "ECB HOLDS RATES AT 3.75% — LAGARDE PRESS CONFERENCE AT 14:30 CET", urgency: "urgent" as const },
  { text: "BOJ SIGNALS RATE HIKE — JPY SURGES 1.8% AGAINST USD", urgency: "flash" as const },
  { text: "US NONFARM PAYROLLS 218K VS 205K EXPECTED — UNEMPLOYMENT 3.9%", urgency: "urgent" as const },
];

const CHANNEL_VIDEOS: Record<string, string> = {
  "nur-global": "/videos/broadcasts/nur-global.mp4",
  "nur-usa": "/videos/broadcasts/nur-usa.mp4",
  "nur-turkey": "/videos/broadcasts/nur-turkey.mp4",
  "nur-arabic": "/videos/broadcasts/nur-arabic.mp4",
  "nur-deutsch": "/videos/broadcasts/nur-deutsch.mp4",
  "nur-france": "/videos/broadcasts/nur-france.mp4",
  "nur-japan": "/videos/broadcasts/nur-japan.mp4",
  "nur-china": "/videos/broadcasts/nur-china.mp4",
  "nur-korea": "/videos/broadcasts/nur-korea.mp4",
  "nur-india": "/videos/broadcasts/nur-india.mp4",
  "nur-brazil": "/videos/broadcasts/nur-brazil.mp4",
  "nur-latam": "/videos/broadcasts/nur-latam.mp4",
};

const MARKET_DATA = [
  { symbol: "FTSE 100", price: "8,234.50", change: "+0.82%", up: true },
  { symbol: "S&P 500", price: "5,567.20", change: "+0.41%", up: true },
  { symbol: "NASDAQ", price: "17,890.30", change: "+0.63%", up: true },
  { symbol: "DAX", price: "18,890.10", change: "+0.52%", up: true },
  { symbol: "Nikkei 225", price: "38,420.00", change: "-1.38%", up: false },
  { symbol: "EUR/USD", price: "1.0892", change: "+0.28%", up: true },
  { symbol: "GBP/USD", price: "1.2845", change: "+0.15%", up: true },
  { symbol: "USD/JPY", price: "148.20", change: "-1.82%", up: false },
  { symbol: "Gold", price: "2,418.50", change: "+1.22%", up: true },
  { symbol: "Brent", price: "82.40", change: "+0.58%", up: true },
  { symbol: "Bitcoin", price: "67,420", change: "+2.84%", up: true },
  { symbol: "VIX", price: "14.20", change: "-3.40%", up: false },
];

export default function LiveBroadcast() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBreaking, setShowBreaking] = useState(false);
  const [breakingIdx, setBreakingIdx] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState("nur-global");
  const [showChannelPicker, setShowChannelPicker] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const channel = channels.find((c) => c.id === selectedChannel) || channels[0];
  const channelHosts = hosts.filter((h) => h.channelId === selectedChannel);
  const channelShows = shows.filter((s) => s.channelId === selectedChannel);
  const activeHost = channelHosts[0];

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowBreaking(true), 8000);
    const cycleTimer = setInterval(() => {
      setBreakingIdx((i) => (i + 1) % BREAKING_ALERTS.length);
    }, 15000);
    return () => { clearTimeout(showTimer); clearInterval(cycleTimer); };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [selectedChannel]);

  const now = currentTime;
  const utcHours = now.getUTCHours();
  const utcMins = now.getUTCMinutes();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[now.getUTCDay()];
  const currentShow = channelShows.find((s) => {
    if (!s.schedule.days.includes(today)) return false;
    const [sh, sm] = s.schedule.startUTC.split(":").map(Number);
    const [eh, em] = s.schedule.endUTC.split(":").map(Number);
    const nowMin = utcHours * 60 + utcMins;
    return nowMin >= sh * 60 + sm && nowMin < eh * 60 + em;
  }) || channelShows[0];

  const formatTime = (d: Date, tz: string) => {
    try {
      return d.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
  };

  const bc = channel.brandColor;

  return (
    <div style={{ width: "100%", height: "100%", background: "#000", position: "relative", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Video player */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        poster={`/videos/broadcasts/${selectedChannel}_poster.jpg`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src={CHANNEL_VIDEOS[selectedChannel] || CHANNEL_VIDEOS["nur-global"]} type="video/mp4" />
      </video>

      {/* LIVE badge + channel logo */}
      <div style={{ position: "absolute", top: 12, left: 16, display: "flex", alignItems: "center", gap: 12, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: bc, letterSpacing: 2, textShadow: `0 0 20px ${bc}80` }}>
            NUR
          </span>
          <span style={{ fontSize: 12, color: "#ffffff90", fontWeight: 500, letterSpacing: 1 }}>FINANCE</span>
        </div>
        <div style={{
          background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "3px 10px", borderRadius: 3, letterSpacing: 1.5,
          animation: "livePulse 2s infinite",
        }}>
          ● LIVE
        </div>
        {/* Channel picker button */}
        <button
          onClick={() => setShowChannelPicker((v) => !v)}
          style={{
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
            border: `1px solid ${bc}40`, borderRadius: 6,
            color: "#fff", fontSize: 12, fontWeight: 600,
            padding: "4px 12px", cursor: "pointer",
          }}
        >
          {channel.name} ▾
        </button>
      </div>

      {/* Channel picker dropdown */}
      {showChannelPicker && (
        <div style={{
          position: "absolute", top: 48, left: 16, zIndex: 30,
          background: "rgba(10,20,40,0.95)", backdropFilter: "blur(12px)",
          border: `1px solid ${bc}30`, borderRadius: 8,
          padding: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4,
          maxWidth: 480,
        }}>
          {Object.keys(CHANNEL_VIDEOS).map((chId) => {
            const ch = channels.find((c) => c.id === chId);
            if (!ch) return null;
            return (
              <button
                key={chId}
                onClick={() => { setSelectedChannel(chId); setShowChannelPicker(false); }}
                style={{
                  background: selectedChannel === chId ? `${ch.brandColor}30` : "rgba(255,255,255,0.05)",
                  border: selectedChannel === chId ? `1px solid ${ch.brandColor}` : "1px solid transparent",
                  borderRadius: 6, padding: "6px 10px", cursor: "pointer",
                  color: "#fff", fontSize: 11, fontWeight: 600, textAlign: "left",
                }}
              >
                <span style={{ color: ch.brandColor, marginRight: 6 }}>{ch.flag}</span>
                {ch.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Clock strip + volume */}
      <div style={{
        position: "absolute", top: 12, right: 16, display: "flex", gap: 16,
        fontSize: 11, color: "#ffffff80", fontFamily: "monospace", zIndex: 10, alignItems: "center",
      }}>
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = !videoRef.current.muted;
              setIsMuted(videoRef.current.muted);
            }
          }}
          style={{
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 4, color: "#fff", fontSize: 14, cursor: "pointer",
            padding: "2px 8px", lineHeight: 1,
          }}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
        <span>LON {formatTime(currentTime, "Europe/London")}</span>
        <span>NYC {formatTime(currentTime, "America/New_York")}</span>
        <span>TYO {formatTime(currentTime, "Asia/Tokyo")}</span>
        <span style={{ color: "#ffffff50" }}>UTC {formatTime(currentTime, "UTC")}</span>
      </div>

      {/* Current show info */}
      {currentShow && (
        <div style={{
          position: "absolute", top: 48, right: 16, zIndex: 10,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
          padding: "6px 14px", borderRadius: 6, borderLeft: `3px solid ${bc}`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{currentShow.name}</div>
          <div style={{ fontSize: 10, color: "#ffffff70" }}>
            {currentShow.schedule.startUTC}–{currentShow.schedule.endUTC} UTC · {currentShow.format}
          </div>
        </div>
      )}

      {/* Lower third — presenter name */}
      {activeHost && (
        <div style={{
          position: "absolute", bottom: 80, left: 0, zIndex: 10,
          display: "flex", alignItems: "stretch",
        }}>
          <div style={{ background: bc, padding: "8px 20px", display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>
              {activeHost.firstName} {activeHost.lastName}
            </span>
          </div>
          <div style={{
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
            padding: "8px 16px", display: "flex", alignItems: "center",
            borderRight: `2px solid ${bc}40`,
          }}>
            <span style={{ fontSize: 11, color: "#ffffff90" }}>
              {activeHost.specializations.slice(0, 2).join(" · ")} · {channel.name}
            </span>
          </div>
        </div>
      )}

      {/* Breaking news banner */}
      {showBreaking && (
        <div style={{
          position: "absolute", bottom: 46, left: 0, right: 0, zIndex: 10,
          background: BREAKING_ALERTS[breakingIdx].urgency === "flash" ? "#dc2626" : "#b91c1c",
          display: "flex", alignItems: "center", height: 32,
        }}>
          <div style={{
            background: "#fff", color: "#dc2626", fontWeight: 800, fontSize: 11,
            padding: "0 12px", height: "100%", display: "flex", alignItems: "center",
            letterSpacing: 1.5,
          }}>
            BREAKING
          </div>
          <div style={{
            flex: 1, overflow: "hidden", padding: "0 16px",
            fontSize: 13, fontWeight: 600, color: "#fff", letterSpacing: 0.3,
            whiteSpace: "nowrap",
          }}>
            {BREAKING_ALERTS[breakingIdx].text}
          </div>
        </div>
      )}

      {/* News ticker */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 44,
        background: "rgba(0,8,20,0.92)", borderTop: `1px solid ${bc}30`,
        display: "flex", alignItems: "center", zIndex: 10,
      }}>
        <div style={{
          background: bc, color: "#fff", fontWeight: 700,
          fontSize: 10, padding: "0 12px", height: "100%", display: "flex",
          alignItems: "center", letterSpacing: 1.5, flexShrink: 0,
        }}>
          NUR FINANCE
        </div>
        <div style={{ flex: 1, overflow: "hidden", position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", gap: 60, whiteSpace: "nowrap",
            animation: "tickerScroll 120s linear infinite",
            fontSize: 12, color: "#ffffffcc", fontWeight: 500,
          }}>
            {[...TICKER_HEADLINES, ...TICKER_HEADLINES].map((h, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: bc, fontSize: 8 }}>◆</span>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar — market data */}
      <div style={{
        position: "absolute", top: 90, right: 0, width: 180, bottom: 80,
        background: "rgba(0,8,20,0.75)", backdropFilter: "blur(8px)",
        borderLeft: `1px solid ${bc}20`, zIndex: 10,
        padding: "10px 0", overflowY: "auto",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#ffffff50", padding: "0 12px 8px", letterSpacing: 2 }}>
          MARKETS
        </div>
        {MARKET_DATA.map((m) => (
          <div key={m.symbol} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "5px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            fontSize: 11,
          }}>
            <div>
              <div style={{ color: "#ffffffcc", fontWeight: 600, fontSize: 10 }}>{m.symbol}</div>
              <div style={{ color: "#ffffff60", fontSize: 9, fontFamily: "monospace" }}>{m.price}</div>
            </div>
            <span style={{
              color: m.up ? "#00d4aa" : "#ef4444", fontWeight: 700, fontSize: 10,
              fontFamily: "monospace",
            }}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
