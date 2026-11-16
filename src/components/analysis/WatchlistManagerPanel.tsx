"use client";

import { useState, useEffect, useRef } from "react";

interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
}

interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: number;
}

const MOCK_UNIVERSE: WatchlistItem[] = [
  { ticker: "AAPL", name: "Apple Inc", price: 189.42, change: 2.14, changePct: 1.14, volume: 52_400_000, marketCap: 2_920_000_000_000 },
  { ticker: "MSFT", name: "Microsoft Corp", price: 414.28, change: -1.82, changePct: -0.44, volume: 18_200_000, marketCap: 3_080_000_000_000 },
  { ticker: "NVDA", name: "NVIDIA Corp", price: 875.14, change: 24.56, changePct: 2.89, volume: 42_100_000, marketCap: 2_148_000_000_000 },
  { ticker: "TSLA", name: "Tesla Inc", price: 248.73, change: -5.22, changePct: -2.06, volume: 112_000_000, marketCap: 793_000_000_000 },
  { ticker: "AMZN", name: "Amazon.com Inc", price: 198.56, change: 1.73, changePct: 0.88, volume: 32_500_000, marketCap: 2_082_000_000_000 },
  { ticker: "META", name: "Meta Platforms", price: 548.12, change: 8.90, changePct: 1.65, volume: 14_800_000, marketCap: 1_397_000_000_000 },
  { ticker: "GOOGL", name: "Alphabet Inc", price: 178.34, change: -0.44, changePct: -0.25, volume: 22_100_000, marketCap: 2_194_000_000_000 },
  { ticker: "BRK.B", name: "Berkshire Hathaway", price: 376.44, change: 1.11, changePct: 0.30, volume: 4_200_000, marketCap: 826_000_000_000 },
  { ticker: "JPM", name: "JPMorgan Chase", price: 212.88, change: 0.55, changePct: 0.26, volume: 8_900_000, marketCap: 605_000_000_000 },
  { ticker: "V", name: "Visa Inc", price: 278.14, change: -0.82, changePct: -0.29, volume: 5_400_000, marketCap: 561_000_000_000 },
  { ticker: "JNJ", name: "Johnson & Johnson", price: 152.34, change: 0.22, changePct: 0.14, volume: 6_100_000, marketCap: 365_000_000_000 },
  { ticker: "GME", name: "GameStop Corp", price: 14.22, change: 0.88, changePct: 6.59, volume: 18_400_000, marketCap: 4_300_000_000 },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", price: 507.14, change: 1.92, changePct: 0.38, volume: 68_000_000, marketCap: 0 },
  { ticker: "QQQ", name: "Invesco QQQ Trust", price: 436.28, change: 2.44, changePct: 0.56, volume: 44_200_000, marketCap: 0 },
  { ticker: "GLD", name: "SPDR Gold Shares", price: 213.44, change: -0.33, changePct: -0.15, volume: 8_800_000, marketCap: 0 },
];

function fmt(n: number): string {
  if (n >= 1e12) return `${(n/1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n/1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n/1e6).toFixed(1)}M`;
  return String(n);
}

const DEFAULT_LISTS: Watchlist[] = [
  { id: "tech-mega", name: "Tech Mega Cap", items: MOCK_UNIVERSE.filter(s => ["AAPL","MSFT","NVDA","META","GOOGL"].includes(s.ticker)), createdAt: Date.now() - 86400000 },
  { id: "portfolio", name: "My Portfolio", items: MOCK_UNIVERSE.filter(s => ["TSLA","AMZN","JPM","V"].includes(s.ticker)), createdAt: Date.now() - 43200000 },
  { id: "etfs", name: "ETF Basket", items: MOCK_UNIVERSE.filter(s => ["SPY","QQQ","GLD"].includes(s.ticker)), createdAt: Date.now() },
];

function loadLists(): Watchlist[] {
  if (typeof window === "undefined") return DEFAULT_LISTS;
  try {
    const raw = localStorage.getItem("nur-watchlists");
    return raw ? JSON.parse(raw) : DEFAULT_LISTS;
  } catch {
    return DEFAULT_LISTS;
  }
}

