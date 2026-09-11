"use client";

import { useState, useCallback } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { updateMyTier } from "@/lib/auth/supabase-auth";

// window.ethereum type augmentation
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

interface CryptoNetwork {
  id: string;
  name: string;
  currency: string;
  depositAddress: string;
  feeEstimate: string;
  confirmationsRequired: number;
  qrCodeUrl?: string;
  recommended?: boolean;
}

const SUPPORTED_NETWORKS: CryptoNetwork[] = [
  {
    id: "eth-usdt",
    name: "Ethereum (ERC-20)",
    currency: "USDT / USDC",
    depositAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    feeEstimate: "~$3 - $8 (Gas)",
    confirmationsRequired: 12,
  },
  {
    id: "polygon-usdc",
    name: "Polygon (POS)",
    currency: "USDC (Native)",
    depositAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    feeEstimate: "< $0.05",
    confirmationsRequired: 64,
    recommended: true,
  },
  {
    id: "arbitrum-usdc",
    name: "Arbitrum One (L2)",
    currency: "USDC.e / USDT",
    depositAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    feeEstimate: "~$0.15",
    confirmationsRequired: 20,
    recommended: true,
  },
  {
    id: "tron-usdt",
    name: "TRON (TRC-20)",
    currency: "USDT",
    depositAddress: "TYas89kL4nM2xW9vQeR1t7u8i9o0p1a2s3",
    feeEstimate: "~$1.50",
    confirmationsRequired: 19,
  },
  {
    id: "btc-native",
    name: "Bitcoin (Native SegWit)",
    currency: "BTC",
    depositAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    feeEstimate: "~$2.00",
    confirmationsRequired: 3,
  },
];

const WALLET_GUIDE_STEPS = [
  {
    step: 1,
    title: "1. Select and Set Up Your Digital Wallet",
    desc: "Choose a secure, non-custodial wallet. MetaMask or Rabby Wallet (Chrome/Brave extension) is recommended for desktop, Trust Wallet for mobile. Hardware wallets such as Ledger or Trezor are ideal for institutional-grade security.",
    tip: "Never use the same password for your exchange account and your wallet.",
  },
  {
    step: 2,
    title: "2. Secure Your 12/24-Word Secret Recovery Phrase (Seed Phrase)",
    desc: "When a wallet is created, write the 12 or 24-word recovery key physically on paper. Never keep this phrase as a screenshot on your computer, send it by email, or share it with anyone.",
    tip: "These words are the sole key to your wallet.",
  },
  {
    step: 3,
    title: "3. Fund Your Wallet (USDT / USDC)",
    desc: "Withdraw USDT or USDC from your exchange (e.g. Binance, Kraken, OKX) to your wallet's public address (the address starting with 0x...).",
    tip: "You can choose the Polygon or Arbitrum network for lower transfer fees.",
  },
  {
    step: 4,
    title: "4. Select the Correct Network and Address",
    desc: "Select the currency and network you will pay with (e.g. Polygon USDC). When withdrawing, make sure the network is exactly the same on both the sender and recipient sides.",
    tip: "Transfers may get stuck in case of network mismatch.",
  },
  {
    step: 5,
    title: "5. Complete the Transfer and Enter the TXID",
    desc: "After sending the payment amount to our institutional wallet address above, paste the Transaction ID (TXID / Transaction Hash) from the transaction summary into the form to instantly activate anonymous access.",
    tip: "Your terminal will automatically open within 60 seconds after blockchain confirmation.",
  },
];

