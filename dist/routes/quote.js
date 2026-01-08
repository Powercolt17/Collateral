/**
 * Contract Quote Routes
 *
 * POST /v1/contracts/quote - Get pricing quote for a contract
 */
import { calculateQuote, validateQuoteInput } from '../services/contract-calculator.js';
async function quoteRoutes(fastify) {
    /**
     * POST /v1/contracts/quote
     *
     * Calculate contract threshold based on baseline, tier, and window.
     * Returns deterministic quote with full explanation for audit.
     *
     * Auth: Requires logged-in user (to prevent abuse/scraping)
     */
    fastify.post('/v1/contracts/quote', {
        preHandler: async (request, reply) => {
            if (!request.userId) {
                return reply.status(401).send({ ok: false, code: 'AUTH_REQUIRED', error: 'Authentication required' });
            }
        },
    }, async (request, reply) => {
        try {
            const body = request.body;
            // Pre-validation: Explicit minWindow check for clearer error
            const platform = body?.platform;
            const windowDays = typeof body?.windowDays === 'number' ? body.windowDays : 30;
            if (platform === 'STRIPE' && windowDays < 30) {
                return reply.status(400).send({
                    ok: false,
                    code: 'WINDOW_TOO_SHORT',
                    error: `Minimum windowDays for STRIPE is 30. Got ${windowDays}.`,
                });
            }
            if (platform === 'X' && windowDays < 14) {
                return reply.status(400).send({
                    ok: false,
                    code: 'WINDOW_TOO_SHORT',
                    error: `Minimum windowDays for X is 14. Got ${windowDays}.`,
                });
            }
            const input = validateQuoteInput(request.body);
            const quote = calculateQuote(input);
            return reply.status(200).send({
                ok: true,
                message: 'Quote calculated',
                ...quote,
            });
        }
        catch (err) {
            const error = err;
            return reply.status(400).send({
                ok: false,
                code: 'INVALID_QUOTE_INPUT',
                error: error.message,
            });
        }
    });
    /**
     * GET /v1/contracts/quote/tiers
     *
     * Returns tier configuration for UI display
     */
    fastify.get('/v1/contracts/quote/tiers', async (_request, reply) => {
        return reply.status(200).send({
            tiers: [
                {
                    tier: 'STANDARD',
                    targetWinRate: 0.30,
                    description: 'Achievable with focused effort',
                    multiplier: 1.0,
                },
                {
                    tier: 'ADVANCED',
                    targetWinRate: 0.20,
                    description: 'Challenging but realistic',
                    multiplier: 1.35,
                },
                {
                    tier: 'ELITE',
                    targetWinRate: 0.10,
                    description: 'High difficulty, high stakes',
                    multiplier: 1.90,
                },
            ],
        });
    });
}
export default quoteRoutes;
//# sourceMappingURL=quote.js.map