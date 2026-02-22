// Main entry point
import { Router } from './router.js';
import { renderHeader } from './components/Header.js';
import { renderOverview, initOverview } from './views/Overview.js';
import { renderLedger, initLedger } from './views/Ledger.js';
import { renderContracts, initContracts } from './views/Contracts.js';
import { renderContractDetail, initContractDetail } from './views/ContractDetail.js';
import { renderProfile, initProfile } from './views/Profile.js';
import { renderMyContracts, initMyContracts } from './views/MyContracts.js';
import { renderDocs, initDocs } from './views/Docs.js';
import { renderFunding, initFunding } from './views/Funding.js';
import { renderReceipts, initReceipts } from './views/Receipts.js';
import { renderActiveContracts, initActiveContracts } from './views/ActiveContracts.js';

import { renderTermSheet, initTermSheet } from './views/TermSheet.js';
import { renderContractTermSheet, initContractTermSheet } from './views/ContractTermSheet.js';
import { renderStripeCallback, initStripeCallback } from './views/StripeCallback.js';
import { renderXCallback, initXCallback } from './views/XCallback.js';
import { renderShopifyCallback, initShopifyCallback } from './views/ShopifyCallback.js';
import { renderAmazonCallback, initAmazonCallback } from './views/AmazonCallback.js';
import { renderPreLaunch, initPreLaunch } from './views/PreLaunch.js';
import './views/PreLaunch.css';
import './index.css';
// API Client for backend integration
import api from './api.js';

// Global error handlers for debugging
window.addEventListener('error', (e) => console.error('[GlobalError]', e.error || e.message));
window.addEventListener('unhandledrejection', (e) => console.error('[UnhandledPromise]', e.reason));

// App state - initialized from localStorage (NO email derivation ever)
const storedUser = api.getStoredUser();
const appState = {
    isLoggedIn: api.hasAuthToken(),
    sessionHydrated: false, // Prevents UI flicker until hydration completes
    // ONLY use stored identity values - NO email prefix fallbacks
    displayName: storedUser?.displayName || null,
    username: storedUser?.username || null, // stored WITHOUT @ prefix
    userId: storedUser?.userId || null,
    connectedSources: {
        twitter: false,
        github: false,
        stripe: false
    }
};

// Expose appState and api globally for views to access
window.appState = appState;
window.api = api;

/**
 * Hydrate session from backend - canonical source of truth
 * Called on app init to ensure identity matches database
 */
