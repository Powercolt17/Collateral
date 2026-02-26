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
    index,
    boolean
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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
    'AMAZON',
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
    'shopify',
    'amazon'
]);

export const ledgerActorEnum = pgEnum('ledger_actor', ['SYSTEM', 'USER']);

// Funding source status for card verification
export const fundingSourceStatusEnum = pgEnum('funding_source_status', [
    'unconfigured',
    'pending_verification',
    'verified',
    'disabled'
]);

// Account ledger event types for balance tracking
export const accountLedgerEventTypeEnum = pgEnum('account_ledger_event_type', [
    'FUNDS_ADDED',
    'CAPITAL_LOCKED',
    'CAPITAL_UNLOCKED',
    'SETTLEMENT_WIN',
    'SETTLEMENT_LOSS',
    'PAYOUT_QUEUED',
    'PAYOUT_SENT',
    'PAYOUT_FAILED',
    'DISPUTE_OPENED',
    'DISPUTE_RESOLVED'
]);

// Connect account onboarding status
export const connectOnboardingStatusEnum = pgEnum('connect_onboarding_status', [
    'not_configured',
    'pending',
    'connected',
    'restricted',
    'error'
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
    'SETTLED',
    // Sales revenue tracking events
    'SALES_BASELINE_SNAPSHOTTED',
    'SALES_TERMS_ATTACHED',
    'SALES_VERIFICATION_QUEUED',
    'SALES_VERIFICATION_COMPUTED',
    // Commerce performance events (Shopify, Amazon)
    'COMMERCE_BASELINE_CAPTURED',
    'COMMERCE_TARGET_LOCKED',
    'COMMERCE_VERIFIED_SUCCESS',
    'COMMERCE_VERIFIED_FAIL',
    // Commerce hardening events
    'COMMERCE_PROVIDER_CONNECTED',
    'COMMERCE_PROVIDER_DISCONNECTED',
    'COMMERCE_PROVIDER_VALIDATED',
    'COMMERCE_ELIGIBILITY_CHECKED',
    'COMMERCE_ELIGIBILITY_FAILED',
    'COMMERCE_VERIFICATION_RETRY',
    'COMMERCE_VERIFICATION_UNVERIFIABLE',
    'COMMERCE_JOB_LOCK_ACQUIRED',
    'COMMERCE_JOB_LOCK_CONTENTION',
    'COMMERCE_JOB_LOCK_RELEASED'
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
    // Clerk OAuth
    clerkUserId: varchar('clerk_user_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    uniqueIndex('idx_users_x_user_id').on(table.xUserId),
    uniqueIndex('idx_users_clerk_user_id').on(table.clerkUserId),
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
    // Commerce hardening columns (provider validation)
    providerShopId: varchar('provider_shop_id', { length: 255 }),
    providerCurrency: varchar('provider_currency', { length: 10 }),
    providerTimezone: varchar('provider_timezone', { length: 64 }),
    scopesHash: varchar('scopes_hash', { length: 64 }),
    scopesGranted: jsonb('scopes_granted'),
    lastValidatedAt: timestamp('last_validated_at', { withTimezone: true }),
    validationErrorCode: varchar('validation_error_code', { length: 50 }),
});

// =============================================================================
// VERIFICATION JOB LOCKS TABLE (Idempotency + Single Writer)
// =============================================================================
// Ensures only one worker processes a verification job at a time
export const verificationJobLocks = pgTable('verification_job_locks', {
    idempotencyKey: varchar('idempotency_key', { length: 255 }).primaryKey(),
    contractId: uuid('contract_id').notNull(),
    jobType: varchar('job_type', { length: 50 }).notNull(),
    provider: varchar('provider', { length: 20 }).notNull(),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    windowEnd: timestamp('window_end', { withTimezone: true }).notNull(),
    lockedAt: timestamp('locked_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    lockedBy: varchar('locked_by', { length: 255 }).notNull(),
    attemptCount: integer('attempt_count').default(1).notNull(),
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
    // LIVE MARKET LINKAGE
    marketInstanceId: uuid('market_instance_id'), // FK to market_contract_instances deferred
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

// =============================================================================
// ACCOUNT LEDGER EVENTS (Balance derivation - single source of truth)
// =============================================================================
// All user balance changes are append-only events in this ledger.
// Balances are derived by summing events, NOT stored directly.
export const accountLedgerEvents = pgTable('account_ledger_events', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    contractId: uuid('contract_id').references(() => contracts.id),
    eventType: varchar('event_type', { length: 50 }).notNull(),
    amountCents: integer('amount_cents').notNull(),
    idempotencyKey: varchar('idempotency_key', { length: 255 }).notNull().unique(),
    metadata: jsonb('metadata'),
    // For idempotency referencing (e.g. tracking Payout -> Queued Event)
    originEventId: uuid('origin_event_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userIdx: index('account_ledger_user_idx').on(table.userId),
    contractIdx: index('account_ledger_contract_idx').on(table.contractId),
    idempotencyIdx: uniqueIndex('account_ledger_idempotency_idx').on(table.idempotencyKey),
    // Partial unique index to enforce exactly one terminal payout event per queued event
    payoutOriginIdx: uniqueIndex('uq_payout_origin_once').on(table.originEventId).where(sql`event_type IN ('PAYOUT_SENT', 'PAYOUT_FAILED')`),
}));

// =============================================================================
// CONNECT ACCOUNTS (Stripe Connect onboarding status)
// =============================================================================
export const connectAccounts = pgTable('connect_accounts', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id).unique(),
    stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }).notNull(),
    accountType: varchar('account_type', { length: 20 }).default('express').notNull(),
    onboardingStatus: varchar('onboarding_status', { length: 30 }).default('pending').notNull(),
    payoutsEnabled: boolean('payouts_enabled').default(false),
    chargesEnabled: boolean('charges_enabled').default(false),
    detailsSubmitted: boolean('details_submitted').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userIdx: uniqueIndex('connect_accounts_user_idx').on(table.userId),
    stripeAccountIdx: index('connect_accounts_stripe_idx').on(table.stripeConnectAccountId),
}));

