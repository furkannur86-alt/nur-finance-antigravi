#!/usr/bin/env npx ts-node --esm
/**
 * NUR Finance — Daily Recap: Generate & Upload to YouTube
 *
 * Usage:
 *   EODHD_API_TOKEN=xxx YOUTUBE_CLIENT_ID=xxx ... npx ts-node scripts/generate-and-upload-daily-recap.ts
 *
 * Environment variables:
 *   EODHD_API_TOKEN           — EODHD market data API key
 *   YOUTUBE_CLIENT_ID         — Google OAuth2 client ID
 *   YOUTUBE_CLIENT_SECRET     — Google OAuth2 client secret
 *   YOUTUBE_REFRESH_TOKEN     — YouTube OAuth2 refresh token
 *   GOOGLE_TTS_API_KEY        — Google Cloud TTS (optional, for voiceover)
 *   OUTPUT_DIR                — where to write temp video files (default: /tmp/nur-recap)
 *   UPLOAD_THUMBNAIL          — set "1" to upload generated thumbnail
 *
 * What it does:
 *   1. Fetches live prices for major indices and watchlist from EODHD
 *   2. Builds a BulletinData payload
 *   3. Renders a 1080p 60fps market bulletin video via ffmpeg
 *   4. Optionally generates TTS voiceover audio and bakes it in
 *   5. Uploads to YouTube with auto-generated metadata (title, description, tags)
 *   6. Optionally uploads a PNG thumbnail
 *
 * Persona wardrobe at render time:
 *   Elena Vance (female anchor): Luminous Emerald Green eyes.
 *   Marcus Sterling (male anchor): Ocean Blue eyes.
 */

import https from "https";
import { execSync, spawn } from "child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "fs";
import { join } from "path";
import { createCanvas } from "canvas";

// ─── Config ────────────────────────────────────────────────────────────────────

const EODHD_TOKEN    = process.env.EODHD_API_TOKEN     || "";
const YT_CLIENT_ID  = process.env.YOUTUBE_CLIENT_ID    || "";
const YT_SECRET     = process.env.YOUTUBE_CLIENT_SECRET || "";
const YT_REFRESH    = process.env.YOUTUBE_REFRESH_TOKEN || "";
const GOOGLE_TTS    = process.env.GOOGLE_TTS_API_KEY    || "";
const OUTPUT_DIR    = process.env.OUTPUT_DIR            || "/tmp/nur-recap";
const DO_THUMBNAIL  = process.env.UPLOAD_THUMBNAIL === "1";

// Major watchlist (symbol.exchange)
const WATCHLIST = [
  "SPY.US", "QQQ.US", "DIA.US", "AAPL.US", "NVDA.US",
  "MSFT.US", "TSLA.US", "BTC-USD.CC", "ETH-USD.CC",
];

const INDICES = [
  "GSPC.INDX", "NDX.INDX", "DAX.INDX", "BIST100.IS",
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function apiGet<T>(hostname: string, path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname, path, method: "GET", headers: { "User-Agent": "NURFinanceRecap/1.0" } }, res => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse error on ${path}: ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function apiPost<T>(hostname: string, path: string, body: string, contentType = "application/json"): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname, path, method: "POST",
      headers: { "Content-Type": contentType, "Content-Length": Buffer.byteLength(body), "User-Agent": "NURFinanceRecap/1.0" },
    }, res => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse error: ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ─── EODHD Market Data ────────────────────────────────────────────────────────

interface EodhdQuote {
  code: string;
  close: number;
  change: number;
  change_p: number;
  timestamp: number;
}

