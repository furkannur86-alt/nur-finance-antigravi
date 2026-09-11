"use client";

import { useState, useEffect } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";

// This module is deliberately NOT a gambling product: no randomized-outcome wagering,
// no house edge, no chance-based win/loss mechanic. It's a self-directed spending
// safeguard (velocity cap + opt-in cooldown, modeled on Monzo/Starling's "Gambling
// Block" pattern) paired with a plain recurring auto-invest (DCA) feature.

const DISABLE_COOLDOWN_HOURS = 48;

interface SafeAsset {
  symbol: string;
  name: string;
  historical6mReturn: string;
  riskProfile: "LOW_RISK" | "BALANCED" | "GROWTH";
  description: string;
}

const SAFE_ASSETS: SafeAsset[] = [
  {
    symbol: "SPY",
    name: "S&P 500 Index Fund",
    historical6mReturn: "+14.8%",
    riskProfile: "BALANCED",
    description: "Broad-based, low-cost index fund. Standard choice for long-term wealth accumulation.",
  },
  {
    symbol: "XAU/USD",
    name: "Physical Gold & Commodity Basket",
    historical6mReturn: "+18.6%",
    riskProfile: "LOW_RISK",
    description: "Low-volatility reserve asset providing traditional inflation protection.",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp",
    historical6mReturn: "+84.2%",
    riskProfile: "GROWTH",
    description: "Concentrated single-stock position with higher volatility growth exposure.",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    historical6mReturn: "+62.0%",
    riskProfile: "GROWTH",
    description: "High-volatility digital asset; suitable for accumulation through small, regular amounts.",
  },
];

interface OutflowLogEntry {
  id: string;
  amount: number;
  timestamp: number;
}

interface DcaLogEntry {
  id: string;
  amount: number;
  symbol: string;
  timestamp: number;
}

