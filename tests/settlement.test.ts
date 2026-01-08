/**
 * Settlement Tests
 * 
 * Tests for contract settlement after verification
 */

import { describe, it, expect } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';
import { deriveState, canTransition } from '../src/services/state-derivation.js';
import { canSettle } from '../src/services/settlement.js';

// Helper to create mock ledger events
function mockEvent(eventType: string, index: number = 0, amountUsdCents?: number) {
    return {
        id: `event-${index}`,
        contractId: 'contract-1',
        actor: 'SYSTEM' as const,
        eventType,
        timestampUtc: new Date(Date.now() + index * 1000),
        amountUsdCents: amountUsdCents ?? null,
        externalRef: null,
        metadataJson: null,
        prevEventHash: null,
        eventHash: `hash-${index}`,
    };
}

describe('Settlement', () => {
    describe('canSettle', () => {
        it('should allow settlement when state is VERIFIED and verification succeeded', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
            ];
            const state = deriveState(events);
            const result = canSettle(state, events);
            expect(result.allowed).toBe(true);
            expect(result.verificationOutcome).toBe('SUCCEEDED');
        });

        it('should allow settlement when state is VERIFIED and verification failed', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
            ];
            const state = deriveState(events);
            const result = canSettle(state, events);
            expect(result.allowed).toBe(true);
            expect(result.verificationOutcome).toBe('FAILED');
        });

        it('should reject settlement when state is not VERIFIED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
            ];
            const state = deriveState(events);
            const result = canSettle(state, events);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('must be VERIFIED');
        });

        it('should reject settlement when state is LOCKED (no verification)', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
            ];
            const state = deriveState(events);
            const result = canSettle(state, events);
            expect(result.allowed).toBe(false);
        });

        it('should reject settlement when no terminal verification event exists', () => {
            // This shouldn't happen in practice (VERIFIED requires terminal event)
            // but test the guard anyway
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
            ];
            // Force state to VERIFIED for test
            const result = canSettle(ContractStatus.VERIFIED, events);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('no terminal verification event');
        });
    });

    describe('State transitions for settlement', () => {
        it('VERIFIED -> SETTLING transition should be allowed', () => {
            expect(canTransition(ContractStatus.VERIFIED, ContractStatus.SETTLING)).toBe(true);
        });

        it('SETTLING -> SETTLED transition should be allowed', () => {
            expect(canTransition(ContractStatus.SETTLING, ContractStatus.SETTLED)).toBe(true);
        });

        it('SETTLING -> FORFEITED transition should be allowed', () => {
            expect(canTransition(ContractStatus.SETTLING, ContractStatus.FORFEITED)).toBe(true);
        });

        it('SETTLEMENT_STARTED should derive SETTLING state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
            ];
            expect(deriveState(events)).toBe(ContractStatus.SETTLING);
        });

        it('SETTLED_SUCCESS should derive SETTLED state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
                mockEvent(EventType.SETTLED_SUCCESS, 7),
            ];
            expect(deriveState(events)).toBe(ContractStatus.SETTLED);
        });

        it('SETTLED_FAILURE should derive FORFEITED state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
                mockEvent(EventType.SETTLED_FAILURE, 7),
            ];
            expect(deriveState(events)).toBe(ContractStatus.FORFEITED);
        });
    });

    describe('Settlement idempotency', () => {
        it('should allow retry when SETTLEMENT_STARTED exists but no terminal event', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
            ];

            // Check that NO terminal event exists
            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.SETTLED_SUCCESS ||
                e.eventType === EventType.SETTLED_FAILURE
            );
            expect(hasTerminalEvent).toBe(false);

            // State is SETTLING - service should allow retry
            const state = deriveState(events);
            expect(state).toBe(ContractStatus.SETTLING);
        });

        it('should skip when terminal SETTLED_SUCCESS exists', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
                mockEvent(EventType.SETTLED_SUCCESS, 7, 10000),
            ];

            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.SETTLED_SUCCESS ||
                e.eventType === EventType.SETTLED_FAILURE
            );
            expect(hasTerminalEvent).toBe(true);

            // State should be SETTLED (terminal)
            expect(deriveState(events)).toBe(ContractStatus.SETTLED);
        });

        it('should skip when terminal SETTLED_FAILURE exists', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
                mockEvent(EventType.SETTLEMENT_STARTED, 6),
                mockEvent(EventType.SETTLED_FAILURE, 7, 10000),
            ];

            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.SETTLED_SUCCESS ||
                e.eventType === EventType.SETTLED_FAILURE
            );
            expect(hasTerminalEvent).toBe(true);

            // State should be FORFEITED (terminal)
            expect(deriveState(events)).toBe(ContractStatus.FORFEITED);
        });
    });

    describe('Full settlement flow', () => {
        it('success path: VERIFIED -> SETTLEMENT_STARTED -> SETTLED_SUCCESS -> SETTLED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);

            events.push(mockEvent(EventType.SETTLEMENT_STARTED, 6));
            expect(deriveState(events)).toBe(ContractStatus.SETTLING);

            events.push(mockEvent(EventType.SETTLED_SUCCESS, 7, 10000));
            expect(deriveState(events)).toBe(ContractStatus.SETTLED);
        });

        it('failure path: VERIFIED -> SETTLEMENT_STARTED -> SETTLED_FAILURE -> FORFEITED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);

            events.push(mockEvent(EventType.SETTLEMENT_STARTED, 6));
            expect(deriveState(events)).toBe(ContractStatus.SETTLING);

            events.push(mockEvent(EventType.SETTLED_FAILURE, 7, 10000));
            expect(deriveState(events)).toBe(ContractStatus.FORFEITED);
        });
    });
});
