"use client";

import { useState, useEffect, useMemo } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { useIDEStore } from "@/stores/useIDEStore";
import { getStoredSovereignWallet, updateSovereignWallet } from "@/lib/crypto/sovereignWallet";
import { hdVoiceEngine } from "@/lib/broadcast/multilingual-broadcast";

export interface SocialPost {
  id: string;
  authorName: string;
  authorTitle: string;
  authorProfession: "MEDICAL" | "ENGINEERING" | "EDUCATION" | "LEGAL" | "QUANT_FINANCE";
  authorAvatar: string;
  isVerifiedKYC: boolean;
  timeAgo: string;
  content: string;
  sentiment: "BULLISH" | "BEARISH" | "NEUTRAL" | "COMPUTE_ALPHA";
  targetAsset: string;
  likes: number;
  commentsCount: number;
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    authorName: "Dr. Selim Aras, MD",
    authorTitle: "Chief of Cardiology & Biotech Angel Investor",
    authorProfession: "MEDICAL",
    authorAvatar: "👨‍⚕️",
    isVerifiedKYC: true,
    timeAgo: "12m ago",
    content: "FDA Phase-3 trial readouts for mRNA oncology vectors are showing 42% higher progression-free survival. Correlating our clinic's DICOM AI models with biotech ETF valuations.",
    sentiment: "BULLISH",
    targetAsset: "XBI (Biotech ETF)",
    likes: 42,
    commentsCount: 9,
  },
  {
    id: "post-2",
    authorName: "Elena Rostova, M.Sc.",
    authorTitle: "Senior Geotechnical Structural Engineer",
    authorProfession: "ENGINEERING",
    authorAvatar: "👩‍💼",
    isVerifiedKYC: true,
    timeAgo: "35m ago",
    content: "Santos Basin pre-salt offshore platform foundation stress analysis complete using the Nur Engineering module. Steel rebar prices down 3.2% in Rotterdam.",
    sentiment: "BULLISH",
    targetAsset: "BRENT & RIO",
    likes: 38,
    commentsCount: 14,
  },
  {
    id: "post-3",
    authorName: "Marcus Vance, Esq.",
    authorTitle: "Cross-Border Sovereign M&A Counsel",
    authorProfession: "LEGAL",
    authorAvatar: "👨‍⚖️",
    isVerifiedKYC: true,
    timeAgo: "1h ago",
    content: "New EU AI Act Article 5 compliance diff published. All decentralized compute clusters with non-custodial cryptographic audit trails remain 100% compliant.",
    sentiment: "COMPUTE_ALPHA",
    targetAsset: "$NUR Token & DePIN",
    likes: 55,
    commentsCount: 18,
  },
];

