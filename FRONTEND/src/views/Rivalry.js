// Rivalry.js — Head-to-Head Performance Duels
// Institutional design matching existing Collateral aesthetic

import api from '../api.js';

export function renderRivalry() {
    return `
        <style>
            /* ============================================================
               RIVALRY MODE — HEAD-TO-HEAD DUELS
               ============================================================ */

            .rv {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                display: flex;
                flex-direction: column;
            }

            /* ── Hero ── */
            .rv-hero {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
            }
            .rv-hero-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 48px 64px 48px;
            }
            .rv-breadcrumb {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                color: #ccc;
                text-transform: uppercase;
                margin-bottom: 24px;
            }
            .rv-breadcrumb span { color: #3B0001; }

            .rv-hero-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 48px;
            }
            .rv-hero-left { flex: 1; }
            .rv-hero-title {
                font-size: 42px;
                font-weight: 300;
                color: #111;
                letter-spacing: -1.5px;
                margin: 0 0 12px;
                line-height: 1.1;
            }
            .rv-hero-title strong {
                font-weight: 600;
                color: #3B0001;
            }
            .rv-hero-sub {
                font-size: 15px;
                color: #888;
                line-height: 1.6;
                max-width: 560px;
                margin: 0;
            }
            .rv-hero-right {
                display: flex;
                gap: 12px;
                flex-shrink: 0;
            }
            .rv-btn-challenge {
                height: 46px;
                padding: 0 32px;
                background: #111;
                color: #fff;
                border: none;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.08em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 0.15s;
            }
            .rv-btn-challenge:hover { background: #000; }

            /* ── Stats Strip ── */
            .rv-stats {
                display: flex;
                gap: 64px;
                margin-top: 36px;
                padding-top: 28px;
                border-top: 1px solid #f0f0f0;
            }
            .rv-stat-group {}
            .rv-stat-val {
                font-size: 36px;
                font-weight: 300;
                color: #111;
                letter-spacing: -1px;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .rv-stat-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.12em;
                color: #bbb;
                text-transform: uppercase;
                margin-top: 4px;
            }

            /* ── Controls ── */
            .rv-controls {
                max-width: 1440px;
                margin: 0 auto;
                padding: 28px 64px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 24px;
                width: 100%;
                box-sizing: border-box;
            }
            .rv-tabs {
                display: flex;
                gap: 32px;
            }
            .rv-tab {
                background: none;
                border: none;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #bbb;
                cursor: pointer;
                padding: 8px 0;
                border-bottom: 2px solid transparent;
                transition: color 0.15s, border-color 0.15s;
            }
            .rv-tab:hover { color: #666; }
            .rv-tab.active { color: #111; border-bottom-color: #3B0001; }
            .rv-search-box {
                height: 38px;
                padding: 0 14px;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                font-size: 13px;
                color: #111;
                background: #fff;
                outline: none;
                width: 240px;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                transition: border-color 0.15s;
            }
            .rv-search-box:focus { border-color: #3B0001; }

            /* ── Rivalry Cards Grid ── */
            .rv-grid-container {
                max-width: 1440px;
                margin: 0 auto;
                padding: 28px 64px 60px;
                width: 100%;
                box-sizing: border-box;
            }
            .rv-count {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #ccc;
                margin-bottom: 20px;
            }
            .rv-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            /* ── Rivalry Card ── */
            .rv-card {
                background: #fff;
                border: 1px solid #f0f0f0;
                padding: 28px;
                transition: border-color 0.2s, box-shadow 0.2s;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .rv-card:hover {
                border-color: #ddd;
                box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            }
            .rv-card-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .rv-card-status {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #10b981;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .rv-card-status .dot {
                width: 5px;
                height: 5px;
                border-radius: 50%;
                background: #10b981;
            }
            .rv-card-status.pending { color: #f59e0b; }
            .rv-card-status.pending .dot { background: #f59e0b; }
            .rv-card-status.ended { color: #999; }
            .rv-card-status.ended .dot { background: #999; }
            .rv-card-id {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                letter-spacing: 0.06em;
            }
            .rv-card-metric {
                font-size: 16px;
                font-weight: 500;
                color: #111;
                margin-bottom: 20px;
                letter-spacing: -0.3px;
                line-height: 1.3;
            }

            /* Versus Strip */
            .rv-versus {
                display: flex;
                align-items: stretch;
                gap: 0;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                margin-bottom: 20px;
                overflow: hidden;
            }
            .rv-player {
                flex: 1;
                padding: 16px 20px;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .rv-player.right {
                text-align: right;
                border-left: 1px solid #f0f0f0;
            }
            .rv-player-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #333;
                letter-spacing: 0.04em;
            }
            .rv-player-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: #bbb;
                text-transform: uppercase;
            }
            .rv-player-growth {
                font-size: 22px;
                font-weight: 300;
                color: #111;
                letter-spacing: -0.5px;
                margin-top: 4px;
            }
            .rv-player-growth.leading { color: #10b981; }
            .rv-player-growth.trailing { color: #ef4444; }
            .rv-vs-divider {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 48px;
                flex-shrink: 0;
                background: #f5f5f5;
                border-left: 1px solid #f0f0f0;
                border-right: 1px solid #f0f0f0;
            }
            .rv-vs-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                color: #ccc;
                letter-spacing: 0.06em;
            }

            /* Card Bottom */
            .rv-card-bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .rv-card-stake {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .rv-card-stake-val {
                font-size: 18px;
                font-weight: 500;
                color: #111;
                letter-spacing: -0.3px;
            }
            .rv-card-stake-lbl {
                font-family: 'JetBrains Mono', monospace;
                font-size: 8px;
                font-weight: 600;
                color: #bbb;
                letter-spacing: 0.1em;
                text-transform: uppercase;
            }
            .rv-card-time {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                color: #999;
                letter-spacing: 0.04em;
            }
            .rv-card-provider {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .rv-card-provider-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
            .rv-card-provider-name {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.06em;
                color: #999;
                text-transform: uppercase;
            }

            /* ── How It Works ── */
            .rv-mechanism {
                background: #fafafa;
                border-top: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
                padding: 64px 0;
            }
            .rv-mechanism-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 64px;
            }
            .rv-mechanism-header {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                margin-bottom: 48px;
            }
            .rv-mechanism-tag {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 700;
                letter-spacing: 0.12em;
                color: #ccc;
                text-transform: uppercase;
                margin-bottom: 12px;
            }
            .rv-mechanism-title {
                font-size: 32px;
                font-weight: 300;
                color: #111;
                letter-spacing: -1px;
                margin: 0;
            }
            .rv-mechanism-title strong { font-weight: 600; }
            .rv-mechanism-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
            }
            .rv-mech-card {
                padding: 40px 32px;
                border-right: 1px solid #e8e8e8;
            }
            .rv-mech-card:last-child { border-right: none; }
            .rv-mech-num {
                font-size: 56px;
                font-weight: 200;
                color: #3B0001;
                margin-bottom: 16px;
                line-height: 1;
                font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', sans-serif;
            }
            .rv-mech-label {
                font-size: 20px;
                font-weight: 500;
                color: #111;
                margin-bottom: 12px;
                letter-spacing: -0.3px;
            }
            .rv-mech-desc {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
            }

            /* ── Stake Warning ── */
            .rv-warning {
                max-width: 1440px;
                margin: 0 auto;
                padding: 40px 64px;
                text-align: center;
            }
            .rv-warning-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: #ccc;
                text-transform: uppercase;
            }

            /* ── Challenge Modal ── */
            .rv-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                backdrop-filter: blur(6px);
                z-index: 80;
                display: none;
                align-items: center;
                justify-content: center;
            }
            .rv-modal-backdrop.open {
                display: flex;
            }
            .rv-modal {
                background: #fff;
                width: 480px;
                max-width: 90vw;
                max-height: 85vh;
                overflow-y: auto;
                border: 1px solid #eaeaea;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                padding: 36px;
            }
            .rv-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 28px;
            }
            .rv-modal-title {
                font-size: 20px;
                font-weight: 500;
                color: #111;
                letter-spacing: -0.3px;
            }
            .rv-modal-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #999;
                font-size: 18px;
            }
            .rv-modal-close:hover { color: #333; }
            .rv-form-group {
                margin-bottom: 20px;
            }
            .rv-form-label {
                font-size: 12px;
                font-weight: 500;
                color: #6B6B6B;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                margin-bottom: 6px;
                display: block;
            }
            .rv-form-input {
                width: 100%;
                height: 44px;
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #1A1A1A;
                outline: none;
                transition: border-color 0.15s, box-shadow 0.15s;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
            }
            .rv-form-input:focus {
                border-color: #3B0001;
                box-shadow: 0 0 0 2px rgba(59,0,1,0.08);
            }
            .rv-form-select {
                width: 100%;
                height: 44px;
                background: #fff;
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                padding: 0 14px;
                font-size: 14px;
                color: #1A1A1A;
                outline: none;
                font-family: 'Inter Tight', 'IBM Plex Sans', sans-serif;
                box-sizing: border-box;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
            }
            .rv-form-select:focus {
                border-color: #3B0001;
                box-shadow: 0 0 0 2px rgba(59,0,1,0.08);
            }
            .rv-duration-pills {
                display: flex;
                gap: 8px;
            }
            .rv-dur-pill {
                flex: 1;
                height: 40px;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                background: #fff;
                font-family: 'JetBrains Mono', monospace;
                font-size: 11px;
                font-weight: 600;
                color: #999;
                cursor: pointer;
                transition: all 0.15s;
                letter-spacing: 0.04em;
            }
            .rv-dur-pill:hover { border-color: #ccc; color: #666; }
            .rv-dur-pill.active {
                background: #111;
                color: #fff;
                border-color: #111;
            }
            .rv-form-hint {
                font-size: 11px;
                color: #bbb;
                margin-top: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .rv-modal-preview {
                background: #fafafa;
                border: 1px solid #f0f0f0;
                padding: 20px;
                margin-bottom: 24px;
            }
            .rv-preview-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
            }
            .rv-preview-label {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                font-weight: 600;
                color: #bbb;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .rv-preview-value {
                font-size: 13px;
                font-weight: 500;
                color: #111;
            }
            .rv-btn-submit {
                width: 100%;
                height: 46px;
                background: #111;
                color: #fff;
                border: none;
                border-radius: 8px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.06em;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 0.15s;
            }
            .rv-btn-submit:hover { background: #000; }
            .rv-modal-footer {
                text-align: center;
                margin-top: 16px;
            }
            .rv-modal-footer-text {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9px;
                color: #ccc;
                letter-spacing: 0.06em;
            }

            /* ── Empty State ── */
            .rv-empty {
                text-align: center;
                padding: 80px 20px;
                color: #ccc;
            }
            .rv-empty-title {
                font-size: 18px;
                font-weight: 500;
                color: #999;
                margin-bottom: 8px;
            }
            .rv-empty-sub {
                font-size: 13px;
                color: #ccc;
                margin-bottom: 24px;
            }

            /* ── Responsive ── */
            @media (max-width: 1200px) {
                .rv-grid { grid-template-columns: 1fr; }
                .rv-mechanism-grid { grid-template-columns: repeat(3, 1fr); }
                .rv-hero-inner { padding: 40px 32px; }
                .rv-controls { padding: 24px 32px 0; }
                .rv-grid-container { padding: 24px 32px 48px; }
                .rv-mechanism-inner { padding: 0 32px; }
                .rv-warning { padding: 32px; }
                .rv-stats { gap: 40px; }
            }

            @media (max-width: 768px) {
                .rv-hero-inner { padding: 32px 20px; }
                .rv-hero-row { flex-direction: column; align-items: flex-start; gap: 20px; }
                .rv-hero-title { font-size: 28px; letter-spacing: -1px; }
                .rv-hero-sub { font-size: 14px; }
                .rv-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0;
                    border: 1px solid #f0f0f0;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-top: 24px;
                    padding-top: 0;
                    border-top: 1px solid #f0f0f0;
                }
                .rv-stat-group {
                    padding: 16px 12px;
                    text-align: center;
                    border-right: 1px solid #f0f0f0;
                }
                .rv-stat-group:last-child { border-right: none; }
                .rv-stat-val { font-size: 20px; letter-spacing: -0.5px; }
                .rv-stat-lbl { font-size: 8px; }
                .rv-controls { padding: 20px 20px 0; flex-direction: column; align-items: flex-start; gap: 12px; }
                .rv-tabs { gap: 20px; overflow-x: auto; width: 100%; }
                .rv-tab { white-space: nowrap; font-size: 10px; }
                .rv-search-box { width: 100%; }
                .rv-grid-container { padding: 20px 20px 40px; }
                .rv-grid { grid-template-columns: 1fr; }
                .rv-card { padding: 20px; }
                .rv-versus { flex-direction: column; }
                .rv-player.right { text-align: left; border-left: none; border-top: 1px solid #f0f0f0; }
                .rv-vs-divider { width: 100%; height: 32px; border-left: none; border-right: none; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; }
                .rv-mechanism { padding: 40px 0; }
                .rv-mechanism-inner { padding: 0 20px; }
                .rv-mechanism-grid { grid-template-columns: 1fr; }
                .rv-mech-card { border-right: none; border-bottom: 1px solid #e8e8e8; padding: 28px 0; }
                .rv-mech-card:last-child { border-bottom: none; }
                .rv-mechanism-title { font-size: 24px; }
                .rv-warning { padding: 28px 20px; }
                .rv-btn-challenge { width: 100%; }
            }
        </style>

        <div class="rv">
            <!-- Hero -->
            <div class="rv-hero">
                <div class="rv-hero-inner">
                    <div class="rv-breadcrumb">Collateral Protocol <span>/ Rivalry</span></div>
                    <div class="rv-hero-row">
                        <div class="rv-hero-left">
                            <h1 class="rv-hero-title">Head-to-head <strong>duels.</strong></h1>
                            <p class="rv-hero-sub">Challenge another operator to a capital-backed performance contest. Both lock funds. Verified metrics determine the winner. Loser forfeits capital.</p>
                        </div>
                        <div class="rv-hero-right">
                            <button class="rv-btn-challenge" id="rv-btn-challenge" onclick="document.getElementById('rv-challenge-modal').classList.add('open')">
                                ISSUE CHALLENGE
                            </button>
                        </div>
                    </div>

                    <div class="rv-stats">
                        <div class="rv-stat-group">
                            <div class="rv-stat-val" id="rv-stat-active">0</div>
                            <div class="rv-stat-lbl">Active Rivalries</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-capital">0</span></div>
                            <div class="rv-stat-lbl">Capital in Duels</div>
                        </div>
                        <div class="rv-stat-group">
                            <div class="rv-stat-val">$<span id="rv-stat-largest">0</span></div>
                            <div class="rv-stat-lbl">Largest Rivalry</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Controls -->
            <div class="rv-controls">
                <div class="rv-tabs" id="rv-tabs">
                    <button class="rv-tab active" data-filter="active">LIVE</button>
                    <button class="rv-tab" data-filter="pending">PENDING</button>
                    <button class="rv-tab" data-filter="settled">SETTLED</button>
                    <button class="rv-tab" data-filter="all">ALL</button>
                </div>
                <input type="text" class="rv-search-box" id="rv-search" placeholder="Search rivalries...">
            </div>

            <!-- Grid -->
            <div class="rv-grid-container">
                <div class="rv-count" id="rv-count">0 rivalries</div>
                <div class="rv-grid" id="rv-grid">
                    <!-- Dynamic rivalry cards -->
                </div>
            </div>

            <!-- How It Works -->
            <section class="rv-mechanism">
                <div class="rv-mechanism-inner">
                    <div class="rv-mechanism-header">
                        <div>
                            <div class="rv-mechanism-tag">How Rivalry Works</div>
                            <h2 class="rv-mechanism-title">Three steps to <strong>settlement.</strong></h2>
                        </div>
                    </div>
                    <div class="rv-mechanism-grid">
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">01</div>
                            <div class="rv-mech-label">Challenge</div>
                            <div class="rv-mech-desc">Challenge any verified operator to a head-to-head duel. Choose the metric, set the stake, define the time window. Both sides lock capital.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">02</div>
                            <div class="rv-mech-label">Compete</div>
                            <div class="rv-mech-desc">Performance is tracked in real-time via verified API integrations. Baseline snapshots are taken at lock-in. Growth percentage determines standing.</div>
                        </div>
                        <div class="rv-mech-card">
                            <div class="rv-mech-num">03</div>
                            <div class="rv-mech-label">Settle</div>
                            <div class="rv-mech-desc">At deadline, the oracle compares growth. The operator with greater improvement wins the combined stake pool. No appeals. Final settlement.</div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Warning -->
            <div class="rv-warning">
                <div class="rv-warning-text">Both operators lock capital. The losing operator forfeits their stake. No appeals. No reversals.</div>
            </div>
        </div>

        <!-- Challenge Modal -->
        <div class="rv-modal-backdrop" id="rv-challenge-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="rv-modal">
                <div class="rv-modal-header">
                    <span class="rv-modal-title">Issue Challenge</span>
                    <button class="rv-modal-close" onclick="document.getElementById('rv-challenge-modal').classList.remove('open')">✕</button>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Opponent Username</label>
                    <input type="text" class="rv-form-input" id="rv-opponent" placeholder="@username">
                    <div class="rv-form-hint">Enter the username of the operator you want to challenge</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Competition Metric</label>
                    <select class="rv-form-select" id="rv-metric">
                        <option value="revenue_growth">Revenue Growth (Stripe)</option>
                        <option value="follower_growth">Follower Growth (X)</option>
                        <option value="sales_growth">Sales Growth (Shopify)</option>
                        <option value="order_growth">Order Growth (Amazon)</option>
                    </select>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Your Stake</label>
                    <input type="number" class="rv-form-input" id="rv-stake" placeholder="500" min="100" step="100">
                    <div class="rv-form-hint">Minimum $100 · Opponent must match your stake</div>
                </div>

                <div class="rv-form-group">
                    <label class="rv-form-label">Duration</label>
                    <div class="rv-duration-pills" id="rv-duration-pills">
                        <button class="rv-dur-pill" data-days="7">7D</button>
                        <button class="rv-dur-pill active" data-days="14">14D</button>
                        <button class="rv-dur-pill" data-days="30">30D</button>
                        <button class="rv-dur-pill" data-days="90">90D</button>
                    </div>
                </div>

                <div class="rv-modal-preview" id="rv-preview">
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Your Stake</span>
                        <span class="rv-preview-value" id="rv-preview-stake">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Combined Pool</span>
                        <span class="rv-preview-value" id="rv-preview-pool">$0</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Duration</span>
                        <span class="rv-preview-value" id="rv-preview-duration">14 days</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Metric</span>
                        <span class="rv-preview-value" id="rv-preview-metric">Revenue Growth</span>
                    </div>
                    <div class="rv-preview-row">
                        <span class="rv-preview-label">Protocol Fee</span>
                        <span class="rv-preview-value">2%</span>
                    </div>
                </div>

                <button class="rv-btn-submit" id="rv-btn-submit">SEND CHALLENGE</button>

                <div class="rv-modal-footer">
                    <div class="rv-modal-footer-text">Challenge is binding once accepted. Capital locks immediately.</div>
                </div>
            </div>
        </div>
    `;
}


