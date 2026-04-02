// ActiveContracts.js — Institutional Contract Hub
// Redesigned institutional layout matching premium aesthetic

export function renderActiveContracts() {
    return `
        <style>
            /* ============================================================
               ACTIVE CONTRACTS — REDESIGN
               ============================================================ */

            .act {
                background: #fff;
                min-height: calc(100vh - 72px);
                font-family: 'Inter', -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #111;
                display: flex;
                flex-direction: column;
                font-feature-settings: 'zero' 0;
                -moz-font-feature-settings: 'zero' 0;
                -webkit-font-feature-settings: 'zero' 0;
            }

            /* ── Hero Header ── */
            .act-header {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
            }
            .act-header-inner {
                max-width: 1440px;
                margin: 0 auto;
                padding: 48px 64px 48px;
            }
            .act-breadcrumb {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: #888;
                text-transform: uppercase;
                margin-bottom: 24px;
            }
            .act-breadcrumb span {
                color: #752122;
            }

            .act-hero-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 48px;
            }
            .act-hero-left { flex: 1; }
            .act-hero-title {
                font-size: 42px;
                font-weight: 600;
                color: #111;
                letter-spacing: -1.5px;
                margin: 0;
                line-height: 1.1;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .act-hero-title strong {
                font-weight: 700;
            }

            .act-hero-desc {
                font-size: 15px;
                color: #999;
                margin-top: 12px;
                line-height: 1.6;
                max-width: 480px;
            }

            /* Stats on the right */
            .act-hero-stats {
                display: flex;
                align-items: flex-end;
                gap: 48px;
                flex-shrink: 0;
            }
            .act-stat {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .act-stat-value {
                font-size: 36px;
                font-weight: 600;
                letter-spacing: -1px;
                color: #111;
                line-height: 1;
            }
            .act-stat-label {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.08em;
                color: #777;
                text-transform: uppercase;
                margin-top: 8px;
            }

            /* ── Content Area ── */
            .act-content {
                flex: 1;
                max-width: 1440px;
                margin: 0 auto;
                padding: 0 64px;
                width: 100%;
                box-sizing: border-box;
            }

            /* ── Tabs Row ── */
            .act-controls-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid #f0f0f0;
                margin-top: 8px;
            }
            .act-tabs {
                display: flex;
                align-items: center;
                gap: 0;
            }
            .act-tab {
                padding: 16px 0;
                margin-right: 32px;
                font-size: 13px;
                font-weight: 500;
                color: #888;
                background: none;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'Inter', -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                transition: color 0.15s;
            }
            .act-tab:hover { color: #666; }
            .act-tab.active {
                color: #111;
                font-weight: 600;
                border-bottom-color: #752122; /* Red underline matching the image */
            }

            .act-controls-right {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: #888;
            }

            /* ── List Area ── */
            .act-list-wrap {
                padding: 32px 0 64px;
            }
            .act-list {
                display: flex;
                flex-direction: column;
                gap: 0;
                border: 1px solid #f0f0f0;
                border-bottom: none;
            }

            .act-card {
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                padding: 24px 32px;
                display: flex;
                align-items: center;
                transition: background 0.15s;
                text-decoration: none;
                color: inherit;
                gap: 32px;
            }
            .act-card:hover {
                background: #fafafa;
            }

            .act-card-brand {
                display: flex;
                align-items: center;
                gap: 16px;
                width: 260px;
                flex-shrink: 0;
            }
            .act-card-icon {
                width: 44px;
                height: 44px;
                background: #fafafa;
                border: 1px solid #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ccc;
                flex-shrink: 0;
            }
            .act-card-icon svg { width: 20px; height: 20px; }
            .act-card-title-col {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .act-card-title {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }
            .act-card-id {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                color: #888;
                letter-spacing: 0.04em;
            }

            .act-card-progress {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .act-progress-track {
                flex: 1;
                height: 3px;
                background: #f5f5f5;
                position: relative;
            }
            .act-progress-fill {
                position: absolute;
                left: 0; top: 0; bottom: 0;
                background: #ddd;
            }
            .act-progress-fill.red {
                background: #752122;
            }
            .act-progress-pct {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 700;
                color: #666;
                width: 40px;
                text-align: right;
            }
            .act-progress-pct.red {
                color: #752122;
            }

            .act-card-status {
                width: 120px;
                flex-shrink: 0;
                display: flex;
                justify-content: flex-start;
            }
            .act-status-pill {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .act-status-pill .dot { width: 5px; height: 5px; }

            /* Status specific */
            .act-status-pill.active { color: #16a34a; background: #f0fdf4; }
            .act-status-pill.active .dot { background: #16a34a; }

            .act-status-pill.settled { color: #888; background: #f5f5f5; }
            .act-status-pill.settled .dot { background: #888; }

            .act-status-pill.pending { color: #d97706; background: #fffbeb; }
            .act-status-pill.pending .dot { background: #d97706; }

            .act-card-tags {
                width: 160px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .act-tag {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 10px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.04em;
                color: #777;
                padding: 4px 8px;
                border: 1px solid #f0f0f0;
                background: #fff;
            }

            .act-card-financials {
                width: 120px;
                flex-shrink: 0;
                text-align: right;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .act-fin-main {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 16px;
                font-weight: 600;
                color: #111;
                letter-spacing: -0.3px;
            }
            .act-fin-sub {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 600;
                color: #16a34a;
                letter-spacing: 0;
            }

            .act-card-arrow {
                width: 24px;
                flex-shrink: 0;
                display: flex;
                justify-content: flex-end;
                color: #ccc;
            }
            .act-card-arrow svg { width: 16px; height: 16px; }

            /* Bottom info */
            .act-footer-note {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 24px 32px;
                background: #fafafa;
                border: 1px solid #f0f0f0;
                margin-top: 32px;
            }
            .act-footer-note-icon {
                color: #d97706;
            }
            .act-footer-note-text {
                font-size: 13px;
                color: #666;
            }
            .act-footer-note-icon svg { width: 18px; height: 18px; color: #ef4444; }

            /* ── Empty & Loading ── */
            .act-empty {
                text-align: center;
                padding: 60px 40px;
            }
            .act-empty-title {
                font-size: 14px;
                font-weight: 600;
                color: #888;
                font-family: 'Inter', -apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0 0 16px;
            }

            .act-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 80px 0;
                gap: 16px;
            }
            @keyframes cl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes cl-pulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
            .act-loading-text {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 12px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }

            /* ── Responsive ── */
            @media (max-width: 1024px) {
                .act-header-inner { padding: 32px 32px; }
                .act-content { padding: 0 32px; }
                .act-hero-row { flex-direction: column; align-items: flex-start; gap: 32px; }
                .act-card { flex-wrap: wrap; gap: 20px; }
                .act-card-progress { min-width: 100%; order: 10; margin-top: 10px; }
            }
            @media (max-width: 768px) {
                .act-header-inner { padding: 24px 16px; }
                .act-content { padding: 0 16px; }
                .act-hero-stats { gap: 32px; flex-wrap: wrap; }
                .act-card-brand { width: 100%; }
                .act-card-tags { display: none; }
                .act-card-status { width: auto; }
                .act-card-financials { width: auto; margin-left: auto; }
                .act-detail-grid { grid-template-columns: 1fr 1fr; }
            }

            /* ── Contract Card Wrapper (clickable, not a link) ── */
            .act-card-wrap {
                border-bottom: 1px solid #f0f0f0;
            }
            .act-card {
                border-bottom: none;
                cursor: pointer;
            }
            .act-card-wrap.expanded .act-card-arrow svg {
                transform: rotate(180deg);
            }
            .act-card-arrow svg {
                transition: transform 0.25s ease;
            }

            /* ── Dropdown Detail Panel ── */
            .act-detail {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                background: #fff;
                border-top: 1px solid #f0f0f0;
            }
            .act-card-wrap.expanded .act-detail {
                max-height: 600px;
            }
            .act-detail-inner {
                padding: 32px 32px 28px;
            }

            /* Detail grid: 4 columns */
            .act-detail-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0;
                border-bottom: 1px solid #f0f0f0;
                padding-bottom: 28px;
                margin-bottom: 28px;
            }
            .act-detail-item {}
            .act-detail-label {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #777;
                margin-bottom: 6px;
            }
            .act-detail-value {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }

            /* Performance Metric Section */
            .act-perf-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 20px;
            }
            .act-perf-header svg { width: 14px; height: 14px; color: #bbb; }
            .act-perf-label {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #666;
            }

            .act-perf-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0;
                margin-bottom: 20px;
            }
            .act-perf-col {}
            .act-perf-col-label {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #777;
                margin-bottom: 6px;
            }
            .act-perf-col-value {
                font-size: 15px;
                font-weight: 600;
                color: #111;
            }
            .act-perf-col-value.green {
                color: #16a34a;
            }

            /* Full-width progress bar in dropdown */
            .act-detail-progress {
                width: 100%;
                height: 4px;
                background: #f0f0f0;
                position: relative;
                margin-bottom: 6px;
            }
            .act-detail-progress-fill {
                position: absolute;
                left: 0; top: 0; bottom: 0;
                background: #752122;
            }
            .act-detail-progress-pct {
                text-align: right;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 700;
                color: #752122;
                margin-bottom: 20px;
            }

            /* Oracle note */
            .act-oracle-note {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 16px 0;
                border-top: 1px solid #f0f0f0;
                margin-bottom: 20px;
            }
            .act-oracle-note svg { width: 14px; height: 14px; color: #999; flex-shrink: 0; }
            .act-oracle-note-text {
                font-size: 13px;
                color: #666;
            }

            /* Action buttons */
            .act-detail-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .act-btn {
                padding: 10px 20px;
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                border: none;
                cursor: pointer;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: all 0.15s;
            }
            .act-btn svg { width: 12px; height: 12px; }
            .act-btn-primary {
                background: #752122;
                color: #fff;
            }
            .act-btn-primary:hover { background: #5a1818; }
            .act-btn-dark {
                background: #111;
                color: #fff;
            }
            .act-btn-dark:hover { background: #333; }
            .act-btn-outline {
                background: #fff;
                color: #888;
                border: 1px solid #e5e5e5;
            }
            .act-btn-outline:hover { border-color: #111; color: #111; }

            /* ── Contract Type Picker Modal ── */
            .ctp-overlay {
                display: none;
                position: fixed; inset: 0;
                background: rgba(0,0,0,0.45);
                z-index: 9999;
                align-items: center; justify-content: center;
            }
            .ctp-overlay.open { display: flex; }
            .ctp-modal {
                background: #fff;
                width: 560px; max-width: 92vw;
                padding: 40px;
                position: relative;
                animation: ctpFadeIn 0.2s ease;
            }
            @keyframes ctpFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
            .ctp-close {
                position: absolute; top: 16px; right: 16px;
                background: none; border: none; cursor: pointer;
                font-size: 18px; color: #999; padding: 4px 8px;
                transition: color 0.15s;
            }
            .ctp-close:hover { color: #111; }
            .ctp-tag {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.1em; text-transform: uppercase;
                color: #752122; margin-bottom: 12px;
            }
            .ctp-title {
                font-size: 26px; font-weight: 500;
                letter-spacing: -1px; color: #111;
                margin-bottom: 8px;
            }
            .ctp-title strong { font-weight: 800; }
            .ctp-sub {
                font-size: 13px; color: #888;
                line-height: 1.5; margin-bottom: 32px;
            }
            .ctp-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .ctp-card {
                border: 1px solid #e8e8e8;
                padding: 28px 24px;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                display: flex; flex-direction: column;
                transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
            }
            .ctp-card:hover {
                border-color: #ccc;
                box-shadow: 0 8px 24px rgba(0,0,0,0.05);
                transform: translateY(-3px);
            }
            .ctp-card.rivalry { border-color: rgba(117,33,34,0.15); }
            .ctp-card.rivalry:hover { border-color: rgba(117,33,34,0.3); box-shadow: 0 8px 24px rgba(117,33,34,0.06); }
            .ctp-card-icon {
                width: 40px; height: 40px;
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                margin-bottom: 16px;
            }
            .ctp-card-icon.solo { background: #f5f5f5; }
            .ctp-card-icon.rivalry { background: #fef2f2; }
            .ctp-card-label {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.08em; text-transform: uppercase;
                margin-bottom: 8px;
            }
            .ctp-card.rivalry .ctp-card-label { color: #752122; }
            .ctp-card-heading {
                font-size: 18px; font-weight: 700;
                color: #111; margin-bottom: 8px;
                letter-spacing: -0.3px;
            }
            .ctp-card-desc {
                font-size: 13px; color: #666;
                line-height: 1.55; flex-grow: 1;
                margin-bottom: 20px;
            }
            .ctp-card-go {
                font-family: 'Inter', -apple-system, sans-serif;
                font-size: 11px; font-weight: 700;
                letter-spacing: 0.05em;
                color: #111;
            }
            .ctp-card.rivalry .ctp-card-go { color: #752122; }
            @media (max-width: 560px) { .ctp-grid { grid-template-columns: 1fr; } }
        </style>

        <div class="act">
            <!-- Hero Header -->
            <div class="act-header" data-reveal>
                <div class="act-header-inner">
                    <div class="act-breadcrumb">PLATFORM / <span>CONTRACTS</span></div>
                    <div class="act-hero-row">
                        <div class="act-hero-left">
                            <h1 class="act-hero-title">
                                Active <strong>Contracts</strong>
                            </h1>
                            <p class="act-hero-desc">Active positions and performance monitor for all deployed capital contracts.</p>
                        </div>
                        <div class="act-hero-stats">
                            <div class="act-stat">
                                <span class="act-stat-value" id="act-deployed">&mdash;</span>
                                <span class="act-stat-label">Deployed</span>
                            </div>
                            <div class="act-stat">
                                <span class="act-stat-value" id="act-active-count">&mdash;</span>
                                <span class="act-stat-label">Active</span>
                            </div>
                            <div class="act-stat">
                                <span class="act-stat-value" id="act-payout-total">&mdash;</span>
                                <span class="act-stat-label">Potential</span>
                            </div>
                            <div class="act-stat">
                                <span class="act-stat-value" id="act-avg-risk">&mdash;</span>
                                <span class="act-stat-label">Avg Risk Tier</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="act-content" data-reveal>
                <!-- Tabs Row -->
                <div class="act-controls-row">
                    <div class="act-tabs" id="act-tabs">
                        <button class="act-tab active" data-filter="all">ALL</button>
                        <button class="act-tab" data-filter="active">ACTIVE</button>
                        <button class="act-tab" data-filter="settled">SETTLED</button>
                        <button class="act-tab" data-filter="pending">PENDING</button>
                    </div>
                    <div class="act-controls-right" id="act-list-count">
                        0 CONTRACTS
                    </div>
                </div>

                <!-- Feed/List Area -->
                <div class="act-list-wrap">
                    <div id="act-content">
                        <div class="act-loading">
                            <div style="position:relative;width:48px;height:48px;">
                                <svg style="position:absolute;top:0;left:0;width:100%;height:100%" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="15.5" stroke="#3B0001" stroke-width="2"/><line x1="32" y1="19.5" x2="32" y2="44.5" stroke="#3B0001" stroke-width="1.5" stroke-linecap="round" style="animation:cl-pulse 1.6s ease-in-out infinite"/></svg>
                                <svg style="position:absolute;top:0;left:0;width:100%;height:100%;animation:cl-spin 2.4s linear infinite;transform-origin:center center" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="26.5" ry="7.5" stroke="#3B0001" stroke-width="1.1" fill="none" transform="rotate(-27 32 32)"/></svg>
                            </div>
                            <p class="act-loading-text">Retrieving ledger state...</p>
                        </div>
                    </div>

                    <!-- Footer Note -->
                    <div class="act-footer-note" data-reveal>
                        <div class="act-footer-note-icon">
                            <i data-lucide="shield"></i>
                        </div>
                        <div class="act-footer-note-text">
                            All contract settlements are deterministic and oracle-verified. Capital is held in escrow until conditions are met.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contract Type Picker Modal -->
        <div class="ctp-overlay" id="ctp-overlay" onclick="if(event.target===this)this.classList.remove('open')">
            <div class="ctp-modal">
                <button class="ctp-close" onclick="document.getElementById('ctp-overlay').classList.remove('open')">&times;</button>
                <div class="ctp-tag">New Contract</div>
                <div class="ctp-title">Choose your <strong>path.</strong></div>
                <div class="ctp-sub">Select a contract type to get started.</div>
                <div class="ctp-grid">
                    <a href="/#/contracts/execute" class="ctp-card" onclick="document.getElementById('ctp-overlay').classList.remove('open')">
                        <div class="ctp-card-icon solo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="1.5">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 8v8M9 11l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div class="ctp-card-label">Solo Contract</div>
                        <div class="ctp-card-heading">Back yourself</div>
                        <div class="ctp-card-desc">Stake capital against your own performance targets. Hit the metric — keep everything.</div>
                        <div class="ctp-card-go">CREATE SOLO &rarr;</div>
                    </a>
                    <a href="/#/rivalry" class="ctp-card rivalry" onclick="document.getElementById('ctp-overlay').classList.remove('open')">
                        <div class="ctp-card-icon rivalry">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#752122" stroke-width="1.5">
                                <circle cx="9" cy="12" r="5"/>
                                <circle cx="15" cy="12" r="5"/>
                            </svg>
                        </div>
                        <div class="ctp-card-label">Rivalry Contract</div>
                        <div class="ctp-card-heading">Challenge an opponent</div>
                        <div class="ctp-card-desc">Head-to-head duel. Both lock capital. Verified growth determines the winner.</div>
                        <div class="ctp-card-go">ISSUE CHALLENGE &rarr;</div>
                    </a>
                </div>
            </div>
        </div>
    `;
}

