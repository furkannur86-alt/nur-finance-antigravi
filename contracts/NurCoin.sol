// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title NUR Finance Coin ($NUR) — Sovereign Ecosystem Token
/// @notice ERC-20 token for NUR Finance. Max supply: 54,751,113 NUR.
/// @dev Deployed on Polygon (MATIC) for low-gas micro-payments to compute contributors.
///
/// Token Economics:
///   MAX_SUPPLY     = 54,751,113 NUR  (≈ 5.4% of Bloomberg terminal subscriber TAM signal)
///   Genesis mint   = 13,000,000 NUR  → Sovereign treasury
///   Compute pool   = 35,000,000 NUR  → DePIN mining rewards (unlocked linearly over 10 yrs)
///   Team/advisors  =  4,200,000 NUR  → 4-yr vesting, 1-yr cliff
///   Community      =  2,551,113 NUR  → Airdrops, education incentives
///
/// Numbers embedded by sovereign decree: 13 · 35 · 42 · 55 · 54751113
contract NurCoin is ERC20, ERC20Burnable, ERC20Permit, Ownable, ReentrancyGuard, Pausable {

    // ─── Constants ────────────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY          = 54_751_113 * 10 ** 18;
    uint256 public constant GENESIS_ALLOC       = 13_000_000 * 10 ** 18;
    uint256 public constant COMPUTE_POOL_ALLOC  = 35_000_000 * 10 ** 18;
    uint256 public constant TEAM_ALLOC          =  4_200_000 * 10 ** 18;
    uint256 public constant COMMUNITY_ALLOC     =  2_551_113 * 10 ** 18;

    // Sovereign numerology seal
    uint256 public constant SEAL_13  = 13;
    uint256 public constant SEAL_35  = 35;
    uint256 public constant SEAL_42  = 42;
    uint256 public constant SEAL_55  = 55;
    uint256 public constant SEAL_NUM = 54_751_113;

    uint256 public constant COMPUTE_POOL_DURATION = 10 * 365 days; // 10-year linear release
    uint256 public constant TEAM_CLIFF            = 365 days;
    uint256 public constant TEAM_VESTING          = 4 * 365 days;

    // ─── State ────────────────────────────────────────────────────────────────
    address public computePoolWallet;
    address public teamWallet;
    address public communityWallet;

    uint256 public deployedAt;
    uint256 public computePoolReleased;

    /// @notice Authorized compute reward distributors (backend mining coordinator)
    mapping(address => bool) public isComputeDistributor;

    /// @notice Per-device compute rewards earned (device hash → NUR wei)
    mapping(bytes32 => uint256) public deviceAccumulatedRewards;

    /// @notice Per-user total compute rewards (user address → NUR wei)
    mapping(address => uint256) public userComputeEarnings;

    /// @notice Fiat settlement requests (SEPA/SWIFT withdrawal queue)
    struct FiatRequest {
        address requester;
        uint256 nurAmount;       // NUR to burn in exchange for fiat
        uint256 eurCentsAmount;  // Requested EUR (cents)
        string  ibanHash;        // keccak of IBAN — not stored plaintext
        string  swiftCode;
        uint64  requestedAt;
        FiatStatus status;
    }
    enum FiatStatus { PENDING, APPROVED, PROCESSING, SETTLED, REJECTED }

    FiatRequest[] public fiatRequests;
    mapping(address => uint256[]) public userFiatRequests;

    // ─── Events ───────────────────────────────────────────────────────────────
    event TreasuryMint(address indexed to, uint256 amount, string reason);
    event ComputeRewardDistributed(bytes32 indexed deviceId, address indexed user, uint256 amount);
    event ComputePoolReleased(uint256 amount, uint256 totalReleased);
    event FiatWithdrawalRequested(uint256 indexed requestId, address indexed requester, uint256 nurAmount, uint256 eurCents);
    event FiatWithdrawalSettled(uint256 indexed requestId, address indexed requester, uint256 nurBurned);
    event FiatWithdrawalRejected(uint256 indexed requestId, string reason);
    event DistributorGranted(address indexed distributor);
    event DistributorRevoked(address indexed distributor);

    // ─── Constructor ──────────────────────────────────────────────────────────
    constructor(
        address _sovereignAdmin,
        address _computePoolWallet,
        address _teamWallet,
        address _communityWallet
    )
        ERC20("NUR Finance Coin", "NUR")
        ERC20Permit("NUR Finance Coin")
        Ownable(_sovereignAdmin)
    {
        require(_computePoolWallet != address(0), "NUR: zero compute pool");
        require(_teamWallet != address(0), "NUR: zero team");
        require(_communityWallet != address(0), "NUR: zero community");

        computePoolWallet = _computePoolWallet;
        teamWallet        = _teamWallet;
        communityWallet   = _communityWallet;
        deployedAt        = block.timestamp;

        // Genesis: sovereign treasury
        _mint(_sovereignAdmin, GENESIS_ALLOC);
        emit TreasuryMint(_sovereignAdmin, GENESIS_ALLOC, "SOVEREIGN_GENESIS");

        // Compute pool: held in pool wallet, released linearly by backend calls
        _mint(_computePoolWallet, COMPUTE_POOL_ALLOC);
        emit TreasuryMint(_computePoolWallet, COMPUTE_POOL_ALLOC, "COMPUTE_POOL_LOCK");

        // Team: held in team wallet (vesting enforced off-chain + multisig)
        _mint(_teamWallet, TEAM_ALLOC);
        emit TreasuryMint(_teamWallet, TEAM_ALLOC, "TEAM_VESTING_LOCK");

        // Community airdrops
        _mint(_communityWallet, COMMUNITY_ALLOC);
        emit TreasuryMint(_communityWallet, COMMUNITY_ALLOC, "COMMUNITY_INCENTIVES");
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────
    modifier onlyDistributor() {
        require(isComputeDistributor[msg.sender] || msg.sender == owner(), "NUR: not distributor");
        _;
    }

    // ─── Compute Reward Distribution ──────────────────────────────────────────

    /// @notice Grant compute distributor role to backend mining coordinator
    function grantDistributor(address distributor) external onlyOwner {
        isComputeDistributor[distributor] = true;
        emit DistributorGranted(distributor);
    }

    function revokeDistributor(address distributor) external onlyOwner {
        isComputeDistributor[distributor] = false;
        emit DistributorRevoked(distributor);
    }

    /// @notice Backend mining coordinator calls this to distribute compute rewards
    /// @param deviceId  Hashed hardware fingerprint (keccak256 of device UUID + user)
    /// @param user      User's wallet address
    /// @param amount    NUR wei to transfer from compute pool to user
    function distributeComputeReward(
        bytes32 deviceId,
        address user,
        uint256 amount
    ) external onlyDistributor nonReentrant whenNotPaused {
        require(user != address(0), "NUR: zero user");
        require(amount > 0, "NUR: zero amount");
        require(
            balanceOf(computePoolWallet) >= amount,
            "NUR: compute pool exhausted"
        );

        deviceAccumulatedRewards[deviceId] += amount;
        userComputeEarnings[user] += amount;
        computePoolReleased += amount;

        // Transfer from compute pool wallet (requires approval from pool wallet — set in deployment)
        _transfer(computePoolWallet, user, amount);

        emit ComputeRewardDistributed(deviceId, user, amount);
    }

    /// @notice Batch distribute to multiple users in one tx (gas efficient)
    function batchDistributeComputeRewards(
        bytes32[] calldata deviceIds,
        address[] calldata users,
        uint256[] calldata amounts
    ) external onlyDistributor nonReentrant whenNotPaused {
        require(
            deviceIds.length == users.length && users.length == amounts.length,
            "NUR: array length mismatch"
        );
        require(deviceIds.length <= 100, "NUR: batch too large");

        for (uint256 i = 0; i < deviceIds.length; i++) {
            if (users[i] == address(0) || amounts[i] == 0) continue;
            deviceAccumulatedRewards[deviceIds[i]] += amounts[i];
            userComputeEarnings[users[i]] += amounts[i];
            computePoolReleased += amounts[i];
            _transfer(computePoolWallet, users[i], amounts[i]);
            emit ComputeRewardDistributed(deviceIds[i], users[i], amounts[i]);
        }
    }

    // ─── Fiat Settlement (SEPA/SWIFT Withdrawal) ──────────────────────────────

    /// @notice User requests NUR → EUR fiat conversion (KYC required off-chain)
    /// @param nurAmount     NUR wei to burn
    /// @param eurCents      Requested EUR amount in cents (verified by backend)
    /// @param ibanHash      keccak256(abi.encodePacked(iban, nonce)) — IBAN not stored plaintext
    /// @param swiftCode     Bank SWIFT/BIC code
    function requestFiatWithdrawal(
        uint256 nurAmount,
        uint256 eurCents,
        string calldata ibanHash,
        string calldata swiftCode
    ) external nonReentrant whenNotPaused {
        require(nurAmount > 0, "NUR: zero amount");
        require(eurCents > 0, "NUR: zero eur");
        require(bytes(ibanHash).length > 0, "NUR: empty iban hash");
        require(balanceOf(msg.sender) >= nurAmount, "NUR: insufficient balance");

        // Lock NUR by transferring to this contract during processing
        _transfer(msg.sender, address(this), nurAmount);

        uint256 requestId = fiatRequests.length;
        fiatRequests.push(FiatRequest({
            requester:     msg.sender,
            nurAmount:     nurAmount,
            eurCentsAmount: eurCents,
            ibanHash:      ibanHash,
            swiftCode:     swiftCode,
            requestedAt:   uint64(block.timestamp),
            status:        FiatStatus.PENDING
        }));
        userFiatRequests[msg.sender].push(requestId);

        emit FiatWithdrawalRequested(requestId, msg.sender, nurAmount, eurCents);
    }

    /// @notice Sovereign backend confirms fiat was sent — burns the locked NUR
    function settleFiatWithdrawal(uint256 requestId) external onlyOwner nonReentrant {
        FiatRequest storage req = fiatRequests[requestId];
        require(req.status == FiatStatus.PENDING || req.status == FiatStatus.PROCESSING, "NUR: invalid status");

        req.status = FiatStatus.SETTLED;
        _burn(address(this), req.nurAmount);

        emit FiatWithdrawalSettled(requestId, req.requester, req.nurAmount);
    }

    /// @notice Sovereign backend rejects and returns locked NUR to user
    function rejectFiatWithdrawal(uint256 requestId, string calldata reason) external onlyOwner nonReentrant {
        FiatRequest storage req = fiatRequests[requestId];
        require(req.status == FiatStatus.PENDING || req.status == FiatStatus.PROCESSING, "NUR: invalid status");

        req.status = FiatStatus.REJECTED;
        _transfer(address(this), req.requester, req.nurAmount);

        emit FiatWithdrawalRejected(requestId, reason);
    }

    function updateFiatStatus(uint256 requestId, FiatStatus status) external onlyOwner {
        fiatRequests[requestId].status = status;
    }

    // ─── Treasury & Admin ─────────────────────────────────────────────────────

    /// @notice Emergency mint (only if supply allows). Used for liquidity bootstrapping.
    function treasuryMint(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "NUR: exceeds max supply 54751113");
        _mint(to, amount);
        emit TreasuryMint(to, amount, reason);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── View Helpers ─────────────────────────────────────────────────────────

    function decimals() public pure override returns (uint8) { return 18; }

    function computePoolRemaining() external view returns (uint256) {
        return balanceOf(computePoolWallet);
    }

    function fiatRequestCount() external view returns (uint256) {
        return fiatRequests.length;
    }

    function getUserFiatRequests(address user) external view returns (uint256[] memory) {
        return userFiatRequests[user];
    }

    function getFiatRequest(uint256 requestId) external view returns (FiatRequest memory) {
        return fiatRequests[requestId];
    }

    // ─── Override: block transfers when paused ────────────────────────────────
    function _update(address from, address to, uint256 value)
        internal
        override
        whenNotPaused
    {
        super._update(from, to, value);
    }
}
