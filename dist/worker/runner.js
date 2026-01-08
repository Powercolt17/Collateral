/**
 * Production Worker Runner
 *
 * Runs verification and settlement jobs in a continuous loop.
 * Relies on per-contract locks to allow safe multi-worker concurrency.
 *
 * Environment Variables:
 * - WORKER_CONCURRENCY: Number of contracts to process in parallel (default: 1)
 * - WORKER_SLEEP_MS: Sleep between iterations (default: 15000)
 * - NODE_ENV: production/development
 *
 * Graceful Shutdown:
 * - Listens for SIGTERM/SIGINT
 * - Completes current iteration before exiting
 */
import { runVerificationJob } from '../services/verification.js';
import { runSettlementJob } from '../services/settlement.js';
// Configuration from environment
const WORKER_CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '1', 10);
const WORKER_SLEEP_MS = parseInt(process.env.WORKER_SLEEP_MS || '15000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
// Shutdown flag
let shuttingDown = false;
/**
 * Sleep for specified milliseconds
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Format timestamp for structured logging
 */
function timestamp() {
    return new Date().toISOString();
}
/**
 * Structured log output
 */
function log(level, message, data) {
    const entry = {
        timestamp: timestamp(),
        level,
        worker: 'collateral-worker',
        message,
        ...data,
    };
    console.log(JSON.stringify(entry));
}
/**
 * Run a single iteration of all jobs
 */
async function runJobIteration() {
    const iterationId = `iter_${Date.now()}`;
    log('INFO', 'Starting job iteration', { iterationId });
    // Run verification job
    const verificationStart = Date.now();
    const verificationResult = await runVerificationJob();
    const verificationDurationMs = Date.now() - verificationStart;
    log('INFO', 'Verification job complete', {
        iterationId,
        job: 'VERIFICATION',
        durationMs: verificationDurationMs,
        ...verificationResult,
    });
    // Run settlement job
    const settlementStart = Date.now();
    const settlementResult = await runSettlementJob();
    const settlementDurationMs = Date.now() - settlementStart;
    log('INFO', 'Settlement job complete', {
        iterationId,
        job: 'SETTLEMENT',
        durationMs: settlementDurationMs,
        ...settlementResult,
    });
    return {
        verification: verificationResult,
        settlement: settlementResult,
    };
}
/**
 * Main worker loop
 */
async function runWorkerLoop() {
    log('INFO', 'Worker starting', {
        concurrency: WORKER_CONCURRENCY,
        sleepMs: WORKER_SLEEP_MS,
        env: NODE_ENV,
    });
    let iterationCount = 0;
    while (!shuttingDown) {
        iterationCount++;
        try {
            const result = await runJobIteration();
            // Summary log
            const totalProcessed = result.verification.processed + result.settlement.processed;
            const totalSucceeded = result.verification.succeeded + result.settlement.succeeded;
            const totalFailed = result.verification.failed + result.settlement.failed;
            const totalSkipped = result.verification.skipped + result.settlement.skipped;
            if (totalProcessed > 0) {
                log('INFO', 'Iteration summary', {
                    iteration: iterationCount,
                    totalProcessed,
                    totalSucceeded,
                    totalFailed,
                    totalSkipped,
                });
            }
        }
        catch (error) {
            log('ERROR', 'Job iteration failed', {
                iteration: iterationCount,
                error: error.message,
                stack: error.stack,
            });
        }
        if (!shuttingDown) {
            log('INFO', `Sleeping for ${WORKER_SLEEP_MS}ms before next iteration`);
            await sleep(WORKER_SLEEP_MS);
        }
    }
    log('INFO', 'Worker shutdown complete', { iterations: iterationCount });
}
/**
 * Graceful shutdown handler
 */
function handleShutdown(signal) {
    log('INFO', `Received ${signal}, initiating graceful shutdown...`);
    shuttingDown = true;
}
/**
 * Main entry point
 */
async function main() {
    // Register shutdown handlers
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║              COLLATERAL WORKER - PRODUCTION               ║
╠═══════════════════════════════════════════════════════════╣
║  Concurrency: ${WORKER_CONCURRENCY.toString().padEnd(42)}║
║  Sleep Interval: ${WORKER_SLEEP_MS.toString().padEnd(38)}ms ║
║  Environment: ${NODE_ENV.padEnd(42)}║
╠═══════════════════════════════════════════════════════════╣
║  Jobs:                                                    ║
║    - runVerificationJob() → LOCKED → VERIFIED             ║
║    - runSettlementJob()   → VERIFIED → SETTLED/FORFEITED  ║
╚═══════════════════════════════════════════════════════════╝
    `);
    try {
        await runWorkerLoop();
        process.exit(0);
    }
    catch (error) {
        log('ERROR', 'Worker crashed', { error: error.message, stack: error.stack });
        process.exit(1);
    }
}
// Run if executed directly
main();
//# sourceMappingURL=runner.js.map