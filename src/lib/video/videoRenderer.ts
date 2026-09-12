/**
 * NUR Finance Video Render Engine
 * Canvas 2D → ffmpeg pipe → MP4/WebM at 1080p 60fps
 *
 * Server-side: Node.js via node-canvas + ffmpeg subprocess
 * Client-side: HTMLCanvasElement + MediaRecorder
 *
 * Template types:
 *   - market_bulletin: live prices, indices snapshot
 *   - stock_analysis:  OHLCV candles + RSI + MACD
 *   - depin_metrics:   mining pool stats, NUR earnings
 *   - nur_digest:      daily NUR Finance digest card
 *
 * Persona wardrobe standards:
 *   Female (Elena Vance, Elif Nur, Sovereign Concierge): Luminous Emerald Green eyes.
 *   Male   (Marcus Sterling, Alexander Croft, Klaus Weber): Emerald Green or Steel Blue eyes.
 */

export type TemplateType = "market_bulletin" | "stock_analysis" | "depin_metrics" | "nur_digest";
export type OutputFormat = "webm" | "mp4";

export interface RenderOptions {
  template: TemplateType;
  data: BulletinData | StockAnalysisData | DepinData | DigestData;
  width?: number;          // default 1920
  height?: number;         // default 1080
  fps?: number;            // default 60
  durationMs?: number;     // default 8000ms
  outputFormat?: OutputFormat;
  bitrate?: number;        // default 8_000_000 (8Mbps)
  watermark?: string;      // bottom-right text
}

export interface MarketEntry {
  symbol: string;
  price: number;
  change: number;          // percent
  changeAbs: number;
}

export interface BulletinData {
  headline: string;
  subHeadline?: string;
  timestamp: string;       // ISO
  entries: MarketEntry[];
  indices: MarketEntry[];  // SPX, DAX, BIST100 etc.
  nurPrice?: number;
  notes?: string;
}

export interface CandleEntry {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;       // unix ms
}

export interface StockAnalysisData {
  symbol: string;
  companyName: string;
  candles: CandleEntry[];
  rsi?: number[];
  macd?: { macd: number[]; signal: number[]; histogram: number[] };
  analystRating?: "BUY" | "HOLD" | "SELL" | "OVERWEIGHT";
  priceTarget?: number;
  currentPrice?: number;
}

export interface DepinData {
  activeDevices: number;
  totalHashRateMHs: number;
  totalEarningsNUR: number;
  nurPriceEur: number;
  topRegions: { region: string; count: number }[];
  rewardsDistributed24h: number;
  poolShare?: number;       // user pool share %
}

export interface DigestData {
  date: string;
  topStories: { title: string; summary: string }[];
  marketMood: "bullish" | "bearish" | "neutral";
  nurFinanceInsight?: string;
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const PALETTE = {
  bg:        "#0a0c10",
  surface:   "#12151c",
  border:    "#1e2330",
  accent:    "#00d4ff",
  gold:      "#f5a623",
  green:     "#00c896",
  red:       "#ff4d6a",
  textPrime: "#e8eaf0",
  textSub:   "#7a8090",
  nurBlue:   "#0055ff",
};

// ─── Font helpers ─────────────────────────────────────────────────────────────

function setFont(ctx: CanvasRenderingContext2D, size: number, weight: string = "400", family: string = "monospace") {
  ctx.font = `${weight} ${size}px ${family}`;
}

// ─── Drawing primitives ───────────────────────────────────────────────────────

function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  fill: string, radius: number = 0
) {
  ctx.fillStyle = fill;
  if (radius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  color: string, size: number, weight: string = "400",
  align: CanvasTextAlign = "left"
) {
  ctx.fillStyle = color;
  ctx.textAlign = align;
  setFont(ctx, size, weight);
  ctx.fillText(text, x, y);
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, width: number = 1
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ─── Background + Logo ────────────────────────────────────────────────────────

function renderBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Gradient BG
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#080b12");
  grad.addColorStop(1, "#0a0d16");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Top accent bar
  const barGrad = ctx.createLinearGradient(0, 0, w, 0);
  barGrad.addColorStop(0, PALETTE.accent);
  barGrad.addColorStop(0.4, PALETTE.nurBlue);
  barGrad.addColorStop(1, "transparent");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, w, 4);
}

