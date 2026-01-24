import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    integer,
    jsonb,
    pgEnum,
    uniqueIndex,
    unique,
    index
} from 'drizzle-orm/pg-core';

// =====================
// ENUMS
// =====================

export const identityStatusEnum = pgEnum('identity_status', ['ACTIVE', 'SUSPENDED']);

// Platform enum - Tier 1, Tier 2, Tier 3 per roadmap
export const platformEnum = pgEnum('platform', [
    // Tier 1 - Ship First
    'X',
    'STRIPE',
    'GITHUB',
    // Tier 2 - Handle Carefully  
    'YOUTUBE',
    'TIKTOK',
    'SHOPIFY',
    // Tier 3 - Add Later
    'SUBSTACK',
    'APP_STORE',
    'PLAY_STORE',
    'NOTION',
    'LINEAR'
]);

// Metric types - grouped by category
export const metricTypeEnum = pgEnum('metric_type', [
    // Social metrics
    'FOLLOWERS',
    'IMPRESSIONS',
    'ENGAGEMENT_RATE',
    'VIEWS',
    'SUBSCRIBERS',
    // Revenue metrics
    'REVENUE',
    'MRR',
    'CHARGE_VOLUME',
    'GROSS_SALES',
    'ORDER_COUNT',
    // Developer metrics
    'COMMITS',
    'PRS_MERGED',
    'REPOS_CREATED',
    'STARS_GAINED',
    'DOWNLOADS',
    // Productivity metrics
    'TASKS_COMPLETED',
    'PROJECTS_SHIPPED'
]);

export const fundingMethodEnum = pgEnum('funding_method', ['USD_CARD', 'USD_ACH', 'CRYPTO']);

// Risk tier enum - policy invariant for designed success rates
export const riskTierEnum = pgEnum('risk_tier', ['STANDARD', 'ADVANCED', 'ELITE']);

export const connectedAccountStatusEnum = pgEnum('connected_account_status', ['ACTIVE', 'REVOKED']);

// Identity provider enum for immutable identity bindings
export const identityProviderEnum = pgEnum('identity_provider', [
    'stripe',
    'github',
    'x',
    'google',
    'youtube',
    'tiktok',
    'shopify'
]);

export const ledgerActorEnum = pgEnum('ledger_actor', ['SYSTEM', 'USER']);

// Funding source status for card verification
export const fundingSourceStatusEnum = pgEnum('funding_source_status', [
    'unconfigured',
    'pending_verification',
    'verified',
    'disabled'
]);

export const ledgerEventTypeEnum = pgEnum('ledger_event_type', [
    'CONTRACT_CREATED',
    'BASELINE_SNAPSHOTTED',
    'FUNDS_AUTHORIZED',
    'FUNDS_LOCKED',
    'EXECUTION_REQUESTED',
    'EXECUTION_CONFIRMED',
    'VERIFICATION_STARTED',
    'VERIFICATION_SUCCEEDED',
    'VERIFICATION_FAILED',
    'VERIFICATION_RESULT',
    'CONTRACT_VERIFIED',
    'SETTLEMENT_STARTED',
    'SETTLED_SUCCESS',
    'SETTLED_FAILURE',
    'PAYOUT_DEFERRED',
    'CONTRACT_SETTLED',
    'CONTRACT_FORFEITED',
    'RECEIPT_ISSUED',
    // Job reliability events
    'JOB_LOCK_ACQUIRED',
    'RETRY_SCHEDULED',
    // Identity binding events (operational, auditable)
    'IDENTITY_BOUND',
    'IDENTITY_REVOKED',
    // Dispute/Chargeback events
    'PAYMENT_DISPUTED',
    'SETTLED'
]);

