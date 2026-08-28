"use client";

import { useEffect, useRef, useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";

export default function TerminalPanel() {
  const { consoleMessages, addConsoleMessage, clearConsole } = useIDEStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addConsoleMessage({ type: "info", text: `$ ${input}` });

    const cmd = input.trim().toLowerCase();
    if (cmd === "clear") {
      clearConsole();
    } else if (cmd === "help") {
      addConsoleMessage({ type: "output", text: "Available commands: help, clear, status, version, portfolio" });
    } else if (cmd === "status") {
      addConsoleMessage({ type: "success", text: "AntiGravi Engine: ONLINE" });
      addConsoleMessage({ type: "output", text: "Strategies loaded: 3 | Symbols: 7 | Uptime: 99.97%" });
    } else if (cmd === "version") {
      addConsoleMessage({ type: "output", text: "AntiGravi IDE v2.0.0 | Engine v2.0 | Nur Finance" });
    } else if (cmd === "portfolio") {
      addConsoleMessage({ type: "output", text: "AAPL: 25 shares @ $198.50 | MSFT: 15 shares @ $425.30" });
      addConsoleMessage({ type: "output", text: "Total Value: $847,250.00 | Daily P&L: +$2,340.50" });
    } else {
      addConsoleMessage({ type: "warning", text: `Unknown command: ${input}` });
    }

    setInput("");
  };

  const colorMap: Record<string, string> = {
    info: "var(--ag-accent)",
    error: "var(--ag-danger)",
    success: "var(--ag-success)",
    warning: "var(--ag-warning)",
    output: "var(--ag-text)",
  };

  return (
    <div className="flex flex-col h-full border-t" style={{ background: "var(--ag-bg)", borderColor: "var(--ag-border)" }}>
      <div className="flex items-center h-7 px-3 border-b"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>
          Terminal
        </span>
        <div className="flex-1" />
        <button onClick={clearConsole} className="text-[10px] hover:underline" style={{ color: "var(--ag-muted)" }}>
          Clear
        </button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 font-mono text-xs leading-5">
        {consoleMessages.map((msg) => (
          <div key={msg.id} className="flex gap-2">
            <span style={{ color: "var(--ag-muted)" }}>
              {msg.timestamp.toLocaleTimeString("en-US", { hour12: false })}
            </span>
            <span style={{ color: colorMap[msg.type] }}>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center h-7 px-2 border-t"
        style={{ borderColor: "var(--ag-border)" }}>
        <span className="text-xs mr-1" style={{ color: "var(--ag-accent)" }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-xs font-mono"
          style={{ color: "var(--ag-text)" }}
          placeholder="Type a command..."
          spellCheck={false}
        />
      </form>
    </div>
  );
}
