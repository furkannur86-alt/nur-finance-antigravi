// NUR Fleet Mining Worker — Browser WebWorker
// Runs in a background thread; communicates via postMessage.
// Reports hashrate and earnings to the fleet API endpoint.

let running = false;
let shipId = "TR_LIB";
let workerId = "BROWSER-" + Math.random().toString(36).slice(2, 8).toUpperCase();
let intensity = 1; // 0.25 Eco, 1 Balanced, 4 Overclock
let reportInterval = 5000; // ms

// Simulated work parameters — each "hash" is a lightweight CPU operation.
// We do real SHA-256 work via subtle crypto where available, otherwise Math fallback.
let totalHashes = 0;
let sessionEarned = 0;
let blocksMined = 0;
let sharesSinceReport = 0;
let lastReport = Date.now();
let lastHashTime = Date.now();
let batchSize = 500;

// SHA-256 via TextEncoder + SubtleCrypto — real CPU work, lightweight per hash.
async function sha256Hex(data) {
  try {
    const buf = new TextEncoder().encode(data);
    const hashBuf = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch {
    // Fallback: pure-JS djb2 hash simulation
    let h = 5381;
    for (let i = 0; i < data.length; i++) h = ((h << 5) + h) ^ data.charCodeAt(i);
    return (h >>> 0).toString(16).padStart(8, "0");
  }
}

// Proof-of-Work simulation: find a nonce where hash starts with target prefix.
async function mineNonce(blockHeader, difficulty) {
  const target = "0".repeat(difficulty);
  let nonce = 0;
  while (running) {
    const candidate = blockHeader + nonce.toString();
    const hash = await sha256Hex(candidate);
    totalHashes++;
    sharesSinceReport++;
    if (hash.startsWith(target)) {
      return { nonce, hash };
    }
    nonce++;
    if (nonce % batchSize === 0) {
      // Yield to event loop so browser stays responsive.
      await new Promise(r => setTimeout(r, intensity < 1 ? 20 : intensity < 2 ? 5 : 1));
    }
  }
  return null;
}

async function miningLoop() {
  let difficulty = 1; // Start easy, adapt based on intensity
  if (intensity >= 4) difficulty = 2;
  if (intensity >= 0.25 && intensity < 1) difficulty = 1;

  while (running) {
    const blockHeader = `NUR-FLEET:${shipId}:${workerId}:${Date.now()}:`;
    const result = await mineNonce(blockHeader, difficulty);
    if (!result) break; // stopped

    blocksMined++;
    // Token reward: 0.001–0.005 NUR per block, scaled by difficulty+intensity
    const reward = 0.001 * difficulty * Math.min(intensity, 4) * (0.8 + Math.random() * 0.4);
    sessionEarned += reward;

    self.postMessage({
      type: "block",
      nonce: result.nonce,
      hash: result.hash,
      blocksMined,
      sessionEarned,
    });

    // Report to fleet API periodically
    const now = Date.now();
    if (now - lastReport >= reportInterval) {
      const elapsedSec = (now - lastHashTime) / 1000;
      const hashrateMhs = elapsedSec > 0 ? (sharesSinceReport / elapsedSec) / 1e6 : 0;
      sharesSinceReport = 0;
      lastHashTime = now;
      lastReport = now;

      self.postMessage({
        type: "telemetry",
        hashrateMhs: +hashrateMhs.toFixed(4),
        totalHashes,
        blocksMined,
        sessionEarned,
        shipId,
        workerId,
      });

      // POST heartbeat to fleet API (only in browser context with fetch)
      if (typeof fetch !== "undefined") {
        fetch("/api/fleet/mining", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shipId,
            civilizationKey: shipId.split("_")[0].toLowerCase(),
            faction: shipId.endsWith("_SOV") ? "conservative" : "liberal",
            workerId,
            hashrateMhs: +hashrateMhs.toFixed(4),
            blocksMined,
            sharesSubmitted: totalHashes,
            unclaimedTokens: sessionEarned,
            walletAddress: `NUR-${shipId}-${workerId}-BROWSER`,
          }),
        }).catch(() => { /* network error — continue mining */ });
      }
    }
  }

  self.postMessage({ type: "stopped", totalHashes, blocksMined, sessionEarned });
}

self.onmessage = function(e) {
  const { cmd, config } = e.data;
  if (cmd === "start") {
    if (config) {
      if (config.shipId) shipId = config.shipId;
      if (config.intensity !== undefined) intensity = config.intensity;
      if (config.reportInterval) reportInterval = config.reportInterval;
      if (config.batchSize) batchSize = config.batchSize;
    }
    if (!running) {
      running = true;
      lastHashTime = Date.now();
      lastReport = Date.now();
      self.postMessage({ type: "started", shipId, workerId, intensity });
      miningLoop();
    }
  } else if (cmd === "stop") {
    running = false;
  } else if (cmd === "config") {
    if (config.shipId) shipId = config.shipId;
    if (config.intensity !== undefined) {
      intensity = config.intensity;
      batchSize = intensity < 1 ? 100 : intensity < 2 ? 500 : 2000;
    }
    if (config.reportInterval) reportInterval = config.reportInterval;
  } else if (cmd === "status") {
    self.postMessage({ type: "status", running, shipId, workerId, intensity, totalHashes, blocksMined, sessionEarned });
  }
};
