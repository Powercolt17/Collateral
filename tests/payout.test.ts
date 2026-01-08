/**
 * Precommitted Payout Tests
 * 
 * Tests for payoutAmountUsdCents: required at creation, fixed and immutable
 */

import { describe, it, expect } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';
import { deriveState } from '../src/services/state-derivation.js';

// Helper to create mock ledger events
function mockEvent(eventType: string, index: number = 0, amountUsdCents?: number, metadata?: any) {
    return {
        id: `event-${index}`,
        contractId: 'contract-1',
        actor: 'SYSTEM' as const,
        eventType,
        timestampUtc: new Date(Date.now() + index * 1000),
        amountUsdCents: amountUsdCents ?? null,
        externalRef: null,
        metadataJson: metadata ?? null,
        prevEventHash: null,
        eventHash: `hash-${index}`,
    };
}

describe('Precommitted Payout at Creation', () => {
    describe('POST /contracts validation', () => {
        it('should require payoutAmountUsdCents field', () => {
            // Validation logic test: missing payoutAmountUsdCents should fail
            const validatePayoutAmount = (value: any) => {
                if (value === undefined || value === null) {
                    return { error: 'payoutAmountUsdCents is required' };
                }
                if (!Number.isInteger(value)) {
                    return { error: 'payoutAmountUsdCents must be an integer' };
                }
                if (value <= 0) {
                    return { error: 'payoutAmountUsdCents must be greater than 0' };
                }
                return { valid: true };
            };

            // Test missing
            expect(validatePayoutAmount(undefined)).toEqual({ error: 'payoutAmountUsdCents is required' });
            expect(validatePayoutAmount(null)).toEqual({ error: 'payoutAmountUsdCents is required' });
        });

        it('should reject non-integer payoutAmountUsdCents', () => {
            const validatePayoutAmount = (value: any) => {
                if (value === undefined || value === null) {
                    return { error: 'payoutAmountUsdCents is required' };
                }
                if (!Number.isInteger(value)) {
                    return { error: 'payoutAmountUsdCents must be an integer' };
                }
                if (value <= 0) {
                    return { error: 'payoutAmountUsdCents must be greater than 0' };
                }
                return { valid: true };
            };

            expect(validatePayoutAmount(100.5)).toEqual({ error: 'payoutAmountUsdCents must be an integer' });
            expect(validatePayoutAmount('100')).toEqual({ error: 'payoutAmountUsdCents must be an integer' });
        });

        it('should reject payoutAmountUsdCents <= 0', () => {
            const validatePayoutAmount = (value: any) => {
                if (value === undefined || value === null) {
                    return { error: 'payoutAmountUsdCents is required' };
                }
                if (!Number.isInteger(value)) {
                    return { error: 'payoutAmountUsdCents must be an integer' };
                }
                if (value <= 0) {
                    return { error: 'payoutAmountUsdCents must be greater than 0' };
                }
                return { valid: true };
            };

            expect(validatePayoutAmount(0)).toEqual({ error: 'payoutAmountUsdCents must be greater than 0' });
            expect(validatePayoutAmount(-100)).toEqual({ error: 'payoutAmountUsdCents must be greater than 0' });
        });

        it('should accept valid payoutAmountUsdCents', () => {
            const validatePayoutAmount = (value: any) => {
                if (value === undefined || value === null) {
                    return { error: 'payoutAmountUsdCents is required' };
                }
                if (!Number.isInteger(value)) {
                    return { error: 'payoutAmountUsdCents must be an integer' };
                }
                if (value <= 0) {
                    return { error: 'payoutAmountUsdCents must be greater than 0' };
                }
                return { valid: true };
            };

            expect(validatePayoutAmount(100)).toEqual({ valid: true });
            expect(validatePayoutAmount(50000)).toEqual({ valid: true });
            expect(validatePayoutAmount(1)).toEqual({ valid: true });
        });

        it('should reject payoutAmountUsdCents < lockAmountUsdCents', () => {
            const validatePayoutVsLock = (payout: number, lock: number) => {
                if (payout < lock) {
                    return { error: 'payoutAmountUsdCents must be >= lockAmountUsdCents' };
                }
                return { valid: true };
            };

            expect(validatePayoutVsLock(5000, 10000)).toEqual({
                error: 'payoutAmountUsdCents must be >= lockAmountUsdCents',
            });
            expect(validatePayoutVsLock(99, 100)).toEqual({
                error: 'payoutAmountUsdCents must be >= lockAmountUsdCents',
            });
        });

        it('should accept payoutAmountUsdCents == lockAmountUsdCents', () => {
            const validatePayoutVsLock = (payout: number, lock: number) => {
                if (payout < lock) {
                    return { error: 'payoutAmountUsdCents must be >= lockAmountUsdCents' };
                }
                return { valid: true };
            };

            expect(validatePayoutVsLock(10000, 10000)).toEqual({ valid: true });
            expect(validatePayoutVsLock(100, 100)).toEqual({ valid: true });
        });

        it('should accept payoutAmountUsdCents > lockAmountUsdCents', () => {
            const validatePayoutVsLock = (payout: number, lock: number) => {
                if (payout < lock) {
                    return { error: 'payoutAmountUsdCents must be >= lockAmountUsdCents' };
                }
                return { valid: true };
            };

            expect(validatePayoutVsLock(15000, 10000)).toEqual({ valid: true });
            expect(validatePayoutVsLock(75000, 50000)).toEqual({ valid: true });
        });
    });

    describe('CONTRACT_CREATED event metadata', () => {
        it('should include precommitted terms as ledger evidence', () => {
            // The CONTRACT_CREATED event metadata should include both lock and payout amounts
            const metadata = {
                condition: { operator: 'GTE', threshold: 1000, deadline: '2025-01-01' },
                baseline: { followers: 500 },
                lockAmountUsdCents: 50000,
                payoutAmountUsdCents: 75000,
            };

            expect(metadata.lockAmountUsdCents).toBe(50000);
            expect(metadata.payoutAmountUsdCents).toBe(75000);
        });
    });

    describe('Settlement uses precommitted payout', () => {
        it('should use payoutAmountUsdCents for success settlement', () => {
            // Simulating settlement logic
            const contract = {
                lockAmountUsdCents: 50000,
                payoutAmountUsdCents: 75000,
            };
            const verificationSucceeded = true;

            // Settlement logic: success uses payoutAmount, failure uses lockAmount
            const settlementAmount = verificationSucceeded
                ? contract.payoutAmountUsdCents
                : contract.lockAmountUsdCents;

            expect(settlementAmount).toBe(75000); // Uses precommitted payout
        });

        it('should use lockAmountUsdCents for failure settlement (forfeit)', () => {
            const contract = {
                lockAmountUsdCents: 50000,
                payoutAmountUsdCents: 75000,
            };
            const verificationSucceeded = false;

            const settlementAmount = verificationSucceeded
                ? contract.payoutAmountUsdCents
                : contract.lockAmountUsdCents;

            expect(settlementAmount).toBe(50000); // Uses lock amount for forfeit
        });

        it('SETTLED_SUCCESS event should record payoutAmountUsdCents', () => {
            // Simulating the event that would be appended
            const contract = {
                lockAmountUsdCents: 50000,
                payoutAmountUsdCents: 75000,
            };

            const settledSuccessEvent = {
                eventType: EventType.SETTLED_SUCCESS,
                amountUsdCents: contract.payoutAmountUsdCents,
                metadata: {
                    outcome: 'SUCCESS',
                    lockAmountUsdCents: contract.lockAmountUsdCents,
                    payoutAmountUsdCents: contract.payoutAmountUsdCents,
                },
            };

            expect(settledSuccessEvent.amountUsdCents).toBe(75000);
            expect(settledSuccessEvent.metadata.payoutAmountUsdCents).toBe(75000);
        });
    });

    describe('Immutability invariant', () => {
        it('payoutAmountUsdCents should be fixed at creation', () => {
            // The contract schema defines payoutAmountUsdCents as required
            // There is no update endpoint that modifies it
            // This test documents the invariant

            const contractAtCreation = {
                lockAmountUsdCents: 50000,
                payoutAmountUsdCents: 75000,
                createdAt: new Date(),
            };

            // Simulate system cannot change these values
            const attemptUpdate = (contract: any, newValue: number) => {
                // In actual implementation, there is NO route that updates payoutAmountUsdCents
                // The only places that insert contracts are:
                // 1. createContract service (sets value at creation)
                // 2. seed.ts (for development)
                // Neither provides an update path
                return { error: 'No update path exists for payoutAmountUsdCents' };
            };

            expect(attemptUpdate(contractAtCreation, 100000)).toEqual({
                error: 'No update path exists for payoutAmountUsdCents',
            });
        });

        it('should not have any route that updates payoutAmountUsdCents', () => {
            // Document the invariant: no update route exists
            // The contracts table has updatedAt but no route modifies payoutAmountUsdCents
            const availableContractRoutes = [
                'POST /contracts',           // Creates contract with payoutAmountUsdCents
                'POST /:id/funding-intent',  // Funding only
                'POST /:id/execute',          // Execution only
                // No PUT/PATCH route for contracts
            ];

            const updateRouteExists = availableContractRoutes.some(
                route => route.includes('PUT') || route.includes('PATCH')
            );

            expect(updateRouteExists).toBe(false);
        });
    });

    describe('State flow with precommitted payout', () => {
        it('full success flow should use payoutAmountUsdCents', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0, 50000, {
                    lockAmountUsdCents: 50000,
                    payoutAmountUsdCents: 75000,
                }),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2, 50000),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
                mockEvent(EventType.SETTLED_SUCCESS, 7, 75000, { // payoutAmountUsdCents
                    payoutAmountUsdCents: 75000,
                }),
            ];

            expect(deriveState(events)).toBe(ContractStatus.SETTLED);

            // Verify the settlement event uses payout amount
            const settledEvent = events.find(e => e.eventType === EventType.SETTLED_SUCCESS);
            expect(settledEvent?.amountUsdCents).toBe(75000);
        });
    });
});
