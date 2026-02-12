// CRITICAL: Load .env before any process.env access
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST;

// STRICT ISOLATION: Tests must use DATABASE_URL_TEST
const connectionString = isTest
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL;

if (!connectionString) {
    console.error(
        '⚠️ WARNING: Missing database connection string. ' +
        'Set DATABASE_URL (or DATABASE_URL_TEST for tests) in .env file. ' +
        'Database queries will fail until this is configured.'
    );
}

// SAFETY GUARD: Prevent accidental truncation of dev/prod DBs during tests
if (isTest && process.env.DATABASE_URL && connectionString === process.env.DATABASE_URL) {
    throw new Error(
        'CRITICAL SAFETY ERROR: DATABASE_URL_TEST must be different from DATABASE_URL. ' +
        'This prevents accidental data loss (truncation) in development/production databases.'
    );
}

// For query purposes
const queryClient = postgres(connectionString || 'postgresql://localhost/placeholder');
export const db = drizzle(queryClient, { schema });

// For migrations
export const migrationClient = postgres(connectionString || 'postgresql://localhost/placeholder', { max: 1 });

// =============================================================================
// DbLike TYPE (for transaction client compatibility)
// =============================================================================
// This type allows functions to accept either the global db or a transaction client.
// When inside withContractLock, pass the tx to ensure writes use the lock-pinned connection.

/** Transaction client type from db.transaction callback */
export type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Either global db or transaction client - use this for functions that need to support both */
export type DbLike = typeof db | TransactionClient;
