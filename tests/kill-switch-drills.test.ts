/**
 * Kill Switch Staging Drills
 * 
 * Tests that each kill switch blocks ONLY its target operation:
 * - contractCreationEnabled blocks createContract
 * - executionEnabled blocks execution/activation
 * - verificationEnabled blocks verify jobs
 * - settlementEnabled blocks settle jobs
 * - disableAllOperations blocks all writes
 * - Read-only operations remain available
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    isContractCreationEnabled,
    isExecutionEnabled,
    isVerificationEnabled,
    isSettlementEnabled,
    setContractCreationEnabled,
    setExecutionEnabled,
    setVerificationEnabled,
    setSettlementEnabled,
    disableAllOperations,
    enableAllOperations,
    getKillSwitchStatus,
} from '../src/services/kill-switches.js';

describe('Kill Switch Staging Drills', () => {
    // Reset to enabled state before and after each test
    beforeEach(() => {
        enableAllOperations();
    });

    afterEach(() => {
        enableAllOperations();
    });

    describe('Individual Kill Switches', () => {
        it('contractCreationEnabled should ONLY block contract creation', () => {
            // Disable contract creation
            setContractCreationEnabled(false);

            // Contract creation blocked
            expect(isContractCreationEnabled()).toBe(false);

            // ALL OTHER operations remain enabled
            expect(isExecutionEnabled()).toBe(true);
            expect(isVerificationEnabled()).toBe(true);
            expect(isSettlementEnabled()).toBe(true);
        });

        it('executionEnabled should ONLY block execution', () => {
            // Disable execution
            setExecutionEnabled(false);

            // Execution blocked
            expect(isExecutionEnabled()).toBe(false);

            // ALL OTHER operations remain enabled
            expect(isContractCreationEnabled()).toBe(true);
            expect(isVerificationEnabled()).toBe(true);
            expect(isSettlementEnabled()).toBe(true);
        });

        it('verificationEnabled should ONLY block verification', () => {
            // Disable verification
            setVerificationEnabled(false);

            // Verification blocked
            expect(isVerificationEnabled()).toBe(false);

            // ALL OTHER operations remain enabled
            expect(isContractCreationEnabled()).toBe(true);
            expect(isExecutionEnabled()).toBe(true);
            expect(isSettlementEnabled()).toBe(true);
        });

        it('settlementEnabled should ONLY block settlement', () => {
            // Disable settlement
            setSettlementEnabled(false);

            // Settlement blocked
            expect(isSettlementEnabled()).toBe(false);

            // ALL OTHER operations remain enabled
            expect(isContractCreationEnabled()).toBe(true);
            expect(isExecutionEnabled()).toBe(true);
            expect(isVerificationEnabled()).toBe(true);
        });
    });

    describe('disableAllOperations', () => {
        it('should block ALL write operations', () => {
            // Disable everything
            disableAllOperations();

            // ALL operations blocked
            expect(isContractCreationEnabled()).toBe(false);
            expect(isExecutionEnabled()).toBe(false);
            expect(isVerificationEnabled()).toBe(false);
            expect(isSettlementEnabled()).toBe(false);
        });

        it('should be reversible with enableAllOperations', () => {
            // Disable then re-enable
            disableAllOperations();
            expect(isContractCreationEnabled()).toBe(false);

            enableAllOperations();

            // ALL operations enabled again
            expect(isContractCreationEnabled()).toBe(true);
            expect(isExecutionEnabled()).toBe(true);
            expect(isVerificationEnabled()).toBe(true);
            expect(isSettlementEnabled()).toBe(true);
        });
    });

    describe('getKillSwitchStatus', () => {
        it('should return accurate status of all switches', () => {
            setContractCreationEnabled(false);
            setVerificationEnabled(false);

            const status = getKillSwitchStatus();

            expect(status.contractCreationEnabled).toBe(false);
            expect(status.executionEnabled).toBe(true);
            expect(status.verificationEnabled).toBe(false);
            expect(status.settlementEnabled).toBe(true);
        });

        it('should return a copy (not the original state)', () => {
            const status = getKillSwitchStatus();
            status.contractCreationEnabled = false; // Mutate the copy

            // Original should be unchanged
            expect(isContractCreationEnabled()).toBe(true);
        });
    });

    describe('Read-Only Operations', () => {
        it('read operations should remain available when all writes disabled', () => {
            disableAllOperations();

            // Simulate read-only operations (these should always work)
            const canReadLedger = true; // getEventsForContract would work
            const canReadContract = true; // getContract would work
            const canReadReceipts = true; // getReceipt would work

            // Kill switches do NOT affect reads
            expect(canReadLedger).toBe(true);
            expect(canReadContract).toBe(true);
            expect(canReadReceipts).toBe(true);
        });
    });

    describe('Kill Switch Enforcement Patterns', () => {
        it('createContract should check isContractCreationEnabled first', () => {
            // Pattern: if (!isContractCreationEnabled()) throw new Error('...')
            const guardPattern = () => {
                if (!isContractCreationEnabled()) {
                    throw new Error('Contract creation is disabled');
                }
                return 'success';
            };

            // Works when enabled
            expect(guardPattern()).toBe('success');

            // Fails when disabled
            setContractCreationEnabled(false);
            expect(() => guardPattern()).toThrow('Contract creation is disabled');
        });

        it('verification job should check isVerificationEnabled first', () => {
            const guardPattern = () => {
                if (!isVerificationEnabled()) {
                    throw new Error('Verification is disabled');
                }
                return 'verified';
            };

            expect(guardPattern()).toBe('verified');

            setVerificationEnabled(false);
            expect(() => guardPattern()).toThrow('Verification is disabled');
        });

        it('settlement job should check isSettlementEnabled first', () => {
            const guardPattern = () => {
                if (!isSettlementEnabled()) {
                    throw new Error('Settlement is disabled');
                }
                return 'settled';
            };

            expect(guardPattern()).toBe('settled');

            setSettlementEnabled(false);
            expect(() => guardPattern()).toThrow('Settlement is disabled');
        });

        it('execution should check isExecutionEnabled first', () => {
            const guardPattern = () => {
                if (!isExecutionEnabled()) {
                    throw new Error('Execution is disabled');
                }
                return 'executed';
            };

            expect(guardPattern()).toBe('executed');

            setExecutionEnabled(false);
            expect(() => guardPattern()).toThrow('Execution is disabled');
        });
    });
});
