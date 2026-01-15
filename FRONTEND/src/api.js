// =============================================================================
// API CLIENT - Collateral Backend Integration
// =============================================================================

// API Base URL - Default to Railway production, override with VITE_API_BASE_URL for local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://collateral-production.up.railway.app';

// Startup log - Makes environment mistakes instantly obvious
console.log(`[API] 🔗 Base URL: ${API_BASE_URL}`);

// Export for UI debugging (e.g. show in footer)
export function getApiEnvironment() {
    const isLocal = API_BASE_URL.includes('localhost');
    return {
        url: API_BASE_URL,
        env: isLocal ? 'LOCAL' : 'PRODUCTION',
        display: isLocal ? 'localhost:3000' : new URL(API_BASE_URL).hostname,
    };
}

// =============================================================================
// AUTH TOKEN MANAGEMENT
// =============================================================================

const TOKEN_KEY = 'collateral_auth_token';
const USER_KEY = 'collateral_user';

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function hasAuthToken() {
    return !!getAuthToken();
}

export function getStoredUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// =============================================================================
// HTTP HELPERS
// =============================================================================

function getHeaders(includeAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

async function handleResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || data.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.code = data.code;
        error.data = data;
        throw error;
    }

    return data;
}

// =============================================================================
// API METHODS
// =============================================================================

// --- AUTH ---

/**
 * Login with email + password
 * Calls /v1/auth/login - does NOT create user
 */
export async function login(email, password) {
    console.log('[API] login called with email:', email);

    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    console.log('[API] login response:', data);

    if (data.accessToken) {
        setAuthToken(data.accessToken);
        // Store user with identity info for persistence
        setStoredUser({
            email: data.user?.email || email,
            userId: data.user?.id,
            displayName: data.identity?.displayName || null,
            username: data.identity?.username || null,
        });
        console.log('[API] ✅ Login complete, identity:', data.identity?.displayName);
    }

    return data;
}

/**
 * Signup with email, password, username
 * Creates user + identity in one call
 */
export async function signup(email, password, username, displayName = null) {
    console.log('[API] signup called:', { email, username, displayName });

    const response = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({
            email,
            password,
            username,
            displayName: displayName || username
        }),
    });

    const data = await handleResponse(response);
    console.log('[API] signup response:', data);

    if (data.accessToken) {
        setAuthToken(data.accessToken);
        // Store user with identity info for persistence
        setStoredUser({
            email: data.user?.email || email,
            userId: data.user?.id,
            displayName: data.identity?.displayName,
            username: data.identity?.username,
        });
        console.log('[API] ✅ Signup complete, identity:', data.identity?.displayName);
    }

    return data;
}

/**
 * Dev login (DEPRECATED - dev mode only)
 */
export async function devLogin(email, displayName = null) {
    console.log('[API] devLogin (deprecated) called');

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, displayName }),
    });

    const data = await handleResponse(response);
    if (data.accessToken) {
        setAuthToken(data.accessToken);
        setStoredUser({
            email,
            userId: data.user?.id,
            displayName: data.identity?.displayName || displayName || null,
            username: data.identity?.username || null,
        });
    }
    return data;
}

export async function logout() {
    clearAuthToken();
}

// --- X OAUTH (NEW) ---

