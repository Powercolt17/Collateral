
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
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
