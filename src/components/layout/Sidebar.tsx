"use client";

import { useState } from "react";
import { useIDEStore } from "@/stores/useIDEStore";
import { FileNode } from "@/types";

function FileIcon({ type, name }: { type: string; name: string }) {
  if (type === "folder") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="var(--ag-warning)" className="flex-shrink-0">
        <path d="M1 3h5l2 2h7v9H1V3z" />
      </svg>
    );
  }
  const ext = name.split(".").pop();
  const color =
    ext === "py" ? "#3b82f6" : ext === "json" ? "#f59e0b" : ext === "md" ? "#8b5cf6" : "var(--ag-muted)";
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill={color} className="flex-shrink-0">
      <path d="M3 1h7l4 4v10H3V1z" />
      <path d="M10 1v4h4" fill="none" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(true);
  const { openFile } = useIDEStore();

  const handleClick = () => {
    if (node.type === "folder") {
      setOpen(!open);
    } else {
      openFile(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 w-full text-left text-xs py-1 px-2 rounded hover:bg-white/5 transition-colors"
        style={{ paddingLeft: `${depth * 12 + 8}px`, color: "var(--ag-text)" }}
      >
        {node.type === "folder" && (
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="var(--ag-muted)"
            className={`transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}
          >
            <path d="M2 0 L6 4 L2 8 Z" />
          </svg>
        )}
        <FileIcon type={node.type} name={node.name} />
        <span className="truncate">{node.name}</span>
      </button>
      {node.type === "folder" && open && node.children?.map((child) => (
        <TreeNode key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { files, sidebarOpen } = useIDEStore();

  if (!sidebarOpen) return null;

  return (
    <div
      className="flex flex-col h-full overflow-hidden border-r"
      style={{ width: 240, background: "var(--ag-surface)", borderColor: "var(--ag-border)" }}
    >
      <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--ag-muted)" }}>
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto px-1">
        {files.map((node) => (
          <TreeNode key={node.path} node={node} />
        ))}
      </div>
      <div className="border-t px-3 py-2" style={{ borderColor: "var(--ag-border)" }}>
        <div className="text-[10px]" style={{ color: "var(--ag-muted)" }}>
          Nur Finance &copy; 2024-2026
        </div>
      </div>
    </div>
  );
}
