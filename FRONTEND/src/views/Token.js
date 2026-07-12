// Token view — CLTR Institutional Control Portal
// Designed with 10/10 Web3 design systems (Stripe, Hyperliquid, Coinbase Institutional)
// Retains clean layout, off-white background, and collateral red theme with zero clutter.

export function renderToken() {
    return `
        <style>
            /* ===================================================
               CLTR INSTITUTIONAL CONTROL PORTAL
               Zero softness. Premium typography. breathing room.
               =================================================== */

            @keyframes panelReveal {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .cltr-page {
                background: #FAFAFA;
                min-height: 100vh;
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #111111;
                padding-bottom: 120px;
            }

            .cltr-container {
                max-width: 1240px;
                margin: 0 auto;
                padding: 128px 32px 0;
            }

            /* --- TOP BRAND HEADER --- */
            .cltr-header-group {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #E5E5E5;
                padding-bottom: 24px;
                margin-bottom: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .cltr-header-left {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .cltr-logo-svg {
                width: 40px;
                height: 40px;
                color: #5C1414;
                fill: currentColor;
            }
            .cltr-title-text {
                font-size: 18px;
                font-weight: 800;
                letter-spacing: -0.5px;
                color: #111;
                margin: 0;
                text-transform: uppercase;
            }
            .cltr-title-desc {
                font-size: 10px;
                color: #666;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-top: 4px;
            }

            /* --- MOCK WEB3 WALLET BAR --- */
            .cltr-wallet-banner {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 18px 24px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
            }
            .cltr-wallet-status {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cltr-status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #D82224;
            }
            .cltr-status-indicator.connected {
                background: #10B981;
                animation: pulseIndicator 2.5s infinite;
            }
            @keyframes pulseIndicator {
                0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                50% { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
            }
            .cltr-status-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cltr-wallet-hash {
                color: #888;
                font-weight: 500;
                margin-left: 8px;
                font-size: 11px;
                background: #F5F5F5;
                padding: 2px 6px;
                border-radius: 2px;
            }
            .cltr-connect-btn {
                background: #111111;
                color: #FFFFFF;
                border: none;
                padding: 10px 18px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                cursor: pointer;
                border-radius: 3px;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cltr-connect-btn:hover {
                background: #5C1414;
            }
            .cltr-connect-btn.connected {
                background: transparent;
                border: 1px solid #E5E5E5;
                color: #555;
            }
            .cltr-connect-btn.connected:hover {
                border-color: #D82224;
                color: #D82224;
                background: rgba(216, 34, 36, 0.02);
            }

            /* ===================================================
               DOMINANT FOCAL POINT (FOCAL GRID)
               =================================================== */
            .cltr-focal-hero {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 40px;
                margin-bottom: 32px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 40px;
                position: relative;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
            }
            .cltr-focal-hero::before {
                content: '';
                position: absolute;
                left: 0; top: 0; bottom: 0;
                width: 4px;
                background: #5C1414;
            }
            .cltr-focal-left {
                flex: 1;
            }
            .cltr-focal-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #5C1414;
                margin-bottom: 12px;
            }
            .cltr-focal-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 48px;
                font-weight: 800;
                letter-spacing: -2px;
                color: #111111;
                line-height: 1;
            }
            .cltr-focal-sub {
                font-size: 12px;
                color: #666;
                margin-top: 10px;
            }
            .cltr-focal-right {
                display: flex;
                gap: 48px;
            }
            .cltr-focal-mini-card {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-focal-mini-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
            }
            .cltr-focal-mini-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 20px;
                font-weight: 700;
                color: #111;
            }

            /* ===================================================
               METRICS & STATS GRID
               =================================================== */
            .cltr-metrics-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
            }
            .cltr-metric-card {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 24px;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            .cltr-metric-card:hover {
                border-color: rgba(92, 20, 20, 0.2);
            }
            .cltr-metric-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                margin-bottom: 8px;
                display: block;
            }
            .cltr-metric-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 20px;
                font-weight: 700;
                color: #111;
                line-height: 1;
            }
            .cltr-metric-sub {
                font-size: 10px;
                color: #666;
                margin-top: 6px;
                display: block;
            }

            /* --- TWO COLUMN MAIN LAYOUT --- */
            .cltr-main-grid {
                display: grid;
                grid-template-columns: 1.3fr 1fr;
                gap: 32px;
                animation: panelReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
            }

            /* ===================================================
               PANEL & CARD SYSTEM
               =================================================== */
            .cltr-panel {
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 32px;
                margin-bottom: 32px;
                position: relative;
            }
            .cltr-panel-hdr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
                border-bottom: 1px solid #F0F0F0;
                padding-bottom: 16px;
            }
            .cltr-panel-title {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                color: #111111;
            }
            .cltr-panel-action {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #5C1414;
                text-decoration: none;
                cursor: pointer;
            }

            /* --- STAKING TERMINAL --- */
            .cltr-stake-wrap {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .cltr-field-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-field-lbl-row {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: #888;
            }
            .cltr-max-trigger {
                cursor: pointer;
                color: #5C1414;
                text-decoration: underline;
            }
            .cltr-input-container {
                position: relative;
            }
            .cltr-input-field {
                width: 100%;
                padding: 16px;
                padding-right: 80px;
                border: 1px solid #E5E5E5;
                background: #FCFCFC;
                font-family: 'JetBrains Mono', monospace;
                font-size: 18px;
                font-weight: 700;
                outline: none;
                box-sizing: border-box;
                border-radius: 4px;
                transition: all 0.15s ease;
            }
            .cltr-input-field:focus:not(:disabled) {
                border-color: #5C1414;
                background: #FFFFFF;
                box-shadow: 0 0 0 3px rgba(92, 20, 20, 0.04);
            }
            .cltr-input-token {
                position: absolute;
                right: 18px;
                top: 50%;
                transform: translateY(-50%);
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                color: #888;
            }

            /* Lock Pills Grid */
            .cltr-lock-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
            }
            .cltr-lock-pill {
                border: 1px solid #E5E5E5;
                background: #FFFFFF;
                padding: 14px 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                border-radius: 4px;
                outline: none;
            }
            .cltr-lock-pill:hover:not(:disabled) {
                border-color: #5C1414;
            }
            .cltr-lock-pill.active {
                background: #111111;
                border-color: #111111;
                color: #FFFFFF;
            }
            .cltr-lock-days {
                font-size: 13px;
                font-weight: 700;
                display: block;
                margin-bottom: 2px;
            }
            .cltr-lock-yield {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                opacity: 0.85;
            }

            /* Staking summary */
            .cltr-calc-summary {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 18px 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .cltr-calc-row {
                display: flex;
                justify-content: space-between;
                color: #666;
            }
            .cltr-calc-row strong {
                color: #111;
            }
            .cltr-calc-row.accent strong {
                color: #5C1414;
                font-size: 12px;
            }

            /* Action Button */
            .cltr-action-submit {
                width: 100%;
                padding: 16px;
                background: #5C1414;
                color: #FFFFFF;
                border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 4px;
            }
            .cltr-action-submit:hover:not(:disabled) {
                background: #4A1010;
            }
            .cltr-action-submit:disabled {
                background: #E5E5E5;
                color: #999;
                cursor: not-allowed;
            }

            /* ===================================================
               BURN VISUALIZATION
               =================================================== */
            .cltr-burn-visualizer {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-top: 8px;
            }
            .cltr-chart-container {
                height: 100px;
                border-bottom: 1px solid #E5E5E5;
                position: relative;
                display: flex;
                align-items: flex-end;
            }
            .cltr-chart-svg {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0; left: 0;
            }
            .cltr-chart-grid {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                position: absolute;
                pointer-events: none;
            }
            .cltr-chart-grid-line {
                width: 100%;
                height: 1px;
                background: #F0F0F0;
            }
            .cltr-burn-period-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
            }
            .cltr-burn-period-card {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 12px 14px;
            }
            .cltr-burn-period-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                text-transform: uppercase;
                display: block;
                margin-bottom: 4px;
            }
            .cltr-burn-period-num {
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                font-weight: 700;
                color: #111;
            }

            /* ===================================================
               IDENTITY / REPUTATION LAYER
               =================================================== */
            .cltr-rep-layout {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 20px;
            }
            .cltr-rep-stat {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-rep-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 700;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .cltr-rep-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 16px;
                font-weight: 700;
                color: #111;
            }
            .cltr-rep-score-box {
                background: #111111;
                color: #FFFFFF;
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .cltr-rep-score-left {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .cltr-rep-score-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .cltr-rep-score-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 28px;
                font-weight: 800;
                color: #FFFFFF;
                line-height: 1;
            }
            .cltr-rep-badge-glow {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                padding: 4px 10px;
                background: #5C1414;
                color: #FFFFFF;
                border-radius: 2px;
                text-transform: uppercase;
            }

            /* --- TRUST & VESTING CARDS --- */
            .cltr-trust-card {
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 20px;
                margin-bottom: 16px;
                background: #FFFFFF;
            }
            .cltr-trust-card-hdr {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 12px;
            }
            .cltr-trust-name {
                font-size: 13px;
                font-weight: 700;
                color: #111;
            }
            .cltr-trust-alloc {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                color: #5C1414;
                font-weight: 700;
            }
            .cltr-trust-progress-bg {
                height: 4px;
                background: #F0F0F0;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            .cltr-trust-progress-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
                transition: width 0.3s ease;
            }
            .cltr-trust-meta {
                display: flex;
                justify-content: space-between;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                margin-bottom: 16px;
            }
            .cltr-trust-claim-box {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                padding: 12px 16px;
                border-radius: 4px;
            }
            .cltr-trust-claim-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #888;
                text-transform: uppercase;
                display: block;
            }
            .cltr-trust-claim-val {
                font-family: 'JetBrains Mono', monospace;
                font-size: 13px;
                font-weight: 700;
                color: #5C1414;
            }
            .cltr-trust-claim-btn {
                background: #111111;
                color: #FFFFFF;
                border: none;
                padding: 8px 14px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 700;
                text-transform: uppercase;
                cursor: pointer;
                border-radius: 2px;
                transition: all 0.15s ease;
            }
            .cltr-trust-claim-btn:hover:not(:disabled) {
                background: #5C1414;
            }
            .cltr-trust-claim-btn:disabled {
                background: #E5E5E5;
                color: #999;
                cursor: not-allowed;
            }
            .cltr-contract-addr-row {
                margin-top: 12px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .cltr-contract-addr-row span.addr {
                color: #555;
                cursor: pointer;
                text-decoration: underline;
            }

            /* ===================================================
               LIVE ACTIVITY FEED
               =================================================== */
            .cltr-feed-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .cltr-feed-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 12px;
                color: #333;
                line-height: 1.4;
                border-bottom: 1px solid #F5F5F5;
                padding-bottom: 10px;
                animation: cltrReveal 0.3s ease;
            }
            .cltr-feed-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            .cltr-feed-icon {
                font-size: 12px;
                flex-shrink: 0;
            }
            .cltr-feed-details {
                flex: 1;
            }
            .cltr-feed-text {
                font-weight: 500;
            }
            .cltr-feed-time {
                display: block;
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                color: #888;
                margin-top: 2px;
            }

            /* --- PROTOCOL HEALTH TABLE --- */
            .cltr-health-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .cltr-health-stat {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            /* --- TABLE SYSTEM --- */
            .cltr-table-container {
                overflow-x: auto;
                border: 1px solid #E5E5E5;
                border-radius: 4px;
            }
            .cltr-data-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                text-align: left;
            }
            .cltr-data-table th {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: #888;
                padding: 14px 16px;
                border-bottom: 1px solid #E5E5E5;
                background: #FCFCFC;
            }
            .cltr-data-table td {
                padding: 14px 16px;
                border-bottom: 1px solid #F0F0F0;
                font-family: 'JetBrains Mono', monospace;
            }
            .cltr-data-table tr:last-child td {
                border-bottom: none;
            }
            .cltr-progress-bar-mini {
                width: 80px;
                height: 4px;
                background: #EEE;
                border-radius: 2px;
                overflow: hidden;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
            }
            .cltr-progress-bar-mini-fill {
                height: 100%;
                background: #5C1414;
                width: 0%;
            }

            /* --- MODALS --- */
            .cltr-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(4px);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .cltr-modal-backdrop.open {
                display: flex;
            }
            .cltr-modal-box {
                background: #FFFFFF;
                border-radius: 4px;
                border: 1px solid #E5E5E5;
                padding: 32px;
                width: 100%;
                max-width: 360px;
                text-align: center;
                box-shadow: 0 16px 48px rgba(0,0,0,0.1);
            }

            @media (max-width: 1024px) {
                .cltr-main-grid { grid-template-columns: 1fr; }
                .cltr-metrics-grid { grid-template-columns: repeat(2, 1fr); }
            }
            @media (max-width: 640px) {
                .cltr-metrics-grid { grid-template-columns: 1fr; }
                .cltr-focal-hero { flex-direction: column; align-items: flex-start; padding: 24px; }
                .cltr-focal-right { flex-direction: column; gap: 16px; width: 100%; }
                .cltr-lock-grid { grid-template-columns: repeat(2, 1fr); }
                .cltr-rep-layout { grid-template-columns: 1fr; }
                .cltr-health-grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="cltr-page">
            <div class="cltr-container">

                <!-- Header block -->
                <div class="cltr-header-group">
                    <div class="cltr-header-left">
                        <svg class="cltr-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 44.690,43.190 L 48.940,38.940 L 39.243,29.243 Q 35.000,25.000 30.757,29.243 L 14.243,45.757 Q 10.000,50.000 14.243,54.243 L 30.757,70.757 Q 35.000,75.000 39.243,70.757 L 55.757,54.243 Q 60.000,50.000 55.757,45.757 L 55.310,45.310 L 51.060,49.560 L 51.500,50.000 Q 53.621,52.121 51.500,54.243 L 39.243,66.500 Q 37.121,68.621 35.000,66.500 L 22.743,54.243 Q 20.621,52.121 22.743,50.000 L 35.000,37.743 Q 37.121,35.621 39.243,37.743 Z" />
                            <path d="M 55.310,56.810 L 51.060,61.060 L 60.757,70.757 Q 65.000,75.000 69.243,70.757 L 85.757,54.243 Q 90.000,50.000 85.757,45.757 L 69.243,29.243 Q 65.000,25.000 60.757,29.243 L 44.243,45.757 Q 40.000,50.000 44.243,54.243 L 44.690,54.690 L 48.940,50.440 L 48.500,50.000 Q 46.379,47.879 48.500,45.757 L 60.757,33.500 Q 62.879,31.379 65.000,33.500 L 77.257,45.757 Q 79.379,47.879 77.257,50.000 L 65.000,62.257 Q 62.879,64.379 60.757,62.257 Z" />
                        </svg>
                        <div class="cltr-hdr-title-group">
                            <h1 class="cltr-title-text">CLTR CUSTODY TERMINAL</h1>
                            <p class="cltr-title-desc">REPUTATION &amp; EXECUTION ESCROW PORTAL</p>
                        </div>
                    </div>
                </div>

                <!-- Web3 Connect Banner -->
                <div class="cltr-wallet-banner">
                    <div class="cltr-wallet-status">
                        <div class="cltr-status-indicator" id="w-dot"></div>
                        <div class="cltr-wallet-text">
                            <span id="w-status">DISCONNECTED</span>
                            <span class="cltr-wallet-hash" id="w-addr">—</span>
                        </div>
                    </div>
                    <button class="cltr-connect-btn" id="w-connect-btn">CONNECT WALLET</button>
                </div>

                <!-- ===================================================
                   DOMINANT FOCAL POINT
                   =================================================== -->
                <div class="cltr-focal-hero">
                    <div class="cltr-focal-left">
                        <div class="cltr-focal-lbl">TOTAL CAPITAL COMMITTED</div>
                        <div class="cltr-focal-num" id="focal-total-committed">—</div>
                        <p class="cltr-focal-sub">Aggregated collateral locked in active verification contracts across the protocol.</p>
                    </div>
                    <div class="cltr-focal-right">
                        <div class="cltr-focal-mini-card">
                            <span class="cltr-focal-mini-lbl">PROOFS CONVERTED TO BURN</span>
                            <span class="cltr-focal-mini-num" id="focal-total-burned">—</span>
                        </div>
                        <div class="cltr-focal-mini-card">
                            <span class="cltr-focal-mini-lbl">GLOBAL SUCCESS RATE</span>
                            <span class="cltr-focal-mini-num">94.8%</span>
                        </div>
                    </div>
                </div>

                <!-- METRICS GRID -->
                <div class="cltr-metrics-grid">
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Conviction Balance</span>
                        <div class="cltr-metric-val" id="metric-conviction-bal">—</div>
                        <span class="cltr-metric-sub">CLTR unlocked in wallet</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Committed Collateral</span>
                        <div class="cltr-metric-val" id="metric-committed-collateral">—</div>
                        <span class="cltr-metric-sub">CLTR locked in staking</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Interest Earned</span>
                        <div class="cltr-metric-val" id="metric-yield-earned">—</div>
                        <span class="cltr-metric-sub">Accrued rewards</span>
                    </div>
                    <div class="cltr-metric-card">
                        <span class="cltr-metric-lbl">Protocol Supply</span>
                        <div class="cltr-metric-val">987,549,770</div>
                        <span class="cltr-metric-sub">Fixed cap: 1,000,000,000</span>
                    </div>
                </div>

                <!-- Main Layout -->
                <div class="cltr-main-grid">

                    <!-- Left: Staking & Active Stakes -->
                    <div>
                        <!-- Commitment Staking Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">COMMITMENT STAKING</span>
                                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; font-weight:700; color:#10B981;">MAX YIELD: 25%</span>
                            </div>

                            <div class="cltr-stake-wrap">
                                <div class="cltr-field-group">
                                    <div class="cltr-field-lbl-row">
                                        <span>Stake Amount</span>
                                        <span class="cltr-max-trigger" id="stake-max-btn">MAX</span>
                                    </div>
                                    <div class="cltr-input-container">
                                        <input type="number" class="cltr-input-field" id="stake-input" min="1" placeholder="0.00" disabled>
                                        <span class="cltr-input-token">CLTR</span>
                                    </div>
                                </div>

                                <div class="cltr-field-group">
                                    <label class="cltr-field-lbl-row">Commitment Lockup Period</label>
                                    <div class="cltr-lock-grid">
                                        <button class="cltr-lock-pill active" data-days="30" data-apy="5" disabled>
                                            <span class="cltr-lock-days">30 Days</span>
                                            <span class="cltr-lock-yield">5% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="90" data-apy="10" disabled>
                                            <span class="cltr-lock-days">90 Days</span>
                                            <span class="cltr-lock-yield">10% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="180" data-apy="15" disabled>
                                            <span class="cltr-lock-days">180 Days</span>
                                            <span class="cltr-lock-yield">15% Yield</span>
                                        </button>
                                        <button class="cltr-lock-pill" data-days="365" data-apy="25" disabled>
                                            <span class="cltr-lock-days">365 Days</span>
                                            <span class="cltr-lock-yield">25% Yield</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="cltr-calc-summary">
                                    <div class="cltr-calc-row">
                                        <span>Commitment Yield</span>
                                        <span id="calc-apy">5.0%</span>
                                    </div>
                                    <div class="cltr-calc-row">
                                        <span>Interest Accrual</span>
                                        <span id="calc-yield">0.00 CLTR</span>
                                    </div>
                                    <div class="cltr-calc-row accent">
                                        <span>Total Release Balance</span>
                                        <strong id="calc-total">0.00 CLTR</strong>
                                    </div>
                                </div>

                                <button class="cltr-action-submit" id="stake-btn" disabled>STAKE CLTR</button>
                            </div>
                        </div>

                        <!-- Active Stakes Panel -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">ACTIVE COMMITMENT POSITIONS</span>
                                <span style="font-family:'JetBrains Mono', monospace; font-size:10px; color:#888;" id="stakes-count">0 Positions</span>
                            </div>

                            <div class="cltr-table-container">
                                <table class="cltr-data-table">
                                    <thead>
                                        <tr>
                                            <th>Staked Amount</th>
                                            <th>Lock Period</th>
                                            <th>Maturity</th>
                                            <th>Accrued Yield</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="stakes-tbody">
                                        <tr>
                                            <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active positions.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- BURN VISUALIZATION & DEFLATION HISTORY -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">DEFLATIONARY HISTORY &amp; SUPPLY SHRINKS</span>
                            </div>
                            <div class="cltr-burn-visualizer">
                                <div class="cltr-chart-container">
                                    <div class="cltr-chart-grid">
                                        <div class="cltr-chart-grid-line"></div>
                                        <div class="cltr-chart-grid-line"></div>
                                        <div class="cltr-chart-grid-line"></div>
                                    </div>
                                    <!-- Supply contraction Sparkline path -->
                                    <svg class="cltr-chart-svg" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <path d="M 0,2 M 0,2 L 15,3 L 30,5 L 45,9 L 60,14 L 75,18 L 90,23 L 100,26" fill="none" stroke="#5C1414" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="cltr-burn-period-grid">
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Today</span>
                                        <span class="cltr-burn-period-num">🔥 14,210</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">This Week</span>
                                        <span class="cltr-burn-period-num">🔥 98,420</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Burn Rate</span>
                                        <span class="cltr-burn-period-num">1.25%</span>
                                    </div>
                                    <div class="cltr-burn-period-card">
                                        <span class="cltr-burn-period-lbl">Proof Burn</span>
                                        <span class="cltr-burn-period-num" style="color:#5C1414;">12.45M</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Reputation Layer, Founder Trust & Activity Feed -->
                    <div>
                        <!-- Reputation Identity Card -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">CREDIBILITY IDENTITY LAYER</span>
                            </div>

                            <div class="cltr-rep-score-box">
                                <div class="cltr-rep-score-left">
                                    <span class="cltr-rep-score-lbl">CONVICTION SCORE</span>
                                    <span class="cltr-rep-score-val" id="rep-score">—</span>
                                </div>
                                <span class="cltr-badge-glow" id="rep-rank">CONNECT WALLET</span>
                            </div>

                            <div class="cltr-rep-layout">
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">SUCCESS RATE</span>
                                    <span class="cltr-rep-val" id="rep-success-rate">—</span>
                                </div>
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">CONTRACTS</span>
                                    <span class="cltr-rep-val" id="rep-contracts-completed">—</span>
                                </div>
                                <div class="cltr-rep-stat">
                                    <span class="cltr-rep-lbl">RANK</span>
                                    <span class="cltr-rep-val" id="rep-rank-num">—</span>
                                </div>
                            </div>
                        </div>

                        <!-- Founder Trust Section -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">FOUNDER ALIGNMENT &amp; VESTING TRUST</span>
                            </div>

                            <!-- Founder Trust Vesting Details -->
                            <div class="cltr-trust-card">
                                <div class="cltr-trust-card-hdr">
                                    <span class="cltr-trust-name">Founder Escrow Wallet</span>
                                    <span class="cltr-trust-alloc">50,000,000 CLTR</span>
                                </div>
                                <div class="cltr-trust-progress-bg">
                                    <div class="cltr-trust-progress-fill" id="founder-vest-progress"></div>
                                </div>
                                <div class="cltr-trust-meta">
                                    <span>Vested: <strong id="founder-vested-label">—</strong></span>
                                    <span id="founder-time-remaining">—</span>
                                </div>
                                <div class="cltr-trust-claim-box">
                                    <div>
                                        <span class="cltr-trust-claim-lbl">Claimable Vested</span>
                                        <span class="cltr-trust-claim-val" id="founder-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-trust-claim-btn" id="founder-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                                <div class="cltr-contract-addr-row">
                                    <span>Vesting Contract Address</span>
                                    <span class="addr" onclick="navigator.clipboard.writeText('0x8f3Cf...3a4D'); alert('Address copied!');">0x8f3Cf...3a4D</span>
                                </div>
                            </div>

                            <!-- Team Trust Vesting Details -->
                            <div class="cltr-trust-card">
                                <div class="cltr-trust-card-hdr">
                                    <span class="cltr-trust-name">Team Allocation Vesting</span>
                                    <span class="cltr-trust-alloc">150,000,000 CLTR</span>
                                </div>
                                <div class="cltr-trust-progress-bg">
                                    <div class="cltr-trust-progress-fill" id="team-vest-progress"></div>
                                </div>
                                <div class="cltr-trust-meta">
                                    <span>Vested: <strong id="team-vested-label">—</strong></span>
                                    <span id="team-time-remaining">—</span>
                                </div>
                                <div class="cltr-trust-claim-box">
                                    <div>
                                        <span class="cltr-trust-claim-lbl">Claimable Vested</span>
                                        <span class="cltr-trust-claim-val" id="team-claimable-label">—</span>
                                    </div>
                                    <button class="cltr-trust-claim-btn" id="team-claim-btn" disabled>RELEASE TOKENS</button>
                                </div>
                                <div class="cltr-contract-addr-row">
                                    <span>Vesting Contract Address</span>
                                    <span class="addr" onclick="navigator.clipboard.writeText('0x2e9bA...1f9E'); alert('Address copied!');">0x2e9bA...1f9E</span>
                                </div>
                            </div>
                        </div>

                        <!-- Live Activity Feed -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">LIVE PROTOCOL ACTIVITY</span>
                                <span class="cltr-status-operational"><span class="dot" style="width: 4px; height: 4px; border-radius: 50%; background: #10b981; display: inline-block; animation: pulseIndicator 2.5s infinite; margin-right: 4px;"></span>Live Feed</span>
                            </div>
                            <div class="cltr-feed-list" id="activity-feed">
                                <!-- Loading skeleton -->
                                <div style="text-align:center; color:#999; font-size:11px; padding:12px; font-family:'JetBrains Mono', monospace;">Connecting live node feed...</div>
                            </div>
                        </div>

                        <!-- Protocol Health / Stats -->
                        <div class="cltr-panel">
                            <div class="cltr-panel-hdr">
                                <span class="cltr-panel-title">PROTOCOL HEALTH SUMMARY</span>
                            </div>
                            <div class="cltr-health-grid">
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Active Contracts</span>
                                    <span class="cltr-rep-val">142</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Escrow Locked</span>
                                    <span class="cltr-rep-val">45.2M CLTR</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Burned Today</span>
                                    <span class="cltr-rep-val">14,210 CLTR</span>
                                </div>
                                <div class="cltr-health-stat">
                                    <span class="cltr-rep-lbl">Circulating Supply</span>
                                    <span class="cltr-rep-val">342.5M CLTR</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- ===== TX MODAL ===== -->
        <div id="tx-modal" class="cltr-modal-backdrop">
            <div class="cltr-modal-box">
                <div class="cltr-tx-spinner"></div>
                <h3 class="cltr-tx-title" id="tx-title">Waiting for Wallet Confirmation</h3>
                <p class="cltr-tx-sub" id="tx-sub">Please approve the transaction in MetaMask or your linked Web3 wallet.</p>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════
// DYNAMIC PORTAL LOGIC & ANIMATIONS
// ═══════════════════════════════════════════════════════
export function initToken() {
    const connectBtn = document.getElementById('w-connect-btn');
    const wDot = document.getElementById('w-dot');
    const wStatus = document.getElementById('w-status');
    const wAddr = document.getElementById('w-addr');

    const focalTotalCommitted = document.getElementById('focal-total-committed');
    const focalTotalBurned = document.getElementById('focal-total-burned');

    const metricConvictionBal = document.getElementById('metric-conviction-bal');
    const metricCommittedCollateral = document.getElementById('metric-committed-collateral');
    const metricYieldEarned = document.getElementById('metric-yield-earned');

    const stakeInput = document.getElementById('stake-input');
    const maxBtn = document.getElementById('stake-max-btn');
    const stakeBtn = document.getElementById('stake-btn');
    const lockPills = document.querySelectorAll('.cltr-lock-pill');
    const calcApy = document.getElementById('calc-apy');
    const calcYield = document.getElementById('calc-yield');
    const calcTotal = document.getElementById('calc-total');

    const stakesCount = document.getElementById('stakes-count');
    const stakesTbody = document.getElementById('stakes-tbody');

    const txModal = document.getElementById('tx-modal');
    const txTitle = document.getElementById('tx-title');
    const txSub = document.getElementById('tx-sub');

    // Reputation Elements
    const repScore = document.getElementById('rep-score');
    const repRank = document.getElementById('rep-rank');
    const repSuccessRate = document.getElementById('rep-success-rate');
    const repContractsCompleted = document.getElementById('rep-contracts-completed');
    const repRankNum = document.getElementById('rep-rank-num');

    // Vesting Elements
    const founderProgress = document.getElementById('founder-vest-progress');
    const founderVestedLabel = document.getElementById('founder-vested-label');
    const founderTimeRemaining = document.getElementById('founder-time-remaining');
    const founderClaimableLabel = document.getElementById('founder-claimable-label');
    const founderClaimBtn = document.getElementById('founder-claim-btn');

    const teamProgress = document.getElementById('team-vest-progress');
    const teamVestedLabel = document.getElementById('team-vested-label');
    const teamTimeRemaining = document.getElementById('team-time-remaining');
    const teamClaimableLabel = document.getElementById('team-claimable-label');
    const teamClaimBtn = document.getElementById('team-claim-btn');

    // Activity Feed Element
    const activityFeed = document.getElementById('activity-feed');

    // State Variables
    let isConnected = localStorage.getItem('cltr_wallet_connected') === 'true';
    let balance = parseFloat(localStorage.getItem('cltr_wallet_balance') || '250000');
    let stakedBalance = parseFloat(localStorage.getItem('cltr_staked_balance') || '0');
    let activeAPY = 5;
    let activeDuration = 30;

    // Vesting schedules config
    const vestingStart = 1717171200; // June 1, 2024
    const vestingDuration = 4 * 365 * 24 * 60 * 60; // 4 Years
    const vestingCliff = 365 * 24 * 60 * 60; // 1 Year
    
    let founderClaimed = parseFloat(localStorage.getItem('cltr_founder_claimed') || '0');
    let teamClaimed = parseFloat(localStorage.getItem('cltr_team_claimed') || '0');

    // APY helper
    function getAPY(days) {
        if (days === 30) return 5;
        if (days === 90) return 10;
        if (days === 180) return 15;
        if (days === 365) return 25;
        return 5;
    }

    function formatNumber(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Dynamic Live Tickers & Number Transitions
    let counterIntervals = {};
    function animateValue(element, start, end, duration) {
        const id = element.id;
        if (counterIntervals[id]) clearInterval(counterIntervals[id]);
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = progress * (end - start) + start;
            element.innerText = formatNumber(currentVal);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.innerText = formatNumber(end);
            }
        };
        window.requestAnimationFrame(step);
    }

    function updateStats() {
        const totalCommitted = 182450000 + stakedBalance;
        const totalBurned = 12450230;

        if (!isConnected) {
            focalTotalCommitted.innerText = '—';
            focalTotalBurned.innerText = '—';
            metricConvictionBal.innerText = '—';
            metricCommittedCollateral.innerText = '—';
            metricYieldEarned.innerText = '—';
            return;
        }

        // Animated counters for key metrics
        animateValue(focalTotalCommitted, totalCommitted - 10000, totalCommitted, 800);
        animateValue(focalTotalBurned, totalBurned - 50, totalBurned, 800);
        
        metricConvictionBal.innerText = formatNumber(balance);
        metricCommittedCollateral.innerText = formatNumber(stakedBalance);
        
        // Calculate accrued rewards on current stakes
        const list = getStakes();
        const accruedRewards = list.reduce((sum, item) => sum + item.yield, 0);
        metricYieldEarned.innerText = formatNumber(accruedRewards);
    }

    // Load active positions
    function getStakes() {
        try {
            return JSON.parse(localStorage.getItem('cltr_stakes_list') || '[]');
        } catch(e) {
            return [];
        }
    }

    function saveStakes(list) {
        localStorage.setItem('cltr_stakes_list', JSON.stringify(list));
    }

    // Update Staking Summary calculator
    function updateStakeSummary() {
        const amt = parseFloat(stakeInput.value) || 0;
        const interest = amt * (activeAPY / 100) * (activeDuration / 365);
        calcApy.innerText = `${activeAPY.toFixed(1)}%`;
        calcYield.innerText = `${formatNumber(interest)} CLTR`;
        calcTotal.innerText = `${formatNumber(amt + interest)} CLTR`;

        if (amt > 0 && amt <= balance) {
            stakeBtn.removeAttribute('disabled');
        } else {
            stakeBtn.setAttribute('disabled', 'true');
        }
    }

    // Render Positions Table
    function renderStakesTable() {
        if (!isConnected) {
            stakesTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#999; padding: 24px;">Connect wallet to view active locked positions.</td>
                </tr>
            `;
            stakesCount.innerText = '0 Positions';
            return;
        }

        const list = getStakes();
        stakesCount.innerText = `${list.length} Position${list.length === 1 ? '' : 's'}`;

        if (list.length === 0) {
            stakesTbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#999; padding: 24px;">No active stakes. Select duration and amount above to commit.</td>
                </tr>
            `;
            return;
        }

        const now = Date.now();
        stakesTbody.innerHTML = list.map((item, index) => {
            const start = item.startTime;
            const end = item.endTime;
            const duration = end - start;
            const elapsed = now - start;
            let progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));
            const isMatured = now >= end;

            const endDateStr = new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

            const statusBadge = isMatured 
                ? `<span class="cltr-badge matured">Matured</span>` 
                : `<span class="cltr-badge locked">Locked</span>`;

            const actionBtn = `<button class="cltr-unstake-btn" data-index="${index}" ${isMatured ? '' : 'disabled'}>Unstake</button>`;

            return `
                <tr>
                    <td><strong>${formatNumber(item.amount)} CLTR</strong></td>
                    <td>${item.durationDays} Days @ ${item.apy}%</td>
                    <td>
                        <div class="cltr-progress-bar-mini">
                            <div class="cltr-progress-bar-mini-fill" style="width: ${progress}%"></div>
                        </div>
                        ${endDateStr}
                    </td>
                    <td style="color:#10B981;">+${formatNumber(item.yield)}</td>
                    <td>${statusBadge}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        }).join('');

        // Wire up unstake triggers
        document.querySelectorAll('.cltr-unstake-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                executeUnstake(idx);
            });
        });
    }

    // Ticking Live Vesting & Claim status
    let vestingInterval = null;
    function startVestingTicker() {
        if (vestingInterval) clearInterval(vestingInterval);

        function tick() {
            if (!isConnected) return;

            const nowSec = Math.floor(Date.now() / 1000);
            const elapsed = nowSec - vestingStart;

            // 1. Founder Vesting Calculation (50M CLTR)
            const founderTotal = 50000000;
            let founderVested = 0;
            let founderClaimable = 0;
            let founderTimeText = '';
            let founderProgressPct = 0;

            if (elapsed >= vestingCliff) {
                founderVested = Math.min(founderTotal, (founderTotal * elapsed) / vestingDuration);
                founderClaimable = Math.max(0, founderVested - founderClaimed);
                founderProgressPct = (elapsed / vestingDuration) * 100;

                if (elapsed >= vestingDuration) {
                    founderTimeText = 'Escrow Finished';
                    founderProgressPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    founderTimeText = `${daysLeft} days left`;
                }
            } else {
                founderTimeText = 'Locked (Cliff: 1 Year)';
                founderProgressPct = (elapsed / vestingCliff) * 25;
            }

            // Update Founder DOM
            founderProgress.style.width = `${Math.min(100, founderProgressPct)}%`;
            founderVestedLabel.innerText = `${formatNumber(founderVested)} CLTR`;
            founderTimeRemaining.innerText = founderTimeText;
            founderClaimableLabel.innerText = `${formatNumber(founderClaimable)} CLTR`;
            if (founderClaimable > 1) {
                founderClaimBtn.removeAttribute('disabled');
            } else {
                founderClaimBtn.setAttribute('disabled', 'true');
            }

            // 2. Team Vesting Calculation (150M CLTR)
            const teamTotal = 150000000;
            let teamVested = 0;
            let teamClaimable = 0;
            let teamTimeText = '';
            let teamProgressPct = 0;

            if (elapsed >= vestingCliff) {
                teamVested = Math.min(teamTotal, (teamTotal * elapsed) / vestingDuration);
                teamClaimable = Math.max(0, teamVested - teamClaimed);
                teamProgressPct = (elapsed / vestingDuration) * 100;

                if (elapsed >= vestingDuration) {
                    teamTimeText = 'Escrow Finished';
                    teamProgressPct = 100;
                } else {
                    const daysLeft = Math.ceil((vestingDuration - elapsed) / (24 * 60 * 60));
                    teamTimeText = `${daysLeft} days left`;
                }
            } else {
                teamTimeText = 'Locked (Cliff: 1 Year)';
                teamProgressPct = (elapsed / vestingCliff) * 25;
            }

            // Update Team DOM
            teamProgress.style.width = `${Math.min(100, teamProgressPct)}%`;
            teamVestedLabel.innerText = `${formatNumber(teamVested)} CLTR`;
            teamTimeRemaining.innerText = teamTimeText;
            teamClaimableLabel.innerText = `${formatNumber(teamClaimable)} CLTR`;
            if (teamClaimable > 1) {
                teamClaimBtn.removeAttribute('disabled');
            } else {
                teamClaimBtn.setAttribute('disabled', 'true');
            }
        }

        tick();
        vestingInterval = setInterval(tick, 1000);
    }

    // Toggle Connection States
    function updateConnectionUI() {
        if (isConnected) {
            wDot.classList.add('connected');
            wStatus.innerText = 'METAMASK CONNECTED';
            wStatus.style.color = '#10B981';
            wAddr.innerText = '0x71C...896e';
            connectBtn.innerText = 'DISCONNECT';
            connectBtn.classList.add('connected');

            // Reputation Data Activation
            repScore.innerText = '824 / 1000';
            repRank.innerText = 'Tier I Guardian';
            repSuccessRate.innerText = '96.2%';
            repContractsCompleted.innerText = '42';
            repRankNum.innerText = '#124 Global';

            // Enable Staking inputs
            stakeInput.removeAttribute('disabled');
            lockPills.forEach(p => p.removeAttribute('disabled'));
        } else {
            wDot.classList.remove('connected');
            wStatus.innerText = 'DISCONNECTED';
            wStatus.style.color = '#111';
            wAddr.innerText = '—';
            connectBtn.innerText = 'CONNECT WALLET';
            connectBtn.classList.remove('connected');

            // Reset Reputation Data
            repScore.innerText = '—';
            repRank.innerText = 'CONNECT WALLET';
            repSuccessRate.innerText = '—';
            repContractsCompleted.innerText = '—';
            repRankNum.innerText = '—';

            // Disable Staking inputs
            stakeInput.setAttribute('disabled', 'true');
            stakeInput.value = '';
            lockPills.forEach(p => p.setAttribute('disabled', 'true'));
            stakeBtn.setAttribute('disabled', 'true');

            // Reset Vesting Cards
            founderVestedLabel.innerText = '—';
            founderTimeRemaining.innerText = '—';
            founderClaimableLabel.innerText = '—';
            founderProgress.style.width = '0%';
            founderClaimBtn.setAttribute('disabled', 'true');

            teamVestedLabel.innerText = '—';
            teamTimeRemaining.innerText = '—';
            teamClaimableLabel.innerText = '—';
            teamProgress.style.width = '0%';
            teamClaimBtn.setAttribute('disabled', 'true');

            if (vestingInterval) clearInterval(vestingInterval);
        }

        updateStats();
        renderStakesTable();
    }

    // Live Activity Feed Simulation
    const feedEvents = [
        { icon: '🔥', text: '1,240 CLTR converted to burn' },
        { icon: '✓', text: 'Revenue contract verified for 0x3f...d82a' },
        { icon: '✓', text: 'Creator challenge completed successfully' },
        { icon: '🔥', text: '4,520 CLTR burned from protocol challenge pool' },
        { icon: '✓', text: '$18,400 collateral escrow settled' },
        { icon: '✓', text: 'Founder vesting schedule updated' },
        { icon: '✓', text: 'New credibility milestones achieved by network verifiers' }
    ];
    let feedInterval = null;
    function startFeedTicker() {
        if (feedInterval) clearInterval(feedInterval);

        function addRandomFeed() {
            const ev = feedEvents[Math.floor(Math.random() * feedEvents.length)];
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            
            const itemHTML = `
                <div class="cltr-feed-item">
                    <span class="cltr-feed-icon">${ev.icon}</span>
                    <div class="cltr-feed-details">
                        <span class="cltr-feed-text">${ev.text}</span>
                        <span class="cltr-feed-time">${time} UTC</span>
                    </div>
                </div>
            `;
            
            // Prepend new item
            const container = document.getElementById('activity-feed');
            if (container) {
                // If contains loading skeleton, replace it
                if (container.innerText.includes('Connecting')) {
                    container.innerHTML = '';
                }
                
                container.insertAdjacentHTML('afterbegin', itemHTML);
                
                // Max 5 items
                while (container.children.length > 5) {
                    container.removeChild(container.lastChild);
                }
            }
        }

        // Seed 3 initial items
        for (let i = 0; i < 3; i++) {
            setTimeout(addRandomFeed, i * 400);
        }

        // Ticker loop
        feedInterval = setInterval(addRandomFeed, 6000);
    }

    // Trigger Wallet Connect
    connectBtn.addEventListener('click', function() {
        if (isConnected) {
            isConnected = false;
            localStorage.setItem('cltr_wallet_connected', 'false');
            updateConnectionUI();
        } else {
            txTitle.innerText = 'Connecting Web3 Wallet';
            txSub.innerText = 'Please sign the connection request in your wallet extension.';
            txModal.classList.add('open');

            setTimeout(() => {
                txModal.classList.remove('open');
                isConnected = true;
                localStorage.setItem('cltr_wallet_connected', 'true');
                updateConnectionUI();
                startVestingTicker();
            }, 1000);
        }
    });

    // Staking inputs
    stakeInput.addEventListener('input', updateStakeSummary);
    maxBtn.addEventListener('click', function() {
        if (!isConnected) return;
        stakeInput.value = balance;
        updateStakeSummary();
    });

    // Lock period pills
    lockPills.forEach(pill => {
        pill.addEventListener('click', function() {
            if (!isConnected) return;
            lockPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            activeDuration = parseInt(this.getAttribute('data-days'));
            activeAPY = getAPY(activeDuration);
            updateStakeSummary();
        });
    });

    // Stake Transaction Execution
    stakeBtn.addEventListener('click', function() {
        const amt = parseFloat(stakeInput.value) || 0;
        if (amt <= 0 || amt > balance) return;

        txTitle.innerText = 'Signing Escrow Lockup';
        txSub.innerText = `Locking ${formatNumber(amt)} CLTR in commitment escrow for ${activeDuration} days...`;
        txModal.classList.add('open');

        setTimeout(() => {
            txTitle.innerText = 'Broadcasting Transaction';
            txSub.innerText = 'Confirming block state on Robinhood Chain…';
        }, 1500);

        setTimeout(() => {
            txModal.classList.remove('open');
            
            balance -= amt;
            stakedBalance += amt;
            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_staked_balance', stakedBalance.toString());

            const list = getStakes();
            const now = Date.now();
            const durationMs = activeDuration * 24 * 60 * 60 * 1000;
            
            list.push({
                amount: amt,
                durationDays: activeDuration,
                apy: activeAPY,
                startTime: now,
                endTime: now + durationMs,
                yield: amt * (activeAPY / 100) * (activeDuration / 365)
            });
            saveStakes(list);

            stakeInput.value = '';
            updateStakeSummary();
            updateStats();
            renderStakesTable();

            // Custom UI feedback instead of native alerts
            txTitle.innerText = 'Commitment Locked';
            txSub.innerText = `${formatNumber(amt)} CLTR locked successfully.`;
            txModal.classList.add('open');
            setTimeout(() => txModal.classList.remove('open'), 2000);
        }, 3200);
    });

    // Unstake Transaction Execution
    function executeUnstake(index) {
        const list = getStakes();
        const item = list[index];
        if (!item) return;

        txTitle.innerText = 'Releasing Escrowed Balance';
        txSub.innerText = `Withdrawing ${formatNumber(item.amount)} CLTR + ${formatNumber(item.yield)} yield...`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            const payout = item.amount + item.yield;
            balance += payout;
            stakedBalance -= item.amount;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_staked_balance', stakedBalance.toString());

            list.splice(index, 1);
            saveStakes(list);

            updateStats();
            renderStakesTable();

            txTitle.innerText = 'Balance Released';
            txSub.innerText = `${formatNumber(payout)} CLTR credited back to conviction balance.`;
            txModal.classList.add('open');
            setTimeout(() => txModal.classList.remove('open'), 2000);
        }, 2000);
    }

    // Release Vesting Escrows
    founderClaimBtn.addEventListener('click', function() {
        const nowSec = Math.floor(Date.now() / 1000);
        const elapsed = nowSec - vestingStart;
        const founderTotal = 50000000;
        const founderVested = Math.min(founderTotal, (founderTotal * elapsed) / vestingDuration);
        const claimable = founderVested - founderClaimed;

        if (claimable <= 0) return;

        txTitle.innerText = 'Releasing Vesting Escrow';
        txSub.innerText = `Withdrawing ${formatNumber(claimable)} CLTR to beneficiary…`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            balance += claimable;
            founderClaimed += claimable;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_founder_claimed', founderClaimed.toString());

            updateStats();

            txTitle.innerText = 'Tokens Released';
            txSub.innerText = `${formatNumber(claimable)} CLTR added to conviction balance.`;
            txModal.classList.add('open');
            setTimeout(() => txModal.classList.remove('open'), 2000);
        }, 2000);
    });

    teamClaimBtn.addEventListener('click', function() {
        const nowSec = Math.floor(Date.now() / 1000);
        const elapsed = nowSec - vestingStart;
        const teamTotal = 150000000;
        const teamVested = Math.min(teamTotal, (teamTotal * elapsed) / vestingDuration);
        const claimable = teamVested - teamClaimed;

        if (claimable <= 0) return;

        txTitle.innerText = 'Releasing Vesting Escrow';
        txSub.innerText = `Withdrawing ${formatNumber(claimable)} CLTR to team wallet…`;
        txModal.classList.add('open');

        setTimeout(() => {
            txModal.classList.remove('open');

            balance += claimable;
            teamClaimed += claimable;

            localStorage.setItem('cltr_wallet_balance', balance.toString());
            localStorage.setItem('cltr_team_claimed', teamClaimed.toString());

            updateStats();

            txTitle.innerText = 'Tokens Released';
            txSub.innerText = `${formatNumber(claimable)} CLTR added to conviction balance.`;
            txModal.classList.add('open');
            setTimeout(() => txModal.classList.remove('open'), 2000);
        }, 2000);
    });

    // Initialize View states & feeds
    updateConnectionUI();
    startFeedTicker();
    if (isConnected) {
        startVestingTicker();
    }
}