export function initRivalry() {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const grid = document.getElementById('rv-grid');
    const countLbl = document.getElementById('rv-count');
    const statActive = document.getElementById('rv-stat-active');
    const statCapital = document.getElementById('rv-stat-capital');
    const statLargest = document.getElementById('rv-stat-largest');

    if (!grid) return;

    // ── Sample rivalry data (uses existing market data patterns) ──
    const sampleRivalries = [
        {
            id: 'RV-001',
            status: 'active',
            metric: 'Revenue Growth',
            provider: 'stripe',
            challenger: { name: '@apex_capital', growth: 34.2 },
            opponent: { name: '@northpeak', growth: 28.7 },
            stake: 2500,
            daysLeft: 12,
            totalDays: 30,
        },
        {
            id: 'RV-002',
            status: 'active',
            metric: 'Follower Growth',
            provider: 'x',
            challenger: { name: '@buildfast', growth: 18.5 },
            opponent: { name: '@shipweekly', growth: 22.1 },
            stake: 1000,
            daysLeft: 6,
            totalDays: 14,
        },
        {
            id: 'RV-003',
            status: 'pending',
            metric: 'Sales Growth',
            provider: 'shopify',
            challenger: { name: '@ecomgrind', growth: 0 },
            opponent: { name: '@storescale', growth: 0 },
            stake: 5000,
            daysLeft: 30,
            totalDays: 30,
        },
        {
            id: 'RV-004',
            status: 'active',
            metric: 'Order Growth',
            provider: 'amazon',
            challenger: { name: '@fbaseller', growth: 41.8 },
            opponent: { name: '@primeops', growth: 39.2 },
            stake: 3000,
            daysLeft: 3,
            totalDays: 14,
        },
        {
            id: 'RV-005',
            status: 'settled',
            metric: 'Revenue Growth',
            provider: 'stripe',
            challenger: { name: '@growthlab', growth: 67.3 },
            opponent: { name: '@revscale', growth: 45.1 },
            stake: 10000,
            daysLeft: 0,
            totalDays: 90,
        },
        {
            id: 'RV-006',
            status: 'active',
            metric: 'Follower Growth',
            provider: 'x',
            challenger: { name: '@contentking', growth: 12.4 },
            opponent: { name: '@viralops', growth: 15.8 },
            stake: 750,
            daysLeft: 9,
            totalDays: 14,
        },
    ];

    let activeFilter = 'active';
    let searchQuery = '';

    function getProviderColor(provider) {
        const colors = { stripe: '#635bff', x: '#111', shopify: '#96bf48', amazon: '#ff9900' };
        return colors[provider] || '#111';
    }

    function renderCard(r) {
        const isLeadingChallenger = r.challenger.growth >= r.opponent.growth;
        const statusClass = r.status === 'pending' ? 'pending' : r.status === 'settled' ? 'ended' : '';
        const statusLabel = r.status === 'pending' ? 'AWAITING ACCEPTANCE' : r.status === 'settled' ? 'SETTLED' : 'LIVE';
        const timeLabel = r.status === 'settled' ? 'Completed' : r.daysLeft <= 1 ? `${r.daysLeft * 24}h left` : `${r.daysLeft}d left`;

        return `
            <div class="rv-card" data-status="${r.status}">
                <div class="rv-card-header">
                    <div class="rv-card-status ${statusClass}">
                        <span class="dot"></span>
                        ${statusLabel}
                    </div>
                    <span class="rv-card-id">${r.id}</span>
                </div>
                <div class="rv-card-metric">${r.metric}</div>
                <div class="rv-versus">
                    <div class="rv-player">
                        <span class="rv-player-label">Challenger</span>
                        <span class="rv-player-name">${r.challenger.name}</span>
                        <span class="rv-player-growth ${isLeadingChallenger ? 'leading' : 'trailing'}">
                            ${r.status === 'pending' ? '—' : (r.challenger.growth > 0 ? '+' : '') + r.challenger.growth + '%'}
                        </span>
                    </div>
                    <div class="rv-vs-divider">
                        <span class="rv-vs-text">VS</span>
                    </div>
                    <div class="rv-player right">
                        <span class="rv-player-label">Opponent</span>
                        <span class="rv-player-name">${r.opponent.name}</span>
                        <span class="rv-player-growth ${!isLeadingChallenger ? 'leading' : 'trailing'}">
                            ${r.status === 'pending' ? '—' : (r.opponent.growth > 0 ? '+' : '') + r.opponent.growth + '%'}
                        </span>
                    </div>
                </div>
                <div class="rv-card-bottom">
                    <div class="rv-card-stake">
                        <span class="rv-card-stake-val">$${(r.stake * 2).toLocaleString()}</span>
                        <span class="rv-card-stake-lbl">Combined Pool</span>
                    </div>
                    <div class="rv-card-provider">
                        <span class="rv-card-provider-dot" style="background:${getProviderColor(r.provider)}"></span>
                        <span class="rv-card-provider-name">${r.provider.toUpperCase()}</span>
                    </div>
                    <span class="rv-card-time">○ ${timeLabel}</span>
                </div>
            </div>
        `;
    }

    function renderGrid() {
        let filtered = sampleRivalries;

        if (activeFilter !== 'all') {
            filtered = filtered.filter(r => r.status === activeFilter);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.challenger.name.toLowerCase().includes(q) ||
                r.opponent.name.toLowerCase().includes(q) ||
                r.metric.toLowerCase().includes(q) ||
                r.id.toLowerCase().includes(q)
            );
        }

        if (countLbl) countLbl.textContent = `${filtered.length} rivalr${filtered.length !== 1 ? 'ies' : 'y'}`;

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="rv-empty" style="grid-column:1/-1;">
                    <div class="rv-empty-title">No rivalries found</div>
                    <div class="rv-empty-sub">${activeFilter === 'active' ? 'Issue a challenge to start the first duel.' : 'No rivalries match your current filter.'}</div>
                    <button class="rv-btn-challenge" onclick="document.getElementById('rv-challenge-modal').classList.add('open')" style="margin:0 auto;">ISSUE CHALLENGE</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(renderCard).join('');
    }

    // ── Stats ──
    function updateStats() {
        const active = sampleRivalries.filter(r => r.status === 'active');
        const totalCapital = sampleRivalries.reduce((sum, r) => sum + (r.stake * 2), 0);
        const largest = Math.max(...sampleRivalries.map(r => r.stake * 2));

        if (statActive) statActive.textContent = active.length;
        if (statCapital) {
            statCapital.textContent = totalCapital >= 1000 ? (totalCapital / 1000).toFixed(0) + 'k' : totalCapital.toLocaleString();
        }
        if (statLargest) {
            statLargest.textContent = largest >= 1000 ? (largest / 1000).toFixed(0) + 'k' : largest.toLocaleString();
        }
    }

    // ── Tabs ──
    const tabsContainer = document.getElementById('rv-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.rv-tab');
            if (!tab) return;
            tabsContainer.querySelectorAll('.rv-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderGrid();
        });
    }

    // ── Search ──
    const searchInput = document.getElementById('rv-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderGrid();
        });
    }

    // ── Challenge Modal ──
    const stakeInput = document.getElementById('rv-stake');
    const metricSelect = document.getElementById('rv-metric');
    const durationPills = document.getElementById('rv-duration-pills');
    let selectedDuration = 14;

    function updatePreview() {
        const stake = parseInt(stakeInput?.value) || 0;
        const metric = metricSelect?.selectedOptions[0]?.text || 'Revenue Growth';

        const previewStake = document.getElementById('rv-preview-stake');
        const previewPool = document.getElementById('rv-preview-pool');
        const previewDuration = document.getElementById('rv-preview-duration');
        const previewMetric = document.getElementById('rv-preview-metric');

        if (previewStake) previewStake.textContent = '$' + stake.toLocaleString();
        if (previewPool) previewPool.textContent = '$' + (stake * 2).toLocaleString();
        if (previewDuration) previewDuration.textContent = selectedDuration + ' days';
        if (previewMetric) previewMetric.textContent = metric;
    }

    if (stakeInput) stakeInput.addEventListener('input', updatePreview);
    if (metricSelect) metricSelect.addEventListener('change', updatePreview);

    if (durationPills) {
        durationPills.addEventListener('click', (e) => {
            const pill = e.target.closest('.rv-dur-pill');
            if (!pill) return;
            durationPills.querySelectorAll('.rv-dur-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            selectedDuration = parseInt(pill.dataset.days);
            updatePreview();
        });
    }

    // Submit challenge (placeholder)
    const submitBtn = document.getElementById('rv-btn-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const opponent = document.getElementById('rv-opponent')?.value?.trim();
            const stake = parseInt(stakeInput?.value) || 0;

            if (!opponent) {
                alert('Enter an opponent username');
                return;
            }
            if (stake < 100) {
                alert('Minimum stake is $100');
                return;
            }

            if (!window.appState?.isLoggedIn) {
                document.getElementById('rv-challenge-modal').classList.remove('open');
                window.app.openAccessModal();
                return;
            }

            // Future: call API to create rivalry
            alert(`Challenge sent to ${opponent} for $${stake} on ${selectedDuration}-day ${metricSelect?.selectedOptions[0]?.text || 'duel'}. This feature is coming soon.`);
            document.getElementById('rv-challenge-modal').classList.remove('open');
        });
    }

    // ── Initial render ──
    updateStats();
    renderGrid();
    updatePreview();
}
