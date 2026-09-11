/**
 * NurCoin.sol — Hardhat Test Suite
 * Run: npx hardhat test
 *
 * Coverage areas:
 *   1. Deployment invariants (supply, seals, allocations)
 *   2. Compute reward distribution (single + batch)
 *   3. Fiat settlement lifecycle (request → approve → settle / reject)
 *   4. Treasury mint (cap enforcement)
 *   5. Pause / unpause
 *   6. Distributor access control
 */

import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { NurCoin } from "../typechain-types";

const NUR  = (n: number) => ethers.parseEther(String(n));
const ZERO = ethers.ZeroAddress;

describe("NurCoin", function () {
  let nur: NurCoin;
  let sovereign: SignerWithAddress;
  let computePool: SignerWithAddress;
  let team: SignerWithAddress;
  let community: SignerWithAddress;
  let distributor: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [sovereign, computePool, team, community, distributor, user1, user2, user3] =
      await ethers.getSigners();

    const Factory = await ethers.getContractFactory("NurCoin");
    nur = await Factory.deploy(
      sovereign.address,
      computePool.address,
      team.address,
      community.address,
    ) as NurCoin;
    await nur.waitForDeployment();
  });

  // ─── 1. Deployment invariants ──────────────────────────────────────────────

  describe("Deployment", () => {
    it("MAX_SUPPLY is exactly 54,751,113 NUR", async () => {
      expect(await nur.MAX_SUPPLY()).to.equal(NUR(54_751_113));
    });

    it("total supply equals MAX_SUPPLY after genesis mint", async () => {
      const total = await nur.totalSupply();
      const max   = await nur.MAX_SUPPLY();
      expect(total).to.equal(max);
    });

    it("sovereign receives GENESIS_ALLOC (13,000,000 NUR)", async () => {
      expect(await nur.balanceOf(sovereign.address)).to.equal(NUR(13_000_000));
    });

    it("computePool receives COMPUTE_POOL_ALLOC (35,000,000 NUR)", async () => {
      expect(await nur.balanceOf(computePool.address)).to.equal(NUR(35_000_000));
    });

    it("team receives TEAM_ALLOC (4,200,000 NUR)", async () => {
      expect(await nur.balanceOf(team.address)).to.equal(NUR(4_200_000));
    });

    it("community receives COMMUNITY_ALLOC (2,551,113 NUR)", async () => {
      expect(await nur.balanceOf(community.address)).to.equal(NUR(2_551_113));
    });

    it("sum of allocations equals MAX_SUPPLY", async () => {
      const g = await nur.GENESIS_ALLOC();
      const c = await nur.COMPUTE_POOL_ALLOC();
      const t = await nur.TEAM_ALLOC();
      const cm = await nur.COMMUNITY_ALLOC();
      expect(g + c + t + cm).to.equal(await nur.MAX_SUPPLY());
    });

    it("sovereign numerology seals are correct", async () => {
      expect(await nur.SEAL_13()).to.equal(13n);
      expect(await nur.SEAL_35()).to.equal(35n);
      expect(await nur.SEAL_42()).to.equal(42n);
      expect(await nur.SEAL_55()).to.equal(55n);
      expect(await nur.SEAL_NUM()).to.equal(54_751_113n);
    });

    it("owner is sovereign", async () => {
      expect(await nur.owner()).to.equal(sovereign.address);
    });

    it("decimals() returns 18", async () => {
      expect(await nur.decimals()).to.equal(18);
    });

    it("name and symbol are correct", async () => {
      expect(await nur.name()).to.equal("NUR Finance Coin");
      expect(await nur.symbol()).to.equal("NUR");
    });

    it("computePoolReleased starts at 0", async () => {
      expect(await nur.computePoolReleased()).to.equal(0n);
    });

    it("reverts if computePoolWallet is zero address", async () => {
      const F = await ethers.getContractFactory("NurCoin");
      await expect(F.deploy(sovereign.address, ZERO, team.address, community.address))
        .to.be.revertedWith("NUR: zero compute pool");
    });

    it("reverts if teamWallet is zero address", async () => {
      const F = await ethers.getContractFactory("NurCoin");
      await expect(F.deploy(sovereign.address, computePool.address, ZERO, community.address))
        .to.be.revertedWith("NUR: zero team");
    });

    it("reverts if communityWallet is zero address", async () => {
      const F = await ethers.getContractFactory("NurCoin");
      await expect(F.deploy(sovereign.address, computePool.address, team.address, ZERO))
        .to.be.revertedWith("NUR: zero community");
    });
  });

  // ─── 2. Distributor access control ────────────────────────────────────────

  describe("Distributor role", () => {
    it("sovereign is implicitly a distributor", async () => {
      // Owner can call distributeComputeReward without being granted explicitly
      const deviceId = ethers.keccak256(ethers.toUtf8Bytes("device-001"));
      // Approve pool → contract (normally done via pool wallet)
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(1000));
      // Owner calling as distributor — check no revert
      await expect(
        nur.connect(sovereign).distributeComputeReward(deviceId, user1.address, NUR(10))
      ).to.emit(nur, "ComputeRewardDistributed");
    });

    it("grantDistributor allows non-owner to distribute", async () => {
      await nur.connect(sovereign).grantDistributor(distributor.address);
      expect(await nur.isComputeDistributor(distributor.address)).to.be.true;

      const deviceId = ethers.keccak256(ethers.toUtf8Bytes("device-002"));
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(1000));

      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId, user1.address, NUR(5))
      ).to.emit(nur, "ComputeRewardDistributed").withArgs(deviceId, user1.address, NUR(5));
    });

    it("revokeDistributor removes access", async () => {
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(sovereign).revokeDistributor(distributor.address);
      expect(await nur.isComputeDistributor(distributor.address)).to.be.false;

      const deviceId = ethers.keccak256(ethers.toUtf8Bytes("device-003"));
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId, user1.address, NUR(1))
      ).to.be.revertedWith("NUR: not distributor");
    });

    it("non-distributor non-owner cannot distribute", async () => {
      const deviceId = ethers.keccak256(ethers.toUtf8Bytes("device-004"));
      await expect(
        nur.connect(user1).distributeComputeReward(deviceId, user2.address, NUR(1))
      ).to.be.revertedWith("NUR: not distributor");
    });

    it("only owner can grant/revoke distributor", async () => {
      await expect(
        nur.connect(user1).grantDistributor(user2.address)
      ).to.be.reverted;
      await expect(
        nur.connect(user1).revokeDistributor(distributor.address)
      ).to.be.reverted;
    });
  });

  // ─── 3. Compute reward distribution ──────────────────────────────────────

  describe("Compute rewards", () => {
    const deviceId1 = ethers.keccak256(ethers.toUtf8Bytes("device-a"));
    const deviceId2 = ethers.keccak256(ethers.toUtf8Bytes("device-b"));

    beforeEach(async () => {
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(100_000));
    });

    it("distributeComputeReward transfers NUR from pool to user", async () => {
      const before = await nur.balanceOf(user1.address);
      await nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(100));
      expect(await nur.balanceOf(user1.address)).to.equal(before + NUR(100));
    });

    it("tracks deviceAccumulatedRewards correctly", async () => {
      await nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(50));
      await nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(30));
      expect(await nur.deviceAccumulatedRewards(deviceId1)).to.equal(NUR(80));
    });

    it("tracks userComputeEarnings correctly", async () => {
      await nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(100));
      await nur.connect(distributor).distributeComputeReward(deviceId2, user1.address, NUR(200));
      expect(await nur.userComputeEarnings(user1.address)).to.equal(NUR(300));
    });

    it("increments computePoolReleased", async () => {
      await nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(123));
      expect(await nur.computePoolReleased()).to.equal(NUR(123));
    });

    it("reverts if zero address user", async () => {
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId1, ZERO, NUR(1))
      ).to.be.revertedWith("NUR: zero user");
    });

    it("reverts if zero amount", async () => {
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, 0)
      ).to.be.revertedWith("NUR: zero amount");
    });

    it("reverts if compute pool exhausted", async () => {
      const poolBalance = await nur.balanceOf(computePool.address);
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, poolBalance + 1n)
      ).to.be.revertedWith("NUR: compute pool exhausted");
    });

    it("emits ComputeRewardDistributed event", async () => {
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId1, user1.address, NUR(10))
      ).to.emit(nur, "ComputeRewardDistributed")
        .withArgs(deviceId1, user1.address, NUR(10));
    });

    describe("batchDistributeComputeRewards", () => {
      it("distributes to multiple users in one tx", async () => {
        const deviceIds = [deviceId1, deviceId2];
        const users     = [user1.address, user2.address];
        const amounts   = [NUR(100), NUR(200)];

        await nur.connect(distributor).batchDistributeComputeRewards(deviceIds, users, amounts);

        expect(await nur.balanceOf(user1.address)).to.equal(NUR(100));
        expect(await nur.balanceOf(user2.address)).to.equal(NUR(200));
        expect(await nur.computePoolReleased()).to.equal(NUR(300));
      });

      it("skips zero-address or zero-amount entries", async () => {
        const deviceIds = [deviceId1, deviceId2];
        const users     = [ZERO, user2.address];
        const amounts   = [NUR(10), NUR(50)];

        await nur.connect(distributor).batchDistributeComputeRewards(deviceIds, users, amounts);

        // Zero-address entry skipped — only user2 received
        expect(await nur.balanceOf(user2.address)).to.equal(NUR(50));
        expect(await nur.computePoolReleased()).to.equal(NUR(50));
      });

      it("reverts on array length mismatch", async () => {
        await expect(
          nur.connect(distributor).batchDistributeComputeRewards(
            [deviceId1], [user1.address, user2.address], [NUR(1)]
          )
        ).to.be.revertedWith("NUR: array length mismatch");
      });

      it("reverts if batch > 100", async () => {
        const ids  = Array(101).fill(deviceId1);
        const usrs = Array(101).fill(user1.address);
        const amts = Array(101).fill(NUR(1));
        await expect(
          nur.connect(distributor).batchDistributeComputeRewards(ids, usrs, amts)
        ).to.be.revertedWith("NUR: batch too large");
      });
    });
  });

  // ─── 4. Fiat settlement lifecycle ────────────────────────────────────────

  describe("Fiat settlement", () => {
    const ibanHash  = "sha256:DE89370400440532013000";
    const swiftCode = "DEUTDEDB";
    const nurAmount  = NUR(500);
    const eurCents   = 4925n;   // €49.25 after 1.5% fee

    beforeEach(async () => {
      // Give user1 some NUR to request settlement
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(10_000));
      await nur.connect(distributor).distributeComputeReward(
        ethers.keccak256(ethers.toUtf8Bytes("d")),
        user1.address,
        nurAmount
      );
    });

    it("requestFiatWithdrawal locks NUR in contract", async () => {
      const contractAddr = await nur.getAddress();
      const before = await nur.balanceOf(contractAddr);

      await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);

      expect(await nur.balanceOf(contractAddr)).to.equal(before + nurAmount);
      expect(await nur.balanceOf(user1.address)).to.equal(0n);
    });

    it("fiatRequestCount increments", async () => {
      await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);
      expect(await nur.fiatRequestCount()).to.equal(1n);
    });

    it("getFiatRequest returns correct data", async () => {
      await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);
      const req = await nur.getFiatRequest(0);
      expect(req.requester).to.equal(user1.address);
      expect(req.nurAmount).to.equal(nurAmount);
      expect(req.eurCentsAmount).to.equal(eurCents);
      expect(req.ibanHash).to.equal(ibanHash);
      expect(req.swiftCode).to.equal(swiftCode);
      expect(req.status).to.equal(0n); // PENDING
    });

    it("getUserFiatRequests returns the request ids", async () => {
      await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);
      const ids = await nur.getUserFiatRequests(user1.address);
      expect(ids.length).to.equal(1);
      expect(ids[0]).to.equal(0n);
    });

    it("emits FiatWithdrawalRequested event", async () => {
      await expect(
        nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode)
      ).to.emit(nur, "FiatWithdrawalRequested")
        .withArgs(0n, user1.address, nurAmount, eurCents);
    });

    it("reverts if insufficient NUR balance", async () => {
      await expect(
        nur.connect(user2).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode)
      ).to.be.revertedWith("NUR: insufficient balance");
    });

    it("reverts if zero nurAmount", async () => {
      await expect(
        nur.connect(user1).requestFiatWithdrawal(0, eurCents, ibanHash, swiftCode)
      ).to.be.revertedWith("NUR: zero amount");
    });

    it("reverts if empty ibanHash", async () => {
      await expect(
        nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, "", swiftCode)
      ).to.be.revertedWith("NUR: empty iban hash");
    });

    describe("settleFiatWithdrawal", () => {
      beforeEach(async () => {
        await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);
      });

      it("burns locked NUR on settlement", async () => {
        const totalBefore = await nur.totalSupply();
        await nur.connect(sovereign).settleFiatWithdrawal(0);
        expect(await nur.totalSupply()).to.equal(totalBefore - nurAmount);
      });

      it("contract balance drops to 0 after settle", async () => {
        await nur.connect(sovereign).settleFiatWithdrawal(0);
        expect(await nur.balanceOf(await nur.getAddress())).to.equal(0n);
      });

      it("status becomes SETTLED (3)", async () => {
        await nur.connect(sovereign).settleFiatWithdrawal(0);
        const req = await nur.getFiatRequest(0);
        expect(req.status).to.equal(3n); // SETTLED
      });

      it("emits FiatWithdrawalSettled", async () => {
        await expect(nur.connect(sovereign).settleFiatWithdrawal(0))
          .to.emit(nur, "FiatWithdrawalSettled")
          .withArgs(0n, user1.address, nurAmount);
      });

      it("only owner can settle", async () => {
        await expect(nur.connect(user2).settleFiatWithdrawal(0)).to.be.reverted;
      });

      it("cannot settle twice", async () => {
        await nur.connect(sovereign).settleFiatWithdrawal(0);
        await expect(nur.connect(sovereign).settleFiatWithdrawal(0))
          .to.be.revertedWith("NUR: invalid status");
      });
    });

    describe("rejectFiatWithdrawal", () => {
      beforeEach(async () => {
        await nur.connect(user1).requestFiatWithdrawal(nurAmount, eurCents, ibanHash, swiftCode);
      });

      it("returns NUR to requester on rejection", async () => {
        await nur.connect(sovereign).rejectFiatWithdrawal(0, "KYC failed");
        expect(await nur.balanceOf(user1.address)).to.equal(nurAmount);
      });

      it("status becomes REJECTED (4)", async () => {
        await nur.connect(sovereign).rejectFiatWithdrawal(0, "KYC failed");
        const req = await nur.getFiatRequest(0);
        expect(req.status).to.equal(4n); // REJECTED
      });

      it("emits FiatWithdrawalRejected", async () => {
        await expect(nur.connect(sovereign).rejectFiatWithdrawal(0, "KYC failed"))
          .to.emit(nur, "FiatWithdrawalRejected")
          .withArgs(0n, "KYC failed");
      });

      it("only owner can reject", async () => {
        await expect(nur.connect(user1).rejectFiatWithdrawal(0, "x")).to.be.reverted;
      });

      it("cannot reject a settled request", async () => {
        await nur.connect(sovereign).settleFiatWithdrawal(0);
        await expect(nur.connect(sovereign).rejectFiatWithdrawal(0, "late rejection"))
          .to.be.revertedWith("NUR: invalid status");
      });
    });
  });

  // ─── 5. Treasury mint ─────────────────────────────────────────────────────

  describe("Treasury mint", () => {
    it("reverts if mint would exceed MAX_SUPPLY", async () => {
      // Total supply already equals MAX_SUPPLY after constructor
      await expect(
        nur.connect(sovereign).treasuryMint(user1.address, 1n, "test")
      ).to.be.revertedWith("NUR: exceeds max supply 54751113");
    });

    it("only owner can treasury mint", async () => {
      await expect(
        nur.connect(user1).treasuryMint(user2.address, NUR(1), "test")
      ).to.be.reverted;
    });

    it("emits TreasuryMint when supply allows", async () => {
      // Burn some first to make room
      await nur.connect(sovereign).burn(NUR(100));
      await expect(
        nur.connect(sovereign).treasuryMint(user1.address, NUR(50), "liquidity")
      ).to.emit(nur, "TreasuryMint").withArgs(user1.address, NUR(50), "liquidity");
    });
  });

  // ─── 6. Pause / unpause ───────────────────────────────────────────────────

  describe("Pause", () => {
    it("owner can pause and unpause", async () => {
      await nur.connect(sovereign).pause();
      expect(await nur.paused()).to.be.true;
      await nur.connect(sovereign).unpause();
      expect(await nur.paused()).to.be.false;
    });

    it("transfers revert when paused", async () => {
      await nur.connect(sovereign).pause();
      await expect(
        nur.connect(sovereign).transfer(user1.address, NUR(1))
      ).to.be.reverted;
    });

    it("compute rewards revert when paused", async () => {
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(100));
      await nur.connect(sovereign).pause();

      const deviceId = ethers.keccak256(ethers.toUtf8Bytes("d-pause"));
      await expect(
        nur.connect(distributor).distributeComputeReward(deviceId, user1.address, NUR(1))
      ).to.be.reverted;
    });

    it("fiat withdrawal requests revert when paused", async () => {
      // Give user1 NUR first
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(1000));
      await nur.connect(distributor).distributeComputeReward(
        ethers.keccak256(ethers.toUtf8Bytes("d-u1")), user1.address, NUR(500)
      );
      await nur.connect(sovereign).pause();

      await expect(
        nur.connect(user1).requestFiatWithdrawal(NUR(500), 4925n, "hash", "SWIFT")
      ).to.be.reverted;
    });

    it("only owner can pause/unpause", async () => {
      await expect(nur.connect(user1).pause()).to.be.reverted;
      await expect(nur.connect(user1).unpause()).to.be.reverted;
    });
  });

  // ─── 7. View helpers ──────────────────────────────────────────────────────

  describe("View helpers", () => {
    it("computePoolRemaining returns pool wallet balance", async () => {
      const poolBal = await nur.balanceOf(computePool.address);
      expect(await nur.computePoolRemaining()).to.equal(poolBal);
    });

    it("computePoolRemaining decreases after distribution", async () => {
      await nur.connect(sovereign).grantDistributor(distributor.address);
      await nur.connect(computePool).approve(await nur.getAddress(), NUR(100));
      const before = await nur.computePoolRemaining();
      await nur.connect(distributor).distributeComputeReward(
        ethers.keccak256(ethers.toUtf8Bytes("x")), user1.address, NUR(100)
      );
      expect(await nur.computePoolRemaining()).to.equal(before - NUR(100));
    });
  });
});
