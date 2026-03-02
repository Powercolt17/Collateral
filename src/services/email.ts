/**
 * Email Notification Service — Collateral Protocol
 * 
 * Sends transactional emails via Resend for contract lifecycle events:
 * - Contract execution confirmed
 * - Settlement success (payout queued)
 * - Settlement failure (capital forfeited)
 * 
 * All sends are fire-and-forget — failures are logged but never block the pipeline.
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'Collateral <notifications@collateral.market>';
const DOMAIN = process.env.APP_URL || 'https://collateral.market';

// Lazy-init Resend client (only if API key exists)
let resend: Resend | null = null;
function getClient(): Resend | null {
    if (!RESEND_API_KEY) return null;
    if (!resend) resend = new Resend(RESEND_API_KEY);
    return resend;
}

// ================================================================
// BRANDED EMAIL TEMPLATE
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
        <!-- Header -->
        <div style="text-align:left;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:3px;height:18px;background:#752122;display:inline-block;vertical-align:middle;"></div>
                <span style="font-size:13px;font-weight:800;color:#111;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">COLLATERAL</span>
            </div>
        </div>

        <!-- Card -->
        <div style="background:#ffffff;border:1px solid #e5e5e5;padding:40px 32px;margin-bottom:24px;">
            <h1 style="font-size:22px;font-weight:700;color:#111;letter-spacing:-0.3px;margin:0 0 24px 0;line-height:1.3;">
                ${title}
            </h1>
            ${body}
        </div>

        <!-- Footer -->
        <div style="text-align:center;padding:16px 0;">
            <p style="font-size:11px;color:#999;margin:0;line-height:1.6;">
                This is an automated notification from Collateral Protocol.<br>
                <a href="${DOMAIN}" style="color:#752122;text-decoration:none;">collateral.market</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

function formatUSD(cents: number): string {
    return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function contractIdShort(id: string): string {
    return 'RCPT-' + id.slice(0, 4).toUpperCase();
}

// ================================================================
// EMAIL TEMPLATES
// ================================================================

function executionConfirmedEmail(params: {
    contractId: string;
    platform: string;
    lockAmount: number;
    payoutAmount: number;
    deadline: string;
    metricType?: string;
}): { subject: string; html: string } {
    const shortId = contractIdShort(params.contractId);
    return {
        subject: `Contract Executed — ${formatUSD(params.lockAmount)} locked on ${params.platform}`,
        html: baseTemplate('Capital Locked', `
            <div style="background:#f9fafb;border:1px solid #f0f0f0;padding:20px;margin-bottom:24px;">
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr>
                        <td style="padding:6px 0;color:#888;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Contract</td>
                        <td style="padding:6px 0;color:#111;font-weight:600;text-align:right;font-family:'Courier New',monospace;">${shortId}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#888;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Platform</td>
                        <td style="padding:6px 0;color:#111;font-weight:600;text-align:right;">${params.platform}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#888;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Capital Locked</td>
                        <td style="padding:6px 0;color:#111;font-weight:700;text-align:right;font-size:18px;">${formatUSD(params.lockAmount)}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#888;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Potential Payout</td>
                        <td style="padding:6px 0;color:#15803d;font-weight:700;text-align:right;">${formatUSD(params.payoutAmount)}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#888;font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:1px;">Deadline</td>
                        <td style="padding:6px 0;color:#111;text-align:right;">${new Date(params.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                </table>
            </div>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Your capital has been locked. Verification will occur automatically at the deadline. Meet your target to receive the full payout.
            </p>
            <a href="${DOMAIN}/#/contracts/${params.contractId}" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                View Contract →
            </a>
        `),
    };
}

function settlementSuccessEmail(params: {
    contractId: string;
    platform: string;
    lockAmount: number;
    payoutAmount: number;
}): { subject: string; html: string } {
    const shortId = contractIdShort(params.contractId);
    return {
        subject: `Target Hit — ${formatUSD(params.payoutAmount)} payout queued`,
        html: baseTemplate('Settlement: Target Achieved ✓', `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:20px;margin-bottom:24px;text-align:center;">
                <div style="font-size:32px;font-weight:800;color:#15803d;letter-spacing:-1px;margin-bottom:4px;">
                    ${formatUSD(params.payoutAmount)}
                </div>
                <div style="font-size:11px;color:#16a34a;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
                    Payout Queued
                </div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
                <tr>
                    <td style="padding:8px 0;color:#888;border-bottom:1px solid #f0f0f0;">Contract</td>
                    <td style="padding:8px 0;color:#111;font-weight:600;text-align:right;border-bottom:1px solid #f0f0f0;font-family:'Courier New',monospace;">${shortId}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#888;border-bottom:1px solid #f0f0f0;">Platform</td>
                    <td style="padding:8px 0;color:#111;text-align:right;border-bottom:1px solid #f0f0f0;">${params.platform}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#888;border-bottom:1px solid #f0f0f0;">Capital Returned</td>
                    <td style="padding:8px 0;color:#111;text-align:right;border-bottom:1px solid #f0f0f0;">${formatUSD(params.lockAmount)}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#888;">Total Payout</td>
                    <td style="padding:8px 0;color:#15803d;font-weight:700;text-align:right;font-size:16px;">${formatUSD(params.payoutAmount)}</td>
                </tr>
            </table>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                You met your performance target. Your payout has been queued for processing and will arrive in your connected account.
            </p>
            <a href="${DOMAIN}/#/receipts/${params.contractId}" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                View Receipt →
            </a>
        `),
    };
}

function settlementFailureEmail(params: {
    contractId: string;
    platform: string;
    lockAmount: number;
}): { subject: string; html: string } {
    const shortId = contractIdShort(params.contractId);
    return {
        subject: `Contract Settled — ${formatUSD(params.lockAmount)} forfeited`,
        html: baseTemplate('Settlement: Target Not Met', `
            <div style="background:#fef2f2;border:1px solid #fecaca;padding:20px;margin-bottom:24px;text-align:center;">
                <div style="font-size:32px;font-weight:800;color:#991b1b;letter-spacing:-1px;margin-bottom:4px;">
                    ${formatUSD(params.lockAmount)}
                </div>
                <div style="font-size:11px;color:#b91c1c;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">
                    Capital Forfeited
                </div>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
                <tr>
                    <td style="padding:8px 0;color:#888;border-bottom:1px solid #f0f0f0;">Contract</td>
                    <td style="padding:8px 0;color:#111;font-weight:600;text-align:right;border-bottom:1px solid #f0f0f0;font-family:'Courier New',monospace;">${shortId}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#888;border-bottom:1px solid #f0f0f0;">Platform</td>
                    <td style="padding:8px 0;color:#111;text-align:right;border-bottom:1px solid #f0f0f0;">${params.platform}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0;color:#888;">Amount Forfeited</td>
                    <td style="padding:8px 0;color:#991b1b;font-weight:700;text-align:right;font-size:16px;">${formatUSD(params.lockAmount)}</td>
                </tr>
            </table>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Your performance target was not met within the contract window. The locked capital has been forfeited per the contract terms.
            </p>
            <a href="${DOMAIN}/#/receipts/${params.contractId}" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                View Receipt →
            </a>
        `),
    };
}

// ================================================================
// SEND FUNCTIONS
// ================================================================

async function safeSend(to: string, subject: string, html: string): Promise<void> {
    const client = getClient();
    if (!client) {
        console.log(`[email] ⚠️ Skipped (no RESEND_API_KEY): "${subject}" → ${to}`);
        return;
    }

    try {
        const result = await client.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        });
        console.log(`[email] ✅ Sent: "${subject}" → ${to} (id: ${(result as any)?.data?.id || 'ok'})`);
    } catch (err: any) {
        // NEVER block the pipeline on email failure
        console.error(`[email] ❌ Failed: "${subject}" → ${to}:`, err.message);
    }
}

/**
 * Get user email from database
 */
