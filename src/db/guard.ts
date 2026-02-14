
import { sql } from 'drizzle-orm';
import { db } from './client.js';

/**
 * Schema Guard
 * 
 * Verifies that critical tables exist in the database before booting the application.
 * If tables are missing, it throws an error to prevent the app from serving broken requests.
 * This is a "fail fast" mechanism for production.
 */
export async function checkSchema() {
    console.log('🛡️ [guard] Checking database schema integrity...');

    try {
        // Check for market_contract_instances
        const [result] = await db.execute(sql`
            SELECT to_regclass('public.market_contract_instances') as exists;
        `);

        if (!result || !result.exists) {
            console.error('❌ [guard] CRITICAL: Table "market_contract_instances" is MISSING.');
            console.error('   The application cannot start because the database schema is out of sync.');
            console.error('   Run "npm run db:migrate" or check your deploy logs for migration failures.');
            throw new Error('Schema validation failed: market_contract_instances missing');
        }

        console.log('✅ [guard] Schema check passed (market_contract_instances exists).');
        return true;
    } catch (err) {
        console.error('❌ [guard] Schema check failed:', err);
        throw err;
    }
}
