/**
 * Terminal State Tests
 * 
 * Tests that write actions are rejected on terminal states (SETTLED/FORFEITED)
 */

import { describe, it, expect } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';
import {
    isTerminalState,
    validateNotTerminal,
    TerminalStateError,
} from '../src/services/state-derivation.js';
import { canVerify } from '../src/services/verification.js';
import { canSettle } from '../src/services/settlement.js';

describe('Terminal State Invariant', () => {
    describe('isTerminalState', () => {
        it('should return true for SETTLED', () => {
            expect(isTerminalState(ContractStatus.SETTLED)).toBe(true);
        });

        it('should return true for FORFEITED', () => {
            expect(isTerminalState(ContractStatus.FORFEITED)).toBe(true);
        });

        it('should return false for non-terminal states', () => {
            expect(isTerminalState(ContractStatus.CREATED)).toBe(false);
            expect(isTerminalState(ContractStatus.LOCKED)).toBe(false);
            expect(isTerminalState(ContractStatus.VERIFIED)).toBe(false);
            expect(isTerminalState(ContractStatus.SETTLING)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isTerminalState(null)).toBe(false);
        });
    });

    describe('validateNotTerminal', () => {
        it('should not throw for non-terminal states', () => {
            expect(() => validateNotTerminal(ContractStatus.CREATED, 'test')).not.toThrow();
            expect(() => validateNotTerminal(ContractStatus.LOCKED, 'test')).not.toThrow();
            expect(() => validateNotTerminal(ContractStatus.VERIFIED, 'test')).not.toThrow();
        });

        it('should throw TerminalStateError for SETTLED', () => {
            expect(() => validateNotTerminal(ContractStatus.SETTLED, 'execute'))
                .toThrow(TerminalStateError);
        });

        it('should throw TerminalStateError for FORFEITED', () => {
            expect(() => validateNotTerminal(ContractStatus.FORFEITED, 'verify'))
                .toThrow(TerminalStateError);
        });

        it('should include action in error message', () => {
            try {
                validateNotTerminal(ContractStatus.SETTLED, 'execute');
            } catch (err) {
                expect((err as TerminalStateError).message).toContain('execute');
                expect((err as TerminalStateError).action).toBe('execute');
            }
        });

        it('should not throw for null state', () => {
            expect(() => validateNotTerminal(null, 'test')).not.toThrow();
        });
    });

    describe('Cannot verify after terminal state', () => {
        it('should reject verification from SETTLED state', () => {
            const pastDeadline = new Date(Date.now() - 1000);
            const result = canVerify(ContractStatus.SETTLED, pastDeadline);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('SETTLED');
        });

        it('should reject verification from FORFEITED state', () => {
            const pastDeadline = new Date(Date.now() - 1000);
            const result = canVerify(ContractStatus.FORFEITED, pastDeadline);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('FORFEITED');
        });
    });

    describe('Cannot settle after terminal state', () => {
        it('should reject settlement from SETTLED state', () => {
            const events = [{ eventType: EventType.VERIFICATION_SUCCEEDED }];
            const result = canSettle(ContractStatus.SETTLED, events);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('SETTLED');
        });

        it('should reject settlement from FORFEITED state', () => {
            const events = [{ eventType: EventType.VERIFICATION_FAILED }];
            const result = canSettle(ContractStatus.FORFEITED, events);
            expect(result.allowed).toBe(false);
            expect(result.reason).toContain('FORFEITED');
        });
    });

    describe('Cannot execute after terminal state', () => {
        it('should throw TerminalStateError when executing after SETTLED', () => {
            expect(() => validateNotTerminal(ContractStatus.SETTLED, 'execute'))
                .toThrow(TerminalStateError);
        });

        it('should throw TerminalStateError when executing after FORFEITED', () => {
            expect(() => validateNotTerminal(ContractStatus.FORFEITED, 'execute'))
                .toThrow(TerminalStateError);
        });
    });
});
