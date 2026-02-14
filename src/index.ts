import 'dotenv/config';
import http from 'node:http';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rawBody from 'fastify-raw-body';

// Route imports
import healthRoutes from './routes/health.js';
import ledgerRoutes from './routes/ledger.js';
import contractRoutes from './routes/contracts.js';           // Legacy (deprecated)
import contractReadRoutes from './routes/contracts-read.js';  // NEW: /v1/contracts
import contractWriteRoutes from './routes/contracts-write.js';
import profileRoutes from './routes/profiles.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import identityRoutes from './routes/identity.js';
import webhookRoutes from './routes/webhooks.js';
import connectRoutes from './routes/connect.js';
import xOAuthRoutes from './routes/x-oauth.js';  // X OAuth (replaces bio challenge)
import stripeConnectRoutes from './routes/stripe-connect.js';
import quoteRoutes from './routes/quote.js';
import opsRoutes from './routes/ops.js';
import billingRoutes from './routes/billing.js';
import payoutRoutes from './routes/payouts.js';
import waitlistRoutes from './routes/waitlist.js';
import salesRoutes from './routes/sales.js';
import commerceRoutes from './routes/commerce.js';
import marketRoutes from './routes/market.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

// =========================================================
// PRODUCTION ASSERTIONS - Fail fast on missing config
// =========================================================
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

if (IS_PRODUCTION) {
    const requiredEnvVars = [
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'STRIPE_CLIENT_ID',
        'DATABASE_URL',
    ];

    const missing = requiredEnvVars.filter(v => !process.env[v]);
    if (missing.length > 0) {
        console.error('⚠️ WARNING: Missing env vars:', missing.join(', '), '— some features will not work');
    }

    // Validate Stripe key formats (warn only)
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        console.error('⚠️ WARNING: STRIPE_SECRET_KEY should start with sk_');
    }
    if (process.env.STRIPE_CLIENT_ID && !process.env.STRIPE_CLIENT_ID.startsWith('ca_')) {
        console.error('⚠️ WARNING: STRIPE_CLIENT_ID should start with ca_');
    }
    if (process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
        console.error('⚠️ WARNING: STRIPE_WEBHOOK_SECRET should start with whsec_');
    }

    if (missing.length === 0) {
        console.log('✅ All required Stripe env vars validated');
    }
}

// =========================================================
// TWO-PHASE STARTUP
// Phase 1: Bind to PORT immediately — /health returns 200
// Phase 2: Boot Fastify, hand off all requests to it
// =========================================================

let fastifyHandler: ((req: http.IncomingMessage, res: http.ServerResponse) => void) | null = null;

const server = http.createServer((req, res) => {
    // Once Fastify is ready, delegate ALL requests to it
    if (fastifyHandler) {
        return fastifyHandler(req, res);
    }

    // Phase 1: Only /health works while Fastify boots
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'collateral-backend',
            version: '1.0.0',
            phase: 'booting',
        }));
        return;
    }

    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: 'Service starting...' }));
});

// Bind to PORT immediately — Railway healthcheck passes within seconds
server.listen(PORT, '0.0.0.0', () => {
    console.log(`[startup] ✅ Phase 1: Health endpoint live on 0.0.0.0:${PORT}`);
    bootFastify();
});

// =========================================================
// Phase 2: Full Fastify boot
// =========================================================
async function bootFastify() {
    try {
        const fastify = Fastify({
            logger: { level: 'info' },
            serverFactory: (handler) => {
                // Capture the Fastify handler, reuse the existing server
                fastifyHandler = handler;
                return server;
            },
        });

        // CORS
        await fastify.register(cors, {
            origin: true,
            credentials: true,
        });

        // Raw body support for Stripe webhook signature verification
        await fastify.register(rawBody, {
            field: 'rawBody',
            global: false,           // Only on routes that request it
            encoding: 'utf8',
            runFirst: true,          // Run before JSON parser
        });

        // Global Auth Hook - parse token and set userId on every request
        fastify.addHook('preHandler', async (request) => {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.slice(7);
                try {
                    const { verifyAccessToken } = await import('./services/auth.js');
                    request.userId = verifyAccessToken(token);
                } catch (err) {
                    request.userId = undefined;
                }
            }
        });

        // Global Error Handler (Envelope Consistency)
        fastify.setErrorHandler((error: any, request, reply) => {
            const statusCode = error.statusCode || 500;
            let code = error.code || 'INTERNAL_SERVER_ERROR';

            // Map status codes to readable error codes if generic
            if (!error.code || typeof error.code === 'number') {
                if (statusCode === 400) code = 'BAD_REQUEST';
                if (statusCode === 401) code = 'UNAUTHORIZED';
                if (statusCode === 403) code = 'FORBIDDEN';
                if (statusCode === 404) code = 'NOT_FOUND';
            }

            // Log 5xx errors
            if (statusCode >= 500) {
                request.log.error(error);
            }

            reply.status(statusCode).send({
                ok: false,
                code,
                error: error.message || 'Unknown error',
            });
        });

        // =========================================================
        // Route Registration
        // =========================================================
        async function safeRegister(name: string, plugin: any) {
            const start = Date.now();
            try {
                await fastify.register(plugin);
                console.log(`[startup] ✅ ${name} registered (${Date.now() - start}ms)`);
            } catch (err) {
                console.error(`[startup] ❌ ${name} FAILED (${Date.now() - start}ms):`, err);
            }
        }

        console.log('[startup] Registering routes...');

        // Health check (no auth) — FIRST
        await safeRegister('health', healthRoutes);

        // Legacy read-only endpoints
        await safeRegister('ledger', ledgerRoutes);
        await safeRegister('contracts-legacy', contractRoutes);
        await safeRegister('profiles', profileRoutes);
        await safeRegister('users', usersRoutes);

        // Identity & Auth
        await safeRegister('auth', authRoutes);
        await safeRegister('identity', identityRoutes);
        await safeRegister('connect', connectRoutes);
        await safeRegister('x-oauth', xOAuthRoutes);
        await safeRegister('stripe-connect', stripeConnectRoutes);
        await safeRegister('quote', quoteRoutes);

        // V1 Contract endpoints
        await safeRegister('contracts-read', contractReadRoutes);
        await safeRegister('contracts-write', contractWriteRoutes);

        // Billing, Payouts, Webhooks
        await safeRegister('billing', billingRoutes);
        await safeRegister('payouts', payoutRoutes);
        await safeRegister('webhooks', webhookRoutes);

        // Ops, Waitlist, Sales, Commerce
        await safeRegister('ops', opsRoutes);
        await safeRegister('waitlist', waitlistRoutes);
        await safeRegister('sales', salesRoutes);
        await safeRegister('commerce', commerceRoutes);
        await safeRegister('market', marketRoutes);

        console.log('[startup] All routes queued, calling ready()...');

        // ready() executes all registered plugins — DO NOT call listen()
        // since serverFactory reuses the already-listening http server
        await fastify.ready();
        console.log(`[startup] ✅ Phase 2: Fastify ready — full API available on 0.0.0.0:${PORT}`);

    } catch (err) {
        console.error('[startup] ❌ Fastify boot failed:', err);
        console.error('[startup]    Health endpoint still running — deploy is alive');
        // DO NOT process.exit — keep the health server running
    }
}
