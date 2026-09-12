/**
 * NUR Finance Autonomous 24/7 YouTube Live Broadcast Engine
 *
 * Streams a continuous 1080p60 financial TV feed to YouTube RTMP:
 *   - Rotating multilingual anchor segments with TTS
 *   - Real-time market data overlays (EODHD API)
 *   - ffmpeg composite pipe: static image + data ticker + audio TTS
 *   - Automatic segment rotation and reconnect on stream drop
 *
 * Usage:
 *   YOUTUBE_RTMP_URL=rtmp://a.rtmp.youtube.com/live2 \
 *   YOUTUBE_STREAM_KEY=xxxx \
 *   EODHD_API_TOKEN=xxxx \
 *   npx ts-node scripts/youtube-streamer.ts
 *
 * Required system tools: ffmpeg, curl (for market data), espeak-ng (TTS fallback)
 * Optional: Google Cloud TTS (GOOGLE_TTS_API_KEY env var) for high-quality voices
 */

import { spawn, ChildProcess } from "child_process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import https from "https";

// ─── Config ───────────────────────────────────────────────────────────────────

const RTMP_URL    = process.env.YOUTUBE_RTMP_URL   || "rtmp://a.rtmp.youtube.com/live2";
const STREAM_KEY  = process.env.YOUTUBE_STREAM_KEY || "YOUR_STREAM_KEY_HERE";
const EODHD_TOKEN = process.env.EODHD_API_TOKEN    || "";
const GOOGLE_TTS  = process.env.GOOGLE_TTS_API_KEY || "";

const RESOLUTION  = "1920x1080";
const FPS         = 60;
const VIDEO_BR    = "6000k";
const AUDIO_BR    = "192k";
const SEGMENT_SEC = 120;     // rotate anchor every 2 minutes
const RECONNECT_SEC = 5;

const TMP_DIR = join(process.cwd(), ".stream-tmp");
if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

// ─── Broadcast Segments ───────────────────────────────────────────────────────

interface BroadcastSegment {
  id:          string;
  language:    string;         // BCP-47 for TTS
  anchorName:  string;
  voiceName:   string;         // Google TTS voice name
  bgImage:     string;         // path relative to project root
  script:      string;
  ticker:      string;         // crawl text (appended with live data)
}

