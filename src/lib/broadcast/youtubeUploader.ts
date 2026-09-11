/**
 * NUR Finance YouTube & Broadcast Automation
 * YouTube Data API v3 integration for automated market bulletin uploads and live streams.
 *
 * Required env vars:
 *   YOUTUBE_API_KEY          — for public data reads
 *   YOUTUBE_CLIENT_ID        — OAuth2 client ID
 *   YOUTUBE_CLIENT_SECRET    — OAuth2 client secret
 *   YOUTUBE_REFRESH_TOKEN    — long-lived refresh token (from OAuth consent)
 *   YOUTUBE_CHANNEL_ID       — target channel ID
 *
 * Token refresh is handled automatically via refreshAccessToken().
 * All uploads use resumable multipart upload to handle large video files.
 */

import type { TemplateType } from "@/lib/video/videoRenderer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type VideoPrivacy = "public" | "unlisted" | "private";
export type BroadcastStatus = "created" | "ready" | "live" | "complete" | "error";

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;   // YouTube category (25 = News & Politics, 22 = People & Blogs)
  privacy: VideoPrivacy;
  thumbnailDataUrl?: string;   // base64 PNG
  playlistId?: string;
  language?: string;           // ISO 639-1, default "en"
  madeForKids?: boolean;
}

export interface UploadResult {
  videoId: string;
  youtubeUrl: string;
  title: string;
  privacy: VideoPrivacy;
  uploadedAt: string;
}

export interface LiveBroadcast {
  broadcastId: string;
  streamId: string;
  streamKey: string;
  rtmpUrl: string;      // push stream here (OBS / ffmpeg)
  youtubeUrl: string;
  scheduledStartTime?: string;
  status: BroadcastStatus;
}

export interface TitleGeneratorInput {
  template: TemplateType;
  symbol?: string;
  headline?: string;
  date?: string;
  marketMood?: "bullish" | "bearish" | "neutral";
}

// ─── AI Title / Description / Tags Generator ─────────────────────────────────

export function generateVideoMetadata(input: TitleGeneratorInput): VideoMetadata {
  const date = input.date ?? new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });

  switch (input.template) {
    case "market_bulletin": {
      const mood = input.marketMood ?? "neutral";
      const moodEmoji = mood === "bullish" ? "📈" : mood === "bearish" ? "📉" : "📊";
      const headline = input.headline ?? "Global Markets Update";
      return {
        title: `${moodEmoji} ${headline} | NUR Finance Daily Bulletin – ${date}`,
        description: [
          `${headline}`,
          "",
          `📊 Daily market intelligence from NUR Finance — the sovereign financial terminal.`,
          `🌐 Live indices | Global equities | Crypto | Commodities`,
          "",
          `⚡ NUR Finance — Competing with Bloomberg & Reuters at a fraction of the cost.`,
          `🔗 Terminal access: https://nur.finance`,
          "",
          `💡 Compute-for-Access: Mine $NUR with your idle GPU and get FREE terminal access.`,
          "",
          `#NURFinance #MarketBulletin #GlobalMarkets #StockMarket #FinancialNews #Bloomberg #Reuters`,
        ].join("\n"),
        tags: [
          "NUR Finance", "market bulletin", "daily markets", "global markets",
          "stock market news", "financial terminal", "bloomberg alternative",
          "reuters alternative", "NUR coin", "DePIN", "compute for access",
          "market analysis", date,
        ],
        categoryId: "25",
        privacy: "public",
        language: "en",
        madeForKids: false,
      };
    }

    case "stock_analysis": {
      const sym = input.symbol ?? "UNKNOWN";
      return {
        title: `${sym} Stock Analysis | NUR Finance AI – ${date}`,
        description: [
          `Deep-dive technical and fundamental analysis of $${sym}.`,
          "",
          `📈 Charts | RSI | MACD | Analyst ratings | Price targets`,
          `Powered by NUR Finance AI — real-time market intelligence.`,
          "",
          `🔗 Full terminal: https://nur.finance`,
          `💡 Mine $NUR with your GPU and access the terminal for free.`,
          "",
          `#${sym} #StockAnalysis #NURFinance #TechnicalAnalysis #Investing`,
        ].join("\n"),
        tags: [
          sym, `${sym} stock`, `${sym} analysis`, "stock analysis",
          "NUR Finance", "technical analysis", "investing", "stock market",
          "AI finance", date,
        ],
        categoryId: "25",
        privacy: "public",
        language: "en",
        madeForKids: false,
      };
    }

    case "depin_metrics": {
      return {
        title: `$NUR Mining Pool Live Stats | DePIN Network Update – ${date}`,
        description: [
          `Live DePIN mining pool metrics for the NUR Finance compute network.`,
          "",
          `⛏️ Share your idle GPU → Earn $NUR → Access the NUR Finance terminal for free`,
          `📊 Active miners | Hash rate | NUR earned | Regional distribution`,
          "",
          `🔗 Join the pool: https://nur.finance/compute`,
          `💰 NUR/EUR rate updated daily`,
          "",
          `#NURCoin #DePIN #GPUMining #CryptoMining #PassiveIncome #Web3`,
        ].join("\n"),
        tags: [
          "NUR coin", "DePIN", "GPU mining", "compute for access",
          "NUR Finance", "crypto mining", "passive income", "Web3",
          "decentralized infrastructure", date,
        ],
        categoryId: "22",
        privacy: "public",
        language: "en",
        madeForKids: false,
      };
    }

    case "nur_digest": {
      const mood = input.marketMood ?? "neutral";
      const moodEmoji = mood === "bullish" ? "🚀" : mood === "bearish" ? "⚠️" : "🗞️";
      return {
        title: `${moodEmoji} NUR Finance Daily Digest – ${date}`,
        description: [
          `Your daily financial intelligence digest from NUR Finance.`,
          "",
          `📰 Top market stories | Expert insights | Global macro`,
          `Curated by NUR Finance AI — sovereign-grade financial intelligence.`,
          "",
          `🔗 Full terminal: https://nur.finance`,
          "",
          `#NURFinance #DailyDigest #FinancialNews #Markets #MacroEconomics`,
        ].join("\n"),
        tags: [
          "NUR Finance", "daily digest", "financial news", "market news",
          "global macro", "investing", "finance", "market intelligence", date,
        ],
        categoryId: "25",
        privacy: "public",
        language: "en",
        madeForKids: false,
      };
    }
  }
}

