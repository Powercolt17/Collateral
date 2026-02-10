// Overview — Collateral Execution Queue
// Polymarket-simple: pick a contract, lock capital, done.

export function renderOverview() {
    return `
        <style>
            /* === EXECUTION QUEUE === */
            .eq {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, sans-serif;
            }

            /* Top bar: stats + controls */
            .eq-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .eq-stats {
                display: flex;
                gap: 32px;
            }
            .eq-stat-value {
                font-size: 22px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .eq-stat-label {
                font-size: 10px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-controls {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .eq-rules-btn {
                padding: 8px 14px;
                font-size: 11px;
                font-weight: 500;
                color: #666;
                background: #fff;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.15s;
            }
            .eq-rules-btn:hover { border-color: #ccc; color: #333; }
            .eq-rules-btn i { width: 14px; height: 14px; }

            /* Tabs */
            .eq-tabs {
                display: flex;
                gap: 0;
                padding: 0 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .eq-tab {
                padding: 14px 20px;
                font-size: 12px;
                font-weight: 500;
                color: #888;
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transition: color 0.15s;
            }
            .eq-tab:hover { color: #333; }
            .eq-tab.active {
                color: #0a0a0a;
                border-bottom-color: #8B1818;
            }

            /* Filter pills */
            .eq-filters {
                display: flex;
                gap: 6px;
                padding: 14px 32px;
                background: #fff;
                border-bottom: 1px solid #f0f0f0;
                flex-wrap: wrap;
                align-items: center;
            }
            .eq-filter-label {
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                margin-right: 4px;
            }
            .eq-pill {
                padding: 5px 12px;
                font-size: 11px;
                color: #555;
                background: #f5f5f5;
                border: 1px solid #eee;
                border-radius: 999px;
                cursor: pointer;
                transition: all 0.15s;
                font-family: 'Inter', sans-serif;
            }
            .eq-pill:hover { border-color: #ccc; }
            .eq-pill.active { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }

            /* Cards grid */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                gap: 16px;
                padding: 24px 32px 80px;
            }

            /* Contract card — Polymarket simple */
            .eq-card {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.15s;
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .eq-card:hover {
                border-color: #ccc;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                transform: translateY(-1px);
            }

            /* Card top row: badge + ID */
            .eq-card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-card-id {
                font-size: 10px;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.3px;
            }

            /* Status badge */
            .eq-badge {
                font-size: 10px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 999px;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
            .eq-badge.active {
                background: #f0fdf4;
                color: #166534;
            }
            .eq-badge.action {
                background: #fef2f2;
                color: #8B1818;
            }
            .eq-badge.verifying {
                background: #eff6ff;
                color: #1e40af;
            }
            .eq-badge.settled {
                background: #f5f5f5;
                color: #666;
            }

            /* Contract goal — the headline */
            .eq-card-goal {
                font-size: 17px;
                font-weight: 600;
                color: #0a0a0a;
                line-height: 1.3;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            /* Card meta row */
            .eq-card-meta {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            .eq-card-stake {
                font-size: 20px;
                font-weight: 700;
                color: #0a0a0a;
                font-family: 'IBM Plex Sans', sans-serif;
            }
            .eq-card-stake-label {
                font-size: 10px;
                color: #999;
                font-weight: 400;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
            }
            .eq-card-time {
                font-size: 12px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
            }

            /* CTA button */
            .eq-card-cta {
                width: 100%;
                padding: 12px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                font-family: 'JetBrains Mono', monospace;
                border-radius: 8px;
                transition: all 0.15s;
            }
            .eq-card-cta.primary {
                background: #8B1818;
                color: #fff;
            }
            .eq-card-cta.primary:hover { background: #6B1212; }
            .eq-card-cta.secondary {
                background: #f5f5f5;
                color: #333;
                border: 1px solid #e5e5e5;
            }
            .eq-card-cta.secondary:hover { background: #eee; }

            /* Rules Modal */
            .eq-modal-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.4);
                z-index: 100;
                display: none;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(2px);
            }
            .eq-modal-backdrop.open { display: flex; }
            .eq-modal {
                background: #fff;
                border-radius: 16px;
                width: 400px;
                max-width: 90vw;
                padding: 28px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            }
            .eq-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .eq-modal-title {
                font-size: 14px;
                font-weight: 600;
                color: #0a0a0a;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .eq-modal-close {
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: #666;
                font-size: 16px;
            }
            .eq-modal-close:hover { background: #eee; }
            .eq-rule-row {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .eq-rule-row:last-child { border-bottom: none; }
            .eq-rule-row input[type="checkbox"] {
                width: 16px;
                height: 16px;
                accent-color: #8B1818;
            }
            .eq-rule-row span {
                font-size: 13px;
                color: #333;
            }
            .eq-rule-divider {
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                margin-top: 16px;
                margin-bottom: 8px;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .eq-topbar { padding: 16px; flex-direction: column; gap: 12px; align-items: flex-start; }
                .eq-tabs { padding: 0 16px; overflow-x: auto; }
                .eq-filters { padding: 10px 16px; }
                .eq-grid { padding: 16px; grid-template-columns: 1fr; }
                .eq-stats { gap: 20px; }
            }
        </style>

        <div class="eq">
            <!-- Top Bar: Stats + Controls -->
            <div class="eq-topbar">
                <div class="eq-stats">
                    <div>
                        <div class="eq-stat-value">$4.2M</div>
                        <div class="eq-stat-label">Capital Locked</div>
                    </div>
                    <div>
                        <div class="eq-stat-value">142</div>
                        <div class="eq-stat-label">Active Contracts</div>
                    </div>
                    <div>
                        <div class="eq-stat-value">$892k</div>
                        <div class="eq-stat-label">Pool Balance</div>
                    </div>
                </div>
                <div class="eq-controls">
                    <button class="eq-rules-btn" onclick="document.getElementById('rules-modal').classList.add('open')">
                        <i data-lucide="sliders-horizontal"></i> RULES
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="eq-tabs">
                <button class="eq-tab active">ALL</button>
                <button class="eq-tab">NEW</button>
                <button class="eq-tab">ACTION REQUIRED</button>
                <button class="eq-tab">VERIFYING</button>
                <button class="eq-tab">SETTLED</button>
            </div>

            <!-- Filters -->
            <div class="eq-filters">
                <span class="eq-filter-label">TYPE</span>
                <button class="eq-pill active">All</button>
                <button class="eq-pill">Revenue</button>
                <button class="eq-pill">Sales</button>
                <button class="eq-pill">Social</button>
                <button class="eq-pill">Dev</button>
                <button class="eq-pill">Fitness</button>
            </div>

            <!-- Contract Cards Grid -->
            <div class="eq-grid">
                <!-- Card 1 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0184')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0184</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +18% in 14 Days</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$5,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">Ends Feb 28</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- Card 2 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0182')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0182</span>
                    </div>
                    <div class="eq-card-goal">Commit Cadence 5/wk</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$1,200</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Feb 15</div>
                    </div>
                    <button class="eq-card-cta primary" onclick="event.stopPropagation()">Lock Capital →</button>
                </div>

                <!-- Card 3 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0185')">
                    <div class="eq-card-top">
                        <span class="eq-badge verifying">VERIFYING</span>
                        <span class="eq-card-id">RCPT-0185</span>
                    </div>
                    <div class="eq-card-goal">Post Cadence 2/day</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">Daily Cycle</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- Card 4 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0181')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0181</span>
                    </div>
                    <div class="eq-card-goal">Sales Calls 50/wk</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$2,500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">Ends Friday</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- Card 5 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0178')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0178</span>
                    </div>
                    <div class="eq-card-goal">Shopify GMV > $1k/day</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$10,000</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Mar 1</div>
                    </div>
                    <button class="eq-card-cta primary" onclick="event.stopPropagation()">Lock Capital →</button>
                </div>

                <!-- Card 6 -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0162')">
                    <div class="eq-card-top">
                        <span class="eq-badge settled">SETTLED</span>
                        <span class="eq-card-id">RCPT-0162</span>
                    </div>
                    <div class="eq-card-goal">Commit Cadence 5/wk</div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$3,000</div>
                            <div class="eq-card-stake-label">Returned</div>
                        </div>
                        <div class="eq-card-time">Settled</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>
            </div>
        </div>

        <!-- Rules Modal -->
        <div class="eq-modal-backdrop" id="rules-modal" onclick="if(event.target===this) this.classList.remove('open')">
            <div class="eq-modal">
                <div class="eq-modal-header">
                    <span class="eq-modal-title">Execution Rules</span>
                    <button class="eq-modal-close" onclick="document.getElementById('rules-modal').classList.remove('open')">✕</button>
                </div>

                <div class="eq-rule-divider">Enforcement</div>
                <div class="eq-rule-row">
                    <input type="checkbox" checked>
                    <span>Verified Only (Fail-Closed)</span>
                </div>
                <div class="eq-rule-row">
                    <input type="checkbox" checked>
                    <span>Immutable Terms</span>
                </div>
                <div class="eq-rule-row">
                    <input type="checkbox" checked>
                    <span>No Appeals</span>
                </div>
                <div class="eq-rule-row">
                    <input type="checkbox">
                    <span>Buyout Available</span>
                </div>

                <div class="eq-rule-divider">Filters</div>
                <div class="eq-rule-row">
                    <span style="font-size: 12px; color: #888;">Min Capital</span>
                    <input type="range" min="100" max="5000" value="100" step="100" style="flex:1; accent-color: #8B1818;">
                    <span style="font-size: 12px; font-weight: 600; min-width: 50px; text-align: right;">$100</span>
                </div>
                <div class="eq-rule-row">
                    <span style="font-size: 12px; color: #888;">Window</span>
                    <input type="range" min="1" max="365" value="30" style="flex:1; accent-color: #8B1818;">
                    <span style="font-size: 12px; font-weight: 600; min-width: 50px; text-align: right;">30D</span>
                </div>
            </div>
        </div>
    `;
}

export function initOverview() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
