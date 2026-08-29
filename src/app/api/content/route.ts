import { NextRequest, NextResponse } from "next/server";
import { getMarketBriefs, getRiskAlerts, getResearchNotes } from "@/lib/content/nfs-content";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "briefs";
  const category = searchParams.get("category") || undefined;
  const severity = searchParams.get("severity") || undefined;
  const sector = searchParams.get("sector") || undefined;
  const limit = parseInt(searchParams.get("limit") || "10");
  const id = searchParams.get("id") || undefined;

  switch (type) {
    case "briefs": {
      const briefs = getMarketBriefs(category, limit);
      if (id) {
        const brief = briefs.find((b) => b.id === id);
        return brief
          ? NextResponse.json({ type: "brief", data: brief })
          : NextResponse.json({ error: "Brief not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "briefs", data: briefs, total: briefs.length });
    }

    case "alerts": {
      const alerts = getRiskAlerts(severity);
      if (id) {
        const alert = alerts.find((a) => a.id === id);
        return alert
          ? NextResponse.json({ type: "alert", data: alert })
          : NextResponse.json({ error: "Alert not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "alerts", data: alerts, total: alerts.length });
    }

    case "research": {
      const notes = getResearchNotes(sector, limit);
      if (id) {
        const note = notes.find((n) => n.id === id);
        return note
          ? NextResponse.json({ type: "research", data: note })
          : NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      return NextResponse.json({ type: "research", data: notes, total: notes.length });
    }

    case "feed": {
      const briefs = getMarketBriefs(undefined, 5);
      const alerts = getRiskAlerts();
      const notes = getResearchNotes(undefined, 3);
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
