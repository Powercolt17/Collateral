// YouTube OAuth Callback Handler
// Handles: /youtube/callback?success=true&channel=xxx OR ?error=xxx
// Backend has already exchanged the code - we just display the result

export function renderYouTubeCallback() {
    return `
        <style>
            .yt-cb { min-height: 100vh; background: #fafafa; display: flex; align-items: center; justify-content: center; font-family: 'Sora', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
            .yt-cb-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 40px 32px; max-width: 420px; width: 100%; text-align: center; }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            .yt-cb-spinner { position: relative; width: 48px; height: 48px; margin: 0 auto 20px; }
            .yt-cb-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px; }
            .yt-cb-icon.success { background: rgba(22, 163, 74, 0.1); }
            .yt-cb-icon.error { background: rgba(220, 38, 38, 0.1); }
            .yt-cb h2 { font-size: 18px; font-weight: 600; color: #111; margin: 0 0 8px; }
            .yt-cb p { font-size: 14px; color: #737373; margin: 0 0 16px; }
            .yt-cb-detail { font-size: 12px; font-family: 'JetBrains Mono', monospace; color: #a3a3a3; margin-bottom: 24px; }
            .yt-cb-btn { display: inline-block; padding: 10px 24px; background: #111; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 150ms; text-decoration: none; }
            .yt-cb-btn:hover { background: #333; }
            .yt-cb-error-msg { font-size: 13px; color: #dc2626; margin-bottom: 20px; }
            .yt-hidden { display: none; }
        </style>
        <div class="yt-cb">
            <div class="yt-cb-card">
                <div id="youtube-cb-loading">
                    <div class="yt-cb-spinner">
                        <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                        <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                    </div>
                    <h2>Connecting YouTube</h2>
                    <p>Please wait while we complete the connection...</p>
                </div>
                
                <div id="youtube-cb-success" class="yt-hidden">
                    <div class="yt-cb-icon success">✅</div>
                    <h2>YouTube Connected!</h2>
                    <p>Your YouTube channel has been successfully connected.</p>
                    <div id="youtube-channel-display" class="yt-cb-detail"></div>
                    <button onclick="window.router.navigate('/sources')" class="yt-cb-btn">
                        Continue to Sources
                    </button>
                </div>
                
                <div id="youtube-cb-error" class="yt-hidden">
                    <div class="yt-cb-icon error">❌</div>
                    <h2>Connection Failed</h2>
                    <p id="youtube-error-message" class="yt-cb-error-msg"></p>
                    <button onclick="window.router.navigate('/sources')" class="yt-cb-btn">
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    `;
}

export async function initYouTubeCallback() {
    const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
    const success = urlParams.get('success');
    const channel = urlParams.get('channel');
    const error = urlParams.get('error');

    const loadingEl = document.getElementById('youtube-cb-loading');
    const successEl = document.getElementById('youtube-cb-success');
    const errorEl = document.getElementById('youtube-cb-error');
    const errorMessageEl = document.getElementById('youtube-error-message');
    const channelDisplayEl = document.getElementById('youtube-channel-display');

    if (error) {
        console.log('[YouTubeCallback] Error from backend:', error);
        loadingEl.classList.add('yt-hidden');
        errorEl.classList.remove('yt-hidden');

        const errorMessages = {
            'missing_params': 'Missing authorization parameters. Please try again.',
            'invalid_state': 'Session expired or invalid. Please try again.',
            'state_expired': 'Your session has expired. Please try again.',
            'config_error': 'YouTube is not properly configured. Please contact support.',
            'exchange_failed': 'Failed to connect YouTube account. Please try again.',
            'server_error': 'Server error occurred. Please try again.',
        };

        errorMessageEl.textContent = errorMessages[error] || `Connection failed: ${decodeURIComponent(error)}`;

        if (window.opener) {
            setTimeout(() => window.close(), 3000);
        }
        return;
    }

    if (success === 'true') {
        console.log('[YouTubeCallback] Success! Channel:', channel);

        if (window.hydrateSession) {
            await window.hydrateSession();
        }

        if (window.opener) {
            console.log('[YouTubeCallback] Popup detected, closing...');
            window.close();
            return;
        }

        loadingEl.classList.add('yt-hidden');
        successEl.classList.remove('yt-hidden');

        if (channel) {
            channelDisplayEl.textContent = `Channel: ${decodeURIComponent(channel)}`;
        }

        setTimeout(() => {
            window.router.navigate('/sources');
        }, 2000);

        return;
    }

    // Neither success nor error
    loadingEl.classList.add('yt-hidden');
    errorEl.classList.remove('yt-hidden');
    errorMessageEl.textContent = 'Invalid callback. Please try connecting again.';

    if (window.opener) {
        setTimeout(() => window.close(), 3000);
    }
}
