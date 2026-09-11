import { NextRequest, NextResponse } from "next/server";
import {
  generateVideoMetadata,
  uploadVideo,
  createLiveBroadcast,
  getBroadcastStatus,
  transitionBroadcast,
  type VideoPrivacy,
} from "@/lib/broadcast/youtubeUploader";
import type { TemplateType } from "@/lib/video/videoRenderer";

/**
 * GET /api/youtube?broadcastId=xxx
 * Returns status of a live broadcast.
 */
export async function GET(request: NextRequest) {
  const broadcastId = request.nextUrl.searchParams.get("broadcastId");
  if (!broadcastId) {
    return NextResponse.json({ ok: false, error: "Provide broadcastId query param" }, { status: 400 });
  }

  try {
    const status = await getBroadcastStatus(broadcastId);
    return NextResponse.json({ ok: true, broadcastId, status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/youtube
 * Actions:
 *   - generate_metadata : generate AI title/description/tags from template + context
 *   - upload_video      : upload a video blob URL or base64 to YouTube
 *   - create_broadcast  : create a new live broadcast + stream
 *   - transition        : transition broadcast status (testing | live | complete)
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = body;

  // ── GENERATE METADATA ─────────────────────────────────────────────────────
  if (action === "generate_metadata") {
    const { template, symbol, headline, marketMood } = body;

    if (!template) {
      return NextResponse.json({ ok: false, error: "Missing template" }, { status: 400 });
    }

    const date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });

    const metadata = generateVideoMetadata({
      template: template as TemplateType,
      symbol:   symbol   ? String(symbol)   : undefined,
      headline: headline ? String(headline) : undefined,
      marketMood: (marketMood as "bullish" | "bearish" | "neutral") ?? "neutral",
      date,
    });

    return NextResponse.json({ ok: true, metadata });
  }

  // ── UPLOAD VIDEO ──────────────────────────────────────────────────────────
  if (action === "upload_video") {
    const {
      videoBase64, mimeType,
      title, description, tags, categoryId, privacy,
      thumbnailDataUrl, playlistId,
      template, symbol, headline, marketMood,
    } = body;

    if (!videoBase64) {
      return NextResponse.json({
        ok: false,
        error: "Missing videoBase64 (base64-encoded video bytes)",
      }, { status: 400 });
    }

    const videoBuffer = Buffer.from(String(videoBase64), "base64");

    // Build metadata: explicit fields override generated ones
    const generated = generateVideoMetadata({
      template: (template as TemplateType) ?? "market_bulletin",
      symbol:      symbol      ? String(symbol)   : undefined,
      headline:    headline    ? String(headline) : undefined,
      marketMood: (marketMood as "bullish" | "bearish" | "neutral") ?? "neutral",
    });

    const metadata = { ...generated };
    if (title       && typeof title       === "string") metadata.title       = title;
    if (description && typeof description === "string") metadata.description = description;
    if (tags        && Array.isArray(tags))             metadata.tags        = tags.map(String);
    if (categoryId  && typeof categoryId  === "string") metadata.categoryId  = categoryId;
    if (privacy     && typeof privacy     === "string") metadata.privacy     = privacy as VideoPrivacy;
    if (thumbnailDataUrl && typeof thumbnailDataUrl === "string") metadata.thumbnailDataUrl = thumbnailDataUrl;
    if (playlistId  && typeof playlistId  === "string") metadata.playlistId  = playlistId;

    try {
      const result = await uploadVideo({
        videoBlob: videoBuffer,
        metadata,
      });

      return NextResponse.json({ ok: true, result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  // ── CREATE LIVE BROADCAST ─────────────────────────────────────────────────
  if (action === "create_broadcast") {
    const { title, description, scheduledStartTime, privacy, enableDvr, enableAutoStart } = body;

    if (!title || !description) {
      return NextResponse.json({ ok: false, error: "Missing title or description" }, { status: 400 });
    }

    try {
      const broadcast = await createLiveBroadcast({
        title:              String(title),
        description:        String(description),
        scheduledStartTime: scheduledStartTime ? String(scheduledStartTime) : undefined,
        privacy:            (privacy as VideoPrivacy) ?? "public",
        enableDvr:          enableDvr !== false,
        enableAutoStart:    Boolean(enableAutoStart),
      });

      return NextResponse.json({
        ok: true,
        broadcast,
        note: `Push RTMP stream to: ${broadcast.rtmpUrl}`,
        ffmpegExample: [
          "ffmpeg",
          "-re -i output.mp4",
          `-f flv "${broadcast.rtmpUrl}"`,
        ].join(" "),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  // ── TRANSITION BROADCAST ──────────────────────────────────────────────────
  if (action === "transition") {
    const { broadcastId, status } = body;
    if (!broadcastId || !status) {
      return NextResponse.json({ ok: false, error: "Missing broadcastId or status" }, { status: 400 });
    }
    if (!["testing", "live", "complete"].includes(String(status))) {
      return NextResponse.json({ ok: false, error: "status must be testing | live | complete" }, { status: 400 });
    }

    try {
      await transitionBroadcast(String(broadcastId), status as "testing" | "live" | "complete");
      return NextResponse.json({ ok: true, broadcastId, newStatus: status });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
