// Overview View - Collateral Clearinghouse Terminal
// Institutional settlement engine - NOT a prediction market

export function renderOverview() {
    return `
        <style>
            /* === CLEARINGHOUSE TERMINAL === */
            .clearinghouse {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, sans-serif;
            }
            
            /* Subtle grid watermark */
            .clearinghouse::before {
                content: '';
                position: fixed;
                inset: 0;
                pointer-events: none;
                background-image: 
                    linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px);
                background-size: 24px 24px;
                z-index: 0;
            }

            /* Tabs row */
            .ch-tabs {
                display: flex;
                gap: 8px;
                padding: 12px 24px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
                overflow-x: auto;
            }
            .ch-tab {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                font-size: 12px;
                font-weight: 500;
                color: #666;
                background: transparent;
                border: none;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.15s;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .ch-tab:hover { color: #333; }
            .ch-tab.active { 
                color: #0a0a0a; 
                border-bottom: 2px solid #921818;
                margin-bottom: -13px;
                padding-bottom: 19px;
            }
            .ch-tab i { width: 14px; height: 14px; }

            /* Filters row */
            .ch-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                padding: 12px 24px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
                align-items: center;
            }
            .ch-filter-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ch-filter-label {
                font-size: 10px;
                font-weight: 600;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-pill {
                padding: 6px 12px;
                font-size: 11px;
                font-weight: 500;
                color: #333;
                background: #f5f5f5;
                border: 1px solid #e0e0e0;
                border-radius: 2px;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'Inter', sans-serif;
            }
            .ch-pill:hover { background: #eee; border-color: #ccc; }
            .ch-pill.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

            .ch-integration {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                font-size: 11px;
                color: #666;
                transition: all 0.15s;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-integration:hover { color: #333; }
            .ch-integration.verified { color: #1a5c3a; font-weight: 600; }
            .ch-integration i { width: 14px; height: 14px; }

            /* Main layout */
            .ch-main {
                display: flex;
                gap: 0;
                position: relative;
                z-index: 1;
            }

            /* Sidebar */
            .ch-sidebar {
                width: 260px;
                min-width: 260px;
                padding: 20px;
                border-right: 1px solid #e5e5e5;
                background: #fff;
                min-height: calc(100vh - 200px);
            }
            .ch-sidebar-title {
                font-size: 11px;
                font-weight: 600;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 16px;
                font-family: 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .ch-sidebar-title i { width: 14px; height: 14px; }

            .ch-checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 24px;
            }
            .ch-checkbox {
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
            }
            .ch-checkbox input {
                width: 16px;
                height: 16px;
                accent-color: #921818;
            }
            .ch-checkbox span {
                font-size: 12px;
                color: #333;
            }

            .ch-slider-group {
                margin-bottom: 20px;
            }
            .ch-slider-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            .ch-slider-label {
                font-size: 11px;
                color: #666;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-slider-value {
                font-size: 12px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-slider {
                width: 100%;
                height: 4px;
                background: #e5e5e5;
                border-radius: 2px;
                appearance: none;
                cursor: pointer;
            }
            .ch-slider::-webkit-slider-thumb {
                appearance: none;
                width: 14px;
                height: 14px;
                background: #921818;
                border-radius: 50%;
                cursor: pointer;
            }

            /* Content area */
            .ch-content {
                flex: 1;
                padding: 20px 24px;
                min-width: 0;
            }

            /* Clearinghouse header banner */
            .ch-banner {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #fff;
                padding: 16px 24px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-left: 4px solid #921818;
            }
            .ch-banner-title {
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 1px;
                font-family: 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ch-banner-title::before {
                content: '■';
                color: #921818;
            }
            .ch-banner-status {
                font-size: 11px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-banner-status span {
                color: #22c55e;
            }

            /* Stats row */
            .ch-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 16px;
                margin-bottom: 24px;
            }
            .ch-stat {
                background: #fff;
                border: 1px solid #e5e5e5;
                padding: 16px 20px;
            }
            .ch-stat-label {
                font-size: 10px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 6px;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-stat-value {
                font-size: 28px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            /* Section header */
            .ch-section-header {
                font-size: 11px;
                font-weight: 600;
                color: #333;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 16px;
                font-family: 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ch-section-header::before {
                content: '■';
                color: #921818;
            }

            /* Receipt cards grid */
            .ch-cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
                margin-bottom: 32px;
            }

            /* Receipt card */
            .ch-card {
                background: #fff;
                border: 1px solid #e5e5e5;
                padding: 20px;
                transition: all 0.15s;
            }
            .ch-card:hover {
                border-color: #ccc;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            .ch-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 4px;
            }
            .ch-card-id {
                font-size: 11px;
                font-weight: 600;
                color: #666;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-card-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #22c55e;
            }
            .ch-card-indicator.pending { background: #f59e0b; }
            .ch-card-indicator.locked { background: #921818; }

            .ch-card-type {
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                font-family: 'JetBrains Mono', monospace;
            }

            .ch-card-title {
                font-size: 15px;
                font-weight: 600;
                color: #0a0a0a;
                margin-bottom: 16px;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .ch-card-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .ch-card-row:last-of-type { border-bottom: none; }
            .ch-card-label {
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
            }
            .ch-card-value {
                font-size: 11px;
                font-weight: 500;
                color: #333;
                font-family: 'JetBrains Mono', monospace;
                text-align: right;
            }
            .ch-card-value.highlight { color: #1a5c3a; }
            .ch-card-value.danger { color: #921818; }

            .ch-card-warning {
                font-size: 10px;
                color: #921818;
                font-weight: 600;
                text-transform: uppercase;
                margin-top: 12px;
                margin-bottom: 12px;
                font-family: 'JetBrains Mono', monospace;
            }

            .ch-card-cta {
                width: 100%;
                padding: 10px 16px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: 1px solid #e5e5e5;
                background: #fff;
                color: #333;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .ch-card-cta:hover { background: #f5f5f5; }
            .ch-card-cta.execute {
                background: #921818;
                color: #fff;
                border-color: #921818;
            }
            .ch-card-cta.execute:hover { background: #751212; }

            .ch-card-micro {
                font-size: 9px;
                color: #999;
                text-align: center;
                margin-top: 8px;
                font-family: 'JetBrains Mono', monospace;
            }

            /* ============================================
               SETTLEMENT LEDGER — Institutional Audit Stream
               ============================================ */
            .ch-feed {
                position: relative;
                background: linear-gradient(160deg, #07090C 0%, #0B0F14 100%);
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 16px;
                padding: 24px 28px;
                overflow: hidden;
            }
            /* Inner highlight frame */
            .ch-feed::before {
                content: '';
                position: absolute;
                inset: 1px;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.03);
                pointer-events: none;
                z-index: 1;
            }
            /* Noise texture overlay */
            .ch-feed::after {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 16px;
                opacity: 0.04;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                pointer-events: none;
                z-index: 2;
            }

            /* Scanline sweep */
            .ch-feed-scanline {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
                animation: scanlineSweep 6s linear infinite;
                pointer-events: none;
                z-index: 3;
            }
            @keyframes scanlineSweep {
                0% { top: 0; opacity: 0; }
                5% { opacity: 1; }
                95% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }

            .ch-feed-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 16px;
                padding-bottom: 14px;
                border-bottom: 1px solid rgba(255,255,255,0.06);
                position: relative;
                z-index: 4;
            }
            .ch-feed-title-group {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .ch-feed-title {
                font-size: 12px;
                font-weight: 600;
                color: rgba(255,255,255,0.72);
                text-transform: uppercase;
                letter-spacing: 0.06em;
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .ch-feed-title svg {
                width: 13px;
                height: 13px;
                opacity: 0.5;
            }
            .ch-feed-subtitle {
                font-size: 10px;
                color: rgba(255,255,255,0.25);
                letter-spacing: 0.04em;
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
            }
            .ch-feed-status {
                font-size: 10px;
                color: rgba(255,255,255,0.40);
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
                display: flex;
                align-items: center;
                gap: 6px;
                letter-spacing: 0.06em;
            }
            .ch-feed-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #3FA66A;
                animation: softPulse 3s ease-in-out infinite;
            }
            @keyframes softPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }

            /* Feed rows */
            .ch-feed-rows {
                position: relative;
                z-index: 4;
            }
            .ch-feed-row {
                display: flex;
                align-items: center;
                gap: 14px;
                height: 30px;
                padding: 0 0 0 0;
                font-size: 12px;
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
                letter-spacing: 0.06em;
                color: rgba(255,255,255,0.40);
                transition: opacity 150ms ease, transform 150ms ease;
            }
            .ch-feed-time {
                color: rgba(255,255,255,0.25);
                min-width: 68px;
                font-size: 11px;
            }

            /* Event pill badges */
            .ch-feed-badge {
                display: inline-flex;
                align-items: center;
                padding: 3px 10px;
                border-radius: 999px;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.06em;
                min-width: 150px;
                justify-content: center;
                font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
            }
            .ch-feed-badge.baseline {
                background: rgba(74,144,200,0.12);
                color: #4A90C8;
            }
            .ch-feed-badge.locked {
                background: rgba(200,169,74,0.12);
                color: #C8A94A;
            }
            .ch-feed-badge.pending {
                background: rgba(74,144,200,0.12);
                color: #4A90C8;
            }
            .ch-feed-badge.settled {
                background: rgba(63,166,106,0.12);
                color: #3FA66A;
            }
            .ch-feed-badge.forfeited {
                background: rgba(143,29,29,0.12);
                color: #8F1D1D;
            }

            .ch-feed-detail {
                color: rgba(255,255,255,0.40);
                flex: 1;
                font-size: 11px;
            }

            /* Action required badge */
            .ch-action-badge {
                font-size: 10px;
                font-weight: 600;
                color: #921818;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-family: 'JetBrains Mono', monospace;
                text-align: right;
            }

            /* Responsive */
            @media (max-width: 1024px) {
                .ch-sidebar { display: none; }
                .ch-stats { grid-template-columns: 1fr; }
            }
            @media (max-width: 768px) {
                .ch-tabs { padding: 8px 12px; }
                .ch-filters { padding: 8px 12px; }
                .ch-content { padding: 12px; }
                .ch-cards { grid-template-columns: 1fr; }
            }
        </style>

        <div class="clearinghouse">
            <!-- Tabs Row -->
            <div class="ch-tabs">
                <button class="ch-tab">
                    <i data-lucide="sparkles"></i> NEW
                </button>
                <button class="ch-tab active">
                    <i data-lucide="zap"></i> EXECUTION QUEUE
                </button>
                <button class="ch-tab">
                    <i data-lucide="trending-up"></i> HIGH EXPOSURE
                </button>
                <button class="ch-tab">
                    <i data-lucide="clock"></i> OPEN WINDOWS
                </button>
                <button class="ch-tab">
                    <i data-lucide="timer"></i> CLOSING SETTLEMENT
                </button>
                <button class="ch-tab">
                    <i data-lucide="shield-check"></i> VERIFICATION PRIORITY
                </button>
            </div>

            <!-- Filters Row -->
            <div class="ch-filters">
                <div class="ch-filter-group">
                    <span class="ch-filter-label">INSTRUMENTS</span>
                    <button class="ch-pill active">REVENUE</button>
                    <button class="ch-pill">SALES</button>
                    <button class="ch-pill">SOCIAL</button>
                    <button class="ch-pill">DEV</button>
                    <button class="ch-pill">FITNESS</button>
                    <button class="ch-pill">CUSTOM</button>
                </div>
                <div style="flex: 1;"></div>
                <div class="ch-filter-group">
                    <span class="ch-filter-label">INTEGRATIONS</span>
                    <span class="ch-integration verified">
                        <i data-lucide="check-circle"></i> VERIFIED
                    </span>
                    <span class="ch-integration">
                        <i data-lucide="check"></i> Stripe
                    </span>
                    <span class="ch-integration">
                        <i data-lucide="check"></i> Shopify
                    </span>
                    <span class="ch-integration">
                        <i data-lucide="check"></i> Amazon
                    </span>
                    <span class="ch-integration">
                        <i data-lucide="check"></i> GitHub
                    </span>
                    <span class="ch-integration">
                        <i data-lucide="check"></i> X
                    </span>
                </div>
            </div>

            <!-- Main Layout -->
            <div class="ch-main">
                <!-- Left Sidebar -->
                <aside class="ch-sidebar">
                    <div class="ch-sidebar-title">
                        <i data-lucide="sliders"></i> EXECUTION CONSTRAINTS
                    </div>
                    
                    <div class="ch-checkbox-group">
                        <label class="ch-checkbox">
                            <input type="checkbox" checked>
                            <span>VERIFIED ONLY (FAIL-CLOSED)</span>
                        </label>
                        <label class="ch-checkbox">
                            <input type="checkbox" checked>
                            <span>IMMUTABLE TERMS</span>
                        </label>
                        <label class="ch-checkbox">
                            <input type="checkbox" checked>
                            <span>NO APPEALS</span>
                        </label>
                        <label class="ch-checkbox">
                            <input type="checkbox">
                            <span>BUYOUT AVAILABLE</span>
                        </label>
                    </div>

                    <div class="ch-slider-group">
                        <div class="ch-slider-header">
                            <span class="ch-slider-label">MIN CAPITAL</span>
                            <span class="ch-slider-value" id="min-capital-value">$100</span>
                        </div>
                        <input type="range" class="ch-slider" id="min-capital" min="100" max="5000" value="100" step="100">
                    </div>

                    <div class="ch-slider-group">
                        <div class="ch-slider-header">
                            <span class="ch-slider-label">WINDOW LENGTH</span>
                            <span class="ch-slider-value" id="window-length-value">30D</span>
                        </div>
                        <input type="range" class="ch-slider" id="window-length" min="1" max="365" value="30">
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="ch-content">
                    <!-- Clearinghouse Banner -->
                    <div class="ch-banner">
                        <div class="ch-banner-title">
                            COLLATERAL CLEARINGHOUSE — SETTLEMENT ENGINE ONLINE
                        </div>
                        <div class="ch-banner-status">
                            SYSTEM STATUS: <span>OPERATIONAL</span>
                        </div>
                    </div>

                    <!-- Stats Row -->
                    <div class="ch-stats">
                        <div class="ch-stat">
                            <div class="ch-stat-label">CAPITAL LOCKED TODAY</div>
                            <div class="ch-stat-value">$4.2M</div>
                        </div>
                        <div class="ch-stat">
                            <div class="ch-stat-label">CONTRACTS AWAITING VERIFICATION</div>
                            <div class="ch-stat-value">142</div>
                        </div>
                        <div class="ch-stat">
                            <div class="ch-stat-label">FORFEITURE POOL BALANCE</div>
                            <div class="ch-stat-value">$892k</div>
                        </div>
                    </div>

                    <!-- Execution Queue Section -->
                    <div class="ch-section-header">EXECUTION QUEUE</div>

                    <div class="ch-cards">
                        <!-- Card 1 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0184</span>
                                <span class="ch-card-indicator"></span>
                            </div>
                            <div class="ch-card-type">REVENUE COMMITMENT</div>
                            <div class="ch-card-title">Revenue Growth +18% (14D)</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">MRR $12k</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">TARGET DELTA</span>
                                <span class="ch-card-value highlight">+18% ($2.1k)</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">STAKE LOCKED</span>
                                <span class="ch-card-value">$5,000 Locked</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">EXIT BUYOUT</span>
                                <span class="ch-card-value">$312</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">WINDOW ENDS</span>
                                <span class="ch-card-value">ENDS FEB 28</span>
                            </div>

                            <div class="ch-card-warning">FAILURE = FORFEIT</div>

                            <button class="ch-card-cta">
                                VIEW RECEIPT <span>→</span>
                            </button>
                        </div>

                        <!-- Card 2 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0182</span>
                                <span class="ch-card-indicator pending"></span>
                            </div>
                            <div class="ch-card-type">DEV COMMITMENT</div>
                            <div class="ch-card-title">Commit Cadence 5/wk</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">avg 2/wk</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">TARGET DELTA</span>
                                <span class="ch-card-value highlight">min 5/wk</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">STAKE LOCKED</span>
                                <span class="ch-card-value">$1,200 Locked</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">WINDOW ENDS</span>
                                <span class="ch-card-value">ENDS FEB 15</span>
                            </div>

                            <div class="ch-card-warning">EXECUTION_REQUIRED</div>

                            <button class="ch-card-cta execute">
                                LOCK CAPITAL <span>→</span>
                            </button>
                            <div class="ch-card-micro">IRREVOCABLE. SETTLEMENT IS FINAL.</div>
                        </div>

                        <!-- Card 3 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0185</span>
                                <span class="ch-card-indicator pending"></span>
                            </div>
                            <div class="ch-card-type">SOCIAL COMMITMENT</div>
                            <div class="ch-card-title">Post Cadence 2/day</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">0 posts</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">TARGET DELTA</span>
                                <span class="ch-card-value highlight">2 posts</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">STAKE LOCKED</span>
                                <span class="ch-card-value">$500 Locked</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">WINDOW ENDS</span>
                                <span class="ch-card-value">DAILY CYCLE</span>
                            </div>

                            <div class="ch-card-warning">VERIFICATION_PENDING</div>

                            <button class="ch-card-cta">
                                VIEW RECEIPT <span>→</span>
                            </button>
                        </div>

                        <!-- Card 4 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0181</span>
                                <span class="ch-card-indicator"></span>
                            </div>
                            <div class="ch-card-type">SALES COMMITMENT</div>
                            <div class="ch-card-title">Sales Calls 50/wk</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">20 calls</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">TARGET DELTA</span>
                                <span class="ch-card-value highlight">50 calls</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">STAKE LOCKED</span>
                                <span class="ch-card-value">$2,500 Locked</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">EXIT BUYOUT</span>
                                <span class="ch-card-value">$188</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">WINDOW ENDS</span>
                                <span class="ch-card-value">ENDS FRIDAY</span>
                            </div>

                            <div class="ch-card-warning">FAILURE = FORFEIT</div>

                            <button class="ch-card-cta">
                                VIEW RECEIPT <span>→</span>
                            </button>
                        </div>

                        <!-- Card 5 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0178</span>
                                <span class="ch-card-indicator locked"></span>
                            </div>
                            <div class="ch-card-type">REVENUE COMMITMENT</div>
                            <div class="ch-card-title">Shopify GMV > $1k/day</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">$800 avg</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">TARGET DELTA</span>
                                <span class="ch-card-value highlight">$1k min</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">STAKE LOCKED</span>
                                <span class="ch-card-value">$10,000 Locked</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">EXIT BUYOUT</span>
                                <span class="ch-card-value">$850</span>
                            </div>
                            <div class="ch-card-row">
                                <span class="ch-card-label">WINDOW ENDS</span>
                                <span class="ch-card-value">ENDS MAR 1</span>
                            </div>

                            <div class="ch-card-warning">FAILURE = FORFEIT</div>

                            <button class="ch-card-cta">
                                VIEW RECEIPT <span>→</span>
                            </button>
                        </div>
                    </div>

                    <!-- Verification Priority Section -->
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <div class="ch-section-header" style="margin-bottom: 0;">VERIFICATION PRIORITY</div>
                        <div class="ch-action-badge">ACTION REQUIRED</div>
                    </div>

                    <div class="ch-cards" style="margin-bottom: 24px;">
                        <!-- Verification Card 1 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0162</span>
                                <span class="ch-card-indicator pending"></span>
                            </div>
                            <div class="ch-card-type">DEV COMMITMENT</div>
                            <div class="ch-card-title">Commit Cadence 5/wk</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">avg 2/wk</span>
                            </div>
                        </div>

                        <!-- Verification Card 2 -->
                        <div class="ch-card">
                            <div class="ch-card-header">
                                <span class="ch-card-id">RCPT-0158</span>
                                <span class="ch-card-indicator pending"></span>
                            </div>
                            <div class="ch-card-type">FITNESS COMMITMENT</div>
                            <div class="ch-card-title">Run 5km</div>
                            
                            <div class="ch-card-row">
                                <span class="ch-card-label">BASELINE SNAPSHOT</span>
                                <span class="ch-card-value">—</span>
                            </div>
                        </div>
                    </div>

                    <!-- Settlement Ledger Feed -->
                    <div class="ch-feed" id="settlement-feed">
                        <div class="ch-feed-scanline"></div>
                        <div class="ch-feed-header">
                            <div class="ch-feed-title-group">
                                <span class="ch-feed-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    SETTLEMENT LEDGER
                                </span>
                                <span class="ch-feed-subtitle">Immutable Record · Clearinghouse Audit Stream</span>
                            </div>
                            <span class="ch-feed-status">
                                <span class="ch-feed-dot"></span>
                                STREAMING
                            </span>
                        </div>
                        
                        <div class="ch-feed-rows" id="feed-rows">
                            <div class="ch-feed-row">
                                <span class="ch-feed-time">14:32:18</span>
                                <span class="ch-feed-badge baseline">BASELINE_CAPTURED</span>
                                <span class="ch-feed-detail">Contract #0184 — MRR Snapshot: $12,450</span>
                            </div>
                            <div class="ch-feed-row">
                                <span class="ch-feed-time">14:31:05</span>
                                <span class="ch-feed-badge locked">CAPITAL_LOCKED</span>
                                <span class="ch-feed-detail">Contract #0183 — $2,500 Escrowed</span>
                            </div>
                            <div class="ch-feed-row">
                                <span class="ch-feed-time">14:28:44</span>
                                <span class="ch-feed-badge pending">VERIFICATION_PENDING</span>
                                <span class="ch-feed-detail">Contract #0182 — Awaiting API Response</span>
                            </div>
                            <div class="ch-feed-row">
                                <span class="ch-feed-time">14:25:12</span>
                                <span class="ch-feed-badge settled">SETTLEMENT_FINAL</span>
                                <span class="ch-feed-detail">Contract #0180 — $1,800 Returned to Provider</span>
                            </div>
                            <div class="ch-feed-row">
                                <span class="ch-feed-time">14:18:33</span>
                                <span class="ch-feed-badge forfeited">FORFEITURE_POSTED</span>
                                <span class="ch-feed-detail">Contract #0177 — $3,200 Transferred to Pool</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

export function initOverview() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Slider value updates
    const minCapital = document.getElementById('min-capital');
    const minCapitalValue = document.getElementById('min-capital-value');
    if (minCapital && minCapitalValue) {
        minCapital.addEventListener('input', () => {
            minCapitalValue.textContent = '$' + parseInt(minCapital.value).toLocaleString();
        });
    }

    const windowLength = document.getElementById('window-length');
    const windowLengthValue = document.getElementById('window-length-value');
    if (windowLength && windowLengthValue) {
        windowLength.addEventListener('input', () => {
            windowLengthValue.textContent = windowLength.value + 'D';
        });
    }

    // Animate settlement feed
    animateFeed();
}

function animateFeed() {
    const feedRows = document.getElementById('feed-rows');
    if (!feedRows) return;

    const events = [
        { type: 'baseline', event: 'BASELINE_CAPTURED', detail: 'Contract #' + getRandomId() + ' — MRR Snapshot: $' + getRandomAmount() },
        { type: 'locked', event: 'CAPITAL_LOCKED', detail: 'Contract #' + getRandomId() + ' — $' + getRandomAmount() + ' Escrowed' },
        { type: 'pending', event: 'VERIFICATION_PENDING', detail: 'Contract #' + getRandomId() + ' — Awaiting API Response' },
        { type: 'settled', event: 'SETTLEMENT_FINAL', detail: 'Contract #' + getRandomId() + ' — $' + getRandomAmount() + ' Returned' },
        { type: 'forfeited', event: 'FORFEITURE_POSTED', detail: 'Contract #' + getRandomId() + ' — $' + getRandomAmount() + ' to Pool' },
    ];

    setInterval(() => {
        if (Math.random() > 0.45) {
            const event = events[Math.floor(Math.random() * events.length)];
            const now = new Date();
            const time = now.getHours().toString().padStart(2, '0') + ':' +
                now.getMinutes().toString().padStart(2, '0') + ':' +
                now.getSeconds().toString().padStart(2, '0');

            const newRow = document.createElement('div');
            newRow.className = 'ch-feed-row';
            newRow.innerHTML = '<span class="ch-feed-time">' + time + '</span>' +
                '<span class="ch-feed-badge ' + event.type + '">' + event.event + '</span>' +
                '<span class="ch-feed-detail">' + event.detail + '</span>';

            newRow.style.opacity = '0';
            newRow.style.transform = 'translateY(-6px)';

            feedRows.insertBefore(newRow, feedRows.firstChild);

            requestAnimationFrame(() => {
                newRow.style.transition = 'opacity 150ms ease, transform 150ms ease';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
            });

            // Remove last if too many
            const allRows = feedRows.querySelectorAll('.ch-feed-row');
            if (allRows.length > 8) {
                const last = allRows[allRows.length - 1];
                last.style.transition = 'opacity 150ms ease';
                last.style.opacity = '0';
                setTimeout(() => { if (last.parentNode) last.parentNode.removeChild(last); }, 150);
            }
        }
    }, 4500);
}

function getRandomId() {
    return (Math.floor(Math.random() * 200) + 100).toString().padStart(4, '0');
}

function getRandomAmount() {
    return (Math.floor(Math.random() * 50) * 100 + 500).toLocaleString();
}
