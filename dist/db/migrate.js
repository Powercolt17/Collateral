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
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Migrations complete!');
    process.exit(0);
}
main().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map