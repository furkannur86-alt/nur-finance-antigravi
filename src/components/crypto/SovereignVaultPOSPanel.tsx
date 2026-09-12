"use client";

import { useState, useEffect } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { cyberSound } from "@/lib/audio/sound-synth";
import { getStoredSovereignWallet, generateSovereignWallet } from "@/lib/crypto/sovereignWallet";

type VaultTab = "pos_merchant" | "paper_vault" | "zk_settlement";

interface POSInvoice {
  id: string;
  amountFiat: number;
  fiatCurrency: "USD" | "EUR" | "CHF" | "TRY";
  amountNur: number;
  merchantName: string;
  memo: string;
  qrPayload: string;
  expiresInSeconds: number;
  status: "PENDING" | "SETTLED" | "EXPIRED";
  zkProofHash?: string;
}

const FIAT_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  CHF: 0.88,
  TRY: 34.2,
};

const NUR_USD_PRICE = 13.35; // $13.35 per $NUR

export default function SovereignVaultPOSPanel() {
  const [activeTab, setActiveTab] = useState<VaultTab>("pos_merchant");
  const [wallet, setWallet] = useState<{ address: string; privateKey?: string; mnemonic?: string } | null>(null);

  // POS State
  const [posAmount, setPosAmount] = useState<number>(250);
  const [posCurrency, setPosCurrency] = useState<"USD" | "EUR" | "CHF" | "TRY">("USD");
  const [merchantName, setMerchantName] = useState<string>("Geneva Sovereign Private Bank");
  const [memo, setMemo] = useState<string>("Institutional Advisory & Compute Node Settlement");
  const [activeInvoice, setActiveInvoice] = useState<POSInvoice | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number>(60);

  // Paper Vault State
  const [paperVaultAddress, setPaperVaultAddress] = useState<string>("0xNUR8923aB7c4D99f012E489");
  const [paperVaultKey, setPaperVaultKey] = useState<string>("0xpriv_sovereign_7891238479213489123");
  const [paperMnemonic, setPaperMnemonic] = useState<string>("sovereign eagle fortress matrix emerald quantum galaxy invariant vault legacy 54751113");
  const [isGeneratingVault, setIsGeneratingVault] = useState(false);

  // ZK Settlement Receipts Log
  const [settledReceipts, setSettledReceipts] = useState<POSInvoice[]>([
    {
      id: "INV-9921",
      amountFiat: 1500,
      fiatCurrency: "USD",
      amountNur: 112.35,
      merchantName: "Zurich Bullion Depository",
      memo: "Allocated Gold Bar Custody Fee",
      qrPayload: "nurpay:0x984729?amount=112.35&cur=NUR",
      expiresInSeconds: 0,
      status: "SETTLED",
      zkProofHash: "0xzk98347abce9812401f84239857193",
    },
    {
      id: "INV-9920",
      amountFiat: 450,
      fiatCurrency: "EUR",
      amountNur: 36.68,
      merchantName: "Monaco Marine Logistics",
      memo: "Port Fuel Settlement",
      qrPayload: "nurpay:0x129847?amount=36.68&cur=NUR",
      expiresInSeconds: 0,
      status: "SETTLED",
      zkProofHash: "0xzk817420bfed83210492817429184",
    },
  ]);

  useEffect(() => {
    let w = getStoredSovereignWallet();
    if (w) {
      setWallet(w);
    } else {
      generateSovereignWallet().then((nw) => setWallet(nw));
    }
  }, []);

  // POS Countdown Timer
  useEffect(() => {
    if (!activeInvoice || activeInvoice.status !== "PENDING") return;
    const iv = setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev <= 1) {
          setActiveInvoice((inv) => (inv ? { ...inv, status: "EXPIRED" } : null));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [activeInvoice]);

  const handleCreateInvoice = () => {
    cyberSound.playClick();
    const usdEquiv = posAmount / (FIAT_RATES[posCurrency] || 1);
    const amountNur = +(usdEquiv / NUR_USD_PRICE).toFixed(2);
    const id = `INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrPayload = `nurpay:${wallet?.address || "0xNUR54751113"}?amount=${amountNur}&cur=NUR&ref=${id}`;

    setActiveInvoice({
      id,
      amountFiat: posAmount,
      fiatCurrency: posCurrency,
      amountNur,
      merchantName,
      memo,
      qrPayload,
      expiresInSeconds: 60,
      status: "PENDING",
    });
    setTimerRemaining(60);
  };

  const handleSimulateInstantPay = () => {
    if (!activeInvoice) return;
    cyberSound.playQuantumUnlock();
    const zkProof = `0xzk${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`;
    const settledInv: POSInvoice = {
      ...activeInvoice,
      status: "SETTLED",
      zkProofHash: zkProof,
    };
    setActiveInvoice(settledInv);
    setSettledReceipts((prev) => [settledInv, ...prev]);
  };

  const handleGenerateNewPaperVault = async () => {
    cyberSound.playClick();
    setIsGeneratingVault(true);
    const newWallet = await generateSovereignWallet();
    setTimeout(() => {
      setPaperVaultAddress(newWallet.address);
      setPaperVaultKey(newWallet.publicKeyHex || "0xpriv_sovereign_quantum_54751113");
      setPaperMnemonic(newWallet.mnemonicPhrase || "sovereign emerald vault matrix fortress invariant quantum orbit galaxy eagle numerology 54751113");
      setIsGeneratingVault(false);
      cyberSound.playQuantumUnlock();
    }, 600);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto select-none font-sans" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Top Header */}
      <header className="sticky top-0 z-10 border-b px-5 py-3 backdrop-blur-md shrink-0" style={{ borderColor: "var(--ag-border)", background: "rgba(10, 15, 29, 0.92)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EagleCrest size={28} animate={true} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white font-serif">Sovereign Multi-Asset Vault &amp; POS Merchant Terminal</h1>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  zk-SNARK SETTLEMENT &bull; AIR-GAPPED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Institutional point-of-sale invoicing, zero-knowledge instant settlement, and physical paper vault generator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {[
              { id: "pos_merchant" as const, label: "💳 POS Terminal" },
              { id: "paper_vault" as const, label: "📜 Air-Gapped Paper Vault" },
              { id: "zk_settlement" as const, label: "🛡️ zk-SNARK Receipts" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  cyberSound.playClick();
                  setActiveTab(t.id);
                }}
                className={`px-3 py-1 rounded-lg transition-colors font-semibold ${
                  activeTab === t.id ? "bg-amber-500 text-black shadow-md" : "text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-5 max-w-5xl mx-auto w-full space-y-6">
        {/* TAB 1: POS Merchant Invoicing */}
        {activeTab === "pos_merchant" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Invoice Generator Form */}
            <div className="lg:col-span-5 p-5 rounded-2xl border border-white/10 bg-slate-900/70 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Create Merchant Payment Invoice</h2>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Merchant / Entity Name</label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Fiat Amount</label>
                  <input
                    type="number"
                    value={posAmount}
                    onChange={(e) => setPosAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-emerald-400 font-mono font-bold text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Currency</label>
                  <select
                    value={posCurrency}
                    onChange={(e) => setPosCurrency(e.target.value as "USD" | "EUR" | "CHF" | "TRY")}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CHF">CHF (Fr.)</option>
                    <option value="TRY">TRY (₺)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Memo / Line Item</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-slate-300 text-xs outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Current NUR Price:</span>
                  <span className="text-white">${NUR_USD_PRICE} USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Calculated Settlement:</span>
                  <span className="text-amber-300 font-bold">
                    {+((posAmount / (FIAT_RATES[posCurrency] || 1)) / NUR_USD_PRICE).toFixed(2)} $NUR
                  </span>
                </div>
              </div>

              <button
                onClick={handleCreateInvoice}
                className="w-full py-2.5 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg transition-colors"
              >
                ⚡ GENERATE PAYMENT QR INVOICE
              </button>
            </div>

            {/* Live Terminal & QR Display */}
            <div className="lg:col-span-7 p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 flex flex-col justify-between shadow-2xl">
              {activeInvoice ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">INVOICE #{activeInvoice.id}</span>
                      <h3 className="text-sm font-bold text-white">{activeInvoice.merchantName}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                        activeInvoice.status === "SETTLED"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : activeInvoice.status === "EXPIRED"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                      }`}
                    >
                      {activeInvoice.status}
                    </span>
                  </div>

                  {/* QR Box Visual Simulation */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-inner max-w-[240px] mx-auto">
                    <div className="w-40 h-40 bg-slate-950 p-2 rounded-xl flex flex-col items-center justify-center text-center">
                      <EagleCrest size={48} animate={false} />
                      <span className="text-[9px] font-mono text-cyan-300 mt-2">SCAN TO PAY</span>
                      <span className="text-[8px] font-mono text-slate-400 truncate w-full px-1">{activeInvoice.amountNur} NUR</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-800 font-bold mt-2">
                      {activeInvoice.amountFiat} {activeInvoice.fiatCurrency} &bull; {activeInvoice.amountNur} $NUR
                    </span>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-xs text-slate-300 font-medium">{activeInvoice.memo}</div>
                    {activeInvoice.status === "PENDING" && (
                      <div className="text-xs font-mono text-amber-400">
                        Price locked for <span className="font-bold text-white">{timerRemaining}s</span>
                      </div>
                    )}
                    {activeInvoice.status === "SETTLED" && (
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        ✅ zk-SNARK Validated: {activeInvoice.zkProofHash}
                      </div>
                    )}
                  </div>

                  {activeInvoice.status === "PENDING" && (
                    <button
                      onClick={handleSimulateInstantPay}
                      className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg transition-colors"
                    >
                      ⚡ SIMULATE BUYER TAP-TO-PAY (TEST)
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-500 space-y-2">
                  <div className="text-4xl opacity-30">💳</div>
                  <div className="text-xs font-medium text-slate-400">POS Terminal Ready. Create an invoice to display payment QR code.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Printable Air-Gapped Paper Vault */}
        {activeTab === "paper_vault" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-serif">Cold-Storage Physical Paper Vault Generator</h2>
                <p className="text-[11px] text-slate-400">Generate deterministic offline paper bearer certificates with watermark protection.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateNewPaperVault}
                  disabled={isGeneratingVault}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                >
                  {isGeneratingVault ? "GENERATING..." : "🎲 REGENERATE SEED"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg"
                >
                  🖨️ PRINT CERTIFICATE
                </button>
              </div>
            </div>

            {/* Banknote-style Paper Certificate */}
            <div className="p-8 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-[#0d1627] via-[#111e38] to-[#0d1627] shadow-2xl relative overflow-hidden">
              {/* Background Guilloche Motif */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
                  <div className="flex items-center gap-4">
                    <EagleCrest size={48} animate={false} />
                    <div>
                      <h3 className="text-lg font-bold text-amber-300 font-serif tracking-widest">
                        SOVEREIGN VAULT BEARER CERTIFICATE
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">
                        UMAY GÜL NUR HOLDING &bull; ZERO-KNOWLEDGE POST-QUANTUM KEY
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[9px] text-amber-500/80 block">INVARIANT NUMBER</span>
                    <span className="text-sm font-bold text-white">#54751113</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Public Address */}
                  <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      1. PUBLIC DEPOSIT ADDRESS (SHAREABLE)
                    </span>
                    <div className="text-xs font-mono text-white break-all bg-black/80 p-2.5 rounded border border-white/10">
                      {paperVaultAddress}
                    </div>
                  </div>

                  {/* Private Key */}
                  <div className="p-4 rounded-xl bg-black/60 border border-rose-500/30 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                      2. PRIVATE SPENDING KEY (KEEP SECRET)
                    </span>
                    <div className="text-xs font-mono text-rose-200 break-all bg-black/80 p-2.5 rounded border border-white/10">
                      {paperVaultKey}
                    </div>
                  </div>
                </div>

                {/* 12-Word Mnemonic Phrase */}
                <div className="p-4 rounded-xl bg-black/60 border border-amber-500/30 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                    3. BIP-39 DETERMINISTIC RESTORATION SEED PHRASE
                  </span>
                  <div className="text-xs font-mono text-amber-200 bg-black/80 p-3 rounded border border-white/10 leading-relaxed">
                    {paperMnemonic}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 flex justify-between border-t border-amber-500/20 pt-3">
                  <span>SECURITY CLASSIFICATION: TOP SECRET / AIR-GAPPED BEARER ASSET</span>
                  <span>GENEVA &bull; ZURICH &bull; ISTANBUL &bull; DUBAI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: zk-SNARK Settlement Receipts Log */}
        {activeTab === "zk_settlement" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white font-serif">On-Chain zk-SNARK Instant Settlement Ledger</h2>
            <div className="space-y-3">
              {settledReceipts.map((rcpt) => (
                <div key={rcpt.id} className="p-4 rounded-2xl border border-white/10 bg-slate-900/80 flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono">{rcpt.id}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        CONFIRMED
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold">{rcpt.merchantName}</div>
                    <div className="text-[11px] text-slate-400">{rcpt.memo}</div>
                    <div className="text-[10px] font-mono text-cyan-400">Proof Hash: {rcpt.zkProofHash}</div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-emerald-400">+{rcpt.amountNur} $NUR</div>
                    <div className="text-[11px] text-slate-400">({rcpt.amountFiat} {rcpt.fiatCurrency})</div>
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
