/**
 * Set The System's avatar directly via API
 * Run: npx tsx scripts/set-owner-avatar.ts
 */
import 'dotenv/config';
import { db } from '../src/db/client.js';
import { users, identities } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function setOwnerAvatar() {
    const OWNER_EMAIL = 'support@collateral.market';

    // Read the image file and convert to base64 data URI
    const imagePath = resolve(import.meta.dirname, '..', 'system_avatar.png');
    const imageBuffer = readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    console.log(`[Avatar] Image size: ${(imageBuffer.length / 1024).toFixed(1)}KB`);
    console.log(`[Avatar] Looking up ${OWNER_EMAIL}...`);

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, OWNER_EMAIL))
        .limit(1);

    if (!user) {
        console.error('[Avatar] ❌ User not found');
        process.exit(1);
    }

    const [updated] = await db
        .update(identities)
        .set({
            photoUrl: dataUri,
            updatedAt: new Date(),
        })
        .where(eq(identities.userId, user.id))
        .returning();

    console.log(`[Avatar] ✅ Avatar set for @${updated.username}`);
    console.log(`[Avatar] photoUrl length: ${updated.photoUrl?.length} chars`);
    console.log('\nDone. Log out and back in to see it.');

    process.exit(0);
}

setOwnerAvatar().catch(err => {
    console.error('[Avatar] ❌ Failed:', err);
    process.exit(1);
});
