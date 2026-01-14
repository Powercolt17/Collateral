// X OAuth Callback Handler
// Handles: /x/callback?success=true&username=... or /x/callback?error=...

export function renderXCallback() {
    return `
        <div class="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div class="bg-white border border-neutral-200 rounded-lg p-8 max-w-md w-full text-center">
                <div id="x-callback-loading">
                    <div class="w-12 h-12 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">Processing X Connection</h2>
                    <p class="text-sm text-neutral-500">Please wait...</p>
                </div>
                
                <div id="x-callback-success" class="hidden">
                    <div class="w-14 h-14 bg-[#E8F4ED] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-[#1F7A4D]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">X Account Connected</h2>
                    <p id="x-username-display" class="text-sm text-[#1F7A4D] font-mono mb-4"></p>
                    <p class="text-xs text-neutral-500 mb-6">Authority binding established. You can now proceed with contract creation.</p>
                    <button onclick="window.router.navigate('/contracts')" class="px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wide rounded hover:bg-neutral-800 transition-colors">
                        Continue to Contracts
                    </button>
                </div>
                
                <div id="x-callback-error" class="hidden">
                    <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-neutral-800 mb-2">Connection Failed</h2>
                    <p id="x-error-message" class="text-sm text-red-600 mb-2"></p>
                    <p id="x-error-hint" class="text-xs text-neutral-500 mb-6"></p>
                    <button onclick="window.router.navigate('/contracts')" class="px-6 py-3 bg-neutral-900 text-white text-sm font-medium uppercase tracking-wide rounded hover:bg-neutral-800 transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
}

export async function initXCallback() {
    // Parse URL params
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const username = urlParams.get('username');
    const error = urlParams.get('error');

    const loadingEl = document.getElementById('x-callback-loading');
    const successEl = document.getElementById('x-callback-success');
    const errorEl = document.getElementById('x-callback-error');
    const errorMessageEl = document.getElementById('x-error-message');
    const errorHintEl = document.getElementById('x-error-hint');
    const usernameDisplayEl = document.getElementById('x-username-display');

    // Small delay for UX (loading spinner feels more intentional)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Handle success - VERIFY with backend before trusting URL param
    if (success === 'true') {
        try {
            // Fail-closed: verify status with backend
            const status = await window.api.getXStatus();
            console.log('[XCallback] Status check:', status);

            if (status.connected) {
                loadingEl.classList.add('hidden');
                successEl.classList.remove('hidden');

                const displayUsername = status.xUsername || (username ? decodeURIComponent(username) : null);
                if (displayUsername) {
                    usernameDisplayEl.textContent = `@${displayUsername}`;
                } else {
                    usernameDisplayEl.textContent = 'Account Connected';
                }

                // Redirect to Contracts wizard Step 2 (Source) after 2 seconds
                setTimeout(() => {
                    window.router.navigate('/contracts?step=source&connected=x');
                }, 2000);

                return;
            } else {
                // Backend says not connected despite ?success=true
                console.error('[XCallback] Status check failed - not actually connected');
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                errorMessageEl.textContent = 'Connection incomplete';
                errorHintEl.textContent = 'The X account binding did not complete. Please try again.';
                return;
            }
        } catch (err) {
            console.error('[XCallback] Status check error:', err);
            loadingEl.classList.add('hidden');
            errorEl.classList.remove('hidden');
            errorMessageEl.textContent = 'Verification failed';
            errorHintEl.textContent = 'Could not verify connection status. Please try again.';
            return;
        }
    }

    // Handle errors
    if (error) {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');

        // Map error codes to user-friendly messages
        const errorMessages = {
            'denied': {
                message: 'Authorization was denied',
                hint: 'You declined to connect your X account. Click below to try again.'
            },
            'protected': {
                message: 'Protected accounts cannot be used',
                hint: 'Collateral requires public follower counts for verification. Please use a public account.'
            },
            'already_bound': {
                message: 'This X account is already connected',
                hint: 'This X account is linked to another Collateral user. Each X account can only be bound once.'
            },
            'verification_failed': {
                message: 'Could not verify X account',
                hint: 'We were unable to verify your account details. Please try again or contact support.'
            },
            'expired': {
                message: 'Session expired',
                hint: 'Your authorization session timed out. Please try connecting again.'
            }
        };

        const errorInfo = errorMessages[error] || {
            message: 'An error occurred',
            hint: `Error code: ${error}. Please try again.`
        };

        errorMessageEl.textContent = errorInfo.message;
        errorHintEl.textContent = errorInfo.hint;

        return;
    }

    // No success or error - unexpected state
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
    errorMessageEl.textContent = 'Invalid callback state';
    errorHintEl.textContent = 'No success or error parameter received. Please try connecting again.';
}
