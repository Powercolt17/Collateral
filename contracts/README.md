# $CLTR Smart Contracts

This project contains the Solidity smart contracts, test suite, and deployment scripts for the `$CLTR` (Collateral) utility token ecosystem on the Robinhood Chain.

## Contract Architecture

1. **`CollateralToken.sol`**: A standard fixed-supply ERC-20 utility token with burn and voting extensions.
2. **`CliffVestingWallet.sol`**: An ownable vesting wallet enforcing a 1-year cliff before linear vesting over a 4-year period. Used for Team, Founder, and Strategic allocations.
3. **`CollateralStaking.sol`**: A commitment staking contract allowing users to lock their `$CLTR` for selected durations (e.g. 30 to 365 days). Owned by a Multisig.

---

## Token Distribution & Allocations

The fixed supply of 1,000,000,000 `$CLTR` is distributed at deployment time:

*   **30.00%** Community Rewards (300,000,000 `$CLTR`)
*   **15.00%** Liquidity Wallet (150,000,000 `$CLTR`) — *Used to seed public market liquidity.*
*   **15.00%** Team Vesting (150,000,000 `$CLTR`) — *1-year cliff, 4-year linear vest.*
*   **10.00%** Strategic/Investor Vesting (100,000,000 `$CLTR`) — *Custom lockup schedules.*
*   **10.00%** Verifier Incentive Pool (100,000,000 `$CLTR`)
*   **8.34%** Treasury Multisig (83,400,000 `$CLTR`)
*   **6.66%** Founder Direct Allocation (66,600,000 `$CLTR`) — *Transferred directly to your wallet.*
*   **5.00%** Founder Vesting Wallet (50,000,000 `$CLTR`) — *Locked in CliffVestingWallet (1-year cliff, 4-year linear vest).*

---

## Legitimate founder Value Alignment

To align the founder's financial incentives with the growth of the platform:

### 1. Transparent Vesting Schedule
A dedicated `CliffVestingWallet` is deployed for the founder's address (`FOUNDER_VESTING_ADDR`) holding **5.00% of the total supply** (50,000,000 `$CLTR`). 
- **Cliff Period**: 1 year. During the first year, 0 tokens can be released.
- **Linear Vesting**: After year 1, tokens are released continuously second-by-second over 4 years.
- **Benefits**: Protects the token price from sudden developer dumping, demonstrating long-term alignment to the community.

### 2. Buying Tokens in the Open Market
To enable users and founders to buy/sell tokens on the open market, you must seed liquidity on a Decentralized Exchange (DEX) such as **Uniswap V3** (or the dominant Arbitrum Orbit AMM on Robinhood Chain).

#### How to establish the $CLTR market pool:
1. **Prepare Allocation**: The `liquidityWalletAddr` receives 15% (150,000,000 `$CLTR`) on deployment.
2. **Access DEX Factory**: Interact with the Uniswap V3 Factory contract deployed on the Robinhood Chain.
3. **Initialize Pool**: Call `createPool(address tokenA, address tokenB, uint24 fee)` where `tokenA` is `$CLTR`, `tokenB` is `$WETH` (or `$USDC`), and the fee tier is set (typically `3000` for 0.3% fee tier).
4. **Add Liquidity**: Add `$CLTR` alongside the corresponding amount of `$ETH` or `$USDC` into the pool:
   - *Example*: Adding 150,000,000 `$CLTR` and 100 `$ETH` sets the initial pool price.
5. **Lock Liquidity Provider (LP) NFT**: To guarantee to the public that the liquidity cannot be rugpulled, lock or burn the Uniswap V3 LP NFT (by sending it to the Treasury Multisig or a token lock contract like Uncx).
6. **Buy in the Market**: Once liquidity is seeded and locked, you and your users can buy or sell `$CLTR` tokens transparently using standard AMM swaps (via Uniswap UI or 1inch).

---

## How to Test and Deploy

### Run Tests
```bash
node node_modules/hardhat/internal/cli/cli.js test
```

### Local Dry Run
```bash
node node_modules/hardhat/internal/cli/cli.js run scripts/deploy.js --network hardhat
```

### Deploy to Robinhood Chain Testnet
1. Set up your `.env` variables:
   ```env
   DEPLOYER_PRIVATE_KEY=your_private_key
   FOUNDER_WALLET_ADDR=your_wallet_address
   FOUNDER_VESTING_ADDR=your_vesting_address
   TREASURY_MULTISIG_ADDR=your_multisig_address
   ```
2. Run deploy:
   ```bash
   node node_modules/hardhat/internal/cli/cli.js run scripts/deploy.js --network robinhoodChainTestnet
   ```
