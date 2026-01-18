// Stripe OAuth Callback Handler
// Handles: /stripe/callback?code=...&state=...

export function renderStripeCallback() {
    return `
        <div class="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div class="bg-white border border-neutral-200 rounded-lg p-8 max-w-md w-full text-center">
                <div id="stripe-callback-loading">
                    <div class="w-12 h-12 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">Connecting Stripe</h2>
                    <p class="text-sm text-neutral-500">Please wait while we complete the connection...</p>
                </div>
                
                <div id="stripe-callback-success" class="hidden">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">Stripe Connected!</h2>
                    <p class="text-sm text-neutral-500 mb-4">Your Stripe account has been successfully connected.</p>
                    <p id="stripe-account-display" class="text-xs font-mono text-neutral-400 mb-6"></p>
                    <button onclick="window.router.navigate('/contracts')" class="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                        Continue to Contracts
                    </button>
                </div>
                
                <div id="stripe-callback-error" class="hidden">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">Connection Failed</h2>
                    <p id="stripe-error-message" class="text-sm text-red-600 mb-4"></p>
                    <button onclick="window.router.navigate('/contracts')" class="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
}

export async function initStripeCallback() {
    // Get code and state from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    const loadingEl = document.getElementById('stripe-callback-loading');
    const successEl = document.getElementById('stripe-callback-success');
    const errorEl = document.getElementById('stripe-callback-error');
    const errorMessageEl = document.getElementById('stripe-error-message');
    const accountDisplayEl = document.getElementById('stripe-account-display');

    // Handle OAuth error from Stripe or our own error params
    if (error) {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');

        // Map our custom error codes to user-friendly messages
        const errorMessages = {
            'state_mismatch': 'Session mismatch detected. This can happen if you opened the login in a different tab. Please try again.',
            'session_expired': 'Your Stripe connection session has expired (10 minute limit). Please try again.',
        };

        errorMessageEl.textContent = errorMessages[error] || errorDescription || error || 'Unknown error from Stripe';

        // Clear any stale OAuth state
        localStorage.removeItem('stripe_oauth_flow');
        localStorage.removeItem('stripe_oauth_state');
        return;
    }

    // Validate required params
    if (!code || !state) {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMessageEl.textContent = 'Missing authorization code or state. Please try again.';
        return;
    }

    // Verify state matches what we stored
    const storedState = localStorage.getItem('stripe_oauth_state');
    if (state !== storedState) {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMessageEl.textContent = 'Invalid state token. This may be a CSRF attack.';
        return;
    }

    try {
        console.log('[StripeCallback] Completing Stripe connect...');
        // Exchange code for connected account
        const result = await window.api.completeStripeConnect(code, state);
        console.log('[StripeCallback] Complete result:', result);

        // Re-hydrate session to sync connected sources (critical!)
        if (window.hydrateSession) {
            console.log('[StripeCallback] Hydrating session...');
            await window.hydrateSession();
        }

        // Show success
        loadingEl.classList.add('hidden');
        successEl.classList.remove('hidden');

        if (result.stripeAccountId) {
            accountDisplayEl.textContent = `Account: ${result.stripeAccountId}`;
        }

        // Auto-redirect to Contracts wizard Step 2 (Source) after 2 seconds
        setTimeout(() => {
            window.router.navigate('/contracts?step=source&connected=stripe');
        }, 2000);

        // If opened in popup, close it and let parent refresh
        if (window.opener) {
            window.close();
        }

    } catch (err) {
        console.error('[StripeCallback] Error:', err);

        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMessageEl.textContent = err.message || 'Failed to complete Stripe connection';
    } finally {
        // Always clear stored state (prevents stale state issues)
        localStorage.removeItem('stripe_oauth_flow');
        localStorage.removeItem('stripe_oauth_state');
    }
}