// =============================================================================
// SALES INTEGRATION TABLES (Stripe Revenue)
// =============================================================================

// Sales provider enum - currently Stripe only
export const salesProviderEnum = pgEnum('sales_provider', ['stripe']);

// Sales baseline snapshots - immutable baseline captures using Stripe revenue
export const salesBaselineSnapshots = pgTable('sales_baseline_snapshots', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    provider: salesProviderEnum('provider').default('stripe').notNull(),
    windowDays: integer('window_days').default(30).notNull(),
    windowStartAt: timestamp('window_start_at', { withTimezone: true }).notNull(),
    windowEndAt: timestamp('window_end_at', { withTimezone: true }).notNull(),
    // Computed metrics + raw summary (immutable)
    baselineJson: jsonb('baseline_json').notNull(),
    // Hardening columns
    dataHash: varchar('data_hash', { length: 64 }),
    lastOrderId: varchar('last_order_id', { length: 255 }),
    apiVersion: varchar('api_version', { length: 20 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    userWindowUnique: unique().on(table.userId, table.windowStartAt, table.windowEndAt),
    userIdx: index('idx_sales_baseline_snapshots_user_id').on(table.userId),
}));

// Sales metric enum
export const salesMetricEnum = pgEnum('sales_metric', ['net_settled_amount', 'closed_won_count']);

// Sales verification status enum
export const salesVerificationStatusEnum = pgEnum('sales_verification_status', ['queued', 'running', 'ok', 'error']);

