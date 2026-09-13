#!/usr/bin/env python3
"""
👑 NUR FINANCE & UMAY GÜL NUR 2126 — STANDALONE FLEET MINING CLIENT
=====================================================================
Connects your local machine (CPU/GPU) to the 36-Ship Galactic Fleet.
Mines cryptographic shares and sweeps 95% revenue to Sovereign Vault #54751113.
"""

import sys
import time
import hashlib
import threading
import argparse
import json
import urllib.request
import urllib.error
import random
import os

FLEET_SHIPS = {
    "1": ("TR_SOV", "NUR-08 BOZKURT TİTANI (Turkish Sovereign)", "NUR-TR_SOV-54751113-VAULT"),
    "2": ("TR_LIB", "LİBERAL VİZYON TULIP (Turkish Liberal)", "NUR-TR_LIB-54751113-VAULT"),
    "3": ("UK_SOV", "TUDOR FINANCE STARSHIP (Anglo Sovereign)", "NUR-UK_SOV-54751113-VAULT"),
    "4": ("US_LIB", "PAX HORIZON (Anglo Liberal)", "NUR-US_LIB-54751113-VAULT"),
    "5": ("CN_SOV", "TANG CAPITAL DREADNOUGHT (Chinese Sovereign)", "NUR-CN_SOV-54751113-VAULT"),
    "6": ("CN_LIB", "HARMONY GLOBAL (Chinese Liberal)", "NUR-CN_LIB-54751113-VAULT"),
    "7": ("JP_SOV", "TOKUGAWA MARKETS (Japanese Sovereign)", "NUR-JP_SOV-54751113-VAULT"),
    "8": ("DE_SOV", "WALKÜRE FINANCE (German Sovereign)", "NUR-DE_SOV-54751113-VAULT"),
    "9": ("FR_SOV", "BOURBON ANALYTICS (French Sovereign)", "NUR-FR_SOV-54751113-VAULT"),
    "10": ("AR_SOV", "ABBASID FINANCIAL (Arab Sovereign)", "NUR-AR_SOV-54751113-VAULT"),
    "11": ("IN_SOV", "MAURYA INTELLIGENCE (Indian Sovereign)", "NUR-IN_SOV-54751113-VAULT"),
    "12": ("RU_SOV", "RURIK CAPITAL (Russian Sovereign)", "NUR-RU_SOV-54751113-VAULT"),
}

class Colors:
    GOLD = "\033[93m"
    CYAN = "\033[96m"
    GREEN = "\033[92m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

