/**
 * Commerce Error Taxonomy
 * 
 * Unified error codes for Amazon and Shopify commerce operations.
 * Used across ledger events, API responses, and logs.
 * 
 * INVARIANT: Every failure path MUST map to exactly one code.
 * INVARIANT: No secrets in error messages.
 */

// =============================================================================
// ERROR CODES
// =============================================================================

export enum CommerceErrorCode {
    // -------------------------------------------------------------------------
    // Provider Connect Errors
    // -------------------------------------------------------------------------
    /** Required OAuth scopes not granted */
    AUTH_SCOPE_MISSING = 'AUTH_SCOPE_MISSING',
    /** OAuth token revoked or expired permanently */
    AUTH_REVOKED = 'AUTH_REVOKED',
    /** Store/seller identity doesn't match connected account */
    STORE_IDENTITY_MISMATCH = 'STORE_IDENTITY_MISMATCH',
    /** Provider credentials missing or invalid format */
    CREDENTIALS_INVALID = 'CREDENTIALS_INVALID',

    // -------------------------------------------------------------------------
    // API Transient Errors (Retryable)
    // -------------------------------------------------------------------------
    /** Request timed out - retry with backoff */
    API_TIMEOUT_TRANSIENT = 'API_TIMEOUT_TRANSIENT',
    /** Rate limited by provider - retry with backoff */
    API_RATE_LIMIT = 'API_RATE_LIMIT',
    /** Provider returned 5xx - retry with backoff */
    API_SERVER_ERROR = 'API_SERVER_ERROR',

    // -------------------------------------------------------------------------
    // API Permanent Errors (Fail-Closed)
    // -------------------------------------------------------------------------
    /** Pagination cursor invalid or results incomplete */
    API_INCOMPLETE_PAGINATION = 'API_INCOMPLETE_PAGINATION',
    /** Provider returned ambiguous/invalid response */
    API_RESPONSE_INVALID = 'API_RESPONSE_INVALID',

    // -------------------------------------------------------------------------
    // Data Validation Errors (Fail-Closed)
    // -------------------------------------------------------------------------
    /** Currency not supported or mismatch between baseline/verify */
    CURRENCY_UNSUPPORTED = 'CURRENCY_UNSUPPORTED',
    /** Not enough order history for baseline window */
    WINDOW_HISTORY_INSUFFICIENT = 'WINDOW_HISTORY_INSUFFICIENT',
    /** Refund data unavailable (Amazon Finance API not integrated) */
    REFUNDS_UNAVAILABLE = 'REFUNDS_UNAVAILABLE',
    /** Cannot determine pass/fail deterministically */
    DATA_AMBIGUOUS_FAIL_CLOSED = 'DATA_AMBIGUOUS_FAIL_CLOSED',

    // -------------------------------------------------------------------------
    // Eligibility Errors
    // -------------------------------------------------------------------------
    /** Baseline revenue below minimum threshold */
    BASELINE_TOO_LOW = 'BASELINE_TOO_LOW',
    /** Baseline window shorter than required */
    BASELINE_WINDOW_TOO_SHORT = 'BASELINE_WINDOW_TOO_SHORT',
    /** Provider not connected or verified */
    PROVIDER_NOT_CONNECTED = 'PROVIDER_NOT_CONNECTED',

    // -------------------------------------------------------------------------
    // Contract State Errors
    // -------------------------------------------------------------------------
    /** Contract already in terminal state */
    CONTRACT_TERMINAL = 'CONTRACT_TERMINAL',
    /** Contract terms already attached */
    TERMS_ALREADY_ATTACHED = 'TERMS_ALREADY_ATTACHED',
    /** Verification already completed */
    VERIFICATION_ALREADY_COMPLETE = 'VERIFICATION_ALREADY_COMPLETE',

    // -------------------------------------------------------------------------
    // Concurrency Errors
    // -------------------------------------------------------------------------
    /** Another worker holds the lock */
    JOB_LOCK_CONTENTION = 'JOB_LOCK_CONTENTION',
    /** Idempotent duplicate detected */
    IDEMPOTENT_DUPLICATE = 'IDEMPOTENT_DUPLICATE',
}

// =============================================================================
// ERROR PROPERTIES
// =============================================================================

export interface CommerceErrorInfo {
    code: CommerceErrorCode;
    message: string;
    retryable: boolean;
    category: 'AUTH' | 'API' | 'DATA' | 'ELIGIBILITY' | 'STATE' | 'CONCURRENCY';
}