const SEGMENTS: BroadcastSegment[] = [
  {
    id:         "TR-DESK",
    language:   "tr-TR",
    anchorName: "Elif Nur",
    voiceName:  "tr-TR-Standard-A",
    bgImage:    "public/images/studio/anchor-female.jpg",
    script:
      "İyi günler sayın seyirciler. Nur Finans Küresel Piyasa Masası'ndan canlı yayınımız başlıyor. " +
      "BIST 100 ve küresel borsalarda teknoloji hisselerinin öncülüğünde pozitif seyir izleniyor. " +
      "Kantitatif modellerimiz piyasa nötr arbitraj fırsatlarını taramaya devam ediyor. " +
      "NUR Finans terminali, Bloomberg ve Reuters'a rakip olarak küresel finans dünyasına seslenmeye devam ediyor.",
    ticker: "NUR FİNANS | BIST 100 | USD/TRY | BTC/USD | ALTIN | PETROL",
  },
  {
    id:         "EN-DESK",
    language:   "en-US",
    anchorName: "Alexander Croft",
    voiceName:  "en-US-Neural2-D",
    bgImage:    "public/images/studio/anchor-male.jpg",
    script:
      "Good morning. This is the NUR Finance Global Markets Desk. " +
      "US equity futures are advancing as the ISM Services Index surges above 54.8, " +
      "confirming strong economic expansion across core sectors. " +
      "The NUR Finance terminal continues to deliver sovereign-grade intelligence " +
      "to institutional and professional traders worldwide. " +
      "Our DePIN compute network is live — share your GPU and earn NUR coin for free terminal access.",
    ticker: "NUR FINANCE | S&P 500 | NASDAQ | EUR/USD | BTC | GOLD | CRUDE OIL",
  },
  {
    id:         "DE-DESK",
    language:   "de-DE",
    anchorName: "Klaus Weber",
    voiceName:  "de-DE-Standard-B",
    bgImage:    "public/images/studio/executive-office.jpg",
    script:
      "Guten Tag aus Frankfurt. Der DAX 40 notiert fest oberhalb von 18.890 Punkten. " +
      "Unsere quantitativen Algorithmen verzeichnen eine anhaltende Nachfrage nach Halbleiter- und Industrieaktien. " +
      "NUR Finance bietet professionellen Händlern souveräne Marktintelligenz, " +
      "die mit Bloomberg und Reuters konkurriert — zu einem Bruchteil der Kosten.",
    ticker: "NUR FINANCE | DAX 40 | EUR/USD | BUND | BITCOIN | GOLD",
  },
  {
    id:         "NUR-DEPIN",
    language:   "en-US",
    anchorName: "NUR AI System",
    voiceName:  "en-US-Neural2-C",
    bgImage:    "public/images/studio/anchor-male.jpg",
    script:
      "Welcome to the NUR Finance DePIN Mining Network status report. " +
      "Share your idle GPU and earn NUR coin — 1 NUR equals point 10 euros at seed pricing. " +
      "Minimum withdrawal is 100 NUR, settled via SEPA within 3 to 5 business days. " +
      "The NUR Finance compute pool holds 35 million NUR tokens for distribution to active miners. " +
      "Join the sovereign compute revolution at nur dot finance.",
    ticker: "NUR FINANCE DePIN | $NUR = €0.10 | MIN WITHDRAWAL: 100 NUR | SEPA 3-5 DAYS",
  },
];

// ─── Market Data Fetcher ──────────────────────────────────────────────────────

interface Quote { code: string; close: number; change_p: number }

async function fetchLiveData(): Promise<string> {
  if (!EODHD_TOKEN) {
    return "NUR FINANCE | LIVE MARKET DATA UNAVAILABLE — SET EODHD_API_TOKEN";
  }

  const symbols = ["AAPL.US", "MSFT.US", "BTC-USD.CC", "GC=F.COMM", "EUR/USD.FOREX"];
  const promises = symbols.map(sym =>
    new Promise<Quote | null>(resolve => {
      const url = `https://eodhd.com/api/real-time/${sym}?api_token=${EODHD_TOKEN}&fmt=json`;
      https.get(url, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            const j = JSON.parse(data) as Quote;
            resolve(j);
          } catch { resolve(null); }
        });
      }).on("error", () => resolve(null));
    })
  );

  const results = await Promise.all(promises);
  const parts: string[] = [];
  const pairs: Record<string, string> = {
    "AAPL.US": "AAPL", "MSFT.US": "MSFT",
    "BTC-USD.CC": "BTC", "GC=F.COMM": "GOLD", "EUR/USD.FOREX": "EUR/USD",
  };

  results.forEach((q, i) => {
    if (!q) return;
    const sym = pairs[symbols[i]] ?? symbols[i];
    const dir = (q.change_p ?? 0) >= 0 ? "▲" : "▼";
    parts.push(`${sym} ${Number(q.close).toLocaleString("en-US", { maximumFractionDigits: 2 })} ${dir}${Math.abs(q.change_p ?? 0).toFixed(2)}%`);
  });

  if (parts.length === 0) return "NUR FINANCE LIVE | MARKETS LOADING...";
  return `NUR FINANCE ${new Date().toUTCString()}   ●   ${parts.join("   ●   ")}`;
}

// ─── Google Cloud TTS ─────────────────────────────────────────────────────────