// ─── OAuth2 Token Management ──────────────────────────────────────────────────

let _cachedAccessToken: string | null = null;
let _tokenExpiresAt: number = 0;

async function refreshAccessToken(): Promise<string> {
  if (_cachedAccessToken && Date.now() < _tokenExpiresAt - 30_000) {
    return _cachedAccessToken;
  }

  const clientId     = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing YouTube OAuth2 credentials: YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN");
  }

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type:    "refresh_token",
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`YouTube token refresh failed (${resp.status}): ${err}`);
  }

  const json = await resp.json() as { access_token: string; expires_in: number };
  _cachedAccessToken = json.access_token;
  _tokenExpiresAt = Date.now() + json.expires_in * 1000;
  return _cachedAccessToken;
}

// ─── Resumable Upload ─────────────────────────────────────────────────────────

async function uploadVideoBlob(
  token: string,
  videoBlob: Blob | Buffer,
  metadata: VideoMetadata
): Promise<string> {
  const mimeType = videoBlob instanceof Blob ? videoBlob.type : "video/mp4";
  const size = videoBlob instanceof Blob ? videoBlob.size : (videoBlob as Buffer).byteLength;

  // Step 1: initiate resumable upload
  const initResp = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mimeType,
        "X-Upload-Content-Length": String(size),
      },
      body: JSON.stringify({
        snippet: {
          title:       metadata.title,
          description: metadata.description,
          tags:        metadata.tags,
          categoryId:  metadata.categoryId,
          defaultLanguage: metadata.language ?? "en",
        },
        status: {
          privacyStatus: metadata.privacy,
          madeForKids:   metadata.madeForKids ?? false,
        },
      }),
    }
  );

  if (!initResp.ok) {
    const err = await initResp.text();
    throw new Error(`YouTube upload init failed (${initResp.status}): ${err}`);
  }

  const uploadUrl = initResp.headers.get("Location");
  if (!uploadUrl) throw new Error("YouTube did not return upload URL");

  // Step 2: upload video bytes
  const body = videoBlob instanceof Blob ? videoBlob : new Blob([videoBlob.buffer as ArrayBuffer], { type: mimeType });
  const uploadResp = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(size),
    },
    body,
  });

  if (!uploadResp.ok && uploadResp.status !== 308) {
    const err = await uploadResp.text();
    throw new Error(`YouTube upload failed (${uploadResp.status}): ${err}`);
  }

  const result = await uploadResp.json() as { id: string };
  return result.id;
}

// ─── Thumbnail Upload ─────────────────────────────────────────────────────────

async function uploadThumbnail(token: string, videoId: string, dataUrl: string): Promise<void> {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const bytes = Buffer.from(base64, "base64");

  const resp = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "image/png",
        "Content-Length": String(bytes.byteLength),
      },
      body: bytes,
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    // Non-fatal — log but don't throw
    console.warn(`YouTube thumbnail upload failed (${resp.status}): ${err}`);
  }
}

// ─── Playlist Add ─────────────────────────────────────────────────────────────

async function addToPlaylist(token: string, videoId: string, playlistId: string): Promise<void> {
  const resp = await fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: { kind: "youtube#video", videoId },
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.warn(`Playlist add failed (${resp.status}): ${err}`);
  }
}

// ─── Main Upload Function ─────────────────────────────────────────────────────