export async function startXOAuth() {
    console.log('[API] startXOAuth called');

    const response = await fetch(`${API_BASE_URL}/v1/connect/x/oauth/start`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function getXStatus() {
    const response = await fetch(`${API_BASE_URL}/v1/connect/x/status`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function disconnectX() {
    const response = await fetch(`${API_BASE_URL}/v1/connect/x/disconnect`, {
        method: 'POST',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

// --- DEPRECATED: X VERIFICATION (bio challenge) ---
// These are kept for backward compatibility but should not be used

export async function startXVerification(xUsername) {
    console.warn('[API] startXVerification is DEPRECATED. Use startXOAuth instead.');
    console.log('[API] startXVerification called with username:', xUsername);

    const response = await fetch(`${API_BASE_URL}/v1/connect/x/start`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username: xUsername }),
    });

    return handleResponse(response);
}

export async function verifyX() {
    console.warn('[API] verifyX is DEPRECATED. Use startXOAuth instead.');
    const headers = getHeaders();
    console.log('[API] verifyX called');

    const response = await fetch(`${API_BASE_URL}/v1/connect/x/verify`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
    });

    return handleResponse(response);
}

// --- STRIPE CONNECT ---

export async function startStripeConnect() {
    const token = getAuthToken();
    console.log('[API] startStripeConnect called');
    console.log('[API] 🔐 Token present:', !!token);
    console.log('[API] 🔗 API Base URL:', API_BASE_URL);

    // If no token, throw immediately with clear error
    if (!token) {
        throw new Error('Login required to connect Stripe. Please log in first.');
    }

    const response = await fetch(`${API_BASE_URL}/v1/connect/stripe/start`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function completeStripeConnect(code, state) {
    console.log('[API] completeStripeConnect called');

    const response = await fetch(`${API_BASE_URL}/v1/connect/stripe/callback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ code, state }),
    });

    return handleResponse(response);
}

export async function getStripeStatus() {
    const response = await fetch(`${API_BASE_URL}/v1/connect/stripe/status`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

// --- CONTRACTS ---

export async function createContract(params) {
    const response = await fetch(`${API_BASE_URL}/v1/contracts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params),
    });

    return handleResponse(response);
}

export async function getContracts() {
    const response = await fetch(`${API_BASE_URL}/v1/contracts`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function getContract(contractId) {
    const response = await fetch(`${API_BASE_URL}/v1/contracts/${contractId}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

// --- FUNDING ---

export async function createFundingIntent(contractId) {
    const response = await fetch(`${API_BASE_URL}/v1/contracts/${contractId}/funding-intent`, {
        method: 'POST',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

// --- EXECUTE ---

export async function executeContract(contractId) {
    console.log('[API] executeContract called for:', contractId);

    const response = await fetch(`${API_BASE_URL}/v1/contracts/${contractId}/execute`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({}),
    });

    return handleResponse(response);
}


// --- CONNECTED ACCOUNTS ---

export async function getConnectedAccounts() {
    const response = await fetch(`${API_BASE_URL}/v1/me/connected-accounts`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function getConnectionStatus() {
    const response = await fetch(`${API_BASE_URL}/v1/connect/status`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function getProfile() {
    const response = await fetch(`${API_BASE_URL}/v1/me/profile`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

// --- LEDGER ---

export async function getLedgerEvents(contractId) {
    const response = await fetch(`${API_BASE_URL}/v1/contracts/${contractId}/events`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
}

export async function getPublicLedger() {
    const response = await fetch(`${API_BASE_URL}/v1/ledger`, {
        method: 'GET',
        headers: getHeaders(false), // Public endpoint
    });

    return handleResponse(response);
}

// --- HEALTH ---

export async function checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
    });

    return handleResponse(response);
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    // Auth
    login,
    signup,
    devLogin,
    logout,
    getAuthToken,
    hasAuthToken,
    clearAuthToken,
    getStoredUser,
    setStoredUser,

    // X (OAuth - recommended)
    startXOAuth,
    getXStatus,
    disconnectX,
    // X (deprecated bio challenge)
    startXVerification,
    verifyX,

    // Stripe Connect
    startStripeConnect,
    completeStripeConnect,
    getStripeStatus,

    // Contracts
    createContract,
    getContracts,
    getContract,

    // Funding
    createFundingIntent,

    // Execute
    executeContract,

    // Connected Accounts
    getConnectedAccounts,
    getConnectionStatus,
    getProfile,

    // Ledger
    getLedgerEvents,
    getPublicLedger,

    // Health
    checkHealth,
};
