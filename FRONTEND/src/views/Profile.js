// Profile View - Institutional Performance Terminal
// Matches contract card design system from Overview.js / Contracts.js
export function renderProfile() {
    return `
        <style>
            .prf { background: #fafafa; min-height: calc(100vh - 64px); font-family: 'IBM Plex Sans', -apple-system, sans-serif; color: #111; }

            /* Header */
            .prf-header { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 32px; }
            .prf-header-inner { max-width: 1120px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end; }
            .prf-name { font-size: 28px; font-weight: 700; color: #752122; font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.5px; margin: 0 0 6px; }
            .prf-hash { font-size: 11px; color: #9ca3af; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
            .prf-copy-btn {
                display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px;
                background: #fff; border: 1px solid #e5e5e5; border-radius: 6px; cursor: pointer;
                font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase;
                letter-spacing: 0.5px; font-family: 'IBM Plex Mono', monospace; transition: all 0.15s;
            }
            .prf-copy-btn:hover { border-color: #bbb; color: #111; }

            /* Tabs */
            .prf-tabs { display: flex; gap: 0; padding: 0 32px; border-bottom: 1px solid #e5e5e5; background: #fff; position: sticky; top: 56px; z-index: 40; }
            .prf-tab {
                padding: 16px 20px; font-size: 13px; font-weight: 500; color: #666;
                background: transparent; border: none; border-bottom: 2px solid transparent;
                cursor: pointer; font-family: 'IBM Plex Sans', sans-serif;
                text-transform: uppercase; letter-spacing: 0.2px; transition: all 0.2s;
            }
            .prf-tab:hover { color: #111; }
            .prf-tab.active { color: #111; font-weight: 600; border-bottom-color: #752122; }

            /* Metric Cards Row */
            .prf-metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; max-width: 1120px; margin: 24px auto 0; padding: 0 32px; }
            .prf-metric-card {
                background: #fff; border: 1px solid #e5e5e5; border-radius: 6px;
                padding: 20px 24px; position: relative; overflow: hidden; transition: all 0.2s;
            }
            .prf-metric-card::after {
                content: ''; position: absolute; top: 16px; bottom: 16px; left: 0;
                width: 3px; background: #f0f0f0; border-radius: 0 2px 2px 0; transition: background 0.2s;
            }
            .prf-metric-card:hover { border-color: #bbb; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
            .prf-metric-card:hover::after { background: #752122; }
            .prf-metric-label { font-size: 11px; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'IBM Plex Mono', monospace; margin-bottom: 10px; }
            .prf-metric-value { font-size: 28px; font-weight: 700; color: #111; letter-spacing: -0.5px; font-family: 'IBM Plex Sans', sans-serif; }
            .prf-metric-value.red { color: #752122; }
            .prf-metric-sub { font-size: 11px; color: #9ca3af; font-family: 'IBM Plex Mono', monospace; margin-top: 6px; }
            .prf-metric-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 8px; }
            .prf-badge-green { background: #f0fdf4; color: #166534; }
            .prf-badge-red { background: #fef2f2; color: #752122; }
            .prf-badge-gray { background: #f5f5f5; color: #666; }
            .prf-badge-blue { background: #eff6ff; color: #1e40af; }

            /* Content Grid */
            .prf-content { max-width: 1120px; margin: 24px auto 0; padding: 0 32px 80px; }
            .prf-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

            /* Cards */
            .prf-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 6px; overflow: hidden; }
            .prf-card-hd { padding: 14px 24px; border-bottom: 1px solid #f0f0f0; background: #fafafa; display: flex; justify-content: space-between; align-items: center; }
            .prf-card-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #555; font-family: 'IBM Plex Mono', monospace; margin: 0; }
            .prf-card-bd { padding: 24px; }

            /* Performance Record mini stats */
            .prf-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .prf-stat-item {}
            .prf-stat-label { font-size: 10px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px; }
            .prf-stat-val { font-size: 15px; font-weight: 600; color: #111; font-family: 'IBM Plex Sans', sans-serif; }

            /* Contract mini cards */
            .prf-contract {
                padding: 16px 20px; border-bottom: 1px solid #f0f0f0;
                cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
            }
            .prf-contract::after {
                content: ''; position: absolute; top: 12px; bottom: 12px; left: 0;
                width: 3px; background: #f0f0f0; border-radius: 0 2px 2px 0; transition: background 0.2s;
            }
            .prf-contract:hover { background: #fafafa; }
            .prf-contract:hover::after { background: #752122; }
            .prf-contract:last-child { border-bottom: none; }
            .prf-contract-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
            .prf-contract-id { font-size: 11px; color: #9ca3af; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.5px; }
            .prf-contract-title { font-size: 14px; font-weight: 600; color: #111; font-family: 'IBM Plex Sans', sans-serif; margin-bottom: 10px; line-height: 1.3; }
            .prf-contract-meta { display: flex; gap: 16px; align-items: center; }
            .prf-contract-meta-item { font-size: 11px; color: #666; font-family: 'JetBrains Mono', monospace; }
            .prf-contract-stake { font-size: 15px; font-weight: 700; color: #111; font-family: 'IBM Plex Sans', sans-serif; letter-spacing: -0.3px; }

            /* Status badges (reused from eq-badge) */
            .prf-status {
                font-size: 10px; font-weight: 600; height: 22px; display: inline-flex; align-items: center;
                padding: 0 8px; border-radius: 4px; font-family: 'IBM Plex Mono', monospace;
                letter-spacing: 0.5px; text-transform: uppercase; line-height: 1;
            }
            .prf-status.active { background: #f0fdf4; color: #166534; }
            .prf-status.locked { background: #fff7ed; color: #9a3412; }
            .prf-status.settled { background: #f5f5f5; color: #666; }
            .prf-status.forfeited { background: #fef2f2; color: #752122; }
            .prf-status.verifying { background: #eff6ff; color: #1e40af; }

            /* Provider dots */
            .prf-provider { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #4b5563; font-family: 'IBM Plex Sans', sans-serif; }
            .prf-provider-dot { width: 6px; height: 6px; border-radius: 50%; }
            .prf-provider-dot.stripe { background: #635bff; }
            .prf-provider-dot.x { background: #0a0a0a; }
            .prf-provider-dot.shopify { background: #96bf48; }
            .prf-provider-dot.amazon { background: #ff9900; }
            .prf-provider-dot.github { background: #333; }

            /* Verified Identity panel */
            .prf-identity-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
            .prf-identity-row:last-child { border-bottom: none; }
            .prf-identity-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'JetBrains Mono', monospace; font-weight: 500; }
            .prf-identity-val { font-size: 13px; color: #111; font-weight: 500; font-family: 'IBM Plex Sans', sans-serif; display: flex; align-items: center; gap: 6px; }

            /* Identity Score bars */
            .prf-score-row { margin-bottom: 16px; }
            .prf-score-row:last-child { margin-bottom: 0; }
            .prf-score-label { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'JetBrains Mono', monospace; margin-bottom: 6px; display: flex; justify-content: space-between; }
            .prf-score-bar { height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; }
            .prf-score-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease-out; }
            .prf-score-fill.green { background: #166534; }
            .prf-score-fill.red { background: #752122; }
            .prf-score-fill.blue { background: #1e40af; }

            /* CTA Button */
            .prf-cta {
                width: 100%; padding: 14px; font-size: 13px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.5px; border: none;
                font-family: 'IBM Plex Sans', sans-serif; border-radius: 6px;
                cursor: pointer; transition: all 0.2s;
                background: linear-gradient(180deg, #752122 0%, #5e1b1c 100%);
                color: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 1px solid #752122;
            }
            .prf-cta:hover { background: linear-gradient(180deg, #5e1b1c 0%, #450a0a 100%); box-shadow: 0 0 12px rgba(117,33,34,0.4); transform: translateY(-1px); }

            /* Timeline */
            .prf-timeline { position: relative; }
            .prf-timeline-line { position: absolute; left: 7px; top: 0; bottom: 0; width: 1px; background: #e5e5e5; }
            .prf-timeline-item { position: relative; padding: 16px 0 16px 28px; border-bottom: 1px solid #f5f5f5; }
            .prf-timeline-item:last-child { border-bottom: none; }
            .prf-timeline-dot { position: absolute; left: 3px; top: 20px; width: 9px; height: 9px; border-radius: 50%; background: #d4d4d4; border: 2px solid #fafafa; }
            .prf-timeline-dot.red { background: #752122; }
            .prf-timeline-dot.green { background: #166534; }
            .prf-timeline-title { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 4px; }
            .prf-timeline-desc { font-size: 12px; color: #666; margin-bottom: 8px; }
            .prf-timeline-meta { display: flex; gap: 16px; font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; }
            .prf-timeline-date { font-size: 10px; color: #9ca3af; font-family: 'JetBrains Mono', monospace; position: absolute; right: 0; top: 18px; }

            /* Empty state */
            .prf-empty { padding: 40px 20px; text-align: center; }
            .prf-empty-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 4px; }
            .prf-empty-sub { font-size: 11px; color: #9ca3af; font-family: 'IBM Plex Mono', monospace; }

            /* Responsive */
            @media (max-width: 900px) {
                .prf-metrics { grid-template-columns: repeat(2, 1fr); }
                .prf-grid { grid-template-columns: 1fr; }
                .prf-header-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
                .prf-tabs { overflow-x: auto; padding: 0 16px; }
            }
            @media (max-width: 500px) {
                .prf-metrics { grid-template-columns: 1fr; }
                .prf-stat-grid { grid-template-columns: 1fr; }
            }
        </style>

        <div class="prf">
            <!-- Header -->
            <div class="prf-header">
                <div class="prf-header-inner">
                    <div>
                        <h1 class="prf-name" id="identity-name">—</h1>
                        <div class="prf-hash">
                            <span>Identity Record</span>
                            <span style="color:#d4d4d4">·</span>
                            <span id="identity-hash">USR-00000</span>
                        </div>
                    </div>
                    <button class="prf-copy-btn" id="copy-record-btn">
                        <i data-lucide="link" style="width:14px;height:14px"></i> Copy Record Link
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="prf-tabs">
                <button class="prf-tab active" data-tab="overview">Overview</button>
                <button class="prf-tab" data-tab="contracts">Active Contracts</button>
                <button class="prf-tab" data-tab="history">Settlement History</button>
                <button class="prf-tab" data-tab="sources">Connected Sources</button>
                <button class="prf-tab" data-tab="timeline">Identity Timeline</button>
            </div>

            <!-- Performance Metrics -->
            <div class="prf-metrics">
                <div class="prf-metric-card">
                    <div class="prf-metric-label">Settlement Rate</div>
                    <div class="prf-metric-value" id="stat-settlement-rate">—</div>
                    <div class="prf-metric-sub" id="stat-settlement-detail">Loading...</div>
                </div>
                <div class="prf-metric-card">
                    <div class="prf-metric-label">Executed Contracts</div>
                    <div class="prf-metric-value" id="stat-total-contracts">—</div>
                    <div class="prf-metric-sub" id="stat-since-date">Loading...</div>
                </div>
                <div class="prf-metric-card">
                    <div class="prf-metric-label">Total Value Settled</div>
                    <div class="prf-metric-value" id="stat-tvl">—</div>
                    <div class="prf-metric-sub">Cumulative</div>
                </div>
                <div class="prf-metric-card">
                    <div class="prf-metric-label">Forfeiture Events</div>
                    <div class="prf-metric-value red" id="stat-forfeited">—</div>
                    <div class="prf-metric-sub" id="stat-forfeiture-detail">Loading...</div>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="prf-content">
                <!-- Overview Tab -->
                <div id="tab-overview" class="tab-panel">
                    <div class="prf-grid">
                        <div>
                            <!-- Performance Record -->
                            <div class="prf-card" style="margin-bottom:20px">
                                <div class="prf-card-hd"><h3 class="prf-card-title">Performance Record</h3></div>
                                <div class="prf-card-bd">
                                    <div class="prf-stat-grid">
                                        <div class="prf-stat-item">
                                            <div class="prf-stat-label">First Contract</div>
                                            <div class="prf-stat-val" id="meta-first-contract">—</div>
                                        </div>
                                        <div class="prf-stat-item">
                                            <div class="prf-stat-label">Last Settlement</div>
                                            <div class="prf-stat-val" id="meta-last-settlement">—</div>
                                        </div>
                                        <div class="prf-stat-item">
                                            <div class="prf-stat-label">Total Value Locked</div>
                                            <div class="prf-stat-val" id="meta-total-locked">—</div>
                                        </div>
                                        <div class="prf-stat-item">
                                            <div class="prf-stat-label">Active Contracts</div>
                                            <div class="prf-stat-val" id="meta-active-contracts">—</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Recent Contract Cards -->
                            <div class="prf-card">
                                <div class="prf-card-hd">
                                    <h3 class="prf-card-title">Recent Contracts</h3>
                                    <span style="font-size:10px;color:#9ca3af;font-family:'IBM Plex Mono',monospace" id="recent-count"></span>
                                </div>
                                <div id="recent-outcomes-list">
                                    <div class="prf-empty"><div class="prf-empty-sub">Loading records...</div></div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Sidebar -->
                        <div>
                            <!-- Verified Identity -->
                            <div class="prf-card" style="margin-bottom:20px">
                                <div class="prf-card-hd"><h3 class="prf-card-title">Verified Identity</h3></div>
                                <div class="prf-card-bd" style="padding:16px 24px">
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Account ID</span>
                                        <span class="prf-identity-val" id="meta-account-id">—</span>
                                    </div>
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Stripe</span>
                                        <span class="prf-identity-val" id="meta-stripe">—</span>
                                    </div>
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Funding</span>
                                        <span class="prf-identity-val" id="meta-funding-provider">Stripe Connect</span>
                                    </div>
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Currency</span>
                                        <span class="prf-identity-val" id="meta-currency">USD</span>
                                    </div>
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Status</span>
                                        <span class="prf-identity-val" id="meta-record-status"><span class="prf-status active">Active</span></span>
                                    </div>
                                    <div class="prf-identity-row">
                                        <span class="prf-identity-label">Created</span>
                                        <span class="prf-identity-val" id="meta-identity-created">—</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Identity Score -->
                            <div class="prf-card" style="margin-bottom:20px">
                                <div class="prf-card-hd"><h3 class="prf-card-title">Identity Score</h3></div>
                                <div class="prf-card-bd">
                                    <div class="prf-score-row">
                                        <div class="prf-score-label"><span>Win Rate</span><span id="score-winrate-val">—</span></div>
                                        <div class="prf-score-bar"><div class="prf-score-fill green" id="score-winrate" style="width:0%"></div></div>
                                    </div>
                                    <div class="prf-score-row">
                                        <div class="prf-score-label"><span>Contract Volume</span><span id="score-volume-val">—</span></div>
                                        <div class="prf-score-bar"><div class="prf-score-fill blue" id="score-volume" style="width:0%"></div></div>
                                    </div>
                                    <div class="prf-score-row">
                                        <div class="prf-score-label"><span>Capital Deployed</span><span id="score-capital-val">—</span></div>
                                        <div class="prf-score-bar"><div class="prf-score-fill red" id="score-capital" style="width:0%"></div></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Execute CTA -->
                            <button class="prf-cta" onclick="window.router.navigate('/contracts')">
                                Lock Capital →
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab -->
                <div id="tab-contracts" class="tab-panel hidden">
                    <div class="prf-grid">
                        <div>
                            <div class="prf-card">
                                <div class="prf-card-hd">
                                    <h3 class="prf-card-title">Active Performance Contracts</h3>
                                    <span style="font-size:10px;color:#9ca3af;font-family:'IBM Plex Mono',monospace" id="active-count">Loading...</span>
                                </div>
                                <div id="active-contracts-list">
                                    <div class="prf-empty"><div class="prf-empty-sub">Loading active contracts...</div></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="prf-card">
                                <div class="prf-card-hd"><h3 class="prf-card-title">Verified Identity</h3></div>
                                <div class="prf-card-bd" style="padding:16px 24px" id="sidebar-identity-contracts">
                                    <div class="prf-empty-sub">Loading...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settlement History Tab -->
                <div id="tab-history" class="tab-panel hidden">
                    <div class="prf-card">
                        <div class="prf-card-hd"><h3 class="prf-card-title">Settlement History</h3></div>
                        <div id="history-list">
                            <div class="prf-empty"><div class="prf-empty-sub">Loading history...</div></div>
                        </div>
                    </div>
                </div>

                <!-- Connected Sources Tab -->
                <div id="tab-sources" class="tab-panel hidden">
                    <div class="prf-card">
                        <div class="prf-card-hd"><h3 class="prf-card-title">Verification Sources</h3></div>
                        <div id="sources-list">
                            <div class="prf-empty"><div class="prf-empty-sub">Loading verification sources...</div></div>
                        </div>
                    </div>
                    <p style="font-size:10px;color:#9ca3af;font-family:'IBM Plex Mono',monospace;margin-top:12px">
                        Verification sources are bound to this identity and cannot be modified after execution.
                    </p>
                </div>

                <!-- Identity Timeline Tab -->
                <div id="tab-timeline" class="tab-panel hidden">
                    <div class="prf-grid">
                        <div>
                            <div class="prf-card">
                                <div class="prf-card-hd">
                                    <h3 class="prf-card-title">Immutable Event Record</h3>
                                    <span style="font-size:10px;color:#9ca3af;font-family:'IBM Plex Mono',monospace;text-transform:uppercase">All Events Are Final</span>
                                </div>
                                <div class="prf-card-bd" style="padding:0">
                                    <div id="timeline-list" class="prf-timeline">
                                        <div class="prf-timeline-line"></div>
                                        <div class="prf-empty"><div class="prf-empty-sub">Loading event history...</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="prf-card">
                                <div class="prf-card-hd"><h3 class="prf-card-title">Verified Identity</h3></div>
                                <div class="prf-card-bd" style="padding:16px 24px" id="sidebar-identity-timeline">
                                    <div class="prf-empty-sub">Loading...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export async function initProfile() {
    // Tab switching
    const tabs = document.querySelectorAll('.prf-tab');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); });
            tab.classList.add('active');
            panels.forEach(p => p.classList.add('hidden'));
            const target = document.getElementById('tab-' + tab.getAttribute('data-tab'));
            if (target) target.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
        });
    });

    if (window.lucide) window.lucide.createIcons();

    // Helpers
    const formatUSD = (cents) => '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatDate = (dateStr) => { if (!dateStr) return '—'; return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };

    const getStatusClass = (state) => {
        if (['FORFEITED', 'SETTLED_FAILURE'].includes(state)) return 'forfeited';
        if (['SETTLED', 'SETTLED_SUCCESS', 'PAYOUT_COMPLETE', 'COMPLETED'].includes(state)) return 'settled';
        if (['VERIFYING', 'VERIFIED'].includes(state)) return 'verifying';
        if (['FUNDS_LOCKED', 'LOCKED'].includes(state)) return 'locked';
        return 'active';
    };
    const getStatusLabel = (state) => {
        const map = { 'CREATED': 'Pending', 'FUNDS_AUTHORIZED': 'Authorized', 'FUNDS_LOCKED': 'Locked', 'LOCKED': 'Locked', 'ACTIVE': 'Active', 'EXECUTION_CONFIRMED': 'Confirmed', 'VERIFIED': 'Verified', 'VERIFYING': 'Verifying', 'SETTLED': 'Settled', 'SETTLED_SUCCESS': 'Settled', 'SETTLED_FAILURE': 'Failed', 'FORFEITED': 'Forfeited', 'PAYOUT_COMPLETE': 'Settled', 'COMPLETED': 'Completed' };
        return map[state] || state;
    };
    const getProviderClass = (p) => { if (!p) return ''; const l = p.toLowerCase(); if (l.includes('stripe')) return 'stripe'; if (l.includes('x') || l.includes('twitter')) return 'x'; if (l.includes('shopify')) return 'shopify'; if (l.includes('amazon')) return 'amazon'; if (l.includes('github')) return 'github'; return ''; };

    // Copy record link
    const copyBtn = document.getElementById('copy-record-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                copyBtn.innerHTML = '<i data-lucide="check" style="width:14px;height:14px"></i> Copied!';
                if (window.lucide) window.lucide.createIcons();
                setTimeout(() => { copyBtn.innerHTML = '<i data-lucide="link" style="width:14px;height:14px"></i> Copy Record Link'; if (window.lucide) window.lucide.createIcons(); }, 2000);
            });
        });
    }

    try {
        const [profile, contractsResponse] = await Promise.all([
            window.api.getProfile(),
            window.api.getContracts()
        ]);
        if (profile.error) { console.error('[Profile] Failed:', profile.error); return; }

        const contracts = contractsResponse?.contracts || [];
        const activeContracts = contracts.filter(c => !c.isTerminal);
        const settledContracts = contracts.filter(c => c.isTerminal);

        // --- HEADER ---
        const nameEl = document.getElementById('identity-name');
        if (nameEl) {
            nameEl.textContent = profile.identity?.displayName?.toLowerCase().replace(/\s+/g, '') || profile.identity?.username?.toLowerCase() || 'unclaimed';
        }
        const hashEl = document.getElementById('identity-hash');
        if (hashEl && profile.user?.id) hashEl.textContent = `USR-${profile.user.id.substring(0, 8).toUpperCase()}`;

        // --- METRIC CARDS ---
        const rateEl = document.getElementById('stat-settlement-rate');
        if (rateEl) {
            const total = settledContracts.length;
            const wins = settledContracts.filter(c => c.derivedState === 'SETTLED').length;
            const localRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '—';
            rateEl.textContent = profile.stats.settlementRate !== null ? profile.stats.settlementRate + '%' : (localRate === '—' ? '—' : localRate + '%');
        }
        const rateDetailEl = document.getElementById('stat-settlement-detail');
        if (rateDetailEl) rateDetailEl.textContent = `${settledContracts.length} of ${contracts.length} contracts settled`;

        const totalEl = document.getElementById('stat-total-contracts');
        if (totalEl) totalEl.textContent = contracts.length.toString();
        const sinceEl = document.getElementById('stat-since-date');
        if (sinceEl && contracts.length > 0) {
            const earliest = contracts.reduce((min, c) => c.createdAt < min ? c.createdAt : min, contracts[0].createdAt);
            sinceEl.textContent = `Since ${formatDate(earliest)}`;
        }

        const tvlEl = document.getElementById('stat-tvl');
        if (tvlEl) {
            const tvl = profile.stats.tvlSettledUsd || 0;
            tvlEl.textContent = tvl >= 1000000 ? '$' + (tvl / 1000000).toFixed(1) + 'M' : tvl >= 1000 ? '$' + (tvl / 1000).toFixed(0) + 'K' : '$' + tvl.toLocaleString();
        }
        const forfEl = document.getElementById('stat-forfeited');
        if (forfEl) {
            const f = profile.stats.forfeitedValueUsd || 0;
            forfEl.textContent = f >= 1000000 ? '$' + (f / 1000000).toFixed(1) + 'M' : f >= 1000 ? '$' + (f / 1000).toFixed(0) + 'K' : '$' + f.toLocaleString();
        }
        const forfDetailEl = document.getElementById('stat-forfeiture-detail');
        if (forfDetailEl) forfDetailEl.textContent = `${profile.stats.forfeitedContracts || 0} forfeiture events`;

        // --- PERFORMANCE RECORD ---
        const firstEl = document.getElementById('meta-first-contract');
        if (firstEl && contracts.length > 0) {
            const earliest = contracts.reduce((min, c) => c.createdAt < min ? c.createdAt : min, contracts[0].createdAt);
            firstEl.textContent = formatDate(earliest);
        }
        const lastEl = document.getElementById('meta-last-settlement');
        if (lastEl) lastEl.textContent = settledContracts.length > 0 ? formatDate(settledContracts[0].createdAt) : '—';
        const lockedEl = document.getElementById('meta-total-locked');
        if (lockedEl) lockedEl.textContent = formatUSD(contracts.reduce((s, c) => s + (c.lockAmountUsdCents || 0), 0)) + ' USD';
        const activeCountMeta = document.getElementById('meta-active-contracts');
        if (activeCountMeta) activeCountMeta.textContent = `${activeContracts.length} Outstanding`;

        // --- VERIFIED IDENTITY (overview sidebar) ---
        const accIdEl = document.getElementById('meta-account-id');
        if (accIdEl && profile.user?.id) accIdEl.innerHTML = `USR-${profile.user.id.substring(0, 5)} <i data-lucide="copy" style="width:12px;height:12px;color:#9ca3af;cursor:pointer"></i>`;
        const stripeEl = document.getElementById('meta-stripe');
        if (stripeEl) stripeEl.innerHTML = profile.stripeConnection?.connected ? '<span class="prf-status active">Connected</span>' : '<span class="prf-status" style="background:#f5f5f5;color:#666">Not connected</span>';
        const createdEl = document.getElementById('meta-identity-created');
        if (createdEl && profile.user?.createdAt) createdEl.textContent = formatDate(profile.user.createdAt);

        // --- IDENTITY SCORE ---
        const winRate = settledContracts.length > 0 ? (settledContracts.filter(c => c.derivedState === 'SETTLED').length / settledContracts.length * 100) : 0;
        const volScore = Math.min(contracts.length / 20 * 100, 100);
        const totalCents = contracts.reduce((s, c) => s + (c.lockAmountUsdCents || 0), 0);
        const capScore = Math.min(totalCents / 50000_00 * 100, 100); // 50k USD = 100%

        const setBar = (id, valId, pct, label) => {
            const bar = document.getElementById(id);
            const val = document.getElementById(valId);
            if (bar) setTimeout(() => { bar.style.width = pct + '%'; }, 100);
            if (val) val.textContent = label;
        };
        setBar('score-winrate', 'score-winrate-val', winRate, winRate.toFixed(0) + '%');
        setBar('score-volume', 'score-volume-val', volScore, contracts.length + ' contracts');
        setBar('score-capital', 'score-capital-val', capScore, formatUSD(totalCents));

        // --- RECENT CONTRACTS (mini cards) ---
        const recentList = document.getElementById('recent-outcomes-list');
        const recentCount = document.getElementById('recent-count');
        if (recentCount) recentCount.textContent = `${Math.min(contracts.length, 5)} of ${contracts.length}`;
        if (recentList) {
            if (contracts.length === 0) {
                recentList.innerHTML = '<div class="prf-empty"><div class="prf-empty-title">No Contracts Yet</div><div class="prf-empty-sub">Execute a contract to build your record.</div></div>';
            } else {
                recentList.innerHTML = '';
                contracts.slice(0, 5).forEach(c => {
                    const cls = getStatusClass(c.derivedState || c.state);
                    const label = getStatusLabel(c.derivedState || c.state);
                    const pCls = getProviderClass(c.platform);
                    recentList.innerHTML += `
                        <div class="prf-contract" onclick="window.router.navigate('/contracts/${c.id}')">
                            <div class="prf-contract-top">
                                <span class="prf-contract-id">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                <span class="prf-status ${cls}">${label}</span>
                            </div>
                            <div class="prf-contract-title">${c.description || c.title || 'Performance Contract'}</div>
                            <div class="prf-contract-meta">
                                ${pCls ? `<span class="prf-provider"><span class="prf-provider-dot ${pCls}"></span>${c.platform}</span>` : ''}
                                <span class="prf-contract-meta-item">${formatDate(c.createdAt)}</span>
                                <span class="prf-contract-stake">${formatUSD(c.lockAmountUsdCents)}</span>
                            </div>
                        </div>`;
                });
            }
        }

        // --- ACTIVE CONTRACTS TAB ---
        const activeList = document.getElementById('active-contracts-list');
        const activeCountLabel = document.getElementById('active-count');
        if (activeCountLabel) activeCountLabel.textContent = `${activeContracts.length} Outstanding`;
        if (activeList) {
            if (activeContracts.length === 0) {
                activeList.innerHTML = '<div class="prf-empty"><div class="prf-empty-title">No Active Contracts</div><div class="prf-empty-sub">All contracts are settled or pending.</div></div>';
            } else {
                activeList.innerHTML = '';
                activeContracts.forEach(c => {
                    const cls = getStatusClass(c.derivedState || c.state);
                    const label = getStatusLabel(c.derivedState || c.state);
                    const pCls = getProviderClass(c.platform);
                    activeList.innerHTML += `
                        <div class="prf-contract" onclick="window.router.navigate('/contracts/${c.id}')">
                            <div class="prf-contract-top">
                                <span class="prf-contract-id">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                <span class="prf-status ${cls}">${label}</span>
                            </div>
                            <div class="prf-contract-title">${c.description || c.title || 'Performance Contract'}</div>
                            <div class="prf-contract-meta">
                                ${pCls ? `<span class="prf-provider"><span class="prf-provider-dot ${pCls}"></span>${c.platform}</span>` : ''}
                                <span class="prf-contract-meta-item">${formatDate(c.createdAt)}</span>
                                <span class="prf-contract-stake">${formatUSD(c.lockAmountUsdCents)}</span>
                            </div>
                        </div>`;
                });
            }
        }

        // --- SETTLEMENT HISTORY TAB ---
        const historyList = document.getElementById('history-list');
        if (historyList) {
            if (settledContracts.length === 0) {
                historyList.innerHTML = '<div class="prf-empty"><div class="prf-empty-title">No Settlement History</div><div class="prf-empty-sub">Completed contracts and their outcomes will appear here.</div></div>';
            } else {
                historyList.innerHTML = '';
                settledContracts.forEach(c => {
                    const cls = getStatusClass(c.derivedState || c.state);
                    const label = getStatusLabel(c.derivedState || c.state);
                    historyList.innerHTML += `
                        <div class="prf-contract" onclick="window.router.navigate('/contracts/${c.id}')">
                            <div class="prf-contract-top">
                                <span class="prf-contract-id">CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                <span class="prf-status ${cls}">${label}</span>
                            </div>
                            <div class="prf-contract-meta" style="margin-top:4px">
                                <span class="prf-contract-meta-item">${c.metricType || ''}</span>
                                <span class="prf-contract-meta-item">${formatDate(c.deadlineUtc)}</span>
                                <span class="prf-contract-stake">${formatUSD(c.lockAmountUsdCents)}</span>
                            </div>
                        </div>`;
                });
            }
        }

        // --- SIDEBAR IDENTITY (contracts + timeline tabs) ---
        const renderSidebarIdentity = (containerId) => {
            const el = document.getElementById(containerId);
            if (!el) return;
            el.innerHTML = `
                <div class="prf-identity-row"><span class="prf-identity-label">Account ID</span><span class="prf-identity-val">USR-${(profile.user?.id || '').substring(0, 5)}</span></div>
                <div class="prf-identity-row"><span class="prf-identity-label">Stripe</span><span class="prf-identity-val">${profile.stripeConnection?.connected ? '<span class="prf-status active">Connected</span>' : '<span style="color:#9ca3af">Not connected</span>'}</span></div>
                <div class="prf-identity-row"><span class="prf-identity-label">Funding</span><span class="prf-identity-val">Stripe Connect</span></div>
                <div class="prf-identity-row"><span class="prf-identity-label">Currency</span><span class="prf-identity-val">USD</span></div>
                <div class="prf-identity-row"><span class="prf-identity-label">Status</span><span class="prf-identity-val"><span class="prf-status active">Active</span></span></div>
                <div class="prf-identity-row"><span class="prf-identity-label">Created</span><span class="prf-identity-val">${formatDate(profile.user?.createdAt)}</span></div>`;
        };
        renderSidebarIdentity('sidebar-identity-contracts');
        renderSidebarIdentity('sidebar-identity-timeline');

        // --- TIMELINE TAB ---
        const timelineList = document.getElementById('timeline-list');
        if (timelineList) {
            timelineList.innerHTML = '<div class="prf-timeline-line"></div>';
            if (contracts.length === 0) {
                timelineList.innerHTML += '<div class="prf-empty"><div class="prf-empty-sub">No events recorded.</div></div>';
            } else {
                contracts.forEach(c => {
                    const isForfeited = c.derivedState === 'FORFEITED';
                    const isSettled = c.isTerminal;
                    const dotCls = isForfeited ? 'red' : (isSettled ? 'green' : '');
                    const titleText = isForfeited ? 'Capital Forfeited' : (isSettled ? 'Contract Settled' : 'Contract Created');
                    timelineList.innerHTML += `
                        <div class="prf-timeline-item">
                            <div class="prf-timeline-dot ${dotCls}"></div>
                            <div class="prf-timeline-title" ${isForfeited ? 'style="color:#752122"' : ''}>${titleText}</div>
                            <div class="prf-timeline-desc">${c.description || 'Performance contract execution'}</div>
                            <div class="prf-timeline-meta">
                                <span>VALUE: <strong ${isForfeited ? 'style="color:#752122"' : ''}>${formatUSD(c.lockAmountUsdCents)}</strong></span>
                                <span>REF: CTR-${c.id.substring(0, 5).toUpperCase()}</span>
                                <span>STATE: <strong class="prf-status ${getStatusClass(c.derivedState)}" style="font-size:9px;height:18px;padding:0 6px">${c.derivedState}</strong></span>
                            </div>
                            <span class="prf-timeline-date">${formatDate(c.createdAt)}</span>
                        </div>`;
                });
            }
        }

        // --- CONNECTED SOURCES TAB ---
        const sourcesList = document.getElementById('sources-list');
        if (sourcesList) {
            sourcesList.innerHTML = '';
            const sources = [
                { name: 'X / Twitter', connected: profile.xConnection?.connected, detail: profile.xConnection?.connected ? '@' + profile.xConnection.xUsername : 'Not connected', icon: 'X', bg: '#0a0a0a' },
                { name: 'Stripe', connected: profile.stripeConnection?.connected, detail: profile.stripeConnection?.connected ? 'Connected' : 'Not setup', icon: 'S', bg: '#635bff' },
                { name: 'GitHub', connected: profile.githubConnection?.connected, detail: profile.githubConnection?.connected ? profile.githubConnection.username : 'Not connected', icon: null, bg: '#333', lucide: 'github' }
            ];
            sources.forEach(s => {
                const opacity = s.connected ? '' : 'opacity:0.5;background:#fafafa;';
                sourcesList.innerHTML += `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #f0f0f0;${opacity}">
                        <div style="display:flex;align-items:center;gap:12px">
                            <div style="width:36px;height:36px;background:${s.bg};border-radius:6px;display:flex;align-items:center;justify-content:center">
                                ${s.lucide ? `<i data-lucide="${s.lucide}" style="width:18px;height:18px;color:white"></i>` : `<span style="color:white;font-weight:700;font-size:14px">${s.icon}</span>`}
                            </div>
                            <div>
                                <div style="font-size:13px;font-weight:600;color:#111">${s.name}</div>
                                <div style="font-size:11px;color:#9ca3af;font-family:'IBM Plex Mono',monospace">${s.detail}</div>
                            </div>
                        </div>
                        <span class="prf-status ${s.connected ? 'active' : ''}" style="${s.connected ? '' : 'background:#f5f5f5;color:#9ca3af'}">${s.connected ? 'Verified' : 'Unverified'}</span>
                    </div>`;
            });
        }

        if (window.lucide) window.lucide.createIcons();

    } catch (err) {
        console.error('[Profile] Error loading profile:', err);
    }
}
