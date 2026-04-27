/**
 * Onboarding Drip Email Job
 * 
 * Runs as part of the scheduler cycle. Finds users who:
 * 1. Signed up 1+ hours ago but have no contracts (Nudge 1)
 * 2. Signed up 24+ hours ago, still no contracts (Nudge 2) 
 * 3. Signed up 72+ hours ago, still no contracts (Final push)
 * 
 * Uses a simple drip_emails_sent jsonb column on users to track which
 * drip stage has been sent. Falls back to checking contracts table.
 * 
 * All sends are fire-and-forget — failures never block.
 */

import { db } from '../db/client.js';
import { users, contracts, connectedAccounts, identities } from '../db/schema.js';
import { eq, sql, and, lt, isNull } from 'drizzle-orm';

// Lazy import email service to avoid circular deps
async function getSafeSend() {
    const { Resend } = await import('resend');
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.EMAIL_FROM || 'Collateral <notifications@collateral.market>';
    if (!RESEND_API_KEY) return null;
    const client = new Resend(RESEND_API_KEY);
    return { client, FROM_EMAIL };
}

const DOMAIN = process.env.APP_URL || 'https://collateral.market';

// ================================================================
// DRIP EMAIL TEMPLATES
// ================================================================

function baseTemplate(title: string, body: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:left;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:3px;height:18px;background:#752122;display:inline-block;vertical-align:middle;"></div>
                <span style="font-size:13px;font-weight:800;color:#111;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">COLLATERAL</span>
            </div>
        </div>
        <div style="background:#ffffff;border:1px solid #e5e5e5;padding:40px 32px;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;color:#111;letter-spacing:-0.3px;margin:0 0 24px 0;line-height:1.3;">
                ${title}
            </h1>
            ${body}
        </div>
        <div style="text-align:center;padding:16px 0;">
            <p style="font-size:11px;color:#999;margin:0;line-height:1.6;">
                This is an automated message from Collateral Protocol.<br>
                <a href="${DOMAIN}" style="color:#752122;text-decoration:none;">collateral.market</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Nudge 1: 1 hour after signup — gentle reminder
function drip1Email(username: string): { subject: string; html: string } {
    return {
        subject: "You signed up — now what?",
        html: baseTemplate("You're in. Let's move.", `
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Hey @${username} — you created your Collateral account but haven't taken the next step yet.
            </p>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Here's what to do next:
            </p>
            <div style="background:#f9fafb;border:1px solid #f0f0f0;padding:20px;margin-bottom:24px;">
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr><td style="padding:8px 0;color:#111;border-bottom:1px solid #f0f0f0;"><strong>1.</strong> Connect a platform (Stripe, X, Shopify, or Amazon)</td></tr>
                    <tr><td style="padding:8px 0;color:#111;border-bottom:1px solid #f0f0f0;"><strong>2.</strong> Browse available contracts</td></tr>
                    <tr><td style="padding:8px 0;color:#111;"><strong>3.</strong> Lock capital against a growth target</td></tr>
                </table>
            </div>
            <a href="${DOMAIN}/#/sources" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                Connect Your First Source →
            </a>
        `),
    };
}

// Nudge 2: 24 hours — create urgency
function drip2Email(username: string): { subject: string; html: string } {
    return {
        subject: "Still thinking about it?",
        html: baseTemplate("24 hours in. Zero contracts.", `
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                @${username} — you've been on Collateral for a full day now, but you haven't created a contract yet.
            </p>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Most people who sign up and never act just wanted to check it out. But you're not most people — you signed up because you have a goal.
            </p>
            <div style="background:#fef2f2;border:1px solid #fecaca;padding:20px;margin-bottom:24px;text-align:center;">
                <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:4px;">The difference between a goal and a commitment?</div>
                <div style="font-size:14px;color:#991b1b;font-weight:600;">Money on the line.</div>
            </div>
            <a href="${DOMAIN}/#/overview" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                Browse Contracts →
            </a>
        `),
    };
}

// Nudge 3: 72 hours — final push
function drip3Email(username: string): { subject: string; html: string } {
    return {
        subject: "Last reminder from Collateral",
        html: baseTemplate("Are you serious about this?", `
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                @${username} — this is the last time we'll email you about this. 
            </p>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                You signed up 3 days ago. Contracts start at $25. If you're serious about hitting your growth targets, put money where your metrics are. If not, no hard feelings.
            </p>
            <div style="background:#f9fafb;border:1px solid #f0f0f0;padding:20px;margin-bottom:24px;">
                <p style="font-size:13px;color:#444;line-height:1.7;margin:0;">
                    <strong>What happens when you lock capital:</strong><br>
                    → You pick a metric (revenue, followers, sales)<br>
                    → You set a target and deadline<br>
                    → Hit it = get paid up to 4x<br>
                    → Miss it = lose your stake
                </p>
            </div>
            <a href="${DOMAIN}/#/overview" style="display:inline-block;background:#5C1414;color:#fff;padding:14px 32px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                Create Your First Contract →
            </a>
            <p style="font-size:11px;color:#bbb;margin:16px 0 0 0;">
                You won't receive any more onboarding emails after this.
            </p>
        `),
    };
}

// ================================================================
// DRIP JOB RUNNER
// ================================================================

export interface DripJobResult {
    sent: number;
    skipped: number;
    errors: number;
    durationMs: number;
}

export async function runDripEmailJob(): Promise<DripJobResult> {
    const start = Date.now();
    let sent = 0, skipped = 0, errors = 0;

    const emailClient = await getSafeSend();
    if (!emailClient) {
        console.log('[DripEmail] ⚠️ No RESEND_API_KEY — skipping drip job');
        return { sent: 0, skipped: 0, errors: 0, durationMs: Date.now() - start };
    }

    try {
        // Find users who signed up but have NO contracts
        // We use a subquery to check for absence of contracts
        const usersWithoutContracts = await db
            .select({
                id: users.id,
                email: users.email,
                createdAt: users.createdAt,
            })
            .from(users)
            .where(
                and(
                    // Has an email
                    sql`${users.email} IS NOT NULL`,
                    // Signed up at least 1 hour ago
                    lt(users.createdAt, sql`NOW() - INTERVAL '1 hour'`),
                    // No contracts at all
                    sql`NOT EXISTS (SELECT 1 FROM contracts WHERE contracts.principal_user_id = ${users.id})`
                )
            )
            .limit(50); // Process 50 at a time to avoid overload

        for (const user of usersWithoutContracts) {
            if (!user.email) { skipped++; continue; }

            try {
                // Get username
                const [identity] = await db
                    .select({ username: identities.username })
                    .from(identities)
                    .where(eq(identities.userId, user.id))
                    .limit(1);

                const username = identity?.username || 'there';
                const hoursSinceSignup = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);

                // Determine which drip to send based on a simple tracking key
                // We store sent drips in a tracking mechanism using localStorage-like approach
                // but server-side, we'll use a simple check: 
                // - 1-2 hours: drip 1
                // - 24-48 hours: drip 2  
                // - 72-96 hours: drip 3
                // Outside these windows = already sent or not yet due

                let emailData: { subject: string; html: string } | null = null;
                let dripStage = '';

                if (hoursSinceSignup >= 1 && hoursSinceSignup < 2) {
                    emailData = drip1Email(username);
                    dripStage = 'drip_1';
                } else if (hoursSinceSignup >= 24 && hoursSinceSignup < 25) {
                    emailData = drip2Email(username);
                    dripStage = 'drip_2';
                } else if (hoursSinceSignup >= 72 && hoursSinceSignup < 73) {
                    emailData = drip3Email(username);
                    dripStage = 'drip_3';
                }

                if (!emailData) { skipped++; continue; }

                // Send the email
                const result = await emailClient.client.emails.send({
                    from: emailClient.FROM_EMAIL,
                    to: user.email,
                    subject: emailData.subject,
                    html: emailData.html,
                });

                const { data, error } = result as any;
                if (error) {
                    console.error(`[DripEmail] ❌ Failed ${dripStage} → ${user.email}:`, error);
                    errors++;
                } else {
                    console.log(`[DripEmail] ✅ Sent ${dripStage} → ${user.email} (id: ${data?.id})`);
                    sent++;
                }
            } catch (err: any) {
                console.error(`[DripEmail] ❌ Error processing user ${user.id}:`, err.message);
                errors++;
            }
        }
    } catch (err: any) {
        console.error('[DripEmail] ❌ Job failed:', err.message);
        errors++;
    }

    const duration = Date.now() - start;
    console.log(`[DripEmail] Complete in ${duration}ms — sent: ${sent}, skipped: ${skipped}, errors: ${errors}`);
    return { sent, skipped, errors, durationMs: duration };
}
