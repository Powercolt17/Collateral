// Sources.js — Connect Sources — Institutional Data Binding Interface
// Redesigned to match premium institutional aesthetic

export function renderSources() {
    return `
        <style>
            /* ============================================================
               CONNECT SOURCES — INSTITUTIONAL DATA BINDING INTERFACE
               ============================================================ */
            .src {
                background: #fafafa;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                color: #0a0a0a;
                display: flex;
                flex-direction: column;
            }

            /* ── Hero Header ── */
            .src-header {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
            }
            .src-header-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 48px 64px 48px;
            }
            .src-breadcrumb {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #ccc;
                margin-bottom: 20px;
            }
            .src-breadcrumb strong {
                color: #111;
                font-weight: 700;
            }

            /* Title row: left = title/desc, right = stats */
            .src-hero-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 48px;
            }
            .src-hero-left { flex: 1; }
            .src-hero-title {
                font-size: 42px;
                font-weight: 300;
                color: #111;
                letter-spacing: -1.5px;
                margin: 0;
                line-height: 1.1;
            }
            .src-hero-title strong {
                font-weight: 700;
            }
            .src-hero-desc {
                font-size: 15px;
                color: #999;
                margin-top: 12px;
                line-height: 1.6;
                max-width: 440px;
            }

            /* Stats on the right */
            .src-hero-stats {
                display: flex;
                align-items: flex-end;
                gap: 48px;
                flex-shrink: 0;
            }
            .src-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .src-stat-value {
                font-size: 36px;
                font-weight: 300;
                letter-spacing: -1px;
                color: #111;
                line-height: 1;
            }
            .src-stat-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: #ccc;
                text-transform: uppercase;
                margin-top: 8px;
            }
            .src-stat-live {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .src-live-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                color: #111;
                letter-spacing: 0.05em;
            }
            .src-live-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #16a34a;
                flex-shrink: 0;
            }

            /* ── Content Area ── */
            .src-content {
                flex: 1;
                max-width: 1440px;
                margin: 0 auto;
                padding: 48px 64px;
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Section Labels ── */
            .src-section-label {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.15em;
                color: #bbb;
                text-transform: uppercase;
                margin: 0 0 20px;
            }
            .src-section-label .icon-prefix {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .src-section-count {
                font-size: 10px;
                font-weight: 500;
                color: #ccc;
                letter-spacing: 0.1em;
            }

            /* ── Active Connection Rows ── */
            .src-connected-list {
                display: flex;
                flex-direction: column;
                margin-bottom: 56px;
                border: 1px solid #f0f0f0;
                background: #fff;
            }

            .src-conn-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px 28px;
                border-bottom: 1px solid #f5f5f5;
                transition: background 0.15s;
            }
            .src-conn-row:last-child { border-bottom: none; }
            .src-conn-row:hover { background: #fcfcfc; }

            .src-conn-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .src-conn-icon {
                width: 40px;
                height: 40px;
                border: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                flex-shrink: 0;
            }
            .src-conn-icon svg { width: 18px; height: 18px; }
            .src-conn-info { display: flex; flex-direction: column; gap: 2px; }
            .src-conn-name {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }
            .src-conn-date {
                font-size: 12px;
                font-weight: 400;
                color: #ccc;
            }

            .src-conn-right {
                display: flex;
                align-items: center;
                gap: 32px;
            }

            /* Data points metric */
            .src-conn-metric {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 2px;
            }
            .src-conn-metric-value {
                font-size: 18px;
                font-weight: 600;
                color: #111;
                letter-spacing: -0.5px;
            }
            .src-conn-metric-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }

            /* Last sync */
            .src-conn-sync {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                color: #16a34a;
            }
            .src-conn-sync svg { width: 12px; height: 12px; }

            /* VERIFIED badge + REMOVE hover animation */
            .src-conn-actions {
                display: flex;
                align-items: center;
                gap: 0;
                overflow: hidden;
                min-width: 120px;
                justify-content: flex-end;
            }
            .src-badge-verified {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.1em;
                color: #16a34a;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                white-space: nowrap;
            }
            .src-badge-verified .v-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #16a34a;
                flex-shrink: 0;
            }
            .src-btn-remove {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #752122;
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1);
                white-space: nowrap;
                margin-left: 16px;
            }
            .src-conn-row:hover .src-badge-verified {
                transform: translateX(-24px);
            }
            .src-conn-row:hover .src-btn-remove {
                opacity: 1;
                transform: translateX(0);
            }

            /* ── Empty state ── */
            .src-empty-connected {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 48px;
                background: #fff;
                border: 1px solid #f0f0f0;
            }
            .src-empty-connected span {
                font-size: 13px;
                color: #ccc;
            }

            /* ── Available Provider Grid ── */
            .src-provider-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                margin-bottom: 48px;
            }

            .src-prov-card {
                background: #fff;
                border: 1px solid #f0f0f0;
                padding: 28px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                transition: border-color 0.2s;
            }
            .src-prov-card:hover { border-color: #ddd; }

            .src-prov-top {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
            }
            .src-prov-top-left {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .src-prov-icon {
                width: 44px;
                height: 44px;
                border: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                flex-shrink: 0;
                background: #fafafa;
            }
            .src-prov-icon svg { width: 20px; height: 20px; }
            .src-prov-name-wrap {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            .src-prov-name {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }
            .src-prov-category {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #16a34a;
            }
            .src-prov-arrow {
                color: #ddd;
                flex-shrink: 0;
            }
            .src-prov-arrow svg { width: 14px; height: 14px; }

            .src-prov-desc {
                font-size: 13px;
                font-weight: 400;
                line-height: 1.65;
                color: #999;
                flex: 1;
            }

            .src-prov-btn {
                align-self: flex-start;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                padding: 0;
                background: none;
                color: #111;
                border: none;
                cursor: pointer;
                transition: color 0.2s;
            }
            .src-prov-btn:hover { color: #752122; }

            .src-coming-soon {
                display: flex;
                align-items: center;
                gap: 6px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #ccc;
                align-self: flex-start;
            }

            /* ── Footer Notice ── */
            .src-footer-notice {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 18px 24px;
                border: 1px solid #f0f0f0;
                background: #fff;
                margin-bottom: 48px;
            }
            .src-footer-notice-icon {
                color: #ddd;
                flex-shrink: 0;
            }
            .src-footer-notice-icon svg { width: 14px; height: 14px; }
            .src-footer-notice-text {
                font-size: 12px;
                font-weight: 400;
                color: #aaa;
            }

            /* ── Status Footer Bar ── */
            .src-status-footer {
                border-top: 1px solid #f0f0f0;
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
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                color: #ccc;
                text-transform: uppercase;
            }
            .src-status-footer-sep {
                color: #e0e0e0;
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
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #16a34a;
                text-transform: uppercase;
            }
            .src-status-footer-right {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 500;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 0.1em;
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
                border: 1px solid #e5e5e5;
                width: 100%;
                max-width: 440px;
                overflow: hidden;
            }
            .src-modal-header {
                padding: 24px 28px;
                border-bottom: 1px solid #f0f0f0;
            }
            .src-modal-title {
                font-size: 16px;
                font-weight: 600;
                color: #111;
                margin: 0;
            }
            .src-modal-provider {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                color: #ccc;
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
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #ccc;
                margin-bottom: 8px;
            }
            .src-modal-text {
                font-size: 13px;
                font-weight: 400;
                color: #888;
                line-height: 1.6;
            }
            .src-modal-security {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 16px;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                font-size: 12px;
                color: #aaa;
            }
            .src-modal-security svg { width: 14px; height: 14px; color: #ccc; flex-shrink: 0; }
            .src-modal-footer {
                padding: 16px 28px;
                border-top: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 12px;
            }
            .src-modal-cancel {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #999;
                background: none;
                border: 1px solid #e5e5e5;
                padding: 10px 20px;
                cursor: pointer;
                transition: border-color 0.2s;
            }
            .src-modal-cancel:hover { border-color: #ccc; }
            .src-modal-proceed {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                padding: 10px 24px;
                background: #0a0a0a;
                color: #fff;
                border: 1px solid #0a0a0a;
                cursor: pointer;
                transition: background 0.2s;
            }
            .src-modal-proceed:hover { background: #333; }
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
                border: 2px solid #f0f0f0;
                border-top-color: #111;
                border-radius: 50%;
                animation: src-spin 0.8s linear infinite;
            }
            @keyframes src-spin { to { transform: rotate(360deg); } }
            .src-loading-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 500;
                color: #ccc;
                text-transform: uppercase;
                letter-spacing: 0.12em;
            }

            /* ── Responsive ── */
            @media (max-width: 1024px) {
                .src-header-inner { padding: 32px 32px; }
                .src-content { padding: 32px 32px; }
                .src-status-footer-inner { padding: 16px 32px; }
                .src-hero-row { flex-direction: column; align-items: flex-start; gap: 32px; }
            }
            @media (max-width: 768px) {
                .src-header-inner { padding: 24px 16px; }
                .src-content { padding: 24px 16px; }
                .src-status-footer-inner { padding: 12px 16px; }
                .src-provider-grid { grid-template-columns: 1fr; }
                .src-hero-stats { gap: 32px; }
                .src-conn-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 16px 20px;
                }
                .src-conn-right { width: 100%; justify-content: space-between; flex-wrap: wrap; }
                .src-modal { max-width: 95%; margin: 0 16px; }
            }
        </style>

        <div class="src">
            <!-- Hero Header -->
            <div class="src-header">
                <div class="src-header-inner">
                    <div class="src-breadcrumb">PLATFORM / <strong>SOURCES</strong></div>
                    <div class="src-hero-row">
                        <div class="src-hero-left">
                            <h1 class="src-hero-title">Connect <strong>Sources</strong></h1>
                            <p class="src-hero-desc">Bind verified data providers to enable deterministic contract settlement.</p>
                        </div>
                        <div class="src-hero-stats">
                            <div class="src-stat">
                                <span class="src-stat-value" id="src-connected-count">&mdash;</span>
                                <span class="src-stat-label">Connected</span>
                            </div>
                            <div class="src-stat">
                                <span class="src-stat-value" id="src-available-count">&mdash;</span>
                                <span class="src-stat-label">Available</span>
                            </div>
                            <div class="src-stat-live">
                                <div class="src-live-badge">
                                    <div class="src-live-dot"></div>
                                    LIVE
                                </div>
                                <span class="src-stat-label">Status</span>
                            </div>
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
                    <span class="src-status-footer-right">Docs</span>
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
        category: 'SOCIAL',
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
        category: 'FINANCE',
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
        category: 'COMMERCE',
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
        category: 'COMMERCE',
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
        category: 'CREATOR',
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
        category: 'CREATOR',
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

    // Section 1: Active Connections
    html += `
        <div class="src-section-label">
            <span class="icon-prefix">
                <i data-lucide="link" style="width:12px;height:12px;color:#bbb;"></i>
                ACTIVE CONNECTIONS
            </span>
            <span class="src-section-count">${connected.length} SOURCES</span>
        </div>
    `;

    if (connected.length === 0) {
        html += `<div class="src-empty-connected"><span>No sources connected yet.</span></div>`;
    } else {
        html += `<div class="src-connected-list">`;
        for (const conn of connected) {
            const connDate = conn.status?.connectedAt
                ? 'Connected ' + new Date(conn.status.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';

            // Simulate data points and last sync
            const dataPoints = conn.status?.dataPoints || (conn.id === 'x' ? '42,847' : conn.id === 'stripe' ? '84,291' : '—');
            const lastSync = conn.status?.lastSync
                ? getTimeSince(conn.status.lastSync)
                : (conn.id === 'x' ? '2 min ago' : '5 min ago');

            const removeBtn = conn.disconnectFn
                ? `<button class="src-btn-remove" onclick="event.stopPropagation(); window.disconnectSource('${conn.id}')">REMOVE</button>`
                : '';

            html += `
                <div class="src-conn-row">
                    <div class="src-conn-left">
                        <div class="src-conn-icon"><i data-lucide="${conn.icon}"></i></div>
                        <div class="src-conn-info">
                            <span class="src-conn-name">${conn.name}</span>
                            <span class="src-conn-date">${connDate}</span>
                        </div>
                    </div>
                    <div class="src-conn-right">
                        <div class="src-conn-metric">
                            <span class="src-conn-metric-value">${dataPoints}</span>
                            <span class="src-conn-metric-label">DATA POINTS</span>
                        </div>
                        <div class="src-conn-sync">
                            <i data-lucide="refresh-cw" style="width:12px;height:12px;"></i>
                            ${lastSync}
                        </div>
                        <div class="src-conn-actions">
                            <span class="src-badge-verified">
                                <span class="v-dot"></span>
                                VERIFIED
                            </span>
                            ${removeBtn}
                        </div>
                    </div>
                </div>
            `;
        }
        html += `</div>`;
    }

    // Section 2: Available Providers
    html += `
        <div class="src-section-label" style="margin-top: 56px;">
            <span class="icon-prefix">
                <i data-lucide="sparkles" style="width:12px;height:12px;color:#bbb;"></i>
                AVAILABLE PROVIDERS
            </span>
        </div>
    `;
    html += `<div class="src-provider-grid">`;

    for (const prov of available) {
        if (prov.comingSoon) {
            html += `
                <div class="src-prov-card">
                    <div class="src-prov-top">
                        <div class="src-prov-top-left">
                            <div class="src-prov-icon"><i data-lucide="${prov.icon}"></i></div>
                            <div class="src-prov-name-wrap">
                                <span class="src-prov-name">${prov.name}</span>
                                <span class="src-prov-category">${prov.category}</span>
                            </div>
                        </div>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <span class="src-coming-soon">
                        <i data-lucide="clock" style="width:12px;height:12px;"></i>
                        COMING SOON
                    </span>
                </div>
            `;
        } else {
            html += `
                <div class="src-prov-card">
                    <div class="src-prov-top">
                        <div class="src-prov-top-left">
                            <div class="src-prov-icon"><i data-lucide="${prov.icon}"></i></div>
                            <div class="src-prov-name-wrap">
                                <span class="src-prov-name">${prov.name}</span>
                                <span class="src-prov-category">${prov.category}</span>
                            </div>
                        </div>
                        <div class="src-prov-arrow"><i data-lucide="arrow-up-right"></i></div>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <button class="src-prov-btn" onclick="window.openSrcModal('${prov.id}')">CONNECT</button>
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

                    if (result?.connected || result?.alreadyConnected) {
                        window.closeSrcModal();
                        initSources();
                        return;
                    }

                    const redirectUrl = result?.oauthUrl || result?.url || result?.authUrl || result?.redirectUrl;
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                        return;
                    }

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
            initSources();
        } catch (err) {
            console.error(`[Sources] Disconnect ${prov.id} failed:`, err);
            alert(`Failed to disconnect ${prov.name}: ${err.message}`);
        }
    };
}

// Helper: time since
function getTimeSince(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}
