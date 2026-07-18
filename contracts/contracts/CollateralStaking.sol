// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title CollateralStaking
 * @notice Allows users to lock $CLTR tokens for a chosen lockup duration.
 * @dev Staking admin parameters are owned by a Multisig (Ownable owner).
 * The staking contract itself behaves as an ERC20Votes token (sCLTR) representing staked balance.
 * Emits events on staking operations and provides read methods for frontend integration.
 */
contract CollateralStaking is ERC20, ERC20Permit, ERC20Votes, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct StakeInfo {
        uint256 amount;
        uint64 startTime;
        uint64 duration;
    }

    /// @notice The $CLTR token contract.
    IERC20 public immutable cltrToken;

    /// @notice Tracks the stake details of each staker.
    mapping(address => StakeInfo) public stakes;

    /// @notice Total amount of CLTR currently locked in active stakes.
    uint256 public totalStaked;

    /// @notice Minimum duration for a lockup stake (default 30 days).
    uint64 public minLockDuration = 30 days;

    /// @notice Maximum duration for a lockup stake (default 365 days).
    uint64 public maxLockDuration = 365 days;

    /// @notice Control flag to enable or pause new stakes.
    bool public stakingEnabled = true;

    /// @notice Emergency bypass flag to allow immediate unstaking of all locked balances.
    bool public emergencyUnlockActive = false;

    // Events
    event Staked(address indexed user, uint256 amount, uint64 duration);
    event Unstaked(address indexed user, uint256 amount);
    event MinLockDurationUpdated(uint64 oldDuration, uint64 newDuration);
    event MaxLockDurationUpdated(uint64 oldDuration, uint64 newDuration);
    event StakingEnabledStatusChanged(bool enabled);
    event EmergencyUnlockTriggered();

    /**
     * @notice Constructor sets the token address and transfers initial ownership to the deploying wallet
     * which then transfers it to the multisig.
     * @param tokenAddress The address of the $CLTR token contract.
     * @param initialOwner The address of the initial owner (Multisig).
     */
    constructor(address tokenAddress, address initialOwner) 
        ERC20("Staked Collateral", "sCLTR")
        ERC20Permit("Staked Collateral")
        Ownable(initialOwner) 
    {
        require(tokenAddress != address(0), "CollateralStaking: token address cannot be zero");
        require(initialOwner != address(0), "CollateralStaking: owner address cannot be zero");
        cltrToken = IERC20(tokenAddress);
    }

    /**
     * @notice Lock up a specified amount of $CLTR for a chosen duration.
     * @param amount The number of tokens (in wei) to lock.
     * @param duration The lock duration in seconds.
     */
    function stake(uint256 amount, uint64 duration) external nonReentrant {
        require(stakingEnabled, "CollateralStaking: staking is currently paused");
        require(amount > 0, "CollateralStaking: amount must be greater than zero");
        require(stakes[msg.sender].amount == 0, "CollateralStaking: active stake already exists");
        require(duration >= minLockDuration, "CollateralStaking: duration below minimum threshold");
        require(duration <= maxLockDuration, "CollateralStaking: duration exceeds maximum threshold");

        // Safe transfer of tokens from user to staking contract
        cltrToken.safeTransferFrom(msg.sender, address(this), amount);

        // Record stake details
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: uint64(block.timestamp),
            duration: duration
        });

        totalStaked += amount;

        // Mint sCLTR voting receipt to user
        _mint(msg.sender, amount);

        emit Staked(msg.sender, amount, duration);
    }

    /**
     * @notice Withdraw locked tokens. Allowed only after lock duration has expired or in emergency unlock mode.
     */
    function unstake() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "CollateralStaking: no active stake to withdraw");

        // Check if lock duration has expired, unless emergency unlock has been triggered
        if (!emergencyUnlockActive) {
            require(
                block.timestamp >= userStake.startTime + userStake.duration,
                "CollateralStaking: lock duration has not expired yet"
            );
        }

        uint256 amountToWithdraw = userStake.amount;

        // Clear user stake state before transferring to prevent reentrancy
        delete stakes[msg.sender];

        totalStaked -= amountToWithdraw;

        // Burn sCLTR voting receipt
        _burn(msg.sender, amountToWithdraw);

        cltrToken.safeTransfer(msg.sender, amountToWithdraw);

        emit Unstaked(msg.sender, amountToWithdraw);
    }

    /**
     * @notice View function to retrieve the staked balance of an address.
     * @param user The address to query.
     * @return The amount of tokens staked.
     */
    function getStakedBalance(address user) external view returns (uint256) {
        return stakes[user].amount;
    }

    // Owner / Multisig Administration Functions

    /**
     * @notice Updates the minimum lockup duration parameter.
     */
    function setMinLockDuration(uint64 duration) external onlyOwner {
        require(duration <= maxLockDuration, "CollateralStaking: min lock must be <= max lock");
        emit MinLockDurationUpdated(minLockDuration, duration);
        minLockDuration = duration;
    }

    /**
     * @notice Updates the maximum lockup duration parameter.
     */
    function setMaxLockDuration(uint64 duration) external onlyOwner {
        require(duration >= minLockDuration, "CollateralStaking: max lock must be >= min lock");
        emit MaxLockDurationUpdated(maxLockDuration, duration);
        maxLockDuration = duration;
    }

    /**
     * @notice Toggles staking availability for new stakers.
     */
    function setStakingEnabled(bool enabled) external onlyOwner {
        stakingEnabled = enabled;
        emit StakingEnabledStatusChanged(enabled);
    }

    /**
     * @notice Permanently activates emergency unlock mode allowing immediate withdrawal of all staked balances.
     * This is a one-way trigger that cannot be reversed.
     */
    function triggerEmergencyUnlock() external onlyOwner {
        require(!emergencyUnlockActive, "CollateralStaking: emergency unlock already active");
        emergencyUnlockActive = true;
        emit EmergencyUnlockTriggered();
    }

    /**
     * @notice Recovers accidental ERC20 transfers to this contract. Staked $CLTR cannot be withdrawn.
     */
    function recoverERC20(address tokenAddress, uint256 tokenAmount) external onlyOwner {
        if (tokenAddress == address(cltrToken)) {
            uint256 balance = cltrToken.balanceOf(address(this));
            uint256 excess = balance >= totalStaked ? balance - totalStaked : 0;
            require(tokenAmount <= excess, "CollateralStaking: cannot withdraw staked token");
        }
        IERC20(tokenAddress).safeTransfer(owner(), tokenAmount);
    }

    // Required overrides for Solidity compilation compatibility between ERC20, ERC20Permit, and ERC20Votes

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