// =====================
// TABLES
// =====================

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }),
    passwordHash: text('password_hash'), // For real password auth (bcrypt hash)
    passkeyId: varchar('passkey_id', { length: 255 }),
    // Stripe Connect: required for payouts
    stripeConnectedAccountId: varchar('stripe_connected_account_id', { length: 255 }),
    // X OAuth 1.0a: direct binding
    xUserId: text('x_user_id'),               // X user ID from OAuth
    xUsername: text('x_username'),             // X handle (e.g., "elonmusk")
    xConnectedAt: timestamp('x_connected_at', { withTimezone: true }),
    xAccessToken: text('x_access_token'),      // OAuth 1.0a access token
    xAccessTokenSecret: text('x_access_token_secret'), // OAuth 1.0a token secret
    xAccountCreatedAt: timestamp('x_account_created_at', { withTimezone: true }), // X account age for gating
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    uniqueIndex('idx_users_x_user_id').on(table.xUserId),
]);

export const identities = pgTable('identities', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    username: varchar('username', { length: 20 }).notNull(),
    displayName: varchar('display_name', { length: 50 }),
    bio: varchar('bio', { length: 120 }),
    photoUrl: text('photo_url'),
    status: identityStatusEnum('status').default('ACTIVE').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    uniqueIndex('identities_username_idx').on(table.username),
]);

export const connectedAccounts = pgTable('connected_accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    platform: platformEnum('platform').notNull(),
    externalAccountId: varchar('external_account_id', { length: 255 }).notNull(),
    accessTokenEnc: text('access_token_enc'),
    refreshTokenEnc: text('refresh_token_enc'),
    metadataJson: jsonb('metadata_json'),
    connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow().notNull(),
    status: connectedAccountStatusEnum('status').default('ACTIVE').notNull(),
    // Verification columns for proof-of-control
    verificationStatus: text('verification_status').notNull().default('PENDING'),
    challengeCode: text('challenge_code'),
    challengeIssuedAt: timestamp('challenge_issued_at', { withTimezone: true }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
});

// =============================================================================
// FUNDING SOURCES TABLE (Stripe Card Verification)
// =============================================================================
// Stores verified payment methods for capital lock operations
export const fundingSources = pgTable('funding_sources', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),
    stripePaymentMethodId: varchar('stripe_payment_method_id', { length: 255 }),
    stripeSetupIntentId: varchar('stripe_setup_intent_id', { length: 255 }),
    brand: varchar('brand', { length: 20 }),
    last4: varchar('last4', { length: 4 }),
    expMonth: integer('exp_month'),
    expYear: integer('exp_year'),
    status: fundingSourceStatusEnum('status').default('unconfigured').notNull(),
    availableBalanceUsdCents: integer('available_balance_usd_cents').default(0).notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userIdUnique: uniqueIndex('idx_funding_sources_user_id').on(table.userId),
    stripeCustomerIdx: index('idx_funding_sources_stripe_customer').on(table.stripeCustomerId),
    setupIntentIdx: index('idx_funding_sources_setup_intent').on(table.stripeSetupIntentId),
}));

// =============================================================================
// IDENTITY BINDINGS TABLE (Immutable, Append-Only)
// =============================================================================
// Each binding is append-only: to switch, revoke old + insert new.
// This provides an auditable trail of identity changes.
export const identityBindings = pgTable('identity_bindings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    provider: identityProviderEnum('provider').notNull(),
    // Provider-specific identifiers
    providerUserId: text('provider_user_id').notNull(),       // Stable ID from provider
    providerAccountId: text('provider_account_id'),           // Additional ID (e.g., Stripe connected account)
    // Audit trail
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdByEventId: uuid('created_by_event_id'),            // Link to ledger event
    // Revocation (for append-only rebinding)
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revokedByEventId: uuid('revoked_by_event_id'),
}, (table) => ({
    userIdIdx: index('idx_identity_bindings_user_id').on(table.userId),
    providerIdx: index('idx_identity_bindings_provider').on(table.provider),
}));