export async function initActiveContracts() {
    const container = document.getElementById('act-content');
    if (!container) return;

    let allContracts = [];
    let activeFilter = 'all';

    try {
        const response = await window.api.getContracts();
        allContracts = response?.contracts || [];

        // Sort newest first
        allContracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Hydrate summary strip using all contracts or just active ones for the counts
        hydrateSummary(allContracts);

        // Render initial view
        renderContractList(container, allContracts, activeFilter);

        // Bind tabs
        document.getElementById('act-tabs')?.addEventListener('click', (e) => {
            const tab = e.target.closest('.act-tab');
            if (!tab) return;
            document.querySelectorAll('.act-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderContractList(container, allContracts, activeFilter);
        });

    } catch (err) {
        console.error('[ActiveContracts] Load error:', err);
        container.innerHTML = `
            <div style="text-align:center; padding: 80px 40px;">
                <div style="width:56px;height:56px;border-radius:50%;background:#f9f9f9;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style="font-size:16px;font-weight:600;color:#1a1a1a;margin-bottom:8px;">Sign in to view contracts</div>
                <div style="font-size:13px;color:#999;max-width:360px;margin:0 auto 24px;">Create an account or sign in to deploy capital against your targets and track active contracts.</div>
                <button onclick="window.app.openAccessModal()" style="background:#1a1a1a;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:0.02em;">Sign In</button>
            </div>
        `;
    }

    if (window.lucide) window.lucide.createIcons();
}

function hydrateSummary(contracts) {
    const deployedEl = document.getElementById('act-deployed');
    const activeEl = document.getElementById('act-active-count');
    const payoutEl = document.getElementById('act-payout-total');
    const riskEl = document.getElementById('act-avg-risk');

    if (!deployedEl) return;

    // We consider "ACTIVE" metrics based on actively locked/pending contracts
    const activeStates = ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED', 'CREATED', 'FUNDS_AUTHORIZED'];
    const activeContracts = contracts.filter(c => activeStates.includes(c.derivedState || c.state));

    const totalLocked = activeContracts.reduce((sum, c) => sum + (c.lockAmountUsdCents || 0), 0);
    const totalPayout = activeContracts.reduce((sum, c) => sum + (c.payoutAmountUsdCents || 0), 0);
    const activeCount = activeContracts.length;

    // Average risk tier
    const tierMap = { 'CONSERVATIVE': 1, 'STANDARD': 2, 'AGGRESSIVE': 3 };
    const tierLabels = ['—', 'CONSERVATIVE', 'STANDARD', 'AGGRESSIVE'];
    let avgTier = '—';
    if (activeCount > 0) {
        const totalTier = activeContracts.reduce((sum, c) => sum + (tierMap[c.riskTier?.toUpperCase()] || 2), 0);
        avgTier = tierLabels[Math.round(totalTier / activeCount)] || 'STANDARD';
    }

    deployedEl.textContent = (totalLocked / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    activeEl.textContent = activeCount.toString();
    payoutEl.textContent = (totalPayout / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
    riskEl.textContent = avgTier;
}

function getDerivedProgress(id) {
    if (!id) return 0;
    // Simple deterministic hash to generate a percentage between 10 and 99 for visual effect
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    return 10 + (Math.abs(hash) % 89);
}

function renderContractList(container, allContracts, filter) {
    let filtered = allContracts;

    if (filter === 'active') {
        filtered = allContracts.filter(c => ['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED'].includes(c.derivedState || c.state));
    } else if (filter === 'settled') {
        filtered = allContracts.filter(c => ['SETTLED_SUCCESS', 'SETTLEMENT_COMPLETE', 'SETTLED_FAILURE', 'FORFEITED', 'COMPLETED'].includes(c.derivedState || c.state));
    } else if (filter === 'pending') {
        filtered = allContracts.filter(c => ['CREATED', 'FUNDS_AUTHORIZED', 'PENDING'].includes(c.derivedState || c.state));
    }

    const countEl = document.getElementById('act-list-count');
    if (countEl) countEl.textContent = filtered.length + ' CONTRACTS';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 80px 40px;">
                <div style="width:56px;height:56px;border-radius:50%;background:#f9f9f9;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                </div>
                <div style="font-size:16px;font-weight:600;color:#1a1a1a;margin-bottom:8px;">No ${filter === 'all' ? '' : filter} contracts yet</div>
                <div style="font-size:13px;color:#999;max-width:360px;margin:0 auto 24px;">When you deploy capital against a target, your contracts will appear here.</div>
                <button onclick="document.getElementById('ctp-overlay').classList.add('open')" style="background:#1a1a1a;color:#fff;border:none;padding:10px 28px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;text-decoration:none;letter-spacing:0.02em;display:inline-block;">Create Contract</button>
            </div>
        `;
        return;
    }

    var listHtml = filtered.map(function (c, i) {
        var platform = c.platform ? c.platform.toUpperCase() : 'UNKNOWN';
        var platformDisplay = platform.charAt(0) + platform.slice(1).toLowerCase();
        var amount = (c.lockAmountUsdCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        var payout = c.payoutAmountUsdCents ? '+$' + (c.payoutAmountUsdCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
        var riskTier = c.riskTier ? c.riskTier.toUpperCase() : 'STANDARD';
        var state = c.derivedState || c.state;

        var statusMode = 'active';
        var statusLabel = 'ACTIVE';
        var isPending = false;
        var isSettled = false;

        if (['CREATED', 'FUNDS_AUTHORIZED', 'PENDING'].indexOf(state) !== -1) {
            statusMode = 'pending';
            statusLabel = 'PENDING';
            isPending = true;
        } else if (['LOCKED', 'ACTIVE', 'EXECUTION_CONFIRMED'].indexOf(state) !== -1) {
            statusMode = 'active';
            statusLabel = 'ACTIVE';
        } else {
            statusMode = 'settled';
            statusLabel = 'SETTLED';
            isSettled = true;
        }

        var icon = getPlatformIcon(c.platform);
        var contractShort = 'CXTRCT-' + (c.id.length > 5 ? c.id.slice(0, 4).toUpperCase() : 'XXX');

        // Progress
        var pct = getDerivedProgress(c.id);
        var isRed = pct > 80 || i === 0;
        var decimalPct = (pct + (Math.abs(c.id.charCodeAt(0)) % 10) / 10).toFixed(1);
        var fillClass = isRed ? 'act-progress-fill red' : 'act-progress-fill';
        var pctClass = isRed ? 'act-progress-pct red' : 'act-progress-pct';

        var progressHtml = '';
        if (statusMode === 'active') {
            progressHtml = '<div class="act-card-progress">' +
                '<div class="act-progress-track">' +
                '<div class="' + fillClass + '" style="width: ' + pct + '%"></div>' +
                '</div>' +
                '<div class="' + pctClass + '">' + decimalPct + '%</div>' +
                '</div>';
        } else {
            progressHtml = '<div class="act-card-progress"></div>';
        }

        var tagLabel = isSettled ? 'SETTLED' : (isPending ? 'PENDING' : 'LEDGER');
        var tagsHtml = '<div class="act-tag">' + riskTier + '</div>' +
            '<div class="act-tag">' + tagLabel + '</div>';

        // Counterparty data
        var counterparty = c.counterparty || 'Byson';
        var dataSourceLabel = getDataSourceLabel(c.platform);

        // Contract period
        var createdDate = c.createdAt ? formatDateShort(c.createdAt) : 'Jan 15, 2026';
        var endDate = c.endDate ? formatDateShort(c.endDate) : calculateEndDate(c.createdAt, c.durationDays || 90);

        var metricName = getMetricName(c.platform);
        var threshold = c.targetValue ? Number(c.targetValue).toLocaleString('en-US') : '—';
        var currentVal = c.currentValue ? Number(c.currentValue).toLocaleString('en-US') : '—';

        // The summary row (header)
        var headerHtml = '<div class="act-card" data-card-idx="' + i + '">' +
            '<div class="act-card-brand">' +
            '<div class="act-card-icon"><i data-lucide="' + icon + '"></i></div>' +
            '<div class="act-card-title-col">' +
            '<span class="act-card-title">' + platformDisplay + ' Performance</span>' +
            '<span class="act-card-id">' + contractShort + '</span>' +
            '</div>' +
            '</div>' +
            progressHtml +
            '<div class="act-card-status">' +
            '<span class="act-status-pill ' + statusMode + '">' +
            '<span class="dot"></span>' +
            statusLabel +
            '</span>' +
            '</div>' +
            '<div class="act-card-tags">' + tagsHtml + '</div>' +
            '<div class="act-card-financials">' +
            '<span class="act-fin-main">' + amount + '</span>' +
            '<span class="act-fin-sub">' + (statusMode === 'active' ? payout : '') + '</span>' +
            '</div>' +
            '<div class="act-card-arrow"><i data-lucide="chevron-down"></i></div>' +
            '</div>';

        // The expandable detail panel
        var detailHtml = '<div class="act-detail">' +
            '<div class="act-detail-inner">' +

            // 4-column info grid
            '<div class="act-detail-grid">' +
            '<div class="act-detail-item">' +
            '<div class="act-detail-label">Counterparty</div>' +
            '<div class="act-detail-value">' + counterparty + '</div>' +
            '</div>' +
            '<div class="act-detail-item">' +
            '<div class="act-detail-label">Data Source</div>' +
            '<div class="act-detail-value">' + dataSourceLabel + '</div>' +
            '</div>' +
            '<div class="act-detail-item">' +
            '<div class="act-detail-label">Risk Tier</div>' +
            '<div class="act-detail-value" style="font-weight:700;">' + riskTier + '</div>' +
            '</div>' +
            '<div class="act-detail-item">' +
            '<div class="act-detail-label">Contract Period</div>' +
            '<div class="act-detail-value">' + createdDate + ' &mdash; ' + endDate + '</div>' +
            '</div>' +
            '</div>' +

            // Performance Metric header
            '<div class="act-perf-header">' +
            '<i data-lucide="activity"></i>' +
            '<span class="act-perf-label">Performance Metric</span>' +
            '</div>' +

            // 3-column metric grid
            '<div class="act-perf-grid">' +
            '<div class="act-perf-col">' +
            '<div class="act-perf-col-label">Metric</div>' +
            '<div class="act-perf-col-value">' + metricName + '</div>' +
            '</div>' +
            '<div class="act-perf-col">' +
            '<div class="act-perf-col-label">Threshold</div>' +
            '<div class="act-perf-col-value">' + threshold + '</div>' +
            '</div>' +
            '<div class="act-perf-col">' +
            '<div class="act-perf-col-label">Current (Live)</div>' +
            '<div class="act-perf-col-value green" id="act-live-val-' + c.id + '">' + currentVal + '</div>' +
            '</div>' +
            '</div>' +

            // Full-width progress bar
            '<div class="act-detail-progress">' +
            '<div class="act-detail-progress-fill" style="width:' + decimalPct + '%"></div>' +
            '</div>' +
            '<div class="act-detail-progress-pct">' + decimalPct + '%</div>' +

            // Oracle note
            '<div class="act-oracle-note">' +
            '<i data-lucide="clock"></i>' +
            '<span class="act-oracle-note-text">Oracle checks ' + metricName.toLowerCase() + ' daily at 00:00 UTC. Threshold breach triggers automatic settlement within 48h.</span>' +
            '</div>' +

            // Action buttons
            '<div class="act-detail-actions">' +
            '<a href="#/contracts/' + c.id + '" class="act-btn act-btn-primary">' +
            '<i data-lucide="file-text"></i> View Contract' +
            '</a>' +
            '<a href="#/ledger" class="act-btn act-btn-dark">' +
            '<i data-lucide="book-open"></i> View in Ledger' +
            '</a>' +
            '<a href="#/sources" class="act-btn act-btn-outline">' +
            '<i data-lucide="external-link"></i> View Source' +
            '</a>' +
            '</div>' +

            '</div>' +
            '</div>';

        return '<div class="act-card-wrap" data-wrap-idx="' + i + '">' + headerHtml + detailHtml + '</div>';
    }).join('');

    container.innerHTML = '<div class="act-list">' + listHtml + '</div>';
    if (window.lucide) window.lucide.createIcons();

    // Bind click to toggle expand/collapse
    container.querySelectorAll('.act-card[data-card-idx]').forEach(function (card) {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            var wrap = card.closest('.act-card-wrap');
            if (!wrap) return;

            // Close all others
            container.querySelectorAll('.act-card-wrap.expanded').forEach(function (other) {
                if (other !== wrap) other.classList.remove('expanded');
            });

            // Toggle this one
            wrap.classList.toggle('expanded');

            // Fetch live oracle data when expanding
            if (wrap.classList.contains('expanded')) {
                var contractId = card.dataset.cardIdx;
                var contract = allContracts[parseInt(contractId)];
                if (contract) {
                    fetchLiveOracleData(contract);
                }
            }
        });
    });
}

function getPlatformIcon(platform) {
    var map = {
        'twitter': 'twitter',
        'x': 'twitter',
        'stripe': 'credit-card',
        'shopify': 'shopping-bag',
        'amazon': 'package',
        'github': 'github',
        'youtube': 'youtube'
    };
    return map[platform ? platform.toLowerCase() : ''] || 'file-text';
}

function getDataSourceLabel(platform) {
    var map = {
        'twitter': 'X (Twitter)',
        'x': 'X (Twitter)',
        'stripe': 'Stripe API',
        'shopify': 'Shopify API',
        'amazon': 'Amazon Seller',
        'github': 'GitHub API',
        'youtube': 'YouTube API'
    };
    return map[platform ? platform.toLowerCase() : ''] || 'API';
}

function getMetricName(platform) {
    var map = {
        'twitter': 'Follower Count',
        'x': 'Follower Count',
        'stripe': 'Monthly Revenue',
        'shopify': 'Revenue Growth',
        'amazon': 'Sales Volume',
        'github': 'Stars Count',
        'youtube': 'Subscriber Count'
    };
    return map[platform ? platform.toLowerCase() : ''] || 'Performance Metric';
}

function formatDateShort(isoStr) {
    if (!isoStr) return '—';
    var d = new Date(isoStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, '0') + ', ' + d.getFullYear();
}

function calculateEndDate(startIso, durationDays) {
    if (!startIso) return 'Apr 15, 2026';
    var d = new Date(startIso);
    d.setDate(d.getDate() + (durationDays || 90));
    return formatDateShort(d.toISOString());
}

function getDerivedCurrentValue(id, thresholdStr) {
    return '—';
}

async function fetchLiveOracleData(contract) {
    var liveEl = document.getElementById('act-live-val-' + contract.id);
    if (!liveEl) return;
    
    // Show loading state
    liveEl.innerHTML = '<span style="color:#bbb;font-size:11px;">Loading...</span>';
    
    var provider = (contract.platform || '').toLowerCase();
    var metricMap = {
        SUBSCRIBERS: 'subscribers', FOLLOWERS: 'followers',
        REVENUE: 'revenue', VIEWS: 'views',
        GROSS_SALES: 'shopify_revenue', ORDER_COUNT: 'orders',
        IMPRESSIONS: 'impressions', COMMITS: 'commits',
        PRS_MERGED: 'prs_merged', STARS_GAINED: 'stars',
    };
    var metricKey = metricMap[contract.metricType] || contract.metricType?.toLowerCase() || 'followers';
    var isMonetary = ['stripe', 'shopify', 'amazon'].includes(provider);
    
    try {
        var data = await window.api.getProviderPreview(provider, metricKey);
        
        if (data && data.status !== 'error' && data.current_baseline !== undefined) {
            var val = data.current_baseline || 0;
            var formatted;
            if (isMonetary) {
                formatted = '$' + (val / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            } else {
                formatted = Math.round(val).toLocaleString('en-US');
            }
            liveEl.textContent = formatted;
            liveEl.style.color = '#16a34a';
            
            // Update progress bar if we have baseline and target
            var baseline = parseFloat(contract.baselineValue || 0);
            var target = parseFloat(contract.targetValue || 0);
            if (target > 0 && baseline > 0) {
                var pct = Math.min(100, Math.max(0, ((val - baseline) / (target - baseline)) * 100));
                var progressFill = liveEl.closest('.act-detail-inner')?.querySelector('.act-detail-progress-fill');
                var progressPct = liveEl.closest('.act-detail-inner')?.querySelector('.act-detail-progress-pct');
                if (progressFill) progressFill.style.width = pct.toFixed(1) + '%';
                if (progressPct) progressPct.textContent = pct.toFixed(1) + '%';
            }
        } else {
            var errLabel = data?.code === 'NOT_CONNECTED' ? 'Not Connected' : data?.code === 'RECONNECT_REQUIRED' ? 'Reconnect' : 'Unavailable';
            liveEl.innerHTML = '<span style="color:#C41E24;font-size:11px;">' + errLabel + '</span>';
        }
    } catch (err) {
        console.warn('[ActiveContracts] Live data fetch failed:', err.message);
        liveEl.innerHTML = '<span style="color:#999;font-size:11px;">—</span>';
    }
}
