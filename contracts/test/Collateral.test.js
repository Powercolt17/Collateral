const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Collateral Protocol Smart Contracts", function () {
    let CollateralToken;
    let token;
    let CliffVestingWallet;
    let CollateralStaking;
    let staking;
    let deployer, teamMember, investor, user, multisig;
    const decimals = 18n;
    const ONE_BILLION = 1_000_000_000n * (10n ** decimals);

    beforeEach(async function () {
        [deployer, teamMember, investor, user, multisig] = await ethers.getSigners();

        // 1. Deploy Token
        CollateralToken = await ethers.getContractFactory("CollateralToken");
        token = await CollateralToken.deploy();
        await token.waitForDeployment();

        // 2. Deploy Staking (owned by multisig)
        CollateralStaking = await ethers.getContractFactory("CollateralStaking");
        staking = await CollateralStaking.deploy(await token.getAddress(), await multisig.getAddress());
        await staking.waitForDeployment();

        CliffVestingWallet = await ethers.getContractFactory("CliffVestingWallet");
    });

    describe("CollateralToken ($CLTR)", function () {
        it("should have correct name, symbol and total supply of 1 billion", async function () {
            expect(await token.name()).to.equal("Collateral");
            expect(await token.symbol()).to.equal("CLTR");
            expect(await token.totalSupply()).to.equal(ONE_BILLION);
        });

        it("should mint the entire supply to the deployer on constructor", async function () {
            expect(await token.balanceOf(deployer.address)).to.equal(ONE_BILLION);
        });

        it("should support token burning", async function () {
            const burnAmount = 1000n * (10n ** decimals);
            await token.burn(burnAmount);
            expect(await token.totalSupply()).to.equal(ONE_BILLION - burnAmount);
            expect(await token.balanceOf(deployer.address)).to.equal(ONE_BILLION - burnAmount);
        });

        it("should not have any mint function or allow unauthorized minting", async function () {
            expect(token.mint).to.be.undefined;
        });
    });

    describe("CliffVestingWallet", function () {
        let vestingWallet;
        let startTimestamp;
        const ONE_YEAR = 365n * 24n * 60n * 60n; // 1 year cliff
        const FOUR_YEARS = 4n * 365n * 24n * 60n * 60n; // 4 year vest
        const allocation = 1_000_000n * (10n ** decimals);

        beforeEach(async function () {
            const latestBlock = await ethers.provider.getBlock("latest");
            startTimestamp = latestBlock.timestamp + 10; // start in 10 seconds

            vestingWallet = await CliffVestingWallet.deploy(
                teamMember.address,
                startTimestamp,
                ONE_YEAR,
                FOUR_YEARS
            );
            await vestingWallet.waitForDeployment();

            // Transfer tokens to the vesting wallet
            await token.transfer(await vestingWallet.getAddress(), allocation);
        });

        it("should have correct settings", async function () {
            expect(await vestingWallet.start()).to.equal(startTimestamp);
            expect(await vestingWallet.duration()).to.equal(FOUR_YEARS);
            expect(await vestingWallet.cliff()).to.equal(BigInt(startTimestamp) + ONE_YEAR);
            expect(await vestingWallet.owner()).to.equal(teamMember.address);
        });

        it("should block ownership transfer and renunciation", async function () {
            await expect(vestingWallet.connect(teamMember).transferOwnership(investor.address))
                .to.be.revertedWith("CliffVestingWallet: ownership transfer is disabled");
            await expect(vestingWallet.connect(teamMember).renounceOwnership())
                .to.be.revertedWith("CliffVestingWallet: ownership renunciation is disabled");
        });

        it("should release 0 tokens before the 1-year cliff", async function () {
            await ethers.provider.send("evm_increaseTime", [Number(ONE_YEAR) - 100]);
            await ethers.provider.send("evm_mine");

            expect(await vestingWallet["releasable(address)"](await token.getAddress())).to.equal(0);
            
            await vestingWallet.connect(teamMember)["release(address)"](await token.getAddress());
            expect(await token.balanceOf(teamMember.address)).to.equal(0);
        });

        it("should release the correct linear portion immediately after the 1-year cliff", async function () {
            const latestBlock = await ethers.provider.getBlock("latest");
            const timeToCliff = BigInt(startTimestamp) + ONE_YEAR - BigInt(latestBlock.timestamp);
            await ethers.provider.send("evm_increaseTime", [Number(timeToCliff)]);
            await ethers.provider.send("evm_mine");

            const expectedVested = allocation / 4n;
            expect(await vestingWallet["releasable(address)"](await token.getAddress())).to.be.closeTo(expectedVested, 10n ** decimals);

            await vestingWallet.connect(teamMember)["release(address)"](await token.getAddress());
            expect(await token.balanceOf(teamMember.address)).to.be.closeTo(expectedVested, 10n ** decimals);
        });

        it("should release tokens linearly during years 2-4", async function () {
            const latestBlock = await ethers.provider.getBlock("latest");
            const timeToHalfway = BigInt(startTimestamp) + (FOUR_YEARS / 2n) - BigInt(latestBlock.timestamp);
            await ethers.provider.send("evm_increaseTime", [Number(timeToHalfway)]);
            await ethers.provider.send("evm_mine");

            const expectedVested = allocation / 2n;
            expect(await vestingWallet["releasable(address)"](await token.getAddress())).to.be.closeTo(expectedVested, 10n ** decimals);

            await vestingWallet.connect(teamMember)["release(address)"](await token.getAddress());
            expect(await token.balanceOf(teamMember.address)).to.be.closeTo(expectedVested, 10n ** decimals);
        });

        it("should release 100% of allocation after 4 years", async function () {
            await ethers.provider.send("evm_increaseTime", [Number(FOUR_YEARS) + 1000]);
            await ethers.provider.send("evm_mine");

            expect(await vestingWallet["releasable(address)"](await token.getAddress())).to.equal(allocation);

            await vestingWallet.connect(teamMember)["release(address)"](await token.getAddress());
            expect(await token.balanceOf(teamMember.address)).to.equal(allocation);
        });
    });

    describe("CollateralStaking", function () {
        const stakeAmount = 10000n * (10n ** decimals);
        const lockDuration = 90n * 24n * 60n * 60n; // 90 days

        beforeEach(async function () {
            await token.transfer(user.address, stakeAmount);
            await token.connect(user).approve(await staking.getAddress(), stakeAmount);
        });

        it("should allow a user to stake tokens, mint sCLTR receipt, and track balance", async function () {
            await expect(staking.connect(user).stake(stakeAmount, lockDuration))
                .to.emit(staking, "Staked")
                .withArgs(user.address, stakeAmount, lockDuration);

            expect(await staking.getStakedBalance(user.address)).to.equal(stakeAmount);
            expect(await staking.balanceOf(user.address)).to.equal(stakeAmount);
            expect(await staking.totalStaked()).to.equal(stakeAmount);
            
            const stakeInfo = await staking.stakes(user.address);
            expect(stakeInfo.amount).to.equal(stakeAmount);
            expect(stakeInfo.duration).to.equal(lockDuration);
        });

        it("should support sCLTR voting receipt logic and delegation", async function () {
            await staking.connect(user).stake(stakeAmount, lockDuration);
            
            // Initial votes should be 0 because delegate is not set
            expect(await staking.getVotes(user.address)).to.equal(0);
            
            // Delegate voting power
            await staking.connect(user).delegate(user.address);
            expect(await staking.getVotes(user.address)).to.equal(stakeAmount);
        });

        it("should disallow staking with 0 amount or invalid durations", async function () {
            await expect(staking.connect(user).stake(0, lockDuration))
                .to.be.revertedWith("CollateralStaking: amount must be greater than zero");

            const tooShort = 10n * 24n * 60n * 60n;
            await expect(staking.connect(user).stake(stakeAmount, tooShort))
                .to.be.revertedWith("CollateralStaking: duration below minimum threshold");

            const tooLong = 400n * 24n * 60n * 60n;
            await expect(staking.connect(user).stake(stakeAmount, tooLong))
                .to.be.revertedWith("CollateralStaking: duration exceeds maximum threshold");
        });

        it("should disallow staking if the user already has an active stake", async function () {
            await token.transfer(user.address, stakeAmount);
            await token.connect(user).approve(await staking.getAddress(), stakeAmount * 2n);

            await staking.connect(user).stake(stakeAmount, lockDuration);

            await expect(staking.connect(user).stake(stakeAmount, lockDuration))
                .to.be.revertedWith("CollateralStaking: active stake already exists");
        });

        it("should disallow unstaking before the lock duration has expired", async function () {
            await staking.connect(user).stake(stakeAmount, lockDuration);

            await ethers.provider.send("evm_increaseTime", [89 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(staking.connect(user).unstake())
                .to.be.revertedWith("CollateralStaking: lock duration has not expired yet");
        });

        it("should allow unstaking after the lock duration has expired and burn sCLTR", async function () {
            await staking.connect(user).stake(stakeAmount, lockDuration);

            await ethers.provider.send("evm_increaseTime", [91 * 24 * 60 * 60]);
            await ethers.provider.send("evm_mine");

            await expect(staking.connect(user).unstake())
                .to.emit(staking, "Unstaked")
                .withArgs(user.address, stakeAmount);

            expect(await staking.getStakedBalance(user.address)).to.equal(0);
            expect(await staking.balanceOf(user.address)).to.equal(0);
            expect(await staking.totalStaked()).to.equal(0);
            expect(await token.balanceOf(user.address)).to.equal(stakeAmount);
        });

        it("should allow immediate unstaking if emergency unlock is active", async function () {
            await staking.connect(user).stake(stakeAmount, lockDuration);

            await expect(staking.connect(multisig).triggerEmergencyUnlock())
                .to.emit(staking, "EmergencyUnlockTriggered");

            await expect(staking.connect(user).unstake())
                .to.emit(staking, "Unstaked")
                .withArgs(user.address, stakeAmount);

            expect(await staking.getStakedBalance(user.address)).to.equal(0);
            expect(await staking.totalStaked()).to.equal(0);
        });

        it("should restrict admin parameter controls to the owner (multisig)", async function () {
            await expect(staking.connect(deployer).setMinLockDuration(40 * 24 * 60 * 60))
                .to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");

            await expect(staking.connect(deployer).setStakingEnabled(false))
                .to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");

            await expect(staking.connect(multisig).setMinLockDuration(40 * 24 * 60 * 60))
                .to.emit(staking, "MinLockDurationUpdated");
            
            expect(await staking.minLockDuration()).to.equal(40 * 24 * 60 * 60);
        });

        it("should recover excess CLTR tokens safely", async function () {
            await staking.connect(user).stake(stakeAmount, lockDuration);

            // Send CLTR directly to contract (simulating user mistake)
            const mistakenAmount = 500n * (10n ** decimals);
            await token.transfer(await staking.getAddress(), mistakenAmount);

            // Attempt to rescue more than excess should revert
            await expect(staking.connect(multisig).recoverERC20(await token.getAddress(), mistakenAmount + 1n))
                .to.be.revertedWith("CollateralStaking: cannot withdraw staked token");

            // Successful rescue of exact excess
            const multisigInitialBalance = await token.balanceOf(multisig.address);
            await staking.connect(multisig).recoverERC20(await token.getAddress(), mistakenAmount);
            expect(await token.balanceOf(multisig.address)).to.equal(multisigInitialBalance + mistakenAmount);
        });
    });
});
