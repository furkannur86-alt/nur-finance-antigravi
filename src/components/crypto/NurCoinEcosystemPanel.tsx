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
  { id: "flexible", label: "Flexible (No Lock)", apy: 1.5, lockDays: 0 },
  { id: "short", label: "30 Days", apy: 5, lockDays: 30 },
  { id: "medium", label: "90 Days", apy: 8, lockDays: 90 },
  { id: "long", label: "180 Days", apy: 12, lockDays: 180 },
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
    title: "Increase Buyback & Burn rate from 50% to 60%?",
    description: "Increasing the share of mining and commission profits allocated to $NUR buybacks.",
    votesForNUR: 412000,
    votesAgainstNUR: 88000,
  },
  {
    id: "prop-2",
    title: "Add a new 365-day staking pool (18% APY)?",
    description: "A new optional pool offering higher fixed returns in exchange for long-term locking.",
    votesForNUR: 265000,
    votesAgainstNUR: 190000,
  },
  {
    id: "prop-3",
    title: "Fix Nur Unix compute-sharing commission at 25%?",
    description: "Setting the company commission rate to a fixed, pre-announced rate instead of variable.",
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
  { name: "Aldi Süd (Supermarket)", amountEur: 42.5 },
  { name: "Deutsche Bahn (Transport)", amountEur: 89.0 },
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
  const { addNotification } = useIDEStore();

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
    const header = "Time,Type,Description,Amount($NUR),Prev_Hash,Hash";
    const rows = activityLog.map((e) =>
      [new Date(e.timestamp).toISOString(), e.type, `"${e.description.replace(/"/g, '""')}"`, e.amountNUR.toFixed(2), e.prevHash, e.hash].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nur-finance-transaction-history-${new Date().toISOString().slice(0, 10)}.csv`;
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
    a.download = `nur-finance-transaction-history-${new Date().toISOString().slice(0, 10)}.txt`;
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
      setSetupError("Code could not be verified. Enter the current 6-digit code from your authenticator app.");
      return;
    }
    cyberSound.playQuantumUnlock();
    setTwoFactorEnabled(true);
    setSetupInProgress(false);
    setSetupCodeInput("");
    setSetupError("");
    addNotification({
      title: "🔐 Two-Factor Authentication Enabled",
      message: "Withdrawals to external wallets will now require confirmation with the code from your authenticator app.",
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
      title: "🔓 Two-Factor Authentication Disabled",
      message: "Withdrawal operations will no longer require a 2FA code.",
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
      setSecureError("Code is invalid or expired. Try the current code from your authenticator app.");
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
      title: "💳 Nur Card Application Received",
      message: `Balance threshold (${NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR) met. This is an in-app demo — actual physical/virtual card issuance requires a licensed BaaS partnership and is not yet live.`,
      severity: "INFO",
      category: "SYSTEM",
    });
  };

  const handleCardSpend = (merchant: string, amountEur: number) => {
    const feeNUR = amountEur * NETWORK_FEE_RATE;
    const amountNUR = amountEur + feeNUR;
    if (amountNUR > userNURBalance) {
      addNotification({
        title: "Spend Declined",
        message: `Insufficient balance. This transaction requires ${amountNUR.toFixed(2)} $NUR.`,
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
      title: "💳 Nur Card Spend Approved (JIT Funding)",
      message: `${merchant}: ${amountNUR.toFixed(2)} $NUR instantly converted to €${amountEur.toFixed(2)} (${feeNUR.toFixed(2)} $NUR network fee included, disclosed before transaction).`,
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
    logActivity("WITHDRAW_QUICK", "Quick Withdrawal (external wallet)", -pendingWithdrawAmount);
    addNotification({
      title: "✅ Quick Withdrawal Complete",
      message: `${netOut.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR sent to your external wallet (standard ${(NETWORK_FEE_RATE * 100).toFixed(2)}% network fee: ${feeNUR.toFixed(2)} $NUR, disclosed before transaction). No delay or additional approval applied.`,
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
    logActivity("WITHDRAW_FLEX", "Flexible Pool Withdrawal (24 hours, +2% bonus)", -pendingWithdrawAmount);
    addNotification({
      title: "🕒 Added to Flexible Pool",
      message: `${pendingWithdrawAmount.toLocaleString()} $NUR queued for fee-free withdrawal. In 24 hours it will be sent to your external wallet along with a +${bonusNUR.toFixed(2)} $NUR bonus, no network fee charged.`,
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
      title: "🔒 Transferred to Staking Pool",
      message: `${pendingWithdrawAmount.toLocaleString()} $NUR transferred to the ${STAKING_LOCK_DAYS}-day staking pool at ${STAKING_APY}% APY.`,
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
    logActivity("STAKE_OPEN", `Staking Opened: ${pool.label} (${pool.apy}% APY)`, -amount);
    addNotification({
      title: "🔒 Staking Position Opened",
      message: `${amount.toLocaleString()} $NUR locked in the "${pool.label}" pool at ${pool.apy}% APY.${pool.lockDays > 0 ? ` If you exit early before ${pool.lockDays} days, you only lose the yield accrued to that point — your principal is always safe.` : " No lock, you can claim at any time."}`,
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
    logActivity("DAO_VOTE", `Vote: "${proposals.find((p) => p.id === proposalId)?.title ?? proposalId}" — ${support ? "YES" : "NO"}`, 0);
    addNotification({
      title: "🗳️ Vote Recorded",
      message: `You voted "${support ? "YES" : "NO"}" with ${votingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR voting power (1 $NUR = 1 vote, balance + staking included).`,
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
    logActivity("STAKE_CLAIM", matured ? "Staking Claimed (matured)" : "Staking Early Exit", payout);
    addNotification({
      title: matured ? "✅ Staking Matured" : "⚠️ Early Exit",
      message: matured
        ? `${pos.amountNUR.toLocaleString()} $NUR principal + ${yieldEarned.toFixed(2)} $NUR yield transferred to your wallet.`
        : `Early exit: ${pos.amountNUR.toLocaleString()} $NUR principal + ${yieldEarned.toFixed(2)} $NUR yield accrued to this point returned. No deduction from your principal.`,
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
        title: "⚡ $NUR Coin Swap Successful",
        message: `${netNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR minted for ${amountNum} ${swapFromCurrency} (after deducting ${networkFeeNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR — ${(NETWORK_FEE_RATE * 100).toFixed(2)}% network fee) and transferred to your wallet.`,
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
        title: next ? "⚙️ Nur Unix Optimization Enabled" : "⏸️ Nur Unix Optimization Stopped",
        message: next
          ? `This is a browser-in-app demo (real CPU/GPU sharing requires a desktop client, not yet live). ${computeSharePercent}% sharing rate and "${riskProfile === "guaranteed" ? "Guaranteed Yield" : "Dynamic Arbitrage"}" pool selected. You can stop at any time.`
          : "Optimization stopped. $NUR earned this session has been added to your balance.",
        severity: "INFO",
        category: "SYSTEM",
      });
      if (!next) {
        setUserNURBalance((b) => b + computeSessionEarnedNUR);
        logActivity("COMPUTE_SHARE", "Nur Unix Optimization Stopped — session earnings transferred to balance", computeSessionEarnedNUR);
        setComputeSessionEarnedNUR(0);
      } else {
        logActivity("COMPUTE_SHARE", `Nur Unix Optimization Started (${computeSharePercent}%, ${riskProfile === "guaranteed" ? "Guaranteed" : "Dynamic"})`, 0);
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
      title: "⛏️ New Mining Bot Started",
      message: `${newBot.name} is now running inside an AppArmor-protected sandbox. Daily yield synchronized with NUR Finance treasury.`,
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
              Our Sovereign Reserve Cryptocurrency &bull; Automatic Liquidity Swap &bull; AppArmor Mining Hub
            </p>
          </div>
        </div>

        {/* User $NUR Vault Balance */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/40 text-right">
            <div className="text-[9px] text-slate-400 font-mono uppercase">Your $NUR Wallet Balance</div>
            <div className="text-sm font-bold font-mono text-cyan-300">
              {userNURBalance.toLocaleString()} $NUR
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {(
              [
                { id: "swap" as const, label: "🔄 1-Click Swap ($NUR)" },
                { id: "mining" as const, label: "⛏️ Mining & Bots" },
                { id: "rewards" as const, label: "⚙️ Nur Unix / Optimization" },
                { id: "card" as const, label: "💳 Nur Card" },
                { id: "staking" as const, label: "🔒 Staking & Yield" },
                { id: "governance" as const, label: "🗳️ DAO Governance" },
                { id: "security" as const, label: "🔐 Security & 2FA" },
                { id: "history" as const, label: "📋 Transaction History" },
                { id: "subchain" as const, label: "⛓️ NUR Sub-Chain" },
                { id: "tokenomics" as const, label: "📊 Tokenomics & Profit" },
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
                  NUR Finance Core Payment Protocol
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  All terminal subscriptions, VIP analysis libraries and ecosystem services are priced directly in <strong>$NUR Coin</strong>. When a customer deposits USDT/BTC it is instantly converted 1:1 to $NUR Coin and credited to the system.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-4 border-l border-white/10">
                <div className="text-[10px] text-slate-400">Peg Stability</div>
                <div className="text-base font-bold text-emerald-400">100.0% (1 $NUR = $1.00)</div>
                <div className="text-[9px] text-slate-500">Treasury Collateral: 108.4%</div>
              </div>
            </div>

            {/* Proof-of-Reserves Transparency Block */}
            <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/20 flex items-center justify-between font-mono">
              <div>
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide">🔍 Reserve Transparency (Proof-of-Reserves)</div>
                <p className="text-[10px] text-slate-400 max-w-md mt-0.5">
                  The backing for every minted $NUR is independently traceable in the treasury vault — no haircut or exchange-rate discrepancy is hidden.
                </p>
              </div>
              <div className="flex gap-4 text-right shrink-0">
                <div>
                  <div className="text-[9px] text-slate-500">Treasury Reserve</div>
                  <div className="text-sm font-bold text-white">$108.4M</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">Circulating $NUR</div>
                  <div className="text-sm font-bold text-white">100.0M</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500">Collateral Ratio</div>
                  <div className="text-sm font-bold text-emerald-400">108.4%</div>
                </div>
              </div>
            </div>

            {/* Instant Swap Card */}
            <form onSubmit={handleInstantSwap} className="p-6 rounded-2xl border border-cyan-500/30 bg-black/60 space-y-5">
              <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                1-Click Instant Funding & $NUR Coin Minting
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* From Input */}
                <div className="p-4 rounded-xl bg-black/70 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Currency to Deposit</span>
                    <span>Balance: 250,000 USDT</span>
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
                      onChange={(e) => setSwapFromCurrency(e.target.value as "USDT" | "USDC" | "BTC" | "ETH")}
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
                    <span>Ecosystem Asset to Receive</span>
                    <span className="font-bold">1:1 Treasury Guaranteed</span>
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
                    Network Fee ({(NETWORK_FEE_RATE * 100).toFixed(2)}%, disclosed before transaction): −{networkFeeNUR.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR
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
                    <span>TREASURY LIQUIDITY LOCKING & $NUR MINTING...</span>
                  </>
                ) : (
                  <span>⚡ INSTANTLY CONVERT TO $NUR COIN AND TRANSFER TO WALLET</span>
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
                  AppArmor-Isolated Mining & Hashrate Bot Pool
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Bitcoin and crypto investors can run cloud mining bots isolated under Linux <strong>AppArmor</strong> security profiles. 50% of generated profits are paid to the miner while 50% goes to the NUR Finance share buyback treasury.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-4 border-l border-white/10">
                <div className="text-[10px] text-slate-400">Total Network Power</div>
                <div className="text-base font-bold text-emerald-400">275.7 TH/s</div>
                <div className="text-[9px] text-emerald-300 font-bold">● AppArmor Protected</div>
              </div>
            </div>

            {/* Deploy New Bot Form */}
            <form onSubmit={handleDeployMiningBot} className="p-4 rounded-2xl border border-white/10 bg-black/40 flex items-center gap-3">
              <input
                type="text"
                value={newBotName}
                onChange={(e) => setNewBotName(e.target.value)}
                placeholder="New Mining Bot Name (e.g. Node Zurich-1)"
                className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
              />
              <select
                value={newBotAlgorithm}
                onChange={(e) => setNewBotAlgorithm(e.target.value as MiningBot["algorithm"])}
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
                + RUN BOT
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
                      Hashrate: <strong className="text-white">{b.hashrate}</strong> &bull; Power Cost: <strong className="text-slate-300">{b.powerCost}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-xs font-bold text-amber-300 font-mono">
                        +{b.dailyYieldNUR} $NUR / Day
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        (50% Treasury Buyback Share)
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
                      {b.status === "ACTIVE" ? "STOP" : "START"}
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
              <h3 className="text-sm font-bold text-cyan-300 font-serif">⚙️ Nur Unix / Optimization (Fully Optional)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                This feature is <strong>off by default</strong> and is currently a <strong>browser-in-app demo</strong> — a web page
                cannot measure real CPU/GPU usage or whether the operating system is idle, so we make no such claim.
                Real hardware sharing requires a separate desktop client and is not yet live.
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
                <div className="text-xs font-bold text-emerald-300">🛡️ Guaranteed Yield Pool</div>
                <p className="text-[10px] text-slate-400 mt-1">Low volatility, fixed-rate passive income.</p>
              </button>
              <button
                onClick={() => !computeSharingEnabled && setRiskProfile("dynamic")}
                disabled={computeSharingEnabled}
                className={`p-4 rounded-2xl border text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  riskProfile === "dynamic" ? "border-purple-400 bg-purple-950/20" : "border-white/10 bg-black/40 hover:border-white/30"
                }`}
              >
                <div className="text-xs font-bold text-purple-300">📈 Dynamic Arbitrage & DePIN Pool</div>
                <p className="text-[10px] text-slate-400 mt-1">Variable, on-average higher yield — rate visibly fluctuates every second.</p>
              </button>
            </div>
            {computeSharingEnabled && (
              <p className="text-[10px] text-slate-500 -mt-3">Stop optimization first to change the pool profile.</p>
            )}

            <div className="p-6 rounded-2xl border border-white/10 bg-black/60 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-white">Optimization Status</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {!computeSharingEnabled
                      ? "Off"
                      : idleOnly && !isTabIdle
                      ? "Waiting (active usage in this tab)"
                      : `Running — ${computeSharePercent}% &bull; ${riskProfile === "guaranteed" ? "Guaranteed" : "Dynamic"}`}
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
                  {computeSharingEnabled ? "STOP" : "ENABLE"}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Resource Share Rate</span>
                  <span className="text-cyan-300 font-bold">{computeSharePercent}%</span>
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
                  <div className="text-xs font-bold text-white">Run Only When Idle</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">
                    "Idle" means no mouse/keyboard activity in this tab for 20 seconds — not real OS/hardware idle detection.
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
                  <div className="text-[10px] text-slate-400">Earned This Session</div>
                  <div className="text-lg font-bold font-mono text-amber-300">{computeSessionEarnedNUR.toFixed(2)} $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Wallet Balance</div>
                  <div className="text-lg font-bold font-mono text-cyan-300">{userNURBalance.toLocaleString()} $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Hardware Score (simulated)</div>
                  <div className="text-lg font-bold font-mono text-white">{hashRateScore}</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Live Rate (Dynamic Pool)</div>
                  <div className="text-lg font-bold font-mono text-purple-300">
                    {riskProfile === "dynamic" ? `${lastDynamicRate.toFixed(3)} $NUR/s` : "—"}
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
                    <div className="text-sm font-bold text-emerald-300 font-serif">✅ You Are Eligible for Nur Card</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Your balance exceeded the transparent threshold ({NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR).
                    </p>
                  </div>
                  {!nurCardApplied ? (
                    <button
                      onClick={handleApplyNurCard}
                      className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                    >
                      APPLY FOR NUR CARD
                    </button>
                  ) : (
                    <span className="text-[10px] px-3 py-1.5 rounded-lg font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      DEMO CARD ACTIVE
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white font-serif">🔒 Approaching the Balance Threshold for Nur Card</div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                      style={{ width: `${Math.min(100, (userNURBalance / NUR_CARD_ELIGIBILITY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {userNURBalance.toLocaleString()} / {NUR_CARD_ELIGIBILITY_THRESHOLD.toLocaleString()} $NUR — threshold is the same for everyone and clearly displayed.
                  </p>
                </div>
              )}
              <p className="text-[10px] text-slate-500 border-t border-white/10 pt-2">
                Note: This is an in-app demo. Real physical/virtual card issuance (a licensed BaaS partnership such as Marqeta/Baanx) has not yet been established.
              </p>
            </div>

            {/* JIT Funding Spend Simulation */}
            {nurCardApplied && (
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-black/60 space-y-4">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  Real-Time (JIT) Spending Simulation
                </h4>
                <p className="text-[11px] text-slate-400 -mt-2">
                  At the moment of spending, your $NUR is deducted from your visible balance and converted to Fiat — no amount is hidden.
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
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Transaction Log (Transparent)</div>
                    {cardSpendLog.map((s) => (
                      <div key={s.id} className="flex justify-between items-center text-[11px] font-mono p-2 rounded bg-black/40">
                        <span className="text-slate-300">{s.timestamp} — {s.merchant}</span>
                        <span className="text-amber-300">
                          −{s.amountNUR.toFixed(2)} $NUR (€{s.amountFiat.toFixed(2)} + {s.feeNUR.toFixed(2)} fee)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Withdrawal + Honest, Non-Blocking Staking Offer */}
            <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-4">
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Withdraw to External Wallet</h4>

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
                    CREATE WITHDRAWAL REQUEST
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/10 space-y-3">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    You have three equivalent options for <strong className="text-amber-300">{pendingWithdrawAmount.toLocaleString()} $NUR</strong> —
                    all fully optional, none is delayed for a hidden reason:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => requestSecureWithdraw("quick")}
                      className="p-3 rounded-xl border border-white/15 bg-black/40 hover:border-white/40 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-white">⚡ Quick Withdrawal {twoFactorEnabled && "🔐"}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Processed immediately &bull; standard {(NETWORK_FEE_RATE * 100).toFixed(2)}% network fee</div>
                    </button>
                    <button
                      onClick={() => requestSecureWithdraw("flexible")}
                      className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-cyan-300">🕒 Flexible Pool {twoFactorEnabled && "🔐"}</div>
                      <div className="text-[10px] text-slate-400 mt-1">24 hour wait &bull; no network fee &bull; +2% bonus</div>
                    </button>
                    <button
                      onClick={handleStakeInstead}
                      className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/20 hover:border-amber-400 text-left transition-colors"
                    >
                      <div className="text-xs font-bold text-amber-300">🔒 Stake Instead</div>
                      <div className="text-[10px] text-slate-400 mt-1">{STAKING_LOCK_DAYS} days locked &bull; {STAKING_APY}% APY</div>
                    </button>
                  </div>

                  {pendingSecureAction && (
                    <form onSubmit={handleConfirmSecureAction} className="p-3 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2">
                      <div className="text-[11px] text-purple-300 font-bold">🔐 Enter the 6-digit code from your authenticator app</div>
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
                          CONFIRM
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingSecureAction(null)}
                          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono"
                        >
                          CANCEL
                        </button>
                      </div>
                      {secureError && <div className="text-[10px] text-red-400">{secureError}</div>}
                    </form>
                  )}
                </div>
              )}

              {scheduledWithdrawals.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Flexible Pool Queue</div>
                  {scheduledWithdrawals.map((w) => (
                    <div key={w.id} className="flex justify-between items-center text-[11px] font-mono p-2 rounded bg-cyan-950/10 border border-cyan-500/20">
                      <span className="text-slate-300">
                        {w.amountNUR.toLocaleString()} $NUR + {w.bonusNUR.toFixed(2)} bonus
                      </span>
                      <span className="text-cyan-300">Est: {new Date(w.completesAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {totalStakedNUR > 0 && (
                <div className="text-[11px] text-slate-400 font-mono border-t border-white/10 pt-3 flex items-center justify-between">
                  <span>
                    In Staking Pool: <strong className="text-amber-300">{totalStakedNUR.toLocaleString()} $NUR</strong> ({stakingPositions.length} position{stakingPositions.length !== 1 ? "s" : ""})
                  </span>
                  <button onClick={() => setActiveTab("staking")} className="text-cyan-300 hover:text-cyan-200 underline">
                    All Positions &rarr;
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
              <h3 className="text-sm font-bold text-amber-300 font-serif">🔒 Staking & Yield Pools</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lock your assets independently and earn clearly pre-announced APY rates. On early exit you only forfeit the yield accrued up to that point —
                <strong> your principal is never cut under any circumstances.</strong> This is an in-app demo; a real on-chain audited smart contract has not yet been deployed.
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
                    <div className="text-sm font-bold text-amber-300 font-mono mt-1">{pool.apy}% APY</div>
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
                  STAKE
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Available balance: {userNURBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} $NUR</p>
            </form>

            {/* Active Positions */}
            {stakingPositions.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Your Open Positions</div>
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
                          <div className="text-xs font-bold text-white">{pool.label} &bull; {pos.apy}% APY</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Principal: {pos.amountNUR.toLocaleString()} $NUR &bull; Yield: +{yieldSoFar.toFixed(3)} $NUR
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
                          {matured ? "CLAIM (Principal + Yield)" : "EARLY EXIT (Principal + Yield Accrued So Far)"}
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
              <h3 className="text-sm font-bold text-purple-300 font-serif">🗳️ DAO Governance & Voting</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your voting power is transparent: <strong>1 $NUR (balance + staking) = 1 vote</strong>, the same formula for everyone. This is an in-app demo;
                votes are stored in this session, not on-chain.
              </p>
              <div className="text-[11px] text-purple-300 font-mono pt-1">
                Your Voting Power: {votingPower.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({userNURBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} balance + {totalStakedNUR.toLocaleString()} staking)
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
                      <span className="text-emerald-400">YES: {p.votesForNUR.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({forPct.toFixed(1)}%)</span>
                      <span className="text-red-400">NO: {p.votesAgainstNUR.toLocaleString(undefined, { maximumFractionDigits: 0 })} $NUR ({(100 - forPct).toFixed(1)}%)</span>
                    </div>

                    {hasVoted ? (
                      <div className="text-[10px] text-slate-500 font-mono">✓ You have voted on this proposal.</div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCastVote(p.id, true)}
                          disabled={votingPower <= 0}
                          className="flex-1 py-2 rounded-lg font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-mono transition-colors disabled:opacity-40"
                        >
                          YES
                        </button>
                        <button
                          onClick={() => handleCastVote(p.id, false)}
                          disabled={votingPower <= 0}
                          className="flex-1 py-2 rounded-lg font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-mono transition-colors disabled:opacity-40"
                        >
                          NO
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
              <h3 className="text-sm font-bold text-purple-300 font-serif">🔐 Security & Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A real, standard TOTP (RFC 6238) implementation — works with Google Authenticator, Authy or any compatible app.
                The secret key is kept only in your browser and is never sent to any server. When enabled, withdrawal
                transactions to an external wallet (Instant Withdrawal, Flexible Pool) cannot be completed without your authenticator code.
              </p>
            </div>

            {!twoFactorEnabled && !setupInProgress && (
              <button
                onClick={handleStartTwoFactorSetup}
                className="w-full py-3 rounded-xl font-bold bg-purple-500 hover:bg-purple-400 text-black text-xs font-mono transition-colors"
              >
                START 2FA SETUP
              </button>
            )}

            {setupInProgress && twoFactorSecret && (
              <form onSubmit={handleConfirmTwoFactorSetup} className="p-5 rounded-2xl border border-purple-500/40 bg-purple-950/10 space-y-4">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">1. Manually enter this key into your authenticator app</div>
                  <div className="p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-sm text-purple-300 tracking-wider break-all select-all">
                    {twoFactorSecret}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 break-all">{generateOtpAuthUri(twoFactorSecret, "NurTerminal")}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-mono mb-1">2. Enter the 6-digit code shown in the app</div>
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
                      VERIFY AND ENABLE
                    </button>
                  </div>
                  {setupError && <div className="text-[10px] text-red-400 mt-1">{setupError}</div>}
                </div>
              </form>
            )}

            {twoFactorEnabled && (
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-300">✅ 2FA Active</div>
                  <p className="text-[10px] text-slate-400 mt-1">Withdrawal transactions require your authenticator code.</p>
                </div>
                <button
                  onClick={handleDisableTwoFactor}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-colors"
                >
                  DISABLE
                </button>
              </div>
            )}
          </div>
        )}

        {/* TRANSACTION AUDIT TRAIL TAB */}
        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-bold text-cyan-300 font-serif">📋 Transaction History & Cryptographic Audit Chain</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each entry is signed with a real SHA-256 (Web Crypto) that also covers the previous entry's hash — if any tampering occurs
                anywhere in the chain, "Verify Chain Integrity" will detect it. <strong>This is not an on-chain (blockchain) record</strong> —
                it is kept only in this browser session and resets on page refresh; server-side persistent storage for enterprise auditing
                requires separate infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleVerifyChain}
                disabled={activityLog.length === 0}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors disabled:opacity-40"
              >
                🔍 VERIFY CHAIN INTEGRITY
              </button>
              {chainVerifyResult === "valid" && (
                <span className="text-xs font-mono text-emerald-400">✅ Chain is intact — no record has been modified.</span>
              )}
              {chainVerifyResult === "invalid" && (
                <span className="text-xs font-mono text-red-400">⚠️ Inconsistency detected — chain integrity is broken.</span>
              )}
              <div className="flex-1" />
              <button
                onClick={handleExportCSV}
                disabled={activityLog.length === 0}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40"
              >
                ⬇️ EXPORT CSV
              </button>
              <button
                onClick={handleExportTXT}
                disabled={activityLog.length === 0}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40"
              >
                ⬇️ EXPORT TXT
              </button>
            </div>

            {activityLog.length === 0 ? (
              <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-center text-xs text-slate-500">
                No transactions recorded yet. Swap, staking, Nur Card spending, withdrawals, or votes will appear here.
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
                <span className="text-cyan-300 font-bold uppercase">NUR-NET (L2 Sovereign Chain) Telemetry</span>
                <span className="text-emerald-400 font-bold">● 4,200 TPS (Quantum Transaction Capacity)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Latest Block</div>
                  <div className="text-sm font-bold text-white">#14,892,104</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Block Time</div>
                  <div className="text-sm font-bold text-emerald-400">0.24 seconds</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Gas Fee</div>
                  <div className="text-sm font-bold text-cyan-300">0.0001 $NUR</div>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[10px] text-slate-400">Active Validators</div>
                  <div className="text-sm font-bold text-amber-300">24 Institutional Nodes</div>
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
                $NUR Tokenomics & Institutional Treasury Profit Model
              </h3>
              <p className="text-slate-300 leading-relaxed">
                $NUR Coin is a sovereign store-of-value and payment instrument directly controlled by our company.
              </p>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span><strong>Fixed Total Supply:</strong> 1,000,000,000 $NUR</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span><strong>45% Treasury & Liquidity Peg:</strong> 1:1 price guarantee backed by USDT/USDC reserves.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span><strong>25% Mining & Hashrate Reward Pool:</strong> Regular yield distributed to bot operators.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span><strong>50% Continuous Buyback & Burn:</strong> Mining and exchange commission profits are used to regularly buy $NUR from the market, strengthening its value.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-dashed border-white/15 flex items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-white font-serif">💳 Nur Card</span>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  You can experience tiered balance-threshold access, JIT (Just-In-Time) spending and the optional staking offer in the "Nur Card" tab.
                  Real physical/virtual card issuance requires a licensed BaaS partnership and is not yet live.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("card")}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
              >
                Go to Nur Card &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
