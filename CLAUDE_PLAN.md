# 🏛️ CLAUDE CODE — SOVEREIGN IMPLEMENTATION PLAN
> **Target System:** NUR Finance Sovereign Ecosystem (Next.js 16 + Hardhat + Electron + Video Engine)  
> **Partner Agent:** Antigravity (Frontend UI, Client-Crypto, AI Avatars, Domain Hubs)  
> **Role of Claude Code:** Backend Pipelines, 1080p Video Production, YouTube Bot, DePIN Daemon & Smart Contract

---

## 🎯 Executive Mission & Work Partition

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                           DUAL-AGENT SPECIALIZATION BOUNDARIES                            │
├─────────────────────────────────────────────────────────────┬─────────────────────────────┤
│ 🔵 ANTIGRAVITY (FRONTEND & CLIENT ENGINES)                   │ 🟢 CLAUDE CODE (BACKEND & MEDIA) │
├─────────────────────────────────────────────────────────────┼─────────────────────────────┤
│ • UI Panels & Layouts (`src/components/`)                   │ • Video Renderer & Templates│
│ • Client Non-Custodial Wallet (`sovereignWallet.ts`)        │ • YouTube API v3 Uploader   │
│ • Interactive AI Avatars (`AIAvatarStudio.tsx`)             │ • 24/7 RTMP Live Streamer   │
│ • WebGPU/WebWorker Client Engine (`webComputeEngine.ts`)    │ • DePIN Mining Pool Backend │
│ • Multi-Industry AI Hub (`ProfessionalAIHubPanel.tsx`)      │ • Fiat SEPA/SWIFT Queue     │
│ • Candlestick Chart Engine (`ChartsPanel.tsx`)              │ • Hardhat Contracts & Deploy│
│ • On-Chain Ledger Explorer (`SovereignLedgerExplorer.tsx`)  │ • Electron Desktop Worker   │
└─────────────────────────────────────────────────────────────┴─────────────────────────────┘
```

---

## 📋 Task Breakdown for Claude Code

### Phase 1: 🎬 1080p Video Content Factory & Automated News Reels
- [ ] **1.1. Connect `src/lib/video/videoRenderer.ts` with Live Market Feeds**:
  - Feed real-time stock/crypto prices from `/api/market-data` and breaking news from `/api/news-feed` into video template layouts.
  - Support 4 automated templates:
    1. `DAILY_MARKET_BRIEF`: S&P 500, Nasdaq, Gold, Brent Crude, $NUR price recap.
    2. `STOCK_DEEP_DIVE`: Per-symbol technical & fundamental analysis with automated chart rendering.
    3. `DEPIN_COMPUTE_METRICS`: Global FLOPS, active nodes, and top mining contributors.
    4. `BREAKING_FLASH`: Urgent geopolitical/economic flash alerts.
- [ ] **1.2. Automated Audio Track Mixing**:
  - Combine synthesized TTS voiceover (from `hdVoiceEngine` or server-side speech) with background cyber-ambient audio track.
  - Export final output as standardized 1080p MP4 / WebM video files.
- [ ] **1.3. Automated Thumbnail Generation**:
  - Generate high-contrast, clickable YouTube thumbnails (1280x720) with asset badges, bold profit/risk metrics, and Eagle crest watermarks.

---

### Phase 2: 📺 YouTube Bot & 24/7 RTMP Live Stream Engine
- [ ] **2.1. Complete YouTube Data API v3 Pipeline (`src/lib/broadcast/youtubeUploader.ts`)**:
  - Implement automated OAuth2 refresh token lifecycle.
  - Add resumable chunked video upload for high-bitrate 1080p MP4 files.
  - Auto-generate SEO-optimized video titles, descriptions, chapters/timestamps, and financial tags.
- [ ] **2.2. Production RTMP Streamer Script (`scripts/youtube-streamer.ts`)**:
  - Finalize FFmpeg pipeline to stream `public/nur-tv-broadcast.html` or generated canvas frames to YouTube Live RTMP (`rtmp://a.rtmp.youtube.com/live2`).
  - Add live news ticker overlay, orbital satellite telemetry, and real-time order book depth animation.
