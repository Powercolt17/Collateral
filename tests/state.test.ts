/**
 * State Derivation Tests
 * 
 * Verify state is correctly derived from ledger events
 */

import { describe, it, expect } from 'vitest';
import { deriveState, canTransition, InvalidTransitionError } from '../src/services/state-derivation.js';
import { ContractStatus, EventType } from '../src/db/schema.js';

// Helper to create mock ledger events
function mockEvent(eventType: string, index: number = 0) {
    return {
        id: `event-${index}`,
        contractId: 'contract-123',
        actor: 'USER' as const,
        eventType,
        timestampUtc: new Date(Date.now() + index * 1000),
        amountUsdCents: null,
        externalRef: null,
        metadataJson: null,
        prevEventHash: null,
        eventHash: `hash-${index}`,
    };
}

describe('State Derivation', () => {
    describe('deriveState', () => {
        it('should return null for empty events', () => {
            expect(deriveState([])).toBeNull();
        });

        it('should derive CREATED from CONTRACT_CREATED event', () => {
            const events = [mockEvent(EventType.CONTRACT_CREATED, 0)];
            expect(deriveState(events)).toBe(ContractStatus.CREATED);
        });

        it('should derive FUNDS_AUTHORIZED from event sequence', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
            ];
            expect(deriveState(events)).toBe(ContractStatus.FUNDS_AUTHORIZED);
        });

        it('should derive LOCKED from full funding sequence', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
            ];
            expect(deriveState(events)).toBe(ContractStatus.LOCKED);
        });

        it('should derive SETTLED from complete success sequence', () => {
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

        it('should derive FORFEITED from failure sequence', () => {
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

        it('should skip non-state-affecting events', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.BASELINE_SNAPSHOTTED, 1),
                mockEvent(EventType.FUNDS_AUTHORIZED, 2),
            ];
            expect(deriveState(events)).toBe(ContractStatus.FUNDS_AUTHORIZED);
        });

        it('should throw InvalidTransitionError for invalid sequence', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.CONTRACT_SETTLED, 1), // Invalid: can't jump to SETTLED
            ];
            expect(() => deriveState(events)).toThrow(InvalidTransitionError);
        });
    });

    describe('canTransition', () => {
        it('should allow CREATED → FUNDS_AUTHORIZED', () => {
            expect(canTransition(ContractStatus.CREATED, ContractStatus.FUNDS_AUTHORIZED)).toBe(true);
        });

        it('should allow FUNDS_AUTHORIZED → FUNDS_LOCKED', () => {
            expect(canTransition(ContractStatus.FUNDS_AUTHORIZED, ContractStatus.FUNDS_LOCKED)).toBe(true);
        });

        it('should allow FUNDS_LOCKED → LOCKED', () => {
            expect(canTransition(ContractStatus.FUNDS_LOCKED, ContractStatus.LOCKED)).toBe(true);
        });

        it('should allow LOCKED → VERIFYING', () => {
            expect(canTransition(ContractStatus.LOCKED, ContractStatus.VERIFYING)).toBe(true);
        });

        it('should allow VERIFYING → VERIFIED', () => {
            expect(canTransition(ContractStatus.VERIFYING, ContractStatus.VERIFIED)).toBe(true);
        });

        it('should allow VERIFIED → SETTLING', () => {
            expect(canTransition(ContractStatus.VERIFIED, ContractStatus.SETTLING)).toBe(true);
        });

        it('should allow SETTLING → SETTLED', () => {
            expect(canTransition(ContractStatus.SETTLING, ContractStatus.SETTLED)).toBe(true);
        });

        it('should allow SETTLING → FORFEITED', () => {
            expect(canTransition(ContractStatus.SETTLING, ContractStatus.FORFEITED)).toBe(true);
        });

        // Invalid transitions
        it('should NOT allow skipping states: CREATED → LOCKED', () => {
            expect(canTransition(ContractStatus.CREATED, ContractStatus.LOCKED)).toBe(false);
        });

        it('should NOT allow SETTLED → any state (terminal)', () => {
            expect(canTransition(ContractStatus.SETTLED, ContractStatus.CREATED)).toBe(false);
            expect(canTransition(ContractStatus.SETTLED, ContractStatus.FORFEITED)).toBe(false);
        });

        it('should NOT allow FORFEITED → any state (terminal)', () => {
            expect(canTransition(ContractStatus.FORFEITED, ContractStatus.CREATED)).toBe(false);
            expect(canTransition(ContractStatus.FORFEITED, ContractStatus.SETTLED)).toBe(false);
        });

        it('should NOT allow backward transitions', () => {
            expect(canTransition(ContractStatus.LOCKED, ContractStatus.CREATED)).toBe(false);
            expect(canTransition(ContractStatus.VERIFIED, ContractStatus.LOCKED)).toBe(false);
        });

        it('should NOT allow direct SETTLED/FORFEITED without VERIFIED', () => {
            expect(canTransition(ContractStatus.LOCKED, ContractStatus.SETTLED)).toBe(false);
            expect(canTransition(ContractStatus.LOCKED, ContractStatus.FORFEITED)).toBe(false);
        });
    });
});