const ERROR_INFO: Record<CommerceErrorCode, Omit<CommerceErrorInfo, 'code'>> = {
    // Auth errors
    [CommerceErrorCode.AUTH_SCOPE_MISSING]: {
        message: 'Required OAuth scopes not granted. User must reconnect.',
        retryable: false,
        category: 'AUTH',
    },
    [CommerceErrorCode.AUTH_REVOKED]: {
        message: 'OAuth token revoked. User must reconnect.',
        retryable: false,
        category: 'AUTH',
    },
    [CommerceErrorCode.STORE_IDENTITY_MISMATCH]: {
        message: 'Store identity does not match connected account.',
        retryable: false,
        category: 'AUTH',
    },
    [CommerceErrorCode.CREDENTIALS_INVALID]: {
        message: 'Provider credentials missing or invalid.',
        retryable: false,
        category: 'AUTH',
    },

    // API transient
    [CommerceErrorCode.API_TIMEOUT_TRANSIENT]: {
        message: 'Provider API request timed out. Will retry.',
        retryable: true,
        category: 'API',
    },
    [CommerceErrorCode.API_RATE_LIMIT]: {
        message: 'Provider API rate limited. Will retry.',
        retryable: true,
        category: 'API',
    },
    [CommerceErrorCode.API_SERVER_ERROR]: {
        message: 'Provider API server error. Will retry.',
        retryable: true,
        category: 'API',
    },

    // API permanent
    [CommerceErrorCode.API_INCOMPLETE_PAGINATION]: {
        message: 'Failed to retrieve complete order data. Fail-closed.',
        retryable: false,
        category: 'API',
    },
    [CommerceErrorCode.API_RESPONSE_INVALID]: {
        message: 'Provider returned invalid response. Fail-closed.',
        retryable: false,
        category: 'API',
    },

    // Data validation
    [CommerceErrorCode.CURRENCY_UNSUPPORTED]: {
        message: 'Currency not supported or mismatched. Fail-closed.',
        retryable: false,
        category: 'DATA',
    },
    [CommerceErrorCode.WINDOW_HISTORY_INSUFFICIENT]: {
        message: 'Insufficient order history for baseline window.',
        retryable: false,
        category: 'DATA',
    },
    [CommerceErrorCode.REFUNDS_UNAVAILABLE]: {
        message: 'Refund data unavailable. Cannot compute net revenue. Fail-closed.',
        retryable: false,
        category: 'DATA',
    },
    [CommerceErrorCode.DATA_AMBIGUOUS_FAIL_CLOSED]: {
        message: 'Cannot determine verification outcome deterministically. Fail-closed.',
        retryable: false,
        category: 'DATA',
    },

    // Eligibility
    [CommerceErrorCode.BASELINE_TOO_LOW]: {
        message: 'Baseline revenue below minimum threshold.',
        retryable: false,
        category: 'ELIGIBILITY',
    },
    [CommerceErrorCode.BASELINE_WINDOW_TOO_SHORT]: {
        message: 'Baseline window shorter than required minimum.',
        retryable: false,
        category: 'ELIGIBILITY',
    },
    [CommerceErrorCode.PROVIDER_NOT_CONNECTED]: {
        message: 'Provider not connected or not verified.',
        retryable: false,
        category: 'ELIGIBILITY',
    },

    // State
    [CommerceErrorCode.CONTRACT_TERMINAL]: {
        message: 'Contract is already in terminal state.',
        retryable: false,
        category: 'STATE',
    },
    [CommerceErrorCode.TERMS_ALREADY_ATTACHED]: {
        message: 'Contract terms already attached.',
        retryable: false,
        category: 'STATE',
    },
    [CommerceErrorCode.VERIFICATION_ALREADY_COMPLETE]: {
        message: 'Verification already completed.',
        retryable: false,
        category: 'STATE',
    },

    // Concurrency
    [CommerceErrorCode.JOB_LOCK_CONTENTION]: {
        message: 'Another worker is processing this job.',
        retryable: true,
        category: 'CONCURRENCY',
    },
    [CommerceErrorCode.IDEMPOTENT_DUPLICATE]: {
        message: 'Duplicate request detected.',
        retryable: false,
        category: 'CONCURRENCY',
    },
};

// =============================================================================
// ERROR CLASS
// =============================================================================

export class CommerceError extends Error {
    public readonly code: CommerceErrorCode;
    public readonly retryable: boolean;
    public readonly category: 'AUTH' | 'API' | 'DATA' | 'ELIGIBILITY' | 'STATE' | 'CONCURRENCY';

    constructor(code: CommerceErrorCode, customMessage?: string) {
        const info = ERROR_INFO[code];
        super(customMessage || info.message);
        this.name = 'CommerceError';
        this.code = code;
        this.retryable = info.retryable;
        this.category = info.category;
    }

    /**
     * Get error info for ledger event metadata
     */
    toEventMetadata(): Record<string, unknown> {
        return {
            errorCode: this.code,
            errorMessage: this.message,
            errorRetryable: this.retryable,
            errorCategory: this.category,
        };
    }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get error info by code
 */
export function getErrorInfo(code: CommerceErrorCode): CommerceErrorInfo {
    const info = ERROR_INFO[code];
    return { code, ...info };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(code: CommerceErrorCode): boolean {
    return ERROR_INFO[code].retryable;
}

/**
 * Create CommerceError from adapter errors
 */
export function fromAdapterError(err: Error, provider: 'shopify' | 'amazon'): CommerceError {
    const message = err.message.toLowerCase();

    // Rate limit
    if (message.includes('rate limit') || message.includes('429')) {
        return new CommerceError(CommerceErrorCode.API_RATE_LIMIT);
    }

    // Auth errors
    if (message.includes('auth') || message.includes('401') || message.includes('403')) {
        return new CommerceError(CommerceErrorCode.AUTH_REVOKED);
    }

    // Token errors
    if (message.includes('token') && (message.includes('missing') || message.includes('expired'))) {
        return new CommerceError(CommerceErrorCode.CREDENTIALS_INVALID);
    }

    // Server errors
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
        return new CommerceError(CommerceErrorCode.API_SERVER_ERROR);
    }

    // Timeout
    if (message.includes('timeout') || message.includes('timed out')) {
        return new CommerceError(CommerceErrorCode.API_TIMEOUT_TRANSIENT);
    }

    // Default: fail-closed
    return new CommerceError(
        CommerceErrorCode.DATA_AMBIGUOUS_FAIL_CLOSED,
        `${provider} error: ${err.message}`
    );
}