- [ ] **2.3. Cron / Webhook Trigger Route (`src/app/api/youtube/route.ts`)**:
  - Add scheduled automation trigger (`action: "schedule_daily_digest"`) to generate and upload a morning and evening market reel automatically.

---

### Phase 3: ⚡ DePIN Mining Pool Backend & Fiat Cashout Settlement
- [ ] **3.1. Enhance Mining Pool Coordinator (`src/lib/mining/pool-state.ts` & `/api/mining/pool`)**:
  - Implement heartbeat timeout eviction (mark inactive after 30 seconds of silence).
  - Add rolling 24h global FLOPS aggregator and top-node leaderboard.
  - Calculate exact micro-reward distributions based on verified matrix iteration proofs.
- [ ] **3.2. Fiat Settlement Queue (`src/app/api/wallet/fiat-settlement/route.ts`)**:
  - Enforce SHA-256 IBAN/SWIFT hashing (zero plaintext storage).
  - Add admin status transition endpoints (`APPROVE`, `SETTLE_WITH_SEPA`, `REJECT_REFUND`).
  - Link fiat approvals with smart contract `settleFiatWithdrawal(requestId)` trigger.

---

### Phase 4: 📜 Smart Contract Hardhat Testing & Deployment
- [ ] **4.1. Validate Hardhat Test Suite (`contracts/NurCoin.sol`)**:
  - Contract parameters:
    - `MAX_SUPPLY = 54,751,113 * 10**18`
    - `SEAL_13 = 13`, `SEAL_35 = 35`, `SEAL_42 = 42`, `SEAL_55 = 55`, `SEAL_NUM = 54751113`
  - Write test cases in `test/NurCoin.test.ts` for:
    - Genesis mint allocation (`13,000,000 NUR`).
    - Compute pool reward distribution via `batchDistributeComputeRewards()`.
    - Fiat withdrawal locking and burning via `settleFiatWithdrawal()`.
- [ ] **4.2. Deployment Script (`scripts/deploy-nur.ts`)**:
  - Configure deploy script for Polygon Amoy Testnet & local Hardhat network.

---

### Phase 5: 🖥️ Electron Desktop App & Native GPU Worker
- [ ] **5.1. Background Child-Process Worker**:
  - In `electron-main.js`, spawn a background worker that runs non-aggressive C++/WASM matrix multiplications when the desktop app is minimized.
- [ ] **5.2. System Tray & Telemetry**:
  - Native system tray with real-time hash score, $NUR hourly yield, and one-click Pause/Resume toggle.

---

## 🛡️ File Boundary Rules (Conflict Prevention)

### ✅ Claude Code Can Freely Modify & Create:
- `src/lib/video/*`
- `src/lib/broadcast/youtubeUploader.ts`
- `src/app/api/youtube/*`
- `src/lib/mining/*`
- `src/app/api/mining/*`
- `src/app/api/wallet/fiat-settlement/*`
- `contracts/*`
- `scripts/*`
- `test/*`
- `hardhat.config.ts`
- `electron-main.js`
- `public/nur-tv-broadcast.html`

### ⛔ Do NOT Overwrite (Maintained by Antigravity):
- `src/components/professional/*`
- `src/components/social/*`
- `src/components/crypto/SovereignLedgerExplorer.tsx`
- `src/lib/crypto/sovereignWallet.ts`
- `src/lib/compute/webComputeEngine.ts`
- `src/components/dashboard/ChartsPanel.tsx`

---

## 🚀 Recommended Immediate Command for Claude Code

Run the Hardhat tests or start the video pipeline:
```bash
# 1. Run Next.js build verification
npm run build

# 2. Test Video Rendering Pipeline
npx tsx scripts/youtube-streamer.ts --test-frame
```