export default function TatarFinansPanel() {
  const { addNotification } = useIDEStore();

  // Balances
  const [availableBalanceUSDT, setAvailableBalanceUSDT] = useState(2500);
  const [protectedBalanceUSDT, setProtectedBalanceUSDT] = useState(18450);

  // Spending Velocity Protection (opt-in, user-controlled)
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [monthlyOutflowCapPercent, setMonthlyOutflowCapPercent] = useState(50);
  const [monthlyOutflowUsedUSDT, setMonthlyOutflowUsedUSDT] = useState(0);
  const [outflowLog, setOutflowLog] = useState<OutflowLogEntry[]>([]);
  const [outflowRequestAmount, setOutflowRequestAmount] = useState("500");
  const [disableRequestedAt, setDisableRequestedAt] = useState<number | null>(null);
  const [cooldownNow, setCooldownNow] = useState(() => Date.now());

  useEffect(() => {
    if (disableRequestedAt === null) return;
    const interval = setInterval(() => setCooldownNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [disableRequestedAt]);

  const monthlyOutflowCapUSDT = +((protectedBalanceUSDT + availableBalanceUSDT) * (monthlyOutflowCapPercent / 100)).toFixed(2);
  const monthlyOutflowRemaining = Math.max(0, monthlyOutflowCapUSDT - monthlyOutflowUsedUSDT);
  const cooldownRemainingMs = disableRequestedAt !== null ? Math.max(0, disableRequestedAt + DISABLE_COOLDOWN_HOURS * 3600 * 1000 - cooldownNow) : 0;
  const cooldownElapsed = disableRequestedAt !== null && cooldownRemainingMs === 0;

  const handleToggleProtection = () => {
    if (!protectionEnabled) {
      setProtectionEnabled(true);
      setDisableRequestedAt(null);
      addNotification({
        title: "🛡️ Spending Protection Enabled",
        message: `Monthly outflow cap set to ${monthlyOutflowCapPercent}%. To disable this protection, a ${DISABLE_COOLDOWN_HOURS}-hour cooldown applies to prevent impulsive decisions — you accept this in advance, by your own consent.`,
        severity: "SUCCESS",
        category: "SYSTEM",
      });
      return;
    }

    if (disableRequestedAt === null) {
      setDisableRequestedAt(Date.now());
      addNotification({
        title: "⏳ Protection Disable Request Received",
        message: `You can confirm disabling protection after ${DISABLE_COOLDOWN_HOURS} hours. This cooldown is an impulse-control mechanism you activated yourself in advance.`,
        severity: "WARNING",
        category: "SYSTEM",
      });
      return;
    }

    if (cooldownElapsed) {
      setProtectionEnabled(false);
      setDisableRequestedAt(null);
      addNotification({
        title: "🔓 Spending Protection Disabled",
        message: "Monthly outflow cap is no longer applied.",
        severity: "WARNING",
        category: "SYSTEM",
      });
    }
  };

  const handleRequestOutflow = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(outflowRequestAmount);
    if (isNaN(amount) || amount <= 0 || amount > availableBalanceUSDT) return;

    if (protectionEnabled && amount > monthlyOutflowRemaining) {
      addNotification({
        title: "🛡️ Monthly Cap Exceeded",
        message: `Your remaining outflow allowance this month is ${monthlyOutflowRemaining.toFixed(2)} USDT. This is your own protection setting — adjust the cap percentage below if you want to increase it.`,
        severity: "WARNING",
        category: "SYSTEM",
      });
      return;
    }

    setAvailableBalanceUSDT((v) => v - amount);
    setMonthlyOutflowUsedUSDT((v) => v + amount);
    setOutflowLog((prev) => [{ id: `out-${Date.now()}`, amount, timestamp: Date.now() }, ...prev]);
    addNotification({
      title: "✅ Outflow Approved",
      message: `${amount.toLocaleString()} USDT withdrawn from your account. No hidden delays or deductions applied.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const handleMoveToProtected = (amount: number) => {
    if (amount <= 0 || amount > availableBalanceUSDT) return;
    setAvailableBalanceUSDT((v) => v - amount);
    setProtectedBalanceUSDT((v) => v + amount);
    addNotification({
      title: "🔒 Moved to Protected Balance",
      message: `${amount.toLocaleString()} USDT moved to protected balance, which is not subject to the monthly spending velocity cap.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  // Automated DCA (Dollar-Cost Averaging) into a chosen safe/growth asset
  const [dcaEnabled, setDcaEnabled] = useState(false);
  const [dcaAmount, setDcaAmount] = useState(100);
  const [dcaFrequency, setDcaFrequency] = useState<"weekly" | "monthly">("monthly");
  const [dcaTarget, setDcaTarget] = useState<SafeAsset>(SAFE_ASSETS[0]);
  const [dcaLog, setDcaLog] = useState<DcaLogEntry[]>([]);

  const handleToggleDca = () => {
    setDcaEnabled((prev) => {
      const next = !prev;
      addNotification({
        title: next ? "📈 Auto-Investment (DCA) Enabled" : "⏸️ Auto-Investment Paused",
        message: next
          ? `Every ${dcaFrequency === "weekly" ? "week" : "month"}, ${dcaAmount} USDT will be automatically invested from your protected balance into ${dcaTarget.symbol}.`
          : "Auto-investment plan paused.",
        severity: "INFO",
        category: "SYSTEM",
      });
      return next;
    });
  };

  const handleRunDcaNow = () => {
    if (!dcaEnabled || dcaAmount > protectedBalanceUSDT) return;
    setProtectedBalanceUSDT((v) => v - dcaAmount);
    setDcaLog((prev) => [{ id: `dca-${Date.now()}`, amount: dcaAmount, symbol: dcaTarget.symbol, timestamp: Date.now() }, ...prev]);
    addNotification({
      title: "📈 DCA Executed (Manual Trigger — Demo)",
      message: `${dcaAmount} USDT invested into ${dcaTarget.symbol}. Actual scheduled execution will be ${dcaFrequency === "weekly" ? "weekly" : "monthly"}.`,
      severity: "SUCCESS",
      category: "SETTLEMENT",
    });
  };

  const totalDcaInvested = dcaLog.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Banner */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={34} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-amber-300 font-serif">
                TATAR FINANS — Impulse Spending Protection & Automated Investment
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OPT-IN &bull; NOT GAMBLING
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Monthly Spending Velocity Cap &bull; Self-Consented Cooldown Period &bull; Automated DCA Investment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-black/40 border border-cyan-500/30">
            <span className="text-[10px] text-cyan-400 block font-sans uppercase">💳 Available Balance</span>
            <span className="text-sm font-bold text-white">{availableBalanceUSDT.toLocaleString()} USDT</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-black/40 border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 block font-sans uppercase">🔒 Protected Balance</span>
            <span className="text-sm font-bold text-emerald-300">{protectedBalanceUSDT.toLocaleString()} USDT</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* LEFT: Spending Velocity Protection */}
        <div className="flex-1 flex flex-col border-r overflow-y-auto p-5 space-y-4" style={{ borderColor: "var(--ag-border)" }}>
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10 space-y-1">
            <h3 className="text-sm font-bold text-amber-300 font-serif">🛡️ Spending Velocity Protection</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Entirely optional. When enabled, you set your own monthly cap on how much can be withdrawn from your available balance.
              Disabling protection takes {DISABLE_COOLDOWN_HOURS} hours — this is a safeguard you activate in advance against yourself,
              not the company holding you back.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-white">Protection Status</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {protectionEnabled ? `Active — Monthly cap ${monthlyOutflowCapPercent}%` : "Disabled"}
                </div>
              </div>
              <button
                onClick={handleToggleProtection}
                disabled={protectionEnabled && disableRequestedAt !== null && !cooldownElapsed}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors disabled:opacity-40 ${
                  protectionEnabled
                    ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                }`}
              >
                {!protectionEnabled
                  ? "ENABLE PROTECTION"
                  : disableRequestedAt === null
                  ? "REQUEST DISABLE"
                  : cooldownElapsed
                  ? "CONFIRM & DISABLE"
                  : `${Math.ceil(cooldownRemainingMs / 3600000)} HRS REMAINING`}
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Monthly Outflow Cap</span>
                <span className="text-amber-300 font-bold">{monthlyOutflowCapPercent}% ({monthlyOutflowCapUSDT.toLocaleString()} USDT)</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={monthlyOutflowCapPercent}
                onChange={(e) => setMonthlyOutflowCapPercent(parseInt(e.target.value, 10))}
                className="w-full accent-amber-400"
              />
              <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                  style={{ width: `${monthlyOutflowCapUSDT > 0 ? Math.min(100, (monthlyOutflowUsedUSDT / monthlyOutflowCapUSDT) * 100) : 0}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Used this month: {monthlyOutflowUsedUSDT.toFixed(2)} / {monthlyOutflowCapUSDT.toLocaleString()} USDT
              </div>
            </div>
          </div>

          {/* Outflow Request Form */}
          <form onSubmit={handleRequestOutflow} className="p-5 rounded-2xl border border-white/10 bg-black/50 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase">Outflow Request</h4>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={outflowRequestAmount}
                onChange={(e) => setOutflowRequestAmount(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-black/70 border border-white/20 text-sm font-mono font-bold text-white focus:outline-none"
              />
              <span className="text-xs text-slate-400 font-mono shrink-0">USDT</span>
              <button
                type="submit"
                disabled={parseFloat(outflowRequestAmount || "0") <= 0 || parseFloat(outflowRequestAmount || "0") > availableBalanceUSDT}
                className="px-4 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono transition-colors disabled:opacity-40"
              >
                WITHDRAW
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleMoveToProtected(parseFloat(outflowRequestAmount || "0"))}
              disabled={parseFloat(outflowRequestAmount || "0") <= 0 || parseFloat(outflowRequestAmount || "0") > availableBalanceUSDT}
              className="w-full py-2 rounded-xl text-[11px] font-mono font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors disabled:opacity-40"
            >
              🔒 Move to Protected Balance Instead
            </button>
          </form>

          {outflowLog.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Outflow History</div>
              {outflowLog.slice(0, 5).map((e) => (
                <div key={e.id} className="flex justify-between text-[11px] font-mono p-2 rounded bg-black/40">
                  <span className="text-slate-300">{new Date(e.timestamp).toLocaleString()}</span>
                  <span className="text-red-400">-{e.amount.toLocaleString()} USDT</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Automated DCA */}
        <div className="w-[420px] flex flex-col p-5 bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-y-auto space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
            <span className="text-xs font-bold text-emerald-300 uppercase flex items-center gap-1.5">
              📈 Auto-Investment (DCA)
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Automatically invest small, regular amounts from your protected balance into your chosen asset (dollar-cost averaging).
              There is no random win/loss mechanic — this is an investment plan, not a wager.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Plan Status</span>
              <button
                onClick={handleToggleDca}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  dcaEnabled
                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {dcaEnabled ? "STOP" : "START"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Amount (USDT)</label>
                <input
                  type="number"
                  value={dcaAmount}
                  onChange={(e) => setDcaAmount(Math.max(1, Number(e.target.value)))}
                  disabled={dcaEnabled}
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none disabled:opacity-40"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Frequency</label>
                <select
                  value={dcaFrequency}
                  onChange={(e) => setDcaFrequency(e.target.value as "weekly" | "monthly")}
                  disabled={dcaEnabled}
                  className="w-full p-2 rounded bg-black/60 border border-white/10 text-xs font-mono text-white focus:outline-none disabled:opacity-40"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {dcaEnabled && (
              <button
                onClick={handleRunDcaNow}
                disabled={dcaAmount > protectedBalanceUSDT}
                className="w-full py-2 rounded-lg text-[11px] font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors disabled:opacity-40"
              >
                Run Now (Manual Trigger — Demo)
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase block">Target Asset:</label>
            <div className="space-y-1.5">
              {SAFE_ASSETS.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => !dcaEnabled && setDcaTarget(s)}
                  className={`p-2.5 rounded-lg border transition-all ${dcaEnabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
                    dcaTarget.symbol === s.symbol ? "bg-emerald-950/30 border-emerald-500/50" : "bg-black/30 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-bold text-white">{s.symbol} — {s.name}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">{s.historical6mReturn} (6M)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {dcaLog.length > 0 && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Auto-Invested:</span>
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--ag-muted)]">{dcaLog.length} transaction(s)</span>
                <span className="font-mono font-bold text-emerald-400">{totalDcaInvested.toLocaleString()} USDT</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