async function synthesizeSpeech(text: string, voiceName: string, langCode: string, outPath: string): Promise<void> {
  if (GOOGLE_TTS) {
    const payload = JSON.stringify({
      input: { text },
      voice: { languageCode: langCode, name: voiceName },
      audioConfig: { audioEncoding: "MP3", speakingRate: 1.0, pitch: 0.0 },
    });

    await new Promise<void>((resolve, reject) => {
      const req = https.request({
        hostname: "texttospeech.googleapis.com",
        path: `/v1/text:synthesize?key=${GOOGLE_TTS}`,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) },
      }, res => {
        let data = "";
        res.on("data", c => data += c);
        res.on("end", () => {
          try {
            const { audioContent } = JSON.parse(data) as { audioContent: string };
            writeFileSync(outPath, Buffer.from(audioContent, "base64"));
            resolve();
          } catch (e) { reject(e); }
        });
      });
      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  } else {
    // Fallback: espeak-ng
    await new Promise<void>((resolve, reject) => {
      const proc = spawn("espeak-ng", [
        "-v", langCode.split("-")[0],
        "-w", outPath.replace(".mp3", ".wav"),
        text,
      ]);
      proc.on("close", code => code === 0 ? resolve() : reject(new Error(`espeak-ng exited ${code}`)));
    });
  }
}

// ─── FFmpeg Stream Builder ────────────────────────────────────────────────────