function renderLogo(ctx: CanvasRenderingContext2D, w: number, padding: number, t: number) {
  // Pulsing dot
  const pulse = 0.7 + 0.3 * Math.sin(t * 0.003);
  ctx.beginPath();
  ctx.arc(padding + 16, 44, 8 * pulse, 0, Math.PI * 2);
  ctx.fillStyle = PALETTE.accent;
  ctx.globalAlpha = pulse;
  ctx.fill();
  ctx.globalAlpha = 1;

  drawText(ctx, "NUR FINANCE", padding + 34, 52, PALETTE.accent, 28, "700");
  drawText(ctx, "MARKET INTELLIGENCE", padding + 34, 72, PALETTE.textSub, 13, "400");
}

function renderWatermark(ctx: CanvasRenderingContext2D, w: number, h: number, text: string) {
  drawText(ctx, text, w - 32, h - 24, PALETTE.textSub, 14, "400", "right");
}

// ─── Template: Market Bulletin ─────────────────────────────────────────────────

function renderMarketBulletin(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  data: BulletinData,
  t: number,           // elapsed ms (for animation)
  frame: number
) {
  const p = 60;
  renderBackground(ctx, w, h);
  renderLogo(ctx, w, p, t);

  // Timestamp
  const ts = new Date(data.timestamp).toLocaleString("en-GB", {
    dateStyle: "medium", timeStyle: "short", timeZone: "UTC",
  });
  drawText(ctx, `${ts} UTC`, w - p, 52, PALETTE.textSub, 16, "400", "right");

  // Headline
  drawText(ctx, data.headline, p, 140, PALETTE.textPrime, 52, "700");
  if (data.subHeadline) {
    drawText(ctx, data.subHeadline, p, 190, PALETTE.textSub, 24, "400");
  }

  // NUR price ticker
  if (data.nurPrice != null) {
    const nurX = w - p;
    drawText(ctx, `NUR  €${data.nurPrice.toFixed(4)}`, nurX, 140, PALETTE.gold, 22, "700", "right");
  }

  // Divider
  drawLine(ctx, p, 210, w - p, 210, PALETTE.border, 1);

  // Indices row
  const indW = (w - p * 2) / Math.max(data.indices.length, 1);
  data.indices.forEach((idx, i) => {
    const ix = p + i * indW;
    const color = idx.change >= 0 ? PALETTE.green : PALETTE.red;
    drawText(ctx, idx.symbol, ix, 258, PALETTE.textSub, 16, "400");
    drawText(ctx, idx.price.toLocaleString("en-US", { maximumFractionDigits: 2 }), ix, 286, PALETTE.textPrime, 26, "700");
    drawText(ctx, `${idx.change >= 0 ? "+" : ""}${idx.change.toFixed(2)}%`, ix, 310, color, 18, "600");
  });

  drawLine(ctx, p, 335, w - p, 335, PALETTE.border, 1);

  // Market entries grid (2 columns)
  const colW = (w - p * 2) / 2;
  const rowH = 80;
  const startY = 360;
  const visibleEntries = data.entries.slice(0, 10);

  visibleEntries.forEach((entry, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ex = p + col * colW;
    const ey = startY + row * rowH;
    const color = entry.change >= 0 ? PALETTE.green : PALETTE.red;

    // Row bg
    drawRect(ctx, ex, ey + 2, colW - 20, 70, PALETTE.surface, 6);

    // Colored left strip
    drawRect(ctx, ex, ey + 2, 4, 70, color, 0);

    drawText(ctx, entry.symbol, ex + 20, ey + 32, PALETTE.textSub, 16, "400");
    drawText(ctx, entry.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }), ex + 20, ey + 58, PALETTE.textPrime, 28, "700");
    drawText(ctx, `${entry.change >= 0 ? "+" : ""}${entry.change.toFixed(2)}%`, ex + colW - 30, ey + 58, color, 22, "600", "right");
  });

  // Notes
  if (data.notes) {
    drawText(ctx, data.notes, p, h - 60, PALETTE.textSub, 16, "400");
  }

  // Bottom bar crawl
  const crawlY = h - 30;
  drawRect(ctx, 0, crawlY - 14, w, 30, "#050709");
  const crawlText = data.entries.map(e =>
    `${e.symbol}  ${e.price.toFixed(2)}  ${e.change >= 0 ? "▲" : "▼"}${Math.abs(e.change).toFixed(2)}%`
  ).join("    ●    ");
  const offset = ((t / 50) % (crawlText.length * 14));
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, crawlY - 14, w, 30);
  ctx.clip();
  drawText(ctx, crawlText + "    ●    " + crawlText, -offset + 20, crawlY + 6, PALETTE.textSub, 16, "400");
  ctx.restore();
}

