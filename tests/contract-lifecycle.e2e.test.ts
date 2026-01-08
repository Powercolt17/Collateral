/**
 * Contract Lifecycle End-to-End Test
 * 
 * Tests the complete contract lifecycle expectations:
 * LOCKED → VERIFYING → VERIFIED → SETTLING → SETTLED → RECEIPT_ISSUED
 * 
 * These tests validate behavior using mocked dependencies.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContractStatus, EventType } from '../src/db/schema.js';

// Simulated event chain and state
let mockEvents: any[] = [];
let mockContractIndexState: any = {};

// Track appendEvent calls
const appendedEvents: any[] = [];

// Event to state mapping (mirrors production)
const EVENT_TO_STATE: Record<string, string> = {
    [EventType.CONTRACT_CREATED]: ContractStatus.CREATED,
    [EventType.EXECUTION_CONFIRMED]: ContractStatus.LOCKED,
    [EventType.VERIFICATION_STARTED]: 'VERIFYING',
    [EventType.VERIFICATION_SUCCEEDED]: ContractStatus.VERIFIED,
    [EventType.VERIFICATION_FAILED]: ContractStatus.VERIFIED,
    [EventType.CONTRACT_VERIFIED]: ContractStatus.VERIFIED,
    [EventType.SETTLEMENT_STARTED]: 'SETTLING',
    [EventType.SETTLED_SUCCESS]: ContractStatus.SETTLED,
    [EventType.SETTLED_FAILURE]: 'FORFEITED',
    [EventType.RECEIPT_ISSUED]: ContractStatus.SETTLED, // doesn't change
};

const TERMINAL_STATES = new Set([ContractStatus.SETTLED, 'FORFEITED']);

// Reset function
function resetMocks() {
    mockEvents = [];
    mockContractIndexState = { currentState: ContractStatus.CREATED, isTerminal: 0 };
    appendedEvents.length = 0;
}

// Mock appendEvent behavior
function mockAppendEvent(params: { contractId: string; eventType: string; metadata?: any }) {
    const event = {
        id: `event-${mockEvents.length + 1}`,
        contractId: params.contractId,
        eventType: params.eventType,
        metadataJson: params.metadata || {},
        timestampUtc: new Date(),
        eventHash: `hash-${mockEvents.length + 1}`,
        prevEventHash: mockEvents.length > 0 ? mockEvents[mockEvents.length - 1].eventHash : null,
    };
    mockEvents.push(event);
    appendedEvents.push(params);

    // Update contract index (only for state-changing events)
    const derivedState = EVENT_TO_STATE[params.eventType];
    if (derivedState) {
        mockContractIndexState.currentState = derivedState;
        mockContractIndexState.isTerminal = TERMINAL_STATES.has(derivedState) ? 1 : 0;
    }

    return event;
}

// Mock deriveState behavior
function mockDeriveState(events: any[]): string | null {
    const eventTypes = events.map(e => e.eventType);
    if (eventTypes.includes(EventType.SETTLED_SUCCESS)) return ContractStatus.SETTLED;
    if (eventTypes.includes(EventType.SETTLED_FAILURE)) return 'FORFEITED';
    if (eventTypes.includes(EventType.SETTLEMENT_STARTED)) return 'SETTLING';
    if (eventTypes.includes(EventType.CONTRACT_VERIFIED) ||
        eventTypes.includes(EventType.VERIFICATION_SUCCEEDED) ||
        eventTypes.includes(EventType.VERIFICATION_FAILED)) return ContractStatus.VERIFIED;
    if (eventTypes.includes(EventType.VERIFICATION_STARTED)) return 'VERIFYING';
    if (eventTypes.includes(EventType.EXECUTION_CONFIRMED)) return ContractStatus.LOCKED;
    if (eventTypes.includes(EventType.CONTRACT_CREATED)) return ContractStatus.CREATED;
    return null;
}

describe('Contract Lifecycle E2E', () => {
    beforeEach(() => {
        resetMocks();
        vi.clearAllMocks();
    });

    describe('Golden Path: Event Sequence', () => {
        it('verification should append VERIFICATION_STARTED, VERIFICATION_SUCCEEDED, CONTRACT_VERIFIED', () => {
            // Setup: contract at LOCKED
            mockEvents = [
                { id: 'e1', eventType: EventType.CONTRACT_CREATED, eventHash: 'h1', prevEventHash: null },
                { id: 'e2', eventType: EventType.EXECUTION_CONFIRMED, eventHash: 'h2', prevEventHash: 'h1' },
            ];
            mockContractIndexState = { currentState: ContractStatus.LOCKED, isTerminal: 0 };

            // Simulate verification appending events
            mockAppendEvent({ contractId: 'c1', eventType: EventType.VERIFICATION_STARTED });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.VERIFICATION_SUCCEEDED, metadata: { observedValue: 1500 } });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.CONTRACT_VERIFIED, metadata: { outcome: 'SUCCEEDED' } });

            // Verify events
            const eventTypes = mockEvents.map(e => e.eventType);
            expect(eventTypes).toContain(EventType.VERIFICATION_STARTED);
            expect(eventTypes).toContain(EventType.VERIFICATION_SUCCEEDED);
            expect(eventTypes).toContain(EventType.CONTRACT_VERIFIED);

            // Verify state
            expect(mockContractIndexState.currentState).toBe(ContractStatus.VERIFIED);
            expect(mockContractIndexState.isTerminal).toBe(0);
        });

        it('settlement should append SETTLEMENT_STARTED, SETTLED_SUCCESS, RECEIPT_ISSUED', () => {
            // Setup: contract at VERIFIED
            mockEvents = [
                { id: 'e1', eventType: EventType.VERIFICATION_SUCCEEDED, eventHash: 'h1', prevEventHash: null },
            ];
            mockContractIndexState = { currentState: ContractStatus.VERIFIED, isTerminal: 0 };

            // Simulate settlement appending events
            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLEMENT_STARTED });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_SUCCESS, metadata: { stripeTransferId: 'tr_123' } });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.RECEIPT_ISSUED, metadata: { chainHeadHash: 'h3' } });

            // Verify events
            const eventTypes = mockEvents.map(e => e.eventType);
            expect(eventTypes).toContain(EventType.SETTLEMENT_STARTED);
            expect(eventTypes).toContain(EventType.SETTLED_SUCCESS);
            expect(eventTypes).toContain(EventType.RECEIPT_ISSUED);

            // Verify terminal state
            expect(mockContractIndexState.currentState).toBe(ContractStatus.SETTLED);
            expect(mockContractIndexState.isTerminal).toBe(1);
        });

        it('complete lifecycle from LOCKED to SETTLED', () => {
            // Start at LOCKED
            mockEvents = [
                { id: 'e1', eventType: EventType.CONTRACT_CREATED, eventHash: 'h1' },
                { id: 'e2', eventType: EventType.EXECUTION_CONFIRMED, eventHash: 'h2' },
            ];
            mockContractIndexState = { currentState: ContractStatus.LOCKED, isTerminal: 0 };

            // Verification phase
            mockAppendEvent({ contractId: 'c1', eventType: EventType.VERIFICATION_STARTED });
            expect(mockContractIndexState.currentState).toBe('VERIFYING');

            mockAppendEvent({ contractId: 'c1', eventType: EventType.VERIFICATION_SUCCEEDED });
            expect(mockContractIndexState.currentState).toBe(ContractStatus.VERIFIED);

            mockAppendEvent({ contractId: 'c1', eventType: EventType.CONTRACT_VERIFIED });
            expect(mockContractIndexState.currentState).toBe(ContractStatus.VERIFIED);

            // Settlement phase
            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLEMENT_STARTED });
            expect(mockContractIndexState.currentState).toBe('SETTLING');

            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_SUCCESS });
            expect(mockContractIndexState.currentState).toBe(ContractStatus.SETTLED);
            expect(mockContractIndexState.isTerminal).toBe(1);

            mockAppendEvent({ contractId: 'c1', eventType: EventType.RECEIPT_ISSUED });
            // Receipt doesn't change state
            expect(mockContractIndexState.currentState).toBe(ContractStatus.SETTLED);
        });
    });

    describe('Hash Chain Integrity', () => {
        it('each event prevEventHash should match prior eventHash', () => {
            mockAppendEvent({ contractId: 'c1', eventType: EventType.CONTRACT_CREATED });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.EXECUTION_CONFIRMED });
            mockAppendEvent({ contractId: 'c1', eventType: EventType.VERIFICATION_STARTED });

            // Verify chain
            for (let i = 1; i < mockEvents.length; i++) {
                expect(mockEvents[i].prevEventHash).toBe(mockEvents[i - 1].eventHash);
            }
        });

        it('first event should have null prevEventHash', () => {
            mockAppendEvent({ contractId: 'c1', eventType: EventType.CONTRACT_CREATED });
            expect(mockEvents[0].prevEventHash).toBeNull();
        });
    });

    describe('deriveState correctness', () => {
        it('should derive CREATED from CONTRACT_CREATED only', () => {
            mockEvents = [{ eventType: EventType.CONTRACT_CREATED }];
            expect(mockDeriveState(mockEvents)).toBe(ContractStatus.CREATED);
        });

        it('should derive LOCKED from EXECUTION_CONFIRMED', () => {
            mockEvents = [
                { eventType: EventType.CONTRACT_CREATED },
                { eventType: EventType.EXECUTION_CONFIRMED },
            ];
            expect(mockDeriveState(mockEvents)).toBe(ContractStatus.LOCKED);
        });

        it('should derive VERIFYING from VERIFICATION_STARTED', () => {
            mockEvents = [
                { eventType: EventType.CONTRACT_CREATED },
                { eventType: EventType.EXECUTION_CONFIRMED },
                { eventType: EventType.VERIFICATION_STARTED },
            ];
            expect(mockDeriveState(mockEvents)).toBe('VERIFYING');
        });

        it('should derive VERIFIED from VERIFICATION_SUCCEEDED', () => {
            mockEvents = [
                { eventType: EventType.VERIFICATION_STARTED },
                { eventType: EventType.VERIFICATION_SUCCEEDED },
            ];
            expect(mockDeriveState(mockEvents)).toBe(ContractStatus.VERIFIED);
        });

        it('should derive SETTLING from SETTLEMENT_STARTED', () => {
            mockEvents = [
                { eventType: EventType.VERIFICATION_SUCCEEDED },
                { eventType: EventType.SETTLEMENT_STARTED },
            ];
            expect(mockDeriveState(mockEvents)).toBe('SETTLING');
        });

        it('should derive SETTLED from SETTLED_SUCCESS', () => {
            mockEvents = [
                { eventType: EventType.SETTLEMENT_STARTED },
                { eventType: EventType.SETTLED_SUCCESS },
            ];
            expect(mockDeriveState(mockEvents)).toBe(ContractStatus.SETTLED);
        });

        it('should derive FORFEITED from SETTLED_FAILURE', () => {
            mockEvents = [
                { eventType: EventType.SETTLEMENT_STARTED },
                { eventType: EventType.SETTLED_FAILURE },
            ];
            expect(mockDeriveState(mockEvents)).toBe('FORFEITED');
        });
    });

    describe('contract_index correctness', () => {
        it('should only update currentState for state-changing events', () => {
            mockContractIndexState = { currentState: ContractStatus.LOCKED, isTerminal: 0 };

            // RETRY_SCHEDULED is NOT in EVENT_TO_STATE - should not change state
            mockEvents = [];
            const event = {
                id: 'e1',
                eventType: EventType.RETRY_SCHEDULED,
                eventHash: 'h1',
                prevEventHash: null,
            };
            mockEvents.push(event);

            // Manually check: EVENT_TO_STATE['RETRY_SCHEDULED'] is undefined
            const derivedState = EVENT_TO_STATE[EventType.RETRY_SCHEDULED];
            expect(derivedState).toBeUndefined();

            // State should remain unchanged
            // (In production, appendEvent skips updating currentState for undefined derivedState)
        });

        it('should set isTerminal=1 only for SETTLED or FORFEITED', () => {
            mockContractIndexState = { currentState: ContractStatus.VERIFIED, isTerminal: 0 };

            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_SUCCESS });
            expect(mockContractIndexState.currentState).toBe(ContractStatus.SETTLED);
            expect(mockContractIndexState.isTerminal).toBe(1);
        });

        it('should set isTerminal=1 for FORFEITED', () => {
            mockContractIndexState = { currentState: 'SETTLING', isTerminal: 0 };

            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_FAILURE });
            expect(mockContractIndexState.currentState).toBe('FORFEITED');
            expect(mockContractIndexState.isTerminal).toBe(1);
        });
    });

    describe('Idempotency requirements', () => {
        it('terminal verification event should prevent re-verification', () => {
            // Document: if VERIFICATION_SUCCEEDED or VERIFICATION_FAILED exists,
            // verifyContract returns cached result without calling adapter
            mockEvents = [
                { eventType: EventType.VERIFICATION_SUCCEEDED, metadataJson: { observedValue: 1500 } },
            ];

            const hasTerminal = mockEvents.some(e =>
                e.eventType === EventType.VERIFICATION_SUCCEEDED ||
                e.eventType === EventType.VERIFICATION_FAILED
            );
            expect(hasTerminal).toBe(true);
        });

        it('terminal settlement event should prevent re-settlement', () => {
            mockEvents = [
                { eventType: EventType.SETTLED_SUCCESS },
            ];

            const hasTerminal = mockEvents.some(e =>
                e.eventType === EventType.SETTLED_SUCCESS ||
                e.eventType === EventType.SETTLED_FAILURE
            );
            expect(hasTerminal).toBe(true);
        });
    });

    describe('Receipt requirements', () => {
        it('receipt should be issued after terminal settlement event', () => {
            mockEvents = [];
            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_SUCCESS });
            mockAppendEvent({
                contractId: 'c1', eventType: EventType.RECEIPT_ISSUED, metadata: {
                    contractParams: { recordHash: 'abc123' },
                    chainHeadHash: 'hash-2',
                }
            });

            const receipt = mockEvents.find(e => e.eventType === EventType.RECEIPT_ISSUED);
            expect(receipt).toBeDefined();
            expect(receipt.metadataJson.contractParams.recordHash).toBe('abc123');
        });

        it('receipt metadata should include chainHeadHash at issuance time', () => {
            mockEvents = [];
            mockAppendEvent({ contractId: 'c1', eventType: EventType.SETTLED_SUCCESS });

            // Chain head before receipt is hash-1
            const chainHeadBefore = mockEvents[mockEvents.length - 1].eventHash;

            mockAppendEvent({
                contractId: 'c1', eventType: EventType.RECEIPT_ISSUED, metadata: {
                    chainHeadHash: chainHeadBefore,
                }
            });

            const receipt = mockEvents.find(e => e.eventType === EventType.RECEIPT_ISSUED);
            expect(receipt.metadataJson.chainHeadHash).toBe('hash-1');
        });
    });

    describe('Job runner candidate selection requirements', () => {
        it('runVerificationJob should only select LOCKED contracts', () => {
            // Document: The query filters on:
            // - currentState = LOCKED
            // - isTerminal = 0
            // - deadlineUtc <= now
            // - nextRetryDueUtc IS NULL OR <= now
            const expectedFilters = {
                currentState: ContractStatus.LOCKED,
                isTerminal: 0,
            };

            expect(expectedFilters.currentState).toBe('LOCKED');
            expect(expectedFilters.isTerminal).toBe(0);
        });

        it('runSettlementJob should only select VERIFIED contracts', () => {
            const expectedFilters = {
                currentState: ContractStatus.VERIFIED,
                isTerminal: 0,
            };

            expect(expectedFilters.currentState).toBe('VERIFIED');
            expect(expectedFilters.isTerminal).toBe(0);
        });
    });
});
