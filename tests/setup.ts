/**
 * Test Setup - Per-file setup (NO migrations here)
 * 
 * Migrations run in global-setup.ts (once per test run).
 * This file only handles table truncation between tests.
 */

import 'dotenv/config';

import { beforeEach } from 'vitest';
import postgres from 'postgres';

// Fail-closed isolation checks
if (process.env.NODE_ENV !== 'test') {
    throw new Error('CRITICAL: Tests must run with NODE_ENV=test. Current: ' + process.env.NODE_ENV);
}

const connectionString = process.env.DATABASE_URL_TEST;

if (!connectionString) {
    throw new Error('CRITICAL: Missing DATABASE_URL_TEST in .env.');
}

if (process.env.DATABASE_URL && connectionString === process.env.DATABASE_URL) {
    throw new Error('CRITICAL SAFETY ERROR: DATABASE_URL_TEST matches DATABASE_URL.');
}

// Shared connection for truncation
const sql = postgres(connectionString, { max: 1 });

/**
 * Fail-closed schema guard.
 * If globalSetup didn't run migrations, this gives a clear error.
 */
async function assertSchemaPresent() {
    const r = await sql`
        SELECT to_regclass('public.idempotency_keys') as t
    `;
    if (!r[0]?.t) {
        throw new Error(
            'CRITICAL: Test DB schema not migrated (idempotency_keys missing).\n' +
            'This means Vitest globalSetup did NOT run migrations.\n' +
            'Fix: ensure vitest.config.ts is at repo root and contains globalSetup.'
        );
    }
}

beforeEach(async () => {
    // Schema guard: fail immediately if migrations didn't run
    await assertSchemaPresent();

    // Truncate tables between tests
    await sql`
        TRUNCATE TABLE 
            job_locks,
            ledger_events,
            contract_index,
            contracts,
            identity_bindings,
            connected_accounts,
            identities,
            users,
            idempotency_keys
        RESTART IDENTITY CASCADE
    `;
});