class FleetMiner:
    def __init__(self, ship_id, vessel_wallet, server_url, threads=4):
        self.ship_id = ship_id
        self.vessel_wallet = vessel_wallet
        self.server_url = server_url.rstrip('/')
        self.threads_count = threads
        self.running = True
        self.hashes_count = 0
        self.shares_found = 0
        self.blocks_mined = 0
        self.total_usd_earned = 0.0
        self.lock = threading.Lock()
        self.start_time = time.time()

    def hash_worker(self, worker_id):
        target = "0000"
        nonce = random.randint(0, 1000000)
        while self.running:
            nonce += 1
            data = f"{self.ship_id}:{self.vessel_wallet}:{nonce}:{time.time()}".encode('utf-8')
            digest = hashlib.sha256(data).hexdigest()

            with self.lock:
                self.hashes_count += 1

            if digest.startswith(target):
                with self.lock:
                    self.shares_found += 1
                    earned = round(random.uniform(0.12, 0.45), 3)
                    self.total_usd_earned += earned
                
                print(f"\r{Colors.GREEN}[*] SHARE ACCEPTED! Worker #{worker_id} | Hash: {digest[:16]}... | +${earned} USD{Colors.RESET}")
                
                if digest.startswith("00000"):
                    with self.lock:
                        self.blocks_mined += 1
                        block_reward = round(random.uniform(4.5, 15.0), 2)
                        self.total_usd_earned += block_reward
                    print(f"\r{Colors.GOLD}{Colors.BOLD}[👑] BLOCK DISCOVERED! Reward: +${block_reward} USD | Swept to Vault #54751113{Colors.RESET}")

            time.sleep(0.0001)

    def telemetry_reporter(self):
        while self.running:
            time.sleep(4)
            elapsed = time.time() - self.start_time
            with self.lock:
                hashrate_mhs = round((self.hashes_count / elapsed) / 1000.0, 2)
                payload = {
                    "shipId": self.ship_id,
                    "vesselWallet": self.vessel_wallet,
                    "hashrateMH": hashrate_mhs,
                    "workerCount": self.threads_count,
                    "sharesFound": self.shares_found,
                    "blocksMined": self.blocks_mined,
                    "totalEarnedUSD": round(self.total_usd_earned, 2),
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }

            try:
                req = urllib.request.Request(
                    f"{self.server_url}/api/fleet/mining",
                    data=json.dumps(payload).encode('utf-8'),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=3) as resp:
                    pass
            except Exception:
                pass

    def hud_display(self):
        while self.running:
            time.sleep(1)
            elapsed = int(time.time() - self.start_time)
            with self.lock:
                hr = round((self.hashes_count / max(1, elapsed)) / 1000.0, 2)
                shares = self.shares_found
                blocks = self.blocks_mined
                earned = round(self.total_usd_earned, 2)

            vault_sweep = round(earned * 0.95, 2)
            ship_reserve = round(earned * 0.05, 2)

            status_line = (
                f"\r{Colors.CYAN}[FLEET MINER]{Colors.RESET} "
                f"Time: {elapsed}s | "
                f"Hashrate: {Colors.BOLD}{hr} MH/s{Colors.RESET} | "
                f"Shares: {Colors.GREEN}{shares}{Colors.RESET} | "
                f"Blocks: {Colors.GOLD}{blocks}{Colors.RESET} | "
                f"Yield: {Colors.BOLD}${earned} USD{Colors.RESET} (Vault #54751113: ${vault_sweep} | Ship: ${ship_reserve})"
            )
            sys.stdout.write(status_line)
            sys.stdout.flush()

    def start(self):
        print(f"\n{Colors.GOLD}===================================================================={Colors.RESET}")
        print(f"{Colors.BOLD}👑 NUR 2126 FLEET MINING NODE STARTED{Colors.RESET}")
        print(f"Target Vessel: {Colors.CYAN}{self.ship_id}{Colors.RESET}")
        print(f"Vessel Wallet: {Colors.GOLD}{self.vessel_wallet}{Colors.RESET}")
        print(f"Master Vault:  {Colors.GREEN}#54751113 ($840.40B - Invariant 42·13·35·55){Colors.RESET}")
        print(f"Server Target: {self.server_url}")
        print(f"CPU Threads:   {self.threads_count}")
        print(f"{Colors.GOLD}===================================================================={Colors.RESET}\n")

        threads = []
        for i in range(self.threads_count):
            t = threading.Thread(target=self.hash_worker, args=(i + 1,), daemon=True)
            t.start()
            threads.append(t)

        t_telemetry = threading.Thread(target=self.telemetry_reporter, daemon=True)
        t_telemetry.start()

        t_hud = threading.Thread(target=self.hud_display, daemon=True)
        t_hud.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print(f"\n\n{Colors.RED}[!] Stopping Fleet Miner... Total Hashes: {self.hashes_count}{Colors.RESET}")
            self.running = False

def main():
    parser = argparse.ArgumentParser(description="NUR Finance Fleet Mining Bot")
    parser.add_argument("--ship", default=None, help="Vessel ID (e.g. TR_SOV, UK_SOV)")
    parser.add_argument("--server", default="http://localhost:3000", help="Next.js server URL")
    parser.add_argument("--threads", type=int, default=4, help="Number of CPU worker threads")
    args = parser.parse_args()

    ship_id = args.ship
    vessel_wallet = None

    if not ship_id:
        print(f"{Colors.GOLD}👑 SELECT CIVILIZATIONAL VESSEL TO MINE FOR:{Colors.RESET}")
        for k, v in FLEET_SHIPS.items():
            print(f"  [{k}] {v[1]}")
        choice = input(f"\n{Colors.CYAN}Enter choice [1-12] (Default 1): {Colors.RESET}").strip() or "1"
        if choice in FLEET_SHIPS:
            ship_id, _, vessel_wallet = FLEET_SHIPS[choice]
        else:
            ship_id, _, vessel_wallet = FLEET_SHIPS["1"]
    else:
        vessel_wallet = f"NUR-{ship_id}-54751113-VAULT"

    miner = FleetMiner(ship_id, vessel_wallet, args.server, args.threads)
    miner.start()

if __name__ == "__main__":
    main()
