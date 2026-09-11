"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";
import { updateMyTier } from "@/lib/auth/supabase-auth";

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
    title: "1. Choose and Set Up Your Digital Wallet",
    desc: "Select a secure, non-custodial Web3 wallet. MetaMask or Rabby Wallet (Chrome/Brave extension) is recommended for desktop, Trust Wallet for mobile, or hardware wallets like Ledger / Trezor for institutional-grade cold storage.",
    tip: "Never reuse exchange account passwords for your Web3 wallet.",
  },
  {
    step: 2,
    title: "2. Secure Your 12/24-Word Recovery Secret Phrase",
    desc: "Write down your secret seed recovery phrase physically on paper. Never store digital screenshots, send via email, or reveal your recovery phrase to anyone under any circumstances.",
    tip: "These words represent the single master key to your digital assets.",
  },
  {
    step: 3,
    title: "3. Fund Your Wallet with Stablecoins (USDT / USDC)",
    desc: "Withdraw USDT or USDC from your primary exchange (e.g. Binance, Kraken, Coinbase) directly to your public Web3 wallet address (starting with 0x...).",
    tip: "Use Polygon or Arbitrum networks for ultra-low transaction gas fees.",
  },
  {
    step: 4,
    title: "4. Select the Matching Network and Vault Address",
    desc: "Select the currency and network (e.g. Polygon USDC). Ensure the destination network matches the sender network exactly prior to initiating transfer.",
    tip: "Mismatched blockchain networks may cause permanent loss of funds.",
  },
  {
    step: 5,
    title: "5. Execute Transfer and Submit TXID Hash",
    desc: "Send the settlement amount to our corporate vault address above and paste your Transaction Hash (TXID) into the field to activate instant terminal access.",
    tip: "Terminal access is provisioned automatically within 60 seconds upon network confirmation.",
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

  const planAmount = selectedPlan === "R" ? "100,000 USDT" : "100,000 USDT (VIP Verified)";
  const selectedTierId = selectedPlan === "R" ? "NUR_FINANCE_R" : "NUR_FINANCE_B";

  // This gateway only collects payment. Eligibility (Reuters/Bloomberg history +
  // leadership invitation for Tier B) must already have cleared the Verification
  // Portal — payment can never be used to bypass that eligibility check.
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
        // Best-effort persistence to the signed-in user's real profile row. Silently
        // no-ops if Supabase isn't configured or no one is signed in — the app still
        // works purely from in-memory state either way.
        updateMyTier(selectedTierId).catch(() => {});
        addNotification({
          title: "Ödeme Zincir Üzerinde Doğrulandı",
          message: `${selectedNetwork.name} üzerindeki işlem doğrulandı. NUR Finance ${selectedPlan} terminal erişimi aktifleştirildi.`,
          severity: "SUCCESS",
          category: "SETTLEMENT",
        });
        setTxHash("");
      } else if (result.status === "UNVERIFIABLE") {
        updateVerification({ tier: selectedTierId, overallStatus: "UNDER_REVIEW" });
        addNotification({
          title: "Ödeme İncelemeye Alındı",
          message: `Otomatik zincir doğrulaması şu an kullanılamıyor (${result.detail}). Uyum ekibimiz işlemi manuel olarak inceleyecek.`,
          severity: "WARNING",
          category: "COMPLIANCE",
        });
      } else {
        addNotification({
          title: "Ödeme Doğrulanamadı",
          message: result.detail || "İşlem zincir üzerinde doğrulanamadı.",
          severity: "CRITICAL",
          category: "COMPLIANCE",
        });
      }
    } catch {
      addNotification({
        title: "Doğrulama Hatası",
        message: "Doğrulama servisine ulaşılamadı. Lütfen tekrar deneyin veya destek ile iletişime geçin.",
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
                KYC/AML UYUMLU &bull; KİMLİK DOĞRULAMALI
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Zincir Üzerinde Doğrulanmış Kripto Ödeme &bull; Kimlik Bilgisi Gerekli &bull; Multi-Chain USDT/USDC Gateway
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
            Ödeme ve Transfer
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "guide"
                ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Cüzdan Açma & Fonlama Rehberi
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "security"
                ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                : "text-[var(--ag-muted)] hover:text-white"
            }`}
          >
            Gizlilik ve Güvenlik Protokolü
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* PAYMENT TAB */}
        {activeTab === "pay" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-5">
            {/* Sovereign Desktop Wallet Vault Mode — Active for Desktop App / Furkan */}
            <div className="p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/50 via-slate-950 to-black space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-xl">
                    🦊
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 font-serif">Polygon Web3 & MetaMask Contract Gateway</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Official Smart Contract: 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7</p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    try {
                      const { connectWeb3Wallet } = await import("@/lib/web3/web3-contract-service");
                      const res = await connectWeb3Wallet();
                      addNotification({
                        title: "Web3 Cüzdan Bağlandı",
                        message: `Adres: ${res.address.slice(0, 6)}...${res.address.slice(-4)} | Bakiye: ${parseFloat(res.balanceNur).toFixed(2)} NUR`,
                        severity: "SUCCESS",
                        category: "SETTLEMENT",
                      });
                    } catch (err) {
                      addNotification({
                        title: "Cüzdan Bağlantı Hatası",
                        message: err instanceof Error ? err.message : "Cüzdan bağlanamadı",
                        severity: "CRITICAL",
                        category: "SETTLEMENT",
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-lg font-mono font-bold text-xs bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-lg hover:scale-[1.02]"
                >
                  🦊 Connect MetaMask Wallet
                </button>
              </div>
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <EagleCrest size={28} animate />
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                      FURKAN SOVEREIGN DESKTOP TREASURY & VAULT
                    </div>
                    <span className="text-sm font-bold text-white">
                      Masaüstü Özel Kurumsal Cüzdan Yönetim Merkezi
                    </span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Toplam Doğrulanmış Cüzdan Bakiyesi</span>
                  <span className="text-base font-bold text-emerald-400">$47,700,000 USDT</span>
                </div>
              </div>

              {/* Dynamic Connected Sovereign Wallets List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-amber-400 font-bold">COLD RESERVE</span>
                    <span className="text-emerald-400 font-bold">$25,000,000</span>
                  </div>
                  <div className="text-xs font-bold text-white">Furkan Sovereign Treasury</div>
                  <div className="text-[9px] font-mono text-slate-400 break-all">
                    0x742d35Cc6634C0532925a3b844Bc454e4438f44e
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Ağ: Ethereum (ERC-20)</div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">HOT LIQUIDITY</span>
                    <span className="text-emerald-400 font-bold">$8,500,000</span>
                  </div>
                  <div className="text-xs font-bold text-white">NUR Institutional Pool</div>
                  <div className="text-[9px] font-mono text-slate-400 break-all">
                    0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Ağ: Polygon / Arbitrum L2</div>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-purple-500/30 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-purple-400 font-bold">SOVEREIGN VAULT</span>
                    <span className="text-emerald-400 font-bold">$14,200,000</span>
                  </div>
                  <div className="text-xs font-bold text-white">Tatar Finans Shadow Reserve</div>
                  <div className="text-[9px] font-mono text-slate-400 break-all">
                    bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">Ağ: Bitcoin Native (SegWit)</div>
                </div>
              </div>
            </div>

            {/* AML/KYC Compliance Notice */}
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[11px] text-amber-200 leading-relaxed">
              &#9888; Bu, yüksek tutarlı (&euro;100K/yıl) kurumsal bir ödeme kanalıdır ve AML/KYC uyum politikamıza tabidir. Ad-soyad ve e-posta
              bilgileriniz kayıt altına alınır, ödemeler zincir üzerinde bağımsız olarak doğrulanır ve gerektiğinde uyum ekibimiz tarafından
              manuel incelemeye alınabilir.
            </div>

            {/* Eligibility Gate */}
            {!isEligible && (
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-950/20 flex items-center justify-between gap-4">
                <p className="text-xs text-red-300 leading-relaxed">
                  Ödeme yapmadan önce seçtiğiniz katman için ön koşulları (kullanım geçmişi{selectedPlan === "B" ? " ve davet kodu" : ""})
                  Doğrulama Portalı üzerinden tamamlamanız gerekir.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveView("verification-portal")}
                  className="px-3 py-1.5 rounded text-xs font-bold bg-red-400 hover:bg-red-300 text-black shrink-0 transition-colors"
                >
                  Doğrulama Portalı &rarr;
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
                  <span className="text-[var(--ag-accent)] font-mono">100,000 USDT / Yıl</span>
                </div>
                <p className="text-[11px] text-[var(--ag-muted)]">
                  Reuters Eikon muadili tam teşekküllü terminal. İsimsiz, doğrudan cüzdandan ödeme.
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
                  <span className="text-[var(--ag-accent2)] font-mono">100,000 USDT / Yıl</span>
                </div>
                <p className="text-[11px] text-[var(--ag-muted)]">
                  Bloomberg Terminal muadili amiral gemisi. Doğrulanmış VIP davetiye ile anında açılır.
                </p>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="text-[11px] font-semibold text-[var(--ag-muted)] uppercase block mb-1.5">
                Ödeme Ağı (Blokzincir Seçimi)
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
                          ÖNERİLEN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--ag-accent)] mt-0.5">{net.currency}</div>
                    <div className="text-[9px] text-[var(--ag-muted)] mt-0.5">Ücret: {net.feeEstimate}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Address & QR Code Box */}
            <div className="p-5 rounded-lg border bg-black/40 space-y-3" style={{ borderColor: "var(--ag-border)" }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">
                  Kurumsal Transfer Adresi ({selectedNetwork.name})
                </span>
                <span className="text-[10px] text-[var(--ag-accent)] font-mono">Tutar: {planAmount}</span>
              </div>

              {/* Copyable Address Bar */}
              <div className="flex items-center gap-2 p-2 rounded bg-black/60 border border-[var(--ag-border)] font-mono text-xs text-emerald-300 break-all">
                <span className="flex-1 select-all">{selectedNetwork.depositAddress}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="px-3 py-1 rounded bg-[var(--ag-accent)] text-black font-bold text-xs shrink-0 transition-colors hover:bg-[var(--ag-accent)]/80"
                >
                  {copied ? "KOPYALANDI!" : "KOPYALA"}
                </button>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[var(--ag-muted)] font-mono">
                <span>&bull; Gerekli Onay: {selectedNetwork.confirmationsRequired} blok</span>
                <span>&bull; Minimum Yatırma: 1,000 USDT</span>
                <span>&bull; Otomatik Tanıma: Aktif</span>
              </div>
            </div>

            {/* TXID Submission Form */}
            <form onSubmit={handleVerifyPayment} className="p-5 rounded-lg border bg-black/40 space-y-3" style={{ borderColor: "var(--ag-border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Fatura/uyum kaydı için tam ad"
                    required
                    className="w-full p-2.5 rounded text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                    style={{ borderColor: "var(--ag-border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Kurumsal E-posta</label>
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
                  İşlem Kodu (TXID / Transaction Hash)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Transfer sonrası aldığınız 0x... işlem kodunu buraya yapıştırın"
                  className="w-full p-2.5 rounded text-xs bg-black/60 border text-white font-mono focus:outline-none focus:border-[var(--ag-accent)]"
                  style={{ borderColor: "var(--ag-border)" }}
                />
                <span className="text-[10px] text-[var(--ag-muted)] mt-1 block">
                  İşlem kodunuz girildikten sonra blokzincir tarayıcısı üzerinden bağımsız olarak doğrulanır. Otomatik doğrulama başarısız
                  olursa işleminiz uyum ekibimiz tarafından manuel incelemeye alınır — anında onay garanti edilmez.
                </span>
              </div>

              <button
                type="submit"
                disabled={isVerifyingTx || !txHash.trim() || !fullName.trim() || !email.trim() || !isEligible}
                className="w-full py-3 rounded text-xs font-bold uppercase tracking-wider bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black transition-all disabled:opacity-40 shadow-lg shadow-[rgba(0,212,170,0.15)]"
              >
                {isVerifyingTx ? "BLOKZİNCİR DOĞRULANIYOR..." : "ÖDEMEYİ DOĞRULA VE TERMİNALİ AÇ"}
              </button>
            </form>
          </div>
        )}

        {/* GUIDE TAB */}
        {activeTab === "guide" && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-lg border bg-black/30 mb-4" style={{ borderColor: "var(--ag-border)" }}>
              <h3 className="text-sm font-bold text-[var(--ag-accent)] mb-1">
                Adım Adım Dijital Cüzdan Kurulum ve Fonlama Kılavuzu
              </h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                NUR Terminal, küresel kurumsal yatırımcılar için Web3 cüzdanından doğrudan ödemeyi destekler (KYC/AML kimlik bilgisi ile birlikte).
                Aşağıdaki 5 adımı takip ederek 5 dakika içinde cüzdanınızı hazırlayabilirsiniz:
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
                    &bull; Güvenlik İpucu: {s.tip}
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
              <h3 className="text-sm font-bold text-white mb-2">KYC/AML Uyumlu Ödeme Mimarisi</h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed mb-3">
                Bu kurumsal ödeme kanalı, yürürlükteki AML/KYC yükümlülüklerine tabidir. Ad-soyad ve e-posta bilgisi her ödemede zorunludur;
                işlemler blokzincir üzerinde bağımsız olarak doğrulanır ve uyum ekibi tarafından denetlenebilir.
              </p>
              <ul className="text-xs text-[var(--ag-muted)] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Ödeme Doğrulama:</strong> Her TXID, beklenen adrese ve tutara karşı zincir üzerinde bağımsız olarak kontrol edilir.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Terminal Erişim Anahtarı:</strong> Cüzdan adresinize özel şifrelenmiş bir JWT oturum belirteci atanır.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Manuel İnceleme:</strong> Otomatik doğrulama başarısız olursa işlem, kimliğiniz ve ödeme kaydınızla birlikte uyum ekibine düşer.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
