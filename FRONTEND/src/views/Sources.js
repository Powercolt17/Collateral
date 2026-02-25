// Sources.js — Connect Sources — Institutional Data Binding Interface
// Pure white institutional aesthetic. Inter font. Deterministic settlement.

export function renderSources() {
    return `
        <style>
            /* ============================================================
               CONNECT SOURCES — INSTITUTIONAL DATA BINDING INTERFACE
               Inter font, #fafafa background, sharp corners, muted opacity
               ============================================================ */
            .src {
                background: #fafafa;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #0a0a0a;
                display: flex;
                flex-direction: column;
            }

            /* ── Header Block (white) ── */
            .src-header {
                background: #fff;
                border-bottom: 1px solid rgba(0,0,0,0.04);
            }
            .src-header-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 40px 64px 40px;
            }

            /* Title */
            .src-page-title {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: #0a0a0a;
                margin: 0;
                text-transform: uppercase;
            }
            .src-page-sub {
                font-size: 13px;
                font-weight: 400;
                color: rgba(10,10,10,0.35);
                margin: 8px 0 0;
            }

            /* Stats Row */
            .src-stats-row {
                display: flex;
                align-items: baseline;
                gap: 48px;
                flex-wrap: wrap;
                margin-top: 40px;
            }
            .src-stat {
                display: flex;
                flex-direction: column;
            }
            .src-stat-value {
                font-size: 28px;
                font-weight: 300;
                letter-spacing: -0.03em;
                color: #0a0a0a;
                line-height: 1;
            }
            .src-stat-label {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.12em;
                color: rgba(10,10,10,0.25);
                text-transform: uppercase;
                margin-top: 6px;
            }

            /* Verification Status (inline with stats) */
            .src-status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .src-status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #16a34a;
                flex-shrink: 0;
            }
            .src-status-text {
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: #0a0a0a;
            }

            /* ── Content Area ── */
            .src-content {
                flex: 1;
                max-width: 1440px;
                margin: 0 auto;
                padding: 40px 64px;
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Section Labels ── */
            .src-section-label {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.12em;
                color: rgba(10,10,10,0.25);
                text-transform: uppercase;
                margin: 0 0 20px;
            }

            /* ── Connected Source Rows ── */
            .src-connected-list {
                display: flex;
                flex-direction: column;
                margin-bottom: 48px;
            }

            .src-conn-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 24px;
                background: #fff;
                border-bottom: 1px solid rgba(0,0,0,0.04);
            }
            .src-conn-row:first-child {
                border-top: 1px solid rgba(0,0,0,0.04);
            }

            .src-conn-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .src-conn-icon {
                width: 36px;
                height: 36px;
                border: 1px solid rgba(0,0,0,0.06);
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(10,10,10,0.4);
                flex-shrink: 0;
            }
            .src-conn-icon svg { width: 16px; height: 16px; }
            .src-conn-name {
                font-size: 13px;
                font-weight: 500;
                color: #0a0a0a;
            }

            .src-conn-right {
                display: flex;
                align-items: center;
                gap: 32px;
            }
            .src-conn-date {
                font-size: 12px;
                font-weight: 400;
                color: rgba(10,10,10,0.25);
            }
            .src-conn-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .src-badge-connected {
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: #16a34a;
                text-transform: uppercase;
            }
            .src-btn-disconnect {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: #7a1a1a;
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .src-btn-disconnect:hover { opacity: 0.7; }

            .src-empty-connected {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 48px;
                background: #fff;
                border: 1px solid rgba(0,0,0,0.04);
            }
            .src-empty-connected span {
                font-size: 13px;
                font-weight: 400;
                color: rgba(10,10,10,0.2);
            }

            /* ── Available Provider Grid ── */
            .src-provider-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1px;
                background: rgba(0,0,0,0.04);
                margin-bottom: 48px;
            }

            .src-prov-card {
                background: #fff;
                padding: 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }

            .src-prov-top {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .src-prov-icon {
                width: 36px;
                height: 36px;
                border: 1px solid rgba(0,0,0,0.06);
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(10,10,10,0.3);
                flex-shrink: 0;
            }
            .src-prov-icon svg { width: 18px; height: 18px; }
            .src-prov-name {
                font-size: 13px;
                font-weight: 500;
                color: #0a0a0a;
            }

            .src-prov-desc {
                font-size: 12px;
                font-weight: 400;
                line-height: 1.6;
                color: rgba(10,10,10,0.3);
                flex: 1;
            }

            .src-prov-btn {
                align-self: flex-start;
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                padding: 8px 16px;
                background: #0a0a0a;
                color: #fff;
                border: 1px solid #0a0a0a;
                cursor: pointer;
                transition: background 0.2s;
            }
            .src-prov-btn:hover { background: rgba(10,10,10,0.85); }
            .src-prov-btn:disabled {
                background: #ddd;
                color: #999;
                border-color: #ddd;
                cursor: not-allowed;
            }

            .src-coming-soon {
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: rgba(10,10,10,0.2);
                align-self: flex-start;
            }

            .src-prov-connected-label {
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.06em;
                color: #16a34a;
                text-transform: uppercase;
                align-self: flex-start;
            }

            /* ── Footer Notice ── */
            .src-footer-notice {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                border: 1px solid rgba(0,0,0,0.04);
                background: #fff;
                margin-bottom: 48px;
            }
            .src-footer-notice-icon {
                color: rgba(10,10,10,0.2);
                flex-shrink: 0;
            }
            .src-footer-notice-icon svg { width: 14px; height: 14px; }
            .src-footer-notice-text {
                font-size: 11px;
                font-weight: 400;
                letter-spacing: 0.04em;
                color: rgba(10,10,10,0.3);
                text-transform: uppercase;
            }

            /* ── Status Footer Bar ── */
            .src-status-footer {
                border-top: 1px solid rgba(0,0,0,0.04);
                background: #fff;
                margin-top: auto;
            }
            .src-status-footer-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 16px 64px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .src-status-footer-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .src-status-footer-label {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                color: rgba(10,10,10,0.2);
                text-transform: uppercase;
            }
            .src-status-footer-sep {
                color: rgba(10,10,10,0.1);
            }
            .src-status-footer-live {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .src-status-footer-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #16a34a;
            }
            .src-status-footer-text {
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.05em;
                color: rgba(22,163,74,0.7);
                text-transform: uppercase;
            }
            .src-status-footer-year {
                font-size: 11px;
                font-weight: 400;
                color: rgba(10,10,10,0.2);
            }

            /* ── Connect Modal ── */
            .src-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.35);
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
                border: 1px solid rgba(0,0,0,0.06);
                width: 100%;
                max-width: 440px;
                overflow: hidden;
            }
            .src-modal-header {
                padding: 24px 28px;
                border-bottom: 1px solid rgba(0,0,0,0.04);
            }
            .src-modal-title {
                font-size: 14px;
                font-weight: 600;
                color: #0a0a0a;
                margin: 0;
            }
            .src-modal-provider {
                font-size: 10px;
                font-weight: 500;
                color: rgba(10,10,10,0.25);
                text-transform: uppercase;
                letter-spacing: 0.12em;
                margin-top: 6px;
            }
            .src-modal-body {
                padding: 24px 28px;
            }
            .src-modal-section {
                margin-bottom: 20px;
            }
            .src-modal-label {
                font-size: 10px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: rgba(10,10,10,0.25);
                margin-bottom: 8px;
            }
            .src-modal-text {
                font-size: 12px;
                font-weight: 400;
                color: rgba(10,10,10,0.4);
                line-height: 1.6;
            }
            .src-modal-security {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                background: #fafafa;
                border: 1px solid rgba(0,0,0,0.04);
                font-size: 11px;
                font-weight: 400;
                color: rgba(10,10,10,0.3);
                letter-spacing: 0.02em;
            }
            .src-modal-security svg { width: 14px; height: 14px; color: rgba(10,10,10,0.2); flex-shrink: 0; }
            .src-modal-footer {
                padding: 16px 28px;
                border-top: 1px solid rgba(0,0,0,0.04);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
            }
            .src-modal-cancel {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: rgba(10,10,10,0.4);
                background: none;
                border: 1px solid rgba(0,0,0,0.08);
                padding: 8px 20px;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            .src-modal-cancel:hover { border-color: rgba(0,0,0,0.2); }
            .src-modal-proceed {
                font-family: 'Inter', sans-serif;
                font-size: 11px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                padding: 8px 24px;
                background: #0a0a0a;
                color: #fff;
                border: 1px solid #0a0a0a;
                cursor: pointer;
                transition: background 0.2s;
            }
            .src-modal-proceed:hover { background: rgba(10,10,10,0.85); }
            .src-modal-proceed:disabled {
                background: #ddd;
                color: #999;
                border-color: #ddd;
                cursor: not-allowed;
            }

            /* ── Loading ── */
            .src-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 0;
                gap: 16px;
            }
            .src-spinner {
                width: 18px; height: 18px;
                border: 2px solid rgba(0,0,0,0.06);
                border-top-color: #0a0a0a;
                border-radius: 50%;
                animation: src-spin 0.8s linear infinite;
            }
            @keyframes src-spin { to { transform: rotate(360deg); } }
            .src-loading-text {
                font-size: 10px;
                font-weight: 500;
                color: rgba(10,10,10,0.25);
                text-transform: uppercase;
                letter-spacing: 0.12em;
            }

            /* ── Responsive ── */
            @media (max-width: 1024px) {
                .src-header-inner { padding: 32px 32px; }
                .src-content { padding: 32px 32px; }
                .src-status-footer-inner { padding: 16px 32px; }
                .src-provider-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 768px) {
                .src-header-inner { padding: 24px 16px; }
                .src-content { padding: 24px 16px; }
                .src-status-footer-inner { padding: 12px 16px; }
                .src-provider-grid { grid-template-columns: 1fr; }
                .src-stats-row { gap: 32px; }
                .src-conn-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px 20px;
                }
                .src-conn-right { width: 100%; justify-content: space-between; }
                .src-conn-date { display: none; }
                .src-modal { max-width: 95%; margin: 0 16px; }
            }
        </style>

        <div class="src">
            <!-- Header -->
            <div class="src-header">
                <div class="src-header-inner">
                    <h1 class="src-page-title">Connect Sources</h1>
                    <p class="src-page-sub">Bind verified data providers to enable deterministic contract settlement</p>

                    <!-- Stats row -->
                    <div class="src-stats-row">
                        <div class="src-stat">
                            <span class="src-stat-value" id="src-connected-count">&mdash;</span>
                            <span class="src-stat-label">Connected Sources</span>
                        </div>
                        <div class="src-stat">
                            <span class="src-stat-value" id="src-available-count">&mdash;</span>
                            <span class="src-stat-label">Available Providers</span>
                        </div>
                        <div class="src-stat">
                            <div class="src-status-indicator">
                                <div class="src-status-dot"></div>
                                <span class="src-status-text">OPERATIONAL</span>
                            </div>
                            <span class="src-stat-label">Verification Status</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="src-content" id="src-content">
                <div class="src-loading">
                    <div class="src-spinner"></div>
                    <p class="src-loading-text">Querying provider status...</p>
                </div>
            </div>

            <!-- Status Footer -->
            <div class="src-status-footer">
                <div class="src-status-footer-inner">
                    <div class="src-status-footer-left">
                        <span class="src-status-footer-label">System Status</span>
                        <span class="src-status-footer-sep">&mdash;</span>
                        <div class="src-status-footer-live">
                            <div class="src-status-footer-dot"></div>
                            <span class="src-status-footer-text">Operational</span>
                        </div>
                    </div>
                    <span class="src-status-footer-year">2026</span>
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
    html += `<div class="src-section-label">Connected Sources</div>`;

    if (connected.length === 0) {
        html += `<div class="src-empty-connected"><span>No sources connected.</span></div>`;
    } else {
        html += `<div class="src-connected-list">`;
        for (const conn of connected) {
            const connDate = conn.status?.connectedAt
                ? new Date(conn.status.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—';
            const disconnectBtn = conn.disconnectFn
                ? `<button class="src-btn-disconnect" onclick="window.disconnectSource('${conn.id}')">DISCONNECT</button>`
                : '';

            html += `
                <div class="src-conn-row">
                    <div class="src-conn-left">
                        <div class="src-conn-icon"><i data-lucide="${conn.icon}"></i></div>
                        <span class="src-conn-name">${conn.name}</span>
                    </div>
                    <div class="src-conn-right">
                        <span class="src-conn-date">Connected ${connDate}</span>
                        <div class="src-conn-actions">
                            <span class="src-badge-connected">CONNECTED</span>
                            ${disconnectBtn}
                        </div>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }

    // Section 2: Available Providers
    html += `<div class="src-section-label" style="margin-top: 48px;">Available Providers</div>`;
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
                <div class="src-prov-card">
                    <div class="src-prov-top">
                        <div class="src-prov-icon"><i data-lucide="${prov.icon}"></i></div>
                        <span class="src-prov-name">${prov.name}</span>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    ${isConnected
                    ? `<span class="src-prov-connected-label">✓ CONNECTED</span>`
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
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
                    // Shopify requires a shop domain
                    let result;
                    if (prov.id === 'shopify') {
                        const shop = prompt('Enter your Shopify store domain (e.g. mystore.myshopify.com):');
                        if (!shop) {
                            proceedBtn.textContent = 'PROCEED';
                            proceedBtn.disabled = false;
                            return;
                        }
                        result = await window.api.startShopifyConnect(shop);
                    } else if (prov.connectFn && window.api[prov.connectFn]) {
                        result = await window.api[prov.connectFn]();
                    } else {
                        throw new Error('Connect method not available');
                    }

                    console.log('[Sources] Connect result:', JSON.stringify(result));

                    // Already connected — just reload
                    if (result?.connected || result?.alreadyConnected) {
                        window.closeSrcModal();
                        initSources();
                        return;
                    }

                    // Redirect to OAuth provider
                    const redirectUrl = result?.oauthUrl || result?.url || result?.authUrl || result?.redirectUrl;
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                        return;
                    }

                    // No URL returned — unknown response
                    console.warn('[Sources] No redirect URL in response:', result);
                    proceedBtn.textContent = 'NO REDIRECT — RETRY';
                    proceedBtn.disabled = false;
                } catch (err) {
                    console.error(`[Sources] Connect ${prov.id} failed:`, err);
                    const msg = err?.message || 'Connection failed';
                    proceedBtn.textContent = msg.length > 30 ? 'ERROR — RETRY' : msg.toUpperCase();
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
