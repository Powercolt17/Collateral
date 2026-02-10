// Overview — Collateral Execution Queue
// ALL contracts are percentage growth from baseline
// Social (X) = Follower % growth, Sales/Commerce/Finance = Revenue % growth
// Tiers: Controlled (~30% win), Elevated (~20% win), Maximum (~10% win)

export function renderOverview() {
    return `
        <style>
            .eq {
                background: #fafafa;
                min-height: 100vh;
                font-family: 'Inter', -apple-system, sans-serif;
            }

            /* Top bar */
            .eq-topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 32px;
                border-bottom: 1px solid #e5e5e5;
                background: #fff;
            }
            .eq-stats { display: flex; gap: 32px; }
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
            .eq-controls { display: flex; gap: 8px; align-items: center; }
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
            .eq-tab.active { color: #0a0a0a; border-bottom-color: #8B1818; }

            /* Filters */
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

            /* Integration indicator */
            .eq-card-integration {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: 10px;
                color: #888;
                font-family: 'JetBrains Mono', monospace;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .eq-card-integration .dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }
            .eq-card-integration .dot.stripe { background: #635bff; }
            .eq-card-integration .dot.shopify { background: #96bf48; }
            .eq-card-integration .dot.amazon { background: #ff9900; }
            .eq-card-integration .dot.x { background: #0a0a0a; }

            /* Cards grid */
            .eq-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 16px;
                padding: 24px 32px 80px;
            }

            /* Card */
            .eq-card {
                background: #fff;
                border: 1px solid #e5e5e5;
                border-radius: 12px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.15s;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .eq-card:hover {
                border-color: #ccc;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                transform: translateY(-1px);
            }

            .eq-card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .eq-card-id {
                font-size: 10px;
                color: #aaa;
                font-family: 'JetBrains Mono', monospace;
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
            .eq-badge.active { background: #f0fdf4; color: #166534; }
            .eq-badge.action { background: #fef2f2; color: #8B1818; }
            .eq-badge.verifying { background: #eff6ff; color: #1e40af; }
            .eq-badge.settled { background: #f5f5f5; color: #666; }

            /* Tier badge */
            .eq-tier {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 10px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 999px;
                font-family: 'JetBrains Mono', monospace;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
            .eq-tier.controlled { background: #f0fdf4; color: #166534; }
            .eq-tier.elevated { background: #fffbeb; color: #92400e; }
            .eq-tier.maximum { background: #fef2f2; color: #8B1818; }
            .eq-tier-rate { font-weight: 400; opacity: 0.7; }

            /* Card content */
            .eq-card-goal {
                font-size: 17px;
                font-weight: 600;
                color: #0a0a0a;
                line-height: 1.3;
                font-family: 'IBM Plex Sans', sans-serif;
            }

            .eq-card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

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
            .eq-card-cta.primary { background: #8B1818; color: #fff; }
            .eq-card-cta.primary:hover { background: #6B1212; }
            .eq-card-cta.secondary { background: #f5f5f5; color: #333; border: 1px solid #e5e5e5; }
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
            .eq-rule-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #8B1818; }
            .eq-rule-row span { font-size: 13px; color: #333; }
            .eq-rule-divider {
                font-size: 10px;
                color: #999;
                text-transform: uppercase;
                font-family: 'JetBrains Mono', monospace;
                margin-top: 16px;
                margin-bottom: 8px;
            }

            @media (max-width: 768px) {
                .eq-topbar { padding: 16px; flex-direction: column; gap: 12px; align-items: flex-start; }
                .eq-tabs { padding: 0 16px; overflow-x: auto; }
                .eq-filters { padding: 10px 16px; }
                .eq-grid { padding: 16px; grid-template-columns: 1fr; }
                .eq-stats { gap: 20px; }
            }
        </style>

        <div class="eq">
            <!-- Top Bar -->
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
                <span class="eq-filter-label">DOMAIN</span>
                <button class="eq-pill active">All</button>
                <button class="eq-pill">Sales</button>
                <button class="eq-pill">Social</button>
                <button class="eq-pill">Commerce</button>
                <button class="eq-pill">Finance</button>
            </div>

            <!-- Contract Cards — ALL % growth from baseline -->
            <div class="eq-grid">

                <!-- STRIPE — Revenue +15% — CONTROLLED -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0184')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0184</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$5,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">24d left</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- X — Followers +35% — ELEVATED -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0190')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0190</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$1,200</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Feb 28</div>
                    </div>
                    <button class="eq-card-cta primary" onclick="event.stopPropagation()">Lock Capital →</button>
                </div>

                <!-- SHOPIFY — Revenue +20% — CONTROLLED -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0178')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0178</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +20% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot shopify"></span> Shopify · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$10,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">18d left</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- X — Followers +60% — MAXIMUM -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0185')">
                    <div class="eq-card-top">
                        <span class="eq-badge verifying">VERIFYING</span>
                        <span class="eq-card-id">RCPT-0185</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +60% in 14 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier maximum">MAXIMUM <span class="eq-tier-rate">~10%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$2,500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">Verifying</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- STRIPE — Revenue +60% — MAXIMUM -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0192')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0192</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +60% in 14 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier maximum">MAXIMUM <span class="eq-tier-rate">~10%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$25,000</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">9d left</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- AMAZON — Revenue +35% — ELEVATED -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0181')">
                    <div class="eq-card-top">
                        <span class="eq-badge action">ACTION REQUIRED</span>
                        <span class="eq-card-id">RCPT-0181</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot amazon"></span> Amazon · Revenue</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$3,000</div>
                            <div class="eq-card-stake-label">Stake</div>
                        </div>
                        <div class="eq-card-time">Ends Mar 2</div>
                    </div>
                    <button class="eq-card-cta primary" onclick="event.stopPropagation()">Lock Capital →</button>
                </div>

                <!-- X — Followers +15% — CONTROLLED -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0195')">
                    <div class="eq-card-top">
                        <span class="eq-badge active">ACTIVE</span>
                        <span class="eq-card-id">RCPT-0195</span>
                    </div>
                    <div class="eq-card-goal">Follower Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot x"></span> X · Followers</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$500</div>
                            <div class="eq-card-stake-label">Locked</div>
                        </div>
                        <div class="eq-card-time">22d left</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- SHOPIFY — Revenue +35% — ELEVATED (Settled) -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0162')">
                    <div class="eq-card-top">
                        <span class="eq-badge settled">SETTLED</span>
                        <span class="eq-card-id">RCPT-0162</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +35% in 21 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot shopify"></span> Shopify · Revenue</span>
                        <span class="eq-tier elevated">ELEVATED <span class="eq-tier-rate">~20%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$4,000</div>
                            <div class="eq-card-stake-label">Returned</div>
                        </div>
                        <div class="eq-card-time">Settled</div>
                    </div>
                    <button class="eq-card-cta secondary">View Receipt →</button>
                </div>

                <!-- STRIPE — Revenue +15% — CONTROLLED (Forfeited) -->
                <div class="eq-card" onclick="window.router.navigate('/contracts/0155')">
                    <div class="eq-card-top">
                        <span class="eq-badge settled">SETTLED</span>
                        <span class="eq-card-id">RCPT-0155</span>
                    </div>
                    <div class="eq-card-goal">Revenue Growth +15% in 30 Days</div>
                    <div class="eq-card-row">
                        <span class="eq-card-integration"><span class="dot stripe"></span> Stripe · Revenue</span>
                        <span class="eq-tier controlled">CONTROLLED <span class="eq-tier-rate">~30%</span></span>
                    </div>
                    <div class="eq-card-meta">
                        <div>
                            <div class="eq-card-stake">$3,000</div>
                            <div class="eq-card-stake-label">Forfeited</div>
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
                <div class="eq-rule-row"><input type="checkbox" checked><span>Verified Only (Fail-Closed)</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked><span>Immutable Terms</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked><span>No Appeals</span></div>
                <div class="eq-rule-row"><input type="checkbox"><span>Buyout Available</span></div>
                <div class="eq-rule-divider">Tier Filter</div>
                <div class="eq-rule-row"><input type="checkbox" checked><span>Controlled — ~30% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked><span>Elevated — ~20% designed win rate</span></div>
                <div class="eq-rule-row"><input type="checkbox" checked><span>Maximum — ~10% designed win rate</span></div>
                <div class="eq-rule-divider">Stake Range</div>
                <div class="eq-rule-row">
                    <span style="font-size:12px;color:#888;">Min Capital</span>
                    <input type="range" min="100" max="5000" value="100" step="100" style="flex:1;accent-color:#8B1818;">
                    <span style="font-size:12px;font-weight:600;min-width:50px;text-align:right;">$100</span>
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
