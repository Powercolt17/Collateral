/**
 * Contract Quote Routes
 * 
 * POST /v1/contracts/quote - Get pricing quote for a contract
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { calculateQuote, validateQuoteInput } from '../services/contract-calculator.js';

async function quoteRoutes(fastify: FastifyInstance) {
    /**
     * POST /v1/contracts/quote
     * 
     * Calculate contract threshold based on baseline, tier, and window.
     * Returns deterministic quote with full explanation for audit.
     * 
     * Auth: Requires logged-in user (to prevent abuse/scraping)
     */
    fastify.post(
        '/v1/contracts/quote',
        {
            preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
                if (!request.userId) {
                    return reply.status(401).send({ ok: false, code: 'AUTH_REQUIRED', error: 'Authentication required' });
                }
            },
        },
        async (request, reply) => {
            try {
                const body = request.body as Record<string, unknown>;

                // Pre-validation: Explicit minWindow check for clearer error
                const platform = body?.platform as string;
                const windowDays = typeof body?.windowDays === 'number' ? body.windowDays : 30;

                if (platform === 'STRIPE' && windowDays < 14) {
                    return reply.status(400).send({
                        ok: false,
                        code: 'WINDOW_TOO_SHORT',
                        error: `Minimum windowDays for STRIPE is 14. Got ${windowDays}.`,
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
            } catch (err) {
                const error = err as Error;
                return reply.status(400).send({
                    ok: false,
                    code: 'INVALID_QUOTE_INPUT',
                    error: error.message,
                });
            }
        }
    );

    /**
     * GET /v1/contracts/quote/tiers
     * 
     * Returns tier configuration for UI display
     */
    fastify.get(
        '/v1/contracts/quote/tiers',
        async (_request, reply) => {
            return reply.status(200).send({
                tiers: [
                    {
                        tier: 'STANDARD',
                        label: 'Pledge',
                        targetWinRate: 0.30,
                        failRate: '70%',
                        description: 'Looks achievable — 70% fail',
                        payoutMultiplier: 1.75,
                    },
                    {
                        tier: 'ADVANCED',
                        label: 'Stake',
                        targetWinRate: 0.20,
                        failRate: '80%',
                        description: 'Brutal grind — 80% fail',
                        payoutMultiplier: 2.5,
                    },
                    {
                        tier: 'ELITE',
                        label: 'All In',
                        targetWinRate: 0.10,
                        failRate: '90%',
                        description: 'Near impossible — 90% fail',
                        payoutMultiplier: 4.0,
                    },
                ],
            });
        }
    );
}

export default quoteRoutes;
