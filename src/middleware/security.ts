/**
 * Security Middleware for Collateral API
 * 
 * - In-memory rate limiter (per-IP, sliding window)
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * - Request sanitization
 */
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// ================================================================
// RATE LIMITER — In-memory sliding window per IP
// ================================================================

interface RateBucket {
    count: number;
    resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

// Cleanup stale buckets every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
        if (now > bucket.resetAt) rateBuckets.delete(key);
    }
}, 5 * 60 * 1000);

/**
 * Per-route rate limit config
 * key = route prefix, value = { max requests, window in seconds }
 */
const RATE_LIMITS: Record<string, { max: number; windowSec: number }> = {
    // Auth — aggressive protection
    '/v1/auth/signin': { max: 10, windowSec: 60 },
    '/v1/auth/signup': { max: 5, windowSec: 60 },
    '/auth/signin': { max: 10, windowSec: 60 },
    '/auth/signup': { max: 5, windowSec: 60 },

    // Contract execution — real money, be strict
    '/v1/contracts/create': { max: 10, windowSec: 60 },
    '/v1/contracts/execute': { max: 5, windowSec: 60 },
    '/v1/contracts/fund': { max: 10, windowSec: 60 },

    // Billing / Payouts
    '/v1/billing': { max: 20, windowSec: 60 },
    '/v1/payouts': { max: 10, windowSec: 60 },

    // Read-heavy endpoints — more generous
    '/v1/contracts': { max: 60, windowSec: 60 },
    '/v1/ledger': { max: 60, windowSec: 60 },
    '/v1/me': { max: 30, windowSec: 60 },
    '/v1/market': { max: 60, windowSec: 60 },
    '/v1/quote': { max: 30, windowSec: 60 },

    // Waitlist
    '/v1/waitlist': { max: 5, windowSec: 60 },

    // Default catch-all
    '__default__': { max: 100, windowSec: 60 },
};

function getClientIP(request: FastifyRequest): string {
    // Trust X-Forwarded-For from Railway/proxy
    const xff = request.headers['x-forwarded-for'];
    if (xff) {
        const first = Array.isArray(xff) ? xff[0] : xff.split(',')[0];
        return first.trim();
    }
    return request.ip || '0.0.0.0';
}

function getRateConfig(url: string): { max: number; windowSec: number } {
    // Find most specific matching route
    for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
        if (prefix !== '__default__' && url.startsWith(prefix)) {
            return config;
        }
    }
    return RATE_LIMITS['__default__'];
}

function checkRateLimit(ip: string, url: string): { allowed: boolean; remaining: number; resetIn: number } {
    const config = getRateConfig(url);
    const key = `${ip}:${url.split('?')[0]}`;
    const now = Date.now();

    let bucket = rateBuckets.get(key);

    if (!bucket || now > bucket.resetAt) {
        bucket = { count: 0, resetAt: now + config.windowSec * 1000 };
        rateBuckets.set(key, bucket);
    }

    bucket.count++;
    const remaining = Math.max(0, config.max - bucket.count);
    const resetIn = Math.ceil((bucket.resetAt - now) / 1000);

    return {
        allowed: bucket.count <= config.max,
        remaining,
        resetIn,
    };
}

// ================================================================
// SECURITY HEADERS
// ================================================================

const SECURITY_HEADERS: Record<string, string> = {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // XSS Protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy — only send origin
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy — disable dangerous APIs
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(self)',

    // HSTS — force HTTPS for 1 year
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // CSP — restrictive content security policy
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://fonts.googleapis.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://collateral-production.up.railway.app https://*.clerk.dev https://*.stripe.com https://api.x.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ].join('; '),
};

// ================================================================
// REGISTER — Wire into Fastify
// ================================================================

export async function registerSecurity(fastify: FastifyInstance) {
    console.log('[security] 🔒 Registering security middleware...');

    // 1. Rate Limiting Hook
    fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        const url = request.url || '';

        // Skip rate limiting for health checks and webhooks
        if (url === '/health' || url === '/' || url.startsWith('/webhooks')) return;

        const ip = getClientIP(request);
        const result = checkRateLimit(ip, url);

        // Always set rate limit headers
        reply.header('X-RateLimit-Remaining', result.remaining.toString());
        reply.header('X-RateLimit-Reset', result.resetIn.toString());

        if (!result.allowed) {
            console.warn(`[security] ⚠️ Rate limited: ${ip} on ${url}`);
            reply.status(429).send({
                ok: false,
                code: 'RATE_LIMITED',
                error: 'Too many requests. Please slow down.',
                retryAfter: result.resetIn,
            });
            return;
        }
    });

    // 2. Security Headers Hook
    fastify.addHook('onSend', async (_request: FastifyRequest, reply: FastifyReply) => {
        for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
            reply.header(header, value);
        }
    });

    // 3. Remove server fingerprint
    fastify.addHook('onSend', async (_request: FastifyRequest, reply: FastifyReply) => {
        reply.removeHeader('x-powered-by');
        reply.removeHeader('server');
    });

    console.log('[security] ✅ Rate limiter + security headers active');
    console.log('[security]    Rate limits:', Object.keys(RATE_LIMITS).length, 'route configs');
}

// ================================================================
// INPUT SANITIZATION HELPERS
// ================================================================

/**
 * Validate stake amount — must be positive integer, within tier bounds
 */
export function validateStakeAmount(amountCents: unknown): { valid: boolean; error?: string; value?: number } {
    if (typeof amountCents !== 'number' || !Number.isFinite(amountCents)) {
        return { valid: false, error: 'Stake amount must be a number' };
    }
    if (amountCents < 0) {
        return { valid: false, error: 'Stake amount cannot be negative' };
    }
    if (!Number.isInteger(amountCents)) {
        return { valid: false, error: 'Stake amount must be an integer (cents)' };
    }
    if (amountCents < 2500) {  // $25 minimum
        return { valid: false, error: 'Minimum stake is $25.00 (2500 cents)' };
    }
    if (amountCents > 2500000) {  // $25,000 maximum
        return { valid: false, error: 'Maximum stake is $25,000.00 (2500000 cents)' };
    }
    return { valid: true, value: amountCents };
}

/**
 * Sanitize string input — prevent injection
 */
export function sanitizeString(input: unknown, maxLength = 200): string {
    if (typeof input !== 'string') return '';
    return input
        .slice(0, maxLength)
        .replace(/[<>'"]/g, '')  // Strip HTML/injection chars
        .trim();
}
