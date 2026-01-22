/**
 * Database Migration Script
 * 
 * Loads .env automatically - no shell-specific env setup required.
 * Works on Windows, macOS, Linux, CI, and Railway.
 */

// CRITICAL: Load .env BEFORE any other imports that access process.env
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { migrationClient } from './client.js';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Fail-closed if DATABASE_URL is missing after dotenv loads
if (!process.env.DATABASE_URL) {
    console.error('❌ CRITICAL: Missing DATABASE_URL in .env');
    console.error('   Add: DATABASE_URL=postgresql://<user>:<pass>@<neon-host>/collateral?sslmode=require');
    process.exit(1);
}

async function main() {
    console.log('🔄 Running migrations...');
    console.log(`   Target: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'}`);

    const db = drizzle(migrationClient);

    // Resolve migrations folder relative to project root (works from both src/ and dist/)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // Go up from dist/db or src/db to project root, then to src/db/migrations
    const migrationsFolder = resolve(__dirname, '../../src/db/migrations');

    console.log(`   Migrations folder: ${migrationsFolder}`);

    await migrate(db, { migrationsFolder });

    console.log('✅ Migrations complete!');
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