export interface UploadVideoOptions {
  videoBlob: Blob | Buffer;
  metadata: VideoMetadata;
}

export async function uploadVideo(opts: UploadVideoOptions): Promise<UploadResult> {
  const token = await refreshAccessToken();
  const videoId = await uploadVideoBlob(token, opts.videoBlob, opts.metadata);

  if (opts.metadata.thumbnailDataUrl) {
    await uploadThumbnail(token, videoId, opts.metadata.thumbnailDataUrl);
  }

  if (opts.metadata.playlistId) {
    await addToPlaylist(token, videoId, opts.metadata.playlistId);
  }

  return {
    videoId,
    youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
    title: opts.metadata.title,
    privacy: opts.metadata.privacy,
    uploadedAt: new Date().toISOString(),
  };
}

// ─── Live Broadcast ───────────────────────────────────────────────────────────

export interface CreateLiveBroadcastOptions {
  title: string;
  description: string;
  scheduledStartTime?: string;   // ISO 8601
  privacy?: VideoPrivacy;
  enableDvr?: boolean;
  enableAutoStart?: boolean;
}

export async function createLiveBroadcast(opts: CreateLiveBroadcastOptions): Promise<LiveBroadcast> {
  const token = await refreshAccessToken();

  // 1. Create broadcast
  const broadcastResp = await fetch("https://www.googleapis.com/youtube/v3/liveBroadcasts?part=snippet,status,contentDetails", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      snippet: {
        title: opts.title,
        description: opts.description,
        scheduledStartTime: opts.scheduledStartTime ?? new Date(Date.now() + 60_000).toISOString(),
      },
      status: {
        privacyStatus: opts.privacy ?? "public",
        selfDeclaredMadeForKids: false,
      },
      contentDetails: {
        enableDvr:       opts.enableDvr ?? true,
        enableAutoStart: opts.enableAutoStart ?? false,
        enableAutoStop:  true,
        recordFromStart: true,
      },
    }),
  });

  if (!broadcastResp.ok) {
    const err = await broadcastResp.text();
    throw new Error(`Create live broadcast failed (${broadcastResp.status}): ${err}`);
  }

  const broadcast = await broadcastResp.json() as { id: string };

  // 2. Create stream
  const streamResp = await fetch("https://www.googleapis.com/youtube/v3/liveStreams?part=snippet,cdn", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      snippet: { title: `NUR Finance Stream – ${opts.title}` },
      cdn: {
        frameRate:    "60fps",
        ingestionType: "rtmp",
        resolution:   "1080p",
      },
    }),
  });

  if (!streamResp.ok) {
    const err = await streamResp.text();
    throw new Error(`Create live stream failed (${streamResp.status}): ${err}`);
  }

  const stream = await streamResp.json() as {
    id: string;
    cdn: { ingestionInfo: { ingestionAddress: string; streamName: string } };
  };

  // 3. Bind broadcast to stream
  await fetch(
    `https://www.googleapis.com/youtube/v3/liveBroadcasts/bind?id=${broadcast.id}&streamId=${stream.id}&part=id,snippet`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );

  const rtmpBase = stream.cdn.ingestionInfo.ingestionAddress;
  const streamKey = stream.cdn.ingestionInfo.streamName;

  return {
    broadcastId: broadcast.id,
    streamId:    stream.id,
    streamKey,
    rtmpUrl:     `${rtmpBase}/${streamKey}`,
    youtubeUrl:  `https://www.youtube.com/watch?v=${broadcast.id}`,
    scheduledStartTime: opts.scheduledStartTime,
    status: "created",
  };
}

// ─── Broadcast Status ─────────────────────────────────────────────────────────

export async function getBroadcastStatus(broadcastId: string): Promise<BroadcastStatus> {
  const token = await refreshAccessToken();
  const resp = await fetch(
    `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=status&id=${broadcastId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!resp.ok) throw new Error(`Get broadcast status failed (${resp.status})`);

  const json = await resp.json() as {
    items?: { status: { lifeCycleStatus: string } }[]
  };

  const lifecycle = json.items?.[0]?.status?.lifeCycleStatus ?? "error";
  const map: Record<string, BroadcastStatus> = {
    created: "created", ready: "ready", live: "live",
    complete: "complete", revoked: "error",
  };
  return map[lifecycle] ?? "error";
}

// ─── Transition Broadcast to Live ─────────────────────────────────────────────

export async function transitionBroadcast(
  broadcastId: string,
  status: "testing" | "live" | "complete"
): Promise<void> {
  const token = await refreshAccessToken();
  const resp = await fetch(
    `https://www.googleapis.com/youtube/v3/liveBroadcasts/transition?broadcastStatus=${status}&id=${broadcastId}&part=status`,
    { method: "POST", headers: { Authorization: `Bearer ${token}` } }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Broadcast transition to ${status} failed (${resp.status}): ${err}`);
  }
}
