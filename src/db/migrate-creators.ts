import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db } from './client.js';

async function runMigration() {
    console.log('[Migration] Creating creator enums and tables...');
    
    // Create enums
    try {
        await db.execute(sql`CREATE TYPE creator_tier AS ENUM ('A_LIST', 'STANDARD')`);
        console.log('[Migration] ✅ creator_tier enum created');
    } catch (e: any) {
        if (e.message?.includes('already exists')) console.log('[Migration] creator_tier enum already exists');
        else throw e;
    }
    
    try {
        await db.execute(sql`CREATE TYPE creator_status AS ENUM ('DRAFT', 'READY', 'ACTIVE', 'PAUSED', 'COMPLETED')`);
        console.log('[Migration] ✅ creator_status enum created');
    } catch (e: any) {
        if (e.message?.includes('already exists')) console.log('[Migration] creator_status enum already exists');
        else throw e;
    }
    
    try {
        await db.execute(sql`CREATE TYPE creator_conversion_event AS ENUM ('CLICKED', 'SIGNED_UP', 'FUNDED_CONTRACT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PAID')`);
        console.log('[Migration] ✅ creator_conversion_event enum created');
    } catch (e: any) {
        if (e.message?.includes('already exists')) console.log('[Migration] creator_conversion_event enum already exists');
        else throw e;
    }

    // Create tables
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS creator_referrals (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            name varchar(255) NOT NULL,
            slug varchar(100) NOT NULL UNIQUE,
            platform varchar(50) NOT NULL DEFAULT 'X',
            handle varchar(255) NOT NULL,
            tier creator_tier NOT NULL DEFAULT 'STANDARD',
            bonus_rate_cents integer NOT NULL DEFAULT 1000,
            post_fee_cents integer DEFAULT 0,
            follower_count integer,
            score integer,
            status creator_status NOT NULL DEFAULT 'DRAFT',
            notes text,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
        )
    `);
    console.log('[Migration] ✅ creator_referrals table created');

    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS creator_conversions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            creator_id uuid NOT NULL REFERENCES creator_referrals(id),
            user_id uuid REFERENCES users(id),
            contract_id uuid REFERENCES contracts(id),
            event_type creator_conversion_event NOT NULL,
            stake_amount_cents integer,
            bonus_amount_cents integer,
            rejection_reason text,
            metadata_json jsonb,
            created_at timestamptz NOT NULL DEFAULT now(),
            reviewed_at timestamptz,
            paid_at timestamptz
        )
    `);
    console.log('[Migration] ✅ creator_conversions table created');

    // Indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_conversions_creator ON creator_conversions(creator_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_conversions_user ON creator_conversions(user_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_conversions_event ON creator_conversions(event_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_conversions_creator_event ON creator_conversions(creator_id, event_type)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_referrals_status ON creator_referrals(status)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_creator_referrals_tier ON creator_referrals(tier)`);
    console.log('[Migration] ✅ Indexes created');

    console.log('[Migration] ✅ All done!');
    process.exit(0);
}

runMigration().catch(err => { console.error('[Migration] ❌ Failed:', err); process.exit(1); });
