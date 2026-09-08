"use client";

import { useState, useEffect, useRef } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { generateBase32Secret, generateOtpAuthUri, verifyTOTP } from "@/lib/security/totp";
import { sha256Hex } from "@/lib/security/hash";

interface MiningBot {
  id: string;
  name: string;
  algorithm: "SHA-256 (BTC)" | "NurPoY (Yield)" | "RandomX" | "Ethash";
  hashrate: string;
  powerCost: string;
  dailyYieldNUR: number;
  appArmorStatus: "ENFORCING" | "SANDBOXED";
  status: "ACTIVE" | "PAUSED";
}

const NETWORK_FEE_RATE = 0.0025; // 0.25% disclosed network fee — always shown to the user before they confirm a swap
const NUR_CARD_ELIGIBILITY_THRESHOLD = 5000; // disclosed, transparent balance threshold — shown to the user as a progress bar below it
const STAKING_APY = 5;
const STAKING_LOCK_DAYS = 30;

interface StakingPool {
  id: "flexible" | "short" | "medium" | "long";
  label: string;
  apy: number;
  lockDays: number;
}

const STAKING_POOLS: StakingPool[] = [
  { id: "flexible", label: "Esnek (Kilitsiz)", apy: 1.5, lockDays: 0 },
  { id: "short", label: "30 Gün", apy: 5, lockDays: 30 },
  { id: "medium", label: "90 Gün", apy: 8, lockDays: 90 },
  { id: "long", label: "180 Gün", apy: 12, lockDays: 180 },
];

interface StakePosition {
  id: string;
  poolId: StakingPool["id"];
  amountNUR: number;
  apy: number;
  lockDays: number;
  startedAt: number;
  maturesAt: number;
}

interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  votesForNUR: number;
  votesAgainstNUR: number;
}

type ActivityType = "SWAP" | "CARD_SPEND" | "STAKE_OPEN" | "STAKE_CLAIM" | "WITHDRAW_QUICK" | "WITHDRAW_FLEX" | "DAO_VOTE" | "COMPUTE_SHARE";

interface ActivityLogEntry {
  id: string;
  timestamp: number;
  type: ActivityType;
  description: string;
  amountNUR: number; // signed: positive = credited, negative = debited, 0 = non-monetary (e.g. a vote)
  prevHash: string;
  hash: string;
}

const INITIAL_PROPOSALS: GovernanceProposal[] = [
  {
    id: "prop-1",
    title: "Buyback & Burn oranı %50'den %60'a çıkarılsın mı?",
    description: "Madencilik ve komisyon kârlarından $NUR geri alımına ayrılan payın artırılması.",
    votesForNUR: 412000,
    votesAgainstNUR: 88000,
  },
  {
    id: "prop-2",
    title: "365 günlük yeni bir staking havuzu (%18 APY) eklensin mi?",
    description: "Uzun vadeli kilitleme karşılığında daha yüksek sabit getiri sunan yeni bir opsiyonel havuz.",
    votesForNUR: 265000,
    votesAgainstNUR: 190000,
  },
  {
    id: "prop-3",
    title: "Nur Unix işlemci paylaşımı komisyonu %25'te sabitlensin mi?",
    description: "Şirket komisyon oranının değişken yerine sabit ve önceden ilan edilmiş olması.",
    votesForNUR: 501000,
    votesAgainstNUR: 34000,
  },
];

interface CardSpendLogEntry {
  id: string;
  merchant: string;
  amountFiat: number;
  amountNUR: number;
  feeNUR: number;
  timestamp: string;
}

const DEMO_MERCHANTS = [
  { name: "Aldi Süd (Market)", amountEur: 42.5 },
  { name: "Deutsche Bahn (Ulaşım)", amountEur: 89.0 },
  { name: "Apple Store Online", amountEur: 249.0 },
];

const INITIAL_MINING_BOTS: MiningBot[] = [
  {
    id: "bot-1",
    name: "NUR Sovereign Hashrate Bot Alpha",
    algorithm: "NurPoY (Yield)",
    hashrate: "142.5 TH/s",
    powerCost: "$0.028 / kWh",
    dailyYieldNUR: 840,
    appArmorStatus: "ENFORCING",
    status: "ACTIVE",
  },
  {
    id: "bot-2",
    name: "Bitcoin Cloud Mining Node Frankfurt",
    algorithm: "SHA-256 (BTC)",
    hashrate: "88.0 TH/s",
    powerCost: "$0.031 / kWh",
    dailyYieldNUR: 520,
    appArmorStatus: "ENFORCING",
    status: "ACTIVE",
  },
  {
    id: "bot-3",
    name: "Cross-Chain Arbitrage Mining Pool",
    algorithm: "RandomX",
    hashrate: "45.2 KH/s",
    powerCost: "$0.025 / kWh",
    dailyYieldNUR: 310,
    appArmorStatus: "SANDBOXED",
    status: "PAUSED",
  },
];