async function hydrateSession() {
    if (!api.hasAuthToken()) {
        console.log('[Session] No token, skipping hydration');
        appState.sessionHydrated = true;
        updateAuthUI();
        return;
    }

    try {
        console.log('[Session] Hydrating from /v1/me/profile...');
        const profile = await api.getProfile();

        // Token is valid if we got here
        appState.isLoggedIn = true;

        // Overwrite appState with canonical identity from DB
        appState.userId = profile.user?.id ?? null;
        appState.displayName = profile.identity?.displayName ?? null;
        appState.username = profile.identity?.username ?? null;

        // Hydrate connected sources from profile (canonical)
        // Show connected even if not yet verified (verified shown separately in UI)
        appState.connectedSources = {
            twitter: !!profile.xConnection?.connected,
            stripe: !!profile.stripeConnection?.connected,
            github: false, // TODO: add when GitHub OAuth is implemented
        };

        // Store verification status separately for UI display
        appState.verificationStatus = {
            twitter: profile.xConnection?.verified ?? false,
            stripe: profile.stripeConnection?.verified ?? false,
            github: false,
        };

        // Update localStorage with canonical values
        api.setStoredUser({
            email: profile.user?.email,
            userId: profile.user?.id,
            displayName: appState.displayName,
            username: appState.username,
        });

        console.log('[Session] ✅ Hydrated from DB:', {
            username: appState.username,
            displayName: appState.displayName,
            connectedSources: appState.connectedSources
        });
    } catch (error) {
        console.error('[Session] Hydration failed:', error);
        // On 401 error, clear auth state and redirect off protected routes
        if (error.status === 401) {
            api.clearAuthToken();
            appState.isLoggedIn = false;
            appState.displayName = null;
            appState.username = null;
            appState.userId = null;
            appState.connectedSources = { twitter: false, stripe: false, github: false };

            // Force redirect off protected route if on one
            const protectedPaths = ['/contracts', '/my-contracts', '/profile', '/funding'];
            const hashPath = (window.location.hash || '').replace(/^#/, '');
            if (protectedPaths.some(pr => hashPath === pr || hashPath.startsWith(pr + '/'))) {
                window.location.hash = '/overview';
                // Show login modal after redirect
                setTimeout(() => window.app.openAccessModal(), 100);
            }
        }
    } finally {
        appState.sessionHydrated = true;
        updateAuthUI();
    }
}

// Expose hydrateSession globally for use in disconnectSource
window.hydrateSession = hydrateSession;

// ================================================================================
// PRE-LAUNCH MODE
// ================================================================================
// Set VITE_PRE_LAUNCH_MODE=true in Vercel to enable pre-launch landing page
const PRE_LAUNCH_MODE = import.meta.env.VITE_PRE_LAUNCH_MODE === 'true';
console.log(`[App] Pre-launch mode: ${PRE_LAUNCH_MODE ? 'ENABLED' : 'disabled'}`);

// Routes configuration
const routes = PRE_LAUNCH_MODE ? [
    // Pre-launch: only show the waitlist page
    { path: '/', render: renderPreLaunch, init: initPreLaunch },
    { path: '/overview', render: renderPreLaunch, init: initPreLaunch },
    { path: '/ledger', render: renderPreLaunch, init: initPreLaunch },
    { path: '/contracts', render: renderPreLaunch, init: initPreLaunch },
    { path: '/contracts/:id', render: renderPreLaunch, init: initPreLaunch },
    { path: '/profile', render: renderPreLaunch, init: initPreLaunch },
    { path: '/settings', render: renderPreLaunch, init: initPreLaunch },
    { path: '/my-contracts', render: renderPreLaunch, init: initPreLaunch },
    { path: '/docs', render: renderPreLaunch, init: initPreLaunch },
    { path: '/funding', render: renderPreLaunch, init: initPreLaunch },
    { path: '/receipts', render: renderPreLaunch, init: initPreLaunch },
    { path: '/market/:id', render: renderPreLaunch, init: initPreLaunch },
    { path: '/contract/:id', render: renderPreLaunch, init: initPreLaunch },
] : [
    // Normal mode: full app
    { path: '/overview', render: renderOverview, init: initOverview },
    { path: '/ledger', render: renderLedger, init: initLedger },
    { path: '/contracts', render: renderActiveContracts, init: initActiveContracts },
    { path: '/contracts/execute', render: renderContracts, init: initContracts },
    { path: '/contracts/:id', render: renderContractDetail, init: initContractDetail },
    { path: '/market/:id', render: () => '<div></div>', init: (params) => { window.location.hash = '/contract/' + (params?.id || ''); } },
    { path: '/contract/:id', render: renderContractTermSheet, init: initContractTermSheet },
    { path: '/profile', render: renderProfile, init: initProfile },
    { path: '/settings', render: renderProfile, init: initProfile }, // Redirect settings to profile
    { path: '/my-contracts', render: renderMyContracts, init: initMyContracts },
    { path: '/docs', render: renderDocs, init: initDocs },
    { path: '/funding', render: renderFunding, init: initFunding },
    { path: '/receipts', render: renderReceipts, init: initReceipts },
    { path: '/stripe/callback', render: renderStripeCallback, init: initStripeCallback },
    { path: '/x/callback', render: renderXCallback, init: initXCallback },
    { path: '/shopify/callback', render: renderShopifyCallback, init: initShopifyCallback },
    { path: '/amazon/callback', render: renderAmazonCallback, init: initAmazonCallback }
];

// ================================================================================
// OAUTH CALLBACK PATH-TO-HASH REDIRECT
// ================================================================================
// OAuth flows redirect to path-based URLs (/x/callback, /stripe/callback)
// but our router is hash-based (#/path). Intercept and redirect before router init.
// Also handles Vercel rewrite case where callback lands at /?...
(function handleOAuthPathRedirect() {
    // Skip if already hash-routed (prevents loops)
    if (window.location.hash) return;

    const { pathname, search, origin } = window.location;

    // Handle Vercel rewrite case: callbacks land at root "/" with query params
    if (pathname === '/') {
        const params = new URLSearchParams(search);

        // X callback: has success= param (from our backend redirect)
        if (params.has('success') || params.has('username')) {
            console.log('[OAuth] Intercepting X callback at root, redirecting to hash route');
            window.location.replace(origin + '/#/x/callback' + search);
            return;
        }

        // Stripe callback: has code= AND state= params AND stored state MATCHES incoming
        const hasCode = params.has('code');
        const hasState = params.has('state');
        const incomingState = params.get('state');

        // Parse stored flow object (includes state + timestamp)
        let storedFlow = null;
        try {
            storedFlow = JSON.parse(localStorage.getItem('stripe_oauth_flow') || 'null');
        } catch (e) {
            // Fall back to legacy simple state storage
            const legacyState = localStorage.getItem('stripe_oauth_state');
            if (legacyState) storedFlow = { state: legacyState, startedAt: 0 };
        }

        if (hasCode && hasState && storedFlow && incomingState) {
            const isStateMatch = storedFlow.state === incomingState;
            const isRecent = !storedFlow.startedAt || (Date.now() - storedFlow.startedAt) < 10 * 60 * 1000; // 10 min

            if (isStateMatch && isRecent) {
                console.log('[OAuth] Intercepting Stripe callback at root, redirecting to hash route');
                window.location.replace(origin + '/#/stripe/callback' + search);
                return;
            }

            // State mismatch or expired: route to error page (not silent fallthrough)
            if (!isStateMatch) {
                console.warn('[OAuth] Stripe state mismatch.', { stored: storedFlow.state, incoming: incomingState });
                window.location.replace(origin + '/#/stripe/callback?error=state_mismatch');
                return;
            }

            if (!isRecent) {
                console.warn('[OAuth] Stripe OAuth flow expired.');
                window.location.replace(origin + '/#/stripe/callback?error=session_expired');
                return;
            }
        }
    }

    // Map of path-based OAuth callbacks to hash routes
    const map = {
        '/x/callback': '/#/x/callback',
        '/stripe/callback': '/#/stripe/callback',
        '/shopify/callback': '/#/shopify/callback',
        '/amazon/callback': '/#/amazon/callback',
    };

    const dest = map[pathname];
    if (dest) {
        console.log('[OAuth] Intercepting', pathname, ', redirecting to hash route');
        window.location.replace(origin + dest + search);
    }
})();

// Initialize router
const router = new Router(routes);
window.router = router;

// App methods exposed globally
window.app = {
    openAccessModal: function () {
        const backdrop = document.getElementById('modal-access-backdrop');
        const modal = document.getElementById('modal-access');
        backdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);
    },
    closeAccessModal: function () {
        const backdrop = document.getElementById('modal-access-backdrop');
        const modal = document.getElementById('modal-access');
        backdrop.classList.add('opacity-0');
        modal.classList.add('scale-95', 'opacity-0');
        modal.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            modal.classList.add('hidden');
        }, 300);
    },
    handleSignOut: function () {
        api.logout();
        appState.isLoggedIn = false;
        appState.username = null;
        appState.displayName = null;
        appState.userId = null;
        appState.connectedSources = { twitter: false, stripe: false, github: false };
        updateAuthUI();
        window.router.navigate('/overview');
    },
    handleAuthClick: function () {
        if (appState.isLoggedIn) {
            window.router.navigate('/profile');
        } else {
            window.app.openAccessModal();
        }
    },
    handleInitiate: function () {
        if (!appState.isLoggedIn) {
            window.app.openAccessModal();
        } else {
            window.router.navigate('/contracts');
        }
    },
    handleLoginSubmit: async function () {
        const btn = document.getElementById('btn-login-submit');
        const emailInput = document.getElementById('login-email');
        const passwordInput = document.getElementById('login-password');
        const email = emailInput?.value?.trim();
        const password = passwordInput?.value;

        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }

        const originalText = btn.innerText;
        btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>`;
        btn.disabled = true;

        try {
            console.log('[App] Logging in with email:', email);
            const result = await api.login(email, password);

            if (!result.ok) {
                throw new Error(result.error || 'Login failed');
            }

            // Set appState from identity (CANONICAL source, NO email fallbacks)
            appState.isLoggedIn = true;
            appState.displayName = result.identity?.displayName || null;
            appState.username = result.identity?.username || null; // stored WITHOUT @ prefix
            appState.userId = result.user?.id;

            console.log('[App] ✅ Logged in as:', appState.displayName, '@' + appState.username);

            window.app.closeAccessModal();
            updateAuthUI();
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: ' + (error.message || 'Unknown error'));
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },
    goToCreateIdentity: function () {
        window.app.closeAccessModal();
        setTimeout(() => {
            window.app.openCreateModal();
        }, 350);
    },
    openCreateModal: function () {
        const backdrop = document.getElementById('modal-create-backdrop');
        const modal = document.getElementById('modal-create');
        backdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);
    },
    closeCreateModal: function () {
        const backdrop = document.getElementById('modal-create-backdrop');
        const modal = document.getElementById('modal-create');
        backdrop.classList.add('opacity-0');
        modal.classList.add('scale-95', 'opacity-0');
        modal.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            modal.classList.add('hidden');
        }, 300);
    },
    handleCreateAccount: async function () {
        const btn = document.getElementById('btn-create-submit');
        const emailInput = document.getElementById('create-email');
        const passwordInput = document.getElementById('create-password');
        const usernameInput = document.getElementById('create-username'); // Username/handle input

        const email = emailInput?.value?.trim();
        const password = passwordInput?.value;
        const username = usernameInput?.value?.trim();

        // Validation
        if (!email) {
            alert('Please enter your email');
            return;
        }
        if (!password || password.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }
        if (!username) {
            alert('Please enter a username');
            return;
        }
        // Validate username format: 3-20 chars, alphanumeric + underscores
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            alert('Username must be 3-20 characters, letters/numbers/underscores only');
            return;
        }

        const originalText = btn.innerText;
        btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>`;
        btn.disabled = true;

        try {
            // username = handle (e.g. powercolt)
            // displayName = pretty name (defaults to username if not separate input)
            const displayName = username; // Same for now, can add separate input later

            console.log('[App] Creating account:', { email, username, displayName });

            // Call signup with username as handle, displayName as pretty name
            const result = await api.signup(email, password, username, displayName);
            console.log('[App] Signup result:', result);

            if (!result.ok) {
                throw new Error(result.error || 'Signup failed');
            }

            // Set appState from identity (CANONICAL source, NO @ prefix stored)
            appState.isLoggedIn = true;
            appState.displayName = result.identity.displayName;
            appState.username = result.identity.username; // stored WITHOUT @ prefix
            appState.userId = result.user.id;

            console.log('[App] ✅ Signed up as:', appState.displayName, '@' + appState.username);

            window.app.closeCreateModal();
            updateAuthUI();
        } catch (error) {
            console.error('Account creation failed:', error);
            alert('Account creation failed: ' + (error.message || 'Unknown error'));
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },
    toggleMenuPersistence: function (e) {
        e.stopPropagation();
        const dropdown = document.getElementById('user-dropdown-content');
        if (dropdown) dropdown.classList.toggle('!block');
    },
    connectSource: async function (source) {
        const btn = document.getElementById(source + '-btn');
        if (!btn) return;

        btn.innerHTML = `<div class="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>`;
        btn.disabled = true;

        try {
            // Call real OAuth start endpoints
            if (source === 'twitter') {
                const result = await window.api.startXOAuth();
                if (result.oauthUrl) {
                    // Open X OAuth in popup window (like Stripe) to preserve page context
                    const popup = window.open(result.oauthUrl, 'XConnect', 'width=600,height=700');

                    // Poll for connection status while popup is open
                    const pollInterval = setInterval(async () => {
                        try {
                            // Check if popup was closed
                            if (popup && popup.closed) {
                                clearInterval(pollInterval);
                                // Final check for connection
                                const status = await window.api.getXStatus();
                                if (status.connected) {
                                    console.log('[X] Connected via popup!');
                                    if (window.hydrateSession) await window.hydrateSession();
                                    btn.innerHTML = '✓ Connected';
                                    btn.disabled = true;
                                    // Refresh the current view
                                    const current = (window.location.hash || '#/contracts').replace(/^#/, '');
                                    window.router.navigate(current);
                                } else {
                                    btn.innerHTML = 'Connect';
                                    btn.disabled = false;
                                }
                                return;
                            }

                            // Periodic poll while popup is open
                            const status = await window.api.getXStatus();
                            if (status.connected) {
                                console.log('[X] Detected connection during poll');
                                clearInterval(pollInterval);
                                if (popup && !popup.closed) popup.close();
                                if (window.hydrateSession) await window.hydrateSession();
                                btn.innerHTML = '✓ Connected';
                                btn.disabled = true;
                                const current = (window.location.hash || '#/contracts').replace(/^#/, '');
                                window.router.navigate(current);
                            }
                        } catch (pollErr) {
                            console.warn('[X] Poll error:', pollErr);
                        }
                    }, 2000); // Poll every 2 seconds

                    // Timeout after 10 minutes
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        if (btn.innerHTML.includes('spin')) {
                            btn.innerHTML = 'Connect';
                            btn.disabled = false;
                        }
                    }, 10 * 60 * 1000);

                    return;
                }
            } else if (source === 'stripe') {
                const result = await window.api.startStripeConnect();
                if (result.oauthUrl) {
                    // Store flow object with state + timestamp for CSRF protection and expiry
                    localStorage.setItem('stripe_oauth_flow', JSON.stringify({
                        state: result.state,
                        startedAt: Date.now(),
                    }));
                    localStorage.setItem('stripe_oauth_state', result.state);

                    // Open Stripe OAuth in popup window
                    const popup = window.open(result.oauthUrl, 'StripeConnect', 'width=600,height=700');

                    // Poll for connection status while popup is open
                    const pollInterval = setInterval(async () => {
                        try {
                            // Check if popup was closed
                            if (popup && popup.closed) {
                                clearInterval(pollInterval);
                                // Final check for connection
                                const status = await window.api.getStripeStatus();
                                if (status.connected) {
                                    console.log('[Stripe] Connected via popup!');
                                    if (window.hydrateSession) await window.hydrateSession();
                                    btn.innerHTML = '✓ Connected';
                                    btn.disabled = true;
                                    // Refresh the current view
                                    const current = (window.location.hash || '#/contracts').replace(/^#/, '');
                                    window.router.navigate(current);
                                } else {
                                    btn.innerHTML = 'Connect';
                                    btn.disabled = false;
                                }
                                // Clean up OAuth state
                                localStorage.removeItem('stripe_oauth_flow');
                                localStorage.removeItem('stripe_oauth_state');
                                return;
                            }

                            // Periodic poll while popup is open
                            const status = await window.api.getStripeStatus();
                            if (status.connected) {
                                console.log('[Stripe] Detected connection during poll');
                                clearInterval(pollInterval);
                                if (popup && !popup.closed) popup.close();
                                if (window.hydrateSession) await window.hydrateSession();
                                btn.innerHTML = '✓ Connected';
                                btn.disabled = true;
                                localStorage.removeItem('stripe_oauth_flow');
                                localStorage.removeItem('stripe_oauth_state');
                                const current = (window.location.hash || '#/contracts').replace(/^#/, '');
                                window.router.navigate(current);
                            }
                        } catch (pollErr) {
                            console.warn('[Stripe] Poll error:', pollErr);
                        }
                    }, 2000); // Poll every 2 seconds

                    // Timeout after 10 minutes
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        if (btn.innerHTML.includes('spin')) {
                            btn.innerHTML = 'Connect';
                            btn.disabled = false;
                        }
                    }, 10 * 60 * 1000);

                    return;
                }
            } else if (source === 'shopify') {
                // Prompt user for their shop domain
                const shop = prompt('Enter your Shopify store domain (e.g. mystore.myshopify.com):');
                if (!shop) {
                    btn.innerHTML = 'Connect';
                    btn.disabled = false;
                    return;
                }
                const result = await window.api.startShopifyConnect(shop);
                if (result.oauthUrl) {
                    localStorage.setItem('shopify_oauth_flow', JSON.stringify({ state: result.state, startedAt: Date.now() }));
                    const popup = window.open(result.oauthUrl, 'ShopifyConnect', 'width=600,height=700');
                    const pollInterval = setInterval(async () => {
                        try {
                            if (popup && popup.closed) {
                                clearInterval(pollInterval);
                                const status = await window.api.getShopifyStatus();
                                if (status.connected) {
                                    if (window.hydrateSession) await window.hydrateSession();
                                    btn.innerHTML = '✓ Connected';
                                    btn.disabled = true;
                                    const current = (window.location.hash || '#/profile').replace(/^#/, '');
                                    window.router.navigate(current);
                                } else {
                                    btn.innerHTML = 'Connect';
                                    btn.disabled = false;
                                }
                                localStorage.removeItem('shopify_oauth_flow');
                                return;
                            }
                            const status = await window.api.getShopifyStatus();
                            if (status.connected) {
                                clearInterval(pollInterval);
                                if (popup && !popup.closed) popup.close();
                                if (window.hydrateSession) await window.hydrateSession();
                                btn.innerHTML = '✓ Connected';
                                btn.disabled = true;
                                localStorage.removeItem('shopify_oauth_flow');
                                const current = (window.location.hash || '#/profile').replace(/^#/, '');
                                window.router.navigate(current);
                            }
                        } catch (pollErr) {
                            console.warn('[Shopify] Poll error:', pollErr);
                        }
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        if (btn.innerHTML.includes('spin')) {
                            btn.innerHTML = 'Connect';
                            btn.disabled = false;
                        }
                    }, 10 * 60 * 1000);
                    return;
                }
            } else if (source === 'amazon') {
                const result = await window.api.startAmazonConnect();
                if (result.oauthUrl) {
                    localStorage.setItem('amazon_oauth_flow', JSON.stringify({ state: result.state, startedAt: Date.now() }));
                    const popup = window.open(result.oauthUrl, 'AmazonConnect', 'width=600,height=700');
                    const pollInterval = setInterval(async () => {
                        try {
                            if (popup && popup.closed) {
                                clearInterval(pollInterval);
                                const status = await window.api.getAmazonStatus();
                                if (status.connected) {
                                    if (window.hydrateSession) await window.hydrateSession();
                                    btn.innerHTML = '✓ Connected';
                                    btn.disabled = true;
                                    const current = (window.location.hash || '#/profile').replace(/^#/, '');
                                    window.router.navigate(current);
                                } else {
                                    btn.innerHTML = 'Connect';
                                    btn.disabled = false;
                                }
                                localStorage.removeItem('amazon_oauth_flow');
                                return;
                            }
                            const status = await window.api.getAmazonStatus();
                            if (status.connected) {
                                clearInterval(pollInterval);
                                if (popup && !popup.closed) popup.close();
                                if (window.hydrateSession) await window.hydrateSession();
                                btn.innerHTML = '✓ Connected';
                                btn.disabled = true;
                                localStorage.removeItem('amazon_oauth_flow');
                                const current = (window.location.hash || '#/profile').replace(/^#/, '');
                                window.router.navigate(current);
                            }
                        } catch (pollErr) {
                            console.warn('[Amazon] Poll error:', pollErr);
                        }
                    }, 2000);
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        if (btn.innerHTML.includes('spin')) {
                            btn.innerHTML = 'Connect';
                            btn.disabled = false;
                        }
                    }, 10 * 60 * 1000);
                    return;
                }
            } else if (source === 'github') {
                alert('GitHub integration coming soon.');
                btn.innerHTML = 'Connect';
                btn.disabled = false;
                return;
            }
        } catch (err) {
            console.error(`[App] connectSource ${source} error:`, err);
            alert('Failed to connect: ' + (err.message || 'Unknown error'));
            btn.innerHTML = 'Connect';
            btn.disabled = false;
        }
    },
    // Card Modal Functions (SetupIntent pattern)
    openCardModal: function () {
        const backdrop = document.getElementById('modal-card-backdrop');
        const modal = document.getElementById('modal-card');
        backdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);
        // Init lucide icons in modal
        if (window.lucide) window.lucide.createIcons();
    },
    closeCardModal: function () {
        const backdrop = document.getElementById('modal-card-backdrop');
        const modal = document.getElementById('modal-card');
        backdrop.classList.add('opacity-0');
        modal.classList.add('scale-95', 'opacity-0');
        modal.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            modal.classList.add('hidden');
            // Clear form
            document.getElementById('card-number').value = '';
            document.getElementById('card-expiry').value = '';
            document.getElementById('card-cvc').value = '';
        }, 300);
    },
    addCard: function () {
        // Open the inline card entry modal (SetupIntent pattern)
        window.app.openCardModal();
    },
    confirmCardSetup: function () {
        const btn = document.getElementById('btn-card-submit');
        const cardNumber = document.getElementById('card-number').value;
        const expiry = document.getElementById('card-expiry').value;
        const cvc = document.getElementById('card-cvc').value;

        // Basic validation
        if (!cardNumber || !expiry || !cvc) {
            return;
        }

        const originalText = btn.innerHTML;
        btn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>`;
        btn.disabled = true;

        // Simulate SetupIntent confirmation
        // In production: POST /v1/funding/setup-intent → get clientSecret → stripe.confirmSetup()
        setTimeout(() => {
            // Get last 4 digits
            const last4 = cardNumber.replace(/\s/g, '').slice(-4);

            // Update the funding page if we're on it
            const status = document.getElementById('card-status');
            const addBtn = document.getElementById('add-card-btn');

            if (status) {
                status.textContent = `•••• •••• •••• ${last4} • Active`;
                status.classList.remove('text-neutral-400');
                status.classList.add('text-neutral-500');
            }

            if (addBtn) {
                addBtn.innerHTML = 'Remove';
                addBtn.onclick = () => window.app.removeCard();
            }

            // Store in state
            appState.hasCard = true;
            appState.cardLast4 = last4;

            // Close modal
            window.app.closeCardModal();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1500);
    },
    removeCard: function () {
        const btn = document.getElementById('add-card-btn');
        const status = document.getElementById('card-status');

        status.textContent = 'No card on file';
        status.classList.remove('text-neutral-500');
        status.classList.add('text-neutral-400');

        btn.innerHTML = 'Add Card';
        btn.onclick = () => window.app.addCard();

        appState.hasCard = false;
        appState.cardLast4 = null;

        btn.innerHTML = 'Add Card';
        btn.onclick = () => window.app.addCard();
    },
    // Mobile Menu Functions
    toggleMobileMenu: function () {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (!menu || !overlay) return;

        const isOpen = menu.classList.contains('open');

        if (isOpen) {
            window.app.closeMobileMenu();
        } else {
            // Open menu
            menu.classList.add('open');
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    },
    closeMobileMenu: function () {
        const menu = document.getElementById('mobile-menu');
        const overlay = document.getElementById('mobile-menu-overlay');

        if (!menu || !overlay) return;

        menu.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    },
    updateMobileAuthUI: function () {
        const mobileAuthBtn = document.getElementById('btn-auth-mobile');
        const mobileUserSection = document.getElementById('mobile-user-section');
        const mobileInitial = document.getElementById('mobile-menu-initial');
        const mobileUsername = document.getElementById('mobile-menu-username');

        if (appState.isLoggedIn) {
            if (mobileAuthBtn) mobileAuthBtn.classList.add('hidden');
            if (mobileUserSection) {
                mobileUserSection.classList.remove('hidden');
                if (mobileInitial && appState.displayName) {
                    mobileInitial.textContent = appState.displayName.charAt(0).toUpperCase();
                }
                if (mobileUsername && appState.username) {
                    mobileUsername.textContent = '@' + appState.username;
                }
            }
        } else {
            if (mobileAuthBtn) mobileAuthBtn.classList.remove('hidden');
            if (mobileUserSection) mobileUserSection.classList.add('hidden');
        }
    },
    setupPayout: async function () {
        console.log('Initiating Stripe Connect Express for payout...');
        const btn = document.getElementById('manage-bank-btn') || document.getElementById('setup-payout-btn') || document.getElementById('manage-payout-btn');
        let originalText = '';

        if (btn) {
            originalText = btn.innerHTML;
            btn.innerHTML = `<div class="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>`;
            btn.disabled = true;
        }

        try {
            // Call the payout onboarding endpoint (creates Stripe Express account)
            const response = await window.api.startPayoutOnboard();
            if (response.onboardingUrl) {
                // Redirect to Stripe's Express onboarding flow
                window.location.href = response.onboardingUrl;
            } else if (response.alreadyConnected) {
                alert('Your payout account is already connected!');
                window.location.reload();
            } else {
                throw new Error('No onboarding URL returned');
            }
        } catch (err) {
            console.error('Failed to start payout onboarding:', err);
            alert('Error setting up payout: ' + err.message);
            if (btn) {
                btn.innerHTML = originalText || 'Manage';
                btn.disabled = false;
            }
        }
    },
    // Settings Modal Functions
    openSettingsModal: function () {
        const backdrop = document.getElementById('modal-settings-backdrop');
        const modal = document.getElementById('modal-settings');
        backdrop.classList.remove('hidden');
        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);

        // Update settings username from state
        const usernameEl = document.getElementById('settings-username');
        if (usernameEl && appState.username) {
            usernameEl.textContent = appState.username;
        }

        // Populate connected sources
        window.app.populateSettingsSources();

        // Init lucide icons and tabs
        if (window.lucide) window.lucide.createIcons();
        window.app.initSettingsTabs();
    },
    closeSettingsModal: function () {
        const backdrop = document.getElementById('modal-settings-backdrop');
        const modal = document.getElementById('modal-settings');
        backdrop.classList.add('opacity-0');
        modal.classList.add('scale-95', 'opacity-0');
        modal.classList.remove('scale-100', 'opacity-100');
        setTimeout(() => {
            backdrop.classList.add('hidden');
            modal.classList.add('hidden');
            // Reset to first tab
            window.app.switchSettingsTab('account');
        }, 300);
    },
    initSettingsTabs: function () {
        const tabs = document.querySelectorAll('.settings-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                const tabName = tab.getAttribute('data-settings-tab');
                window.app.switchSettingsTab(tabName);
            };
        });
    },
    switchSettingsTab: function (tabName) {
        const tabs = document.querySelectorAll('.settings-tab');
        const panels = document.querySelectorAll('.settings-panel');

        // Update tab styles - Aura pattern
        tabs.forEach(t => {
            t.classList.remove('bg-neutral-100', 'bg-red-50', 'text-neutral-900');
            t.classList.add('text-neutral-500');
            if (t.getAttribute('data-settings-tab') === 'danger') {
                t.classList.add('text-[#B91C1C]');
                t.classList.remove('text-neutral-500');
            }
        });

        const activeTab = document.querySelector(`[data-settings-tab="${tabName}"]`);
        if (activeTab) {
            if (tabName === 'danger') {
                activeTab.classList.add('bg-red-50');
            } else {
                activeTab.classList.add('bg-neutral-100', 'text-neutral-900');
                activeTab.classList.remove('text-neutral-500');
            }
        }

        // Show/hide panels
        panels.forEach(p => p.classList.add('hidden'));
        const activePanel = document.getElementById('settings-panel-' + tabName);
        if (activePanel) activePanel.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();
    },
    populateSettingsSources: function () {
        const container = document.getElementById('settings-sources-list');
        if (!container) return;

        const sources = [
            { id: 'stripe', name: 'Stripe', icon: 'credit-card', connected: appState.connectedSources?.stripe },
            { id: 'github', name: 'GitHub', icon: 'github', connected: appState.connectedSources?.github },
            { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', connected: appState.connectedSources?.twitter }
        ];

        container.innerHTML = sources.map(s => `
            <div class="border border-neutral-200 p-4 rounded-[2px] flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                        <i data-lucide="${s.icon}" class="w-5 h-5 text-neutral-500"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-neutral-900">${s.name}</p>
                        <p class="font-mono text-[10px] ${s.connected ? 'text-[#1F7A4D]' : 'text-neutral-400'} flex items-center gap-1">
                            ${s.connected ? '<span class="w-1.5 h-1.5 bg-[#1F7A4D] rounded-full"></span> CONNECTED' : '• DISCONNECTED'}
                        </p>
                    </div>
                </div>
                <button data-source-btn="${s.id}" onclick="window.app.${s.connected ? 'disconnect' : 'connect'}Source('${s.id}')" class="px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    ${s.connected ? 'Disconnect' : 'Connect'}
                </button>
            </div>
        `).join('');

        if (window.lucide) window.lucide.createIcons();
    },
    disconnectSource: async function (source) {
        const btn = document.querySelector(`button[data-source-btn="${source}"]`);
        const originalLabel = btn?.innerHTML;

        // Show loading state
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '...';
        }

        try {
            if (source === 'twitter') {
                await window.api.disconnectX();

                // 1) Re-hydrate canonical state from backend (identity + connections)
                if (window.hydrateSession) await window.hydrateSession();

                // 2) Refresh settings UI
                window.app.populateSettingsSources();

                // 3) Force router to re-render current page (prevents blank view)
                const current = (window.location.hash || '#/overview').replace(/^#/, '');
                window.router.navigate(current);

                return;
            }

            alert('Not implemented yet.');
        } catch (err) {
            console.error('[App] disconnectSource error:', err);
            alert('Failed to disconnect: ' + (err.message || 'Unknown error'));
            // Only restore button on failure (no re-render happened)
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalLabel || 'Disconnect';
            }
        }
    }
};

