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
  const communityRewardsAddr = (process.env.COMMUNITY_REWARDS_ADDR || deployer.address).toLowerCase();
  const treasuryMultisigAddr = (process.env.TREASURY_MULTISIG_ADDR || deployer.address).toLowerCase();
  const liquidityWalletAddr = (process.env.LIQUIDITY_WALLET_ADDR || deployer.address).toLowerCase();
  const verifierIncentivePoolAddr = (process.env.VERIFIER_INCENTIVE_POOL_ADDR || deployer.address).toLowerCase();
  const founderWalletAddr = (process.env.FOUNDER_WALLET_ADDR || deployer.address).toLowerCase();
  const founderVestingAddr = (process.env.FOUNDER_VESTING_ADDR || deployer.address).toLowerCase();

  const decimals = 18n;
  const ONE_MILLION = 1_000_000n * (10n ** decimals);

  // Vesting wallet targets
  const teamMemberAddresses = process.env.TEAM_RECIPIENTS 
    ? process.env.TEAM_RECIPIENTS.split(",").map(a => a.trim().toLowerCase()) 
    : [];
  
  console.log("\nValidating Team Vesting Allocation parameters...");
  if (teamMemberAddresses.length !== 10) {
    throw new Error(`Validation Failed: TEAM_RECIPIENTS must contain exactly 10 addresses. Found ${teamMemberAddresses.length}.`);
  }

  const teamAddressSet = new Set();
  const teamVestingTotal = 150n * ONE_MILLION;
  const expectedTeamShare = 15_000_000n * (10n ** decimals);

  for (let i = 0; i < teamMemberAddresses.length; i++) {
    const addr = teamMemberAddresses[i].trim();
    
    // Check if valid address format
    if (!ethers.isAddress(addr.toLowerCase())) {
      throw new Error(`Validation Failed: Address "${addr}" at index ${i} is not a valid Ethereum address.`);
    }

    // Check if zero address
    if (addr === ethers.ZeroAddress) {
      throw new Error(`Validation Failed: Address at index ${i} cannot be the zero address.`);
    }

    // Check uniqueness
    const normalized = addr.toLowerCase();
    if (teamAddressSet.has(normalized)) {
      throw new Error(`Validation Failed: Duplicate address found: "${addr}".`);
    }
    teamAddressSet.add(normalized);
  }

  // Calculate sum and shares
  const teamShare = teamVestingTotal / BigInt(teamMemberAddresses.length);
  if (teamShare !== expectedTeamShare) {
    throw new Error(`Validation Failed: Team share calculation mismatch. Expected ${ethers.formatUnits(expectedTeamShare, 18)} CLTR per wallet, got ${ethers.formatUnits(teamShare, 18)}.`);
  }

  const calculatedTotalAllocation = teamShare * BigInt(teamMemberAddresses.length);
  if (calculatedTotalAllocation !== teamVestingTotal) {
    throw new Error(`Validation Failed: Total team vesting allocation must equal exactly 150,000,000 CLTR.`);
  }

  console.log("✅ All Team Vesting parameters validated successfully.");

  const strategicAddresses = process.env.STRATEGIC_RECIPIENTS
    ? process.env.STRATEGIC_RECIPIENTS.split(",").map(a => a.trim().toLowerCase())
    : [deployer.address.toLowerCase()];

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

  const communityRewardsAmount = 300n * ONE_MILLION;     // 30%
  const treasuryMultisigAmount = 83n * ONE_MILLION + 400000n * (10n ** decimals); // 8.34%
  const founderDirectAmount = 66n * ONE_MILLION + 600000n * (10n ** decimals);     // 6.66%
  const founderVestingAmount = 50n * ONE_MILLION;        // 5% (vested)
  const liquidityWalletAmount = 150n * ONE_MILLION;      // 15%
  const strategicVestingTotal = 100n * ONE_MILLION;      // 10%
  const verifierIncentivePoolAmount = 100n * ONE_MILLION;  // 10%

  console.log("\nDistributing allocations...");

  // Transfer Community Rewards
  if (communityRewardsAddr !== deployer.address) {
    await token.transfer(communityRewardsAddr, communityRewardsAmount);
    console.log(`- Transferred 30% Community Rewards (${ethers.formatUnits(communityRewardsAmount, 18)} CLTR) to: ${communityRewardsAddr}`);
  }

  // Transfer Treasury Multisig
  if (treasuryMultisigAddr !== deployer.address) {
    await token.transfer(treasuryMultisigAddr, treasuryMultisigAmount);
    console.log(`- Transferred 13.34% Treasury Multisig (${ethers.formatUnits(treasuryMultisigAmount, 18)} CLTR) to: ${treasuryMultisigAddr}`);
  }

  // Transfer Founder Direct Allocation
  if (founderWalletAddr !== deployer.address) {
    await token.transfer(founderWalletAddr, founderDirectAmount);
    console.log(`- Transferred 6.66% Founder Direct Allocation (${ethers.formatUnits(founderDirectAmount, 18)} CLTR) to: ${founderWalletAddr}`);
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

  const CliffVestingWallet = await ethers.getContractFactory("CliffVestingWallet");

  console.log("\nDeploying Team Vesting Wallets (1-year cliff, 4-year linear)...");
  for (let i = 0; i < teamMemberAddresses.length; i++) {
    const beneficiary = teamMemberAddresses[i];
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

  console.log("\nDeploying Founder Vesting Wallet (1-year cliff, 4-year linear)...");
  const founderVestingWallet = await CliffVestingWallet.deploy(
    founderVestingAddr,
    startTimestamp,
    ONE_YEAR,
    FOUR_YEARS
  );
  await founderVestingWallet.waitForDeployment();
  const founderVestingWalletAddress = await founderVestingWallet.getAddress();
  console.log(`- Founder Vesting Wallet deployed at: ${founderVestingWalletAddress} for beneficiary: ${founderVestingAddr}`);
  await token.transfer(founderVestingWalletAddress, founderVestingAmount);
  console.log(`  Allocated ${ethers.formatUnits(founderVestingAmount, 18)} CLTR to this wallet`);

  console.log("\nDeploying Strategic Vesting Wallets (custom parameters)...");
  const strategicShare = strategicVestingTotal / BigInt(strategicAddresses.length);
  for (let i = 0; i < strategicAddresses.length; i++) {
    const beneficiary = strategicAddresses[i];
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