// ─── Template: Stock Analysis ─────────────────────────────────────────────────

function renderStockAnalysis(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  data: StockAnalysisData,
  t: number,
  frame: number
) {
  const p = 60;
  renderBackground(ctx, w, h);
  renderLogo(ctx, w, p, t);

  drawText(ctx, data.symbol, p, 140, PALETTE.accent, 56, "700");
  drawText(ctx, data.companyName, p + 4, 178, PALETTE.textSub, 22, "400");

  if (data.currentPrice != null) {
    drawText(ctx, `$${data.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, w - p, 140, PALETTE.textPrime, 48, "700", "right");
  }

  if (data.analystRating) {
    const ratingColor = data.analystRating === "BUY" || data.analystRating === "OVERWEIGHT"
      ? PALETTE.green : data.analystRating === "SELL" ? PALETTE.red : PALETTE.gold;
    drawRect(ctx, w - p - 120, 186, 120, 30, ratingColor + "30", 6);
    drawText(ctx, data.analystRating, w - p - 8, 207, ratingColor, 17, "700", "right");
    if (data.priceTarget != null) {
      drawText(ctx, `PT $${data.priceTarget}`, w - p - 130, 207, PALETTE.textSub, 16, "400", "right");
    }
  }

  drawLine(ctx, p, 220, w - p, 220, PALETTE.border, 1);

  // Candlestick chart
  const chartX = p;
  const chartY = 240;
  const chartW = w * 0.68 - p;
  const chartH = h * 0.42;
  const candles = data.candles.slice(-60);

  if (candles.length > 0) {
    const prices = candles.flatMap(c => [c.high, c.low]);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const range = maxP - minP || 1;
    const candleW = chartW / candles.length;

    // Chart bg
    drawRect(ctx, chartX, chartY, chartW, chartH, PALETTE.surface, 8);

    // Grid
    for (let gi = 0; gi <= 4; gi++) {
      const gy = chartY + (chartH / 4) * gi;
      drawLine(ctx, chartX, gy, chartX + chartW, gy, PALETTE.border, 1);
      const priceLabel = (maxP - (range / 4) * gi).toFixed(2);
      drawText(ctx, priceLabel, chartX + chartW + 8, gy + 5, PALETTE.textSub, 14, "400");
    }

    // Reveal candles progressively
    const revealCount = Math.floor((t / 3000) * candles.length);
    candles.slice(0, Math.min(revealCount + 1, candles.length)).forEach((c, i) => {
      const cx = chartX + i * candleW + candleW * 0.1;
      const cw = candleW * 0.8;
      const isUp = c.close >= c.open;
      const color = isUp ? PALETTE.green : PALETTE.red;

      const openY  = chartY + chartH - ((c.open  - minP) / range) * chartH;
      const closeY = chartY + chartH - ((c.close - minP) / range) * chartH;
      const highY  = chartY + chartH - ((c.high  - minP) / range) * chartH;
      const lowY   = chartY + chartH - ((c.low   - minP) / range) * chartH;

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + cw / 2, highY);
      ctx.lineTo(cx + cw / 2, lowY);
      ctx.stroke();

      // Body
      const bodyY = Math.min(openY, closeY);
      const bodyH = Math.max(Math.abs(closeY - openY), 2);
      ctx.fillStyle = color;
      ctx.fillRect(cx, bodyY, cw, bodyH);
    });
  }

  // RSI panel
  if (data.rsi && data.rsi.length > 0) {
    const rsiX = p;
    const rsiY = chartY + chartH + 20;
    const rsiH = 80;
    drawRect(ctx, rsiX, rsiY, chartW, rsiH, PALETTE.surface, 6);
    drawText(ctx, "RSI(14)", rsiX + 8, rsiY + 18, PALETTE.textSub, 13, "400");

    const rsiSlice = data.rsi.slice(-60);
    const rsiW = chartW / rsiSlice.length;

    // Overbought/oversold zones
    ctx.fillStyle = PALETTE.red + "18";
    ctx.fillRect(rsiX, rsiY, chartW, (rsiH * (100 - 70)) / 100);
    ctx.fillStyle = PALETTE.green + "18";
    ctx.fillRect(rsiX, rsiY + rsiH * 0.7, chartW, rsiH * 0.3);

    ctx.strokeStyle = PALETTE.gold;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    rsiSlice.forEach((v, i) => {
      const rx = rsiX + i * rsiW;
      const ry = rsiY + rsiH - (v / 100) * rsiH;
      i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
    });
    ctx.stroke();

    const lastRsi = rsiSlice[rsiSlice.length - 1];
    drawText(ctx, lastRsi.toFixed(1), rsiX + chartW - 4, rsiY + 18, PALETTE.gold, 13, "700", "right");
  }

  // Right panel: analysis card
  const rpX = w * 0.72;
  const rpW = w - rpX - p;
  drawRect(ctx, rpX, chartY, rpW, chartH + 100, PALETTE.surface, 10);
  drawText(ctx, "ANALYST VIEW", rpX + 20, chartY + 34, PALETTE.textSub, 13, "400");
  drawLine(ctx, rpX + 20, chartY + 44, rpX + rpW - 20, chartY + 44, PALETTE.border, 1);

  const metrics = [
    { label: "52W High", value: data.candles.length ? Math.max(...data.candles.map(c => c.high)).toFixed(2) : "—" },
    { label: "52W Low",  value: data.candles.length ? Math.min(...data.candles.map(c => c.low )).toFixed(2) : "—" },
    { label: "Avg Vol",  value: data.candles.length ? Math.round(data.candles.reduce((s, c) => s + c.volume, 0) / data.candles.length).toLocaleString() : "—" },
    { label: "NUR Insight", value: "Model active" },
  ];
  metrics.forEach((m, i) => {
    const my = chartY + 70 + i * 54;
    drawText(ctx, m.label, rpX + 20, my, PALETTE.textSub, 14, "400");
    drawText(ctx, m.value, rpX + rpW - 20, my + 22, PALETTE.textPrime, 20, "700", "right");
    if (i < metrics.length - 1) drawLine(ctx, rpX + 20, my + 34, rpX + rpW - 20, my + 34, PALETTE.border, 1);
  });
}

// ─── Template: DePIN Metrics ──────────────────────────────────────────────────

function renderDepinMetrics(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  data: DepinData,
  t: number
) {
  const p = 60;
  renderBackground(ctx, w, h);
  renderLogo(ctx, w, p, t);

  drawText(ctx, "DEPIN MINING POOL", p, 140, PALETTE.accent, 44, "700");
  drawText(ctx, "Compute-for-Access Network · Powered by $NUR", p, 176, PALETTE.textSub, 20, "400");

  drawLine(ctx, p, 200, w - p, 200, PALETTE.border, 1);

  // Big stats
  const stats = [
    { label: "ACTIVE DEVICES", value: data.activeDevices.toLocaleString() },
    { label: "TOTAL HASHRATE", value: `${data.totalHashRateMHs.toLocaleString()} MH/s` },
    { label: "NUR EARNED (24H)", value: `${data.rewardsDistributed24h.toFixed(0)} NUR` },
    { label: "NUR PRICE", value: `€${data.nurPriceEur.toFixed(4)}` },
  ];

  const statW = (w - p * 2) / stats.length;
  stats.forEach((s, i) => {
    const sx = p + i * statW;
    const sy = 240;
    drawRect(ctx, sx + 10, sy, statW - 20, 120, PALETTE.surface, 10);
    drawText(ctx, s.label, sx + 26, sy + 28, PALETTE.textSub, 13, "400");
    drawText(ctx, s.value, sx + 26, sy + 82, PALETTE.accent, 32, "700");
  });

  // Region bar chart
  const regions = data.topRegions.slice(0, 6);
  const barX = p;
  const barY = 420;
  const barH = 260;
  const barAreaW = (w - p * 2) * 0.55;
  drawRect(ctx, barX, barY, barAreaW, barH, PALETTE.surface, 10);
  drawText(ctx, "REGIONAL DISTRIBUTION", barX + 20, barY + 30, PALETTE.textSub, 14, "400");

  const maxCount = Math.max(...regions.map(r => r.count), 1);
  const regionH = 30;
  const regionStart = barY + 54;
  regions.forEach((r, i) => {
    const ry = regionStart + i * (regionH + 8);
    const barFrac = r.count / maxCount;
    const revealFrac = Math.min((t - i * 300) / 800, barFrac);
    const barLen = Math.max(revealFrac, 0) * (barAreaW - 120);
    drawRect(ctx, barX + 100, ry, barLen, regionH, PALETTE.accent + "40", 4);
    drawRect(ctx, barX + 100, ry, barLen * 0.6, regionH, PALETTE.accent + "80", 4);
    drawText(ctx, r.region, barX + 20, ry + 21, PALETTE.textSub, 16, "400");
    drawText(ctx, r.count.toLocaleString(), barX + barAreaW - 16, ry + 21, PALETTE.textPrime, 16, "700", "right");
  });

  // NUR earnings arc gauge (right side)
  const gx = w - p - 220;
  const gy = 430 + 130;
  const gr = 110;
  const earned = Math.min(data.totalEarningsNUR / 35_000_000, 1);
  const revealEarned = Math.min(t / 2500, earned);

  ctx.strokeStyle = PALETTE.surface;
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.arc(gx, gy, gr, Math.PI * 0.75, Math.PI * 2.25);
  ctx.stroke();

  const arcGrad = ctx.createLinearGradient(gx - gr, gy, gx + gr, gy);
  arcGrad.addColorStop(0, PALETTE.nurBlue);
  arcGrad.addColorStop(1, PALETTE.accent);
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(gx, gy, gr, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * revealEarned);
  ctx.stroke();
  ctx.lineCap = "butt";

  drawText(ctx, `${(revealEarned * 100).toFixed(1)}%`, gx, gy + 12, PALETTE.accent, 36, "700", "center");
  drawText(ctx, "OF COMPUTE POOL", gx, gy + 40, PALETTE.textSub, 13, "400", "center");
  drawText(ctx, "DISTRIBUTED", gx, gy + 60, PALETTE.textSub, 13, "400", "center");
}

// ─── Template: NUR Digest ────────────────────────────────────────────────────

function renderNurDigest(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  data: DigestData,
  t: number
) {
  const p = 60;
  renderBackground(ctx, w, h);
  renderLogo(ctx, w, p, t);

  const moodColor = data.marketMood === "bullish"
    ? PALETTE.green : data.marketMood === "bearish" ? PALETTE.red : PALETTE.gold;
  drawText(ctx, `NUR DAILY DIGEST — ${data.date}`, p, 140, PALETTE.textPrime, 36, "700");
  drawRect(ctx, p, 158, 130, 28, moodColor + "25", 6);
  drawText(ctx, `● ${data.marketMood.toUpperCase()}`, p + 12, 177, moodColor, 15, "700");

  drawLine(ctx, p, 202, w - p, 202, PALETTE.border, 1);

  const stories = data.topStories.slice(0, 4);
  stories.forEach((s, i) => {
    const sy = 230 + i * 160;
    const reveal = Math.max(0, Math.min(1, (t - i * 400 - 500) / 600));
    ctx.globalAlpha = reveal;
    drawRect(ctx, p, sy, w - p * 2, 140, PALETTE.surface, 10);
    drawRect(ctx, p, sy, 4, 140, moodColor, 0);
    drawText(ctx, `0${i + 1}`, p + 20, sy + 38, PALETTE.textSub, 15, "400");
    drawText(ctx, s.title, p + 20, sy + 70, PALETTE.textPrime, 26, "700");
    drawText(ctx, s.summary, p + 20, sy + 106, PALETTE.textSub, 16, "400");
    ctx.globalAlpha = 1;
  });

  if (data.nurFinanceInsight) {
    const iy = 870;
    drawLine(ctx, p, iy, w - p, iy, PALETTE.border, 1);
    drawText(ctx, "NUR FINANCE INSIGHT", p, iy + 30, PALETTE.accent, 14, "700");
    drawText(ctx, data.nurFinanceInsight, p, iy + 58, PALETTE.textSub, 18, "400");
  }
}

// ─── Frame Dispatcher ─────────────────────────────────────────────────────────

function renderFrame(
  ctx: CanvasRenderingContext2D,
  opts: Required<RenderOptions>,
  t: number,
  frame: number
) {
  const { width: w, height: h, template, data, watermark } = opts;

  switch (template) {
    case "market_bulletin":
      renderMarketBulletin(ctx, w, h, data as BulletinData, t, frame);
      break;
    case "stock_analysis":
      renderStockAnalysis(ctx, w, h, data as StockAnalysisData, t, frame);
      break;
    case "depin_metrics":
      renderDepinMetrics(ctx, w, h, data as DepinData, t);
      break;
    case "nur_digest":
      renderNurDigest(ctx, w, h, data as DigestData, t);
      break;
  }

  if (watermark) {
    renderWatermark(ctx, w, h, watermark);
  }
}

// ─── Browser Renderer (MediaRecorder) ─────────────────────────────────────────

export interface BrowserRenderResult {
  blob: Blob;
  durationMs: number;
  frameCount: number;
  mimeType: string;
}

export async function renderToBrowser(opts: RenderOptions): Promise<BrowserRenderResult> {
  const fullOpts: Required<RenderOptions> = {
    width: 1920,
    height: 1080,
    fps: 60,
    durationMs: 8000,
    outputFormat: "webm",
    bitrate: 8_000_000,
    watermark: "nur.finance",
    ...opts,
  };

  const canvas = document.createElement("canvas");
  canvas.width = fullOpts.width;
  canvas.height = fullOpts.height;
  const ctx = canvas.getContext("2d")!;

  const mimeType = fullOpts.outputFormat === "mp4"
    ? "video/mp4;codecs=avc1"
    : "video/webm;codecs=vp9";

  const supported = MediaRecorder.isTypeSupported(mimeType);
  const actualMime = supported ? mimeType : "video/webm;codecs=vp8";

  const recorder = new MediaRecorder(canvas.captureStream(fullOpts.fps), {
    mimeType: actualMime,
    videoBitsPerSecond: fullOpts.bitrate,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise<BrowserRenderResult>((resolve, reject) => {
    recorder.onerror = reject;
    recorder.onstop = () => {
      resolve({
        blob: new Blob(chunks, { type: actualMime }),
        durationMs: fullOpts.durationMs,
        frameCount: Math.round(fullOpts.fps * fullOpts.durationMs / 1000),
        mimeType: actualMime,
      });
    };

    recorder.start(100);

    const frameMs = 1000 / fullOpts.fps;
    let frame = 0;
    let elapsed = 0;

    const tick = () => {
      if (elapsed >= fullOpts.durationMs) {
        recorder.stop();
        return;
      }
      renderFrame(ctx, fullOpts, elapsed, frame);
      frame++;
      elapsed += frameMs;
      setTimeout(tick, frameMs);
    };

    tick();
  });
}

// ─── Server-Side Renderer (node-canvas) ───────────────────────────────────────
// Requires: npm i canvas
// Returns PNG frames as Buffer[] — encode to video with ffmpeg

export interface ServerFrameResult {
  frames: Buffer[];
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  ffmpegCmd: string;   // suggested ffmpeg command
}

export async function renderToFrames(opts: RenderOptions): Promise<ServerFrameResult> {
  const fullOpts: Required<RenderOptions> = {
    width: 1920,
    height: 1080,
    fps: 30,           // server-side 30fps (CPU render)
    durationMs: 8000,
    outputFormat: "mp4",
    bitrate: 8_000_000,
    watermark: "nur.finance",
    ...opts,
  };

  // Dynamic import — only available server-side (npm i canvas)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createCanvas } = await (async () => {
    try { return await import("canvas" as string); }
    catch { throw new Error("'canvas' npm package required for server-side rendering: npm i canvas"); }
  })();

  const canvas = createCanvas(fullOpts.width, fullOpts.height);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

  const totalFrames = Math.round(fullOpts.fps * fullOpts.durationMs / 1000);
  const frameMs = 1000 / fullOpts.fps;
  const frames: Buffer[] = [];

  for (let f = 0; f < totalFrames; f++) {
    renderFrame(ctx, fullOpts, f * frameMs, f);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    frames.push((canvas as any).toBuffer("image/png"));
  }

  const ffmpegCmd = [
    "ffmpeg -framerate", fullOpts.fps,
    "-i frame_%04d.png",
    "-c:v libx264 -pix_fmt yuv420p",
    `-b:v ${fullOpts.bitrate / 1000}k`,
    "-movflags +faststart",
    `output.${fullOpts.outputFormat}`,
  ].join(" ");

  return { frames, width: fullOpts.width, height: fullOpts.height, fps: fullOpts.fps, totalFrames, ffmpegCmd };
}

// ─── Thumbnail Generator ──────────────────────────────────────────────────────

export interface ThumbnailOptions {
  template: TemplateType;
  data: RenderOptions["data"];
  width?: number;    // default 1280
  height?: number;   // default 720
}

export interface ThumbnailResult {
  dataUrl: string;   // PNG data URL — use as <img src> or YouTube thumbnail
  width: number;
  height: number;
}

export async function generateThumbnail(opts: ThumbnailOptions): Promise<ThumbnailResult> {
  const w = opts.width ?? 1280;
  const h = opts.height ?? 720;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const renderOpts: Required<RenderOptions> = {
    template: opts.template,
    data: opts.data,
    width: w,
    height: h,
    fps: 1,
    durationMs: 0,
    outputFormat: "webm",
    bitrate: 0,
    watermark: "nur.finance",
  };

  // Render the "settled" frame (t=5000 → animations complete)
  renderFrame(ctx, renderOpts, 5000, 1);

  return { dataUrl: canvas.toDataURL("image/png"), width: w, height: h };
}

// ─── FFmpeg Video Encoder (server-side only) ──────────────────────────────────
// Pipes raw PNG frames directly into ffmpeg stdin — no temp files needed.
// Requires: ffmpeg in PATH and `npm i canvas`

export interface VideoEncodeOptions extends RenderOptions {
  outputPath: string;   // absolute path to write the output file
  audioPath?: string;   // optional pre-rendered audio track (mp3/wav)
  crf?: number;         // H.264 CRF quality (0=lossless, 23=default, 51=worst)
  preset?: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow";
  onProgress?: (frameN: number, total: number) => void;
}

export interface VideoEncodeResult {
  outputPath: string;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  durationMs: number;
  fileSizeBytes: number;
}

export async function renderToVideo(opts: VideoEncodeOptions): Promise<VideoEncodeResult> {
  // Dynamic imports — server-side only
  const [{ createCanvas }, { spawn }, { statSync }] = await Promise.all([
    (async () => {
      try { return await import("canvas" as string) as { createCanvas: (w: number, h: number) => HTMLCanvasElement }; }
      catch { throw new Error("'canvas' package required: npm i canvas"); }
    })(),
    import("child_process"),
    import("fs"),
  ]);

  const fullOpts: Required<Omit<VideoEncodeOptions, "audioPath" | "onProgress" | "outputPath" | "crf" | "preset">> = {
    template: opts.template,
    data: opts.data,
    width: opts.width ?? 1920,
    height: opts.height ?? 1080,
    fps: opts.fps ?? 60,
    durationMs: opts.durationMs ?? 8000,
    outputFormat: opts.outputFormat ?? "mp4",
    bitrate: opts.bitrate ?? 8_000_000,
    watermark: opts.watermark ?? "nur.finance",
  };

  const totalFrames = Math.round(fullOpts.fps * fullOpts.durationMs / 1000);
  const frameMs = 1000 / fullOpts.fps;

  // Build ffmpeg args — raw PNG pipe → H.264 → output
  const ffArgs: string[] = [
    "-y",                              // overwrite
    "-f", "image2pipe",
    "-vcodec", "png",
    "-framerate", String(fullOpts.fps),
    "-i", "pipe:0",                    // read frames from stdin
  ];

  if (opts.audioPath) {
    ffArgs.push("-i", opts.audioPath, "-shortest");
  }

  ffArgs.push(
    "-vf", `scale=${fullOpts.width}:${fullOpts.height}`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", String(opts.crf ?? 18),
    "-preset", opts.preset ?? "fast",
    "-movflags", "+faststart",
    "-b:v", `${Math.round(fullOpts.bitrate / 1000)}k`,
    opts.outputPath,
  );

  const ffmpeg = spawn("ffmpeg", ffArgs, { stdio: ["pipe", "pipe", "pipe"] });

  const encodeErrors: string[] = [];
  ffmpeg.stderr?.on("data", (chunk: Buffer) => {
    const line = chunk.toString();
    if (line.includes("Error") || line.includes("error")) encodeErrors.push(line.trim());
  });

  // Render and pipe frames
  const canvas = createCanvas(fullOpts.width, fullOpts.height);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

  for (let f = 0; f < totalFrames; f++) {
    renderFrame(ctx, fullOpts, f * frameMs, f);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pngBuf: Buffer = (canvas as any).toBuffer("image/png");
    const canWrite = ffmpeg.stdin?.write(pngBuf);
    if (!canWrite) {
      // Backpressure — wait for drain
      await new Promise<void>(res => ffmpeg.stdin?.once("drain", res));
    }
    opts.onProgress?.(f + 1, totalFrames);
  }

  ffmpeg.stdin?.end();

  // Wait for ffmpeg to finish
  await new Promise<void>((resolve, reject) => {
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${encodeErrors.slice(-3).join(" | ")}`));
    });
    ffmpeg.on("error", reject);
  });

  const stat = statSync(opts.outputPath);

  return {
    outputPath: opts.outputPath,
    width: fullOpts.width,
    height: fullOpts.height,
    fps: fullOpts.fps,
    totalFrames,
    durationMs: fullOpts.durationMs,
    fileSizeBytes: stat.size,
  };
}
