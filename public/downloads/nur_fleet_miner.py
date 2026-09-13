#!/usr/bin/env python3
"""
NUR Fleet Miner — Standalone Python Client
==========================================
Sovereign Mining Bot for the NUR Finance Galactic Fleet
Reports hashrate and earnings to NUR Finance Fleet API.

Usage:
  python nur_fleet_miner.py --ship TR_LIB --mode balanced --endpoint https://nurfinance.com

Options:
  --ship        Ship ID (e.g. TR_LIB, CN_SOV, UK_LIB). Default: TR_LIB
  --mode        eco | balanced | overclock. Default: balanced
  --endpoint    Fleet API base URL. Default: http://localhost:3000
  --threads     Number of mining threads. Default: auto (CPU count)
  --duration    Run for N seconds then stop. Default: 0 (run forever)
"""

import argparse
import hashlib
import json
import os
import random
import sys
import threading
import time
import uuid
from datetime import datetime, timezone

# ─── Configuration ──────────────────────────────────────────────────────────

SHIPS = {
    "TR_SOV": ("Turkish Sovereign", "conservative"),
    "TR_LIB": ("Turkish Liberal", "liberal"),
    "UK_SOV": ("British Sovereign", "conservative"),
    "UK_LIB": ("British Liberal", "liberal"),
    "DE_SOV": ("German Sovereign", "conservative"),
    "DE_LIB": ("German Liberal", "liberal"),
    "CN_SOV": ("Chinese Sovereign", "conservative"),
    "CN_LIB": ("Chinese Liberal", "liberal"),
    "JP_SOV": ("Japanese Sovereign", "conservative"),
    "JP_LIB": ("Japanese Liberal", "liberal"),
    "FR_SOV": ("French Sovereign", "conservative"),
    "FR_LIB": ("French Liberal", "liberal"),
    "RU_SOV": ("Russian Sovereign", "conservative"),
    "RU_LIB": ("Russian Liberal", "liberal"),
    "AR_SOV": ("Arab Sovereign", "conservative"),
    "AR_LIB": ("Arab Liberal", "liberal"),
    "IR_SOV": ("Iranian Sovereign", "conservative"),
    "IR_LIB": ("Iranian Liberal", "liberal"),
    "IN_SOV": ("Indian Sovereign", "conservative"),
    "IN_LIB": ("Indian Liberal", "liberal"),
    "ES_SOV": ("Spanish Sovereign", "conservative"),
    "ES_LIB": ("Spanish Liberal", "liberal"),
    "IT_SOV": ("Italian Sovereign", "conservative"),
    "IT_LIB": ("Italian Liberal", "liberal"),
    "SE_SOV": ("Swedish Sovereign", "conservative"),
    "SE_LIB": ("Swedish Liberal", "liberal"),
    "AF_SOV": ("African Sovereign", "conservative"),
    "AF_LIB": ("African Liberal", "liberal"),
    "LA_SOV": ("Latin American Sovereign", "conservative"),
    "LA_LIB": ("Latin American Liberal", "liberal"),
    "KR_SOV": ("Korean Sovereign", "conservative"),
    "KR_LIB": ("Korean Liberal", "liberal"),
    "SEA_SOV": ("Southeast Asian Sovereign", "conservative"),
    "SEA_LIB": ("Southeast Asian Liberal", "liberal"),
    "TT_SOV": ("Tatar Sovereign", "conservative"),
    "TT_LIB": ("Tatar Liberal", "liberal"),
}

MODES = {
    "eco":       {"difficulty": 1, "batch": 500,  "sleep": 0.05, "intensity": 0.25},
    "balanced":  {"difficulty": 1, "batch": 2000, "sleep": 0.01, "intensity": 1.0},
    "overclock": {"difficulty": 2, "batch": 8000, "sleep": 0.001,"intensity": 4.0},
}

SOVEREIGN_VAULT = "#54751113"
REPORT_INTERVAL = 10  # seconds between API reports

# ─── State ──────────────────────────────────────────────────────────────────

