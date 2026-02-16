
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

        // VALIDATION & FORCE FIX
        try {
            // 1. Log tracking status
            try {
                const applied = await migrationDb.execute(sql`SELECT count(*) as count FROM drizzle.__drizzle_migrations`);
                console.log(`[migrate] ℹ️ Drizzle tracking table has ${applied[0]?.count} rows.`);
            } catch (e) {
                console.log('[migrate] ℹ️ Could not query drizzle.__drizzle_migrations (might not exist yet).');
            }

            // 2. Check for missing tables
            const [mci] = await migrationDb.execute(sql`SELECT to_regclass('public.market_contract_instances') as exists`);
            const [ct] = await migrationDb.execute(sql`SELECT to_regclass('public.contract_templates') as exists`);

            const mciExists = !!mci?.exists;
            const ctExists = !!ct?.exists;

            console.log(`[migrate] 🔍 Table Check: market_contract_instances=${mciExists}, contract_templates=${ctExists}`);

            if (!mciExists || !ctExists) {
                console.warn('[migrate] ⚠️ Critical tables missing despite migration success. FORCE APPLYING 0025...');

                // Force read 0025 and execute
                const forceFile = '0025_add_missing_market_tables_v2.sql';
                const forcePath = resolve(migrationsFolder, forceFile);

                if (fs.existsSync(forcePath)) {
                    console.log(`[migrate] reading ${forceFile}...`);
                    const sqlContent = fs.readFileSync(forcePath, 'utf-8');

                    // Simple execute (assuming file is safe standard SQL)
                    await migrationDb.execute(sql.raw(sqlContent));
                    console.log('[migrate] ☢️ FORCE APPLY 0025 EXECUTED.');

                    // Re-verify
                    const [mci2] = await migrationDb.execute(sql`SELECT to_regclass('public.market_contract_instances') as exists`);
                    console.log(`[migrate] 🔍 Re-Check: market_contract_instances=${!!mci2?.exists}`);
                } else {
                    console.error(`[migrate] ❌ Could not find ${forceFile} to force apply! Path checked: ${forcePath}`);
                }
            } else {
                console.log('[migrate] ✅ Tables confirmed to exist.');
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
