"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import { useIDEStore } from "@/stores/useIDEStore";

export default function CodeEditor() {
  const { tabs, activeTabId, updateTabContent } = useIDEStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current && lineNumbersRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const getLanguage = useCallback((lang: string) => {
    const map: Record<string, string> = { py: "python", python: "python", json: "json", md: "markdown", markdown: "markdown" };
    return map[lang] || "python";
  }, []);

  const highlight = useCallback((code: string, lang: string) => {
    const prismLang = getLanguage(lang);
    const grammar = Prism.languages[prismLang];
    if (grammar) {
      return Prism.highlight(code, grammar, prismLang);
    }
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }, [getLanguage]);

  const prevTabIdRef = useRef(activeTabId);
  useEffect(() => {
    if (prevTabIdRef.current !== activeTabId) {
      prevTabIdRef.current = activeTabId;
      if (textareaRef.current && activeTab) {
        textareaRef.current.value = activeTab.content;
      }
    }
  }, [activeTabId, activeTab]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeTab) {
      updateTabContent(activeTab.id, e.target.value);
    }
  }, [activeTab, updateTabContent]);

  const runActiveFile = useIDEStore((s) => s.runActiveFile);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value = value.substring(0, start) + "    " + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      if (activeTab) updateTabContent(activeTab.id, textarea.value);
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runActiveFile();
    }
  }, [activeTab, updateTabContent, runActiveFile]);

  const handleCursorChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const val = textarea.value.substring(0, textarea.selectionStart);
    const lines = val.split("\n");
    setCursorPos({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  }, []);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: "var(--ag-bg)" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 font-mono" style={{ color: "var(--ag-accent)", opacity: 0.2 }}>
            {"{ }"}
          </div>
          <div className="text-sm" style={{ color: "var(--ag-muted)" }}>
            Open a file from the explorer to start coding
          </div>
          <div className="text-xs mt-2" style={{ color: "var(--ag-muted)", opacity: 0.5 }}>
            Ctrl+Enter to run | AntiGravi Engine ready
          </div>
        </div>
      </div>
    );
  }

  const content = activeTab.content;
  const lines = content.split("\n");
  const lineCount = lines.length;

  return (
    <div className="relative flex h-full overflow-hidden" style={{ background: "var(--ag-bg)" }} ref={containerRef}>
      <div
        ref={lineNumbersRef}
        className="flex-shrink-0 overflow-hidden select-none text-right pr-3 pl-2 pt-2 font-mono text-xs leading-5"
        style={{ color: "var(--ag-border)", width: 50, background: "var(--ag-bg)" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ color: i + 1 === cursorPos.line ? "var(--ag-muted)" : "var(--ag-border)" }}>
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative flex-1 overflow-hidden">
        {/* Syntax highlighted layer */}
        <pre
          ref={highlightRef}
          className="absolute inset-0 overflow-auto m-0 p-2 font-mono text-xs leading-5 pointer-events-none whitespace-pre"
          style={{ color: "#e0e6f0", background: "transparent", tabSize: 4 }}
          dangerouslySetInnerHTML={{ __html: highlight(content, activeTab.language) + "\n" }}
        />

        {/* Textarea input layer */}
        <textarea
          ref={textareaRef}
          defaultValue={content}
          onChange={handleChange}
          onScroll={syncScroll}
          onKeyDown={handleKeyDown}
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="absolute inset-0 w-full h-full resize-none m-0 p-2 font-mono text-xs leading-5 outline-none border-none caret-[#00d4aa]"
          style={{
            color: "transparent",
            background: "transparent",
            caretColor: "#00d4aa",
            tabSize: 4,
            whiteSpace: "pre",
            overflowWrap: "normal",
          }}
        />
      </div>

      {/* Cursor position */}
      <div className="absolute bottom-1 right-3 text-[10px] font-mono" style={{ color: "var(--ag-border)" }}>
        Ln {cursorPos.line}, Col {cursorPos.col}
      </div>

      <style jsx global>{`
        .token.comment { color: #4b5563 !important; font-style: italic; }
        .token.keyword { color: #00d4aa !important; }
        .token.string { color: #fbbf24 !important; }
        .token.number { color: #60a5fa !important; }
        .token.function { color: #34d399 !important; }
        .token.class-name { color: #f472b6 !important; }
        .token.decorator { color: #fb923c !important; }
        .token.operator { color: #94a3b8 !important; }
        .token.punctuation { color: #64748b !important; }
        .token.builtin { color: #a78bfa !important; }
        .token.boolean { color: #f97316 !important; }
        .token.triple-quoted-string { color: #fbbf24 !important; }
      `}</style>
    </div>
  );
}
