// =============================================================================
// API CLIENT - Collateral Backend Integration
// =============================================================================

// Production API URL - Railway deployment
const API_BASE_URL = 'https://collateral-production.up.railway.app';

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

export async function devLogin(email) {
    console.log('[API] devLogin called with email:', email);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email }),
    });

    const data = await handleResponse(response);
    console.log('[API] devLogin response:', data);
    console.log('[API] accessToken in response:', !!data.accessToken);

    if (data.accessToken) {
        setAuthToken(data.accessToken);
        setStoredUser({ email, userId: data.user?.id });
        console.log('[API] Token stored! Verifying:', !!getAuthToken());
    } else {
        console.warn('[API] No accessToken in response!');
    }

    return data;
}

export async function logout() {
    clearAuthToken();
}

// --- X VERIFICATION ---

export async function startXVerification(xUsername) {
    console.log('[API] startXVerification called with username:', xUsername);

    const response = await fetch(`${API_BASE_URL}/v1/connect/x/start`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username: xUsername }),
    });

    return handleResponse(response);
}

export async function verifyX() {
    const headers = getHeaders();
    console.log('[API] verifyX called');
    console.log('[API] Auth token present:', !!getAuthToken());

    const response = await fetch(`${API_BASE_URL}/v1/connect/x/verify`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}),
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

// --- STRIPE CONNECT ---

export async function startStripeConnect() {
    console.log('[API] startStripeConnect called');

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
    const response = await fetch(`${API_BASE_URL}/v1/contracts/${contractId}/fund`, {
        method: 'POST',
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
    devLogin,
    logout,
    getAuthToken,
    hasAuthToken,
    clearAuthToken,
    getStoredUser,

    // X
    startXVerification,
    verifyX,
    getXStatus,

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

    // Ledger
    getLedgerEvents,
    getPublicLedger,

    // Health
    checkHealth,
};
