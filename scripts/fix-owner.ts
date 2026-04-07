import 'dotenv/config';
import { db } from '../src/db/client.js';
import { identities, users } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

async function fix() {
    const [user] = await db.select().from(users).where(eq(users.email, 'support@collateral.market')).limit(1);
    if (!user) { console.log('No owner user found'); process.exit(1); }
    console.log('User:', user.id);

    const [identity] = await db.select().from(identities).where(eq(identities.userId, user.id)).limit(1);
    if (identity) {
        console.log('Current:', identity.username, identity.displayName);
        await db.update(identities)
            .set({ username: 'TheSystem', displayName: 'The System', updatedAt: new Date() })
            .where(eq(identities.userId, user.id));
        console.log('✅ Updated to @TheSystem / The System');
    } else {
        await db.insert(identities).values({ userId: user.id, username: 'TheSystem', displayName: 'The System' });
        console.log('✅ Created @TheSystem');
    }

    const [check] = await db.select({ photoUrl: identities.photoUrl }).from(identities).where(eq(identities.userId, user.id)).limit(1);
    console.log('Avatar:', check?.photoUrl ? 'YES (' + check.photoUrl.length + ' chars)' : 'NO - run set-owner-avatar.ts');
    process.exit(0);
}
fix().catch(e => { console.error(e); process.exit(1); });
