
/**
 * Production Migration Runner
 * 
 * Compiles to: dist/db/migrate-prod.js
 * Run with: node dist/db/migrate-prod.js
 * 
 * Purpose: Applies pending migrations to the production database.
 * Fails fast (exit 1) if anything goes wrong.
 */

import 'dotenv/config'; // Load .env if present (local/dev)
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Parse DATABASE_URL
// In production, Railway provides this env var.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ CRITICAL: DATABASE_URL is missing.');
    process.exit(1);
}

// Create a separate migration client (max 1 connection)
// consistent with current architecture
const migrationClient = postgres(connectionString, { max: 1 });

async function main() {
    console.log('🔄 [migrate] Starting production migrations...');

    // Resolve path to migrations folder
    // This script runs from dist/db/migrate-prod.js
    // We need to find src/db/migrations
    // __dirname = .../dist/db
    // ../.. = .../
    // + src/db/migrations

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Strategy:
    // 1. Check relative ./migrations (Production behavior - when copied to dist/db/migrations)
    // 2. Check ../../src/db/migrations (Dev/Fallback behavior)

    let migrationsFolder = resolve(__dirname, 'migrations');

    // Simple check: does directory exist? (Using fs is cleaner but we can try/catch/stat if needed)
    // For now, let's assume if we are in dist/db, and we copied migrations, it's there.

    // However, if we are running locally via tsx, __dirname is src/db, so ./migrations works there too!
    // So actually, resolve(__dirname, 'migrations') works for BOTH if:
    // - In src/db: ./migrations exists
    // - In dist/db: ./migrations exists (IF COPIED)

    console.log(`   [migrate] Looking for migrations in: ${migrationsFolder}`);

    const db = drizzle(migrationClient);

    try {
        await migrate(db, { migrationsFolder });
        console.log('✅ [migrate] Migrations applied successfully.');

        // Close connection to allow process to exit cleanly if run standalone
        await migrationClient.end();
        process.exit(0);

    } catch (err) {
        console.error('❌ [migrate] Migration FAILED:', err);
        // Fallback: Try the src path if the first one failed (maybe we didn't copy to dist)
        if (migrationsFolder.includes('dist')) {
            console.log('   [migrate] Retrying with source path fallback...');
            const srcMigrationsFolder = resolve(__dirname, '../../src/db/migrations');
            try {
                await migrate(db, { migrationsFolder: srcMigrationsFolder });
                console.log('✅ [migrate] Migrations applied successfully (fallback).');
                await migrationClient.end();
                process.exit(0);
            } catch (err2) {
                console.error('❌ [migrate] Fallback also FAILED:', err2);
                await migrationClient.end();
                process.exit(1);
            }
        } else {
            await migrationClient.end();
            process.exit(1);
        }
    }
}

main().catch((err) => {
    console.error('❌ [migrate] Fatal error:', err);
    process.exit(1);
});
