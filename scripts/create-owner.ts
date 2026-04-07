/**
 * Post-nuke: Create owner account from scratch
 * Run: npx tsx scripts/create-owner.ts
 */
import 'dotenv/config';
import { db } from '../src/db/client.js';
import { users, identities } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

async function createOwner() {
    const OWNER_EMAIL = 'support@collateral.market';
    const DISPLAY_NAME = 'The System';
    const USERNAME = 'thesystem';

    console.log('[Owner] Creating owner account...');

    // Check if already exists
    const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, OWNER_EMAIL))
        .limit(1);

    if (existing) {
        console.log('[Owner] User already exists:', existing.id);
        // Just ensure identity exists
        const [identity] = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, existing.id))
            .limit(1);

        if (!identity) {
            await db.insert(identities).values({
                userId: existing.id,
                username: USERNAME,
                displayName: DISPLAY_NAME,
            });
            console.log('[Owner] ✅ Created identity @thesystem');
        } else {
            console.log('[Owner] Identity exists: @' + identity.username);
        }
        process.exit(0);
    }

    // Create user
    const [user] = await db
        .insert(users)
        .values({ email: OWNER_EMAIL })
        .returning();

    console.log('[Owner] ✅ Created user:', user.id);

    // Create identity
    await db.insert(identities).values({
        userId: user.id,
        username: USERNAME,
        displayName: DISPLAY_NAME,
    });

    console.log('[Owner] ✅ Created identity: @thesystem / "The System"');
    console.log('\nDone. Now run: npx tsx scripts/set-owner-avatar.ts');
    process.exit(0);
}

createOwner().catch(err => {
    console.error('[Owner] ❌ Failed:', err);
    process.exit(1);
});
