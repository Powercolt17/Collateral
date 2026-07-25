// Single Source of Truth Constants Module for Protocol Metrics
// All views, tabs, and stat blocks MUST import and read from this module.

export const PROTOCOL_METRICS = {
    // ── Supply & Token Economics (Strictly Reconciled: Cap - Total Burned = Circulating) ──
    FIXED_CAP: 1000000000,                          // 1,000,000,000 CLTR
    TOTAL_BURNED: 12450230,                        // 12,450,230 CLTR burned
    get CIRCULATING_SUPPLY() {
        return this.FIXED_CAP - this.TOTAL_BURNED;  // 987,549,770 CLTR
    },
    DAILY_BURN: 14210,                             // 14,210 CLTR / day
    WEEKLY_BURN: 98420,                            // 98,420 CLTR / week
    BURN_RATE_PCT: 1.25,                           // 1.25% annual rate

    // ── System-Wide Scope vs Scoped Metrics ──
    // 1. Contracts & Commitments:
    CUMULATIVE_CONTRACTS_SETTLED: 528,             // 528 Cumulative settled contracts (Market & Ledger)
    ACTIVE_ONCHAIN_CLTR_CONTRACTS: 142,            // 142 Currently Active On-Chain CLTR Contracts
    TOTAL_OPEN_CONTRACTS: 528,                     // 528 Total Open Contracts (Market - USD + CLTR)
    
    // 2. Capital & Stakes:
    TOTAL_OPEN_CAPITAL_USD: 633600,                // $633.6k Active Open Capital (Market)
    CUMULATIVE_CAPITAL_PROTECTED_USD: 183000000,   // $183M Cumulative Historical Volume Protected (Protocol-wide)
    CUMULATIVE_CLTR_COMMITTED: 15000000,           // 15,000,000.00 CLTR Cumulative Committed

    // 3. Execution & Performance Rates:
    SYSTEM_EXECUTION_RATE: 98.7,                   // 98.7% Global System Execution Rate
    ONCHAIN_SETTLEMENT_ACCURACY: 99.98,            // 99.98% Oracle & On-Chain Accuracy Rate

    // 4. Zero-Data Account Fallbacks (Uncommitted / Fresh Wallet State):
    ACCOUNT_DEFAULT: {
        CONVICTION_SCORE: "—",
        SUCCESS_RATE: "—",
        GLOBAL_RANK: "—",
        CONTRACTS_COUNT: 0,
        CONVICTION_BALANCE_CLTR: "66,600,000.00 CLTR (ON-CHAIN RAIL)"
    }
};
