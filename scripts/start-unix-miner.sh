#!/usr/bin/env bash
# ===============================================================================
# NUR FINANCE — UNIX / LINUX / MACOS MINING & NODE LAUNCHER
# ===============================================================================

WALLET_ADDRESS=${1:-"0x742d35Cc6634C0532925a3b844Bc454e4438f44e"}
THREADS=${2:-4}

echo "==============================================================================="
echo "  ⚡ NUR FINANCE — UNIX WORKER NODE LAUNCHER"
echo "==============================================================================="
echo "Target Wallet : $WALLET_ADDRESS"
echo "Threads       : $THREADS"
echo "==============================================================================="

# Ensure python3 is available
if ! command -v python3 &> /dev/null
then
    echo "[!] Error: python3 is not installed on this Unix machine."
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
python3 "$SCRIPT_DIR/nur-unix-miner.py" --wallet "$WALLET_ADDRESS" --threads "$THREADS"
