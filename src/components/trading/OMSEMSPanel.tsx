"use client";

import { useState, useEffect, useMemo } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { OrderType, OrderSide, TimeInForce } from "@/types";
import EagleCrest from "@/components/ui/EagleCrest";

const POPULAR_SYMBOLS = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 122.35, spread: 0.02, atr: 4.8 },
  { symbol: "AAPL", name: "Apple Inc", price: 226.8, spread: 0.03, atr: 3.2 },
  { symbol: "SPY", name: "S&P 500 ETF", price: 564.2, spread: 0.01, atr: 5.1 },
  { symbol: "QQQ", name: "Invesco QQQ", price: 479.1, spread: 0.02, atr: 6.4 },
  { symbol: "MSFT", name: "Microsoft Corp", price: 448.6, spread: 0.04, atr: 5.9 },
  { symbol: "TSLA", name: "Tesla Inc", price: 215.4, spread: 0.05, atr: 9.1 },
];

export default function OMSEMSPanel() {
  const { orders, positions, placeOrder, cancelOrder, liquidateAllPositions } = useIDEStore();

  const [selectedSymbol, setSelectedSymbol] = useState("NVDA");
  const [side, setSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("LIMIT");
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState<number>(122.35);
  const [stopPrice, setStopPrice] = useState<number>(118.0);
  const [timeInForce, setTimeInForce] = useState<TimeInForce>("GTC");
  const [icebergDisplaySize, setIcebergDisplaySize] = useState(25);
  const [activeTab, setActiveTab] = useState<"dom" | "positions" | "orders" | "risk">("dom");

  const currentAsset = useMemo(
    () => POPULAR_SYMBOLS.find((s) => s.symbol === selectedSymbol) || POPULAR_SYMBOLS[0],
    [selectedSymbol]
  );

  useEffect(() => {
    setPrice(currentAsset.price);
    setStopPrice(Number((currentAsset.price * 0.96).toFixed(2)));
  }, [currentAsset]);

  // Generate dynamic L2 Depth of Market ladder around current price
  const domData = useMemo(() => {
    const base = currentAsset.price;
    const tick = 0.05;
    const asks = [];
    const bids = [];

    for (let i = 5; i >= 1; i--) {
      const p = Number((base + i * tick).toFixed(2));
      const size = Math.floor(Math.random() * 400 + 100);
      asks.push({ price: p, size, total: size * (6 - i) });
    }

    for (let i = 1; i <= 5; i++) {
      const p = Number((base - i * tick).toFixed(2));
      const size = Math.floor(Math.random() * 450 + 120);
      bids.push({ price: p, size, total: size * i });
    }

    return { asks, bids };
  }, [currentAsset.price]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({
      symbol: selectedSymbol,
      side,
      type: orderType,
      quantity,
      price: orderType === "MARKET" ? undefined : price,
      stopPrice: orderType === "STOP" || orderType === "TRAILING_STOP" ? stopPrice : undefined,
      timeInForce,
      icebergDisplaySize: orderType === "ICEBERG" ? icebergDisplaySize : undefined,
    });
  };

  // Portfolio aggregates
  const totalMarginUsed = positions.reduce((acc, p) => acc + p.marginUsed, 0);
  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalRealizedPnl = positions.reduce((acc, p) => acc + p.realizedPnl, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "var(--ag-bg)", color: "var(--ag-text)" }}>
      {/* Header Bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b shrink-0 select-none"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
      >
        <div className="flex items-center gap-3">
          <EagleCrest size={28} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--ag-accent)]">NUR Institutional OMS / EMS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)]">
                L2 DMA ENGINE
              </span>
            </div>
            <p className="text-[11px] text-[var(--ag-muted)]">
              Direct Market Access &bull; Kelly Position Sizing &bull; Smart Execution Router
            </p>
          </div>
        </div>

        {/* Aggregate P&L HUD */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-2.5 py-1 rounded border border-[var(--ag-border)] bg-black/20">
            <span className="text-[var(--ag-muted)] mr-1.5">Margin Used:</span>
            <span className="font-bold">${totalMarginUsed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="px-2.5 py-1 rounded border border-[var(--ag-border)] bg-black/20">
            <span className="text-[var(--ag-muted)] mr-1.5">Unrealized P&L:</span>
            <span className={`font-bold ${totalUnrealizedPnl >= 0 ? "text-[var(--ag-success)]" : "text-red-400"}`}>
              {totalUnrealizedPnl >= 0 ? "+" : ""}${totalUnrealizedPnl.toFixed(2)}
            </span>
          </div>
          <div className="px-2.5 py-1 rounded border border-[var(--ag-border)] bg-black/20">
            <span className="text-[var(--ag-muted)] mr-1.5">Realized P&L:</span>
            <span className={`font-bold ${totalRealizedPnl >= 0 ? "text-[var(--ag-success)]" : "text-red-400"}`}>
              {totalRealizedPnl >= 0 ? "+" : ""}${totalRealizedPnl.toFixed(2)}
            </span>
          </div>
          <button
            onClick={liquidateAllPositions}
            className="px-3 py-1 rounded bg-red-600/80 hover:bg-red-600 text-white font-bold text-[11px] transition-colors"
          >
            KILL SWITCH (FLATTEN ALL)
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Column: Asset Selector & Order Ticket */}
        <div
          className="w-80 flex flex-col border-r overflow-y-auto p-3"
          style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
        >
          {/* Symbol Quick Select */}
          <label className="text-[11px] font-semibold text-[var(--ag-muted)] uppercase mb-1.5">
            Institutional Asset
          </label>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {POPULAR_SYMBOLS.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setSelectedSymbol(s.symbol)}
                className={`px-2 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                  selectedSymbol === s.symbol
                    ? "bg-[rgba(0,212,170,0.15)] border-[var(--ag-accent)] text-[var(--ag-accent)]"
                    : "border-[var(--ag-border)] text-[var(--ag-muted)] hover:text-white"
                }`}
              >
                {s.symbol}
              </button>
            ))}
          </div>

          <div className="p-2.5 rounded border mb-3 bg-black/30" style={{ borderColor: "var(--ag-border)" }}>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">{currentAsset.name}</span>
              <span className="font-mono text-sm text-[var(--ag-accent)]">${currentAsset.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-[var(--ag-muted)] mt-1 font-mono">
              <span>Spread: ${(currentAsset.spread).toFixed(2)}</span>
              <span>ATR (14d): ${currentAsset.atr.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Ticket Form */}
          <form onSubmit={handleSubmitOrder} className="flex flex-col gap-2.5">
            {/* Side Tabs (Buy / Sell) */}
            <div className="grid grid-cols-2 gap-1 p-0.5 rounded border" style={{ borderColor: "var(--ag-border)" }}>
              <button
                type="button"
                onClick={() => setSide("BUY")}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  side === "BUY" ? "bg-[var(--ag-success)] text-black" : "text-[var(--ag-muted)] hover:text-white"
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setSide("SELL")}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  side === "SELL" ? "bg-red-500 text-white" : "text-[var(--ag-muted)] hover:text-white"
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Order Type */}
            <div>
              <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                style={{ borderColor: "var(--ag-border)" }}
              >
                <option value="LIMIT">LIMIT ORDER</option>
                <option value="MARKET">MARKET ORDER</option>
                <option value="STOP">STOP LOSS</option>
                <option value="TRAILING_STOP">TRAILING STOP</option>
                <option value="ICEBERG">ICEBERG (HIDDEN SIZE)</option>
                <option value="TWAP">TWAP (ALGORITHMIC)</option>
                <option value="VWAP">VWAP (VOLUME-WEIGHTED)</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Quantity</label>
                <span className="text-[10px] text-[var(--ag-accent)] font-mono">
                  Notional: ${(quantity * price).toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                style={{ borderColor: "var(--ag-border)" }}
              />
            </div>

            {/* Price (if not Market) */}
            {orderType !== "MARKET" && (
              <div>
                <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Limit Price ($)</label>
                <input
                  type="number"
                  step={0.01}
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                  style={{ borderColor: "var(--ag-border)" }}
                />
              </div>
            )}

            {/* Stop Price (if STOP or TRAILING) */}
            {(orderType === "STOP" || orderType === "TRAILING_STOP") && (
              <div>
                <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Stop Trigger ($)</label>
                <input
                  type="number"
                  step={0.01}
                  value={stopPrice}
                  onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                  style={{ borderColor: "var(--ag-border)" }}
                />
              </div>
            )}

            {/* Iceberg Display Size */}
            {orderType === "ICEBERG" && (
              <div>
                <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Visible Display Size</label>
                <input
                  type="number"
                  min={1}
                  max={quantity}
                  value={icebergDisplaySize}
                  onChange={(e) => setIcebergDisplaySize(parseInt(e.target.value) || 10)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                  style={{ borderColor: "var(--ag-border)" }}
                />
              </div>
            )}

            {/* Time in Force */}
            <div>
              <label className="text-[10px] font-semibold text-[var(--ag-muted)] uppercase">Time in Force (TIF)</label>
              <select
                value={timeInForce}
                onChange={(e) => setTimeInForce(e.target.value as TimeInForce)}
                className="w-full mt-1 px-2.5 py-1.5 rounded text-xs bg-black/40 border text-white font-mono"
                style={{ borderColor: "var(--ag-border)" }}
              >
                <option value="GTC">Good 'Til Cancelled (GTC)</option>
                <option value="DAY">Day Order (DAY)</option>
                <option value="IOC">Immediate or Cancel (IOC)</option>
                <option value="FOK">Fill or Kill (FOK)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2.5 mt-2 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-lg ${
                side === "BUY"
                  ? "bg-[var(--ag-accent)] hover:bg-[var(--ag-accent)]/80 text-black shadow-[rgba(0,212,170,0.2)]"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
              }`}
            >
              TRANSMIT {side} ORDER
            </button>
          </form>
        </div>

        {/* Center/Right Area: Tabs for DOM Ladder, Positions, Orders, Risk Monitor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Sub Navigation Tabs */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b select-none"
            style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
          >
            <button
              onClick={() => setActiveTab("dom")}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === "dom"
                  ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                  : "text-[var(--ag-muted)] hover:text-white"
              }`}
            >
              L2 DOM Depth Ladder
            </button>
            <button
              onClick={() => setActiveTab("positions")}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === "positions"
                  ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                  : "text-[var(--ag-muted)] hover:text-white"
              }`}
            >
              Active Positions ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                  : "text-[var(--ag-muted)] hover:text-white"
              }`}
            >
              Working Orders ({orders.filter((o) => o.status === "WORKING").length})
            </button>
            <button
              onClick={() => setActiveTab("risk")}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                activeTab === "risk"
                  ? "bg-[rgba(0,212,170,0.15)] text-[var(--ag-accent)] font-bold"
                  : "text-[var(--ag-muted)] hover:text-white"
              }`}
            >
              Kelly & Margin Risk
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* DOM LADDER */}
            {activeTab === "dom" && (
              <div className="max-w-2xl mx-auto flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs px-2 text-[var(--ag-muted)]">
                  <span>LEVEL 2 DEPTH OF MARKET — {selectedSymbol}</span>
                  <span className="font-mono">TICK: $0.05 &bull; LATENCY: 0.8ms</span>
                </div>

                <div className="rounded border overflow-hidden font-mono text-xs" style={{ borderColor: "var(--ag-border)" }}>
                  {/* ASKS (Sells) */}
                  <div className="flex flex-col-reverse divide-y divide-white/5 bg-red-950/20">
                    {domData.asks.map((a, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-1.5 relative overflow-hidden">
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-red-500/10 pointer-events-none"
                          style={{ width: `${Math.min(100, (a.size / 600) * 100)}%` }}
                        />
                        <span className="text-red-400 font-bold z-10">${a.price.toFixed(2)}</span>
                        <span className="text-[var(--ag-muted)] z-10">{a.size} shs</span>
                        <span className="text-[10px] text-[var(--ag-muted)] z-10">${(a.price * a.size).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* SPREAD INDICATOR */}
                  <div className="flex justify-between items-center px-4 py-2 bg-black/60 border-y font-bold text-[11px]" style={{ borderColor: "var(--ag-border)" }}>
                    <span className="text-[var(--ag-accent)]">LAST: ${currentAsset.price.toFixed(2)}</span>
                    <span className="text-[var(--ag-muted)]">SPREAD: ${currentAsset.spread.toFixed(2)}</span>
                  </div>

                  {/* BIDS (Buys) */}
                  <div className="flex flex-col divide-y divide-white/5 bg-emerald-950/20">
                    {domData.bids.map((b, i) => (
                      <div key={i} className="flex justify-between items-center px-4 py-1.5 relative overflow-hidden">
                        <div
                          className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none"
                          style={{ width: `${Math.min(100, (b.size / 600) * 100)}%` }}
                        />
                        <span className="text-[var(--ag-success)] font-bold z-10">${b.price.toFixed(2)}</span>
                        <span className="text-[var(--ag-muted)] z-10">{b.size} shs</span>
                        <span className="text-[10px] text-[var(--ag-muted)] z-10">${(b.price * b.size).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* POSITIONS TAB */}
            {activeTab === "positions" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-[var(--ag-muted)]">
                  <span>REAL-TIME PORTFOLIO POSITIONS</span>
                  <span className="font-mono">LEVERAGE TARGET: 3.0x - 4.0x</span>
                </div>

                <div className="rounded border overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-[var(--ag-muted)] border-b" style={{ borderColor: "var(--ag-border)" }}>
                      <tr>
                        <th className="p-3">Symbol</th>
                        <th className="p-3">Side</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3">Entry ($)</th>
                        <th className="p-3">Current ($)</th>
                        <th className="p-3">Unrealized P&L</th>
                        <th className="p-3">Margin ($)</th>
                        <th className="p-3">Liq Price</th>
                        <th className="p-3">Kelly Sugg.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {positions.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-6 text-center text-[var(--ag-muted)]">
                            No open positions. Use the order ticket on the left to enter trades.
                          </td>
                        </tr>
                      ) : (
                        positions.map((p, i) => (
                          <tr key={i} className="hover:bg-white/5">
                            <td className="p-3 font-bold text-white">{p.symbol}</td>
                            <td className="p-3">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  p.side === "LONG" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {p.side}
                              </span>
                            </td>
                            <td className="p-3">{p.quantity}</td>
                            <td className="p-3">${p.avgEntryPrice.toFixed(2)}</td>
                            <td className="p-3 text-[var(--ag-accent)]">${p.currentPrice.toFixed(2)}</td>
                            <td className={`p-3 font-bold ${p.unrealizedPnl >= 0 ? "text-[var(--ag-success)]" : "text-red-400"}`}>
                              {p.unrealizedPnl >= 0 ? "+" : ""}${p.unrealizedPnl.toFixed(2)} ({p.unrealizedPnlPercent.toFixed(2)}%)
                            </td>
                            <td className="p-3">${p.marginUsed.toFixed(2)}</td>
                            <td className="p-3 text-red-400">${p.liquidationPrice.toFixed(2)}</td>
                            <td className="p-3 text-[var(--ag-accent)]">{p.kellySizeSuggested} shs</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-[var(--ag-muted)]">
                  <span>ORDER LOGS & EXECUTION TRAIL</span>
                  <span className="font-mono">TOTAL ORDERS: {orders.length}</span>
                </div>

                <div className="rounded border overflow-x-auto" style={{ borderColor: "var(--ag-border)" }}>
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/5 text-[var(--ag-muted)] border-b" style={{ borderColor: "var(--ag-border)" }}>
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Symbol</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Side</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3">Limit / Trigger</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5">
                          <td className="p-3 text-[var(--ag-muted)]">{o.id}</td>
                          <td className="p-3 text-[10px] text-[var(--ag-muted)]">{new Date(o.createdAt).toLocaleTimeString()}</td>
                          <td className="p-3 font-bold text-white">{o.symbol}</td>
                          <td className="p-3">{o.type}</td>
                          <td className="p-3">
                            <span className={o.side === "BUY" ? "text-[var(--ag-success)]" : "text-red-400"}>
                              {o.side}
                            </span>
                          </td>
                          <td className="p-3">{o.quantity}</td>
                          <td className="p-3">{o.price ? `$${o.price.toFixed(2)}` : o.stopPrice ? `$${o.stopPrice.toFixed(2)}` : "MKT"}</td>
                          <td className="p-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                o.status === "FILLED"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : o.status === "WORKING"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {o.status === "WORKING" && (
                              <button
                                onClick={() => cancelOrder(o.id)}
                                className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-[10px]"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KELLY & MARGIN RISK TAB */}
            {activeTab === "risk" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded border bg-black/20" style={{ borderColor: "var(--ag-border)" }}>
                  <h4 className="text-sm font-bold text-[var(--ag-accent)] mb-2">Continuous Kelly Leverage Formula</h4>
                  <p className="text-xs text-[var(--ag-muted)] leading-relaxed mb-3">
                    In strict quantitative asset pricing, position sizing follows continuous Gaussian Kelly:
                  </p>
                  <div className="p-3 rounded bg-black/50 font-mono text-center text-sm text-emerald-400 mb-3 border border-white/5">
                    f* = &mu; / &sigma;<sup>2</sup> &approx; 13.7x (Ruin Limit: 17x)
                  </div>
                  <p className="text-xs text-[var(--ag-muted)] leading-relaxed">
                    NFS institutional risk limits enforce operating leverage strictly in the <strong>3.0x - 4.0x</strong> safe corridor to prevent tail liquidation while capturing &sim;15-18% CAGR.
                  </p>
                </div>

                <div className="p-4 rounded border bg-black/20" style={{ borderColor: "var(--ag-border)" }}>
                  <h4 className="text-sm font-bold text-[var(--ag-accent)] mb-2">Non-Lookahead Execution Protocol</h4>
                  <ul className="text-xs text-[var(--ag-muted)] space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                      <span><strong>Signal Month X:</strong> ISM release published on Days 1-3 of month X+1.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                      <span><strong>Entry Point:</strong> Day 5 of month X+1 (avoids pre-release lookahead bias).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                      <span><strong>Exit & Rebalance:</strong> Day 5 of month X+2.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--ag-accent)]" />
                      <span><strong>Outlier Filter:</strong> Any stock monthly move &gt; &plusmn;50% is excluded.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
