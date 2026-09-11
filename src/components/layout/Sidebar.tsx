"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { FileNode } from "@/types";

function FileIcon({ type, name }: { type: string; name: string }) {
  if (type === "folder") {
    return (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="#f59e0b" className="flex-shrink-0">
        <path d="M1 3h5l2 2h7v9H1V3z" />
      </svg>
    );
  }
  const ext = name.split(".").pop();
  const color =
    ext === "py" ? "#60a5fa"
    : ext === "json" ? "#f59e0b"
    : ext === "md" ? "#a78bfa"
    : "rgba(78,98,128,0.8)";
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill={color} className="flex-shrink-0">
      <path d="M3 1h7l4 4v10H3V1z" />
      <path d="M10 1v4h4" fill="none" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const { openFile } = useIDEStore();

  const handleClick = () => {
    if (node.type === "folder") setOpen(!open);
    else openFile(node);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 w-full text-left text-[11px] py-[3px] px-2 rounded transition-colors"
        style={{
          paddingLeft: `${depth * 12 + 8}px`,
          color: "var(--ag-text)",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,170,0.05)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        {node.type === "folder" && (
          <svg
            width="7" height="7" viewBox="0 0 8 8" fill="rgba(78,98,128,0.7)"
            className={`transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}
          >
            <path d="M2 0 L6 4 L2 8 Z" />
          </svg>
        )}
        <FileIcon type={node.type} name={node.name} />
        <span className="truncate font-mono" style={{ color: node.type === "folder" ? "#94a3b8" : "#8fa3bc" }}>
          {node.name}
        </span>
      </button>
      {node.type === "folder" && open && node.children?.map((child) => (
        <TreeNode key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { files } = useIDEStore();

  return (
    <div
      className="flex flex-col h-full overflow-hidden shrink-0"
      style={{
        width: 220,
        background: "linear-gradient(180deg, #070d1b 0%, #05091500 100%), #060c18",
        borderRight: "1px solid rgba(0,212,170,0.1)",
        boxShadow: "inset -4px 0 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2 flex items-center gap-2 shrink-0"
        style={{
          borderBottom: "1px solid rgba(0,212,170,0.08)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(0,212,170,0.5)">
          <rect x="0" y="0" width="4" height="4" rx="0.5" />
          <rect x="6" y="0" width="4" height="4" rx="0.5" />
          <rect x="0" y="6" width="4" height="4" rx="0.5" />
          <rect x="6" y="6" width="4" height="4" rx="0.5" />
        </svg>
        <span
          className="text-[9px] font-mono font-black tracking-[0.18em] uppercase"
          style={{ color: "rgba(0,212,170,0.45)" }}
        >
          EXPLORER
        </span>
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto px-1 py-1">
        {files.map((node) => (
          <TreeNode key={node.path} node={node} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-3 py-2 shrink-0"
        style={{ borderTop: "1px solid rgba(0,212,170,0.07)" }}
      >
        <div
          className="text-[8px] font-mono tracking-wider"
          style={{ color: "rgba(78,98,128,0.6)" }}
        >
          NUR FINANCE © 2024–2126
        </div>
      </div>
    </div>
  );
}
