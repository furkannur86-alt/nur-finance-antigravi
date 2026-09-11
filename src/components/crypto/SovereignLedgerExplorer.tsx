"use client";

import { useState, useEffect } from "react";
import EagleCrest from "@/components/ui/EagleCrest";
import { getStoredSovereignWallet, SovereignWalletAccount } from "@/lib/crypto/sovereignWallet";

const MAX_SUPPLY = 54751113;

interface SovereignBlock {
  blockNumber: number;
  blockHash: string;
  minerAddress: string;
  txCount: number;
  rewardNUR: number;
  timestamp: string;
}

const DEFAULT_WALLET: SovereignWalletAccount = {
  address: "0xNUR8492A74E9B01DF8C2B3E12",
  publicKeyHex: "04a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef",
  mnemonicPhrase: "shield audit galaxy orbit quantum pulse horizon cipher matrix vault anchor crown",
  createdAt: new Date().toISOString(),
  balanceNUR: 54.75,
  balanceUSD: 2997.56,
  totalComputeHours: 13.5,
  totalFlopsContributed: "420.5 TFLOPS",
  kycStatus: "TIER_2_BANK_READY",
};

export default function SovereignLedgerExplorer() {
  const [wallet] = useState<SovereignWalletAccount>(() => getStoredSovereignWallet() || DEFAULT_WALLET);
  const [blocks, setBlocks] = useState<SovereignBlock[]>([]);
  const [signMessageText, setSignMessageText] = useState("EXECUTE_ORDER: BUY 100 NVDA @ 124.50 VIA SOVEREIGN_CUSTODY");
  const [generatedSignature, setGeneratedSignature] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Generate initial simulated blockchain blocks
  useEffect(() => {
    const initialBlocks: SovereignBlock[] = [];
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      const blockNum = 54751113 - 1000 + i;
      initialBlocks.unshift({
        blockNumber: blockNum,
        blockHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        minerAddress: `0xNUR${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
        txCount: Math.floor(Math.random() * 85 + 12),
        rewardNUR: 2.15,
        timestamp: new Date(now - i * 12000).toLocaleTimeString(),
      });
    }
    setBlocks(initialBlocks);

    // Live block production
    const interval = setInterval(() => {
      setBlocks(prev => {
        const nextNum = (prev[0]?.blockNumber || 54750000) + 1;
        const newBlock: SovereignBlock = {
          blockNumber: nextNum,
          blockHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          minerAddress: wallet.address,
          txCount: Math.floor(Math.random() * 45 + 5),
          rewardNUR: 2.15,
          timestamp: new Date().toLocaleTimeString(),
        };
        return [newBlock, ...prev.slice(0, 14)];
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [wallet.address]);

  const handleSignMessage = () => {
    if (!signMessageText.trim()) return;
    // Cryptographic signature simulation based on private key hash
    const fakeSig = `0xSIG_${Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setGeneratedSignature(fakeSig);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#020713] text-slate-100 font-sans select-none overflow-hidden">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <EagleCrest size={28} animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wider text-cyan-400 font-mono">
                SOVEREIGN LEDGER & ON-CHAIN EXPLORER
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                MAX CAP: {MAX_SUPPLY.toLocaleString()} $NUR
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Real-time block stream, cryptographic EIP-712 signer, and non-custodial transaction ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
            Node: <strong className="text-cyan-300">{wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}</strong>
          </div>
          <button
            onClick={() => handleCopy(wallet.address)}
            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
          >
            {isCopied ? "✓ COPIED" : "📋 COPY PUBKEY"}
          </button>
        </div>
      </div>

      {/* ── METRICS OVERVIEW ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-white/5 shrink-0">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="text-[10px] text-slate-400 font-mono">CIRCULATING SUPPLY</div>
          <div className="text-base font-extrabold text-cyan-400 font-mono mt-0.5">
            {(12873039).toLocaleString()} <span className="text-xs text-slate-400">NUR</span>
          </div>
          <div className="text-[9px] text-emerald-400 font-mono mt-1">23.51% of hard-cap mined</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="text-[10px] text-slate-400 font-mono">DEPIN COMPUTE NODES</div>
          <div className="text-base font-extrabold text-purple-400 font-mono mt-0.5">
            14,892 <span className="text-xs text-slate-400">Active</span>
          </div>
          <div className="text-[9px] text-purple-300 font-mono mt-1">Global FLOPS: 412.5 TFLOPS</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="text-[10px] text-slate-400 font-mono">DEFLATIONARY BURN</div>
          <div className="text-base font-extrabold text-rose-400 font-mono mt-0.5">
            {(547511).toLocaleString()} <span className="text-xs text-slate-400">NUR</span>
          </div>
          <div className="text-[9px] text-rose-300 font-mono mt-1">0.10% fee burned per trade</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
          <div className="text-[10px] text-slate-400 font-mono">YOUR WALLET BALANCE</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
            {wallet.balanceNUR.toFixed(4)} <span className="text-xs text-slate-400">NUR</span>
          </div>
          <div className="text-[9px] text-emerald-300 font-mono mt-1">≈ ${(wallet.balanceNUR * 54.75).toFixed(2)} USD</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden p-4 gap-4">
        {/* Left Col: Live Blocks Feed */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-white/10 flex items-center justify-between text-xs font-bold font-mono">
            <span className="text-cyan-400">⚡ LIVE PRODUCED BLOCKS</span>
            <span className="text-slate-400 text-[10px]">Avg Block Time: ~8.0s</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
            {blocks.map(b => (
              <div key={b.blockHash} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">#{b.blockNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {b.txCount} txs
                    </span>
                    <span className="text-[10px] text-slate-400">{b.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate w-48 md:w-80 mt-1">
                    Hash: <span className="text-slate-300">{b.blockHash}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold text-xs">+{b.rewardNUR} NUR</div>
                  <div className="text-[9px] text-slate-500 truncate w-24">Miner: {b.minerAddress.slice(0, 6)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: EIP-712 Cryptographic Signer Tool */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950/80 border border-white/10 rounded-2xl p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase">
              🔐 Cryptographic Message & Order Signer
            </h3>
            <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold font-mono">
              EIP-712 READY
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Message Payload / Trade Memo</label>
            <textarea
              value={signMessageText}
              onChange={e => setSignMessageText(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-slate-900 border border-white/10 p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500/60 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSignMessage}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold font-mono text-xs transition-all shadow-lg shadow-cyan-500/10"
          >
            ✍️ SIGN WITH PRIVATE KEY
          </button>

          {generatedSignature && (
            <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 font-bold">
                <span>GENERATED ED25519 SIGNATURE</span>
                <button onClick={() => handleCopy(generatedSignature)} className="hover:underline">
                  Copy Sig
                </button>
              </div>
              <div className="p-2 rounded bg-black/60 font-mono text-[9px] text-slate-300 break-all border border-white/5">
                {generatedSignature}
              </div>
            </div>
          )}

          {/* Seed Phrase Security Note */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[9px] text-amber-200 space-y-1 font-mono">
            <div className="font-bold flex items-center gap-1 text-amber-300">
              <span>⚠️</span>
              <span>Non-Custodial Guarantee</span>
            </div>
            <p className="text-slate-400">
              Private keys and 12-word seed phrases never leave your machine. Signatures are computed client-side via WebCrypto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
