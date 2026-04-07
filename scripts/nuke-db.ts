import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function nuke() {
  console.log('\n🔴 COLLATERAL DATABASE NUKE');
  console.log('═'.repeat(50));
  console.log('This will TRUNCATE all transactional data.\n');

  // ── Step 1: Truncate all transactional tables (order matters for FK)
  const tables = [
    'notifications',
    'referrals',
    'rivalry_metric_snapshots',
    'rivalry_ledger_events',
    'rivalry_participants',
    'rivalries',
    'contract_metric_current',
    'contract_metric_snapshots',
    'sales_verification_runs',
    'sales_contract_terms',
    'sales_baseline_snapshots',
    'verification_job_locks',
    'account_ledger_events',
    'idempotency_keys',
    'job_locks',
    'ledger_events',
    'contract_index',
    'contracts',
    'funding_sources',
    'connect_accounts',
    'identity_bindings',
    'connected_accounts',
    'market_stats_cache',
    'market_contract_instances',
    'identities',
    'users',
    'waitlist',
    'password_reset_tokens',
  ];

  for (const table of tables) {
    try {
      await sql(`TRUNCATE TABLE "${table}" CASCADE`);
      console.log(`  ✓ ${table}`);
    } catch (e: any) {
      if (e.message?.includes('does not exist')) {
        console.log(`  ⊘ ${table} (doesn't exist, skipping)`);
      } else {
        console.log(`  ✗ ${table}: ${e.message}`);
      }
    }
  }

  console.log('\n✅ All tables truncated.');
  console.log('═'.repeat(50));
  console.log('\nNext steps:');
  console.log('  1. Run: npx tsx src/db/seed-catalog.ts   (re-seed market)');
  console.log('  2. Run: npx tsx scripts/update-owner-identity.ts');
  console.log('  3. Run: npx tsx scripts/set-owner-avatar.ts');
  console.log('  4. Redeploy backend\n');
}

nuke().catch(console.error);
