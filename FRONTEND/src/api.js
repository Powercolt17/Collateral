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
    // Handle 204 No Content without trying to parse
    const isNoContent = response.status === 204;
    const data = isNoContent ? {} : await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || data.error || `HTTP ${response.status}`);
        error.status = response.status;
        error.code = data.code;
        error.data = data;
        throw error;
    }

    return data;
}

// Bulletproof POST helper
// - undefined: sends {} (default, prevents empty body errors)
// - null: sends NO body (escape hatch for strict APIs)
// - object: sends JSON body
async function post(path, body) {
    const init = {
        method: 'POST',
        headers: getHeaders(),
    };

    if (body === undefined) {
        init.body = JSON.stringify({});
    } else if (body !== null) {
        init.body = JSON.stringify(body);
    }
    // body === null means no body at all

    const response = await fetch(`${API_BASE_URL}${path}`, init);
    return handleResponse(response);
}

// POST helper for unauthenticated endpoints (login, signup)
async function postPublic(path, body) {
    const init = {
        method: 'POST',
        headers: getHeaders(false),
    };

    if (body === undefined) {
        init.body = JSON.stringify({});
    } else if (body !== null) {
        init.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, init);
    return handleResponse(response);
}

// GET helper for consistency
async function get(path) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    return handleResponse(response);
}

// GET helper for unauthenticated endpoints
async function getPublic(path) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'GET',
        headers: getHeaders(false),
    });
    return handleResponse(response);
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

    const data = await postPublic('/v1/auth/login', { email, password });
    console.log('[API] login response:', data);

    if (data.accessToken) {
        setAuthToken(data.accessToken);
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

    const data = await postPublic('/v1/auth/signup', {
        email,
        password,
        username,
        displayName: displayName || username
    });
    console.log('[API] signup response:', data);

    if (data.accessToken) {
        setAuthToken(data.accessToken);
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
 * Blocked in production for security
 */
export async function devLogin(email, displayName = null) {
    // Block in production
    if (import.meta.env.PROD) {
        throw new Error('devLogin is disabled in production. Use login() instead.');
    }

    console.log('[API] devLogin (deprecated) called');

    const data = await postPublic('/auth/login', { email, displayName });
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
    return get('/v1/connect/x/oauth/start');
}

export async function getXStatus() {
    return get('/v1/connect/x/status');
}

export async function disconnectX() {
    return post('/v1/connect/x/disconnect');
}

// --- DEPRECATED: X VERIFICATION (bio challenge) ---
// These are kept for backward compatibility but should not be used

export async function startXVerification(xUsername) {
    console.warn('[API] startXVerification is DEPRECATED. Use startXOAuth instead.');
    return post('/v1/connect/x/start', { username: xUsername });
}

export async function verifyX() {
    console.warn('[API] verifyX is DEPRECATED. Use startXOAuth instead.');
    return post('/v1/connect/x/verify');
}

// --- STRIPE CONNECT ---

export async function startStripeConnect() {
    const token = getAuthToken();
    console.log('[API] startStripeConnect called');

    // If no token, throw immediately with clear error
    if (!token) {
        throw new Error('Login required to connect Stripe. Please log in first.');
    }

    return get('/v1/connect/stripe/start');
}

export async function completeStripeConnect(code, state) {
    console.log('[API] completeStripeConnect called');
    return post('/v1/connect/stripe/callback', { code, state });
}

export async function getStripeStatus() {
    return get('/v1/connect/stripe/status');
}

// --- CONTRACTS ---

export async function createContract(params) {
    return post('/v1/contracts', params);
}

export async function getContracts() {
    return get('/v1/contracts');
}

export async function getContract(contractId) {
    return get(`/v1/contracts/${contractId}`);
}

export async function getMarketFeed(params = {}) {
    const query = new URLSearchParams(params).toString();
    return getPublic(`/v1/market/contracts?${query}`);
}

export async function getMarketListings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return getPublic(`/v1/market/listings?${query}`);
}

// --- MARKET (Public Templates) ---

export async function getMarketContract(id) {
    return getPublic(`/v1/market/contracts/${id}`);
}

export async function getMarketQuote(id, stake) {
    return postPublic(`/v1/market/contracts/${id}/quote`, { stake });
}

// --- FUNDING ---

export async function createFundingIntent(contractId) {
    return post(`/v1/contracts/${contractId}/funding-intent`);
}

// --- BILLING (Card Verification) ---

export async function createCardSetupIntent() {
    return post('/v1/billing/card/setup_intent');
}

export async function getBillingStatus() {
    return get('/v1/billing/status');
}

export async function confirmCard(setupIntentId, paymentMethodId) {
    return post('/v1/billing/card/confirm', { setupIntentId, paymentMethodId });
}

export async function removeCard() {
    return post('/v1/billing/card/remove');
}

export async function addFunds(amountCents) {
    return post('/v1/billing/add-funds', { amountCents });
}

// --- EXECUTE ---

export async function executeContract(contractId) {
    console.log('[API] executeContract called for:', contractId);
    return post(`/v1/contracts/${contractId}/execute`);
}

// --- DEV-ONLY: Simulate Success ---
export async function devSimulateSuccess(contractId) {
    console.warn('[API][DEV] Simulating contract success:', contractId);
    return post(`/v1/contracts/${contractId}/dev/simulate-success`);
}


// --- CONNECTED ACCOUNTS ---

export async function getConnectedAccounts() {
    return get('/v1/me/connected-accounts');
}

export async function getConnectionStatus() {
    return get('/v1/connect/status');
}

export async function getProfile() {
    return get('/v1/me/profile');
}

// --- LEDGER ---

export async function getLedgerEvents(contractId) {
    return get(`/v1/contracts/${contractId}/events`);
}

export async function getPublicLedger() {
    return getPublic('/v1/ledger');
}

// --- PAYOUTS (Stripe Connect Express for Payouts) ---

// Start Stripe Connect Express onboarding for payouts
// Creates a Stripe Express account and returns onboarding URL
export async function startPayoutOnboard() {
    console.log('[API] startPayoutOnboard called');
    return post('/v1/payouts/onboard');
}

export async function createConnectAccount() {
    return post('/v1/payouts/connect/create');
}

export async function getConnectStatus() {
    return get('/v1/payouts/connect/status');
}

export async function runPayouts() {
    return post('/v1/payouts/run');
}

// --- LOCK & SETTLE ---

export async function lockContract(contractId, amountCents) {
    return post(`/v1/contracts/${contractId}/lock`, { amountCents });
}

export async function settleContract(contractId, outcome) {
    return post(`/v1/contracts/${contractId}/settle`, { outcome });
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
    getMarketFeed,
    getMarketFeed,
    getMarketListings,
    getMarketContract,
    getMarketQuote,

    // Funding
    createFundingIntent,

    // Billing (Card Verification)
    createCardSetupIntent,
    getBillingStatus,
    confirmCard,
    removeCard,
    addFunds,

    // Execute
    executeContract,

    // DEV-only
    devSimulateSuccess,

    // Connected Accounts
    getConnectedAccounts,
    getConnectionStatus,
    getProfile,

    // Ledger
    getLedgerEvents,
    getPublicLedger,

    // Payouts (Stripe Connect Express)
    startPayoutOnboard,
    createConnectAccount,
    getConnectStatus,
    runPayouts,

    // Lock & Settle
    lockContract,
    settleContract,

    // Health
    checkHealth,

    // Waitlist (pre-launch)
    joinWaitlist: (email, intendedUse) => post('/v1/waitlist/join', { email, intendedUse }),
    getWaitlistCount: () => get('/v1/waitlist/count'),
};