// Sales contract terms - immutable terms captured at execution time
export const salesContractTerms = pgTable('sales_contract_terms', {
    contractId: uuid('contract_id').references(() => contracts.id).primaryKey(),
    provider: salesProviderEnum('provider').default('stripe').notNull(),
    metric: salesMetricEnum('metric').notNull(),
    windowDays: integer('window_days').notNull(),
    baselineSnapshotId: uuid('baseline_snapshot_id').references(() => salesBaselineSnapshots.id).notNull(),
    // All money in BIGINT cents
    baselineValueCents: integer('baseline_value_cents').notNull(),
    targetDeltaCents: integer('target_delta_cents').notNull(),
    targetTotalCents: integer('target_total_cents').notNull(),
    // Qualification rules (refunds/chargebacks exclusion etc.)
    qualifiedRulesJson: jsonb('qualified_rules_json'),
    executedAt: timestamp('executed_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Sales verification runs - audit trail of verification attempts
export const salesVerificationRuns = pgTable('sales_verification_runs', {
    id: uuid('id').primaryKey().defaultRandom(),
    contractId: uuid('contract_id').references(() => contracts.id).notNull(),
    provider: salesProviderEnum('provider').notNull(),
    status: salesVerificationStatusEnum('status').default('queued').notNull(),
    attempt: integer('attempt').default(1).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    // Computed totals, counts, etc.
    resultJson: jsonb('result_json'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    contractIdx: index('idx_sales_verification_runs_contract_id').on(table.contractId),
    statusIdx: index('idx_sales_verification_runs_status').on(table.status),
    contractCreatedIdx: index('idx_sales_verification_runs_contract_created').on(table.contractId, table.createdAt),
}));

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

export type AccountLedgerEvent = typeof accountLedgerEvents.$inferSelect;
export type NewAccountLedgerEvent = typeof accountLedgerEvents.$inferInsert;

export type ConnectAccount = typeof connectAccounts.$inferSelect;
export type NewConnectAccount = typeof connectAccounts.$inferInsert;

// Sales baseline/terms/verification types

export type SalesBaselineSnapshot = typeof salesBaselineSnapshots.$inferSelect;
export type NewSalesBaselineSnapshot = typeof salesBaselineSnapshots.$inferInsert;

export type SalesContractTerms = typeof salesContractTerms.$inferSelect;
export type NewSalesContractTerms = typeof salesContractTerms.$inferInsert;

export type SalesVerificationRun = typeof salesVerificationRuns.$inferSelect;
export type NewSalesVerificationRun = typeof salesVerificationRuns.$inferInsert;

export type VerificationJobLock = typeof verificationJobLocks.$inferSelect;
export type NewVerificationJobLock = typeof verificationJobLocks.$inferInsert;

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
    // Sales revenue tracking events
    SALES_BASELINE_SNAPSHOTTED: 'SALES_BASELINE_SNAPSHOTTED',
    SALES_TERMS_ATTACHED: 'SALES_TERMS_ATTACHED',
    SALES_VERIFICATION_QUEUED: 'SALES_VERIFICATION_QUEUED',
    SALES_VERIFICATION_COMPUTED: 'SALES_VERIFICATION_COMPUTED',
    // Commerce performance events (Shopify, Amazon)
    COMMERCE_BASELINE_CAPTURED: 'COMMERCE_BASELINE_CAPTURED',
    COMMERCE_TARGET_LOCKED: 'COMMERCE_TARGET_LOCKED',
    COMMERCE_VERIFIED_SUCCESS: 'COMMERCE_VERIFIED_SUCCESS',
    COMMERCE_VERIFIED_FAIL: 'COMMERCE_VERIFIED_FAIL',
    // Commerce hardening events
    COMMERCE_PROVIDER_CONNECTED: 'COMMERCE_PROVIDER_CONNECTED',
    COMMERCE_PROVIDER_DISCONNECTED: 'COMMERCE_PROVIDER_DISCONNECTED',
    COMMERCE_PROVIDER_VALIDATED: 'COMMERCE_PROVIDER_VALIDATED',
    COMMERCE_ELIGIBILITY_CHECKED: 'COMMERCE_ELIGIBILITY_CHECKED',
    COMMERCE_ELIGIBILITY_FAILED: 'COMMERCE_ELIGIBILITY_FAILED',
    COMMERCE_VERIFICATION_RETRY: 'COMMERCE_VERIFICATION_RETRY',
    COMMERCE_VERIFICATION_UNVERIFIABLE: 'COMMERCE_VERIFICATION_UNVERIFIABLE',
    COMMERCE_JOB_LOCK_ACQUIRED: 'COMMERCE_JOB_LOCK_ACQUIRED',
    COMMERCE_JOB_LOCK_CONTENTION: 'COMMERCE_JOB_LOCK_CONTENTION',
    COMMERCE_JOB_LOCK_RELEASED: 'COMMERCE_JOB_LOCK_RELEASED',
} as const;

export type EventTypeType = typeof EventType[keyof typeof EventType];

// =============================================================================
// LIVE MARKET TABLES (Phase 1)
// =============================================================================

export const marketInstanceStatusEnum = pgEnum('market_instance_status', [
    'published',
    'closing',
    'expired',
    'published',
    'closing',
    'expired',
    'paused'
]);

export const contractTierEnum = pgEnum('contract_tier', [
    'controlled',
    'elevated',
    'maximum'
]);

// 1. Contract Templates - Logical definitions
export const contractTemplates = pgTable('contract_templates', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    category: varchar('category', { length: 50 }).notNull(), // finance, sales, social, etc.
    provider: platformEnum('provider').notNull(),
    rulesJson: jsonb('rules_json').notNull(), // Verification rules, event filters
    tierOptionsJson: jsonb('tier_options_json').notNull(), // Payouts for STANDARD/ADVANCED/ELITE
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    slugIdx: uniqueIndex('contract_templates_slug_idx').on(table.slug),
    categoryIdx: index('contract_templates_category_idx').on(table.category),
}));

