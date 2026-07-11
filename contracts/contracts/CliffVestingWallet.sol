// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

/**
 * @title CliffVestingWallet
 * @notice Extends OpenZeppelin's standard VestingWallet to implement a cliff period.
 * @dev Releasable amount remains 0 until the cliff timestamp is met, after which
 * it follows the standard linear vesting schedule starting from the start time.
 */
contract CliffVestingWallet is VestingWallet {
    uint64 private immutable _cliff;

    /**
     * @notice Constructor to initialize beneficiary, start time, cliff, and total vesting duration.
     * @param beneficiary The address of the beneficiary who can claim the vested assets.
     * @param startTimestamp The Unix timestamp when the vesting schedule starts.
     * @param cliffSeconds The number of seconds the cliff lasts (from the start timestamp).
     * @param durationSeconds The total number of seconds the vesting lasts (from the start timestamp).
     */
    constructor(
        address beneficiary,
        uint64 startTimestamp,
        uint64 cliffSeconds,
        uint64 durationSeconds
    ) VestingWallet(beneficiary, startTimestamp, durationSeconds) {
        require(cliffSeconds <= durationSeconds, "CliffVestingWallet: cliff must be less than or equal to duration");
        _cliff = startTimestamp + cliffSeconds;
    }

    /**
     * @notice Returns the timestamp when the cliff period ends.
     */
    function cliff() public view virtual returns (uint256) {
        return _cliff;
    }

    /**
     * @dev Calculates the vested amount as a function of time.
     * Returns 0 if block timestamp is before the cliff.
     * Returns total allocation if timestamp is past the end of the vesting duration.
     * Otherwise, calculates the linear release between the start time and end time.
     */
    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp) internal view virtual override returns (uint256) {
        if (timestamp < _cliff) {
            return 0;
        } else if (timestamp >= end()) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - uint64(start()))) / uint64(duration());
        }
    }
}
