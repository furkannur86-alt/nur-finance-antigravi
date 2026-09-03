"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import EagleCrest from "@/components/ui/EagleCrest";

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
    title: "1. Dijital Cüzdanınızı Seçin ve Kurun",
    desc: "Güvenli ve gözetimsiz (non-custodial) bir cüzdan tercih edin. Masaüstü için MetaMask veya Rabby Wallet (Chrome/Brave eklentisi), mobil için Trust Wallet önerilir. Kurumsal güvenlik için Ledger veya Trezor gibi donanım cüzdanları idealdir.",
    tip: "Asla borsa hesap şifrenizi cüzdan şifresiyle aynı yapmayın.",
  },
  {
    step: 2,
    title: "2. 12/24 Kelimelik Gizli Kurtarma İfadesini (Seed Phrase) Saklayın",
    desc: "Cüzdan oluşturulduğunda verilen 12 veya 24 kelimelik kurtarma anahtarını fiziki olarak bir kağıda yazın. Bu ifadeyi asla bilgisayarda ekran görüntüsü olarak tutmayın, e-posta ile göndermeyin veya kimseyle paylaşmayın.",
    tip: "Bu kelimeler cüzdanınızın tek anahtarıdır.",
  },
  {
    step: 3,
    title: "3. Cüzdanınıza Bakiye (USDT / USDC) Yükleyin",
    desc: "Kullandığınız borsadan (ör. Binance, Kraken, OKX) cüzdanınızın genel adresine (0x... ile başlayan adres) USDT veya USDC çekimi yapın.",
    tip: "Düşük transfer ücreti için Polygon veya Arbitrum ağını tercih edebilirsiniz.",
  },
  {
    step: 4,
    title: "4. Doğru Ağı (Network) ve Adresi Seçin",
    desc: "Ödeme yapacağınız para birimi ve ağı (örneğin Polygon USDC) seçin. Çekim yaparken ağın gönderici ve alıcı tarafta birebir aynı olduğundan emin olun.",
    tip: "Ağ uyumsuzluğu durumunda transferler askıda kalabilir.",
  },
  {
    step: 5,
    title: "5. Transferi Gerçekleştirin ve TXID Kodunu Girin",
    desc: "Ödeme tutarını yukarıdaki kurum cüzdan adresimize gönderdikten sonra işlem özetinde yer alan İşlem Kodu (TXID / Transaction Hash) bilgisini forma yapıştırarak anonim erişimi anında aktif edin.",
    tip: "Terminaliniz blokzincir onayının ardından 60 saniye içinde otomatik açılır.",
  },
];

export default function DigitalWalletGateway() {
  const { addNotification, updateVerification } = useIDEStore();

  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork>(SUPPORTED_NETWORKS[1]);
  const [selectedPlan, setSelectedPlan] = useState<"R" | "B">("R");
  const [txHash, setTxHash] = useState("");
  const [isVerifyingTx, setIsVerifyingTx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"pay" | "guide" | "security">("pay");

  const planAmount = selectedPlan === "R" ? "100,000 USDT" : "100,000 USDT (VIP Verified)";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedNetwork.depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) return;

    setIsVerifyingTx(true);

    setTimeout(() => {
      setIsVerifyingTx(false);
      updateVerification({
        tier: selectedPlan === "R" ? "NUR_FINANCE_R" : "NUR_FINANCE_B",
        overallStatus: "VERIFIED",
        activatedAt: new Date().toISOString(),
      });

      addNotification({
        title: "Anonymous Wallet Payment Confirmed",
        message: `TXID verified on ${selectedNetwork.name}. Terminal tier [NUR Finance ${selectedPlan}] successfully activated.`,
        severity: "SUCCESS",
        category: "SETTLEMENT",
      });
      setTxHash("");
    }, 1200);
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
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400">
                ANONYMOUS &bull; ZERO-KNOWLEDGE
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Direct On-Chain Crypto Settlement &bull; No Personal Name Required &bull; Multi-Chain USDT/USDC Gateway
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
                  İşlem kodunuz girildikten sonra blokzincir tarayıcısı üzerinden anında doğrulanır ve terminal yetkiniz açılır.
                </span>
              </div>

              <button
                type="submit"
                disabled={isVerifyingTx || !txHash.trim()}
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
                NUR Terminal, özellikle kimlik paylaşımından kaçınmak isteyen Asya ve küresel kurumsal yatırımcılar için gözetimsiz Web3 cüzdan ödemelerini destekler. Aşağıdaki 5 adımı takip ederek 5 dakika içinde cüzdanınızı hazırlayabilirsiniz:
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
              <h3 className="text-sm font-bold text-white mb-2">Zero-Knowledge & Anonim Ödeme Mimarisi</h3>
              <p className="text-xs text-[var(--ag-muted)] leading-relaxed mb-3">
                NUR Finance kurumsal terminal mimarisinde, doğrudan blokzincir transferi gerçekleştiren müşteriler için hiçbir ad, soyad veya pasaport bilgisi talep edilmez.
              </p>
              <ul className="text-xs text-[var(--ag-muted)] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Adres Doğrulama:</strong> Ödeme sadece genel blokzincir işlem kodu (TXID) ile eşleştirilir.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Terminal Erişim Anahtarı:</strong> Cüzdan adresinize özel şifrelenmiş bir JWT oturum belirteci atanır.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                  <span><strong>Web Sitesi İzolasyonu:</strong> Bu özellik sadece yetkili NUR Terminal kullanıcı alanında geçerlidir, genel web sitesine yansıtılmaz.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