function updateAuthUI() {
    // Don't render until session hydration completes (prevents flicker)
    if (!appState.sessionHydrated) return;

    const btnAuth = document.getElementById('btn-auth');
    const userMenu = document.getElementById('user-menu');
    const userMenuBtn = document.getElementById('user-menu-btn');
    const menuUsername = document.getElementById('menu-username');
    const menuInitial = document.getElementById('menu-initial');

    if (appState.isLoggedIn && btnAuth && userMenu) {
        // Hide Sign In button - remove desktop-auth class to prevent CSS !important override
        btnAuth.classList.add('hidden');
        btnAuth.classList.remove('desktop-auth');

        // Show user menu
        userMenu.classList.remove('hidden');
        if (userMenuBtn) userMenuBtn.classList.add('desktop-auth');

        // Show @username ONLY - NO fallback to displayName or email
        if (menuUsername) {
            menuUsername.innerText = appState.username ? '@' + appState.username : '@—';
        }
        if (menuInitial && appState.displayName) {
            menuInitial.textContent = appState.displayName.charAt(0).toUpperCase();
        }
        console.log('[Auth] UI updated, showing:', appState.username);
    } else if (btnAuth && userMenu) {
        // Show Sign In button
        btnAuth.classList.remove('hidden');
        btnAuth.classList.add('desktop-auth');

        // Hide user menu
        userMenu.classList.add('hidden');
        if (userMenuBtn) userMenuBtn.classList.remove('desktop-auth');
    }

    // Also update mobile auth UI
    if (window.app && window.app.updateMobileAuthUI) {
        window.app.updateMobileAuthUI();
    }
}

