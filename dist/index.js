import Fastify from 'fastify';
import cors from '@fastify/cors';
import rawBody from 'fastify-raw-body';
// Route imports
import healthRoutes from './routes/health.js';
import ledgerRoutes from './routes/ledger.js';
import contractRoutes from './routes/contracts.js'; // Legacy (deprecated)
import contractReadRoutes from './routes/contracts-read.js'; // NEW: /v1/contracts
import contractWriteRoutes from './routes/contracts-write.js';
import profileRoutes from './routes/profiles.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import identityRoutes from './routes/identity.js';
import webhookRoutes from './routes/webhooks.js';
import connectRoutes from './routes/connect.js';
import stripeConnectRoutes from './routes/stripe-connect.js';
import quoteRoutes from './routes/quote.js';
import opsRoutes from './routes/ops.js';
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
        console.error('❌ FATAL: Missing required env vars:', missing.join(', '));
        process.exit(1);
    }
    // Validate Stripe key format
    if (!process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
        console.error('❌ FATAL: STRIPE_SECRET_KEY must start with sk_');
        process.exit(1);
    }
    if (!process.env.STRIPE_CLIENT_ID?.startsWith('ca_')) {
        console.error('❌ FATAL: STRIPE_CLIENT_ID must start with ca_');
        process.exit(1);
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')) {
        console.error('❌ FATAL: STRIPE_WEBHOOK_SECRET must start with whsec_');
        process.exit(1);
    }
    console.log('✅ All required Stripe env vars validated');
}
async function main() {
    const fastify = Fastify({
        logger: {
            level: 'info',
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
        global: false, // Only on routes that request it
        encoding: 'utf8',
        runFirst: true, // Run before JSON parser
    });
    // Global Auth Hook - parse token and set userId on every request
    fastify.addHook('preHandler', async (request) => {
        const authHeader = request.headers.authorization;
        console.log('[Auth Hook] Path:', request.url, 'Auth header:', authHeader ? 'present' : 'missing');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try {
                const { verifyAccessToken } = await import('./services/auth.js');
                request.userId = verifyAccessToken(token);
                console.log('[Auth Hook] Token valid, userId:', request.userId);
            }
            catch (err) {
                console.log('[Auth Hook] Token invalid:', err.message);
                request.userId = undefined;
            }
        }
    });
    // Global Error Handler (Envelope Consistency)
    fastify.setErrorHandler((error, request, reply) => {
        const statusCode = error.statusCode || 500;
        let code = error.code || 'INTERNAL_SERVER_ERROR';
        // Map status codes to readable error codes if generic
        if (!error.code || typeof error.code === 'number') {
            if (statusCode === 400)
                code = 'BAD_REQUEST';
            if (statusCode === 401)
                code = 'UNAUTHORIZED';
            if (statusCode === 403)
                code = 'FORBIDDEN';
            if (statusCode === 404)
                code = 'NOT_FOUND';
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
    // Health check (no auth)
    await fastify.register(healthRoutes);
    // Legacy read-only endpoints (deprecated, kept for backward compat)
    await fastify.register(ledgerRoutes);
    await fastify.register(contractRoutes);
    await fastify.register(profileRoutes);
    await fastify.register(usersRoutes);
    // Identity & Auth
    await fastify.register(authRoutes);
    await fastify.register(identityRoutes);
    await fastify.register(connectRoutes);
    await fastify.register(stripeConnectRoutes); // Stripe Connect OAuth
    await fastify.register(quoteRoutes);
    // V1 Contract endpoints (CANONICAL)
    await fastify.register(contractReadRoutes); // GET /v1/contracts, GET /v1/contracts/:id
    await fastify.register(contractWriteRoutes); // POST /v1/contracts, /funding-intent, /execute
    // Webhooks
    await fastify.register(webhookRoutes); // POST /v1/stripe/webhook
    // Ops/Admin routes (no prefix, token-protected)
    await fastify.register(opsRoutes); // POST /ops/run-verification, etc.
    // Start server
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   COLLATERAL BACKEND                       ║
║                   USD-first • Append-only                  ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                   ║
║                                                           ║
║  V1 API (CANONICAL):                                      ║
║    GET  /v1/contracts           User's contracts (auth)   ║
║    GET  /v1/contracts/:id       Contract detail (auth)    ║
║    POST /v1/contracts           Create contract           ║
║    POST /v1/contracts/:id/funding-intent   Stripe intent  ║
║    POST /v1/contracts/:id/execute          EXECUTE        ║
║    POST /v1/stripe/webhook      Stripe events             ║
║    POST /v1/connect/x/start     X proof-of-control        ║
║    POST /v1/connect/x/verify    Verify X bio              ║
║    POST /v1/contracts/quote     Get pricing quote         ║
║                                                           ║
║  Other endpoints:                                         ║
║    GET  /health                 Health check              ║
║    POST /auth/login             Email/passkey login       ║
║    GET  /profiles/:username     Public profile            ║
╚═══════════════════════════════════════════════════════════╝
    `);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map