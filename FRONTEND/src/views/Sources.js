// Sources.js — Connect Sources — Institutional Data Binding Interface
// Financial custody. Data binding. System access.

export function renderSources() {
    return `
        <style>
            /* ============================================================
               CONNECT SOURCES — DATA BINDING INTERFACE
               ============================================================ */
            .src {
                background: #F2F2F2;
                min-height: calc(100vh - 72px);
                font-family: 'IBM Plex Sans', -apple-system, sans-serif;
                color: #111;
            }

            .src-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 40px;
            }

            /* ── Top Block (white) ── */
            .src-top {
                background: #fff;
                border-bottom: 1px solid #DADADA;
            }

            /* Title */
            .src-page-hdr {
                padding: 20px 0 0;
            }
            .src-page-title {
                font-size: 18px;
                font-weight: 600;
                letter-spacing: -0.3px;
                color: #111;
                margin: 0;
            }
            .src-page-sub {
                font-size: 12px;
                color: #888;
                margin: 4px 0 0;
                font-family: 'IBM Plex Mono', monospace;
            }

            /* Metrics Strip */
            .src-metrics {
                padding: 20px 0;
                border-bottom: 1px solid #ECECEC;
            }
            .src-metrics-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 0;
            }
            .src-metric {
                text-align: center;
                padding: 0 32px;
                border-right: 1px solid #ECECEC;
            }
            .src-metric:last-child { border-right: none; }
            .src-metric-value {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 22px;
                font-weight: 700;
                color: #111;
                letter-spacing: -0.5px;
                line-height: 1.2;
                margin-bottom: 6px;
            }
            .src-metric-value.operational {
                color: #15803d;
                font-size: 13px;
                letter-spacing: 0;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .src-metric-dot {
                width: 7px; height: 7px;
                background: #15803d;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .src-metric-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #777;
            }

            /* ── Feed Area ── */
            .src-feed {
                padding: 28px 0 60px;
            }

            /* ── Section Headers ── */
            .src-section-title {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #888;
                margin: 0 0 14px;
            }

            /* ── Connected Source Cards ── */
            .src-connected-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                margin-bottom: 36px;
            }

            .src-conn-card {
                background: #fff;
                border: 1px solid #DADADA;
                border-radius: 4px;
                padding: 12px 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
            }
            .src-conn-card::before {
                content: '';
                position: absolute;
                top: 4px; bottom: 4px; left: 0;
                width: 3px;
                border-radius: 0 2px 2px 0;
                background: #15803d;
            }

            .src-conn-left {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .src-conn-icon {
                width: 36px; height: 36px;
                background: #EFEFEF;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                flex-shrink: 0;
            }
            .src-conn-icon svg { width: 16px; height: 16px; }
            .src-conn-info {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .src-conn-name {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .src-conn-id {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #999;
                letter-spacing: 0.3px;
            }

            .src-conn-center {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .src-conn-detail {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                letter-spacing: 0.3px;
            }

            .src-conn-right {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            /* Status badges */
            .src-badge {
                display: inline-block;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 3px 8px;
                border-radius: 3px;
            }
            .src-badge-connected { background: #f0fdf4; color: #166534; }
            .src-badge-pending { background: #fffbeb; color: #92400e; }
            .src-badge-expired { background: #fef2f2; color: #991b1b; }
            .src-badge-reauth { background: #fff7ed; color: #9a3412; }

            .src-btn-manage {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #888;
                background: none;
                border: 1px solid #DADADA;
                border-radius: 3px;
                padding: 4px 12px;
                cursor: pointer;
                transition: all 0.12s;
            }
            .src-btn-manage:hover { border-color: #999; color: #555; }
            .src-btn-disconnect {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #991b1b;
                background: none;
                border: none;
                padding: 4px 8px;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.12s;
            }
            .src-btn-disconnect:hover { opacity: 1; }

            /* ── Available Provider Grid ── */
            .src-provider-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 6px;
            }

            .src-prov-card {
                background: #fff;
                border: 1px solid #DADADA;
                border-radius: 4px;
                padding: 20px 24px;
                transition: border-color 0.12s;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            .src-prov-card:hover { border-color: #C8C8C8; }
            .src-prov-card.connected { opacity: 0.5; pointer-events: none; }

            .src-prov-top {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .src-prov-icon {
                width: 36px; height: 36px;
                background: #EFEFEF;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                flex-shrink: 0;
            }
            .src-prov-icon svg { width: 16px; height: 16px; }
            .src-prov-name {
                font-size: 14px;
                font-weight: 700;
                color: #111;
            }

            .src-prov-desc {
                font-size: 12px;
                color: #888;
                line-height: 1.5;
            }

            .src-prov-btn {
                align-self: flex-start;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                padding: 8px 20px;
                background: #111;
                color: #fff;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                transition: background 0.12s;
            }
            .src-prov-btn:hover { background: #921818; }
            .src-prov-btn:disabled {
                background: #ddd;
                color: #999;
                cursor: not-allowed;
            }
            .src-prov-connected {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                color: #166534;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* Coming Soon */
            .src-coming-soon {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #bbb;
                align-self: flex-start;
            }

            /* ── Footer Notice ── */
            .src-footer-notice {
                margin-top: 40px;
                padding: 12px 24px;
                background: #fff;
                border: 1px solid #ECECEC;
                border-radius: 4px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .src-footer-notice-icon {
                color: #999;
                flex-shrink: 0;
            }
            .src-footer-notice-icon svg { width: 14px; height: 14px; }
            .src-footer-notice-text {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                line-height: 1.6;
            }

            /* ── Connect Modal ── */
            .src-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s, visibility 0.2s;
            }
            .src-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .src-modal {
                background: #fff;
                border: 1px solid #DADADA;
                border-radius: 4px;
                width: 100%;
                max-width: 440px;
                overflow: hidden;
            }
            .src-modal-header {
                padding: 20px 24px;
                border-bottom: 1px solid #ECECEC;
            }
            .src-modal-title {
                font-size: 14px;
                font-weight: 700;
                color: #111;
                margin: 0;
            }
            .src-modal-provider {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
            }
            .src-modal-body {
                padding: 20px 24px;
            }
            .src-modal-section {
                margin-bottom: 16px;
            }
            .src-modal-label {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 8px;
            }
            .src-modal-text {
                font-size: 12px;
                color: #555;
                line-height: 1.6;
            }
            .src-modal-security {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 14px;
                background: #fafafa;
                border: 1px solid #ECECEC;
                border-radius: 3px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                letter-spacing: 0.3px;
            }
            .src-modal-security svg { width: 14px; height: 14px; color: #999; flex-shrink: 0; }
            .src-modal-footer {
                padding: 16px 24px;
                border-top: 1px solid #ECECEC;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
            }
            .src-modal-cancel {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #888;
                background: none;
                border: 1px solid #DADADA;
                border-radius: 3px;
                padding: 8px 20px;
                cursor: pointer;
            }
            .src-modal-cancel:hover { border-color: #999; }
            .src-modal-proceed {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                padding: 8px 24px;
                background: #111;
                color: #fff;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                transition: background 0.12s;
            }
            .src-modal-proceed:hover { background: #921818; }

            /* ── Empty Connected State ── */
            .src-empty-connected {
                text-align: center;
                padding: 24px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            /* ── Loading ── */
            .src-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 0;
                gap: 16px;
            }
            .src-spinner {
                width: 20px; height: 20px;
                border: 2px solid #eee;
                border-top-color: #921818;
                border-radius: 50%;
                animation: src-spin 0.8s linear infinite;
            }
            @keyframes src-spin { to { transform: rotate(360deg); } }
            .src-loading-text {
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            /* ── Responsive ── */
            @media (max-width: 768px) {
                .src-container { padding: 0 16px; }
                .src-metrics-grid { grid-template-columns: repeat(3, 1fr); }
                .src-provider-grid { grid-template-columns: 1fr; }
                .src-conn-card {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 10px;
                    padding: 14px 16px;
                }
                .src-conn-center { justify-content: flex-start; }
                .src-conn-right { justify-content: flex-start; }
                .src-modal { max-width: 95%; margin: 0 16px; }
            }
        </style>

        <div class="src">
            <div class="src-top">
                <div class="src-page-hdr">
                    <div class="src-container">
                        <h1 class="src-page-title">CONNECT SOURCES</h1>
                        <p class="src-page-sub">Bind verified data providers to enable deterministic contract settlement</p>
                    </div>
                </div>
                <div class="src-metrics">
                    <div class="src-container">
                        <div class="src-metrics-grid">
                            <div class="src-metric">
                                <div class="src-metric-value" id="src-connected-count">—</div>
                                <div class="src-metric-label">Connected Sources</div>
                            </div>
                            <div class="src-metric">
                                <div class="src-metric-value" id="src-available-count">—</div>
                                <div class="src-metric-label">Available Providers</div>
                            </div>
                            <div class="src-metric">
                                <div class="src-metric-value operational" id="src-verification-status">
                                    <span class="src-metric-dot"></span>
                                    OPERATIONAL
                                </div>
                                <div class="src-metric-label">Verification Status</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="src-feed">
                <div class="src-container">
                    <div id="src-content">
                        <div class="src-loading">
                            <div class="src-spinner"></div>
                            <p class="src-loading-text">Querying provider status...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Connect Modal -->
            <div class="src-modal-overlay" id="src-modal">
                <div class="src-modal">
                    <div class="src-modal-header">
                        <h3 class="src-modal-title" id="src-modal-title">Connect Provider</h3>
                        <div class="src-modal-provider" id="src-modal-provider">DATA SOURCE</div>
                    </div>
                    <div class="src-modal-body">
                        <div class="src-modal-section">
                            <div class="src-modal-label">Data Accessed</div>
                            <div class="src-modal-text" id="src-modal-access"></div>
                        </div>
                        <div class="src-modal-section">
                            <div class="src-modal-label">Purpose</div>
                            <div class="src-modal-text" id="src-modal-purpose"></div>
                        </div>
                        <div class="src-modal-security">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                            <span>Connection is secured via OAuth 2.0. Credentials are never stored.</span>
                        </div>
                    </div>
                    <div class="src-modal-footer">
                        <button class="src-modal-cancel" onclick="window.closeSrcModal()">CANCEL</button>
                        <button class="src-modal-proceed" id="src-modal-proceed">PROCEED</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================================================
// PROVIDER DEFINITIONS
// ============================================================================

const PROVIDERS = [
    {
        id: 'x',
        name: 'X (Twitter)',
        icon: 'twitter',
        description: 'Follower count, engagement metrics, and account verification for social performance contracts.',
        access: 'Public profile data, follower count, tweet engagement metrics, and account verification status.',
        purpose: 'Deterministic verification of social media performance milestones tied to active contracts.',
        connectFn: 'startXOAuth',
        statusFn: 'getXStatus',
        disconnectFn: 'disconnectX',
    },
    {
        id: 'stripe',
        name: 'Stripe',
        icon: 'credit-card',
        description: 'Revenue data, transaction volumes, and business metrics for financial performance contracts.',
        access: 'Transaction volumes, revenue totals, and payment processing metrics via Stripe Connect.',
        purpose: 'Deterministic verification of revenue and financial performance milestones.',
        connectFn: 'startStripeConnect',
        statusFn: 'getStripeStatus',
        disconnectFn: null,
    },
    {
        id: 'shopify',
        name: 'Shopify',
        icon: 'shopping-bag',
        description: 'Store revenue, order volume, and e-commerce metrics for merchant performance contracts.',
        access: 'Order volumes, revenue totals, product metrics, and store analytics.',
        purpose: 'Deterministic verification of e-commerce sales performance milestones.',
        connectFn: 'startShopifyConnect',
        statusFn: 'getShopifyStatus',
        disconnectFn: 'disconnectShopify',
    },
    {
        id: 'amazon',
        name: 'Amazon Seller',
        icon: 'package',
        description: 'Seller metrics, order volume, and marketplace performance for Amazon seller contracts.',
        access: 'Seller account metrics, order volumes, and marketplace performance data.',
        purpose: 'Deterministic verification of Amazon marketplace performance milestones.',
        connectFn: 'startAmazonConnect',
        statusFn: 'getAmazonStatus',
        disconnectFn: 'disconnectAmazon',
    },
    {
        id: 'youtube',
        name: 'YouTube',
        icon: 'youtube',
        description: 'Subscriber count, view metrics, and channel analytics for creator performance contracts.',
        access: null,
        purpose: null,
        connectFn: null,
        statusFn: null,
        disconnectFn: null,
        comingSoon: true,
    },
    {
        id: 'tiktok',
        name: 'TikTok',
        icon: 'music',
        description: 'Follower growth, video engagement, and creator metrics for social performance contracts.',
        access: null,
        purpose: null,
        connectFn: null,
        statusFn: null,
        disconnectFn: null,
        comingSoon: true,
    },
];

// ============================================================================
// INIT
// ============================================================================

export async function initSources() {
    const container = document.getElementById('src-content');
    if (!container) return;

    // Fetch statuses for all available providers
    const statuses = {};
    for (const prov of PROVIDERS) {
        if (prov.statusFn && window.api[prov.statusFn]) {
            try {
                const res = await window.api[prov.statusFn]();
                statuses[prov.id] = res;
            } catch (e) {
                statuses[prov.id] = null;
            }
        }
    }

    // Determine connected vs available
    const connected = [];
    const available = [];

    for (const prov of PROVIDERS) {
        const status = statuses[prov.id];
        const isConnected = status?.connected || status?.status === 'connected';

        if (isConnected) {
            connected.push({ ...prov, status });
        } else {
            available.push(prov);
        }
    }

    // Hydrate metrics
    const connCountEl = document.getElementById('src-connected-count');
    const availCountEl = document.getElementById('src-available-count');
    if (connCountEl) connCountEl.textContent = connected.length.toString();
    if (availCountEl) availCountEl.textContent = PROVIDERS.filter(p => !p.comingSoon).length.toString();

    // Render
    let html = '';

    // Section 1: Connected Sources
    html += `<div class="src-section-title">Connected Sources</div>`;

    if (connected.length === 0) {
        html += `<div class="src-empty-connected">No sources currently bound</div>`;
    } else {
        html += `<div class="src-connected-list">`;
        for (const conn of connected) {
            const accountId = conn.status?.username || conn.status?.accountId || conn.status?.shop || '••••••••';
            const connDate = conn.status?.connectedAt ? new Date(conn.status.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const disconnectBtn = conn.disconnectFn ? `<button class="src-btn-disconnect" onclick="window.disconnectSource('${conn.id}')">DISCONNECT</button>` : '';

            html += `
                <div class="src-conn-card">
                    <div class="src-conn-left">
                        <div class="src-conn-icon"><i data-lucide="${conn.icon}"></i></div>
                        <div class="src-conn-info">
                            <span class="src-conn-name">${conn.name}</span>
                            <span class="src-conn-id">${accountId}</span>
                        </div>
                    </div>
                    <div class="src-conn-center">
                        <span class="src-conn-detail">Connected ${connDate}</span>
                    </div>
                    <div class="src-conn-right">
                        <span class="src-badge src-badge-connected">CONNECTED</span>
                        ${disconnectBtn}
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }

    // Section 2: Available Providers
    html += `<div class="src-section-title" style="margin-top: 12px;">Available Providers</div>`;
    html += `<div class="src-provider-grid">`;

    for (const prov of available) {
        const isConnected = connected.some(c => c.id === prov.id);

        if (prov.comingSoon) {
            html += `
                <div class="src-prov-card">
                    <div class="src-prov-top">
                        <div class="src-prov-icon"><i data-lucide="${prov.icon}"></i></div>
                        <span class="src-prov-name">${prov.name}</span>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <span class="src-coming-soon">COMING SOON</span>
                </div>
            `;
        } else {
            html += `
                <div class="src-prov-card ${isConnected ? 'connected' : ''}">
                    <div class="src-prov-top">
                        <div class="src-prov-icon"><i data-lucide="${prov.icon}"></i></div>
                        <span class="src-prov-name">${prov.name}</span>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    ${isConnected
                    ? `<span class="src-prov-connected">✓ CONNECTED</span>`
                    : `<button class="src-prov-btn" onclick="window.openSrcModal('${prov.id}')">CONNECT</button>`
                }
                </div>
            `;
        }
    }

    html += `</div>`;

    // Footer Notice
    html += `
        <div class="src-footer-notice">
            <div class="src-footer-notice-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
            </div>
            <span class="src-footer-notice-text">All sources are verified via official APIs. No manual data input is permitted for settlement.</span>
        </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();

    // Wire modal functions
    window.openSrcModal = (providerId) => {
        const prov = PROVIDERS.find(p => p.id === providerId);
        if (!prov) return;

        const modal = document.getElementById('src-modal');
        const titleEl = document.getElementById('src-modal-title');
        const provEl = document.getElementById('src-modal-provider');
        const accessEl = document.getElementById('src-modal-access');
        const purposeEl = document.getElementById('src-modal-purpose');
        const proceedBtn = document.getElementById('src-modal-proceed');

        if (titleEl) titleEl.textContent = `Connect ${prov.name}`;
        if (provEl) provEl.textContent = `${prov.id.toUpperCase()} DATA SOURCE`;
        if (accessEl) accessEl.textContent = prov.access || '';
        if (purposeEl) purposeEl.textContent = prov.purpose || '';

        if (proceedBtn) {
            proceedBtn.onclick = async () => {
                proceedBtn.disabled = true;
                proceedBtn.textContent = 'CONNECTING...';
                try {
                    if (prov.connectFn && window.api[prov.connectFn]) {
                        const result = await window.api[prov.connectFn]();
                        if (result?.url || result?.authUrl || result?.redirectUrl) {
                            window.location.href = result.url || result.authUrl || result.redirectUrl;
                        }
                    }
                } catch (err) {
                    console.error(`[Sources] Connect ${prov.id} failed:`, err);
                    proceedBtn.textContent = 'ERROR — RETRY';
                    proceedBtn.disabled = false;
                }
            };
        }

        if (modal) modal.classList.add('active');
    };

    window.closeSrcModal = () => {
        const modal = document.getElementById('src-modal');
        if (modal) modal.classList.remove('active');
        // Reset proceed button
        const btn = document.getElementById('src-modal-proceed');
        if (btn) {
            btn.textContent = 'PROCEED';
            btn.disabled = false;
        }
    };

    window.disconnectSource = async (providerId) => {
        const prov = PROVIDERS.find(p => p.id === providerId);
        if (!prov || !prov.disconnectFn || !window.api[prov.disconnectFn]) return;

        if (!confirm(`Disconnect ${prov.name}? Active contracts using this source may be affected.`)) return;

        try {
            await window.api[prov.disconnectFn]();
            // Reload
            initSources();
        } catch (err) {
            console.error(`[Sources] Disconnect ${prov.id} failed:`, err);
            alert(`Failed to disconnect ${prov.name}: ${err.message}`);
        }
    };
}
