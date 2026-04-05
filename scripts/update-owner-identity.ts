/**
 * One-time script: Update owner identity
 * Run: npx tsx scripts/update-owner-identity.ts
 */
import 'dotenv/config';
import { db } from '../src/db/client.js';
import { users, identities } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

async function updateOwnerIdentity() {
    const OWNER_EMAIL = 'support@collateral.market';
    const NEW_DISPLAY_NAME = 'The System';
    const NEW_USERNAME = 'system';

    console.log(`[Owner] Looking up ${OWNER_EMAIL}...`);

    // Find the user
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, OWNER_EMAIL))
        .limit(1);

    if (!user) {
        console.error(`[Owner] ❌ User not found: ${OWNER_EMAIL}`);
        process.exit(1);
    }

    console.log(`[Owner] Found user: ${user.id}`);

    // Find their identity
    const [identity] = await db
        .select()
        .from(identities)
        .where(eq(identities.userId, user.id))
        .limit(1);

    if (!identity) {
        console.error('[Owner] ❌ Identity not found');
        process.exit(1);
    }

    console.log(`[Owner] Current identity: @${identity.username} / "${identity.displayName}"`);

    // Check if 'principal' username is taken
    const [existing] = await db
        .select()
        .from(identities)
        .where(eq(identities.username, NEW_USERNAME))
        .limit(1);

    if (existing && existing.userId !== user.id) {
        console.error(`[Owner] ❌ Username '${NEW_USERNAME}' is already taken by another user`);
        process.exit(1);
    }

    // Update
    const [updated] = await db
        .update(identities)
        .set({
            displayName: NEW_DISPLAY_NAME,
            username: NEW_USERNAME,
            updatedAt: new Date(),
        })
        .where(eq(identities.userId, user.id))
        .returning();

    console.log(`[Owner] ✅ Updated identity:`);
    console.log(`   Username:     @${updated.username}`);
    console.log(`   Display Name: ${updated.displayName}`);
    console.log(`\nDone. Log out and back in to see changes.`);

    process.exit(0);
}

updateOwnerIdentity().catch(err => {
    console.error('[Owner] ❌ Failed:', err);
    process.exit(1);
});
