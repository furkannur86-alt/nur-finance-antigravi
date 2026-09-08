"use client";

import { useState, useMemo } from "react";
import {
  encyclopediaEntries,
  ENCYCLOPEDIA_CATEGORIES,
  searchEncyclopedia,
  getEntriesByCategory,
  EncyclopediaEntry,
} from "@/lib/data/encyclopedia";

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "#00d4aa",
  intermediate: "#f0b429",
  advanced: "#e06c75",
  expert: "#c678dd",
};

function EntryCard({ entry, onSelect }: { entry: EncyclopediaEntry; onSelect: (e: EncyclopediaEntry) => void }) {
  return (
    <button
      onClick={() => onSelect(entry)}
      className="w-full text-left p-3 rounded-lg border transition-all hover:scale-[1.01]"
      style={{ borderColor: "var(--ag-border)", background: "var(--ag-surface)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ag-text)" }}>{entry.term}</h3>
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0 uppercase tracking-wider font-medium"
          style={{ background: DIFFICULTY_COLORS[entry.difficulty] + "22", color: DIFFICULTY_COLORS[entry.difficulty] }}
        >
          {entry.difficulty}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--ag-muted)" }}>{entry.shortDef}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
          {entry.category}
        </span>
      </div>
    </button>
  );
}

function EntryDetail({ entry, onBack, onNavigate }: { entry: EncyclopediaEntry; onBack: () => void; onNavigate: (id: string) => void }) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <button onClick={onBack} className="flex items-center gap-1 text-xs mb-4 hover:opacity-80" style={{ color: "var(--ag-accent)" }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M11 1L4 8l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        Back to list
      </button>

      <div className="flex items-start justify-between gap-3 mb-3">
        <h1 className="text-lg font-bold" style={{ color: "var(--ag-text)" }}>{entry.term}</h1>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium shrink-0"
          style={{ background: DIFFICULTY_COLORS[entry.difficulty] + "22", color: DIFFICULTY_COLORS[entry.difficulty] }}
        >
          {entry.difficulty}
        </span>
      </div>

      <span className="inline-block text-[10px] px-2 py-0.5 rounded mb-4" style={{ background: "rgba(0,212,170,0.1)", color: "var(--ag-accent)" }}>
        {entry.category}
      </span>

      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Definition</h2>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ag-text)" }}>{entry.fullDef}</p>
        </div>

        {entry.formula && (
          <div className="p-3 rounded-lg border" style={{ borderColor: "var(--ag-border)", background: "rgba(0,212,170,0.04)" }}>
            <h2 className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--ag-accent)" }}>Formula</h2>
            <code className="text-sm font-mono block" style={{ color: "var(--ag-text)" }}>{entry.formula}</code>
          </div>
        )}

        {entry.example && (
          <div>
            <h2 className="text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Example</h2>
            <div className="p-3 rounded-lg border text-sm leading-relaxed" style={{ borderColor: "var(--ag-border)", background: "var(--ag-bg)", color: "var(--ag-text)" }}>
              {entry.example}
            </div>
          </div>
        )}

        {entry.relatedTerms.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--ag-muted)" }}>Related Concepts</h2>
            <div className="flex flex-wrap gap-1.5">
              {entry.relatedTerms.map((id) => {
                const related = encyclopediaEntries.find((e) => e.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => related && onNavigate(id)}
                    className="text-[11px] px-2 py-1 rounded border transition-colors hover:border-[var(--ag-accent)]"
                    style={{ borderColor: "var(--ag-border)", color: related ? "var(--ag-text)" : "var(--ag-muted)", background: "var(--ag-surface)" }}
                  >
                    {related?.term || id}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EncyclopediaPanel() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<EncyclopediaEntry | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = query ? searchEncyclopedia(query) : selectedCategory ? getEntriesByCategory(selectedCategory) : encyclopediaEntries;
    if (difficultyFilter) results = results.filter((e) => e.difficulty === difficultyFilter);
    return results;
  }, [query, selectedCategory, difficultyFilter]);

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of encyclopediaEntries) counts[e.category] = (counts[e.category] || 0) + 1;
    return counts;
  }, []);

  if (selectedEntry) {
    return (
      <div className="h-full" style={{ background: "var(--ag-bg)" }}>
        <EntryDetail
          entry={selectedEntry}
          onBack={() => setSelectedEntry(null)}
          onNavigate={(id) => {
            const e = encyclopediaEntries.find((x) => x.id === id);
            if (e) setSelectedEntry(e);
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--ag-bg)" }}>
      <div className="p-3 border-b" style={{ borderColor: "var(--ag-border)" }}>
        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--ag-accent)">
            <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" opacity="0.7" />
          </svg>
          <h1 className="text-sm font-bold" style={{ color: "var(--ag-text)" }}>Financial Encyclopedia</h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,170,0.15)", color: "var(--ag-accent)" }}>
            {encyclopediaEntries.length} entries
          </span>
        </div>

        <div className="relative mb-2">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="12" height="12" viewBox="0 0 16 16" fill="var(--ag-muted)">
            <circle cx="7" cy="7" r="5.5" fill="none" stroke="var(--ag-muted)" strokeWidth="1.5" />
            <line x1="11" y1="11" x2="14" y2="14" stroke="var(--ag-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedCategory(null); }}
            placeholder="Search terms, definitions, formulas..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border text-xs bg-transparent outline-none focus:border-[var(--ag-accent)]"
            style={{ borderColor: "var(--ag-border)", color: "var(--ag-text)" }}
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {(["beginner", "intermediate", "advanced", "expert"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(difficultyFilter === d ? null : d)}
              className="text-[10px] px-2 py-0.5 rounded-full border transition-colors capitalize"
              style={{
                borderColor: difficultyFilter === d ? DIFFICULTY_COLORS[d] : "var(--ag-border)",
                color: difficultyFilter === d ? DIFFICULTY_COLORS[d] : "var(--ag-muted)",
                background: difficultyFilter === d ? DIFFICULTY_COLORS[d] + "15" : "transparent",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-44 border-r overflow-y-auto p-2 shrink-0" style={{ borderColor: "var(--ag-border)" }}>
          <button
            onClick={() => { setSelectedCategory(null); setQuery(""); }}
            className="w-full text-left text-[11px] px-2 py-1.5 rounded mb-0.5 transition-colors"
            style={{
              background: !selectedCategory && !query ? "rgba(0,212,170,0.1)" : "transparent",
              color: !selectedCategory && !query ? "var(--ag-accent)" : "var(--ag-muted)",
            }}
          >
            All ({encyclopediaEntries.length})
          </button>
          {ENCYCLOPEDIA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setQuery(""); }}
              className="w-full text-left text-[11px] px-2 py-1.5 rounded mb-0.5 transition-colors"
              style={{
                background: selectedCategory === cat ? "rgba(0,212,170,0.1)" : "transparent",
                color: selectedCategory === cat ? "var(--ag-accent)" : "var(--ag-muted)",
              }}
            >
              {cat} ({categoryCount[cat] || 0})
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-2xl opacity-30">&#128218;</span>
              <p className="text-xs" style={{ color: "var(--ag-muted)" }}>No entries found</p>
            </div>
          ) : (
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filtered.map((entry) => (
                <EntryCard key={entry.id} entry={entry} onSelect={setSelectedEntry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