export default function NurCoinEcosystemPanel() {
  const { addNotification, updateVerification } = useIDEStore();

  const [swapFromCurrency, setSwapFromCurrency] = useState<"USDT" | "USDC" | "BTC" | "ETH">("USDT");
  const [swapFromAmount, setSwapFromAmount] = useState("100000");
  const [isSwapping, setIsSwapping] = useState(false);
  const [userNURBalance, setUserNURBalance] = useState(125000);
  const [miningBots, setMiningBots] = useState<MiningBot[]>(INITIAL_MINING_BOTS);
  const [activeTab, setActiveTab] = useState<
    "swap" | "mining" | "rewards" | "card" | "staking" | "governance" | "security" | "history" | "tokenomics" | "subchain"
  >("swap");
  const [newBotName, setNewBotName] = useState("");
  const [newBotAlgorithm, setNewBotAlgorithm] = useState<MiningBot["algorithm"]>("NurPoY (Yield)");

  // Nur Card — tiered eligibility, transparent JIT (Just-In-Time) fiat funding, and an
  // honest opt-in staking offer at withdrawal that never blocks or delays the plain withdrawal.
  const [nurCardApplied, setNurCardApplied] = useState(false);
  const [cardSpendLog, setCardSpendLog] = useState<CardSpendLogEntry[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState("1000");
  const [pendingWithdrawAmount, setPendingWithdrawAmount] = useState<number | null>(null);
  const [stakingPositions, setStakingPositions] = useState<StakePosition[]>([]);
  const [stakeAmountInput, setStakeAmountInput] = useState("1000");
  const [selectedPoolId, setSelectedPoolId] = useState<StakingPool["id"]>("short");

  // DAO Governance — voting power is transparently 1 $NUR (held or staked) = 1 vote, disclosed
  // as such. Demo-scope: votes are session-local, not an on-chain-deployed contract.
  const [proposals, setProposals] = useState<GovernanceProposal[]>(INITIAL_PROPOSALS);
  const [votedProposalIds, setVotedProposalIds] = useState<Set<string>>(new Set());

  // Transaction Audit Trail — a real client-side SHA-256 hash chain (each entry's hash
  // covers its own data plus the previous entry's hash), computed via Web Crypto. This is
  // honestly scoped: it detects in-session tampering with the log's own React state, it is
  // NOT a blockchain and doesn't survive a reload — no claim of external/server immutability.
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const activityChainRef = useRef<Promise<string>>(Promise.resolve("GENESIS"));

  const logActivity = (type: ActivityType, description: string, amountNUR: number) => {
    activityChainRef.current = activityChainRef.current.then(async (prevHash) => {
      const timestamp = Date.now();
      const hash = await sha256Hex(JSON.stringify({ type, description, amountNUR, timestamp, prevHash }));
      setActivityLog((prev) => [
        { id: `log-${timestamp}-${Math.random().toString(36).slice(2, 8)}`, timestamp, type, description, amountNUR, prevHash, hash },
        ...prev,
      ]);
      return hash;
    });
  };

  const [chainVerifyResult, setChainVerifyResult] = useState<"idle" | "valid" | "invalid">("idle");
  const handleVerifyChain = async () => {
    cyberSound.playClick();
    const chronological = [...activityLog].reverse();
    let expectedPrev = "GENESIS";
    for (const entry of chronological) {
      const recomputed = await sha256Hex(
        JSON.stringify({ type: entry.type, description: entry.description, amountNUR: entry.amountNUR, timestamp: entry.timestamp, prevHash: expectedPrev })
      );
      if (recomputed !== entry.hash || entry.prevHash !== expectedPrev) {
        setChainVerifyResult("invalid");
        return;
      }
      expectedPrev = entry.hash;
    }
    setChainVerifyResult("valid");
  };

  const handleExportCSV = () => {
    const header = "Zaman,Tur,Aciklama,Tutar($NUR),Onceki_Hash,Hash";
    const rows = activityLog.map((e) =>
      [new Date(e.timestamp).toISOString(), e.type, `"${e.description.replace(/"/g, '""')}"`, e.amountNUR.toFixed(2), e.prevHash, e.hash].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nur-finance-islem-gecmisi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    const lines = activityLog.map(
      (e) =>
        `[${new Date(e.timestamp).toLocaleString()}] ${e.type} — ${e.description} — ${e.amountNUR >= 0 ? "+" : ""}${e.amountNUR.toFixed(2)} $NUR\n  hash: ${e.hash}\n  prev: ${e.prevHash}`
    );
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nur-finance-islem-gecmisi-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Two-Factor Authentication — a real RFC 6238 TOTP implementation (works with any
  // standard authenticator app), not a mock. Gates funds actually leaving the ecosystem
  // (quick withdrawal, flexible-pool withdrawal); staking stays internal so isn't gated.
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [setupInProgress, setSetupInProgress] = useState(false);
  const [setupCodeInput, setSetupCodeInput] = useState("");
  const [setupError, setSetupError] = useState("");
  const [pendingSecureAction, setPendingSecureAction] = useState<"quick" | "flexible" | null>(null);
  const [secureCodeInput, setSecureCodeInput] = useState("");
  const [secureError, setSecureError] = useState("");

  const handleStartTwoFactorSetup = () => {
    cyberSound.playClick();
    setTwoFactorSecret(generateBase32Secret());
    setSetupInProgress(true);
    setSetupError("");
  };

  const handleConfirmTwoFactorSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorSecret) return;
    const valid = await verifyTOTP(twoFactorSecret, setupCodeInput);
    if (!valid) {
      setSetupError("Kod doğrulanamadı. Authenticator uygulamanızdaki güncel 6 haneli kodu girin.");
      return;
    }
    cyberSound.playQuantumUnlock();
    setTwoFactorEnabled(true);
    setSetupInProgress(false);
    setSetupCodeInput("");
    setSetupError("");
    addNotification({
      title: "🔐 İki Faktörlü Doğrulama Etkinleştirildi",
      message: "Harici cüzdana çekim işlemleri artık authenticator uygulamanızdaki kod ile onaylanacak.",
      severity: "SUCCESS",
      category: "SYSTEM",
    });
  };

  const handleDisableTwoFactor = () => {
    cyberSound.playClick();
    setTwoFactorEnabled(false);
    setTwoFactorSecret(null);
    setSetupInProgress(false);
    addNotification({
      title: "🔓 İki Faktörlü Doğrulama Kapatıldı",
      message: "Çekim işlemleri artık 2FA kodu istemeyecek.",
      severity: "WARNING",
      category: "SYSTEM",
    });
  };

  const requestSecureWithdraw = (type: "quick" | "flexible") => {
    if (!twoFactorEnabled) {
      if (type === "quick") handleConfirmWithdraw();
      else handleFlexibleWithdraw();
      return;
    }
    setPendingSecureAction(type);
    setSecureCodeInput("");
    setSecureError("");
  };

  const handleConfirmSecureAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorSecret || !pendingSecureAction) return;
    const valid = await verifyTOTP(twoFactorSecret, secureCodeInput);
    if (!valid) {
      setSecureError("Kod hatalı veya süresi doldu. Authenticator uygulamanızdaki güncel kodu deneyin.");
      return;
    }
    if (pendingSecureAction === "quick") handleConfirmWithdraw();
    else handleFlexibleWithdraw();
    setPendingSecureAction(null);
    setSecureCodeInput("");
  };
  const [scheduledWithdrawals, setScheduledWithdrawals] = useState<
    { id: string; amountNUR: number; bonusNUR: number; completesAt: number }[]
  >([]);

  const nurCardEligible = userNURBalance >= NUR_CARD_ELIGIBILITY_THRESHOLD;

  const handleApplyNurCard = () => {
    cyberSound.playClick();
    setNurCardApplied(true);
    addNotification({
      title: "💳 Nur Card Başvurunuz Alındı",
      message: `Bakiye eşiği (${NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR) karşılandı. Bu, uygulamada çalışan bir demodur — gerçek fiziksel/sanal kart basımı lisanslı bir BaaS ortaklığı gerektirir ve henüz yayında değildir.`,
      severity: "INFO",
      category: "SYSTEM",
    });
  };

  const handleCardSpend = (merchant: string, amountEur: number) => {
    const feeNUR = amountEur * NETWORK_FEE_RATE;
    const amountNUR = amountEur + feeNUR;
    if (amountNUR > userNURBalance) {
      addNotification({
        title: "Harcama Reddedildi",
        message: `Yetersiz bakiye. Bu işlem için ${amountNUR.toFixed(2)} $NUR gerekiyor.`,
        severity: "CRITICAL",
        category: "SETTLEMENT",
      });
      return;
    }

    cyberSound.playClick();
    setUserNURBalance((prev) => prev - amountNUR);
    setCardSpendLog((prev) => [
      { id: `spend-${Date.now()}`, merchant, amountFiat: amountEur, amountNUR, feeNUR, timestamp: new Date().toLocaleTimeString() },
      ...prev,
    ]);
    logActivity("CARD_SPEND", `Nur Card: ${merchant}`, -amountNUR);
    addNotification({
      title: "💳 Nur Card Harcaması Onaylandı (JIT Fonlama)",
      message: `${merchant}: ${amountNUR.toFixed(2)} $NUR anında €${amountEur.toFixed(2)}'ya çevrildi (${feeNUR.toFixed(2)} $NUR ağ ücreti dahil, işlem öncesi bildirildi).`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const handleRequestWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > userNURBalance) return;
    cyberSound.playClick();
    setPendingWithdrawAmount(amount);
  };

  const handleConfirmWithdraw = () => {
    if (pendingWithdrawAmount === null) return;
    cyberSound.playClick();
    const feeNUR = pendingWithdrawAmount * NETWORK_FEE_RATE;
    const netOut = pendingWithdrawAmount - feeNUR;
    setUserNURBalance((prev) => prev - pendingWithdrawAmount);
    logActivity("WITHDRAW_QUICK", "Hızlı Çekim (harici cüzdan)", -pendingWithdrawAmount);
    addNotification({
      title: "✅ Hızlı Çekim Tamamlandı",
      message: `${netOut.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR harici cüzdanınıza gönderildi (standart %${(NETWORK_FEE_RATE * 100).toFixed(2)} ağ ücreti: ${feeNUR.toFixed(2)} $NUR, işlem öncesi bildirildi). Gecikme veya ek onay uygulanmadı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
    setPendingWithdrawAmount(null);
  };

  const handleFlexibleWithdraw = () => {
    if (pendingWithdrawAmount === null) return;
    cyberSound.playClick();
    const bonusNUR = pendingWithdrawAmount * 0.02;
    setUserNURBalance((prev) => prev - pendingWithdrawAmount);
    setScheduledWithdrawals((prev) => [
      { id: `flex-${Date.now()}`, amountNUR: pendingWithdrawAmount, bonusNUR, completesAt: Date.now() + 24 * 60 * 60 * 1000 },
      ...prev,
    ]);
    logActivity("WITHDRAW_FLEX", "Esnek Havuz Çekimi (24 saat, +%2 bonus)", -pendingWithdrawAmount);
    addNotification({
      title: "🕒 Esnek Havuza Alındı",
      message: `${pendingWithdrawAmount.toLocaleString()} $NUR ücretsiz çekim kuyruğuna alındı. 24 saat sonra +${bonusNUR.toFixed(2)} $NUR bonusla birlikte harici cüzdanınıza gönderilecek, ağ ücreti alınmayacak.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
    setPendingWithdrawAmount(null);
  };

  const openStakePosition = (poolId: StakingPool["id"], amount: number) => {
    const pool = STAKING_POOLS.find((p) => p.id === poolId)!;
    setStakingPositions((prev) => [
      {
        id: `stake-${Date.now()}`,
        poolId: pool.id,
        amountNUR: amount,
        apy: pool.apy,
        lockDays: pool.lockDays,
        startedAt: Date.now(),
        maturesAt: Date.now() + pool.lockDays * 24 * 60 * 60 * 1000,
      },
      ...prev,
    ]);
  };

  const handleStakeInstead = () => {
    if (pendingWithdrawAmount === null) return;
    cyberSound.playClick();
    setUserNURBalance((prev) => prev - pendingWithdrawAmount);
    openStakePosition("short", pendingWithdrawAmount);
    addNotification({
      title: "🔒 Staking Havuzuna Aktarıldı",
      message: `${pendingWithdrawAmount.toLocaleString()} $NUR, %${STAKING_APY} APY ile ${STAKING_LOCK_DAYS} günlük staking havuzuna aktarıldı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
    setPendingWithdrawAmount(null);
  };

  const accruedYield = (pos: StakePosition, now: number) => {
    // Yield keeps accruing until the position is claimed, not just until maturity.
    const elapsedYears = (now - pos.startedAt) / (365 * 24 * 60 * 60 * 1000);
    return pos.amountNUR * (pos.apy / 100) * elapsedYears;
  };

  // Drives the live yield/maturity display each second while positions are open.
  // Stored as state (set inside the effect) rather than read via Date.now() during
  // render, which keeps rendering pure.
  const [stakingNowTick, setStakingNowTick] = useState(() => Date.now());
  useEffect(() => {
    if (stakingPositions.length === 0) return;
    const interval = setInterval(() => setStakingNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [stakingPositions.length]);

  const handleCreateStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeAmountInput);
    if (isNaN(amount) || amount <= 0 || amount > userNURBalance) return;
    cyberSound.playClick();
    setUserNURBalance((prev) => prev - amount);
    openStakePosition(selectedPoolId, amount);
    const pool = STAKING_POOLS.find((p) => p.id === selectedPoolId)!;
    logActivity("STAKE_OPEN", `Staking Açıldı: ${pool.label} (%${pool.apy} APY)`, -amount);
    addNotification({
      title: "🔒 Staking Pozisyonu Açıldı",
      message: `${amount.toLocaleString()} $NUR, "${pool.label}" havuzuna %${pool.apy} APY ile kilitlendi.${pool.lockDays > 0 ? ` ${pool.lockDays} gün önce erken çıkarsanız yalnızca o ana kadarki getiriyi kaybedersiniz — anaparanız her zaman güvendedir.` : " Kilit yok, istediğiniz an talep edebilirsiniz."}`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const totalStakedNUR = stakingPositions.reduce((sum, p) => sum + p.amountNUR, 0);
  const votingPower = userNURBalance + totalStakedNUR;

  const handleCastVote = (proposalId: string, support: boolean) => {
    if (votedProposalIds.has(proposalId) || votingPower <= 0) return;
    cyberSound.playClick();
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? support
            ? { ...p, votesForNUR: p.votesForNUR + votingPower }
            : { ...p, votesAgainstNUR: p.votesAgainstNUR + votingPower }
          : p
      )
    );
    setVotedProposalIds((prev) => new Set(prev).add(proposalId));
    logActivity("DAO_VOTE", `Oy: "${proposals.find((p) => p.id === proposalId)?.title ?? proposalId}" — ${support ? "EVET" : "HAYIR"}`, 0);
    addNotification({
      title: "🗳️ Oy Kaydedildi",
      message: `${votingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR oy gücüyle "${support ? "EVET" : "HAYIR"}" oyu kullandınız (1 $NUR = 1 oy, bakiye + staking dahil).`,
      severity: "SUCCESS",
      category: "SYSTEM",
    });
  };

  const handleClaimStake = (id: string) => {
    const pos = stakingPositions.find((p) => p.id === id);
    if (!pos) return;
    const now = Date.now();
    const matured = now >= pos.maturesAt;
    const yieldEarned = accruedYield(pos, now);
    const payout = pos.amountNUR + yieldEarned;

    cyberSound.playClick();
    setUserNURBalance((prev) => prev + payout);
    setStakingPositions((prev) => prev.filter((p) => p.id !== id));
    logActivity("STAKE_CLAIM", matured ? "Staking Talep Edildi (vade doldu)" : "Staking Erken Çıkış", payout);
    addNotification({
      title: matured ? "✅ Staking Vadesi Doldu" : "⚠️ Erken Çıkış",
      message: matured
        ? `${pos.amountNUR.toLocaleString()} $NUR anapara + ${yieldEarned.toFixed(2)} $NUR getiri cüzdanınıza aktarıldı.`
        : `Erken çıkış: ${pos.amountNUR.toLocaleString()} $NUR anapara + o ana kadarki ${yieldEarned.toFixed(2)} $NUR getiri iade edildi. Anaparanızdan hiçbir kesinti yapılmadı.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // Opt-in, disclosed compute-sharing (Render Network / Grass model) — off by default,
  // user picks the share %. This is a browser-tab simulation: a web page has no API to read
  // real CPU/GPU load or true OS-wide idle state, so we never claim otherwise. "Idle" here
  // honestly means "no mouse/keyboard/scroll activity in this tab," which we detect for real.
  const [computeSharingEnabled, setComputeSharingEnabled] = useState(false);
  const [computeSharePercent, setComputeSharePercent] = useState(20);
  const [computeSessionEarnedNUR, setComputeSessionEarnedNUR] = useState(0);
  const [riskProfile, setRiskProfile] = useState<"guaranteed" | "dynamic">("guaranteed");
  const [idleOnly, setIdleOnly] = useState(true);
  const [isTabIdle, setIsTabIdle] = useState(false);
  const [lastDynamicRate, setLastDynamicRate] = useState(0);
  const [hashRateScore] = useState(() => Math.floor(600 + Math.random() * 900));

  // Real (browser-tab-scoped) input-activity idle detection — not real OS/hardware idle.
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    const IDLE_AFTER_MS = 20000;

    const markActive = () => {
      setIsTabIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => setIsTabIdle(true), IDLE_AFTER_MS);
    };

    markActive();
    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("scroll", markActive);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("scroll", markActive);
    };
  }, []);

  useEffect(() => {
    if (!computeSharingEnabled) return;
    if (idleOnly && !isTabIdle) return;

    const interval = setInterval(() => {
      if (riskProfile === "guaranteed") {
        setComputeSessionEarnedNUR((prev) => prev + computeSharePercent * 0.018);
      } else {
        const rate = computeSharePercent * (hashRateScore / 1000) * (0.01 + Math.random() * 0.025);
        setLastDynamicRate(rate);
        setComputeSessionEarnedNUR((prev) => prev + rate);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [computeSharingEnabled, computeSharePercent, idleOnly, isTabIdle, riskProfile, hashRateScore]);

  const grossAmount = parseFloat(swapFromAmount || "0");
  const grossNUR =
    swapFromCurrency === "BTC" ? grossAmount * 67420 : swapFromCurrency === "ETH" ? grossAmount * 3480 : grossAmount;
  const networkFeeNUR = grossNUR * NETWORK_FEE_RATE;
  const netNUR = grossNUR - networkFeeNUR;
  const calculatedNUR = netNUR.toLocaleString(undefined, { maximumFractionDigits: 2 });

  const handleInstantSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(swapFromAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    cyberSound.playClick();
    setIsSwapping(true);

    setTimeout(() => {
      setIsSwapping(false);
      setUserNURBalance((prev) => prev + netNUR);
      cyberSound.playQuantumUnlock();
      logActivity("SWAP", `1-Click Swap: ${amountNum} ${swapFromCurrency} → $NUR`, netNUR);

      addNotification({
        title: "⚡ $NUR Coin Swap Başarılı",
        message: `${amountNum} ${swapFromCurrency} karşılığında ${netNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR basıldı (${networkFeeNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR — %${(NETWORK_FEE_RATE * 100).toFixed(2)} ağ ücreti düşüldükten sonra) ve cüzdanınıza aktarıldı.`,
        severity: "SUCCESS",
        category: "SETTLEMENT",
      });
    }, 1000);
  };

  const toggleComputeSharing = () => {
    cyberSound.playClick();
    setComputeSharingEnabled((prev) => {
      const next = !prev;
      addNotification({
        title: next ? "⚙️ Nur Unix Optimizasyonu Etkinleştirildi" : "⏸️ Nur Unix Optimizasyonu Durduruldu",
        message: next
          ? `Bu bir tarayıcı-içi demodur (gerçek CPU/GPU paylaşımı masaüstü istemcisi gerektirir, henüz yayında değil). %${computeSharePercent} paylaşım oranı ve "${riskProfile === "guaranteed" ? "Garanti Getirili" : "Dinamik Arbitraj"}" havuzu seçildi. İstediğiniz an durdurabilirsiniz.`
          : "Optimizasyon durduruldu. Bu oturumda kazanılan $NUR bakiyenize eklendi.",
        severity: "INFO",
        category: "SYSTEM",
      });
      if (!next) {
        setUserNURBalance((b) => b + computeSessionEarnedNUR);
        logActivity("COMPUTE_SHARE", "Nur Unix Optimizasyonu Durduruldu — oturum kazancı hesaba geçti", computeSessionEarnedNUR);
        setComputeSessionEarnedNUR(0);
      } else {
        logActivity("COMPUTE_SHARE", `Nur Unix Optimizasyonu Başlatıldı (%${computeSharePercent}, ${riskProfile === "guaranteed" ? "Garanti" : "Dinamik"})`, 0);
      }
      return next;
    });
  };

  const handleDeployMiningBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBotName.trim()) return;

    cyberSound.playClick();
    const newBot: MiningBot = {
      id: `bot-${Date.now()}`,
      name: newBotName.trim(),
      algorithm: newBotAlgorithm,
      hashrate: "95.0 TH/s",
      powerCost: "$0.029 / kWh",
      dailyYieldNUR: 560,
      appArmorStatus: "ENFORCING",
      status: "ACTIVE",
    };

    setMiningBots([newBot, ...miningBots]);
    setNewBotName("");

    addNotification({
      title: "⛏️ Yeni Madencilik Botu Başlatıldı",
      message: `AppArmor korumalı sandbox içinde ${newBot.name} çalışmaya başladı. Günlük gelir Nur Finans hazinesiyle senkronize edildi.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const toggleBotStatus = (id: string) => {
    cyberSound.playClick();
    setMiningBots(
      miningBots.map((b) =>
        b.id === id ? { ...b, status: b.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : b
      )
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">NUR FINANCE COIN ($NUR) & SOVEREIGN SUB-CHAIN</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                1 $NUR = 1.00 USD (TREASURY BACKED)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Kendi Rezerv Kripto Para Birimimiz &bull; Otomatik Likidite Swap &bull; AppArmor Madencilik (Mining) Hub
            </p>
          </div>
        </div>

        {/* User $NUR Vault Balance */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/40 text-right">
            <div className="text-[9px] text-slate-400 font-mono uppercase">Cüzdanınızdaki $NUR Bakiyesi</div>
            <div className="text-sm font-bold font-mono text-cyan-300">
              {userNURBalance.toLocaleString()} $NUR
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(
              [
                { id: "swap" as const, label: "🔄 1-Click Swap ($NUR)" },
                { id: "mining" as const, label: "⛏️ Madencilik & Botlar" },
                { id: "rewards" as const, label: "⚙️ Nur Unix / Optimizasyon" },
                { id: "card" as const, label: "💳 Nur Card" },
                { id: "staking" as const, label: "🔒 Staking & Getiri" },
                { id: "governance" as const, label: "🗳️ DAO Yönetişim" },
                { id: "security" as const, label: "🔐 Güvenlik & 2FA" },
                { id: "history" as const, label: "📋 İşlem Geçmişi" },
                { id: "subchain" as const, label: "⛓️ NUR Sub-Chain" },
                { id: "tokenomics" as const, label: "📊 Tokenomics & Kâr" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  cyberSound.playClick();
                  setActiveTab(t.id);
                }}
                className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                  activeTab === t.id
                    ? "bg-amber-500 text-black shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* SWAP TAB */}
        {activeTab === "swap" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Banner Overview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-black border border-amber-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-300 font-serif mb-1">
                  NUR Finance Temel Ödeme Protokolü
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Tüm terminal abonelikleri, VIP analiz kütüphaneleri ve ekosistem hizmetleri doğrudan <strong>$NUR Coin</strong> ile fiyatlandırılır. Müşteri USDT/BTC yatırdığında anında 1:1 oranında $NUR Coin’e çevrilir ve sisteme aktarılır.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-4 border-l border-white/10">
                <div className="text-[10px] text-slate-400">Peg Stabilitesi</div>
                <div className="text-base font-bold text-emerald-400">%100.0 (1 $NUR = $1.00)</div>
                <div className="text-[9px] text-slate-500">Hazine Teminatı: %108.4</div>
              </div>
            </div>

            {/* Proof-of-Reserves Transparency Block */}
            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20 flex items-center justify-between font-mono">
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">🔍 Rezerv Şeffaflığı (Proof-of-Reserves)</div>
                <p className="text-[10px] text-slate-400 max-w-md mt-0.5">
                  Basılan her $NUR'un karşılığı hazine kasasında bağımsız olarak izlenebilir tutulur — kesinti veya kur farkı gizlenmez.
                </p>
              </div>
              <div className="flex gap-4 text-right shrink-0">
                <div>
                  <div className="text-[9px] text-slate-500">Hazine Rezervi</div>
                  <div className="text-sm font-bold text-white">$108.4M</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">Dolaşımdaki $NUR</div>
                  <div className="text-sm font-bold text-white">100.0M</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">Teminat Oranı</div>
                  <div className="text-sm font-bold text-emerald-400">%108.4</div>
                </div>
              </div>
            </div>

            {/* Instant Swap Card */}
            <form onSubmit={handleInstantSwap} className="p-6 rounded-2xl border border-cyan-500/30 bg-black/60 space-y-5">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                1-Tıkla Anlık Fonlama & $NUR Coin Minting
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Input */}
                <div className="p-4 rounded-xl bg-black/70 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Yatırılacak Para Birimi</span>
                    <span>Bakiye: 250,000 USDT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={swapFromAmount}
                      onChange={(e) => setSwapFromAmount(e.target.value)}
                      className="w-full bg-transparent text-xl font-mono font-bold text-white focus:outline-none"
                      placeholder="0.00"
                    />
                    <select
                      value={swapFromCurrency}
                      onChange={(e) => setSwapFromCurrency(e.target.value as any)}
                      className="bg-slate-900 border border-white/20 text-xs font-mono text-cyan-300 p-2 rounded-lg focus:outline-none"
                    >
                      <option value="USDT">USDT (Tether)</option>
                      <option value="USDC">USDC (USD Coin)</option>
                      <option value="BTC">BTC (Bitcoin)</option>
                      <option value="ETH">ETH (Ethereum)</option>
                    </select>
                  </div>
                </div>

                {/* To Input (Calculated $NUR) */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex justify-between items-center text-xs text-amber-300">
                    <span>Alınacak Ekosistem Varlığı</span>
                    <span className="font-bold">1:1 Hazine Garantili</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-mono font-bold text-amber-300">
                      {calculatedNUR}
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs font-mono">
                      $NUR COIN
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono border-t border-white/10 pt-1.5">
                    Ağ Ücreti (%{(NETWORK_FEE_RATE * 100).toFixed(2)}, işlem öncesi bildirilir): −{networkFeeNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSwapping}
                className="w-full py-3.5 rounded-xl font-mono font-bold text-xs tracking-wider bg-gradient-to-r from-amber-500 via-teal-400 to-cyan-400 hover:from-amber-400 hover:to-cyan-300 text-black transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {isSwapping ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>HAZİNE LİKİDİTESİ KİLİTLENİYOR & $NUR BASILIYOR...</span>
                  </>
                ) : (
                  <span>⚡ ANINDA $NUR COIN'E ÇEVİR VE CÜZDANA AKTAR</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* MINING & BOTS TAB */}
        {activeTab === "mining" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-300 font-serif mb-1">
                  AppArmor İzolasyonlu Madencilik & Hashrate Bot Havuzu
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Bitcoin ve kripto yatırımcıları, Linux <strong>AppArmor</strong> güvenlik profilleri altında izole edilmiş bulut madencilik botlarını çalıştırabilir. Üretilen kârın %50'si madenciye ödenirken %50'si Nur Finans hisse geri alım hazinesine aktarılır.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-4 border-l border-white/10">
                <div className="text-[10px] text-slate-400">Toplam Ağ Gücü</div>
                <div className="text-base font-bold text-emerald-400">275.7 TH/s</div>
                <div className="text-[9px] text-emerald-300 font-bold">● AppArmor Korumalı</div>
              </div>
            </div>

            {/* Deploy New Bot Form */}
            <form onSubmit={handleDeployMiningBot} className="p-4 rounded-2xl border border-white/10 bg-black/40 flex items-center gap-3">
              <input
                type="text"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                placeholder="Yeni Madencilik Botu Adı (Örn: Node Zurich-1)"
                className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
              />
              <select
                value={newBotAlgorithm}
                onChange={(e) => setNewBotAlgorithm(e.target.value as any)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/20 text-xs font-mono text-emerald-300 focus:outline-none"
              >
                <option value="NurPoY (Yield)">NurPoY (Yield)</option>
                <option value="SHA-256 (BTC)">SHA-256 (BTC)</option>
                <option value="RandomX">RandomX</option>
                <option value="Ethash">Ethash</option>
              </select>
              <button
                type="submit"
                disabled={!newBotName.trim()}
                className="px-4 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono transition-colors disabled:opacity-40"
              >
                + BOTU ÇALIŞTIR
              </button>
            </form>

            {/* Active Bots List */}
            <div className="space-y-3">
              {miningBots.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-white/10 bg-black/50 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{b.name}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {b.algorithm}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        🛡️ AppArmor: {b.appArmorStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Hashrate: <strong className="text-white">{b.hashrate}</strong> &bull; Elektrik Maliyeti: <strong className="text-slate-300">{b.powerCost}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold text-amber-300 font-mono">
                        +{b.dailyYieldNUR} $NUR / Gün
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        (%50 Hazineye Geri Alım Payı)
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBotStatus(b.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                        b.status === "ACTIVE"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                      }`}
                    >
                      {b.status === "ACTIVE" ? "DURDUR" : "BAŞLAT"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NUR UNIX / OPTIMIZATION TAB (Opt-In DePIN — Render Network / Grass model) */}
        {activeTab === "rewards" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-bold text-cyan-300 font-serif">⚙️ Nur Unix / Optimizasyon (Tamamen İsteğe Bağlı)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bu özellik <strong>varsayılan olarak kapalıdır</strong> ve şu an bir <strong>tarayıcı-içi demodur</strong> — bir web sayfası
                gerçek CPU/GPU kullanımını veya işletim sisteminin boşta olup olmadığını ölçemez, bu yüzden böyle bir iddiada bulunmuyoruz.
                Gerçek donanım paylaşımı ayrı bir masaüstü istemcisi gerektirir ve henüz yayında değildir.
              </p>
            </div>

            {/* Risk Profile Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => !computeSharingEnabled && setRiskProfile("guaranteed")}
                disabled={computeSharingEnabled}
                className={`p-4 rounded-2xl border text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  riskProfile === "guaranteed" ? "border-emerald-400 bg-emerald-950/20" : "border-white/10 bg-black/40 hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-emerald-300">🛡️ Garanti Getirili Havuz</div>
                <p className="text-[10px] text-slate-400 mt-1">Düşük dalgalanma, sabit oranlı pasif gelir.</p>
              </button>
              <button
                onClick={() => !computeSharingEnabled && setRiskProfile("dynamic")}
                disabled={computeSharingEnabled}
                className={`p-4 rounded-2xl border text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  riskProfile === "dynamic" ? "border-purple-400 bg-purple-950/20" : "border-white/10 bg-black/40 hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-purple-300">📈 Dinamik Arbitraj & DePIN Havuzu</div>
                <p className="text-[10px] text-slate-400 mt-1">Değişken, ortalamada daha yüksek getiri — oran her saniye görünür şekilde dalgalanır.</p>
              </button>
            </div>
            {computeSharingEnabled && (
              <p className="text-[10px] text-slate-500 -mt-3">Havuz profilini değiştirmek için önce optimizasyonu durdurun.</p>
            )}

            <div className="p-6 rounded-2xl border border-white/10 bg-black/60 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-white">Optimizasyon Durumu</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {!computeSharingEnabled
                      ? "Kapalı"
                      : idleOnly && !isTabIdle
                      ? "Beklemede (bu sekmede aktif kullanım var)"
                      : `Çalışıyor — %${computeSharePercent} &bull; ${riskProfile === "guaranteed" ? "Garanti" : "Dinamik"}`}
                  </div>
                </div>
                <button
                  onClick={toggleComputeSharing}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                    computeSharingEnabled
                      ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
                  }`}
                >
                  {computeSharingEnabled ? "DURDUR" : "ETKİNLEŞTİR"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Paylaşılacak Kaynak Oranı</span>
                  <span className="text-cyan-300 font-bold">%{computeSharePercent}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={5}
                  value={computeSharePercent}
                  onChange={(e) => setComputeSharePercent(parseInt(e.target.value, 10))}
                  disabled={computeSharingEnabled}
                  className="w-full accent-cyan-400 disabled:opacity-40"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-white">Sadece Boşta Olduğunda Çalıştır</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    Bu sekmede 20 saniye fare/klavye hareketi olmadığında "boşta" sayılır — gerçek OS/donanım boşta algılaması değildir.
                  </div>
                </div>
                <button
                  onClick={() => setIdleOnly((v) => !v)}
                  className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${idleOnly ? "bg-cyan-500" : "bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${idleOnly ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Bu Oturumda Kazanılan</div>
                  <div className="text-lg font-bold font-mono text-amber-300">{computeSessionEarnedNUR.toFixed(2)} $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Cüzdan Bakiyesi</div>
                  <div className="text-lg font-bold font-mono text-cyan-300">{userNURBalance.toLocaleString()} $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Donanım Skoru (simüle)</div>
                  <div className="text-lg font-bold font-mono text-white">{hashRateScore}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Anlık Oran (Dinamik Havuz)</div>
                  <div className="text-lg font-bold font-mono text-purple-300">
                    {riskProfile === "dynamic" ? `${lastDynamicRate.toFixed(3)} $NUR/sn` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NUR CARD TAB — Tiered Eligibility, JIT Funding, Honest Staking Offer */}
        {activeTab === "card" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Eligibility Banner */}
            <div className={`p-5 rounded-2xl border space-y-3 ${nurCardEligible ? "bg-emerald-950/20 border-emerald-500/30" : "bg-black/50 border-white/10"}`}>
              {nurCardEligible ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-emerald-300 font-serif">✅ Nur Card'a Hak Kazandınız</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bakiyeniz şeffaf eşiği ({NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR) aştı.
                    </p>
                  </div>
                  {!nurCardApplied ? (
                    <button
                      onClick={handleApplyNurCard}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                    >
                      NUR CARD BAŞVURUSU YAP
                    </button>
                  ) : (
                    <span className="text-[10px] px-3 py-1.5 rounded-lg font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      DEMO KART AKTİF
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white font-serif">🔒 Nur Card için Bakiye Eşiğine Yaklaşıyorsunuz</div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                      style={{ width: `${Math.min(100, (userNURBalance / NUR_CARD_ELIGIBILITY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {userNURBalance.toLocaleString()} / {NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR — eşik herkes için aynı ve açıkça gösterilir.
                  </p>
                </div>
              )}
              <p className="text-[10px] text-slate-500 border-t border-white/10 pt-2">
                Not: Bu bir uygulama-içi demodur. Gerçek fiziksel/sanal kart basımı (Marqeta/Baanx gibi lisanslı bir BaaS ortaklığı) henüz kurulmadı.
              </p>
            </div>

            {/* JIT Funding Spend Simulation */}
            {nurCardApplied && (
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-black/60 space-y-4">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Gerçek Zamanlı (JIT) Harcama Simülasyonu
                </h4>
                <p className="text-[11px] text-slate-400 -mt-2">
                  Harcama anında $NUR'unuz görünür bakiyenizden düşülür ve Fiat'a çevrilir — hiçbir tutar gizlenmez.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DEMO_MERCHANTS.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => handleCardSpend(m.name, m.amountEur)}
                      className="p-3 rounded-xl border border-white/10 bg-black/40 hover:border-cyan-400 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-1">€{m.amountEur.toFixed(2)}</div>
                    </button>
                  ))}
                </div>

                {cardSpendLog.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">İşlem Kaydı (Şeffaf Log)</div>
                    {cardSpendLog.map((s) => (
                      <div key={s.id} className="flex justify-between items-center text-[11px] font-mono p-2 rounded bg-black/40">
                        <span className="text-slate-300">{s.timestamp} — {s.merchant}</span>
                        <span className="text-amber-300">
                          −{s.amountNUR.toFixed(2)} $NUR (€{s.amountFiat.toFixed(2)} + {s.feeNUR.toFixed(2)} ücret)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Withdrawal + Honest, Non-Blocking Staking Offer */}
            <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-4">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Harici Cüzdana Çekim</h4>

              {pendingWithdrawAmount === null ? (
                <form onSubmit={handleRequestWithdraw} className="flex items-center gap-3">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-sm font-mono font-bold text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-mono shrink-0">$NUR</span>
                  <button
                    type="submit"
                    disabled={parseFloat(withdrawAmount || "0") <= 0 || parseFloat(withdrawAmount || "0") > userNURBalance}
                    className="px-4 py-2.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors disabled:opacity-40"
                  >
                    ÇEKİM TALEBİ OLUŞTUR
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-amber-300">{pendingWithdrawAmount.toLocaleString()} $NUR</strong> için üç eşdeğer seçeneğiniz var —
                    hepsi tamamen isteğe bağlı, hiçbiri gizli bir sebeple gecikmeye uğratılmaz:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => requestSecureWithdraw("quick")}
                      className="p-3 rounded-xl border border-white/15 bg-black/40 hover:border-white/40 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-white">⚡ Hızlı Çekim {twoFactorEnabled && "🔐"}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Hemen işlenir &bull; standart %{(NETWORK_FEE_RATE * 100).toFixed(2)} ağ ücreti</div>
                    </button>
                    <button
                      onClick={() => requestSecureWithdraw("flexible")}
                      className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-cyan-300">🕒 Esnek Havuz {twoFactorEnabled && "🔐"}</div>
                      <div className="text-[10px] text-slate-400 mt-1">24 saat bekleme &bull; ağ ücreti yok &bull; +%2 bonus</div>
                    </button>
                    <button
                      onClick={handleStakeInstead}
                      className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:border-amber-400 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-amber-300">🔒 Stake Et</div>
                      <div className="text-[10px] text-slate-400 mt-1">{STAKING_LOCK_DAYS} gün kilitli &bull; %{STAKING_APY} APY</div>
                    </button>
                  </div>

                  {pendingSecureAction && (
                    <form onSubmit={handleConfirmSecureAction} className="p-3 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2">
                      <div className="text-[11px] text-purple-300 font-bold">🔐 Authenticator uygulamanızdaki 6 haneli kodu girin</div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={secureCodeInput}
                          onChange={(e) => setSecureCodeInput(e.target.value)}
                          placeholder="000000"
                          autoFocus
                          className="flex-1 p-2 rounded-lg bg-black/60 border border-white/20 text-sm font-mono text-white text-center tracking-widest focus:outline-none"
                        />
                        <button type="submit" className="px-3 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-black text-xs font-mono font-bold">
                          ONAYLA
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingSecureAction(null)}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                        >
                          İPTAL
                        </button>
                      </div>
                      {secureError && <div className="text-[10px] text-red-400">{secureError}</div>}
                    </form>
                  )}
                </div>
              )}

              {scheduledWithdrawals.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Esnek Havuz Kuyruğu</div>
                  {scheduledWithdrawals.map((w) => (
                    <div key={w.id} className="flex justify-between items-center text-[11px] font-mono p-2 rounded bg-cyan-950/10 border border-cyan-500/20">
                      <span className="text-slate-300">
                        {w.amountNUR.toLocaleString()} $NUR + {w.bonusNUR.toFixed(2)} bonus
                      </span>
                      <span className="text-cyan-300">Tahmini: {new Date(w.completesAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {totalStakedNUR > 0 && (
                <div className="text-[11px] text-slate-400 font-mono border-t border-white/10 pt-3 flex items-center justify-between">
                  <span>
                    Staking Havuzunda: <strong className="text-amber-300">{totalStakedNUR.toLocaleString()} $NUR</strong> ({stakingPositions.length} pozisyon)
                  </span>
                  <button onClick={() => setActiveTab("staking")} className="text-cyan-300 hover:text-cyan-200 underline">
                    Tüm Pozisyonlar &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAKING & YIELD POOLS TAB */}
        {activeTab === "staking" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-1">
              <h3 className="text-sm font-bold text-amber-300 font-serif">🔒 Staking & Getiri Havuzları</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Varlığınızı bağımsız olarak kilitleyip belirgin, önceden ilan edilmiş APY oranları kazanın. Erken çıkışta yalnızca o ana kadarki
                getiriyi kaybedersiniz — <strong>anaparanız hiçbir koşulda kesintiye uğramaz.</strong> Bu bir uygulama-içi demodur; gerçek zincir
                üzerinde denetlenmiş bir akıllı sözleşme henüz devreye alınmadı.
              </p>
            </div>

            {/* Pool Selector + Stake Form */}
            <form onSubmit={handleCreateStake} className="p-5 rounded-2xl border border-white/10 bg-black/60 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAKING_POOLS.map((pool) => (
                  <button
                    key={pool.id}
                    type="button"
                    onClick={() => setSelectedPoolId(pool.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      selectedPoolId === pool.id ? "border-amber-400 bg-amber-950/20" : "border-white/10 bg-black/40 hover:border-white/30"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{pool.label}</div>
                    <div className="text-sm font-bold text-amber-300 font-mono mt-1">%{pool.apy} APY</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={stakeAmountInput}
                  onChange={(e) => setStakeAmountInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-sm font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-xs text-slate-400 font-mono shrink-0">$NUR</span>
                <button
                  type="submit"
                  disabled={parseFloat(stakeAmountInput || "0") <= 0 || parseFloat(stakeAmountInput || "0") > userNURBalance}
                  className="px-4 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono transition-colors disabled:opacity-40"
                >
                  STAKE ET
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Kullanılabilir bakiye: {userNURBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR</p>
            </form>

            {/* Active Positions */}
            {stakingPositions.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Açık Pozisyonlarınız</div>
                {stakingPositions.map((pos) => {
                  const now = stakingNowTick;
                  const pool = STAKING_POOLS.find((p) => p.id === pos.poolId)!;
                  const matured = now >= pos.maturesAt;
                  const progress = pool.lockDays === 0 ? 100 : Math.min(100, ((now - pos.startedAt) / (pos.maturesAt - pos.startedAt)) * 100);
                  const yieldSoFar = accruedYield(pos, now);
                  return (
                    <div key={pos.id} className="p-4 rounded-2xl border border-white/10 bg-black/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{pool.label} &bull; %{pos.apy} APY</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Anapara: {pos.amountNUR.toLocaleString()} $NUR &bull; Getiri: +{yieldSoFar.toFixed(3)} $NUR
                          </div>
                        </div>
                        <button
                          onClick={() => handleClaimStake(pos.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors shrink-0 ${
                            matured
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                              : "bg-white/10 text-slate-300 border border-white/20 hover:bg-white/20"
                          }`}
                        >
                          {matured ? "TALEP ET (Anapara + Getiri)" : "ERKEN ÇIK (Sadece Anapara + O Ana Kadarki Getiri)"}
                        </button>
                      </div>
                      {pool.lockDays > 0 && (
                        <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DAO GOVERNANCE TAB */}
        {activeTab === "governance" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1">
              <h3 className="text-sm font-bold text-purple-300 font-serif">🗳️ DAO Yönetişim & Oylama</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Oy gücünüz şeffaftır: <strong>1 $NUR (bakiye + staking) = 1 oy</strong>, herkes için aynı formül. Bu bir uygulama-içi demodur;
                oylar zincir üzerinde değil, bu oturumda tutulur.
              </p>
              <div className="text-[11px] text-purple-300 font-mono pt-1">
                Sizin Oy Gücünüz: {votingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({userNURBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} bakiye + {totalStakedNUR.toLocaleString()} staking)
              </div>
            </div>

            <div className="space-y-3">
              {proposals.map((p) => {
                const total = p.votesForNUR + p.votesAgainstNUR;
                const forPct = total > 0 ? (p.votesForNUR / total) * 100 : 50;
                const hasVoted = votedProposalIds.has(p.id);
                return (
                  <div key={p.id} className="p-4 rounded-2xl border border-white/10 bg-black/50 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-white">{p.title}</div>
                      <p className="text-[11px] text-slate-400 mt-1">{p.description}</p>
                    </div>

                    <div className="w-full h-2 rounded-full bg-red-950/40 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${forPct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span className="text-emerald-400">EVET: {p.votesForNUR.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({forPct.toFixed(1)}%)</span>
                      <span className="text-red-400">HAYIR: {p.votesAgainstNUR.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({(100 - forPct).toFixed(1)}%)</span>
                    </div>

                    {hasVoted ? (
                      <div className="text-[10px] text-slate-500 font-mono">✓ Bu teklife oy kullandınız.</div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCastVote(p.id, true)}
                          disabled={votingPower <= 0}
                          className="flex-1 py-2 rounded-lg font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono transition-colors disabled:opacity-40"
                        >
                          EVET
                        </button>
                        <button
                          onClick={() => handleCastVote(p.id, false)}
                          disabled={votingPower <= 0}
                          className="flex-1 py-2 rounded-lg font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-mono transition-colors disabled:opacity-40"
                        >
                          HAYIR
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECURITY & 2FA TAB */}
        {activeTab === "security" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-1">
              <h3 className="text-sm font-bold text-purple-300 font-serif">🔐 Güvenlik & İki Faktörlü Doğrulama (2FA)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gerçek, standart bir TOTP (RFC 6238) uygulamasıdır — Google Authenticator, Authy veya herhangi bir uyumlu uygulamayla çalışır.
                Gizli anahtar yalnızca tarayıcınızda tutulur, hiçbir sunucuya gönderilmez. Etkinleştirildiğinde, harici cüzdana çekim
                işlemleri (Hızlı Çekim, Esnek Havuz) authenticator kodunuzla onaylanmadan tamamlanmaz.
              </p>
            </div>

            {!twoFactorEnabled && !setupInProgress && (
              <button
                onClick={handleStartTwoFactorSetup}
                className="w-full py-3 rounded-xl font-bold bg-purple-500 hover:bg-purple-400 text-black text-xs font-mono transition-colors"
              >
                2FA KURULUMUNU BAŞLAT
              </button>
            )}

            {setupInProgress && twoFactorSecret && (
              <form onSubmit={handleConfirmTwoFactorSetup} className="p-5 rounded-2xl border border-purple-500/40 bg-purple-950/10 space-y-4">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">1. Bu anahtarı authenticator uygulamanıza manuel girin</div>
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-sm text-purple-300 tracking-wider break-all select-all">
                    {twoFactorSecret}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 break-all">{generateOtpAuthUri(twoFactorSecret, "NurTerminal")}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">2. Uygulamada görünen 6 haneli kodu girin</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={setupCodeInput}
                      onChange={(e) => setSetupCodeInput(e.target.value)}
                      placeholder="000000"
                      className="flex-1 p-2.5 rounded-lg bg-black/60 border border-white/20 text-sm font-mono text-white text-center tracking-widest focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-black text-xs font-mono font-bold">
                      DOĞRULA VE ETKİNLEŞTİR
                    </button>
                  </div>
                  {setupError && <div className="text-[10px] text-red-400 mt-1">{setupError}</div>}
                </div>
              </form>
            )}

            {twoFactorEnabled && (
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300">✅ 2FA Aktif</div>
                  <p className="text-[10px] text-slate-400 mt-1">Çekim işlemleri authenticator kodu gerektiriyor.</p>
                </div>
                <button
                  onClick={handleDisableTwoFactor}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors"
                >
                  DEVRE DIŞI BIRAK
                </button>
              </div>
            )}
          </div>
        )}

        {/* TRANSACTION AUDIT TRAIL TAB */}
        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-bold text-cyan-300 font-serif">📋 İşlem Geçmişi & Kriptografik Doğrulama Zinciri</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Her giriş, önceki girişin hash'ini de kapsayan gerçek bir SHA-256 (Web Crypto) ile imzalanır — zincirin herhangi bir yerinde
                kurcalama olursa "Zincir Bütünlüğünü Doğrula" bunu tespit eder. <strong>Bu bir zincir üstü (blockchain) kayıt değildir</strong> —
                yalnızca bu tarayıcı oturumunda tutulur ve sayfa yenilendiğinde sıfırlanır; kurumsal denetim için sunucu tarafı kalıcı bir
                defter ayrı bir altyapı gerektirir.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleVerifyChain}
                disabled={activityLog.length === 0}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors disabled:opacity-40"
              >
                🔍 ZİNCİR BÜTÜNLÜĞÜNÜ DOĞRULA
              </button>
              {chainVerifyResult === "valid" && (
                <span className="text-xs font-mono text-emerald-400">✅ Zincir bütün — hiçbir kayıt değiştirilmemiş.</span>
              )}
              {chainVerifyResult === "invalid" && (
                <span className="text-xs font-mono text-red-400">⚠️ Uyuşmazlık tespit edildi — zincir bütünlüğü bozulmuş.</span>
              )}
              <div className="flex-1" />
              <button
                onClick={handleExportCSV}
                disabled={activityLog.length === 0}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40"
              >
                ⬇️ CSV DIŞA AKTAR
              </button>
              <button
                onClick={handleExportTXT}
                disabled={activityLog.length === 0}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40"
              >
                ⬇️ TXT DIŞA AKTAR
              </button>
            </div>

            {activityLog.length === 0 ? (
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center text-xs text-slate-500">
                Henüz bir işlem kaydedilmedi. Swap, staking, Nur Card harcaması, çekim veya oy kullandığınızda burada görünecek.
              </div>
            ) : (
              <div className="space-y-2">
                {activityLog.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl border border-white/10 bg-black/50 space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                          {entry.type}
                        </span>
                        <span className="text-xs text-white truncate">{entry.description}</span>
                      </div>
                      {entry.amountNUR !== 0 && (
                        <span className={`text-xs font-mono font-bold shrink-0 ${entry.amountNUR > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {entry.amountNUR > 0 ? "+" : ""}
                          {entry.amountNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-slate-500">
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="truncate">hash: {entry.hash.slice(0, 16)}…</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBCHAIN EXPLORER TAB */}
        {activeTab === "subchain" && (
          <div className="max-w-4xl mx-auto space-y-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-cyan-300 font-bold uppercase">NUR-NET (L2 Sovereign Chain) Telemetrisi</span>
                <span className="text-emerald-400 font-bold">● 4,200 TPS (Kuantum İşlem Kapasitesi)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Son Blok</div>
                  <div className="text-sm font-bold text-white">#14,892,104</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Blok Süresi</div>
                  <div className="text-sm font-bold text-emerald-400">0.24 saniye</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Gas Ücreti</div>
                  <div className="text-sm font-bold text-cyan-300">0.0001 $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Aktif Doğrulayıcı</div>
                  <div className="text-sm font-bold text-amber-300">24 Kurumsal Node</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOKENOMICS TAB */}
        {activeTab === "tokenomics" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 text-xs">
              <h3 className="text-sm font-bold text-amber-300 font-serif">
                $NUR Tokenomics & Kurumsal Hazine Kâr Modeli
              </h3>
              <p className="text-slate-300 leading-relaxed">
                $NUR Coin, şirketimizin doğrudan kontrol ettiği egemen bir değer saklama ve ödeme aracıdır.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span><strong>Toplam Sabit Arz:</strong> 1,000,000,000 $NUR</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>%45 Hazine & Likidite Pegleme:</strong> USDT/USDC rezervleri ile 1:1 fiyat garantisi.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span><strong>%25 Madencilik & Hashrate Ödül Havuzu:</strong> Bot operatörlerine düzenli getiri.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span><strong>%50 Sürekli Geri Alım & Yakım (Buyback & Burn):</strong> Madencilik ve borsa komisyon kârları $NUR piyasasından düzenli alım yaparak değerini güçlendirir.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-dashed border-white/15 flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-white font-serif">💳 Nur Card</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Bakiye eşiğine göre kademeli erişim, JIT (Just-In-Time) harcama ve isteğe bağlı staking teklifini "Nur Card" sekmesinde deneyebilirsiniz.
                  Gerçek fiziksel/sanal kart basımı lisanslı bir BaaS ortaklığı gerektirir ve henüz canlı değildir.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("card")}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                Nur Card Sekmesi &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