// 2. Market Contract Instances - Specific "drops" with time windows
export const marketContractInstances = pgTable('market_contract_instances', {
    id: uuid('id').primaryKey().defaultRandom(),
    templateId: uuid('template_id').references(() => contractTemplates.id).notNull(),
    status: marketInstanceStatusEnum('status').default('published').notNull(),
    publishAt: timestamp('publish_at', { withTimezone: true }).defaultNow().notNull(),
    fundingCloseAt: timestamp('funding_close_at', { withTimezone: true }).notNull(),
    executionCloseAt: timestamp('execution_close_at', { withTimezone: true }), // Optional hard stop
    capacityTotal: integer('capacity_total'), // Nullable = unlimited
    capacityRemaining: integer('capacity_remaining'),
    minLockCents: integer('min_lock_cents'),
    maxLockCents: integer('max_lock_cents'),
    // Overrides for this specific drop
    termsVersion: integer('terms_version').default(1).notNull(),
    instanceTermsJson: jsonb('instance_terms_json'),
    // Smart Tier Fields
    tier: contractTierEnum('tier').default('controlled').notNull(),
    multiplier: varchar('multiplier', { length: 10 }).notNull().default('1.5'), // Using varchar to strict decimal parsing issues, or numeric
    // actually, let's use proper numeric type if possible, or simple float. Drizzle 'decimal' stringifies.
    // user said "multiplier numeric: 1.5 / 2.5 / 4.0". 
    // I'll use doublePrecision/real or decimal.
    // Let's us decimal(3,1)
    metricKey: varchar('metric_key', { length: 50 }).notNull().default('generic'),
    targetPolicyJson: jsonb('target_policy_json').notNull().default({}),
    displayTargetHint: varchar('display_target_hint', { length: 100 }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    templateIdx: index('market_instances_template_idx').on(table.templateId),
    statusIdx: index('market_instances_status_idx').on(table.status),
    publishTimeIdx: index('market_instances_publish_idx').on(table.publishAt),
    closingTimeIdx: index('market_instances_closing_idx').on(table.fundingCloseAt),
}));

// 3. Market Stats Cache - High performance sorting
export const marketStatsCache = pgTable('market_stats_cache', {
    instanceId: uuid('instance_id').references(() => marketContractInstances.id).primaryKey(),
    executions1h: integer('executions_1h').default(0).notNull(),
    executions24h: integer('executions_24h').default(0).notNull(),
    capitalLocked1hCents: integer('capital_locked_1h_cents').default(0).notNull(),
    capitalLocked24hCents: integer('capital_locked_24h_cents').default(0).notNull(),
    capitalLockedTotalCents: integer('capital_locked_total_cents').default(0).notNull(),
    lastExecutionAt: timestamp('last_execution_at', { withTimezone: true }),
    failRateRolling: integer('fail_rate_rolling').default(0), // 0-10000 basis points
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    trending1hIdx: index('market_stats_trending_1h_idx').on(table.executions1h),
    trending24hIdx: index('market_stats_trending_24h_idx').on(table.executions24h),
    volume24hIdx: index('market_stats_volume_24h_idx').on(table.capitalLocked24hCents),
}));

// Type Exports for New Tables
export type ContractTemplate = typeof contractTemplates.$inferSelect;
export type NewContractTemplate = typeof contractTemplates.$inferInsert;

export type MarketContractInstance = typeof marketContractInstances.$inferSelect;
export type NewMarketContractInstance = typeof marketContractInstances.$inferInsert;

export type MarketStatsCache = typeof marketStatsCache.$inferSelect;
export type NewMarketStatsCache = typeof marketStatsCache.$inferInsert;
