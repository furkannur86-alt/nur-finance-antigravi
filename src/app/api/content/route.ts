import { NextRequest, NextResponse } from "next/server";
import { getMarketBriefs, getRiskAlerts, getResearchNotes } from "@/lib/content/nfs-content";
import type { MarketBrief, RiskAlert, ResearchNote } from "@/lib/content/nfs-content";

function withinDateRange<T extends { publishedAt: string }>(items: T[], from?: string, to?: string): T[] {
  let result = items;
  if (from) {
    const fromDate = new Date(from).getTime();
    if (!isNaN(fromDate)) result = result.filter((item) => new Date(item.publishedAt).getTime() >= fromDate);
  }
  if (to) {
    const toDate = new Date(to).getTime();
    if (!isNaN(toDate)) result = result.filter((item) => new Date(item.publishedAt).getTime() <= toDate);
  }
  return result;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "briefs";
  const category = searchParams.get("category") || undefined;
  const severity = searchParams.get("severity") || undefined;
  const sector = searchParams.get("sector") || undefined;
  const limit = parseInt(searchParams.get("limit") || "10");
  const id = searchParams.get("id") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  switch (type) {
    case "briefs": {
      let briefs: MarketBrief[] = getMarketBriefs(category, limit);
      briefs = withinDateRange(briefs, from, to);
      if (id) {
        const brief = briefs.find((b) => b.id === id);
        return brief
          ? NextResponse.json({ type: "brief", data: brief })
          : NextResponse.json({ error: "Brief not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "briefs", data: briefs, total: briefs.length });
    }

    case "alerts": {
      let alerts: RiskAlert[] = getRiskAlerts(severity);
      alerts = withinDateRange(alerts, from, to);
      if (id) {
        const alert = alerts.find((a) => a.id === id);
        return alert
          ? NextResponse.json({ type: "alert", data: alert })
          : NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "alerts", data: alerts, total: alerts.length });
    }

    case "research": {
      let notes: ResearchNote[] = getResearchNotes(sector, limit);
      notes = withinDateRange(notes, from, to);
      if (id) {
        const note = notes.find((n) => n.id === id);
        return note
          ? NextResponse.json({ type: "research", data: note })
          : NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "research", data: notes, total: notes.length });
    }

    case "feed": {
      let briefs: MarketBrief[] = getMarketBriefs(undefined, 5);
      let alerts: RiskAlert[] = getRiskAlerts();
      let notes: ResearchNote[] = getResearchNotes(undefined, 3);
      briefs = withinDateRange(briefs, from, to);
      alerts = withinDateRange(alerts, from, to);
      notes = withinDateRange(notes, from, to);
      return NextResponse.json({
        type: "feed",
        briefs: briefs.map((b) => ({ id: b.id, title: b.title, summary: b.summary, category: b.category, sentiment: b.sentiment, publishedAt: b.publishedAt })),
        alerts: alerts.map((a) => ({ id: a.id, title: a.title, severity: a.severity, region: a.region, category: a.category, publishedAt: a.publishedAt })),
        research: notes.map((n) => ({ id: n.id, title: n.title, abstract: n.abstract, sector: n.sector, rating: n.rating, publishedAt: n.publishedAt })),
      });
    }

    default:
      return NextResponse.json({ error: "Invalid type. Use: briefs, alerts, research, feed" }, { status: 400 });
  }
}
