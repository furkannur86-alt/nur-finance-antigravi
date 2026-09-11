"use client";

import { useState, useRef } from "react";

// Gender-aware avatar greeting — opposite gender, professional appearance
const MALE_AVATARS = ["👩‍💼", "👩‍🔬", "👩‍⚕️", "👩‍💻", "👩‍🏫", "👩‍⚖️"];
const FEMALE_AVATARS = ["👨‍💼", "👨‍🔬", "👨‍⚕️", "👨‍💻", "👨‍🏫", "👨‍⚖️"];

// Profession list — every major career group
const PROFESSIONS = [
  { group: "Finance & Banking", items: ["Investment Banker", "Portfolio Manager", "Hedge Fund Analyst", "Quant Trader", "Risk Manager", "FX Trader", "Private Equity Analyst", "CFO / Finance Director", "Crypto / DeFi Trader"] },
  { group: "Medicine & Health", items: ["Surgeon / Physician", "Hospital Administrator", "Pharmacist", "Dentist", "Psychologist / Psychiatrist", "Nurse / Midwife", "Medical Researcher", "Biotech Scientist"] },
  { group: "Law & Government", items: ["Lawyer / Barrister", "Judge", "Government Official / Diplomat", "Regulatory Compliance Officer", "Intelligence Analyst", "Military Officer"] },
  { group: "Technology", items: ["Software Engineer / Developer", "AI / ML Engineer", "Data Scientist", "Cybersecurity Specialist", "CTO / Tech Executive", "Product Manager", "Blockchain Developer"] },
  { group: "Business & Industry", items: ["CEO / Founder / Entrepreneur", "Corporate Executive", "Logistics & Supply Chain", "Manufacturing / Industrial", "Energy Sector Professional", "Mining / Resources Executive", "Real Estate Developer"] },
  { group: "Education & Research", items: ["University Professor / Researcher", "Economist", "Financial Analyst / Strategist", "Journalist / Financial Media", "Teacher / Educator"] },
  { group: "Skilled Trades", items: ["Engineer (Civil/Structural/Mech)", "Construction & Project Manager", "Architect / Urban Planner", "Electrician / Technician", "Maritime / Shipping Officer"] },
  { group: "Other", items: ["Retired / HNW Individual", "Student", "Other Professional"] },
];

// Financial social posts (simulated feed)
const SOCIAL_FEED = [
  { id: "f1", user: "AlphaQuant_EU",    avatar: "👨‍💻", time: "2m ago",  likes: 34, content: "NVDA break above $880 confirmed — momentum signals still bullish. My WISH algo flagged this 3 candles before the breakout.", tags: ["#NVDA","#Quant","#TechStocks"] },
  { id: "f2", user: "SarahM_HedgeFund", avatar: "👩‍💼", time: "12m ago", likes: 89, content: "Turkish CDS spreads tightening despite CBRT rate cut. Interesting divergence from historical playbook. Watching TRY/USD closely.", tags: ["#Turkey","#EM","#MacroRisk"] },
  { id: "f3", user: "OilTrader_Gulf",   avatar: "👨‍⚕️", time: "28m ago", likes: 52, content: "Hormuz closure risk re-pricing. Brent front month up $3.4 in 90 minutes. OPEC+ emergency call possible by Friday.", tags: ["#Oil","#Geopolitics","#Brent"] },
  { id: "f4", user: "Prof_EkonomiTR",   avatar: "👩‍🏫", time: "1h ago",  likes: 120, content: "Just published: 'Demographic dividend vs aging trap — India vs China 2030 comparison'. See Research tab for full report.", tags: ["#Macro","#Demographics","#India"] },
  { id: "f5", user: "CryptoNur_Dev",    avatar: "👨‍💻", time: "2h ago",  likes: 67, content: "NUR Coin testnet throughput: 4,200 TPS in latest benchmark. Mainnet launch Q1 2025 on track. Liquidity pool seeded.", tags: ["#NURCoin","#DeFi","#Blockchain"] },
  { id: "f6", user: "GoldBull_ME",      avatar: "👩‍💼", time: "3h ago",  likes: 44, content: "Central bank gold buying accelerating: Poland, Hungary, Turkey all added >10 tonnes Q3. Bullish macro signal for XAU.", tags: ["#Gold","#CentralBanks","#XAU"] },
];