async function getUserEmail(userId: string): Promise<string | null> {
    try {
        const { db } = await import('../db/client.js');
        const { users } = await import('../db/schema.js');
        const { eq } = await import('drizzle-orm');

        const [user] = await db
            .select({ email: users.email })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return user?.email || null;
    } catch (err) {
        console.error('[email] Failed to fetch user email:', err);
        return null;
    }
}

// ================================================================
// PUBLIC API — Called from contract lifecycle
// ================================================================

/**
 * Send execution confirmed email
 */
export async function sendExecutionEmail(params: {
    userId: string;
    contractId: string;
    platform: string;
    lockAmountCents: number;
    payoutAmountCents: number;
    deadline: string;
    metricType?: string;
}): Promise<void> {
    const email = await getUserEmail(params.userId);
    if (!email) return;

    const { subject, html } = executionConfirmedEmail({
        contractId: params.contractId,
        platform: params.platform,
        lockAmount: params.lockAmountCents,
        payoutAmount: params.payoutAmountCents,
        deadline: params.deadline,
        metricType: params.metricType,
    });

    await safeSend(email, subject, html);
}

/**
 * Send settlement success email
 */
export async function sendSettlementSuccessEmail(params: {
    userId: string;
    contractId: string;
    platform: string;
    lockAmountCents: number;
    payoutAmountCents: number;
}): Promise<void> {
    const email = await getUserEmail(params.userId);
    if (!email) return;

    const { subject, html } = settlementSuccessEmail({
        contractId: params.contractId,
        platform: params.platform,
        lockAmount: params.lockAmountCents,
        payoutAmount: params.payoutAmountCents,
    });

    await safeSend(email, subject, html);
}