export const contracts = pgTable('contracts', {
    id: uuid('id').primaryKey().defaultRandom(),
    principalUserId: uuid('principal_user_id').references(() => users.id).notNull(),
    principalIdentityUsername: varchar('principal_identity_username', { length: 20 }).notNull(),
    platform: platformEnum('platform').notNull(),
    metricType: metricTypeEnum('metric_type').notNull(),
    conditionJson: jsonb('condition_json').notNull(),
    baselineJson: jsonb('baseline_json'),
    deadlineUtc: timestamp('deadline_utc', { withTimezone: true }).notNull(),
    lockAmountUsdCents: integer('lock_amount_usd_cents').notNull(),
    // PRECOMMITTED PAYOUT: Fixed at creation, never changes
    // Used for settlement success payout (no formulas, no tier math)
    payoutAmountUsdCents: integer('payout_amount_usd_cents').notNull(),
    fundingMethod: fundingMethodEnum('funding_method').default('USD_CARD').notNull(),
    // Risk tier - policy invariant for designed success rates
    riskTier: riskTierEnum('risk_tier').default('STANDARD').notNull(),
    // Target calculation metadata for audit/tuning
    targetCalculationMetadataJson: jsonb('target_calculation_metadata_json'),
    recordHash: varchar('record_hash', { length: 64 }),
    // IMMUTABLE BINDING SNAPSHOTS: Pinned at creation, never change
    // These reference the identity binding used at contract creation
    stripeBindingId: uuid('stripe_binding_id'),   // FK to identity_bindings deferred due to circular ref
    githubBindingId: uuid('github_binding_id'),   // FK to identity_bindings deferred
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ledgerEvents = pgTable('ledger_events', {
    id: uuid('id').primaryKey().defaultRandom(),
    contractId: uuid('contract_id').references(() => contracts.id).notNull(),
    actor: ledgerActorEnum('actor').notNull(),
    eventType: ledgerEventTypeEnum('event_type').notNull(),
    timestampUtc: timestamp('timestamp_utc', { withTimezone: true }).defaultNow().notNull(),
    amountUsdCents: integer('amount_usd_cents'),
    externalRef: varchar('external_ref', { length: 255 }),
    metadataJson: jsonb('metadata_json'),
    prevEventHash: varchar('prev_event_hash', { length: 64 }),
    eventHash: varchar('event_hash', { length: 64 }).notNull(),
}, (table) => ({
    // Unique constraint for race-safe idempotency on externalRef
    // Prevents duplicate events when webhooks retry under concurrency
    uniqueContractExternalRef: unique().on(table.contractId, table.externalRef),
}));

// Job locks table for atomic lock acquisition
// UNIQUE(contractId, jobType) ensures only one active lock per contract+jobType
export const jobLocks = pgTable('job_locks', {
    id: uuid('id').primaryKey().defaultRandom(),
    contractId: uuid('contract_id').references(() => contracts.id).notNull(),
    jobType: varchar('job_type', { length: 20 }).notNull(), // 'VERIFY' | 'SETTLE'
    lockId: uuid('lock_id').notNull(),
    acquiredAtUtc: timestamp('acquired_at_utc', { withTimezone: true }).notNull(),
    expiresAtUtc: timestamp('expires_at_utc', { withTimezone: true }).notNull(),
}, (table) => ({
    uniqueContractJob: unique().on(table.contractId, table.jobType),
}));

// =============================================================================
// CONTRACT INDEX TABLE (Derived from Ledger - Performance Only)
// =============================================================================
// This table is a DERIVED INDEX for efficient job queries.
// It is NOT a source of truth - the ledger is the source of truth.
// Updated atomically when ledger events are appended.
// Columns track latest state to avoid O(N) contract scans.
export const contractIndex = pgTable('contract_index', {
    contractId: uuid('contract_id').references(() => contracts.id).primaryKey(),
    // Current derived state (for filtering)
    currentState: varchar('current_state', { length: 30 }).notNull(),
    // Terminal flag (SETTLED/FORFEITED)
    isTerminal: integer('is_terminal').default(0).notNull(),
    // For cooldown checks: timestamp of last failure
    lastFailureAtUtc: timestamp('last_failure_at_utc', { withTimezone: true }),
    // For verification jobs: deadline
    deadlineUtc: timestamp('deadline_utc', { withTimezone: true }),
    // For retry scheduling: next retry due time
    nextRetryDueUtc: timestamp('next_retry_due_utc', { withTimezone: true }),
    // Last event metadata
    lastEventType: varchar('last_event_type', { length: 50 }),
    lastEventAtUtc: timestamp('last_event_at_utc', { withTimezone: true }),
    // Chain head hash for receipt integrity
    chainHeadHash: varchar('chain_head_hash', { length: 64 }),
});

// =====================
// TYPE EXPORTS
// =====================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Identity = typeof identities.$inferSelect;
export type NewIdentity = typeof identities.$inferInsert;

export type ConnectedAccount = typeof connectedAccounts.$inferSelect;
export type NewConnectedAccount = typeof connectedAccounts.$inferInsert;

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;

export type LedgerEvent = typeof ledgerEvents.$inferSelect;
export type NewLedgerEvent = typeof ledgerEvents.$inferInsert;

export type FundingSource = typeof fundingSources.$inferSelect;
export type NewFundingSource = typeof fundingSources.$inferInsert;

// Contract status enum values for state machine (derived from ledger events)
export const ContractStatus = {
    CREATED: 'CREATED',
    FUNDS_AUTHORIZED: 'FUNDS_AUTHORIZED',
    FUNDS_LOCKED: 'FUNDS_LOCKED',
    LOCKED: 'LOCKED',
    VERIFYING: 'VERIFYING',
    VERIFIED: 'VERIFIED',
    SETTLING: 'SETTLING',
    PAYOUT_PENDING: 'PAYOUT_PENDING',  // Verification succeeded but payout rail missing
    SETTLED: 'SETTLED',
    FORFEITED: 'FORFEITED',
} as const;

export type ContractStatusType = typeof ContractStatus[keyof typeof ContractStatus];

// Event type enum values
export const EventType = {
    CONTRACT_CREATED: 'CONTRACT_CREATED',
    BASELINE_SNAPSHOTTED: 'BASELINE_SNAPSHOTTED',
    FUNDS_AUTHORIZED: 'FUNDS_AUTHORIZED',
    FUNDS_LOCKED: 'FUNDS_LOCKED',
    EXECUTION_REQUESTED: 'EXECUTION_REQUESTED',
    EXECUTION_CONFIRMED: 'EXECUTION_CONFIRMED',
    VERIFICATION_STARTED: 'VERIFICATION_STARTED',
    VERIFICATION_SUCCEEDED: 'VERIFICATION_SUCCEEDED',
    VERIFICATION_FAILED: 'VERIFICATION_FAILED',
    VERIFICATION_RESULT: 'VERIFICATION_RESULT',
    CONTRACT_VERIFIED: 'CONTRACT_VERIFIED',
    SETTLEMENT_STARTED: 'SETTLEMENT_STARTED',
    SETTLED_SUCCESS: 'SETTLED_SUCCESS',
    SETTLED_FAILURE: 'SETTLED_FAILURE',
    PAYOUT_DEFERRED: 'PAYOUT_DEFERRED',
    CONTRACT_SETTLED: 'CONTRACT_SETTLED',
    CONTRACT_FORFEITED: 'CONTRACT_FORFEITED',
    RECEIPT_ISSUED: 'RECEIPT_ISSUED',
    // Job reliability events
    JOB_LOCK_ACQUIRED: 'JOB_LOCK_ACQUIRED',
    RETRY_SCHEDULED: 'RETRY_SCHEDULED',
    // Identity binding events (operational, auditable)
    IDENTITY_BOUND: 'IDENTITY_BOUND',
    IDENTITY_REVOKED: 'IDENTITY_REVOKED',
    // Dispute/Chargeback events
    PAYMENT_DISPUTED: 'PAYMENT_DISPUTED',
    SETTLED: 'SETTLED',
} as const;

export type EventTypeType = typeof EventType[keyof typeof EventType];
