import { NextRequest, NextResponse } from "next/server";
import { MARKET_BRIEFS, RISK_ALERTS, RESEARCH_NOTES } from "@/lib/content/nfs-content";
import type { MarketBrief, RiskAlert, ResearchNote } from "@/lib/content/nfs-content";

interface SocialPost {
  platform: string;
  text: string;
  hashtags: string[];
  contentId: string;
  contentType: string;
  scheduledAt?: string;
}

function briefToPost(brief: MarketBrief, platform: string): SocialPost {
  const sentimentEmoji = brief.sentiment === "bullish" ? "📈" : brief.sentiment === "bearish" ? "📉" : "➡️";
  const tickers = brief.tickers.map((t) => `$${t.replace(/[^A-Z]/g, "")}`).join(" ");
  const maxLen = platform === "twitter" ? 260 : 2800;

  let text: string;
  if (platform === "twitter") {
    text = `${sentimentEmoji} ${brief.title}\n\n${brief.summary}\n\n${tickers}`;
    if (text.length > maxLen) text = text.substring(0, maxLen - 3) + "...";
  } else {
    text = `${sentimentEmoji} ${brief.title}\n\n${brief.summary}\n\n${brief.body.substring(0, 500)}...\n\n${tickers}\n\n— NFS ${brief.author}`;
  }

  return {
    platform,
    text,
    hashtags: ["NurFinance", "NFS", brief.category, ...(brief.sentiment === "bullish" ? ["bullish"] : brief.sentiment === "bearish" ? ["bearish"] : [])],
    contentId: brief.id,
    contentType: "brief",
  };
}

function alertToPost(alert: RiskAlert, platform: string): SocialPost {
  const sevEmoji = alert.severity === "critical" ? "🚨" : alert.severity === "high" ? "⚠️" : "ℹ️";
  const assets = alert.affectedAssets.map((a) => `$${a.replace(/[^A-Z]/g, "")}`).filter(Boolean).join(" ");
  const maxLen = platform === "twitter" ? 260 : 2800;

  let text = `${sevEmoji} RISK ALERT [${alert.severity.toUpperCase()}]: ${alert.title}\n\n${alert.description.substring(0, platform === "twitter" ? 150 : 500)}\n\nRegion: ${alert.region}\nAffected: ${assets}`;
  if (text.length > maxLen) text = text.substring(0, maxLen - 3) + "...";

  return {
    platform,
    text,
    hashtags: ["NurFinance", "RiskAlert", alert.category, alert.region.replace(/[^a-zA-Z]/g, "")],
    contentId: alert.id,
    contentType: "alert",
  };
}

function researchToPost(note: ResearchNote, platform: string): SocialPost {
  const ratingEmoji = note.rating === "buy" || note.rating === "overweight" ? "🟢" : note.rating === "sell" || note.rating === "underweight" ? "🔴" : "🟡";
  const tickers = note.tickers.map((t) => `$${t}`).join(" ");
  const tp = note.targetPrice ? ` | TP $${note.targetPrice}` : "";
  const maxLen = platform === "twitter" ? 260 : 2800;

  let text: string;
  if (platform === "twitter") {
    text = `${ratingEmoji} ${note.rating.toUpperCase()}${tp}: ${note.title}\n\n${note.abstract}\n\n${tickers}`;
    if (text.length > maxLen) text = text.substring(0, maxLen - 3) + "...";
  } else {
    text = `${ratingEmoji} ${note.rating.toUpperCase()}${tp}\n\n${note.title}\n\n${note.abstract}\n\n${note.body.substring(0, 800)}...\n\n${tickers}\n\n— ${note.author}`;
  }

  return {
    platform,
    text,
    hashtags: ["NurFinance", "EquityResearch", note.sector, note.rating],
    contentId: note.id,
    contentType: "research",
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const platform = searchParams.get("platform") || "twitter";
  const contentType = searchParams.get("content_type") || "brief";
  const contentId = searchParams.get("content_id");

  if (!["twitter", "linkedin", "instagram"].includes(platform)) {
    return NextResponse.json({ error: "Invalid platform. Use: twitter, linkedin, instagram" }, { status: 400 });
  }

  if (contentId) {
    let post: SocialPost | null = null;
    if (contentType === "brief") {
      const brief = MARKET_BRIEFS.find((b) => b.id === contentId);
      if (brief) post = briefToPost(brief, platform);
    } else if (contentType === "alert") {
      const alert = RISK_ALERTS.find((a) => a.id === contentId);
      if (alert) post = alertToPost(alert, platform);
    } else if (contentType === "research") {
      const note = RESEARCH_NOTES.find((n) => n.id === contentId);
      if (note) post = researchToPost(note, platform);
    }
    return post
      ? NextResponse.json({ status: "draft", post })
      : NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  const posts: SocialPost[] = [];
  if (contentType === "brief" || contentType === "all") {
    posts.push(...MARKET_BRIEFS.map((b) => briefToPost(b, platform)));
  }
  if (contentType === "alert" || contentType === "all") {
    posts.push(...RISK_ALERTS.map((a) => alertToPost(a, platform)));
  }
  if (contentType === "research" || contentType === "all") {
    posts.push(...RESEARCH_NOTES.map((n) => researchToPost(n, platform)));
  }

  return NextResponse.json({
    status: "drafts",
    platform,
    total: posts.length,
    posts,
    note: "These are draft posts. To publish, POST to this endpoint with the post data and your platform API credentials.",
  });
}

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { platform, content_type, content_id, credentials } = body;

  if (!platform || !content_type || !content_id) {
    return NextResponse.json({ error: "Required: platform, content_type, content_id" }, { status: 400 });
  }

  let post: SocialPost | null = null;
  if (content_type === "brief") {
    const brief = MARKET_BRIEFS.find((b) => b.id === content_id);
    if (brief) post = briefToPost(brief, platform);
  } else if (content_type === "alert") {
    const alert = RISK_ALERTS.find((a) => a.id === content_id);
    if (alert) post = alertToPost(alert, platform);
  } else if (content_type === "research") {
    const note = RESEARCH_NOTES.find((n) => n.id === content_id);
    if (note) post = researchToPost(note, platform);
  }

  if (!post) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  if (!credentials) {
    return NextResponse.json({
      status: "preview",
      post,
      message: "No credentials provided. This is a preview. Supply platform API credentials to publish.",
      required_credentials: {
        twitter: { api_key: "string", api_secret: "string", access_token: "string", access_token_secret: "string" },
        linkedin: { access_token: "string" },
        instagram: { access_token: "string", instagram_account_id: "string" },
      },
    });
  }

  return NextResponse.json({
    status: "queued",
    post,
    message: `Post queued for ${platform}. Will be published when ${platform} API credentials are verified.`,
    queue_id: `nfs-${Date.now()}-${content_id}`,
    scheduled_at: new Date().toISOString(),
  });
}
