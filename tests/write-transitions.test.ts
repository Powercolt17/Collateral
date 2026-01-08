/**
 * Write Endpoint Transition Validation Tests
 * 
 * Tests that:
 * 1. Invalid transitions are rejected
 * 2. Valid transitions append correct event types
 * 3. Derived state changes accordingly
 */

import { describe, it, expect } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';
import {
    deriveState,
    canTransition,
    validateFromState,
    InvalidTransitionError
} from '../src/services/state-derivation.js';

// Helper to create mock ledger events
function mockEvent(eventType: string, index: number = 0) {
    return {
        id: `event-${index}`,
        contractId: 'contract-1',
        actor: 'SYSTEM' as const,
        eventType,
        timestampUtc: new Date(Date.now() + index * 1000),
        amountUsdCents: null,
        externalRef: null,
        metadataJson: null,
        prevEventHash: null,
        eventHash: `hash-${index}`,
    };
}

describe('Write Endpoint Transition Validation', () => {
    describe('validateFromState', () => {
        it('should allow funding-intent from CREATED state', () => {
            const currentState = ContractStatus.CREATED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
            }).not.toThrow();
        });

        it('should reject funding-intent from FUNDS_AUTHORIZED state', () => {
            const currentState = ContractStatus.FUNDS_AUTHORIZED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
            }).toThrow(InvalidTransitionError);
        });

        it('should reject funding-intent from LOCKED state', () => {
            const currentState = ContractStatus.LOCKED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
            }).toThrow(InvalidTransitionError);
        });

        it('should allow execute from FUNDS_LOCKED state', () => {
            const currentState = ContractStatus.FUNDS_LOCKED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
            }).not.toThrow();
        });

        it('should reject execute from CREATED state', () => {
            const currentState = ContractStatus.CREATED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
            }).toThrow(InvalidTransitionError);
        });

        it('should reject execute from FUNDS_AUTHORIZED state (needs payment first)', () => {
            const currentState = ContractStatus.FUNDS_AUTHORIZED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
            }).toThrow(InvalidTransitionError);
        });

        it('should reject any action from terminal SETTLED state', () => {
            const currentState = ContractStatus.SETTLED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
            }).toThrow(InvalidTransitionError);
            expect(() => {
                validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
            }).toThrow(InvalidTransitionError);
        });

        it('should reject any action from terminal FORFEITED state', () => {
            const currentState = ContractStatus.FORFEITED;
            expect(() => {
                validateFromState(currentState, [ContractStatus.CREATED], 'funding-intent');
            }).toThrow(InvalidTransitionError);
            expect(() => {
                validateFromState(currentState, [ContractStatus.FUNDS_LOCKED], 'execute');
            }).toThrow(InvalidTransitionError);
        });

        it('should reject action from NULL state', () => {
            expect(() => {
                validateFromState(null, [ContractStatus.CREATED], 'funding-intent');
            }).toThrow(InvalidTransitionError);
        });
    });

    describe('Event appending and state derivation', () => {
        it('should derive CREATED after CONTRACT_CREATED event', () => {
            const events = [mockEvent(EventType.CONTRACT_CREATED, 0)];
            expect(deriveState(events)).toBe(ContractStatus.CREATED);
        });

        it('should derive FUNDS_AUTHORIZED after FUNDS_AUTHORIZED event', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
            ];
            expect(deriveState(events)).toBe(ContractStatus.FUNDS_AUTHORIZED);
        });

        it('should derive FUNDS_LOCKED after FUNDS_LOCKED event', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
            ];
            expect(deriveState(events)).toBe(ContractStatus.FUNDS_LOCKED);
        });

        it('should derive LOCKED after EXECUTION_CONFIRMED event', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_REQUESTED, 3),
                mockEvent(EventType.EXECUTION_CONFIRMED, 4),
            ];
            expect(deriveState(events)).toBe(ContractStatus.LOCKED);
        });

        it('should throw InvalidTransitionError for skipped states', () => {
            // Try to go directly from CREATED to LOCKED (skipping funding)
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.EXECUTION_CONFIRMED, 1), // Invalid: CREATED → LOCKED
            ];
            expect(() => deriveState(events)).toThrow(InvalidTransitionError);
        });

        it('should throw InvalidTransitionError for backward transitions', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.CONTRACT_CREATED, 2), // Invalid: FUNDS_AUTHORIZED → CREATED
            ];
            expect(() => deriveState(events)).toThrow(InvalidTransitionError);
        });
    });

    describe('Route -> From-State -> Event Type Mapping', () => {
        // POST /contracts
        it('POST /contracts: NULL -> CONTRACT_CREATED -> CREATED', () => {
            const events = [mockEvent(EventType.CONTRACT_CREATED, 0)];
            expect(deriveState(events)).toBe(ContractStatus.CREATED);
        });

        // POST /:id/funding-intent
        it('POST /:id/funding-intent: CREATED -> FUNDS_AUTHORIZED', () => {
            expect(canTransition(ContractStatus.CREATED, ContractStatus.FUNDS_AUTHORIZED)).toBe(true);
        });

        // POST /stripe/webhook (payment_intent.succeeded) → handlePaymentSuccess
        it('Stripe webhook: FUNDS_AUTHORIZED -> FUNDS_LOCKED', () => {
            expect(canTransition(ContractStatus.FUNDS_AUTHORIZED, ContractStatus.FUNDS_LOCKED)).toBe(true);
        });

        // POST /:id/execute
        it('POST /:id/execute: FUNDS_LOCKED -> LOCKED', () => {
            expect(canTransition(ContractStatus.FUNDS_LOCKED, ContractStatus.LOCKED)).toBe(true);
        });

        // Full chain test
        it('should support full chain: CREATED -> AUTHORIZED -> LOCKED -> execute -> LOCKED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_REQUESTED, 3),
                mockEvent(EventType.EXECUTION_CONFIRMED, 4),
            ];
            expect(deriveState(events)).toBe(ContractStatus.LOCKED);
        });
    });
});
