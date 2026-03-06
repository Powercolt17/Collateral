
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql } from 'drizzle-orm';
import postgres from 'postgres';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations() {
    console.log('[migrate] Starting production migrations...');

    if (!process.env.DATABASE_URL) {
        console.error('[migrate] ❌ DATABASE_URL is missing');
        throw new Error('DATABASE_URL is missing');
    }

    // Use a separate connection for migrations to avoid hanging the app pool
    const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    const migrationDb = drizzle(migrationClient);

    // Dynamic resolution for dist/ vs src/ environments
    // In prod (dist/db/migrate-prod.js), we want dist/db/migrations
    // In dev (src/db/migrate-prod.ts), we want src/db/migrations
    const possiblePaths = [
        resolve(__dirname, 'migrations'),       // dist/db/migrations (when running from dist/db)
        resolve(__dirname, '../../db/migrations'), // fallback
        resolve(__dirname, '../../src/db/migrations'), // dev fallback
    ];

    let migrationsFolder = '';
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            migrationsFolder = p;
            break;
        }
    }

    if (!migrationsFolder) {
        console.error('[migrate] ❌ Could not locate migrations folder. Checked:', possiblePaths);
        throw new Error('Migrations folder not found');
    }

    console.log(`[migrate] Using migrations folder: ${migrationsFolder}`);

    // DIAGNOSTIC: List files in the folder
    try {
        const files = fs.readdirSync(migrationsFolder);
        console.log(`[migrate] Found ${files.length} files in migrations folder:`, files.slice(0, 5), '...');
        if (files.length === 0) {
            console.error('[migrate] ⚠️ Migrations folder is EMPTY!');
        }
    } catch (e) {
        console.error('[migrate] ❌ Failed to list migrations folder:', e);
    }

    try {
        await migrate(migrationDb, { migrationsFolder });
        console.log('[migrate] ✅ Migrations applied successfully.');

        // =================================================================
        // FORCE-APPLY ALL UNTRACKED MIGRATIONS (0024–0035)
        // =================================================================
        // The Drizzle journal only tracks up to 0023. Migrations 0024–0035
        // were added manually and never registered in the journal.
        // All migration files use idempotent SQL (IF NOT EXISTS, etc.),
        // so re-running them is always safe.
        // =================================================================
        try {
            // Log tracking status
            try {
                const applied = await migrationDb.execute(sql`SELECT count(*) as count FROM drizzle.__drizzle_migrations`);
                console.log(`[migrate] ℹ️ Drizzle tracking table has ${applied[0]?.count} rows.`);
            } catch (e) {
                console.log('[migrate] ℹ️ Could not query drizzle.__drizzle_migrations (might not exist yet).');
            }

            // All untracked migrations in order
            const untrackedMigrations = [
                '0024_ensure_market_tables.sql',
                '0025_add_missing_market_tables_v2.sql',
                '0026_smart_tiers.sql',
                '0027_fix_schema_mismatch.sql',
                '0028_fix_schema_drift_v2.sql',
                '0029_add_clerk_user_id.sql',
                '0030_password_reset_tokens.sql',
                '0031_update_tier_pricing.sql',
                '0032_oracle_metric_tables.sql',
                '0033_social_share_bonus.sql',
                '0034_referral_system.sql',
                '0035_referral_first_bonus.sql',
            ];

            console.log(`[migrate] 🔧 Force-applying ${untrackedMigrations.length} untracked migrations...`);

            for (const fileName of untrackedMigrations) {
                const filePath = resolve(migrationsFolder, fileName);
                if (!fs.existsSync(filePath)) {
                    console.warn(`[migrate] ⚠️ Skipping ${fileName} (file not found)`);
                    continue;
                }

                try {
                    const sqlContent = fs.readFileSync(filePath, 'utf-8');
                    await migrationDb.execute(sql.raw(sqlContent));
                    console.log(`[migrate] ✅ Force-applied: ${fileName}`);
                } catch (err: any) {
                    // Log but don't crash — idempotent SQL should not fail,
                    // but if it does we still want the rest to run
                    console.error(`[migrate] ⚠️ Error applying ${fileName}: ${err.message}`);
                }
            }

            // Verification: spot-check critical columns/tables
            const checks = [
                { label: 'market_contract_instances', query: sql`SELECT to_regclass('public.market_contract_instances') as exists` },
                { label: 'contract_templates', query: sql`SELECT to_regclass('public.contract_templates') as exists` },
                { label: 'contract_metric_snapshots', query: sql`SELECT to_regclass('public.contract_metric_snapshots') as exists` },
                { label: 'referrals', query: sql`SELECT to_regclass('public.referrals') as exists` },
            ];

            for (const check of checks) {
                const [result] = await migrationDb.execute(check.query);
                const exists = !!(result as any)?.exists;
                console.log(`[migrate] 🔍 ${check.label}: ${exists ? '✅' : '❌ MISSING'}`);
            }

            // Column spot-checks on users/contracts tables
            const colChecks = [
                { table: 'users', column: 'referral_code' },
                { table: 'users', column: 'clerk_user_id' },
                { table: 'users', column: 'reset_token' },
                { table: 'users', column: 'referral_first_bonus_used' },
                { table: 'contracts', column: 'social_bonus_enabled' },
                { table: 'contracts', column: 'market_instance_id' },
            ];

            for (const { table, column } of colChecks) {
                const [result] = await migrationDb.execute(sql`
                    SELECT column_name FROM information_schema.columns 
                    WHERE table_name = ${table} AND column_name = ${column}
                `);
                const exists = !!(result as any)?.column_name;
                console.log(`[migrate] 🔍 ${table}.${column}: ${exists ? '✅' : '❌ MISSING'}`);
            }

        } catch (valErr) {
            console.error('[migrate] ⚠️ Validation/Force-Fix failed:', valErr);
        }

        await migrationClient.end();
        return true;
    } catch (err) {
        console.error('[migrate] ❌ Migration FAILED:', err);
        await migrationClient.end();
        throw err;
    }
}

// Allow standalone execution via `node dist/db/migrate-prod.js`
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations().then(() => process.exit(0)).catch(() => process.exit(1));
}
