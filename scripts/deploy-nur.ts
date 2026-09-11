import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying NurCoin with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  const NurCoin = await ethers.getContractFactory("NurCoin");
  const nurCoin = await NurCoin.deploy(deployer.address);
  await nurCoin.waitForDeployment();

  const address = await nurCoin.getAddress();
  console.log("\n✅ NurCoin deployed to:", address);
  console.log("Network: Polygon Amoy Testnet");
  console.log("Explorer: https://amoy.polygonscan.com/address/" + address);
  console.log("\nSovereign admin:", deployer.address);
  console.log("Initial supply: 100,000,000 NUR minted to admin");
  console.log("Max supply: 1,000,000,000 NUR");
}

main().catch((e) => { console.error(e); process.exit(1); });