function saveLists(lists: Watchlist[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem("nur-watchlists", JSON.stringify(lists)); } catch {}
}

export default function WatchlistManagerPanel() {
  const [lists, setLists] = useState<Watchlist[]>(DEFAULT_LISTS);
  const [activeListId, setActiveListId] = useState("tech-mega");
  const [sortKey, setSortKey] = useState<"ticker" | "price" | "changePct" | "volume">("changePct");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [search, setSearch] = useState("");
  const [newListName, setNewListName] = useState("");
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  useEffect(() => {
    const loaded = loadLists();
    setLists(loaded);
  }, []);

  const updateLists = (updated: Watchlist[]) => {
    setLists(updated);
    saveLists(updated);
  };

  const activeList = lists.find(l => l.id === activeListId);

  const handleSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(-1); }
  };

  const sortedItems = activeList
    ? [...activeList.items].sort((a, b) => {
        const av = a[sortKey] as number | string;
        const bv = b[sortKey] as number | string;
        if (typeof av === "string") return sortDir * av.localeCompare(bv as string);
        return sortDir * ((av as number) - (bv as number));
      })
    : [];

  const searchResults = search.trim().length > 0
    ? MOCK_UNIVERSE.filter(s =>
        s.ticker.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
      ).filter(s => !activeList?.items.find(i => i.ticker === s.ticker))
    : [];

  const addToList = (item: WatchlistItem) => {
    if (!activeList) return;
    const updated = lists.map(l =>
      l.id === activeListId ? { ...l, items: [...l.items, item] } : l
    );
    updateLists(updated);
    setSearch("");
  };

  const removeFromList = (ticker: string) => {
    if (!activeList) return;
    const updated = lists.map(l =>
      l.id === activeListId ? { ...l, items: l.items.filter(i => i.ticker !== ticker) } : l
    );
    updateLists(updated);
  };

  const createList = () => {
    if (!newListName.trim()) return;
    const newList: Watchlist = { id: `list-${Date.now()}`, name: newListName.trim(), items: [], createdAt: Date.now() };
    updateLists([...lists, newList]);
    setActiveListId(newList.id);
    setNewListName("");
    setAdding(false);
  };

  const deleteList = (id: string) => {
    const updated = lists.filter(l => l.id !== id);
    updateLists(updated);
    if (activeListId === id) setActiveListId(updated[0]?.id ?? "");
  };

  const exportCSV = () => {
    if (!activeList) return;
    const header = "Ticker,Name,Price,Change%,Volume,MarketCap\n";
    const rows = activeList.items.map(i =>
      `${i.ticker},${i.name},${i.price},${i.changePct.toFixed(2)},${i.volume},${i.marketCap}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${activeList.name.replace(/\s+/g,"-")}.csv`;
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0c10] text-white font-mono text-xs overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-[#12151c]">
        <span className="text-[#00c8ff] font-bold text-sm">WATCHLIST MANAGER</span>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="text-[10px] px-2 py-1 rounded border border-white/20 text-slate-400 hover:text-white hover:border-white/40 transition-colors">↓ CSV</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: list of watchlists */}
        <div className="w-44 border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="flex-1 overflow-y-auto">
            {lists.map(list => (
              <div
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`group px-3 py-2.5 cursor-pointer border-b border-white/5 transition-colors flex items-center justify-between ${activeListId === list.id ? "bg-[#1a1f2e] border-l-2 border-l-[#00c8ff]" : "hover:bg-[#12151c]"}`}
              >
                {renaming === list.id ? (
                  <input
                    autoFocus
                    value={renameText}
                    onChange={e => setRenameText(e.target.value)}
                    onBlur={() => {
                      if (renameText.trim()) {
                        updateLists(lists.map(l => l.id === list.id ? { ...l, name: renameText.trim() } : l));
                      }
                      setRenaming(null);
                    }}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    className="bg-transparent border-b border-[#00c8ff] outline-none text-white text-xs w-full"
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div>
                      <div className="text-[11px] font-semibold text-white truncate max-w-[100px]">{list.name}</div>
                      <div className="text-[9px] text-slate-600">{list.items.length} items</div>
                    </div>
                    <div className="hidden group-hover:flex gap-1">
                      <button onClick={e => { e.stopPropagation(); setRenaming(list.id); setRenameText(list.name); }} className="text-slate-500 hover:text-white text-[10px]">✎</button>
                      {lists.length > 1 && <button onClick={e => { e.stopPropagation(); deleteList(list.id); }} className="text-slate-500 hover:text-red-400 text-[10px]">✕</button>}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-2">
            {adding ? (
              <div className="flex gap-1">
                <input
                  autoFocus
                  value={newListName}
                  onChange={e => setNewListName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") createList(); if (e.key === "Escape") setAdding(false); }}
                  placeholder="List name..."
                  className="flex-1 bg-white/5 border border-white/20 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-[#00c8ff]"
                />
                <button onClick={createList} className="text-[#00c8ff] text-[11px] font-bold">✓</button>
              </div>
            ) : (
              <button onClick={() => setAdding(true)} className="w-full text-center text-[10px] text-slate-500 hover:text-[#00c8ff] py-1 border border-dashed border-white/10 hover:border-[#00c8ff]/30 rounded transition-colors">
                + New List
              </button>
            )}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-3 py-2 border-b border-white/10 relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search & add ticker..."
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#00c8ff]/60"
            />
            {searchResults.length > 0 && (
              <div className="absolute left-3 right-3 top-full z-20 bg-[#1a1f2e] border border-white/20 rounded-b shadow-xl mt-0.5">
                {searchResults.map(s => (
                  <div
                    key={s.ticker}
                    onClick={() => addToList(s)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-white/10 cursor-pointer border-b border-white/5"
                  >
                    <span className="font-bold text-[#00c8ff]">{s.ticker}</span>
                    <span className="text-slate-400 truncate mx-2 flex-1">{s.name}</span>
                    <span className="text-slate-300 tabular-nums">${s.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#12151c] z-10">
                <tr>
                  {[
                    { key: "ticker", label: "TICKER" },
                    { key: null, label: "NAME" },
                    { key: "price", label: "PRICE" },
                    { key: "changePct", label: "CHG %" },
                    { key: "volume", label: "VOLUME" },
                    { key: null, label: "MKT CAP" },
                    { key: null, label: "" },
                  ].map(col => (
                    <th
                      key={col.label}
                      className={`text-left px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 border-b border-white/10 whitespace-nowrap ${col.key ? "cursor-pointer hover:text-[#00c8ff]" : ""}`}
                      onClick={() => col.key && handleSort(col.key as typeof sortKey)}
                    >
                      {col.label} {col.key === sortKey ? (sortDir === -1 ? "↓" : "↑") : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedItems.map(item => (
                  <tr key={item.ticker} className="border-b border-white/5 hover:bg-[#12151c] transition-colors group">
                    <td className="px-3 py-2.5 font-bold text-[#00c8ff]">{item.ticker}</td>
                    <td className="px-3 py-2.5 text-slate-400 max-w-[160px] truncate">{item.name}</td>
                    <td className="px-3 py-2.5 font-bold tabular-nums">${item.price.toFixed(2)}</td>
                    <td className="px-3 py-2.5 font-bold tabular-nums" style={{ color: item.changePct >= 0 ? "#10b981" : "#ef4444" }}>
                      {item.changePct >= 0 ? "+" : ""}{item.changePct.toFixed(2)}%
                    </td>
                    <td className="px-3 py-2.5 text-slate-400 tabular-nums">{fmt(item.volume)}</td>
                    <td className="px-3 py-2.5 text-slate-400 tabular-nums">{item.marketCap > 0 ? fmt(item.marketCap) : "—"}</td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => removeFromList(item.ticker)}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 text-[10px] transition-all"
                      >✕</button>
                    </td>
                  </tr>
                ))}
                {sortedItems.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600">No items — search and add tickers above</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
