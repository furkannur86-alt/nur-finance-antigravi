import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { code, language, mode } = body;
  if (!code) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }

  const lang = language || "javascript";

  if (mode === "simulate") {
    const startTime = Date.now();
    if (lang === "python") {
      const output = simulatePython(code);
      return NextResponse.json({
        language: lang,
        mode: "simulate",
        output: output.lines,
        errors: output.errors,
        executionTime: Date.now() - startTime,
        status: output.errors.length > 0 ? "error" : "success",
      });
    }
    if (lang === "javascript" || lang === "typescript") {
      const output = simulateJS(code);
      return NextResponse.json({
        language: lang,
        mode: "simulate",
        output: output.lines,
        errors: output.errors,
        executionTime: Date.now() - startTime,
        status: output.errors.length > 0 ? "error" : "success",
      });
    }
  }

  return NextResponse.json(
    {
      error: "Sandbox execution is not available",
      message:
        "Server-side code execution is disabled in production for security. " +
        "Use mode: \"simulate\" for output-pattern simulation, or run code in the browser console.",
      supportedSimulation: ["javascript", "typescript", "python"],
    },
    { status: 501 },
  );
}

function simulatePython(code: string): { lines: string[]; errors: string[] } {
  const lines: string[] = [];
  const errors: string[] = [];
  const codeLines = code.split("\n");

  for (const line of codeLines) {
    const trimmed = line.trim();

    const printMatch = trimmed.match(/^print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)$/);
    if (printMatch) {
      let output = printMatch[1] || printMatch[2] || "";
      output = output.replace(/\{([^}]+)\}/g, (_, expr) => {
        if (expr.includes("*")) {
          try {
            const parts = expr.split("*").map((p: string) => parseFloat(p.trim()));
            if (parts.every((p: number) => !isNaN(p))) return String(parts.reduce((a: number, b: number) => a * b, 1));
          } catch { /* no-op */ }
        }
        if (expr.includes("+")) {
          try {
            const parts = expr.split("+").map((p: string) => parseFloat(p.trim()));
            if (parts.every((p: number) => !isNaN(p))) return String(parts.reduce((a: number, b: number) => a + b, 0));
          } catch { /* no-op */ }
        }
        return `{${expr}}`;
      });
      lines.push(output);
      continue;
    }

    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      const mod = trimmed.split(/\s+/)[1];
      lines.push(`[import] ${mod} loaded`);
      continue;
    }

    if (trimmed.startsWith("raise ")) {
      errors.push(trimmed.substring(6));
      continue;
    }
  }

  if (lines.length === 0 && errors.length === 0) {
    lines.push("[AntiGravi] Code parsed successfully (no output detected).");
  }

  return { lines, errors };
}

function simulateJS(code: string): { lines: string[]; errors: string[] } {
  const lines: string[] = [];
  const errors: string[] = [];
  const codeLines = code.split("\n");

  for (const line of codeLines) {
    const trimmed = line.trim();
    const logMatch = trimmed.match(/console\.log\s*\(\s*(?:["'`](.+?)["'`]|(.+?))\s*\)/);
    if (logMatch) {
      lines.push(logMatch[1] || logMatch[2] || "");
    }
    if (trimmed.startsWith("throw ")) {
      errors.push(trimmed.substring(6));
    }
  }

  if (lines.length === 0 && errors.length === 0) {
    lines.push("[AntiGravi] Code parsed successfully (no output detected).");
  }

  return { lines, errors };
}
