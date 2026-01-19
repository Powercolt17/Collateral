// Stripe OAuth Callback Handler
// Handles: /stripe/callback?success=true&account=xxx OR ?error=xxx
// Backend has already exchanged the code - we just display the result

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
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const account = urlParams.get('account');
    const error = urlParams.get('error');

    const loadingEl = document.getElementById('stripe-callback-loading');
    const successEl = document.getElementById('stripe-callback-success');
    const errorEl = document.getElementById('stripe-callback-error');
    const errorMessageEl = document.getElementById('stripe-error-message');
    const accountDisplayEl = document.getElementById('stripe-account-display');

    // Clean up stored OAuth state
    localStorage.removeItem('stripe_oauth_flow');
    localStorage.removeItem('stripe_oauth_state');

    // Handle error from backend
    if (error) {
        console.log('[StripeCallback] Error from backend:', error);
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');

        // Map error codes to user-friendly messages
        const errorMessages = {
            'missing_params': 'Missing authorization code or state. Please try again.',
            'invalid_state': 'Session expired or invalid. Please try again.',
            'state_expired': 'Your session has expired. Please try again.',
            'state_mismatch': 'Session mismatch detected. Please try again.',
            'config_error': 'Stripe is not properly configured. Please contact support.',
            'exchange_failed': 'Failed to connect Stripe account. Please try again.',
            'no_account_id': 'No account ID returned from Stripe. Please try again.',
            'server_error': 'Server error occurred. Please try again.',
            'access_denied': 'Access was denied. Please try again.',
        };

        errorMessageEl.textContent = errorMessages[error] || `Connection failed: ${error}`;

        // If popup, still close it after showing error briefly
        if (window.opener) {
            setTimeout(() => window.close(), 3000);
        }
        return;
    }

    // Handle success from backend
    if (success === 'true') {
        console.log('[StripeCallback] Success! Account:', account);

        // Re-hydrate session to sync connected sources
        if (window.hydrateSession) {
            console.log('[StripeCallback] Hydrating session...');
            await window.hydrateSession();
        }

        // If popup, close immediately - parent window is polling
        if (window.opener) {
            console.log('[StripeCallback] Popup detected, closing...');
            window.close();
            return;
        }

        // Show success UI in main window
        loadingEl.classList.add('hidden');
        successEl.classList.remove('hidden');

        if (account) {
            accountDisplayEl.textContent = `Account: ${account}`;
        }

        // Auto-redirect after 2 seconds
        setTimeout(() => {
            window.router.navigate('/contracts?step=source&connected=stripe');
        }, 2000);

        return;
    }

    // Neither success nor error - show error state
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorMessageEl.textContent = 'Invalid callback. Please try connecting again.';

    if (window.opener) {
        setTimeout(() => window.close(), 3000);
    }
}
