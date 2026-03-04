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

            /* ── Shopify Domain Input Step ── */
            .src-shopify-step {
                padding: 28px;
            }
            .src-shopify-step-title {
                font-size: 14px;
                font-weight: 600;
                color: #111;
                margin-bottom: 4px;
            }
            .src-shopify-step-sub {
                font-size: 12px;
                color: #999;
                margin-bottom: 20px;
                line-height: 1.5;
            }
            .src-shopify-input-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #aaa;
                margin-bottom: 8px;
                display: block;
            }
            .src-shopify-input-wrap {
                display: flex;
                align-items: center;
                border: 1px solid #e0e0e0;
                background: #fafafa;
                transition: border-color 0.2s;
            }
            .src-shopify-input-wrap:focus-within {
                border-color: #752122;
                background: #fff;
            }
            .src-shopify-input-wrap.error {
                border-color: #dc2626;
            }
            .src-shopify-input {
                flex: 1;
                padding: 12px 14px;
                font-size: 14px;
                font-family: 'JetBrains Mono', monospace;
                color: #111;
                border: none;
                background: transparent;
                outline: none;
                letter-spacing: -0.01em;
            }
            .src-shopify-input::placeholder {
                color: #ccc;
            }
            .src-shopify-suffix {
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                color: #999;
                padding-right: 14px;
                white-space: nowrap;
                user-select: none;
            }
            .src-shopify-error {
                font-size: 12px;
                color: #dc2626;
                margin-top: 8px;
                min-height: 18px;
            }
            .src-shopify-hint {
                font-size: 11px;
                color: #bbb;
                margin-top: 10px;
                line-height: 1.5;
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
            <div class="src-header" data-reveal>
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
            <div class="src-status-footer" data-reveal>
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
        access: 'Channel statistics, subscriber count, video count, and 30-day view analytics via YouTube Data API.',
        purpose: 'Deterministic verification of YouTube channel growth milestones tied to active contracts.',
        connectFn: 'startYouTubeConnect',
        statusFn: 'getYouTubeStatus',
        disconnectFn: 'disconnectYouTube',
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
// BRAND LOGOS (inline SVGs)
// ============================================================================

const BRAND_LOGOS = {
    x: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    stripe: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>`,
    shopify: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.035-.03-.066-.042-.102-.063l-.598 18.514.688.579zm-2.081-18.979c-.042 0-.105.021-.168.042-.084.022-.189.063-.315.127-.252.12-.525.315-.756.588-.42.495-.735 1.222-.84 2.163h-1.806c0-.063.021-.242.042-.378.252-1.806 1.281-3.696 3.843-3.696v1.154zm-1.512 1.365c-.609.042-1.281.084-2.016.126.378-1.155.966-1.764 1.596-2.016.168.504.315 1.134.42 1.89zm.756-1.785c.546.084.756 1.134.819 1.806-.609.042-1.26.063-1.953.105.168-.756.504-1.491 1.134-1.911zM20.4 6.323c-.042-.042-.084-.063-.147-.063-.042 0-.924-.063-.924-.063s-.756-.756-1.071-.756h-.105l-.598 18.514 7.216-1.561-2.604-17.73c-.021-.116-.114-.192-.211-.192-.063 0-.798-.042-1.386-.084-.021-.147-.084-.462-.168-.756v-.105c0-.042-.021-.063-.021-.105-.252-1.302-.756-2.436-1.617-2.436h-.084c-.483-.546-.966-.735-1.386-.735-3.402 0-5.04 4.254-5.544 6.412-1.344.42-2.289.714-2.415.756-.735.231-.756.252-.84.945C4.536 8.73 2.4 25.2 2.4 25.2l13.314 2.52.588-19.179c-.063 0-.147.021-.189.063-.084.021-.42.147-.42.147s.063-.441.084-.735c0-.084.021-.189.021-.294v-.147c-.273.084-.693.189-1.197.378-.084-.819-.252-1.827-.609-2.499.798.189 1.197 1.512 1.344 2.079.042.126.063.21.084.252l.483-.147c.021-.399.063-.798.126-1.134.252-1.806 1.239-3.591 3.402-3.696 0 0-.021.126-.021.294-.021.294.021.735.021.735z"/></svg>`,
    amazon: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.126.12.19.065.38-.174.57-.24.186-.639.46-1.195.82-1.32.855-2.895 1.55-4.725 2.088a17.42 17.42 0 0 1-5.048.75c-2.37 0-4.67-.44-6.9-1.325C1.88 21.44.64 20.44.045 18.82v-.8zm6.197-2.58c-.24.345-.24.69 0 1.035l.35.363c.117.127.234.235.35.325.117.09.293.196.527.316.234.12.47.21.703.28l1.176.28c.654.127 1.135.19 1.44.19.653 0 1.27-.14 1.846-.42l.156-.09c.293-.186.44-.452.44-.8v-.16c0-.41-.174-.766-.527-1.066-.59-.483-1.47-.865-2.642-1.143l-1.23-.28c-.257-.058-.508-.14-.752-.248-.352-.155-.53-.35-.53-.585 0-.37.268-.616.8-.738h.088c.307 0 .705.078 1.195.234l1.055.234c.293.08.47.115.527.115.217 0 .37-.11.457-.323l.088-.275c.058-.195.017-.37-.127-.527-.144-.156-.36-.273-.643-.35l-.914-.214c-.58-.127-1.166-.19-1.757-.19-.945 0-1.68.19-2.204.57-.523.38-.785.87-.785 1.472v.166c0 .517.257.98.773 1.387.282.222.648.403 1.098.545.45.14.895.257 1.338.35l1.143.276c.297.077.52.186.668.322.148.138.222.296.222.474 0 .38-.268.635-.804.765h-.044c-.417 0-.938-.104-1.563-.31l-1.317-.304c-.293-.08-.47-.116-.527-.116-.197 0-.338.1-.42.298l-.087.22zm7.88 0c-.24.345-.24.69 0 1.035l.35.363c.117.127.234.235.35.325.117.09.293.196.527.316.234.12.47.21.703.28l1.176.28c.654.127 1.135.19 1.44.19.653 0 1.27-.14 1.846-.42l.154-.09c.295-.186.44-.452.44-.8v-.16c0-.36-.134-.68-.398-.96l-.127-.107c-.59-.483-1.47-.865-2.642-1.143l-1.23-.28c-.257-.058-.508-.14-.752-.248-.352-.155-.53-.35-.53-.585 0-.37.268-.616.8-.738h.088c.307 0 .705.078 1.195.234l1.055.234c.293.08.47.115.527.115.217 0 .37-.11.457-.323l.088-.275c.058-.195.017-.37-.127-.527-.144-.156-.36-.273-.643-.35l-.914-.214c-.58-.127-1.166-.19-1.757-.19-.945 0-1.68.19-2.204.57-.523.38-.785.87-.785 1.472v.166c0 .517.257.98.773 1.387.282.222.648.403 1.098.545.45.14.895.257 1.338.35l1.143.276c.297.077.52.186.668.322.148.138.222.296.222.474 0 .38-.268.635-.804.765h-.044c-.417 0-.938-.104-1.563-.31l-1.317-.304c-.293-.08-.47-.116-.527-.116-.197 0-.338.1-.42.298l-.087.22z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
};

function getBrandLogo(providerId) {
    return BRAND_LOGOS[providerId] || `<i data-lucide="circle" style="width:20px;height:20px;"></i>`;
}

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
                        <div class="src-conn-icon">${getBrandLogo(conn.id)}</div>
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
                <div class="src-prov-card" style="opacity:0.45; filter:grayscale(100%); pointer-events:none; border-color:#eee;">
                    <div class="src-prov-top">
                        <div class="src-prov-top-left">
                            <div class="src-prov-icon">${getBrandLogo(prov.id)}</div>
                            <div class="src-prov-name-wrap">
                                <span class="src-prov-name">${prov.name}</span>
                                <span class="src-prov-category">${prov.category}</span>
                            </div>
                        </div>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <span class="src-coming-soon" style="color:#bbb;">
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
                            <div class="src-prov-icon">${getBrandLogo(prov.id)}</div>
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
                        // Show custom Shopify domain input step
                        proceedBtn.textContent = 'PROCEED';
                        proceedBtn.disabled = false;
                        showShopifyDomainStep(modal, proceedBtn);
                        return;
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

// ── Custom Shopify Domain Input Step ──
function showShopifyDomainStep(modalOverlay, originalProceedBtn) {
    const modal = modalOverlay.querySelector('.src-modal');
    if (!modal) return;

    // Replace body + footer with custom Shopify input step
    const body = modal.querySelector('.src-modal-body');
    const footer = modal.querySelector('.src-modal-footer');

    if (body) {
        body.innerHTML = `
            <div class="src-shopify-step" style="padding: 0;">
                <div class="src-shopify-step-title">Enter your Shopify store domain</div>
                <div class="src-shopify-step-sub">
                    We'll redirect you to Shopify to authorize read-only access to your store data for contract verification.
                </div>
                <label class="src-shopify-input-label">Store Domain</label>
                <div class="src-shopify-input-wrap" id="shopify-input-wrap">
                    <input type="text"
                        class="src-shopify-input"
                        id="shopify-domain-input"
                        placeholder="your-store"
                        autocomplete="off"
                        spellcheck="false" />
                    <span class="src-shopify-suffix">.myshopify.com</span>
                </div>
                <div class="src-shopify-error" id="shopify-domain-error"></div>
                <div class="src-shopify-hint">
                    You can find this in your Shopify admin URL: <strong>your-store</strong>.myshopify.com
                </div>
            </div>
        `;
    }

    if (footer) {
        footer.innerHTML = `
            <button class="src-modal-cancel" id="shopify-cancel-btn">CANCEL</button>
            <button class="src-modal-proceed" id="shopify-connect-btn">CONNECT STORE →</button>
        `;
    }

    const input = document.getElementById('shopify-domain-input');
    const inputWrap = document.getElementById('shopify-input-wrap');
    const errorEl = document.getElementById('shopify-domain-error');
    const connectBtn = document.getElementById('shopify-connect-btn');
    const cancelBtn = document.getElementById('shopify-cancel-btn');

    // Focus input
    setTimeout(() => { if (input) input.focus(); }, 100);

    // Cancel
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            if (window.closeSrcModal) window.closeSrcModal();
        };
    }

    // Validate on input
    if (input) {
        input.addEventListener('input', () => {
            if (inputWrap) inputWrap.classList.remove('error');
            if (errorEl) errorEl.textContent = '';
        });

        // Enter key submits
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (connectBtn) connectBtn.click();
            }
        });
    }

    // Connect
    if (connectBtn) {
        connectBtn.onclick = async () => {
            const rawVal = (input?.value || '').trim();

            // Strip protocol and trailing slashes
            let shop = rawVal.replace(/^https?:\/\//, '').replace(/\/+$/, '');

            // If they typed the full domain, strip .myshopify.com
            if (shop.endsWith('.myshopify.com')) {
                shop = shop.replace('.myshopify.com', '');
            }

            // Validate
            if (!shop) {
                if (inputWrap) inputWrap.classList.add('error');
                if (errorEl) errorEl.textContent = 'Please enter your store name.';
                return;
            }

            if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(shop)) {
                if (inputWrap) inputWrap.classList.add('error');
                if (errorEl) errorEl.textContent = 'Invalid store name. Use letters, numbers, and hyphens only.';
                return;
            }

            const fullDomain = shop + '.myshopify.com';

            // Send
            connectBtn.disabled = true;
            connectBtn.textContent = 'CONNECTING...';
            if (errorEl) errorEl.textContent = '';

            try {
                const result = await window.api.startShopifyConnect(fullDomain);
                console.log('[Sources] Shopify connect result:', JSON.stringify(result));

                if (result?.connected || result?.alreadyConnected) {
                    if (window.closeSrcModal) window.closeSrcModal();
                    initSources();
                    return;
                }

                const redirectUrl = result?.oauthUrl || result?.url || result?.authUrl || result?.redirectUrl;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                    return;
                }

                if (errorEl) errorEl.textContent = 'No redirect URL returned. Please try again.';
                connectBtn.disabled = false;
                connectBtn.textContent = 'CONNECT STORE →';
            } catch (err) {
                console.error('[Sources] Shopify connect failed:', err);
                if (errorEl) errorEl.textContent = err?.message || 'Connection failed. Please try again.';
                connectBtn.disabled = false;
                connectBtn.textContent = 'CONNECT STORE →';
            }
        };
    }
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
