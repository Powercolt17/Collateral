
import 'dotenv/config';
import Stripe from 'stripe';
import postgres from 'postgres';

// ==========================================
// CONFIGURATION
// ==========================================
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// ==========================================
// VALIDATION
// ==========================================
if (!ADMIN_API_KEY) {
    console.error('❌ ADMIN_API_KEY is required');
    process.exit(1);
}
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is required');
    process.exit(1);
}
if (!STRIPE_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is required');
    process.exit(1);
}

const sql = postgres(DATABASE_URL);
const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2023-10-16' });

console.log(`🚀 Money Truth Test`);
console.log(`Target: ${API_BASE_URL}`);

// ==========================================
// STATE
// ==========================================
let authToken = '';
let userId = '';
let contractId = '';
const shortUser = `u_${Math.floor(Date.now() / 1000)}`;

// ==========================================
// HELPERS
// ==========================================
async function api(method: string, path: string, body?: any, headers: Record<string, string> = {}) {
    const opts: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            ...headers
        }
    };
    if (body) opts.body = JSON.stringify(body);

    try {
        const res = await fetch(`${API_BASE_URL}${path}`, opts);
        const text = await res.text();
        let data: any = {};
        try { data = JSON.parse(text); } catch { data = { raw: text }; }

        return { status: res.status, data };
    } catch (err) {
        return { status: 0, data: { error: String(err) } };
    }
}

async function assert(condition: boolean, msg: string) {
    if (!condition) {
        console.error(`❌ FAILED: ${msg}`);
        process.exit(1);
    }
    console.log(`✅ ${msg}`);
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================
// MAIN
// ==========================================
async function run() {
    try {
        // 1. Sanity Check
        console.log('\n--- 1. Sanity Check ---');
        const health = await api('GET', '/health');
        // Proceeding assuming server up.

        // 2. Create User
        console.log('\n--- 2. Create User ---');
        const signupRes = await api('POST', '/v1/auth/signup', {
            email: `test_${shortUser}@example.com`,
            username: shortUser,
            password: 'password123',
            displayName: 'Test User'
        });

        if (signupRes.status !== 200) {
            console.error('Signup Failed:', signupRes.data);
            process.exit(1);
        }
        authToken = signupRes.data.accessToken;
        userId = signupRes.data.user.id;
        assert(!!userId, `User created: ${userId}`);

        // 3. Attach Funding Source (Using Admin Helper)
        console.log('\n--- 3. Attach Funding Source (Admin) ---');
        const cardRes = await api('POST', '/v1/admin/test/attach-card', {}, {
            'x-admin-key': ADMIN_API_KEY!
        });

        if (cardRes.status !== 200) {
            console.error('Attach Card Failed:', cardRes.data);
            process.exit(1);
        }
        assert(cardRes.data.success === true, 'Card Attached via Helper');

        // 4. Add Funds
        console.log('\n--- 4. Add Funds ---');
        const fundRes = await api('POST', '/v1/billing/add-funds', { amountCents: 50000 });
        if (fundRes.status !== 200) {
            console.error('Add Funds Failed:', fundRes.data);
            process.exit(1);
        }
        const balanceRes = await api('GET', '/v1/billing/status');
        assert(balanceRes.data.balances.availableBalanceUsdCents === 50000, 'Balance is $500');

        // 5. Create & Lock Contract
        console.log('\n--- 5. Create & Lock ---');
        const createRes = await api('POST', '/v1/contracts', {
            platform: 'X', metricType: 'FOLLOWERS',
            condition: { operator: 'GTE', threshold: 1, deadline: new Date(Date.now() + 100000).toISOString() },
            lockAmountUsdCents: 10000, // $100 lock
            payoutAmountUsdCents: 10000 // $100 payout
        });

        if (!createRes.data.contractId) {
            console.error('Create Contract Failed:', createRes.data);
            process.exit(1);
        }
        contractId = createRes.data.contractId;

        await api('POST', `/v1/contracts/${contractId}/lock`);
        const lockRes = await api('GET', `/v1/billing/status`);
        assert(lockRes.data.balances.lockedBalanceUsdCents === 10000, 'Locked $100');

        // 6. Settle Win (Admin)
        console.log('\n--- 6. Settle Win ---');
        const settleRes = await api('POST', `/v1/contracts/${contractId}/settle`, { outcome: 'win' }, {
            'x-admin-key': ADMIN_API_KEY!
        });
        if (settleRes.status !== 200) {
            console.error('Settle Failed:', settleRes.data);
            process.exit(1);
        }
        assert(settleRes.data.derivedState === 'SETTLED_SUCCESS', 'Contract Settled Win');

        // 7. Connect Account & Enable Payouts
        console.log('\n--- 7. Connect Account (Simulated) ---');
        // Create express account local record
        const connRes = await api('POST', '/v1/payouts/connect/create');
        const acctId = connRes.data.accountId;

        // Inject Payouts Enabled status via DB
        // Using "connect_accounts" and snake_case columns
        console.log(`Injecting Payouts Enabled for ${userId}...`);
        await sql`
            UPDATE connect_accounts 
            SET payouts_enabled = 1, onboarding_status = 'connected'
            WHERE user_id = ${userId}
        `;

        // 8. Run Payouts (First Run)
        console.log('\n--- 8. Run Payouts (1st) ---');
        // Verify Ledger Logic
        const queued = await sql`SELECT * FROM account_ledger_events WHERE user_id = ${userId} AND event_type = 'PAYOUT_QUEUED'`;
        assert(queued.length > 0, 'Ledger has PAYOUT_QUEUED');
        const queuedId = queued[0].id;

        const run1 = await api('POST', '/v1/payouts/run', {}, { 'x-admin-key': ADMIN_API_KEY! });
        console.log('Run 1 Result:', run1.data);
        assert(run1.data.processed > 0, 'Processed payouts');

        // Verify Ledger has PAYOUT_SENT
        const sent = await sql`SELECT * FROM account_ledger_events WHERE user_id = ${userId} AND event_type = 'PAYOUT_SENT'`;
        assert(sent.length === 1, 'Ledger has exactly one PAYOUT_SENT');

        // Verify Linkage
        if (sent[0].origin_event_id) {
            assert(sent[0].origin_event_id === queued[0].id, 'PAYOUT_SENT linked to QUEUED via origin_event_id');
        } else {
            console.error('❌ PAYOUT_SENT missing origin_event_id!');
            process.exit(1);
        }

        // 9. Run Payouts (Second Run - Idempotency)
        console.log('\n--- 9. Run Payouts (2nd) ---');
        const run2 = await api('POST', '/v1/payouts/run', {}, { 'x-admin-key': ADMIN_API_KEY! });
        console.log('Run 2 Result:', run2.data);
        assert(run2.data.processed === 0, 'Processed 0 payouts on rerun');

        // Verify still only one sent event
        const sent2 = await sql`SELECT * FROM account_ledger_events WHERE user_id = ${userId} AND event_type = 'PAYOUT_SENT'`;
        assert(sent2.length === 1, 'Still only one PAYOUT_SENT after rerun');

        console.log('\n🎉 ALL TESTS PASSED');
        process.exit(0);

    } catch (err) {
        console.error('Test Failed:', err);
        process.exit(1);
    } finally {
        await sql.end();
    }
}

run();