/**
 * Send settlement failure (forfeiture) email
 */
export async function sendSettlementFailureEmail(params: {
    userId: string;
    contractId: string;
    platform: string;
    lockAmountCents: number;
}): Promise<void> {
    const email = await getUserEmail(params.userId);
    if (!email) return;

    const { subject, html } = settlementFailureEmail({
        contractId: params.contractId,
        platform: params.platform,
        lockAmount: params.lockAmountCents,
    });

    await safeSend(email, subject, html);
}

// ================================================================
// WELCOME / LIFECYCLE EMAILS
// ================================================================

function welcomeEmail(params: { username: string }): { subject: string; html: string } {
    return {
        subject: 'Welcome to Collateral',
        html: baseTemplate('Welcome to Collateral', `
            <p style="font-size:16px;color:#111;font-weight:600;margin:0 0 16px 0;">
                Hey @${params.username} — you're in.
            </p>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Collateral is the performance contract protocol. Lock capital against measurable outcomes — Stripe revenue, X followers, Shopify sales, Amazon growth. Hit your target, get your payout. Miss, and it's forfeited.
            </p>
            <div style="background:#f9fafb;border:1px solid #f0f0f0;padding:20px;margin-bottom:24px;">
                <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;margin-bottom:12px;">GET STARTED</div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <tr><td style="padding:8px 0;color:#111;border-bottom:1px solid #f0f0f0;"><strong>1.</strong> Connect a platform (Stripe, X, Shopify, Amazon)</td></tr>
                    <tr><td style="padding:8px 0;color:#111;border-bottom:1px solid #f0f0f0;"><strong>2.</strong> Choose a performance contract</td></tr>
                    <tr><td style="padding:8px 0;color:#111;border-bottom:1px solid #f0f0f0;"><strong>3.</strong> Lock your capital ($25 – $25,000)</td></tr>
                    <tr><td style="padding:8px 0;color:#111;"><strong>4.</strong> Hit your target → get paid</td></tr>
                </table>
            </div>
            <a href="${DOMAIN}/#/overview" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                Browse Contracts →
            </a>
        `),
    };
}

function waitlistConfirmationEmail(): { subject: string; html: string } {
    return {
        subject: "You're on the Collateral waitlist",
        html: baseTemplate("You're on the list", `
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                We'll notify you when Collateral opens. You'll be among the first to lock capital against measurable business outcomes.
            </p>
            <div style="background:#f9fafb;border:1px solid #f0f0f0;padding:20px;margin-bottom:24px;">
                <p style="font-size:13px;color:#444;line-height:1.7;margin:0;">
                    <strong>What is Collateral?</strong><br>
                    A performance contract protocol. Pick a growth target — Stripe revenue, X followers, Shopify sales, or Amazon growth. Lock capital. Hit your target and earn a payout. Miss and it's forfeited.
                </p>
            </div>
            <p style="font-size:12px;color:#999;margin:0;">No action needed. We'll be in touch.</p>
        `),
    };
}

function sourceConnectedEmail(params: { platform: string; username?: string }): { subject: string; html: string } {
    return {
        subject: `${params.platform} connected to Collateral`,
        html: baseTemplate(`${params.platform} Connected`, `
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:16px 20px;margin-bottom:24px;">
                <div style="font-size:14px;font-weight:600;color:#111;">&#10003; ${params.platform} verified</div>
                ${params.username ? `<div style="font-size:12px;color:#666;">@${params.username}</div>` : ''}
            </div>
            <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px 0;">
                Your ${params.platform} account has been connected for read-only verification. You can now create performance contracts that track ${params.platform} metrics.
            </p>
            <a href="${DOMAIN}/#/overview" style="display:inline-block;background:#111;color:#fff;padding:12px 28px;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">
                Create Contract →
            </a>
        `),
    };
}

/**
 * Send welcome email on signup
 */
export async function sendWelcomeEmail(email: string, username: string): Promise<void> {
    const { subject, html } = welcomeEmail({ username });
    await safeSend(email, subject, html);
}

/**
 * Send waitlist confirmation
 */
export async function sendWaitlistEmail(email: string): Promise<void> {
    const { subject, html } = waitlistConfirmationEmail();
    await safeSend(email, subject, html);
}

/**
 * Send source connected notification
 */
export async function sendSourceConnectedEmail(params: {
    userId: string;
    platform: string;
    username?: string;
}): Promise<void> {
    const email = await getUserEmail(params.userId);
    if (!email) return;
    const { subject, html } = sourceConnectedEmail({ platform: params.platform, username: params.username });
    await safeSend(email, subject, html);
}