// Achievement badges
const BADGES = [
  { id: "b1", icon: "🏆", label: "Top 1% Trader",     unlocked: true },
  { id: "b2", icon: "🎯", label: "Quant Strategist",   unlocked: true },
  { id: "b3", icon: "🌍", label: "Global Markets Pro", unlocked: true },
  { id: "b4", icon: "⛏️", label: "Compute Contributor",unlocked: false },
  { id: "b5", icon: "💎", label: "NUR Diamond Tier",   unlocked: false },
  { id: "b6", icon: "🔐", label: "KYC Verified",       unlocked: false },
];

type Tab = "profile" | "social" | "settings" | "kyc";

export default function UserProfilePanel() {
  const [tab, setTab] = useState<Tab>("profile");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [avatarIdx] = useState(() => Math.floor(Math.random() * MALE_AVATARS.length));
  const [profession, setProfession] = useState<string>("");
  const [profGroup, setProfGroup] = useState<string>("");
  const [name, setName] = useState("Furkan Nur");
  const [bio, setBio] = useState("Sovereign finance operator · Multi-asset quant · NUR Finance founder");
  const [country, setCountry] = useState("Turkey");
  const [dob, setDob] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const greetingAvatar = gender === "male"
    ? FEMALE_AVATARS[avatarIdx]
    : gender === "female"
    ? MALE_AVATARS[avatarIdx]
    : "🤝";

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "profile",  label: "My Profile",     icon: "👤" },
    { id: "social",   label: "Finance Social",  icon: "💬" },
    { id: "kyc",      label: "Identity & KYC",  icon: "🔐" },
    { id: "settings", label: "Settings",        icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden text-white" style={{ background: "var(--ag-bg, #030810)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0" style={{ background: "rgba(11,15,23,0.98)", borderColor: "rgba(255,255,255,0.08)" }}>
        <div>
          <span className="text-xs font-bold font-serif tracking-wide" style={{ color: "#00d4aa" }}>NUR FINANCE — SOVEREIGN PROFILE</span>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Financial social identity · KYC for real earnings · Community</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "rgba(0,212,170,0.6)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00d4aa" }} />
          LIVE PROFILE
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.4)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold transition-all border-b-2"
            style={{ color: tab === t.id ? "#00d4aa" : "rgba(255,255,255,0.4)", borderBottomColor: tab === t.id ? "#00d4aa" : "transparent", background: tab === t.id ? "rgba(0,212,170,0.08)" : "transparent" }}
          >
            <span>{t.icon}</span> <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {tab === "profile" && (
          <div className="p-5 space-y-5">
            {/* Gender selection / greeting — shown until gender chosen */}
            {!gender && (
              <div className="rounded-xl p-6 text-center" style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)" }}>
                <div className="text-4xl mb-3">{greetingAvatar}</div>
                <div className="text-lg font-bold mb-1" style={{ color: "#00d4aa" }}>Welcome to NUR Finance</div>
                <p className="text-[11px] text-white/50 mb-4">To personalize your experience, please tell us your gender</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setGender("male")} className="px-6 py-2 rounded-lg font-semibold text-sm transition-all" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid #3b82f6", color: "#93c5fd" }}>Male</button>
                  <button onClick={() => setGender("female")} className="px-6 py-2 rounded-lg font-semibold text-sm transition-all" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid #ec4899", color: "#f9a8d4" }}>Female</button>
                </div>
              </div>
            )}

            {gender && (
              <>
                {/* Profile card */}
                <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-start gap-4">
                    {/* Avatar / photo */}
                    <div className="relative shrink-0">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                        style={{ background: "linear-gradient(135deg, rgba(0,212,170,0.2), rgba(56,189,248,0.2))", border: "2px solid rgba(0,212,170,0.4)" }}
                        onClick={() => fileRef.current?.click()}
                      >
                        {photoUrl
                          ? <img src={photoUrl} alt="profile" className="w-full h-full object-cover" />
                          : <span className="text-4xl">{greetingAvatar}</span>
                        }
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer" style={{ background: "#00d4aa" }} onClick={() => fileRef.current?.click()}>📷</div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)}
                          className="w-full bg-transparent border rounded px-2 py-1 text-sm text-white mt-0.5 outline-none"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }} />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Bio / Tagline</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)}
                          rows={2}
                          className="w-full bg-transparent border rounded px-2 py-1 text-[11px] text-white mt-0.5 outline-none resize-none"
                          style={{ borderColor: "rgba(255,255,255,0.12)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    {[["847", "Followers"], ["234", "Following"], ["12", "Posts"], ["$NUR 42.3", "Balance"]].map(([v, l]) => (
                      <div key={l} className="text-center">
                        <div className="text-sm font-bold text-white font-mono">{v}</div>
                        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profession selector */}
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Your Profession</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-white/40 uppercase tracking-wider">Sector</label>
                      <select
                        value={profGroup}
                        onChange={e => { setProfGroup(e.target.value); setProfession(""); }}
                        className="w-full bg-transparent border rounded px-2 py-1.5 text-[11px] text-white mt-0.5 outline-none"
                        style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.4)" }}
                      >
                        <option value="">Select sector…</option>
                        {PROFESSIONS.map(g => <option key={g.group} value={g.group} style={{ background: "#1e293b" }}>{g.group}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] text-white/40 uppercase tracking-wider">Role</label>
                      <select
                        value={profession}
                        onChange={e => setProfession(e.target.value)}
                        className="w-full bg-transparent border rounded px-2 py-1.5 text-[11px] text-white mt-0.5 outline-none"
                        style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.4)" }}
                        disabled={!profGroup}
                      >
                        <option value="">Select role…</option>
                        {PROFESSIONS.find(g => g.group === profGroup)?.items.map(r => (
                          <option key={r} value={r} style={{ background: "#1e293b" }}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {profession && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: "#00d4aa" }} />
                      <span className="text-[11px] text-white/70">{profession}</span>
                    </div>
                  )}
                </div>

                {/* Achievement badges */}
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Achievements</div>
                  <div className="grid grid-cols-3 gap-2">
                    {BADGES.map(b => (
                      <div key={b.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: b.unlocked ? "rgba(0,212,170,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${b.unlocked ? "rgba(0,212,170,0.3)" : "rgba(255,255,255,0.06)"}`, opacity: b.unlocked ? 1 : 0.5 }}>
                        <span>{b.icon}</span>
                        <span className="text-[9px] font-semibold" style={{ color: b.unlocked ? "#00d4aa" : "rgba(255,255,255,0.3)" }}>{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === "social" && (
          <div className="p-4 space-y-4">
            {/* Compose post */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg" style={{ background: "rgba(0,212,170,0.15)" }}>
                  {greetingAvatar}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    rows={2}
                    placeholder="Share a market insight, trade idea, or analysis…"
                    className="w-full bg-transparent text-[11px] text-white outline-none resize-none placeholder-white/20"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-2 text-lg">
                      <button title="Add chart" className="hover:text-cyan-400 transition-colors text-white/30">📊</button>
                      <button title="Add tag" className="hover:text-cyan-400 transition-colors text-white/30">🏷</button>
                      <button title="Attach" className="hover:text-cyan-400 transition-colors text-white/30">📎</button>
                    </div>
                    <button
                      onClick={() => setNewPost("")}
                      disabled={!newPost.trim()}
                      className="px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
                      style={{ background: newPost.trim() ? "#00d4aa" : "rgba(255,255,255,0.06)", color: newPost.trim() ? "#000" : "rgba(255,255,255,0.2)" }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed */}
            {SOCIAL_FEED.map(post => {
              const liked = likedPosts.has(post.id);
              return (
                <div key={post.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] font-bold text-white">{post.user}</span>
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{post.time}</span>
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed mb-2">{post.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map(t => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(0,212,170,0.08)", color: "#00d4aa", border: "1px solid rgba(0,212,170,0.2)" }}>{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-[10px]">
                        <button
                          onClick={() => setLikedPosts(prev => { const n = new Set(prev); liked ? n.delete(post.id) : n.add(post.id); return n; })}
                          className="flex items-center gap-1 transition-colors"
                          style={{ color: liked ? "#f97316" : "rgba(255,255,255,0.3)" }}
                        >
                          {liked ? "❤️" : "🤍"} {post.likes + (liked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>💬 Reply</button>
                        <button className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>🔁 Share</button>
                        <button className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>📊 Chart</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "kyc" && (
          <div className="p-5 space-y-4">
            <div className="rounded-xl p-5" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="text-[11px] font-bold text-red-400">Identity Verification Required for Earnings</span>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed">
                NUR Finance operates as a regulated financial platform. To receive compute earnings, trading profits, or NUR Coin payouts to your bank account, you must complete full KYC verification. This is a legal requirement — treat your NUR account like a bank account. False information will result in permanent account closure and legal referral.
              </p>
            </div>

            <div className="rounded-xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Personal Identity</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Legal First Name", ph: "As on government ID" },
                  { label: "Legal Last Name",  ph: "As on government ID" },
                  { label: "Date of Birth",    ph: "YYYY-MM-DD", value: dob, onChange: (v: string) => setDob(v) },
                  { label: "Nationality",      ph: "e.g. Turkish, German…" },
                  { label: "Country of Residence", ph: "Current country", value: country, onChange: (v: string) => setCountry(v) },
                  { label: "National ID / Passport Number", ph: "T.C. Kimlik No or Passport" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{f.label}</label>
                    <input
                      placeholder={f.ph}
                      defaultValue={f.value}
                      onChange={f.onChange ? e => f.onChange!(e.target.value) : undefined}
                      className="w-full bg-transparent border rounded px-2 py-1.5 text-[11px] text-white outline-none"
                      style={{ borderColor: "rgba(255,255,255,0.12)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Document Upload</div>
              {[
                { label: "Government Photo ID (front)", hint: "Passport · National ID · Driver License" },
                { label: "Government Photo ID (back)",  hint: "Not required for passports" },
                { label: "Proof of Address",            hint: "Utility bill or bank statement < 3 months" },
                { label: "Selfie with ID",              hint: "Hold your ID next to your face, today's date on paper" },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div className="text-[11px] font-semibold text-white">{d.label}</div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{d.hint}</div>
                  </div>
                  <button className="px-3 py-1 rounded text-[10px] font-bold" style={{ background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.3)", color: "#00d4aa" }}>
                    📎 Upload
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "linear-gradient(135deg, #00d4aa, #38bdf8)", color: "#000" }}>
              🔐 Submit KYC Verification
            </button>
          </div>
        )}

        {tab === "settings" && (
          <div className="p-5 space-y-4">
            {[
              { title: "Notifications", items: [
                { label: "Market alerts", desc: "Price movements & volatility triggers", on: true },
                { label: "Social mentions", desc: "When someone tags or replies to you", on: true },
                { label: "Compute earnings", desc: "NUR Coin earned from your hardware", on: true },
                { label: "Weekly portfolio report", desc: "Sunday performance digest", on: false },
              ]},
              { title: "Privacy", items: [
                { label: "Public profile", desc: "Others can see your posts & achievements", on: true },
                { label: "Show profession", desc: "Display your profession on your profile", on: true },
                { label: "Trading P&L visible", desc: "Show portfolio performance to followers", on: false },
              ]},
            ].map(section => (
              <div key={section.title} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{section.title}</div>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-white">{item.label}</div>
                        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</div>
                      </div>
                      <div
                        className="w-10 h-5 rounded-full flex items-center cursor-pointer transition-all"
                        style={{ background: item.on ? "#00d4aa" : "rgba(255,255,255,0.12)", paddingLeft: item.on ? "20px" : "2px" }}
                      >
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
