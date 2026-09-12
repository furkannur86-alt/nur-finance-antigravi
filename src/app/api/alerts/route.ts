/**
 * NUR Finance — Alerts API
 *
 * Manages AlertRule CRUD and evaluates rules against live market data.
 *
 * GET  /api/alerts              — list all rules
 * POST /api/alerts              — create a rule
 * PUT  /api/alerts              — update a rule (body: {id, ...fields})
 * DELETE /api/alerts?id=<id>   — delete a rule
 * POST /api/alerts/evaluate    — evaluate all enabled rules, return triggered notifications
 *
 * Storage: in-memory Map (replace with Supabase in production)
 */

import { NextRequest, NextResponse } from "next/server";
import { AlertRule, HUDNotification } from "@/types";

// ─── In-memory store (keyed by rule id) ──────────────────────────────────────

const alertStore = new Map<string, AlertRule>();

// Seed with sensible defaults
const DEFAULT_RULES: AlertRule[] = [
  {
    id: "vix-critical",
    name: "VIX Critical Level",
    category: "VIX_REGIME",
    condition: "GREATER_THAN",
    threshold: 30,
    enabled: true,
    soundEnabled: true,
  },
  {
    id: "vix-elevated",
    name: "VIX Elevated",
    category: "VIX_REGIME",
    condition: "GREATER_THAN",
    threshold: 20,
    enabled: true,
    soundEnabled: false,
  },
  {
    id: "spx-macro-drop",
    name: "S&P 500 Daily Drop",
    category: "PRICE",
    targetSymbol: "SPY",
    condition: "LESS_THAN",
    threshold: -2,
    enabled: true,
    soundEnabled: true,
  },
];

for (const rule of DEFAULT_RULES) {
  alertStore.set(rule.id, rule);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeId(): string {
  return `rule-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeNotificationId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── EODHD price fetch ───────────────────────────────────────────────────────

interface EodhdQuote {
  code: string;
  close: number;
  change_p: number;
}

async function fetchQuote(symbol: string): Promise<EodhdQuote | null> {
  const token = process.env.EODHD_API_TOKEN;
  if (!token) return null;

  const [ticker, exchange = "US"] = symbol.split(".");
  const url = `https://eodhd.com/api/real-time/${ticker}.${exchange}?api_token=${token}&fmt=json`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json() as { close: number; change_p: number };
    return { code: symbol, close: data.close, change_p: data.change_p };
  } catch {
    return null;
  }
}

// Fetch VIX from the EODHD index endpoint
async function fetchVix(): Promise<number | null> {
  const token = process.env.EODHD_API_TOKEN;
  if (!token) return null;

  const url = `https://eodhd.com/api/real-time/VIX.INDX?api_token=${token}&fmt=json`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json() as { close: number };
    return data.close;
  } catch {
    return null;
  }
}

// ─── Rule evaluation ─────────────────────────────────────────────────────────

interface MarketSnapshot {
  vix?: number;
  quotes: Map<string, EodhdQuote>;
}

