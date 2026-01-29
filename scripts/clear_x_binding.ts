import { db } from '../src/db/client.js';
import { users, connectedAccounts } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';

const X_USER_ID = '1854742340138631169'; // @collateral_mkt

async function clearOldBinding() {
    console.log('Clearing X binding for X user ID:', X_USER_ID);

    // Clear from users table
    const usersResult = await db
        .update(users)
        .set({
            xUserId: null,
            xUsername: null,
            xConnectedAt: null,
            xAccessToken: null,
            xAccessTokenSecret: null,
            xAccountCreatedAt: null,
        })
        .where(eq(users.xUserId, X_USER_ID))
        .returning({ id: users.id, email: users.email });

    console.log('Cleared from users table:', usersResult);

    // Also clear/revoke from connected_accounts
    const connResult = await db
        .update(connectedAccounts)
        .set({
            status: 'REVOKED',
            verificationStatus: 'PENDING',
            verifiedAt: null,
            metadataJson: null,
        })
        .where(
            and(
                eq(connectedAccounts.externalAccountId, X_USER_ID),
                eq(connectedAccounts.platform, 'X')
            )
        )
        .returning({ userId: connectedAccounts.userId });

    console.log('Revoked from connected_accounts:', connResult);

    console.log('Done! User can now reconnect X account.');
    process.exit(0);
}

clearOldBinding().catch(e => { console.error(e); process.exit(1); });
