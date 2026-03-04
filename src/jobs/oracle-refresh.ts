// @ts-nocheck
/**
 * Oracle Refresh Job — Scheduled Metric Polling
 * 
 * Queries all active contracts needing metric updates and dispatches
 * refreshContractMetric() for each. Safe to run every minute.
 * 
 * Entry points:
 * - Called by scheduler.ts alongside verification/settlement
 * - Can be run standalone: node -e "import('./src/jobs/oracle-refresh.js').then(m => m.runOracleRefreshJob())"
 */

import { getContractsNeedingRefresh, refreshContractMetric } from '../services/oracle.js';

export interface OracleRefreshResult {
    processed: number;
    succeeded: number;
    failed: number;
    skipped: number;
}

/**
 * Run oracle refresh for all active contracts that need it.
 */
export async function runOracleRefreshJob(): Promise<OracleRefreshResult> {
    console.log('🔮 Starting oracle refresh job...');

    const contractIds = await getContractsNeedingRefresh();
    console.log(`[Oracle Job] Found ${contractIds.length} contracts needing refresh`);

    let succeeded = 0;
    let failed = 0;
    let skipped = 0;

    for (const contractId of contractIds) {
        try {
            const refreshed = await refreshContractMetric(contractId);
            if (refreshed) {
                succeeded++;
            } else {
                skipped++; // Lock contention or provider error
            }
        } catch (err: any) {
            console.error(`[Oracle Job] Error refreshing ${contractId}:`, err.message);
            failed++;
        }
    }

    const result: OracleRefreshResult = {
        processed: contractIds.length,
        succeeded,
        failed,
        skipped,
    };

    console.log(`🔮 Oracle refresh complete: ${succeeded} succeeded, ${failed} failed, ${skipped} skipped`);
    return result;
}

// If run directly
if (typeof process !== 'undefined' && process.argv[1]?.includes('oracle-refresh')) {
    runOracleRefreshJob()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