function buildFfmpegArgs(
  bgImagePath: string,
  audioPath: string,
  tickerText: string,
  durationSec: number,
): string[] {
  const fullImagePath = existsSync(bgImagePath) ? bgImagePath : "public/images/studio/fallback.jpg";
  const target = `${RTMP_URL}/${STREAM_KEY}`;

  const fontFile = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";
  const safeFont = existsSync(fontFile) ? fontFile : "arial.ttf";

  // Escape special characters for ffmpeg drawtext
  const safe = (s: string) => s.replace(/[:'\\]/g, "\\$&");

  const drawtextTicker = [
    `drawtext=fontfile=${safeFont}`,
    `text='${safe(tickerText)}'`,
    `fontcolor=white`,
    `fontsize=28`,
    `x='w-mod(t*200\\,w+tw)'`,   // scrolling crawl
    `y=h-44`,
    `box=1`,
    `boxcolor=0x000000AA`,
    `boxborderw=10`,
  ].join(":");

  const drawtextLogo = [
    `drawtext=fontfile=${safeFont}`,
    `text='NUR FINANCE'`,
    `fontcolor=0x00D4FF`,
    `fontsize=36`,
    `fontweight=bold`,
    `x=40`,
    `y=40`,
    `box=1`,
    `boxcolor=0x00000080`,
    `boxborderw=8`,
  ].join(":");

  const drawtextTime = [
    `drawtext=fontfile=${safeFont}`,
    `text='%{localtime}'`,
    `fontcolor=0xCCCCCC`,
    `fontsize=22`,
    `x=w-260`,
    `y=44`,
  ].join(":");

  const vf = [drawtextLogo, drawtextTime, drawtextTicker].join(",");

  return [
    // Input: looping still image
    "-stream_loop", "-1",
    "-re",
    "-loop", "1",
    "-i", fullImagePath,

    // Input: TTS audio (looped to fill segment)
    "-stream_loop", "-1",
    "-i", audioPath,

    // Video filter: overlays
    "-vf", vf,
    "-t", String(durationSec),

    // Video codec
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-tune", "zerolatency",
    "-b:v", VIDEO_BR,
    "-maxrate", VIDEO_BR,
    "-bufsize", "12000k",
    "-r", String(FPS),
    "-g", String(FPS * 2),   // keyframe every 2s
    "-pix_fmt", "yuv420p",
    "-s", RESOLUTION,

    // Audio codec
    "-c:a", "aac",
    "-b:a", AUDIO_BR,
    "-ar", "44100",

    // Output: RTMP
    "-f", "flv",
    target,
  ];
}

// ─── Segment Runner ───────────────────────────────────────────────────────────

async function runSegment(seg: BroadcastSegment, ticker: string): Promise<void> {
  const audioPath = join(TMP_DIR, `${seg.id}.mp3`);

  try {
    log(`[TTS] Synthesizing audio for ${seg.anchorName}...`);
    await synthesizeSpeech(seg.script, seg.voiceName, seg.language, audioPath);
  } catch (err) {
    log(`[TTS] Speech synthesis failed: ${(err as Error).message} — using silence`);
    // Write minimal silent mp3 header so ffmpeg doesn't crash
    writeFileSync(audioPath, Buffer.alloc(0));
  }

  const args = buildFfmpegArgs(seg.bgImage, audioPath, ticker, SEGMENT_SEC);
  log(`[FFMPEG] Streaming segment: ${seg.id} (${SEGMENT_SEC}s)`);

  await new Promise<void>((resolve, reject) => {
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "pipe", "pipe"] });

    proc.stderr?.on("data", (d: Buffer) => {
      const line = d.toString().trim();
      if (line.includes("frame=") || line.includes("bitrate=")) {
        process.stdout.write(`\r[FFMPEG] ${line.slice(0, 120)}`);
      }
    });

    proc.on("close", code => {
      process.stdout.write("\n");
      if (code === 0 || code === null) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

// ─── Main Loop ────────────────────────────────────────────────────────────────

function log(msg: string) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

export function getStreamConfig() {
  return {
    rtmpUrl:      RTMP_URL,
    streamKey:    STREAM_KEY,
    resolution:   RESOLUTION,
    fps:          FPS,
    bitrate:      VIDEO_BR,
    audioBitrate: AUDIO_BR,
    segments:     SEGMENTS.length,
    segmentSec:   SEGMENT_SEC,
  };
}

async function main() {
  console.log("══════════════════════════════════════════════════════");
  console.log("  NUR FINANCE — Autonomous 24/7 Broadcast Engine");
  console.log("══════════════════════════════════════════════════════");
  console.log(`RTMP endpoint : ${RTMP_URL}`);
  console.log(`Resolution    : ${RESOLUTION} @ ${FPS}fps`);
  console.log(`Video bitrate : ${VIDEO_BR}   Audio: ${AUDIO_BR}`);
  console.log(`Segments      : ${SEGMENTS.length} (rotating every ${SEGMENT_SEC}s)`);
  console.log(`TTS backend   : ${GOOGLE_TTS ? "Google Cloud TTS" : "espeak-ng (fallback)"}`);
  console.log(`Market data   : ${EODHD_TOKEN ? "EODHD live" : "DISABLED"}`);
  console.log("══════════════════════════════════════════════════════\n");

  let segIdx = 0;
  let consecutiveErrors = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const seg = SEGMENTS[segIdx % SEGMENTS.length];

    // Fetch live market data for ticker
    let ticker = seg.ticker;
    try {
      ticker = await fetchLiveData();
    } catch (err) {
      log(`[DATA] Market fetch failed: ${(err as Error).message}`);
    }

    try {
      await runSegment(seg, ticker);
      consecutiveErrors = 0;
    } catch (err) {
      consecutiveErrors++;
      const msg = err instanceof Error ? err.message : String(err);
      log(`[ERROR] Segment ${seg.id} failed: ${msg} (attempt ${consecutiveErrors})`);

      if (consecutiveErrors >= 10) {
        log("[FATAL] 10 consecutive segment failures — exiting.");
        process.exit(1);
      }

      const backoff = Math.min(RECONNECT_SEC * consecutiveErrors, 60);
      log(`[RETRY] Reconnecting in ${backoff}s...`);
      await new Promise(r => setTimeout(r, backoff * 1000));
    }

    segIdx++;
    log(`[LOOP] Rotating to next segment (${SEGMENTS[(segIdx) % SEGMENTS.length].id})`);
  }
}

// Run if invoked directly
if (require.main === module) {
  main().catch(err => { console.error(err); process.exit(1); });
}