function evaluate(rule: AlertRule, snap: MarketSnapshot): HUDNotification | null {
  if (!rule.enabled) return null;

  let triggered = false;
  let title = rule.name;
  let message = "";
  let severity: HUDNotification["severity"] = "INFO";

  if (rule.category === "VIX_REGIME") {
    const vix = snap.vix;
    if (vix == null) return null;

    if (rule.condition === "GREATER_THAN" && vix > rule.threshold) {
      triggered = true;
      severity = vix > 35 ? "CRITICAL" : "WARNING";
      message = `VIX at ${vix.toFixed(2)} exceeds threshold ${rule.threshold}. Market fear elevated.`;
    } else if (rule.condition === "LESS_THAN" && vix < rule.threshold) {
      triggered = true;
      severity = "INFO";
      message = `VIX at ${vix.toFixed(2)} is below ${rule.threshold}. Low volatility regime.`;
    }
  }

  if (rule.category === "PRICE" && rule.targetSymbol) {
    const quote = snap.quotes.get(rule.targetSymbol);
    if (!quote) return null;

    const value = rule.condition.includes("CHANGE") ? quote.change_p : quote.close;
    const compare = rule.condition === "GREATER_THAN" || rule.condition === "CROSS_ABOVE"
      ? value > rule.threshold
      : value < rule.threshold;

    if (compare) {
      triggered = true;
      const isNegative = rule.condition === "LESS_THAN" || rule.condition === "CROSS_BELOW";
      severity = isNegative ? (Math.abs(quote.change_p) > 3 ? "CRITICAL" : "WARNING") : "INFO";
      title = `${rule.targetSymbol}: ${rule.name}`;
      message = `${rule.targetSymbol} at $${quote.close.toFixed(2)} (${quote.change_p > 0 ? "+" : ""}${quote.change_p.toFixed(2)}%). Threshold: ${rule.condition.replace(/_/g, " ")} ${rule.threshold}.`;
    }
  }

  if (rule.category === "MACRO_SURPRISE") {
    // Placeholder: real implementation hooks into an economic calendar API
    return null;
  }

  if (rule.category === "ACLED_CONFLICT") {
    // Placeholder: real implementation hooks into the conflicts API
    return null;
  }

  if (!triggered) return null;

  return {
    id: makeNotificationId(),
    title,
    message,
    severity,
    category: rule.category,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

// ─── Route handlers ───────────────────────────────────────────────────────────

export async function GET() {
  const rules = Array.from(alertStore.values());
  return NextResponse.json({ rules, count: rules.length });
}

export async function POST(req: NextRequest) {
  const url = req.nextUrl;

  // POST /api/alerts/evaluate
  if (url.pathname.endsWith("/evaluate")) {
    const rules = Array.from(alertStore.values()).filter(r => r.enabled);

    // Collect symbols needed
    const symbols = new Set<string>();
    let needVix = false;
    for (const r of rules) {
      if (r.category === "VIX_REGIME") needVix = true;
      if (r.category === "PRICE" && r.targetSymbol) symbols.add(r.targetSymbol);
    }

    // Fetch in parallel
    const [vix, ...quoteResults] = await Promise.all([
      needVix ? fetchVix() : Promise.resolve<number | null>(null),
      ...Array.from(symbols).map(s => fetchQuote(s)),
    ]);

    const quoteMap = new Map<string, EodhdQuote>();
    const symbolArr = Array.from(symbols);
    quoteResults.forEach((q, i) => { if (q) quoteMap.set(symbolArr[i], q); });

    const snap: MarketSnapshot = { vix: vix ?? undefined, quotes: quoteMap };
    const notifications: HUDNotification[] = [];

    for (const rule of rules) {
      const notif = evaluate(rule, snap);
      if (notif) {
        notifications.push(notif);
        // Mark lastTriggered
        alertStore.set(rule.id, { ...rule, lastTriggered: notif.timestamp });
      }
    }

    return NextResponse.json({ notifications, evaluated: rules.length, triggered: notifications.length });
  }

  // POST /api/alerts — create rule
  const body = await req.json() as Partial<AlertRule>;
  if (!body.name || !body.category || !body.condition || body.threshold == null) {
    return NextResponse.json({ error: "name, category, condition, threshold required" }, { status: 400 });
  }

  const rule: AlertRule = {
    id: makeId(),
    name: body.name,
    category: body.category,
    targetSymbol: body.targetSymbol,
    condition: body.condition,
    threshold: body.threshold,
    enabled: body.enabled ?? true,
    soundEnabled: body.soundEnabled ?? false,
  };

  alertStore.set(rule.id, rule);
  return NextResponse.json({ rule }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as Partial<AlertRule> & { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required for update" }, { status: 400 });
  }

  const existing = alertStore.get(body.id);
  if (!existing) {
    return NextResponse.json({ error: "rule not found" }, { status: 404 });
  }

  const updated: AlertRule = { ...existing, ...body, id: existing.id };
  alertStore.set(updated.id, updated);
  return NextResponse.json({ rule: updated });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id query parameter required" }, { status: 400 });
  }

  if (!alertStore.has(id)) {
    return NextResponse.json({ error: "rule not found" }, { status: 404 });
  }

  alertStore.delete(id);
  return NextResponse.json({ ok: true });
}
