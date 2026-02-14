
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

    // Attempt to locate migrations in src (standard for this repo structure)
    // If we were using a build tool that copies assets, we might look in dist/db/migrations
    const migrationsFolder = resolve(__dirname, '../../src/db/migrations');

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
        await migrationClient.end();
        process.exit(1);
    }
}

main().catch((err) => {
    console.error('❌ [migrate] Fatal error:', err);
    process.exit(1);
});
