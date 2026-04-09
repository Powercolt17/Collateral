/**
 * Contract Routes (Read-Only)
 * 
 * All endpoints return derived state computed from ledger events.
 * No state is persisted on the contract record.
 */

import { FastifyPluginAsync } from 'fastify';
import { getContract, getContractWithState, getContractsForUser } from '../services/contracts.js';
import { getEventsForContract } from '../services/ledger.js';
import { deriveState } from '../services/state-derivation.js';
import { db } from '../db/client.js';
import { ledgerEvents, contracts, EventType } from '../db/schema.js';
import { desc, inArray, sql } from 'drizzle-orm';

const contractRoutes: FastifyPluginAsync = async (fastify) => {
    /**
     * GET /contracts/:id
     * Single contract view with derived state
     * Powers: Contract Receipt (/contract/:id) in Aura
     */
    fastify.get<{
        Params: { id: string };
    }>('/contracts/:id', async (request, reply) => {
        const { id } = request.params;

        const result = await getContractWithState(id);

        if (!result) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        const { contract, state } = result;
        const events = await getEventsForContract(id);

        return {
            contract: {
                id: contract.id,
                principalUserId: contract.principalUserId,
                principalIdentityUsername: contract.principalIdentityUsername,
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                baseline: contract.baselineJson,
                deadline: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                fundingMethod: contract.fundingMethod,
                riskTier: contract.riskTier,
                state, // Derived from ledger events, never persisted
                recordHash: contract.recordHash,
                socialBonusEnabled: contract.socialBonusEnabled ?? false,
                socialBonusVerified: contract.socialBonusVerified ?? false,
                socialBonusTweetId: contract.socialBonusTweetId ?? null,
                createdAt: contract.createdAt.toISOString(),
                updatedAt: contract.updatedAt.toISOString(),
            },
            events: events.map(event => ({
                id: event.id,
                actor: event.actor,
                eventType: event.eventType,
                timestamp: event.timestampUtc.toISOString(),
                amountUsdCents: event.amountUsdCents,
                externalRef: event.externalRef,
                metadata: event.metadataJson,
                eventHash: event.eventHash,
            })),
        };
    });

    /**
     * GET /contracts/:id/ledger
     * Ordered ledger events for a contract
     */
    fastify.get<{
        Params: { id: string };
    }>('/contracts/:id/ledger', async (request, reply) => {
        const { id } = request.params;

        const contract = await getContract(id);
        if (!contract) {
            reply.status(404);
            return { error: 'Contract not found' };
        }

        const events = await getEventsForContract(id);

        return {
            contractId: id,
            events: events.map(event => ({
                id: event.id,
                actor: event.actor,
                eventType: event.eventType,
                timestamp: event.timestampUtc.toISOString(),
                amountUsdCents: event.amountUsdCents,
                externalRef: event.externalRef,
                metadata: event.metadataJson,
                prevEventHash: event.prevEventHash,
                eventHash: event.eventHash,
            })),
        };
    });

    /**
     * GET /me/contracts
     * Authenticated user's contracts with derived states
     */
    fastify.get('/me/contracts', async (request, reply) => {
        // @ts-ignore - userId set by auth middleware
        const userId = request.userId;

        if (!userId) {
            reply.status(401);
            return { error: 'Unauthorized' };
        }

        const contractsWithState = await getContractsForUser(userId);

        return {
            contracts: contractsWithState.map(({ contract, state }) => ({
                id: contract.id,
                principalIdentityUsername: contract.principalIdentityUsername,
                platform: contract.platform,
                metricType: contract.metricType,
                condition: contract.conditionJson,
                deadline: contract.deadlineUtc.toISOString(),
                lockAmountUsdCents: contract.lockAmountUsdCents,
                riskTier: contract.riskTier,
                state, // Derived from ledger events
                socialBonusEnabled: contract.socialBonusEnabled ?? false,
                createdAt: contract.createdAt.toISOString(),
            })),
        };
    });

    /**
     * GET /v1/ledger
     * Public ledger of executed contract events
     * Powers: Public Record page (/ledger) in Aura
     * 
     * Returns events from all executed contracts (FUNDS_LOCKED and beyond).
     * No authentication required - this is a public transparency feed.
     */
    fastify.get('/v1/ledger', async (request, reply) => {
        try {
            let rows: any[];

            try {
                // Try full UNION ALL with rivalry events
                const result = await db.execute(sql`
                    (
                        SELECT
                            le.id::text,
                            le.contract_id::text AS "sourceId",
                            'CONTRACT' AS "sourceType",
                            le.event_type::text AS "eventType",
                            le.timestamp_utc AS "timestampUtc",
                            le.amount_usd_cents AS "amountUsdCents",
                            le.event_hash AS "eventHash",
                            le.actor::text,
                            c.platform::text,
                            c.principal_identity_username AS "principal",
                            c.lock_amount_usd_cents AS "lockAmountUsdCents",
                            c.risk_tier::text AS "riskTier"
                        FROM ledger_events le
                        INNER JOIN contracts c ON le.contract_id = c.id
                        WHERE le.event_type::text IN (
                            'FUNDS_LOCKED', 'EXECUTION_CONFIRMED',
                            'SETTLED_SUCCESS', 'SETTLED_FAILURE'
                        )
                    )
                    UNION ALL
                    (
                        SELECT
                            rle.id::text,
                            rle.rivalry_id::text AS "sourceId",
                            'RIVALRY' AS "sourceType",
                            rle.event_type::text AS "eventType",
                            rle.timestamp_utc AS "timestampUtc",
                            rle.amount_usd_cents AS "amountUsdCents",
                            rle.event_hash AS "eventHash",
                            rle.actor::text,
                            r.platform::text,
                            COALESCE(
                                (SELECT i.username FROM identities i WHERE i.user_id = r.challenger_user_id AND i.status = 'ACTIVE' LIMIT 1),
                                'unknown'
                            ) AS "principal",
                            (r.stake_per_side_cents * 2)::integer AS "lockAmountUsdCents",
                            'DUEL'::text AS "riskTier"
                        FROM rivalry_ledger_events rle
                        INNER JOIN rivalries r ON rle.rivalry_id = r.id
                        WHERE rle.event_type::text IN (
                            'RIVALRY_CREATED', 'RIVALRY_ACCEPTED',
                            'RIVALRY_SETTLED', 'RIVALRY_DRAW'
                        )
                    )
                    ORDER BY "timestampUtc" DESC
                    LIMIT 200
                `);
                rows = (result as any).rows || result;
            } catch (unionErr: any) {
                // Fallback: rivalry tables may not exist yet
                console.error('[Ledger] UNION failed — full error:', unionErr.message, unionErr.stack);
                const result = await db.execute(sql`
                    SELECT
                        le.id,
                        le.contract_id AS "sourceId",
                        'CONTRACT' AS "sourceType",
                        le.event_type AS "eventType",
                        le.timestamp_utc AS "timestampUtc",
                        le.amount_usd_cents AS "amountUsdCents",
                        le.event_hash AS "eventHash",
                        le.actor,
                        c.platform,
                        c.principal_identity_username AS "principal",
                        c.lock_amount_usd_cents AS "lockAmountUsdCents",
                        c.risk_tier AS "riskTier"
                    FROM ledger_events le
                    INNER JOIN contracts c ON le.contract_id = c.id
                    WHERE le.event_type IN (
                        'FUNDS_LOCKED', 'EXECUTION_CONFIRMED',
                        'SETTLED_SUCCESS', 'SETTLED_FAILURE'
                    )
                    ORDER BY le.timestamp_utc DESC
                    LIMIT 200
                `);
                rows = (result as any).rows || result;
            }

            return {
                events: rows.map((row: any) => ({
                    id: row.id,
                    contractId: row.sourceId,
                    sourceType: row.sourceType,
                    eventType: row.eventType,
                    timestamp: row.timestampUtc instanceof Date
                        ? row.timestampUtc.toISOString()
                        : row.timestampUtc,
                    amountUsdCents: row.amountUsdCents,
                    eventHash: row.eventHash,
                    actor: row.actor,
                    platform: row.platform,
                    principal: row.principal,
                    lockAmountUsdCents: row.lockAmountUsdCents,
                    riskTier: row.riskTier,
                })),
            };
        } catch (error) {
            console.error('[Ledger] Error fetching public ledger:', error);
            reply.status(500);
            return { error: 'Failed to fetch ledger events' };
        }
    });

    /**
     * GET /v1/results
     * Public results feed — settled contracts and rivalries
     * Powers: Public Results page (/results) in Aura
     * No authentication required.
     */
    fastify.get('/v1/results', async (request, reply) => {
        try {
            const result = await db.execute(sql`
                (
                    SELECT
                        c.id,
                        'CONTRACT' AS "sourceType",
                        c.platform,
                        c.principal_identity_username AS "principal",
                        c.lock_amount_usd_cents AS "stakeCents",
                        c.risk_tier AS "riskTier",
                        ci.current_state AS "outcome",
                        ci.updated_at AS "settledAt",
                        CASE
                            WHEN ci.current_state = 'SETTLED_SUCCESS' THEN 'WIN'
                            WHEN ci.current_state = 'SETTLED_FAILURE' THEN 'LOSS'
                            ELSE 'PENDING'
                        END AS "result"
                    FROM contracts c
                    INNER JOIN contract_index ci ON ci.contract_id = c.id
                    WHERE ci.current_state IN ('SETTLED_SUCCESS', 'SETTLED_FAILURE')
                )
                UNION ALL
                (
                    SELECT
                        r.id,
                        'RIVALRY' AS "sourceType",
                        r.platform,
                        u.display_name AS "principal",
                        r.stake_per_side_cents * 2 AS "stakeCents",
                        r.rivalry_tier AS "riskTier",
                        r.status AS "outcome",
                        r.settled_at AS "settledAt",
                        CASE
                            WHEN r.status = 'SETTLED' THEN 'WIN'
                            WHEN r.status = 'DRAW' THEN 'DRAW'
                            WHEN r.status = 'BOTH_MISS' THEN 'BOTH_MISS'
                            ELSE 'PENDING'
                        END AS "result"
                    FROM rivalries r
                    INNER JOIN users u ON r.challenger_user_id = u.id
                    WHERE r.status IN ('SETTLED', 'DRAW', 'BOTH_MISS')
                )
                ORDER BY "settledAt" DESC NULLS LAST
                LIMIT 100
            `);

            const rows = (result as any).rows || result;

            return {
                results: rows.map((row: any) => {
                    // Anonymize username: show first 3 chars + ***
                    const name = row.principal || 'Anonymous';
                    const anonymized = name.length > 3 ? name.slice(0, 3) + '***' : name;

                    return {
                        id: row.id,
                        sourceType: row.sourceType,
                        platform: row.platform,
                        principal: anonymized,
                        stakeCents: row.stakeCents,
                        riskTier: row.riskTier,
                        result: row.result,
                        settledAt: row.settledAt instanceof Date
                            ? row.settledAt.toISOString()
                            : row.settledAt,
                    };
                }),
            };
        } catch (error) {
            console.error('[Results] Error:', error);
            reply.status(500);
            return { error: 'Failed to fetch results' };
        }
    });
};

export default contractRoutes;
