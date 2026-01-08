/**
 * Adapter Error Classification - I4 Fail-Closed on Uncertainty
 * 
 * Classifies adapter errors and schedules retries appropriately.
 * 
 * INVARIANT: On uncertainty, fail CLOSED (do not mark success) and schedule retry.
 * 
 * This ensures:
 * - Network issues don't cause false negatives
 * - Rate limits are handled with appropriate backoff
 * - Auth failures are non-retryable (require intervention)
 * - Unknown errors fail closed (assume retryable)
 */

import { db } from '../db/client.js';
import { contractIndex } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// =============================================================================
// ERROR CLASSIFICATION
// =============================================================================

export interface ErrorClassification {
    retryable: boolean;
    reason: string;
    backoffMs?: number;
    category: 'network' | 'rate_limit' | 'auth' | 'not_found' | 'malformed' | 'unknown';
}

/**
 * Classify an adapter error to determine retry behavior
 * 
 * FAIL CLOSED PRINCIPLE:
 * - If we can't confidently determine the error type, assume retryable
 * - Only non-retryable errors are:
 *   - Auth failures (401/403)
 *   - Not found (404)
 *   - Explicit non-retryable markers
 */
export function classifyAdapterError(err: unknown): ErrorClassification {
    if (!err) {
        return {
            retryable: true,
            reason: 'Unknown error (null)',
            category: 'unknown',
        };
    }

    const error = err as any;
    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toString() || '';
    const status = error.status || error.statusCode || error.response?.status;

    // Network errors (always retryable)
    if (
        code === 'ECONNREFUSED' ||
        code === 'ECONNRESET' ||
        code === 'ETIMEDOUT' ||
        code === 'ENOTFOUND' ||
        code === 'EAI_AGAIN' ||
        message.includes('network') ||
        message.includes('timeout') ||
        message.includes('socket hang up') ||
        message.includes('connection')
    ) {
        return {
            retryable: true,
            reason: 'Network error',
            backoffMs: 5000,
            category: 'network',
        };
    }

    // Rate limiting (retryable with backoff)
    if (
        status === 429 ||
        message.includes('rate limit') ||
        message.includes('too many requests') ||
        message.includes('throttl')
    ) {
        // Check for retry-after header if available
        const retryAfter = error.response?.headers?.['retry-after'];
        const backoffMs = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : 60000; // Default 1 minute

        return {
            retryable: true,
            reason: 'Rate limited',
            backoffMs,
            category: 'rate_limit',
        };
    }

    // Auth failures (non-retryable - requires intervention)
    if (
        status === 401 ||
        status === 403 ||
        message.includes('unauthorized') ||
        message.includes('forbidden') ||
        message.includes('invalid token') ||
        message.includes('access denied')
    ) {
        return {
            retryable: false,
            reason: 'Authentication/authorization failure',
            category: 'auth',
        };
    }

    // Not found (non-retryable - resource doesn't exist)
    if (
        status === 404 ||
        message.includes('not found') ||
        message.includes('does not exist')
    ) {
        return {
            retryable: false,
            reason: 'Resource not found',
            category: 'not_found',
        };
    }

    // Server errors (retryable)
    if (status >= 500 && status < 600) {
        return {
            retryable: true,
            reason: `Server error (${status})`,
            backoffMs: 10000,
            category: 'network',
        };
    }

    // Malformed response (retryable - fail closed)
    if (
        message.includes('invalid json') ||
        message.includes('parse error') ||
        message.includes('unexpected token') ||
        message.includes('malformed')
    ) {
        return {
            retryable: true,
            reason: 'Malformed response (fail closed)',
            backoffMs: 30000,
            category: 'malformed',
        };
    }

    // FAIL CLOSED: Unknown errors are retryable
    return {
        retryable: true,
        reason: `Unknown error (fail closed): ${message || 'no message'}`,
        backoffMs: 15000,
        category: 'unknown',
    };
}

// =============================================================================
// RETRY SCHEDULING
// =============================================================================

export interface RetryScheduleParams {
    contractId: string;
    jobType: 'VERIFY' | 'SETTLE';
    reason: string;
    attempt: number;
    baseBackoffMs?: number;
    maxBackoffMs?: number;
}

/**
 * Calculate exponential backoff with jitter
 */
function calculateBackoff(
    attempt: number,
    baseMs: number = 5000,
    maxMs: number = 300000 // 5 minutes
): number {
    // Exponential: base * 2^attempt
    const exponential = baseMs * Math.pow(2, attempt);
    // Cap at max
    const capped = Math.min(exponential, maxMs);
    // Add jitter (±20%)
    const jitter = capped * (0.8 + Math.random() * 0.4);
    return Math.round(jitter);
}

/**
 * Schedule a retry for a contract job
 * 
 * Updates contract_index.nextRetryDueUtc with the calculated retry time.
 * 
 * @returns The scheduled retry time
 */
export async function scheduleRetry(params: RetryScheduleParams): Promise<Date> {
    const {
        contractId,
        jobType,
        reason,
        attempt,
        baseBackoffMs = 5000,
        maxBackoffMs = 300000,
    } = params;

    const backoffMs = calculateBackoff(attempt, baseBackoffMs, maxBackoffMs);
    const nextRetryDue = new Date(Date.now() + backoffMs);

    // Update contract_index with next retry time
    await db
        .update(contractIndex)
        .set({
            nextRetryDueUtc: nextRetryDue,
        })
        .where(eq(contractIndex.contractId, contractId));

    console.log(
        `🔄 Retry scheduled: ${jobType} for ${contractId.slice(0, 8)}... ` +
        `in ${Math.round(backoffMs / 1000)}s (attempt ${attempt}). Reason: ${reason}`
    );

    return nextRetryDue;
}

/**
 * Clear retry schedule (call on successful completion)
 */
export async function clearRetrySchedule(contractId: string): Promise<void> {
    await db
        .update(contractIndex)
        .set({
            nextRetryDueUtc: null,
        })
        .where(eq(contractIndex.contractId, contractId));
}

// =============================================================================
// FAIL-CLOSED HELPER
// =============================================================================

export interface FailClosedResult<T> {
    success: boolean;
    result?: T;
    retryScheduled?: boolean;
    nextRetryAt?: Date;
    classification?: ErrorClassification;
}

/**
 * Execute an adapter call with fail-closed semantics
 * 
 * On error:
 * - Classifies the error
 * - If retryable: schedules retry and returns { success: false, retryScheduled: true }
 * - If non-retryable: rethrows
 * 
 * @param contractId Contract ID for retry scheduling
 * @param jobType Job type for logging
 * @param attempt Current attempt number
 * @param fn Adapter function to call
 */
export async function runWithFailClosed<T>(
    contractId: string,
    jobType: 'VERIFY' | 'SETTLE',
    attempt: number,
    fn: () => Promise<T>
): Promise<FailClosedResult<T>> {
    try {
        const result = await fn();
        await clearRetrySchedule(contractId);
        return { success: true, result };
    } catch (err) {
        const classification = classifyAdapterError(err);

        if (classification.retryable) {
            const nextRetryAt = await scheduleRetry({
                contractId,
                jobType,
                reason: classification.reason,
                attempt,
                baseBackoffMs: classification.backoffMs,
            });

            return {
                success: false,
                retryScheduled: true,
                nextRetryAt,
                classification,
            };
        }

        // Non-retryable - rethrow
        throw err;
    }
}
