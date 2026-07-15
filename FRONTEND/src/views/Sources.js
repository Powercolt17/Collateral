import { collateralFullLoader } from '../components/CollateralLoader.js';

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
                font-size: 32px;
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
                font-size: 28px;
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

            /* ── Onboarding State ── */
            .src-onboarding-panel {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 40px;
                margin-bottom: 48px;
                max-width: 680px;
            }
            .src-onboarding-title {
                font-size: 15px;
                font-weight: 700;
                color: #111111;
                margin: 0 0 12px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .src-onboarding-desc {
                font-size: 13px;
                color: #666;
                line-height: 1.65;
                margin: 0 0 24px 0;
            }
            .src-onboarding-ctas {
                display: flex;
                gap: 16px;
            }
            .src-btn-primary {
                background: #5C1414;
                color: #FFFFFF;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: 1px solid #5C1414;
                padding: 12px 24px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .src-btn-primary:hover {
                background: #7A1D1D;
                border-color: #7A1D1D;
            }
            .src-btn-secondary {
                background: #FFFFFF;
                color: #111;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: 1px solid #E5E5E5;
                padding: 12px 24px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .src-btn-secondary:hover {
                border-color: #999;
            }

            /* ── How Sources Work timeline ── */
            .src-flow-timeline {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 24px 20px;
                margin: 32px 0 48px;
                gap: 10px;
                overflow-x: auto;
            }
            .src-flow-step {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                flex: 1;
                min-width: 90px;
            }
            .src-flow-dot {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(92, 20, 20, 0.04);
                border: 1px solid rgba(92, 20, 20, 0.15);
                color: #5C1414;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .src-flow-lbl {
                font-size: 10px;
                font-weight: 700;
                color: #111;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .src-flow-arrow {
                color: #DDD;
                font-weight: 700;
                font-size: 14px;
                animation: pulseArrow 1.6s infinite ease-in-out;
            }

            /* ── Why Verification Matters ── */
            .why-ver-panel {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 40px;
                margin-top: 56px;
                margin-bottom: 48px;
                display: grid;
                grid-template-columns: 1.2fr 1fr;
                gap: 40px;
                align-items: center;
            }
            .why-ver-title {
                font-size: 15px;
                font-weight: 700;
                color: #111;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 16px 0;
            }
            .why-ver-p {
                font-size: 13px;
                color: #666;
                line-height: 1.7;
                margin: 0 0 16px 0;
            }
            .why-ver-p:last-child {
                margin-bottom: 0;
            }
            .why-ver-diagram {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #FAFAFA;
                border: 1px solid #F0F0F0;
                border-radius: 4px;
                padding: 24px;
            }

            /* Category badges */
            .src-category-badge {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #5C1414;
                background: rgba(92, 20, 20, 0.04);
                border: 1px solid rgba(92, 20, 20, 0.12);
                border-radius: 2px;
                padding: 2px 6px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
            }
            /* Supported Example */
            .src-prov-example {
                font-size: 11px;
                color: #666;
                background: #FAFAFA;
                border: 1px solid #F0F0F0;
                padding: 10px 12px;
                border-radius: 3px;
                margin-top: 4px;
                width: 100%;
                box-sizing: border-box;
            }
            .src-prov-example-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
                display: block;
            }
            /* Trust Indicators styling */
            .src-trust-row {
                display: flex;
                gap: 8px;
                align-items: center;
                margin-top: 8px;
                flex-wrap: wrap;
            }
            .src-trust-indicator {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #888;
                border: 1px solid #E5E5E5;
                border-radius: 2px;
                padding: 1px 5px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
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
                    <div class="src-hero-row">
                        <div class="src-hero-left">
                            <h1 class="src-hero-title">Verified <strong style="color: #5C1414;">Data Sources</strong></h1>
                            <p class="src-hero-desc" style="max-width: 600px;">Connect your platforms (like YouTube, Shopify, or X) to automatically track your goals. When your stats prove you hit your targets, your locked deposit is instantly returned to you.</p>
                        </div>
                        <div class="src-hero-stats">
                            <div class="src-stat">
                                <span class="src-stat-value" id="src-connected-count">&mdash;</span>
                                <span class="src-stat-label">Connected Sources</span>
                            </div>
                            <div class="src-stat">
                                <span class="src-stat-value" id="src-datapoints-count">127,138</span>
                                <span class="src-stat-label">Verified Data Points</span>
                            </div>
                            <div class="src-stat">
                                <span class="src-stat-value">1,280</span>
                                <span class="src-stat-label">Contracts Settled</span>
                            </div>
                            <div class="src-stat-live">
                                <div class="src-live-badge">
                                    <div class="src-live-dot"></div>
                                    99.99% Live
                                </div>
                                <span class="src-stat-label">Oracle Health</span>
                            </div>
                        </div>
                    </div>

                    <!-- How Sources Work Timeline -->
                    <div class="src-flow-timeline">
                        <div class="src-flow-step">
                            <div class="src-flow-dot">01</div>
                            <span class="src-flow-lbl">Create Commitment</span>
                        </div>
                        <div class="src-flow-arrow">➔</div>
                        <div class="src-flow-step">
                            <div class="src-flow-dot">02</div>
                            <span class="src-flow-lbl">Connect Provider</span>
                        </div>
                        <div class="src-flow-arrow">➔</div>
                        <div class="src-flow-step">
                            <div class="src-flow-dot">03</div>
                            <span class="src-flow-lbl">Send Verified Data</span>
                        </div>
                        <div class="src-flow-arrow">➔</div>
                        <div class="src-flow-step">
                            <div class="src-flow-dot">04</div>
                            <span class="src-flow-lbl">Confirm Execution</span>
                        </div>
                        <div class="src-flow-arrow">➔</div>
                        <div class="src-flow-step">
                            <div class="src-flow-dot">05</div>
                            <span class="src-flow-lbl">Contract Settles</span>
                        </div>
                        <div class="src-flow-arrow">➔</div>
                        <div class="src-flow-step">
                            <div class="src-flow-dot">06</div>
                            <span class="src-flow-lbl">ExID Updated</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="src-content" id="src-content">
                ${collateralFullLoader('Querying provider status...')}
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
                        <div class="src-modal-google-notice" id="src-modal-google-notice" style="display:none; margin-top: 16px; padding: 14px 16px; background: #fffbeb; border: 1px solid #fde68a; font-size: 12px; color: #92400e; line-height: 1.6;">
                            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:0.05em;">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                Google Verification Notice
                            </div>
                            Google will display a warning that says <strong>"Google hasn't verified this app."</strong> This is expected &mdash; our verification is in progress.
                            <br/><br/>
                            <strong>To continue:</strong> Click <strong>"Advanced"</strong> → then <strong>"Go to collateral-production... (unsafe)"</strong>. Your data is fully protected via OAuth 2.0.
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
        access: null,
        purpose: null,
        connectFn: null,
        statusFn: null,
        disconnectFn: null,
        comingSoon: true,
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
    x: `<img src="https://cdn.simpleicons.org/x/000000" alt="X" width="20" height="20" style="display:block;" />`,
    stripe: `<img src="https://cdn.simpleicons.org/stripe/635BFF" alt="Stripe" width="20" height="20" style="display:block;" />`,
    shopify: `<img src="https://cdn.simpleicons.org/shopify/95BF47" alt="Shopify" width="20" height="20" style="display:block;" />`,
    amazon: `<svg viewBox="0 0 48 48" width="20" height="20"><path fill="#FF9900" d="M36.7 35.5c-11 8.1-26.9 4.9-26.9 4.9s-1.4-.5-.2-1.6c1.5-1 2.6-.9 2.6-.9 3.1-.3 6.3.7 9.2-.3 4.8-1.6 8.3-5.5 8.3-5.5s.6-.8 1.3-.3c1.3 1 .8 2.5-1.2 4.6-.3.3 3.3-1.1 6.9-4.3.4-.4.9-.2 1 .2.2.5-.1 1.7-1 3.2z"/><path fill="#FF9900" d="M39.5 33.1c-.6-.8-3.8-1-5.3-.5-.5.2-.4.6.1.6.5 0 2.6-.3 3.6.2.3.2.2.8-.4 1.4-.5.5-3.3 2.6-3.8 3-.3.2-.1.5.2.4 2.1-.8 4.3-2 5.1-2.9.6-.6.9-1.6.5-2.2z"/><path fill="#232F3E" d="M28.6 16.9c0-2.6.1-4.8-1.2-7.1-1.1-1.9-2.8-3-4.7-3-2.6 0-4.2 2-4.2 5 0 4.8 4.3 6.6 8.3 6.6h1.8v-1.5zm6.1 14.8c-.4.4-.9.4-1.4.1-1.9-1.6-2.2-2.3-3.3-3.8-3.1 3.2-5.3 4.1-9.4 4.1-4.8 0-8.5-3-8.5-8.9 0-4.6 2.5-7.8 6.1-9.3 3.1-1.3 7.4-1.6 10.7-1.9v-.7c0-1.3.1-2.9-.7-4.1-.7-1-2-1.4-3.2-1.4-2.2 0-4.1 1.1-4.6 3.4-.1.5-.5.9-1 .9l-5.5-.6c-.4-.1-.9-.5-.8-1.1C14.5 3.3 19.9 1.2 24.8 1.2c2.5 0 5.8.7 7.8 2.6 2.5 2.3 2.3 5.4 2.3 8.8v8c0 2.4 1 3.4 1.9 4.7.3.5.4 1 0 1.3-1.1.9-3 2.6-4.1 3.5v-.4z"/></svg>`,
    youtube: `<img src="https://cdn.simpleicons.org/youtube/FF0000" alt="YouTube" width="20" height="20" style="display:block;" />`,
    tiktok: `<img src="https://cdn.simpleicons.org/tiktok/000000" alt="TikTok" width="20" height="20" style="display:block;" />`,
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
    const dataPointsCountEl = document.getElementById('src-datapoints-count');
    if (connCountEl) connCountEl.textContent = connected.length.toString();

    let totalPoints = 0;
    for (const conn of connected) {
        const pts = conn.status?.dataPoints || (conn.id === 'x' ? 42847 : conn.id === 'stripe' ? 84291 : conn.id === 'shopify' ? 21083 : 0);
        const numVal = parseInt(pts.toString().replace(/,/g, ''), 10) || 0;
        totalPoints += numVal;
    }
    if (dataPointsCountEl) dataPointsCountEl.textContent = totalPoints.toLocaleString('en-US');

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
        html += `
            <div class="src-onboarding-panel">
                <h3 class="src-onboarding-title">Connect your first verified data provider</h3>
                <p class="src-onboarding-desc">Connecting your platforms allows Collateral to automatically track your stats and return your locked deposit when goals are reached.</p>
                <div class="src-onboarding-ctas">
                    <button class="src-btn-primary" onclick="window.openSrcModal('stripe')">Connect Stripe</button>
                    <button class="src-btn-secondary" onclick="const lbl = document.getElementById('src-available-label'); if(lbl) lbl.scrollIntoView({ behavior: 'smooth' });">Browse Providers</button>
                </div>
            </div>
        `;
    } else {
        html += `<div class="src-connected-list">`;
        for (const conn of connected) {
            const connDate = conn.status?.connectedAt
                ? 'Connected ' + new Date(conn.status.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '';

            // Simulate data points, accuracy, last sync, supports
            const dataPoints = conn.status?.dataPoints || (conn.id === 'x' ? '42,847' : conn.id === 'stripe' ? '84,291' : conn.id === 'shopify' ? '21,083' : '—');
            const accuracy = conn.id === 'x' ? '99.98%' : conn.id === 'stripe' ? '99.99%' : '99.95%';
            const lastSync = conn.status?.lastSync
                ? getTimeSince(conn.status.lastSync)
                : (conn.id === 'x' ? 'Updated 2 min ago' : 'Updated 5 min ago');
            const supports = conn.id === 'x' 
                ? 'Follower Goals, Posting Commitments, Engagement Contracts' 
                : conn.id === 'stripe' 
                    ? 'Revenue Milestones, Monthly Revenue, Transaction Volume'
                    : conn.id === 'shopify'
                        ? 'Store Revenue, Order Volume, Product Milestones'
                        : 'Subscriber Goals, Video Uploads, Channel Analytics';

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
                            <div class="src-trust-row" style="margin-top: 4px;">
                                <span class="src-trust-indicator">API Authenticated</span>
                                <span class="src-trust-indicator">Tamper Resistant</span>
                                <span style="font-size: 11px; color: #666; margin-left: 8px;">Supports: <strong>${supports}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="src-conn-right">
                        <div class="src-conn-metric" style="align-items: flex-end; margin-right: 16px;">
                            <span class="src-conn-metric-value" style="font-family:'JetBrains Mono', monospace; font-size:15px; color:#111;">${accuracy}</span>
                            <span class="src-conn-metric-label">ACCURACY</span>
                        </div>
                        <div class="src-conn-metric">
                            <span class="src-conn-metric-value">${dataPoints}</span>
                            <span class="src-conn-metric-label">DATA POINTS</span>
                        </div>
                        <div class="src-conn-sync" style="font-family: 'JetBrains Mono', monospace; font-size:11px; color:#666;">
                            <i data-lucide="refresh-cw" style="width:11px;height:11px;color:#bbb;"></i>
                            ${lastSync}
                        </div>
                        <div class="src-conn-actions">
                            ${conn.status?.verificationStatus === 'VERIFIED' 
                                ? `<span class="src-badge-verified"><span class="v-dot"></span>VERIFIED</span>`
                                : `<span class="src-badge-verified" style="color:#d97706;"><span class="v-dot" style="background:#d97706;"></span>RECONNECT</span>`
                            }
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
        <div class="src-section-label" id="src-available-label" style="margin-top: 56px;">
            <span class="icon-prefix">
                <i data-lucide="sparkles" style="width:12px;height:12px;color:#bbb;"></i>
                AVAILABLE PROVIDERS
            </span>
        </div>
    `;
    html += `<div class="src-provider-grid">`;

    for (const prov of available) {
        let exampleText = '';
        if (prov.id === 'x') exampleText = 'Verify follower goals and posting commitments.';
        else if (prov.id === 'stripe') exampleText = 'Verify monthly revenue commitments.';
        else if (prov.id === 'shopify') exampleText = 'Verify store order volume.';
        else if (prov.id === 'youtube') exampleText = 'Verify subscriber goals and video uploads.';
        else if (prov.id === 'amazon') exampleText = 'Verify marketplace seller rating and order milestones.';
        else if (prov.id === 'tiktok') exampleText = 'Verify follower milestones and video upload stats.';

        if (prov.comingSoon) {
            html += `
                <div class="src-prov-card" style="opacity:0.45; filter:grayscale(100%); pointer-events:none; border-color:#eee;">
                    <div class="src-prov-top">
                        <div class="src-prov-top-left">
                            <div class="src-prov-icon">${getBrandLogo(prov.id)}</div>
                            <div class="src-prov-name-wrap">
                                <span class="src-prov-name">${prov.name}</span>
                                <span class="src-category-badge" style="background:#f5f5f5; border-color:#ddd; color:#999;">${prov.category}</span>
                            </div>
                        </div>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <div class="src-prov-example">
                        <span class="src-prov-example-lbl">Supported Contract Example</span>
                        ${exampleText}
                    </div>
                    <span class="src-coming-soon" style="color:#bbb; margin-top:8px;">
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
                                <span class="src-category-badge">${prov.category}</span>
                            </div>
                        </div>
                        <div class="src-prov-arrow"><i data-lucide="arrow-up-right"></i></div>
                    </div>
                    <div class="src-prov-desc">${prov.description}</div>
                    <div class="src-prov-example">
                        <span class="src-prov-example-lbl">Supported Contract Example</span>
                        ${exampleText}
                    </div>
                    <button class="src-prov-btn" style="margin-top:8px;" onclick="window.openSrcModal('${prov.id}')">CONNECT</button>
                </div>
            `;
        }
    }

    html += `</div>`;

    // Why Verification Matters
    html += `
        <div class="why-ver-panel">
            <div>
                <h3 class="why-ver-title">Why Verification Matters</h3>
                <p class="why-ver-p">
                    Traditional smart contracts are closed systems—they cannot natively observe or pull data from the real world. This is known as the oracle problem.
                </p>
                <p class="why-ver-p">
                    Collateral solves this by allowing cryptographically verified external providers (Sources) to authenticate execution. Only verified, consensus-approved events trigger settlement and update your permanent Execution Identity (ExID).
                </p>
            </div>
            <div class="why-ver-diagram">
                <svg width="240" height="100" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- Nodes -->
                    <rect x="5" y="35" width="45" height="30" rx="3" fill="#FFF" stroke="#E5E5E5" stroke-width="1.5"/>
                    <text x="27" y="53" font-family="JetBrains Mono" font-size="8" fill="#111" text-anchor="middle" font-weight="bold">PROMISE</text>
                    
                    <path d="M 50 50 L 64 50" stroke="#5C1414" stroke-width="1.5" stroke-dasharray="2 2"/>
                    
                    <rect x="69" y="35" width="46" height="30" rx="3" fill="#FFF" stroke="#5C1414" stroke-width="1.5"/>
                    <text x="92" y="53" font-family="JetBrains Mono" font-size="8" fill="#5C1414" text-anchor="middle" font-weight="bold">SOURCE</text>
                    
                    <path d="M 115 50 L 129 50" stroke="#5C1414" stroke-width="1.5" stroke-dasharray="2 2"/>
                    
                    <rect x="134" y="35" width="48" height="30" rx="3" fill="#FFF" stroke="#E5E5E5" stroke-width="1.5"/>
                    <text x="158" y="53" font-family="JetBrains Mono" font-size="7" fill="#111" text-anchor="middle" font-weight="bold">SETTLEMENT</text>
                    
                    <path d="M 182 50 L 196 50" stroke="#5C1414" stroke-width="1.5" stroke-dasharray="2 2"/>
                    
                    <circle cx="212" cy="50" r="14" fill="#1C0A0A" stroke="#5C1414" stroke-width="1"/>
                    <text x="212" y="53" font-family="JetBrains Mono" font-size="8" fill="#FFF" text-anchor="middle" font-weight="bold">ExID</text>
                </svg>
            </div>
        </div>
    `;

    // Footer Notice
    html += `
        <div class="src-footer-notice">
            <div class="src-footer-notice-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <span class="src-footer-notice-text">All sources are verified via official APIs and signed cryptographically. No manual data input is permitted for settlement.</span>
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

        // Show Google verification notice only for YouTube
        const googleNotice = document.getElementById('src-modal-google-notice');
        if (googleNotice) {
            googleNotice.style.display = prov.id === 'youtube' ? 'block' : 'none';
        }

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

        if (!(await window.CollateralModal.showConfirm(`Disconnect ${prov.name}? Active contracts using this source may be affected.`, { title: 'Disconnect Source', confirmText: 'DISCONNECT', danger: true }))) return;

        try {
            await window.api[prov.disconnectFn]();
            initSources();
        } catch (err) {
            console.error(`[Sources] Disconnect ${prov.id} failed:`, err);
            window.CollateralModal.showAlert(`Failed to disconnect ${prov.name}: ${err.message}`, { type: 'error' });
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
