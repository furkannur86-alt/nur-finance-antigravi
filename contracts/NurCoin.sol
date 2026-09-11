// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title NUR Finance Coin ($NUR)
/// @notice Sovereign payment token for the NUR Finance ecosystem
contract NurCoin is ERC20, ERC20Burnable, ERC20Permit, Ownable {

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion NUR

    event TreasuryMint(address indexed to, uint256 amount);

    constructor(address sovereignAdmin)
        ERC20("NUR Finance Coin", "NUR")
        ERC20Permit("NUR Finance Coin")
        Ownable(sovereignAdmin)
    {
        // Mint 100 million NUR to sovereign admin at deploy
        _mint(sovereignAdmin, 100_000_000 * 10 ** 18);
    }

    /// @notice Sovereign admin can mint up to MAX_SUPPLY
    function treasuryMint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "NUR: exceeds max supply");
        _mint(to, amount);
        emit TreasuryMint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
