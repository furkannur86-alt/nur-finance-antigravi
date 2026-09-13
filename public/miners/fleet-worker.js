// NUR Fleet In-Browser Multi-Threaded Mining WebWorker
// Simulates / computes proof-of-work hashes for the selected civilizational vessel

let isRunning = false;
let shipId = "TR_SOV";
let vesselWallet = "NUR-TR_SOV-54751113-VAULT";
let powerMode = "BALANCED"; // ECO | BALANCED | OVERCLOCK
let hashesComputed = 0;
let sharesFound = 0;
let blocksFound = 0;
let lastReportTime = Date.now();

const POWER_DELAYS = {
  ECO: 45,        // Sleep 45ms between hash batches (low CPU)
  BALANCED: 12,   // Sleep 12ms between hash batches (medium CPU)
  OVERCLOCK: 1    // Continuous looping (max CPU)
};

const BATCH_SIZE = 500;

function sha256_mock(str) {
  // Fast bitwise simulation for proof-of-work mining
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function miningLoop() {
  if (!isRunning) return;

  const targetZeros = powerMode === "OVERCLOCK" ? "0000" : "000";
  const nonceBase = Math.floor(Math.random() * 10000000);

  for (let i = 0; i < BATCH_SIZE; i++) {
    const nonce = nonceBase + i;
    const testPayload = `${shipId}:${vesselWallet}:${nonce}:${Date.now()}`;
    const hash = sha256_mock(testPayload);
    hashesComputed++;

    if (hash.startsWith(targetZeros)) {
      sharesFound++;
      // Rare block discovery (0.5% chance on share)
      if (Math.random() < 0.005) {
        blocksFound++;
        self.postMessage({
          type: "BLOCK_MINED",
          payload: {
            shipId,
            vesselWallet,
            blockHash: `0x${hash}9a4b8f`,
            rewardUSD: (Math.random() * 8.5 + 2.5).toFixed(2),
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  }

  const now = Date.now();
  if (now - lastReportTime >= 1000) {
    const elapsedSec = (now - lastReportTime) / 1000;
    const currentHashrateMH = (hashesComputed / elapsedSec) / 100;
    
    self.postMessage({
      type: "TELEMETRY",
      payload: {
        shipId,
        vesselWallet,
        hashrateMH: parseFloat(currentHashrateMH.toFixed(2)),
        totalHashes: hashesComputed,
        sharesFound,
        blocksFound,
        powerMode
      }
    });

    hashesComputed = 0;
    lastReportTime = now;
  }

  const delay = POWER_DELAYS[powerMode] || 15;
  setTimeout(miningLoop, delay);
}

self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === "START") {
    shipId = payload.shipId || shipId;
    vesselWallet = payload.vesselWallet || vesselWallet;
    powerMode = payload.powerMode || "BALANCED";
    if (!isRunning) {
      isRunning = true;
      lastReportTime = Date.now();
      miningLoop();
    }
  } else if (type === "STOP") {
    isRunning = false;
  } else if (type === "SET_POWER") {
    powerMode = payload.powerMode || powerMode;
  } else if (type === "SET_SHIP") {
    shipId = payload.shipId;
    vesselWallet = payload.vesselWallet;
  }
};
