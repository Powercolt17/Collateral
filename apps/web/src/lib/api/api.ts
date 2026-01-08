/**
 * Centralized Frontend API Client
 * 
 * This is the ONLY gateway to the backend.
 * UI must NEVER use fetch directly.
 * UI must NEVER inspect raw responses.
 * 
 * FEATURES:
 * - Automatic auth header attachment
 * - JSON parsing
 * - Backend error envelope detection { ok: false, code, error }
 * - Typed error throwing with code preserved
 */

// =============================================================================
// API ERROR
// =============================================================================

export class ApiError extends Error {
    public readonly code: string;
    public readonly statusCode: number;

    constructor(
        code: string,
        message: string,
        statusCode: number
    ) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.statusCode = statusCode;
    }
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/** Base URL for API requests */
/** Base URL for API requests */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/** Get auth token from storage */
function getAuthToken(): string | null {
    // In browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('auth_token');
    }
    return null;
}

// =============================================================================
// CORE HTTP METHODS
// =============================================================================

/**
 * Make a GET request to the API.
 * 
 * @param path - API path (e.g., '/v1/contracts')
 * @returns Parsed JSON response
 * @throws ApiError if backend returns error envelope or HTTP error
 */
export async function get<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers: buildHeaders(),
    });

    return handleResponse<T>(response);
}

/**
 * Make a POST request to the API.
 * 
 * @param path - API path (e.g., '/v1/contracts')
 * @param body - Request body (will be JSON serialized)
 * @returns Parsed JSON response
 * @throws ApiError if backend returns error envelope or HTTP error
 */
export async function post<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function buildHeaders(): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
}

/**
 * Handle API response with error envelope detection.
 * 
 * Backend may return:
 * - Success: { ...data } or { ok: true, ...data }
 * - Error: { ok: false, code, error }
 */
async function handleResponse<T>(response: Response): Promise<T> {
    let data: unknown;

    try {
        data = await response.json();
    } catch {
        // Response is not JSON
        if (!response.ok) {
            throw new ApiError(
                'NETWORK_ERROR',
                `HTTP ${response.status}: ${response.statusText}`,
                response.status
            );
        }
        throw new ApiError('PARSE_ERROR', 'Invalid JSON response', response.status);
    }

    // Check for backend error envelope
    if (isErrorEnvelope(data)) {
        throw new ApiError(
            data.code || 'UNKNOWN_ERROR',
            data.error || 'Unknown error',
            response.status
        );
    }

    // Check for HTTP error status (in case backend doesn't use envelope)
    if (!response.ok) {
        throw new ApiError(
            'HTTP_ERROR',
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
        );
    }

    return data as T;
}

/**
 * Type guard for backend error envelope
 */
function isErrorEnvelope(data: unknown): data is { ok: false; code: string; error: string } {
    return (
        typeof data === 'object' &&
        data !== null &&
        'ok' in data &&
        (data as { ok: unknown }).ok === false
    );
}

// =============================================================================
// AUTH HELPERS
// =============================================================================

/**
 * Store auth token (after login/signup)
 */
export function setAuthToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth_token', token);
    }
}

/**
 * Clear auth token (logout)
 */
export function clearAuthToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('auth_token');
    }
}

/**
 * Check if user has auth token
 */
export function hasAuthToken(): boolean {
    return getAuthToken() !== null;
}