class MinerState:
    def __init__(self):
        self.lock = threading.Lock()
        self.total_hashes = 0
        self.session_earned = 0.0
        self.blocks_mined = 0
        self.shares = 0
        self.running = False
        self.start_time = None
        self.hash_window = []  # (timestamp, hashes) for rolling hashrate

state = MinerState()

# ─── Mining ─────────────────────────────────────────────────────────────────

def mine_worker(ship_id: str, worker_id: str, difficulty: int, batch: int, sleep: float):
    """Single mining thread: find PoW nonce, report shares."""
    target = "0" * difficulty
    nonce_base = random.randint(0, 2**32)
    nonce = 0
    batch_start = time.time()
    batch_hashes = 0

    while state.running:
        block_header = f"NUR-FLEET:{ship_id}:{worker_id}:{int(time.time())}:{nonce_base + nonce}:"
        digest = hashlib.sha256(block_header.encode()).hexdigest()
        nonce += 1
        batch_hashes += 1

        with state.lock:
            state.total_hashes += 1
            state.shares += 1

        if digest.startswith(target):
            reward = 0.001 * difficulty * (0.8 + random.random() * 0.4)
            with state.lock:
                state.blocks_mined += 1
                state.session_earned += reward

        if batch_hashes >= batch:
            elapsed = time.time() - batch_start
            with state.lock:
                state.hash_window.append((time.time(), batch_hashes))
                # Keep only last 30 seconds of window
                cutoff = time.time() - 30
                state.hash_window = [(t, h) for t, h in state.hash_window if t >= cutoff]
            batch_hashes = 0
            batch_start = time.time()
            time.sleep(sleep)


def rolling_hashrate_mhs() -> float:
    """Compute MH/s from the rolling hash window."""
    with state.lock:
        if not state.hash_window:
            return 0.0
        total = sum(h for _, h in state.hash_window)
        if len(state.hash_window) < 2:
            return 0.0
        span = state.hash_window[-1][0] - state.hash_window[0][0]
        if span <= 0:
            return 0.0
        return (total / span) / 1e6

# ─── API Reporting ───────────────────────────────────────────────────────────