export default function FinancialSocialPanel() {
  const { openFloatingWindow, popoutToNativeWindow } = useIDEStore();

  const [activeFeedFilter, setActiveFeedFilter] = useState<string>("ALL");
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState("");
  const [newPostSentiment, setNewPostSentiment] = useState<"BULLISH" | "BEARISH" | "NEUTRAL" | "COMPUTE_ALPHA">("BULLISH");
  const [newPostAsset, setNewPostAsset] = useState("BTC / ETH / NUR");

  // Profile & KYC State
  const [userGender, setUserGender] = useState<"MALE" | "FEMALE" | "INSTITUTION">("MALE");
  const [fullName, setFullName] = useState("Alexandre De Montfort");
  const [professionTitle, setProfessionTitle] = useState("Senior Clinical Neurosurgeon & Private Capital LP");
  const [professionCategory, setProfessionCategory] = useState<"MEDICAL" | "ENGINEERING" | "EDUCATION" | "LEGAL" | "QUANT_FINANCE">("MEDICAL");
  const [nationalIdHash, setNationalIdHash] = useState("ID-TR-8492048194-VERIFIED");
  const [ibanNumber, setIbanNumber] = useState("DE89 3704 0044 0532 0130 00");
  const [kycVerified, setKycVerified] = useState(true);
  const [isSpeakingConcierge, setIsSpeakingConcierge] = useState(false);

  // Presentable AI Concierge persona matching user's opposite gender
  const conciergePersona = useMemo(() => {
    if (userGender === "MALE") {
      return {
        name: "Elena Vance",
        title: "Executive Sovereign Private Banker & AI Strategist",
        avatar: "👩‍💼",
        greeting: `Welcome, ${fullName}. Your sovereign non-custodial wallet and clinical AI compute node are actively linked. How may I assist your portfolio today?`,
      };
    } else {
      return {
        name: "Marcus Sterling",
        title: "Chief Quantitative Director & Institutional Concierge",
        avatar: "👨‍💼",
        greeting: `A pleasure to assist you, ${fullName}. All medical and engineering compute yields are accruing in real time to your verified IBAN settlement ledger.`,
      };
    }
  }, [userGender, fullName]);

  const handleSpeakConcierge = () => {
    if (isSpeakingConcierge) {
      hdVoiceEngine.stop();
      setIsSpeakingConcierge(false);
      return;
    }
    hdVoiceEngine.speak(
      conciergePersona.greeting,
      "en-US",
      () => setIsSpeakingConcierge(true),
      () => setIsSpeakingConcierge(false),
      () => setIsSpeakingConcierge(false)
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorName: fullName,
      authorTitle: professionTitle,
      authorProfession: professionCategory,
      authorAvatar: userGender === "MALE" ? "👨‍💼" : "👩‍💼",
      isVerifiedKYC: kycVerified,
      timeAgo: "Just now",
      content: newPostText.trim(),
      sentiment: newPostSentiment,
      targetAsset: newPostAsset.trim() || "GLOBAL_MACRO",
      likes: 1,
      commentsCount: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  const filteredPosts = useMemo(() => {
    if (activeFeedFilter === "ALL") return posts;
    return posts.filter((p) => p.authorProfession === activeFeedFilter);
  }, [activeFeedFilter, posts]);

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold font-mono border border-purple-500/40">
                CLOSED-LOOP FINANCIAL NETWORK
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono border border-emerald-500/40">
                BANK-GRADE KYC COMPLIANT
              </span>
            </div>
            <h1 className="text-sm font-bold text-white font-serif tracking-wide mt-0.5">
              NUR Sovereign Social • Professional Financial Community
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => openFloatingWindow("professional-social", "👥 NUR Sovereign Social Network")}
            className="px-2 py-1.5 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
            title="Open in floating window"
          >
            ⤢ FLOAT
          </button>
          <button
            onClick={() => popoutToNativeWindow("professional-social")}
            className="px-2 py-1.5 rounded bg-black/50 border border-white/10 text-slate-300 hover:text-white text-xs font-bold"
            title="Pop out to separate window"
          >
            ↗ DUAL-SCREEN
          </button>
        </div>
      </div>

      {/* ── PRESENTABLE OPPOSITE-GENDER AI CONCIERGE WELCOME BANNER ──────── */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-[#0a1830] to-slate-950 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-amber-400 p-0.5 shadow-lg flex items-center justify-center text-2xl">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {conciergePersona.avatar}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-serif">{conciergePersona.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                {conciergePersona.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              &ldquo;{conciergePersona.greeting}&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Gender Selector Toggle */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
            <span className="text-slate-400 px-1">GENDER:</span>
            {(["MALE", "FEMALE"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setUserGender(g)}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  userGender === g ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            onClick={handleSpeakConcierge}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs font-mono transition-all border flex items-center gap-1.5 ${
              isSpeakingConcierge
                ? "bg-red-600 text-white border-red-500 animate-pulse"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
            }`}
          >
            <span>{isSpeakingConcierge ? "⏹️ STOP" : "🔊 CONCIERGE VOICE"}</span>
          </button>
        </div>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT: SOCIAL FEED & KYC DOSSIER ──────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* LEFT COLUMN: SOCIAL FEED & POST CREATOR (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col gap-3 overflow-hidden">
          {/* Post Creator Box */}
          <form onSubmit={handleCreatePost} className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-3.5 space-y-2.5 shadow-xl shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span>✍️ SHARE VERIFIED PROFESSIONAL ALPHA & RESEARCH</span>
              </span>
              <span className="text-[10px] text-cyan-300 font-mono">ID: {fullName}</span>
            </div>

            <textarea
              rows={2}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Share market intelligence, clinical study findings, or engineering cost metrics..."
              className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={newPostSentiment}
                  onChange={(e) => setNewPostSentiment(e.target.value as any)}
                  className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-bold text-slate-200 outline-none"
                >
                  <option value="BULLISH">🟢 BULLISH</option>
                  <option value="BEARISH">🔴 BEARISH</option>
                  <option value="COMPUTE_ALPHA">⚡ COMPUTE ALPHA</option>
                  <option value="NEUTRAL">⚪ NEUTRAL</option>
                </select>

                <input
                  type="text"
                  value={newPostAsset}
                  onChange={(e) => setNewPostAsset(e.target.value)}
                  placeholder="Asset (e.g. XBI, BRENT)"
                  className="p-1.5 rounded-lg bg-black/60 border border-white/10 text-[10px] font-mono text-cyan-300 w-32 outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs transition-all shadow-md"
              >
                PUBLISH ALPHA ➔
              </button>
            </div>
          </form>

          {/* Profession Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px] font-mono">
            {[
              { id: "ALL", label: "ALL ALPHA" },
              { id: "MEDICAL", label: "🩺 BIOTECH & HEALTH" },
              { id: "ENGINEERING", label: "🏗️ CIVIL & INFRA" },
              { id: "LEGAL", label: "⚖️ LEGAL & M&A" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFeedFilter(f.id)}
                className={`px-3 py-1 rounded-lg font-bold border transition-all ${
                  activeFeedFilter === f.id
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                    : "bg-black/40 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Feed Posts List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredPosts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 space-y-2.5 shadow-lg hover:border-cyan-500/40 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-lg">
                      {post.authorAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{post.authorName}</span>
                        {post.isVerifiedKYC && (
                          <span className="text-[8px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            ✓ VERIFIED PRO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{post.authorTitle}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{post.timeAgo}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 font-bold">
                      {post.targetAsset}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        post.sentiment === "BULLISH"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : post.sentiment === "BEARISH"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      {post.sentiment}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentsCount} comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL BANK-GRADE KYC & CV DOSSIER (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-y-auto">
          {/* KYC Identity Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/90 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-300">🏛️ INSTITUTIONAL KYC IDENTITY & IBAN CASHOUT</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                TIER 2 VERIFIED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">LEGAL FULL NAME:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">PROFESSIONAL TITLE & ROLE:</label>
                <input
                  type="text"
                  value={professionTitle}
                  onChange={(e) => setProfessionTitle(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">NATIONAL ID / PASSPORT HASH:</label>
                  <input
                    type="text"
                    value={nationalIdHash}
                    onChange={(e) => setNationalIdHash(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">SETTLEMENT IBAN (SEPA/SWIFT):</label>
                  <input
                    type="text"
                    value={ibanNumber}
                    onChange={(e) => setIbanNumber(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-[10px] text-slate-300 space-y-1">
                <div className="text-emerald-400 font-bold">AUTOMATIC FIAT CASHOUT PROTOCOL:</div>
                <div>
                  Earned $NUR compute tokens are convertible 1:1 to EUR/USD and direct-deposited to your linked IBAN on the 1st and 15th of each calendar month.
                </div>
              </div>
            </div>
          </div>

          {/* P2P Compute Cluster Syndicates */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
              <span className="text-xs font-bold text-cyan-300">⚡ PEER-TO-PEER COMPUTE POOL SYNDICATES</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                142 ACTIVE NODES
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Biotech Oncology Compute Syndicate</div>
                  <div className="text-[10px] text-slate-400">18 Doctors & Researchers pooling 420 TFLOPs</div>
                </div>
                <button className="px-2.5 py-1 rounded-lg bg-cyan-500 text-black font-bold text-[10px]">
                  JOIN POOL
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">Civil Infra Seismic Modeling Pool</div>
                  <div className="text-[10px] text-slate-400">34 Civil Engineers pooling 680 TFLOPs</div>
                </div>
                <button className="px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-[10px]">
                  JOIN POOL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
