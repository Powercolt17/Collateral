const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("====================================================");
  console.log("Starting $CLTR Protocol Deployment...");
  console.log("Deployer Address:", deployer.address);
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Native Balance:", ethers.formatEther(deployerBalance), "ETH");
  console.log("====================================================");

  // 1. Configure Target Addresses (using Env vars or Signer fallbacks)
  const communityRewardsAddr = process.env.COMMUNITY_REWARDS_ADDR || deployer.address;
  const treasuryMultisigAddr = process.env.TREASURY_MULTISIG_ADDR || deployer.address;
  const liquidityWalletAddr = process.env.LIQUIDITY_WALLET_ADDR || deployer.address;
  const verifierIncentivePoolAddr = process.env.VERIFIER_INCENTIVE_POOL_ADDR || deployer.address;

  // Vesting wallet targets
  const teamMemberAddresses = process.env.TEAM_RECIPIENTS 
    ? process.env.TEAM_RECIPIENTS.split(",") 
    : [deployer.address]; // Default fallback to deployer
  
  const strategicAddresses = process.env.STRATEGIC_RECIPIENTS
    ? process.env.STRATEGIC_RECIPIENTS.split(",")
    : [deployer.address]; // Default fallback to deployer

  // 2. Deploy $CLTR Token
  const CollateralToken = await ethers.getContractFactory("CollateralToken");
  const token = await CollateralToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ $CLTR Token deployed to:", tokenAddress);

  // 3. Deploy CollateralStaking (initially owned by deployer, then transferred to Multisig)
  const CollateralStaking = await ethers.getContractFactory("CollateralStaking");
  const staking = await CollateralStaking.deploy(tokenAddress, deployer.address);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ CollateralStaking deployed to:", stakingAddress);

  // 4. Distribute Supply according to Allocation requirements (Total 1 Billion)
  const decimals = 18n;
  const ONE_MILLION = 1_000_000n * (10n ** decimals);

  const communityRewardsAmount = 300n * ONE_MILLION;    // 30%
  const treasuryMultisigAmount = 200n * ONE_MILLION;    // 20%
  const liquidityWalletAmount = 150n * ONE_MILLION;     // 15%
  const teamVestingTotal = 150n * ONE_MILLION;          // 15%
  const strategicVestingTotal = 100n * ONE_MILLION;     // 10%
  const verifierIncentivePoolAmount = 100n * ONE_MILLION; // 10%

  console.log("\nDistributing allocations...");

  // Transfer Community Rewards
  if (communityRewardsAddr !== deployer.address) {
    await token.transfer(communityRewardsAddr, communityRewardsAmount);
    console.log(`- Transferred 30% Community Rewards (${ethers.formatUnits(communityRewardsAmount, 18)} CLTR) to: ${communityRewardsAddr}`);
  }

  // Transfer Treasury Multisig
  if (treasuryMultisigAddr !== deployer.address) {
    await token.transfer(treasuryMultisigAddr, treasuryMultisigAmount);
    console.log(`- Transferred 20% Treasury Multisig (${ethers.formatUnits(treasuryMultisigAmount, 18)} CLTR) to: ${treasuryMultisigAddr}`);
  }

  // Transfer Liquidity Wallet
  if (liquidityWalletAddr !== deployer.address) {
    await token.transfer(liquidityWalletAddr, liquidityWalletAmount);
    console.log(`- Transferred 15% Liquidity Allocation (${ethers.formatUnits(liquidityWalletAmount, 18)} CLTR) to: ${liquidityWalletAddr}`);
  }

  // Transfer Verifier Pool
  if (verifierIncentivePoolAddr !== deployer.address) {
    await token.transfer(verifierIncentivePoolAddr, verifierIncentivePoolAmount);
    console.log(`- Transferred 10% Verifier Incentive Pool (${ethers.formatUnits(verifierIncentivePoolAmount, 18)} CLTR) to: ${verifierIncentivePoolAddr}`);
  }

  // 5. Deploy Vesting Contracts and distribute
  const latestBlock = await ethers.provider.getBlock("latest");
  const startTimestamp = latestBlock.timestamp + 60; // vest starts in 1 minute
  const ONE_YEAR = 365n * 24n * 60n * 60n;
  const FOUR_YEARS = 4n * ONE_YEAR;

  console.log("\nDeploying Team Vesting Wallets (1-year cliff, 4-year linear)...");
  const teamShare = teamVestingTotal / BigInt(teamMemberAddresses.length);
  for (let i = 0; i < teamMemberAddresses.length; i++) {
    const beneficiary = teamMemberAddresses[i];
    const CliffVestingWallet = await ethers.getContractFactory("CliffVestingWallet");
    const wallet = await CliffVestingWallet.deploy(
      beneficiary,
      startTimestamp,
      ONE_YEAR,
      FOUR_YEARS
    );
    await wallet.waitForDeployment();
    const walletAddress = await wallet.getAddress();
    console.log(`- Team Vesting Wallet [${i + 1}/${teamMemberAddresses.length}] deployed at: ${walletAddress} for beneficiary: ${beneficiary}`);
    
    await token.transfer(walletAddress, teamShare);
    console.log(`  Allocated ${ethers.formatUnits(teamShare, 18)} CLTR to this wallet`);
  }

  console.log("\nDeploying Strategic Vesting Wallets (custom parameters)...");
  const strategicShare = strategicVestingTotal / BigInt(strategicAddresses.length);
  for (let i = 0; i < strategicAddresses.length; i++) {
    const beneficiary = strategicAddresses[i];
    const CliffVestingWallet = await ethers.getContractFactory("CliffVestingWallet");
    // Configurable parameters via environment variables or matching defaults
    const start = process.env.STRATEGIC_VESTING_START ? BigInt(process.env.STRATEGIC_VESTING_START) : startTimestamp;
    const cliff = process.env.STRATEGIC_VESTING_CLIFF ? BigInt(process.env.STRATEGIC_VESTING_CLIFF) : ONE_YEAR;
    const duration = process.env.STRATEGIC_VESTING_DURATION ? BigInt(process.env.STRATEGIC_VESTING_DURATION) : FOUR_YEARS;

    const wallet = await CliffVestingWallet.deploy(
      beneficiary,
      start,
      cliff,
      duration
    );
    await wallet.waitForDeployment();
    const walletAddress = await wallet.getAddress();
    console.log(`- Strategic Vesting Wallet [${i + 1}/${strategicAddresses.length}] deployed at: ${walletAddress} for beneficiary: ${beneficiary}`);

    await token.transfer(walletAddress, strategicShare);
    console.log(`  Allocated ${ethers.formatUnits(strategicShare, 18)} CLTR to this wallet`);
  }

  // 6. Transfer Ownership of CollateralStaking to the Multisig owner
  console.log("\nConfiguring Ownerships...");
  if (treasuryMultisigAddr !== deployer.address) {
    console.log(`- Transferring CollateralStaking ownership to treasury multisig at: ${treasuryMultisigAddr}...`);
    const tx = await staking.transferOwnership(treasuryMultisigAddr);
    await tx.wait();
    console.log("✅ Ownership transferred successfully.");
  } else {
    console.log("⚠️ Staking ownership remains with the deployer (no TREASURY_MULTISIG_ADDR environment variable set).");
  }

  console.log("\n====================================================");
  console.log("Deployment Complete!");
  console.log("Summary of Deployed Contracts:");
  console.log("- Token Address:", tokenAddress);
  console.log("- Staking Address:", stakingAddress);
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