// Protected routes that require login
const protectedRoutes = ['/contracts', '/contracts/execute', '/my-contracts', '/profile', '/funding'];

// Route change handler
router.onRouteChange = function (route, path) {
    // Pre-launch mode: hide header, footer, and status bar
    if (PRE_LAUNCH_MODE) {
        const headerMount = document.getElementById('header-mount');
        const statusBar = document.querySelector('.fixed.bottom-0');
        const appMount = document.getElementById('app');

        if (headerMount) headerMount.innerHTML = '';
        if (statusBar) statusBar.style.display = 'none';
        if (appMount) {
            appMount.classList.remove('pt-16');
            appMount.innerHTML = route.render(route.params);
        }

        if (route.init) {
            setTimeout(() => route.init(route.params), 0);
        }
        return;
    }

    // Check if route requires authentication
    const isProtected = protectedRoutes.some(pr => path === pr || path.startsWith(pr + '/'));

    if (isProtected && !appState.isLoggedIn) {
        // Show login modal and stay on current page
        window.app.openAccessModal();
        // Redirect to overview
        window.location.hash = '/overview';
        return;
    }

    // Render header with current route
    const headerMount = document.getElementById('header-mount');
    headerMount.innerHTML = renderHeader(path);

    // Render view content
    const appMount = document.getElementById('app');
    appMount.innerHTML = route.render(route.params);

    // Initialize view (pass route params for parameterized routes like /receipts/:id)
    if (route.init) {
        setTimeout(() => route.init(route.params), 0);
    }

    // Reinitialize Lucide icons
    if (window.lucide) {
        setTimeout(() => window.lucide.createIcons(), 10);
    }

    // Update auth UI
    updateAuthUI();
};

// Handle default route (but NEVER override OAuth callback queries)
const { pathname: defaultPathname, search: defaultSearch } = window.location;
const isOAuthLanding =
    defaultPathname === '/' &&
    (defaultSearch.includes('success=') || defaultSearch.includes('code=') || defaultSearch.includes('state='));

if (!window.location.hash && !isOAuthLanding) {
    window.location.hash = '/overview';
}

// Hydrate session from backend on app init
// This ensures identity is always canonical from DB, even if localStorage is stale
hydrateSession();
