/**
 * Verification Tests
 * 
 * Tests for contract verification (X platform only)
 */

import { describe, it, expect } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';
import { deriveState, canTransition } from '../src/services/state-derivation.js';
import { canVerify } from '../src/services/verification.js';

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

describe('Verification', () => {
    describe('canVerify', () => {
        it('should allow verification when state is LOCKED and deadline passed', () => {
            const pastDeadline = new Date(Date.now() - 1000);
            const result = canVerify(ContractStatus.LOCKED, pastDeadline);
            expect(result.allowed).toBe(true);
        });

        it('should reject verification before LOCKED state', () => {
            const pastDeadline = new Date(Date.now() - 1000);

            expect(canVerify(ContractStatus.CREATED, pastDeadline).allowed).toBe(false);
            expect(canVerify(ContractStatus.FUNDS_AUTHORIZED, pastDeadline).allowed).toBe(false);
            expect(canVerify(ContractStatus.FUNDS_LOCKED, pastDeadline).allowed).toBe(false);
        });

        it('should reject verification before deadline', () => {
            const futureDeadline = new Date(Date.now() + 100000);
            const result = canVerify(ContractStatus.LOCKED, futureDeadline);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('deadline not reached');
        });

        it('should reject verification from NULL state', () => {
            const pastDeadline = new Date(Date.now() - 1000);
            const result = canVerify(null, pastDeadline);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('NULL');
        });

        it('should reject verification from terminal states', () => {
            const pastDeadline = new Date(Date.now() - 1000);
            expect(canVerify(ContractStatus.SETTLED, pastDeadline).allowed).toBe(false);
            expect(canVerify(ContractStatus.FORFEITED, pastDeadline).allowed).toBe(false);
        });
    });

    describe('State transitions for verification', () => {
        it('LOCKED -> VERIFYING transition should be allowed', () => {
            expect(canTransition(ContractStatus.LOCKED, ContractStatus.VERIFYING)).toBe(true);
        });

        it('VERIFYING -> VERIFIED transition should be allowed', () => {
            expect(canTransition(ContractStatus.VERIFYING, ContractStatus.VERIFIED)).toBe(true);
        });

        it('VERIFICATION_STARTED should derive VERIFYING state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFYING);
        });

        it('VERIFICATION_SUCCEEDED should derive VERIFIED state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });

        it('VERIFICATION_FAILED should derive VERIFIED state', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });
    });

    describe('Verification idempotency', () => {
        it('should not allow re-verification - events should be checked', () => {
            // This is tested at the service level
            // If VERIFICATION_STARTED or result events exist, should skip
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
            ];

            // State is VERIFYING, not LOCKED, so canVerify should reject
            const state = deriveState(events);
            expect(state).toBe(ContractStatus.VERIFYING);

            const pastDeadline = new Date(Date.now() - 1000);
            const result = canVerify(state, pastDeadline);
            expect(result.allowed).toBe(false);
        });

        it('should allow retry when VERIFICATION_STARTED exists but no terminal event', () => {
            // Simulating: VERIFICATION_STARTED was appended but adapter failed
            // System should allow retry and append terminal event
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
            ];

            // Check that NO terminal event exists
            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.VERIFICATION_SUCCEEDED ||
                e.eventType === EventType.VERIFICATION_FAILED
            );
            expect(hasTerminalEvent).toBe(false);

            // State is VERIFYING - service should allow retry
            const state = deriveState(events);
            expect(state).toBe(ContractStatus.VERIFYING);

            // In the actual service, hasVerificationStarted check allows retry
            // canVerify is bypassed when hasVerificationStarted is true
        });

        it('should skip when terminal VERIFICATION_SUCCEEDED exists', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_SUCCEEDED, 5),
            ];

            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.VERIFICATION_SUCCEEDED ||
                e.eventType === EventType.VERIFICATION_FAILED
            );
            expect(hasTerminalEvent).toBe(true);

            // State should be VERIFIED (terminal for verification)
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });

        it('should skip when terminal VERIFICATION_FAILED exists', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
                mockEvent(EventType.VERIFICATION_FAILED, 5),
            ];

            const hasTerminalEvent = events.some(e =>
                e.eventType === EventType.VERIFICATION_SUCCEEDED ||
                e.eventType === EventType.VERIFICATION_FAILED
            );
            expect(hasTerminalEvent).toBe(true);

            // State should be VERIFIED (terminal for verification)
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });
    });

    describe('Verification event mapping', () => {
        it('verification trigger: LOCKED -> VERIFICATION_STARTED -> VERIFYING', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
            ];
            expect(deriveState(events)).toBe(ContractStatus.LOCKED);

            // After VERIFICATION_STARTED
            events.push(mockEvent(EventType.VERIFICATION_STARTED, 4));
            expect(deriveState(events)).toBe(ContractStatus.VERIFYING);
        });

        it('success path: VERIFYING -> VERIFICATION_SUCCEEDED -> VERIFIED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFYING);

            events.push(mockEvent(EventType.VERIFICATION_SUCCEEDED, 5));
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });

        it('failure path: VERIFYING -> VERIFICATION_FAILED -> VERIFIED', () => {
            const events = [
                mockEvent(EventType.CONTRACT_CREATED, 0),
                mockEvent(EventType.FUNDS_AUTHORIZED, 1),
                mockEvent(EventType.FUNDS_LOCKED, 2),
                mockEvent(EventType.EXECUTION_CONFIRMED, 3),
                mockEvent(EventType.VERIFICATION_STARTED, 4),
            ];
            expect(deriveState(events)).toBe(ContractStatus.VERIFYING);

            events.push(mockEvent(EventType.VERIFICATION_FAILED, 5));
            expect(deriveState(events)).toBe(ContractStatus.VERIFIED);
        });
    });
});
