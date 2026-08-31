"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { PanelView } from "@/types";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  group: string;
  action: () => void;
}

const views: { id: PanelView; label: string; num: number }[] = [
  { id: "editor", label: "Editor", num: 1 },
  { id: "dashboard", label: "Dashboard", num: 2 },
  { id: "portfolio", label: "Portfolio", num: 3 },
  { id: "charts", label: "Charts", num: 4 },
  { id: "backtest", label: "Backtest", num: 5 },
  { id: "global-markets", label: "Global Markets", num: 6 },
  { id: "economic-data", label: "Economic Data", num: 7 },
  { id: "data-ingest", label: "Data Ingestion", num: 8 },
  { id: "geopolitics", label: "Geopolitical Risk", num: 9 },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setActiveView, toggleSidebar, runActiveFile, clearConsole } = useIDEStore();

  const commands: Command[] = [
    ...views.map((v) => ({
      id: `view-${v.id}`,
      label: `Go to ${v.label}`,
      shortcut: `Ctrl+${v.num}`,
      group: "Navigation",
      action: () => setActiveView(v.id),
    })),
    {
      id: "toggle-sidebar",
      label: "Toggle Sidebar",
      shortcut: "Ctrl+B",
      group: "View",
      action: toggleSidebar,
    },
    {
      id: "run-file",
      label: "Run Active File",
      shortcut: "Ctrl+Enter",
      group: "Actions",
      action: runActiveFile,
    },
    {
      id: "clear-terminal",
      label: "Clear Terminal",
      group: "Actions",
      action: clearConsole,
    },
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key >= "1" && e.key <= "9") {
        const target = e.target as HTMLElement;
        if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return;
        e.preventDefault();
        const idx = parseInt(e.key) - 1;
        if (idx < views.length) {
          setActiveView(views[idx].id);
        }
      }
    }

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [setActiveView, toggleSidebar]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        close();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={close}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md rounded-lg border overflow-hidden shadow-2xl"
        style={{ background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "var(--ag-border)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--ag-muted)">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--ag-muted)" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="var(--ag-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKey}
            placeholder="Type a command..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--ag-text)" }}
            spellCheck={false}
          />
          <kbd className="text-[9px] px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--ag-border)", color: "var(--ag-muted)" }}>
            ESC
          </kbd>
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-3 py-4 text-center text-xs" style={{ color: "var(--ag-muted)" }}>
              No matching commands
            </div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors"
              style={{
                background: i === selectedIndex ? "rgba(0,212,170,0.1)" : "transparent",
                color: i === selectedIndex ? "var(--ag-text)" : "var(--ag-muted)",
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => { cmd.action(); close(); }}
            >
              <span>{cmd.label}</span>
              {cmd.shortcut && (
                <kbd className="text-[9px] px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "var(--ag-muted)" }}>
                  {cmd.shortcut}
                </kbd>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
