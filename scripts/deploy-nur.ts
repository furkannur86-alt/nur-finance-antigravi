/**
 * NurCoin.sol Deployment Script — Polygon Amoy Testnet / Polygon Mainnet
 *
 * Usage:
 *   npx hardhat run scripts/deploy-nur.ts --network amoy
 *   npx hardhat run scripts/deploy-nur.ts --network polygon
 *
 * Required .env.contracts:
 *   DEPLOY_PRIVATE_KEY        — deployer wallet (sovereign admin)
 *   COMPUTE_POOL_WALLET       — receives 35,000,000 NUR for DePIN rewards
 *   TEAM_WALLET               — receives  4,200,000 NUR (vesting enforced off-chain)
 *   COMMUNITY_WALLET          — receives  2,551,113 NUR (airdrops, education)
 *   POLYGONSCAN_API_KEY       — for contract verification
 */

import { ethers, run, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n══════════════════════════════════════════════════");
  console.log("  NUR FINANCE — NurCoin.sol Deployment");
  console.log("══════════════════════════════════════════════════");
  console.log("Network      :", network.name);
  console.log("Deployer     :", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance      :", ethers.formatEther(balance), "MATIC");

  if (balance === 0n) {
    throw new Error("Deployer wallet has no MATIC — fund it before deploying.");
  }

  // ── Wallet addresses from env ─────────────────────────────────────────────
  const computePoolWallet = process.env.COMPUTE_POOL_WALLET || deployer.address;
  const teamWallet        = process.env.TEAM_WALLET        || deployer.address;
  const communityWallet   = process.env.COMMUNITY_WALLET   || deployer.address;

  console.log("Sovereign    :", deployer.address);
  console.log("Compute Pool :", computePoolWallet);
  console.log("Team         :", teamWallet);
  console.log("Community    :", communityWallet);
  console.log("──────────────────────────────────────────────────");

  // ── Deploy ────────────────────────────────────────────────────────────────
  console.log("\n🚀 Deploying NurCoin...");
  const NurCoin = await ethers.getContractFactory("NurCoin");
  const nurCoin = await NurCoin.deploy(
    deployer.address,    // _sovereignAdmin
    computePoolWallet,   // _computePoolWallet
    teamWallet,          // _teamWallet
    communityWallet,     // _communityWallet
  );
  await nurCoin.waitForDeployment();

  const address = await nurCoin.getAddress();
  const deployTx = nurCoin.deploymentTransaction();

  console.log("\n✅ NurCoin deployed to:", address);
  console.log("Tx hash      :", deployTx?.hash);
  console.log("Block        :", deployTx?.blockNumber ?? "pending");

  // ── Verify supply ─────────────────────────────────────────────────────────
  const totalSupply = await nurCoin.totalSupply();
  const maxSupply   = await nurCoin.MAX_SUPPLY();
  console.log("\nTotal supply :", ethers.formatEther(totalSupply), "NUR");
  console.log("Max supply   :", ethers.formatEther(maxSupply),   "NUR");

  // Sovereignty check
  const sealNum = await nurCoin.SEAL_NUM();
  console.log("Sovereign seal:", sealNum.toString(), sealNum === 54_751_113n ? "✅" : "❌ MISMATCH");

  // ── Etherscan verification ─────────────────────────────────────────────────
  if (network.name !== "hardhat" && network.name !== "localhost" && process.env.POLYGONSCAN_API_KEY) {
    console.log("\n⏳ Waiting 30s for block confirmations before verifying...");
    await new Promise(r => setTimeout(r, 30_000));

    try {
      await run("verify:verify", {
        address,
        constructorArguments: [
          deployer.address,
          computePoolWallet,
          teamWallet,
          communityWallet,
        ],
      });
      console.log("✅ Contract verified on Polygonscan");
    } catch (err) {
      console.warn("⚠️  Verification failed (may already be verified):", (err as Error).message);
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n══════════════════════════════════════════════════");
  console.log("  Deployment Complete — Save these addresses!");
  console.log("══════════════════════════════════════════════════");
  console.log(`NurCoin contract  : ${address}`);
  console.log(`Explorer          : https://${network.name === "amoy" ? "amoy." : ""}polygonscan.com/address/${address}`);
  console.log("\n📝 Add to .env.contracts:");
  console.log(`NUR_COIN_CONTRACT_ADDRESS=${address}`);
  console.log("\n📝 Add to .env (Next.js):");
  console.log(`NEXT_PUBLIC_NUR_COIN_ADDRESS=${address}`);
  console.log("══════════════════════════════════════════════════\n");
}

main().catch((e) => { console.error(e); process.exit(1); });
