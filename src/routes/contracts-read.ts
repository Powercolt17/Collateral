/**
 * Contract Read Routes (v1)
 * 
 * All endpoints return derived state computed from ledger events.
 * Auth required - users can only read their own contracts.
 * 
 * Endpoints:
 *   GET /v1/contracts           - List user's contracts
 *   GET /v1/contracts/:id       - Contract detail with events timeline
 * 
 * SECURITY:
 * - metadataJson is deep-sanitized to remove sensitive fields at any nesting level
 * - challengeCode, Stripe secrets, raw webhook payloads NEVER returned
 */

import { FastifyPluginAsync } from 'fastify';
import { getContract, getContractWithState, getContractsForUser } from '../services/contracts.js';
import { getEventsForContract } from '../services/ledger.js';
import { isTerminalState } from '../services/state-derivation.js';
import { EventType } from '../db/schema.js';

// Sensitive metadata fields to strip from responses (at any nesting level)
const SENSITIVE_METADATA_FIELDS = new Set([
    'challengeCode',
    'clientSecret',
    'accessToken',
    'refreshToken',
    'webhookPayload',
    'rawResponse',
]);

/**
 * Deep sanitize metadata to remove sensitive fields at any nesting level
 * Recursively traverses objects and arrays
 */
function sanitizeMetadataDeep(value: unknown): unknown {
    if (value === null || value === undefined) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeMetadataDeep);
    }

    if (typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        const sanitized: Record<string, unknown> = {};

        for (const [key, val] of Object.entries(obj)) {
            // Skip sensitive fields at any level
            if (SENSITIVE_METADATA_FIELDS.has(key)) {
                continue;
            }
            // Recursively sanitize nested values
            sanitized[key] = sanitizeMetadataDeep(val);
        }

        return sanitized;
    }

    // Primitive values pass through unchanged
    return value;
}

const contractReadRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /v1/contracts
     * List the authenticated user's contracts
     * 
     * Returns contracts ordered by createdAt desc with derived state
     */
    fastify.get('/v1/contracts', async (request, reply) => {
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const contractsWithState = await getContractsForUser(userId);

        // Sort by createdAt desc
        contractsWithState.sort((a, b) =>
            b.contract.createdAt.getTime() - a.contract.createdAt.getTime()
        );

        return {
            contracts: contractsWithState.map(({ contract, state }) => ({
                id: contract.id,
                platform: contract.platform,
                metricType: contract.metricType,
                deadlineUtc: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                payoutAmountUsdCents: contract.payoutAmountUsdCents,
                riskTier: contract.riskTier,
                createdAt: contract.createdAt.toISOString(),
                derivedState: state,
                isTerminal: isTerminalState(state),
            })),
        };
    });

    /**
     * GET /v1/contracts/:id
     * Contract detail view with events timeline
     * 
     * Auth required - must be contract owner
     * Returns:
     * - Contract core fields
     * - Derived state
     * - Binding snapshot IDs
     * - Ordered events timeline (sanitized metadata)
     * - Receipt summary (if RECEIPT_ISSUED exists)
     */
    fastify.get<{
        Params: { id: string };
    }>('/v1/contracts/:id', async (request, reply) => {
        const { id } = request.params;
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const result = await getContractWithState(id);

        if (!result) {
            reply.status(404);
            return { error: 'Contract not found', code: 'CONTRACT_NOT_FOUND' };
        }

        const { contract, state } = result;

        // Auth: must be contract owner
        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not authorized to view this contract', code: 'FORBIDDEN' };
        }

        const events = await getEventsForContract(id);

        // Check for receipt
        const receiptEvent = events.find(e => e.eventType === EventType.RECEIPT_ISSUED);
        const receipt = receiptEvent ? {
            issuedAt: receiptEvent.timestampUtc.toISOString(),
            eventHash: receiptEvent.eventHash,
        } : null;

        return {
            contract: {
                id: contract.id,
                principalIdentityUsername: contract.principalIdentityUsername,
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                baseline: contract.baselineJson,
                deadlineUtc: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                payoutAmountUsdCents: contract.payoutAmountUsdCents,
                fundingMethod: contract.fundingMethod,
                riskTier: contract.riskTier,
                createdAt: contract.createdAt.toISOString(),
                derivedState: state,
                isTerminal: isTerminalState(state),
                // Binding snapshots
                stripeBindingId: contract.stripeBindingId,
                githubBindingId: contract.githubBindingId,
                recordHash: contract.recordHash,
            },
            events: events.map(event => ({
                id: event.id,
                timestampUtc: event.timestampUtc.toISOString(),
                eventType: event.eventType,
                actor: event.actor,
                externalRef: event.externalRef,
                amountUsdCents: event.amountUsdCents,
                metadata: sanitizeMetadataDeep(event.metadataJson),
                eventHash: event.eventHash,
            })),
            receipt,
        };
    });

    /**
     * GET /v1/contracts/:id/events
     * Event timeline only (for lighter payloads)
     */
    fastify.get<{
        Params: { id: string };
    }>('/v1/contracts/:id/events', async (request, reply) => {
        const { id } = request.params;
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Authentication required', code: 'AUTH_REQUIRED' };
        }

        const contract = await getContract(id);
        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found', code: 'CONTRACT_NOT_FOUND' };
        }

        if (contract.principalUserId !== userId) {
            reply.status(403);
            return { error: 'Not authorized to view this contract', code: 'FORBIDDEN' };
        }

        const events = await getEventsForContract(id);

        return {
            contractId: id,
            events: events.map(event => ({
                id: event.id,
                timestampUtc: event.timestampUtc.toISOString(),
                eventType: event.eventType,
                actor: event.actor,
                externalRef: event.externalRef,
                metadata: sanitizeMetadataDeep(event.metadataJson),
            })),
        };
    });
};

export default contractReadRoutes;
