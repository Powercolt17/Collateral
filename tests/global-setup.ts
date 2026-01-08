/**
 * Global Setup - Runs ONCE before all test files
 * 
 * Handles migration exactly once per test run.
 * Uses PostgreSQL advisory lock for safety.
 */

import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import path from 'path';
import * as schema from '../src/db/schema.js';

const MIGRATION_LOCK_KEY = 424242;

export default async function globalSetup() {
    console.log('✅ Vitest globalSetup starting (migrations)…');

    if (process.env.NODE_ENV !== 'test') {
        throw new Error(`CRITICAL: NODE_ENV must be test. Current: ${process.env.NODE_ENV}`);
    }

    const connectionString = process.env.DATABASE_URL_TEST;
    if (!connectionString) {
        throw new Error(
            'CRITICAL: Missing DATABASE_URL_TEST.\n' +
            'Set DATABASE_URL_TEST in .env to an isolated test database.'
        );
    }

    const sql = postgres(connectionString, { max: 1 });
    const db = drizzle(sql, { schema });

    try {
        await sql`SELECT 1`;
        console.log('✅ DB connection OK');

        await sql`SELECT pg_advisory_lock(${MIGRATION_LOCK_KEY})`;
        console.log('🔒 Migration lock acquired');

        const migrationsFolder = path.resolve(process.cwd(), 'src/db/migrations');
        console.log('🔄 Running migrations from:', migrationsFolder);

        await migrate(db, { migrationsFolder });
        console.log('✅ Migrations complete');

        // Schema assertion: verify migrations actually created tables
        const r = await sql`
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'idempotency_keys'
        `;
        if (r.length === 0) {
            throw new Error(
                'CRITICAL: Migrations ran but idempotency_keys table missing.\n' +
                'Migrations folder path may be wrong: ' + migrationsFolder
            );
        }
        console.log('✅ Schema assertion passed (idempotency_keys exists)');

    } finally {
        await sql`SELECT pg_advisory_unlock(${MIGRATION_LOCK_KEY})`.catch(() => { });
        console.log('🔓 Migration lock released');
        await sql.end({ timeout: 5 }).catch(() => { });
        console.log('✅ Vitest globalSetup finished');
    }
}
