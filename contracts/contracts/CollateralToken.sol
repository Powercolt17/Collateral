// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title CollateralToken
 * @notice The $CLTR (Collateral) ERC-20 token contract.
 * @dev Implements standard ERC-20, burnable, permit, and voting extensions.
 * Fixed supply of 1,000,000,000 minted once on deployment. No mint/pause/blacklist.
 */
contract CollateralToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {
    
    /**
     * @notice Constructor minting the entire 1,000,000,000 token supply to the deployer.
     */
    constructor() 
        ERC20("Collateral", "CLTR") 
        ERC20Permit("Collateral") 
    {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }

    // Required overrides for Solidity compilation compatibility between ERC20, ERC20Permit, and ERC20Votes

    /**
     * @dev Overrides standard update mechanism to update voting power balance trackers.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    /**
     * @dev Returns the current nonce for a signature permit calculation.
     */
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