async function fetchQuotes(symbols: string[]): Promise<EodhdQuote[]> {
  if (!EODHD_TOKEN) {
    log("[WARN] EODHD_API_TOKEN not set — using stub data");
    return symbols.map((s, i) => ({
      code: s, close: 100 + i * 10, change: (i % 2 === 0 ? 1 : -1) * (i + 0.5),
      change_p: (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.2), timestamp: Date.now() / 1000,
    }));
  }

  const results: EodhdQuote[] = [];
  for (const sym of symbols) {
    const [ticker, exchange = "US"] = sym.split(".");
    try {
      const q = await apiGet<EodhdQuote>("eodhd.com", `/api/real-time/${ticker}.${exchange}?api_token=${EODHD_TOKEN}&fmt=json`);
      results.push({ ...q, code: sym });
    } catch (e) {
      log(`[WARN] Failed to fetch ${sym}: ${(e as Error).message}`);
    }
  }
  return results;
}

// ─── YouTube OAuth2 ───────────────────────────────────────────────────────────

let _ytAccessToken = "";
let _ytTokenExpiry = 0;

async function getYouTubeToken(): Promise<string> {
  if (_ytAccessToken && Date.now() < _ytTokenExpiry - 30_000) return _ytAccessToken;

  const body = new URLSearchParams({
    client_id: YT_CLIENT_ID,
    client_secret: YT_SECRET,
    refresh_token: YT_REFRESH,
    grant_type: "refresh_token",
  }).toString();

  const data = await apiPost<{ access_token: string; expires_in: number }>(
    "oauth2.googleapis.com", "/token", body, "application/x-www-form-urlencoded"
  );

  _ytAccessToken = data.access_token;
  _ytTokenExpiry = Date.now() + data.expires_in * 1000;
  return _ytAccessToken;
}

// ─── YouTube Resumable Upload ─────────────────────────────────────────────────

