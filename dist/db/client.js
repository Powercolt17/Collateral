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
    throw new Error(`Critical: Missing database connection string. ` +
        `Set DATABASE_URL (or DATABASE_URL_TEST for tests) in .env file.`);
}
// SAFETY GUARD: Prevent accidental truncation of dev/prod DBs during tests
if (isTest && process.env.DATABASE_URL && connectionString === process.env.DATABASE_URL) {
    throw new Error('CRITICAL SAFETY ERROR: DATABASE_URL_TEST must be different from DATABASE_URL. ' +
        'This prevents accidental data loss (truncation) in development/production databases.');
}
// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });
// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });
//# sourceMappingURL=client.js.map