export default function DigitalWalletGateway() {
  const { addNotification, updateVerification, verification, setActiveView } = useIDEStore();

  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork>(SUPPORTED_NETWORKS[1]);
  const [selectedPlan, setSelectedPlan] = useState<"R" | "B">("R");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isVerifyingTx, setIsVerifyingTx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"pay" | "guide" | "security">("pay");

  // MetaMask state
  const [mmAddress, setMmAddress] = useState<string | null>(null);
  const [mmBalance, setMmBalance] = useState<string | null>(null);
  const [mmConnecting, setMmConnecting] = useState(false);
  const [mmError, setMmError] = useState<string | null>(null);
  const [mmSending, setMmSending] = useState(false);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      setMmError("MetaMask not found. Please install the MetaMask extension.");
      return;
    }
    setMmConnecting(true);
    setMmError(null);
    try {
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      if (!accounts.length) throw new Error("No account found");
      const addr = accounts[0];
      setMmAddress(addr);

      const balHex = (await window.ethereum.request({ method: "eth_getBalance", params: [addr, "latest"] })) as string;
      const balWei = parseInt(balHex, 16);
      const balEth = (balWei / 1e18).toFixed(4);
      setMmBalance(balEth);

      addNotification({
        title: "MetaMask Connected",
        message: `Address: ${addr.slice(0, 6)}...${addr.slice(-4)} | ETH: ${balEth}`,
        severity: "SUCCESS",
        category: "SETTLEMENT",
      });
    } catch (e) {
      setMmError(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setMmConnecting(false);
    }
  }, [addNotification]);

  const sendViaMetaMask = useCallback(async () => {
    if (!window.ethereum || !mmAddress) return;
    if (selectedNetwork.id === "btc-native" || selectedNetwork.id === "tron-usdt") {
      setMmError("This network is not compatible with MetaMask. Please transfer manually.");
      return;
    }
    setMmSending(true);
    setMmError(null);
    try {
      const AMOUNT_USDT_HEX = "0x0";
      const txHashResult = (await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: mmAddress,
            to: selectedNetwork.depositAddress,
            value: AMOUNT_USDT_HEX,
          },
        ],
      })) as string;
      setTxHash(txHashResult);
      addNotification({
        title: "Transaction Sent",
        message: `TXID auto-filled: ${txHashResult.slice(0, 10)}...`,
        severity: "SUCCESS",
        category: "SETTLEMENT",
      });
    } catch (e) {
      setMmError(e instanceof Error ? e.message : "Transaction cancelled");
    } finally {
      setMmSending(false);
    }
  }, [mmAddress, selectedNetwork, addNotification]);

  const planAmount = selectedPlan === "R" ? "100,000 USDT" : "100,000 USDT (VIP Verified)";
  const selectedTierId = selectedPlan === "R" ? "NUR_FINANCE_R" : "NUR_FINANCE_B";

  const isEligible = verification.tier === selectedTierId && verification.overallStatus !== "NOT_STARTED" && verification.overallStatus !== "REJECTED";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedNetwork.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim() || !fullName.trim() || !email.trim() || !isEligible) return;

    setIsVerifyingTx(true);

    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          networkId: selectedNetwork.id,
          txHash: txHash.trim(),
          expectedAddress: selectedNetwork.depositAddress,
          expectedMinAmount: 100000,
        }),
      });
      const result = await res.json();

      if (result.ok) {
        updateVerification({
          tier: selectedTierId,
          overallStatus: "VERIFIED",
          activatedAt: new Date().toISOString(),
        });
        updateMyTier(selectedTierId).catch(() => {});
        addNotification({
          title: "Payment Verified On-Chain",
          message: `Transaction on ${selectedNetwork.name} verified. NUR Finance ${selectedPlan} terminal access activated.`,
          severity: "SUCCESS",
          category: "SETTLEMENT",
        });
        setTxHash("");
      } else if (result.status === "UNVERIFIABLE") {
        updateVerification({ tier: selectedTierId, overallStatus: "UNDER_REVIEW" });
        addNotification({
          title: "Payment Under Review",
          message: `Automatic on-chain verification is currently unavailable (${result.detail}). Our compliance team will review the transaction manually.`,
          severity: "WARNING",
          category: "COMPLIANCE",
        });
      } else {
        addNotification({
          title: "Payment Could Not Be Verified",
          message: result.detail || "Transaction could not be verified on-chain.",
          severity: "CRITICAL",
          category: "COMPLIANCE",
        });
      }
    } catch {
      addNotification({
        title: "Verification Error",
        message: "Verification service unreachable. Please try again or contact support.",
        severity: "CRITICAL",
        category: "COMPLIANCE",
      });
    } finally {
      setIsVerifyingTx(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={32} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ag-accent)]">NUR Terminal Digital Wallet Settlement Gateway</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-400">
                KYC/AML COMPLIANT &bull; IDENTITY VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              On-Chain Verified Crypto Payment &bull; Identity Required &bull; Multi-Chain USDT/USDC Gateway
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab("pay")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "pay"
                ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Payment & Transfer
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "guide"
                ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Wallet Setup & Funding Guide
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "security"
                ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Privacy & Security Protocol
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* PAYMENT TAB */}
        {activeTab === "pay" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {/* AML/KYC Compliance Notice */}
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[11px] text-amber-200 leading-relaxed">
              &#9888; This is a high-value (&euro;100K/year) institutional payment channel subject to our AML/KYC compliance policy. Full name
              and email are recorded, payments are independently verified on-chain, and may be subject to manual review by our compliance team.
            </div>

            {/* MetaMask Connection Panel */}
            <div className="p-4 rounded-lg border bg-black/40 space-y-3" style={{ borderColor: "var(--ag-border)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 318.6 318.6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon fill="#E2761B" points="274.1,35.5 174.6,109.4 193,65.8"/>
                    <polygon fill="#E4761B" points="44.4,35.5 143.1,110.1 125.6,65.8"/>
                    <polygon fill="#D7C1B3" points="238.3,206.8 211.8,247.4 268.5,263 284.8,207.7"/>
                    <polygon fill="#D7C1B3" points="33.9,207.7 50.1,263 106.8,247.4 80.3,206.8"/>
                    <polygon fill="#D7C1B3" points="103.6,138.2 87.8,162.1 144.1,164.6 142.1,104.1"/>
                    <polygon fill="#D7C1B3" points="214.9,138.2 175.9,103.4 174.6,164.6 230.8,162.1"/>
                    <polygon fill="#233447" points="106.8,247.4 140.6,230.9 111.4,208.1"/>
                    <polygon fill="#233447" points="177.9,230.9 211.8,247.4 207.1,208.1"/>
                    <polygon fill="#CD6116" points="211.8,247.4 177.9,230.9 180.6,253 180.3,262.3"/>
                    <polygon fill="#CD6116" points="106.8,247.4 138.3,262.3 138.1,253 140.6,230.9"/>
                    <polygon fill="#E4751F" points="138.8,193.5 110.6,185.2 130.5,176.1"/>
                    <polygon fill="#E4751F" points="179.7,193.5 188.9,176.1 208.9,185.2"/>
                  </svg>
                  <span className="text-xs font-bold text-white">MetaMask Wallet Connection</span>
                  {mmAddress && (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                      CONNECTED
                    </span>
                  )}
                </div>
                {!mmAddress ? (
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    disabled={mmConnecting}
                    className="px-4 py-1.5 rounded text-xs font-bold bg-orange-500 hover:bg-orange-400 text-white transition-colors disabled:opacity-50"
                  >
                    {mmConnecting ? "Connecting..." : "Connect MetaMask"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setMmAddress(null); setMmBalance(null); }}
                    className="px-3 py-1 rounded text-[10px] font-bold bg-white/10 hover:bg-white/20 text-[var(--ag-muted)] transition-colors"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {mmAddress && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex-1 p-2 rounded bg-black/60 border border-[var(--ag-border)] text-emerald-300 truncate">
                      {mmAddress}
                    </div>
                    {mmBalance !== null && (
                      <span className="shrink-0 text-[var(--ag-accent)] font-bold">{mmBalance} ETH</span>
                    )}
                  </div>
                  {["eth-usdt", "polygon-usdc", "arbitrum-usdc"].includes(selectedNetwork.id) && (
                    <button
                      type="button"
                      onClick={sendViaMetaMask}
                      disabled={mmSending}
                      className="w-full py-2 rounded text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white transition-all disabled:opacity-50"
                    >
                      {mmSending ? "Waiting for MetaMask Signature..." : `Send via MetaMask on ${selectedNetwork.name} → Auto-fill TXID`}
                    </button>
                  )}
                  <p className="text-[10px] text-[var(--ag-muted)]">
                    When you click Send, MetaMask&apos;s transaction confirmation screen opens; after approval, the TXID is automatically pasted into the form below.
                  </p>
                </div>
              )}

              {mmError && (
                <div className="text-[10px] text-red-400 font-mono p-2 rounded bg-red-950/30 border border-red-500/30">
                  {mmError}
                </div>
              )}
            </div>

            {/* Eligibility Gate */}
            {!isEligible && (
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-950/20 flex items-center justify-between gap-4">
                <p className="text-xs text-red-300 leading-relaxed">
                  Before making payment, you must complete the prerequisites for your selected tier (usage history{selectedPlan === "B" ? " and invitation code" : ""}) through the Verification Portal.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView("verification-portal")}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-red-400 hover:bg-red-300 text-black shrink-0 transition-colors"
                >
                  Verification Portal &rarr;
                </button>
              </div>
            )}

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan("R")}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlan === "R"
                    ? "bg-[rgba(0,212,170,0.1)] border-[var(--ag-accent)] shadow-md"
                    : "bg-black/30 border-[var(--ag-border)] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>NUR Finance R (Reuters Tier)</span>
                  <span className="text-[var(--ag-accent)] font-mono">100,000 USDT / Year</span>
                </div>
                <p className="text-[11px] text-[var(--ag-muted)]">
                  Full-featured terminal equivalent to Reuters Eikon. Anonymous, direct wallet payment.
                </p>
              </div>

              <div
                onClick={() => setSelectedPlan("B")}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedPlan === "B"
                    ? "bg-[rgba(99,102,241,0.12)] border-[var(--ag-accent2)] shadow-md"
                    : "bg-black/30 border-[var(--ag-border)] opacity-70 hover:opacity-100"
                }`}
              >
                <div className="flex justify-between items-center text-xs font-bold mb-1">
                  <span>NUR Finance B (Bloomberg Tier - VIP)</span>
                  <span className="text-[var(--ag-accent2)] font-mono">100,000 USDT / Year</span>
                </div>
                <p className="text-[11px] text-[var(--ag-muted)]">
                  Flagship terminal equivalent to Bloomberg Terminal. Opens instantly with a verified VIP invitation.
                </p>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--ag-muted)] uppercase block mb-1.5">
                Payment Network (Blockchain Selection)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUPPORTED_NETWORKS.map((net) => (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={`p-2.5 rounded border text-left font-mono transition-all ${
                      selectedNetwork.id === net.id
                        ? "bg-[rgba(0,212,170,0.15)] border-[var(--ag-accent)] text-white"
                        : "bg-black/30 border-[var(--ag-border)] text-[var(--ag-muted)] hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>{net.name}</span>
                      {net.recommended && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-sans font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--ag-accent)] mt-0.5">{net.currency}</div>
                    <div className="text-[9px] text-[var(--ag-muted)] mt-0.5">Fee: {net.feeEstimate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Address & QR Code Box */}
            <div className="p-5 rounded-lg border bg-black/40 space-y-3" style={{ borderColor: "var(--ag-border)" }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">
                  Institutional Transfer Address ({selectedNetwork.name})
                </span>
                <span className="text-[10px] text-[var(--ag-accent)] font-mono">Amount: {planAmount}</span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-black/60 border border-[var(--ag-border)] font-mono text-xs text-emerald-300 break-all">
                <span className="flex-1 select-all">{selectedNetwork.depositAddress}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1 rounded bg-[var(--ag-accent)] text-black font-bold text-xs shrink-0 transition-colors hover:bg-[var(--ag-accent)]/80"
                >
                  {copied ? "COPIED!" : "COPY"}
                </button>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[var(--ag-muted)] font-mono">
                <span>&bull; Required Confirmations: {selectedNetwork.confirmationsRequired} blocks</span>
                <span>&bull; Minimum Deposit: 1,000 USDT</span>
                <span>&bull; Auto Detection: Active</span>
              </div>
            </div>

            {/* TXID Submission Form */}
            <form onSubmit={handleVerifyPayment} className="p-5 rounded-lg border bg-black/40 space-y-3" style={{ borderColor: "var(--ag-border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name for invoice/compliance record"
                    required
                    className="w-full p-2.5 rounded text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                    style={{ borderColor: "var(--ag-border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@institution.com"
                    required
                    className="w-full p-2.5 rounded text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                    style={{ borderColor: "var(--ag-border)" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">
                  Transaction ID (TXID / Transaction Hash)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Paste the 0x... transaction code received after transfer here"
                  className="w-full p-2.5 rounded text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                  style={{ borderColor: "var(--ag-border)" }}
                />
                <span className="text-[10px] text-[var(--ag-muted)] mt-1 block">
                  Your transaction ID is independently verified against the blockchain after entry. If automatic verification fails, your transaction will be manually reviewed by our compliance team — instant approval is not guaranteed.
                </span>
              </div>

              <button
                type="submit"
                disabled={isVerifyingTx || !txHash.trim() || !fullName.trim() || !email.trim() || !isEligible}
                className="w-full py-3 rounded text-xs font-bold uppercase tracking-wider bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black transition-all disabled:opacity-40 shadow-lg shadow-[rgba(0,212,170,0.15)]"
              >
                {isVerifyingTx ? "VERIFYING ON-CHAIN..." : "VERIFY PAYMENT & OPEN TERMINAL"}
              </button>
            </form>
          </div>
        )}

        {/* GUIDE TAB */}
        {activeTab === "guide" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-lg border bg-black/30 mb-4" style={{ borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-bold text-[var(--ag-accent)] mb-1">
                Step-by-Step Digital Wallet Setup and Funding Guide
              </h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                NUR Terminal supports direct Web3 wallet payment for global institutional investors (with KYC/AML identity). Follow the 5 steps below to set up your wallet in 5 minutes:
              </p>
            </div>

            <div className="space-y-3">
              {WALLET_GUIDE_STEPS.map((s) => (
                <div key={s.step} className="p-4 rounded-lg border bg-black/20" style={{ borderColor: "var(--ag-border)" }}>
                  <h4 className="text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--ag-accent)]/20 text-[var(--ag-accent)] flex items-center justify-center text-[10px] font-mono font-bold">
                      {s.step}
                    </span>
                    <span>{s.title}</span>
                  </h4>
                  <p className="text-xs text-[var(--ag-text)] leading-relaxed mb-2 pl-7">
                    {s.desc}
                  </p>
                  <div className="pl-7 text-[10px] text-[var(--ag-accent)] font-mono">
                    &bull; Security Tip: {s.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-lg border bg-black/30" style={{ borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-bold text-white mb-2">KYC/AML Compliant Payment Architecture</h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed mb-3">
                This institutional payment channel is subject to applicable AML/KYC obligations. Full name and email are required for every payment; transactions are independently verified on the blockchain and can be audited by the compliance team.
              </p>
              <ul className="text-xs text-[var(--ag-muted)] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Payment Verification:</strong> Every TXID is independently checked on-chain against the expected address and amount.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Terminal Access Key:</strong> An encrypted JWT session token is assigned specific to your wallet address.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Manual Review:</strong> If automatic verification fails, the transaction is forwarded to the compliance team along with your identity and payment record.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
