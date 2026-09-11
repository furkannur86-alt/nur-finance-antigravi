// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NurCoin (NUR) - Sovereign Ecosystem Token
 * @author NUR Finance & Umay Gül Nur Systems
 * @notice Standard ERC-20 Token with Minting, Burning, Staking Rewards & Sovereign Governance Controls.
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract NurCoin is IERC20 {
    string public constant name = "NUR Coin";
    string public constant symbol = "NUR";
    uint8 public constant decimals = 18;

    uint256 private _totalSupply;
    address public sovereignAdmin;
    address public treasuryVault;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // Staking & Yield Rewards tracking
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakeTimestamp;

    event SovereignTransferred(address indexed previousAdmin, address indexed newAdmin);
    event TreasuryVaultUpdated(address indexed previousVault, address indexed newVault);
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event TokensBurned(address indexed burner, uint256 amount);

    modifier onlySovereign() {
        require(msg.sender == sovereignAdmin, "NUR: Caller is not Sovereign Admin");
        _;
    }

    constructor(address initialTreasury) {
        require(initialTreasury != address(0), "NUR: Invalid Treasury Address");
        sovereignAdmin = msg.sender;
        treasuryVault = initialTreasury;

        // 1,000,000,000 NUR Total Supply Initial Mint (1 Billion NUR)
        uint256 initialSupply = 1_000_000_000 * 10**uint256(decimals);
        _mint(treasuryVault, initialSupply);
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "NUR: Transfer amount exceeds allowance");
        _approve(sender, msg.sender, currentAllowance - amount);
        _transfer(sender, recipient, amount);
        return true;
    }

    // --- SOVEREIGN GOVERNANCE & TREASURY ---

    function setSovereignAdmin(address newAdmin) external onlySovereign {
        require(newAdmin != address(0), "NUR: Invalid Admin Address");
        emit SovereignTransferred(sovereignAdmin, newAdmin);
        sovereignAdmin = newAdmin;
    }

    function setTreasuryVault(address newVault) external onlySovereign {
        require(newVault != address(0), "NUR: Invalid Vault Address");
        emit TreasuryVaultUpdated(treasuryVault, newVault);
        treasuryVault = newVault;
    }

    function mintSovereignReserve(address to, uint256 amount) external onlySovereign {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // --- STAKING & COMPUTE REWARDS SYSTEM ---

    function stake(uint256 amount) external {
        require(amount > 0, "NUR: Cannot stake 0");
        require(_balances[msg.sender] >= amount, "NUR: Insufficient balance to stake");

        // Claim pending rewards if already staking
        if (stakedBalance[msg.sender] > 0) {
            uint256 pendingReward = calculateReward(msg.sender);
            if (pendingReward > 0) {
                _mint(msg.sender, pendingReward);
            }
        }

        _transfer(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        stakeTimestamp[msg.sender] = block.timestamp;

        emit TokensStaked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "NUR: Cannot unstake 0");
        require(stakedBalance[msg.sender] >= amount, "NUR: Exceeds staked balance");

        uint256 reward = calculateReward(msg.sender);
        stakedBalance[msg.sender] -= amount;
        stakeTimestamp[msg.sender] = block.timestamp;

        _transfer(address(this), msg.sender, amount);
        if (reward > 0) {
            _mint(msg.sender, reward);
        }

        emit TokensUnstaked(msg.sender, amount, reward);
    }

    function calculateReward(address account) public view returns (uint256) {
        if (stakedBalance[account] == 0) return 0;
        uint256 duration = block.timestamp - stakeTimestamp[account];
        // 12.5% APY Staking Yield calculation per second
        uint256 annualRatePercent = 125; // 12.5%
        uint256 reward = (stakedBalance[account] * duration * annualRatePercent) / (365 days * 1000);
        return reward;
    }

    // --- INTERNAL HELPERS ---

    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "NUR: Transfer from zero address");
        require(recipient != address(0), "NUR: Transfer to zero address");
        require(_balances[sender] >= amount, "NUR: Transfer amount exceeds balance");

        _balances[sender] -= amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "NUR: Mint to zero address");
        _totalSupply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal {
        require(account != address(0), "NUR: Burn from zero address");
        require(_balances[account] >= amount, "NUR: Burn amount exceeds balance");

        _balances[account] -= amount;
        _totalSupply -= amount;
        emit TokensBurned(account, amount);
        emit Transfer(account, address(0), amount);
    }
}
