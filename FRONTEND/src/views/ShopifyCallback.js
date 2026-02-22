// Shopify OAuth Callback Handler
// Handles: /shopify/callback?success=true&shop=xxx OR ?error=xxx
// Backend has already exchanged the code - we just display the result

export function renderShopifyCallback() {
    return `
        <style>
            .shp-cb { min-height: 100vh; background: #fafafa; display: flex; align-items: center; justify-content: center; font-family: 'IBM Plex Sans', -apple-system, sans-serif; }
            .shp-cb-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 40px 32px; max-width: 420px; width: 100%; text-align: center; }
            .shp-cb-spinner { width: 48px; height: 48px; border: 4px solid #e5e5e5; border-top-color: #96bf48; border-radius: 50%; animation: shp-spin 0.8s linear infinite; margin: 0 auto 20px; }
            @keyframes shp-spin { to { transform: rotate(360deg); } }
            .shp-cb-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; }
            .shp-cb-icon.success { background: rgba(22, 163, 74, 0.1); }
            .shp-cb-icon.error { background: rgba(220, 38, 38, 0.1); }
            .shp-cb h2 { font-size: 18px; font-weight: 600; color: #111; margin: 0 0 8px; }
            .shp-cb p { font-size: 14px; color: #737373; margin: 0 0 16px; }
            .shp-cb-detail { font-size: 12px; font-family: 'IBM Plex Mono', monospace; color: #a3a3a3; margin-bottom: 24px; }
            .shp-cb-btn { display: inline-block; padding: 10px 24px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 150ms; }
            .shp-cb-btn:hover { background: #333; }
            .shp-cb-error-msg { font-size: 13px; color: #dc2626; margin-bottom: 20px; }
            .shp-hidden { display: none; }
        </style>
        <div class="shp-cb">
            <div class="shp-cb-card">
                <div id="shopify-cb-loading">
                    <div class="shp-cb-spinner"></div>
                    <h2>Connecting Shopify</h2>
                    <p>Please wait while we complete the connection...</p>
                </div>
                
                <div id="shopify-cb-success" class="shp-hidden">
                    <div class="shp-cb-icon success">✅</div>
                    <h2>Shopify Connected!</h2>
                    <p>Your Shopify store has been successfully connected.</p>
                    <div id="shopify-shop-display" class="shp-cb-detail"></div>
                    <button onclick="window.router.navigate('/profile')" class="shp-cb-btn">
                        Continue to Profile
                    </button>
                </div>
                
                <div id="shopify-cb-error" class="shp-hidden">
                    <div class="shp-cb-icon error">❌</div>
                    <h2>Connection Failed</h2>
                    <p id="shopify-error-message" class="shp-cb-error-msg"></p>
                    <button onclick="window.router.navigate('/profile')" class="shp-cb-btn">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
}

export async function initShopifyCallback() {
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
    const success = urlParams.get('success');
    const shop = urlParams.get('shop');
    const error = urlParams.get('error');

    const loadingEl = document.getElementById('shopify-cb-loading');
    const successEl = document.getElementById('shopify-cb-success');
    const errorEl = document.getElementById('shopify-cb-error');
    const errorMessageEl = document.getElementById('shopify-error-message');
    const shopDisplayEl = document.getElementById('shopify-shop-display');

    // Clean up stored OAuth state
    localStorage.removeItem('shopify_oauth_flow');

    if (error) {
        console.log('[ShopifyCallback] Error from backend:', error);
        loadingEl.classList.add('shp-hidden');
        errorEl.classList.remove('shp-hidden');

        const errorMessages = {
            'missing_params': 'Missing authorization parameters. Please try again.',
            'invalid_state': 'Session expired or invalid. Please try again.',
            'state_expired': 'Your session has expired. Please try again.',
            'hmac_invalid': 'Security verification failed. Please try again.',
            'invalid_shop': 'Invalid shop domain provided.',
            'config_error': 'Shopify is not properly configured. Please contact support.',
            'exchange_failed': 'Failed to connect Shopify store. Please try again.',
            'server_error': 'Server error occurred. Please try again.',
        };

        errorMessageEl.textContent = errorMessages[error] || `Connection failed: ${error}`;

        if (window.opener) {
            setTimeout(() => window.close(), 3000);
        }
        return;
    }

    if (success === 'true') {
        console.log('[ShopifyCallback] Success! Shop:', shop);

        if (window.hydrateSession) {
            await window.hydrateSession();
        }

        if (window.opener) {
            console.log('[ShopifyCallback] Popup detected, closing...');
            window.close();
            return;
        }

        loadingEl.classList.add('shp-hidden');
        successEl.classList.remove('shp-hidden');

        if (shop) {
            shopDisplayEl.textContent = `Store: ${shop}`;
        }

        setTimeout(() => {
            window.router.navigate('/profile');
        }, 2000);

        return;
    }

    // Neither success nor error
    loadingEl.classList.add('shp-hidden');
    errorEl.classList.remove('shp-hidden');
    errorMessageEl.textContent = 'Invalid callback. Please try connecting again.';

    if (window.opener) {
        setTimeout(() => window.close(), 3000);
    }
}