def report_to_api(endpoint: str, ship_id: str, worker_id: str, faction: str):
    """POST mining telemetry to NUR Fleet API."""
    try:
        import urllib.request
        hashrate = rolling_hashrate_mhs()
        with state.lock:
            blocks = state.blocks_mined
            earned = state.session_earned
            shares = state.shares

        payload = json.dumps({
            "shipId": ship_id,
            "civilizationKey": ship_id.split("_")[0].lower(),
            "faction": faction,
            "workerId": worker_id,
            "hashrateMhs": round(hashrate, 4),
            "blocksMined": blocks,
            "sharesSubmitted": shares,
            "unclaimedTokens": round(earned, 6),
            "walletAddress": f"NUR-{ship_id}-{worker_id}-PYTHON",
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{endpoint}/api/fleet/mining",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            result = json.loads(resp.read())
            return result.get("success", False)
    except Exception as e:
        return False

# ─── Display ────────────────────────────────────────────────────────────────

def print_header(ship_id: str, mode: str, endpoint: str, threads: int, worker_id: str):
    civ_name = SHIPS.get(ship_id, ("Unknown Ship", "unknown"))[0]
    faction = SHIPS.get(ship_id, ("Unknown Ship", "unknown"))[1]
    print("\n" + "=" * 65)
    print("  👑  NUR FINANCE GALACTIC FLEET MINER  v1.0")
    print("=" * 65)
    print(f"  Ship     : {ship_id} — {civ_name}")
    print(f"  Faction  : {faction.upper()}")
    print(f"  Mode     : {mode.upper()}")
    print(f"  Threads  : {threads}")
    print(f"  Endpoint : {endpoint}")
    print(f"  Worker   : {worker_id}")
    print(f"  Vault    : {SOVEREIGN_VAULT} (95% → Umay Sovereign Treasury)")
    print("=" * 65)
    print()


def print_status(ship_id: str, endpoint: str, worker_id: str, last_report_ok: bool):
    hashrate = rolling_hashrate_mhs()
    elapsed = time.time() - state.start_time if state.start_time else 0
    h = int(elapsed // 3600)
    m = int((elapsed % 3600) // 60)
    s = int(elapsed % 60)

    with state.lock:
        blocks = state.blocks_mined
        earned = state.session_earned
        total_h = state.total_hashes

    status_icon = "✓" if last_report_ok else "⚠"
    print(
        f"\r  ⛏  {hashrate:.3f} MH/s  |  Blocks: {blocks}  |  "
        f"Earned: {earned:.6f} NUR  |  "
        f"Hashes: {total_h:,}  |  "
        f"Time: {h:02d}:{m:02d}:{s:02d}  |  API {status_icon}",
        end="",
        flush=True,
    )

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="NUR Fleet Miner — Sovereign Mining Client")
    parser.add_argument("--ship", default="TR_LIB", choices=list(SHIPS.keys()),
                        help="Ship ID to mine for (default: TR_LIB)")
    parser.add_argument("--mode", default="balanced", choices=["eco", "balanced", "overclock"],
                        help="Mining intensity mode (default: balanced)")
    parser.add_argument("--endpoint", default="http://localhost:3000",
                        help="NUR Finance API base URL (default: http://localhost:3000)")
    parser.add_argument("--threads", type=int, default=0,
                        help="Number of mining threads (default: auto = CPU count)")
    parser.add_argument("--duration", type=int, default=0,
                        help="Run for N seconds then stop (0 = run forever)")
    parser.add_argument("--list-ships", action="store_true",
                        help="List all available ship IDs and exit")
    args = parser.parse_args()

    if args.list_ships:
        print("\nAvailable Ships:\n")
        for sid, (name, faction) in SHIPS.items():
            print(f"  {sid:<10}  {name:<30}  [{faction}]")
        print()
        sys.exit(0)

    mode_cfg = MODES[args.mode]
    thread_count = args.threads or max(1, os.cpu_count() or 1)
    worker_id = "PY-" + str(uuid.uuid4())[:8].upper()
    ship_name, faction = SHIPS[args.ship]

    print_header(args.ship, args.mode, args.endpoint, thread_count, worker_id)

    state.running = True
    state.start_time = time.time()

    # Start mining threads
    threads = []
    for i in range(thread_count):
        t = threading.Thread(
            target=mine_worker,
            args=(args.ship, f"{worker_id}-T{i}", mode_cfg["difficulty"],
                  mode_cfg["batch"], mode_cfg["sleep"]),
            daemon=True,
        )
        t.start()
        threads.append(t)

    print(f"  🚀 Mining started with {thread_count} threads...\n")

    last_report_time = time.time()
    last_report_ok = True

    try:
        while state.running:
            time.sleep(1)
            print_status(args.ship, args.endpoint, worker_id, last_report_ok)

            now = time.time()
            if now - last_report_time >= REPORT_INTERVAL:
                last_report_ok = report_to_api(args.endpoint, args.ship, worker_id, faction)
                last_report_time = now

            if args.duration > 0 and (now - state.start_time) >= args.duration:
                break

    except KeyboardInterrupt:
        print("\n\n  🛑 Interrupted by user.")

    state.running = False
    print("\n\n  📊 Final Session Summary:")
    print(f"     Ship     : {args.ship} — {ship_name}")
    print(f"     Mode     : {args.mode.upper()}")
    print(f"     Hashrate : {rolling_hashrate_mhs():.3f} MH/s")
    print(f"     Blocks   : {state.blocks_mined}")
    print(f"     Earned   : {state.session_earned:.6f} NUR")
    print(f"     Total H  : {state.total_hashes:,}")
    elapsed = time.time() - state.start_time if state.start_time else 0
    print(f"     Time     : {elapsed:.0f}s")
    print(f"     Vault    : 95% → {SOVEREIGN_VAULT}")
    print()


if __name__ == "__main__":
    main()
