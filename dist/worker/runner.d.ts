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
export {};
