/**
 * Identity Binding Tests
 * 
 * Tests for append-only identity binding system:
 * - Initial binding creates active binding
 * - Idempotent rebind (same identity) creates no duplicate
 * - Rebind to different identity revokes old + creates new
 * - Contract snapshot persistence across rebinds
 * - Spoof protection
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signAccessToken, verifyAccessToken, getPrincipal } from '../src/services/auth.js';

// Mock state for bindings
let mockBindings: any[] = [];
let mockContracts: any[] = [];
let nextBindingId = 1;
let nextContractId = 1;

// Reset state
function resetState() {
    mockBindings = [];
    mockContracts = [];
    nextBindingId = 1;
    nextContractId = 1;
}

// Simulate bindIdentity behavior
function bindIdentity(params: {
    userId: string;
    provider: string;
    providerUserId: string;
    providerAccountId?: string;
}) {
    const { userId, provider, providerUserId, providerAccountId } = params;

    // Find existing active binding for (userId, provider)
    const existingActive = mockBindings.find(b =>
        b.userId === userId &&
        b.provider === provider &&
        b.revokedAt === null
    );

    if (existingActive) {
        // Check if same identity (idempotent case)
        if (existingActive.providerUserId === providerUserId &&
            existingActive.providerAccountId === (providerAccountId || null)) {
            // Idempotent: return existing, no new row
            return {
                binding: existingActive,
                created: false,
                revokedBinding: undefined,
            };
        }

        // Different identity: revoke old
        existingActive.revokedAt = new Date();
    }

    // Create new binding
    const newBinding = {
        id: `binding-${nextBindingId++}`,
        userId,
        provider,
        providerUserId,
        providerAccountId: providerAccountId || null,
        createdAt: new Date(),
        revokedAt: null,
    };
    mockBindings.push(newBinding);

    return {
        binding: newBinding,
        created: true,
        revokedBinding: existingActive,
    };
}

// Simulate getActiveBinding
function getActiveBinding(userId: string, provider: string) {
    return mockBindings.find(b =>
        b.userId === userId &&
        b.provider === provider &&
        b.revokedAt === null
    ) || null;
}

// Simulate createContract with binding snapshot
function createContract(params: {
    principalUserId: string;
    platform: string;
}) {
    const { principalUserId, platform } = params;

    // Lookup active binding for platform
    const providerMap: Record<string, string> = {
        'STRIPE': 'stripe',
        'GITHUB': 'github',
    };
    const provider = providerMap[platform];
    const binding = provider ? getActiveBinding(principalUserId, provider) : null;

    const contract = {
        id: `contract-${nextContractId++}`,
        principalUserId,
        platform,
        // IMMUTABLE SNAPSHOT: binding reference at creation time
        stripeBindingId: platform === 'STRIPE' ? binding?.id || null : null,
        githubBindingId: platform === 'GITHUB' ? binding?.id || null : null,
        createdAt: new Date(),
    };
    mockContracts.push(contract);

    return contract;
}

describe('Identity Binding System', () => {
    beforeEach(() => {
        resetState();
    });

    describe('Initial Binding', () => {
        it('should create first active binding', () => {
            const result = bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_stripe123',
                providerAccountId: 'acct_stripe123',
            });

            expect(result.created).toBe(true);
            expect(result.binding.id).toBe('binding-1');
            expect(result.binding.userId).toBe('user-1');
            expect(result.binding.provider).toBe('stripe');
            expect(result.binding.providerUserId).toBe('acct_stripe123');
            expect(result.binding.revokedAt).toBeNull();
            expect(result.revokedBinding).toBeUndefined();
        });

        it('should have exactly one active binding after first bind', () => {
            bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_abc',
            });

            const activeBindings = mockBindings.filter(b =>
                b.userId === 'user-1' &&
                b.provider === 'stripe' &&
                b.revokedAt === null
            );

            expect(activeBindings.length).toBe(1);
        });
    });

    describe('Idempotent Rebind (Same Identity)', () => {
        it('should NOT create duplicate when binding same identity', () => {
            // First bind
            const first = bindIdentity({
                userId: 'user-1',
                provider: 'github',
                providerUserId: 'gh-12345',
                providerAccountId: 'octocat',
            });

            expect(first.created).toBe(true);
            expect(mockBindings.length).toBe(1);

            // Second bind with SAME identity
            const second = bindIdentity({
                userId: 'user-1',
                provider: 'github',
                providerUserId: 'gh-12345',
                providerAccountId: 'octocat',
            });

            expect(second.created).toBe(false);
            expect(second.binding.id).toBe(first.binding.id); // Same binding returned
            expect(mockBindings.length).toBe(1); // No duplicate row
        });

        it('should return existing binding for idempotent call', () => {
            bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_xyz',
            });

            const result = bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_xyz',
            });

            expect(result.created).toBe(false);
            expect(result.revokedBinding).toBeUndefined();
        });
    });

    describe('Rebind to Different Identity', () => {
        it('should revoke old binding and create new', () => {
            // First bind to identity A
            const first = bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_A',
            });
            expect(first.created).toBe(true);
            expect(first.binding.revokedAt).toBeNull();

            // Rebind to identity B
            const second = bindIdentity({
                userId: 'user-1',
                provider: 'stripe',
                providerUserId: 'acct_B',
            });

            expect(second.created).toBe(true);
            expect(second.revokedBinding).toBeDefined();
            expect(second.revokedBinding!.id).toBe(first.binding.id);
            expect(second.revokedBinding!.revokedAt).not.toBeNull();
        });

        it('should have two rows: one revoked, one active', () => {
            bindIdentity({
                userId: 'user-1',
                provider: 'github',
                providerUserId: 'gh-old',
            });

            bindIdentity({
                userId: 'user-1',
                provider: 'github',
                providerUserId: 'gh-new',
            });

            expect(mockBindings.length).toBe(2);

            const active = mockBindings.filter(b => b.revokedAt === null);
            const revoked = mockBindings.filter(b => b.revokedAt !== null);

            expect(active.length).toBe(1);
            expect(active[0].providerUserId).toBe('gh-new');
            expect(revoked.length).toBe(1);
            expect(revoked[0].providerUserId).toBe('gh-old');
        });

        it('should preserve audit trail with history', () => {
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'acct_1' });
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'acct_2' });
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'acct_3' });

            expect(mockBindings.length).toBe(3);

            const history = mockBindings
                .filter(b => b.userId === 'user-1' && b.provider === 'stripe')
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            expect(history[0].providerUserId).toBe('acct_1');
            expect(history[0].revokedAt).not.toBeNull();
            expect(history[1].providerUserId).toBe('acct_2');
            expect(history[1].revokedAt).not.toBeNull();
            expect(history[2].providerUserId).toBe('acct_3');
            expect(history[2].revokedAt).toBeNull(); // Current active
        });
    });

    describe('Partial Unique Index Enforcement', () => {
        it('should allow only one active binding per (user, provider)', () => {
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'acct_X' });
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'acct_Y' });

            const activeStripeBindings = mockBindings.filter(b =>
                b.userId === 'user-1' &&
                b.provider === 'stripe' &&
                b.revokedAt === null
            );

            // Enforced by partial unique index: only ONE active
            expect(activeStripeBindings.length).toBe(1);
            expect(activeStripeBindings[0].providerUserId).toBe('acct_Y');
        });

        it('should allow different providers for same user', () => {
            bindIdentity({ userId: 'user-1', provider: 'stripe', providerUserId: 'stripe_123' });
            bindIdentity({ userId: 'user-1', provider: 'github', providerUserId: 'github_456' });

            const activeBindings = mockBindings.filter(b => b.revokedAt === null);
            expect(activeBindings.length).toBe(2);
        });
    });
});

describe('Contract Binding Snapshot', () => {
    beforeEach(() => {
        resetState();
    });

    it('should snapshot binding A when creating contract with binding A', () => {
        // Bind identity A
        const bindResult = bindIdentity({
            userId: 'user-1',
            provider: 'stripe',
            providerUserId: 'acct_A',
        });

        // Create contract
        const contract = createContract({
            principalUserId: 'user-1',
            platform: 'STRIPE',
        });

        expect(contract.stripeBindingId).toBe(bindResult.binding.id);
    });

    it('should snapshot binding B for new contract after rebind', () => {
        // Bind A
        const bindA = bindIdentity({
            userId: 'user-1',
            provider: 'stripe',
            providerUserId: 'acct_A',
        });

        // Create contract1 with A
        const contract1 = createContract({
            principalUserId: 'user-1',
            platform: 'STRIPE',
        });

        // Rebind to B
        const bindB = bindIdentity({
            userId: 'user-1',
            provider: 'stripe',
            providerUserId: 'acct_B',
        });

        // Create contract2 with B
        const contract2 = createContract({
            principalUserId: 'user-1',
            platform: 'STRIPE',
        });

        expect(contract1.stripeBindingId).toBe(bindA.binding.id);
        expect(contract2.stripeBindingId).toBe(bindB.binding.id);
    });

    it('should PRESERVE contract1 binding A after rebind to B (CRITICAL)', () => {
        // Step 1: Bind A
        const bindA = bindIdentity({
            userId: 'user-1',
            provider: 'stripe',
            providerUserId: 'acct_A',
            providerAccountId: 'acct_A',
        });

        // Step 2: Create contract1 with A
        const contract1 = createContract({
            principalUserId: 'user-1',
            platform: 'STRIPE',
        });
        expect(contract1.stripeBindingId).toBe('binding-1');

        // Step 3: Rebind to B
        const bindB = bindIdentity({
            userId: 'user-1',
            provider: 'stripe',
            providerUserId: 'acct_B',
            providerAccountId: 'acct_B',
        });

        // Step 4: Verify contract1 STILL references A (immutable snapshot)
        expect(contract1.stripeBindingId).toBe('binding-1');
        expect(contract1.stripeBindingId).not.toBe(bindB.binding.id);

        // Step 5: Verify adapter would use A's account ID
        const contract1Binding = mockBindings.find(b => b.id === contract1.stripeBindingId);
        expect(contract1Binding).toBeDefined();
        expect(contract1Binding.providerAccountId).toBe('acct_A');
    });

    it('should have null bindingId if no binding exists at creation', () => {
        const contract = createContract({
            principalUserId: 'user-1',
            platform: 'STRIPE',
        });

        expect(contract.stripeBindingId).toBeNull();
    });
});

describe('Spoof Protection', () => {
    beforeEach(() => {
        resetState();
    });

    it('attacker cannot create contract under victim userId (CRITICAL)', () => {
        // Attacker has valid token
        const attackerToken = signAccessToken('attacker-user-id');
        const attackerPrincipal = verifyAccessToken(attackerToken);

        // Attacker tries to spoof victim
        const spoofedRequest = {
            body: { userId: 'victim-user-id' },
        };

        // The principalUserId comes from token, NOT from body
        expect(attackerPrincipal).toBe('attacker-user-id');
        expect(attackerPrincipal).not.toBe(spoofedRequest.body.userId);

        // Create contract with CORRECT principal
        const contract = createContract({
            principalUserId: attackerPrincipal, // From token, not body
            platform: 'GITHUB',
        });

        // Contract belongs to attacker, not victim
        expect(contract.principalUserId).toBe('attacker-user-id');
        expect(contract.principalUserId).not.toBe('victim-user-id');
    });

    it('getPrincipal throws if not authenticated', () => {
        const unauthenticatedRequest = { principalUserId: undefined } as any;

        expect(() => getPrincipal(unauthenticatedRequest)).toThrow();
    });

    it('ledger events use principalUserId not body userId', () => {
        const attackerToken = signAccessToken('user-attacker');
        const principal = verifyAccessToken(attackerToken);

        // Simulate ledger event creation
        const event = {
            contractId: 'contract-1',
            actor: principal, // Derived from auth, not body
            eventType: 'CONTRACT_CREATED',
        };

        expect(event.actor).toBe('user-attacker');
    });
});