async function uploadToYouTube(videoPath: string, title: string, description: string, tags: string[]): Promise<string> {
  const token = await getYouTubeToken();
  const fileSize = statSync(videoPath).size;
  const metadata = {
    snippet: { title, description, tags, categoryId: "25", defaultLanguage: "en" },
    status: { privacyStatus: "public", selfDeclaredMadeForKids: false },
  };

  // Step 1: Initiate resumable upload session
  const initUrl = "www.googleapis.com";
  const initPath = "/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status";
  const metaBody = JSON.stringify(metadata);

  const uploadUri = await new Promise<string>((resolve, reject) => {
    const req = https.request({
      hostname: initUrl,
      path: initPath,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(metaBody),
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": fileSize,
      },
    }, res => {
      const loc = res.headers["location"];
      if (loc) resolve(loc as string);
      else reject(new Error(`No upload URI in response headers`));
    });
    req.on("error", reject);
    req.write(metaBody);
    req.end();
  });

  log(`[YOUTUBE] Upload URI obtained — uploading ${(fileSize / 1024 / 1024).toFixed(1)}MB...`);

  // Step 2: Upload file content
  const uploadUrl = new URL(uploadUri);
  const videoBuffer = readFileSync(videoPath);

  const videoId = await new Promise<string>((resolve, reject) => {
    const req = https.request({
      hostname: uploadUrl.hostname,
      path: uploadUrl.pathname + uploadUrl.search,
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": fileSize,
      },
    }, res => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data) as { id?: string; error?: { message: string } };
          if (parsed.id) resolve(parsed.id);
          else reject(new Error(parsed.error?.message ?? `Upload failed: ${data.slice(0, 200)}`));
        } catch { reject(new Error(`Upload parse error: ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    req.write(videoBuffer);
    req.end();
  });

  return videoId;
}

// ─── Thumbnail Upload ─────────────────────────────────────────────────────────

async function uploadThumbnail(videoId: string, thumbnailPath: string): Promise<void> {
  const token = await getYouTubeToken();
  const imgBuf = readFileSync(thumbnailPath);

  await new Promise<void>((resolve, reject) => {
    const req = https.request({
      hostname: "www.googleapis.com",
      path: `/upload/youtube/v3/thumbnails/set?videoId=${videoId}&uploadType=media`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "image/png",
        "Content-Length": imgBuf.length,
      },
    }, res => {
      let data = "";
      res.on("data", c => (data += c));
      res.on("end", () => res.statusCode === 200 ? resolve() : reject(new Error(`Thumbnail upload failed: ${data.slice(0, 200)}`)));
    });
    req.on("error", reject);
    req.write(imgBuf);
    req.end();
  });
}

// ─── TTS voiceover ────────────────────────────────────────────────────────────

async function generateVoiceover(script: string, audioPath: string): Promise<void> {
  if (GOOGLE_TTS) {
    const payload = JSON.stringify({
      input: { text: script },
      voice: { languageCode: "en-US", name: "en-US-Journey-F" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.05, pitch: 2.0 },
    });

    const result = await apiPost<{ audioContent: string }>(
      "texttospeech.googleapis.com",
      `/v1/text:synthesize?key=${GOOGLE_TTS}`,
      payload
    );

    writeFileSync(audioPath, Buffer.from(result.audioContent, "base64"));
    log(`[TTS] Voiceover generated: ${audioPath}`);
  } else {
    // Silence fallback: generate 8s of silent MP3 via ffmpeg
    execSync(`ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=stereo -t 8 "${audioPath}"`, { stdio: "pipe" });
    log("[TTS] No GOOGLE_TTS_API_KEY — using silence track");
  }
}

// ─── Frame renderer (standalone for server) ───────────────────────────────────

interface FrameData {
  entries: Array<{ symbol: string; price: number; change_p: number }>;
  headline: string;
  timestamp: string;
  frame: number;
  totalFrames: number;
}

function renderRecapFrame(ctx: CanvasRenderingContext2D, w: number, h: number, data: FrameData) {
  const t = data.frame / data.totalFrames;

  // Dark terminal background
  ctx.fillStyle = "#0a0c10";
  ctx.fillRect(0, 0, w, h);

  // Subtle grid overlay
  ctx.strokeStyle = "rgba(0,200,83,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // NUR Finance branding bar
  ctx.fillStyle = "#00C853";
  ctx.fillRect(0, 0, w, 6);
  ctx.fillStyle = "#00C853";
  ctx.font = "bold 28px monospace";
  ctx.fillText("NUR FINANCE TERMINAL  ·  DAILY MARKET RECAP", 48, 54);

  // Timestamp + frame counter
  ctx.fillStyle = "rgba(0,200,83,0.6)";
  ctx.font = "18px monospace";
  ctx.fillText(data.timestamp, w - 320, 54);

  // Headline
  const alpha = Math.min(1, t * 8);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.font = "bold 52px serif";
  ctx.fillText(data.headline, 48, h / 2 - 60);

  // Market entries grid
  const cols = 3;
  const cellW = (w - 96) / cols;
  const cellH = 120;
  const startY = h / 2 + 20;

  data.entries.slice(0, 9).forEach((entry, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 48 + col * cellW;
    const y = startY + row * (cellH + 16);
    const entryAlpha = Math.min(1, Math.max(0, t * 10 - i * 0.3));
    const isPositive = entry.change_p >= 0;

    ctx.fillStyle = `rgba(20,25,35,${entryAlpha * 0.85})`;
    const radius = 8;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW - 16, cellH, radius);
    ctx.fill();

    ctx.strokeStyle = isPositive ? `rgba(0,200,83,${entryAlpha * 0.5})` : `rgba(255,70,70,${entryAlpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = `rgba(180,180,200,${entryAlpha})`;
    ctx.font = "bold 18px monospace";
    ctx.fillText(entry.symbol.split(".")[0], x + 16, y + 32);

    ctx.fillStyle = `rgba(255,255,255,${entryAlpha})`;
    ctx.font = "bold 28px monospace";
    ctx.fillText(`$${entry.price.toFixed(entry.price > 100 ? 2 : 4)}`, x + 16, y + 68);

    ctx.fillStyle = isPositive ? `rgba(0,200,83,${entryAlpha})` : `rgba(255,80,80,${entryAlpha})`;
    ctx.font = "bold 20px monospace";
    ctx.fillText(`${isPositive ? "▲" : "▼"} ${Math.abs(entry.change_p).toFixed(2)}%`, x + 16, y + 100);
  });

  // Bottom watermark
  ctx.fillStyle = "rgba(0,200,83,0.3)";
  ctx.font = "16px monospace";
  ctx.fillText("nur.finance  ·  Bloomberg-tier analytics for sovereign traders", 48, h - 24);

  // Animated scan line
  const scanY = (h * t * 2) % h;
  const grad = ctx.createLinearGradient(0, scanY - 60, 0, scanY + 60);
  grad.addColorStop(0, "rgba(0,200,83,0)");
  grad.addColorStop(0.5, "rgba(0,200,83,0.06)");
  grad.addColorStop(1, "rgba(0,200,83,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, scanY - 60, w, 120);
}

// ─── Video encode via ffmpeg pipe ─────────────────────────────────────────────

async function encodeVideo(frameData: FrameData[], w: number, h: number, fps: number, audioPath: string, outputPath: string): Promise<void> {
  const ffArgs = [
    "-y",
    "-f", "image2pipe", "-vcodec", "png", "-framerate", String(fps), "-i", "pipe:0",
    "-i", audioPath, "-shortest",
    "-vf", `scale=${w}:${h}`,
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
    "-c:a", "aac", "-b:a", "192k",
    "-movflags", "+faststart",
    outputPath,
  ];

  const ffmpeg = spawn("ffmpeg", ffArgs, { stdio: ["pipe", "pipe", "pipe"] });

  ffmpeg.stderr?.on("data", (chunk: Buffer) => {
    const line = chunk.toString();
    if (line.includes("error") || line.includes("Error")) process.stderr.write(`[FFMPEG] ${line}`);
  });

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

  for (let f = 0; f < frameData.length; f++) {
    renderRecapFrame(ctx, w, h, { ...frameData[f], frame: f, totalFrames: frameData.length });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buf: Buffer = (canvas as any).toBuffer("image/png");
    const ok = ffmpeg.stdin?.write(buf);
    if (!ok) await new Promise<void>(r => ffmpeg.stdin?.once("drain", r));

    if (f % 30 === 0) log(`[VIDEO] Encoded frame ${f + 1}/${frameData.length}`);
  }

  ffmpeg.stdin?.end();
  await new Promise<void>((resolve, reject) => {
    ffmpeg.on("close", code => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}`))));
    ffmpeg.on("error", reject);
  });
}

// ─── Thumbnail generator ──────────────────────────────────────────────────────

function renderThumbnail(entries: FrameData["entries"], headline: string, thumbPath: string) {
  const tw = 1280, th = 720;
  const canvas = createCanvas(tw, th);
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

  // Render settled frame (t=1.0)
  renderRecapFrame(ctx, tw, th, {
    entries, headline, timestamp: new Date().toISOString(),
    frame: 999, totalFrames: 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeFileSync(thumbPath, (canvas as any).toBuffer("image/png"));
  log(`[THUMB] Thumbnail written: ${thumbPath}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log("=== NUR Finance Daily Recap Generator ===");

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const videoPath = join(OUTPUT_DIR, `recap-${dateStr}.mp4`);
  const audioPath = join(OUTPUT_DIR, `recap-${dateStr}.mp3`);
  const thumbPath = join(OUTPUT_DIR, `recap-${dateStr}-thumb.png`);

  // 1. Fetch market data
  log("[DATA] Fetching market quotes...");
  const [watchlistQuotes, indexQuotes] = await Promise.all([
    fetchQuotes(WATCHLIST),
    fetchQuotes(INDICES),
  ]);

  const allQuotes = [...watchlistQuotes, ...indexQuotes];
  const entries = allQuotes.map(q => ({
    symbol: q.code,
    price: q.close,
    change_p: q.change_p,
  }));

  const gainers = entries.filter(e => e.change_p > 0).sort((a, b) => b.change_p - a.change_p);
  const losers  = entries.filter(e => e.change_p < 0).sort((a, b) => a.change_p - b.change_p);

  const topGainerStr = gainers[0] ? `${gainers[0].symbol.split(".")[0]} +${gainers[0].change_p.toFixed(2)}%` : "N/A";
  const topLoserStr  = losers[0]  ? `${losers[0].symbol.split(".")[0]} ${losers[0].change_p.toFixed(2)}%` : "N/A";

  const headline = `${dateStr} Market Close  ·  Top Gainer: ${topGainerStr}  ·  Top Loser: ${topLoserStr}`;
  log(`[DATA] Headline: ${headline}`);

  // 2. Generate TTS audio (Elena Vance voiceover)
  const script = [
    `Good ${now.getHours() < 12 ? "morning" : "evening"} from NUR Finance Terminal.`,
    `Today's market recap for ${now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.`,
    gainers.length > 0 ? `The top performer today was ${gainers[0].symbol.split(".")[0]}, up ${gainers[0].change_p.toFixed(2)} percent.` : "",
    losers.length > 0 ? `On the downside, ${losers[0].symbol.split(".")[0]} fell ${Math.abs(losers[0].change_p).toFixed(2)} percent.` : "",
    `NUR Finance — Bloomberg-tier analytics for sovereign traders.`,
  ].filter(Boolean).join(" ");

  log("[TTS] Generating Elena Vance voiceover...");
  await generateVoiceover(script, audioPath);

  // 3. Render video
  const fps = 30;
  const durationMs = 10_000;
  const totalFrames = Math.round(fps * durationMs / 1000);
  const frameData: FrameData[] = Array.from({ length: totalFrames }, (_, f) => ({
    entries, headline, timestamp: now.toISOString(), frame: f, totalFrames,
  }));

  log(`[VIDEO] Rendering ${totalFrames} frames at ${fps}fps → ${videoPath}`);
  await encodeVideo(frameData, 1920, 1080, fps, audioPath, videoPath);
  const videoSize = statSync(videoPath).size;
  log(`[VIDEO] Done: ${(videoSize / 1024 / 1024).toFixed(2)}MB`);

  // 4. Render thumbnail
  renderThumbnail(entries, headline, thumbPath);

  // 5. Upload to YouTube
  if (!YT_CLIENT_ID || !YT_REFRESH) {
    log("[YOUTUBE] No credentials — skipping upload. Video saved to: " + videoPath);
    return;
  }

  const ytTitle = `NUR Finance Daily Recap – ${dateStr}`;
  const ytDesc = [
    `NUR Finance Terminal — Bloomberg-tier analytics for sovereign traders.`,
    ``,
    `Today's Recap (${dateStr}):`,
    ...gainers.slice(0, 3).map(e => `  ✅ ${e.symbol.split(".")[0]}: +${e.change_p.toFixed(2)}%`),
    ...losers.slice(0, 3).map(e => `  ❌ ${e.symbol.split(".")[0]}: ${e.change_p.toFixed(2)}%`),
    ``,
    `🌐 nur.finance`,
    `📊 Real-time data powered by EODHD`,
  ].join("\n");

  const tags = [
    "NUR Finance", "daily recap", "market analysis", "stock market",
    "bloomberg terminal", "trading", "finance", "investing",
    "cryptocurrency", "DePIN", ...gainers.slice(0, 3).map(e => e.symbol.split(".")[0]),
  ];

  log("[YOUTUBE] Uploading...");
  const videoId = await uploadToYouTube(videoPath, ytTitle, ytDesc, tags);
  log(`[YOUTUBE] Video uploaded: https://youtu.be/${videoId}`);

  if (DO_THUMBNAIL && existsSync(thumbPath)) {
    log("[YOUTUBE] Uploading thumbnail...");
    await uploadThumbnail(videoId, thumbPath);
    log("[YOUTUBE] Thumbnail uploaded.");
  }

  log("=== Daily Recap Complete ===");
  console.log(`Video: https://youtu.be/${videoId}`);
}

main().catch(err => {
  console.error("[FATAL]", err);
  process.exit(1);
});
